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
  passwordResetError: string;
  userNotFound: string;
  tooManyResetRequests: string;
  registrationSuccessful: string;
  accountCreated: string;

  // Profile Screen
  editProfile: string;
  accountInfo: string;
  preferences: string;
  aboutApp: string;
  languageSettings: string;
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
  ukrainianShort: string;
  englishShort: string;
  
  // Admin Panel
  products: string;
  users: string;
  addProduct: string;
  productName: string;
  brand: string;
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

  // translations for admin form
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
  
  // Admin Panel translations
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
  images: string;
  orText: string;
  addImageUrl: string;
  barcodeSection: string;
  barcodeAutoFillHelp: string;
  successExclamation: string;
  mainImage: string;
  additionalImage: string;
  productNamePlaceholder: string;
  brandPlaceholder: string;
  productDescriptionPlaceholder: string;
  ingredientsPlaceholder: string;
  manufacturerPlaceholder: string;
  countryOfOriginPlaceholder: string;
  sourcePlaceholder: string;
  enterCategory: string;
  enterTag: string;
  enterAllergen: string;
  totalFats: string;
  totalCarbs: string;
  saltGrams: string;
  productWeightGrams: string;
  helpExpandDatabase: string;
  photo: string;
  points: string;
  
  // Search functionality
  searchResults: string;
  liveSearch: string;
  quickSearch: string;
  searchTips: string;
  searchByName: string;
  searchByBrand: string;
  searchByIngredients: string;
  clearSearch: string;
  
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
  nutritionalValue: string;
  additionalInfo: string;
  none: string;
  verificationInformation: string;
  rejectionReasonTitle: string;
  nutritionalValuePer100g: string;
  
  // Profile Screen translations 
  settings: string;
  age: string;
  height: string;
  currentWeight: string;
  personalDetails: string;
  goalWeight: string;
  changeGoal: string;
  dateOfBirth: string;
  gender: string;
  male: string;
  female: string;
  other: string;
  overview: string;
  update: string;
  logWeight: string;
  yourBMI: string;
  healthy: string;
  underweight: string;
  overweight: string;
  obese: string;
  customization: string;
  legal: string;
  termsAndConditions: string;
  privacyPolicy: string;
  deleteAccount: string;
  weightGoal: string;
  tryToUpdateOnceAWeek: string;
  adjustYourPlan: string;
  ensureYouHitYourGoal: string;
  yourWeightIs: string;
  cm: string;
  kg: string;
  years: string;
  bmiCalculation: string;
  weightStatus: string;
  invalidAge: string;
  profileDataSaved: string;
  profileDataError: string;
  fillYourPersonalData: string;
  personalDataBanner: string;
  
  // SimplePickerModal translations
  invalidNumber: string;
  valueMustBeBetween: string;
  and: string;
  pleaseEnterValue: string;
  enter: string;
  allowedRange: string;

  // New translations for delete account and legal pages
  deleteAccountConfirmation: string;
  deleteAccountWarning: string;
  deleteAccountIrreversible: string;
  accountDeleted: string;
  accountDeletionError: string;
  close: string;
  continue: string;
  understand: string;
  goBack: string;
  
  // Picker screens translations
  setWeight: string;
  setHeight: string;
  setAge: string;
  setGender: string;
  saveChanges: string;
  
  // Legal page content
  termsOfServiceTitle: string;
  privacyPolicyTitle: string;
  lastUpdatedDate: string;
  effectiveDate: string;
  introduction: string;
  acceptanceOfTerms: string;
  servicesProvided: string;
  userResponsibilities: string;
  privacyAndDataProtection: string;
  limitationOfLiability: string;
  terminationOfServices: string;
  modificationsToTerms: string;
  contactInformation: string;
  dataCollection: string;
  dataUsage: string;
  dataSecurity: string;
  userRights: string;
  cookiesAndTracking: string;
  thirdPartyServices: string;
  dataRetention: string;
  internationalTransfers: string;
  changesPrivacyPolicy: string;
  
  // BMI Modal translations
  whatIsBMI: string;
  bmiInfo: string;
  bmiFormula: string;
  bmiCategories: string;
  bmiUnder18: string;
  bmiNormal: string;
  bmiOverweight: string;
  bmiObese: string;
  currentBMI: string;
  understood: string;
  
  // Barcode scanning
  scanBarcode: string;
  barcodeScanned: string;
  productDataFetched: string;
  productNotFoundInDatabase: string;
  scanBarcodeToAutofill: string;
  enterBarcodeManually: string;
  barcodeNumber: string;
  fetchingProductData: string;
  scanBarcodeHelp: string;
  grantPermission: string;
  scanAgain: string;
  keepDeviceStable: string;
  quickAutofill: string;
  
  // New hardcoded text translations
  loadingSubmissions: string;
  authRequired: string;
  approvalSuccess: string;
  approvalError: string;
  rejectionReasonRequired: string;
  rejectionSuccess: string;
  rejectionError: string;
  
  // Product search translations
  deleteProduct: string;
  deleteProductAuth: string;
  productDeleteSuccess: string;
  productDeleteError: string;
  
  // Product submission form translations
  galleryPermissionRequired: string;
  imageAddedSuccess: string;
  imageSelectionError: string;
  cameraPermissionRequired: string;
  photoAddedSuccess: string;
  selectImageMethod: string;
  selectFromGallery: string;
  takePhoto: string;
  ingredientsRequired: string;
  submitProductAuth: string;
  
  // Status translations
  statusPending: string;
  statusApproved: string;
  statusRejected: string;
  
  // Common error messages
  failedToLoad: string;
  updateFailed: string;
  deleteFailed: string;
  uploadFailed: string;
  permissionDenied: string;
  
  // Placeholders
  rejectionReasonPlaceholder: string;
  
  // Auth screen messages
  tooManyAttempts: string;
  waitFiveMinutes: string;
  invalidEmail: string;
  enterValidEmail: string;
  googleSignInError: string;
  authenticationError: string;
  
  // Additional hardcoded strings that need translation
  accountBlockedCannotSuggestProducts: string;
  editProductAction: string;
  cancelAction: string;
  editAction: string;
  deleteProductAction: string;
  deleteAction: string;
  deleteProductRequiresAuth: string;
  productDeleteFailed: string;
  errorLoadingSubmissions: string;
  authRequiredForAction: string;
  submissionApprovedSuccess: string;
  submissionApprovalFailed: string;
  rejectionReasonIsRequired: string;
  submissionRejectedSuccess: string;
  submissionRejectionFailed: string;
  
  // Status text
  statusOnReview: string;
  statusApprovedText: string;
  statusRejectedText: string;
  
  // Placeholder texts
  rejectionReasonPlaceholderText: string;
  imageUrlPlaceholder: string;
  zeroPlaceholder: string;
  barcodePlaceholder: string;
  
  // Product submission form
  imageAddedSuccessfully: string;
  imageSelectionErrorOccurred: string;
  galleryPermissionNeeded: string;
  cameraPermissionNeeded: string;
  photoAddedSuccessfully: string;
  photoCapturingError: string;
  addImageButton: string;
  selectImageMethodText: string;
  authRequiredToSubmit: string;
  ingredientsAreRequired: string;
  
  // Profile and general errors
  pleaseLogInToAddFavorites: string;
  failedToUpdateFavorites: string;
  errorLoadingData: string;
  failedToUpdateUserStatus: string;
  errorCreatingProductInDatabase: string;
  
  // HomeScreen specific
  productSubmissionRequest: string;
  productSubmissionError: string;
  
  // Legal page content placeholders
  welcomeToApp: string;
  appNameInQuotes: string;
  termsAcceptanceText: string;
  privacyPolicyIntroText: string;
  healthDataNote: string;
  contactFormNote: string;
  productApprovedSuccessfully: string;
  
  // Additional form labels that appear in components
  chooseImageSource: string;
  selectImageSource: string;
  
  // Barcode scanning messages
  barcodeSavedButNotFound: string;
  barcodeSavedButNetworkError: string;
  barcodeSaved: string;
  
  // HomeScreen error messages
  connectionErrorDetails: string;
  tryAgainButton: string;
  connectionProblemsShowing: string;
  
  // Terms of Service content
  termsIntroText: string;
  termsAcceptanceFullText: string;
  servicesProvidedFullText: string;
  userResponsibilitiesFullText: string;
  privacyDataProtectionFullText: string;
  limitationLiabilityFullText: string;
  terminationServicesFullText: string;
  modificationsTermsFullText: string;
  contactInformationFullText: string;
  lastUpdatedDate29May: string;

  // Privacy Policy content
  privacyIntroText: string;
  privacyIntroText2: string;
  dataCollectionFullText: string;
  dataUsageFullText: string;
  dataSecurityFullText: string;
  dataSecurityMeasuresText: string;
  userRightsFullText: string;
  cookiesTrackingFullText: string;
  thirdPartyServicesFullText: string;
  dataRetentionFullText: string;
  internationalTransfersFullText: string;
  changesPrivacyPolicyFullText: string;
  privacyContactInformationFullText: string;

  // Toast messages
  couldNotLoadProductDetails: string;
  addedToFavorites: string;
  removedFromFavorites: string;
  
  // Nutri-Score system
  nutriScore: {
    nutritionalQuality: string;
    calculationDetails: string;
    negativePoints: string;
    positivePoints: string;
    points: string;
    energy: string;
    saturatedFat: string;
    sugars: string;
    sodium: string;
    fiber: string;
    protein: string;
    fruitsVegetablesNuts: string;
    finalScore: string;
    category: string;
    categories: {
      general: string;
      beverages: string;
      fatsOilsNutsSeeds: string;
      cheese: string;
    };
    grades: {
      A: string;
      B: string;
      C: string;
      D: string;
      E: string;
    };
    descriptions: {
      A: string;
      B: string;
      C: string;
      D: string;
      E: string;
    };
    recommendations: {
      A: string;
      B: string;
      C: string;
      D: string;
      E: string;
    };
    calculateAutomatically: string;
    autoCalculateExplanation: string;
    scoreCalculatedBased: string;
    calculationBasedOn: string;
    missingData: string;
    completeNutritionData: string;
    manualOverride: string;
    manualOverrideExplanation: string;
    gradeCalculatedAutomatically: string;
  };
  
  // ProductSubmissionsScreen hardcoded text translations
  smartProductAnalysis: string;
  addUpToThreePhotos: string;
  fast: string;
  accurate: string;
  smart: string;
  submittedByLabel: string;
  dateLabel: string;
  statusLabel: string;
  nameLabel: string;
  brandLabel: string;
  descriptionLabel: string;
  caloriesLabel: string;
  proteinsLabel: string;
  fatsLabel: string;
  carbohydratesLabel: string;
  ingredientsLabel: string;
  allergensLabel: string;
  tagsLabel: string;
  barcodeLabel: string;
  manufacturerLabel: string;
  countryLabel: string;
  sourceLabel: string;
  rejectionReasonSection: string;
  kcalUnit: string;
  gramsUnit: string;
  
  // AddProductModal hardcoded text translations
  photoLimitWarning: string;
  maximumThreePhotos: string;
  errorPhotoAnalysis: string;
  addAtLeastOnePhoto: string;
  preparingAnalysis: string;
  analyzingProductComposition: string;
  processingResults: string;
  analysisComplete: string;
  usingBackupAnalysis: string;
  productFound: string;
  fillAutomatically: string;
  leaveAsIs: string;
  productNotFoundInfo: string;
  failedToFindProduct: string;
  errorAuth: string;
  authenticationRequiredForSubmit: string;
  enterProductName: string;
  
  // AddProductModal additional hardcoded text translations
  productAddedSuccess: string;
  productAddFailed: string;
  addProductAdmin: string;
  aiProductScanner: string;
  addProductPhoto: string;
  aiAutoDetectInfo: string;
  camera: string;
  gallery: string;
  morePhoto: string;
  analyzeWithAI: string;
  mayTakeUpTo30Seconds: string;
  analysisResult: string;
  recognitionAccuracy: string;
  foundBrand: string;
  foundName: string;
  repeatAnalysis: string;
  barcodeSectionAI: string;
  barcodeFound: string;
  scanAnother: string;
  scanBarcodeAction: string;
  autoLoadFromOpenFoodFacts: string;
  manualBarcodeInput: string;
  enter13DigitBarcode: string;
  
  // HomeScreen hardcoded text translations
  productsFoundByBarcode: string;
  barcodeSearchResult: string;
  foundProductsLabel: string;
}

