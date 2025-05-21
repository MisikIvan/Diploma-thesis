
import type { TranslationKeys } from './translations';

export const API = {
 
  BASE_URL: 'https://productqualityapp-api.example.com',
  
 
  OPEN_FOOD_FACTS: {
    BASE_URL: 'https://world.openfoodfacts.org/api/v0',
    PRODUCT: '/product', 
    SEARCH: '/search.pl', 
  },
};


export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyB6tU6iVSC6vRBdfsWDknt-qXAL4cjZNco",
  authDomain: "productqualityassessment.firebaseapp.com",
  projectId: "productqualityassessment",
  storageBucket: "productqualityassessment.firebasestorage.app",
  messagingSenderId: "403026447266",
  appId: "1:403026447266:web:be8dff870c9581bda5c0fb",
  measurementId: "G-E106SS4E4W"
};


export const STORAGE_KEYS = {
  USER: 'ProductQualityApp_user',
  FAVORITES: 'ProductQualityApp_favorites',
  VIEW_HISTORY: 'ProductQualityApp_viewHistory',
  THEME: 'ProductQualityApp_theme',
};


export const APP_CONSTANTS = {
  MAX_VIEW_HISTORY: 50, 
  MAX_RECENT_PRODUCTS: 5, 
  DEBOUNCE_SEARCH: 300, 
  DEFAULT_IMAGE: 'https://via.placeholder.com/300x300?text=No+Image',
};


interface CategoryItem {
  id: string;
  nameKey: keyof TranslationKeys;
  icon: string;
}

export const PRODUCT_CATEGORIES: CategoryItem[] = [
  { id: 'beverages', nameKey: 'beverageCategory', icon: '🥤' },
  { id: 'bread', nameKey: 'breadCategory', icon: '🥐' },
  { id: 'dairy', nameKey: 'dairyCategory', icon: '🥛' },
  { id: 'meat', nameKey: 'meatCategory', icon: '🥩' },
  { id: 'fish', nameKey: 'fishCategory', icon: '🐟' },
  { id: 'produce', nameKey: 'produceCategory', icon: '🥦' },
  { id: 'snacks', nameKey: 'snacksCategory', icon: '🍿' },
  { id: 'eggs', nameKey: 'eggsCategory', icon: '🥚' },
  { id: 'meals', nameKey: 'mealsCategory', icon: '🍱' },
]; 