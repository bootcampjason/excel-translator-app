from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# CORS setup
allowed_origins = [
    "https://filespeak.net",
    "https://www.filespeak.net"
]

# Load local .env if in development mode
ENV = os.environ.get("ENV", "development")

if ENV  != "production":
    allowed_origins.append("http://localhost:3000")
    print("[INFO] Loaded .env for development environment.")
else:
    print("[INFO] Running in production environment.")
    
CORS(app, origins=allowed_origins, supports_credentials=True)

# Register routes
from routes.usage import usage_bp
from routes.translate import translate_bp
from routes.payment import payment_bp
from routes.health import health_bp

app.register_blueprint(usage_bp)
app.register_blueprint(translate_bp)
app.register_blueprint(payment_bp)
app.register_blueprint(health_bp)

# Run the app
if __name__ == "__main__":
    app.run(debug=True)
