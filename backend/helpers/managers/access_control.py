import json
from flask import jsonify
from helpers.managers.ehr_manager import EHRManager
import redis
import uuid
from datetime import timedelta


class HospitalAccessControl:
    def __init__(self):
        self.redis = redis.Redis(host="redis", port=6379, decode_responses=True)

    def generate_token(self, hospital_name, selected_tables, med_vault_id):
        token = str(uuid.uuid4())
        self.redis.setex(
            f"access_token:{token}",
            timedelta(minutes=10),
            json.dumps({
                "hospital_name": hospital_name,
                "selected_tables": selected_tables,
                "med_vault_id": med_vault_id
            })
        )
        return token

    def verify_token(self, token):
        data = self.redis.get(f"access_token:{token}")
        if data:
            return json.loads(data)
        return None

    def invalidate_token(self, token):
        self.redis.delete(f"access_token:{token}")

    def update_records(self, token, updates):
        """Update patient data using the provided token and invalidate the token afterward."""
        hospital_name, allowed_tables = self.verify_token(token)
        if not hospital_name:
            return jsonify({"error": "Invalid token."}), 401

        ehr_manager = EHRManager(patient_phone_number=updates.get("patient_phone_number"))
        updated_tables = []

        for table_name, records in updates.items():
            if table_name in allowed_tables:
                for record in records:
                    ehr_manager.add_record(table_name, record)
                updated_tables.append(table_name)

        ehr_manager.save_data()

        # Invalidate the token after updating records
        self.invalidate_token(token)

        return jsonify({"message": f"Updated tables: {updated_tables}"}), 200