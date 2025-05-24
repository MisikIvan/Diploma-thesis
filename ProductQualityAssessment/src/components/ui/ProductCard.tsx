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
  const { name, imageUrl, nutriscoreGrade } = product;
  const nutriScoreColor = getNutriScoreColor(nutriscoreGrade);
  
  return (
    <TouchableOpacity 
      style={[styles.card, compact && styles.compactCard]} 
      onPress={() => onPress(product)}
    >
      <Image 
        source={{ uri: getProductImage(imageUrl || '') }} 
        style={[styles.image, compact && styles.compactImage]}
        resizeMode="cover" 
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            {nutriScoreColor} Nutri-Score: <Text style={styles.grade}>{nutriscoreGrade}</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    margin: 8,
    overflow: 'hidden',
    width: '95%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#f1f3f4',
  },
  compactCard: {
    width: 160,
    margin: 6,
    borderRadius: 14,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#f8f9fa',
  },
  compactImage: {
    height: 120,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#212529',
    lineHeight: 22,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 8,
  },
  scoreText: {
    fontSize: 13,
    color: '#495057',
    fontWeight: '500',
  },
  grade: {
    fontWeight: 'bold',
    color: '#34572a',
  },
});

export default ProductCard; 