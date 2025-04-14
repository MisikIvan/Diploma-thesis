import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import HomeStackNavigator from './HomeStackNavigator';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminPanelScreen from '../screens/AdminPanelScreen'; 


type AppTabParamList = {
  HomeStack: undefined;
  Favorites: undefined;
  Profile: undefined;
  Admin: undefined; 
};

const Tab = createBottomTabNavigator<AppTabParamList>();


const isAdmin = true; // Замінить на реальну преревірку із Redux/Auth

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'alert-circle'; // іконка за замовчуванням

          if (route.name === 'HomeStack') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Admin') {
             iconName = focused ? 'cog' : 'cog-outline';
          }

          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeStack" component={HomeStackNavigator} options={{ title: 'Главная' }} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Избранное' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Профиль' }} />
      {isAdmin && ( // Відображає вкладку тільки для адміна
        <Tab.Screen name="Admin" component={AdminPanelScreen} options={{ title: 'Админ' }} />
      )}
    </Tab.Navigator>
  );
};

export default AppNavigator;