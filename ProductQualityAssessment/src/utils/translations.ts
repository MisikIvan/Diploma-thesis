// Define translation keys
export interface TranslationKeys {
  // Common
  appName: string;
  loading: string;
  error: string;
  retry: string;
  tryAgain: string;
  cancel: string;
  save: string;
  delete: string;
  confirm: string;
  
  // Navigation
  home: string;
  favorites: string;
  profile: string;
  admin: string;
  
  // Screens
  homeScreen: string;
  favoritesScreen: string;
  profileScreen: string;
  adminScreen: string;
  productDetails: string;
  
  // Product
  noResults: string;
  networkError: string;
  searchPlaceholder: string;
  categories: string;
  ingredients: string;
  nutrition: string;
  calories: string;
  proteins: string;
  fats: string;
  carbs: string;
  salt: string;
  
  // User
  login: string;
  register: string;
  email: string;
  password: string;
  displayName: string;
  logout: string;
  
  // Additional keys
  nutritionalFacts: string;
  allergens: string;
  additives: string;
  logoutConfirmation: string;
  failedToLoadUser: string;
  
  // Product categories
  beverageCategory: string;
  breadCategory: string;
  dairyCategory: string;
  meatCategory: string;
  fishCategory: string;
  produceCategory: string;
  snacksCategory: string;
  eggsCategory: string;
  mealsCategory: string;
  
  // Product detail
  sugar: string;
  saturatedFats: string;
  carbohydrates: string;
  wholeProduct: string;
  noAllergensListed: string;
  vegan: string;
  vegetarian: string;
  lactoseFree: string;
  glutenFree: string;
  similarProducts: string;
  noSimilarProducts: string;
  noFavorites: string;
  startAdding: string;
  loginToSeeFavorites: string;

  // Auth Screen
  signIn: string;
  createAccount: string;
  name: string;
  confirmPassword: string;
  forgotPassword: string;
  or: string;
  continueWithGoogle: string;
  needAccount: string;
  alreadyHaveAccount: string;
  emailRequired: string;
  validEmail: string;
  passwordRequired: string;
  passwordLength: string;
  nameRequired: string;
  passwordsDoNotMatch: string;
  resetPassword: string;
  resetPasswordPrompt: string;
  send: string;
  resetEmailSent: string;
  resetPasswordConfirmation: string;
  registrationSuccessful: string;
  accountCreated: string;

  // Profile Screen
  editProfile: string;
  accountInfo: string;
  viewHistory: string;
  preferences: string;
  aboutApp: string;
  aboutAppInfo: string;
  languageSettings: string;
  dietarySettings: string;
  notificationSettings: string;
  success: string;
  profileUpdateSuccess: string;
  profileUpdateError: string;
  nameEmpty: string;
  featureNotImplemented: string;
  languageChanged: string;
  ok: string;
  ukrainian: string;
  english: string;
  selectLanguage: string;
  
  // Admin Panel
  products: string;
  users: string;
  addProduct: string;
  productName: string;
  imageUrl: string;
  blockUser: string;
  unblockUser: string;
  enableComments: string;
  disableComments: string;
  confirmDelete: string;
  deleteProductConfirmation: string;
  addNewProduct: string;
  productImageUrl: string;
  nutriscoreGrade: string;
  accessDenied: string;
  
  // Firebase Diagnostics
  firebaseDiagnostics: string;
  runPermissionTests: string;
  firebaseConfiguration: string;
  currentUser: string;
  testResults: string;
  productsCollection: string;
  usersCollection: string;
  commentsCollection: string;
  accessGranted: string;
  permissionDenied: string;
  howToFix: string;
  securityRulesUpdate: string;
  copyInstructions: string;
  quickFixSteps: string;
  developmentRulesWarning: string;
  rulesUpdateTime: string;
  diagnostics: string;
  role: string;
  status: string;
  active: string;
  blocked: string;
  projectId: string;
  apiKey: string;
  notLoggedIn: string;
  runningTests: string;

  // Form fields and product information
  weight: string;
  nutritionalInfo: string;
  perWholeProduct: string;
  calculatedAutomatically: string;
  dietaryInfo: string;
  
