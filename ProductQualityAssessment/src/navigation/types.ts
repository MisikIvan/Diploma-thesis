import { NavigatorScreenParams } from '@react-navigation/native';
import { Product } from '../types';

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  ProductDetails: { product: Product };
  Auth: undefined;
  SignUp: undefined;
  SignIn: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Favorites: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  CategoryProducts: { categoryId: string; categoryName: string };
  AllCategories: undefined;
};

export type SearchStackParamList = {
  SearchScreen: undefined;
  SearchResults: { query: string; filters?: any };
};

export type ProfileStackParamList = {
  ProfileScreen: undefined;
  EditProfile: undefined;
  Settings: undefined;
  ViewHistory: undefined;
  AdminPanel: undefined;
}; 