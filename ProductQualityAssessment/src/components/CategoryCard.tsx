import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ProductCategory } from '../types';

interface CategoryCardProps {
  category: ProductCategory;
  isSelected: boolean;
  onPress: () => void;
}

export default function CategoryCard({ category, isSelected, onPress }: CategoryCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selected,
      ]}
      onPress={onPress}
    >
      <Text style={styles.icon}>{category.icon}</Text>
      <Text style={[
        styles.name,
        isSelected && styles.selectedText,
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginRight: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selected: {
    backgroundColor: '#2ECC71',
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
  },
  name: {
    fontSize: 12,
    color: '#333',
  },
  selectedText: {
    color: '#fff',
  },
}); 