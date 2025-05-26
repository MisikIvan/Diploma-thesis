import axios from 'axios';
import { API } from '../utils/config';
import { Product, NutriScoreGrade } from '../types';
import { getNutriScoreGrade } from '../utils/helpers';

interface OpenFoodFactsProduct {
  code: string;
  product_name: string;
  image_url?: string;
  nutriscore_grade?: string;
  nutriscore_score?: number;
  categories_tags?: string[];
  ingredients_text?: string;
  allergens_tags?: string[];
  additives_tags?: string[];
  nutriments?: {
    energy_kcal?: number;
    proteins?: number;
    fat?: number;
    saturated_fat?: number;
    carbohydrates?: number;
    sugars?: number;
    salt?: number;
  };
  quantity?: string;
  ingredients_analysis_tags?: string[];
}

interface OpenFoodFactsResponse {
  status: number;
  product: OpenFoodFactsProduct;
}

interface OpenFoodFactsSearchResponse {
  count: number;
  page: number;
  page_size: number;
  products: OpenFoodFactsProduct[];
}


const transformProduct = (offProduct: OpenFoodFactsProduct): Product => {
 
  let weight: number | undefined;
  if (offProduct.quantity) {
    const match = offProduct.quantity.match(/(\d+)\s*(g|ml)/i);
    if (match) {
      weight = parseInt(match[1]);
    }
  }


  const isVegan = offProduct.ingredients_analysis_tags?.includes('en:vegan') || false;
  const isVegetarian = offProduct.ingredients_analysis_tags?.includes('en:vegetarian') || false;
  
  // Check for lactose/gluten
  const hasLactose = offProduct.allergens_tags?.some(tag => 
    tag.includes('milk') || tag.includes('lactose')
  ) || false;
  
  const hasGluten = offProduct.allergens_tags?.some(tag => 
    tag.includes('gluten') || tag.includes('wheat')
  ) || false;

  // Map categories
  const categories = offProduct.categories_tags?.map(cat => 
    cat.replace('en:', '').replace(/-/g, ' ')
  ) || [];

  // Get Nutri-Score grade
  let nutriscoreGrade: NutriScoreGrade;
  if (offProduct.nutriscore_grade && 
      ['A', 'B', 'C', 'D', 'E'].includes(offProduct.nutriscore_grade.toUpperCase())) {
    nutriscoreGrade = offProduct.nutriscore_grade.toUpperCase() as NutriScoreGrade;
  } else {
    nutriscoreGrade = getNutriScoreGrade(offProduct.nutriscore_score);
  }

  return {
    productId: offProduct.code,
    name: offProduct.product_name || 'Unknown Product',
    description: '',
    imageUrl: offProduct.image_url || '',
    nutriscoreGrade,
    categories,
    ingredients: offProduct.ingredients_text || '',
    allergens: offProduct.allergens_tags?.map(tag => tag.replace('en:', '')) || [],
    additives: offProduct.additives_tags?.map(tag => tag.replace('en:', '')) || [],
    nutriments: {
      calories: offProduct.nutriments?.energy_kcal || 0,
      proteins: offProduct.nutriments?.proteins || 0,
      fats: {
        total: offProduct.nutriments?.fat || 0,
        saturated: offProduct.nutriments?.saturated_fat || 0,
      },
      carbohydrates: {
        total: offProduct.nutriments?.carbohydrates || 0,
        sugar: offProduct.nutriments?.sugars || 0,
      },
      salt: offProduct.nutriments?.salt || 0,
    },
    isVegan,
    isVegetarian,
    hasLactose,
    hasGluten,
    weight,
    createdBy: 'api',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};


export const OpenFoodFactsAPI = {

  getProductByBarcode: async (barcode: string): Promise<Product | null> => {
    try {
      const response = await axios.get<OpenFoodFactsResponse>(
        `${API.OPEN_FOOD_FACTS.BASE_URL}${API.OPEN_FOOD_FACTS.PRODUCT}/${barcode}.json`
      );
      
      if (response.status === 200 && response.data.status === 1) {
        return transformProduct(response.data.product);
      }
      
      return null;
    } catch (error) {
      console.error('Failed to fetch product:', error);
      return null;
    }
  },
  

  searchProducts: async (query: string, page: number = 1, pageSize: number = 20): Promise<{
    products: Product[],
    totalCount: number,
    currentPage: number,
  }> => {
    try {
      const response = await axios.get<OpenFoodFactsSearchResponse>(
        `${API.OPEN_FOOD_FACTS.BASE_URL}${API.OPEN_FOOD_FACTS.SEARCH}`,
        {
          params: {
            search_terms: query,
            page,
            page_size: pageSize,
            json: 1,
          }
        }
      );
      
      if (response.status === 200) {
        const products = response.data.products.map(transformProduct);
        
        return {
          products,
          totalCount: response.data.count,
          currentPage: response.data.page,
        };
      }
      
      return {
        products: [],
        totalCount: 0,
        currentPage: page,
      };
    } catch (error) {
      console.error('Failed to search products:', error);
      return {
        products: [],
        totalCount: 0,
        currentPage: page,
      };
    }
  }
}; 