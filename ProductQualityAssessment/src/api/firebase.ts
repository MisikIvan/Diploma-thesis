import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
  signInWithCredential,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, query, where, getDocs, deleteDoc, addDoc, Timestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FIREBASE_CONFIG } from '../utils/config';
import { User, Product, Comment, AdminAction } from '../types/index';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);
// Initialize Auth
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();


WebBrowser.maybeCompleteAuthSession();


if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence)
    .catch(error => {
      console.error('Error setting auth persistence:', error);
    });
}

// Create a service for storing auth state in AsyncStorage
const storeUserInStorage = async (user: FirebaseUser | null) => {
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
};

// Monitor auth state changes to update AsyncStorage
onAuthStateChanged(auth, (user) => {
  storeUserInStorage(user);
});

// Authentication Services
export const registerWithEmail = async (email: string, password: string, displayName: string): Promise<User> => {
  try {
    console.log(`Starting registration for email: ${email}`);
    
    // Create the user with email/password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log(`User created in Firebase Auth with UID: ${userCredential.user.uid}`);
    
    // Update profile with display name
    try {
      await updateProfile(userCredential.user, { displayName });
      console.log(`Profile updated with displayName: ${displayName}`);
    } catch (profileError) {
      console.error('Error updating profile:', profileError);
    }
    
    // Save user data to AsyncStorage
    await storeUserInStorage(userCredential.user);
    
    // Create user document in Firestore
    const user: User = {
      userId: userCredential.user.uid,
      email: email,
      displayName: displayName,
      authMethod: 'email',
      role: 'user',
      isBlocked: false,
      canComment: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    try {
      await setDoc(doc(db, 'users', userCredential.user.uid), user);
      console.log(`User document created in Firestore for UID: ${userCredential.user.uid}`);
    } catch (firestoreError) {
      console.error('Error creating user document in Firestore:', firestoreError);
    }
    
    return user;
  } catch (error: any) {
    console.error('Error registering user:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
};

export const loginWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Save user data to AsyncStorage
    await storeUserInStorage(userCredential.user);
    
    // Update last login
    const userDocRef = doc(db, 'users', userCredential.user.uid);
    await updateDoc(userDocRef, {
      lastLogin: new Date().toISOString()
    });
    
    // Get user data
    const userDoc = await getDoc(userDocRef);
    return userDoc.data() as User;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};

export const loginWithGoogle = async (): Promise<User> => {  
  try {    
    console.log('Starting Google login process');
          
    if (Platform.OS === 'web') {      
      console.log('Using web Google login flow');      
      const result = await signInWithPopup(auth, googleProvider);      
      const user = result.user;      
      console.log('Successfully logged in with Google on web:', user.uid);
            
      // Save user data to AsyncStorage      
      await storeUserInStorage(user);
            
      return await handleGoogleUser(user);    
    } else {      
   
      console.log('Google login on mobile not implemented in this version');      
      throw new Error('Google login is currently only supported on web. Please use email login on mobile.');    
    }  
  } catch (error) {    
    console.error('Error logging in with Google:', error);    
    throw error;  
  }
};

const handleGoogleUser = async (user: FirebaseUser): Promise<User> => {
  console.log('Processing Google user:', user.uid);
  
  // Ensure user is saved to AsyncStorage
  await storeUserInStorage(user);
  
  // Check if user document exists
  const userDocRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);
  
  if (!userDoc.exists()) {
    console.log('Creating new Firestore document for Google user');
    // Create new user
    const newUser: User = {
      userId: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'User',
      avatarUrl: user.photoURL || undefined,
      authMethod: 'google',
      role: 'user',
      isBlocked: false,
      canComment: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    await setDoc(userDocRef, newUser);
    console.log('New user document created successfully');
    return newUser;
  } else {
    console.log('Updating existing user document for Google user');
    // Update last login
    await updateDoc(userDocRef, {
      lastLogin: new Date().toISOString()
    });
    
    return userDoc.data() as User;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    // Clear user data from AsyncStorage
    await storeUserInStorage(null);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            resolve(userDoc.data() as User);
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      } else {
        // If not logged in with Firebase, try AsyncStorage
        try {
          const storedUser = await AsyncStorage.getItem('auth_user');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            // Get full user data from Firestore using stored UID
            if (userData.uid) {
              const userDocRef = doc(db, 'users', userData.uid);
              const userDoc = await getDoc(userDocRef);
              
              if (userDoc.exists()) {
                resolve(userDoc.data() as User);
                return;
              }
            }
          }
          resolve(null);
        } catch (error) {
          console.error('Error checking AsyncStorage for user:', error);
          resolve(null);
        }
      }
    }, reject);
  });
};

