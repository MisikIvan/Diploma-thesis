import React, { useEffect, useState, useCallback } from 'react';
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
  Alert,
  ToastAndroid,
} from 'react-native';
import { RouteProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated from 'react-native-reanimated';
import { RootStackParamList } from '../types/navigation';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getProductDetails, getSimilarProducts, updateProductFavoriteStatus } from '../redux/slices/productsSlice';
import {
  formatDate,
  getProductImage,
  formatNutrient,
  calculateWholeProduct,
  truncateText,
  getTagsFromProduct,
  getTagDisplayName,
  getTagColor,
} from '../utils/helpers';
import { Product, getNutriScoreColor, Favorite } from '../types/index';

const getNutriScoreBackgroundColor = (grade: string) => {
  switch (grade) {
    case 'A': return '#2E7D32'; // Темно-зелений
    case 'B': return '#689F38'; // Світло-зелений  
    case 'C': return '#FFA000'; // Жовтий
    case 'D': return '#F57C00'; // Помаранчевий
    case 'E': return '#D32F2F'; // Червоний
    default: return '#757575'; // Сірий
  }
};

const getNutriScoreTextColor = (grade: string) => {
  switch (grade) {
    case 'A':
    case 'B': 
    case 'C':
    case 'D':
    case 'E': return '#FFFFFF'; // Білий текст для всіх кольорів
    default: return '#FFFFFF';
  }
};
import ProductCard from '../components/ui/ProductCard';
import CommentSection from '../components/CommentSection';
import LoadingScreen from '../components/LoadingScreen';
import ErrorScreen from '../components/ErrorScreen';
import AdminInfo from '../components/AdminInfo';
import { t } from '../utils/translations';
import { StorageService } from '../utils/storage';
import { FirebaseService } from '../utils/firebase';



