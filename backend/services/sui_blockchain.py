import os
from pysui import SyncClient, SuiConfig
from pysui.sui.sui_crypto import keypair_from_mnemonics, create_new_keypair_ed25519
from cryptography.fernet import Fernet
from backend.models.patient import Patient

MASTER_KEY = os.environ.get('MASTER_KEY')
if not MASTER_KEY:
    raise ValueError("MASTER_KEY environment variable must be set")
fernet = Fernet(MASTER_KEY)

def decrypt_mnemonic(encrypted_mnemonic):
    return fernet.decrypt(encrypted_mnemonic).decode()

def create_sui_wallet():
    keypair = create_new_keypair_ed25519()
    mnemonic = keypair.mnemonic()
    address = keypair.public_key.address()
    encrypted_mnemonic = fernet.encrypt(mnemonic.encode())
    return address, encrypted_mnemonic

def get_sui_public_key(wallet_id):
    patient = Patient.objects(wallet_id=wallet_id).first()
    if not patient:
        raise ValueError("Patient not found")
    mnemonic = decrypt_mnemonic(patient.encrypted_mnemonic)
    keypair = keypair_from_mnemonics(mnemonic)
    return keypair.public_key.to_bytes()

def get_sui_private_key(wallet_id):
    patient = Patient.objects(wallet_id=wallet_id).first()
    if not patient:
        raise ValueError("Patient not found")
    mnemonic = decrypt_mnemonic(patient.encrypted_mnemonic)
    keypair = keypair_from_mnemonics(mnemonic)
    return keypair.private_key.to_bytes()

def store_to_walrus(encrypted_data, wallet_id):
    # Configure for Sui testnet
    config = SuiConfig.user_config(rpc_url="https://fullnode.testnet.sui.io:443")
    client = SyncClient(config)
    
    # Replace with your deployed package ID
    package_id = "0xYourPackageIdHere"  # Update after deploying contract
    tx_result = client.execute(
        package_id=package_id,
        module_name="ehr_module",
        function_name="store_ehr",
        type_args=[],
        args=[encrypted_data, wallet_id],
        gas_budget=1000000  # Adjust based on testnet fees
    )
    
    if tx_result.is_ok():
        # Extract blob_id from transaction effects (assumes returned by walrus::store)
        effects = tx_result.result_data.effects
        for event in effects.events:
            if "blob_id" in event:
                return event["blob_id"].encode()  # Convert to bytes
        return b"mock_blob_id"  # Fallback for testing
    raise Exception(f"Failed to store to Walrus: {tx_result.result_string}")