from datetime import timedelta
import json

import jwt
from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, create_refresh_token
from mongoengine import NotUniqueError, Q
from werkzeug.security import check_password_hash, generate_password_hash
from deepface import DeepFace
from numpy import linalg
from routes.patient import encrypt_file
from services.sui_blockchain import store_to_walrus
from helpers.managers.access_control import HospitalAccessControl
from helpers.managers.ehr_manager import EHRManager
from helpers.utils.commons import confirm_hospital_HPRID
from models.hospital import Hospital
from helpers.utils.otp_utils import send_otp
from helpers.utils.commons import clean_phone_number
from models.patient import Patient

from cryptography.fernet import Fernet
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes, serialization
from services.sui_blockchain import create_sui_wallet, get_sui_private_key, get_sui_public_key

hospital = Blueprint('hospital', __name__)


def get_hospital_by_email(email):
    return Hospital.objects(email=email).first()


def verify_hospital_password(email, password):
    hospital_inst = get_hospital_by_email(email)
    if hospital_inst and check_password_hash(hospital_inst.password, password):
        return hospital_inst
    return None


@hospital.route("/register", methods=["POST"])
def register_hospital():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    phone_number = data.get("phone_number")
    password = data.get("password")
    HPRID = data.get("HPRID")

    if not all([name, email, password, HPRID]):
        return jsonify({"error": "All fields are required."}), 400

    if Hospital.objects(Q(email=email)).first():
        return jsonify({"error": "Email already registered."}), 400

    if Hospital.objects(Q(phone_number=phone_number)).first():
        return jsonify({"error": "Phone number already registered."}), 400

    try:
        if not confirm_hospital_HPRID(HPRID):
            return jsonify({"error": "Invalid HPRID. Please provide a valid HPRID."}), 400

        # Generate Sui wallet
        wallet_address, encrypted_mnemonic = create_sui_wallet()
        print(f"Created wallet with address: {wallet_address}")

        cleaned_phone_number = clean_phone_number(phone_number)
        if not cleaned_phone_number:
            return jsonify({"error": "Something went wrong when saving your phone number please check it again."}), 400
        hospital = Hospital(
            wallet_id=wallet_address,
            med_vault_id=f"MV-H{cleaned_phone_number}",
            name=name,
            email=email,
            phone_number=phone_number,
            password=generate_password_hash(password),
            HPRID=HPRID,
            activated=True,
            encrypted_mnemonic=encrypted_mnemonic
        )
        hospital.save()
        access_token = create_access_token(identity=hospital.email)
        refresh_token = create_refresh_token(identity=hospital.email)

        return jsonify({
            "status": "success",
            "message": "Hospital registered successfully and activated.",
            "hospital_name": name,
            "email": email,
            "HPRID": HPRID,
            "access_token": access_token,
            "refresh_token": refresh_token,
            "wallet_id": hospital.wallet_id
        }), 201
    except (jwt.ExpiredSignatureError, NotUniqueError, jwt.InvalidTokenError):
        return jsonify({"error": "Hospital with this email or HPRID already exists."}), 409


@hospital.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    hospital_inst = verify_hospital_password(email, password)

    if not hospital_inst:
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=hospital_inst.email, expires_delta=timedelta(days=1))
    refresh_token = create_refresh_token(identity=hospital_inst.email)

    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token
    }), 200


