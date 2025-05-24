import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Product, NutriScoreGrade } from '../../types/index';
import { getAllProducts as fetchProductsFromFirebase, getProduct as fetchProductFromFirebase } from '../../api/firebase';

interface SearchParams {
  query: string;
  page: number;
  pageSize: number;
}

interface ProductState {
  currentProduct: Product | null;
  similarProducts: Product[];
  products: Product[];
  recentProducts: Product[];
  filteredProducts: Product[];
  searchQuery: string;
  selectedCategory: string | null;
  loading: boolean;
  error: string | null;
}


const MOCK_PRODUCTS: Product[] = [
  {
    productId: 'mock-product-1',
    name: 'Demo Product 1',
    description: 'This is a demo product for testing',
    imageUrl: 'https://via.placeholder.com/300x300?text=Demo+Product+1',
    nutriscoreGrade: 'A' as NutriScoreGrade,
    nutriscoreScore: 85,
    categories: ['beverages'],
    ingredients: 'Water, sugar, salt',
    allergens: [],
    additives: [],
    nutriments: {
      calories: 100,
      proteins: 5,
      fats: {
        total: 2,
        saturated: 1
      },
      carbohydrates: {
        total: 20,
        sugar: 10
      },
      salt: 0.1
    },
    isVegan: true,
    isVegetarian: true,
    hasLactose: false,
    hasGluten: false,
    weight: 500,
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    averageRating: 4.5,
    ratingCount: 10
  },
  {
    productId: 'mock-product-2',
    name: 'Demo Product 2',
    description: 'Another demo product for testing',
    imageUrl: 'https://via.placeholder.com/300x300?text=Demo+Product+2',
    nutriscoreGrade: 'B' as NutriScoreGrade,
    nutriscoreScore: 70,
    categories: ['dairy'],
    ingredients: 'Milk, cocoa, sugar',
    allergens: ['milk'],
    additives: [],
    nutriments: {
      calories: 150,
      proteins: 8,
      fats: {
        total: 5,
        saturated: 3
      },
      carbohydrates: {
        total: 15,
        sugar: 12
      },
      salt: 0.2
    },
    isVegan: false,
    isVegetarian: true,
    hasLactose: true,
    hasGluten: false,
    weight: 250,
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    averageRating: 4.0,
    ratingCount: 5
  },
  {
    productId: 'mock-product-3',
    name: 'Demo Product 3',
    description: 'A third demo product',
    imageUrl: 'https://via.placeholder.com/300x300?text=Demo+Product+3',
    nutriscoreGrade: 'C' as NutriScoreGrade,
    nutriscoreScore: 55,
    categories: ['snacks'],
    ingredients: 'Flour, sugar, vegetable oil',
    allergens: ['gluten'],
    additives: ['E330', 'E202'],
    nutriments: {
      calories: 450,
      proteins: 3,
      fats: {
        total: 22,
        saturated: 10
      },
      carbohydrates: {
        total: 60,
        sugar: 25
      },
      salt: 0.5
    },
    isVegan: false,
    isVegetarian: true,
    hasLactose: false,
    hasGluten: true,
    weight: 100,
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    averageRating: 3.5,
    ratingCount: 8
  }
] as Product[];

const initialState: ProductState = {
  currentProduct: null,
  similarProducts: [],
  products: [],
  recentProducts: [],
  filteredProducts: [],
  searchQuery: '',
  selectedCategory: null,
  loading: false,
  error: null,
};

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (params: SearchParams, { rejectWithValue, getState }) => {
    try {
      console.log('🔍 searchProducts called with:', params);
      console.log('🔍 Current state before search:', (getState() as any).products);
      
     
      try {
        console.log('🔍 Attempting Firebase fetch...');
        const productsFromFirebase = await fetchProductsFromFirebase();
        console.log('🔍 Firebase returned:', productsFromFirebase.length, 'products');
        
        if (productsFromFirebase.length > 0) {
         
          if (params.query) {
            console.log('🔍 Filtering products with query:', params.query);
            return productsFromFirebase.filter(product => 
              product.name.toLowerCase().includes(params.query.toLowerCase()) ||
              product.categories.some(cat => cat.toLowerCase().includes(params.query.toLowerCase())) ||
              (product.ingredients && product.ingredients.toLowerCase().includes(params.query.toLowerCase()))
            );
          }
          console.log('🔍 Returning all Firebase products');
          return productsFromFirebase;
        }
      } catch (firebaseError) {
        console.error('🔥 Firebase error in searchProducts:', firebaseError);
      }
      
  
      console.log('🔍 Using mock products as fallback');
      
    
      if (params.query) {
        return MOCK_PRODUCTS.filter(product => 
          product.name.toLowerCase().includes(params.query.toLowerCase()) ||
          product.categories.some(cat => cat.toLowerCase().includes(params.query.toLowerCase())) ||
          (product.ingredients && product.ingredients.toLowerCase().includes(params.query.toLowerCase()))
        );
      }
      
      return MOCK_PRODUCTS;
    } catch (error) {
      console.error('🔥 searchProducts completely failed:', error);
      return rejectWithValue('Failed to search products');
    }
  }
);

export const getProductDetails = createAsyncThunk(
  'products/getProductDetails',
  async (productId: string, { rejectWithValue }) => {
    try {
    
      try {
   
        const product = await fetchProductFromFirebase(productId);
        
        if (product) {
          console.log('Product found in Firebase:', product.name);
          return product;
        }
      } catch (firebaseError) {
        console.error('Failed to load product from Firebase, falling back to mock data:', firebaseError);
      }
      
  
      console.log('Looking up product in mock data');
      const product = MOCK_PRODUCTS.find(p => p.productId === productId);
      
      if (!product) {
        return rejectWithValue('Product not found');
      }
      
      return product;
    } catch (error) {
      return rejectWithValue('Failed to fetch product details');
    }
  }
);

