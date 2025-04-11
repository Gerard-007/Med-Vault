import os

from flask import json

BASE_DIR = "data"

class EHRManager:
    def __init__(self, patient_phone_number):
        self.patient_phone_number = patient_phone_number
        self.patient_dir = os.path.join(BASE_DIR, patient_phone_number)
        self.json_file = os.path.join(self.patient_dir, f"{patient_phone_number}.json")
        self.data = self.load_data()

    def load_data(self):
        if not os.path.exists(self.patient_dir):
            os.makedirs(self.patient_dir)

        if not os.path.exists(self.json_file):
            return {
                "TreatmentProgressNotes": [],
                "MedicalHistory": [],
                "MedicationHistory": [],
                "AllergyData": [],
                "CoreVitalSigns": [],
                "HealthIssues": [],
                "ImmunizationRecords": [],
                "LaboratoryTestResults": [],
                "RadiologyReports": []
            }

        with open(self.json_file, "r") as file:
            return json.load(file)

    def save_data(self):
        """Save patient data to JSON file."""
        with open(self.json_file, "w") as file:
            json.dump(self.data, file, indent=4)

    def add_record(self, table_name, record):
        if table_name in self.data:
            records = self.data[table_name]
            if record not in records:
                records.append(record)
        else:
            raise ValueError(f"Table '{table_name}' does not exist.")

    def get_data(self):
        return self.data
