from flask import jsonify
from itsdangerous import URLSafeTimedSerializer, SignatureExpired

from helpers.managers.ehr_manager import EHRManager


serializer = URLSafeTimedSerializer("SECRET_KEY")


class HospitalAccessControl:
    def __init__(self):
        self.access_permissions = {}

    def generate_token(self, hospital_name, selected_tables):
        self.access_permissions[hospital_name] = selected_tables
        return serializer.dumps({"hospital_name": hospital_name, "tables": selected_tables})

    def verify_token(self, token):
        try:
            data = serializer.loads(token, max_age=600)
            hospital_name = data["hospital_name"]
            selected_tables = data["tables"]
            return hospital_name, selected_tables
        except SignatureExpired:
            return None, []

    def update_records(self, token, updates):
        hospital_name, allowed_tables = self.verify_token(token)
        if not hospital_name:
            return jsonify({"error": "Invalid or expired token."}), 401
        ehr_manager = EHRManager(patient_phone_number=updates.get("patient_phone_number"))
        updated_tables = []

        for table_name, records in updates.items():
            if table_name in allowed_tables:
                for record in records:
                    ehr_manager.add_record(table_name, record)
                updated_tables.append(table_name)

        ehr_manager.save_data()
        return jsonify({"message": f"Updated tables: {updated_tables}"}), 200
