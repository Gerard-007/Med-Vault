# MedVault: Decentralized EHR Management System

## Overview
MedVault is a decentralized Electronic Health Record (EHR) management system that leverages blockchain technology for secure, transparent, and patient-controlled health data storage. Built with a **Flask** backend, **React** frontend, and **Sui blockchain** smart contracts, it enables patients to manage their EHRs, hospitals to access and update records with permission, and next-of-kin to view data in emergencies. The system uses **MongoDB** for data storage, **Redis** for caching, and **PyCryptodome** for encryption, ensuring robust security and performance.

## Features
- **Patient Management**: Register, login, and manage EHRs (Medical Reports, Medication History).
- **Hospital Access**: Hospitals can register, lookup patients, access/update EHRs with patient consent.
- **Blockchain Integration**: EHRs are stored on the Sui testnet using the `ehr_module.move` smart contract, ensuring immutability and transparency.
- **Next-of-Kin Access**: Emergency access to EHRs for authorized individuals.
- **Facial Recognition**: Powered by `deepface` for secure patient verification.
- **Dockerized Deployment**: Run backend, frontend, MongoDB, and Redis with Docker Compose.

## Project Structure
```
EHR-blockchain-project/
├── backend/                    # Flask backend
│   ├── models/                # MongoDB models
│   │   ├── hospital.py
│   │   ├── patient.py
│   ├── routes/                # API routes
│   │   ├── hospital.py
│   │   ├── patient.py
│   ├── services/              # Blockchain and utility services
│   │   ├── sui_blockchain.py
│   ├── helpers/               # Utility functions
│   │   ├── utils/
│   │   │   ├── commons.py
│   │   │   ├── crypto.py
│   │   ├── managers/
│   │   │   ├── access_control.py
│   │   │   ├── ehr_manager.py
│   ├── app.py                 # Flask application entry point
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile             # Backend Docker configuration
├── blockchain/                 # Sui smart contracts
│   ├── ehr_module/
│   │   ├── sources/
│   │   │   ├── ehr_module.move
│   │   ├── Move.toml
├── frontend/                   # React frontend
│   ├── src/                   # React components and logic
│   ├── public/                # Static assets
│   ├── package.json           # Node.js dependencies
│   ├── Dockerfile             # Frontend Docker configuration
├── docker-compose.yaml         # Docker Compose configuration
├── .env                       # Environment variables
├── README.md                  # Project documentation
```

## Prerequisites
- **Python** 3.11
- **Node.js** 18
- **Docker** and **Docker Compose**
- **Sui CLI** (for deploying smart contracts)
- **MongoDB** client (e.g., `mongosh`) for testing
- **Redis CLI** for caching verification

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/EHR-blockchain-project.git
cd EHR-blockchain-project
```

### 2. Deploy Sui Smart Contract
1. Navigate to the blockchain directory:
   ```bash
   cd blockchain/ehr_module
   ```
2. Configure Sui CLI for testnet:
   ```bash
   sui client switch --env testnet
   sui client faucet
   ```
3. Deploy the smart contract:
   ```bash
   sui client publish --gas-budget 10000000
   ```
4. Note the `package_id` from the output and update `.env`.

### 3. Configure Environment Variables
Create a `.env` file in the project root:
```plaintext
MASTER_KEY=your_fernet_key_here
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
BLOCKCHAIN_PACKAGE_ID=0xYourPackageId
```
Generate a `MASTER_KEY`:
```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

### 4. Run with Docker
1. Ensure Docker is running.
2. Build and start all services:
   ```bash
   docker-compose up --build
   ```
3. Access services:
   - Backend API: `http://localhost:5000`
   - Frontend UI: `http://localhost:3000`
   - MongoDB: `localhost:27017`
   - Redis: `localhost:6379`

### 5. Local Development (without Docker)
#### Backend
1. Create and activate a virtual environment:
   ```bash
   cd backend
   python -m venv venv
   .\venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the Flask app:
   ```bash
   flask run
   ```

#### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm start
   ```

## API Endpoints
The backend exposes RESTful API endpoints under `/patient` and `/hospital` routes, secured with JWT authentication. All endpoints require `Content-Type: application/json` headers unless specified.

