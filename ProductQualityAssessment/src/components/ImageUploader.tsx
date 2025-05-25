import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadProductImage } from '../api/firebase';
import { t } from '../utils/translations';

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImageUrl?: string;
  disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUploaded,
  currentImageUrl,
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('error'),
          'Потрібен дозвіл для доступу до галереї зображень'
        );
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    if (disabled) return;

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setLocalImageUri(imageUri);
        await uploadImage(imageUri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(t('error'), 'Помилка при виборі зображення');
    }
  };

  const uploadImage = async (imageUri: string) => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Інформація',
        'Завантаження зображень на веб-платформі потребує додаткової настройки. Поки що використовуйте URL зображення.'
      );
      return;
    }

    setIsUploading(true);
    try {
   
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const file = new File([blob], 'product-image.jpg', { type: 'image/jpeg' });

      const downloadUrl = await uploadProductImage(file);
      onImageUploaded(downloadUrl);
      
      Alert.alert(t('success'), 'Зображення успішно завантажено!');
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert(t('error'), 'Помилка при завантаженні зображення');
      setLocalImageUri(null);
    } finally {
      setIsUploading(false);
    }
  };

  const getImageSource = () => {
    if (localImageUri) {
      return { uri: localImageUri };
    }
    if (currentImageUrl) {
      return { uri: currentImageUrl };
    }
    return null;
  };

  const imageSource = getImageSource();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Зображення продукту</Text>
      
      <TouchableOpacity
        style={[styles.imageContainer, disabled && styles.disabled]}
        onPress={pickImage}
        disabled={disabled || isUploading}
      >
        {imageSource ? (
          <Image source={imageSource} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderIcon}>📷</Text>
            <Text style={styles.placeholderText}>Додати зображення</Text>
          </View>
        )}
        
        {isUploading && (
          <View style={styles.uploadingOverlay}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.uploadingText}>Завантаження...</Text>
          </View>
        )}
        
        {!isUploading && imageSource && (
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>📷 Змінити</Text>
          </View>
        )}
      </TouchableOpacity>
      
      <Text style={styles.hint}>
        Натисніть, щоб {currentImageUrl || localImageUri ? 'змінити' : 'додати'} зображення
      </Text>
      
      {Platform.OS === 'web' && (
        <Text style={styles.webNote}>
          💡 На веб-платформі рекомендується використовувати URL зображення
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    position: 'relative',
  },
  disabled: {
    opacity: 0.6,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
    alignItems: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  webNote: {
    fontSize: 12,
    color: '#FF9500',
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
  },
  placeholderText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
});

export default ImageUploader; 