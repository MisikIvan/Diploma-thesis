import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Product, getNutriScoreColor } from '../types';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{ uri: product.imageUrl }}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.nutriScoreContainer}>
          <Text style={styles.nutriScoreText}>
            Nutri-Score: {product.nutriscoreGrade}
          </Text>
          <Text style={styles.nutriScoreEmoji}>
            {getNutriScoreColor(product.nutriscoreGrade)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 4,
  },
  content: {
    marginTop: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  nutriScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nutriScoreText: {
    fontSize: 12,
    marginRight: 4,
  },
  nutriScoreEmoji: {
    fontSize: 16,
  },
});

export default ProductCard; 