/**
 * Utility functions for handling user avatars consistently across the app
 */

/**
 * Get the correct avatar source (local asset or URI) based on avatarUrl
 * @param avatarUrl - The avatar URL/path from user data
 * @returns Image source object for React Native Image component
 */
export const getAvatarSource = (avatarUrl?: string) => {
  if (!avatarUrl) return require('../assets/profile1.png');
  
  // Handle local avatar assets
  if (avatarUrl.includes('profile') && (avatarUrl.includes('.png') || avatarUrl.includes('.jpg'))) {
    switch (avatarUrl) {
      case 'profile1.png': return require('../assets/profile1.png');
      case 'profile2.png': return require('../assets/profile2.png');
      case 'profile3.png': return require('../assets/profile3.png');
      case 'profile4.png': return require('../assets/profile4.png');
      case 'profile5.png': return require('../assets/profile5.png');
      case 'profile6.png': return require('../assets/profile6.png');
      case 'profile-currents.jpg': return require('../assets/profile-currents.jpg');
      default: return require('../assets/profile1.png');
    }
  }
  
  // Handle remote URLs
  return { uri: avatarUrl };
};

/**
 * Get all available local avatar options
 * @returns Array of avatar paths
 */
export const getAvailableAvatars = () => [
  'profile1.png',
  'profile2.png', 
  'profile3.png',
  'profile4.png',
  'profile5.png',
  'profile6.png',
  'profile-currents.jpg'
];

/**
 * Check if avatar URL is a local asset
 * @param avatarUrl - The avatar URL to check
 * @returns boolean indicating if it's a local asset
 */
export const isLocalAvatar = (avatarUrl?: string): boolean => {
  if (!avatarUrl) return false;
  return avatarUrl.includes('profile') && (avatarUrl.includes('.png') || avatarUrl.includes('.jpg'));
}; 