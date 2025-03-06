import os
import requests
from flask import current_app
from typing import Optional, Tuple

# Load MapTiler API key from environment or Flask config
MAPTILER_API_KEY = os.getenv('MAPTILER_API_KEY') or current_app.config.get('MAPTILER_API_KEY')

def get_maptiler_coordinates(location: str, api_key: Optional[str] = None) -> Tuple[Optional[float], Optional[float]]:
    """
    Fetch coordinates (latitude, longitude) for a location using the MapTiler Geocoding API.

    Args:
        location (str): The location to geocode (e.g., "New York, NY").
        api_key (str, optional): Your MapTiler API key. Defaults to the key in the environment or Flask config.

    Returns:
        Tuple[Optional[float], Optional[float]]: A tuple of (latitude, longitude) or (None, None) if the request fails.
    """
    if not api_key:
        api_key = MAPTILER_API_KEY

    if not api_key:
        raise ValueError("MapTiler API key is required. Set it in your .env file or Flask config.")

    base_url = "https://api.maptiler.com/geocoding"
    endpoint = f"{base_url}/{location}.json?key={api_key}"

    try:
        response = requests.get(endpoint)
        response.raise_for_status()  # Raise an exception for HTTP errors
        data = response.json()

        if data.get('features'):
            # Extract latitude and longitude from the first result
            longitude, latitude = data['features'][0]['geometry']['coordinates']
            return latitude, longitude
        else:
            # No results found
            return None, None
    except requests.exceptions.RequestException as e:
        # Handle network or API errors
        print(f"Error fetching coordinates from MapTiler: {e}")
        return None, None

def get_maptiler_static_map(latitude: float, longitude: float, zoom: int = 12, width: int = 600, height: int = 400) -> Optional[str]:
    """
    Generate a URL for a static map image using the MapTiler Static Maps API.

    Args:
        latitude (float): Latitude of the map center.
        longitude (float): Longitude of the map center.
        zoom (int, optional): Zoom level (0-22). Defaults to 12.
        width (int, optional): Width of the image in pixels. Defaults to 600.
        height (int, optional): Height of the image in pixels. Defaults to 400.

    Returns:
        Optional[str]: The URL of the static map image, or None if the API key is missing.
    """
    if not MAPTILER_API_KEY:
        return None

    base_url = "https://api.maptiler.com/maps/streets-v2/static"
    marker = f"pin-s+ff0000({longitude},{latitude})"
    endpoint = f"{base_url}/{longitude},{latitude},{zoom}/{width}x{height}.png?key={MAPTILER_API_KEY}"

    return endpoint
