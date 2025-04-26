export type ProductCategory = {
  id: string;
  name: string;
  icon: string;
};

export type NutritionScore = {
  letter: 'A' | 'B' | 'C' | 'D' | 'E';
  score: number;
  color: string;
};

export type NutritionalValues = {
  per100g: {
    calories: number;
    protein: number;
    fats: {
      total: number;
      saturated: number;
      unsaturated: number;
    };
    carbohydrates: {
      total: number;
      sugar: number;
    };
    salt: number;
  };
  perProduct: {
    weight: number;
    calories: number;
    protein: number;
    fats: {
      total: number;
      saturated: number;
      unsaturated: number;
    };
    carbohydrates: {
      total: number;
      sugar: number;
    };
    salt: number;
  };
};

export type ProductCharacteristics = {
  isVegan: boolean;
  isVegetarian: boolean;
  containsLactose: boolean;
  containsGluten: boolean;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  nutritionScore: NutritionScore;
  characteristics: ProductCharacteristics;
  nutritionalValues: NutritionalValues;
  ingredients: string[];
  allergens: string[];
  additives: string[];
  viewCount: number;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: 'user' | 'admin';
  status: 'active' | 'blocked';
  authMethod: 'email' | 'google';
  createdAt: string;
};

export type Comment = {
  id: string;
  productId: string;
  userId: string;
  text: string;
  rating: number;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
};

export type Favorite = {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
};

export type RecentlyViewed = {
  id: string;
  userId: string;
  productId: string;
  viewedAt: string;
}; 