  // Firebase and demo mode
  goOnline: string;
  goOffline: string;
  firebaseConnected: string;
  firebaseConnectionFailed: string;
  confirmDemoMode: string;
  demoModeWarning: string;
  demoModeActivated: string;
  demoMode: string;
  
  // Product management
  demoModeActive: string;
  demoModeProductWarning: string;
  tryFirebase: string;
  firebaseProductAdded: string;
  productAddedLocally: string;
  continueDemo: string;
  productAdded: string;
  failedToAddProduct: string;
}

// English translations
const en: TranslationKeys = {
  // Common
  appName: 'Product Quality',
  loading: 'Loading...',
  error: 'An error occurred',
  retry: 'Retry',
  tryAgain: 'Try Again',
  cancel: 'Cancel',
  save: 'Save',
  delete: 'Delete',
  confirm: 'Confirm',
  
  // Navigation
  home: 'Home',
  favorites: 'Favorites',
  profile: 'Profile',
  admin: 'Admin',
  
  // Screens
  homeScreen: 'Home',
  favoritesScreen: 'Favorites',
  profileScreen: 'Profile',
  adminScreen: 'Admin Panel',
  productDetails: 'Product Details',
  
  // Product
  noResults: 'No products found',
  networkError: 'Could not connect to the server',
  searchPlaceholder: 'Search products...',
  categories: 'Categories',
  ingredients: 'Ingredients',
  nutrition: 'Nutrition Facts',
  calories: 'Calories',
  proteins: 'Proteins',
  fats: 'Fats',
  carbs: 'Carbohydrates',
  salt: 'Salt',
  
  // User
  login: 'Login',
  register: 'Register',
  email: 'Email',
  password: 'Password',
  displayName: 'Display Name',
  logout: 'Logout',
  
  // Additional translations
  nutritionalFacts: 'Nutritional Facts',
  allergens: 'Allergens',
  additives: 'Additives',
  logoutConfirmation: 'Are you sure you want to log out?',
  failedToLoadUser: 'Failed to load user data',
  
  // Product categories
  beverageCategory: 'Beverages',
  breadCategory: 'Bread & Bakery',
  dairyCategory: 'Dairy',
  meatCategory: 'Meat',
  fishCategory: 'Fish',
  produceCategory: 'Fruits & Vegetables',
  snacksCategory: 'Snacks',
  eggsCategory: 'Eggs',
  mealsCategory: 'Ready Meals',
  
  // Product detail
  sugar: 'Sugar',
  saturatedFats: 'Saturated Fats',
  carbohydrates: 'Carbohydrates',
  wholeProduct: 'Whole Product',
  noAllergensListed: 'No allergens listed',
  vegan: 'Vegan',
  vegetarian: 'Vegetarian',
  lactoseFree: 'Lactose-Free',
  glutenFree: 'Gluten-Free',
  similarProducts: 'Similar Products',
  noSimilarProducts: 'No similar products found',
  noFavorites: 'No favorites found',
  startAdding: 'Start adding favorites',
  loginToSeeFavorites: 'Login to see favorites',

  // Auth Screen
  signIn: 'Sign In',
  createAccount: 'Create Account',
  name: 'Name',
  confirmPassword: 'Confirm Password',
  forgotPassword: 'Forgot Password?',
  or: 'OR',
  continueWithGoogle: 'Continue with Google',
  needAccount: 'Need an account?',
  alreadyHaveAccount: 'Already have an account?',
  emailRequired: 'Email is required',
  validEmail: 'Please enter a valid email',
  passwordRequired: 'Password is required',
  passwordLength: 'Password must be at least 8 characters',
  nameRequired: 'Name is required',
  passwordsDoNotMatch: 'Passwords do not match',
  resetPassword: 'Reset Password',
  resetPasswordPrompt: 'Enter your email to receive a password reset link',
  send: 'Send',
  resetEmailSent: 'Reset Email Sent',
  resetPasswordConfirmation: 'A password reset link has been sent to {email}',
  registrationSuccessful: 'Registration Successful',
  accountCreated: 'Your account has been created. You can now log in.',

  // Profile Screen
  editProfile: 'Edit Profile',
  accountInfo: 'Account Information',
  viewHistory: 'View History',
  preferences: 'Preferences',
  aboutApp: 'About App',
  aboutAppInfo: 'About This App',
  languageSettings: 'Language',
  dietarySettings: 'Dietary Preferences',
  notificationSettings: 'Notifications',
  success: 'Success',
  profileUpdateSuccess: 'Profile updated successfully',
  profileUpdateError: 'Failed to update profile',
  nameEmpty: 'Name cannot be empty',
  featureNotImplemented: 'This feature is not implemented yet',
  languageChanged: 'Language Changed',
  ok: 'OK',
  ukrainian: 'Ukrainian',
  english: 'English',
  selectLanguage: 'Select Language',
  
  // Admin Panel
  products: 'Products',
  users: 'Users',
  addProduct: 'Add Product',
  productName: 'Product Name',
  imageUrl: 'Image URL',
  blockUser: 'Block User',
  unblockUser: 'Unblock User',
  enableComments: 'Enable Comments',
  disableComments: 'Disable Comments',
  confirmDelete: 'Are you sure you want to delete this product?',
  deleteProductConfirmation: 'The product has been deleted.',
  addNewProduct: 'Add New Product',
  productImageUrl: 'Product Image URL',
  nutriscoreGrade: 'Nutriscore Grade',
  accessDenied: 'Access Denied',
  
  // Firebase Diagnostics
  firebaseDiagnostics: 'Firebase Diagnostics',
  runPermissionTests: 'Run Permission Tests',
  firebaseConfiguration: 'Firebase Configuration',
  currentUser: 'Current User',
  testResults: 'Test Results',
  productsCollection: 'Products Collection',
  usersCollection: 'Users Collection',
  commentsCollection: 'Comments Collection',
  accessGranted: 'Access Granted',
  permissionDenied: 'Permission Denied',
  howToFix: 'How to Fix',
  securityRulesUpdate: 'Security Rules Update',
  copyInstructions: 'Copy Instructions',
  quickFixSteps: 'Quick Fix Steps',
  developmentRulesWarning: 'Development Rules Warning',
  rulesUpdateTime: 'Rules Update Time',
  diagnostics: 'Diagnostics',
  role: 'Role',
  status: 'Status',
  active: 'Active',
  blocked: 'Blocked',
  projectId: 'Project ID',
  apiKey: 'API Key',
  notLoggedIn: 'Not Logged In',
  runningTests: 'Running Tests',

  // Form fields and product information
  weight: 'Weight',
  nutritionalInfo: 'Nutritional Information',
  perWholeProduct: 'Per Whole Product',
  calculatedAutomatically: 'Values are calculated automatically based on weight and nutritional values',
  dietaryInfo: 'Dietary Information',
  
  // Firebase and demo mode
  goOnline: 'Go Online',
  goOffline: 'Go Offline',
  firebaseConnected: 'Connected to Firebase database',
  firebaseConnectionFailed: 'Failed to connect to Firebase',
  confirmDemoMode: 'Activate Demo Mode?',
  demoModeWarning: 'In demo mode, all changes will be saved locally and will be lost when you reload the app. No data will be saved to Firebase.',
  demoModeActivated: 'Demo mode activated',
  demoMode: 'DEMO MODE',
  
  // Product management
  demoModeActive: 'Demo Mode Active',
  demoModeProductWarning: 'In demo mode, products are saved locally and will be lost when you reload the app. Would you like to try saving to Firebase instead?',
  tryFirebase: 'Try Firebase',
  firebaseProductAdded: 'Product successfully added to Firebase database',
  productAddedLocally: 'Product was added to local storage only',
  continueDemo: 'Continue in Demo Mode',
  productAdded: 'Product added successfully',
  failedToAddProduct: 'Failed to add product'
}

