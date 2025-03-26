// Save data to localStorage
export const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };
  
  // Retrieve data from localStorage
  export const getFromLocalStorage = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  };
  
  // Clear cached data
  export const clearLocalStorage = (key) => {
    localStorage.removeItem(key);
  };
  