### Patient Endpoints
| Method | Endpoint                     | Description                              | Request Body Example                                                                 | Response Example                                                                 |
|--------|------------------------------|------------------------------------------|-------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| POST   | `/patient/register`          | Register a new patient                   | `{"name": "John Doe", "email": "john@example.com", "phone_number": "1234567890", "password": "securepass123"}` | `{"message": "Patient John Doe registered successfully", "access_token": "...", "refresh_token": "...", "wallet_id": "0x..."}` |
| POST   | `/patient/login`             | Authenticate a patient                   | `{"email": "john@example.com", "password": "securepass123"}`                        | `{"message": "Login successful", "access_token": "...", "refresh_token": "...", "wallet_id": "0x..."}` |
| POST   | `/patient/refresh`           | Refresh JWT access token                 | None (requires `Authorization: Bearer <refresh_token>`)                              | `{"access_token": "..."}`                                                       |
| POST   | `/patient/store-ehr`         | Store EHR on blockchain                  | `{"MedicalReport": [{"date": "2025-04-14", "report": "X-ray normal"}], "MedicationHistory": [{"date": "2025-01-01", "medication": "Aspirin", "hospital": "Hospital A"}]}` | `{"message": "EHR stored as MV-P1234567890.json on Walrus", "blob_id": "mock_blob_id"}` |
| GET    | `/patient/get-ehr/<ehr_id>`  | Retrieve EHR by ID                       | None (requires `Authorization: Bearer <access_token>`)                               | `{"ehr_id": "MV-P1234567890", "data": {...}, "blob_id": "mock_blob_id"}`        |
| POST   | `/patient/verify-face`       | Verify patient identity via facial recognition | Form-data: `image` (file) (requires `Authorization: Bearer <access_token>`)         | `{"message": "Identity verified successfully"}`                                 |
| POST   | `/patient/add-nok`           | Add next-of-kin for emergency access     | `{"nok_name": "Jane Doe", "nok_email": "jane@example.com", "nok_phone": "0987654321"}` | `{"message": "Next-of-kin added successfully"}`                                |
| GET    | `/patient/nok-access/<ehr_id>` | Grant next-of-kin access to EHR         | None (requires `Authorization: Bearer <access_token>`)                               | `{"message": "Access granted to next-of-kin", "access_key": "..."}`            |

### Hospital Endpoints
| Method | Endpoint                     | Description                              | Request Body Example                                                                 | Response Example                                                                 |
|--------|------------------------------|------------------------------------------|-------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| POST   | `/hospital/register`         | Register a new hospital                  | `{"name": "Hospital A", "email": "hospital@example.com", "phone_number": "9876543210", "password": "securepass123"}` | `{"message": "Hospital Hospital A registered successfully", "access_token": "...", "refresh_token": "..."}` |
| POST   | `/hospital/login`            | Authenticate a hospital                  | `{"email": "hospital@example.com", "password": "securepass123"}`                    | `{"message": "Login successful", "access_token": "...", "refresh_token": "..."}` |
| POST   | `/hospital/refresh`          | Refresh JWT access token                 | None (requires `Authorization: Bearer <refresh_token>`)                              | `{"access_token": "..."}`                                                       |
| POST   | `/hospital/patient-lookup`   | Lookup patient by email or wallet ID     | `{"email": "john@example.com"}` or `{"wallet_id": "0x..."}`                         | `{"patient": {"name": "John Doe", "wallet_id": "0x...", "email": "john@example.com"}}` |
| POST   | `/hospital/access-ehr`       | Request access to patient EHR            | `{"patient_wallet_id": "0x...", "ehr_id": "MV-P1234567890"}`                        | `{"message": "Access request sent", "request_id": "..."}`                       |
| POST   | `/hospital/confirm-ehr-update` | Confirm and update EHR on blockchain   | `{"ehr_id": "MV-P1234567890", "data": {...}}`                                       | `{"message": "EHR updated successfully", "blob_id": "mock_blob_id"}`           |

### Authentication
- **JWT Tokens**: Required for most endpoints (except `/patient/register`, `/hospital/register`, `/patient/login`, `/hospital/login`).
- **Headers**: Include `Authorization: Bearer <access_token>` for protected routes.
- **Refresh Tokens**: Use `/patient/refresh` or `/hospital/refresh` to obtain a new access token.

## Testing
1. **Backend**:
   - Use Postman with the provided endpoints.
   - Example: Register a patient:
     ```bash
     curl -X POST http://localhost:5000/patient/register -H "Content-Type: application/json" -d '{"name": "John Doe", "email": "john@example.com", "phone_number": "1234567890", "password": "securepass123"}'
     ```
   - Verify MongoDB:
     ```bash
     mongosh mongodb://localhost:27017/medvault
     db.patients.find()
     ```
2. **Frontend**:
   - Access `http://localhost:3000` and test UI interactions (e.g., patient registration form).
   - Ensure API calls use `http://localhost:5000` as the base URL.
3. **Blockchain**:
   - Verify Sui testnet interactions:
     ```bash
     sui client objects --address <patient_wallet_id>
     ```

## Troubleshooting
- **Network Issues**: Ensure a stable internet connection for Sui testnet and dependency installation.
- **CORS Errors**: Add `flask-cors` to `app.py` if the frontend can’t reach the backend:
  ```python
  from flask_cors import CORS
  CORS(app)
  ```
- **Sui Errors**: Verify `SUI_RPC_URL` and `BLOCKCHAIN_PACKAGE_ID` in `.env`. Request testnet funds:
  ```bash
  sui client faucet
  ```
- **Dependency Issues**: Retry installations with a PyPI mirror:
  ```bash
  pip install -r backend/requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
  ```

## Contributing
Contributions are welcome! Please:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For questions or support, contact [your-email@example.com](mailto:your-email@example.com).

---
*Generated on May 23, 2025*