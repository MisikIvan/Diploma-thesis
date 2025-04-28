import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Product, Favorite, ViewHistory } from '../types';
import { STORAGE_KEYS, APP_CONSTANTS } from './config';

/**
 * Storage service for managing AsyncStorage operations
 */
export const StorageService = {
  /**
   * User-related storage operations
   */
  user: {
    // Save user to AsyncStorage
    saveUser: async (user: User): Promise<void> => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } catch (error) {
        console.error('Error saving user to storage:', error);
      }
    },

    // Get user from AsyncStorage
    getUser: async (): Promise<User | null> => {
      try {
        const userString = await AsyncStorage.getItem(STORAGE_KEYS.USER);
        if (!userString) return null;
        return JSON.parse(userString) as User;
      } catch (error) {
        console.error('Error getting user from storage:', error);
        return null;
      }
    },

    // Remove user from AsyncStorage
    removeUser: async (): Promise<void> => {
      try {
        await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      } catch (error) {
        console.error('Error removing user from storage:', error);
      }
    }
  },

  /**
   * Favorites-related storage operations
   */
  favorites: {
    // Save favorites to AsyncStorage
    saveFavorites: async (favorites: Favorite[]): Promise<void> => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
      } catch (error) {
        console.error('Error saving favorites to storage:', error);
      }
    },

    // Get favorites from AsyncStorage
    getFavorites: async (): Promise<Favorite[]> => {
      try {
        const favoritesString = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
        if (!favoritesString) return [];
        return JSON.parse(favoritesString) as Favorite[];
      } catch (error) {
        console.error('Error getting favorites from storage:', error);
        return [];
      }
    },

    // Add a favorite to AsyncStorage
    addFavorite: async (favorite: Favorite): Promise<Favorite[]> => {
      try {
        const favorites = await StorageService.favorites.getFavorites();
        
        // Check if product is already in favorites
        const existingIndex = favorites.findIndex(f => 
          f.productId === favorite.productId && f.userId === favorite.userId
        );
        
        if (existingIndex >= 0) {
          return favorites; // Product already in favorites
        }
        
        const updatedFavorites = [...favorites, favorite];
        await StorageService.favorites.saveFavorites(updatedFavorites);
        return updatedFavorites;
      } catch (error) {
        console.error('Error adding favorite to storage:', error);
        return [];
      }
    },

    // Remove a favorite from AsyncStorage
    removeFavorite: async (userId: string, productId: string): Promise<Favorite[]> => {
      try {
        const favorites = await StorageService.favorites.getFavorites();
        const updatedFavorites = favorites.filter(
          f => !(f.productId === productId && f.userId === userId)
        );
        await StorageService.favorites.saveFavorites(updatedFavorites);
        return updatedFavorites;
      } catch (error) {
        console.error('Error removing favorite from storage:', error);
        return [];
      }
    }
  },

  /**
   * View history-related storage operations
   */
  viewHistory: {
    // Save view history to AsyncStorage
    saveViewHistory: async (history: ViewHistory[]): Promise<void> => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.VIEW_HISTORY, JSON.stringify(history));
      } catch (error) {
        console.error('Error saving view history to storage:', error);
      }
    },

    // Get view history from AsyncStorage
    getViewHistory: async (): Promise<ViewHistory[]> => {
      try {
        const historyString = await AsyncStorage.getItem(STORAGE_KEYS.VIEW_HISTORY);
        if (!historyString) return [];
        return JSON.parse(historyString) as ViewHistory[];
      } catch (error) {
        console.error('Error getting view history from storage:', error);
        return [];
      }
    },

    // Add a product to view history
    addToViewHistory: async (userId: string, product: Product): Promise<ViewHistory[]> => {
      try {
        const history = await StorageService.viewHistory.getViewHistory();
        
        // Remove this product if it was viewed before
        const filteredHistory = history.filter(
          h => !(h.productId === product.productId && h.userId === userId)
        );
        
        // Create new view history entry
        const newEntry: ViewHistory = {
          historyId: `${userId}_${product.productId}_${Date.now()}`,
          userId,
          productId: product.productId,
          viewedAt: new Date().toISOString()
        };
        
        // Add to the beginning of the array (most recent first)
        let updatedHistory = [newEntry, ...filteredHistory];
        
        // Limit history to maximum size
        if (updatedHistory.length > APP_CONSTANTS.MAX_VIEW_HISTORY) {
          updatedHistory = updatedHistory.slice(0, APP_CONSTANTS.MAX_VIEW_HISTORY);
        }
        
        await StorageService.viewHistory.saveViewHistory(updatedHistory);
        return updatedHistory;
      } catch (error) {
        console.error('Error adding to view history:', error);
        return [];
      }
    },

    // Clear view history for a user
    clearViewHistory: async (userId: string): Promise<void> => {
      try {
        const history = await StorageService.viewHistory.getViewHistory();
        const updatedHistory = history.filter(h => h.userId !== userId);
        await StorageService.viewHistory.saveViewHistory(updatedHistory);
      } catch (error) {
        console.error('Error clearing view history:', error);
      }
    }
  }
}; 