export type Language = 'en' | 'uk';

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
  
  // Additional keys
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
  passwordResetError: 'Password reset failed',
  userNotFound: 'User with this email not found',
  tooManyResetRequests: 'Too many reset requests. Please try again later',
  registrationSuccessful: 'Registration Successful',
  accountCreated: 'Your account has been created. You can now log in.',

  // Profile Screen
  editProfile: 'Edit Profile',
  accountInfo: 'Account Information',
  preferences: 'Preferences',
  aboutApp: 'About App',
  languageSettings: 'Language',
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
  ukrainianShort: 'УКР',
  englishShort: 'ENG',
  
  // Admin Panel
  products: 'Products',
  users: 'Users',
  addProduct: 'Add Product',
  productName: 'Product Name',
  brand: 'Brand',
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

  // translations for admin form
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
  images: 'Images',
  orText: 'or',
  addImageUrl: 'Add Image URL',
  barcodeSection: 'Barcode Section',
  barcodeAutoFillHelp: 'Scan the barcode to autofill product information',
  successExclamation: 'Success!',
  mainImage: 'Main Image',
  additionalImage: 'Additional Image',
  productNamePlaceholder: 'Product Name',
  brandPlaceholder: 'Brand',
  productDescriptionPlaceholder: 'Product Description',
  ingredientsPlaceholder: 'Ingredients',
  manufacturerPlaceholder: 'Manufacturer',
  countryOfOriginPlaceholder: 'Country of Origin',
  sourcePlaceholder: 'Source',
  enterCategory: 'Enter Category',
  enterTag: 'Enter Tag',
  enterAllergen: 'Enter Allergen',
  totalFats: 'Total Fats',
  totalCarbs: 'Total Carbs',
  saltGrams: 'Salt (grams)',
  productWeightGrams: 'Product Weight (grams)',
  helpExpandDatabase: 'Help Expand Database',
  photo: 'Photo',
  points: 'Points',
  
  // Search functionality
  searchResults: 'Search Results',
  liveSearch: 'Live Search',
  quickSearch: 'Quick Search',
  searchTips: 'Search Tips',
  searchByName: 'Search by Name',
  searchByBrand: 'Search by Brand',
  searchByIngredients: 'Search by Ingredients',
  clearSearch: 'Clear Search',
  
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
  photoError: 'Photo error',
  authenticationRequired: 'Authentication required',
  authenticationRequiredDelete: 'Authentication required for deletion',
  userState: 'Active',
  submittedDate: 'Submitted',
  reviewedDate: 'Reviewed',
  pending: 'Pending',
  processed: 'Processed',
  submissionInfo: 'Submission Information',
  basicInformation: 'Basic Information',
  notSpecified: 'Not specified',
  nutritionalValue: 'Nutritional Value',
  additionalInfo: 'Additional Information',
  none: 'None',
  verificationInformation: 'Verification Information',
  rejectionReasonTitle: 'Rejection Reason',
  nutritionalValuePer100g: 'Nutritional Value (per 100g)',
  
  // Profile Screen translations
  settings: 'Settings',
  age: 'Age',
  height: 'Height',
  currentWeight: 'Current Weight',
  personalDetails: 'Personal Details',
  goalWeight: 'Goal Weight',
  changeGoal: 'Change Goal',
  dateOfBirth: 'Date of Birth',
  gender: 'Gender',
  male: 'Male',
  female: 'Female',
  other: 'Other',
  overview: 'Overview',
  update: 'Update',
  logWeight: 'Log Weight',
  yourBMI: 'Your BMI',
  healthy: 'Healthy',
  underweight: 'Underweight',
  overweight: 'Overweight',
  obese: 'Obese',
  customization: 'Customization',
  legal: 'Legal',
  termsAndConditions: 'Terms and Conditions',
  privacyPolicy: 'Privacy Policy',
  deleteAccount: 'Delete Account',
  weightGoal: 'Weight Goal',
  tryToUpdateOnceAWeek: 'Try to Update Once a Week',
  adjustYourPlan: 'Adjust Your Plan',
  ensureYouHitYourGoal: 'Ensure You Hit Your Goal',
  yourWeightIs: 'Your Weight Is',
  cm: 'cm',
  kg: 'kg',
  years: 'years',
  bmiCalculation: 'BMI Calculation',
  weightStatus: 'Weight Status',
  invalidAge: 'Invalid Age',
  profileDataSaved: 'Profile Data Saved',
  profileDataError: 'Profile Data Error',
  fillYourPersonalData: 'Fill Your Personal Data',
  personalDataBanner: 'Personal Data Banner',
  
  // SimplePickerModal translations
  invalidNumber: 'Invalid number',
  valueMustBeBetween: 'Value must be between',
  and: 'and',
  pleaseEnterValue: 'Please enter a value',
  enter: 'Enter',
  allowedRange: 'Allowed range',

  // New translations for delete account and legal pages
  deleteAccountConfirmation: 'Are you sure you want to delete your account?',
  deleteAccountWarning: 'Warning: This action cannot be undone.',
  deleteAccountIrreversible: 'Once your account is deleted, all data will be permanently removed. Please confirm your decision.',
  accountDeleted: 'Your account has been deleted successfully.',
  accountDeletionError: 'There was an error deleting your account. Please try again later.',
  close: 'Close',
  continue: 'Continue',
  understand: 'I understand',
  goBack: 'Go Back',
  
  // Picker screens translations
  setWeight: 'Set Weight',
  setHeight: 'Set Height',
  setAge: 'Set Age',
  setGender: 'Set Gender',
  saveChanges: 'Save Changes',
  
  // Legal page content
  termsOfServiceTitle: 'Terms of Service',
  privacyPolicyTitle: 'Privacy Policy',
  lastUpdatedDate: 'Last Updated',
  effectiveDate: 'Effective Date',
  introduction: 'Introduction',
  acceptanceOfTerms: 'Acceptance of Terms',
  servicesProvided: 'Services Provided',
  userResponsibilities: 'User Responsibilities',
  privacyAndDataProtection: 'Privacy and Data Protection',
  limitationOfLiability: 'Limitation of Liability',
  terminationOfServices: 'Termination of Services',
  modificationsToTerms: 'Modifications to Terms',
  contactInformation: 'Contact Information',
  dataCollection: 'Data Collection',
  dataUsage: 'Data Usage',
  dataSecurity: 'Data Security',
  userRights: 'User Rights',
  cookiesAndTracking: 'Cookies and Tracking',
  thirdPartyServices: 'Third Party Services',
  dataRetention: 'Data Retention',
  internationalTransfers: 'International Transfers',
  changesPrivacyPolicy: 'Changes to Privacy Policy',
  
  // BMI Modal translations
  whatIsBMI: 'What is BMI?',
  bmiInfo: 'Body Mass Index (BMI) is an indicator that helps determine if your weight corresponds to your height.\n\nFormula: BMI = weight (kg) / height² (m)\n\nBMI Categories:\n• Below 18.5: Underweight\n• 18.5-24.9: Normal weight\n• 25-29.9: Overweight\n• 30 and above: Obesity',
  bmiFormula: 'BMI Formula',
  bmiCategories: 'BMI Categories',
  bmiUnder18: 'Below 18.5: Underweight',
  bmiNormal: '18.5-24.9: Normal weight',
  bmiOverweight: '25-29.9: Overweight',
  bmiObese: '30 and above: Obesity',
  currentBMI: 'Your current BMI',
  understood: 'Understood',
  
  // Barcode scanning
  scanBarcode: 'Scan Barcode',
  barcodeScanned: 'Barcode Scanned',
  productDataFetched: 'Product Data Fetched',
  productNotFoundInDatabase: 'Product not found in database',
  scanBarcodeToAutofill: 'Scan Barcode to Autofill',
  enterBarcodeManually: 'Enter Barcode Manually',
  barcodeNumber: 'Barcode Number',
  fetchingProductData: 'Fetching Product Data',
  scanBarcodeHelp: 'Scan the barcode to autofill product information',
  grantPermission: 'Grant Permission',
  scanAgain: 'Scan Again',
  keepDeviceStable: 'Keep Device Stable',
  quickAutofill: 'Quick Autofill',
  
  // New hardcoded text translations
  loadingSubmissions: 'Loading submissions...',
  authRequired: 'Authentication required',
  approvalSuccess: 'Approval successful',
  approvalError: 'Approval error',
  rejectionReasonRequired: 'Rejection reason is required',
  rejectionSuccess: 'Rejection successful',
  rejectionError: 'Rejection error',
  
  // Product search translations
  deleteProduct: 'Delete Product',
  deleteProductAuth: 'Delete product authentication',
  productDeleteSuccess: 'Product deleted successfully',
  productDeleteError: 'Error deleting product',
  
  // Product submission form translations
  galleryPermissionRequired: 'Gallery permission required',
  imageAddedSuccess: 'Image added successfully',
  imageSelectionError: 'Error selecting image',
  cameraPermissionRequired: 'Camera permission required',
  photoAddedSuccess: 'Photo added successfully',
  selectImageMethod: 'Select image method',
  selectFromGallery: 'Select from gallery',
  takePhoto: 'Take photo',
  ingredientsRequired: 'Ingredients required',
  submitProductAuth: 'Submit product authentication',
  
  // Status translations
  statusPending: 'Pending',
  statusApproved: 'Approved',
  statusRejected: 'Rejected',
  
  // Common error messages
  failedToLoad: 'Failed to load',
  updateFailed: 'Update failed',
  deleteFailed: 'Delete failed',
  uploadFailed: 'Upload failed',
  permissionDenied: 'Permission denied',
  
  // Placeholders
  rejectionReasonPlaceholder: 'Enter rejection reason',
  
  // Auth screen messages
  tooManyAttempts: 'Too many attempts',
  waitFiveMinutes: 'Wait 5 minutes',
  invalidEmail: 'Invalid email',
  enterValidEmail: 'Enter a valid email',
  googleSignInError: 'Google sign-in error',
  authenticationError: 'Authentication error',
  
  // Additional hardcoded strings that need translation
  accountBlockedCannotSuggestProducts: 'Your account is blocked. You cannot suggest new products.',
  editProductAction: 'Edit product',
  cancelAction: 'Cancel',
  editAction: 'Edit',
  deleteProductAction: 'Delete product',
  deleteAction: 'Delete',
  deleteProductRequiresAuth: 'Delete product requires authentication',
  productDeleteFailed: 'Product delete failed',
  errorLoadingSubmissions: 'Error loading submissions',
  authRequiredForAction: 'Authentication required for action',
  submissionApprovedSuccess: 'Submission approved successfully',
  submissionApprovalFailed: 'Submission approval failed',
  rejectionReasonIsRequired: 'Rejection reason is required',
  submissionRejectedSuccess: 'Submission rejected successfully',
  submissionRejectionFailed: 'Submission rejection failed',
  
  // Status text
  statusOnReview: 'On review',
  statusApprovedText: 'Approved',
  statusRejectedText: 'Rejected',
  
  // Placeholder texts
  rejectionReasonPlaceholderText: 'Enter rejection reason',
  imageUrlPlaceholder: 'Enter image URL',
  zeroPlaceholder: '0',
  barcodePlaceholder: 'Enter barcode',
  
  // Product submission form
  imageAddedSuccessfully: 'Image added successfully',
  imageSelectionErrorOccurred: 'Error selecting image',
  galleryPermissionNeeded: 'Gallery permission needed',
  cameraPermissionNeeded: 'Camera permission needed',
  photoAddedSuccessfully: 'Photo added successfully',
  photoCapturingError: 'Photo capturing error',
  addImageButton: 'Add Image',
  selectImageMethodText: 'Select image method',
  authRequiredToSubmit: 'Authentication required to submit',
  ingredientsAreRequired: 'Ingredients are required',
  
  // Profile and general errors
  pleaseLogInToAddFavorites: 'Please log in to add favorites',
  failedToUpdateFavorites: 'Failed to update favorites',
  errorLoadingData: 'Error loading data',
  failedToUpdateUserStatus: 'Failed to update user status',
  errorCreatingProductInDatabase: 'Error creating product in database',
  
  // HomeScreen specific
  productSubmissionRequest: 'Product submission request',
  productSubmissionError: 'Product submission error',
  
  // Legal page content placeholders
  welcomeToApp: 'Welcome to our app',
  appNameInQuotes: 'Product Quality',
  termsAcceptanceText: 'Acceptance of terms',
  privacyPolicyIntroText: 'Privacy policy introduction',
  healthDataNote: 'Health data note',
  contactFormNote: 'Contact form note',
  productApprovedSuccessfully: 'Product approved successfully',
  
  // Additional form labels that appear in components
  chooseImageSource: 'Choose image source',
  selectImageSource: 'Select image source',
  
  // Barcode scanning messages
  barcodeSavedButNotFound: 'Barcode saved but not found',
  barcodeSavedButNetworkError: 'Barcode saved but network error',
  barcodeSaved: 'Barcode saved',
  
  // HomeScreen error messages
  connectionErrorDetails: 'Failed to connect to server. Try restarting the app.',
  tryAgainButton: 'Try Again',
  connectionProblemsShowing: '⚠️ Connection problems, showing cached data',
  
  // Terms of Service content
  termsIntroText: 'Welcome to the "Product Quality Assessment" app ("App"). This app is designed to provide users with information about food product quality, composition, and nutritional value. By using our app, you agree to these Terms of Use.',
  termsAcceptanceFullText: 'By downloading, installing, or using this app, you acknowledge that you have read, understood, and agree to comply with these Terms of Use. If you do not agree with any part of these terms, please do not use the app.',
  servicesProvidedFullText: 'Our app provides the following services:\n\n• Viewing detailed information about composition and nutritional value\n• Saving favorite products\n• Tools for tracking weight and health',
  userResponsibilitiesFullText: 'By using the app, you agree to:\n\n• Provide accurate personal information\n• Not violate intellectual property rights\n• Not use the app for illegal purposes\n• Not transmit harmful content or viruses\n• Comply with all applicable laws and regulations',
  privacyDataProtectionFullText: 'Your privacy is important to us. Information about how we collect, use, and protect your personal data is detailed in our Privacy Policy. By using the app, you also agree to the terms of our Privacy Policy.',
  limitationLiabilityFullText: 'THE APP IS PROVIDED "AS IS" WITHOUT ANY WARRANTIES. WE ARE NOT LIABLE FOR:\n\n• Accuracy of product information\n• Damages from using inaccurate information\n• Technical failures or service unavailability\n• Data loss or security breaches\n\nMaximum liability is limited to $50 USD.',
  terminationServicesFullText: 'We reserve the right to terminate or suspend your access to the app at any time without prior notice if you violate these Terms of Use or use the app inappropriately.',
  modificationsTermsFullText: 'We may update these Terms of Use from time to time. We will notify you of all changes by posting updated terms in the app. By continuing to use the app after changes are made, you agree to the new terms.',
  contactInformationFullText: 'If you have questions about these Terms of Use, please contact us:\n\nEmail: support@productquality.app\nPhone: +380 (44) 123-45-67\nAddress: Kyiv, Khreschatyk St, 1',
  lastUpdatedDate29May: 'Last Updated: 29 May 2023',

  // Privacy Policy content
  privacyIntroText: 'This Privacy Policy describes our policies and procedures on the collection, use and disclosure of your information when you use the "Product Quality Assessment" app and tells you about your privacy rights and how the law protects you.',
  privacyIntroText2: 'We use your personal data to provide and improve our service. By using the app, you agree to the collection and use of information in accordance with this Privacy Policy.',
  dataCollectionFullText: 'We may collect the following types of information:\n\n• Personal data: name, email, age, gender, physical parameters\n• Usage data: information about how you use the app\n• Device data: IP address, browser type, operating system\n• Product information: scan history, favorite products\n• Health data: weight, height, health goals (with your consent)',
  dataUsageFullText: 'The Company may use personal data for the following purposes:\n\n• Providing and maintaining our app\n• Personalizing your user experience\n• Usage analysis to improve services\n• Communication about updates and news\n• Security and fraud prevention\n• Legal compliance',
  dataSecurityFullText: 'The security of your personal data is important to us, but remember that no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.',
  dataSecurityMeasuresText: 'We use the following security measures:\n\n• Data encryption during transmission and storage\n• Regular security audits\n• Limited access to personal data\n• Staff training on privacy matters',
  userRightsFullText: 'Under applicable law, you have the following rights:\n\n• Right of access to your personal data\n• Right to correct inaccurate data\n• Right to delete your data\n• Right to restrict processing\n• Right to data portability\n• Right to object to processing',
  cookiesTrackingFullText: 'Our app may use tracking technologies to improve user experience. We may use:\n\n• Analytics tools to understand app usage\n• Cookies to save settings\n• Device identifiers for personalization',
  thirdPartyServicesFullText: 'Our app may contain links to third-party services that we do not control. We strongly advise you to review the Privacy Policy of every website you visit.\n\nThird-party services we may use:\n• Firebase (Google) - for data storage\n• Analytics services for app improvement',
  dataRetentionFullText: 'We retain your personal data only for as long as necessary for the purposes set out in this Privacy Policy. We may also retain data to comply with legal obligations, resolve disputes, and enforce our agreements.',
  internationalTransfersFullText: 'Your information, including personal data, may be processed on computers located outside your country where data protection laws may differ. We take steps to ensure proper protection of your data during such transfers.',
  changesPrivacyPolicyFullText: 'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy in the app. We will also notify you via email and/or prominent notice in the app before the changes take effect.',
  privacyContactInformationFullText: 'If you have questions about this Privacy Policy, please contact us:\n\nEmail: privacy@productquality.app\nPhone: +380 (44) 123-45-67\nAddress: Kyiv, Khreschatyk St, 1\n\nYou can also contact us through the feedback form in the app.',

  // Toast messages
  couldNotLoadProductDetails: 'Could not load product details',
  addedToFavorites: 'Added to favorites',
  removedFromFavorites: 'Removed from favorites',
  
  // Nutri-Score system
  nutriScore: {
    nutritionalQuality: 'Nutritional Quality',
    calculationDetails: 'Calculation Details',
    negativePoints: 'Negative Points',
    positivePoints: 'Positive Points',
    points: 'points',
    energy: 'Energy',
    saturatedFat: 'Saturated Fat',
    sugars: 'Sugars',
    sodium: 'Sodium',
    fiber: 'Fiber',
    protein: 'Protein',
    fruitsVegetablesNuts: 'Fruits, Vegetables, Nuts',
    finalScore: 'Final Score',
    category: 'Category',
    categories: {
      general: 'General Foods',
      beverages: 'Beverages',
      fatsOilsNutsSeeds: 'Fats, Oils, Nuts & Seeds',
      cheese: 'Cheese',
    },
    grades: {
      A: 'Excellent',
      B: 'Good',
      C: 'Fair',
      D: 'Poor',
      E: 'Very Poor',
    },
    descriptions: {
      A: 'Excellent nutritional quality',
      B: 'Good nutritional quality',
      C: 'Fair nutritional quality',
      D: 'Poor nutritional quality',
      E: 'Very poor nutritional quality',
    },
    recommendations: {
      A: 'Choose this product often as part of a balanced diet',
      B: 'Good choice for regular consumption',
      C: 'Consume in moderation as part of a varied diet',
      D: 'Limit consumption and choose healthier alternatives when possible',
      E: 'Avoid frequent consumption and opt for healthier alternatives',
    },
    calculateAutomatically: 'Calculate Automatically',
    autoCalculateExplanation: 'Based on nutritional data provided',
    scoreCalculatedBased: 'Score calculated based on',
    calculationBasedOn: 'Calculation based on EU Nutri-Score algorithm',
    missingData: 'Missing nutritional data',
    completeNutritionData: 'Please complete nutritional information for accurate calculation',
    manualOverride: 'Manual Override',
    manualOverrideExplanation: 'Override automatic calculation with custom grade',
    gradeCalculatedAutomatically: 'Grade calculated automatically based on nutritional data',
  },
  
  // ProductSubmissionsScreen hardcoded text translations
  smartProductAnalysis: 'Smart Product Analysis',
  addUpToThreePhotos: 'Add Up to Three Photos',
  fast: 'Fast',
  accurate: 'Accurate',
  smart: 'Smart',
  submittedByLabel: 'Submitted By',
  dateLabel: 'Date',
  statusLabel: 'Status',
  nameLabel: 'Name',
  brandLabel: 'Brand',
  descriptionLabel: 'Description',
  caloriesLabel: 'Calories',
  proteinsLabel: 'Proteins',
  fatsLabel: 'Fats',
  carbohydratesLabel: 'Carbohydrates',
  ingredientsLabel: 'Ingredients',
  allergensLabel: 'Allergens',
  tagsLabel: 'Tags',
  barcodeLabel: 'Barcode',
  manufacturerLabel: 'Manufacturer',
  countryLabel: 'Country of Origin',
  sourceLabel: 'Source',
  rejectionReasonSection: 'Rejection Reason',
  kcalUnit: 'kcal',
  gramsUnit: 'grams',
  
  // AddProductModal hardcoded text translations
  photoLimitWarning: 'Photo Limit Warning',
  maximumThreePhotos: 'Maximum Three Photos',
  errorPhotoAnalysis: 'Error Photo Analysis',
  addAtLeastOnePhoto: 'Add At Least One Photo',
  preparingAnalysis: 'Preparing Analysis',
  analyzingProductComposition: 'Analyzing Product Composition',
  processingResults: 'Processing Results',
  analysisComplete: 'Analysis Complete',
  usingBackupAnalysis: 'Using Backup Analysis',
  productFound: 'Product Found',
  fillAutomatically: 'Fill Automatically',
  leaveAsIs: 'Leave As Is',
  productNotFoundInfo: 'Product Not Found',
  failedToFindProduct: 'Failed to Find Product',
  errorAuth: 'Error Auth',
  authenticationRequiredForSubmit: 'Authentication Required for Submit',
  enterProductName: 'Enter Product Name',
  
  // AddProductModal additional hardcoded text translations
  productAddedSuccess: 'Product Added Success',
  productAddFailed: 'Product Add Failed',
  addProductAdmin: 'Add Product Admin',
  aiProductScanner: 'AI Product Scanner',
  addProductPhoto: 'Add Product Photo',
  aiAutoDetectInfo: 'AI Auto Detect Info',
  camera: 'Camera',
  gallery: 'Gallery',
  morePhoto: 'More Photo',
  analyzeWithAI: 'Analyze with AI',
  mayTakeUpTo30Seconds: 'May Take Up to 30 Seconds',
  analysisResult: 'Analysis Result',
  recognitionAccuracy: 'Recognition Accuracy',
  foundBrand: 'Found Brand',
  foundName: 'Found Name',
  repeatAnalysis: 'Repeat Analysis',
  barcodeSectionAI: 'Barcode Section AI',
  barcodeFound: 'Barcode Found',
  scanAnother: 'Scan Another',
  scanBarcodeAction: 'Scan Barcode Action',
  autoLoadFromOpenFoodFacts: 'Auto Load from OpenFoodFacts',
  manualBarcodeInput: 'Manual Barcode Input',
  enter13DigitBarcode: 'Enter 13-Digit Barcode',
  
  // HomeScreen hardcoded text translations
  productsFoundByBarcode: 'Products Found by Barcode',
  barcodeSearchResult: 'Barcode Search Result',
  foundProductsLabel: 'Found Products',
};

