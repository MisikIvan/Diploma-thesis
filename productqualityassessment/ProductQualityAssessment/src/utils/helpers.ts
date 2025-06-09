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
  try {
    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
      console.log('getProductImage: Using placeholder for invalid imageUrl:', { imageUrl, type: typeof imageUrl });
      return 'https://via.placeholder.com/400x300?text=No+Image+Available';
    }
    
    const trimmedUrl = imageUrl.trim();
    console.log('getProductImage: Using provided URL:', trimmedUrl);
    return trimmedUrl;
  } catch (error) {
    console.error('Error in getProductImage:', error, 'imageUrl:', imageUrl);
    return 'https://via.placeholder.com/400x300?text=No+Image+Available';
  }
};


export const formatNutrient = (value: number | undefined, unit: string = 'g'): string => {
  try {
    if (value === undefined || value === null || typeof value !== 'number' || isNaN(value)) {
      return '-';
    }
    
   
    const safeUnit = unit && typeof unit === 'string' ? unit.trim() : 'g';
    
    const result = `${value} ${safeUnit}`;
    console.log('formatNutrient:', { value, unit, result });
    
    return result;
  } catch (error) {
    console.error('Error in formatNutrient:', error, 'value:', value, 'unit:', unit);
    return '-';
  }
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
  try {
    if (!product) {
      console.warn('getTagsFromProduct: No product provided');
      return [];
    }
    
    // Check if product.tags exists and is an array
    if (!product.tags || !Array.isArray(product.tags)) {
      console.warn('getTagsFromProduct: Invalid or missing tags property:', {
        productId: product.productId,
        tags: product.tags,
        tagsType: typeof product.tags
      });
      return [];
    }
    
    const tags: string[] = [...product.tags];
    
    // Filter out invalid tags and log them
    const validTags = tags.filter(tag => {
      const isValid = tag && typeof tag === 'string' && tag.trim() !== '';
      if (!isValid) {
        console.warn('getTagsFromProduct: Invalid tag found:', { tag, type: typeof tag });
      }
      return isValid;
    });
    
    console.log('getTagsFromProduct result:', {
      productId: product.productId,
      originalTags: tags,
      validTags: validTags
    });
    
    return validTags;
  } catch (error) {
    console.error('Error in getTagsFromProduct:', error);
    return [];
  }
};


export const getTagDisplayName = (tag: string): string => {
  try {
  
    if (!tag || typeof tag !== 'string') {
      console.warn('getTagDisplayName: Invalid tag input:', { tag, type: typeof tag });
      return 'Невідомий тег';
    }
    
    const cleanTag = String(tag).trim();
    if (!cleanTag) {
      console.warn('getTagDisplayName: Empty tag after trimming:', tag);
      return 'Невідомий тег';
    }
 
  
    const lowerTag = cleanTag.toLowerCase();
    
   
    switch(lowerTag) {
     
      case 'снеки':
        return 'Снеки';
      case 'містить-глютен':
        return 'Містить глютен';
      case 'містить-лактозу':
        return 'Містить лактозу';
      case 'містить-сою':
        return 'Містить сою';
      case 'міжнародний':
        return 'Міжнародний';
      case 'європа':
        return 'Європа';
      case 'імпорт':
        return 'Імпорт';
      case 'переробленний':
        return 'Переробленний';
      case 'готовий-до-вживання':
        return 'Готовий до вживання';
      case 'популярний':
        return 'Популярний';
      case 'вегетаріанський':
        return 'Вегетаріанський';
      case 'веганський':
        return 'Веганський';
      case 'без-лактози':
        return 'Без лактози';
      case 'без-глютену':
        return 'Без глютену';
      case 'органічний':
        return 'Органічний';
      case 'біо':
        return 'Біо';
      
      // English tags
      case 'vegan':
        return 'Веганський';
      case 'vegetarian':
        return 'Вегетаріанський';
      case 'lactose-free':
        return 'Без лактози';
      case 'gluten-free':
        return 'Без глютену';
      case 'organic':
        return 'Органічний';
      case 'bio':
        return 'Біо';
      case 'diabete-friendly':
        return 'Для діабетиків';
      case 'low-fat':
        return 'Низький жир';
      case 'low-sugar':
        return 'Низький цукор';
      case 'high-protein':
        return 'Високий білок';
      case 'natural':
        return 'Натуральний';
      case 'local':
        return 'Місцевий';
      case 'snacks':
        return 'Снеки';
      case 'processed':
        return 'Переробленний';
      case 'ready-to-eat':
        return 'Готовий до вживання';
      case 'popular':
        return 'Популярний';
      case 'international':
        return 'Міжнародний';
      case 'europe':
        return 'Європа';
      case 'import':
        return 'Імпорт';
        
      default:
        // If tag not found, capitalize first letter and return as is
        const capitalized = cleanTag.charAt(0).toUpperCase() + cleanTag.slice(1);
        return capitalized;
    }
  } catch (error) {
    console.error('Error in getTagDisplayName:', error, 'tag:', tag);
    return 'Невідомий тег';
  }
};

export const getTagColor = (tag: string): string => {
  if (!tag || typeof tag !== 'string') {
    return '#757575';
  }
  
  const lowerTag = tag.toLowerCase().trim();
  
  // Hardcoded color mapping
  switch(lowerTag) {
    // Ukrainian tags
    case 'снеки':
      return '#FF7043';
    case 'містить-глютен':
      return '#F44336';
    case 'містить-лактозу':
      return '#F44336';
    case 'містить-сою':
      return '#F44336';
    case 'міжнародний':
      return '#2196F3';
    case 'європа':
      return '#3F51B5';
    case 'імпорт':
      return '#607D8B';
    case 'переробленний':
      return '#9E9E9E';
    case 'готовий-до-вживання':
      return '#4CAF50';
    case 'популярний':
      return '#E91E63';
    case 'вегетаріанський':
      return '#8BC34A';
    case 'веганський':
      return '#4CAF50';
    case 'без-лактози':
      return '#2196F3';
    case 'без-глютену':
      return '#FF9800';
    case 'органічний':
      return '#4CAF50';
    case 'біо':
      return '#4CAF50';
      
    // English tags
    case 'vegan':
      return '#4CAF50';
    case 'vegetarian':
      return '#8BC34A';
    case 'lactose-free':
      return '#2196F3';
    case 'gluten-free':
      return '#FF9800';
    case 'organic':
      return '#4CAF50';
    case 'bio':
      return '#4CAF50';
    case 'diabete-friendly':
      return '#9C27B0';
    case 'low-fat':
      return '#00BCD4';
    case 'low-sugar':
      return '#FF5722';
    case 'high-protein':
      return '#795548';
    case 'natural':
      return '#4CAF50';
    case 'local':
      return '#8BC34A';
    case 'snacks':
      return '#FF7043';
    case 'processed':
      return '#9E9E9E';
    case 'ready-to-eat':
      return '#4CAF50';
    case 'popular':
      return '#E91E63';
    case 'international':
      return '#2196F3';
    case 'europe':
      return '#3F51B5';
    case 'import':
      return '#607D8B';
      
    default:
      return '#757575';
  }
}; 