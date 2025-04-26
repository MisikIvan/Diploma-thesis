import React from 'react';
import {
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import { Product } from '../types';
import { NUTRITION_SCORE_COLORS } from '../constants';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function ProductCard({ product, onPress }: ProductCardProps) {
  const scoreColor = NUTRITION_SCORE_COLORS[product.nutritionScore.letter];

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{ uri: product.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.scoreContainer}>
          <View style={[styles.scoreBadge, { backgroundColor: scoreColor }]}>
            <Text style={styles.scoreText}>{product.nutritionScore.letter}</Text>
          </View>
          <Text style={styles.scoreValue}>{product.nutritionScore.score}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  scoreText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scoreValue: {
    fontSize: 12,
    color: '#666',
  },
}); 