// Ukrainian translations (complete)
const uk: TranslationKeys = {
  // Common
  appName: 'Якість продуктів',
  loading: 'Завантаження...',
  error: 'Сталася помилка',
  retry: 'Повторити',
  tryAgain: 'Спробувати знову',
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
  noResults: 'Продукти не знайдені',
  networkError: 'Не вдалося підключитися до сервера',
  searchPlaceholder: 'Пошук продуктів...',
  categories: 'Категорії',
  recentProducts: 'Нещодавно переглянуті продукти',
  ingredients: 'Інгредієнти',
  nutrition: 'Харчова цінність',
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
  displayName: 'Ім\'я для відображення',
  logout: 'Вийти',
  
  // Additional keys
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
  snacksCategory: 'Закуски',
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
  noSimilarProducts: 'Схожі продукти не знайдені',
  noFavorites: 'Улюблені не знайдені',
  startAdding: 'Почніть додавати улюблені',
  loginToSeeFavorites: 'Увійдіть, щоб побачити улюблені',

  // Auth Screen
  signIn: 'Увійти',
  createAccount: 'Створити обліковий запис',
  name: 'Ім\'я',
  confirmPassword: 'Підтвердити пароль',
  forgotPassword: 'Забули пароль?',
  or: 'АБО',
  continueWithGoogle: 'Продовжити з Google',
  needAccount: 'Потрібен обліковий запис?',
  alreadyHaveAccount: 'Вже маєте обліковий запис?',
  emailRequired: 'Електронна пошта обов\'язкова',
  validEmail: 'Введіть правильну електронну пошту',
  passwordRequired: 'Пароль обов\'язковий',
  passwordLength: 'Пароль повинен містити принаймні 8 символів',
  nameRequired: 'Ім\'я обов\'язкове',
  passwordsDoNotMatch: 'Паролі не збігаються',
  resetPassword: 'Скинути пароль',
  resetPasswordPrompt: 'Введіть електронну пошту для отримання посилання на скидання пароля',
  send: 'Надіслати',
  resetEmailSent: 'Лист для скидання відправлено',
  resetPasswordConfirmation: 'Посилання для скидання пароля надіслано на {email}',
  passwordResetError: 'Помилка скидання пароля',
  userNotFound: 'Користувача з таким email не знайдено',
  tooManyResetRequests: 'Занадто багато запитів на скидання. Спробуйте пізніше',
  registrationSuccessful: 'Реєстрація успішна',
  accountCreated: 'Ваш обліковий запис створено. Тепер ви можете увійти.',

  // Profile Screen
  editProfile: 'Редагувати профіль',
  accountInfo: 'Інформація про обліковий запис',
  preferences: 'Налаштування',
  aboutApp: 'Про додаток',
  languageSettings: 'Мова',
  success: 'Успіх',
  profileUpdateSuccess: 'Профіль оновлено успішно',
  profileUpdateError: 'Не вдалося оновити профіль',
  nameEmpty: 'Ім\'я не може бути порожнім',
  featureNotImplemented: 'Ця функція ще не реалізована',
  languageChanged: 'Мову змінено',
  ok: 'Гаразд',
  ukrainian: 'Українська',
  english: 'Англійська',
  selectLanguage: 'Оберіть мову',
  ukrainianShort: 'УКР',
  englishShort: 'ENG',
  
  // Admin Panel
  products: 'Продукти',
  users: 'Користувачі',
  addProduct: 'Додати продукт',
  productName: 'Назва продукту',
  brand: 'Бренд',
  imageUrl: 'URL зображення',
  blockUser: 'Заблокувати користувача',
  unblockUser: 'Розблокувати користувача',
  enableComments: 'Дозволити коментарі',
  disableComments: 'Заборонити коментарі',
  confirmDelete: 'Ви впевнені, що хочете видалити цей продукт?',
  deleteProductConfirmation: 'Продукт був видалений.',
  addNewProduct: 'Додати новий продукт',
  productImageUrl: 'URL зображення продукту',
  nutriscoreGrade: 'Рейтинг Nutriscore',
  accessDenied: 'Доступ заборонено',
  
  // Comments and Reviews
  reviews: 'Відгуки',
  comments: 'Коментарі',
  leaveComment: 'Написати коментар',
  yourRating: 'Ваш рейтинг',
  commentPlaceholder: 'Напишіть ваш коментар тут...',
  submitComment: 'Надіслати коментар',
  allComments: 'Всі коментарі',
  noComments: 'Поки що немає коментарів для цього продукту.',
  beFirstToComment: 'Будьте першим, хто напише коментар!',
  ratingRequired: 'Будь ласка, виберіть рейтинг перед надсиланням',
  commentSuccess: 'Коментар успішно доданий',
  commentDeleted: 'Коментар успішно видалений',
  deleteComment: 'Видалити коментар',
  
  // Form fields and product information
  weight: 'Вага',
  nutritionalInfo: 'Харчова цінність',
  perWholeProduct: 'На одиницю продукту',
  calculatedAutomatically: 'Значення розраховуються автоматично на основі ваги та харчових значень',
  dietaryInfo: 'Диетична інформація',
  role: 'Роль',
  
  // Firebase and demo mode
  goOnline: 'Перейти онлайн',
  goOffline: 'Перейти офлайн',
  firebaseConnected: 'Підключено до бази даних Firebase',
  firebaseConnectionFailed: 'Не вдалося підключитися до Firebase',
  confirmDemoMode: 'Активувати режим демонстрації?',
  demoModeWarning: 'У режимі демонстрації всі зміни будуть збережені локально і будуть втрачені при перезавантаженні додатка. Дані не будуть збережені в Firebase.',
  demoModeActivated: 'Режим демонстрації активований',
  demoMode: 'РЕЖИМ ДЕМОНСТРАЦІЇ',
  
  // Product management
  demoModeActive: 'Режим демонстрації активний',
  demoModeProductWarning: 'У режимі демонстрації продукти зберігаються локально і будуть втрачені при перезавантаженні додатка. Бажаєте спробувати зберегти в Firebase?',
  tryFirebase: 'Спробувати Firebase',
  firebaseProductAdded: 'Продукт успішно доданий до бази даних Firebase',
  productAddedLocally: 'Продукт був доданий лише до локального сховища',
  continueDemo: 'Продовжити в режимі демонстрації',
  productAdded: 'Продукт доданий успішно',
  failedToAddProduct: 'Не вдалося додати продукт',

  // New key
  composition: 'Склад',

  // Short versions for navigation
  nutritionShort: 'КБЖВ',
  compositionShort: 'Склад',
  reviewsShort: 'Відгуки',

  // translations for admin form
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
  tagDiabeteFriendly: 'Діабет-приємний',
  tagLowFat: 'Низький жир',
  tagLowSugar: 'Низький цукор',
  tagHighProtein: 'Високий білок',
  tagNatural: 'Натуральний',
  tagLocal: 'Локальний',
  
  // Avatar functionality
  selectAvatar: 'Вибрати аватар',
  avatarUpdateSuccess: 'Аватар оновлено успішно',
  avatarUpdateError: 'Не вдалося оновити аватар',
  
  // Admin info
  adminInfo: 'Інформація про адміна',
  added: 'Додано',
  lastUpdated: 'Останнє оновлення',
  createdBy: 'Створено',
  
  // Additional missing translations
  per100g: 'На 100г продукту',
  detailedComposition: 'Детальний склад',
  productNotFound: 'Продукт не знайдений',
  loadingProduct: 'Завантаження продукту...',
  productUpdatedSuccessfully: 'Продукт оновлено успішно',
  updateProductError: 'Помилка оновлення продукту',
  editProduct: 'Редагувати продукт',
  detailedProductDescription: 'Детальний опис продукту...',
  alternativeImageUrl: '(альтернативний)',
  productNameRequired: 'Необхідно вказати назву продукту',
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
  permissionRequired: 'Необхідна дозвіл',
  permissionRequiredMessage: 'Необхідна дозвіл для доступу до галереї зображень',
  imagePickError: 'Помилка вибору зображення',
  webUploadInfo: 'Інформація',
  webUploadNote: 'На веб-платформі рекомендується використовувати URL зображення',
  imageUploadSuccess: 'Зображення успішно завантажено!',
  imageUploadError: 'Помилка завантаження зображення',
  
  // New Admin Panel translations
  adminPanel: 'Панель адміна',
  userGrowth: 'Користувачі',
  productGrowth: 'Продукти',
  userManagement: 'Керування користувачами',
  productManagement: 'Керування продуктами',
  searchUsers: 'Пошук користувачів',
  searchProducts: 'Пошук продуктів',
  searchAndManageUsers: 'Пошук та управління користувачами',
  searchAndManageProducts: 'Пошук та управління продуктами',
  totalUsers: 'Загальна кількість користувачів',
  totalProducts: 'Загальна кількість продуктів',
  registeredUsers: 'Зареєстровані користувачі',
  productsInDatabase: 'Продукти в базі даних',
  admins: 'Адміни',
  blocked: 'Заблоковані',
  
  // Product submissions
  suggestProduct: 'Запропонувати продукт',
  suggestProductBanner: 'Запропонувати баннер продукту',
  productSubmissions: 'Пропоновані продукти',
  submitProduct: 'Надіслати продукт',
  submissionForm: 'Форма надсилання',
  additionalImages: 'Додаткові зображення',
  addMoreImages: 'Додати більше зображень',
  removeImage: 'Видалити зображення',
  verificationInfo: 'Інформація для верифікації',
  barcode: 'Штрих-код',
  sourceInfo: 'Інформація про джерело',
  manufacturer: 'Виробник',
  countryOfOrigin: 'Країна походження',
  whereFoundProduct: 'Де знайдений продукт',
  submissionSuccess: 'Надсилання успішне',
  submissionError: 'Помилка надсилання',
  productSubmitted: 'Продукт надісланий',
  submissionUnderReview: 'Надсилання в розгляді',
  images: 'Зображення',
  orText: 'або',
  addImageUrl: 'Додати URL зображення:',
  barcodeSection: 'Штрих-код',
  barcodeAutoFillHelp: 'Сканування штрих-коду автоматично заповнить більшість полів форми',
  successExclamation: 'Успіх!',
  mainImage: 'Основне зображення',
  additionalImage: 'Додаткове зображення',
  productNamePlaceholder: 'Назва продукту',
  brandPlaceholder: 'Бренд',
  productDescriptionPlaceholder: 'Опис продукту',
  ingredientsPlaceholder: 'Інгредієнти',
  manufacturerPlaceholder: 'Виробник',
  countryOfOriginPlaceholder: 'Країна походження',
  sourcePlaceholder: 'Джерело',
  enterCategory: 'Введіть категорію',
  enterTag: 'Введіть тег',
  enterAllergen: 'Введіть аллерген',
  totalFats: 'Загальна кількість жирів',
  totalCarbs: 'Загальна кількість вуглеводів',
  saltGrams: 'Сіль (грами)',
  productWeightGrams: 'Вага продукту (грами)',
  helpExpandDatabase: 'Допоможіть розширити базу даних продуктів',
  photo: 'Фото',
  points: 'Оцінка',
  
  // Search functionality
  searchResults: 'Результати пошуку',
  liveSearch: 'Пошук',
  quickSearch: 'Швидкий пошук',
  searchTips: 'Поради для пошуку',
  searchByName: 'Пошук за назвою',
  searchByBrand: 'Пошук за брендом',
  searchByIngredients: 'Пошук за інгредієнтами',
  clearSearch: 'Очистити пошук',
  
  // Admin submissions review
  reviewSubmissions: 'Відгуки перевірки',
  pendingSubmissions: 'Очікуючі пропозиції',
  submissionStatus: 'Статус надсилання',
  submittedBy: 'Надіслано',
  submittedOn: 'Надіслано',
  reviewSubmission: 'Відгук перевірки',
  approveSubmission: 'Затвердити пропозицію',
  rejectSubmission: 'Відхилити пропозицію',
  rejectionReason: 'Причина відхилення',
  approveConfirm: 'Затвердити',
  rejectConfirm: 'Відхилити',
  submissionApproved: 'Пропозиція затверджена',
  submissionRejected: 'Пропозиція відхилена',
  noSubmissions: 'Немає пропозицій',
  viewDetails: 'Переглянути деталі',
  editBeforeApproval: 'Редагувати перед затвердженням',
  loadingUsers: 'Завантаження користувачів...',
  loadingProducts: 'Завантаження продуктів...',
  usersNotFound: 'Користувачі не знайдені',
  productsNotFound: 'Продукти не знайдені',
  tryAnotherSearch: 'Спробувати інший пошук',
  waitForLoading: 'Зачекати завантаження',
  enterUserDetails: 'Введіть дані користувача',
  enterProductDetails: 'Введіть дані продукту',
  foundUsers: 'Користувачі знайдені',
  foundProducts: 'Продукти знайдені',
  userRoleChanged: 'Змінено роль користувача',
  userBlocked: 'Користувач заблокований',
  userUnblocked: 'Користувач розблокований',
  userRoleChangeError: 'Помилка зміни ролі користувача',
  userBlockError: 'Помилка блокування користувача',
  changeUserRole: 'Змінити роль користувача',
  deleteProductConfirm: 'Видалити продукт?',
  actionCannotBeUndone: 'Дію не можна скасувати',
  productDeletedSuccessfully: 'Продукт видалений успішно',
  unknownName: 'Незнайдене ім\'я',
  unknownBrand: 'Незнайдений бренд',
  productWeight: 'Вага продукту',
  productBarcode: 'Штрих-код продукту',
  whereDidYouFind: 'Де знайдений продукт',
  addFromDevice: 'Додати з пристрою',
  photoError: 'Помилка фото',
  authenticationRequired: 'Необхідна аутентифікація',
  authenticationRequiredDelete: 'Необхідна аутентифікація для видалення',
  userState: 'Активний',
  submittedDate: 'Надіслано',
  reviewedDate: 'Перевірено',
  pending: 'В очікуванні',
  processed: 'Опрацьовано',
  submissionInfo: 'Інформація про надсилання',
  basicInformation: 'Основна інформація',
  notSpecified: 'Не вказано',
  nutritionalValue: 'Харчова цінність',
  additionalInfo: 'Додаткова інформація',
  none: 'Жодного',
  verificationInformation: 'Інформація для верифікації',
  rejectionReasonTitle: 'Причина відхилення',
  nutritionalValuePer100g: 'Харчова цінність (на 100г)',
  
  // Profile Screen translations
  settings: 'Налаштування',
  age: 'Вік',
  height: 'Зріст',
  currentWeight: 'Поточна вага',
  personalDetails: 'Особисті дані',
  goalWeight: 'Ціль',
  changeGoal: 'Змінити ціль',
  dateOfBirth: 'Дата народження',
  gender: 'Стать',
  male: 'Чоловіча',
  female: 'Жіноча',
  other: 'Інше',
  overview: 'Огляд',
  update: 'Оновити',
  logWeight: 'Записати вагу',
  yourBMI: 'Ваш ІМТ',
  healthy: 'Здоровий',
  underweight: 'Недостатня вага',
  overweight: 'Надлишкова вага',
  obese: 'Ожиріння',
  customization: 'Персоналізація',
  legal: 'Правові питання',
  termsAndConditions: 'Умови використання',
  privacyPolicy: 'Політика конфіденційності',
  deleteAccount: 'Видалити обліковий запис',
  weightGoal: 'Ціль',
  tryToUpdateOnceAWeek: 'Намагайтеся оновлювати раз на тиждень',
  adjustYourPlan: 'Скоригуйте свій план',
  ensureYouHitYourGoal: 'Так ви будете впевнені, що досягаєте своєї цілі',
  yourWeightIs: 'Ваша вага',
  cm: 'см',
  kg: 'кг',
  years: 'років',
  bmiCalculation: 'Розрахунок ІМТ',
  weightStatus: 'Статус ваги',
  invalidAge: 'Недійсний вік',
  profileDataSaved: 'Дані профілю збережено',
  profileDataError: 'Помилка збереження даних профілю',
  fillYourPersonalData: 'Заповніть ваші особисті дані',
  personalDataBanner: 'Заповніть ваші особисті дані для кращого досвіду використання додатка',
  
  // SimplePickerModal translations
  invalidNumber: 'Недійсне число',
  valueMustBeBetween: 'Значення повинно бути між',
  and: 'та',
  pleaseEnterValue: 'Будь ласка, введіть значення',
  enter: 'Ввести',
  allowedRange: 'Дозволений діапазон',

  // New translations for delete account and legal pages
  deleteAccountConfirmation: 'Ви впевнені, що хочете видалити свій обліковий запис?',
  deleteAccountWarning: 'Попередження: Цю дію не можна скасувати.',
  deleteAccountIrreversible: 'Після видалення облікового запису всі дані будуть назавжди втрачені. Будь ласка, підтвердіть своє рішення.',
  accountDeleted: 'Ваш обліковий запис було успішно видалено.',
  accountDeletionError: 'Виникла помилка при видаленні облікового запису. Спробуйте пізніше.',
  close: 'Закрити',
  continue: 'Продовжити',
  understand: 'Я розумію',
  goBack: 'Повернутися',
  
  // Picker screens translations
  setWeight: 'Встановити вагу',
  setHeight: 'Встановити зріст',
  setAge: 'Встановити вік',
  setGender: 'Встановити стать',
  saveChanges: 'Зберегти зміни',
  
  // Legal page content
  termsOfServiceTitle: 'Умови використання',
  privacyPolicyTitle: 'Політика конфіденційності',
  lastUpdatedDate: 'Останнє оновлення',
  effectiveDate: 'Дата набрання чинності',
  introduction: 'Вступ',
  acceptanceOfTerms: 'Прийняття умов',
  servicesProvided: 'Надані послуги',
  userResponsibilities: 'Обов\'язки користувача',
  privacyAndDataProtection: 'Конфіденційність та захист даних',
  limitationOfLiability: 'Обмеження відповідальності',
  terminationOfServices: 'Припинення послуг',
  modificationsToTerms: 'Зміни до умов',
  contactInformation: 'Контактна інформація',
  dataCollection: 'Збір даних',
  dataUsage: 'Використання даних',
  dataSecurity: 'Безпека даних',
  userRights: 'Права користувача',
  cookiesAndTracking: 'Файли cookie та відстеження',
  thirdPartyServices: 'Сторонні послуги',
  dataRetention: 'Зберігання даних',
  internationalTransfers: 'Міжнародні передачі',
  changesPrivacyPolicy: 'Зміни до політики конфіденційності',
  
  // BMI Modal translations
  whatIsBMI: 'Що таке ІМТ?',
  bmiInfo: 'Індекс маси тіла (ІМТ) - це показник, який допомагає визначити, чи відповідає ваша вага вашому зросту.\n\nФормула: ІМТ = вага (кг) / зріст² (м)\n\nКатегорії ІМТ:\n• Менше 18.5: Недостатня вага\n• 18.5-24.9: Нормальна вага\n• 25-29.9: Надлишкова вага\n• 30 і вище: Ожиріння',
  bmiFormula: 'Формула ІМТ',
  bmiCategories: 'Категорії ІМТ',
  bmiUnder18: 'Менше 18.5: Недостатня вага',
  bmiNormal: '18.5-24.9: Нормальна вага',
  bmiOverweight: '25-29.9: Надлишкова вага',
  bmiObese: '30 і вище: Ожиріння',
  currentBMI: 'Ваш поточний ІМТ',
  understood: 'Зрозуміло',
  
  // Barcode scanning
  scanBarcode: 'Сканувати штрих-код',
  barcodeScanned: 'Штрих-код відсканований',
  productDataFetched: 'Дані продукту отримано',
  productNotFoundInDatabase: 'Продукт не знайдено в базі даних',
  scanBarcodeToAutofill: 'Сканувати штрих-код для автозаповнення',
  enterBarcodeManually: 'Введіть штрих-код вручну',
  barcodeNumber: 'Номер штрих-коду',
  fetchingProductData: 'Завантаження даних продукту',
  scanBarcodeHelp: 'Наведіть камеру на штрих-код',
  grantPermission: 'Надати дозвіл',
  scanAgain: 'Сканувати знову',
  keepDeviceStable: 'Тримайте пристрій стабільно. Штрих-код буде відсканований автоматично.',
  quickAutofill: 'Швидке автозаповнення',
  
  // New hardcoded text translations
  loadingSubmissions: 'Завантаження пропозицій...',
  authRequired: 'Автентифікація необхідна',
  approvalSuccess: 'Затвердження успішне',
  approvalError: 'Помилка затвердження',
  rejectionReasonRequired: 'Необхідно вказати причину відхилення',
  rejectionSuccess: 'Відхилення успішне',
  rejectionError: 'Помилка відхилення',
  
  // Product search translations
  deleteProduct: 'Видалити продукт',
  deleteProductAuth: 'Автентифікація для видалення продукту',
  productDeleteSuccess: 'Продукт видалений успішно',
  productDeleteError: 'Помилка видалення продукту',
  
  // Product submission form translations
  galleryPermissionRequired: 'Дозвіл на доступ до галереї зображень',
  imageAddedSuccess: 'Зображення додано успішно',
  imageSelectionError: 'Помилка вибору зображення',
  cameraPermissionRequired: 'Дозвіл на доступ до камери',
  photoAddedSuccess: 'Фото додано успішно',
  selectImageMethod: 'Виберіть метод додавання зображення',
  selectFromGallery: 'Виберіть з галереї',
  takePhoto: 'Зробіть фото',
  ingredientsRequired: 'Необхідно вказати інгредієнти',
  submitProductAuth: 'Автентифікація для надсилання продукту',
  
  // Status translations
  statusPending: 'В очікуванні',
  statusApproved: 'Затверджено',
  statusRejected: 'Відхилено',
  
  // Common error messages
  failedToLoad: 'Не вдалося завантажити',
  updateFailed: 'Не вдалося оновити',
  deleteFailed: 'Не вдалося видалити',
  uploadFailed: 'Не вдалося завантажити',
  permissionDenied: 'Доступ заборонено',
  
  // Placeholders
  rejectionReasonPlaceholder: 'Введіть причину відхилення',
  
  // Auth screen messages
  tooManyAttempts: 'Занадто багато спроб',
  waitFiveMinutes: 'Зачекайте 5 хвилин',
  invalidEmail: 'Недійсна електронна пошта',
  enterValidEmail: 'Введіть дійсну електронну пошту',
  googleSignInError: 'Помилка входу з Google',
  authenticationError: 'Помилка аутентифікації',
  
  // Additional hardcoded strings that need translation
  accountBlockedCannotSuggestProducts: 'Ваш акаунт заблокований. Ви не можете пропонувати нові продукти.',
  editProductAction: 'Редагувати продукт',
  cancelAction: 'Скасувати',
  editAction: 'Редагувати',
  deleteProductAction: 'Видалити продукт',
  deleteAction: 'Видалити',
  deleteProductRequiresAuth: 'Потрібна авторизація для видалення продукту',
  productDeleteFailed: 'Не вдалося видалити продукт',
  errorLoadingSubmissions: 'Помилка завантаження заявок',
  authRequiredForAction: 'Потрібна авторизація',
  submissionApprovedSuccess: 'Заявку схвалено та продукт додано до бази даних',
  submissionApprovalFailed: 'Не вдалося схвалити заявку',
  rejectionReasonIsRequired: 'Будь ласка, вкажіть причину відхилення',
  submissionRejectedSuccess: 'Заявку відхилено',
  submissionRejectionFailed: 'Не вдалося відхилити заявку',
  
  // Status text
  statusOnReview: 'На розгляді',
  statusApprovedText: 'Затверджено',
  statusRejectedText: 'Відхилено',
  
  // Placeholder texts
  rejectionReasonPlaceholderText: 'Вкажіть причину відхилення...',
  imageUrlPlaceholder: 'https://example.com/image.jpg',
  zeroPlaceholder: '0',
  barcodePlaceholder: '1234567890123',
  
  // Product submission form
  imageAddedSuccessfully: 'Зображення успішно додано!',
  imageSelectionErrorOccurred: 'Помилка при виборі зображення',
  galleryPermissionNeeded: 'Потрібен дозвіл для доступу до галереї зображень',
  cameraPermissionNeeded: 'Потрібен дозвіл для доступу до камери',
  photoAddedSuccessfully: 'Фото успішно додано!',
  photoCapturingError: 'Помилка при зйомці фото',
  addImageButton: 'Додати зображення',
  selectImageMethodText: 'Виберіть спосіб додавання зображення',
  authRequiredToSubmit: 'Ви повинні увійти в систему, щоб подати продукт',
  ingredientsAreRequired: 'Необхідно вказати інгредієнти',
  
  // Profile and general errors
  pleaseLogInToAddFavorites: 'Увійдіть в систему, щоб додати в улюблені',
  failedToUpdateFavorites: 'Не вдалося оновити улюблені',
  errorLoadingData: 'Помилка завантаження даних. Спробуйте ще раз.',
  failedToUpdateUserStatus: 'Не вдалося оновити статус користувача',
  errorCreatingProductInDatabase: 'Помилка при створенні продукту в базі даних',
  
  // HomeScreen specific
  productSubmissionRequest: 'Заявку на продукт',
  productSubmissionError: 'Помилка при надсиланні продукту. Спробуйте пізніше.',
  
  // Legal page content placeholders
  welcomeToApp: 'Ласкаво просимо до додатку',
  appNameInQuotes: '"Оцінка якості продуктів"',
  termsAcceptanceText: 'Використовуючи цей додаток, ви погоджуєтесь з умовами користування',
  privacyPolicyIntroText: 'Ця політика конфіденційності описує, як ми збираємо та використовуємо дані',
  healthDataNote: 'Дані про здоров\'я: вага, зріст, цілі здоров\'я (за вашою згодою)',
  contactFormNote: 'Ви також можете зв\'язатися з нами через форму зворотного зв\'язку',
  productApprovedSuccessfully: 'Продукт успішно затверджено та додано до бази даних!',
  
  // Additional form labels that appear in components
  chooseImageSource: 'Виберіть джерело зображення',
  selectImageSource: 'Виберіть джерело зображення',
  
  // Barcode scanning messages
  barcodeSavedButNotFound: 'Штрих-код збережено, але продукт не знайдено в базі. Заповніть форму вручну.',
  barcodeSavedButNetworkError: 'Штрих-код збережено, але не вдалося завантажити дані. Перевірте підключення.',
  barcodeSaved: 'Штрих-код збережено',
  
  // HomeScreen error messages
  connectionErrorDetails: 'Не вдалося підключитися до сервера. Спробуйте перезавантажити додаток.',
  tryAgainButton: 'Спробувати знову',
  connectionProblemsShowing: 'Проблеми з підключенням, показано кешовані дані',
  
  // Terms of Service content
  termsIntroText: 'Ласкаво просимо до додатку "Оцінка якості продуктів" ("Додаток"). Цей додаток розроблено для надання користувачам інформації про якість харчових продуктів, їх склад та харчову цінність. Використовуючи наш додаток, ви погоджуєтеся з цими Умовами користування.',
  termsAcceptanceFullText: 'Завантажуючи, встановлюючи або використовуючи цей додаток, ви підтверджуєте, що прочитали, зрозуміли та погоджуєтеся дотримуватися цих Умов користування. Якщо ви не погоджуєтеся з будь-якою частиною цих умов, будь ласка, не користуйтеся додатком.',
  servicesProvidedFullText: 'Наш додаток надає наступні послуги:\n\n• Перегляд детальної інформації про склад та харчову цінність\n• Збереження улюблених продуктів\n• Інструменти для відстеження ваги та здоров\'я',
  userResponsibilitiesFullText: 'Використовуючи додаток, ви зобов\'язуєтеся:\n\n• Надавати точну особисту інформацію\n• Не порушувати права інтелектуальної власності\n• Не використовувати додаток для незаконних цілей\n• Не передавати шкідливий контент або віруси\n• Дотримуватися всіх застосовних законів та норм',
  privacyDataProtectionFullText: 'Ваша приватність важлива для нас. Інформація про те, як ми збираємо, використовуємо та захищаємо ваші особисті дані, детально описана в нашій Політиці конфіденційності. Використовуючи додаток, ви також погоджуєтеся з умовами нашої Політики конфіденційності.',
  limitationLiabilityFullText: 'ДОДАТОК НАДАЄТЬСЯ "ЯК Є" БЕЗ БУДЬ-ЯКИХ ГАРАНТІЙ. МИ НЕ НЕСЕМО ВІДПОВІДАЛЬНОСТІ ЗА:\n\n• Точність інформації про продукти\n• Збитки від використання неточної інформації\n• Технічні збої або недоступність сервісу\n• Втрату даних або порушення безпеки\n\nМаксимальна відповідальність обмежується сумою 50 доларів США.',
  terminationServicesFullText: 'Ми залишаємо за собою право припинити або призупинити ваш доступ до додатку в будь-який час без попереднього повідомлення, якщо ви порушуєте ці Умови користування або використовуєте додаток неналежним чином.',
  modificationsTermsFullText: 'Ми можемо час від часу оновлювати ці Умови користування. Про всі зміни ми повідомимо шляхом публікації оновлених умов у додатку. Продовжуючи користуватися додатком після внесення змін, ви погоджуєтеся з новими умовами.',
  contactInformationFullText: 'Якщо у вас є питання щодо цих Умов користування, будь ласка, зв\'яжіться з нами:\n\nEmail: support@productquality.app\nТелефон: +380 (44) 123-45-67\nАдреса: м. Київ, вул. Хрещатик, 1',
  lastUpdatedDate29May: 'Останнє оновлення: 29 травня 2023',

  // Privacy Policy content
  privacyIntroText: 'Ця Політика конфіденційності описує наші політики та процедури щодо збору, використання та розкриття вашої інформації, коли ви користуєтеся додатком "Оцінка якості продуктів", і розповідає вам про ваші права на приватність та як закон захищає вас.',
  privacyIntroText2: 'Ми використовуємо ваші особисті дані для надання та покращення послуг. Користуючись додатком, ви погоджуєтеся на збір та використання інформації відповідно до цієї Політики конфіденційності.',
  dataCollectionFullText: 'Ми можемо збирати наступні типи інформації:\n\n• Особисті дані: ім\'я, електронна пошта, вік, стать, фізичні параметри\n• Дані про використання: інформація про те, як ви користуєтеся додатком\n• Дані пристрою: IP-адреса, тип браузера, операційна система\n• Інформація про продукти: сканована історія, улюблені продукти\n• Дані про здоров\'я: вага, зріст, цілі здоров\'я (за вашою згодою)',
  dataUsageFullText: 'Компанія може використовувати особисті дані для наступних цілей:\n\n• Надання та підтримка нашого додатку\n• Персоналізація вашого досвіду користування\n• Аналіз використання для покращення послуг\n• Зв\'язок з вами щодо оновлень та новин\n• Забезпечення безпеки та попередження шахрайства\n• Дотримання правових зобов\'язань',
  dataSecurityFullText: 'Безпека ваших особистих даних важлива для нас, але пам\'ятайте, що жоден метод передачі через інтернет або метод електронного зберігання не є 100% безпечним. Хоча ми прагнемо використовувати комерційно прийнятні засоби для захисту ваших особистих даних, ми не можемо гарантувати їх абсолютну безпеку.',
  dataSecurityMeasuresText: 'Ми використовуємо наступні заходи безпеки:\n\n• Шифрування даних при передачі та зберіганні\n• Регулярні аудити безпеки\n• Обмежений доступ до особистих даних\n• Навчання персоналу з питань конфіденційності',
  userRightsFullText: 'Відповідно до застосовного законодавства, ви маєте наступні права:\n\n• Право доступу до ваших особистих даних\n• Право на виправлення неточних даних\n• Право на видалення ваших даних\n• Право на обмеження обробки\n• Право на портативність даних\n• Право на заперечення проти обробки',
  cookiesTrackingFullText: 'Наш додаток може використовувати технології відстеження для покращення користувацького досвіду. Ми можемо використовувати:\n\n• Аналітичні інструменти для розуміння використання додатку\n• Файли cookie для збереження налаштувань\n• Ідентифікатори пристроїв для персоналізації',
  thirdPartyServicesFullText: 'Наш додаток може містити посилання на сторонні сервіси, якими ми не керуємо. Ми настійно радимо вам ознайомитися з Політикою конфіденційності кожного сайту, який ви відвідуєте.\n\nСторонні сервіси, які ми можемо використовувати:\n• Firebase (Google) - для зберігання даних\n• Аналітичні сервіси для поліпшення додатку',
  dataRetentionFullText: 'Ми зберігаємо ваші особисті дані лише стільки, скільки необхідно для цілей, викладених у цій Політиці конфіденційності. Ми також можемо зберігати дані для дотримання правових зобов\'язань, вирішення спорів та забезпечення виконання наших угод.',
  internationalTransfersFullText: 'Ваша інформація, включаючи особисті дані, може оброблятися на комп\'ютерах, розташованих поза вашою країною, де закони про захист даних можуть відрізнятися. Ми вживаємо заходів для забезпечення належного захисту ваших даних під час таких передач.',
  changesPrivacyPolicyFullText: 'Ми можемо оновлювати нашу Політику конфіденційності час від часу. Ми повідомимо вас про будь-які зміни, опублікувавши нову Політику конфіденційності у додатку. Ми також повідомимо вас електронною поштою та/або через помітне повідомлення у додатку до того, як зміни набудуть чинності.',
  privacyContactInformationFullText: 'Якщо у вас є питання щодо цієї Політики конфіденційності, будь ласка, зв\'яжіться з нами:\n\nEmail: privacy@productquality.app\nТелефон: +380 (44) 123-45-67\nАдреса: м. Київ, вул. Хрещатик, 1\n\nВи також можете зв\'язатися з нами через форму зворотного зв\'язку у додатку.',

  // Toast messages
  couldNotLoadProductDetails: 'Не вдалося завантажити деталі продукту',
  addedToFavorites: 'Додано до улюблених',
  removedFromFavorites: 'Видалено з улюблених',
  
  // Nutri-Score system
  nutriScore: {
    nutritionalQuality: 'Якість харчування',
    calculationDetails: 'Деталі розрахунку',
    negativePoints: 'Негативні бали',
    positivePoints: 'Позитивні бали',
    points: 'балів',
    energy: 'Енергія',
    saturatedFat: 'Насичені жири',
    sugars: 'Цукор',
    sodium: 'Натрій',
    fiber: 'Клітковина',
    protein: 'Білок',
    fruitsVegetablesNuts: 'Фрукти, овочі, горіхи',
    finalScore: 'Кінцевий бал',
    category: 'Категорія',
    categories: {
      general: 'Загальні продукти',
      beverages: 'Напої',
      fatsOilsNutsSeeds: 'Жири, олії, горіхи та насіння',
      cheese: 'Сир',
    },
    grades: {
      A: 'Відмінно',
      B: 'Добре',
      C: 'Задовільно',
      D: 'Погано',
      E: 'Дуже погано',
    },
    descriptions: {
      A: 'Відмінна якість харчування',
      B: 'Хороша якість харчування',
      C: 'Задовільна якість харчування',
      D: 'Погана якість харчування',
      E: 'Дуже погана якість харчування',
    },
    recommendations: {
      A: 'Вибирайте цей продукт часто як частину збалансованої дієти',
      B: 'Хороший вибір для регулярного споживання',
      C: 'Споживайте помірно як частину різноманітної дієти',
      D: 'Обмежте споживання та вибирайте здоровіші альтернативи, коли це можливо',
      E: 'Уникайте частого споживання та віддавайте перевагу здоровішим альтернативам',
    },
    calculateAutomatically: 'Розрахувати автоматично',
    autoCalculateExplanation: 'На основі наданих харчових даних',
    scoreCalculatedBased: 'Оцінка розрахована на основі',
    calculationBasedOn: 'Розрахунок на основі європейського алгоритму Nutri-Score',
    missingData: 'Відсутні харчові дані',
    completeNutritionData: 'Будь ласка, заповніть харчову інформацію для точного розрахунку',
    manualOverride: 'Ручне перевизначення',
    manualOverrideExplanation: 'Перевизначити автоматичний розрахунок власною оцінкою',
    gradeCalculatedAutomatically: 'Оцінка розрахована автоматично на основі харчових даних',
  },
  
  // ProductSubmissionsScreen 
  smartProductAnalysis: 'Розумний аналіз продуктів',
  addUpToThreePhotos: 'Додайте до трьох фотографій',
  fast: 'Швидко',
  accurate: 'Точно',
  smart: 'Розумно',
  submittedByLabel: 'Подав:',
  dateLabel: 'Дата:',
  statusLabel: 'Статус:',
  nameLabel: 'Назва:',
  brandLabel: 'Бренд:',
  descriptionLabel: 'Опис:',
  caloriesLabel: 'Калорії:',
  proteinsLabel: 'Білки:',
  fatsLabel: 'Жири:',
  carbohydratesLabel: 'Вуглеводи:',
  ingredientsLabel: 'Інгредієнти:',
  allergensLabel: 'Алергени:',
  tagsLabel: 'Теги:',
  barcodeLabel: 'Штрих-код:',
  manufacturerLabel: 'Виробник:',
  countryLabel: 'Країна:',
  sourceLabel: 'Джерело:',
  rejectionReasonSection: 'Причина відхилення:',
  kcalUnit: 'ккал',
  gramsUnit: 'г',
  
  // AddProductModal 
  photoLimitWarning: 'Попередження про ліміт фото',
  maximumThreePhotos: 'Максимум три фотографії',
  errorPhotoAnalysis: 'Помилка аналізу фото',
  addAtLeastOnePhoto: 'Додайте принаймні одне фото',
  preparingAnalysis: 'Підготовка аналізу',
  analyzingProductComposition: 'Аналіз складу продукту',
  processingResults: 'Обробка результатів',
  analysisComplete: 'Аналіз завершено',
  usingBackupAnalysis: 'Використання резервного аналізу',
  productFound: 'Продукт знайдено',
  fillAutomatically: 'Заповнити автоматично',
  leaveAsIs: 'Залишити як є',
  productNotFoundInfo: 'Продукт не знайдено',
  failedToFindProduct: 'Не вдалося знайти продукт',
  errorAuth: 'Помилка аутентифікації',
  authenticationRequiredForSubmit: 'Потрібна аутентифікація для надсилання',
  enterProductName: 'Введіть назву продукту',
  
  // AddProductModal 
  productAddedSuccess: 'Продукт успішно доданий',
  productAddFailed: 'Не вдалося додати продукт',
  addProductAdmin: 'Додати продукт (адмін)',
  aiProductScanner: 'ШІ сканер продуктів',
  addProductPhoto: 'Додати фото продукту',
  aiAutoDetectInfo: 'Інформація про автовизначення ШІ',
  camera: 'Камера',
  gallery: 'Галерея',
  morePhoto: 'Більше фото',
  analyzeWithAI: 'Аналізувати за допомогою ШІ',
  mayTakeUpTo30Seconds: 'Може зайняти до 30 секунд',
  analysisResult: 'Результат аналізу',
  recognitionAccuracy: 'Точність розпізнавання',
  foundBrand: 'Знайдений бренд',
  foundName: 'Знайдена назва',
  repeatAnalysis: 'Повторити аналіз',
  barcodeSectionAI: 'Секція штрих-коду ШІ',
  barcodeFound: 'Штрих-код знайдено',
  scanAnother: 'Сканувати інший',
  scanBarcodeAction: 'Сканувати штрих-код',
  autoLoadFromOpenFoodFacts: 'Автозавантаження з OpenFoodFacts',
  manualBarcodeInput: 'Ручне введення штрих-коду',
  enter13DigitBarcode: 'Введіть 13-значний штрих-код',
  
  // HomeScreen 
  productsFoundByBarcode: 'Продукти знайдені за штрих-кодом',
  barcodeSearchResult: 'Результат пошуку за штрих-кодом',
  foundProductsLabel: 'Знайдені продукти',
};

