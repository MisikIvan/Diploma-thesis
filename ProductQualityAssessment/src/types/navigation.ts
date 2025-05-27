export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ProductDetail: { productId: string; productName?: string };
  EditProduct: { productId: string };
  Admin: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Profile: undefined;
  Admin: undefined;
}; 