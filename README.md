Below is the `README.md` file written in Markdown format, with the requested replacements made (`###EHR System with Sui Blockchain and Flask...` replaced with your content, and ``` replaced with ``` for code blocks):

---

# EHR System with Sui Blockchain and Flask

This project implements an Electronic Health Record (EHR) system using **Sui Blockchain** for secure data storage and **Flask** for the backend API. The system ensures patient control over their medical records, allowing them to share data securely with hospitals or authorized entities.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [System Architecture](#system-architecture)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Endpoints](#endpoints)
7. [Contributing](#contributing)
8. [License](#license)

---

## Overview

The EHR system allows patients to manage their health records and grant access to hospitals or next of kin only when necessary. Key functionalities include:

- Patients registering and managing their medical records.
- Hospitals requesting temporary access tokens to update specific tables.
- Secure storage of patient data in JSON files, ensuring privacy and integrity.
- Integration with external services for hospital validation (e.g., HPRID confirmation).

---

## Features

- **Patient-Controlled Access**: Patients authorize hospitals to access their records via time-limited tokens.
- **Dynamic Table Updates**: Hospitals can request access to specific tables (e.g., `TreatmentProgressNotes`, `MedicationHistory`) for updates.
- **JSON Data Storage**: Patient data is stored in JSON files, with filenames based on phone numbers for easy retrieval.
- **Token-Based Authentication**: Hospitals use JWT tokens for secure authentication and authorization.
- **HPRID Validation**: Hospitals must confirm their HPRID through an external service before activation.

---

## System Architecture

The system consists of the following components:

1. **Flask Backend**:
   - Handles API requests for hospital and patient interactions.
   - Manages token generation, validation, and data updates.

2. **MongoEngine ORM**:
   - Used for database operations, including hospital and patient registration.

3. **Sui Blockchain**:
   - Ensures secure and immutable storage of sensitive data.

4. **External HPRID Service**:
   - Validates hospital credentials before activation.

---

## Installation

To set up the project locally, follow these steps:

1. **Clone the Repository**:
   ```
   git clone https://github.com/your-repo-url.git
   cd ehr-system
   ```

2. **Set Up Virtual Environment**:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**:
   ```
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**:
   Create a `.env` file and add the following variables:
   ```
   FLASK_ENV=development
   SUI_RPC_URL=
   TWILIO_ACCOUNT_SID=
   TWILIO_AUTH_TOKEN=
   TWILIO_PHONE_NUMBER=
   AWS_ACCESS_KEY=
   AWS_SECRET_KEY=
   MONGO_USERNAME=
   MONGO_PASSWORD=
   SECRET_KEY=
   SMS_SECRET_KEY=
   ```

5. **Run the Application**:
   ```
   flask run
   ```

---

## Usage

### Hospital Workflow

1. **Register Hospital**:
   - POST to `/api/hospital/register-hospital` with hospital details (`name`, `email`, `password`, `HPRID`).
   - Example:
     ```
     curl -X POST http://localhost:5000/api/hospital/register-hospital \
       -H "Content-Type: application/json" \
       -d '{"name": "St. Mary's Hospital", "email": "stmarys@example.com", "password": "securepassword123", "HPRID": "HPR12345"}'
     ```

2. **Confirm HPRID**:
   - The system validates the `HPRID` through an external service.
   - If valid, the hospital is activated.

3. **Login Hospital**:
   - POST to `/api/hospital/login` with email and password to obtain access and refresh tokens.
   - Example:
     ```
     curl -X POST http://localhost:5000/api/hospital/login \
       -H "Content-Type: application/json" \
       -d '{"email": "stmarys@example.com", "password": "securepassword123"}'
     ```

4. **Request Access Token**:
   - POST to `/api/hospital/request-access` with the hospital name and selected tables.
   - Example:
     ```
     curl -X POST http://localhost:5000/api/hospital/request-access \
       -H "Content-Type: application/json" \
       -d '{"hospital_name": "St. Mary's Hospital", "selected_tables": ["TreatmentProgressNotes", "MedicationHistory"]}'
     ```

5. **Update Patient Data**:
   - POST to `/api/hospital/update-patient-data` with the token and updates.
   - Example:
     ```
     curl -X POST http://localhost:5000/api/hospital/update-patient-data \
       -H "Content-Type: application/json" \
       -d '{"token": "your_token_here", "updates": {"patient_phone_number": "1234567890", "TreatmentProgressNotes": [{"doctors_notes": "Patient is improving."}]}}'
     ```

### Patient Workflow

1. **Register Patient**:
   - Use the frontend or admin panel to register patients with their details.

2. **Login Patient**:
   - POST to `/login` with email and password to obtain access and refresh tokens.
   - Example:
     ```
     curl -X POST http://localhost:5000/patient/login \
       -H "Content-Type: application/json" \
       -d '{"email": "patient@example.com", "password": "patientpassword123"}'
     ```

3. **Update Profile**:
   - GET to `/profile` to update personal information (e.g., DOB, gender, address).
   - Example:
     ```
     curl -X GET http://localhost:5000/patient/profile \
       -H "Authorization: Bearer <access_token>" \
       -H "Content-Type: application/json" \
       -d '{"DOB": "1990-01-01", "gender": "Male", "address": "123 Main St"}'
     ```

---

## Endpoints

| Endpoint                                          | Method | Description                                   |
|---------------------------------------------------|--------|-----------------------------------------------|
| `/api/hospital/register-hospital`                 | POST   | Register a new hospital.                      |
| `/api/hospital/login`                             | POST   | Hospital login to get access tokens.          |
| `/api/hospital/request-access`                    | POST   | Generate a token for hospital access.         |
| `/api/hospital/update-patient-data`               | POST   | Update patient data using a token.           |
| `/api/hospital/fetch-patient-data/<phone_number>` | GET | Fetch patient data by phone number. |
| `/api/patient/login`                              | POST   | Patient login to get access tokens.           |
| `/api/patient/profile`                            | GET    | Update patient profile information.           |

---

## Contributing

 Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/new-feature`.
3. Commit your changes: `git commit -m "Add new feature"`.
4. Push to the branch: `git push origin feature/new-feature`.
5. Submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to customize this `README.md` further based on your project's specific needs!