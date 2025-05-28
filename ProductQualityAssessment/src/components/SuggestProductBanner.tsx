import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { t } from '../utils/translations';

interface SuggestProductBannerProps {
  onPress: () => void;
}

const SuggestProductBanner: React.FC<SuggestProductBannerProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.banner} onPress={onPress} activeOpacity={0.8}>
      <ImageBackground 
        source={require('../assets/send-baner.png')} 
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <View style={styles.overlay} />
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{t('suggestProduct')}</Text>
            <Text style={styles.subtitle}>
              Допоможіть розширити нашу базу продуктів
            </Text>
          </View>
          
          <View style={styles.iconContainer}>
            <Ionicons 
              name="add-circle" 
              size={32} 
              color="#fff" 
            />
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  backgroundImage: {
    width: '100%',
    minHeight: 120,
    justifyContent: 'center',
  },
  backgroundImageStyle: {
    borderRadius: 16,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(52, 87, 42, 0.75)',
    borderRadius: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    zIndex: 2,
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
});

export default SuggestProductBanner; 