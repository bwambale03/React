import requests
from math import radians, sin, cos, sqrt, atan2

def get_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the distance between two coordinates (in km) using the Haversine formula.

    Args:
        lat1 (float): Latitude of the first point.
        lon1 (float): Longitude of the first point.
        lat2 (float): Latitude of the second point.
        lon2 (float): Longitude of the second point.

    Returns:
        float: Distance between the two points in kilometers.
    """
    R = 6371  # Earth radius in km
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c

def get_maptiler_coordinates(location, api_key):
    """
    Fetch coordinates (latitude, longitude) for a location using the MapTiler Geocoding API.

    Args:
        location (str): The location to geocode (e.g., "New York, NY").
        api_key (str): Your MapTiler API key.

    Returns:
        tuple: A tuple of (latitude, longitude) or None if the request fails or no results are found.
    """
    url = f"https://api.maptiler.com/geocoding/{location}.json?key={api_key}"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        if data.get('features'):
            # Extract latitude and longitude from the first result
            longitude, latitude = data['features'][0]['geometry']['coordinates']
            return latitude, longitude
    
    return None