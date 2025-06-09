import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useAppSelector } from '../redux/hooks';
import { Product, Favorite } from '../types';
import ProductCard from '../components/ui/ProductCard';
import { t } from '../utils/translations';
import { useFocusEffect } from '@react-navigation/native';
import { FirebaseService } from '../utils/firebase';
import { getProduct } from '../api/firebase';

interface FavoritesScreenProps {
  navigation: any; 
}

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ navigation }) => {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const { products } = useAppSelector(state => state.products);
  const { currentUser } = useAppSelector(state => state.user);
  const { currentProduct } = useAppSelector(state => state.products);
  

  const loadFavorites = async () => {
    if (!currentUser?.userId) return;

    try {
      setIsLoading(true);
      const firebaseFavorites = await FirebaseService.favorites.getUserFavorites(currentUser.userId);
      
      const favoriteProductList = await Promise.all(
        firebaseFavorites.map(async (favorite: Favorite) => {
          const product = await getProduct(favorite.productId);
          return product;
        })
      );
      
      setFavoriteProducts(favoriteProductList.filter(Boolean) as Product[]);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [currentUser?.userId])
  );

  useEffect(() => {
    if (currentProduct && !isLoading) {
      loadFavorites();
    }
  }, [currentProduct?.productId]);
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadFavorites().finally(() => setRefreshing(false));
  }, []);
  
  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.productId });
  };
  
  if (isLoading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#34572a" />
      </View>
    );
  }
  
  if (!currentUser) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>{t('loginToSeeFavorites') || 'Please log in to see your favorites'}</Text>
      </View>
    );
  }
  
  if (favoriteProducts.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>{t('noFavorites')}</Text>
        <Text style={styles.emptySubText}>{t('startAdding')}</Text>
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#34572a"]}
            tintColor="#34572a"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  emptyText: {
    fontSize: 18,
    color: '#495057',
    textAlign: 'center',
    fontWeight: '600',
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
    marginBottom: 12,
  },
  emptySubText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  listContent: {
    paddingVertical: 16,
    paddingBottom: 100,
  },
});

export default FavoritesScreen; 