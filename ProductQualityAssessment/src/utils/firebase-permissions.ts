import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { FIREBASE_CONFIG } from './config';

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

/**
 * Tests Firebase permissions by attempting to read collections
 * @returns Object with test results
 */
export const testFirebasePermissions = async () => {
  const results = {
    products: { success: false, error: null },
    users: { success: false, error: null },
    comments: { success: false, error: null },
  };

  try {
    // Test products collection
    try {
      await getDocs(collection(db, 'products'));
      results.products.success = true;
    } catch (error: any) {
      results.products.error = error.message;
    }

    // Test users collection
    try {
      await getDocs(collection(db, 'users'));
      results.users.success = true;
    } catch (error: any) {
      results.users.error = error.message;
    }

    // Test comments collection
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

/**
 * Gets Firebase security rules fix instructions
 */
export const getFirebaseRulesFixInstructions = () => {
  return `
To fix Firebase permissions for the admin panel, follow these steps:

1. Go to the Firebase Console (https://console.firebase.google.com/)
2. Select your project "productqualityassessment"
3. Navigate to "Firestore Database" from the left menu
4. Click on "Rules" tab
5. Update the rules to allow admin access:

### Option 1: Development Rules (During Development Only)
\`\`\`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // WARNING: These rules are for development only
    // Allow read/write access on all documents to any user
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
\`\`\`

### Option 2: Production Rules (More Secure)
\`\`\`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isUser() {
      return request.auth != null;
    }
    
    // Users collection rules
    match /users/{userId} {
      allow read: if isUser();
      allow write: if isAdmin() || request.auth.uid == userId;
    }
    
    // Products collection rules
    match /products/{productId} {
      allow read: if true; // Anyone can read products
      allow write: if isAdmin(); // Only admins can modify
    }
    
    // Comments collection rules
    match /comments/{commentId} {
      allow read: if true; // Anyone can read comments
      allow create: if isUser() && !get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isBlocked;
      allow update, delete: if isAdmin();
    }
    
    // Admin actions collection rules
    match /adminActions/{actionId} {
      allow read, write: if isAdmin();
    }
  }
}
\`\`\`

6. Click "Publish" to save the rules
7. Return to your app and try again

NOTE: For quick development, use Option 1, but switch to Option 2 before deploying to production!
`;
}; 