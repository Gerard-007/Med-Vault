from datetime import timedelta
import json

from cryptography.fernet import Fernet
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes, serialization

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, create_refresh_token
from mongoengine import Q
from werkzeug.security import check_password_hash, generate_password_hash

from helpers.utils.commons import generate_med_vault_id
from models.patient import Patient, NextOfKin
from helpers.utils.commons import clean_phone_number
from services.sui_blockchain import create_sui_wallet, get_sui_public_key, store_to_walrus
# from services.sui_blockchain import create_sui_wallet
from deepface import DeepFace


patient = Blueprint('patient', __name__)


def get_patient_by_email(email):
    return Patient.objects(email=email).first()


def verify_patient_password(email, password):
    patient = get_patient_by_email(email)
    if patient and check_password_hash(patient.password, password):
        return patient
    return None


@patient.route("/register", methods=["POST"])
def register_patient_view():
    try:
        data = request.json
        name = data["name"]
        email = data["email"]
        phone_number = data["phone_number"]
        password = data["password"]
        if not all([name, email, password, phone_number]):
            return jsonify({"error": "All fields are required."}), 400

        if Patient.objects(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400

        if Patient.objects(Q(phone_number=phone_number)).first():
            return jsonify({"error": "Phone number already registered."}), 400

        # Generate Sui wallet
        wallet_address, encrypted_mnemonic = create_sui_wallet()
        print(f"Created wallet with address: {wallet_address}")

        cleaned_phone_number = clean_phone_number(phone_number)
        patient = Patient(
            wallet_id=wallet_address,
            med_vault_id=f"MV-P{cleaned_phone_number}",
            name=name,
            email=email,
            password=generate_password_hash(password),
            phone_number=phone_number,
            encrypted_mnemonic=encrypted_mnemonic
        ).save()

        access_token = create_access_token(identity=patient.email)
        refresh_token = create_refresh_token(identity=patient.email)

        return jsonify({
            "message": f"Patient {patient.name} registered successfully",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "wallet_id": patient.wallet_id
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@patient.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    patient = verify_patient_password(email, password)

    if not patient:
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=patient.email, expires_delta=timedelta(days=1))
    refresh_token = create_refresh_token(identity=patient.email)

    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token
    }), 200


@patient.route("/profile", methods=["POST"])
@jwt_required()
def profile():
    current_patient = get_jwt_identity()
    patient = Patient.objects(email=current_patient).first()
    if not patient:
        return jsonify({"error": "Patient not found"}), 404
    data = request.json
    transaction_pin = data["transaction_pin"] or ""
    dob = data["dob"] or ""
    gender = data["gender"] or ""
    address = data["address"] or ""
    patient.update(transaction_pin=transaction_pin, DOB=dob, gender=gender, address=address)
    return jsonify({
        "status": "success",
        "message": "Profile updated successfully",
    }), 200


@patient.route("/add-next-of-kin", methods=["POST"])
@jwt_required()
def add_next_of_kin():
    current_patient = get_jwt_identity()
    patient = Patient.objects(email=current_patient).first()
    if not patient:
        return jsonify({"error": "Patient not found"}), 404
    try:
        data = request.json
        if NextOfKin.objects(email=data['email']).first():
            return jsonify({'error': 'Next of kin already added.'}), 400
        name = data["name"]
        email = data["email"]
        phone_number = data["phone_number"]
        relationship = data["relationship"]
        nok = NextOfKin(
            name=name,
            email=email,
            phone_number=phone_number,
            relationship=relationship,
            patient=patient,
        ).save()
        return jsonify({
            "status": "success",
            "message": f"Next of kin {nok.name} successfully added for {nok.patient.name}"
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# def encrypt_file(data, sui_public_key_pem):
#     aes_key = Fernet.generate_key()
#     fernet = Fernet(aes_key)
#     encrypted_data = fernet.encrypt(data)
#     public_key = serialization.load_pem_public_key(sui_public_key_pem)
#     encrypted_key = public_key.encrypt(
#         aes_key,
#         padding.OAEP(
#             mgf=padding.MGF1(algorithm=hashes.SHA256()),
#             algorithm=hashes.SHA256(),
#             label=None
#         )
#     )
#     return encrypted_data, encrypted_key


def encrypt_file(data, sui_public_key_bytes):
    aes_key = Fernet.generate_key()
    fernet = Fernet(aes_key)
    encrypted_data = fernet.encrypt(data)
    # Mock public key encryption (Sui uses ED25519, which doesn't support encryption directly)
    # For testing, store aes_key as-is or use a different encryption scheme
    encrypted_key = aes_key  # Replace with real encryption in production
    return encrypted_data, encrypted_key


@patient.route("/store-ehr", methods=["POST"])
@jwt_required()
def store_ehr():
    try:
        current_patient = get_jwt_identity()
        patient = Patient.objects(email=current_patient).first()
        mnemonic = decrypt_mnemonic(patient.encrypted_mnemonic)  # Custom decryption function
        public_key_bytes = get_sui_public_key(mnemonic)
        # Use public_key_bytes for encryption (e.g., with cryptography library)
        if not patient:
            return jsonify({"error": "Patient not found"}), 404

        data = request.json
        ehr_data = {
            "Demographics": {
                "name": patient.name,
                "email": patient.email,
                "phone": patient.phone_number,
                "DOB": str(patient.DOB) if patient.DOB else None,
                "gender": patient.gender,
                "address": patient.address
            },
            "MedicalReport": data.get("MedicalReport", []),
            "Diagnosis": data.get("Diagnosis", []),
            "Allergies": data.get("Allergies", []),
            "MedicalHistory": data.get("MedicalHistory", []),
            "MedicationHistory": data.get("MedicationHistory", []),
            "CoreVitalSigns": data.get("CoreVitalSigns", []),
            "HealthIssues": data.get("HealthIssues", []),
            "ImmunizationRecords": data.get("ImmunizationRecords", []),
            "LaboratoryTestResults": data.get("LaboratoryTestResults", []),
            "RadiologyReports": data.get("RadiologyReports", [])
        }

        # Create JSON file
        json_data = json.dumps(ehr_data, indent=2).encode()
        filename = f"{patient.med_vault_id}.json"

        # Encrypt JSON
        sui_public_key_pem = get_sui_public_key(patient.wallet_id)  # Implement: fetch from wallet
        encrypted_json, encrypted_key = encrypt_file(json_data, sui_public_key_pem)

        # Store to Walrus
        blob_id = store_to_walrus(encrypted_json, patient.wallet_id)

        # Update patient record
        patient.update(
            encrypted_ehr_file=encrypted_json,
            encrypted_key=encrypted_key,
            walrus_blob_id=blob_id
        )
        return jsonify({
            "message": f"EHR stored as {filename} on Walrus",
            "blob_id": blob_id
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@patient.route("/store-facial-embedding", methods=["POST"])
@jwt_required()
def store_facial_embedding():
    try:
        current_patient = get_jwt_identity()
        patient = Patient.objects(email=current_patient).first()
        if not patient:
            return jsonify({"error": "Patient not found"}), 404

        if "image" not in request.files:
            return jsonify({"error": "No image provided"}), 400
        image = request.files["image"]
        try:
            embedding = DeepFace.represent(image, model_name="Facenet")[0]["embedding"]
        except Exception as e:
            return jsonify({"error": f"Failed to process image: {str(e)}"}), 400

        patient.update(facial_embedding=embedding)
        return jsonify({"message": "Facial embedding stored successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500