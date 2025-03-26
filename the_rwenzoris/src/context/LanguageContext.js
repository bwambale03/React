'use client'; // Mark as a Client Component

import { createContext, useContext, useState } from 'react';
import i18next from 'i18next';

// Initialize i18next (add your translations here)
i18next.init({
  lng: 'en',
  resources: {
    en: {
      translation: {
        explore: 'Explore',
        login: 'Login',
        logout: 'Logout',
      },
    },
    fr: {
      translation: {
        explore: 'Explorer',
        login: 'Connexion',
        logout: 'Déconnexion',
      },
    },
  },
});

// Create LanguageContext
const LanguageContext = createContext();

// LanguageProvider component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  // Change language
  const changeLanguage = (lang) => {
    i18next.changeLanguage(lang);
    setLanguage(lang);
  };

  // Translation function
  const t = (key) => i18next.t(key);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use LanguageContext
export const useLanguage = () => useContext(LanguageContext);