export const getSimilarProducts = createAsyncThunk(
  'products/getSimilarProducts',
  async (productId: string, { rejectWithValue }) => {
    try {
    
      try {
   
        const currentProduct = await fetchProductFromFirebase(productId);
        
        if (currentProduct) {
      
          const allProducts = await fetchProductsFromFirebase();
          
      
          const similarProducts = allProducts.filter(p => 
            p.productId !== productId && 
            p.categories.some(cat => currentProduct.categories.includes(cat))
          );
          
          console.log('Found', similarProducts.length, 'similar products in Firebase for categories:', currentProduct.categories);
          return similarProducts;
        }
      } catch (firebaseError) {
        console.error('Failed to load similar products from Firebase, falling back to mock data:', firebaseError);
      }
      
  
      console.log('Looking up similar products in mock data for productId:', productId);
      const currentProduct = MOCK_PRODUCTS.find(p => p.productId === productId);
      
      if (!currentProduct) {
        console.log('Product not found in mock data, returning empty similar products array');
       
        return [];
      }
      
     
      const similarMockProducts = MOCK_PRODUCTS.filter(p => 
        p.productId !== productId && 
        p.categories.some(cat => currentProduct.categories.includes(cat))
      );
      
      console.log('Found', similarMockProducts.length, 'similar mock products');
      return similarMockProducts;
    } catch (error) {
      console.error('getSimilarProducts completely failed:', error);
     
      return [];
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCurrentProduct: (state, action: PayloadAction<Product>) => {
      state.currentProduct = action.payload;
     
      if (!state.recentProducts.some((p: Product) => p.productId === action.payload.productId)) {
        state.recentProducts = [action.payload, ...state.recentProducts].slice(0, 5);
      }
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
      if (action.payload) {
        state.filteredProducts = state.products.filter((p: Product) => 
          p.categories.includes(action.payload as string)
        );
      } else {
        state.filteredProducts = [];
      }
    },
    updateProductFavoriteStatus: (state, action: PayloadAction<{productId: string, isFavorite: boolean}>) => {
  
      if (state.currentProduct && state.currentProduct.productId === action.payload.productId) {

        console.log(`Updated favorite status for ${action.payload.productId}: ${action.payload.isFavorite}`);
      }
    },
  },
  extraReducers: (builder) => {
    builder
    
      .addCase(getProductDetails.pending, (state) => {
        console.log('📱 getProductDetails.pending - setting loading true');
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        console.log('📱 getProductDetails.fulfilled - product loaded:', action.payload.name);
        state.loading = false;
        state.currentProduct = action.payload;
    
        if (!state.recentProducts.some((p: Product) => p.productId === action.payload.productId)) {
          state.recentProducts = [action.payload, ...state.recentProducts].slice(0, 5);
        }
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        console.log('📱 getProductDetails.rejected - error:', action.error.message);
        console.log('📱 Current products count before error handling:', state.products.length);
        state.loading = false;
        
       
        const productId = action.meta.arg;
        const existingProduct = state.products.find(p => p.productId === productId) ||
                               MOCK_PRODUCTS.find(p => p.productId === productId);
        
        if (existingProduct) {
          console.log('📱 Found existing product, using as fallback:', existingProduct.name);
          state.currentProduct = existingProduct;
          state.error = null; 
        } else {
          console.log('📱 No existing product found, setting error');
          state.error = 'Product not found';
        }
        console.log('📱 Products count after error handling:', state.products.length);
      })
      
   
      .addCase(getSimilarProducts.pending, (state) => {
        console.log('📱 getSimilarProducts.pending');
      })
      .addCase(getSimilarProducts.fulfilled, (state, action) => {
        console.log('📱 getSimilarProducts.fulfilled - found:', action.payload.length, 'similar products');
        state.similarProducts = action.payload;
      })
      .addCase(getSimilarProducts.rejected, (state, action) => {
        console.log('📱 getSimilarProducts.rejected - this is normal, setting empty array');
        state.similarProducts = []; 
      })
      
     
      .addCase(searchProducts.pending, (state, action) => {
        console.log('📱 searchProducts.pending - query:', action.meta.arg.query);
        console.log('📱 Current products count before search:', state.products.length);
        state.loading = true;
        state.error = null;
        state.searchQuery = action.meta.arg.query;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        console.log('📱 searchProducts.fulfilled - received:', action.payload.length, 'products');
        console.log('📱 Products received:', action.payload.map(p => p.name));
        state.loading = false;
        state.products = action.payload;
      
        if (state.selectedCategory) {
          state.filteredProducts = action.payload.filter((p: Product) => 
            p.categories.includes(state.selectedCategory as string)
          );
        } else {
          state.filteredProducts = [];
        }
        console.log('📱 Final products count:', state.products.length);
        console.log('📱 Final filtered products count:', state.filteredProducts.length);
      })
      .addCase(searchProducts.rejected, (state, action) => {
        console.log('📱 searchProducts.rejected - error:', action.error.message);
        console.log('📱 Setting fallback to MOCK_PRODUCTS, count:', MOCK_PRODUCTS.length);
        state.loading = false;
        console.warn('Search products failed, but not showing error to user:', action.error.message);
        state.products = MOCK_PRODUCTS; 
        state.error = null; 
        console.log('📱 Final products count after reject:', state.products.length);
      });
  },
});

export const { setCurrentProduct, setSelectedCategory, updateProductFavoriteStatus } = productsSlice.actions;
export default productsSlice.reducer; 