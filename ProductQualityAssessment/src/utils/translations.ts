// Визначення доступних мов
export type Language = 'uk' | 'en';

// Тип для зберігання перекладів
export type TranslationKeys = {
  // Загальні фрази
  appName: string;
  loading: string;
  error: string;
  noResults: string;
  
  // Навігація
  home: string;
  favorites: string;
  profile: string;
  
  // Екран авторизації
  signIn: string;
  createAccount: string;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  forgotPassword: string;
  login: string;
  register: string;
  signInWithGoogle: string;
  alreadyHaveAccount: string;
  dontHaveAccount: string;
  
  // Форма - повідомлення про помилки
  emailRequired: string;
  validEmail: string;
  passwordRequired: string;
  passwordLength: string;
  nameRequired: string;
  passwordsDoNotMatch: string;
  
  // Екран профілю
  profileSettings: string;
  accountInfo: string;
  preferences: string;
  aboutApp: string;
  logout: string;
  editProfile: string;
  viewHistory: string;
  dietarySettings: string;
  notificationSettings: string;
  aboutAppInfo: string;
  privacyPolicy: string;
  contactSupport: string;
  retry: string;
  
  // Екран продуктів
  search: string;
  filter: string;
  categories: string;
  recentProducts: string;
  seeAll: string;
  
  // Категорії продуктів
  beverageCategory: string;
  breadCategory: string;
  dairyCategory: string;
  meatCategory: string;
  fishCategory: string;
  produceCategory: string;
  snacksCategory: string;
  eggsCategory: string;
  mealsCategory: string;
  
  // Екран деталей продукту
  productDetails: string;
  nutritionalFacts: string;
  ingredients: string;
  allergens: string;
  additives: string;
  nutrition: string;
  calories: string;
  proteins: string;
  carbohydrates: string;
  sugar: string;
  fats: string;
  saturatedFats: string;
  salt: string;
  wholeProduct: string;
  noIngredientsListed: string;
  noAllergensListed: string;
  
  // Дієтичні властивості
  vegan: string;
  vegetarian: string;
  lactoseFree: string;
  glutenFree: string;
  
  // Екран улюблених
  yourFavorites: string;
  noFavorites: string;
  startAdding: string;
  
  // Повідомлення
  registrationSuccessful: string;
  accountCreated: string;
  resetPassword: string;
  resetPasswordPrompt: string;
  resetEmailSent: string;
  resetPasswordConfirmation: string;
  ok: string;
  cancel: string;
  send: string;
  
  // Помилки та повідомлення
  success: string;
  profileUpdateSuccess: string;
  profileUpdateError: string;
  nameEmpty: string;
  featureNotImplemented: string;
  logoutConfirmation: string;
  failedToLoadUser: string;
  networkError: string;

  // Компонент подібних продуктів
  similarProducts: string;
  noSimilarProducts: string;
  
  // Налаштування мови
  language: string;
  languageSettings: string;
  selectLanguage: string;
  ukrainian: string;
  english: string;
  languageChanged: string;
};

