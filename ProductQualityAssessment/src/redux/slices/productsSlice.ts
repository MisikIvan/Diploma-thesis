import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Product } from '../../types';

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
  'products/searchProducts',
  async (params: SearchParams) => {
    const { query, page, pageSize } = params;
    const response = await axios.get(`/api/products/search?q=${query}&page=${page}&limit=${pageSize}`);
    return response.data.products;
  }
);

export const getProductDetails = createAsyncThunk(
  'products/getProductDetails',
  async (productId: string) => {
    const response = await axios.get(`/api/products/${productId}`);
    return response.data;
  }
);

export const getSimilarProducts = createAsyncThunk(
  'products/getSimilarProducts',
  async (productId: string) => {
    const response = await axios.get(`/api/products/${productId}/similar`);
    return response.data;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCurrentProduct: (state, action: PayloadAction<Product>) => {
      state.currentProduct = action.payload;
      // Add to recent products if not already there
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
  },
  extraReducers: (builder) => {
    builder
      // getProductDetails
      .addCase(getProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
        // Add to recent products if not already there
        if (!state.recentProducts.some((p: Product) => p.productId === action.payload.productId)) {
          state.recentProducts = [action.payload, ...state.recentProducts].slice(0, 5);
        }
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch product details';
      })
      
      // getSimilarProducts
      .addCase(getSimilarProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSimilarProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.similarProducts = action.payload;
      })
      .addCase(getSimilarProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch similar products';
      })
      
      // searchProducts
      .addCase(searchProducts.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.searchQuery = action.meta.arg.query;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        // If there's a selected category, filter the products
        if (state.selectedCategory) {
          state.filteredProducts = action.payload.filter((p: Product) => 
            p.categories.includes(state.selectedCategory as string)
          );
        } else {
          state.filteredProducts = [];
        }
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search products';
      });
  },
});

export const { setCurrentProduct, setSelectedCategory } = productsSlice.actions;
export default productsSlice.reducer; 