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
        source={{ uri: getProductImage(imageUrl) }} 
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
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 8,
    overflow: 'hidden',
    width: '95%',
    alignSelf: 'center',
  },
  compactCard: {
    width: 150,
    margin: 5,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#f0f0f0',
  },
  compactImage: {
    height: 120,
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  scoreText: {
    fontSize: 14,
    color: '#555',
  },
  grade: {
    fontWeight: 'bold',
  },
});

export default ProductCard; 