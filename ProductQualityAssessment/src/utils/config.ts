// API endpoints
export const API = {
  // Base URL for our backend
  BASE_URL: 'https://productqualityapp-api.example.com',
  
  // Open Food Facts API
  OPEN_FOOD_FACTS: {
    BASE_URL: 'https://world.openfoodfacts.org/api/v0',
    PRODUCT: '/product', // /{barcode}.json
    SEARCH: '/search.pl', // ?search_terms=query&json=1
  },
};

// Firebase config 
export const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "productqualityapp.firebaseapp.com",
  projectId: "productqualityapp",
  storageBucket: "productqualityapp.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Local storage keys
export const STORAGE_KEYS = {
  USER: 'ProductQualityApp_user',
  FAVORITES: 'ProductQualityApp_favorites',
  VIEW_HISTORY: 'ProductQualityApp_viewHistory',
  THEME: 'ProductQualityApp_theme',
};

// App constants
export const APP_CONSTANTS = {
  MAX_VIEW_HISTORY: 50, // Maximum number of items in view history
  MAX_RECENT_PRODUCTS: 5, // Maximum number of recent products to show
  DEBOUNCE_SEARCH: 300, // Debounce time for search input in ms
  DEFAULT_IMAGE: 'https://via.placeholder.com/300x300?text=No+Image',
};

// Product categories with icons
export const PRODUCT_CATEGORIES = [
  { id: 'beverages', name: 'Beverages', icon: '🥤' },
  { id: 'bread', name: 'Bread & Bakery', icon: '🥐' },
  { id: 'dairy', name: 'Dairy', icon: '🥛' },
  { id: 'meat', name: 'Meat', icon: '🥩' },
  { id: 'fish', name: 'Fish', icon: '🐟' },
  { id: 'produce', name: 'Fruits & Vegetables', icon: '🥦' },
  { id: 'snacks', name: 'Snacks', icon: '🍿' },
  { id: 'eggs', name: 'Eggs', icon: '🥚' },
  { id: 'meals', name: 'Ready Meals', icon: '🍱' },
]; 