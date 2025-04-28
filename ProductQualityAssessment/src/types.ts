export type NutriScoreGrade = 'a' | 'b' | 'c' | 'd' | 'e' | 'unknown';

export interface Product {
  productId: string;
  name: string;
  imageUrl: string;
  nutriscoreGrade: string;
  ingredients: string;
  additives: string[];
  allergens: string[];
  categories: string[];
  description?: string;
  weight?: number;
  nutriments: {
    calories: number;
    proteins: number;
    carbohydrates: {
      total: number;
      sugar: number;
    };
    fats: {
      total: number;
      saturated: number;
    };
    salt: number;
  };
  isVegan: boolean;
  isVegetarian: boolean;
  hasLactose: boolean;
  hasGluten: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getNutriScoreColor = (grade: string): string => {
  switch (grade.toUpperCase()) {
    case 'A':
      return '🟢';
    case 'B':
      return '🟡';
    case 'C':
      return '🟠';
    case 'D':
      return '🔴';
    case 'E':
      return '🔴';
    default:
      return '⚪';
  }
}; 