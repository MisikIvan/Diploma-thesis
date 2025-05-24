export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ProductDetail: { productId: string; productName?: string };
  EditProduct: { productId: string };
  AddProduct: undefined;
  Admin: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Profile: undefined;
  Admin: undefined;
}; 