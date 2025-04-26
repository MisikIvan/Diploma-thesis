import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppSelector } from '../hooks';
import AuthNavigator from './AuthNavigation';
import AppNavigator from './AppNavigation';
import { View, ActivityIndicator } from 'react-native';

const RootNavigator = () => {
  const { user, loading } = useAppSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // We set initialized after first render to handle 
  // the initial loading state
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  if (!isInitialized || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2ECC71" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigator;