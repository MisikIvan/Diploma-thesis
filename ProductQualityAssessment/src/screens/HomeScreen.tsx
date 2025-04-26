import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchProducts } from '../store/slices/productsSlice';
import { CATEGORIES } from '../constants';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import RecentlyViewedList from '../components/RecentlyViewedList';
import { HomeStackParamList, RootStackParamList } from '../navigation/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList & RootStackParamList,
  'HomeScreen'
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { items: products, selectedCategory, sortBy } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ 
      category: selectedCategory || undefined, 
      sortBy 
    }));
  }, [dispatch, selectedCategory, sortBy]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => navigation.navigate('Main', { 
              screen: 'Search'
            })}
          >
            <Ionicons name="search" size={20} color="gray" />
            <Text style={styles.searchPlaceholder}>Поиск продуктов...</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={24} color="#2ECC71" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <FlatList
              data={CATEGORIES}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesList}
              renderItem={({ item }) => (
                <CategoryCard
                  category={item}
                  isSelected={selectedCategory === item.id}
                  onPress={() => navigation.navigate('CategoryProducts', {
                    categoryId: item.id,
                    categoryName: item.name,
                  })}
                />
              )}
            />
            <RecentlyViewedList />
          </>
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
          />
        )}
        numColumns={2}
        columnWrapperStyle={styles.productColumns}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  searchPlaceholder: {
    marginLeft: 8,
    color: 'gray',
    fontSize: 16,
  },
  filterButton: {
    padding: 8,
  },
  categoriesList: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  productColumns: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
});