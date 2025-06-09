import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { User } from '../types/index';

export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<void> => {
  try {
    console.log('Updating user profile for:', userId);
    
  
    if (userId === 'user123' || userId.startsWith('demo_') || userId.startsWith('local_')) {
      console.log('Skipping Firebase update for demo/local user:', userId);
      return;
    }
    
    const userDocRef = doc(db, 'users', userId);
    
  
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      console.log('User document does not exist, creating new one for:', userId);
 
      const newUser: User = {
        userId: userId,
        email: updates.email || '',
        displayName: updates.displayName || 'User',
        authMethod: 'email',
        role: 'user',
        isBlocked: false,
        canComment: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(userDocRef, newUser);
      console.log('New user document created successfully');
      return;
    }
    
   
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );
    
    await updateDoc(userDocRef, {
      ...cleanUpdates,
      updatedAt: new Date().toISOString()
    });
    
    console.log('User profile updated successfully');
  } catch (error) {
    console.error('Error updating user profile:', error);
  
    if (userId === 'user123' || userId.startsWith('demo_') || userId.startsWith('local_')) {
      console.log('Ignoring Firebase error for demo user');
      return;
    }
    throw error;
  }
}; 