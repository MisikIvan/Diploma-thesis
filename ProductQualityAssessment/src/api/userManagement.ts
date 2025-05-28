import { doc, updateDoc } from 'firebase/firestore';
import { db, auth, addAdminAction } from './firebase';

// Additional functions for user management
export const updateUserRole = async (userId: string, newRole: 'user' | 'admin'): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      role: newRole,
      updatedAt: new Date().toISOString()
    });
    
    // Log admin action
    const currentUser = auth.currentUser;
    if (currentUser) {
      await addAdminAction(
        currentUser.uid,
        'update_product',
        userId,
        `Changed user role to ${newRole}`
      );
    }
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
      canComment: !isBlocked, // Заблоковані користувачі не можуть коментувати
      updatedAt: new Date().toISOString()
    });
    
    // Log admin action
    const currentUser = auth.currentUser;
    if (currentUser) {
      await addAdminAction(
        currentUser.uid,
        isBlocked ? 'block_user' : 'unblock_user',
        userId,
        `User ${isBlocked ? 'blocked' : 'unblocked'}`
      );
    }
  } catch (error) {
    console.error('Error updating user block status:', error);
    throw error;
  }
}; 