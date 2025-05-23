import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useAppSelector } from '../hooks/reduxHooks';
import { Product, Favorite } from '../types';
import ProductCard from '../components/ui/ProductCard';
import { t } from '../utils/translations';
import { useFocusEffect } from '@react-navigation/native';
import { DataService } from '../utils/dataService';
import { FirebaseService } from '../utils/firebase';
import { StorageService } from '../utils/storage';

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
  

  const loadFavorites = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }
    
    try {
      if (!currentUser) {
        setFavoriteProducts([]);
        return;
      }
      
      console.log('Loading favorites for user:', currentUser.userId);
      
 
      await DataService.favorites.clearCache?.();
      

      let favorites;
      try {
      
        const firebaseFavorites = await FirebaseService.favorites.getUserFavorites(currentUser.userId);
        console.log(`Loaded ${firebaseFavorites.length} favorites directly from Firebase`);
        favorites = firebaseFavorites;
        
    
        const allLocalFavorites = await StorageService.favorites.getFavorites();
        const nonUserFavorites = allLocalFavorites.filter((f: Favorite) => f.userId !== currentUser.userId);
        const updatedLocalFavorites = [...nonUserFavorites, ...firebaseFavorites];
        await StorageService.favorites.saveFavorites(updatedLocalFavorites);
      } catch (firebaseError) {
        console.error('Error loading from Firebase, falling back to local storage:', firebaseError);
       
        favorites = await DataService.favorites.getUserFavorites(currentUser.userId);
      }
      
      console.log('Loaded favorites count:', favorites.length);
      
      const favoriteProductList = favorites.map((favorite: Favorite) => {
        return products.find((p: Product) => p.productId === favorite.productId);
      }).filter((product: Product | undefined) => product !== undefined) as Product[];
      
      console.log('Favorite products count:', favoriteProductList.length);
      setFavoriteProducts(favoriteProductList);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [currentUser, products]);


  useFocusEffect(
    useCallback(() => {
      console.log('FavoritesScreen focused - loading favorites');
      loadFavorites();
      return () => {}; 
    }, [loadFavorites])
  );
  

  useEffect(() => {
  
    if (currentProduct) {
      console.log('Product state changed in Redux, refreshing favorites list');
      loadFavorites(false); 
    }
  }, [currentProduct, loadFavorites]);
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadFavorites(false);
  }, [loadFavorites]);
  
  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.productId });
  };
  
  if (isLoading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
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
            colors={["#007AFF"]}
          />
        }
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
  emptySubText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
  listContent: {
    paddingVertical: 10,
  },
});

export default FavoritesScreen; 