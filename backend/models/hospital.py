from mongoengine import BinaryField, signals, StringField, Document, EmailField, BooleanField, Q

from helpers.utils.commons import clean_phone_number
from helpers.utils.commons import TimeStamp


class Hospital(TimeStamp):
    wallet_id = StringField(unique=True)
    med_vault_id = StringField(unique=True)
    name = StringField(required=True)
    email = EmailField(required=True, unique=True)
    phone_number = StringField(required=True, unique=True)
    password = StringField(required=True)
    HPRID = StringField(required=True, unique=True)
    activated = BooleanField(default=False)
    encrypted_mnemonic = BinaryField()
    
    def __str__(self):
        return self.name
