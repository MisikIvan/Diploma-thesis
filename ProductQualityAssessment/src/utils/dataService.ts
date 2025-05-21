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
     
      const localFavorites = await StorageService.favorites.getFavorites();
      const userFavorites = localFavorites.filter(fav => fav.userId === userId);
      
    
      try {
        const remoteFavorites = await FirebaseService.favorites.getUserFavorites(userId);
        
      
        if (remoteFavorites && remoteFavorites.length > 0) {
         
          const allFavorites = [...localFavorites];
          
       
          for (const remoteFav of remoteFavorites) {
            const exists = allFavorites.some(
              fav => fav.productId === remoteFav.productId && fav.userId === remoteFav.userId
            );
            
            if (!exists) {
              allFavorites.push(remoteFav);
            }
          }
          
         
          await StorageService.favorites.saveFavorites(allFavorites);
          
       
          return allFavorites.filter(fav => fav.userId === userId);
        }
      } catch (error) {
        console.error('Error getting remote favorites:', error);
     
      }
      
      return userFavorites;
    },
    
  
    addFavorite: async (favorite: Favorite): Promise<Favorite[]> => {
   
      const updatedLocalFavorites = await StorageService.favorites.addFavorite(favorite);
      
     
      FirebaseService.favorites.addFavorite(favorite)
        .catch(error => console.error('Error adding favorite to Firebase:', error));
      
      return updatedLocalFavorites;
    },
    
  
    removeFavorite: async (userId: string, productId: string): Promise<Favorite[]> => {
    
      const updatedLocalFavorites = await StorageService.favorites.removeFavorite(userId, productId);
      
    
      try {
        const q = await FirebaseService.favorites.isFavorite(userId, productId);
        if (q) {

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