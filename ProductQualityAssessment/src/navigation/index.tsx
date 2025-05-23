import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { checkAuth } from '../redux/slices/userSlice';
import { t } from '../utils/translations';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AuthScreen from '../screens/AuthScreen';
import AdminScreen from '../screens/AdminScreen';
import DiagnosticsScreen from '../screens/DiagnosticsScreen';

// Types
import { RootStackParamList, BottomTabParamList } from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

const MainTabs = () => {
  const currentUser = useAppSelector(state => state.user.currentUser);
  const isAdmin = currentUser?.role === 'admin';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Admin') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: t('home') }} 
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: t('favorites') }} 
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: t('profile') }} 
      />
      {isAdmin && (
        <Tab.Screen 
          name="Admin" 
          component={AdminScreen} 
          options={{ title: t('admin') }} 
      />
      )}
    </Tab.Navigator>
  );
};

const LoadingScreen = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#007AFF" />
    <Text style={styles.text}>{t('loading')}</Text>
  </View>
);

const ErrorScreen = ({ message }: { message: string }) => (
  <View style={styles.container}>
    <Ionicons name="alert-circle-outline" size={50} color="red" />
    <Text style={styles.errorText}>{message}</Text>
  </View>
);

const Navigation = () => {
  const dispatch = useAppDispatch();
  const { currentUser, loading, error } = useAppSelector(state => state.user);

  useEffect(() => {
    console.log('Checking authentication...');
    dispatch(checkAuth());
  }, [dispatch]);

 
  if (loading) {
    return <LoadingScreen />;
  }

  
  if (error) {
    return <ErrorScreen message={error} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!currentUser ? (
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ headerShown: false }}
      />
        ) : (
          <>
      <Stack.Screen
        name="Main"
              component={MainTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
              component={ProductDetailScreen as any} 
              options={({ route }: { route: any }) => ({ 
                title: route.params?.productName || t('productDetails')
        })}
      />
            {currentUser.role === 'admin' && (
              <>
                <Stack.Screen 
                  name="Admin" 
                  component={AdminScreen} 
                  options={{ title: t('adminScreen') }}
                />
                <Stack.Screen 
                  name="Diagnostics" 
                  component={DiagnosticsScreen} 
                  options={{ title: t('diagnostics') }}
                />
              </>
            )}
          </>
        )}
    </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    padding: 20,
  },
});

export default Navigation; 