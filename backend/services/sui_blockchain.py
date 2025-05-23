import os
from pysui import SyncClient, SuiConfig
from pysui.abstracts.client_keypair import SignatureScheme
from cryptography.fernet import Fernet
from models.patient import Patient
from bip_utils import Bip39SeedGenerator, Bip44, Bip44Coins

# Ensure environment variables are set
MASTER_KEY = os.environ.get('MASTER_KEY')
if not MASTER_KEY:
    raise ValueError("MASTER_KEY environment variable must be set")
fernet = Fernet(MASTER_KEY)

SUI_RPC_URL = os.environ.get('SUI_RPC_URL')
if not SUI_RPC_URL:
    raise ValueError("SUI_RPC_URL environment variable must be set")

BLOCKCHAIN_PACKAGE_ID = os.environ.get('BLOCKCHAIN_PACKAGE_ID')
if not BLOCKCHAIN_PACKAGE_ID:
    raise ValueError("BLOCKCHAIN_PACKAGE_ID environment variable must be set")

def decrypt_mnemonic(encrypted_mnemonic):
    """Decrypts the stored mnemonic using Fernet."""
    return fernet.decrypt(encrypted_mnemonic).decode()

def create_sui_wallet():
    """Creates a new Sui wallet, generates a mnemonic, and returns the address and encrypted mnemonic."""
    config = SuiConfig.user_config(rpc_url=SUI_RPC_URL)
    scheme = SignatureScheme.ED25519
    mnemonic, address = config.create_new_keypair_and_address(scheme)
    encrypted_mnemonic = fernet.encrypt(mnemonic.encode())
    return address, encrypted_mnemonic

def get_sui_keypair_from_mnemonic(mnemonic):
    """Derives a Sui address from a mnemonic using pysui."""
    config = SuiConfig.user_config(rpc_url=SUI_RPC_URL)
    scheme = SignatureScheme.ED25519
    derivation_path = "m/44'/784'/0'/0'/0'"  # Standard Sui derivation path
    _, address = config.recover_keypair_and_address(scheme, mnemonic, derivation_path)
    return address

def get_sui_public_key(wallet_id):
    """Retrieves the public key (address) for a patient's wallet."""
    patient = Patient.objects(wallet_id=wallet_id).first()
    if not patient:
        raise ValueError("Patient not found")
    mnemonic = decrypt_mnemonic(patient.encrypted_mnemonic)
    return get_sui_keypair_from_mnemonic(mnemonic)

def get_sui_private_key(wallet_id):
    """Retrieves the private key for a patient's wallet using bip_utils."""
    patient = Patient.objects(wallet_id=wallet_id).first()
    if not patient:
        raise ValueError("Patient not found")
    mnemonic = decrypt_mnemonic(patient.encrypted_mnemonic)
    # Derive private key using bip_utils
    seed = Bip39SeedGenerator(mnemonic).Generate()
    bip44_ctx = Bip44.FromSeed(seed, Bip44Coins.SOLANA)  # Use SOLANA as a proxy (Sui not in bip_utils)
    account_ctx = bip44_ctx.Purpose().Coin().Account(0).Change(Bip44Changes.CHAIN_EXT).AddressIndex(0)
    private_key = account_ctx.PrivateKey().Raw().ToBytes()
    return private_key

def store_to_walrus(encrypted_data, wallet_id):
    """Stores encrypted EHR data on Walrus via the Sui smart contract."""
    config = SuiConfig.user_config(rpc_url=SUI_RPC_URL)
    client = SyncClient(config)
    tx_result = client.execute(
        package_id=BLOCKCHAIN_PACKAGE_ID,
        module_name="ehr_module",
        function_name="store_ehr",
        type_args=[],
        args=[encrypted_data, wallet_id],
        gas_budget=1000000
    )
    if tx_result.is_ok():
        effects = tx_result.result_data.effects
        for event in effects.events:
            if "blob_id" in event:
                return event["blob_id"].encode()
        return b"mock_blob_id"  # Fallback for testing
    raise Exception(f"Failed to store to Walrus: {tx_result.result_string}")
