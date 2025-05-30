import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { PRODUCT_CATEGORIES } from '../utils/config';
import { t } from '../utils/translations';

interface CategoryListProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ selectedCategory, onSelectCategory }) => {

  const categoryIcons: { [key: string]: { name: string, type: 'material' | 'materialcommunity' | 'fontawesome' | 'fontawesome5' | 'ionicons' | 'feather' } } = {
    all: { name: 'apps', type: 'material' },
    beverages: { name: 'tint', type: 'fontawesome' },
    bread: { name: 'food-croissant', type: 'materialcommunity' },
    dairy: { name: 'coffee', type: 'fontawesome' },
    meat: { name: 'food-steak', type: 'materialcommunity' },
    fish: { name: 'fish', type: 'fontawesome5' },
    produce: { name: 'food-apple-outline', type: 'materialcommunity' },
    snacks: { name: 'fastfood', type: 'material' },
    eggs: { name: 'egg-outline', type: 'ionicons' },
    meals: { name: 'restaurant-menu', type: 'material' },
  };

  const allCategories = [
    { id: 'all', nameKey: 'categories' as const },
    ...PRODUCT_CATEGORIES
  ];

  const renderIcon = (categoryId: string, isSelected: boolean) => {
    const iconConfig = categoryIcons[categoryId] || { name: 'category', type: 'material' };
    const iconColor = isSelected ? '#fff' : '#34572a';
    const iconSize = 24;

    switch (iconConfig.type) {
      case 'materialcommunity':
        return <MaterialCommunityIcons name={iconConfig.name as any} size={iconSize} color={iconColor} />;
      case 'fontawesome':
        return <FontAwesome name={iconConfig.name as any} size={iconSize} color={iconColor} />;
      case 'fontawesome5':
        return <FontAwesome5 name={iconConfig.name as any} size={iconSize} color={iconColor} />;
      case 'ionicons':
        return <Ionicons name={iconConfig.name as any} size={iconSize} color={iconColor} />;
      case 'feather':
        return <Feather name={iconConfig.name as any} size={iconSize} color={iconColor} />;
      default:
        return <MaterialIcons name={iconConfig.name as any} size={iconSize} color={iconColor} />;
    }
  };

  const renderCategoryItem = ({ item }: { item: typeof PRODUCT_CATEGORIES[0] | { id: string, nameKey: 'categories' } }) => {
    const isSelected = selectedCategory === item.id || (selectedCategory === null && item.id === 'all');
    
    return (
      <TouchableOpacity
        style={[styles.categoryItem, isSelected && styles.selectedCategory]}
        onPress={() => onSelectCategory(item.id === 'all' ? null : item.id)}
      >
        <View style={styles.categoryIcon}>
          {renderIcon(item.id, isSelected)}
        </View>
        <Text style={[styles.categoryName, isSelected && styles.selectedCategoryText]}>
          {t(item.nameKey)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <MaterialIcons name="apps" size={20} color="#34572a" />
        <Text style={styles.title}>{t('categories')}</Text>
      </View>
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
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