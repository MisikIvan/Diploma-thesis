import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { searchProducts, setCurrentProduct, setSelectedCategory } from '../redux/slices/productsSlice';
import { useFocusEffect } from '@react-navigation/native';
import SearchBar from '../components/SearchBar';
import CategoryList from '../components/CategoryList';
import RecentProducts from '../components/RecentProducts';
import ProductCard from '../components/ui/ProductCard';
import { Product } from '../types';
import { t } from '../utils/translations';

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

  console.log('🏠 HomeScreen render - products:', products.length, 'error:', error, 'loading:', isLoading);

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  useEffect(() => {
    console.log('🏠 HomeScreen useEffect - hasInitialLoad:', hasInitialLoad);
    if (!hasInitialLoad) {
      loadProducts();
      setHasInitialLoad(true);
    }
  }, [hasInitialLoad]);

 
  useFocusEffect(
    React.useCallback(() => {
      console.log('🏠 HomeScreen focused - products.length:', products.length);
  
      if (products.length === 0) {
        console.log('🏠 No products found, reloading...');
        loadProducts();
      } else {
        console.log('🏠 Products exist, not reloading. Current products:', products.map(p => p.name).slice(0, 3));
      }
    }, [products.length])
  );

  const loadProducts = () => {
    console.log('🏠 loadProducts called');
    dispatch(searchProducts({ query: '', page: 1, pageSize: 100 }));
  };

  const handleSearch = (query: string) => {
    dispatch(searchProducts({ query, page: 1, pageSize: 20 }));
  };

  const handleProductPress = (product: Product) => {
    dispatch(setCurrentProduct(product));
    navigation.navigate('ProductDetail', { productId: product.productId });
  };

  const handleCategorySelect = (categoryId: string | null) => {
    dispatch(setSelectedCategory(categoryId));
  };

  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductCard product={item} onPress={handleProductPress} />
  );

  const renderListHeader = () => (
    <View>
      <SearchBar 
        initialQuery={searchQuery}
        onSearch={handleSearch}
        onFilterPress={handleFilterPress}
      />

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
    </View>
  );

 
  const shouldShowError = error && products.length === 0 && !isLoading;
  const shouldShowProducts = products.length > 0 || filteredProducts.length > 0;

  return (
    <View style={styles.container}>
      {isLoading && products.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : shouldShowError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {t('networkError')}
          </Text>
          <Text style={styles.errorSubText}>
            Не вдалося підключитися до сервера. Спробуйте перезавантажити додаток.
          </Text>
        </View>
      ) : shouldShowProducts ? (
        <FlatList
          data={filteredProducts.length > 0 ? filteredProducts : products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.productId}
          ListHeaderComponent={renderListHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={true}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {t('noResults')}
              </Text>
            </View>
          }
        />
      ) : (
        <View style={styles.container}>
          {renderListHeader()}
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {t('noResults')}
            </Text>
          </View>
        </View>
      )}

      {/* Error indicator */}
      {error && products.length > 0 && (
        <View style={styles.bottomErrorIndicator}>
          <Text style={styles.bottomErrorText}>
            ⚠️ Проблеми з підключенням, показано кешовані дані
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContent: {
    paddingBottom: 100,
    paddingHorizontal: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
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