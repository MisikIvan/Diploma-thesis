import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from '../navigation/AuthNavigation';
import AppNavigator from '../navigation/AppNavigation';


const isAuthenticated = true; 

const RootNavigator = () => {
  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigator;