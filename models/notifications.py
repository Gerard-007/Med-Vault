import datetime
from mongoengine import Document, StringField, ReferenceField, DateTimeField
from models.hospital import Hospital
from models.patient import Patient


class Notifications(Document):
    type = StringField(max_length=50, choices=["System", "Transaction", "Report"])
    message = StringField()
    recipient = ReferenceField(Patient)
    sender = StringField(Hospital)
    created_at = DateTimeField(default=datetime.datetime.now)

    def __str__(self):
        return f" {self.type}: {self.sender} -> {self.recipient} - {self.message[:12]}..."
