import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { useAppSelector } from '../redux/hooks';
import { updateProduct, getProduct } from '../api/firebase';
import { Product, NutriScoreGrade } from '../types/index';
import { RootStackParamList } from '../types/navigation';
import { t } from '../utils/translations';
import { PREDEFINED_TAGS, getTagDisplayName } from '../utils/helpers';
import ImageUploader from '../components/ImageUploader';
import { autoFillFormFromAnalysis } from '../api/smartProductAnalysis';
import { quickNutriScore, determineFoodCategory } from '../utils/nutriScore';

type EditProductScreenProps = StackScreenProps<RootStackParamList, 'EditProduct'>;

const EditProductScreen: React.FC<EditProductScreenProps> = ({ navigation, route }) => {
  const { productId, prefilledData } = route.params;
  const currentUser = useAppSelector(state => state.user.currentUser);
  const isCreating = productId === 'new';
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [calculatedNutriScore, setCalculatedNutriScore] = useState<NutriScoreGrade | null>(null);
  const [isManualNutriScore, setIsManualNutriScore] = useState(false);
  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    imageUrl: '',
    nutriscoreGrade: 'C' as NutriScoreGrade,
    ingredients: '',
    allergens: [],
    additives: [],
    nutriments: {
      calories: 0,
      proteins: 0,
      fats: { 
        total: 0, 
        saturated: 0 
      },
      carbohydrates: { 
        total: 0, 
        sugar: 0 
      },
      salt: 0,
      fiber: 0
    },
    tags: [],
    weight: 0,
    barcode: ''
  });

  const getNutriScoreColor = (grade: string) => {
    switch (grade) {
      case 'A': return '#00C851';
      case 'B': return '#8BC34A';
      case 'C': return '#FFC107';
      case 'D': return '#FF9800';
      case 'E': return '#F44336';
      default: return '#34572a';
    }
  };

  // Функція для правильної обробки десяткових чисел
  const parseNumericValue = (text: string): number => {
    if (!text || text.trim() === '') return 0;
    
    // Заміна коми на крапку для підтримки європейського формату
    const normalizedText = text.replace(',', '.');
    
    // Перевірка на валідність числа
    const parsed = parseFloat(normalizedText);
    
    // Повертаємо 0 якщо число невалідне, інакше повертаємо значення з максимум 2 знаками після коми
    return isNaN(parsed) ? 0 : Math.round(parsed * 100) / 100;
  };

  // Функція для форматування відображення числа
  const formatDisplayValue = (value: number | undefined): string => {
    if (value === undefined || value === 0) return '';
    return value.toString();
  };

  // Функція автоматичного обчислення Nutri-Score
  const calculateNutriScoreAutomatically = () => {
    if (!product.nutriments) return null;

    const { nutriments } = product;
    
    // Перевіряємо, чи є достатньо даних для розрахунку
    if (
      nutriments.calories !== undefined &&
      nutriments.fats?.total !== undefined &&
      nutriments.carbohydrates?.total !== undefined &&
      nutriments.salt !== undefined
    ) {
      try {
        const category = determineFoodCategory(
          product.name || '',
          product.ingredients || '',
          product.tags || []
        );

        const result = quickNutriScore(
          nutriments.calories,
          nutriments.fats?.saturated || 0,
          nutriments.carbohydrates?.sugar || 0,
          nutriments.salt,
          nutriments.fiber || 0,
          nutriments.proteins || 0,
          0, // fruitsVegetablesNuts - можна додати пізніше як окреме поле
          category
        );

        return result.grade;
      } catch (error) {
        console.warn('Error calculating Nutri-Score:', error);
        return null;
      }
    }
    
    return null;
  };

  // useEffect для автоматичного обчислення при зміні харчових значень
  useEffect(() => {
    if (!isManualNutriScore && product.nutriments) {
      const autoGrade = calculateNutriScoreAutomatically();
      setCalculatedNutriScore(autoGrade);
      
      // Автоматично встановлюємо розрахований Nutri-Score, якщо він не був вручну змінений
      if (autoGrade && !isManualNutriScore) {
        setProduct(prev => ({
          ...prev,
          nutriscoreGrade: autoGrade
        }));
      }
    }
  }, [
    product.nutriments?.calories,
    product.nutriments?.proteins,
    product.nutriments?.fats?.total,
    product.nutriments?.fats?.saturated,
    product.nutriments?.carbohydrates?.total,
    product.nutriments?.carbohydrates?.sugar,
    product.nutriments?.salt,
    product.nutriments?.fiber,
    product.name,
    product.ingredients,
    product.tags,
    isManualNutriScore
  ]);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      Alert.alert(
        t('accessDenied'),
        t('adminOnlyEdit'),
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      return;
    }
    
    if (isCreating) {
      if (prefilledData) {
        const autoFilledData = autoFillFormFromAnalysis(prefilledData, product);
        setProduct(autoFilledData);
      }
      setLoading(false);
    } else {
      loadProduct();
    }
  }, [productId, prefilledData]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await getProduct(productId);
      
      if (productData) {
        setProduct(productData);
      } else {
        Alert.alert(
          t('error'),
          t('productNotFound'),
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      console.error('Error loading product:', error);
      Alert.alert(
        t('error'),
        t('loadingProduct'),
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!product.name) {
      Alert.alert(t('error'), t('productNameRequired'));
      return;
    }

    // Валідація штрихкоду
    if (product.barcode && product.barcode.trim()) {
      const barcode = product.barcode.trim();
      if (!/^\d{8,14}$/.test(barcode)) {
        Alert.alert(
          'Помилка', 
          'Штрих-код повинен містити від 8 до 14 цифр'
        );
        return;
      }
    }

    if (!currentUser?.userId) {
      Alert.alert(t('error'), t('authenticationError'));
      return;
    }

    setSaving(true);
    
    try {
      await updateProduct(productId, {
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl || '',
        nutriscoreGrade: product.nutriscoreGrade || 'C',
        ingredients: product.ingredients || '',
        allergens: product.allergens || [],
        additives: product.additives || [],
        nutriments: product.nutriments || {
          calories: 0,
          proteins: 0,
          fats: { total: 0, saturated: 0 },
          carbohydrates: { total: 0, sugar: 0 },
          salt: 0
        },
        tags: product.tags || [],
        weight: product.weight || 0,
        barcode: product.barcode?.trim() || ''
      }, currentUser.userId);

      Alert.alert(
        t('success'),
        t('productUpdatedSuccessfully'),
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error updating product:', error);
      Alert.alert(t('error'), t('updateProductError'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#34572a" />
        <Text style={styles.loadingText}>{t('loadingProduct')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('editProduct')}</Text>
        
        <Text style={styles.inputLabel}>{t('productName')} *</Text>
        <TextInput
          style={styles.input}
          value={product.name}
          onChangeText={(text) => setProduct({...product, name: text})}
          placeholder={t('productName')}
        />
        
        <Text style={styles.inputLabel}>{t('productDescription')}</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={product.description}
          onChangeText={(text) => setProduct({...product, description: text})}
          placeholder={t('detailedProductDescription')}
          multiline
          numberOfLines={3}
        />
        
        <ImageUploader
          onImageUploaded={(imageUrl) => setProduct({...product, imageUrl})}
          currentImageUrl={product.imageUrl}
        />
        
        <Text style={styles.inputLabel}>{t('productImageUrl')} {t('alternativeImageUrl')}</Text>
        <TextInput
          style={styles.input}
          value={product.imageUrl}
          onChangeText={(text) => setProduct({...product, imageUrl: text})}
          placeholder={t('imageUrlPlaceholder')}
        />
        
        <Text style={styles.inputLabel}>{t('weight')} (г)</Text>
        <TextInput
          style={styles.input}
          value={formatDisplayValue(product.weight)}
          onChangeText={(text) => {
            const weight = parseNumericValue(text);
            setProduct({...product, weight});
          }}
          placeholder="Наприклад: 100 або 125.5"
          keyboardType="decimal-pad"
        />
        
        <Text style={styles.inputLabel}>Штрих-код</Text>
        <TextInput
          style={styles.input}
          value={product.barcode || ''}
          onChangeText={(text) => {
            // Дозволяємо тільки цифри
            const numericText = text.replace(/[^0-9]/g, '');
            setProduct({...product, barcode: numericText});
          }}
          placeholder="Введіть штрих-код (8-14 цифр)"
          keyboardType="number-pad"
          maxLength={14}
        />
        
        <Text style={styles.sectionTitle}>{t('nutritionalInfo')}</Text>
        
        <Text style={styles.inputLabel}>{t('calories')}</Text>
        <TextInput
          style={styles.input}
          value={formatDisplayValue(product.nutriments?.calories)}
          onChangeText={(text) => {
            const calories = parseNumericValue(text);
            setProduct({
              ...product, 
              nutriments: {
                ...product.nutriments!,
                calories
              }
            });
          }}
          placeholder="Наприклад: 250 або 342.8"
          keyboardType="decimal-pad"
        />
        
        <Text style={styles.inputLabel}>{t('proteins')} (г)</Text>
        <TextInput
          style={styles.input}
          value={formatDisplayValue(product.nutriments?.proteins)}
          onChangeText={(text) => {
            const proteins = parseNumericValue(text);
            setProduct({
              ...product, 
              nutriments: {
                ...product.nutriments!,
                proteins
              }
            });
          }}
          placeholder="Наприклад: 12.5 або 0.8"
          keyboardType="decimal-pad"
        />
        
        <Text style={styles.inputLabel}>{t('carbohydrates')} (г)</Text>
        <TextInput
          style={styles.input}
          value={formatDisplayValue(product.nutriments?.carbohydrates?.total)}
          onChangeText={(text) => {
            const carbs = parseNumericValue(text);
            setProduct({
              ...product, 
              nutriments: {
                ...product.nutriments!,
                carbohydrates: {
                  ...product.nutriments?.carbohydrates!,
                  total: carbs
                }
              }
            });
          }}
          placeholder="Наприклад: 45.2 або 0.5"
          keyboardType="decimal-pad"
        />
        
        <Text style={[styles.inputLabel, styles.indentedLabel]}>{t('sugar')} (г)</Text>
        <TextInput
          style={[styles.input, styles.indentedInput]}
          value={formatDisplayValue(product.nutriments?.carbohydrates?.sugar)}
          onChangeText={(text) => {
            const sugar = parseNumericValue(text);
            setProduct({
              ...product, 
              nutriments: {
                ...product.nutriments!,
                carbohydrates: {
                  ...product.nutriments?.carbohydrates!,
                  sugar
                }
              }
            });
          }}
          placeholder="Наприклад: 8.3 або 0.2"
          keyboardType="decimal-pad"
        />
        
        <Text style={styles.inputLabel}>{t('fats')} (г)</Text>
        <TextInput
          style={styles.input}
          value={formatDisplayValue(product.nutriments?.fats?.total)}
          onChangeText={(text) => {
            const fats = parseNumericValue(text);
            setProduct({
              ...product, 
              nutriments: {
                ...product.nutriments!,
                fats: {
                  ...product.nutriments?.fats!,
                  total: fats
                }
              }
            });
          }}
          placeholder="Наприклад: 15.7 або 0.9"
          keyboardType="decimal-pad"
        />
        
        <Text style={[styles.inputLabel, styles.indentedLabel]}>{t('saturatedFats')} (г)</Text>
        <TextInput
          style={[styles.input, styles.indentedInput]}
          value={formatDisplayValue(product.nutriments?.fats?.saturated)}
          onChangeText={(text) => {
            const saturated = parseNumericValue(text);
            setProduct({
              ...product, 
              nutriments: {
                ...product.nutriments!,
                fats: {
                  ...product.nutriments?.fats!,
                  saturated
                }
              }
            });
          }}
          placeholder="Наприклад: 4.1 або 0.1"
          keyboardType="decimal-pad"
        />
        
        <Text style={styles.inputLabel}>{t('salt')} (г)</Text>
        <TextInput
          style={styles.input}
          value={formatDisplayValue(product.nutriments?.salt)}
          onChangeText={(text) => {
            const salt = parseNumericValue(text);
            setProduct({
              ...product, 
              nutriments: {
                ...product.nutriments!,
                salt
              }
            });
          }}
          placeholder="Наприклад: 1.2 або 0.3"
          keyboardType="decimal-pad"
        />
        
        <Text style={styles.inputLabel}>Клітковина (г)</Text>
        <TextInput
          style={styles.input}
          value={formatDisplayValue(product.nutriments?.fiber)}
          onChangeText={(text) => {
            const fiber = parseNumericValue(text);
            setProduct({
              ...product, 
              nutriments: {
                ...product.nutriments!,
                fiber
              }
            });
          }}
          placeholder="Наприклад: 4.6 або 0.8"
          keyboardType="decimal-pad"
        />
        
        <Text style={styles.inputLabel}>{t('nutriscoreGrade')}</Text>
        
        {/* Інформація про автоматичний розрахунок */}
        {calculatedNutriScore && !isManualNutriScore && (
          <View style={styles.autoCalculationInfo}>
            <Ionicons name="calculator" size={16} color="#34572a" />
            <Text style={styles.autoCalculationText}>
              Автоматично розраховано: {calculatedNutriScore}
            </Text>
            <TouchableOpacity
              style={styles.manualOverrideButton}
              onPress={() => setIsManualNutriScore(true)}
            >
              <Text style={styles.manualOverrideText}>Змінити вручну</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {isManualNutriScore && (
          <View style={styles.manualModeInfo}>
            <Ionicons name="hand-left" size={16} color="#FF9800" />
            <Text style={styles.manualModeText}>
              Ручний режим
            </Text>
            <TouchableOpacity
              style={styles.autoModeButton}
              onPress={() => {
                setIsManualNutriScore(false);
                const autoGrade = calculateNutriScoreAutomatically();
                if (autoGrade) {
                  setProduct({...product, nutriscoreGrade: autoGrade});
                }
              }}
            >
              <Text style={styles.autoModeText}>Авто розрахунок</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.nutriScoreSelector}>
          {['A', 'B', 'C', 'D', 'E'].map((grade) => (
            <TouchableOpacity
              key={grade}
              style={[
                styles.nutriScoreOption,
                product.nutriscoreGrade === grade && { 
                  backgroundColor: getNutriScoreColor(grade),
                  borderColor: getNutriScoreColor(grade)
                }
              ]}
              onPress={() => {
                setProduct({...product, nutriscoreGrade: grade as NutriScoreGrade});
                setIsManualNutriScore(true);
              }}
            >
              <Text style={[
                styles.nutriScoreOptionText,
                product.nutriscoreGrade === grade && styles.selectedNutriScoreText
              ]}>
                {grade}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.inputLabel}>{t('ingredients')}</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={product.ingredients}
          onChangeText={(text) => setProduct({...product, ingredients: text})}
          placeholder={t('ingredients')}
          multiline
          numberOfLines={4}
        />
        
        <Text style={styles.inputLabel}>{t('allergens')}</Text>
        <TextInput
          style={styles.input}
          value={product.allergens?.join(', ')}
          onChangeText={(text) => setProduct({
            ...product, 
            allergens: text.split(',').map(allergen => allergen.trim()).filter(allergen => allergen)
          })}
          placeholder={t('allergensPlaceholder')}
        />
        
        <Text style={styles.inputLabel}>{t('additives')}</Text>
        <TextInput
          style={styles.input}
          value={product.additives?.join(', ')}
          onChangeText={(text) => setProduct({
            ...product, 
            additives: text.split(',').map(additive => additive.trim()).filter(additive => additive)
          })}
          placeholder={t('additivesPlaceholder')}
        />
        
        <Text style={styles.sectionTitle}>{t('tags')}</Text>
        
        <Text style={styles.inputLabel}>{t('addTags')}</Text>
        <TextInput
          style={styles.input}
          value={product.tags?.join(', ')}
          onChangeText={(text) => setProduct({
            ...product, 
            tags: text.split(',').map(tag => tag.trim()).filter(tag => tag)
          })}
          placeholder={t('tagsPlaceholder')}
        />
        
        <Text style={styles.inputSubLabel}>{t('availableTags')}</Text>
        <View style={styles.tagsContainer}>
          {PREDEFINED_TAGS.map((tag) => {
            const isSelected = product.tags?.includes(tag) || false;
            return (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tagButton,
                  isSelected && styles.tagButtonSelected
                ]}
                onPress={() => {
                  const currentTags = product.tags || [];
                  const updatedTags = isSelected
                    ? currentTags.filter(t => t !== tag)
                    : [...currentTags, tag];
                  setProduct({...product, tags: updatedTags});
                }}
              >
                <Text style={[
                  styles.tagButtonText,
                  isSelected && styles.tagButtonTextSelected
                ]}>
                  {getTagDisplayName(tag)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        
        <Text style={styles.sectionTitle}>{t('dietaryInfo')} (Legacy)</Text>
        <Text style={styles.inputHelper}>{t('legacyFieldsNote')}</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>{t('cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{t('save')}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#34572a',
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34572a',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  indentedLabel: {
    marginLeft: 20,
    fontSize: 14,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  indentedInput: {
    marginLeft: 20,
    width: '90%',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34572a',
    marginTop: 24,
    marginBottom: 12,
  },
  nutriScoreSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  nutriScoreOption: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  nutriScoreOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedNutriScoreText: {
    color: '#fff',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    marginRight: 12,
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#34572a',
    borderColor: '#34572a',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    marginBottom: 40,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  saveButton: {
    backgroundColor: '#34572a',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputSubLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
    marginTop: 12,
  },
  inputHelper: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tagButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    marginRight: 8,
    marginBottom: 8,
  },
  tagButtonSelected: {
    backgroundColor: '#34572a',
    borderColor: '#34572a',
  },
  tagButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  tagButtonTextSelected: {
    color: '#fff',
  },
  autoCalculationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#34572a',
  },
  autoCalculationText: {
    fontSize: 14,
    color: '#34572a',
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  manualOverrideButton: {
    backgroundColor: '#34572a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  manualOverrideText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  manualModeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  manualModeText: {
    fontSize: 14,
    color: '#856404',
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  autoModeButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  autoModeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default EditProductScreen; 