import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppSelector } from '../hooks';

// Stacks
import HomeStack from './stacks/HomeStack';
import SearchStack from './stacks/SearchStack';
import ProfileStack from './stacks/ProfileStack';

// Screens
import FavoritesScreen from '../screens/FavoritesScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';

// Types
import { MainTabParamList, RootStackParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const MainTabNavigator = () => {
  const user = useAppSelector(state => state.auth.user);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'alert-circle'; 

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2ECC71',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ title: 'Головна' }} />
      <Tab.Screen name="Search" component={SearchStack} options={{ title: 'Пошук' }} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Улюблене' }} />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ title: 'Профіль' }} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen 
        name="ProductDetails" 
        component={ProductDetailScreen}
        options={{
          headerShown: true,
          title: 'Деталі продукту',
          headerTintColor: '#2ECC71',
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;