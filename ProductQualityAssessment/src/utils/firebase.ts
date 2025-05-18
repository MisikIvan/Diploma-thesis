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
  User as FirebaseUser
} from 'firebase/auth';
import { FIREBASE_CONFIG } from './config';
import type { User, Product, Favorite, ViewHistory, Comment } from '../types/index';

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);
const auth = getAuth(app);

/**
 * Firebase service for handling Firestore operations
 */
export const FirebaseService = {
  /**
   * Authentication methods
   */
  auth: {
    getCurrentUser: (): FirebaseUser | null => {
      return auth.currentUser;
    },

    signIn: async (email: string, password: string): Promise<FirebaseUser> => {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    },

    signUp: async (email: string, password: string, displayName: string): Promise<FirebaseUser> => {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      return userCredential.user;
    },

    signOut: async (): Promise<void> => {
      await signOut(auth);
    }
  },

  /**
   * User-related Firestore operations
   */
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

  /**
   * Product-related Firestore operations
   */
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
      // This is a simple implementation. For production, consider using Firebase Extensions like Algolia
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

  /**
   * Favorites-related Firestore operations
   */
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

  /**
   * View history-related Firestore operations
   */
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
      
      // Delete each document in a batch
      const deletePromises = querySnapshot.docs.map(
        doc => deleteDoc(doc.ref)
      );
      
      await Promise.all(deletePromises);
    }
  },

  /**
   * Comments-related Firestore operations
   */
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
        isModerated: false // Default to unmoderated
      });
      return docRef.id;
    }
  }
}; 