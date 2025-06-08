

/**
 
 * @param uri - The image URI to validate
 * @param fallback 
 * @returns 
 */
export const getSafeImageSource = (
  uri: string | undefined | null, 
  fallback = require('../assets/logo.png')
) => {
  return uri && uri.trim() !== '' ? { uri } : fallback;
};

/**
 * Check if an image URI is valid and not empty
 * @param uri - The image URI to validate
 * @returns boolean indicating if URI is valid
 */
export const isValidImageUri = (uri: string | undefined | null): boolean => {
  return Boolean(uri && uri.trim() !== '');
};

/**
 * Sanitize an image URI by trimming whitespace
 * @param uri - The image URI to sanitize
 * @returns Sanitized URI or null if invalid
 */
export const sanitizeImageUri = (uri: string | undefined | null): string | null => {
  if (!uri) return null;
  const sanitized = uri.trim();
  return sanitized !== '' ? sanitized : null;
}; 