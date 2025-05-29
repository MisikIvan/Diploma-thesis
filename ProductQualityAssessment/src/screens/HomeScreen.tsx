import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text, Alert, TouchableOpacity, ToastAndroid } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { searchProducts, setCurrentProduct, setSelectedCategory, loadRecentProducts, addToViewHistory } from '../redux/slices/productsSlice';
import { useFocusEffect } from '@react-navigation/native';
import CategoryList from '../components/CategoryList';
import SearchBar from '../components/SearchBar';
import RecentProducts from '../components/RecentProducts';
import ProductCard from '../components/ui/ProductCard';
import SuggestProductBanner from '../components/SuggestProductBanner';
import ProductSubmissionForm from '../components/ProductSubmissionForm';
import { Product, ProductSubmission } from '../types/index';
import { t } from '../utils/translations';
import { createSubmission } from '../api/firebase';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { 
    products = [], 
    recentProducts = [], 
    searchQuery = '', 
    selectedCategory = null, 
    loading: isLoading = false, 
    error = null,
    filteredProducts = [],
  } = useAppSelector(state => state.products);
  
  const { currentUser } = useAppSelector(state => state.user);

  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

 
  useEffect(() => {
    if (!hasInitialLoad) {
      loadProducts();
      if (currentUser?.userId) {
        dispatch(loadRecentProducts(currentUser.userId));
      }
      setHasInitialLoad(true);
    }
  }, [hasInitialLoad, currentUser?.userId]);

 
  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );

  const loadProducts = async () => {
    try {
      await dispatch(searchProducts({ query: '', page: 1, pageSize: 100 }));
    } catch (error) {
      console.error('Error loading products:', error);
    }
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

 
  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.productId });
  };

  const handleCategorySelect = (categoryId: string | null) => {
    (global as any).lastInteractionTime = Date.now();
    dispatch(setSelectedCategory(categoryId));
  };

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
      Alert.alert(t('submissionSuccess'), t('submissionUnderReview'));
    } catch (error) {
      console.error('Error submitting product:', error);
      Alert.alert(t('error'), 'Помилка при надсиланні продукту. Спробуйте пізніше.');
    } finally {
      setShowSubmissionForm(false);
    }
  };


  const renderProductItem = React.useCallback(({ item }: { item: Product }) => (
    <ProductCard product={item} onPress={handleProductPress} />
  ), []);

  
  const keyExtractor = React.useCallback((item: Product) => item.productId, []);

 
  const listHeader = useMemo(() => (
    <View>
      <CategoryList 
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />

      {recentProducts.length > 0 && (
        <RecentProducts 
          products={recentProducts}
          onProductPress={handleProductPress}
        />
      )}

      <SuggestProductBanner onPress={handleSuggestProduct} />
    </View>
  ), [selectedCategory, recentProducts]);

 
  const displayProducts = useMemo(() => {
    return filteredProducts.length > 0 ? filteredProducts : products;
  }, [filteredProducts, products]);

  if (isLoading && products.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>{t('loading')}</Text>
      </View>
    );
  }

  if (error && products.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t('networkError')}</Text>
        <Text style={styles.errorSubText}>
          Не вдалося підключитися до сервера. Спробуйте перезавантажити додаток.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadProducts}>
          <Text style={styles.retryText}>Спробувати знову</Text>
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

     
      {error && products.length > 0 && (
        <View style={styles.bottomErrorIndicator}>
          <Text style={styles.bottomErrorText}>
            ⚠️ Проблеми з підключенням, показано кешовані дані
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
    backgroundColor: '#f8f9fa',
  },
  listContent: {
    paddingBottom: 120,
    paddingHorizontal: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f8d7da',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  errorSubText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f8d7da',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomErrorIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f8d7da',
    borderTopWidth: 1,
    borderTopColor: '#dc3545',
  },
  bottomErrorText: {
    fontSize: 12,
    color: '#dc3545',
    textAlign: 'center',
    padding: 8,
    fontWeight: '500',
  },
});

export default HomeScreen; 