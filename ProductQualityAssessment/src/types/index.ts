export interface User {
  userId: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  authMethod: 'email' | 'google';
  role: 'user' | 'admin';
  isBlocked: boolean;
  canComment: boolean;
  createdAt?: string;
  lastLogin?: string;
  updatedAt?: string;
  
  // Personal details
  age?: number;
  height?: number; 
  currentWeight?: number; 
  goalWeight?: number; 
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  
  // Preferences
  burnedCaloriesEnabled?: boolean;
  dailyCaloriesGoal?: number;
  dailyCarbsGoal?: number;
  dailyFatsGoal?: number;
  dailyProteinsGoal?: number;
  
  // Weight tracking
  weightHistory?: Array<{
    weight: number;
    date: string;
  }>;
}

export interface Product {
  productId: string;
  name: string;
  description?: string;
  brand?: string;
  imageUrl?: string;
  nutriscoreGrade: 'A' | 'B' | 'C' | 'D' | 'E';
  nutriscoreScore?: number; 
  categories: string[];
  ingredients: string;
  allergens: string[];
  additives: string[];
  nutriments: {
    calories: number;
    proteins: number;
    fats: {
      total: number;
      saturated?: number;
      unsaturated?: number;
    };
    carbohydrates: {
      total: number;
      sugar?: number;
    };
    salt?: number;
  };

  tags: string[];
  isVegan: boolean;
  isVegetarian: boolean;
  hasLactose: boolean;
  hasGluten: boolean;
  weight?: number; 
  createdBy: 'admin' | 'api' | string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  commentId: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string | null;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  createdAt: string;
  isModerated: boolean;
  isDeleted?: boolean;
}

export interface Favorite {
  favoriteId: string;
  userId: string;
  productId: string;
  addedAt: string;
}

export type NutriScoreGrade = 'A' | 'B' | 'C' | 'D' | 'E';
export type NutriScoreColor = '🟢' | '🟡' | '🟠' | '🔴' | '⛔️';

export const getNutriScoreColor = (grade: NutriScoreGrade): NutriScoreColor => {
  switch (grade) {
    case 'A': return '🟢';
    case 'B': return '🟡';
    case 'C': return '🟠';
    case 'D': return '🔴';
    case 'E': return '⛔️';
  }
}; 

export interface ProductSubmission {
  submissionId: string;
  userId: string;
  userDisplayName: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  productData: {
    name: string;
    description?: string;
    brand?: string;
    imageUrl?: string;
    additionalImages?: string[]; 
    nutriscoreGrade: 'A' | 'B' | 'C' | 'D' | 'E';
    nutriscoreScore?: number; 
    categories: string[];
    ingredients: string;
    allergens: string[];
    additives: string[];
    nutriments: {
      calories: number;
      proteins: number;
      fats: {
        total: number;
        saturated?: number;
        unsaturated?: number;
      };
      carbohydrates: {
        total: number;
        sugar?: number;
      };
      salt?: number;
    };
    tags: string[];
    isVegan: boolean;
    isVegetarian: boolean;
    hasLactose: boolean;
    hasGluten: boolean;
    weight?: number;
    barcode?: string;
    source?: string; 
    manufacturer?: string;
    countryOfOrigin?: string;
  };
} 