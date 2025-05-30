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

type EditProductScreenProps = StackScreenProps<RootStackParamList, 'EditProduct'>;

const EditProductScreen: React.FC<EditProductScreenProps> = ({ navigation, route }) => {
  const { productId } = route.params;
  const currentUser = useAppSelector(state => state.user.currentUser);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      salt: 0
    },
    tags: [],
    isVegan: false,
    isVegetarian: false,
    hasLactose: false,
    hasGluten: false,
    weight: 0
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

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      Alert.alert(
        t('accessDenied'),
        t('adminOnlyEdit'),
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      return;
    }
    
    loadProduct();
  }, [productId]);

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
        isVegan: product.isVegan || false,
        isVegetarian: product.isVegetarian || false,
        hasLactose: product.hasLactose || false,
        hasGluten: product.hasGluten || false,
        weight: product.weight || 0
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
          value={product.weight?.toString()}
          onChangeText={(text) => {
            const weight = parseFloat(text) || 0;
            setProduct({...product, weight});
          }}
          placeholder={t('zeroPlaceholder')}
          keyboardType="numeric"
        />
        
        <Text style={styles.sectionTitle}>{t('nutritionalInfo')}</Text>
        
        <Text style={styles.inputLabel}>{t('calories')}</Text>
        <TextInput
          style={styles.input}
          value={product.nutriments?.calories?.toString()}
          onChangeText={(text) => {
            const calories = parseFloat(text) || 0;
            setProduct({
              ...product, 
              nutriments: {
                ...product.nutriments!,
                calories
              }
            });
          }}
          placeholder={t('zeroPlaceholder')}
          keyboardType="numeric"
        />
        
        <Text style={styles.inputLabel}>{t('proteins')} (г)</Text>
        <TextInput
          style={styles.input}
          value={product.nutriments?.proteins?.toString()}
          onChangeText={(text) => {
            const proteins = parseFloat(text) || 0;
            setProduct({
              ...product, 
              nutriments: {
                ...product.nutriments!,
                proteins
              }
            });
          }}
          placeholder={t('zeroPlaceholder')}
          keyboardType="numeric"
        />
        
        <Text style={styles.inputLabel}>{t('carbohydrates')} (г)</Text>
        <TextInput
          style={styles.input}
          value={product.nutriments?.carbohydrates?.total?.toString()}
          onChangeText={(text) => {
            const carbs = parseFloat(text) || 0;
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
          placeholder={t('zeroPlaceholder')}
          keyboardType="numeric"
        />
        
        <Text style={[styles.inputLabel, styles.indentedLabel]}>{t('sugar')} (г)</Text>
        <TextInput
          style={[styles.input, styles.indentedInput]}
          value={product.nutriments?.carbohydrates?.sugar?.toString()}
          onChangeText={(text) => {
            const sugar = parseFloat(text) || 0;
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
          placeholder={t('zeroPlaceholder')}
          keyboardType="numeric"
        />
        
        <Text style={styles.inputLabel}>{t('fats')} (г)</Text>
        <TextInput
          style={styles.input}
          value={product.nutriments?.fats?.total?.toString()}
          onChangeText={(text) => {
            const fats = parseFloat(text) || 0;
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
          placeholder={t('zeroPlaceholder')}
          keyboardType="numeric"
        />
        
        <Text style={[styles.inputLabel, styles.indentedLabel]}>{t('saturatedFats')} (г)</Text>
        <TextInput
          style={[styles.input, styles.indentedInput]}
          value={product.nutriments?.fats?.saturated?.toString()}
          onChangeText={(text) => {
            const saturated = parseFloat(text) || 0;
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
          placeholder={t('zeroPlaceholder')}
          keyboardType="numeric"
        />
        
        <Text style={styles.inputLabel}>{t('salt')} (г)</Text>
        <TextInput
          style={styles.input}
          value={product.nutriments?.salt?.toString()}
          onChangeText={(text) => {
            const salt = parseFloat(text) || 0;
            setProduct({
              ...product, 
              nutriments: {
                ...product.nutriments!,
                salt
              }
            });
          }}
          placeholder={t('zeroPlaceholder')}
          keyboardType="numeric"
        />
        
        <Text style={styles.inputLabel}>{t('nutriscoreGrade')}</Text>
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
              onPress={() => setProduct({...product, nutriscoreGrade: grade as NutriScoreGrade})}
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
        
        <View style={styles.checkboxRow}>
          <TouchableOpacity 
            style={styles.checkbox}
            onPress={() => setProduct({...product, isVegan: !product.isVegan})}
          >
            <View style={[
              styles.checkboxInner, 
              product.isVegan && styles.checkboxChecked
            ]}>
              {product.isVegan && <Ionicons name="checkmark" size={16} color="#fff" />}
            </View>
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>{t('vegan')}</Text>
        </View>
        
        <View style={styles.checkboxRow}>
          <TouchableOpacity 
            style={styles.checkbox}
            onPress={() => setProduct({...product, isVegetarian: !product.isVegetarian})}
          >
            <View style={[
              styles.checkboxInner, 
              product.isVegetarian && styles.checkboxChecked
            ]}>
              {product.isVegetarian && <Ionicons name="checkmark" size={16} color="#fff" />}
            </View>
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>{t('vegetarian')}</Text>
        </View>
        
        <View style={styles.checkboxRow}>
          <TouchableOpacity 
            style={styles.checkbox}
            onPress={() => setProduct({...product, hasLactose: !product.hasLactose})}
          >
            <View style={[
              styles.checkboxInner, 
              product.hasLactose && styles.checkboxChecked
            ]}>
              {product.hasLactose && <Ionicons name="checkmark" size={16} color="#fff" />}
            </View>
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>{t('containsLactose')}</Text>
        </View>
        
        <View style={styles.checkboxRow}>
          <TouchableOpacity 
            style={styles.checkbox}
            onPress={() => setProduct({...product, hasGluten: !product.hasGluten})}
          >
            <View style={[
              styles.checkboxInner, 
              product.hasGluten && styles.checkboxChecked
            ]}>
              {product.hasGluten && <Ionicons name="checkmark" size={16} color="#fff" />}
            </View>
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>{t('containsGluten')}</Text>
        </View>
        
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
});

export default EditProductScreen; 