// User Management Services
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    return usersSnapshot.docs.map(doc => doc.data() as User);
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

export const blockUser = async (userId: string, adminId: string): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      isBlocked: true
    });
    
    // Log admin action
    await addAdminAction(adminId, 'block_user', userId, 'Blocked user');
  } catch (error) {
    console.error('Error blocking user:', error);
    throw error;
  }
};

export const unblockUser = async (userId: string, adminId: string): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      isBlocked: false
    });
    
    // Log admin action
    await addAdminAction(adminId, 'unblock_user', userId, 'Unblocked user');
  } catch (error) {
    console.error('Error unblocking user:', error);
    throw error;
  }
};

export const toggleCommentPermission = async (userId: string, canComment: boolean, adminId: string): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      canComment
    });
    
    // Log admin action
    await addAdminAction(
      adminId, 
      canComment ? 'unblock_user' : 'block_user', 
      userId, 
      canComment ? 'Enabled comments for user' : 'Disabled comments for user'
    );
  } catch (error) {
    console.error('Error updating comment permission:', error);
    throw error;
  }
};

// Product Management Services
export const addProduct = async (product: Omit<Product, 'productId' | 'createdAt' | 'updatedAt'>, adminId: string): Promise<Product> => {
  try {
    const productsCollection = collection(db, 'products');
    const timestamp = new Date().toISOString();
    
    const newProduct: Omit<Product, 'productId'> = {
      ...product,
      createdBy: 'admin' as const,
      createdAt: timestamp,
      updatedAt: timestamp,
      averageRating: 0,
      ratingCount: 0
    };
    
    const docRef = await addDoc(productsCollection, newProduct);
    
    // Update with productId
    const productWithId: Product = {
      ...newProduct,
      productId: docRef.id
    };
    
    await updateDoc(docRef, { productId: docRef.id });
    
    // Log admin action
    await addAdminAction(adminId, 'create_product', docRef.id, `Created product: ${product.name}`);
    
    return productWithId;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (productId: string, updates: Partial<Product>, adminId: string): Promise<void> => {
  try {
    const productRef = doc(db, 'products', productId);
    
    await updateDoc(productRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    
    // Log admin action
    await addAdminAction(adminId, 'update_product', productId, `Updated product: ${updates.name || 'Unnamed product'}`);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId: string, adminId: string): Promise<void> => {
  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
    
    // Delete related comments
    const commentsQuery = query(collection(db, 'comments'), where('productId', '==', productId));
    const commentsSnapshot = await getDocs(commentsQuery);
    
    const deletePromises = commentsSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    // Log admin action
    await addAdminAction(adminId, 'delete_product', productId, 'Deleted product and related comments');
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const getProduct = async (productId: string): Promise<Product | null> => {
  try {
    const productRef = doc(db, 'products', productId);
    const productDoc = await getDoc(productRef);
    
    if (productDoc.exists()) {
      return productDoc.data() as Product;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const productsCollection = collection(db, 'products');
    const productsSnapshot = await getDocs(productsCollection);
    return productsSnapshot.docs.map(doc => doc.data() as Product);
  } catch (error) {
    console.error('Error getting all products:', error);
    throw error;
  }
};

// Comment and Rating Services
export const addComment = async (
  productId: string, 
  userId: string, 
  userName: string, 
  userAvatar: string | undefined,
  rating: 1 | 2 | 3 | 4 | 5, 
  text: string
): Promise<Comment> => {
  try {
    // First check if user can comment
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data() as User;
    
    if (!userData.canComment || userData.isBlocked) {
      throw new Error('User is not allowed to comment');
    }
    
    const commentsCollection = collection(db, 'comments');
    
    const newComment: Omit<Comment, 'commentId'> = {
      productId,
      userId,
      userName,
      userAvatar,
      rating,
      text,
      createdAt: new Date().toISOString(),
      isModerated: false,
      isDeleted: false
    };
    
    const docRef = await addDoc(commentsCollection, newComment);
    
    // Update with commentId
    const commentWithId: Comment = {
      ...newComment,
      commentId: docRef.id
    };
    
    await updateDoc(docRef, { commentId: docRef.id });
    
    // Update product rating
    await updateProductRating(productId);
    
    return commentWithId;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const getProductComments = async (productId: string): Promise<Comment[]> => {
  try {
    const commentsQuery = query(
      collection(db, 'comments'), 
      where('productId', '==', productId),
      where('isDeleted', '==', false)
    );
    const commentsSnapshot = await getDocs(commentsQuery);
    return commentsSnapshot.docs.map(doc => doc.data() as Comment);
  } catch (error) {
    console.error('Error getting product comments:', error);
    throw error;
  }
};

export const deleteComment = async (commentId: string, adminId: string): Promise<void> => {
  try {
    const commentRef = doc(db, 'comments', commentId);
    const commentDoc = await getDoc(commentRef);
    
    if (!commentDoc.exists()) {
      throw new Error('Comment not found');
    }
    
    const comment = commentDoc.data() as Comment;
    
    // Mark as deleted instead of actually deleting
    await updateDoc(commentRef, {
      isDeleted: true,
      isModerated: true
    });
    
    // Log admin action
    await addAdminAction(
      adminId, 
      'moderate_comment', 
      commentId, 
      `Removed comment by user: ${comment.userName} on product: ${comment.productId}`
    );
    
    // Update product rating
    await updateProductRating(comment.productId);
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

// Helper function to update product rating
const updateProductRating = async (productId: string): Promise<void> => {
  try {
    const commentsQuery = query(
      collection(db, 'comments'), 
      where('productId', '==', productId),
      where('isDeleted', '==', false)
    );
    const commentsSnapshot = await getDocs(commentsQuery);
    const comments = commentsSnapshot.docs.map(doc => doc.data() as Comment);
    
    if (comments.length === 0) {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, {
        averageRating: 0,
        ratingCount: 0
      });
      return;
    }
    
    const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
    const averageRating = totalRating / comments.length;
    
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      averageRating,
      ratingCount: comments.length
    });
  } catch (error) {
    console.error('Error updating product rating:', error);
    throw error;
  }
};

// Admin actions logging
export const addAdminAction = async (
  adminId: string,
  actionType: AdminAction['actionType'],
  targetId: string,
  details: string
): Promise<void> => {
  try {
    const actionsCollection = collection(db, 'adminActions');
    
    const newAction: Omit<AdminAction, 'actionId'> = {
      adminId,
      actionType,
      targetId,
      details,
      timestamp: new Date().toISOString()
    };
    
    const docRef = await addDoc(actionsCollection, newAction);
    await updateDoc(docRef, { actionId: docRef.id });
  } catch (error) {
    console.error('Error logging admin action:', error);
    throw error;
  }
};

export const getAdminActions = async (): Promise<AdminAction[]> => {
  try {
    const actionsCollection = collection(db, 'adminActions');
    const actionsSnapshot = await getDocs(actionsCollection);
    return actionsSnapshot.docs.map(doc => doc.data() as AdminAction);
  } catch (error) {
    console.error('Error getting admin actions:', error);
    throw error;
  }
};

// Image Upload Service
export const uploadProductImage = async (imageFile: File): Promise<string> => {
  try {
    const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
    const uploadResult = await uploadBytes(storageRef, imageFile);
    const downloadURL = await getDownloadURL(uploadResult.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const uploadUserAvatar = async (userId: string, imageFile: File): Promise<string> => {
  try {
    const storageRef = ref(storage, `avatars/${userId}_${Date.now()}`);
    const uploadResult = await uploadBytes(storageRef, imageFile);
    const downloadURL = await getDownloadURL(uploadResult.ref);
    
    // Update user profile
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      avatarUrl: downloadURL
    });
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
};