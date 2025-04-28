import { Product, NutriScoreGrade } from '../types';
import { APP_CONSTANTS } from './config';

/**
 * Format a date string to a more readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Get a valid product image URL or fallback
 */
export const getProductImage = (imageUrl: string): string => {
  if (!imageUrl || imageUrl.trim() === '') {
    return 'https://via.placeholder.com/400x300?text=No+Image+Available';
  }
  return imageUrl;
};

/**
 * Format a nutrient value with unit
 */
export const formatNutrient = (value: number | undefined, unit: string = 'g'): string => {
  if (value === undefined || value === null) {
    return '-';
  }
  return `${value} ${unit}`;
};

/**
 * Calculate nutrient value for whole product
 */
export const calculateWholeProduct = (
  nutrientValue: number | undefined,
  weight: number | undefined
): number | undefined => {
  if (nutrientValue === undefined || weight === undefined) {
    return undefined;
  }
  return parseFloat(((nutrientValue * weight) / 100).toFixed(1));
};

/**
 * Truncate text to a specific length
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};

/**
 * Get Nutri-Score grade from score
 */
export const getNutriScoreGrade = (score?: number): NutriScoreGrade => {
  if (score === undefined) return 'unknown';
  
  if (score <= -1) return 'a';
  if (score <= 2) return 'b';
  if (score <= 10) return 'c';
  if (score <= 18) return 'd';
  return 'e';
};

/**
 * Check if text contains any allergen from the list
 */
export const highlightAllergens = (text: string, allergens: string[]): string => {
  let result = text;
  
  allergens.forEach(allergen => {
    const regex = new RegExp(`\\b${allergen}\\b`, 'gi');
    result = result.replace(regex, `<strong class="allergen">${allergen}</strong>`);
  });
  
  return result;
};

/**
 * Group products by category
 */
export const groupByCategory = (products: Product[]): Record<string, Product[]> => {
  return products.reduce((acc, product) => {
    const category = product.categories[0] || 'uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);
};

/**
 * Sort products by Nutri-Score (from A to E)
 */
export const sortByNutriScore = (products: Product[]): Product[] => {
  return [...products].sort((a, b) => {
    const scoreA = a.nutriscoreGrade.charCodeAt(0);
    const scoreB = b.nutriscoreGrade.charCodeAt(0);
    return scoreA - scoreB;
  });
}; 