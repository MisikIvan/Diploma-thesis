import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
// import CategoryListScreen from '../screens/CategoryListScreen';


type HomeStackParamList = {
  Home: undefined;
  ProductDetail: { productId: string };
  // CategoryList: undefined;
};

const Stack = createStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Продукти' }}/>
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Деталі продукту' }}/>
      {/* <Stack.Screen name="CategoryList" component={CategoryListScreen} /> */}
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;