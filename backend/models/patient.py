import datetime

from mongoengine import ListField, FloatField, signals, Document, StringField, EmailField, ReferenceField, DateTimeField, DateField, Q, \
    BinaryField
from helpers.utils.commons import TimeStamp


class Patient(TimeStamp):
    wallet_id = StringField(unique=True)
    med_vault_id = StringField(unique=True)
    name = StringField(required=True)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    phone_number = StringField(required=True, unique=True)
    DOB = DateField()
    gender = StringField()
    address = StringField()
    encrypted_ehr_file = BinaryField()
    encrypted_key = BinaryField()
    walrus_blob_id = StringField()
    encrypted_mnemonic = BinaryField()
    facial_embedding = ListField(FloatField())
    fingerprint_template = StringField()

    def __str__(self):
        return self.name


class NextOfKin(Document):
    name = StringField(required=True, unique=True)
    email = EmailField(required=True, unique=True)
    phone_number = StringField(required=True, max_length=11, unique=True)
    patient = ReferenceField(Patient, required=True, related_name='next_of_kin')
    relationship = StringField(required=True, unique=True)
    address = StringField(required=False)
    created_at = DateTimeField(default=datetime.datetime.now)

    def __str__(self):
        return self.name
