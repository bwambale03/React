from core.utils.geolocation import get_maptiler_coordinates

def test_get_maptiler_coordinates():
    api_key = "your_maptiler_api_key"  # Replace with your actual API key
    coordinates = get_maptiler_coordinates("Paris, France", api_key=api_key)
    if coordinates:
        latitude, longitude = coordinates
        print(f"Latitude: {latitude}, Longitude: {longitude}")
    else:
        print("Failed to fetch coordinates.")

if __name__ == "__main__":
    test_get_maptiler_coordinates()
