import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useAppSelector } from '../hooks/reduxHooks';
import { Product } from '../types';
import ProductCard from '../components/ui/ProductCard';
import { StorageService } from '../utils/storage';

interface FavoritesScreenProps {
  navigation: any; 
}

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ navigation }) => {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { products } = useAppSelector(state => state.products);
  
  // Load favorite products when the component mounts
  useEffect(() => {
    loadFavorites();
  }, []);
  
  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      
      // Get favorites from storage
      const favorites = await StorageService.favorites.getFavorites();
      
      // Mock user ID for now
      const userId = 'currentUser';
      
      // Filter favorites for the current user
      const userFavorites = favorites.filter(fav => fav.userId === userId);
      
      // Map favorites to products
      const favoriteProductList = userFavorites.map(favorite => {
        return products.find(p => p.productId === favorite.productId);
      }).filter(product => product !== undefined) as Product[];
      
      setFavoriteProducts(favoriteProductList);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.productId });
  };
  
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }
  
  if (favoriteProducts.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>You haven't added any favorites yet</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <FlatList
        data={favoriteProducts}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={handleProductPress} />
        )}
        keyExtractor={(item) => item.productId}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  listContent: {
    paddingVertical: 10,
  },
});

export default FavoritesScreen; 