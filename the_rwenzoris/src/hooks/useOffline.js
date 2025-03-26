import { useState, useEffect } from 'react';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/offlineStorage';

export const useOffline = (key, initialData) => {
  const [data, setData] = useState(() => getFromLocalStorage(key) || initialData);

  useEffect(() => {
    saveToLocalStorage(key, data);
  }, [key, data]);

  return [data, setData];
};