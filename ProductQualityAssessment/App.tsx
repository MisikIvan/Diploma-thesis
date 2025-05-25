import React, { useEffect, useState } from 'react';
import { StatusBar, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import 'react-native-reanimated';
import store from './src/redux/store';
import Navigation from './src/navigation';
import { t } from './src/utils/translations';
import { initializeLanguage } from './src/utils/languageStorage';

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        console.log('Initializing app...');
        await initializeLanguage();
        console.log('Language initialized');
        setIsInitialized(true);
      } catch (err) {
        console.error('Error initializing app:', err);
        setError('Failed to initialize app. Please restart.');
      }
    }
    init();
  }, []);

  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Product Quality Assessment</Text>
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <>
            <ActivityIndicator size="large" color="#34572a" />
            <Text style={styles.loading}>Loading...</Text>
          </>
        )}
      </View>
    );
  }

  return (
    <Provider store={store}>
      <StatusBar barStyle="light-content" backgroundColor="#34572a" />
      <Navigation />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#34572a',
  },
  loading: {
    marginTop: 10,
    color: '#34572a',
    fontSize: 16,
  },
  error: {
    color: '#e74c3c',
    marginTop: 10,
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
  },
});
