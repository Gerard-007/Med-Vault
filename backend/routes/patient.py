from datetime import timedelta

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, create_refresh_token
from mongoengine import Q
from werkzeug.security import check_password_hash, generate_password_hash

from helpers.utils.commons import generate_med_vault_id
from models.patient import Patient, NextOfKin

from helpers.utils.commons import clean_phone_number

# from services.sui_blockchain import create_sui_wallet

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

        # wallet_address, mnemonic = create_sui_wallet()
        # print(f"Created wallet with address: {wallet_address}")
        #
        # med_vault_id = generate_med_vault_id()
        # print(f"med_vault_id: {med_vault_id}")
        cleaned_phone_number = clean_phone_number(phone_number)
        patient = Patient(
            wallet_id=None,
            med_vault_id=f"MV-P{cleaned_phone_number}",
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
