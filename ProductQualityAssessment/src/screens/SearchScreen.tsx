import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../hooks';
import { SearchStackParamList, RootStackParamList } from '../navigation/types';
import { CATEGORIES } from '../constants';
import ProductCard from '../components/ProductCard';
import debounce from 'lodash.debounce';
import { RootState } from '../store';

type SearchScreenNavigationProp = NativeStackNavigationProp<
  SearchStackParamList & RootStackParamList, 
  'SearchScreen'
>;

export default function SearchScreen() {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { items: products, loading } = useAppSelector((state: RootState) => state.products);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.length >= 2) {
        navigation.navigate('SearchResults', {
          query,
          filters: {}
        });
      }
    }, 500),
    [navigation]
  );

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  const handleFilterPress = () => {
    setShowFilters(!showFilters);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Пошук продуктів..."
          value={searchQuery}
          onChangeText={handleSearch}
          autoFocus
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => handleSearch('')}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color="gray" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity onPress={handleFilterPress} style={styles.filterButton}>
        <Ionicons
          name={showFilters ? 'filter' : 'filter-outline'}
          size={24}
          color="#2ECC71"
        />
      </TouchableOpacity>
    </View>
  );

  const renderFilters = () => (
    showFilters && (
      <View style={styles.filtersContainer}>
        <Text style={styles.filtersTitle}>Категорії</Text>
        <FlatList
          data={CATEGORIES}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryChip}
              onPress={() => {
                navigation.navigate('SearchResults', {
                  query: searchQuery,
                  filters: { category: item.id },
                });
              }}
            >
              <Text style={styles.categoryIcon}>{item.icon}</Text>
              <Text style={styles.categoryName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    )
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderFilters()}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    padding: 8,
  },
  filtersContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  categoriesList: {
    marginBottom: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  categoryName: {
    fontSize: 14,
    color: '#333',
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
}); 