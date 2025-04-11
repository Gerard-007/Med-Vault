import random
import re
from datetime import datetime
from mongoengine import Document, StringField, DateTimeField


class TimeStamp(Document):
    created_at = DateTimeField(default=datetime.now)
    updated_at = DateTimeField(default=datetime.now)

    meta = {
        "abstract": True,
    }


def generate_med_vault_id() -> str:
    return f"MV-{random.randrange(00000,99999) or random.randrange(00000,99999)+1}"


def clean_phone_number(phone):
    phone_number = re.sub(r"\D", "", phone.strip())
    if not phone_number.isdigit():
        raise ValueError("Invalid phone number format. Must contain only digits.")
    if len(phone_number) < 10:
        raise ValueError("Invalid phone number format. Must be at least 10 digits.")
    if phone_number.startswith("0"):
        phone_number = phone_number[1:]
        if len(phone_number) < 10:
            raise ValueError("Invalid phone number format after removing leading zero.")
    return phone_number


def confirm_hospital_HPRID(HPRID):
    # TODO: To implement this later...
    """
    try:
        response = requests.post(
            "https://external-service.com/validate-HPRID",
            json={"HPRID": HPRID},
            timeout=10
        )
        response.raise_for_status()
        result = response.json()
        return result.get("isValid", False)
    except requests.RequestException:
        return False
    """
    return True
