# MedVault: Decentralized EHR Management System

MedVault is a decentralized Electronic Health Record (EHR) management system built with Flask (Python) for the backend and Sui blockchain for secure data storage. It enables patients to store encrypted EHRs, hospitals to access and update records with patient consent, and supports patient identification via name, phone, face, or fingerprint (placeholder). The system uses MongoDB for user data, Redis for token management, and `pysui` for blockchain interactions.

## Features

- **Patient Registration and EHR Storage**: Patients register with a Sui wallet, encrypt EHR data, and store it on Walrus via a Sui smart contract.
- **Hospital Access**: Hospitals request EHR access using OTP-based tokens, with support for next-of-kin authorization in fatal injury cases.
- **Patient Lookup**: Hospitals can find patients by name, phone, facial recognition, or fingerprint (placeholder).
- **EHR Updates**: Hospitals propose and append updates (e.g., medication history) with patient approval.
- **Sui Blockchain**: Stores EHR metadata (`blob_id`) on-chain using the `ehr_module` smart contract.

## Project Structure

```
MedVault/
├── backend/
│   ├── models/
│   │   ├── hospital.py       # Hospital MongoDB model
│   │   ├── patient.py        # Patient and NextOfKin models
│   ├── routes/
│   │   ├── hospital.py       # Hospital API routes
│   │   ├── patient.py        # Patient API routes
│   ├── services/
│   │   ├── sui_blockchain.py # Sui wallet and Walrus integration
│   ├── helpers/
│   │   ├── utils/
│   │   │   ├── commons.py    # Utility functions
│   │   │   ├── crypto.py     # Encryption utilities
│   │   ├── managers/
│   │   │   ├── access_control.py # Token management
│   │   │   ├── ehr_manager.py    # EHR utilities (optional)
├── move/
│   ├── ehr_module/
│   │   ├── sources/
│   │   │   ├── ehr_module.move # Sui smart contract
│   │   ├── Move.toml           # Move package config
├── app.py                     # Flask entry point
├── requirements.txt           # Python dependencies
├── README.md                  # This file
```

## Prerequisites

- **Python**: 3.8+
- **Node.js**: For Sui CLI (optional, for contract deployment)
- **MongoDB**: Local or hosted instance
- **Redis**: Local or hosted instance
- **Sui CLI**: For deploying the smart contract
- **Walrus**: Mocked for testing (replace with real service in production)

## Setup

### Backend Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo/MedVault.git
   cd MedVault
   ```

2. **Install Python Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
   Example `requirements.txt`:
   ```
   flask==2.0.1
   flask-jwt-extended==4.4.4
   mongoengine==0.27.0
   cryptography==42.0.5
   pysui==0.5.0
   deepface==0.0.79
   numpy==1.24.3
   redis==5.0.1
   ```

3. **Set Environment Variables**:
   Create a `.env` file or export variables:
   ```bash
   export MASTER_KEY=$(python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())")
   export FLASK_APP=app.py
   export FLASK_ENV=development
   ```

4. **Start MongoDB and Redis**:
   ```bash
   mongod
   redis-server
   ```

5. **Run the Flask App**:
   ```bash
   flask run
   ```
   The API will be available at `http://localhost:5000`.

### Sui Blockchain Setup

