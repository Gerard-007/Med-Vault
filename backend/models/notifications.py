import datetime
from mongoengine import Document, StringField, ReferenceField, DateTimeField
from models.hospital import Hospital
from models.patient import Patient
from helpers.utils.commons import TimeStamp


class Notifications(TimeStamp):
    type = StringField(max_length=50, choices=["System", "Transaction", "Report"])
    message = StringField()
    recipient = ReferenceField(Patient)
    sender = StringField(Hospital)

    def __str__(self):
        return f" {self.created_at} {self.type}: {self.sender} -> {self.recipient} - {self.message[:12]}..."
