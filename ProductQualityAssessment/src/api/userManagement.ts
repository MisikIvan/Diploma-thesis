import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from './firebase';


export const updateUserRole = async (userId: string, role: 'user' | 'admin'): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      role: role,
      updatedAt: new Date().toISOString()
    });
    
    console.log(`User role updated to ${role} for user:`, userId);
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

export const updateUserBlockStatus = async (userId: string, isBlocked: boolean): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      isBlocked: isBlocked,
      updatedAt: new Date().toISOString()
    });
    
    console.log(`User block status updated to ${isBlocked} for user:`, userId);
  } catch (error) {
    console.error('Error updating user block status:', error);
    throw error;
  }
}; 