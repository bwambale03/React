// Fetch real-time exchange rates (using a free API like exchangerate-api.com)
const fetchExchangeRates = async () => {
    const apiKey = 'YOUR_EXCHANGE_RATE_API_KEY'; // Replace with a real API key
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
    return response.json();
  };
  
  // Convert currency based on real-time rates
  export const convertCurrency = async (amount, fromCurrency, toCurrency) => {
    const rates = await fetchExchangeRates();
    if (!rates.conversion_rates[fromCurrency] || !rates.conversion_rates[toCurrency]) {
      throw new Error('Unsupported currency conversion');
    }
    return (amount / rates.conversion_rates[fromCurrency]) * rates.conversion_rates[toCurrency];
  };
  