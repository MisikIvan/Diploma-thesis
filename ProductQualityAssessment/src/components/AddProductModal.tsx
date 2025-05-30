import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addNewProduct } from '../redux/slices/productsSlice';
import { addProduct } from '../api/firebase';
import { Product, NutriScoreGrade } from '../types/index';
import { t } from '../utils/translations';
import { PREDEFINED_TAGS, getTagDisplayName } from '../utils/helpers';
import ImageUploader from './ImageUploader';
import BarcodeScanner from './BarcodeScanner';
import { OpenFoodFactsAPI } from '../api/openFoodFacts';

interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
  onProductAdded?: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  visible,
  onClose,
  onProductAdded,
}) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.currentUser);
  
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
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


  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [isFetchingProductData, setIsFetchingProductData] = useState(false);
  const [barcode, setBarcode] = useState('');

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

  const resetProductForm = () => {
    setNewProduct({
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
  };

  const handleAddProduct = async () => {
    if (!newProduct.name?.trim()) {
      Alert.alert(t('error'), t('productNameRequired'));
      return;
    }

    if (!currentUser) {
      Alert.alert(t('error'), t('authenticationError'));
      return;
    }

    try {
      const productToAdd: Product = {
        productId: '', 
        name: newProduct.name.trim(),
        description: newProduct.description || '',
        imageUrl: newProduct.imageUrl || '',
        nutriscoreGrade: newProduct.nutriscoreGrade || 'C',
        ingredients: newProduct.ingredients || '',
        allergens: newProduct.allergens || [],
        additives: newProduct.additives || [],
        nutriments: newProduct.nutriments || {
          calories: 0,
          proteins: 0,
          fats: { total: 0, saturated: 0 },
          carbohydrates: { total: 0, sugar: 0 },
          salt: 0
        },
        tags: newProduct.tags || [],
        isVegan: newProduct.isVegan || false,
        isVegetarian: newProduct.isVegetarian || false,
        hasLactose: newProduct.hasLactose || false,
        hasGluten: newProduct.hasGluten || false,
        weight: newProduct.weight || 0,
        createdBy: currentUser.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addProduct(productToAdd, currentUser.userId);
      
      Alert.alert(t('success'), 'Product added successfully');
      onProductAdded?.();
      resetProductForm();
      onClose();
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert(t('error'), t('failedToAddProduct'));
    }
  };

  const handleClose = () => {
    resetProductForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('addNewProduct')}</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            <Text style={styles.inputLabel}>{t('productName')} *</Text>
            <TextInput
              style={styles.input}
              value={newProduct.name}
              onChangeText={(text) => setNewProduct({...newProduct, name: text})}
              placeholder={t('productName')}
            />
            
            <Text style={styles.inputLabel}>{t('productDescription')}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newProduct.description}
              onChangeText={(text) => setNewProduct({...newProduct, description: text})}
              placeholder={t('detailedProductDescription')}
              multiline
              numberOfLines={3}
            />
            
            <ImageUploader
              onImageUploaded={(imageUrl) => setNewProduct({...newProduct, imageUrl})}
              currentImageUrl={newProduct.imageUrl}
            />
            
            <Text style={styles.inputLabel}>{t('productImageUrl')} {t('alternativeImageUrl')}</Text>
            <TextInput
              style={styles.input}
              value={newProduct.imageUrl}
              onChangeText={(text) => setNewProduct({...newProduct, imageUrl: text})}
              placeholder={t('imageUrlPlaceholder')}
            />
            
            <Text style={styles.inputLabel}>{t('weight')} (г)</Text>
            <TextInput
              style={styles.input}
              value={newProduct.weight?.toString()}
              onChangeText={(text) => {
                const weight = parseFloat(text) || 0;
                setNewProduct({...newProduct, weight});
              }}
              placeholder={t('zeroPlaceholder')}
              keyboardType="numeric"
            />
            
            <Text style={styles.sectionTitle}>{t('nutritionalInfo')}</Text>
            
            <Text style={styles.inputLabel}>{t('calories')}</Text>
            <TextInput
              style={styles.input}
              value={newProduct.nutriments?.calories?.toString()}
              onChangeText={(text) => {
                const calories = parseFloat(text) || 0;
                setNewProduct({
                  ...newProduct, 
                  nutriments: {
                    ...newProduct.nutriments!,
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
              value={newProduct.nutriments?.proteins?.toString()}
              onChangeText={(text) => {
                const proteins = parseFloat(text) || 0;
                setNewProduct({
                  ...newProduct, 
                  nutriments: {
                    ...newProduct.nutriments!,
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
              value={newProduct.nutriments?.carbohydrates?.total?.toString()}
              onChangeText={(text) => {
                const carbs = parseFloat(text) || 0;
                setNewProduct({
                  ...newProduct, 
                  nutriments: {
                    ...newProduct.nutriments!,
                    carbohydrates: {
                      ...newProduct.nutriments?.carbohydrates!,
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
              value={newProduct.nutriments?.carbohydrates?.sugar?.toString()}
              onChangeText={(text) => {
                const sugar = parseFloat(text) || 0;
                setNewProduct({
                  ...newProduct, 
                  nutriments: {
                    ...newProduct.nutriments!,
                    carbohydrates: {
                      ...newProduct.nutriments?.carbohydrates!,
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
              value={newProduct.nutriments?.fats?.total?.toString()}
              onChangeText={(text) => {
                const fats = parseFloat(text) || 0;
                setNewProduct({
                  ...newProduct, 
                  nutriments: {
                    ...newProduct.nutriments!,
                    fats: {
                      ...newProduct.nutriments?.fats!,
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
              value={newProduct.nutriments?.fats?.saturated?.toString()}
              onChangeText={(text) => {
                const saturated = parseFloat(text) || 0;
                setNewProduct({
                  ...newProduct, 
                  nutriments: {
                    ...newProduct.nutriments!,
                    fats: {
                      ...newProduct.nutriments?.fats!,
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
              value={newProduct.nutriments?.salt?.toString()}
              onChangeText={(text) => {
                const salt = parseFloat(text) || 0;
                setNewProduct({
                  ...newProduct, 
                  nutriments: {
                    ...newProduct.nutriments!,
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
                    newProduct.nutriscoreGrade === grade && { 
                      backgroundColor: getNutriScoreColor(grade),
                      borderColor: getNutriScoreColor(grade)
                    }
                  ]}
                  onPress={() => setNewProduct({...newProduct, nutriscoreGrade: grade as NutriScoreGrade})}
                >
                  <Text style={[
                    styles.nutriScoreOptionText,
                    newProduct.nutriscoreGrade === grade && styles.selectedNutriScoreText
                  ]}>
                    {grade}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={styles.inputLabel}>{t('ingredients')}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newProduct.ingredients}
              onChangeText={(text) => setNewProduct({...newProduct, ingredients: text})}
              placeholder={t('ingredients')}
              multiline
              numberOfLines={4}
            />
            
            <Text style={styles.inputLabel}>{t('allergens')}</Text>
            <TextInput
              style={styles.input}
              value={newProduct.allergens?.join(', ')}
              onChangeText={(text) => setNewProduct({
                ...newProduct, 
                allergens: text.split(',').map(allergen => allergen.trim()).filter(allergen => allergen)
              })}
              placeholder={t('allergensPlaceholder')}
            />
            
            <Text style={styles.inputLabel}>{t('additives')}</Text>
            <TextInput
              style={styles.input}
              value={newProduct.additives?.join(', ')}
              onChangeText={(text) => setNewProduct({
                ...newProduct, 
                additives: text.split(',').map(additive => additive.trim()).filter(additive => additive)
              })}
              placeholder={t('additivesPlaceholder')}
            />
            
            <Text style={styles.sectionTitle}>{t('tags')}</Text>
            
            <Text style={styles.inputLabel}>{t('addTags')}</Text>
            <TextInput
              style={styles.input}
              value={newProduct.tags?.join(', ')}
              onChangeText={(text) => setNewProduct({
                ...newProduct, 
                tags: text.split(',').map(tag => tag.trim()).filter(tag => tag)
              })}
              placeholder={t('tagsPlaceholder')}
            />
            
            <Text style={styles.inputSubLabel}>{t('availableTags')}</Text>
            <View style={styles.tagsContainer}>
              {PREDEFINED_TAGS.map((tag) => {
                const isSelected = newProduct.tags?.includes(tag) || false;
                return (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tagButton,
                      isSelected && styles.tagButtonSelected
                    ]}
                    onPress={() => {
                      const currentTags = newProduct.tags || [];
                      const updatedTags = isSelected
                        ? currentTags.filter(t => t !== tag)
                        : [...currentTags, tag];
                      setNewProduct({...newProduct, tags: updatedTags});
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
            

          </ScrollView>
          
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={handleClose}
            >
              <Text style={styles.modalButtonText}>{t('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleAddProduct}
            >
              <Text style={styles.modalButtonText}>{t('save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '95%',
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#34572a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
  },
  formContainer: {
    padding: 20,
    maxHeight: '80%',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  inputSubLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 12,
    color: '#666',
  },
  indentedLabel: {
    marginLeft: 16,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  indentedInput: {
    marginLeft: 16,
    width: '90%',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
    color: '#34572a',
  },
  inputHelper: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  nutriScoreSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  nutriScoreOption: {
    flex: 1,
    height: 40,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  nutriScoreOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  selectedNutriScoreText: {
    color: '#fff',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tagButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tagButtonSelected: {
    backgroundColor: '#34572a',
    borderColor: '#34572a',
  },
  tagButtonText: {
    fontSize: 12,
    color: '#666',
  },
  tagButtonTextSelected: {
    color: '#fff',
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
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
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddProductModal; 