from firebase_admin import credentials, firestore, initialize_app
import firebase_admin
import os

# Only initialize Firebase Admin once
if not firebase_admin._apps:
    cred = credentials.Certificate(os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))
    initialize_app(cred)

# Singleton Firestore client
db = firestore.client()
