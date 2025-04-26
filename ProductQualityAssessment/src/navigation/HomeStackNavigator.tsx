import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';



type HomeStackParamList = {
  Home: undefined;
  ProductDetail: { productId: string };

};

const Stack = createStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Продукти' }}/>
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Деталі продукту' }}/>
      
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;