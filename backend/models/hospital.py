from mongoengine import signals, StringField, Document, EmailField, BooleanField, Q

from helpers.utils.commons import clean_phone_number
from helpers.utils.commons import TimeStamp


class Hospital(TimeStamp):
    wallet_id = StringField(unique=True)
    med_vault_id = StringField(unique=True)
    transaction_pin = StringField(max_length=4, required=False)
    name = StringField(required=True, unique=True)
    email = EmailField(required=True, unique=True)
    phone_number = StringField(required=False, unique=True, max_length=11)
    password = StringField(required=True, unique=True)
    HPRID = StringField(required=True, unique=True)
    activated = BooleanField(default=False)

    def __str__(self):
        return self.name
