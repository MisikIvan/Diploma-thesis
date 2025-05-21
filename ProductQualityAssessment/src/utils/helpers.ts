import { Product, NutriScoreGrade } from '../types';
import { APP_CONSTANTS } from './config';


export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};


export const getProductImage = (imageUrl: string): string => {
  if (!imageUrl || imageUrl.trim() === '') {
    return 'https://via.placeholder.com/400x300?text=No+Image+Available';
  }
  return imageUrl;
};


export const formatNutrient = (value: number | undefined, unit: string = 'g'): string => {
  if (value === undefined || value === null) {
    return '-';
  }
  return `${value} ${unit}`;
};


export const calculateWholeProduct = (
  nutrientValue: number | undefined,
  weight: number | undefined
): number | undefined => {
  if (nutrientValue === undefined || weight === undefined) {
    return undefined;
  }
  return parseFloat(((nutrientValue * weight) / 100).toFixed(1));
};


export const truncateText = (text: string, maxLength: number = 100): string => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};


export const getNutriScoreGrade = (score?: number): NutriScoreGrade => {
  if (score === undefined) return 'C';  // default to C if unknown
  
  if (score <= -1) return 'A';
  if (score <= 2) return 'B';
  if (score <= 10) return 'C';
  if (score <= 18) return 'D';
  return 'E';
};


export const highlightAllergens = (text: string, allergens: string[]): string => {
  let result = text;
  
  allergens.forEach(allergen => {
    const regex = new RegExp(`\\b${allergen}\\b`, 'gi');
    result = result.replace(regex, `<strong class="allergen">${allergen}</strong>`);
  });
  
  return result;
};


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


export const sortByNutriScore = (products: Product[]): Product[] => {
  return [...products].sort((a, b) => {
    const scoreA = a.nutriscoreGrade.charCodeAt(0);
    const scoreB = b.nutriscoreGrade.charCodeAt(0);
    return scoreA - scoreB;
  });
}; 