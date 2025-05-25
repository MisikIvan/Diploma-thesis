import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  SlideInRight, 
  SlideInLeft,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming
} from 'react-native-reanimated';
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

// Types
import { RootStackParamList, BottomTabParamList } from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

const AnimatedTabIcon = ({ focused, iconName, color }: { focused: boolean, iconName: string, color: string }) => {
  const scale = useSharedValue(focused ? 1.2 : 1);
  const opacity = useSharedValue(focused ? 1 : 0.7);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.2 : 1, {
      damping: 15,
      stiffness: 150,
    });
    opacity.value = withTiming(focused ? 1 : 0.7, {
      duration: 200,
    });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons name={iconName as any} size={24} color={color} />
    </Animated.View>
  );
};

const MainTabs = () => {
  const currentUser = useAppSelector(state => state.user.currentUser);
  const isAdmin = currentUser?.role === 'admin';

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }: { route: any }) => ({
        tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Admin') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <AnimatedTabIcon focused={focused} iconName={iconName} color={color} />;
        },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarStyle: {
          backgroundColor: '#34572a',
          borderTopWidth: 0,
          height: 70,
          borderRadius: 30,
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.4,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
          marginBottom: 8,
        },
        tabBarItemStyle: {
          padding: 8,
          justifyContent: 'center',
          alignItems: 'center',
        },
        headerShown: false,
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
  <Animated.View style={styles.container} entering={FadeInUp.duration(800)}>
    <Animated.View entering={FadeInDown.delay(200).duration(600)}>
      <ActivityIndicator size="large" color="#34572a" />
    </Animated.View>
    <Animated.Text 
      style={styles.text} 
      entering={FadeInDown.delay(400).duration(600)}
    >
      {t('loading')}
    </Animated.Text>
  </Animated.View>
);

const ErrorScreen = ({ message }: { message: string }) => (
  <Animated.View style={styles.container} entering={FadeInUp.duration(800)}>
    <Animated.View entering={SlideInLeft.delay(200).duration(600)}>
      <Ionicons name="alert-circle-outline" size={50} color="#e74c3c" />
    </Animated.View>
    <Animated.Text 
      style={styles.errorText} 
      entering={SlideInRight.delay(400).duration(600)}
    >
      {message}
    </Animated.Text>
  </Animated.View>
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
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#34572a',
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4,
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
                opacity: current.progress.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 0.5, 1],
                }),
              },
            };
          },
        }}
      >
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
                title: route.params?.productName || t('productDetails'),
                headerBackTitleVisible: false,
              })}
            />
            {currentUser.role === 'admin' && (
              <>
                <Stack.Screen 
                  name="Admin" 
                  component={AdminScreen} 
                  options={{ 
                    title: t('adminScreen'),
                    headerBackTitleVisible: false,
                  }}
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
    backgroundColor: '#f8f9fa',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#34572a',
    fontWeight: '500',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    padding: 20,
    fontWeight: '500',
  },
});

export default Navigation; 