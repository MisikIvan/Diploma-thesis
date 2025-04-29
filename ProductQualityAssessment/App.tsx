import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import Navigation from './src/navigation';
import { t } from './src/utils/translations';
import { initializeLanguage } from './src/utils/languageStorage';

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function init() {
      await initializeLanguage();
      setIsInitialized(true);
    }
    init();
  }, []);

  if (!isInitialized) {
    return null; // Можна додати екран завантаження
  }

  return (
    <Provider store={store}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Navigation />
    </Provider>
  );
}
