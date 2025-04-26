import { ProductCategory } from '../types';

export const CATEGORIES: ProductCategory[] = [
  { id: 'drinks', name: 'Напої', icon: '🥤' },
  { id: 'bakery', name: 'Випічка', icon: '🥐' },
  { id: 'dairy', name: 'Молочні продукти', icon: '🥛' },
  { id: 'meat', name: 'Мясо', icon: '🥩' },
  { id: 'fish', name: 'Риба', icon: '🐟' },
  { id: 'produce', name: 'Овочі/Фрукти', icon: '🥦' },
  { id: 'snacks', name: 'Снэки', icon: '🍿' },
  { id: 'eggs', name: 'Яйця', icon: '🥚' },
  { id: 'ready_meals', name: 'Готові блюда', icon: '🍱' },
];

export const NUTRITION_SCORE_COLORS = {
  A: '#2ECC71', // Green
  B: '#F1C40F', // Yellow
  C: '#E67E22', // Orange
  D: '#E74C3C', // Red
  E: '#95A5A6', // Gray
};

export const NUTRITION_SCORE_RANGES = {
  A: { min: 80, max: 100 },
  B: { min: 60, max: 79 },
  C: { min: 40, max: 59 },
  D: { min: 20, max: 39 },
  E: { min: 0, max: 19 },
};

export const SORT_OPTIONS = [
  { id: 'nutrition', label: 'По рейтингу' },
  { id: 'popularity', label: 'По популярності' },
  { id: 'date', label: 'По даті додавання' },
];

export const COMMENT_SORT_OPTIONS = [
  { id: 'date', label: 'По даті' },
  { id: 'rating', label: 'По рейтингу' },
  { id: 'usefulness', label: 'По корисності' },
];

export const PASSWORD_MIN_LENGTH = 8;

export const MAX_RECENT_PRODUCTS = 5;

export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  USERS: '/api/users',
  COMMENTS: '/api/comments',
  FAVORITES: '/api/favorites',
  RECENT: '/api/recent-views',
  AUTH: '/api/auth',
};

export const FIREBASE_CONFIG = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
}; 