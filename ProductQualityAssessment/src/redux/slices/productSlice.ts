import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types';
import { OpenFoodFactsAPI } from '../../api/openFoodFacts';

interface ProductState {
  products: Product[];
  recentProducts: Product[];
  currentProduct: Product | null;
  filteredProducts: Product[];
  searchQuery: string;
  selectedCategory: string | null;
  sortBy: 'nutriscore' | 'popularity' | 'date';
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
}

const initialState: ProductState = {
  products: [],
  recentProducts: [],
  currentProduct: null,
  filteredProducts: [],
  searchQuery: '',
  selectedCategory: null,
  sortBy: 'nutriscore',
  isLoading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
};

// Async thunks for API calls
export const searchProducts = createAsyncThunk(
  'products/search',
  async ({ query, page, pageSize }: { query: string; page: number; pageSize: number }, { rejectWithValue }) => {
    try {
      const result = await OpenFoodFactsAPI.searchProducts(query, page, pageSize);
      return result;
    } catch (error) {
      return rejectWithValue('Failed to search products');
    }
  }
);

export const getProductByBarcode = createAsyncThunk(
  'products/getByBarcode',
  async (barcode: string, { rejectWithValue }) => {
    try {
      const product = await OpenFoodFactsAPI.getProductByBarcode(barcode);
      if (!product) {
        return rejectWithValue('Product not found');
      }
      return product;
    } catch (error) {
      return rejectWithValue('Failed to get product details');
    }
  }
);

// Create the product slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload;

      // Add to recent products if not null
      if (action.payload) {
        // Remove if already exists in recent products
        state.recentProducts = state.recentProducts.filter(
          p => p.productId !== action.payload?.productId
        );

        // Add to the beginning
        state.recentProducts = [action.payload, ...state.recentProducts];

        // Keep only the most recent 5 products
        if (state.recentProducts.length > 5) {
          state.recentProducts = state.recentProducts.slice(0, 5);
        }
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
      
      // Apply category filter if there's a selected category
      if (action.payload) {
        state.filteredProducts = state.products.filter(
          product => product.categories.includes(action.payload!)
        );
      } else {
        state.filteredProducts = state.products;
      }
    },
    setSortBy: (state, action: PayloadAction<'nutriscore' | 'popularity' | 'date'>) => {
      state.sortBy = action.payload;
      
      // Apply sorting based on sort option
      switch (action.payload) {
        case 'nutriscore':
          state.filteredProducts.sort((a, b) => {
            const scoreA = a.nutriscoreGrade.charCodeAt(0);
            const scoreB = b.nutriscoreGrade.charCodeAt(0);
            return scoreA - scoreB;
          });
          break;
        case 'date':
          state.filteredProducts.sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          break;
        // For popularity, we would need additional data like view count
        default:
          break;
      }
    },
    clearFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategory = null;
      state.filteredProducts = state.products;
    },
    addToRecentProducts: (state, action: PayloadAction<Product>) => {
      // Remove if already exists
      state.recentProducts = state.recentProducts.filter(
        p => p.productId !== action.payload.productId
      );
      
      // Add to the beginning
      state.recentProducts = [action.payload, ...state.recentProducts];
      
      // Keep only the most recent 5 products
      if (state.recentProducts.length > 5) {
        state.recentProducts = state.recentProducts.slice(0, 5);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // searchProducts cases
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.filteredProducts = action.payload.products;
        state.totalCount = action.payload.totalCount;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // getProductByBarcode cases
      .addCase(getProductByBarcode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductByBarcode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
        state.products = [...state.products.filter(p => p.productId !== action.payload.productId), action.payload];
        
        // Add to recent products
        const existingIndex = state.recentProducts.findIndex(p => p.productId === action.payload.productId);
        if (existingIndex >= 0) {
          state.recentProducts.splice(existingIndex, 1);
        }
        state.recentProducts.unshift(action.payload);
        if (state.recentProducts.length > 5) {
          state.recentProducts.pop();
        }
      })
      .addCase(getProductByBarcode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { 
  setCurrentProduct, 
  setSearchQuery, 
  setSelectedCategory, 
  setSortBy, 
  clearFilters,
  addToRecentProducts
} = productSlice.actions;

export default productSlice.reducer; 