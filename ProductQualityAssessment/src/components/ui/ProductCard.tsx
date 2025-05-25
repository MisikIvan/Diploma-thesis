import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Product, NutriScoreGrade } from '../../types';
import { getNutriScoreColor } from '../../types';
import { getProductImage } from '../../utils/helpers';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  compact?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, compact = false }) => {
  const { name, imageUrl, nutriscoreGrade, brand } = product;
  
 
  const getGradeColor = (grade: NutriScoreGrade): string => {
    switch (grade) {
      case 'A': return '#4CAF50'; 
      case 'B': return '#8BC34A'; 
      case 'C': return '#FFC107'; 
      case 'D': return '#FF9800'; 
      case 'E': return '#F44336'; 
      default: return '#9E9E9E';
    }
  };

 
  const getTags = () => {
    const tags = [];
    if (product.isVegan) tags.push('Vegan');
    if (!product.hasLactose) tags.push('Dairy Free');
    if (!product.hasGluten) tags.push('Gluten Free');
    return tags;
  };

  const tags = getTags();
  const firstTag = tags[0];
  const additionalTagsCount = tags.length - 1;
  
  return (
    <TouchableOpacity 
      style={[styles.card, compact && styles.compactCard]} 
      onPress={() => onPress(product)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <Image 
          source={{ uri: getProductImage(imageUrl || '') }} 
          style={[styles.image, compact && styles.compactImage]}
          resizeMode="cover" 
        />
        
        <View style={styles.contentContainer}>
          <View style={styles.textContent}>
            <Text style={styles.name} numberOfLines={2}>
              {name}
            </Text>
            {brand && (
              <Text style={styles.brand} numberOfLines={1}>
                {brand}
              </Text>
            )}
            
            {/* */}
            {firstTag && (
              <View style={styles.tagsContainer}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{firstTag}</Text>
                </View>
                {additionalTagsCount > 0 && (
                  <View style={styles.additionalTagsCounter}>
                    <Text style={styles.additionalTagsText}>+{additionalTagsCount}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
          
          <View style={[styles.gradeContainer, { backgroundColor: getGradeColor(nutriscoreGrade) }]}>
            <Text style={styles.gradeText}>{nutriscoreGrade}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    margin: 12,
    overflow: 'hidden',
    width: '92%',
    alignSelf: 'center',
    height: 120, 
  },
  compactCard: {
    width: 280,
    margin: 8,
    borderRadius: 16,
    height: 110,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
    flex: 1,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  compactImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 16,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textContent: {
    flex: 1,
    paddingRight: 12,
    justifyContent: 'space-between',
    height: 80, 
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1a1a1a',
    lineHeight: 22,
  },
  brand: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
  },
  tag: {
    backgroundColor: '#e8f4fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
  },
  tagText: {
    fontSize: 11,
    color: '#1976d2',
    fontWeight: '500',
  },
  additionalTagsCounter: {
    backgroundColor: '#e8f4fd',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 10,
    marginLeft: 6,
    height: 24,
    justifyContent: 'center',
    minWidth: 24,
  },
  additionalTagsText: {
    fontSize: 10,
    color: '#1976d2',
    fontWeight: '600',
    textAlign: 'center',
  },
  gradeContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  gradeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductCard; 