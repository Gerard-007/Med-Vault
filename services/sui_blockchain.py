# from pysui.sui.sui_clients.sync_client import SuiClient
# from pysui.sui.sui_config import SuiConfig


# sui_config = SuiConfig.default_config()
# print(f"Connecting to RPC: {sui_config.rpc_url}")
# sui_client = SuiClient(sui_config)
#
#
# def generate_med_vault_id():
#     return "some_unique_id"
#
#
# def create_sui_wallet():
#     mnemonic = sui_client.config.generate_mnemonic()
#     keypair = sui_client.config.keypair_from_mnemonic(mnemonic)
#
#     wallet_address = keypair.public_key.to_sui_address()
#     return wallet_address, mnemonic


def register_patient(name, email, phone):
    client = None
    result = client.execute_move_function(
        package="<0x0....>",
        module="PatientRegistration",
        function="register_patient",
        args=[name, email, phone],
        type_args=[],
        gas_budget=10000,
    )
    return result


def fetch_patient_data(wallet_id):
    client = None
    result = client.execute_move_function(
        package="<0x0....>",
        module="DataStorage",
        function="get_encrypted_data",
        args=[wallet_id],
        type_args=[],
        gas_budget=10000,
    )
    return result