const translations = { en, uk } as const;
let currentLanguage: Language = 'uk';

export const t = (key: keyof Omit<TranslationKeys, 'nutriScore'>): string => {
  const value = translations[currentLanguage][key];
  return typeof value === 'string' ? value : '';
};

export const setLanguage = (language: Language): void => {
  currentLanguage = language;
};

export const getCurrentLanguage = (): Language => {
  return currentLanguage;
};

// Ukrainian declension functions
export const getAgeText = (age: number): string => {
  if (currentLanguage !== 'uk') {
    return `${age} years`;
  }
  
  const lastDigit = age % 10;
  const lastTwoDigits = age % 100;
  
  // Special cases for 11-14
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${age} років`;
  }
  
  // For other numbers
  if (lastDigit === 1) {
    return `${age} рік`;
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    return `${age} роки`;
  } else {
    return `${age} років`;
  }
};

export const getWeightText = (weight: number): string => {
  return currentLanguage === 'uk' ? `${weight} кг` : `${weight} kg`;
};

export const getHeightText = (height: number): string => {
  return currentLanguage === 'uk' ? `${height} см` : `${height} cm`;
};

// Special handling for Nutri-Score nested translations
export const tNutriScore = (key: keyof Omit<TranslationKeys['nutriScore'], 'categories' | 'grades' | 'descriptions' | 'recommendations'>): string => {
  const value = translations[currentLanguage].nutriScore[key];
  return typeof value === 'string' ? value : '';
};

export const tNutriScoreCategory = (key: keyof TranslationKeys['nutriScore']['categories']): string => {
  return translations[currentLanguage].nutriScore.categories[key];
};

export const tNutriScoreGrade = (key: keyof TranslationKeys['nutriScore']['grades']): string => {
  return translations[currentLanguage].nutriScore.grades[key];
};

export const tNutriScoreDescription = (key: keyof TranslationKeys['nutriScore']['descriptions']): string => {
  return translations[currentLanguage].nutriScore.descriptions[key];
};

export const tNutriScoreRecommendation = (key: keyof TranslationKeys['nutriScore']['recommendations']): string => {
  return translations[currentLanguage].nutriScore.recommendations[key];
};

// Custom hook for translations that handles nested objects
export const useTranslation = () => {
  const tFunc = (key: keyof Omit<TranslationKeys, 'nutriScore'>): string => {
    const value = translations[currentLanguage][key];
    return typeof value === 'string' ? value : '';
  };

  return {
    t: tFunc,
    nutriScore: translations[currentLanguage].nutriScore,
  };
};
  