import os
from flask import current_app
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ARService:
    """Service to manage AR preview assets and logic."""

    def __init__(self):
        self.static_dir = os.path.join(current_app.root_path, 'static')  # Simplified path

    def get_ar_model(self, destination):
        """Retrieve or generate an AR model path for a destination, prioritizing GLTF/GLB."""
        # Check for destination-specific GLTF/GLB model
        if destination.ar_model and os.path.splitext(destination.ar_model)[1].lower() in ('.gltf', '.glb'):
            model_path = os.path.join(self.static_dir, 'imgs/destinations', os.path.basename(destination.ar_model))
            if os.path.exists(model_path):
                logger.info(f"Found custom model for {destination.name}: {model_path}")
                return f"/static/imgs/destinations/{os.path.basename(destination.ar_model)}"

        # Fallback to default GLTF/GLB model
        default_model = "default_ar.glb"  # Ensure this exists in static/imgs/destinations/
        default_path = os.path.join(self.static_dir, 'imgs/destinations', default_model)
        if os.path.exists(default_path):
            logger.info(f"Using default model for {destination.name}")
            return f"/static/imgs/destinations/{default_model}"

        logger.error(f"No valid AR model found for {destination.name}")
        return None

    def generate_ar_preview(self, destination):
        """Generate AR preview metadata with GLTF support and enhanced options."""
        ar_model = self.get_ar_model(destination)
        if not ar_model:
            return {
                "error": "No AR model available",
                "message": f"AR preview for {destination.name} coming soon! 🚧",
                "available": False
            }

        # Enhanced metadata with fallback sound and rotation
        sound_file = f"ar_{destination.name.lower().replace(' ', '_')}.mp3"
        sound_path = os.path.join(self.static_dir, 'sounds', sound_file)
        sound_url = f"/static/sounds/{sound_file}" if os.path.exists(sound_path) else "/static/sounds/ar_welcome.mp3"

        return {
            "model_url": ar_model,
            "duration": 5000,  # Animation duration in ms
            "sound_url": sound_url,
            "auto_rotate": True,  # Add rotation for better preview
            "description": f"Step into {destination.name} with AR!",
            "available": True
        }

def enhance_ar_experience(destination):
    """Helper to prepare AR data for templates with error handling."""
    try:
        service = ARService()
        preview_data = service.generate_ar_preview(destination)
        logger.info(f"AR preview generated for {destination.name}")
        return preview_data
    except Exception as e:
        logger.error(f"AR preview error for {destination.name}: {str(e)}")
        return {"error": "AR processing failed", "message": str(e), "available": False}