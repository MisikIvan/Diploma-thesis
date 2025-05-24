import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { PRODUCT_CATEGORIES } from '../utils/config';
import { t } from '../utils/translations';

interface CategoryListProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ selectedCategory, onSelectCategory }) => {

  const allCategories = [
    { id: 'all', nameKey: 'categories' as const, icon: '🔎' },
    ...PRODUCT_CATEGORIES
  ];

  const renderCategoryItem = ({ item }: { item: typeof PRODUCT_CATEGORIES[0] | { id: string, nameKey: 'categories', icon: string } }) => {
    const isSelected = selectedCategory === item.id || (selectedCategory === null && item.id === 'all');
    
    return (
      <TouchableOpacity
        style={[styles.categoryItem, isSelected && styles.selectedCategory]}
        onPress={() => onSelectCategory(item.id === 'all' ? null : item.id)}
      >
        <Text style={styles.categoryIcon}>{item.icon}</Text>
        <Text style={[styles.categoryName, isSelected && styles.selectedCategoryText]}>
          {t(item.nameKey)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('categories')}</Text>
      <FlatList
        data={allCategories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
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
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: '#fff',
    minWidth: 85,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedCategory: {
    backgroundColor: '#34572a',
    borderColor: '#34572a',
    shadowColor: '#34572a',
    shadowOpacity: 0.3,
    elevation: 6,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
    color: '#495057',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CategoryList; 