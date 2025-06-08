import { initializeApp } from 'firebase/app';
import {   getAuth,  initializeAuth,  Auth,  createUserWithEmailAndPassword,   signInWithEmailAndPassword,   signOut,   GoogleAuthProvider,   signInWithPopup,  onAuthStateChanged,  updateProfile,  User as FirebaseUser,  signInWithCredential,  sendPasswordResetEmail} from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, query, where, getDocs, deleteDoc, addDoc, Timestamp, orderBy, limit } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FIREBASE_CONFIG, GOOGLE_AUTH_CONFIG } from '../utils/config';
import { User, Product, Comment, ProductSubmission } from '../types/index';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const app = initializeApp(FIREBASE_CONFIG);


let auth: Auth;
try {
 
  auth = initializeAuth(app, {
    
  });
  console.log('Firebase Auth initialized with persistence');
} catch (error) {
 
  console.log('Auth already initialized, using getAuth:', error);
  auth = getAuth(app);
}

const db = getFirestore(app);
export { db, auth };
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

WebBrowser.maybeCompleteAuthSession();


const clearPreviousUserData = async () => {
  try {
    // Clear all user-specific data before new login
    await AsyncStorage.multiRemove([
      'ProductQualityApp_user',        // Previous user profile data
      'ProductQualityApp_favorites',   // Previous user favorites
      'ProductQualityApp_viewHistory', // Previous user view history
    ]);
    console.log('🧹 Previous user data cleared');
  } catch (error) {
    console.error('Error clearing previous user data:', error);
  }
};

const storeUserInStorage = async (user: FirebaseUser | null) => {
  try {
    if (user) {
      // Clear previous user data before storing new user
      await clearPreviousUserData();
      
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


onAuthStateChanged(auth, (user) => {
  storeUserInStorage(user);
});


export const registerWithEmail = async (email: string, password: string, displayName: string): Promise<User> => {
  try {
    console.log(`Starting registration for email: ${email}`);
    
   
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log(`User created in Firebase Auth with UID: ${userCredential.user.uid}`);
    
   
    try {
      await updateProfile(userCredential.user, { displayName });
      console.log(`Profile updated with displayName: ${displayName}`);
    } catch (profileError) {
      console.error('Error updating profile:', profileError);
    }
    
  
    await storeUserInStorage(userCredential.user);
    
   
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
    
   
    await storeUserInStorage(userCredential.user);
    
  
    const userDocRef = doc(db, 'users', userCredential.user.uid);
    await updateDoc(userDocRef, {
      lastLogin: new Date().toISOString()
    });
    
   
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
            
      await storeUserInStorage(user);
      return await handleGoogleUser(user);    
    } else {      
      console.log('Using mobile Google login flow with AuthSession');
      
      // Mobile Google Sign-In using Expo AuthSession
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'productquality',
        path: 'auth'
      });
      
      console.log('Redirect URI:', redirectUri);
      
      // Отримуємо Google Client ID з конфігурації
      const googleClientId = GOOGLE_AUTH_CONFIG.clientId;
      
      if (!googleClientId) {
        throw new Error('Google Client ID not configured. Please set EXPO_PUBLIC_GOOGLE_CLIENT_ID in environment variables.');
      }
      
      const request = new AuthSession.AuthRequest({
        clientId: googleClientId,
        scopes: ['openid', 'profile', 'email'],
        redirectUri,
        responseType: AuthSession.ResponseType.Code,
        extraParams: {
          access_type: 'offline',
        },
      });

      const result = await request.promptAsync({
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      });

      console.log('AuthSession result:', result);

      if (result.type === 'success' && result.params.code) {
        // Exchange authorization code for access token
        const tokenResponse = await AuthSession.exchangeCodeAsync(
          {
            clientId: googleClientId,
            code: result.params.code,
            redirectUri,
            extraParams: {
              code_verifier: request.codeVerifier || '',
            },
          },
          {
            tokenEndpoint: 'https://oauth2.googleapis.com/token',
          }
        );

        console.log('Token response:', tokenResponse);

        if (tokenResponse.accessToken) {
          // Get user info from Google
          const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
              Authorization: `Bearer ${tokenResponse.accessToken}`,
            },
          });

          const userInfo = await userInfoResponse.json();
          console.log('Google user info:', userInfo);

          // Create Firebase custom token or sign in with credential
          const credential = GoogleAuthProvider.credential(tokenResponse.idToken, tokenResponse.accessToken);
          const firebaseResult = await signInWithCredential(auth, credential);
          
          await storeUserInStorage(firebaseResult.user);
          return await handleGoogleUser(firebaseResult.user);
        } else {
          throw new Error('Failed to get access token from Google');
        }
      } else {
        throw new Error('Google authentication was cancelled or failed');
      }
    }  
  } catch (error: any) {    
    console.error('Error logging in with Google:', error);
    
    // Provide user-friendly error messages
    if (error.message?.includes('Client ID not configured')) {
      throw new Error('Google Sign-In не налаштований для цієї платформи. Будь ласка, використайте вхід через email.');
    } else if (error.message?.includes('cancelled')) {
      throw new Error('Вхід через Google було скасовано');
    }
    
    throw error;  
  }
};

