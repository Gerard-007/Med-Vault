from datetime import timedelta

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, create_refresh_token
from werkzeug.security import check_password_hash, generate_password_hash

from helpers.utils.commons import generate_med_vault_id
from models.patient import Patient, NextOfKin
from services.sui_blockchain import register_patient

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
        result = register_patient(name, email, phone_number)
        wallet_id = result["effects"]["created"][0]["reference"]["objectId"]
        patient = Patient(
            wallet_id=wallet_id,
            med_vault_id=generate_med_vault_id(),
            name=name,
            email=email,
            password=generate_password_hash(password),
            phone_number=phone_number,
        ).save()

        access_token = create_access_token(identity=patient.email)
        refresh_token = create_refresh_token(identity=patient.email)

        return jsonify({
            "message": f"Patient {patient.name} registered successfully",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "wallet_id": wallet_id
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@patient.route("/add-next-of-kin", methods=["POST"])
def add_next_of_kin():
    try:
        data = request.json
        name = data["name"]
        email = data["email"]
        phone_number = data["phone_number"]
        nok = NextOfKin(
            name=name,
            email=email,
            phone_number=phone_number,
        ).save()
        return jsonify({
            "status": "success",
            "message": f"Next of kin {nok.name} successfully added for {nok.patient.name}"
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


@patient.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    patient = Patient.objects(phone_number=current_user).first()
    data = request.json
    dob = data["DOB"] or None
    gender = data["gender"] or None
    address = data["address"] or None
    patient.update(DOB=dob, gender=gender, address=address)
    return jsonify({
        "status": "success",
        "message": "Profile updated successfully",
    }), 200
