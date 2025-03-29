import random

import requests


def generate_med_vault_id() -> str:
    return f"MV-{random.randrange(00000,99999) or random.randrange(00000,99999)+1}"

def confirm_hospital_HPRID(HPRID):
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