const handleGoogleUser = async (user: FirebaseUser): Promise<User> => {
  console.log('Processing Google user:', user.uid);
  

  await storeUserInStorage(user);
  
 
  const userDocRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);
  
  if (!userDoc.exists()) {
    console.log('Creating new Firestore document for Google user');
 
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
  
    await updateDoc(userDocRef, {
      lastLogin: new Date().toISOString()
    });
    
    return userDoc.data() as User;
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    console.log('Sending password reset email to:', email);
    await sendPasswordResetEmail(auth, email);
    console.log('Password reset email sent successfully');
  } catch (error: any) {
    console.error('Error sending password reset email:', error);
    
    // Handle specific Firebase errors
    if (error.code === 'auth/user-not-found') {
      throw new Error('Користувача з таким email не знайдено');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Невірний формат email адреси');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Занадто багато запитів. Спробуйте пізніше');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Помилка мережі. Перевірте з\'єднання з інтернетом');
    }
    
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
   
    await storeUserInStorage(null);
    
    
    await AsyncStorage.multiRemove([
      'ProductQualityApp_user',        // User profile data
      'ProductQualityApp_favorites',   // User favorites
      'auth_user'                     
    ]);
    
    console.log('✅ Local user data cleared from AsyncStorage (view history preserved in Firebase)');
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
     
        try {
          const storedUser = await AsyncStorage.getItem('auth_user');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
          
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
    
   
  } catch (error) {
    console.error('Error updating comment permission:', error);
    throw error;
  }
};


