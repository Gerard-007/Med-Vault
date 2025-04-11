from datetime import timedelta

import jwt
from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, create_refresh_token
from mongoengine import NotUniqueError, Q
from werkzeug.security import check_password_hash, generate_password_hash

from helpers.managers.access_control import HospitalAccessControl
from helpers.managers.ehr_manager import EHRManager
from helpers.utils.commons import confirm_hospital_HPRID
from models.hospital import Hospital
from helpers.utils.otp_utils import send_otp
from helpers.utils.commons import clean_phone_number
from models.patient import Patient

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

        cleaned_phone_number = clean_phone_number(phone_number)
        print(f"cleaned_phone_number: {cleaned_phone_number}")
        if not cleaned_phone_number:
            return jsonify({"error": "Somthing went wrong when saving your phone number please check it again."}), 400
        hospital = Hospital(
            name=name,
            med_vault_id = f"MV-H{cleaned_phone_number}",
            email=email,
            phone_number=phone_number,
            password=generate_password_hash(password),
            HPRID=HPRID,
            activated=True
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
            "refresh_token": refresh_token
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
    """Generate a token for hospital access."""
    current_hospital = get_jwt_identity()
    hospital = Hospital.objects(email=current_hospital).first()
    data = request.json
    patient = Patient.objects(email=data.get("email")).first()
    hospital_name = hospital.name
    selected_tables = data.get("selected_tables", [])
    access_control = HospitalAccessControl()
    token = access_control.generate_token(hospital_name, selected_tables)
    send_otp(patient.phone_number, hospital, token)
    return jsonify({
        "message": f"We have sent the authorization otp to the {patient.name}"
    }), 200


@hospital.route("/update-patient-data", methods=["POST"])
def update_patient_data():
    """Update patient data using the provided token and invalidate the token afterward."""
    data = request.json
    token = data.get("token")
    updates = data.get("updates", {})
    access_control = HospitalAccessControl()
    # Update records and invalidate the token
    response = access_control.update_records(token, updates)
    return response


@hospital.route("/fetch-patient-data/<string:patient_phone_number>", methods=["GET"])
def fetch_patient_data(patient_phone_number):
    try:
        ehr_manager = EHRManager(patient_phone_number=patient_phone_number)
        return jsonify(ehr_manager.get_data()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 404
