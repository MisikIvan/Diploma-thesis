import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchProducts, setSelectedCategory } from '../store/slices/productsSlice';
import { HomeStackParamList, RootStackParamList } from '../navigation/types';
import ProductCard from '../components/ProductCard';
import { RootState } from '../store';

type CategoryProductsRouteProp = RouteProp<HomeStackParamList, 'CategoryProducts'>;
type CategoryProductsNavigationProp = NativeStackNavigationProp<
  HomeStackParamList & RootStackParamList,
  'CategoryProducts'
>;

export default function CategoryProductsScreen() {
  const route = useRoute<CategoryProductsRouteProp>();
  const navigation = useNavigation<CategoryProductsNavigationProp>();
  const dispatch = useAppDispatch();
  const { categoryId, categoryName } = route.params;
  const { items: products, loading, sortBy } = useAppSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(setSelectedCategory(categoryId));
    dispatch(fetchProducts({ category: categoryId, sortBy }));

    return () => {
      dispatch(setSelectedCategory(null));
    };
  }, [dispatch, categoryId, sortBy]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#2ECC71" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('ProductDetails', { product: item })}
            />
          )}
          numColumns={2}
          columnWrapperStyle={styles.productColumns}
          contentContainerStyle={styles.productList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                У категорії "{categoryName}" не знайдено продуктів.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productList: {
    padding: 16,
  },
  productColumns: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 