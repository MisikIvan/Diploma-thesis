import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { searchProducts, setCurrentProduct, setSelectedCategory } from '../redux/slices/productsSlice';
import SearchBar from '../components/SearchBar';
import CategoryList from '../components/CategoryList';
import RecentProducts from '../components/RecentProducts';
import ProductCard from '../components/ui/ProductCard';
import { Product } from '../types';

interface HomeScreenProps {
  navigation: any; // Should be properly typed with React Navigation types
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

  const [showFilterModal, setShowFilterModal] = useState(false);

  // Initial search when the component mounts
  useEffect(() => {
    if (products.length === 0) {
      handleSearch('');
    }
  }, []);

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

  return (
    <View style={styles.container}>
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

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error}. Please try again.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts.length > 0 ? filteredProducts : products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.productId}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No products found. Try a different search term.
              </Text>
            </View>
          }
        />
      )}

      {/* Filter Modal would go here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: 200,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default HomeScreen; 