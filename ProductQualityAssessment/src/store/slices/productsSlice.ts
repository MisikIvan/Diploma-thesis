import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Product } from '../../types';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

interface ProductsState {
  items: Product[];
  recentlyViewed: Product[];
  favorites: Product[];
  selectedCategory: string | null;
  sortBy: 'nutrition' | 'popularity' | 'date';
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  recentlyViewed: [],
  favorites: [],
  selectedCategory: null,
  sortBy: 'nutrition',
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ category, sortBy, page = 1, limit = 10 }: { 
    category?: string; 
    sortBy?: string; 
    page?: number; 
    limit?: number;
  }) => {
    let query: FirebaseFirestoreTypes.Query = firestore().collection('products');

    if (category) {
      query = query.where('category', '==', category);
    }

    switch (sortBy) {
      case 'nutrition':
        query = query.orderBy('nutritionScore.score', 'desc');
        break;
      case 'popularity':
        query = query.orderBy('viewCount', 'desc');
        break;
      case 'date':
        query = query.orderBy('createdAt', 'desc');
        break;
    }

    const snapshot = await query
      .limit(limit)
      .startAfter((page - 1) * limit)
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
  }
);

export const addToRecentlyViewed = createAsyncThunk(
  'products/addToRecentlyViewed',
  async ({ userId, productId }: { userId: string; productId: string }) => {
    const recentRef = firestore().collection('recentlyViewed');
    await recentRef.add({
      userId,
      productId,
      viewedAt: new Date().toISOString(),
    });

    const productDoc = await firestore().collection('products').doc(productId).get();
    return productDoc.data() as Product;
  }
);

export const toggleFavorite = createAsyncThunk(
  'products/toggleFavorite',
  async ({ userId, productId }: { userId: string; productId: string }) => {
    const favoriteRef = firestore()
      .collection('favorites')
      .where('userId', '==', userId)
      .where('productId', '==', productId);

    const snapshot = await favoriteRef.get();

    if (snapshot.empty) {
      await firestore().collection('favorites').add({
        userId,
        productId,
        createdAt: new Date().toISOString(),
      });
      return { productId, isFavorite: true };
    } else {
      await snapshot.docs[0].ref.delete();
      return { productId, isFavorite: false };
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(addToRecentlyViewed.fulfilled, (state, action) => {
        const exists = state.recentlyViewed.some(p => p.id === action.payload.id);
        if (!exists) {
          state.recentlyViewed = [
            action.payload,
            ...state.recentlyViewed.slice(0, 4)
          ];
        }
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        if (action.payload.isFavorite) {
          const product = state.items.find(p => p.id === action.payload.productId);
          if (product) {
            state.favorites.push(product);
          }
        } else {
          state.favorites = state.favorites.filter(p => p.id !== action.payload.productId);
        }
      });
  },
});

export const { setSelectedCategory, setSortBy, clearError } = productsSlice.actions;
export default productsSlice.reducer; 