import os

from flask import Blueprint, request, jsonify
from authlib.integrations.flask_client import OAuth
from flask_jwt_extended import jwt_required, create_access_token, create_refresh_token, get_jwt_identity
from itsdangerous import URLSafeTimedSerializer, SignatureExpired

from models.patient import Patient

auth = Blueprint('auth', __name__)
oauth = OAuth()

sms_serializer = URLSafeTimedSerializer(str(os.getenv("SMS_SECRET_KEY")))


@auth.route("/logout", methods=["POST"])
@jwt_required(refresh=True)
def logout():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify(access_token=new_access_token), 200


@auth.route("/send-token", methods=["POST"])
def send_token():
    data = request.json
    phone_number = data.get("phone_number")

    if not phone_number:
        return jsonify({"error": "Phone number is required."}), 400

    patient = Patient.objects(phone_number=phone_number).first()
    if not patient:
        return jsonify({"error": "Patient with this phone number does not exist."}), 404

    token = sms_serializer.dumps({"phone_number": phone_number}, salt="sms-token")
    expires_in = 10

    print(f"Token sent to {phone_number}: {token}")

    return jsonify({
        "status": "success",
        "message": f"A token has been sent to {phone_number}. It will expire in {expires_in} minutes.",
        "token": token
    }), 200


@auth.route("/validate-token", methods=["POST"])
def validate_token():
    data = request.json
    token = data.get("token")

    if not token:
        return jsonify({"error": "Token is required."}), 400

    try:
        sms_data = sms_serializer.loads(token, salt="sms-token", max_age=600)  # 600 seconds = 10 minutes
        phone_number = sms_data.get("phone_number")

        if not phone_number:
            return jsonify({"error": "Invalid token."}), 400

        patient = Patient.objects(phone_number=phone_number).first()
        if not patient:
            return jsonify({"error": "Patient with this phone number does not exist."}), 404

        access_token = create_access_token(identity=phone_number)
        refresh_token = create_refresh_token(identity=phone_number)

        return jsonify({
            "status": "success",
            "message": "Authentication successful.",
            "access_token": access_token,
            "refresh_token": refresh_token
        }), 200

    except SignatureExpired:
        return jsonify({"error": "Token has expired."}), 401
    except Exception as e:
        return jsonify({"error": "Invalid token."}), 401
