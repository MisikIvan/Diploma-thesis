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
  ImageBackground,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ProductSubmission } from '../types';
import { t } from '../utils/translations';
import { useAppSelector } from '../redux/hooks';
import { PREDEFINED_TAGS, getTagDisplayName } from '../utils/helpers';
import BarcodeScanner from './BarcodeScanner';
import { OpenFoodFactsAPI } from '../api/openFoodFacts';
import AutoNutriScore from './AutoNutriScore';
import { Colors, Spacing, BorderRadius, Typography, ComponentStyles, Shadows } from '../utils/theme';
import { 
  analyzeProductImage, 
  AnalyzedProductData, 
  autoFillFormFromAnalysis,
  fallbackProductAnalysis
} from '../api/smartProductAnalysis';

interface ProductSubmissionFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (submission: Omit<ProductSubmission, 'submissionId' | 'submittedAt'>) => void;
}

type FormStep = 'ai-scan' | 'barcode' | 'manual' | 'review';

const ProductSubmissionForm: React.FC<ProductSubmissionFormProps> = ({
  visible,
  onClose,
  onSubmit,
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
      fats: { total: 0, saturated: 0 },
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
  const [manualBarcodeInput, setManualBarcodeInput] = useState('');

  const resetForm = () => {
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
        fats: { total: 0, saturated: 0 },
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
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // AI Scan Functions
  const takeScanPhoto = async () => {
    if (aiScanImages.length >= 3) {
      Alert.alert('⚠️ Ліміт фото', 'Максимум 3 фото для аналізу');
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
      Alert.alert('⚠️ Ліміт фото', 'Максимум 3 фото для аналізу');
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

  // Product Image Functions
  const addProductImage = async () => {
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
        quality: 0.9,
        exif: false,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        
        if (!formData.imageUrl) {
          setFormData(prev => ({ ...prev, imageUrl: imageUri }));
        } else {
          setProductImages(prev => [...prev, imageUri]);
        }
      }
    } catch (error) {
      Alert.alert(t('error'), t('imageSelectionErrorOccurred'));
    }
  };

  const removeProductImage = (index: number) => {
    if (index === -1) {
     
      setFormData(prev => ({ ...prev, imageUrl: '' }));
    } else {
      setProductImages(prev => {
        const newImages = [...prev];
        newImages.splice(index, 1);
        return newImages;
      });
    }
  };

  // AI Analysis
  const startAiAnalysis = async () => {
    if (aiScanImages.length === 0) {
      Alert.alert('⚠️ Увага', 'Будь ласка, додайте принаймні одне фото складу продукту');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStep('🔍 Аналіз зображень...');

    try {
   
      const analysisPromises = aiScanImages.map(imageUri => 
        analyzeProductImage(imageUri, {
          name: formData.name,
          barcode: formData.barcode,
        })
      );

      const results = await Promise.all(analysisPromises);
      
      // Combine results
      const combinedResult: AnalyzedProductData = {
        name: '',
        brand: '',
        ingredients: '',
        nutrition: undefined,
        allergens: [],
        additives: [],
        weight: undefined,
        confidence: 0,
      };

      let bestConfidence = 0;
      results.forEach(result => {
        if (result.confidence > bestConfidence) {
          bestConfidence = result.confidence;
        }
        
        if (result.name && !combinedResult.name) combinedResult.name = result.name;
        if (result.brand && !combinedResult.brand) combinedResult.brand = result.brand;
        if (result.ingredients && !combinedResult.ingredients) combinedResult.ingredients = result.ingredients;
        if (result.nutrition && !combinedResult.nutrition) combinedResult.nutrition = result.nutrition;
        if (result.allergens?.length && !combinedResult.allergens?.length) combinedResult.allergens = result.allergens;
        if (result.weight && !combinedResult.weight) combinedResult.weight = result.weight;
      });

      combinedResult.confidence = bestConfidence;
      setAnalysisResult(combinedResult);

      if (combinedResult.confidence > 0.3) {
        setAnalysisStep('📝 Заповнення форми...');
        const autoFilledData = autoFillFormFromAnalysis(combinedResult, formData);
        applyAnalysisResults(autoFilledData);
      } else {
        Alert.alert(
          'Низька точність аналізу',
          'Не вдалося впевнено розпізнати дані. Спробуйте зробити більш чітке фото етикетки.'
        );
      }

    } catch (error) {
      console.error('Analysis error:', error);
      
     
      setAnalysisStep('Спроба базового аналізу...');
      try {
        const fallbackResult = fallbackProductAnalysis('');
        if (fallbackResult.confidence > 0) {
          setAnalysisResult(fallbackResult);
          const autoFilledData = autoFillFormFromAnalysis(fallbackResult, formData);
          applyAnalysisResults(autoFilledData);
        } else {
          throw new Error('Fallback also failed');
        }
      } catch (fallbackError) {
        Alert.alert(
          'Помилка аналізу',
          'Не вдалося проаналізувати продукт. Перевірте підключення до інтернету.'
        );
      }
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const applyAnalysisResults = (autoFilledData: any) => {
    const validGrade = ['A', 'B', 'C', 'D', 'E'].includes(autoFilledData.nutriscoreGrade) 
      ? autoFilledData.nutriscoreGrade as 'A' | 'B' | 'C' | 'D' | 'E'
      : formData.nutriscoreGrade;
    
    setFormData(prev => ({
      ...prev,
      name: autoFilledData.name || prev.name,
      brand: autoFilledData.brand || prev.brand,
      ingredients: autoFilledData.ingredients || prev.ingredients,
      description: autoFilledData.description || prev.description,
      allergens: autoFilledData.allergens || prev.allergens,
      additives: autoFilledData.additives || prev.additives,
      tags: autoFilledData.tags || prev.tags,
      nutriscoreGrade: validGrade,
      nutriments: autoFilledData.nutriments ? {
        calories: autoFilledData.nutriments.calories || prev.nutriments.calories,
        proteins: autoFilledData.nutriments.proteins || prev.nutriments.proteins,
        fats: {
          total: autoFilledData.nutriments.fats?.total || prev.nutriments.fats.total,
          saturated: autoFilledData.nutriments.fats?.saturated || prev.nutriments.fats.saturated,
        },
        carbohydrates: {
          total: autoFilledData.nutriments.carbohydrates?.total || prev.nutriments.carbohydrates.total,
          sugar: autoFilledData.nutriments.carbohydrates?.sugar || prev.nutriments.carbohydrates.sugar,
        },
        salt: autoFilledData.nutriments.salt || prev.nutriments.salt,
        fiber: autoFilledData.nutriments.fiber || prev.nutriments.fiber,
      } : prev.nutriments,
      weight: autoFilledData.weight || prev.weight,
    }));
    
    setCurrentStep('manual');
    Alert.alert('🎉 Аналіз завершено!', 'Дані автоматично заповнені. Перевірте та відредагуйте за потреби.');
  };

  // Auto-save barcode input
  const handleManualBarcodeChange = async (text: string) => {
    setManualBarcodeInput(text);
    
    // Auto-save when the barcode is complete 
    if (text.length === 13 && /^\d{13}$/.test(text)) {
      await handleBarcodeScanned(text);
    }
  };

  const handleBarcodeScanned = async (barcode: string) => {
    setShowBarcodeScanner(false);
    
    if (!barcode || barcode.trim() === '') {
      Alert.alert('Помилка', 'Неправильний формат штрих-коду');
      return;
    }

    setIsFetchingProductData(true);
    
    try {
      const productData = await OpenFoodFactsAPI.getProductByBarcode(barcode);
      
      if (productData) {
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
            },
            carbohydrates: {
              total: productData.nutriments?.carbohydrates?.total || prev.nutriments.carbohydrates.total,
              sugar: productData.nutriments?.carbohydrates?.sugar || prev.nutriments.carbohydrates.sugar,
            },
            salt: productData.nutriments?.salt || prev.nutriments.salt,
            fiber: productData.nutriments?.fiber || prev.nutriments.fiber,
          },
        }));
        Alert.alert('Успіх', 'Дані продукту завантажено');
      } else {
        Alert.alert('Інформація', 'Продукт не знайдено в базі OpenFoodFacts');
      }
      
      setFormData(prev => ({ ...prev, barcode }));
      setManualBarcodeInput(barcode);
    } catch (error) {
      console.error('Error fetching product data:', error);
      Alert.alert('Помилка', 'Помилка завантаження даних продукту');
      setFormData(prev => ({ ...prev, barcode }));
      setManualBarcodeInput(barcode);
    } finally {
      setIsFetchingProductData(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      Alert.alert(t('error'), t('productNameRequired'));
      return;
    }

    if (!currentUser) {
      Alert.alert(t('error'), t('authenticationError'));
      return;
    }

    const submission = {
      userId: currentUser.userId,
      userDisplayName: currentUser.displayName,
      productData: { 
        ...formData,
        additionalImages: productImages,
      },
      submissionType: 'ADD_NEW' as const,
      status: 'pending' as const,
      adminComments: '',
    };

    onSubmit(submission);
    resetForm();
    Alert.alert('Успіх', 'Продукт успішно відправлено на модерацію!');
  };

  
  const renderStepIndicator = () => {
    const steps = [
      { 
        key: 'ai-scan', 
        icon: 'camera', 
        title: 'AI Сканування', 
        completed: analysisResult !== null 
      },
      { 
        key: 'barcode', 
        icon: 'barcode-outline', 
        title: 'Штрих-код', 
        completed: !!formData.barcode 
      },
      { 
        key: 'manual', 
        icon: 'create-outline', 
        title: 'Редагування', 
        completed: formData.name.trim().length > 0 
      },
      { 
        key: 'review', 
        icon: 'checkmark-circle-outline', 
        title: 'Перевірка', 
        completed: false 
      },
    ];

    const currentIndex = steps.findIndex(step => step.key === currentStep);

    return (
      <View style={styles.stepIndicator}>
        {steps.map((step, index) => {
          const isActive = currentStep === step.key;
          const isCompleted = step.completed;
          const isPast = index < currentIndex;
          const isAccessible = index <= currentIndex + 1; 

          return (
            <TouchableOpacity
              key={step.key}
              style={[
                styles.stepItem,
                isActive && styles.stepItemActive,
                isCompleted && styles.stepItemCompleted,
              ]}
              onPress={() => isAccessible ? setCurrentStep(step.key as FormStep) : null}
              disabled={!isAccessible}
            >
              <View style={[
                styles.stepIcon,
                isActive && styles.stepIconActive,
                isCompleted && styles.stepIconCompleted,
                isPast && styles.stepIconPast,
              ]}>
                <Ionicons 
                  name={isCompleted ? 'checkmark' : step.icon as any} 
                  size={20} 
                  color={
                    isCompleted || isActive ? Colors.text.onPrimary : 
                    isAccessible ? Colors.primary : Colors.text.disabled
                  } 
                />
              </View>
              <Text style={[
                styles.stepTitle,
                isActive && styles.stepTitleActive,
                isCompleted && styles.stepTitleCompleted,
                !isAccessible && styles.stepTitleDisabled,
              ]}>
                {step.title}
              </Text>
              
              {index < steps.length - 1 && (
                <View style={[
                  styles.stepLine,
                  (isCompleted || isPast) && styles.stepLineCompleted
                ]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  
  const renderAnalysisDetails = () => {
    if (!analysisResult) return null;

    return (
      <View style={styles.analysisDetails}>
        <View style={styles.analysisHeader}>
          <Text style={styles.analysisTitle}>Результати аналізу</Text>
          <TouchableOpacity onPress={() => setShowAnalysisDetails(!showAnalysisDetails)}>
            <Ionicons 
              name={showAnalysisDetails ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={Colors.primary} 
            />
          </TouchableOpacity>
        </View>

        {showAnalysisDetails && (
          <View style={styles.analysisContent}>
         
            <View style={styles.confidenceSection}>
              <Text style={styles.confidenceLabel}>Точність розпізнавання</Text>
              <View style={styles.confidenceBar}>
                <View style={[
                  styles.confidenceFill, 
                  { width: `${analysisResult.confidence * 100}%` }
                ]} />
              </View>
              <Text style={styles.confidenceText}>
                {Math.round(analysisResult.confidence * 100)}% - {
                  analysisResult.confidence > 0.8 ? 'Відмінно' :
                  analysisResult.confidence > 0.6 ? 'Добре' :
                  analysisResult.confidence > 0.4 ? 'Задовільно' : 'Погано'
                }
              </Text>
            </View>

       
            {analysisResult.name && (
              <View style={styles.foundItem}>
                <Text style={styles.foundLabel}>🏷️ Назва:</Text>
                <Text style={styles.foundValue}>{analysisResult.name}</Text>
              </View>
            )}

            {analysisResult.brand && (
              <View style={styles.foundItem}>
                <Text style={styles.foundLabel}>🏭 Бренд:</Text>
                <Text style={styles.foundValue}>{analysisResult.brand}</Text>
              </View>
            )}

            {analysisResult.nutrition && (
              <View style={styles.foundItem}>
                <Text style={styles.foundLabel}>🍎 Харчова цінність:</Text>
                <Text style={styles.foundValue}>
                  {analysisResult.nutrition.calories && `${analysisResult.nutrition.calories} ккал, `}
                  {analysisResult.nutrition.proteins && `${analysisResult.nutrition.proteins}г білків`}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  // Render AI Scan Step
  const renderAiScanStep = () => (
    <ScrollView style={styles.stepContainer} showsVerticalScrollIndicator={false}>
      {/* AI Banner */}
      <View style={styles.aiBanner}>
        <ImageBackground 
          source={require('../assets/AI-banner.png')} 
          style={styles.bannerBackground}
          imageStyle={styles.bannerImageStyle}
        >
          <View style={styles.bannerOverlay} />
          <View style={styles.bannerContent}>
            <View style={styles.bannerTextContainer}>
              <View style={styles.bannerTitleRow}>
                <MaterialIcons 
                  name="auto-awesome" 
                  size={20} 
                  color="#fff" 
                  style={styles.bannerTitleIcon}
                />
                <Text style={styles.bannerTitle}>Розумний аналіз продукту</Text>
              </View>
              <Text style={styles.bannerSubtitle}>
                Додайте до 3 фото складу та етикетки для автоматичного розпізнавання
              </Text>
              <View style={styles.bannerFeatureRow}>
                <MaterialIcons name="speed" size={12} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.bannerFeatureText}>Швидко</Text>
                <MaterialIcons name="high-quality" size={12} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.bannerFeatureText}>Точно</Text>
                <MaterialIcons name="psychology" size={12} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.bannerFeatureText}>Розумно</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.scanSection}>
        <Text style={styles.sectionTitle}>
          <MaterialIcons name="photo-camera" size={18} color={Colors.primary} />
          {' Фото для аналізу'}
        </Text>
        
        {aiScanImages.length === 0 ? (
          <View style={styles.emptyImageContainer}>
            <Ionicons name="scan" size={48} color={Colors.primary} />
            <Text style={styles.emptyImageText}>Додайте фото для аналізу</Text>
            <Text style={styles.emptyImageSubtext}>
              Рекомендуємо: склад, поживна цінність, загальний вигляд
            </Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
            {aiScanImages.map((uri, index) => (
              <View key={index} style={styles.scanImageContainer}>
                <Image source={uri && uri.trim() !== '' ? { uri } : require('../assets/logo.png')} style={styles.scanImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeScanImage(index)}
                >
                  <Ionicons name="close-circle" size={24} color={Colors.error} />
                </TouchableOpacity>
                <Text style={styles.imageNumber}>{index + 1}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        <View style={styles.scanActions}>
          <TouchableOpacity 
            style={[styles.scanButton, aiScanImages.length >= 3 && styles.scanButtonDisabled]} 
            onPress={takeScanPhoto}
            disabled={aiScanImages.length >= 3}
          >
            <Ionicons name="camera" size={24} color={Colors.text.onPrimary} />
            <Text style={styles.scanButtonText}>Зробити фото</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.scanButton, styles.scanButtonSecondary, aiScanImages.length >= 3 && styles.scanButtonDisabled]} 
            onPress={pickScanImage}
            disabled={aiScanImages.length >= 3}
          >
            <Ionicons name="images" size={24} color={Colors.primary} />
            <Text style={[styles.scanButtonText, styles.scanButtonSecondaryText]}>З галереї</Text>
          </TouchableOpacity>
        </View>
      </View>

      
      {aiScanImages.length > 0 && (
        <View style={styles.analysisSection}>
          {isAnalyzing ? (
            <View style={styles.analyzingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.analyzingText}>{analysisStep}</Text>
              <Text style={styles.analyzingSubtext}>
                Аналізуємо {aiScanImages.length} {aiScanImages.length === 1 ? 'зображення' : 'зображення'}...
              </Text>
            </View>
          ) : analysisResult ? (
            <View>
              {renderAnalysisDetails()}
              <TouchableOpacity style={styles.reAnalyzeButton} onPress={startAiAnalysis}>
                <Ionicons name="refresh" size={20} color={Colors.primary} />
                <Text style={styles.reAnalyzeButtonText}>Повторити аналіз</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.analyzeButton} onPress={startAiAnalysis}>
              <Ionicons name="flash" size={24} color={Colors.text.onPrimary} />
              <Text style={styles.analyzeButtonText}>
                <MaterialIcons name="science" size={18} color={Colors.text.onPrimary} />
                {' Розпочати аналіз'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

   
      <View style={styles.productImagesSection}>
        <Text style={styles.sectionTitle}>
          <MaterialIcons name="image" size={18} color={Colors.primary} />
          {' Зображення для публікації'}
        </Text>
        <Text style={styles.sectionSubtitle}>
          Оберіть красиві фото продукту для показу користувачам
        </Text>

        <View style={styles.productImagesContainer}>
          {formData.imageUrl && (
            <View style={styles.mainImageContainer}>
              <Image source={formData.imageUrl && formData.imageUrl.trim() !== '' ? { uri: formData.imageUrl } : require('../assets/logo.png')} style={styles.mainImage} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => removeProductImage(-1)}
              >
                <Ionicons name="close-circle" size={24} color={Colors.error} />
              </TouchableOpacity>
              <Text style={styles.mainImageLabel}>Головне фото</Text>
            </View>
          )}

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.additionalImagesScroll}>
            {productImages.map((uri, index) => (
              <View key={index} style={styles.additionalImageContainer}>
                <Image source={uri && uri.trim() !== '' ? { uri } : require('../assets/logo.png')} style={styles.additionalImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeProductImage(index)}
                >
                  <Ionicons name="close-circle" size={24} color={Colors.error} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.scanActions}>
          <TouchableOpacity 
            style={styles.scanButton} 
            onPress={async () => {
              try {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                  Alert.alert(t('permissionRequired'), t('cameraPermissionNeeded'));
                  return;
                }

                const result = await ImagePicker.launchCameraAsync({
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 0.9,
                  exif: false,
                  base64: false,
                });

                if (!result.canceled && result.assets[0]) {
                  const imageUri = result.assets[0].uri;
                  if (!formData.imageUrl) {
                    setFormData(prev => ({ ...prev, imageUrl: imageUri }));
                  } else {
                    setProductImages(prev => [...prev, imageUri]);
                  }
                }
              } catch (error) {
                Alert.alert(t('error'), t('imageSelectionErrorOccurred'));
              }
            }}
          >
            <Ionicons name="camera" size={24} color={Colors.text.onPrimary} />
            <Text style={styles.scanButtonText}>Зробити фото</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.scanButton, styles.scanButtonSecondary]} 
            onPress={addProductImage}
          >
            <Ionicons name="images" size={24} color={Colors.primary} />
            <Text style={[styles.scanButtonText, styles.scanButtonSecondaryText]}>З галереї</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // Render Barcode Step
  const renderBarcodeStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Ionicons name="barcode-outline" size={32} color={Colors.primary} />
        <Text style={styles.stepHeaderTitle}>
          <MaterialIcons name="qr-code" size={18} color={Colors.primary} />
          {' Штрих-код (обов\'язково)'}
        </Text>
        <Text style={styles.stepHeaderSubtitle}>
          Сканування або ручний ввід для перевірки в базі OpenFoodFacts
        </Text>
      </View>

      <View style={styles.barcodeContainer}>
        {formData.barcode ? (
          <View style={styles.barcodeResult}>
            <View style={styles.barcodeResultHeader}>
              <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
              <Text style={styles.barcodeResultTitle}>Штрих-код введено</Text>
            </View>
            <Text style={styles.barcodeValue}>{formData.barcode}</Text>
            <TouchableOpacity 
              style={styles.rescanButton}
              onPress={() => {
                setFormData(prev => ({ ...prev, barcode: '' }));
                setManualBarcodeInput('');
              }}
            >
              <Text style={styles.rescanButtonText}>Змінити штрих-код</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.barcodeEmpty}>
            <Ionicons name="barcode-outline" size={48} color={Colors.primary} />
            <Text style={styles.barcodeEmptyTitle}>Введіть штрих-код</Text>
            <Text style={styles.barcodeEmptySubtitle}>
              Для автозаповнення деяких полів з OpenFoodFacts
            </Text>
            
            {/* Manual Input */}
            <View style={styles.manualBarcodeSection}>
              <Text style={styles.inputLabel}>Ручний ввід штрих-коду *</Text>
              <TextInput
                style={styles.barcodeInput}
                value={manualBarcodeInput}
                onChangeText={handleManualBarcodeChange}
                placeholder="Введіть 13-значний штрих-код"
                placeholderTextColor={Colors.text.disabled}
                keyboardType="numeric"
                maxLength={13}
              />
              {isFetchingProductData && (
                <View style={styles.loadingIndicator}>
                  <ActivityIndicator size="small" color={Colors.primary} />
                  <Text style={styles.loadingText}>Перевіряємо в базі...</Text>
                </View>
              )}
            </View>

            <View style={styles.orDivider}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>або</Text>
              <View style={styles.orLine} />
            </View>
            
            <TouchableOpacity 
              style={styles.scanBarcodeButton}
              onPress={() => setShowBarcodeScanner(true)}
            >
              <Ionicons name="scan" size={20} color={Colors.text.onPrimary} />
              <Text style={styles.scanBarcodeButtonText}>Сканувати камерою</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  // Render Manual Step
  const renderManualStep = () => (
    <ScrollView style={styles.stepContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.stepHeader}>
        <Ionicons name="create-outline" size={32} color={Colors.primary} />
        <Text style={styles.stepHeaderTitle}>
          <MaterialIcons name="edit" size={18} color={Colors.primary} />
          {' Ручне редагування'}
        </Text>
        <Text style={styles.stepHeaderSubtitle}>
          Перевірте та доповніть інформацію про продукт
        </Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Основна інформація</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Назва продукту *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            placeholder="Введіть назву продукту"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Бренд</Text>
          <TextInput
            style={styles.input}
            value={formData.brand}
            onChangeText={(text) => setFormData(prev => ({ ...prev, brand: text }))}
            placeholder="Назва бренду"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Вага (г)</Text>
          <TextInput
            style={styles.input}
            value={formData.weight.toString()}
            onChangeText={(text) => setFormData(prev => ({ ...prev, weight: parseFloat(text) || 0 }))}
            placeholder="Вага продукту в грамах"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Опис</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
            placeholder="Опис продукту"
            multiline
            numberOfLines={3}
          />
        </View>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Склад та інгредієнти</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Склад</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.ingredients}
            onChangeText={(text) => setFormData(prev => ({ ...prev, ingredients: text }))}
            placeholder="Список інгредієнтів"
            multiline
            numberOfLines={4}
          />
        </View>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>
          <MaterialIcons name="restaurant" size={18} color={Colors.primary} />
          {' Харчова цінність (на 100г)'}
        </Text>
        <Text style={styles.sectionSubtitle}>
          Заповніть дані для автоматичного розрахунку Nutri-Score
        </Text>
        
        <View style={styles.nutritionGrid}>
          <View style={styles.nutritionRow}>
            <View style={styles.nutritionItem}>
              <Text style={styles.inputLabel}>Калорії (ккал)</Text>
              <TextInput
                style={styles.input}
                value={formData.nutriments.calories.toString()}
                onChangeText={(text) => setFormData(prev => ({ 
                  ...prev, 
                  nutriments: { ...prev.nutriments, calories: parseFloat(text) || 0 }
                }))}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.nutritionItem}>
              <Text style={styles.inputLabel}>Білки (г)</Text>
              <TextInput
                style={styles.input}
                value={formData.nutriments.proteins.toString()}
                onChangeText={(text) => setFormData(prev => ({ 
                  ...prev, 
                  nutriments: { ...prev.nutriments, proteins: parseFloat(text) || 0 }
                }))}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.nutritionRow}>
            <View style={styles.nutritionItem}>
              <Text style={styles.inputLabel}>Жири (г)</Text>
              <TextInput
                style={styles.input}
                value={formData.nutriments.fats.total.toString()}
                onChangeText={(text) => setFormData(prev => ({ 
                  ...prev, 
                  nutriments: { 
                    ...prev.nutriments, 
                    fats: { ...prev.nutriments.fats, total: parseFloat(text) || 0 }
                  }
                }))}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.nutritionItem}>
              <Text style={styles.inputLabel}>Насичені жири (г)</Text>
              <TextInput
                style={styles.input}
                value={formData.nutriments.fats.saturated.toString()}
                onChangeText={(text) => setFormData(prev => ({ 
                  ...prev, 
                  nutriments: { 
                    ...prev.nutriments, 
                    fats: { ...prev.nutriments.fats, saturated: parseFloat(text) || 0 }
                  }
                }))}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.nutritionRow}>
            <View style={styles.nutritionItem}>
              <Text style={styles.inputLabel}>Вуглеводи (г)</Text>
              <TextInput
                style={styles.input}
                value={formData.nutriments.carbohydrates.total.toString()}
                onChangeText={(text) => setFormData(prev => ({ 
                  ...prev, 
                  nutriments: { 
                    ...prev.nutriments, 
                    carbohydrates: { ...prev.nutriments.carbohydrates, total: parseFloat(text) || 0 }
                  }
                }))}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.nutritionItem}>
              <Text style={styles.inputLabel}>Цукор (г)</Text>
              <TextInput
                style={styles.input}
                value={formData.nutriments.carbohydrates.sugar.toString()}
                onChangeText={(text) => setFormData(prev => ({ 
                  ...prev, 
                  nutriments: { 
                    ...prev.nutriments, 
                    carbohydrates: { ...prev.nutriments.carbohydrates, sugar: parseFloat(text) || 0 }
                  }
                }))}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.nutritionRow}>
            <View style={styles.nutritionItem}>
              <Text style={styles.inputLabel}>Сіль (г)</Text>
              <TextInput
                style={styles.input}
                value={formData.nutriments.salt.toString()}
                onChangeText={(text) => setFormData(prev => ({ 
                  ...prev, 
                  nutriments: { ...prev.nutriments, salt: parseFloat(text) || 0 }
                }))}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.nutritionItem}>
              <Text style={styles.inputLabel}>Клітковина (г)</Text>
              <TextInput
                style={styles.input}
                value={formData.nutriments.fiber.toString()}
                onChangeText={(text) => setFormData(prev => ({ 
                  ...prev, 
                  nutriments: { ...prev.nutriments, fiber: parseFloat(text) || 0 }
                }))}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>📊 Nutri-Score</Text>
        <Text style={styles.sectionSubtitle}>
          Автоматично розраховується на основі харчових даних
        </Text>
        
        {/* Nutri-Score Display */}
        <View style={styles.nutriScoreContainer}>
          <AutoNutriScore
            nutriments={formData.nutriments}
            onScoreChange={(grade: 'A' | 'B' | 'C' | 'D' | 'E', score: number) => {
              setFormData(prev => ({ ...prev, nutriscoreGrade: grade }));
            }}
            fruitsVegetablesNuts={fruitsVegetablesNuts}
            showDetails={true}
          />
        </View>
      </View>
    </ScrollView>
  );

  // Render Review Step
  const renderReviewStep = () => (
    <ScrollView style={styles.stepContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.stepHeader}>
        <Ionicons name="checkmark-circle-outline" size={32} color={Colors.primary} />
        <Text style={styles.stepHeaderTitle}>✅ Перевірка та відправка</Text>
        <Text style={styles.stepHeaderSubtitle}>
          Перевірте всі дані перед відправкою на модерацію
        </Text>
      </View>

      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>Назва продукту</Text>
        <Text style={styles.reviewSectionValue}>{formData.name || 'Не вказано'}</Text>
      </View>

      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>Бренд</Text>
        <Text style={styles.reviewSectionValue}>{formData.brand || 'Не вказано'}</Text>
      </View>

      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>Nutri-Score</Text>
        <View style={styles.nutriScoreDisplay}>
          <View style={[styles.nutriScoreBadge, { backgroundColor: Colors.nutriScore[formData.nutriscoreGrade] }]}>
            <Text style={styles.nutriScoreBadgeText}>{formData.nutriscoreGrade}</Text>
          </View>
        </View>
      </View>

      {formData.ingredients && (
        <View style={styles.reviewSection}>
          <Text style={styles.reviewSectionTitle}>Склад</Text>
          <Text style={styles.reviewSectionValue}>{formData.ingredients}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <MaterialIcons name="send" size={24} color={Colors.text.onPrimary} />
        <Text style={styles.submitButtonText}>Відправити на модерацію</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'ai-scan': return renderAiScanStep();
      case 'barcode': return renderBarcodeStep();
      case 'manual': return renderManualStep();
      case 'review': return renderReviewStep();
      default: return renderAiScanStep();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors.text.onPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('addProduct')}</Text>
          <TouchableOpacity 
            onPress={() => {/* Help action */}} 
            style={styles.helpButton}
          >
            <Ionicons name="help-circle-outline" size={24} color={Colors.text.onPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderStepIndicator()}
          {renderCurrentStep()}
        </ScrollView>

     
        {currentStep !== 'review' && (
          <View style={styles.navigationContainer}>
            <TouchableOpacity 
              style={[styles.navButton, styles.navButtonSecondary]}
              onPress={() => {
                if (currentStep === 'manual') setCurrentStep('barcode');
                else if (currentStep === 'barcode') setCurrentStep('ai-scan');
              }}
              disabled={currentStep === 'ai-scan'}
            >
              <Ionicons name="chevron-back" size={20} color={Colors.text.secondary} />
              <Text style={styles.navButtonSecondaryText}>Назад</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.navButton, styles.navButtonPrimary]}
              onPress={() => {
                if (currentStep === 'ai-scan') setCurrentStep('barcode');
                else if (currentStep === 'barcode') setCurrentStep('manual');
                else if (currentStep === 'manual') setCurrentStep('review');
              }}
            >
              <Text style={styles.navButtonPrimaryText}>Далі</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.onPrimary} />
            </TouchableOpacity>
          </View>
        )}

      
        <BarcodeScanner
          visible={showBarcodeScanner}
          onClose={() => setShowBarcodeScanner(false)}
          onBarcodeScanned={handleBarcodeScanned}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.text.onPrimary,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  helpButton: {
    padding: Spacing.sm,
  },
  stepIndicator: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
  },
  stepItemActive: {
    transform: [{ scale: 1.05 }],
  },
  stepItemCompleted: {
    opacity: 0.7,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  stepIconActive: {
    backgroundColor: Colors.primary,
  },
  stepIconCompleted: {
    backgroundColor: Colors.success,
  },
  stepIconPast: {
    backgroundColor: Colors.primary,
    opacity: 0.5,
  },
  stepTitle: {
    ...Typography.caption,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
    marginTop: 4,
  },
  stepTitleActive: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  stepTitleCompleted: {
    color: Colors.success,
    fontWeight: '600',
  },
  stepTitleDisabled: {
    color: Colors.text.disabled,
  },
  stepLine: {
    position: 'absolute',
    top: 20,
    left: '50%',
    width: '100%',
    height: 2,
    backgroundColor: Colors.border.default,
    zIndex: -1,
  },
  stepLineCompleted: {
    backgroundColor: Colors.success,
  },
  content: {
    flex: 1,
    paddingBottom: 30,
  },
  stepContainer: {
    flex: 1,
    padding: Spacing.md,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    ...Shadows.small,
  },
  stepHeaderTitle: {
    ...Typography.h3,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  stepHeaderSubtitle: {
    ...Typography.caption,
    textAlign: 'center',
    lineHeight: 20,
  },
  // AI Scan Styles
  aiScanContainer: {
    flex: 1,
  },
  scanSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  emptyImageContainer: {
    backgroundColor: Colors.surface,
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
  scanButtonDisabled: {
    backgroundColor: Colors.text.disabled,
    opacity: 0.6,
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
  // Barcode Styles
  barcodeContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  barcodeResult: {
    backgroundColor: Colors.surface,
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
    backgroundColor: Colors.surfaceVariant,
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
    minHeight: 200,
    justifyContent: 'center',
  },
  barcodeEmptyTitle: {
    ...Typography.h3,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    color: Colors.text.primary,
  },
  barcodeEmptySubtitle: {
    ...Typography.caption,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 20,
    color: Colors.text.secondary,
    paddingHorizontal: Spacing.md,
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
  scanBarcodeButtonDisabled: {
    backgroundColor: Colors.text.disabled,
    opacity: 0.6,
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
  
  reviewSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  reviewSectionTitle: {
    ...Typography.caption,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
    color: Colors.primary,
  },
  reviewSectionValue: {
    ...Typography.body,
  },
  nutriScoreDisplay: {
    alignItems: 'flex-start',
  },
  nutriScoreBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nutriScoreBadgeText: {
    ...Typography.h2,
    color: Colors.text.onPrimary,
  },
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
  submitButtonText: {
    ...Typography.body,
    color: Colors.text.onPrimary,
  },
  // Analysis Styles
  analysisDetails: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.small,
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
    backgroundColor: Colors.surfaceVariant,
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
  // Analysis Section Styles
  analysisSection: {
    marginBottom: Spacing.md,
  },
  analyzingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzingText: {
    ...Typography.body,
    marginBottom: Spacing.md,
  },
  analyzingSubtext: {
    ...Typography.caption,
  },
  reAnalyzeButton: {
    ...ComponentStyles.button.secondary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  reAnalyzeButtonText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  
  productImagesSection: {
    marginBottom: Spacing.md,
  },
  sectionSubtitle: {
    ...Typography.caption,
    marginBottom: Spacing.md,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  productImagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainImageContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  mainImage: {
    width: 140,
    height: 140,
    borderRadius: BorderRadius.medium,
    backgroundColor: Colors.surfaceVariant,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: Colors.border.default,
  },
  mainImageLabel: {
    ...Typography.caption,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.xs,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: Colors.text.onPrimary,
    textAlign: 'center',
    borderBottomLeftRadius: BorderRadius.medium,
    borderBottomRightRadius: BorderRadius.medium,
  },
  addMainImageButton: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    marginRight: Spacing.md,
    width: 120,
  },
  addImageIconContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.medium,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  additionalImagesScroll: {
    marginBottom: Spacing.md,
  },
  additionalImageContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  additionalImage: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.medium,
    backgroundColor: Colors.surfaceVariant,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  addAdditionalImageButton: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.medium,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  nutritionGrid: {
    gap: Spacing.md,
  },
  nutritionRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  nutritionItem: {
    flex: 1,
  },
  // Navigation Styles
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border.default,
    gap: Spacing.md,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.medium,
    gap: Spacing.xs,
    minHeight: 48,
  },
  navButtonPrimary: {
    backgroundColor: Colors.primary,
    ...Shadows.small,
  },
  navButtonSecondary: {
    backgroundColor: Colors.surfaceVariant,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  navButtonPrimaryText: {
    ...Typography.body,
    color: Colors.text.onPrimary,
    fontWeight: '600',
  },
  navButtonSecondaryText: {
    ...Typography.body,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  
  nutriScoreContainer: {
    marginBottom: Spacing.md,
  },
  aiBanner: {
    height: 150,
    marginBottom: Spacing.md,
  },
  bannerBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImageStyle: {
    borderRadius: BorderRadius.large,
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: BorderRadius.large,
  },
  bannerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  bannerTitleIcon: {
    marginRight: Spacing.sm,
  },
  bannerTitle: {
    ...Typography.h3,
    color: Colors.text.onPrimary,
  },
  bannerSubtitle: {
    ...Typography.caption,
    color: Colors.text.onPrimary,
    textAlign: 'center',
  },
  bannerFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  bannerFeatureText: {
    ...Typography.caption,
    color: Colors.text.onPrimary,
    marginHorizontal: Spacing.xs,
  },
  bannerIconContainer: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.medium,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerIconBackground: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.medium,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  manualBarcodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  barcodeInput: {
    ...ComponentStyles.input,
    flex: 1,
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border.default,
  },
  orText: {
    ...Typography.caption,
    marginHorizontal: Spacing.md,
  },
  productImageAddButton: {
    width: 140,
    height: 60,
    marginRight: Spacing.md,
    marginBottom: Spacing.md,
  },
  additionalImageAddButton: {
    width: 100,
    height: 60,
    marginRight: Spacing.md,
  },
  manualBarcodeSection: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  loadingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  loadingText: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
});

export default ProductSubmissionForm; 