import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    products: productsReducer,
    user: userReducer,
 
  },

  devTools: process.env.NODE_ENV !== 'production',
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store; 