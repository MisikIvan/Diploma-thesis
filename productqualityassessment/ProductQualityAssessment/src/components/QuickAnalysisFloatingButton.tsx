import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
  Alert,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Image,
  Vibration,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../utils/theme';
import { t } from '../utils/translations';
import * as ImagePicker from 'expo-image-picker';
import { analyzeProductImage, AnalyzedProductData } from '../api/smartProductAnalysis';
import { quickNutriScore, NutriScoreResult } from '../utils/nutriScore';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface QuickAnalysisFloatingButtonProps {
  onNavigateToDetailedForm?: (analysisData: AnalyzedProductData) => void;
}

interface EditableNutrition {
  calories: number;
  proteins: number;
  fats: number;
  saturatedFat: number;
  carbohydrates: number;
  sugar: number;
  salt: number;
  fiber: number;
}

const QuickAnalysisFloatingButton: React.FC<QuickAnalysisFloatingButtonProps> = ({ 
  onNavigateToDetailedForm 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzedProductData | null>(null);
  const [nutriScoreResult, setNutriScoreResult] = useState<NutriScoreResult | null>(null);
  const [editableNutrition, setEditableNutrition] = useState<EditableNutrition>({
    calories: 0,
    proteins: 0,
    fats: 0,
    saturatedFat: 0,
    carbohydrates: 0,
    sugar: 0,
    salt: 0,
    fiber: 0,
  });
  const [isEditingNutrition, setIsEditingNutrition] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const fabScale = useRef(new Animated.Value(1)).current;
  const subButtonsScale = useRef(new Animated.Value(0)).current;
  const subButtonsOpacity = useRef(new Animated.Value(0)).current;

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(fabScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fabScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const toggleFAB = () => {
    animatePress();
    setIsOpen(!isOpen);
    
    if (!isOpen) {
      // Відкриваємо під-кнопки
      Animated.parallel([
        Animated.spring(subButtonsScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(subButtonsOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Закриваємо під-кнопки
      Animated.parallel([
        Animated.spring(subButtonsScale, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(subButtonsOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const closeFAB = () => {
    if (isOpen) {
      setIsOpen(false);
      Animated.parallel([
        Animated.spring(subButtonsScale, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(subButtonsOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const requestCameraPermission = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Дозвіл на камеру',
          'Для сканування продуктів потрібен доступ до камери',
          [{ text: 'OK' }]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    }
  };

  const takePhoto = async () => {
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) return;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        closeFAB();
        setCapturedImage(result.assets[0].uri);
        analyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Помилка', 'Не вдалося зробити фото');
    }
  };

  const pickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        closeFAB();
        setCapturedImage(result.assets[0].uri);
        analyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Помилка', 'Не вдалося обрати зображення');
    }
  };

  const analyzeImage = async (imageUri: string) => {
    setIsAnalyzing(true);
    setShowAnalysisModal(true);
    Vibration.vibrate(50);

    try {
      const analysis = await analyzeProductImage(imageUri);
      setAnalysisResult(analysis);

      // Розраховуємо Nutri-Score з розпізнаних даних
      if (analysis.nutrition) {
        const nutrition = analysis.nutrition;
        setEditableNutrition({
          calories: nutrition.calories || 0,
          proteins: nutrition.proteins || 0,
          fats: nutrition.fats || 0,
          saturatedFat: nutrition.saturatedFat || 0,
          carbohydrates: nutrition.carbohydrates || 0,
          sugar: nutrition.sugar || 0,
          salt: nutrition.salt || 0,
          fiber: nutrition.fiber || 0,
        });

        const nutriScore = quickNutriScore(
          nutrition.calories || 0,
          nutrition.saturatedFat || 0,
          nutrition.sugar || 0,
          nutrition.salt || 0,
          nutrition.fiber || 0,
          nutrition.proteins || 0,
          0, 
          'general'
        );
        
        setNutriScoreResult(nutriScore);
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert('Помилка аналізу', 'Не вдалося проаналізувати зображення. Спробуйте ще раз.');
      setShowAnalysisModal(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateNutriScore = () => {
    const nutriScore = quickNutriScore(
      editableNutrition.calories,
      editableNutrition.saturatedFat,
      editableNutrition.sugar,
      editableNutrition.salt,
      editableNutrition.fiber,
      editableNutrition.proteins,
      0,
      'general'
    );
    setNutriScoreResult(nutriScore);
  };

  const handleNutritionEdit = (field: keyof EditableNutrition, value: string) => {
    const numValue = parseFloat(value) || 0;
    setEditableNutrition(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const saveNutritionChanges = () => {
    updateNutriScore();
    setIsEditingNutrition(false);
    Vibration.vibrate(50);
  };

  // Функція для очищення та форматування тегів
  const cleanTagName = (tag: string): string => {
    // Видаляємо префікси типів тегів
    const cleanedTag = tag
      .replace(/^(FOOD_TYPE|DIETARY|ALLERGEN|BRAND|ORIGIN|QUALITY|PREPARATION|OTHER):/i, '')
      .trim();
    
   
    return cleanedTag
      .replace(/-/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2') 
      .toLowerCase()
      .replace(/^\w/, c => c.toUpperCase());
  };

  const renderNutriScoreDisplay = () => {
    if (!nutriScoreResult) return null;

    const getGradeColor = (grade: string) => {
      const colors = {
        'A': '#00C851',
        'B': '#8BC34A',
        'C': '#ffbb33',
        'D': '#FF8800',
        'E': '#ff4444'
      };
      return colors[grade as keyof typeof colors] || '#666';
    };

    return (
      <View style={styles.nutriScoreContainer}>
        <Text style={styles.nutriScoreTitle}>Nutri-Score</Text>
        <View style={[styles.nutriScoreBadge, { backgroundColor: getGradeColor(nutriScoreResult.grade) }]}>
          <Text style={styles.nutriScoreGrade}>{nutriScoreResult.grade}</Text>
        </View>
        <Text style={styles.nutriScoreSubtitle}>
          Бал: {nutriScoreResult.score} ({nutriScoreResult.negativePoints - nutriScoreResult.positivePoints})
        </Text>
      </View>
    );
  };

  const renderAnalysisResults = () => {
    if (!analysisResult) return null;

    return (
      <ScrollView style={styles.analysisContent} showsVerticalScrollIndicator={false}>
        {capturedImage && (
          <View style={styles.imagePreviewContainer}>
            <Image source={capturedImage && capturedImage.trim() !== '' ? { uri: capturedImage } : require('../assets/logo.png')} style={styles.imagePreview} />
          </View>
        )}

        {renderNutriScoreDisplay()}

        {/* Назва та бренд */}
        {(analysisResult.name || analysisResult.brand) && (
          <View style={styles.productInfoSection}>
            {analysisResult.name && (
              <Text style={styles.productName}>{analysisResult.name}</Text>
            )}
            {analysisResult.brand && (
              <Text style={styles.productBrand}>{analysisResult.brand}</Text>
            )}
          </View>
        )}

        {/* Харчова цінність */}
        <View style={styles.nutritionSection}>
          <View style={styles.nutritionHeader}>
            <Text style={styles.sectionTitle}>Харчова цінність (на 100г)</Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setIsEditingNutrition(!isEditingNutrition)}
            >
              <Ionicons 
                name={isEditingNutrition ? "checkmark" : "pencil"} 
                size={20} 
                color={Colors.primary} 
              />
            </TouchableOpacity>
          </View>
          
          {isEditingNutrition ? (
            <View style={styles.nutritionEditForm}>
              {Object.entries(editableNutrition).map(([key, value]) => (
                <View key={key} style={styles.nutritionEditRow}>
                  <Text style={styles.nutritionLabel}>
                    {key === 'calories' ? 'Калорії (ккал)' :
                     key === 'proteins' ? 'Білки (г)' :
                     key === 'fats' ? 'Жири (г)' :
                     key === 'saturatedFat' ? 'Насичені жири (г)' :
                     key === 'carbohydrates' ? 'Вуглеводи (г)' :
                     key === 'sugar' ? 'Цукор (г)' :
                     key === 'salt' ? 'Сіль (г)' :
                     key === 'fiber' ? 'Клітковина (г)' : key
                    }:
                  </Text>
                  <TextInput
                    style={styles.nutritionInput}
                    value={value.toString()}
                    onChangeText={(text) => handleNutritionEdit(key as keyof EditableNutrition, text)}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                </View>
              ))}
              <TouchableOpacity style={styles.saveNutritionButton} onPress={saveNutritionChanges}>
                <Text style={styles.saveNutritionText}>Оновити Nutri-Score</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.nutritionDisplay}>
              {editableNutrition.calories > 0 && <Text style={styles.nutritionItem}>Калорії: {editableNutrition.calories} ккал</Text>}
              {editableNutrition.proteins > 0 && <Text style={styles.nutritionItem}>Білки: {editableNutrition.proteins} г</Text>}
              {editableNutrition.fats > 0 && <Text style={styles.nutritionItem}>Жири: {editableNutrition.fats} г</Text>}
              {editableNutrition.saturatedFat > 0 && <Text style={styles.nutritionItem}>Насичені жири: {editableNutrition.saturatedFat} г</Text>}
              {editableNutrition.carbohydrates > 0 && <Text style={styles.nutritionItem}>Вуглеводи: {editableNutrition.carbohydrates} г</Text>}
              {editableNutrition.sugar > 0 && <Text style={styles.nutritionItem}>Цукор: {editableNutrition.sugar} г</Text>}
              {editableNutrition.salt > 0 && <Text style={styles.nutritionItem}>Сіль: {editableNutrition.salt} г</Text>}
              {editableNutrition.fiber > 0 && <Text style={styles.nutritionItem}>Клітковина: {editableNutrition.fiber} г</Text>}
            </View>
          )}
        </View>

        {/* Алергени */}
        {analysisResult.allergens && analysisResult.allergens.length > 0 && (
          <View style={styles.allergensSection}>
            <Text style={styles.sectionTitle}>Алергени</Text>
            <View style={styles.tagContainer}>
              {analysisResult.allergens.map((allergen, index) => (
                <View key={index} style={styles.allergenTag}>
                  <Text style={styles.allergenText}>{cleanTagName(allergen)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Е-ки та добавки */}
        {analysisResult.additives && analysisResult.additives.length > 0 && (
          <View style={styles.additivesSection}>
            <Text style={styles.sectionTitle}>🧪 Харчові добавки (Е-ки)</Text>
            <View style={styles.tagContainer}>
              {analysisResult.additives.map((additive, index) => (
                <View key={index} style={styles.additiveTag}>
                  <Text style={styles.additiveText}>{cleanTagName(additive)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Інгредієнти */}
        {analysisResult.ingredients && (
          <View style={styles.ingredientsSection}>
            <Text style={styles.sectionTitle}>Склад</Text>
            <Text style={styles.ingredientsText}>{analysisResult.ingredients}</Text>
          </View>
        )}

        {/* Теги якості */}
        {analysisResult.tags && analysisResult.tags.length > 0 && (
          <View style={styles.tagsSection}>
            <Text style={styles.sectionTitle}>Характеристики</Text>
            <View style={styles.tagContainer}>
              {analysisResult.tags.map((tag, index) => (
                <View key={index} style={styles.qualityTag}>
                  <Text style={styles.qualityTagText}>{cleanTagName(tag)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <>
      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        {/* Sub-buttons */}
        {isOpen && (
          <>
            <Animated.View 
              style={[
                styles.subButton,
                styles.subButton1,
                {
                  transform: [{ scale: subButtonsScale }],
                  opacity: subButtonsOpacity,
                }
              ]}
            >
              <TouchableOpacity style={styles.subButtonTouch} onPress={takePhoto}>
                <Ionicons name="camera" size={24} color={Colors.text.onPrimary} />
              </TouchableOpacity>
            </Animated.View>

            <Animated.View 
              style={[
                styles.subButton,
                styles.subButton2,
                {
                  transform: [{ scale: subButtonsScale }],
                  opacity: subButtonsOpacity,
                }
              ]}
            >
              <TouchableOpacity style={styles.subButtonTouch} onPress={pickFromGallery}>
                <Ionicons name="images" size={24} color={Colors.text.onPrimary} />
              </TouchableOpacity>
            </Animated.View>
          </>
        )}

        {/* Main FAB */}
        <Animated.View style={[styles.fab, { transform: [{ scale: fabScale }] }]}>
          <TouchableOpacity style={styles.fabTouch} onPress={toggleFAB}>
            <Ionicons 
              name={isOpen ? "close" : "camera"} 
              size={28} 
              color={Colors.text.onPrimary} 
            />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Analysis Modal */}
      <Modal
        visible={showAnalysisModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAnalysisModal(false)}
      >
        <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Аналіз продукту</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowAnalysisModal(false)}
            >
              <Ionicons name="close" size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>

          {isAnalyzing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Аналізуємо продукт...</Text>
              <Text style={styles.loadingSubtext}>
                AI розпізнає склад, КБЖВ та оцінює якість
              </Text>
            </View>
          ) : (
            renderAnalysisResults()
          )}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: 115,
    right: 20,
    alignItems: 'center',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    ...Shadows.large,
  },
  fabTouch: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    marginBottom: 12,
    ...Shadows.medium,
  },
  subButton1: {
    // Camera button
  },
  subButton2: {
    // Gallery button
  },
  subButtonTouch: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
  },
  modalTitle: {
    ...Typography.h2,
    color: Colors.text.primary,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  loadingText: {
    ...Typography.h3,
    color: Colors.text.primary,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  loadingSubtext: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  analysisContent: {
    flex: 1,
    padding: Spacing.md,
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  imagePreview: {
    width: screenWidth * 0.9,
    height: 200,
    borderRadius: BorderRadius.large,
    resizeMode: 'cover',
  },
  nutriScoreContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: 'center',
    ...Shadows.medium,
  },
  nutriScoreTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  nutriScoreBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  nutriScoreGrade: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.onPrimary,
  },
  nutriScoreSubtitle: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  productInfoSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  productName: {
    ...Typography.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  productBrand: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  nutritionSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  nutritionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
  },
  editButton: {
    padding: Spacing.xs,
  },
  nutritionDisplay: {
    gap: Spacing.xs,
  },
  nutritionItem: {
    ...Typography.body,
    color: Colors.text.primary,
  },
  nutritionEditForm: {
    gap: Spacing.sm,
  },
  nutritionEditRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nutritionLabel: {
    ...Typography.body,
    color: Colors.text.primary,
    flex: 1,
  },
  nutritionInput: {
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: BorderRadius.small,
    padding: Spacing.sm,
    width: 80,
    textAlign: 'center',
    ...Typography.body,
  },
  saveNutritionButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  saveNutritionText: {
    ...Typography.body,
    color: Colors.text.onPrimary,
    fontWeight: 'bold',
  },
  allergensSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  additivesSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  ingredientsSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  ingredientsText: {
    ...Typography.body,
    color: Colors.text.primary,
    lineHeight: 22,
  },
  tagsSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  allergenTag: {
    backgroundColor: Colors.error,
    borderRadius: BorderRadius.small,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  allergenText: {
    ...Typography.small,
    color: Colors.text.onError,
    fontWeight: 'bold',
  },
  additiveTag: {
    backgroundColor: Colors.warning,
    borderRadius: BorderRadius.small,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  additiveText: {
    ...Typography.small,
    color: Colors.text.primary,
    fontWeight: 'bold',
  },
  qualityTag: {
    backgroundColor: Colors.info,
    borderRadius: BorderRadius.small,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  qualityTagText: {
    ...Typography.small,
    color: Colors.text.onPrimary,
  },
});

export default QuickAnalysisFloatingButton; 