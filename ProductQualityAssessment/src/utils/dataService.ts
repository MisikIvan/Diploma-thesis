import { StorageService } from './storage';
import { FirebaseService } from './firebase';
import type { User, Product, Favorite, ViewHistory, Comment } from '../types/index';


export const DataService = {

  user: {
  
    getUser: async (userId: string): Promise<User | null> => {
    
      const localUser = await StorageService.user.getUser();
      
      if (localUser && localUser.userId === userId) {
        return localUser;
      }
      
      
      const firebaseUser = await FirebaseService.users.getUser(userId);
      
     
      if (firebaseUser) {
        await StorageService.user.saveUser(firebaseUser);
      }
      
      return firebaseUser;
    },
    

    saveUser: async (user: User): Promise<void> => {
     
      await Promise.all([
        StorageService.user.saveUser(user),
        FirebaseService.users.createUser(user)
      ]);
    },
    
  
    updateUser: async (userId: string, userData: Partial<User>): Promise<void> => {
   
      const currentUser = await DataService.user.getUser(userId);
      
      if (!currentUser) {
        throw new Error('User not found');
      }
      
    
      const updatedUser = { ...currentUser, ...userData };
      
    
      await Promise.all([
        StorageService.user.saveUser(updatedUser),
        FirebaseService.users.updateUser(userId, userData)
      ]);
    },
    
  
    signOut: async (): Promise<void> => {
      await Promise.all([
        StorageService.user.removeUser(),
        FirebaseService.auth.signOut()
      ]);
    }
  },
  

  products: {

    getProduct: async (productId: string): Promise<Product | null> => {
      return FirebaseService.products.getProduct(productId);
    },
    
 
    getProductsByCategory: async (category: string): Promise<Product[]> => {
      return FirebaseService.products.getProductsByCategory(category);
    },
    
  
    searchProducts: async (searchTerm: string, maxResults = 20): Promise<Product[]> => {
      return FirebaseService.products.searchProducts(searchTerm, maxResults);
    }
  },
  
 
  favorites: {
   
    getUserFavorites: async (userId: string): Promise<Favorite[]> => {
      console.log(`DataService: Getting favorites for user ${userId}`);
      
      try {
      
        const remoteFavorites = await FirebaseService.favorites.getUserFavorites(userId);
        console.log(`DataService: Got ${remoteFavorites.length} favorites from Firebase`);
        
      
        if (remoteFavorites.length > 0) {
          try {
     
            const localFavorites = await StorageService.favorites.getFavorites();
            
     
            const otherUserFavorites = localFavorites.filter(f => f.userId !== userId);
            
        
            const updatedFavorites = [...otherUserFavorites, ...remoteFavorites];
            
    
            await StorageService.favorites.saveFavorites(updatedFavorites);
            console.log(`DataService: Updated local storage with ${remoteFavorites.length} favorites from Firebase`);
          } catch (storageError) {
            console.error(`DataService: Error updating local storage:`, storageError);
          }
        }
        
        return remoteFavorites;
      } catch (firebaseError) {
        console.error(`DataService: Failed to get favorites from Firebase:`, firebaseError);
        
 
        try {
          const localFavorites = await StorageService.favorites.getFavorites();
          const userFavorites = localFavorites.filter(fav => fav.userId === userId);
          console.log(`DataService: Using ${userFavorites.length} favorites from local storage`);
          return userFavorites;
        } catch (storageError) {
          console.error(`DataService: Error getting favorites from local storage:`, storageError);
          return [];
        }
      }
    },
    

    isFavorite: async (userId: string, productId: string): Promise<boolean> => {
      console.log(`DataService: Checking if product ${productId} is favorite for user ${userId}`);
      
      try {
     
        const isFav = await FirebaseService.favorites.isFavorite(userId, productId);
        console.log(`DataService: Firebase says product is favorite: ${isFav}`);
        return isFav;
      } catch (firebaseError) {
        console.error(`DataService: Error checking favorite status in Firebase:`, firebaseError);
        
     
        try {
          const localFavorites = await StorageService.favorites.getFavorites();
          const isLocalFavorite = localFavorites.some(
            fav => fav.userId === userId && fav.productId === productId
          );
          console.log(`DataService: Local storage says product is favorite: ${isLocalFavorite}`);
          return isLocalFavorite;
        } catch (storageError) {
          console.error(`DataService: Error checking favorite in local storage:`, storageError);
          return false;
        }
      }
    },
    
   
    clearCache: async (): Promise<void> => {
      try {
        console.log(`DataService: Clearing favorites cache`);
        return Promise.resolve();
      } catch (error) {
        console.error('Error clearing favorites cache:', error);
        return Promise.resolve();
      }
    },
  
    addFavorite: async (favorite: Favorite): Promise<Favorite[]> => {
      console.log(`DataService: Adding product ${favorite.productId} to favorites for user ${favorite.userId}`);
      
      try {
      
        const favoriteId = await FirebaseService.favorites.addFavorite(favorite);
        console.log(`DataService: Added to Firebase with ID: ${favoriteId}`);
        
     
        const favoriteWithId = {
          ...favorite,
          favoriteId
        };
        
  
        const localFavorites = await StorageService.favorites.getFavorites();
        
    
        const existingIndex = localFavorites.findIndex(
          f => f.userId === favorite.userId && f.productId === favorite.productId
        );
        
        let updatedFavorites;
        if (existingIndex >= 0) {
  
          updatedFavorites = [...localFavorites];
          updatedFavorites[existingIndex] = favoriteWithId;
        } else {
     
          updatedFavorites = [...localFavorites, favoriteWithId];
        }
        
        await StorageService.favorites.saveFavorites(updatedFavorites);
        console.log(`DataService: Updated local storage with new favorite`);
        
     
        return updatedFavorites.filter(f => f.userId === favorite.userId);
      } catch (error) {
        console.error(`DataService: Error adding favorite:`, error);
        
     
        try {
          const updatedLocalFavorites = await StorageService.favorites.addFavorite(favorite);
          console.log(`DataService: Added to local storage only (Firebase failed)`);
          return updatedLocalFavorites;
        } catch (storageError) {
          console.error(`DataService: Local storage fallback failed:`, storageError);
          return [];
        }
      }
    },
    
    removeFavorite: async (userId: string, productId: string): Promise<Favorite[]> => {
      console.log(`DataService: Removing product ${productId} from favorites for user ${userId}`);
      
      try {

        await FirebaseService.favorites.removeFavoriteByUserAndProduct(userId, productId);
        console.log(`DataService: Successfully removed favorite from Firebase`);
      } catch (firebaseError) {
        console.error(`DataService: Error removing from Firebase:`, firebaseError);
      }
      
    
      try {
        const localFavorites = await StorageService.favorites.getFavorites();
        console.log(`DataService: Local storage has ${localFavorites.length} favorites before removal`);
        
        const updatedFavorites = localFavorites.filter(
          f => !(f.userId === userId && f.productId === productId)
        );
        
        await StorageService.favorites.saveFavorites(updatedFavorites);
        console.log(`DataService: Local storage has ${updatedFavorites.length} favorites after removal`);
        
 
        try {
       
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const freshFavorites = await FirebaseService.favorites.getUserFavorites(userId);
          console.log(`DataService: Verified ${freshFavorites.length} favorites remain in Firebase`);
          
       
          return freshFavorites;
        } catch (verifyError) {
          console.error(`DataService: Error verifying Firebase favorites:`, verifyError);
          
     
          return updatedFavorites.filter(f => f.userId === userId);
        }
      } catch (localError) {
        console.error(`DataService: Error updating local storage:`, localError);
        return [];
      }
    }
  },
  

  viewHistory: {
  
    getUserViewHistory: async (userId: string, maxResults = 50): Promise<ViewHistory[]> => {
    
      const localHistory = await StorageService.viewHistory.getViewHistory();
      const userHistory = localHistory
        .filter(h => h.userId === userId)
        .sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime())
        .slice(0, maxResults);
      
   
      try {
        const remoteHistory = await FirebaseService.viewHistory.getUserViewHistory(userId, maxResults);
        
       
        if (remoteHistory && remoteHistory.length > 0) {
         
          const allHistory = [...localHistory];
          
        
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
          
         
          await StorageService.viewHistory.saveViewHistory(allHistory);
          
       
          return allHistory
            .filter(h => h.userId === userId)
            .sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime())
            .slice(0, maxResults);
        }
      } catch (error) {
        console.error('Error getting remote view history:', error);
      
      }
      
      return userHistory;
    },
    
  
    addToViewHistory: async (userId: string, product: Product): Promise<ViewHistory[]> => {
      
      const viewHistory: ViewHistory = {
        historyId: `${userId}_${product.productId}_${Date.now()}`,
        userId,
        productId: product.productId,
        viewedAt: new Date().toISOString()
      };
      
  
      const makeProductStorageCompatible = (p: Product) => {
        return {
          ...p,
     
          imageUrl: p.imageUrl || '',
          description: p.description || '',
          
      
          nutriscoreScore: p.nutriscoreScore ?? 0,
          weight: p.weight ?? 0,
          
        
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
      
    
      const updatedLocalHistory = await StorageService.viewHistory.addToViewHistory(
        userId, 
        makeProductStorageCompatible(product) as any 
      );

      FirebaseService.viewHistory.addToViewHistory(viewHistory)
        .catch(error => console.error('Error adding view history to Firebase:', error));
      
      return updatedLocalHistory;
    },
    

    clearViewHistory: async (userId: string): Promise<void> => {
   
      await StorageService.viewHistory.clearViewHistory(userId);
      
  
      try {
        await FirebaseService.viewHistory.clearUserViewHistory(userId);
      } catch (error) {
        console.error('Error clearing view history from Firebase:', error);
      }
    }
  },
  

  comments: {

    getProductComments: async (productId: string): Promise<Comment[]> => {
      return FirebaseService.comments.getProductComments(productId);
    },
    
  
    addComment: async (comment: Comment): Promise<string> => {
      return FirebaseService.comments.addComment(comment);
    }
  }
}; 