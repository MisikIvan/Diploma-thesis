import { StorageService } from './storage';
import { FirebaseService } from './firebase';
import type { User, Product, Favorite, ViewHistory, Comment } from '../types/index';

/**
 * DataService combines AsyncStorage and Firebase Firestore
 * - Uses AsyncStorage for fast local access
 * - Uses Firebase for cloud synchronization and backup
 */
export const DataService = {
  /**
   * User-related operations
   */
  user: {
    /**
     * Get user data, prioritizing local storage for speed
     */
    getUser: async (userId: string): Promise<User | null> => {
      // Try to get from local storage first (faster)
      const localUser = await StorageService.user.getUser();
      
      if (localUser && localUser.userId === userId) {
        return localUser;
      }
      
      // If not in local storage, get from Firebase
      const firebaseUser = await FirebaseService.users.getUser(userId);
      
      // Update local storage for future fast access
      if (firebaseUser) {
        await StorageService.user.saveUser(firebaseUser);
      }
      
      return firebaseUser;
    },
    
    /**
     * Save user data to both local storage and Firebase
     */
    saveUser: async (user: User): Promise<void> => {
      // Save to both places in parallel
      await Promise.all([
        StorageService.user.saveUser(user),
        FirebaseService.users.createUser(user)
      ]);
    },
    
    /**
     * Update user data in both local storage and Firebase
     */
    updateUser: async (userId: string, userData: Partial<User>): Promise<void> => {
      // Get current user data
      const currentUser = await DataService.user.getUser(userId);
      
      if (!currentUser) {
        throw new Error('User not found');
      }
      
      // Update user data
      const updatedUser = { ...currentUser, ...userData };
      
      // Save updated user to both storages
      await Promise.all([
        StorageService.user.saveUser(updatedUser),
        FirebaseService.users.updateUser(userId, userData)
      ]);
    },
    
    /**
     * Remove user from local storage, but keep in Firebase for records
     */
    signOut: async (): Promise<void> => {
      await Promise.all([
        StorageService.user.removeUser(),
        FirebaseService.auth.signOut()
      ]);
    }
  },
  
  /**
   * Product-related operations
   */
  products: {
    /**
     * Get product by ID, using Firebase only as products are maintained centrally
     */
    getProduct: async (productId: string): Promise<Product | null> => {
      return FirebaseService.products.getProduct(productId);
    },
    
    /**
     * Get products by category from Firebase
     */
    getProductsByCategory: async (category: string): Promise<Product[]> => {
      return FirebaseService.products.getProductsByCategory(category);
    },
    
    /**
     * Search products using Firebase
     */
    searchProducts: async (searchTerm: string, maxResults = 20): Promise<Product[]> => {
      return FirebaseService.products.searchProducts(searchTerm, maxResults);
    }
  },
  
  /**
   * Favorites-related operations
   */
  favorites: {
    /**
     * Get user favorites with local caching
     */
    getUserFavorites: async (userId: string): Promise<Favorite[]> => {
      // Get local favorites first for immediate display
      const localFavorites = await StorageService.favorites.getFavorites();
      const userFavorites = localFavorites.filter(fav => fav.userId === userId);
      
      // Get remote favorites (might have changes from other devices)
      try {
        const remoteFavorites = await FirebaseService.favorites.getUserFavorites(userId);
        
        // If remote favorites exist, update local storage and return remote data
        if (remoteFavorites && remoteFavorites.length > 0) {
          // Merge local and remote favorites (deduplicating by product ID)
          const allFavorites = [...localFavorites];
          
          // Add new remote favorites that don't exist locally
          for (const remoteFav of remoteFavorites) {
            const exists = allFavorites.some(
              fav => fav.productId === remoteFav.productId && fav.userId === remoteFav.userId
            );
            
            if (!exists) {
              allFavorites.push(remoteFav);
            }
          }
          
          // Update local storage with merged data
          await StorageService.favorites.saveFavorites(allFavorites);
          
          // Return user's favorites
          return allFavorites.filter(fav => fav.userId === userId);
        }
      } catch (error) {
        console.error('Error getting remote favorites:', error);
        // If remote fails, we'll still have local data
      }
      
      return userFavorites;
    },
    
    /**
     * Add a favorite to both storages
     */
    addFavorite: async (favorite: Favorite): Promise<Favorite[]> => {
      // Add to local storage first for immediate feedback
      const updatedLocalFavorites = await StorageService.favorites.addFavorite(favorite);
      
      // Then add to Firebase (don't wait for this to complete before returning)
      FirebaseService.favorites.addFavorite(favorite)
        .catch(error => console.error('Error adding favorite to Firebase:', error));
      
      return updatedLocalFavorites;
    },
    
    /**
     * Remove a favorite from both storages
     */
    removeFavorite: async (userId: string, productId: string): Promise<Favorite[]> => {
      // Remove from local storage first
      const updatedLocalFavorites = await StorageService.favorites.removeFavorite(userId, productId);
      
      // Find favorites in Firebase to remove
      try {
        const q = await FirebaseService.favorites.isFavorite(userId, productId);
        if (q) {
          // This is a simplified approach - in production you would need to get the favoriteId first
          // This implementation assumes favorites are stored with favoriteId in a way we can query them
          FirebaseService.favorites.getUserFavorites(userId)
            .then(favorites => {
              const favorite = favorites.find(f => f.productId === productId && f.userId === userId);
              if (favorite && favorite.favoriteId) {
                return FirebaseService.favorites.removeFavorite(favorite.favoriteId);
              }
            })
            .catch(error => console.error('Error removing favorite from Firebase:', error));
        }
      } catch (error) {
        console.error('Error checking favorite in Firebase:', error);
      }
      
      return updatedLocalFavorites;
    }
  },
  
  /**
   * View history-related operations
   */
  viewHistory: {
    /**
     * Get user view history with local caching
     */
    getUserViewHistory: async (userId: string, maxResults = 50): Promise<ViewHistory[]> => {
      // Get local history first for immediate display
      const localHistory = await StorageService.viewHistory.getViewHistory();
      const userHistory = localHistory
        .filter(h => h.userId === userId)
        .sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime())
        .slice(0, maxResults);
      
      // Get remote history (might have changes from other devices)
      try {
        const remoteHistory = await FirebaseService.viewHistory.getUserViewHistory(userId, maxResults);
        
        // If remote history exists, update local storage and return remote data
        if (remoteHistory && remoteHistory.length > 0) {
          // Merge local and remote histories (deduplicating by product ID and timestamp)
          const allHistory = [...localHistory];
          
          // Add new remote history items that don't exist locally
          for (const remoteItem of remoteHistory) {
            const exists = allHistory.some(
              item => item.productId === remoteItem.productId && 
                     item.userId === remoteItem.userId &&
                     item.viewedAt === remoteItem.viewedAt
            );
            
            if (!exists) {
              allHistory.push(remoteItem);
            }
          }
          
          // Update local storage with merged data
          await StorageService.viewHistory.saveViewHistory(allHistory);
          
          // Return user's history, sorted and limited
          return allHistory
            .filter(h => h.userId === userId)
            .sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime())
            .slice(0, maxResults);
        }
      } catch (error) {
        console.error('Error getting remote view history:', error);
        // If remote fails, we'll still have local data
      }
      
      return userHistory;
    },
    
    /**
     * Add to view history in both storages
     */
    addToViewHistory: async (userId: string, product: Product): Promise<ViewHistory[]> => {
      // Create view history entry
      const viewHistory: ViewHistory = {
        historyId: `${userId}_${product.productId}_${Date.now()}`,
        userId,
        productId: product.productId,
        viewedAt: new Date().toISOString()
      };
      
      // Create a copy of the product with all optional fields set to non-optional values
      // This function ensures compatibility with the StorageService
      const makeProductStorageCompatible = (p: Product) => {
        return {
          ...p,
          // Fix optional string properties
          imageUrl: p.imageUrl || '',
          description: p.description || '',
          
          // Fix optional number properties
          nutriscoreScore: p.nutriscoreScore ?? 0,
          weight: p.weight ?? 0,
          
          // Fix nested optional properties
          nutriments: {
            ...p.nutriments,
            salt: p.nutriments.salt ?? 0,
            fats: {
              ...p.nutriments.fats,
              saturated: p.nutriments.fats.saturated ?? 0,
              unsaturated: p.nutriments.fats.unsaturated ?? 0
            },
            carbohydrates: {
              ...p.nutriments.carbohydrates,
              sugar: p.nutriments.carbohydrates.sugar ?? 0
            }
          }
        };
      };
      
      // Add to local storage first for immediate feedback
      const updatedLocalHistory = await StorageService.viewHistory.addToViewHistory(
        userId, 
        makeProductStorageCompatible(product) as any // Use type assertion as a last resort
      );
      
      // Then add to Firebase (don't wait for this to complete before returning)
      FirebaseService.viewHistory.addToViewHistory(viewHistory)
        .catch(error => console.error('Error adding view history to Firebase:', error));
      
      return updatedLocalHistory;
    },
    
    /**
     * Clear view history from both storages
     */
    clearViewHistory: async (userId: string): Promise<void> => {
      // Clear from local storage
      await StorageService.viewHistory.clearViewHistory(userId);
      
      // Clear from Firebase
      try {
        await FirebaseService.viewHistory.clearUserViewHistory(userId);
      } catch (error) {
        console.error('Error clearing view history from Firebase:', error);
      }
    }
  },
  
  /**
   * Comments-related operations (Firebase only, no local caching needed)
   */
  comments: {
    /**
     * Get product comments from Firebase
     */
    getProductComments: async (productId: string): Promise<Comment[]> => {
      return FirebaseService.comments.getProductComments(productId);
    },
    
    /**
     * Add a comment to Firebase
     */
    addComment: async (comment: Comment): Promise<string> => {
      return FirebaseService.comments.addComment(comment);
    }
  }
}; 