// Ukrainian translations
const uk: TranslationKeys = {
  // Common
  appName: 'Якість продуктів',
  loading: 'Завантаження...',
  error: 'Сталася помилка',
  retry: 'Повторити',
  tryAgain: 'Спробувати ще раз',
  cancel: 'Скасувати',
  save: 'Зберегти',
  delete: 'Видалити',
  confirm: 'Підтвердити',
  
  // Navigation
  home: 'Головна',
  favorites: 'Улюблені',
  profile: 'Профіль',
  admin: 'Адмін',
  
  // Screens
  homeScreen: 'Головна',
  favoritesScreen: 'Улюблені',
  profileScreen: 'Профіль',
  adminScreen: 'Панель адміністратора',
  productDetails: 'Деталі продукту',
  
  // Product
  noResults: 'Продуктів не знайдено',
  networkError: 'Не вдалося підключитися до сервера',
  searchPlaceholder: 'Пошук продуктів...',
  categories: 'Категорії',
  ingredients: 'Інгредієнти',
  nutrition: 'Поживна цінність',
  calories: 'Калорії',
  proteins: 'Білки',
  fats: 'Жири',
  carbs: 'Вуглеводи',
  salt: 'Сіль',
  
  // User
  login: 'Увійти',
  register: 'Зареєструватися',
  email: 'Електронна пошта',
  password: 'Пароль',
  displayName: 'Ім\'я користувача',
  logout: 'Вийти',
  
  // Additional translations
  nutritionalFacts: 'Харчова цінність',
  allergens: 'Алергени',
  additives: 'Добавки',
  logoutConfirmation: 'Ви впевнені, що хочете вийти?',
  failedToLoadUser: 'Не вдалося завантажити дані користувача',
  
  // Product categories
  beverageCategory: 'Напої',
  breadCategory: 'Хліб та випічка',
  dairyCategory: 'Молочні продукти',
  meatCategory: 'М\'ясо',
  fishCategory: 'Риба',
  produceCategory: 'Фрукти та овочі',
  snacksCategory: 'Снеки',
  eggsCategory: 'Яйця',
  mealsCategory: 'Готові страви',
  
  // Product detail
  sugar: 'Цукор',
  saturatedFats: 'Насичені жири',
  carbohydrates: 'Вуглеводи',
  wholeProduct: 'Весь продукт',
  noAllergensListed: 'Алергени не вказані',
  vegan: 'Веганський',
  vegetarian: 'Вегетаріанський',
  lactoseFree: 'Без лактози',
  glutenFree: 'Без глютену',
  similarProducts: 'Схожі продукти',
  noSimilarProducts: 'Схожих продуктів не знайдено',
  noFavorites: 'Улюблених продуктів не знайдено',
  startAdding: 'Почати додавати улюблені',
  loginToSeeFavorites: 'Увійдіть для перегляду улюблених',

  // Auth Screen
  signIn: 'Увійти',
  createAccount: 'Створити обліковий запис',
  name: 'Ім\'я',
  confirmPassword: 'Підтвердіть пароль',
  forgotPassword: 'Забули пароль?',
  or: 'АБО',
  continueWithGoogle: 'Продовжити з Google',
  needAccount: 'Потрібен обліковий запис?',
  alreadyHaveAccount: 'Вже маєте обліковий запис?',
  emailRequired: 'Електронна пошта обов\'язкова',
  validEmail: 'Введіть правильну електронну пошту',
  passwordRequired: 'Пароль обов\'язковий',
  passwordLength: 'Пароль повинен містити щонайменше 8 символів',
  nameRequired: 'Ім\'я обов\'язкове',
  passwordsDoNotMatch: 'Паролі не співпадають',
  resetPassword: 'Скинути пароль',
  resetPasswordPrompt: 'Введіть вашу електронну пошту для отримання посилання на скидання пароля',
  send: 'Надіслати',
  resetEmailSent: 'Лист для скидання пароля надіслано',
  resetPasswordConfirmation: 'Посилання для скидання пароля надіслано на адресу {email}',
  registrationSuccessful: 'Реєстрація успішна',
  accountCreated: 'Ваш обліковий запис створено. Тепер ви можете увійти.',

  // Profile Screen
  editProfile: 'Редагувати профіль',
  accountInfo: 'Інформація про обліковий запис',
  viewHistory: 'Історія переглядів',
  preferences: 'Налаштування',
  aboutApp: 'Про додаток',
  aboutAppInfo: 'Про цей додаток',
  languageSettings: 'Мова',
  dietarySettings: 'Дієтичні вподобання',
  notificationSettings: 'Сповіщення',
  success: 'Успіх',
  profileUpdateSuccess: 'Профіль успішно оновлено',
  profileUpdateError: 'Не вдалося оновити профіль',
  nameEmpty: 'Ім\'я не може бути порожнім',
  featureNotImplemented: 'Ця функція ще не реалізована',
  languageChanged: 'Мову змінено',
  ok: 'OK',
  ukrainian: 'Українська',
  english: 'Англійська',
  selectLanguage: 'Виберіть мову',
  
  // Admin Panel
  products: 'Продукти',
  users: 'Користувачі',
  addProduct: 'Додати продукт',
  productName: 'Назва продукту',
  imageUrl: 'URL зображення',
  blockUser: 'Заблокувати користувача',
  unblockUser: 'Розблокувати користувача',
  enableComments: 'Дозволити коментарям',
  disableComments: 'Заборонити коментарям',
  confirmDelete: 'Ви впевнені, що хочете видалити цей продукт?',
  deleteProductConfirmation: 'Продукт був успішно видалений.',
  addNewProduct: 'Додати новий продукт',
  productImageUrl: 'URL зображення продукту',
  nutriscoreGrade: 'Рейтинг Nutriscore',
  accessDenied: 'Доступ заборонено',
  
  // Firebase Diagnostics
  firebaseDiagnostics: 'Firebase Диагностика',
  runPermissionTests: 'Запустити тести дозволів',
  firebaseConfiguration: 'Конфігурація Firebase',
  currentUser: 'Поточний користувач',
  testResults: 'Результати тестів',
  productsCollection: 'Коллекція продуктів',
  usersCollection: 'Коллекція користувачів',
  commentsCollection: 'Коллекція коментарів',
  accessGranted: 'Доступ надано',
  permissionDenied: 'Доступ заборонено',
  howToFix: 'Як виправити',
  securityRulesUpdate: 'Оновлення правил безпеки',
  copyInstructions: 'Інструкції для копіювання',
  quickFixSteps: 'Швидкі кроки для виправлення',
  developmentRulesWarning: 'Попередження про правила розробки',
  rulesUpdateTime: 'Час оновлення правил',
  diagnostics: 'Діагностика',
  role: 'Роль',
  status: 'Статус',
  active: 'Активний',
  blocked: 'Заблокований',
  projectId: 'Ідентифікатор проекту',
  apiKey: 'Ключ API',
  notLoggedIn: 'Не увійшов',
  runningTests: 'Виконуються тести',

  // Form fields and product information
  weight: 'Вага',
  nutritionalInfo: 'Харчова цінність',
  perWholeProduct: 'На весь продукт',
  calculatedAutomatically: 'Значення розраховуються автоматично на основі ваги та харчової цінності',
  dietaryInfo: 'Дієтична інформація',
  
  // Firebase and demo mode
  goOnline: 'Онлайн режим',
  goOffline: 'Офлайн режим',
  firebaseConnected: 'Підключено до бази даних Firebase',
  firebaseConnectionFailed: 'Не вдалося підключитися до Firebase',
  confirmDemoMode: 'Активувати демо-режим?',
  demoModeWarning: 'У демо-режимі всі зміни будуть збережені локально та будуть втрачені при перезавантаженні додатку. Дані не будуть збережені в Firebase.',
  demoModeActivated: 'Демо-режим активовано',
  demoMode: 'ДЕМО-РЕЖИМ',
  
  // Product management
  demoModeActive: 'Демо-режим активний',
  demoModeProductWarning: 'У демо-режимі продукти зберігаються локально і будуть втрачені при перезавантаженні додатка. Бажаєте спробувати зберегти в Firebase?',
  tryFirebase: 'Спробувати Firebase',
  firebaseProductAdded: 'Продукт успішно додано до бази даних Firebase',
  productAddedLocally: 'Продукт додано лише до локального сховища',
  continueDemo: 'Продовжити в демо-режимі',
  productAdded: 'Продукт успішно додано',
  failedToAddProduct: 'Не вдалося додати продукт'
}

export type Language = 'en' | 'uk';
const translations = { en, uk };
let currentLanguage: Language = 'en';


export const t = (key: keyof TranslationKeys): string => {
  return translations[currentLanguage][key];
};


export const setLanguage = (language: Language): void => {
  currentLanguage = language;
};


export const getCurrentLanguage = (): Language => {
  return currentLanguage;
};