// Український словник
const ukTranslations: TranslationKeys = {
  // Загальні фрази
  appName: 'Оцінка якості продуктів',
  loading: 'Завантаження...',
  error: 'Помилка. Спробуйте знову.',
  noResults: 'Результатів не знайдено. Спробуйте інший пошуковий запит.',
  
  // Навігація
  home: 'Головна',
  favorites: 'Улюблені',
  profile: 'Профіль',
  
  // Екран авторизації
  signIn: 'Увійти до облікового запису',
  createAccount: 'Створити новий обліковий запис',
  email: 'Електронна пошта',
  password: 'Пароль',
  confirmPassword: 'Підтвердіть пароль',
  name: 'Ім\'я',
  forgotPassword: 'Забули пароль?',
  login: 'Увійти',
  register: 'Зареєструватися',
  signInWithGoogle: 'Увійти через Google',
  alreadyHaveAccount: 'Вже маєте обліковий запис?',
  dontHaveAccount: 'Ще немає облікового запису?',
  
  // Форма - повідомлення про помилки
  emailRequired: 'Електронна пошта обов\'язкова',
  validEmail: 'Введіть коректну адресу електронної пошти',
  passwordRequired: 'Пароль обов\'язковий',
  passwordLength: 'Пароль має містити щонайменше 8 символів',
  nameRequired: 'Ім\'я обов\'язкове',
  passwordsDoNotMatch: 'Паролі не співпадають',
  
  // Екран профілю
  profileSettings: 'Налаштування профілю',
  accountInfo: 'Інформація про обліковий запис',
  preferences: 'Налаштування',
  aboutApp: 'Про додаток',
  logout: 'Вийти',
  editProfile: 'Редагувати профіль',
  viewHistory: 'Історія переглядів',
  dietarySettings: 'Налаштування дієтичних обмежень',
  notificationSettings: 'Налаштування сповіщень',
  aboutAppInfo: 'Про додаток',
  privacyPolicy: 'Політика конфіденційності',
  contactSupport: 'Зв\'язатися з підтримкою',
  retry: 'Спробувати знову',
  
  // Екран продуктів
  search: 'Пошук продуктів...',
  filter: 'Фільтр',
  categories: 'Категорії',
  recentProducts: 'Нещодавно переглянуті',
  seeAll: 'Переглянути все',
  
  // Категорії продуктів
  beverageCategory: 'Напої',
  breadCategory: 'Хліб та випічка',
  dairyCategory: 'Молочні продукти',
  meatCategory: 'М\'ясо',
  fishCategory: 'Риба',
  produceCategory: 'Фрукти та овочі',
  snacksCategory: 'Снеки',
  eggsCategory: 'Яйця',
  mealsCategory: 'Готові страви',
  
  // Екран деталей продукту
  productDetails: 'Деталі продукту',
  nutritionalFacts: 'Харчова цінність (на 100г)',
  ingredients: 'Склад',
  allergens: 'Алергени',
  additives: 'Добавки',
  nutrition: 'Харчування',
  calories: 'Калорії',
  proteins: 'Білки',
  carbohydrates: 'Вуглеводи',
  sugar: 'Цукор',
  fats: 'Жири',
  saturatedFats: 'Насичені жири',
  salt: 'Сіль',
  wholeProduct: 'Весь продукт',
  noIngredientsListed: 'Складники не вказані.',
  noAllergensListed: 'Алергени не вказані.',
  
  // Дієтичні властивості
  vegan: 'Веган',
  vegetarian: 'Вегетаріанець',
  lactoseFree: 'Без лактози',
  glutenFree: 'Без глютену',
  
  // Екран улюблених
  yourFavorites: 'Ваші улюблені',
  noFavorites: 'У вас ще немає улюблених продуктів',
  startAdding: 'Почніть додавати продукти до улюблених!',
  
  // Повідомлення
  registrationSuccessful: 'Реєстрація успішна',
  accountCreated: 'Ваш обліковий запис створено. Тепер ви можете увійти.',
  resetPassword: 'Скинути пароль',
  resetPasswordPrompt: 'Введіть вашу електронну адресу, і ми надішлемо вам посилання для скидання пароля.',
  resetEmailSent: 'Електронний лист надіслано',
  resetPasswordConfirmation: 'Якщо обліковий запис існує для {email}, ви отримаєте електронний лист з інструкціями.',
  ok: 'OK',
  cancel: 'Скасувати',
  send: 'Надіслати',
  
  // Помилки та повідомлення
  success: 'Успіх',
  profileUpdateSuccess: 'Профіль оновлено успішно',
  profileUpdateError: 'Не вдалося оновити профіль',
  nameEmpty: 'Ім\'я не може бути порожнім',
  featureNotImplemented: 'Ця функція ще не реалізована',
  logoutConfirmation: 'Ви впевнені, що хочете вийти з облікового запису?',
  failedToLoadUser: 'Не вдалося завантажити дані користувача',
  networkError: 'Помилка мережі. Помилка. Спробуйте знову.',

  // Компонент подібних продуктів
  similarProducts: 'Схожі продукти',
  noSimilarProducts: 'Схожих продуктів не знайдено',
  
  // Налаштування мови
  language: 'Мова',
  languageSettings: 'Налаштування мови',
  selectLanguage: 'Оберіть мову',
  ukrainian: 'Українська',
  english: 'Англійська',
  languageChanged: 'Мову змінено',
};

