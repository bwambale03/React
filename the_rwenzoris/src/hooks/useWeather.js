import { useState, useEffect } from 'react';
import { fetchWeather } from '../utils/weatherService';

export const useWeather = (location) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getWeather = async () => {
      try {
        const data = await fetchWeather(location);
        setWeather(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    getWeather();
  }, [location]);

  return { weather, loading, error };
};
