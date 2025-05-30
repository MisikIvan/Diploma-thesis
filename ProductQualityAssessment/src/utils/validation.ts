export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const ValidationUtils = {
  // Email validation
  email: (email: string): ValidationResult => {
    const errors: string[] = [];
    
    if (!email || !email.trim()) {
      errors.push('Email is required');
    } else {
      
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      
      if (!emailRegex.test(email.trim())) {
        errors.push('Invalid email format');
      }
      
      if (email.length > 254) {
        errors.push('Email too long (max 254 characters)');
      }
      

      if (/[<>\"'%;()&+]/.test(email)) {
        errors.push('Email contains invalid characters');
      }
    }
    
    return { isValid: errors.length === 0, errors };
  },

  // Password validation
  password: (password: string): ValidationResult => {
    const errors: string[] = [];
    
    if (!password) {
      errors.push('Password is required');
    } else {
      if (password.length < 8) {
        errors.push('Password must be at least 8 characters');
      }
      
      if (password.length > 128) {
        errors.push('Password too long (max 128 characters)');
      }
      
      // Check for at least one uppercase, lowercase, number, and special char
      if (!/(?=.*[a-z])/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
      }
      
      if (!/(?=.*[A-Z])/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      
      if (!/(?=.*\d)/.test(password)) {
        errors.push('Password must contain at least one number');
      }
      
      if (!/(?=.*[@$!%*?&])/.test(password)) {
        errors.push('Password must contain at least one special character (@$!%*?&)');
      }
      
      // Check for common weak patterns
      const weakPatterns = [
        /(.)\1{2,}/, // repeated characters
        /^(?=.*password).*$/i, // contains "password"
        /^(?=.*123).*$/, // contains "123"
        /^(?=.*abc).*$/i, // contains "abc"
      ];
      
      for (const pattern of weakPatterns) {
        if (pattern.test(password)) {
          errors.push('Password is too weak or contains common patterns');
          break;
        }
      }
    }
    
    return { isValid: errors.length === 0, errors };
  },

  // Name validation
  name: (name: string): ValidationResult => {
    const errors: string[] = [];
    
    if (!name || !name.trim()) {
      errors.push('Name is required');
    } else {
      const trimmedName = name.trim();
      
      if (trimmedName.length < 2) {
        errors.push('Name must be at least 2 characters');
      }
      
      if (trimmedName.length > 50) {
        errors.push('Name too long (max 50 characters)');
      }
      
      // Only allow letters, spaces, hyphens, apostrophes
      if (!/^[a-zA-ZÀ-ÿĀ-žА-я\s'-]+$/.test(trimmedName)) {
        errors.push('Name contains invalid characters');
      }
      
    
      if (/<[^>]*>/.test(trimmedName)) {
        errors.push('Name cannot contain HTML tags');
      }
    }
    
    return { isValid: errors.length === 0, errors };
  },

  // Product name validation
  productName: (name: string): ValidationResult => {
    const errors: string[] = [];
    
    if (!name || !name.trim()) {
      errors.push('Product name is required');
    } else {
      const trimmedName = name.trim();
      
      if (trimmedName.length < 2) {
        errors.push('Product name must be at least 2 characters');
      }
      
      if (trimmedName.length > 100) {
        errors.push('Product name too long (max 100 characters)');
      }
      
      // Allow alphanumeric, spaces, and common punctuation
      if (!/^[a-zA-Z0-9À-ÿĀ-žА-я\s\-.,()&%'"+/]+$/.test(trimmedName)) {
        errors.push('Product name contains invalid characters');
      }
      
     
      if (/<[^>]*>|javascript:|data:/i.test(trimmedName)) {
        errors.push('Product name contains potentially dangerous content');
      }
    }
    
    return { isValid: errors.length === 0, errors };
  },

  // Description validation
  description: (description: string, isRequired: boolean = false): ValidationResult => {
    const errors: string[] = [];
    
    if (isRequired && (!description || !description.trim())) {
      errors.push('Description is required');
    } else if (description && description.trim()) {
      const trimmedDesc = description.trim();
      
      if (trimmedDesc.length > 1000) {
        errors.push('Description too long (max 1000 characters)');
      }
      
     
      if (/<script|javascript:|data:|vbscript:|onload|onerror/i.test(trimmedDesc)) {
        errors.push('Description contains potentially dangerous content');
      }
      
      // Check for excessive special characters
      const specialCharCount = (trimmedDesc.match(/[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?~`]/g) || []).length;
      if (specialCharCount > trimmedDesc.length * 0.3) {
        errors.push('Description contains too many special characters');
      }
    }
    
    return { isValid: errors.length === 0, errors };
  },

  // Numeric validation
  numeric: (value: string | number, options: { min?: number; max?: number; required?: boolean } = {}): ValidationResult => {
    const errors: string[] = [];
    const { min = 0, max = Number.MAX_SAFE_INTEGER, required = false } = options;
    
    if (required && (value === '' || value === null || value === undefined)) {
      errors.push('This field is required');
    } else if (value !== '' && value !== null && value !== undefined) {
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      
      if (isNaN(numValue)) {
        errors.push('Must be a valid number');
      } else {
        if (numValue < min) {
          errors.push(`Value must be at least ${min}`);
        }
        
        if (numValue > max) {
          errors.push(`Value must be at most ${max}`);
        }
      }
    }
    
    return { isValid: errors.length === 0, errors };
  },

  // URL validation
  url: (url: string, required: boolean = false): ValidationResult => {
    const errors: string[] = [];
    
    if (required && (!url || !url.trim())) {
      errors.push('URL is required');
    } else if (url && url.trim()) {
      const trimmedUrl = url.trim();
      
      try {
        const urlObj = new URL(trimmedUrl);
        
        // Only allow http and https
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
          errors.push('URL must use http or https protocol');
        }
        
        // Check for suspicious patterns
        if (/javascript:|data:|vbscript:/i.test(trimmedUrl)) {
          errors.push('URL contains potentially dangerous protocol');
        }
        
      } catch (e) {
        errors.push('Invalid URL format');
      }
    }
    
    return { isValid: errors.length === 0, errors };
  },

  // Barcode validation
  barcode: (barcode: string, required: boolean = false): ValidationResult => {
    const errors: string[] = [];
    
    if (required && (!barcode || !barcode.trim())) {
      errors.push('Barcode is required');
    } else if (barcode && barcode.trim()) {
      const trimmedBarcode = barcode.trim();
      
      // Check if it's numeric
      if (!/^\d+$/.test(trimmedBarcode)) {
        errors.push('Barcode must contain only numbers');
      }
      
      // Check length 
      const validLengths = [8, 12, 13, 14]; // EAN-8, UPC-A, EAN-13, ITF-14
      if (!validLengths.includes(trimmedBarcode.length)) {
        errors.push('Barcode must be 8, 12, 13, or 14 digits long');
      }
    }
    
    return { isValid: errors.length === 0, errors };
  },

 
  sanitizeText: (text: string): string => {
    if (!text) return '';
    
    return text
      .trim()
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  // Validate ingredients list
  ingredients: (ingredients: string): ValidationResult => {
    const errors: string[] = [];
    
    if (!ingredients || !ingredients.trim()) {
      errors.push('Ingredients list is required');
    } else {
      const trimmedIngredients = ingredients.trim();
      
      if (trimmedIngredients.length < 5) {
        errors.push('Ingredients list too short (minimum 5 characters)');
      }
      
      if (trimmedIngredients.length > 5000) {
        errors.push('Ingredients list too long (max 5000 characters)');
      }
      
      // Prevent XSS
      if (/<script|javascript:|data:/i.test(trimmedIngredients)) {
        errors.push('Ingredients list contains potentially dangerous content');
      }
    }
    
    return { isValid: errors.length === 0, errors };
  },

 
  checkRateLimit: (key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean => {
    const now = Date.now();
    const storageKey = `rate_limit_${key}`;
    
    try {
      const storedData = localStorage.getItem(storageKey);
      const attempts = storedData ? JSON.parse(storedData) : [];
      
      
      const validAttempts = attempts.filter((timestamp: number) => now - timestamp < windowMs);
      
      if (validAttempts.length >= maxAttempts) {
        return false; 
      }
      
      // Add current attempt
      validAttempts.push(now);
      localStorage.setItem(storageKey, JSON.stringify(validAttempts));
      
      return true; 
    } catch (e) {
    
      return true;
    }
  }
};

// Helper function to validate multiple fields at once
export const validateForm = (fields: { [key: string]: any }, validators: { [key: string]: (value: any) => ValidationResult }): { isValid: boolean; errors: { [key: string]: string[] } } => {
  const errors: { [key: string]: string[] } = {};
  let isValid = true;
  
  for (const [fieldName, value] of Object.entries(fields)) {
    if (validators[fieldName]) {
      const result = validators[fieldName](value);
      if (!result.isValid) {
        errors[fieldName] = result.errors;
        isValid = false;
      }
    }
  }
  
  return { isValid, errors };
}; 