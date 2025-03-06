import os
from dotenv import load_dotenv
import secrets

# Load existing .env file
load_dotenv()

def generate_and_save_env(key, default_generator):
    """Generate a value for the key if it doesn't exist and save it to .env."""
    value = os.getenv(key)
    if value is None:
        value = default_generator()
        with open(".env", "a") as env_file:
            env_file.write(f"{key}={value}\n")
    return value

class Config:
    """Base configuration class."""
    SECRET_KEY = generate_and_save_env('SECRET_KEY', lambda: secrets.token_hex(24))
    SQLALCHEMY_DATABASE_URI = generate_and_save_env('DATABASE_URI', lambda: 'sqlite:///tourism.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() in ('true', '1', 't')
    UPLOAD_FOLDER = os.path.join(os.path.abspath(os.path.dirname(__file__)), '../static/imgs/uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max upload size
    MAPTILER_API_KEY = generate_and_save_env('MAPTILER_API_KEY', lambda: 'sqGSCVciyOvzi1k9K6g9')
    WEATHER_API_KEY = generate_and_save_env('WEATHER_API_KEY', lambda: '358fec1eaeb923b9684d49c651eda026')

# Ensure .env file exists
if not os.path.exists(".env"):
    open(".env", "w").close()

# Initialize Config to auto-generate and save missing keys
config = Config()
