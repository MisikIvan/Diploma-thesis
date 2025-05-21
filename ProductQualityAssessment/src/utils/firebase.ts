import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  addDoc,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { 
  getAuth,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  User as FirebaseUser,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { FIREBASE_CONFIG } from './config';
import type { User, Product, Favorite, ViewHistory, Comment } from '../types/index';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);
const auth = getAuth(app);


if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence)
    .catch(error => {
      console.error('Error setting auth persistence:', error);
    });
}


const AuthStorage = {
  setUser: async (user: FirebaseUser | null) => {
    try {
      if (user) {
        await AsyncStorage.setItem('auth_user', JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        }));
      } else {
        await AsyncStorage.removeItem('auth_user');
      }
    } catch (error) {
      console.error('Error storing auth state in AsyncStorage:', error);
    }
  },
  
  getUser: async (): Promise<{uid: string, email: string | null, displayName: string | null} | null> => {
    try {
      const userData = await AsyncStorage.getItem('auth_user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error retrieving auth state from AsyncStorage:', error);
      return null;
    }
  }
};


auth.onAuthStateChanged(user => {
  AuthStorage.setUser(user);
});


export const FirebaseService = {

  auth: {
    getCurrentUser: (): FirebaseUser | null => {
      return auth.currentUser;
    },

    signIn: async (email: string, password: string): Promise<FirebaseUser> => {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await AuthStorage.setUser(userCredential.user);
      return userCredential.user;
    },

    signUp: async (email: string, password: string, displayName: string): Promise<FirebaseUser> => {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      await AuthStorage.setUser(userCredential.user);
      return userCredential.user;
    },

    signOut: async (): Promise<void> => {
      await signOut(auth);
      await AuthStorage.setUser(null);
    }
  },

 
  users: {
    createUser: async (user: User): Promise<void> => {
      await setDoc(doc(db, 'users', user.userId), user);
    },

    getUser: async (userId: string): Promise<User | null> => {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data() as User;
      }
      return null;
    },

    updateUser: async (userId: string, userData: Partial<User>): Promise<void> => {
      await updateDoc(doc(db, 'users', userId), userData);
    }
  },

 
  products: {
    getProduct: async (productId: string): Promise<Product | null> => {
      const productDoc = await getDoc(doc(db, 'products', productId));
      if (productDoc.exists()) {
        return productDoc.data() as Product;
      }
      return null;
    },

    saveProduct: async (product: Product): Promise<void> => {
      await setDoc(doc(db, 'products', product.productId), product);
    },

    getProductsByCategory: async (category: string): Promise<Product[]> => {
      const q = query(
        collection(db, 'products'),
        where('categories', 'array-contains', category)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as Product);
    },

    searchProducts: async (searchTerm: string, maxResults = 20): Promise<Product[]> => {
    
      const q = query(
        collection(db, 'products'),
        where('name', '>=', searchTerm),
        where('name', '<=', searchTerm + '\uf8ff'),
        limit(maxResults)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as Product);
    }
  },


  favorites: {
    getUserFavorites: async (userId: string): Promise<Favorite[]> => {
      const q = query(
        collection(db, 'favorites'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as Favorite);
    },

    addFavorite: async (favorite: Favorite): Promise<string> => {
      const docRef = await addDoc(collection(db, 'favorites'), {
        ...favorite,
        addedAt: Timestamp.now().toDate().toISOString()
      });
      return docRef.id;
    },

    removeFavorite: async (favoriteId: string): Promise<void> => {
      await deleteDoc(doc(db, 'favorites', favoriteId));
    },

    isFavorite: async (userId: string, productId: string): Promise<boolean> => {
      const q = query(
        collection(db, 'favorites'),
        where('userId', '==', userId),
        where('productId', '==', productId),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    }
  },

 
  viewHistory: {
    addToViewHistory: async (viewHistory: ViewHistory): Promise<string> => {
      const docRef = await addDoc(collection(db, 'viewHistory'), viewHistory);
      return docRef.id;
    },

    getUserViewHistory: async (userId: string, maxResults = 50): Promise<ViewHistory[]> => {
      const q = query(
        collection(db, 'viewHistory'),
        where('userId', '==', userId),
        orderBy('viewedAt', 'desc'),
        limit(maxResults)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as ViewHistory);
    },

    clearUserViewHistory: async (userId: string): Promise<void> => {
      const q = query(
        collection(db, 'viewHistory'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      
   
      const deletePromises = querySnapshot.docs.map(
        doc => deleteDoc(doc.ref)
      );
      
      await Promise.all(deletePromises);
    }
  },


  comments: {
    getProductComments: async (productId: string): Promise<Comment[]> => {
      const q = query(
        collection(db, 'comments'),
        where('productId', '==', productId),
        where('isModerated', '==', true),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as Comment);
    },

    addComment: async (comment: Comment): Promise<string> => {
      const docRef = await addDoc(collection(db, 'comments'), {
        ...comment,
        createdAt: Timestamp.now().toDate().toISOString(),
        isModerated: false 
      });
      return docRef.id;
    }
  }
}; 