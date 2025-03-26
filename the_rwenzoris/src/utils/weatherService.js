// Fetch weather data for a specific location
export const fetchWeather = async (location) => {
    const apiKey = 'YOUR_WEATHER_API_KEY'; // Replace with a real API key
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`
    );
    return response.json();
  };