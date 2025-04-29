import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/index';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getProductDetails, getSimilarProducts } from '../redux/slices/productsSlice';
import {
  formatDate,
  getProductImage,
  formatNutrient,
  calculateWholeProduct,
  truncateText,
} from '../utils/helpers';
import { Product, getNutriScoreColor } from '../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductCard from '../components/ProductCard';
import LoadingScreen from '../components/LoadingScreen';
import ErrorScreen from '../components/ErrorScreen';
import { t } from '../utils/translations';

type ProductDetailScreenProps = {
  route: RouteProp<RootStackParamList, 'ProductDetail'>;
};

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ route }) => {
  const { productId } = route.params;
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState<string>('nutrition');
  
  const { currentProduct, similarProducts, loading, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProductDetails(productId));
    dispatch(getSimilarProducts(productId));
  }, [dispatch, productId]);

  const renderTabContent = () => {
    if (!currentProduct) return null;
    
    switch (activeTab) {
      case 'nutrition':
        return (
          <View style={styles.tabContainer}>
            <Text style={styles.sectionTitle}>{t('nutritionalFacts')}</Text>
            
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionLabel}>{t('calories')}</Text>
              <Text style={styles.nutritionValue}>
                {formatNutrient(currentProduct.nutriments.calories, 'kcal')}
              </Text>
            </View>

            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionLabel}>{t('proteins')}</Text>
              <Text style={styles.nutritionValue}>
                {formatNutrient(currentProduct.nutriments.proteins)}
              </Text>
            </View>

            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionLabel}>{t('carbohydrates')}</Text>
              <Text style={styles.nutritionValue}>
                {formatNutrient(currentProduct.nutriments.carbohydrates.total)}
              </Text>
            </View>

            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionLabel}>└ {t('sugar')}</Text>
              <Text style={styles.nutritionValue}>
                {formatNutrient(currentProduct.nutriments.carbohydrates.sugar)}
              </Text>
            </View>

            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionLabel}>{t('fats')}</Text>
              <Text style={styles.nutritionValue}>
                {formatNutrient(currentProduct.nutriments.fats.total)}
              </Text>
            </View>

            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionLabel}>└ {t('saturatedFats')}</Text>
              <Text style={styles.nutritionValue}>
                {formatNutrient(currentProduct.nutriments.fats.saturated)}
              </Text>
            </View>

            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionLabel}>{t('salt')}</Text>
              <Text style={styles.nutritionValue}>
                {formatNutrient(currentProduct.nutriments.salt)}
              </Text>
            </View>

            {currentProduct.weight && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                  {t('wholeProduct')} ({currentProduct.weight}g)
                </Text>
                
                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>{t('calories')}</Text>
                  <Text style={styles.nutritionValue}>
                    {formatNutrient(
                      calculateWholeProduct(currentProduct.nutriments.calories, currentProduct.weight) ?? undefined,
                      'kcal'
                    )}
                  </Text>
                </View>

                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>{t('proteins')}</Text>
                  <Text style={styles.nutritionValue}>
                    {formatNutrient(
                      calculateWholeProduct(currentProduct.nutriments.proteins, currentProduct.weight) ?? undefined
                    )}
                  </Text>
                </View>

                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>{t('carbohydrates')}</Text>
                  <Text style={styles.nutritionValue}>
                    {formatNutrient(
                      calculateWholeProduct(currentProduct.nutriments.carbohydrates.total, currentProduct.weight) ?? undefined
                    )}
                  </Text>
                </View>
              </>
            )}
          </View>
        );
      
      case 'ingredients':
        return (
          <View style={styles.tabContainer}>
            <Text style={styles.sectionTitle}>{t('ingredients')}</Text>
            <Text style={styles.ingredientsText}>{currentProduct.ingredients}</Text>

            {currentProduct.additives.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 16 }]}>{t('additives')}</Text>
                <View style={styles.additivesList}>
                  {currentProduct.additives.map((additive, index) => (
                    <View key={index} style={styles.additiveTag}>
                      <Text style={styles.additiveText}>{additive}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        );
      
      case 'allergens':
        return (
          <View style={styles.tabContainer}>
            <Text style={styles.sectionTitle}>{t('allergens')}</Text>
            
            {currentProduct.allergens.length > 0 ? (
              <View style={styles.allergensList}>
                {currentProduct.allergens.map((allergen, index) => (
                  <View key={index} style={styles.allergenTag}>
                    <Text style={styles.allergenText}>{allergen}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noAllergensText}>{t('noAllergensListed')}</Text>
            )}

            <View style={styles.dietaryInfoContainer}>
              <View style={styles.dietaryInfoRow}>
                <Icon 
                  name={currentProduct.isVegan ? 'check-circle' : 'close-circle'} 
                  size={22} 
                  color={currentProduct.isVegan ? '#4CAF50' : '#F44336'} 
                />
                <Text style={styles.dietaryInfoText}>{t('vegan')}</Text>
              </View>

              <View style={styles.dietaryInfoRow}>
                <Icon 
                  name={currentProduct.isVegetarian ? 'check-circle' : 'close-circle'} 
                  size={22} 
                  color={currentProduct.isVegetarian ? '#4CAF50' : '#F44336'} 
                />
                <Text style={styles.dietaryInfoText}>{t('vegetarian')}</Text>
              </View>

              <View style={styles.dietaryInfoRow}>
                <Icon 
                  name={!currentProduct.hasLactose ? 'check-circle' : 'close-circle'} 
                  size={22} 
                  color={!currentProduct.hasLactose ? '#4CAF50' : '#F44336'} 
                />
                <Text style={styles.dietaryInfoText}>{t('lactoseFree')}</Text>
              </View>

              <View style={styles.dietaryInfoRow}>
                <Icon 
                  name={!currentProduct.hasGluten ? 'check-circle' : 'close-circle'} 
                  size={22} 
                  color={!currentProduct.hasGluten ? '#4CAF50' : '#F44336'} 
                />
                <Text style={styles.dietaryInfoText}>{t('glutenFree')}</Text>
              </View>
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };

  const renderSimilarProducts = () => {
    if (!similarProducts || similarProducts.length === 0) {
      return (
        <View style={styles.noSimilarProductsContainer}>
          <Text style={styles.noSimilarProductsText}>{t('noSimilarProducts')}</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={similarProducts}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.productId}
        renderItem={({ item }) => (
          <View style={styles.similarProductCard}>
            <ProductCard product={item} onPress={() => navigation.navigate('ProductDetail', { productId: item.productId })} />
          </View>
        )}
        contentContainerStyle={styles.similarProductsList}
      />
    );
  };

  if (loading && !currentProduct) {
    return <LoadingScreen message={t('loading')} />;
  }

  if (error) {
    return <ErrorScreen message={t('error')} onRetry={() => dispatch(getProductDetails(productId))} />;
  }

  if (!currentProduct) {
    return <ErrorScreen message={t('noResults')} onRetry={() => dispatch(getProductDetails(productId))} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.productHeader}>
          <Image 
            source={{ uri: getProductImage(currentProduct.imageUrl) }} 
            style={styles.productImage}
            resizeMode="contain"
          />
          
          <View style={styles.productTitleContainer}>
            <Text style={styles.productName}>{currentProduct.name}</Text>
            
            <View style={styles.nutriScoreContainer}>
              <Text style={styles.nutriScoreText}>
                Nutri-Score: {currentProduct.nutriscoreGrade}
              </Text>
              <Text style={styles.nutriScoreEmoji}>
                {getNutriScoreColor(currentProduct.nutriscoreGrade)}
              </Text>
            </View>

            <View style={styles.categoriesContainer}>
              {currentProduct.categories.map((cat, index) => (
                <View key={index} style={styles.categoryTag}>
                  <Text style={styles.categoryText}>{cat}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.productDescription}>
              {currentProduct.description || 'No description available'}
            </Text>
          </View>
        </View>
        
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'nutrition' && styles.activeTabButton]}
            onPress={() => setActiveTab('nutrition')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'nutrition' && styles.activeTabButtonText]}>
              {t('nutrition')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'ingredients' && styles.activeTabButton]}
            onPress={() => setActiveTab('ingredients')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'ingredients' && styles.activeTabButtonText]}>
              {t('ingredients')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'allergens' && styles.activeTabButton]}
            onPress={() => setActiveTab('allergens')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'allergens' && styles.activeTabButtonText]}>
              {t('allergens')}
            </Text>
          </TouchableOpacity>
        </View>
        
        {renderTabContent()}
        
        <View style={styles.similarProductsSection}>
          <Text style={styles.similarProductsTitle}>{t('similarProducts')}</Text>
          {renderSimilarProducts()}
        </View>
        
        <View style={styles.metadataContainer}>
          <Text style={styles.metadataText}>Product ID: {currentProduct.productId}</Text>
          <Text style={styles.metadataText}>
            Added: {formatDate(currentProduct.createdAt)}
          </Text>
          <Text style={styles.metadataText}>
            Last updated: {formatDate(currentProduct.updatedAt)}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  productHeader: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  productImage: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
  },
  productTitleContainer: {
    marginBottom: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 16,
    color: '#555',
    marginTop: 8,
    lineHeight: 22,
  },
  nutriScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nutriScoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  nutriScoreEmoji: {
    fontSize: 18,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  categoryTag: {
    backgroundColor: '#E0F7FA',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    color: '#00838F',
    fontSize: 14,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
  },
  tabButtonText: {
    color: '#757575',
    fontSize: 16,
  },
  activeTabButtonText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  tabContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  nutritionLabel: {
    fontSize: 16,
    color: '#555',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  ingredientsText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  additivesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  additiveTag: {
    backgroundColor: '#FFEBEE',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  additiveText: {
    color: '#C62828',
    fontSize: 14,
  },
  allergensList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  allergenTag: {
    backgroundColor: '#FFF9C4',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  allergenText: {
    color: '#F57F17',
    fontSize: 14,
  },
  noAllergensText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#757575',
    marginBottom: 16,
  },
  dietaryInfoContainer: {
    marginTop: 16,
  },
  dietaryInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dietaryInfoText: {
    fontSize: 16,
    marginLeft: 12,
  },
  similarProductsSection: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  similarProductsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  similarProductsList: {
    paddingVertical: 8,
  },
  similarProductCard: {
    width: 160,
    marginRight: 12,
  },
  noSimilarProductsContainer: {
    padding: 16,
    alignItems: 'center',
  },
  noSimilarProductsText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#757575',
  },
  metadataContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  metadataText: {
    fontSize: 12,
    color: '#9E9E9E',
    marginBottom: 4,
  },
});

export default ProductDetailScreen; 