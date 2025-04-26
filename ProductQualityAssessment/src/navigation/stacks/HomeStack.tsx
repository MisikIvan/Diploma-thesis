import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../screens/HomeScreen';
import CategoryProductsScreen from '../../screens/CategoryProductsScreen';
import AllCategoriesScreen from '../../screens/AllCategoriesScreen';
import { HomeStackParamList } from '../types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: 'Головна',
        }}
      />
      <Stack.Screen
        name="CategoryProducts"
        component={CategoryProductsScreen}
        options={({ route }) => ({
          title: route.params.categoryName,
        })}
      />
      <Stack.Screen
        name="AllCategories"
        component={AllCategoriesScreen}
        options={{
          title: 'Всі категорії',
        }}
      />
    </Stack.Navigator>
  );
} 