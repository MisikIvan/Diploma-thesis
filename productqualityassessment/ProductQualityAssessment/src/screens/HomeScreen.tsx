import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text, Alert, TouchableOpacity, ToastAndroid } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { searchProducts, setCurrentProduct, loadRecentProducts, addToViewHistory } from '../redux/slices/productsSlice';
import { useFocusEffect } from '@react-navigation/native';
import SearchBar from '../components/SearchBar';
import RecentProducts from '../components/RecentProducts';
import ProductCard from '../components/ui/ProductCard';
import SuggestProductBanner from '../components/SuggestProductBanner';
import ProductSubmissionForm from '../components/ProductSubmissionForm';
import BarcodeScanner from '../components/BarcodeScanner';
import { Product, ProductSubmission } from '../types/index';
import { t } from '../utils/translations';
import { createSubmission } from '../api/firebase';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { getAllProducts } from '../api/firebase';
import { APP_CONSTANTS } from '../utils/config';
import { StorageService } from '../utils/storage';
import { showSuccess, showError, showSubmitSuccess, showNetworkError } from '../utils/alerts';
import { Colors, Spacing, Typography, ComponentStyles, Shadows } from '../utils/theme';
import QuickAnalysisFloatingButton from '../components/QuickAnalysisFloatingButton';
import { AnalyzedProductData } from '../api/smartProductAnalysis';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { 
    products = [], 
    recentProducts = [], 
    loading: reduxLoading = false, 
    error: reduxError = null,
  } = useAppSelector(state => state.products);
  
  const { currentUser } = useAppSelector(state => state.user);

  // Local state for loading and error handling
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allProductsForSearch, setAllProductsForSearch] = useState<Product[]>([]);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  
  const searchFilteredProducts = useMemo(() => {
    if (!localSearchQuery.trim()) return allProducts;
    
    const searchTerm = localSearchQuery.toLowerCase().trim();
    
    // Check if search term is a barcode 
    const isBarcode = /^\d{8,13}$/.test(searchTerm);
    
    // For any search, prefer all products if available
    const searchableProducts = allProductsForSearch.length > 0 ? allProductsForSearch : allProducts;
    
    return searchableProducts.filter((product: Product) => {
      // If searching by barcode, prioritize barcode field
      if (isBarcode) {
        const productBarcode = product.barcode ? String(product.barcode).trim() : '';
        const searchBarcode = String(searchTerm).trim();
        const productId = String(product.productId).trim();
        
        // Exact match first
        if (productBarcode === searchBarcode || productId === searchBarcode) return true;
        // Partial match as fallback
        if (productBarcode && productBarcode.includes(searchBarcode)) return true;
        if (productId.toLowerCase().includes(searchTerm)) return true;
      }
      
      // Search in product name
      if (product.name.toLowerCase().includes(searchTerm)) return true;
      
      // Search in brand
      if (product.brand?.toLowerCase().includes(searchTerm)) return true;
      
      // Search in product ID/barcode
      if (product.productId.toLowerCase().includes(searchTerm)) return true;
      if (product.barcode?.toLowerCase().includes(searchTerm)) return true;
      
      // Search in ingredients
      if (product.ingredients?.toLowerCase().includes(searchTerm)) return true;
      
      // Search in description
      if (product.description?.toLowerCase().includes(searchTerm)) return true;
      
      // Search in allergens
      if (product.allergens?.some((allergen: string) => allergen.toLowerCase().includes(searchTerm))) return true;
      
      // Search in tags
      if (product.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm))) return true;
      
      return false;
    });
  }, [allProducts, allProductsForSearch, localSearchQuery]);


  useEffect(() => {
    if (!hasInitialLoad) {
      loadProducts();
      if (currentUser?.userId) {
        dispatch(loadRecentProducts(currentUser.userId));
      }
      setHasInitialLoad(true);
    }
  }, [hasInitialLoad, currentUser?.userId]);

  // Reload data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );

  const loadProducts = async (showLoader = true) => {
    try {
      if (showLoader) setIsLoading(true);
      setError(null);
      
      // Load only 20 latest products for home screen
      const fetchedProducts = await getAllProducts(APP_CONSTANTS.MAX_HOME_PRODUCTS);
      setAllProducts(fetchedProducts);
      // Don't set allProductsForSearch here - keep it empty until search is needed
      console.log(`🏠 Home screen loaded ${fetchedProducts.length} latest products`);
    } catch (err: any) {
      console.error('Error loading products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };

  // Load all products for search (barcode and text search)
  const loadAllProductsForSearch = async () => {
    try {
      console.log('🔍 Завантажуємо ВСІ продукти для пошуку...');
      const allProductsFromDB = await getAllProducts(); // No limit - get all products
      console.log(`🔍 Завантажено ${allProductsFromDB.length} продуктів для пошуку`);
      setAllProductsForSearch(allProductsFromDB); // Cache all products
      return allProductsFromDB;
    } catch (error) {
      console.error('Помилка завантаження всіх продуктів:', error);
      return allProductsForSearch.length > 0 ? allProductsForSearch : allProducts; // fallback
    }
  };

  
  const handleSearch = useCallback(async (query: string) => {
    (global as any).lastInteractionTime = Date.now();
    setLocalSearchQuery(query);
    
    // If we have a search query and don't have all products loaded, load them
    if (query.trim() && allProductsForSearch.length <= APP_CONSTANTS.MAX_HOME_PRODUCTS) {
      console.log('🔍 Виявлено пошук, завантажуємо всі продукти...');
      setIsSearchLoading(true);
      try {
        await loadAllProductsForSearch(); // Wait for all products to load
        console.log('🔍 Всі продукти завантажені, пошук готовий');
      } catch (error) {
        console.error('🔍 Помилка завантаження продуктів для пошуку:', error);
      } finally {
        setIsSearchLoading(false);
      }
    }
  }, [allProductsForSearch.length]);

  // Handle barcode scanning
  const handleBarcodePress = () => {
    setShowBarcodeScanner(true);
  };

  const handleBarcodeScanned = (barcode: string) => {
    setShowBarcodeScanner(false);
    
    // ДІАГНОСТИКА ПОШУКУ ШТРИХКОДІВ
    console.log('🔍 ДІАГНОСТИКА ПОШУКУ ШТРИХКОДІВ');
    console.log('Штрихкод для пошуку:', barcode);
    console.log('Кількість продуктів в allProducts (обмежено):', allProducts.length);
    
    // Set the barcode as search query
    setLocalSearchQuery(barcode);
    
    // Load all products and then search
    loadAllProductsForSearch().then(fullProductsList => {
      console.log('Кількість ВСІх продуктів для пошуку:', fullProductsList.length);
      console.log('Перші 3 продукти:', fullProductsList.slice(0, 3).map(p => ({
        name: p.name,
        productId: p.productId, 
        barcode: p.barcode,
        barcodeType: typeof p.barcode
      })));
      
      // Find products with this barcode (improved search)
      const foundProducts = fullProductsList.filter(product => {
        console.log('Перевірка продукту:', product.name);
        console.log('- product.barcode:', product.barcode, typeof product.barcode);
        console.log('- search barcode:', barcode, typeof barcode);
        
        // Перетворюємо всі значення на рядки та очищуємо від пробілів
        const productBarcode = product.barcode ? String(product.barcode).trim() : '';
        const searchBarcode = String(barcode).trim();
        const productId = String(product.productId).trim();
        
        console.log('- очищений product.barcode:', productBarcode);
        console.log('- очищений search barcode:', searchBarcode);
        console.log('- barcode match:', productBarcode === searchBarcode);
        console.log('- productId match:', productId === searchBarcode);
        
        // Точне співпадіння штрихкоду або productId
        if (productBarcode === searchBarcode || productId === searchBarcode) {
          return true;
        }
        
        // Часткове співпадіння штрихкоду (як резервний варіант)
        if (productBarcode && productBarcode.includes(searchBarcode)) {
          console.log('- часткове співпадіння штрихкоду');
          return true;
        }
        
        return false;
      });
      
      console.log('Результат пошуку:', foundProducts.length, 'продуктів');
      
      if (foundProducts.length > 0) {
       
        if (foundProducts.length === 1) {
          handleProductPress(foundProducts[0]);
        } else {
          // Multiple products found, show search results
          ToastAndroid.show(
            t('productsFoundByBarcode'),
            ToastAndroid.LONG
          );
          
          Alert.alert(
            t('productsFoundByBarcode'),
            `${t('barcodeSearchResult')} ${barcode} ${t('foundProductsLabel')} ${foundProducts.length} ${t('products')}`
          );
        }
      } else {
        // No products found with this barcode
        Alert.alert(
          'Продукт не знайдено',
          `За штрих-кодом ${barcode} не знайдено жодного продукту в базі даних. Можете додати новий продукт.`,
          [
            { text: 'OK', style: 'default' },
            { 
              text: 'Додати продукт', 
              style: 'default',
              onPress: () => handleSuggestProduct()
            }
          ]
        );
      }
    }).catch(error => {
      console.error('Помилка під час пошуку штрихкодів:', error);
      Alert.alert(
        'Помилка пошуку',
        'Виникла помилка під час пошуку продукту. Спробуйте ще раз.',
        [{ text: 'OK', style: 'default' }]
      );
    });
  };

  
  const handleRefresh = async () => {
    setRefreshing(true);
    (global as any).lastInteractionTime = Date.now();
    
    try {
      await loadProducts();
      if (currentUser?.userId) {
        await dispatch(loadRecentProducts(currentUser.userId));
      }
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

 
  const handleProductPress = useCallback(async (product: Product) => {
    try {
      // Enhanced validation
      console.log('handleProductPress called with product:', {
        productId: product?.productId,
        name: product?.name,
        hasProduct: !!product,
        productKeys: product ? Object.keys(product) : 'none'
      });
      
      if (!product) {
        console.warn('handleProductPress: No product provided');
        return;
      }
      
      if (!product.productId) {
        console.warn('handleProductPress: Product missing productId:', product);
        return;
      }
      
      if (!product.name) {
        console.warn('handleProductPress: Product missing name:', product);
        return;
      }
      
      // Add to view history with enhanced logging
      if (currentUser?.userId) {
        console.log('🔥 Adding to view history for user:', currentUser.userId);
        await dispatch(addToViewHistory({ userId: currentUser.userId, product }));
        console.log('🔥 Successfully added to view history via Redux');
      } else {
        console.log('No current user, skipping view history');
      }
      
      console.log('Navigating to ProductDetail with productId:', product.productId);
      navigation.navigate('ProductDetail', { productId: product.productId });
      
    } catch (error) {
      console.error('Error in handleProductPress:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
      console.error('Product data at error:', JSON.stringify(product, null, 2));
      
      // Still navigate even if history saving fails
      if (product?.productId) {
        console.log('Attempting navigation despite error...');
        try {
      navigation.navigate('ProductDetail', { productId: product.productId });
        } catch (navError) {
          console.error('Navigation also failed:', navError);
        }
      }
    }
  }, [navigation, currentUser?.userId]);

  const handleSuggestProduct = () => {
    if (!currentUser) {
      navigation.navigate('Auth');
      return;
    }
    
    // Check if user is blocked
    if (currentUser.isBlocked) {
      Alert.alert(
        t('accessDenied'), 
        t('accountBlockedCannotSuggestProducts'),
        [{ text: t('ok'), style: 'default' }]
      );
      return;
    }
    
    setShowSubmissionForm(true);
  };

  const handleSubmitProduct = async (submission: Omit<ProductSubmission, 'submissionId' | 'submittedAt'>) => {
    try {
      await createSubmission(submission);
      showSubmitSuccess(t('productSubmissionRequest'));
    } catch (error) {
      console.error('Error submitting product:', error);
      showError(t('productSubmissionError'));
    } finally {
      setShowSubmissionForm(false);
    }
  };

  const handleRetry = () => {
    loadProducts(true);
  };

  const renderProductItem = React.useCallback(({ item }: { item: Product }) => (
    <ProductCard product={item} onPress={handleProductPress} />
  ), []);

  const keyExtractor = React.useCallback((item: Product) => item.productId, []);

  
  const displayProducts = useMemo(() => {
    let baseProducts = searchFilteredProducts;
    
    return baseProducts;
  }, [searchFilteredProducts, localSearchQuery]);

  // Check if current search is a barcode
  const isSearchingByBarcode = useMemo(() => {
    return /^\d{8,13}$/.test(localSearchQuery.trim());
  }, [localSearchQuery]);

  
  const listHeader = useMemo(() => (
    <View>
      <SearchBar 
        initialQuery={localSearchQuery}
        onSearch={handleSearch}
        onBarcodePress={handleBarcodePress}
        loading={isSearchLoading} 
      />
      
      {localSearchQuery.trim() && (
        <View style={styles.searchResultsContainer}>
          <Text style={styles.searchResultsText}>
            {displayProducts.length > 0 
              ? `${isSearchingByBarcode ? 'За штрих-кодом' : t('searchResults')}: ${displayProducts.length}`
              : isSearchingByBarcode ? 'За штрих-кодом не знайдено' : t('noResults')
            }
          </Text>
          <Text style={styles.searchQueryText}>
            {isSearchingByBarcode ? `Штрих-код: "${localSearchQuery.trim()}"` : `"${localSearchQuery.trim()}"`}
          </Text>
        </View>
      )}
      
      {recentProducts.length > 0 && !localSearchQuery.trim() && (
        <RecentProducts 
          products={recentProducts}
          onProductPress={handleProductPress}
        />
      )}

      {!localSearchQuery.trim() && currentUser && !currentUser.isBlocked && (
        <SuggestProductBanner onPress={handleSuggestProduct} />
      )}
    </View>
  ), [recentProducts, localSearchQuery, handleSearch, displayProducts, isSearchingByBarcode, isSearchLoading]);

  if ((isLoading || reduxLoading) && allProducts.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>{t('loading')}</Text>
      </View>
    );
  }

  if ((error || reduxError) && allProducts.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t('networkError')}</Text>
        <Text style={styles.errorSubText}>
          {t('connectionErrorDetails')}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryText}>{t('tryAgainButton')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={displayProducts}
        renderItem={renderProductItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={listHeader}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={true}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {isSearchingByBarcode ? 
                'Продукт з таким штрих-кодом не знайдено. Спробуйте додати новий продукт.' : 
                t('noResults')
              }
            </Text>
          </View>
        }
      />

      {(error || reduxError) && allProducts.length > 0 && (
        <View style={styles.bottomErrorIndicator}>
          <Text style={styles.bottomErrorText}>
            {t('connectionProblemsShowing')}
          </Text>
        </View>
      )}

      <ProductSubmissionForm
        visible={showSubmissionForm}
        onClose={() => setShowSubmissionForm(false)}
        onSubmit={handleSubmitProduct}
      />

      <BarcodeScanner
        visible={showBarcodeScanner}
        onClose={() => setShowBarcodeScanner(false)}
        onBarcodeScanned={handleBarcodeScanned}
      />

      <QuickAnalysisFloatingButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingBottom: 200,
    paddingHorizontal: Spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: Spacing.sm,
    ...Typography.body,
    color: Colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.background,
  },
  errorText: {
    ...Typography.h3,
    color: Colors.error,
    textAlign: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.error,
    ...Shadows.medium,
    marginBottom: Spacing.sm,
  },
  errorSubText: {
    ...Typography.caption,
    color: Colors.text.secondary,
    textAlign: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.error,
    ...Shadows.medium,
    marginBottom: Spacing.lg,
  },
  retryButton: {
    ...ComponentStyles.button.primary,
  },
  retryText: {
    ...Typography.body,
    color: Colors.text.onPrimary,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
    marginTop: 50,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.default,
    ...Shadows.medium,
  },
  bottomErrorIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.border.error,
    borderTopWidth: 1,
    borderTopColor: Colors.error,
  },
  bottomErrorText: {
    ...Typography.small,
    color: Colors.error,
    textAlign: 'center',
    padding: Spacing.sm,
    fontWeight: '500',
  },
  searchResultsContainer: {
    ...ComponentStyles.section,
  },
  searchResultsText: {
    ...Typography.h3,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  searchQueryText: {
    ...Typography.caption,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
});

export default HomeScreen; 