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