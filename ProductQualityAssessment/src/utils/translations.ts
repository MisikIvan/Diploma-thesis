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
};

// Ukrainian translations
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
  points: 'Балів',
  
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
};

const translations = { en, uk } as const;
let currentLanguage: Language = 'uk';

export const t = (key: keyof TranslationKeys): string => {
  return translations[currentLanguage][key];
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