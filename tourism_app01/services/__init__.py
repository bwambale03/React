from flask import current_app

def get_config(key):
    """Safely retrieve config values."""
    return current_app.config.get(key)
