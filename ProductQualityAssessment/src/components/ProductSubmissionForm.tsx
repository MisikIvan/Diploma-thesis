import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ProductSubmission } from '../types';
import { t } from '../utils/translations';
import { useAppSelector } from '../redux/hooks';
import { PREDEFINED_TAGS, getTagDisplayName } from '../utils/helpers';
import BarcodeScanner from './BarcodeScanner';
import { OpenFoodFactsAPI } from '../api/openFoodFacts';

interface ProductSubmissionFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (submission: Omit<ProductSubmission, 'submissionId' | 'submittedAt'>) => void;
}

const ProductSubmissionForm: React.FC<ProductSubmissionFormProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const currentUser = useAppSelector(state => state.user.currentUser);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    imageUrl: '',
    additionalImages: [] as string[],
    nutriscoreGrade: 'A' as 'A' | 'B' | 'C' | 'D' | 'E',
    categories: [] as string[],
    ingredients: '',
    allergens: [] as string[],
    additives: [] as string[],
    nutriments: {
      calories: 0,
      proteins: 0,
      fats: { total: 0, saturated: 0 },
      carbohydrates: { total: 0, sugar: 0 },
      salt: 0,
    },
    tags: [] as string[],
    isVegan: false,
    isVegetarian: false,
    hasLactose: false,
    hasGluten: false,
    weight: 0,
    barcode: '',
    source: '',
    manufacturer: '',
    countryOfOrigin: '',
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAllergen, setSelectedAllergen] = useState('');
  const [selectedAdditive, setSelectedAdditive] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [isFetchingProductData, setIsFetchingProductData] = useState(false);

  const categories = [
    'beverages', 'bread', 'dairy', 'meat', 'fish', 'produce', 'snacks', 'eggs', 'meals'
  ];

  const commonAllergens = [
    'Milk', 'Eggs', 'Fish', 'Shellfish', 'Tree nuts', 'Peanuts', 'Wheat', 'Soybeans'
  ];

  const commonAdditives = [
    'E100', 'E102', 'E104', 'E110', 'E122', 'E124', 'E129', 'E132', 'E133', 'E142'
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      brand: '',
      imageUrl: '',
      additionalImages: [],
      nutriscoreGrade: 'A',
      categories: [],
      ingredients: '',
      allergens: [],
      additives: [],
      nutriments: {
        calories: 0,
        proteins: 0,
        fats: { total: 0, saturated: 0 },
        carbohydrates: { total: 0, sugar: 0 },
        salt: 0,
      },
      tags: [],
      isVegan: false,
      isVegetarian: false,
      hasLactose: false,
      hasGluten: false,
      weight: 0,
      barcode: '',
      source: '',
      manufacturer: '',
      countryOfOrigin: '',
    });
    setNewImageUrl('');
    setSelectedCategory('');
    setSelectedAllergen('');
    setSelectedAdditive('');
    setSelectedTag('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };


  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('permissionRequired'),
          'Потрібен дозвіл для доступу до галереї зображень'
        );
        return false;
      }
    }
    return true;
  };

  // Pick image from device
  const pickImageFromDevice = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      setIsUploadingImage(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        
      
        if (!formData.imageUrl) {
          setFormData(prev => ({ ...prev, imageUrl: imageUri }));
        } else {
          setFormData(prev => ({
            ...prev,
            additionalImages: [...prev.additionalImages, imageUri]
          }));
        }
        
        Alert.alert(t('success'), 'Зображення успішно додано!');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(t('error'), 'Помилка при виборі зображення');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Take photo with camera
  const takePhotoWithCamera = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('permissionRequired'),
          'Потрібен дозвіл для доступу до камери'
        );
        return;
      }

      setIsUploadingImage(true);
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        
       
        if (!formData.imageUrl) {
          setFormData(prev => ({ ...prev, imageUrl: imageUri }));
        } else {
          setFormData(prev => ({
            ...prev,
            additionalImages: [...prev.additionalImages, imageUri]
          }));
        }
        
        Alert.alert(t('success'), 'Фото успішно додано!');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert(t('error'), 'Помилка при зйомці фото');
    } finally {
      setIsUploadingImage(false);
    }
  };


  const showImagePickerOptions = () => {
    Alert.alert(
      'Додати зображення',
      'Виберіть спосіб додавання зображення',
      [
        { text: t('cancel'), style: 'cancel' },
        { text: '📷 Зробити фото', onPress: takePhotoWithCamera },
        { text: '🖼️ Вибрати з галереї', onPress: pickImageFromDevice },
      ]
    );
  };


  const addImageFromUrl = () => {
    if (newImageUrl.trim()) {
      if (!formData.imageUrl) {
        setFormData(prev => ({ ...prev, imageUrl: newImageUrl.trim() }));
      } else {
        setFormData(prev => ({
          ...prev,
          additionalImages: [...prev.additionalImages, newImageUrl.trim()]
        }));
      }
      setNewImageUrl('');
    }
  };

 
  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }));
  };

  const addCategory = () => {
    if (selectedCategory && !formData.categories.includes(selectedCategory)) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, selectedCategory]
      }));
      setSelectedCategory('');
    }
  };

  const removeCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  };

  const addAllergen = () => {
    if (selectedAllergen && !formData.allergens.includes(selectedAllergen)) {
      setFormData(prev => ({
        ...prev,
        allergens: [...prev.allergens, selectedAllergen]
      }));
      setSelectedAllergen('');
    }
  };

  const removeAllergen = (allergen: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.filter(a => a !== allergen)
    }));
  };

  const addAdditive = () => {
    if (selectedAdditive && !formData.additives.includes(selectedAdditive)) {
      setFormData(prev => ({
        ...prev,
        additives: [...prev.additives, selectedAdditive]
      }));
      setSelectedAdditive('');
    }
  };

  const removeAdditive = (additive: string) => {
    setFormData(prev => ({
      ...prev,
      additives: prev.additives.filter(a => a !== additive)
    }));
  };

  const addTag = () => {
    if (selectedTag && !formData.tags.includes(selectedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, selectedTag]
      }));
      setSelectedTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };


  const handleOpenBarcodeScanner = () => {
    setShowBarcodeScanner(true);
  };

  const handleBarcodeScanned = async (barcode: string) => {
    setIsFetchingProductData(true);
    
    try {
      console.log('Scanned barcode:', barcode);
      
     
      const productData = await OpenFoodFactsAPI.getProductByBarcode(barcode);
      
      if (productData) {
      
        setFormData(prev => ({
          ...prev,
          name: productData.name || prev.name,
          description: productData.description || prev.description,
          imageUrl: productData.imageUrl || prev.imageUrl,
          barcode: barcode,
          ingredients: productData.ingredients || prev.ingredients,
          nutriscoreGrade: productData.nutriscoreGrade || prev.nutriscoreGrade,
          categories: productData.categories?.length > 0 ? productData.categories : prev.categories,
          allergens: productData.allergens?.length > 0 ? productData.allergens : prev.allergens,
          additives: productData.additives?.length > 0 ? productData.additives : prev.additives,
          tags: productData.tags?.length > 0 ? productData.tags : prev.tags,
          nutriments: {
            calories: productData.nutriments?.calories || prev.nutriments.calories,
            proteins: productData.nutriments?.proteins || prev.nutriments.proteins,
            fats: {
              total: productData.nutriments?.fats?.total || prev.nutriments.fats.total,
              saturated: productData.nutriments?.fats?.saturated || prev.nutriments.fats.saturated,
            },
            carbohydrates: {
              total: productData.nutriments?.carbohydrates?.total || prev.nutriments.carbohydrates.total,
              sugar: productData.nutriments?.carbohydrates?.sugar || prev.nutriments.carbohydrates.sugar,
            },
            salt: productData.nutriments?.salt || prev.nutriments.salt,
          },
          isVegan: productData.isVegan ?? prev.isVegan,
          isVegetarian: productData.isVegetarian ?? prev.isVegetarian,
          hasLactose: productData.hasLactose ?? prev.hasLactose,
          hasGluten: productData.hasGluten ?? prev.hasGluten,
          weight: productData.weight || prev.weight,
        }));
        
        Alert.alert(
          t('successExclamation'), 
          `Дані продукту "${productData.name}" були автоматично заповнені. Перевірте та відредагуйте їх за потреби.`,
          [{ text: 'OK' }]
        );
      } else {
        setFormData(prev => ({ ...prev, barcode: barcode }));
        Alert.alert(
          t('productNotFound'),
          `Штрих-код ${barcode} було збережено, але дані продукту не знайдено в базі. Будь ласка, заповніть форму вручну.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
      setFormData(prev => ({ ...prev, barcode: barcode }));
      Alert.alert(
        t('networkError'),
        `Штрих-код ${barcode} було збережено, але не вдалося завантажити дані продукту. Перевірте підключення до Інтернету.`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsFetchingProductData(false);
      setShowBarcodeScanner(false);
    }
  };

  const handleCloseBarcodeScanner = () => {
    setShowBarcodeScanner(false);
  };

  const handleSubmit = () => {
    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to submit a product');
      return;
    }

    if (!formData.name.trim()) {
      Alert.alert('Error', t('productNameRequired'));
      return;
    }

    if (!formData.ingredients.trim()) {
      Alert.alert('Error', 'Ingredients are required');
      return;
    }

    const submission: Omit<ProductSubmission, 'submissionId' | 'submittedAt'> = {
      userId: currentUser.userId,
      userDisplayName: currentUser.displayName,
      status: 'pending',
      productData: { ...formData },
    };

    onSubmit(submission);
    handleClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Feather name="x" size={24} color="#666" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <FontAwesome5 name="plus-circle" size={20} color="#34572a" style={styles.headerIcon} />
            <Text style={styles.headerTitle}>{t('submitProduct')}</Text>
          </View>
          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <FontAwesome5 name="paper-plane" size={16} color="#fff" style={styles.submitIcon} />
            <Text style={styles.submitButtonText}>Надіслати</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="info" size={20} color="#34572a" />
              <Text style={styles.sectionTitle}>{t('basicInformation')}</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <FontAwesome5 name="tag" size={14} color="#666" />
                <Text style={styles.label}>{t('productName')} *</Text>
              </View>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder={t('productNamePlaceholder')}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <MaterialIcons name="business" size={14} color="#666" />
                <Text style={styles.label}>Бренд</Text>
              </View>
              <TextInput
                style={styles.input}
                value={formData.brand}
                onChangeText={(text) => setFormData(prev => ({ ...prev, brand: text }))}
                placeholder={t('brandPlaceholder')}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Feather name="file-text" size={14} color="#666" />
                <Text style={styles.label}>{t('description')}</Text>
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                placeholder={t('productDescriptionPlaceholder')}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

       
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="qr-code-scanner" size={20} color="#34572a" />
              <Text style={styles.sectionTitle}>{t('barcodeSection')}</Text>
            </View>
            
            <View style={styles.barcodeContainer}>
              <TouchableOpacity 
                style={[styles.barcodeScanButton, isFetchingProductData && styles.barcodeScanButtonDisabled]}
                onPress={handleOpenBarcodeScanner}
                disabled={isFetchingProductData}
              >
                {isFetchingProductData ? (
                  <View style={styles.loadingContent}>
                    <MaterialIcons name="hourglass-empty" size={20} color="#999" />
                    <Text style={[styles.barcodeScanButtonText, styles.barcodeScanButtonTextDisabled]}>
                      {t('fetchingProductData')}...
                    </Text>
                  </View>
                ) : (
                  <View style={styles.scanButtonContent}>
                    <View style={styles.scanIconContainer}>
                      <MaterialIcons name="qr-code-scanner" size={28} color="#fff" />
                    </View>
                    <View style={styles.scanTextContainer}>
                      <Text style={styles.barcodeScanButtonText}>
                        {t('scanBarcode')}
                      </Text>
                      <Text style={styles.scanButtonSubtext}>
                        Швидке автозаповнення
                      </Text>
                    </View>
                    <MaterialIcons name="arrow-forward" size={20} color="rgba(255,255,255,0.8)" />
                  </View>
                )}
              </TouchableOpacity>
              
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.orText}>{t('orText')}</Text>
                <View style={styles.dividerLine} />
              </View>
              
              <View style={styles.manualInputContainer}>
                <View style={styles.labelContainer}>
                  <MaterialIcons name="keyboard" size={16} color="#666" />
                  <Text style={styles.label}>{t('enterBarcodeManually')}</Text>
                </View>
                <TextInput
                  style={styles.barcodeInput}
                  value={formData.barcode}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, barcode: text }))}
                  placeholder="1234567890123"
                  keyboardType="numeric"
                  maxLength={13}
                  placeholderTextColor="#999"
                />
              </View>
              
              {formData.barcode && (
                <View style={styles.barcodeInfoCard}>
                  <View style={styles.barcodeInfoHeader}>
                    <MaterialIcons name="check-circle" size={20} color="#28a745" />
                    <Text style={styles.barcodeInfoTitle}>
                      {t('barcode')} збережено
                    </Text>
                  </View>
                  <Text style={styles.barcodeNumber}>
                    {formData.barcode}
                  </Text>
                </View>
              )}
              
              <View style={styles.helpContainer}>
                <MaterialIcons name="info" size={16} color="#34572a" />
                <Text style={styles.barcodeHelp}>
                  {t('barcodeAutoFillHelp')}
                </Text>
              </View>
            </View>
          </View>

        
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="photo-library" size={20} color="#34572a" />
              <Text style={styles.sectionTitle}>{t('images')}</Text>
            </View>
            
            <View style={styles.imageButtonsContainer}>
              <TouchableOpacity 
                style={[styles.imagePickerButton, isUploadingImage && styles.imagePickerButtonDisabled]} 
                onPress={showImagePickerOptions}
                disabled={isUploadingImage}
              >
                <MaterialIcons name="add-a-photo" size={20} color={isUploadingImage ? "#999" : "#34572a"} />
                <Text style={[styles.imagePickerButtonText, isUploadingImage && styles.imagePickerButtonTextDisabled]}>
                  {isUploadingImage ? t('uploading') : t('addFromDevice')}
                </Text>
              </TouchableOpacity>
            </View>
            
            {formData.imageUrl && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: formData.imageUrl }} style={styles.productImage} />
                <Text style={styles.imageLabel}>{t('mainImage')}</Text>
                <TouchableOpacity 
                  style={styles.removeMainImageButton}
                  onPress={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                >
                  <Ionicons name="close-circle" size={24} color="#dc3545" />
                </TouchableOpacity>
              </View>
            )}

            {formData.additionalImages.map((url, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: url }} style={styles.productImage} />
                <Text style={styles.imageLabel}>{t('additionalImage')} {index + 1}</Text>
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close-circle" size={24} color="#dc3545" />
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.urlInputSection}>
              <Text style={styles.urlInputLabel}>{t('addImageUrl')}</Text>
              <View style={styles.addImageContainer}>
                <TextInput
                  style={styles.input}
                  value={newImageUrl}
                  onChangeText={setNewImageUrl}
                  placeholder="https://example.com/image.jpg"
                />
                <TouchableOpacity 
                  style={styles.addButton} 
                  onPress={addImageFromUrl}
                  disabled={!newImageUrl.trim()}
                >
                  <Ionicons name="add" size={20} color={newImageUrl.trim() ? "#34572a" : "#999"} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

     
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <FontAwesome5 name="medal" size={20} color="#34572a" />
              <Text style={styles.sectionTitle}>Nutriscore</Text>
            </View>
            <View style={styles.gradeContainer}>
              {(['A', 'B', 'C', 'D', 'E'] as const).map(grade => (
                <TouchableOpacity
                  key={grade}
                  style={[
                    styles.gradeButton,
                    formData.nutriscoreGrade === grade && styles.gradeButtonSelected
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, nutriscoreGrade: grade }))}
                >
                  <Text style={[
                    styles.gradeText,
                    formData.nutriscoreGrade === grade && styles.gradeTextSelected
                  ]}>
                    {grade}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

        
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="category" size={20} color="#34572a" />
              <Text style={styles.sectionTitle}>{t('categories')}</Text>
            </View>
            <View style={styles.addItemContainer}>
              <View style={styles.pickerContainer}>
                <TextInput
                  style={styles.input}
                  value={selectedCategory}
                  onChangeText={setSelectedCategory}
                  placeholder={t('enterCategory')}
                />
              </View>
              <TouchableOpacity style={styles.addButton} onPress={addCategory}>
                <FontAwesome5 name="plus" size={16} color="#34572a" />
              </TouchableOpacity>
            </View>
            <View style={styles.tagContainer}>
              {formData.categories.map(category => (
                <TouchableOpacity
                  key={category}
                  style={styles.tag}
                  onPress={() => removeCategory(category)}
                >
                  <Text style={styles.tagText}>{category}</Text>
                  <Feather name="x" size={14} color="#34572a" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

     
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="list-alt" size={20} color="#34572a" />
              <Text style={styles.sectionTitle}>{t('ingredients')} *</Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.ingredients}
              onChangeText={(text) => setFormData(prev => ({ ...prev, ingredients: text }))}
              placeholder={t('ingredientsPlaceholder')}
              multiline
              numberOfLines={4}
            />
          </View>

     
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <FontAwesome5 name="chart-pie" size={20} color="#34572a" />
              <Text style={styles.sectionTitle}>{t('nutritionalValuePer100g')}</Text>
            </View>
            
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.label}>{t('calories')}</Text>
                <TextInput
                  style={styles.input}
                  value={formData.nutriments.calories.toString()}
                  onChangeText={(text) => setFormData(prev => ({
                    ...prev,
                    nutriments: { ...prev.nutriments, calories: Number(text) || 0 }
                  }))}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.nutritionItem}>
                <Text style={styles.label}>{t('proteins')}</Text>
                <TextInput
                  style={styles.input}
                  value={formData.nutriments.proteins.toString()}
                  onChangeText={(text) => setFormData(prev => ({
                    ...prev,
                    nutriments: { ...prev.nutriments, proteins: Number(text) || 0 }
                  }))}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.label}>{t('totalFats')}</Text>
                <TextInput
                  style={styles.input}
                  value={formData.nutriments.fats.total.toString()}
                  onChangeText={(text) => setFormData(prev => ({
                    ...prev,
                    nutriments: {
                      ...prev.nutriments,
                      fats: { ...prev.nutriments.fats, total: Number(text) || 0 }
                    }
                  }))}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.nutritionItem}>
                <Text style={styles.label}>{t('saturatedFats')}</Text>
                <TextInput
                  style={styles.input}
                  value={formData.nutriments.fats.saturated?.toString() || ''}
                  onChangeText={(text) => setFormData(prev => ({
                    ...prev,
                    nutriments: {
                      ...prev.nutriments,
                      fats: { ...prev.nutriments.fats, saturated: Number(text) || 0 }
                    }
                  }))}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.label}>{t('totalCarbs')}</Text>
                <TextInput
                  style={styles.input}
                  value={formData.nutriments.carbohydrates.total.toString()}
                  onChangeText={(text) => setFormData(prev => ({
                    ...prev,
                    nutriments: {
                      ...prev.nutriments,
                      carbohydrates: { ...prev.nutriments.carbohydrates, total: Number(text) || 0 }
                    }
                  }))}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.nutritionItem}>
                <Text style={styles.label}>{t('sugar')}</Text>
                <TextInput
                  style={styles.input}
                  value={formData.nutriments.carbohydrates.sugar?.toString() || ''}
                  onChangeText={(text) => setFormData(prev => ({
                    ...prev,
                    nutriments: {
                      ...prev.nutriments,
                      carbohydrates: { ...prev.nutriments.carbohydrates, sugar: Number(text) || 0 }
                    }
                  }))}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('saltGrams')}</Text>
              <TextInput
                style={styles.input}
                value={formData.nutriments.salt?.toString() || ''}
                onChangeText={(text) => setFormData(prev => ({
                  ...prev,
                  nutriments: { ...prev.nutriments, salt: Number(text) || 0 }
                }))}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('productWeightGrams')}</Text>
              <TextInput
                style={styles.input}
                value={formData.weight?.toString() || ''}
                onChangeText={(text) => setFormData(prev => ({ ...prev, weight: Number(text) || 0 }))}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
          </View>

       
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('tags')}</Text>
            <View style={styles.addItemContainer}>
              <View style={styles.pickerContainer}>
                <TextInput
                  style={styles.input}
                  value={selectedTag}
                  onChangeText={setSelectedTag}
                  placeholder={t('enterTag')}
                />
              </View>
              <TouchableOpacity style={styles.addButton} onPress={addTag}>
                <Ionicons name="add" size={20} color="#34572a" />
              </TouchableOpacity>
            </View>
            <View style={styles.tagContainer}>
              {formData.tags.map(tag => (
                <TouchableOpacity
                  key={tag}
                  style={styles.tag}
                  onPress={() => removeTag(tag)}
                >
                  <Text style={styles.tagText}>{tag}</Text>
                  <Ionicons name="close" size={16} color="#34572a" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

         
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('allergens')}</Text>
            <View style={styles.addItemContainer}>
              <View style={styles.pickerContainer}>
                <TextInput
                  style={styles.input}
                  value={selectedAllergen}
                  onChangeText={setSelectedAllergen}
                  placeholder={t('enterAllergen')}
                />
              </View>
              <TouchableOpacity style={styles.addButton} onPress={addAllergen}>
                <Ionicons name="add" size={20} color="#34572a" />
              </TouchableOpacity>
            </View>
            <View style={styles.tagContainer}>
              {formData.allergens.map(allergen => (
                <TouchableOpacity
                  key={allergen}
                  style={styles.tag}
                  onPress={() => removeAllergen(allergen)}
                >
                  <Text style={styles.tagText}>{allergen}</Text>
                  <Ionicons name="close" size={16} color="#34572a" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

      
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('verificationInfo')}</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('manufacturer')}</Text>
              <TextInput
                style={styles.input}
                value={formData.manufacturer}
                onChangeText={(text) => setFormData(prev => ({ ...prev, manufacturer: text }))}
                placeholder={t('manufacturerPlaceholder')}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('countryOfOrigin')}</Text>
              <TextInput
                style={styles.input}
                value={formData.countryOfOrigin}
                onChangeText={(text) => setFormData(prev => ({ ...prev, countryOfOrigin: text }))}
                placeholder={t('countryOfOriginPlaceholder')}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('whereFoundProduct')}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.source}
                onChangeText={(text) => setFormData(prev => ({ ...prev, source: text }))}
                placeholder={t('sourcePlaceholder')}
                multiline
                numberOfLines={2}
              />
            </View>
          </View>
        </ScrollView>
      </View>
      
    
      <BarcodeScanner
        visible={showBarcodeScanner}
        onClose={handleCloseBarcodeScanner}
        onBarcodeScanned={handleBarcodeScanned}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  closeButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34572a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  submitIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34572a',
    marginLeft: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginRight: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  imageLabel: {
    textAlign: 'center',
    marginTop: 4,
    fontSize: 12,
    color: '#666',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
  },
  addImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addButton: {
    backgroundColor: '#f0f8f0',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#34572a',
  },
  gradeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gradeButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  gradeButtonSelected: {
    borderColor: '#34572a',
    backgroundColor: '#f0f8f0',
  },
  gradeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  gradeTextSelected: {
    color: '#34572a',
  },
  addItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  pickerContainer: {
    flex: 1,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    borderWidth: 1,
    borderColor: '#34572a20',
  },
  tagText: {
    fontSize: 14,
    color: '#34572a',
  },
  nutritionGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  nutritionItem: {
    flex: 1,
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  imagePickerButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderWidth: 2,
    borderColor: '#34572a',
    borderRadius: 8,
    backgroundColor: '#f0f8f0',
  },
  imagePickerButtonDisabled: {
    borderColor: '#999',
    backgroundColor: '#f5f5f5',
  },
  imagePickerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34572a',
    marginLeft: 8,
  },
  imagePickerButtonTextDisabled: {
    color: '#999',
  },
  removeMainImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
  },
  urlInputSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  urlInputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  barcodeContainer: {
    gap: 16,
  },
  barcodeScanButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#34572a',
    borderRadius: 8,
  },
  barcodeScanButtonDisabled: {
    backgroundColor: '#999',
  },
  barcodeScanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  barcodeScanButtonTextDisabled: {
    color: '#999',
  },
  orText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginVertical: 8,
  },
  barcodeInputContainer: {
    marginBottom: 12,
  },
  barcodeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  barcodeInfoText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#28a745',
    marginLeft: 8,
  },
  barcodeHelp: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 16,
  },
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scanIconContainer: {
    padding: 8,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 8,
  },
  scanTextContainer: {
    flex: 1,
  },
  scanButtonSubtext: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#fff',
  },
  manualInputContainer: {
    marginBottom: 12,
  },
  barcodeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  barcodeInfoCard: {
    backgroundColor: '#f0f8f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  barcodeInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  barcodeInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#28a745',
    marginLeft: 8,
  },
  barcodeNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default ProductSubmissionForm; 