from firebase_admin import credentials, firestore, initialize_app
import firebase_admin
import os
import json

ENV = os.environ.get("ENV", "development")

# Only initialize Firebase Admin once
if not firebase_admin._apps:
    try:
        if ENV == "production":
            firebase_json_str = os.environ.get("FIREBASE_CONFIG_JSON")
            if not firebase_json_str:
                raise RuntimeError("Missing FIREBASE_CONFIG_JSON in production environment.")

            firebase_creds = json.loads(firebase_json_str)
            cred = credentials.Certificate(firebase_creds)
        else:
            cred = credentials.Certificate(os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))
            
        initialize_app(cred)
        print("[INFO] Firebase initialized.")
    except Exception as e:
        raise RuntimeError(f"[ERROR] Failed to initialize Firebase: {e}")


# Singleton Firestore client
db = firestore.client()