1. **Install Sui CLI**:
   Follow [Sui documentation](https://docs.sui.io/build/cli) to install the Sui CLI:
   ```bash
   cargo install --locked --git https://github.com/MystenLabs/sui.git --branch main sui
   ```

2. **Configure Sui Client**:
   Set up a testnet wallet:
   ```bash
   sui client switch --env testnet
   sui client faucet
   ```

3. **Deploy the Smart Contract**:
   Navigate to the Move package:
   ```bash
   cd move/ehr_module
   ```
   Deploy to testnet:
   ```bash
   sui client publish --gas-budget 10000000
   ```
   Note the `package_id` (e.g., `0x123...`) from the output.

4. **Update Backend**:
   Edit `backend/services/sui_blockchain.py` and set the `package_id`:
   ```python
   package_id = "0xYourPackageIdHere"  # Replace with actual ID
   ```

## Smart Contract

The `ehr_module.move` contract stores EHR metadata on Sui:

```move
module ehr_module::ehr_module {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use ehr_module::walrus_mock as walrus;

    public struct EHR has key, store {
        id: UID,
        wallet_id: address,
        blob_id: vector<u8>,
    }

    public entry fun store_ehr(encrypted_data: vector<u8>, wallet_id: address, ctx: &mut TxContext) {
        let blob_id = walrus::store(encrypted_data);
        let ehr = EHR {
            id: object::new(ctx),
            wallet_id,
            blob_id,
        };
        transfer::transfer(ehr, wallet_id);
    }
}

module ehr_module::walrus_mock {
    public fun store(_data: vector<u8>): vector<u8> {
        b"mock_blob_id"
    }
}
```

- **Note**: `walrus_mock` is a placeholder. Replace with the real Walrus module in production.

## Testing

Below are test commands to verify all functionalities. Run these in a terminal after setting up the backend and blockchain.

### Test Data

- **Patient**:
  - Name: John Doe
  - Email: john@example.com
  - Phone: 1234567890
  - Password: securepass123
- **Hospital**:
  - Name: Hospital A
  - Email: hospital_a@example.com
  - Phone: 0987654321
  - Password: hospitalpass123
  - HPRID: HPR123
- **Next of Kin**:
  - Name: Jane Doe
  - Email: jane@example.com
  - Phone: 0987654321
  - Relationship: Sister
- **EHR Data**:
  ```json
  {
    "MedicalReport": [{"date": "2025-04-14", "report": "X-ray normal"}],
    "MedicationHistory": [{"date": "2025-01-01", "medication": "Aspirin", "hospital": "Hospital A"}]
  }
  ```

### Test Commands

1. **Register Patient**:
   ```bash
   curl -X POST http://localhost:5000/patient/register \
   -H "Content-Type: application/json" \
   -d '{"name": "John Doe", "email": "john@example.com", "phone_number": "1234567890", "password": "securepass123"}'
   ```
   **Expected**: `{"message": "Patient John Doe registered successfully", "access_token": "...", "refresh_token": "...", "wallet_id": "<sui_address>"}`

2. **Register Hospital**:
   ```bash
   curl -X POST http://localhost:5000/hospital/register \
   -H "Content-Type: application/json" \
   -d '{"name": "Hospital A", "email": "hospital_a@example.com", "phone_number": "0987654321", "password": "hospitalpass123", "HPRID": "HPR123"}'
   ```
   **Expected**: `{"status": "success", "message": "Hospital registered successfully and activated.", ... "wallet_id": "<sui_address>"}`

3. **Patient Login**:
   ```bash
   curl -X POST http://localhost:5000/patient/login \
   -H "Content-Type: application/json" \
   -d '{"email": "john@example.com", "password": "securepass123"}'
   ```
   **Expected**: `{"access_token": "...", "refresh_token": "..."}`
   Save the `access_token` as `<patient_access_token>`.

4. **Hospital Login**:
   ```bash
   curl -X POST http://localhost:5000/hospital/login \
   -H "Content-Type: application/json" \
   -d '{"email": "hospital_a@example.com", "password": "hospitalpass123"}'
   ```
   **Expected**: `{"access_token": "...", "refresh_token": "..."}`
   Save the `access_token` as `<hospital_access_token>`.

5. **Store EHR**:
   ```bash
   curl -X POST http://localhost:5000/patient/store-ehr \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer <patient_access_token>" \
   -d '{
     "MedicalReport": [{"date": "2025-04-14", "report": "X-ray normal"}],
     "MedicationHistory": [{"date": "2025-01-01", "medication": "Aspirin", "hospital": "Hospital A"}]
   }'
   ```
   **Expected**: `{"message": "EHR stored as MV-P1234567890.json on Walrus", "blob_id": "mock_blob_id"}`

6. **Find Patient by Name**:
   ```bash
   curl -X POST http://localhost:5000/hospital/find-patient \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer <hospital_access_token>" \
   -d '{"name": "John Doe"}'
   ```
   **Expected**: `{"wallet_id": "<wallet_id>", "name": "John Doe", "email": "john@example.com", "phone_number": "1234567890"}`

7. **Store Facial Embedding**:
   ```bash
   curl -X POST http://localhost:5000/patient/store-facial-embedding \
   -H "Authorization: Bearer <patient_access_token>" \
   -F "image=@/path/to/john_doe.jpg"
   ```
   **Expected**: `{"message": "Facial embedding stored successfully"}`
   **Note**: Replace `/path/to/john_doe.jpg` with a valid image file.

8. **Find Patient by Face**:
   ```bash
   curl -X POST http://localhost:5000/hospital/find-patient-by-face \
   -H "Authorization: Bearer <hospital_access_token>" \
   -F "image=@/path/to/john_doe.jpg"
   ```
   **Expected**: Same as name lookup.

9. **Add Next of Kin**:
   ```bash
   curl -X POST http://localhost:5000/patient/add-next-of-kin \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer <patient_access_token>" \
   -d '{"name": "Jane Doe", "email": "jane@example.com", "phone_number": "0987654321", "relationship": "Sister"}'
   ```
   **Expected**: `{"status": "success", "message": "Next of kin Jane Doe successfully added for John Doe"}`

10. **Get Patient Info**:
    ```bash
    curl -X GET http://localhost:5000/hospital/get-patient-info/<wallet_id> \
    -H "Authorization: Bearer <hospital_access_token>"
    ```
    **Expected**: `{"name": "John Doe", "email": "john@example.com", "phone_number": "1234567890", "next_of_kin": {...}}`
    Replace `<wallet_id>` with the patient’s `wallet_id` from registration.

11. **Request Next-of-Kin Access**:
    ```bash
    curl -X POST http://localhost:5000/hospital/request-next-of-kin-access \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <hospital_access_token>" \
    -d '{"wallet_id": "<wallet_id>", "selected_tables": ["MedicalReport"]}'
    ```
    **Expected**: `{"message": "Authorization OTP sent to Jane Doe"}`

12. **Request EHR Access**:
    ```bash
    curl -X POST http://localhost:5000/hospital/request-access \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <hospital_access_token>" \
    -d '{"patient_email": "john@example.com", "selected_tables": ["MedicationHistory"]}'
    ```
    **Expected**: `{"message": "Access token sent to John Doe"}`

13. **Access EHR**:
    ```bash
    curl -X POST http://localhost:5000/hospital/access-ehr \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <hospital_access_token>" \
    -d '{"token": "<otp_token>"}'
    ```
    **Expected**: `{"ehr": {"MedicationHistory": [...]}}`
    **Note**: `<otp_token>` is sent to the patient’s phone (mocked for testing).

14. **Propose EHR Update**:
    ```bash
    curl -X POST http://localhost:5000/hospital/propose-ehr-update \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <hospital_access_token>" \
    -d '{
      "patient_email": "john@example.com",
      "updates": {
        "MedicationHistory": [
          {"date": "2025-04-14", "medication": "Paracetamol", "hospital": "Hospital B"}
        ]
      }
    }'
    ```
    **Expected**: `{"message": "Update confirmation token sent to John Doe"}`

15. **Confirm EHR Update**:
    ```bash
    curl -X POST http://localhost:5000/hospital/confirm-ehr-update \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <hospital_access_token>" \
    -d '{"token": "<otp_token>"}'
    ```
    **Expected**: `{"message": "EHR updated and stored as MV-P1234567890.json"}`

### Verification

- **MongoDB**: Check `Patient` and `Hospital` collections for `wallet_id`, `encrypted_mnemonic`, `encrypted_ehr_file`, etc.
  ```bash
  mongosh
  use medvault
  db.patients.find()
  db.hospitals.find()
  ```
- **Sui Blockchain**: Verify `EHR` objects:
  ```bash
  sui client objects --address <patient_wallet_id>
  ```
- **Redis**: Confirm token storage (optional):
  ```bash
  redis-cli
  KEYS *
  ```

## Notes for Production

- **Walrus**: Replace `walrus_mock` with the real Walrus API or module.
- **Encryption**: Use a proper hybrid encryption scheme (e.g., ECIES) instead of mocked `encrypt_file`.
- **HPRID Validation**: Implement `confirm_hospital_HPRID` with a real external service.
- **Fingerprint**: Integrate a fingerprint SDK for `/find-patient-by-fingerprint`.
- **Gas Costs**: Monitor Sui testnet gas fees before mainnet deployment.
- **Security**: Secure `MASTER_KEY` and rotate it periodically.

## Troubleshooting

- **Contract Deployment Fails**: Ensure sufficient testnet funds (`sui client faucet`) and correct `Move.toml`.
- **Backend Errors**: Check MongoDB/Redis connectivity and `MASTER_KEY`.
- **DeepFace Issues**: Verify image quality and install OpenCV if needed (`pip install opencv-python`).
- **Sui Errors**: Update `package_id` and verify testnet connectivity.

For support, open an issue on the repository or contact the maintainers.

## License

MIT License

---

Happy hacking with MedVault!