// Англійський словник
const enTranslations: TranslationKeys = {
  // Загальні фрази
  appName: 'Product Quality Assessment',
  loading: 'Loading...',
  error: 'Error. Please try again.',
  noResults: 'No results found. Try a different search term.',
  
  // Навігація
  home: 'Home',
  favorites: 'Favorites',
  profile: 'Profile',
  
  // Екран авторизації
  signIn: 'Sign in to your account',
  createAccount: 'Create a new account',
  email: 'Email',
  password: 'Password',
  confirmPassword: 'Confirm Password',
  name: 'Name',
  forgotPassword: 'Forgot password?',
  login: 'Login',
  register: 'Register',
  signInWithGoogle: 'Sign in with Google',
  alreadyHaveAccount: 'Already have an account?',
  dontHaveAccount: 'Don\'t have an account?',
  
  // Форма - повідомлення про помилки
  emailRequired: 'Email is required',
  validEmail: 'Please enter a valid email address',
  passwordRequired: 'Password is required',
  passwordLength: 'Password must be at least 8 characters long',
  nameRequired: 'Name is required',
  passwordsDoNotMatch: 'Passwords do not match',
  
  // Екран профілю
  profileSettings: 'Profile Settings',
  accountInfo: 'Account Information',
  preferences: 'Preferences',
  aboutApp: 'About App',
  logout: 'Logout',
  editProfile: 'Edit Profile',
  viewHistory: 'View History',
  dietarySettings: 'Dietary Settings',
  notificationSettings: 'Notification Settings',
  aboutAppInfo: 'About App',
  privacyPolicy: 'Privacy Policy',
  contactSupport: 'Contact Support',
  retry: 'Try Again',
  
  // Екран продуктів
  search: 'Search products...',
  filter: 'Filter',
  categories: 'Categories',
  recentProducts: 'Recently Viewed',
  seeAll: 'See All',
  
  // Категорії продуктів
  beverageCategory: 'Beverages',
  breadCategory: 'Bread & Bakery',
  dairyCategory: 'Dairy',
  meatCategory: 'Meat',
  fishCategory: 'Fish',
  produceCategory: 'Fruits & Vegetables',
  snacksCategory: 'Snacks',
  eggsCategory: 'Eggs',
  mealsCategory: 'Ready Meals',
  
  // Екран деталей продукту
  productDetails: 'Product Details',
  nutritionalFacts: 'Nutritional Facts (per 100g)',
  ingredients: 'Ingredients',
  allergens: 'Allergens',
  additives: 'Additives',
  nutrition: 'Nutrition',
  calories: 'Calories',
  proteins: 'Proteins',
  carbohydrates: 'Carbohydrates',
  sugar: 'Sugar',
  fats: 'Fats',
  saturatedFats: 'Saturated Fats',
  salt: 'Salt',
  wholeProduct: 'Whole Product',
  noIngredientsListed: 'No ingredients listed.',
  noAllergensListed: 'No allergens listed.',
  
  // Дієтичні властивості
  vegan: 'Vegan',
  vegetarian: 'Vegetarian',
  lactoseFree: 'Lactose-Free',
  glutenFree: 'Gluten-Free',
  
  // Екран улюблених
  yourFavorites: 'Your Favorites',
  noFavorites: 'You haven\'t added any favorites yet',
  startAdding: 'Start adding products to favorites!',
  
  // Повідомлення
  registrationSuccessful: 'Registration Successful',
  accountCreated: 'Your account has been created. You can now log in.',
  resetPassword: 'Reset Password',
  resetPasswordPrompt: 'Enter your email address and we will send you a password reset link.',
  resetEmailSent: 'Reset Email Sent',
  resetPasswordConfirmation: 'If an account exists for {email}, you will receive an email with instructions.',
  ok: 'OK',
  cancel: 'Cancel',
  send: 'Send',
  
  // Помилки та повідомлення
  success: 'Success',
  profileUpdateSuccess: 'Profile updated successfully',
  profileUpdateError: 'Failed to update profile',
  nameEmpty: 'Name cannot be empty',
  featureNotImplemented: 'This feature is not implemented yet',
  logoutConfirmation: 'Are you sure you want to log out?',
  failedToLoadUser: 'Failed to load user data',
  networkError: 'Network Error. Error. Please try again.',

  // Компонент подібних продуктів
  similarProducts: 'Similar Products',
  noSimilarProducts: 'No similar products found',
  
  // Налаштування мови
  language: 'Language',
  languageSettings: 'Language Settings',
  selectLanguage: 'Select Language',
  ukrainian: 'Ukrainian',
  english: 'English',
  languageChanged: 'Language Changed',
};

// Словники для кожної мови
const dictionaries = {
  uk: ukTranslations,
  en: enTranslations,
};

// Глобальна змінна для збереження поточної мови
let currentLanguage: Language = 'uk';

// Функція для отримання поточної мови
export const getCurrentLanguage = (): Language => {
  return currentLanguage;
};

// Функція для зміни мови
export const setLanguage = (language: Language): void => {
  currentLanguage = language;
};

// Функція для отримання перекладів поточною мовою
export const getTranslations = (): TranslationKeys => {
  return dictionaries[currentLanguage];
};

// Експортуємо фунцію для отримання локалізованих рядків
export const t = (key: keyof TranslationKeys): string => {
  return dictionaries[currentLanguage][key];
};

// Експортуємо переклади
export const translations = dictionaries[currentLanguage]; 