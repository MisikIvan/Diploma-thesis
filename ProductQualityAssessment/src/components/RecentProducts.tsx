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
  if (products.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t('noResults')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('recentProducts')}</Text>
      <FlatList
        data={products.slice(0, APP_CONSTANTS.MAX_RECENT_PRODUCTS)}
        renderItem={({ item }) => (
          <ProductCard 
            product={item} 
            onPress={onProductPress} 
            compact={true} 
          />
        )}
        keyExtractor={(item) => item.productId}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
  },
  listContent: {
    paddingHorizontal: 10,
  },
  emptyContainer: {
    marginVertical: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default RecentProducts; 