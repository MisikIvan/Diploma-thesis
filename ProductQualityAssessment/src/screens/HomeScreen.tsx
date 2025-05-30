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
import { Product, ProductSubmission } from '../types/index';
import { t } from '../utils/translations';
import { createSubmission } from '../api/firebase';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { getAllProducts } from '../api/firebase';
import { StorageService } from '../utils/storage';
import { showSuccess, showError, showSubmitSuccess, showNetworkError } from '../utils/alerts';
import { Colors, Spacing, Typography, ComponentStyles, Shadows } from '../utils/theme';

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
  const [error, setError] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  
  const searchFilteredProducts = useMemo(() => {
    if (!localSearchQuery.trim()) return allProducts;
    
    const searchTerm = localSearchQuery.toLowerCase().trim();
    return allProducts.filter((product: Product) => {
      // Search in product name
      if (product.name.toLowerCase().includes(searchTerm)) return true;
      
      // Search in brand
      if (product.brand?.toLowerCase().includes(searchTerm)) return true;
      
      // Search in product ID/barcode
      if (product.productId.toLowerCase().includes(searchTerm)) return true;
      
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
  }, [allProducts, localSearchQuery]);


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
      
      const fetchedProducts = await getAllProducts();
      setAllProducts(fetchedProducts);
      
    
      const recent = await StorageService.viewHistory.getViewHistory();
    
      if (currentUser?.userId) {
        const userRecent = recent
          .filter(h => h.userId === currentUser.userId)
          .slice(0, 5);
        
      }
    } catch (err: any) {
      console.error('Error loading products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };

  
  const handleSearch = useCallback((query: string) => {
    (global as any).lastInteractionTime = Date.now();
    setLocalSearchQuery(query); 
  }, []);

  
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
      // Add to view history
      if (currentUser?.userId) {
        await StorageService.viewHistory.addToViewHistory(currentUser.userId, product);
      }
      navigation.navigate('ProductDetail', { productId: product.productId });
    } catch (error) {
      console.error('Error saving recent product:', error);
      navigation.navigate('ProductDetail', { productId: product.productId });
    }
  }, [navigation, currentUser?.userId]);

  const handleSuggestProduct = () => {
    if (!currentUser) {
      navigation.navigate('Auth');
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

  
  const listHeader = useMemo(() => (
    <View>
      <SearchBar 
        initialQuery={localSearchQuery}
        onSearch={handleSearch}
        loading={false} 
      />
      
      {localSearchQuery.trim() && (
        <View style={styles.searchResultsContainer}>
          <Text style={styles.searchResultsText}>
            {displayProducts.length > 0 
              ? `${t('searchResults')}: ${displayProducts.length}`
              : t('noResults')
            }
          </Text>
          <Text style={styles.searchQueryText}>
            "{localSearchQuery.trim()}"
          </Text>
        </View>
      )}
      
      {recentProducts.length > 0 && !localSearchQuery.trim() && (
        <RecentProducts 
          products={recentProducts}
          onProductPress={handleProductPress}
        />
      )}

      {!localSearchQuery.trim() && (
        <SuggestProductBanner onPress={handleSuggestProduct} />
      )}
    </View>
  ), [recentProducts, localSearchQuery, handleSearch, displayProducts]);

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
            <Text style={styles.emptyText}>{t('noResults')}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingBottom: 120,
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