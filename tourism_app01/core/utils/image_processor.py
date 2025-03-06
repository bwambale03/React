import os
from PIL import Image
from flask import current_app
from werkzeug.utils import secure_filename

def process_image(file):
    """Process and save an uploaded image."""
    if not file:
        return None
    filename = secure_filename(file.filename)
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    img = Image.open(file)
    img.thumbnail((800, 800))  # Resize securely
    img.save(filepath, optimize=True, quality=85)
    return f'/static/imgs/uploads/{filename}'
