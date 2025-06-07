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
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Product } from '../types';
import { t } from '../utils/translations';
import { useAppSelector } from '../redux/hooks';
import { PREDEFINED_TAGS, getTagDisplayName } from '../utils/helpers';
import BarcodeScanner from './BarcodeScanner';
import { OpenFoodFactsAPI } from '../api/openFoodFacts';
import { Colors, Spacing, BorderRadius, Typography, ComponentStyles, Shadows } from '../utils/theme';
import { 
  analyzeProductImage, 
  AnalyzedProductData, 
  autoFillFormFromAnalysis,
  fallbackProductAnalysis
} from '../api/smartProductAnalysis';
import { addProduct } from '../api/firebase';
import AutoNutriScore from './AutoNutriScore';

interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

type FormStep = 'ai-scan' | 'barcode' | 'manual' | 'review';

const AddProductModal: React.FC<AddProductModalProps> = ({
  visible,
  onClose,
  onProductAdded,
}) => {
  const currentUser = useAppSelector(state => state.user.currentUser);
  
  const [currentStep, setCurrentStep] = useState<FormStep>('ai-scan');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    imageUrl: '',
    additionalImages: [] as string[],
    nutriscoreGrade: 'A' as 'A' | 'B' | 'C' | 'D' | 'E',
    ingredients: '',
    allergens: [] as string[],
    additives: [] as string[],
    nutriments: {
      calories: 0,
      proteins: 0,
      fats: { total: 0, saturated: 0, unsaturated: 0 },
      carbohydrates: { total: 0, sugar: 0 },
      salt: 0,
      fiber: 0,
    },
    tags: [] as string[],
    weight: 0,
    barcode: '',
    source: '',
    manufacturer: '',
    countryOfOrigin: '',
  });

  // AI Analysis states
  const [aiScanImages, setAiScanImages] = useState<string[]>([]);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalyzedProductData | null>(null);
  const [showAnalysisDetails, setShowAnalysisDetails] = useState(false);
  
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [isFetchingProductData, setIsFetchingProductData] = useState(false);
  const [fruitsVegetablesNuts, setFruitsVegetablesNuts] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manualBarcodeInput, setManualBarcodeInput] = useState('');
  const [autoCalculatedGrade, setAutoCalculatedGrade] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('C');
  const [useAutoGrade, setUseAutoGrade] = useState(true);

  const resetForm = () => {
    console.log('Resetting form data');
    setFormData({
      name: '',
      description: '',
      brand: '',
      imageUrl: '',
      additionalImages: [],
      nutriscoreGrade: 'A',
      ingredients: '',
      allergens: [],
      additives: [],
      nutriments: {
        calories: 0,
        proteins: 0,
        fats: { total: 0, saturated: 0, unsaturated: 0 },
        carbohydrates: { total: 0, sugar: 0 },
        salt: 0,
        fiber: 0,
      },
      tags: [],
      weight: 0,
      barcode: '',
      source: '',
      manufacturer: '',
      countryOfOrigin: '',
    });
    setAiScanImages([]);
    setProductImages([]);
    setAnalysisResult(null);
    setCurrentStep('ai-scan');
    console.log('✅ Form reset complete');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // AI Scan Functions
  const takeScanPhoto = async () => {
    if (aiScanImages.length >= 3) {
      Alert.alert(t('photoLimitWarning'), t('maximumThreePhotos'));
      return;
    }

    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('permissionRequired'), t('cameraPermissionNeeded'));
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.8,
        exif: false,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setAiScanImages(prev => [...prev, imageUri]);
      }
    } catch (error) {
      Alert.alert(t('error'), t('imageSelectionErrorOccurred'));
    }
  };

  const pickScanImage = async () => {
    if (aiScanImages.length >= 3) {
      Alert.alert(t('photoLimitWarning'), t('maximumThreePhotos'));
      return;
    }

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('permissionRequired'), t('galleryPermissionNeeded'));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
        exif: false,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setAiScanImages(prev => [...prev, imageUri]);
      }
    } catch (error) {
      Alert.alert(t('error'), t('imageSelectionErrorOccurred'));
    }
  };

  const removeScanImage = (index: number) => {
    setAiScanImages(prev => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const startAiAnalysis = async () => {
    if (aiScanImages.length === 0) {
      Alert.alert(t('errorPhotoAnalysis'), t('addAtLeastOnePhoto'));
      return;
    }

    console.log('🤖 Starting AI analysis with images:', aiScanImages.length);
    setIsAnalyzing(true);
    setAnalysisStep(t('preparingAnalysis'));

    try {
      setAnalysisStep(t('analyzingProductComposition'));
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('📸 Analyzing image:', aiScanImages[0]);
      const analysisData = await analyzeProductImage(aiScanImages[0], {
        name: formData.name,
        barcode: formData.barcode,
      });
      
      console.log('🔍 Analysis result:', analysisData);
      setAnalysisStep(t('processingResults'));
      await new Promise(resolve => setTimeout(resolve, 500));

      setAnalysisResult(analysisData);
      
      console.log('🔄 Auto-filling form with analysis result:', analysisData);
      const autoFilledData = autoFillFormFromAnalysis(analysisData, formData);
      applyAnalysisResults(autoFilledData);
      
      setAnalysisStep(t('analysisComplete'));
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('✅ AI analysis completed successfully');
      
    } catch (error) {
      console.error('❌ AI Analysis error:', error);
      
      try {
        setAnalysisStep(t('usingBackupAnalysis'));
        const fallbackData = fallbackProductAnalysis('');
        setAnalysisResult(fallbackData);
        
        console.log('🔄 Auto-filling form with fallback result:', fallbackData);
        const autoFilledData = autoFillFormFromAnalysis(fallbackData, formData);
        applyAnalysisResults(autoFilledData);
        console.log('✅ Fallback analysis applied');
      } catch (fallbackError) {
        console.error('❌ Fallback analysis also failed:', fallbackError);
        Alert.alert('Помилка аналізу', 'Не вдалося проаналізувати зображення. Заповніть форму вручну.');
      }
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const applyAnalysisResults = (autoFilledData: any) => {
    console.log('🔄 Applying analysis results:', autoFilledData);
    
    try {
      setFormData(prev => {
        const newData = {
          ...prev,
          // Safely merge basic fields
          name: autoFilledData?.name || prev.name,
          description: autoFilledData?.description || prev.description,
          brand: autoFilledData?.brand || prev.brand,
          ingredients: autoFilledData?.ingredients || prev.ingredients,
          source: autoFilledData?.source || prev.source,
          manufacturer: autoFilledData?.manufacturer || prev.manufacturer,
          countryOfOrigin: autoFilledData?.countryOfOrigin || prev.countryOfOrigin,
          barcode: autoFilledData?.barcode || prev.barcode,
          weight: autoFilledData?.weight || prev.weight,
          nutriscoreGrade: autoFilledData?.nutriscoreGrade || prev.nutriscoreGrade,
          
          // Safely merge arrays
          allergens: Array.isArray(autoFilledData?.allergens) ? autoFilledData.allergens : prev.allergens,
          additives: Array.isArray(autoFilledData?.additives) ? autoFilledData.additives : prev.additives,
          tags: Array.isArray(autoFilledData?.tags) ? autoFilledData.tags : prev.tags,
          
          // Safely merge nutrition data
          nutriments: {
            calories: autoFilledData?.nutriments?.calories ?? prev.nutriments?.calories ?? 0,
            proteins: autoFilledData?.nutriments?.proteins ?? prev.nutriments?.proteins ?? 0,
            fats: {
              total: autoFilledData?.nutriments?.fats?.total ?? prev.nutriments?.fats?.total ?? 0,
              saturated: autoFilledData?.nutriments?.fats?.saturated ?? prev.nutriments?.fats?.saturated ?? 0,
              unsaturated: autoFilledData?.nutriments?.fats?.unsaturated ?? prev.nutriments?.fats?.unsaturated ?? 0,
            },
            carbohydrates: {
              total: autoFilledData?.nutriments?.carbohydrates?.total ?? prev.nutriments?.carbohydrates?.total ?? 0,
              sugar: autoFilledData?.nutriments?.carbohydrates?.sugar ?? prev.nutriments?.carbohydrates?.sugar ?? 0,
            },
            salt: autoFilledData?.nutriments?.salt ?? prev.nutriments?.salt ?? 0,
            fiber: autoFilledData?.nutriments?.fiber ?? prev.nutriments?.fiber ?? 0,
          },
          
          // Set main image from first scan image if no main image exists
          imageUrl: prev.imageUrl || aiScanImages[0] || '',
          additionalImages: aiScanImages.slice(1),
        };
        
        console.log('✅ Applied analysis results successfully');
        return newData;
      });
    } catch (error) {
      console.error('❌ Error applying analysis results:', error);
    }
  };

  const handleBarcodeScanned = async (barcode: string) => {
    setFormData(prev => ({ ...prev, barcode }));
    setShowBarcodeScanner(false);
    
    setIsFetchingProductData(true);
    try {
      const productData = await OpenFoodFactsAPI.getProductByBarcode(barcode);
      
      if (productData) {
        Alert.alert(
          t('productFound'),
          `${t('nameLabel')}${productData.name}\n${t('brandLabel')}${productData.brand || t('notSpecified')}`,
          [
            {
              text: t('fillAutomatically'),
              onPress: () => {
                setFormData(prev => ({
                  ...prev,
                  name: productData.name || prev.name,
                  brand: productData.brand || prev.brand,
                  ingredients: productData.ingredients || prev.ingredients,
                  imageUrl: productData.imageUrl || prev.imageUrl,
                  nutriments: {
                    calories: productData.nutriments?.calories || prev.nutriments.calories,
                    proteins: productData.nutriments?.proteins || prev.nutriments.proteins,
                    fats: {
                      total: productData.nutriments?.fats?.total || prev.nutriments.fats.total,
                      saturated: productData.nutriments?.fats?.saturated || prev.nutriments.fats.saturated,
                      unsaturated: productData.nutriments?.fats?.unsaturated || prev.nutriments.fats.unsaturated,
                    },
                    carbohydrates: {
                      total: productData.nutriments?.carbohydrates?.total || prev.nutriments.carbohydrates.total,
                      sugar: productData.nutriments?.carbohydrates?.sugar || prev.nutriments.carbohydrates.sugar,
                    },
                    salt: productData.nutriments?.salt || prev.nutriments.salt,
                    fiber: productData.nutriments?.fiber || prev.nutriments.fiber,
                  },
                  nutriscoreGrade: productData.nutriscoreGrade || prev.nutriscoreGrade,
                  allergens: productData.allergens || prev.allergens,
                  additives: productData.additives || prev.additives,
                }));
              }
            },
            { text: t('leaveAsIs'), style: 'cancel' }
          ]
        );
      } else {
        Alert.alert(t('error'), t('productNotFoundInfo'));
      }
    } catch (error) {
      Alert.alert(t('errorAuth'), t('failedToFindProduct'));
    } finally {
      setIsFetchingProductData(false);
    }
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      Alert.alert(t('errorAuth'), t('authenticationRequiredForSubmit'));
      return;
    }

    if (!formData.name.trim()) {
      Alert.alert(t('errorAuth'), t('enterProductName'));
      return;
    }

    setIsSubmitting(true);
    try {
      await addProduct({
        name: formData.name,
        brand: formData.brand,
        description: formData.description,
        imageUrl: formData.imageUrl,
        allergens: formData.allergens,
        additives: formData.additives,
        tags: formData.tags,
        nutriscoreGrade: formData.nutriscoreGrade,
        nutriments: formData.nutriments,
        ingredients: formData.ingredients,
        weight: formData.weight,
        createdBy: 'admin'
      }, currentUser.userId);

      Alert.alert('Успіх', 'Продукт додано до бази даних');
      resetForm();
      onProductAdded();
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Помилка', 'Не вдалося додати продукт');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Product Image Functions
  const takeProductPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('permissionRequired'), t('cameraPermissionNeeded'));
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        exif: false,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setFormData(prev => ({ ...prev, imageUrl: imageUri }));
      }
    } catch (error) {
      Alert.alert(t('error'), t('imageSelectionErrorOccurred'));
    }
  };

  const pickProductImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('permissionRequired'), t('galleryPermissionNeeded'));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        exif: false,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setFormData(prev => ({ ...prev, imageUrl: imageUri }));
      }
    } catch (error) {
      Alert.alert(t('error'), t('imageSelectionErrorOccurred'));
    }
  };

  const addAdditionalImage = async () => {
    if (formData.additionalImages.length >= 4) {
      Alert.alert('Увага', 'Максимум 4 додаткових зображення');
      return;
    }

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('permissionRequired'), t('galleryPermissionNeeded'));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
        exif: false,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setFormData(prev => ({
          ...prev,
          additionalImages: [...prev.additionalImages, imageUri]
        }));
      }
    } catch (error) {
      Alert.alert(t('error'), t('imageSelectionErrorOccurred'));
    }
  };

  const removeAdditionalImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }));
  };

  const handleNutriScoreChange = (grade: 'A' | 'B' | 'C' | 'D' | 'E', score: number) => {
    setAutoCalculatedGrade(grade);
    if (useAutoGrade) {
      setFormData(prev => ({ ...prev, nutriscoreGrade: grade }));
    }
  };

  if (!visible) return null;

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Додати продукт (Адмін)</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors.text.onPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.stepContainer}>
            
            {/* AI Scanner Section */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>🤖 AI Сканер продукту</Text>
              
              {aiScanImages.length === 0 ? (
                <View style={styles.emptyImageContainer}>
                  <Ionicons name="scan" size={48} color={Colors.primary} />
                  <Text style={styles.emptyImageText}>Додайте фото продукту</Text>
                  <Text style={styles.emptyImageSubtext}>
                    AI автоматично визначить назву, склад, поживні речовини та Nutri-Score
                  </Text>
                  
                  <View style={styles.scanActions}>
                    <TouchableOpacity style={styles.scanButton} onPress={takeScanPhoto}>
                      <Ionicons name="camera" size={20} color={Colors.text.onPrimary} />
                      <Text style={styles.scanButtonText}>Камера</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={[styles.scanButton, styles.scanButtonSecondary]} onPress={pickScanImage}>
                      <Ionicons name="image" size={20} color={Colors.primary} />
                      <Text style={styles.scanButtonSecondaryText}>Галерея</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View>
                  <ScrollView horizontal style={styles.imageScroll} showsHorizontalScrollIndicator={false}>
                    {aiScanImages.map((uri, index) => (
                      <View key={index} style={styles.scanImageContainer}>
                        <Image source={{ uri }} style={styles.scanImage} />
                        <Text style={styles.imageNumber}>{index + 1}</Text>
                        <TouchableOpacity
                          style={styles.removeImageButton}
                          onPress={() => removeScanImage(index)}
                        >
                          <Ionicons name="close-circle" size={24} color={Colors.error} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                  
                  <View style={styles.scanActions}>
                    {aiScanImages.length < 3 && (
                      <>
                        <TouchableOpacity style={styles.scanButton} onPress={takeScanPhoto}>
                          <Ionicons name="camera" size={20} color={Colors.text.onPrimary} />
                          <Text style={styles.scanButtonText}>Ще фото</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={[styles.scanButton, styles.scanButtonSecondary]} onPress={pickScanImage}>
                          <Ionicons name="image" size={20} color={Colors.primary} />
                          <Text style={styles.scanButtonSecondaryText}>Галерея</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>

                  {!isAnalyzing && !analysisResult && (
                    <TouchableOpacity style={styles.analyzeButton} onPress={startAiAnalysis}>
                      <MaterialIcons name="psychology" size={24} color={Colors.text.onPrimary} />
                      <Text style={styles.analyzeButtonText}>Аналізувати з AI</Text>
                    </TouchableOpacity>
                  )}

                  {isAnalyzing && (
                    <View style={styles.analyzingContainer}>
                      <ActivityIndicator size="large" color={Colors.primary} />
                      <Text style={styles.analyzingText}>{analysisStep}</Text>
                      <Text style={styles.analyzingSubtext}>Це може зайняти до 30 секунд</Text>
                    </View>
                  )}

                  {analysisResult && (
                    <View style={styles.analysisDetails}>
                      <View style={styles.analysisHeader}>
                        <Text style={styles.analysisTitle}>🎯 Результат аналізу</Text>
                        <TouchableOpacity onPress={() => setShowAnalysisDetails(!showAnalysisDetails)}>
                          <Ionicons 
                            name={showAnalysisDetails ? "chevron-up" : "chevron-down"} 
                            size={24} 
                            color={Colors.primary} 
                          />
                        </TouchableOpacity>
                      </View>
                      
                      {showAnalysisDetails && (
                        <View style={styles.analysisContent}>
                          <View style={styles.confidenceSection}>
                            <Text style={styles.confidenceLabel}>Точність розпізнавання:</Text>
                            <View style={styles.confidenceBar}>
                              <View 
                                style={[
                                  styles.confidenceFill, 
                                  { width: `${(analysisResult.confidence || 0.8) * 100}%` }
                                ]} 
                              />
                            </View>
                            <Text style={styles.confidenceText}>
                              {Math.round((analysisResult.confidence || 0.8) * 100)}%
                            </Text>
                          </View>

                          {analysisResult.brand && (
                            <View style={styles.foundItem}>
                              <Text style={styles.foundLabel}>Знайдений бренд:</Text>
                              <Text style={styles.foundValue}>{analysisResult.brand}</Text>
                            </View>
                          )}

                          {analysisResult.name && (
                            <View style={styles.foundItem}>
                              <Text style={styles.foundLabel}>Знайдена назва:</Text>
                              <Text style={styles.foundValue}>{analysisResult.name}</Text>
                            </View>
                          )}

                          <TouchableOpacity style={styles.reAnalyzeButton} onPress={startAiAnalysis}>
                            <MaterialIcons name="refresh" size={20} color={Colors.primary} />
                            <Text style={styles.reAnalyzeButtonText}>Повторити аналіз</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Barcode Section */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>📊 Штрих-код</Text>
              
              {formData.barcode ? (
                <View style={styles.barcodeResult}>
                  <View style={styles.barcodeResultHeader}>
                    <Ionicons name="barcode" size={24} color={Colors.success} />
                    <Text style={styles.barcodeResultTitle}>Штрих-код знайдено</Text>
                  </View>
                  <Text style={styles.barcodeValue}>{formData.barcode}</Text>
                  <TouchableOpacity style={styles.rescanButton} onPress={() => setShowBarcodeScanner(true)}>
                    <Text style={styles.rescanButtonText}>Сканувати інший</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.barcodeEmpty}>
                  <Ionicons name="barcode-outline" size={48} color={Colors.primary} />
                  <Text style={styles.barcodeEmptyTitle}>Сканувати штрих-код</Text>
                  <Text style={styles.barcodeEmptySubtitle}>
                    Автоматично завантажить дані продукту з бази OpenFoodFacts
                  </Text>
                  
                  {/* Manual Input */}
                  <View style={styles.manualBarcodeContainer}>
                    <Text style={styles.inputLabel}>Ручний ввід штрих-коду</Text>
                    <View style={styles.barcodeInputRow}>
                      <TextInput
                        style={styles.barcodeInput}
                        value={manualBarcodeInput}
                        onChangeText={setManualBarcodeInput}
                        placeholder="Введіть 13-значний штрих-код"
                        placeholderTextColor={Colors.text.disabled}
                        keyboardType="numeric"
                        maxLength={13}
                      />
                      <TouchableOpacity 
                        style={[styles.confirmBarcodeButton, !manualBarcodeInput.trim() && styles.confirmBarcodeButtonDisabled]}
                        onPress={() => {
                          if (manualBarcodeInput.trim()) {
                            handleBarcodeScanned(manualBarcodeInput.trim());
                            setManualBarcodeInput('');
                          }
                        }}
                        disabled={!manualBarcodeInput.trim()}
                      >
                        <Ionicons name="checkmark" size={16} color={Colors.text.onPrimary} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.orDivider}>
                    <View style={styles.orLine} />
                    <Text style={styles.orText}>або</Text>
                    <View style={styles.orLine} />
                  </View>
                  
                  <TouchableOpacity style={styles.scanBarcodeButton} onPress={() => setShowBarcodeScanner(true)}>
                    <Ionicons name="scan" size={20} color={Colors.text.onPrimary} />
                    <Text style={styles.scanBarcodeButtonText}>Сканувати камерою</Text>
                  </TouchableOpacity>
                </View>
              )}

              {isFetchingProductData && (
                <View style={styles.analyzingContainer}>
                  <ActivityIndicator size="large" color={Colors.primary} />
                  <Text style={styles.analyzingText}>Завантаження даних продукту...</Text>
                </View>
              )}
            </View>

            {/* Product Images Section */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>📸 Зображення продукту</Text>
              
              {/* Main Product Image */}
              <View style={styles.imageGroup}>
                <Text style={styles.inputLabel}>Основне зображення *</Text>
                {formData.imageUrl ? (
                  <View style={styles.mainImageContainer}>
                    <Image source={{ uri: formData.imageUrl }} style={styles.mainImage} />
                    <View style={styles.imageActions}>
                      <TouchableOpacity style={styles.imageActionButton} onPress={takeProductPhoto}>
                        <Ionicons name="camera" size={16} color={Colors.text.onPrimary} />
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.imageActionButton, styles.imageActionSecondary]} onPress={pickProductImage}>
                        <Ionicons name="image" size={16} color={Colors.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.imageActionButton, styles.imageActionDanger]} 
                        onPress={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                      >
                        <Ionicons name="trash" size={16} color={Colors.text.onPrimary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.emptyMainImage}>
                    <Ionicons name="image-outline" size={48} color={Colors.text.disabled} />
                    <Text style={styles.emptyProductImageText}>Додайте основне фото</Text>
                    <View style={styles.imagePickerActions}>
                      <TouchableOpacity style={styles.imagePickerButton} onPress={takeProductPhoto}>
                        <Ionicons name="camera" size={20} color={Colors.text.onPrimary} />
                        <Text style={styles.imagePickerButtonText}>Камера</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.imagePickerButton, styles.imagePickerSecondary]} onPress={pickProductImage}>
                        <Ionicons name="image" size={20} color={Colors.primary} />
                        <Text style={styles.imagePickerSecondaryText}>Галерея</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>

              {/* Additional Images */}
              <View style={styles.imageGroup}>
                <Text style={styles.inputLabel}>Додаткові зображення (до 4)</Text>
                
                <ScrollView horizontal style={styles.additionalImagesScroll} showsHorizontalScrollIndicator={false}>
                  {formData.additionalImages.map((uri, index) => (
                    <View key={index} style={styles.additionalImageContainer}>
                      <Image source={{ uri }} style={styles.additionalImage} />
                      <TouchableOpacity
                        style={styles.removeAdditionalImageButton}
                        onPress={() => removeAdditionalImage(index)}
                      >
                        <Ionicons name="close-circle" size={20} color={Colors.error} />
                      </TouchableOpacity>
                    </View>
                  ))}
                  
                  {formData.additionalImages.length < 4 && (
                    <TouchableOpacity style={styles.addImageButton} onPress={addAdditionalImage}>
                      <Ionicons name="add" size={24} color={Colors.primary} />
                      <Text style={styles.addImageText}>Додати</Text>
                    </TouchableOpacity>
                  )}
                </ScrollView>
              </View>
            </View>

            {/* Product Details Form */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Основна інформація</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Назва продукту *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                  placeholder="Введіть назву продукту"
                  placeholderTextColor={Colors.text.disabled}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Бренд</Text>
                <TextInput
                  style={styles.input}
                  value={formData.brand}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, brand: text }))}
                  placeholder="Введіть назву бренду"
                  placeholderTextColor={Colors.text.disabled}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Опис</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.description}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                  placeholder="Короткий опис продукту"
                  placeholderTextColor={Colors.text.disabled}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Склад</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.ingredients}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, ingredients: text }))}
                  placeholder="Перелік інгредієнтів"
                  placeholderTextColor={Colors.text.disabled}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Вага (г)</Text>
                <TextInput
                  style={styles.input}
                  value={(formData.weight || 0).toString()}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, weight: parseInt(text) || 0 }))}
                  placeholder="Вага в грамах"
                  placeholderTextColor={Colors.text.disabled}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Nutri-Score */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>⭐ Nutri-Score</Text>
              
              <View style={styles.nutriScoreCalculationContainer}>
                {/* Auto-calculated Nutri-Score */}
                <View style={styles.autoNutriScoreContainer}>
                  <AutoNutriScore 
                    nutriments={formData.nutriments}
                    fruitsVegetablesNuts={fruitsVegetablesNuts}
                    onScoreChange={handleNutriScoreChange}
                    showDetails={true}
                  />
                </View>

                {/* Fruits/Vegetables/Nuts Percentage */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Фрукти, овочі, горіхи (%)</Text>
                  <TextInput
                    style={styles.input}
                    value={fruitsVegetablesNuts.toString()}
                    onChangeText={(text) => setFruitsVegetablesNuts(parseFloat(text) || 0)}
                    placeholder="0-100%"
                    placeholderTextColor={Colors.text.disabled}
                    keyboardType="numeric"
                  />
                  <Text style={styles.inputHint}>
                    Вкажіть відсоток фруктів, овочів та горіхів у складі продукту для точнішого розрахунку
                  </Text>
                </View>

                {/* Manual Override Option */}
                <View style={styles.gradeOverrideContainer}>
                  <View style={styles.overrideHeader}>
                    <Text style={styles.overrideTitle}>Ручне перевизначення</Text>
                    <TouchableOpacity
                      style={[styles.toggleButton, useAutoGrade && styles.toggleButtonActive]}
                      onPress={() => {
                        setUseAutoGrade(!useAutoGrade);
                        if (!useAutoGrade) {
                          setFormData(prev => ({ ...prev, nutriscoreGrade: autoCalculatedGrade }));
                        }
                      }}
                    >
                      <Text style={[styles.toggleButtonText, useAutoGrade && styles.toggleButtonTextActive]}>
                        {useAutoGrade ? 'Авто' : 'Ручне'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  {!useAutoGrade && (
                    <View style={styles.nutriScoreContainer}>
                      {['A', 'B', 'C', 'D', 'E'].map((grade) => (
                        <TouchableOpacity
                          key={grade}
                          style={[
                            styles.nutriScoreButton,
                            { backgroundColor: getGradeColor(grade as any) },
                            formData.nutriscoreGrade === grade && styles.nutriScoreButtonActive
                          ]}
                          onPress={() => setFormData(prev => ({ ...prev, nutriscoreGrade: grade as any }))}
                        >
                          <Text style={styles.nutriScoreButtonText}>{grade}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Nutritional Values */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Поживна цінність (на 100г)</Text>
              <Text style={styles.sectionSubtitle}>
                Вкажіть точні значення з етикетки продукту. Ці дані важливі для розрахунку Nutri-Score.
              </Text>
              
              <View style={styles.nutritionGrid}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Калорії</Text>
                  <TextInput
                    style={styles.nutritionInput}
                    value={(formData.nutriments?.calories || 0).toString()}
                    onChangeText={(text) => setFormData(prev => ({
                      ...prev,
                      nutriments: { ...prev.nutriments, calories: parseFloat(text) || 0 }
                    }))}
                    keyboardType="numeric"
                    placeholder="ккал"
                  />
                </View>

                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Білки</Text>
                  <TextInput
                    style={styles.nutritionInput}
                    value={(formData.nutriments?.proteins || 0).toString()}
                    onChangeText={(text) => setFormData(prev => ({
                      ...prev,
                      nutriments: { ...prev.nutriments, proteins: parseFloat(text) || 0 }
                    }))}
                    keyboardType="numeric"
                    placeholder="г"
                  />
                </View>

                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Жири</Text>
                  <TextInput
                    style={styles.nutritionInput}
                    value={(formData.nutriments?.fats?.total || 0).toString()}
                    onChangeText={(text) => setFormData(prev => ({
                      ...prev,
                      nutriments: { 
                        ...prev.nutriments, 
                        fats: { ...prev.nutriments.fats, total: parseFloat(text) || 0 }
                      }
                    }))}
                    keyboardType="numeric"
                    placeholder="г"
                  />
                </View>

                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Насичені жири</Text>
                  <TextInput
                    style={styles.nutritionInput}
                    value={(formData.nutriments?.fats?.saturated || 0).toString()}
                    onChangeText={(text) => setFormData(prev => ({
                      ...prev,
                      nutriments: { 
                        ...prev.nutriments, 
                        fats: { ...prev.nutriments.fats, saturated: parseFloat(text) || 0 }
                      }
                    }))}
                    keyboardType="numeric"
                    placeholder="г"
                  />
                </View>

                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Ненасичені жири</Text>
                  <TextInput
                    style={styles.nutritionInput}
                    value={(formData.nutriments?.fats?.unsaturated || 0).toString()}
                    onChangeText={(text) => setFormData(prev => ({
                      ...prev,
                      nutriments: { 
                        ...prev.nutriments, 
                        fats: { ...prev.nutriments.fats, unsaturated: parseFloat(text) || 0 }
                      }
                    }))}
                    keyboardType="numeric"
                    placeholder="г"
                  />
                </View>

                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Вуглеводи</Text>
                  <TextInput
                    style={styles.nutritionInput}
                    value={(formData.nutriments?.carbohydrates?.total || 0).toString()}
                    onChangeText={(text) => setFormData(prev => ({
                      ...prev,
                      nutriments: { 
                        ...prev.nutriments, 
                        carbohydrates: { ...prev.nutriments.carbohydrates, total: parseFloat(text) || 0 }
                      }
                    }))}
                    keyboardType="numeric"
                    placeholder="г"
                  />
                </View>

                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Цукор</Text>
                  <TextInput
                    style={styles.nutritionInput}
                    value={(formData.nutriments?.carbohydrates?.sugar || 0).toString()}
                    onChangeText={(text) => setFormData(prev => ({
                      ...prev,
                      nutriments: { 
                        ...prev.nutriments, 
                        carbohydrates: { ...prev.nutriments.carbohydrates, sugar: parseFloat(text) || 0 }
                      }
                    }))}
                    keyboardType="numeric"
                    placeholder="г"
                  />
                </View>

                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Клітковина</Text>
                  <TextInput
                    style={styles.nutritionInput}
                    value={(formData.nutriments?.fiber || 0).toString()}
                    onChangeText={(text) => setFormData(prev => ({
                      ...prev,
                      nutriments: { ...prev.nutriments, fiber: parseFloat(text) || 0 }
                    }))}
                    keyboardType="numeric"
                    placeholder="г"
                  />
                </View>

                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Сіль</Text>
                  <TextInput
                    style={styles.nutritionInput}
                    value={(formData.nutriments?.salt || 0).toString()}
                    onChangeText={(text) => setFormData(prev => ({
                      ...prev,
                      nutriments: { ...prev.nutriments, salt: parseFloat(text) || 0 }
                    }))}
                    keyboardType="numeric"
                    placeholder="г"
                  />
                </View>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={Colors.text.onPrimary} />
              ) : (
                <Ionicons name="checkmark-circle" size={24} color={Colors.text.onPrimary} />
              )}
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Додавання...' : 'Додати продукт'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <BarcodeScanner
          visible={showBarcodeScanner}
          onClose={() => setShowBarcodeScanner(false)}
          onBarcodeScanned={handleBarcodeScanned}
        />
      </View>
    </Modal>
  );
};

const getGradeColor = (grade: 'A' | 'B' | 'C' | 'D' | 'E') => {
  const colors = {
    A: '#00A651',
    B: '#85C441', 
    C: '#FED100',
    D: '#FF7F00',
    E: '#E63F00'
  };
  return colors[grade];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: Spacing.md,
    ...Shadows.medium,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.text.onPrimary,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    padding: Spacing.md,
  },
  formSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  sectionTitle: {
    ...Typography.h3,
    marginBottom: Spacing.md,
    color: Colors.primary,
  },
  sectionSubtitle: {
    ...Typography.caption,
    marginBottom: Spacing.md,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    ...Typography.caption,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
    color: Colors.text.primary,
  },
  input: {
    ...ComponentStyles.input,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  // AI Scan Styles
  emptyImageContainer: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.large,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.border.default,
    borderStyle: 'dashed',
  },
  emptyImageText: {
    ...Typography.h3,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptyImageSubtext: {
    ...Typography.caption,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.lg,
  },
  imageScroll: {
    marginBottom: Spacing.lg,
  },
  scanImageContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  scanImage: {
    width: 140,
    height: 140,
    borderRadius: BorderRadius.medium,
    backgroundColor: Colors.surfaceVariant,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: Colors.border.default,
  },
  imageNumber: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: Colors.primary,
    color: Colors.text.onPrimary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    ...Shadows.small,
  },
  scanActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  scanButton: {
    ...ComponentStyles.button.primary,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  scanButtonSecondary: {
    ...ComponentStyles.button.secondary,
  },
  scanButtonText: {
    ...Typography.body,
    color: Colors.text.onPrimary,
    fontWeight: 'bold',
  },
  scanButtonSecondaryText: {
    color: Colors.primary,
  },
  analyzeButton: {
    backgroundColor: Colors.success,
    borderRadius: BorderRadius.medium,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadows.medium,
  },
  analyzeButtonText: {
    ...Typography.body,
    color: Colors.text.onPrimary,
  },
  analyzingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  analyzingText: {
    ...Typography.body,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  analyzingSubtext: {
    ...Typography.caption,
  },
  analysisDetails: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  analysisTitle: {
    ...Typography.h3,
  },
  analysisContent: {
    padding: Spacing.md,
  },
  confidenceSection: {
    marginBottom: Spacing.md,
  },
  confidenceLabel: {
    ...Typography.caption,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  confidenceBar: {
    height: 20,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    marginBottom: Spacing.xs,
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 10,
  },
  confidenceText: {
    ...Typography.body,
  },
  foundItem: {
    marginBottom: Spacing.md,
  },
  foundLabel: {
    ...Typography.caption,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  foundValue: {
    ...Typography.body,
  },
  reAnalyzeButton: {
    ...ComponentStyles.button.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  reAnalyzeButtonText: {
    color: Colors.primary,
  },
  // Barcode Styles
  barcodeResult: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.large,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.small,
  },
  barcodeResultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  barcodeResultTitle: {
    ...Typography.h3,
  },
  barcodeValue: {
    ...Typography.body,
    fontFamily: 'monospace',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.small,
    marginBottom: Spacing.md,
  },
  rescanButton: {
    ...ComponentStyles.button.secondary,
  },
  rescanButtonText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  barcodeEmpty: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.large,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border.default,
    borderStyle: 'dashed',
  },
  barcodeEmptyTitle: {
    ...Typography.h3,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  barcodeEmptySubtitle: {
    ...Typography.caption,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 18,
  },
  scanBarcodeButton: {
    ...ComponentStyles.button.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  scanBarcodeButtonText: {
    ...Typography.body,
    color: Colors.text.onPrimary,
    fontWeight: 'bold',
  },
  // Nutri-Score Styles
  nutriScoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  nutriScoreButton: {
    flex: 1,
    height: 60,
    borderRadius: BorderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  nutriScoreButtonActive: {
    borderColor: Colors.text.primary,
    transform: [{ scale: 1.05 }],
  },
  nutriScoreButtonText: {
    ...Typography.h2,
    color: Colors.text.onPrimary,
    fontWeight: 'bold',
  },
  // Nutrition Styles
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  nutritionItem: {
    flex: 1,
    minWidth: '45%',
  },
  nutritionLabel: {
    ...Typography.caption,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
    color: Colors.text.primary,
  },
  nutritionInput: {
    ...ComponentStyles.input,
    textAlign: 'center',
  },
  // Manual Barcode Input Styles
  manualBarcodeContainer: {
    marginBottom: Spacing.lg,
  },
  barcodeInputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  barcodeInput: {
    ...ComponentStyles.input,
    flex: 1,
    fontFamily: 'monospace',
  },
  confirmBarcodeButton: {
    backgroundColor: Colors.success,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 50,
  },
  confirmBarcodeButtonDisabled: {
    backgroundColor: Colors.text.disabled,
    opacity: 0.6,
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border.default,
  },
  orText: {
    ...Typography.caption,
    marginHorizontal: Spacing.md,
    color: Colors.text.secondary,
  },
  // Product Images Styles
  imageGroup: {
    marginBottom: Spacing.lg,
  },
  mainImageContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  mainImage: {
    width: 200,
    height: 200,
    borderRadius: BorderRadius.large,
    backgroundColor: Colors.surfaceVariant,
    resizeMode: 'cover',
    marginBottom: Spacing.md,
  },
  imageActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  imageActionButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.small,
    padding: Spacing.sm,
  },
  imageActionSecondary: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  imageActionDanger: {
    backgroundColor: Colors.error,
  },
  emptyMainImage: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.large,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border.default,
    borderStyle: 'dashed',
  },
  emptyProductImageText: {
    ...Typography.body,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    color: Colors.text.secondary,
  },
  imagePickerActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  imagePickerButton: {
    ...ComponentStyles.button.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  imagePickerSecondary: {
    ...ComponentStyles.button.secondary,
  },
  imagePickerButtonText: {
    ...Typography.body,
    color: Colors.text.onPrimary,
  },
  imagePickerSecondaryText: {
    ...Typography.body,
    color: Colors.primary,
  },
  additionalImagesScroll: {
    flexDirection: 'row',
  },
  additionalImageContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  additionalImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.medium,
    backgroundColor: Colors.surfaceVariant,
    resizeMode: 'cover',
  },
  removeAdditionalImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    ...Shadows.small,
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.medium,
    backgroundColor: Colors.surfaceVariant,
    borderWidth: 2,
    borderColor: Colors.border.default,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    ...Typography.caption,
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  // Nutri-Score Calculation Styles
  nutriScoreCalculationContainer: {
    gap: Spacing.lg,
  },
  autoNutriScoreContainer: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
  },
  inputHint: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
    lineHeight: 16,
  },
  gradeOverrideContainer: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
  },
  overrideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  overrideTitle: {
    ...Typography.body,
    fontWeight: 'bold',
  },
  toggleButton: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.small,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  toggleButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  toggleButtonText: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  toggleButtonTextActive: {
    color: Colors.text.onPrimary,
  },
  // Submit Button
  submitButton: {
    ...ComponentStyles.button.primary,
    backgroundColor: Colors.success,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.text.disabled,
    opacity: 0.6,
  },
  submitButtonText: {
    ...Typography.body,
    color: Colors.text.onPrimary,
  },
});

export default AddProductModal;