@hospital.route("/request-access", methods=["POST"])
@jwt_required()
def request_access():
    try:
        current_hospital = get_jwt_identity()
        hospital = Hospital.objects(email=current_hospital).first()
        if not hospital:
            return jsonify({"error": "Hospital not found"}), 404

        data = request.json
        patient_email = data.get("patient_email")
        patient = Patient.objects(email=patient_email).first()
        if not patient:
            return jsonify({"error": "Patient not found"}), 404

        selected_tables = data.get("selected_tables", [])
        access_control = HospitalAccessControl()
        token = access_control.generate_token(hospital.name, selected_tables, patient.med_vault_id)
        send_otp(patient.phone_number, hospital, token)  # Sends token as OTP
        return jsonify({
            "message": f"Access token sent to {patient.name}"
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# def decrypt_file(encrypted_data, encrypted_key, sui_private_key_pem):
#     private_key = serialization.load_pem_private_key(sui_private_key_pem, password=None)
#     aes_key = private_key.decrypt(
#         encrypted_key,
#         padding.OAEP(
#             mgf=padding.MGF1(algorithm=hashes.SHA256()),
#             algorithm=hashes.SHA256(),
#             label=None
#         )
#     )
#     fernet = Fernet(aes_key)
#     return fernet.decrypt(encrypted_data).decode()


def decrypt_file(encrypted_data, encrypted_key, sui_private_key_bytes):
    # Mock decryption (since encrypted_key is aes_key for testing)
    fernet = Fernet(encrypted_key)
    return fernet.decrypt(encrypted_data).decode()


@hospital.route("/access-ehr", methods=["POST"])
@jwt_required()
def access_ehr():
    try:
        current_hospital = get_jwt_identity()
        hospital = Hospital.objects(email=current_hospital).first()
        if not hospital:
            return jsonify({"error": "Hospital not found"}), 404

        data = request.json
        token = data.get("token")
        access_control = HospitalAccessControl()
        token_data = access_control.verify_token(token)
        if not token_data:
            return jsonify({"error": "Invalid or expired token"}), 401

        med_vault_id = token_data["med_vault_id"]
        patient = Patient.objects(med_vault_id=med_vault_id).first()
        if not patient:
            return jsonify({"error": "Patient not found"}), 404

        # Decrypt EHR
        sui_private_key_pem = get_sui_private_key(patient.wallet_id)  # Implement: fetch securely
        ehr_json = decrypt_file(patient.encrypted_ehr_file, patient.encrypted_key, sui_private_key_pem)
        ehr_data = json.loads(ehr_json)

        # Filter by selected tables
        selected_tables = token_data["selected_tables"]
        filtered_ehr = {k: ehr_data[k] for k in selected_tables if k in ehr_data}

        # Invalidate token
        access_control.invalidate_token(token)
        return jsonify({"ehr": filtered_ehr}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@hospital.route("/propose-ehr-update", methods=["POST"])
@jwt_required()
def propose_ehr_update():
    access_control = HospitalAccessControl()
    try:
        current_hospital = get_jwt_identity()
        hospital = Hospital.objects(email=current_hospital).first()
        if not hospital:
            return jsonify({"error": "Hospital not found"}), 404

        data = request.json
        patient_email = data.get("patient_email")
        updates = data.get("updates", {})
        patient = Patient.objects(email=patient_email).first()
        if not patient:
            return jsonify({"error": "Patient not found"}), 404

        access_control = HospitalAccessControl()
        token = access_control.generate_token(hospital.name, [], patient.med_vault_id)
        access_control.redis.setex(
            f"update_token:{token}",
            timedelta(minutes=10),
            json.dumps({"updates": updates})
        )
        send_otp(patient.phone_number, hospital, token)
        return jsonify({
            "message": f"Update confirmation token sent to {patient.name}"
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@hospital.route("/confirm-ehr-update", methods=["POST"])
@jwt_required()
def confirm_ehr_update():
    access_control = HospitalAccessControl()
    try:
        current_hospital = get_jwt_identity()
        hospital = Hospital.objects(email=current_hospital).first()
        if not hospital:
            return jsonify({"error": "Hospital not found"}), 404

        data = request.json
        token = data.get("token")
        access_control = HospitalAccessControl()
        token_data = access_control.verify_token(token)
        if not token_data:
            return jsonify({"error": "Invalid or expired token"}), 401

        med_vault_id = token_data["med_vault_id"]
        # updates = json.loads(access_control.redis.get(f"update_token:{token}"))["updates"]
        token_data = access_control.redis.get(f"update_token:{token}")
        if not token_data:
            return jsonify({"error": "Invalid or expired token"}), 400
        updates = json.loads(token_data)["updates"]
        patient = Patient.objects(med_vault_id=med_vault_id).first()
        if not patient:
            return jsonify({"error": "Patient not found"}), 404

        # Decrypt existing EHR
        sui_private_key_pem = get_sui_private_key(patient.wallet_id)
        ehr_json = decrypt_file(patient.encrypted_ehr_file, patient.encrypted_key, sui_private_key_pem)
        ehr_data = json.loads(ehr_json)

        # Append updates with validation
        for key, value in updates.items():
            if key in ehr_data and isinstance(ehr_data[key], list):
                # Validate new entries
                valid_entries = [
                    entry for entry in value
                    if isinstance(entry, dict) and "date" in entry and "medication" in entry
                ]
                # Deduplicate (optional)
                existing = {(e["date"], e["medication"]) for e in ehr_data[key]}
                new_entries = [
                    entry for entry in valid_entries
                    if (entry["date"], entry["medication"]) not in existing
                ]
                ehr_data[key].extend(new_entries)
            else:
                ehr_data[key] = value

        # Re-encrypt and store
        json_data = json.dumps(ehr_data, indent=2).encode()
        sui_public_key_pem = get_sui_public_key(patient.wallet_id)
        encrypted_json, encrypted_key = encrypt_file(json_data, sui_public_key_pem)
        blob_id = store_to_walrus(encrypted_json, patient.wallet_id)

        # Update patient record
        patient.update(
            encrypted_ehr_file=encrypted_json,
            encrypted_key=encrypted_key,
            walrus_blob_id=blob_id
        )

        # Invalidate tokens
        access_control.invalidate_token(token)
        access_control.redis.delete(f"update_token:{token}")
        return jsonify({
            "message": f"EHR updated and stored as {patient.med_vault_id}.json"
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@hospital.route("/find-patient", methods=["POST"])
@jwt_required()
def find_patient():
    try:
        current_hospital = get_jwt_identity()
        hospital = Hospital.objects(email=current_hospital).first()
        if not hospital:
            return jsonify({"error": "Hospital not found"}), 404

        data = request.json
        name = data.get("name")
        phone_number = data.get("phone_number")

        query = Q()
        if name:
            query |= Q(name__iexact=name)
        if phone_number:
            query |= Q(phone_number=clean_phone_number(phone_number))

        patient = Patient.objects(query).first()
        if not patient:
            return jsonify({"error": "Patient not found"}), 404

        return jsonify({
            "wallet_id": patient.wallet_id,
            "name": patient.name,
            "email": patient.email,
            "phone_number": patient.phone_number
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@hospital.route("/find-patient-by-face", methods=["POST"])
@jwt_required()
def find_patient_by_face():
    try:
        current_hospital = get_jwt_identity()
        hospital = Hospital.objects(email=current_hospital).first()
        if not hospital:
            return jsonify({"error": "Hospital not found"}), 404

        if "image" not in request.files:
            return jsonify({"error": "No image provided"}), 400
        image = request.files["image"]
        try:
            embedding = DeepFace.represent(image, model_name="Facenet")[0]["embedding"]
        except Exception as e:
            return jsonify({"error": f"Failed to process image: {str(e)}"}), 400

        patients = Patient.objects(facial_embedding__exists=True)
        threshold = 10.0
        for patient in patients:
            distance = linalg.norm([patient.facial_embedding[i] - embedding[i] for i in range(len(embedding))])
            if distance < threshold:
                return jsonify({
                    "wallet_id": patient.wallet_id,
                    "name": patient.name,
                    "email": patient.email,
                    "phone_number": patient.phone_number
                }), 200
        return jsonify({"error": "No match found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@hospital.route("/find-patient-by-fingerprint", methods=["POST"])
@jwt_required()
def find_patient_by_fingerprint():
    
    try:
        current_hospital = get_jwt_identity()
        hospital = Hospital.objects(email=current_hospital).first()
        if not hospital:
            return jsonify({"error": "Hospital not found"}), 404

        data = request.json
        fingerprint_data = data.get("fingerprint")
        # Placeholder: Implement SDK-specific matching
        patient = Patient.objects(fingerprint_template=hash_fingerprint(fingerprint_data)).first()
        if patient:
            return jsonify({
                "wallet_id": patient.wallet_id,
                "name": patient.name,
                "email": patient.email,
                "phone_number": patient.phone_number
            }), 200
        return jsonify({"error": "No match found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@hospital.route("/get-patient-info/<string:wallet_id>", methods=["GET"])
@jwt_required()
def get_patient_info(wallet_id):
    try:
        patient = Patient.objects(wallet_id=wallet_id).first()
        if not patient:
            return jsonify({"error": "Patient not found"}), 404

        next_of_kin = NextOfKin.objects(patient=patient).first()
        response = {
            "name": patient.name,
            "email": patient.email,
            "phone_number": patient.phone_number,
            "next_of_kin": {
                "name": next_of_kin.name,
                "email": next_of_kin.email,
                "phone_number": next_of_kin.phone_number,
                "relationship": next_of_kin.relationship
            } if next_of_kin else None
        }
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@hospital.route("/request-next-of-kin-access", methods=["POST"])
@jwt_required()
def request_next_of_kin_access():
    try:
        current_hospital = get_jwt_identity()
        hospital = Hospital.objects(email=current_hospital).first()
        data = request.json
        wallet_id = data.get("wallet_id")
        patient = Patient.objects(wallet_id=wallet_id).first()
        if not patient:
            return jsonify({"error": "Patient not found"}), 404

        next_of_kin = NextOfKin.objects(patient=patient).first()
        if not next_of_kin:
            return jsonify({"error": "No next of kin registered"}), 404

        selected_tables = data.get("selected_tables", [])
        access_control = HospitalAccessControl()
        token = access_control.generate_token(hospital.name, selected_tables, patient.med_vault_id)
        send_otp(next_of_kin.phone_number, hospital, token)
        return jsonify({
            "message": f"Authorization OTP sent to {next_of_kin.name}"
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

