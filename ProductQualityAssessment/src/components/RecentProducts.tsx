import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Product } from '../types';
import ProductCard from './ui/ProductCard';
import { APP_CONSTANTS } from '../utils/config';
import { t } from '../utils/translations';

interface RecentProductsProps {
  products: Product[];
  onProductPress: (product: Product) => void;
}

const RecentProducts: React.FC<RecentProductsProps> = ({ products, onProductPress }) => {
  // Enhanced validation
  if (!products || !Array.isArray(products)) {
    console.warn('RecentProducts: Invalid products prop:', { products, type: typeof products });
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t('noResults') || 'No recent products'}</Text>
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t('noResults') || 'No recent products'}</Text>
      </View>
    );
  }

  // Filter valid products
  const validProducts = products.filter(product => {
    const isValid = product && 
                   product.productId && 
                   typeof product.productId === 'string' &&
                   product.name && 
                   typeof product.name === 'string' &&
                   product.nutriscoreGrade;
    
    if (!isValid) {
      console.warn('RecentProducts: Invalid product filtered out:', product);
    }
    
    return isValid;
  });

  if (validProducts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t('noResults') || 'No recent products'}</Text>
      </View>
    );
  }

  const handleProductPress = (product: Product) => {
    console.log('RecentProducts handleProductPress called:', {
      productId: product?.productId,
      name: product?.name
    });
    
    try {
      if (product && product.productId && onProductPress) {
        onProductPress(product);
      } else {
        console.warn('RecentProducts: Invalid product or onProductPress missing');
      }
    } catch (error) {
      console.error('Error in RecentProducts onProductPress:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('recentProducts') || 'Recent Products'}</Text>
      <FlatList
        data={validProducts.slice(0, APP_CONSTANTS.MAX_RECENT_PRODUCTS)}
        renderItem={({ item }) => (
          <ProductCard 
            product={item} 
            onPress={handleProductPress} 
            compact={true} 
          />
        )}
        keyExtractor={(item) => String(item.productId)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 12,
    color: '#34572a',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  emptyContainer: {
    marginVertical: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
});

export default RecentProducts; 