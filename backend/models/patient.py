import datetime
from email.quoprimime import body_check

from mongoengine import signals, Document, StringField, EmailField, ReferenceField, DateTimeField, DateField, Q
from helpers.utils.commons import TimeStamp


class Patient(TimeStamp):
    med_vault_id = StringField(unique=True)
    transaction_pin = StringField(max_length=4, required=False)
    wallet_id = StringField(unique=True)
    name = StringField(required=True, unique=True)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True, min_length=8)
    phone_number = StringField(required=True, max_length=11, unique=True)
    DOB = DateField(required=False)
    gender = StringField(required=False, choices=["Male", "Female", "Other"])
    address = StringField(required=False)

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
