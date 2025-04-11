import os
from datetime import timedelta

from flask import Flask
from flask_jwt_extended import JWTManager

from routes.auth import auth
from routes.hospital import hospital
from routes.patient import patient
from helpers.utils.config import initialize_db, Config

app = Flask(__name__)
# sui_client = SuiClient(Config.SUI_RPC_URL)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)
jwt = JWTManager(app)

app.config.from_object(Config)
initialize_db()

app.register_blueprint(auth, url_prefix="/api/auth")
app.register_blueprint(hospital, url_prefix="/api/hospital")
app.register_blueprint(patient, url_prefix="/api/patient")


if __name__ == "__main__":
    app.run(debug=True)