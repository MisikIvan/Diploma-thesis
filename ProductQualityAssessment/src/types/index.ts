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
  // Replaced with tags system
  tags: string[]; // ['vegan', 'vegetarian', 'lactose-free', 'gluten-free', 'organic', 'bio', etc.]
  // Keep original fields for backward compatibility during migration
  isVegan: boolean;
  isVegetarian: boolean;
  hasLactose: boolean;
  hasGluten: boolean;
  weight?: number; 
  createdBy: 'admin' | 'api' | string;
  createdAt: string;
  updatedAt: string;
  averageRating?: number;
  ratingCount?: number;
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

export interface AdminAction {
  actionId: string;
  adminId: string;
  actionType: 'create_product' | 'update_product' | 'delete_product' | 'block_user' | 'unblock_user' | 'toggle_comment_permission' | 'moderate_comment';
  targetId: string;
  details: string;
  timestamp: string;
}

export interface Favorite {
  favoriteId: string;
  userId: string;
  productId: string;
  addedAt: string;
}

export interface ViewHistory {
  historyId: string;
  userId: string;
  productId: string;
  viewedAt: string;
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