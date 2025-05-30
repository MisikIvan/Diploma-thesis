import { Product, NutriScoreGrade } from '../types';
import { t } from './translations';

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
  if (score === undefined) return 'C';  
  
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


export const sortByNutriScore = (products: Product[]): Product[] => {
  return [...products].sort((a, b) => {
    const scoreA = a.nutriscoreGrade.charCodeAt(0);
    const scoreB = b.nutriscoreGrade.charCodeAt(0);
    return scoreA - scoreB;
  });
};


export const PREDEFINED_TAGS = [
  'vegan',
  'vegetarian', 
  'lactose-free',
  'gluten-free',
  'organic',
  'bio',
  'diabete-friendly',
  'low-fat',
  'low-sugar',
  'high-protein',
  'natural',
  'local'
] as const;

export type PredefinedTag = typeof PREDEFINED_TAGS[number];

export const getTagsFromProduct = (product: Product): string[] => {
  if (!product) {
    return [];
  }
  
  const tags: string[] = [...(product.tags || [])];
  
  if (product.isVegan && !tags.includes('vegan')) {
    tags.push('vegan');
  }
  if (product.isVegetarian && !tags.includes('vegetarian')) {
    tags.push('vegetarian');
  }
  if (!product.hasLactose && !tags.includes('lactose-free')) {
    tags.push('lactose-free');
  }
  if (!product.hasGluten && !tags.includes('gluten-free')) {
    tags.push('gluten-free');
  }
  
  return tags.filter(tag => tag && tag.trim());
};


export const getTagDisplayName = (tag: string): string => {

  if (!tag || typeof tag !== 'string' || tag.trim() === '') {
    return '';
  }
  
 
  const tagMap: Record<string, string> = {
    'vegan': 'Веганський',
    'vegetarian': 'Вегетаріанський', 
    'lactose-free': 'Без лактози',
    'gluten-free': 'Без глютену',
    'organic': 'Органічний',
    'bio': 'Біо',
    'diabete-friendly': 'Для діабетиків',
    'low-fat': 'Низький жир',
    'low-sugar': 'Низький цукор',
    'high-protein': 'Високий білок',
    'natural': 'Натуральний',
    'local': 'Місцевий'
  };
  
  
  const result = tagMap[tag.toLowerCase()] || tag;
  return typeof result === 'string' ? result : String(result);
};

export const getTagColor = (tag: string): string => {
  if (!tag) {
    return '#757575';
  }
  
  const colorMap: Record<string, string> = {
    'vegan': '#4CAF50',
    'vegetarian': '#8BC34A',
    'lactose-free': '#2196F3',
    'gluten-free': '#FF9800',
    'organic': '#4CAF50',
    'bio': '#4CAF50',
    'diabete-friendly': '#9C27B0',
    'low-fat': '#00BCD4',
    'low-sugar': '#FF5722',
    'high-protein': '#795548',
    'natural': '#4CAF50',
    'local': '#8BC34A'
  };
  
  return colorMap[tag.toLowerCase()] || '#757575';
}; 