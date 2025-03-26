import i18next from 'i18next';

// Initialize i18next
i18next.init({
  lng: 'en', // Default language
  resources: {
    en: {
      translation: {
        welcome: 'Welcome to The Rwenzoris',
        explore: 'Explore Destinations',
        bookNow: 'Book Now',
      },
    },
    fr: {
      translation: {
        welcome: 'Bienvenue aux Rwenzoris',
        explore: 'Explorer les Destinations',
        bookNow: 'Réserver Maintenant',
      },
    },
  },
});

// Change language dynamically
export const changeLanguage = (language) => {
  i18next.changeLanguage(language);
};

// Translate a key
export const t = (key) => i18next.t(key);
