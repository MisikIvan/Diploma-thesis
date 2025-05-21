import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { FIREBASE_CONFIG } from './config';

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);


export const testFirebasePermissions = async () => {
  const results = {
    products: { success: false, error: null },
    users: { success: false, error: null },
    comments: { success: false, error: null },
  };

  try {
   
    try {
      await getDocs(collection(db, 'products'));
      results.products.success = true;
    } catch (error: any) {
      results.products.error = error.message;
    }


    try {
      await getDocs(collection(db, 'users'));
      results.users.success = true;
    } catch (error: any) {
      results.users.error = error.message;
    }

   
    try {
      await getDocs(collection(db, 'comments'));
      results.comments.success = true;
    } catch (error: any) {
      results.comments.error = error.message;
    }
  } catch (error: any) {
    console.error('Firebase permissions test error:', error);
  }

  return results;
};
