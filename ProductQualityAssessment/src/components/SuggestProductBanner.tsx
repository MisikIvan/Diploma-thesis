import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
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
            <View style={styles.titleRow}>
              <FontAwesome5 
                name="plus-circle" 
                size={20} 
                color="#fff" 
                style={styles.titleIcon}
              />
              <Text style={styles.title}>{t('suggestProduct')}</Text>
            </View>
            <Text style={styles.subtitle}>
              Допоможіть розширити нашу базу продуктів
            </Text>
            <View style={styles.featureRow}>
              <MaterialIcons name="camera-alt" size={16} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.featureText}>Фото</Text>
              <MaterialIcons name="qr-code-scanner" size={16} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.featureText}>Штрих-код</Text>
              <FontAwesome5 name="award" size={16} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.featureText}>Бали</Text>
            </View>
          </View>
          
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <FontAwesome5 
                name="arrow-right" 
                size={24} 
                color="#34572a" 
              />
            </View>
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
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  backgroundImage: {
    width: '100%',
    minHeight: 140,
    justifyContent: 'center',
  },
  backgroundImageStyle: {
    borderRadius: 20,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(52, 87, 42, 0.8)',
    borderRadius: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    zIndex: 2,
  },
  textContainer: {
    flex: 1,
    marginRight: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    marginBottom: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    marginRight: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBackground: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default SuggestProductBanner; 