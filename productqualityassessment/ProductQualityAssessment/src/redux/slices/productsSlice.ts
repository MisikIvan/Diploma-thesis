import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, NutriScoreGrade, ViewHistory } from '../../types/index';
import { StorageService } from '../../utils/storage';
import { getProduct as fetchProductFromFirebase, getAllProducts } from '../../api/firebase';
import { FirebaseService } from '../../utils/firebase';

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
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  currentProduct: null,
  similarProducts: [],
  products: [],
  recentProducts: [],
  searchQuery: '',
  loading: false,
  error: null,
};

export const searchProducts = createAsyncThunk(
  'products/search',
  async ({ query, page = 1, pageSize = 20 }: SearchParams, { rejectWithValue }) => {
    try {
      const allProducts = await getAllProducts();
      
      if (!query.trim()) {
        return allProducts;
      }

      const searchTerm = query.toLowerCase().trim();
      
      const filteredProducts = allProducts.filter((product: Product) => {
        // Search in product name
        if (product.name.toLowerCase().includes(searchTerm)) return true;
        
        // Search in brand
        if (product.brand?.toLowerCase().includes(searchTerm)) return true;
        
        // Search in product ID/barcode
        if (product.productId.toLowerCase().includes(searchTerm)) return true;
        
        // Search in ingredients
        if (product.ingredients?.toLowerCase().includes(searchTerm)) return true;
        
        // Search in description
        if (product.description?.toLowerCase().includes(searchTerm)) return true;
        
        // Search in allergens
        if (product.allergens?.some((allergen: string) => allergen.toLowerCase().includes(searchTerm))) return true;
        
        // Search in tags
        if (product.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm))) return true;
        
        return false;
      });

      return filteredProducts;
    } catch (error) {
      return rejectWithValue('Failed to search products');
    }
  }
);

export const getProductDetails = createAsyncThunk(
  'products/getProductDetails',
  async (productId: string, { rejectWithValue }) => {
    try {
      const product = await fetchProductFromFirebase(productId);
      
      if (product) {
        return product;
      }
      
      return rejectWithValue('Product not found');
    } catch (error) {
      return rejectWithValue('Failed to fetch product details');
    }
  }
);

export const getSimilarProducts = createAsyncThunk(
  'products/getSimilar',
  async (productId: string, { rejectWithValue }) => {
    try {
      const allProducts = await getAllProducts();
      const similarProducts = allProducts.filter((product: Product) => 
        product.productId !== productId
      ).slice(0, 5);
      
      return similarProducts;
    } catch (error) {
      return rejectWithValue('Failed to fetch similar products');
    }
  }
);

export const loadRecentProducts = createAsyncThunk(
  'products/loadRecentProducts',
  async (userId: string, { rejectWithValue }) => {
    try {
      console.log('🔥 Loading recent products from Firebase for user:', userId);
      
      // Load from Firebase instead of AsyncStorage
      const viewHistory = await FirebaseService.viewHistory.getUserViewHistory(userId, 10);
      console.log('🔥 Loaded view history from Firebase:', viewHistory.length, 'items');
      
      // Remove duplicates by productId (keep most recent)
      const uniqueViewHistory = viewHistory.reduce((acc: ViewHistory[], current: ViewHistory) => {
        const existingIndex = acc.findIndex(item => item.productId === current.productId);
        if (existingIndex === -1) {
          acc.push(current);
        } else {
          // Keep the more recent one
          if (new Date(current.viewedAt) > new Date(acc[existingIndex].viewedAt)) {
            acc[existingIndex] = current;
          }
        }
        return acc;
      }, []);
      
      // Sort by viewedAt descending and get recent product IDs (last 5)
      const sortedUniqueHistory = uniqueViewHistory.sort((a, b) => 
        new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime()
      );
      
      const recentProductIds = sortedUniqueHistory.slice(0, 5).map((h: ViewHistory) => h.productId);
      console.log('🔥 Unique recent product IDs:', recentProductIds);
      
      // Load products from Firebase
      const recentProducts: Product[] = [];
      for (const productId of recentProductIds) {
        try {
          const product = await fetchProductFromFirebase(productId);
          if (product) {
            recentProducts.push(product);
            console.log('🔥 Loaded recent product:', product.name);
          }
        } catch (error) {
          console.warn('Failed to load recent product:', productId, error);
        }
      }
      
      console.log('🔥 Total unique recent products loaded:', recentProducts.length);
      return recentProducts;
    } catch (error) {
      console.error('🔥 Failed to load recent products from Firebase:', error);
      return rejectWithValue('Failed to load recent products');
    }
  }
);

export const addToViewHistory = createAsyncThunk(
  'products/addToViewHistory',
  async ({ userId, product }: { userId: string; product: Product }, { rejectWithValue }) => {
    try {
      console.log('🔥 Adding to Firebase view history:', product.name, 'for user:', userId);
      
      // Create view history entry
      const viewHistoryEntry: ViewHistory = {
        historyId: `${userId}_${product.productId}_${Date.now()}`,
        userId,
        productId: product.productId,
        viewedAt: new Date().toISOString()
      };
      
      // Save to Firebase
      await FirebaseService.viewHistory.addToViewHistory(viewHistoryEntry);
      console.log('🔥 Successfully added to Firebase view history');
      
      return product;
    } catch (error) {
      console.error('🔥 Failed to add product to Firebase view history:', error);
      return rejectWithValue('Failed to save to view history');
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
    updateProductFavoriteStatus: (state, action: PayloadAction<{productId: string, isFavorite: boolean}>) => {
  
      if (state.currentProduct && state.currentProduct.productId === action.payload.productId) {

        console.log(`Updated favorite status for ${action.payload.productId}: ${action.payload.isFavorite}`);
      }
    },
    setRecentProducts: (state, action: PayloadAction<Product[]>) => {
      state.recentProducts = action.payload;
    },
    addNewProduct: (state, action: PayloadAction<Product>) => {
     
      state.products = [action.payload, ...state.products];
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
        state.loading = false;
        
        const productId = action.meta.arg;
        const existingProduct = state.products.find(p => p.productId === productId);
        
        if (existingProduct) {
          console.log('📱 Found existing product, using as fallback:', existingProduct.name);
          state.currentProduct = existingProduct;
          state.error = null; 
        } else {
          console.log('📱 No existing product found, setting error');
          state.error = 'Product not found';
        }
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
        state.loading = true;
        state.error = null;
        state.searchQuery = action.meta.arg.query;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        console.log('📱 searchProducts.fulfilled - received:', action.payload.length, 'products');
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        console.log('📱 searchProducts.rejected - error:', action.error.message);
        state.loading = false;
        state.error = 'Failed to load products';
      })
      
    
      .addCase(loadRecentProducts.fulfilled, (state, action) => {
        console.log('📱 loadRecentProducts.fulfilled - loaded:', action.payload.length, 'recent products');
        state.recentProducts = action.payload;
      })
      .addCase(loadRecentProducts.rejected, (state, action) => {
        console.log('📱 loadRecentProducts.rejected - error:', action.error.message);
        state.recentProducts = [];
      })
      
   
      .addCase(addToViewHistory.fulfilled, (state, action) => {
        console.log('📱 addToViewHistory.fulfilled - added:', action.payload.name);
      
        if (!state.recentProducts.some((p: Product) => p.productId === action.payload.productId)) {
          state.recentProducts = [action.payload, ...state.recentProducts].slice(0, 5);
        }
      });
  },
});

export const { setCurrentProduct, updateProductFavoriteStatus, setRecentProducts, addNewProduct } = productsSlice.actions;
export default productsSlice.reducer; 