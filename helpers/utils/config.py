import os
from mongoengine import connect


class Config:
    FLASK_ENV = os.getenv("FLASK_ENV")
    SUI_RPC_URL = os.getenv("SUI_RPC_URL")
    TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
    TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
    TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
    AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
    AWS_SECRET_KEY = os.getenv("AWS_SECRET_KEY")


def initialize_db():
    username = os.getenv("MONGO_USERNAME")
    password = os.getenv("MONGO_PASSWORD")
    MONGO_URI = str(f"mongodb+srv://{username}:{password}@cluster0.tvycbjn.mongodb.net/med_vault_emr?retryWrites=true&w=majority")
    try:
        connect(host=MONGO_URI)
        print("Connected to MongoDB!")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        exit(1)
