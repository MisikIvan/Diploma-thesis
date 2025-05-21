import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Product, Favorite, ViewHistory } from '../types';
import { STORAGE_KEYS, APP_CONSTANTS } from './config';


export const StorageService = {

  user: {
   
    saveUser: async (user: User): Promise<void> => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } catch (error) {
        console.error('Error saving user to storage:', error);
      }
    },

    
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

  
    removeUser: async (): Promise<void> => {
      try {
        await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      } catch (error) {
        console.error('Error removing user from storage:', error);
      }
    }
  },

 
  favorites: {
  
    saveFavorites: async (favorites: Favorite[]): Promise<void> => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
      } catch (error) {
        console.error('Error saving favorites to storage:', error);
      }
    },

   
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

 
    addFavorite: async (favorite: Favorite): Promise<Favorite[]> => {
      try {
        const favorites = await StorageService.favorites.getFavorites();
        
   
        const existingIndex = favorites.findIndex(f => 
          f.productId === favorite.productId && f.userId === favorite.userId
        );
        
        if (existingIndex >= 0) {
          return favorites; 
        }
        
        const updatedFavorites = [...favorites, favorite];
        await StorageService.favorites.saveFavorites(updatedFavorites);
        return updatedFavorites;
      } catch (error) {
        console.error('Error adding favorite to storage:', error);
        return [];
      }
    },

   
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

 
  viewHistory: {
    
    saveViewHistory: async (history: ViewHistory[]): Promise<void> => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.VIEW_HISTORY, JSON.stringify(history));
      } catch (error) {
        console.error('Error saving view history to storage:', error);
      }
    },

   
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

   
    addToViewHistory: async (userId: string, product: Product): Promise<ViewHistory[]> => {
      try {
        const history = await StorageService.viewHistory.getViewHistory();
        
      
        const filteredHistory = history.filter(
          h => !(h.productId === product.productId && h.userId === userId)
        );
        
     
        const newEntry: ViewHistory = {
          historyId: `${userId}_${product.productId}_${Date.now()}`,
          userId,
          productId: product.productId,
          viewedAt: new Date().toISOString()
        };
        
      
        let updatedHistory = [newEntry, ...filteredHistory];
        
     
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