type ProductDetailScreenProps = {
  route: RouteProp<RootStackParamList, 'ProductDetail'>;
};

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ route }) => {
  const { productId } = route.params;
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState<string>('nutrition');
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [localLoading, setLocalLoading] = useState<boolean>(false);
  
  const { currentProduct, similarProducts, loading, error } = useAppSelector((state) => state.products);
  const { currentUser } = useAppSelector(state => state.user);

  const loadProductData = useCallback(() => {
    dispatch(getProductDetails(productId))
      .unwrap()
      .then(() => {
        // Тимчасово відключено - завантаження схожих продуктів
        // dispatch(getSimilarProducts(productId));
      })
      .catch(err => {
        console.error('Error fetching product:', err);
        ToastAndroid.show(t('couldNotLoadProductDetails'), ToastAndroid.SHORT);
      });
  }, [dispatch, productId]);

  useEffect(() => {
    loadProductData();
    checkFavoriteStatus();
  }, [loadProductData, currentUser]);

  useFocusEffect(
    useCallback(() => {
      loadProductData();
      checkFavoriteStatus();
    }, [productId, currentUser?.userId])
  );

  useFocusEffect(
    useCallback(() => {
      return () => {
      
      };
    }, [])
  );

  const checkFavoriteStatus = async () => {
    if (!currentUser?.userId || !productId) {
      setIsFavorite(false);
      return;
    }

    try {
      const isProductFavorite = await FirebaseService.favorites.isFavorite(currentUser.userId, productId);
      setIsFavorite(isProductFavorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
      setIsFavorite(false);
    }
  };

  const toggleFavorite = async () => {
    if (!currentUser?.userId || !productId) {
      Alert.alert(t('error'), t('pleaseLogInToAddFavorites'));
      return;
    }

    const originalFavoriteStatus = isFavorite;
    
    try {
      const newFavoriteStatus = !isFavorite;
      setIsFavorite(newFavoriteStatus);

      if (newFavoriteStatus) {
        await FirebaseService.favorites.addFavorite({
          favoriteId: `${currentUser.userId}_${productId}`,
          userId: currentUser.userId,
          productId: productId,
          addedAt: new Date().toISOString()
        });
      } else {
        await FirebaseService.favorites.removeFavoriteByUserAndProduct(currentUser.userId, productId);
      }

      dispatch(updateProductFavoriteStatus({
        productId: productId,
        isFavorite: newFavoriteStatus
      }));

      ToastAndroid.show(
        newFavoriteStatus ? t('addedToFavorites') : t('removedFromFavorites'),
        ToastAndroid.SHORT
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setIsFavorite(originalFavoriteStatus);
      Alert.alert(t('error'), t('failedToUpdateFavorites'));
    }
  };

  const renderTabContent = () => {
    if (!currentProduct) return null;
    
    // Disabled tags processing temporarily to fix render error
    // let productTags: string[] = [];
    // try {
    //   productTags = getTagsFromProduct(currentProduct);
    // } catch (error) {
    //   console.warn('Error getting tags:', error);
    //   productTags = [];
    // }
    
    switch (activeTab) {
      case 'nutrition':
        return (
          <ScrollView style={styles.tabContainer} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>{t('nutritionalFacts') || 'Nutritional Facts'}</Text>
            <Text style={styles.portionText}>{t('per100g') || 'Per 100g'}</Text>
            
            {/* Main macronutrients */}
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionCard}>
                <Text style={styles.nutritionNumber}>
                  {String(formatNutrient(currentProduct.nutriments?.calories, 'kcal') || '-')}
                </Text>
                <Text style={styles.nutritionLabelCompact}>{t('calories') || 'Calories'}</Text>
              </View>
              
              <View style={styles.nutritionCard}>
                <Text style={styles.nutritionNumber}>
                  {String(formatNutrient(currentProduct.nutriments?.proteins) || '-')}
                </Text>
                <Text style={styles.nutritionLabelCompact}>{t('proteins') || 'Proteins'}</Text>
              </View>
              
              <View style={styles.nutritionCard}>
                <Text style={styles.nutritionNumber}>
                  {String(formatNutrient(currentProduct.nutriments?.carbohydrates?.total) || '-')}
                </Text>
                <Text style={styles.nutritionLabelCompact}>{t('carbs') || 'Carbs'}</Text>
              </View>

              <View style={styles.nutritionCard}>
                <Text style={styles.nutritionNumber}>
                  {String(formatNutrient(currentProduct.nutriments?.fats?.total) || '-')}
                </Text>
                <Text style={styles.nutritionLabelCompact}>{t('fats') || 'Fats'}</Text>
              </View>
            </View>

            {/* Detailed information */}
            <View style={styles.detailsSection}>
              <Text style={styles.detailsTitle}>{t('nutritionalFacts') || 'Nutritional Facts'}</Text>
              
              <View style={styles.nutritionRowCompact}>
                <Text style={styles.nutritionLabelSmall}>{t('calories') || 'Calories'}</Text>
                <Text style={styles.nutritionValueSmall}>
                  {formatNutrient(currentProduct.nutriments?.calories, 'kcal')}
                </Text>
              </View>

              <View style={styles.nutritionRowCompact}>
                <Text style={styles.nutritionLabelSmall}>{t('proteins') || 'Proteins'}</Text>
                <Text style={styles.nutritionValueSmall}>
                  {formatNutrient(currentProduct.nutriments?.proteins)}
                </Text>
              </View>

              <View style={styles.nutritionRowCompact}>
                <Text style={styles.nutritionLabelSmall}>{t('fats') || 'Fats'}</Text>
                <Text style={styles.nutritionValueSmall}>
                  {formatNutrient(currentProduct.nutriments?.fats?.total)}
                </Text>
              </View>

              <View style={styles.nutritionRowCompact}>
                <Text style={styles.nutritionLabelSmall}>{t('carbs') || 'Carbs'}</Text>
                <Text style={styles.nutritionValueSmall}>
                  {formatNutrient(currentProduct.nutriments?.carbohydrates?.total)}
                </Text>
              </View>

              {currentProduct.nutriments?.carbohydrates?.sugar !== undefined && (
                <View style={styles.nutritionRowCompact}>
                  <Text style={styles.nutritionLabelSmall}>{t('sugar') || 'Sugar'}</Text>
                  <Text style={styles.nutritionValueSmall}>
                    {formatNutrient(currentProduct.nutriments?.carbohydrates?.sugar)}
                  </Text>
                </View>
              )}

              {currentProduct.nutriments?.fats?.saturated !== undefined && (
                <View style={styles.nutritionRowCompact}>
                  <Text style={styles.nutritionLabelSmall}>{t('saturatedFats') || 'Saturated Fats'}</Text>
                  <Text style={styles.nutritionValueSmall}>
                    {formatNutrient(currentProduct.nutriments?.fats?.saturated)}
                  </Text>
                </View>
              )}

              {currentProduct.nutriments?.salt !== undefined && (
                <View style={styles.nutritionRowCompact}>
                  <Text style={styles.nutritionLabelSmall}>{t('salt') || 'Salt'}</Text>
                  <Text style={styles.nutritionValueSmall}>
                    {formatNutrient(currentProduct.nutriments?.salt)}
                  </Text>
                </View>
              )}

              {currentProduct.nutriments?.fiber !== undefined && (
                <View style={styles.nutritionRowCompact}>
                  <Text style={styles.nutritionLabelSmall}>Fiber</Text>
                  <Text style={styles.nutritionValueSmall}>
                    {formatNutrient(currentProduct.nutriments?.fiber)}
                  </Text>
                </View>
              )}
            </View>

            {currentProduct.weight && (
              <View style={styles.wholeProductSection}>
                <Text style={styles.wholeProductTitle}>
                  {t('wholeProduct') || 'Whole Product'} ({currentProduct.weight}{t('gramsUnit') || 'g'})
                </Text>
                <View style={styles.wholeProductGrid}>
                  <View style={styles.wholeProductItem}>
                    <Text style={styles.wholeProductLabel}>{t('calories') || 'Calories'}</Text>
                    <Text style={styles.wholeProductValue}>
                      {Math.round((currentProduct.nutriments?.calories || 0) * currentProduct.weight / 100)} {t('kcalUnit') || 'kcal'}
                    </Text>
                  </View>
                  <View style={styles.wholeProductItem}>
                    <Text style={styles.wholeProductLabel}>{t('proteins') || 'Proteins'}</Text>
                    <Text style={styles.wholeProductValue}>
                      {Math.round(((currentProduct.nutriments?.proteins || 0) * currentProduct.weight / 100) * 10) / 10} {t('gramsUnit') || 'g'}
                    </Text>
                  </View>
                  <View style={styles.wholeProductItem}>
                    <Text style={styles.wholeProductLabel}>{t('fats') || 'Fats'}</Text>
                    <Text style={styles.wholeProductValue}>
                      {Math.round(((currentProduct.nutriments?.fats?.total || 0) * currentProduct.weight / 100) * 10) / 10} {t('gramsUnit') || 'g'}
                    </Text>
                  </View>
                  <View style={styles.wholeProductItem}>
                    <Text style={styles.wholeProductLabel}>{t('carbs') || 'Carbs'}</Text>
                    <Text style={styles.wholeProductValue}>
                      {Math.round(((currentProduct.nutriments?.carbohydrates?.total || 0) * currentProduct.weight / 100) * 10) / 10} {t('gramsUnit') || 'g'}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        );
      
      case 'composition':
        return (
          <ScrollView style={styles.tabContainer} showsVerticalScrollIndicator={false}>
            {/* Ingredients */}
            <View style={styles.compositionSection}>
              <View style={styles.compositionHeader}>
                <Ionicons name="leaf-outline" size={20} color="#34572a" />
                <Text style={styles.compositionTitle}>{t('composition') || 'Composition'}</Text>
              </View>
              
              <View style={styles.ingredientsCard}>
                <Text style={styles.ingredientsText}>
                  {currentProduct.ingredients || 'No ingredients listed'}
                </Text>
              </View>
            </View>

            {/* E-additives */}
            {currentProduct.additives && currentProduct.additives.length > 0 && (
              <View style={styles.additivesCard}>
                <Text style={styles.ingredientsLabel}>{t('additives') || 'Additives'}</Text>
                <Text style={styles.ingredientsText}>
                  {currentProduct.additives.join(', ')}
                </Text>
              </View>
            )}

            {/* Allergens */}
            {currentProduct.allergens && currentProduct.allergens.length > 0 ? (
              <View style={styles.allergensCard}>
                <Text style={styles.ingredientsLabel}>{t('allergens') || 'Allergens'}</Text>
                <Text style={styles.ingredientsText}>
                  {currentProduct.allergens.join(', ')}
                </Text>
              </View>
            ) : (
              <View style={styles.noAllergensCard}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={[styles.ingredientsText, { marginLeft: 8, color: '#4CAF50' }]}>
                  {t('noAllergensListed') || 'No allergens listed'}
                </Text>
              </View>
            )}
          </ScrollView>
        );
        
      case 'reviews':
        return (
          <ScrollView style={styles.tabContainer} showsVerticalScrollIndicator={false}>
            <CommentSection productId={currentProduct.productId} />
          </ScrollView>
        );
        
      default:
        return null;
    }
  };

  const renderSimilarProducts = () => {
    if (!similarProducts || similarProducts.length === 0) {
      return (
        <View style={styles.noSimilarProductsContainer}>
          <Text style={styles.noSimilarProductsText}>{t('noSimilarProducts') || 'No similar products found'}</Text>
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
            <ProductCard product={item} onPress={(product) => navigation.navigate('ProductDetail', { productId: product.productId })} />
          </View>
        )}
        contentContainerStyle={styles.similarProductsList}
      />
    );
  };

  if (error && !currentProduct) {
    console.error('Product detail error:', error);
    return (
      <ErrorScreen 
        message={`${t('error') || 'Error'}. ${t('tryAgain') || 'Try again'}`} 
        onRetry={loadProductData} 
      />
    );
  }

  if (loading && !currentProduct) {
    return <LoadingScreen message={t('loading') || 'Loading...'} />;
  }

  if (!currentProduct) {
    console.log('No product found for ID:', productId);
    return (
      <ErrorScreen 
        message={t('noResults') || 'No results found'} 
        onRetry={loadProductData} 
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.productHeader}>
          <Image 
            source={{ uri: getProductImage(currentProduct.imageUrl ?? '') }} 
            style={styles.productImage}
            resizeMode="contain"
          />
          <View style={styles.productTitleContainer}>
            <View style={styles.productNameContainer}>
              <Text style={styles.productName}>{currentProduct.name}</Text>
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={toggleFavorite}
                disabled={localLoading}
              >
                {localLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Icon 
                    name={isFavorite ? "heart" : "heart-outline"} 
                    size={24} 
                    color="#fff"
                  />
                )}
              </TouchableOpacity>
            </View>
            
            <View style={styles.nutriScoreContainer}>
              <Text style={styles.nutriScoreLabel}>Nutri-Score:</Text>
              <View style={[
                styles.nutriScoreBadge,
                { backgroundColor: getNutriScoreBackgroundColor(currentProduct.nutriscoreGrade) }
              ]}>
                <Text style={[
                  styles.nutriScoreGrade,
                  { color: getNutriScoreTextColor(currentProduct.nutriscoreGrade) }
                ]}>
                  {currentProduct.nutriscoreGrade}
                </Text>
              </View>
            </View>

            {currentProduct.description && (
              <Text style={styles.productDescription}>{currentProduct.description}</Text>
            )}
          </View>
        </View>
        
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'nutrition' && styles.activeTab]}
            onPress={() => setActiveTab('nutrition')}
          >
            <Icon 
              name="nutrition" 
              size={20} 
              color={activeTab === 'nutrition' ? '#fff' : '#666'} 
            />
            <Text style={[styles.tabText, activeTab === 'nutrition' && styles.activeTabText]}>
              {t('nutritionShort') || 'KCPF'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'composition' && styles.activeTab]}
            onPress={() => setActiveTab('composition')}
          >
            <Icon 
              name="format-list-bulleted" 
              size={20} 
              color={activeTab === 'composition' ? '#fff' : '#666'} 
            />
            <Text style={[styles.tabText, activeTab === 'composition' && styles.activeTabText]}>
              {t('compositionShort') || 'Composition'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
            onPress={() => setActiveTab('reviews')}
          >
            <Icon 
              name="comment-text-outline" 
              size={20} 
              color={activeTab === 'reviews' ? '#fff' : '#666'} 
            />
            <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
              {t('reviewsShort') || 'Reviews'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {renderTabContent()}
        
        {/* Тимчасово приховано - Схожі продукти */}
        {/* <View style={styles.similarProductsSection}>
          <Text style={styles.similarProductsTitle}>{t('similarProducts') || 'Similar Products'}</Text>
          {renderSimilarProducts()}
        </View> */}
        
        <AdminInfo 
          product={currentProduct} 
          isVisible={currentUser?.role === 'admin'} 
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  productHeader: {
    padding: 16,
    backgroundColor: '#f8f9fa',
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
  productNameContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    flex: 1,
    marginRight: 12,
  },
  favoriteButton: {
    backgroundColor: '#34572a',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    flexShrink: 0,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  nutriScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nutriScoreLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
    color: '#333',
  },
  nutriScoreBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  nutriScoreGrade: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#34572a',
    shadowColor: '#34572a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '700',
  },
  tabContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#34572a',
  },
  portionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  nutritionCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  nutritionNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34572a',
    textAlign: 'center',
  },
  nutritionLabelCompact: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  detailsSection: {
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#34572a',
  },
  nutritionRowCompact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  nutritionLabelSmall: {
    fontSize: 14,
    color: '#333',
  },
  nutritionValueSmall: {
    fontSize: 14,
    fontWeight: '500',
    color: '#34572a',
  },
  wholeProductSection: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  wholeProductTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34572a',
    marginBottom: 12,
    textAlign: 'center',
  },
  wholeProductGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  wholeProductItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 12,
  },
  wholeProductLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  wholeProductValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#34572a',
    textAlign: 'center',
  },
  compositionSection: {
    marginBottom: 20,
  },
  compositionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  compositionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#34572a',
  },
  ingredientsCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#34572a',
  },
  ingredientsText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  additivesCard: {
    backgroundColor: '#ffebee',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF5722',
    marginBottom: 16,
  },
  allergensCard: {
    backgroundColor: '#fff3cd',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
    marginBottom: 16,
  },
  noAllergensCard: {
    backgroundColor: '#d4edda',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  noAllergensText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
    marginLeft: 8,
  },
  reviewsContainer: {
    padding: 16,
  },
  noCommentsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
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
    width: 280,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#34572a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34572a',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: '#fff',
  },

  productInfo: {
    padding: 16,
    backgroundColor: '#fff',
  },
  productBrand: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },

  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  ingredientsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#34572a',
  },
});

export default ProductDetailScreen; 