from mongoengine import StringField, Document, EmailField, BooleanField


class Hospital(Document):
    name = StringField(required=True, unique=True)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True, unique=True)
    HPRID = StringField(required=True, unique=True)
    activated = BooleanField(default=False)

    def __str__(self):
        return self.name
