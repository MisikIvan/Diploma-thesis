export const API = {
  BASE_URL: process.env.EXPO_PUBLIC_BASE_URL || 'https://productqualityapp-api.example.com',
  
  OPEN_FOOD_FACTS: {
    BASE_URL: process.env.EXPO_PUBLIC_OPEN_FOOD_FACTS_BASE_URL || 'https://world.openfoodfacts.org/api/v0',
    PRODUCT: '/product', 
    SEARCH: '/search.pl', 
  },
};

export const FIREBASE_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || ""
};

export const STORAGE_KEYS = {
  USER: 'ProductQualityApp_user',
  FAVORITES: 'ProductQualityApp_favorites',
  VIEW_HISTORY: 'ProductQualityApp_viewHistory',
  THEME: 'ProductQualityApp_theme',
};

export const APP_CONSTANTS = {
  MAX_VIEW_HISTORY: parseInt(process.env.EXPO_PUBLIC_MAX_VIEW_HISTORY || '50'), 
  MAX_RECENT_PRODUCTS: parseInt(process.env.EXPO_PUBLIC_MAX_RECENT_PRODUCTS || '5'), 
  DEBOUNCE_SEARCH: parseInt(process.env.EXPO_PUBLIC_DEBOUNCE_SEARCH || '300'), 
  DEFAULT_IMAGE: process.env.EXPO_PUBLIC_DEFAULT_IMAGE || 'https://via.placeholder.com/300x300?text=No+Image',
}; 