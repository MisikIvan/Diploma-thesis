import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, setLanguage } from './translations';

const LANGUAGE_KEY = 'selected_language';


export const saveLanguage = async (language: Language): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.error('Error saving language setting:', error);
  }
};


export const loadLanguage = async (): Promise<Language | null> => {
  try {
    const language = await AsyncStorage.getItem(LANGUAGE_KEY);
    return language as Language | null;
  } catch (error) {
    console.error('Error loading language setting:', error);
    return null;
  }
};


export const initializeLanguage = async (): Promise<Language> => {
  try {
    const savedLanguage = await loadLanguage();
  
    const language = savedLanguage || 'uk';
    setLanguage(language);
    return language;
  } catch (error) {
    console.error('Error initializing language:', error);
   
    setLanguage('uk');
    return 'uk';
  }
}; 