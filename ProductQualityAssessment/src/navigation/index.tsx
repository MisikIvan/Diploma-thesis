import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons, MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';
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
import PersonalDetailsScreen from '../screens/PersonalDetailsScreen';
import WeightPickerScreen from '../screens/WeightPickerScreen';
import HeightPickerScreen from '../screens/HeightPickerScreen';
import AgePickerScreen from '../screens/AgePickerScreen';
import GenderPickerScreen from '../screens/GenderPickerScreen';
import AuthScreen from '../screens/AuthScreen';
import NewAdminScreen from '../screens/NewAdminScreen';
import EditProductScreen from '../screens/EditProductScreen';
import ProductSearchScreen from '../screens/ProductSearchScreen';
import UserSearchScreen from '../screens/UserSearchScreen';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';

// Components
import LoadingScreen from '../components/LoadingScreen';
import ErrorScreen from '../components/ErrorScreen';

// Types
import { RootStackParamList, BottomTabParamList } from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

const AnimatedTabIcon = ({ focused, iconName, iconType, color }: { 
  focused: boolean, 
  iconName: string, 
  iconType: 'ionicons' | 'material' | 'fontawesome5' | 'feather',
  color: string 
}) => {
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

  const renderIcon = () => {
    const size = 24;
    switch (iconType) {
      case 'material':
        return <MaterialIcons name={iconName as any} size={size} color={color} />;
      case 'fontawesome5':
        return <FontAwesome5 name={iconName as any} size={size} color={color} />;
      case 'feather':
        return <Feather name={iconName as any} size={size} color={color} />;
      default:
        return <Ionicons name={iconName as any} size={size} color={color} />;
    }
  };

  return (
    <Animated.View style={animatedStyle}>
      {renderIcon()}
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
          let iconType: 'ionicons' | 'material' | 'fontawesome5' | 'feather' = 'ionicons';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home';
            iconType = 'feather';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'user' : 'user';
            iconType = 'feather';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart';
            iconType = 'feather';
          } else if (route.name === 'Admin') {
            iconName = focused ? 'shield' : 'shield';
            iconType = 'feather';
          }

          return <AnimatedTabIcon focused={focused} iconName={iconName} iconType={iconType} color={color} />;
        },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarStyle: {
          backgroundColor: '#34572a',
          borderTopWidth: 0,
          height: 75,
          borderRadius: 35,
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.5,
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          marginTop: 4,
          marginBottom: 12,
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
          component={NewAdminScreen} 
          options={{ title: t('admin') }} 
        />
      )}
    </Tab.Navigator>
  );
};

const Navigation = () => {
  const dispatch = useAppDispatch();
  const { currentUser, loading, error } = useAppSelector(state => state.user);

  useEffect(() => {
    console.log('Checking authentication...');
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return <LoadingScreen message={t('loading')} />;
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
            <Stack.Screen
              name="PersonalDetails"
              component={PersonalDetailsScreen}
              options={{ 
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="WeightPicker"
              component={WeightPickerScreen as any}
              options={{ 
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="HeightPicker"
              component={HeightPickerScreen as any}
              options={{ 
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="AgePicker"
              component={AgePickerScreen as any}
              options={{ 
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="GenderPicker"
              component={GenderPickerScreen as any}
              options={{ 
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="TermsOfService"
              component={TermsOfServiceScreen}
              options={{ 
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="PrivacyPolicy"
              component={PrivacyPolicyScreen}
              options={{ 
                headerShown: false,
              }}
            />
            {currentUser.role === 'admin' && (
              <>
                <Stack.Screen 
                  name="EditProduct" 
                  component={EditProductScreen as any} 
                  options={{ 
                    title: t('editProduct'),
                    headerBackTitleVisible: false,
                  }}
                />
                <Stack.Screen 
                  name="ProductSearch" 
                  component={ProductSearchScreen} 
                  options={{ 
                    title: t('searchProducts'),
                    headerBackTitleVisible: false,
                    headerShown: false,
                  }}
                />
                <Stack.Screen 
                  name="UserSearch" 
                  component={UserSearchScreen as any} 
                  options={{ 
                    title: t('searchUsers'),
                    headerBackTitleVisible: false,
                    headerShown: false,
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

});

export default Navigation; 