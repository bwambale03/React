import firebase_admin
from firebase_admin import credentials, firestore

# Load Firebase credentials
cred = credentials.Certificate("serviceAccountKey.json")

# Initialize Firebase app if not already initialized
try:
    firebase_admin.get_app()
except ValueError:
    firebase_admin.initialize_app(cred)

# Get Firestore database instance
db = firestore.client()

