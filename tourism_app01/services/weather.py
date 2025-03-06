import requests
from flask import current_app
from core.utils.geolocation import get_maptiler_coordinates
from datetime import datetime
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WeatherService:
    """Service to fetch weather data using OpenWeatherMap API."""

    BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

    def __init__(self):
        self.api_key = current_app.config.get('WEATHER_API_KEY')
        if not self.api_key:
            logger.error("Weather API key not configured")
            raise ValueError("Weather API key is missing")

    def get_weather(self, location):
        """Fetch current weather for a location."""
        try:
            # Get coordinates from maptiler
            coordinates = get_maptiler_coordinates(location, current_app.config.get('MAPTILER_API_KEY'))
            if not coordinates:
                logger.warning(f"Could not geocode location: {location}")
                return {"error": "Location not found"}

            lon, lat = coordinates
            params = {
                "lat": lat,
                "lon": lon,
                "appid": self.api_key,
                "units": "metric"  # Celsius
            }

            # Secure API request
            response = requests.get(self.BASE_URL, params=params, timeout=5)
            response.raise_for_status()  # Raise exception for bad status codes
            data = response.json()

            # Extract fascinating weather details
            weather = {
                "temperature": data["main"]["temp"],
                "description": data["weather"][0]["description"].capitalize(),
                "icon": f"http://openweathermap.org/img/wn/{data['weather'][0]['icon']}.png",
                "timestamp": datetime.fromtimestamp(data["dt"]).isoformat()
            }
            logger.info(f"Weather fetched for {location}: {weather['description']}")
            return weather

        except requests.exceptions.RequestException as e:
            logger.error(f"Weather API request failed: {str(e)}")
            return {"error": "Unable to fetch weather data"}
        except KeyError as e:
            logger.error(f"Weather API response parsing failed: {str(e)}")
            return {"error": "Invalid weather data format"}

def get_weather_for_destination(destination):
    """Helper to fetch weather for a Destination model instance."""
    service = WeatherService()
    return service.get_weather(destination.location)
