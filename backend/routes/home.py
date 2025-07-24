from flask import Blueprint

home_bp = Blueprint("home", __name__)

@home_bp.route("/")
def home():
    return "✅ Backend is running!"

@home_bp.route("/ping")
def ping():
    return {"message": "Backend is alive!"}