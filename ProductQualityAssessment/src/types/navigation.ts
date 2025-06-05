import { AnalyzedProductData } from '../api/smartProductAnalysis';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ProductDetail: { productId: string; productName?: string };
  PersonalDetails: undefined;
  WeightPicker: { 
    currentWeight: number; 
    title: string; 
    type: 'weight' | 'goalWeight' 
  };
  HeightPicker: { 
    currentHeight: number; 
    title: string; 
  };
  AgePicker: { 
    currentAge: number; 
    title: string; 
  };
  GenderPicker: { 
    currentGender: 'male' | 'female' | 'other'; 
    title: string; 
  };
  EditProduct: { productId: string; prefilledData?: AnalyzedProductData };
  Admin: undefined;
  ProductSearch: undefined;
  UserSearch: undefined;
  TermsOfService: undefined;
  PrivacyPolicy: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Profile: undefined;
  Admin: undefined;
}; 