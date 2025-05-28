import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, NutriScoreGrade } from '../../types/index';
import { StorageService } from '../../utils/storage';
import { getProduct as fetchProductFromFirebase, getAllProducts } from '../../api/firebase';

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
  'products/search',
  async ({ query, page = 1, pageSize = 20 }: SearchParams, { rejectWithValue }) => {
    try {
      const allProducts = await getAllProducts();
      
      if (!query.trim()) {
        return allProducts;
      }

      const filteredProducts = allProducts.filter((product: Product) => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.categories?.some((cat: string) => cat.toLowerCase().includes(query.toLowerCase()))
      );

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
      const viewHistory = await StorageService.viewHistory.getViewHistory();
      const userHistory = viewHistory.filter(h => h.userId === userId);
      
   
      const recentProductIds = userHistory.slice(0, 5).map(h => h.productId);
      
     
      const recentProducts: Product[] = [];
      for (const productId of recentProductIds) {
        try {
          const product = await fetchProductFromFirebase(productId);
          if (product) {
            recentProducts.push(product);
          }
        } catch (error) {
          console.warn('Failed to load recent product:', productId, error);
        }
      }
      
      return recentProducts;
    } catch (error) {
      console.error('Failed to load recent products from storage:', error);
      return rejectWithValue('Failed to load recent products');
    }
  }
);

export const addToViewHistory = createAsyncThunk(
  'products/addToViewHistory',
  async ({ userId, product }: { userId: string; product: Product }, { rejectWithValue }) => {
    try {
      await StorageService.viewHistory.addToViewHistory(userId, product);
      return product;
    } catch (error) {
      console.error('Failed to add product to view history:', error);
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
      
        if (state.selectedCategory) {
          state.filteredProducts = action.payload.filter((p: Product) => 
            p.categories.includes(state.selectedCategory as string)
          );
        } else {
          state.filteredProducts = [];
        }
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

export const { setCurrentProduct, setSelectedCategory, updateProductFavoriteStatus, setRecentProducts, addNewProduct } = productsSlice.actions;
export default productsSlice.reducer; 