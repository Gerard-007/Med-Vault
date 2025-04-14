# helpers/utils/crypto.py
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes, serialization
import json



def encrypt_ehr_data(ehr_data, sui_public_key_pem):
    # Generate AES key
    aes_key = Fernet.generate_key()
    fernet = Fernet(aes_key)

    # Encrypt EHR data
    ehr_json = json.dumps(ehr_data).encode()
    encrypted_ehr = fernet.encrypt(ehr_json)

    # Encrypt AES key with patient's Sui public key
    public_key = serialization.load_pem_public_key(sui_public_key_pem)
    encrypted_key = public_key.encrypt(
        aes_key,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    return encrypted_ehr, encrypted_key


def hash_fingerprint(fingerprint_data):
    # Placeholder: Use SDK to hash fingerprint template
    return fingerprint_data  # Replace with actual hashing
