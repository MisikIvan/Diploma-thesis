import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, setLanguage } from './translations';

const LANGUAGE_KEY = 'selected_language';

/**
 * Зберігає вибрану мову в AsyncStorage
 */
export const saveLanguage = async (language: Language): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.error('Error saving language setting:', error);
  }
};

/**
 * Отримує збережену мову з AsyncStorage
 */
export const loadLanguage = async (): Promise<Language | null> => {
  try {
    const language = await AsyncStorage.getItem(LANGUAGE_KEY);
    return language as Language | null;
  } catch (error) {
    console.error('Error loading language setting:', error);
    return null;
  }
};

/**
 * Ініціалізує мову додатка, завантажуючи збережене значення
 * або використовуючи українську мову за замовчуванням
 */
export const initializeLanguage = async (): Promise<Language> => {
  const savedLanguage = await loadLanguage();
  const language = savedLanguage || 'uk';
  setLanguage(language);
  return language;
}; 