export const addProduct = async (product: Omit<Product, 'productId' | 'createdAt' | 'updatedAt'>, adminId: string): Promise<Product> => {
  try {
    const productsCollection = collection(db, 'products');
    const timestamp = new Date().toISOString();
    
    const newProduct: Omit<Product, 'productId'> = {
      ...product,
      createdBy: 'admin' as const,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    const docRef = await addDoc(productsCollection, newProduct);
    
  
    const productWithId: Product = {
      ...newProduct,
      productId: docRef.id
    };
    
    await updateDoc(docRef, { productId: docRef.id });
    
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
    
  
   
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId: string, adminId: string): Promise<void> => {
  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
    
 
    const commentsQuery = query(collection(db, 'comments'), where('productId', '==', productId));
    const commentsSnapshot = await getDocs(commentsQuery);
    
    const deletePromises = commentsSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
   

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

export const getAllProducts = async (maxResults?: number): Promise<Product[]> => {
  try {
    console.log('🔥 getAllProducts: Starting Firebase fetch...');
    const productsCollection = collection(db, 'products');
    console.log('🔥 getAllProducts: Collection reference created');
    
    let q;
    if (maxResults) {
      // For home screen: get latest products with limit
      q = query(
        productsCollection,
        orderBy('createdAt', 'desc'),
        limit(maxResults)
      );
      console.log('🔥 getAllProducts: Limited query created with limit:', maxResults);
    } else {
      // For other screens: get all products
      q = query(productsCollection);
      console.log('🔥 getAllProducts: Unlimited query created');
    }
    
    const productsSnapshot = await getDocs(q);
    console.log('🔥 getAllProducts: Snapshot received, size:', productsSnapshot.size);
    
    const products = productsSnapshot.docs.map(doc => {
      const data = doc.data() as Product;
      console.log('🔥 getAllProducts: Processing product:', data.name || 'Unnamed');
      return data;
    });
    
    console.log('🔥 getAllProducts: Successfully loaded', products.length, 'products');
    return products;
  } catch (error) {
    console.error('🔥 getAllProducts: Error occurred:', error);
    console.error('🔥 getAllProducts: Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code,
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
};


export const addComment = async (
  productId: string, 
  userId: string, 
  userName: string, 
  userAvatar: string | undefined,
  rating: 1 | 2 | 3 | 4 | 5, 
  text: string
): Promise<Comment> => {
  try {
   
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
      userAvatar: userAvatar || null,
      rating,
      text,
      createdAt: new Date().toISOString(),
      isModerated: false,
      isDeleted: false
    };
    
    const docRef = await addDoc(commentsCollection, newComment);
    
 
    const commentWithId: Comment = {
      ...newComment,
      commentId: docRef.id
    };
    
    await updateDoc(docRef, { commentId: docRef.id });
    
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
    if (!commentId) {
      console.error('Cannot delete comment: commentId is undefined');
      return;
    }
    
    if (!adminId) {
      console.error('Cannot delete comment: adminId is undefined');
      return;
    }

  
    let commentRef;
    let fallbackUsed = false;
    
    if (commentId.includes('_')) {
      console.log('Using fallback ID method to find comment');
      fallbackUsed = true;
      
     
      const [userId, createdAt] = commentId.split('_');
      
   
      const commentsQuery = query(
        collection(db, 'comments'),
        where('userId', '==', userId),
        where('createdAt', '==', createdAt)
      );
      
      const commentsSnapshot = await getDocs(commentsQuery);
      
      if (commentsSnapshot.empty) {
        throw new Error('Comment not found using fallback method');
      }
      
     
      commentRef = commentsSnapshot.docs[0].ref;
      
      console.log('Found comment using fallback method:', commentsSnapshot.docs[0].id);
    } else {
    
      commentRef = doc(db, 'comments', commentId);
    }

    const commentDoc = await getDoc(commentRef);
    
    if (!commentDoc.exists()) {
      throw new Error('Comment not found');
    }
    
    const comment = commentDoc.data() as Comment;
    if (!comment) {
      throw new Error('Comment data is undefined');
    }
    
  
    if (!comment.commentId && !fallbackUsed) {
      console.log('Updating missing commentId with document ID:', commentDoc.id);
      await updateDoc(commentRef, { commentId: commentDoc.id });
      comment.commentId = commentDoc.id;
    }
    
  
    await updateDoc(commentRef, {
      isDeleted: true,
      isModerated: true
    });
    
    try {
   
    } catch (logError) {
      console.error('Error logging admin action:', logError);
  
    }
    
    // Rating functionality removed - comments now only have visual stars
    
    return;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};





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


export const createSubmission = async (submission: Omit<ProductSubmission, 'submissionId' | 'submittedAt'>): Promise<ProductSubmission> => {
  try {
    const submissionData: ProductSubmission = {
      ...submission,
      submissionId: '', 
      submittedAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, 'productSubmissions'), submissionData);
    
    const createdSubmission: ProductSubmission = {
      ...submissionData,
      submissionId: docRef.id,
    };


    await updateDoc(doc(db, 'productSubmissions', docRef.id), {
      submissionId: docRef.id
    });

    console.log('Product submission created with ID:', docRef.id);
    return createdSubmission;
  } catch (error) {
    console.error('Error creating product submission:', error);
    throw error;
  }
};

export const getSubmissions = async (): Promise<ProductSubmission[]> => {
  try {
    console.log('🔥 getSubmissions: Starting to fetch from Firebase...');
    const submissionsCollection = collection(db, 'productSubmissions');
    const submissionsSnapshot = await getDocs(submissionsCollection);
    
    console.log('🔥 getSubmissions: Got snapshot with', submissionsSnapshot.size, 'documents');
    
    const submissions: ProductSubmission[] = [];
    submissionsSnapshot.forEach((doc) => {
      const data = doc.data() as ProductSubmission;
      
   
      if (!data.submissionId || data.submissionId.trim() === '') {
        console.log('🔥 Found submission without submissionId, using document ID:', doc.id);
        data.submissionId = doc.id;
        
    
        updateDoc(doc.ref, { submissionId: doc.id }).catch(updateError => {
          console.warn('🔥 Could not update submissionId in document:', updateError);
        });
      }
      
      console.log('🔥 Processing submission:', {
        documentId: doc.id,
        submissionId: data.submissionId,
        productName: data.productData?.name || 'Unknown',
        status: data.status
      });
      
      submissions.push(data);
    });
    
 
    submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    
    console.log('🔥 getSubmissions: Returning', submissions.length, 'submissions');
    return submissions;
  } catch (error) {
    console.error('🔥 getSubmissions: Error occurred:', error);
    throw error;
  }
};

export const getSubmissionsByStatus = async (status: 'pending' | 'approved' | 'rejected'): Promise<ProductSubmission[]> => {
  try {
    const submissionsQuery = query(
      collection(db, 'productSubmissions'),
      where('status', '==', status)
    );
    
    const querySnapshot = await getDocs(submissionsQuery);
    const submissions: ProductSubmission[] = [];
    
    querySnapshot.forEach((doc) => {
      submissions.push(doc.data() as ProductSubmission);
    });
    
   
    submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    
    return submissions;
  } catch (error) {
    console.error('Error fetching submissions by status:', error);
    throw error;
  }
};

export const updateSubmissionStatus = async (
  submissionId: string, 
  status: 'approved' | 'rejected',
  reviewedBy: string,
  rejectionReason?: string
): Promise<void> => {
  try {
  
    if (!submissionId || submissionId.trim() === '') {
      throw new Error('Invalid submissionId: cannot be empty');
    }

    console.log('🔥 updateSubmissionStatus called with:', { submissionId, status, reviewedBy });

    const updateData: Partial<ProductSubmission> = {
      status,
      reviewedAt: new Date().toISOString(),
      reviewedBy,
    };

    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

   
    const submissionRef = doc(db, 'productSubmissions', submissionId);
    const submissionDoc = await getDoc(submissionRef);
    
    if (!submissionDoc.exists()) {
      throw new Error(`Submission with ID ${submissionId} does not exist`);
    }

    console.log('🔥 Document exists, updating submission status...');
    await updateDoc(submissionRef, updateData);
    
  

    
    console.log(`🔥 Submission ${submissionId} ${status} successfully`);
  } catch (error) {
    console.error('🔥 Error updating submission status:', error);
    throw error;
  }
};

export const deleteSubmission = async (submissionId: string, adminId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'productSubmissions', submissionId));
    
   

    
    console.log('Submission deleted:', submissionId);
  } catch (error) {
    console.error('Error deleting submission:', error);
    throw error;
  }
};

export const getUserSubmissions = async (userId: string): Promise<ProductSubmission[]> => {
  try {
    const submissionsQuery = query(
      collection(db, 'productSubmissions'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(submissionsQuery);
    const submissions: ProductSubmission[] = [];
    
    querySnapshot.forEach((doc) => {
      submissions.push(doc.data() as ProductSubmission);
    });
    
 
    submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    
    return submissions;
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    throw error;
  }
};
