import secrets
import string
from flask import jsonify
from helpers.managers.ehr_manager import EHRManager


class HospitalAccessControl:
    def __init__(self):
        self.access_permissions = {}
        self.tokens = {}  # Dictionary to store active tokens

    def generate_token(self, hospital_name, selected_tables):
        """Generate a 6-character token (3 alphabets + 3 digits)."""
        self.access_permissions[hospital_name] = selected_tables

        # Generate a 6-character token: 3 alphabets + 3 digits
        alphabet = string.ascii_letters  # Includes both uppercase and lowercase letters
        digits = string.digits
        token_parts = [
            ''.join(secrets.choice(alphabet) for _ in range(3)),  # 3 random alphabets
            ''.join(secrets.choice(digits) for _ in range(3))  # 3 random digits
        ]
        token = ''.join(token_parts)  # Combine alphabets and digits

        # Store the token in memory
        self.tokens[token] = {"hospital_name": hospital_name, "tables": selected_tables}
        return token

    def verify_token(self, token):
        """Verify the token and return the hospital name and allowed tables."""
        if token not in self.tokens:
            return None, []

        hospital_name = self.tokens[token]["hospital_name"]
        selected_tables = self.tokens[token]["tables"]
        return hospital_name, selected_tables

    def invalidate_token(self, token):
        """Invalidate the token by removing it from storage."""
        if token in self.tokens:
            del self.tokens[token]

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