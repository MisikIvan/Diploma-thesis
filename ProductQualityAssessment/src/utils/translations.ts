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
  yes: string;
  no: string;
  
  // Navigation
  home: string;
  favorites: string;
  profile: string;
  admin: string;
  
  // Screens
  homeScreen: string;
  favoritesScreen: string;
  profileScreen: string;
  productDetails: string;
  
  // Product
  noResults: string;
  networkError: string;
  searchPlaceholder: string;
  categories: string;
  recentProducts: string;
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
  description: string;
  productDescription: string;
  
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
  
  // Comments and Reviews
  reviews: string;
  comments: string;
  leaveComment: string;
  yourRating: string;
  commentPlaceholder: string;
  submitComment: string;
  allComments: string;
  noComments: string;
  beFirstToComment: string;
  ratingRequired: string;
  commentSuccess: string;
  commentDeleted: string;
  deleteComment: string;
  
  // Form fields and product information
  weight: string;
  nutritionalInfo: string;
  perWholeProduct: string;
  calculatedAutomatically: string;
  dietaryInfo: string;
  role: string;
  
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

  // New key
  composition: string;

  // Short versions for navigation
  nutritionShort: string;
  compositionShort: string;
  reviewsShort: string;

  // New translations for admin form
  containsLactose: string;
  containsGluten: string;
  
  // Tags system
  tags: string;
  addTags: string;
  tagsPlaceholder: string;
  availableTags: string;
  noTags: string;
  
  // Predefined tags
  tagVegan: string;
  tagVegetarian: string;
  tagLactoseFree: string;
  tagGlutenFree: string;
  tagOrganic: string;
  tagBio: string;
  tagDiabeteFriendly: string;
  tagLowFat: string;
  tagLowSugar: string;
  tagHighProtein: string;
  tagNatural: string;
  tagLocal: string;
  
  // Avatar functionality
  selectAvatar: string;
  avatarUpdateSuccess: string;
  avatarUpdateError: string;
  
  // Admin info
  adminInfo: string;
  added: string;
  lastUpdated: string;
  createdBy: string;
  
  // Additional missing translations
  per100g: string;
  detailedComposition: string;
  productNotFound: string;
  loadingProduct: string;
  productUpdatedSuccessfully: string;
  updateProductError: string;
  editProduct: string;
  detailedProductDescription: string;
  alternativeImageUrl: string;
  productNameRequired: string;
  authenticationError: string;
  allergensPlaceholder: string;
  additivesPlaceholder: string;
  adminOnlyEdit: string;
  legacyFieldsNote: string;
  
  // ImageUploader translations
  productImage: string;
  addImage: string;
  changeImage: string;
  clickToAddImage: string;
  clickToChangeImage: string;
  uploading: string;
  permissionRequired: string;
  permissionRequiredMessage: string;
  imagePickError: string;
  webUploadInfo: string;
  webUploadNote: string;
  imageUploadSuccess: string;
  imageUploadError: string;
  
  // New Admin Panel translations
  adminPanel: string;
  userGrowth: string;
  productGrowth: string;
  userManagement: string;
  productManagement: string;
  searchUsers: string;
  searchProducts: string;
  searchAndManageUsers: string;
  searchAndManageProducts: string;
  totalUsers: string;
  totalProducts: string;
  registeredUsers: string;
  productsInDatabase: string;
  admins: string;
  blocked: string;
  gradeA: string;
  beverages: string;
  demo: string;
  live: string;
  
  // Product submissions
  suggestProduct: string;
  suggestProductBanner: string;
  productSubmissions: string;
  submitProduct: string;
  submissionForm: string;
  additionalImages: string;
  addMoreImages: string;
  removeImage: string;
  verificationInfo: string;
  barcode: string;
  sourceInfo: string;
  manufacturer: string;
  countryOfOrigin: string;
  whereFoundProduct: string;
  submissionSuccess: string;
  submissionError: string;
  productSubmitted: string;
  submissionUnderReview: string;
  
  // Admin submissions review
  reviewSubmissions: string;
  pendingSubmissions: string;
  submissionStatus: string;
  submittedBy: string;
  submittedOn: string;
  reviewSubmission: string;
  approveSubmission: string;
  rejectSubmission: string;
  rejectionReason: string;
  approveConfirm: string;
  rejectConfirm: string;
  submissionApproved: string;
  submissionRejected: string;
  noSubmissions: string;
  viewDetails: string;
  editBeforeApproval: string;
  loadingUsers: string;
  loadingProducts: string;
  usersNotFound: string;
  productsNotFound: string;
  tryAnotherSearch: string;
  waitForLoading: string;
  enterUserDetails: string;
  enterProductDetails: string;
  foundUsers: string;
  foundProducts: string;
  userRoleChanged: string;
  userBlocked: string;
  userUnblocked: string;
  userRoleChangeError: string;
  userBlockError: string;
  changeUserRole: string;
  deleteProductConfirm: string;
  actionCannotBeUndone: string;
  productDeletedSuccessfully: string;
  unknownName: string;
  unknownBrand: string;
  productWeight: string;
  productBarcode: string;
  whereDidYouFind: string;
  addFromDevice: string;
  expandDatabase: string;
  helpExpandDatabase: string;
  photoError: string;
  authenticationRequired: string;
  authenticationRequiredDelete: string;
  userState: string;
  submittedDate: string;
  reviewedDate: string;
  pending: string;
  processed: string;
  submissionInfo: string;
  basicInformation: string;
  notSpecified: string;
  images: string;
  nutritionalValue: string;
  additionalInfo: string;
  none: string;
  verificationInformation: string;
  rejectionReasonTitle: string;
  nutritionalValuePer100g: string;
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
  yes: 'Yes',
  no: 'No',
  
  // Navigation
  home: 'Home',
  favorites: 'Favorites',
  profile: 'Profile',
  admin: 'Admin',
  
  // Screens
  homeScreen: 'Home',
  favoritesScreen: 'Favorites',
  profileScreen: 'Profile',
  productDetails: 'Product Details',
  
  // Product
  noResults: 'No products found',
  networkError: 'Could not connect to the server',
  searchPlaceholder: 'Search products...',
  categories: 'Categories',
  recentProducts: 'Recently Viewed Products',
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
  description: 'Description',
  productDescription: 'Product Description',
  
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
  
  // Comments and Reviews
  reviews: 'Reviews',
  comments: 'Comments',
  leaveComment: 'Leave a Comment',
  yourRating: 'Your Rating',
  commentPlaceholder: 'Write your comment here...',
  submitComment: 'Submit Comment',
  allComments: 'All Comments',
  noComments: 'No comments yet for this product.',
  beFirstToComment: 'Be the first to comment!',
  ratingRequired: 'Please select a rating before submitting',
  commentSuccess: 'Comment added successfully',
  commentDeleted: 'Comment deleted successfully',
  deleteComment: 'Delete Comment',
  
  // Form fields and product information
  weight: 'Weight',
  nutritionalInfo: 'Nutritional Information',
  perWholeProduct: 'Per Whole Product',
  calculatedAutomatically: 'Values are calculated automatically based on weight and nutritional values',
  dietaryInfo: 'Dietary Information',
  role: 'Role',
  
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
  failedToAddProduct: 'Failed to add product',

  // New key
  composition: 'Composition',

  // Short versions for navigation
  nutritionShort: 'KCPF',
  compositionShort: 'Composition',
  reviewsShort: 'Reviews',

  // New translations for admin form
  containsLactose: 'Contains Lactose',
  containsGluten: 'Contains Gluten',
  
  // Tags system
  tags: 'Tags',
  addTags: 'Add Tags',
  tagsPlaceholder: 'vegan, organic, gluten-free...',
  availableTags: 'Available Tags',
  noTags: 'No tags',
  
  // Predefined tags
  tagVegan: 'Vegan',
  tagVegetarian: 'Vegetarian',
  tagLactoseFree: 'Lactose-Free',
  tagGlutenFree: 'Gluten-Free',
  tagOrganic: 'Organic',
  tagBio: 'Bio',
  tagDiabeteFriendly: 'Diabete-Friendly',
  tagLowFat: 'Low Fat',
  tagLowSugar: 'Low Sugar',
  tagHighProtein: 'High Protein',
  tagNatural: 'Natural',
  tagLocal: 'Local',
  
  // Avatar functionality
  selectAvatar: 'Select Avatar',
  avatarUpdateSuccess: 'Avatar updated successfully',
  avatarUpdateError: 'Failed to update avatar',
  
  // Admin info
  adminInfo: 'Admin Information',
  added: 'Added',
  lastUpdated: 'Last updated',
  createdBy: 'Created by',
  
  // Additional missing translations
  per100g: 'Per 100g of product',
  detailedComposition: 'Detailed Composition',
  productNotFound: 'Product not found',
  loadingProduct: 'Loading product...',
  productUpdatedSuccessfully: 'Product updated successfully',
  updateProductError: 'Error updating product',
  editProduct: 'Edit Product',
  detailedProductDescription: 'Detailed product description...',
  alternativeImageUrl: '(alternative)',
  productNameRequired: 'Product name is required',
  authenticationError: 'Authentication error',
  allergensPlaceholder: 'Milk, eggs, gluten...',
  additivesPlaceholder: 'E100, E200...',
  adminOnlyEdit: 'Only administrators can edit products',
  legacyFieldsNote: 'These fields are kept for backward compatibility',
  
  // ImageUploader translations
  productImage: 'Product Image',
  addImage: 'Add Image',
  changeImage: 'Change',
  clickToAddImage: 'Click to add image',
  clickToChangeImage: 'Click to change image',
  uploading: 'Uploading...',
  permissionRequired: 'Permission Required',
  permissionRequiredMessage: 'Permission required to access image gallery',
  imagePickError: 'Error selecting image',
  webUploadInfo: 'Information',
  webUploadNote: 'On web platform, it is recommended to use image URL',
  imageUploadSuccess: 'Image uploaded successfully!',
  imageUploadError: 'Error uploading image',
  
  // New Admin Panel translations
  adminPanel: 'Admin Panel',
  userGrowth: 'User Growth',
  productGrowth: 'Product Growth',
  userManagement: 'User Management',
  productManagement: 'Product Management',
  searchUsers: 'Search Users',
  searchProducts: 'Search Products',
  searchAndManageUsers: 'Search and manage user accounts',
  searchAndManageProducts: 'Search and manage products',
  totalUsers: 'Total Users',
  totalProducts: 'Total Products',
  registeredUsers: 'Registered users',
  productsInDatabase: 'Products in database',
  admins: 'Admins',
  blocked: 'Blocked',
  gradeA: 'Grade A',
  beverages: 'Beverages',
  demo: 'Demo',
  live: 'Live',
  
  // Product submissions
  suggestProduct: 'Suggest Product',
  suggestProductBanner: 'Suggest Product Banner',
  productSubmissions: 'Product Submissions',
  submitProduct: 'Submit Product',
  submissionForm: 'Submission Form',
  additionalImages: 'Additional Images',
  addMoreImages: 'Add More Images',
  removeImage: 'Remove Image',
  verificationInfo: 'Verification Info',
  barcode: 'Barcode',
  sourceInfo: 'Source Info',
  manufacturer: 'Manufacturer',
  countryOfOrigin: 'Country of Origin',
  whereFoundProduct: 'Where Found Product',
  submissionSuccess: 'Submission Success',
  submissionError: 'Submission Error',
  productSubmitted: 'Product Submitted',
  submissionUnderReview: 'Submission Under Review',
  
  // Admin submissions review
  reviewSubmissions: 'Review Submissions',
  pendingSubmissions: 'Pending Submissions',
  submissionStatus: 'Submission Status',
  submittedBy: 'Submitted By',
  submittedOn: 'Submitted On',
  reviewSubmission: 'Review Submission',
  approveSubmission: 'Approve Submission',
  rejectSubmission: 'Reject Submission',
  rejectionReason: 'Rejection Reason',
  approveConfirm: 'Approve Confirm',
  rejectConfirm: 'Reject Confirm',
  submissionApproved: 'Submission Approved',
  submissionRejected: 'Submission Rejected',
  noSubmissions: 'No Submissions',
  viewDetails: 'View Details',
  editBeforeApproval: 'Edit Before Approval',
  loadingUsers: 'Loading users...',
  loadingProducts: 'Loading products...',
  usersNotFound: 'Users not found',
  productsNotFound: 'Products not found',
  tryAnotherSearch: 'Try another search',
  waitForLoading: 'Wait for loading',
  enterUserDetails: 'Enter user details',
  enterProductDetails: 'Enter product details',
  foundUsers: 'Users found',
  foundProducts: 'Products found',
  userRoleChanged: 'User role changed',
  userBlocked: 'User blocked',
  userUnblocked: 'User unblocked',
  userRoleChangeError: 'Error changing user role',
  userBlockError: 'Error blocking user',
  changeUserRole: 'Change user role',
  deleteProductConfirm: 'Delete product?',
  actionCannotBeUndone: 'Action cannot be undone',
  productDeletedSuccessfully: 'Product deleted successfully',
  unknownName: 'Unknown name',
  unknownBrand: 'Unknown brand',
  productWeight: 'Product weight',
  productBarcode: 'Product barcode',
  whereDidYouFind: 'Where did you find',
  addFromDevice: 'Add from device',
  expandDatabase: 'Expand database',
  helpExpandDatabase: 'Help expand database',
  photoError: 'Photo error',
  authenticationRequired: 'Authentication required',
  authenticationRequiredDelete: 'Authentication required for deletion',
  userState: 'Active',

  // New missing keys
  submittedDate: 'Submitted',
  reviewedDate: 'Reviewed',
  pending: 'Pending',
  processed: 'Processed',
  submissionInfo: 'Submission Information',
  basicInformation: 'Basic Information',
  notSpecified: 'Not specified',
  images: 'Images',
  nutritionalValue: 'Nutritional Value',
  additionalInfo: 'Additional Information',
  none: 'None',
  verificationInformation: 'Verification Information',
  rejectionReasonTitle: 'Rejection Reason',
  nutritionalValuePer100g: 'Nutritional Value (per 100g)',
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
  yes: 'Так',
  no: 'Ні',
  
  // Navigation
  home: 'Головна',
  favorites: 'Улюблені',
  profile: 'Профіль',
  admin: 'Адмін',
  
  // Screens
  homeScreen: 'Головна',
  favoritesScreen: 'Улюблені',
  profileScreen: 'Профіль',
  productDetails: 'Деталі продукту',
  
  // Product
  noResults: 'Продуктів не знайдено',
  networkError: 'Не вдалося підключитися до сервера',
  searchPlaceholder: 'Пошук продуктів...',
  categories: 'Категорії',
  recentProducts: 'Нещодавні переглянуті продукти',
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
  description: 'Опис',
  productDescription: 'Опис продукту',
  
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
  resetPasswordPrompt: 'Введіть електронну пошту для отримання посилання на скидання пароля',
  send: 'Надіслати',
  resetEmailSent: 'Лист для скидання пароля надіслано',
  resetPasswordConfirmation: 'Посилання для скидання пароля надіслано на адресу {email}',
  registrationSuccessful: 'Реєстрація успішна',
  accountCreated: 'Обліковий запис створено. Тепер ви можете увійти.',

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
  
  // Comments and Reviews
  reviews: 'Відгуки',
  comments: 'Коментарі',
  leaveComment: 'Залишити коментар',
  yourRating: 'Оцінка',
  commentPlaceholder: 'Напишіть коментар тут...',
  submitComment: 'Надіслати коментар',
  allComments: 'Всі коментарі',
  noComments: 'Поки немає коментарів для цього продукту.',
  beFirstToComment: 'Будьте першим, хто залишить коментар!',
  ratingRequired: 'Будь ласка, виберіть оцінку перед відправкою',
  commentSuccess: 'Коментар успішно додано',
  commentDeleted: 'Коментар успішно видалено',
  deleteComment: 'Видалити коментар',
  
  // Form fields and product information
  weight: 'Вага',
  nutritionalInfo: 'Харчова цінність',
  perWholeProduct: 'На весь продукт',
  calculatedAutomatically: 'Значення розраховуються автоматично на основі ваги та харчової цінності',
  dietaryInfo: 'Дієтична інформація',
  role: 'Роль',
  
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
  failedToAddProduct: 'Не вдалося додати продукт',

  // New key
  composition: 'Склад',

  // Short versions for navigation
  nutritionShort: 'КБЖВ',
  compositionShort: 'Склад',
  reviewsShort: 'Відгуки',

  // New translations for admin form
  containsLactose: 'Містить лактозу',
  containsGluten: 'Містить глютен',
  
  // Tags system
  tags: 'Теги',
  addTags: 'Додати теги',
  tagsPlaceholder: 'веганський, органічний, без глютену...',
  availableTags: 'Доступні теги',
  noTags: 'Немає тегів',
  
  // Predefined tags
  tagVegan: 'Веганський',
  tagVegetarian: 'Вегетаріанський',
  tagLactoseFree: 'Без лактози',
  tagGlutenFree: 'Без глютену',
  tagOrganic: 'Органічний',
  tagBio: 'Біо',
  tagDiabeteFriendly: 'Для діабетиків',
  tagLowFat: 'Низький вміст жиру',
  tagLowSugar: 'Низький вміст цукру',
  tagHighProtein: 'Високий вміст білка',
  tagNatural: 'Натуральний',
  tagLocal: 'Місцевий',
  
  // Avatar functionality
  selectAvatar: 'Вибрати аватар',
  avatarUpdateSuccess: 'Аватар успішно оновлено',
  avatarUpdateError: 'Не вдалося оновити аватар',
  
  // Admin info
  adminInfo: 'Адміністративна інформація',
  added: 'Додано',
  lastUpdated: 'Останнє оновлення',
  createdBy: 'Створено',
  
  // Additional missing translations
  per100g: 'На 100г продукту',
  detailedComposition: 'Детальний склад',
  productNotFound: 'Продукт не знайдено',
  loadingProduct: 'Завантаження продукту...',
  productUpdatedSuccessfully: 'Продукт успішно оновлено',
  updateProductError: 'Помилка оновлення продукту',
  editProduct: 'Редагувати продукт',
  detailedProductDescription: 'Детальний опис продукту...',
  alternativeImageUrl: '(альтернативний)',
  productNameRequired: 'Необхідно вказати назву продукту',
  authenticationError: 'Помилка аутентифікації',
  allergensPlaceholder: 'Молоко, яйця, глютен...',
  additivesPlaceholder: 'Е100, Е200...',
  adminOnlyEdit: 'Тільки адміністратори можуть редагувати продукти',
  legacyFieldsNote: 'Ці поля зберігаються для зворотної сумісності',
  
  // ImageUploader translations
  productImage: 'Зображення продукту',
  addImage: 'Додати зображення',
  changeImage: 'Змінити',
  clickToAddImage: 'Натисніть, щоб додати зображення',
  clickToChangeImage: 'Натисніть, щоб змінити зображення',
  uploading: 'Завантаження...',
  permissionRequired: 'Потрібен дозвіл',
  permissionRequiredMessage: 'Потрібен дозвіл для доступу до галереї зображень',
  imagePickError: 'Помилка при виборі зображення',
  webUploadInfo: 'Інформація',
  webUploadNote: 'Завантаження зображень на веб-платформі потребує додаткової настройки. Поки що використовуйте URL зображення.',
  imageUploadSuccess: 'Зображення успішно завантажено!',
  imageUploadError: 'Помилка при завантаженні зображення',
  
  // New Admin Panel translations
  adminPanel: 'Панель адміністратора',
  userGrowth: 'Зростання користувачів',
  productGrowth: 'Зростання продуктів',
  userManagement: 'Управління користувачами',
  productManagement: 'Управління продуктами',
  searchUsers: 'Пошук користувачів',
  searchProducts: 'Пошук продуктів',
  searchAndManageUsers: 'Пошук та управління обліковими записами користувачів',
  searchAndManageProducts: 'Пошук та управління продуктами',
  totalUsers: 'Всього користувачів',
  totalProducts: 'Всього продуктів',
  registeredUsers: 'Зареєстровані користувачі',
  productsInDatabase: 'Продукти в базі даних',
  admins: 'Адміністратори',
  blocked: 'Заблоковані',
  gradeA: 'Клас A',
  beverages: 'Напої',
  demo: 'Демо',
  live: 'Онлайн',
  
  // Product submissions
  suggestProduct: 'Пропонувати продукт',
  suggestProductBanner: 'Пропонувати банер продукту',
  productSubmissions: 'Продуктові подачі',
  submitProduct: 'Подати продукт',
  submissionForm: 'Форма подачі',
  additionalImages: 'Додаткові зображення',
  addMoreImages: 'Додати більше зображень',
  removeImage: 'Видалити зображення',
  verificationInfo: 'Інформація для верифікації',
  barcode: 'Штрих-код',
  sourceInfo: 'Інформація про джерело',
  manufacturer: 'Виробник',
  countryOfOrigin: 'Країна походження',
  whereFoundProduct: 'Де знайдено продукт',
  submissionSuccess: 'Подача успішна',
  submissionError: 'Помилка подачі',
  productSubmitted: 'Продукт подано',
  submissionUnderReview: 'Продукт у процесі перевірки',
  
  // Admin submissions review
  reviewSubmissions: 'Перевірка подач',
  pendingSubmissions: 'Очікуючі подачі',
  submissionStatus: 'Статус подачі',
  submittedBy: 'Поданий',
  submittedOn: 'Подано',
  reviewSubmission: 'Перевірка подачі',
  approveSubmission: 'Підтвердити подачу',
  rejectSubmission: 'Відхилити подачу',
  rejectionReason: 'Причина відхилення',
  approveConfirm: 'Підтвердити',
  rejectConfirm: 'Відхилити',
  submissionApproved: 'Подача підтверджена',
  submissionRejected: 'Подача відхилена',
  noSubmissions: 'Немає подач',
  viewDetails: 'Переглянути деталі',
  editBeforeApproval: 'Редагувати перед підтвердженням',
  loadingUsers: 'Завантаження користувачів...',
  loadingProducts: 'Завантаження продуктів...',
  usersNotFound: 'Користувачів не знайдено',
  productsNotFound: 'Продуктів не знайдено',
  tryAnotherSearch: 'Спробуйте інший пошук',
  waitForLoading: 'Зачекайте завантаження',
  enterUserDetails: 'Введіть дані користувача',
  enterProductDetails: 'Введіть дані продукту',
  foundUsers: 'Знайдено користувачів',
  foundProducts: 'Знайдено продуктів',
  userRoleChanged: 'Роль користувача змінено',
  userBlocked: 'Користувача заблоковано',
  userUnblocked: 'Користувача розблоковано',
  userRoleChangeError: 'Не вдалося змінити роль користувача',
  userBlockError: 'Не вдалося заблокувати користувача',
  changeUserRole: 'Змінити роль користувача',
  deleteProductConfirm: 'Видалити продукт',
  actionCannotBeUndone: 'Цю дію неможливо скасувати',
  productDeletedSuccessfully: 'Продукт успішно видалено',
  unknownName: 'Невідоме ім\'я',
  unknownBrand: 'Невідомий бренд',
  productWeight: 'Вага продукту (г)',
  productBarcode: 'Штрих-код продукту',
  whereDidYouFind: 'Де ви знайшли цей продукт?',
  addFromDevice: 'Додати з пристрою',
  expandDatabase: 'Розширити базу продуктів',
  helpExpandDatabase: 'Допоможіть розширити нашу базу продуктів',
  photoError: 'Помилка при зйомці фото',
  authenticationRequired: 'Потрібна авторизація',
  authenticationRequiredDelete: 'Потрібна авторизація для видалення продукту',
  userState: 'Активний',

  // New missing keys
  submittedDate: 'Подано',
  reviewedDate: 'Оброблено',
  pending: 'Очікують',
  processed: 'Оброблено',
  submissionInfo: 'Інформація про подачу',
  basicInformation: 'Основна інформація',
  notSpecified: 'Не вказано',
  images: 'Зображення',
  nutritionalValue: 'Харчова цінність',
  additionalInfo: 'Додаткова інформація',
  none: 'Немає',
  verificationInformation: 'Верифікаційна інформація',
  rejectionReasonTitle: 'Причина відхилення',
  nutritionalValuePer100g: 'Харчова цінність (на 100г)',
}

export type Language = 'en' | 'uk';
const translations = { en, uk } as const;
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