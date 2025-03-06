from core.models import Destination, db
from flask import current_app
import logging
from random import sample  # Simple placeholder, replace with real ML later

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RecommenderService:
    """Service for ML-based destination recommendations."""

    def __init__(self):
        self.destinations = Destination.query.all()

    def recommend_destinations(self, preferences, user=None):
        """Recommend destinations based on preferences and user data."""
        if not self.destinations:
            logger.warning("No destinations available for recommendation")
            return []

        # Simple logic: filter by preferences, then sort by rating
        # Future: Replace with scikit-learn or TensorFlow model
        matched = []
        for dest in self.destinations:
            score = 0
            if dest.category in preferences:
                score += 2
            if any(pref in (dest.description.lower() or '') for pref in preferences):
                score += 1
            score += dest.rating / 5  # Normalize rating contribution
            if score > 0:
                matched.append((dest, score))

        # Sort by score and pick top 3
        matched.sort(key=lambda x: x[1], reverse=True)
        top_destinations = [d[0] for d in matched[:3]]

        if not top_destinations:
            # Fallback: random high-rated destinations
            logger.info("Falling back to random high-rated destinations")
            top_destinations = sample(
                [d for d in self.destinations if d.rating >= 4.0],
                min(3, len([d for d in self.destinations if d.rating >= 4.0]))
            )

        return [{
            "id": dest.id,
            "name": dest.name,
            "category": dest.category,
            "rating": dest.rating,
            "reason": f"Matches your {', '.join(preferences)} vibe!" if dest.category in preferences else "Highly rated gem!"
        } for dest in top_destinations]

def get_recommendations(preferences, user=None):
    """Helper to fetch recommendations."""
    service = RecommenderService()
    return service.recommend_destinations(preferences, user)
