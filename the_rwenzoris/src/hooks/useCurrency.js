import { useState, useEffect } from 'react';
import { convertCurrency } from '../utils/currencyConverter';

export const useCurrency = (amount, fromCurrency, toCurrency) => {
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const convert = async () => {
      try {
        const result = await convertCurrency(amount, fromCurrency, toCurrency);
        setConvertedAmount(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    convert();
  }, [amount, fromCurrency, toCurrency]);

  return { convertedAmount, loading, error };
};
