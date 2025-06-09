import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { t } from '../utils/translations';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = t('loading') }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#34572a" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
});

export default LoadingScreen; 