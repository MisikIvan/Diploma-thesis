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
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { RootStackParamList } from '../types/navigation';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getProductDetails, getSimilarProducts, updateProductFavoriteStatus } from '../redux/slices/productsSlice';
import {
  formatDate,
  getProductImage,
  formatNutrient,
  calculateWholeProduct,
  truncateText,
} from '../utils/helpers';
import { Product, getNutriScoreColor, Favorite } from '../types/index';
import ProductCard from '../components/ProductCard';
import CommentSection from '../components/CommentSection';
import LoadingScreen from '../components/LoadingScreen';
import ErrorScreen from '../components/ErrorScreen';
import { t } from '../utils/translations';
import { DataService } from '../utils/dataService';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

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
  const [productFetchRetried, setProductFetchRetried] = useState<boolean>(false);
  
  const { currentProduct, similarProducts, loading, error } = useAppSelector((state) => state.products);
  const { currentUser } = useAppSelector(state => state.user);


  const loadProductData = useCallback(() => {
    setProductFetchRetried(true);
    dispatch(getProductDetails(productId))
      .unwrap()
      .then(() => {
        dispatch(getSimilarProducts(productId));
      })
      .catch(err => {
        console.error('Error fetching product:', err);
   
        ToastAndroid.show('Could not load product details. Trying offline mode...', ToastAndroid.SHORT);
      });
  }, [dispatch, productId]);

  useEffect(() => {
    loadProductData();
    

    checkFavoriteStatus();
  }, [loadProductData, currentUser]);

  const checkFavoriteStatus = async () => {
    if (!currentUser) {
      setIsFavorite(false);
      return;
    }
    
    try {
      console.log(`Checking favorite status for product: ${productId} and user: ${currentUser.userId}`);
      
    
      const userFavorites = await DataService.favorites.getUserFavorites(currentUser.userId);
      
   
      const isProductFavorite = userFavorites.some(fav => fav.productId === productId);
      
      console.log(`Checked favorite status for ${productId}: ${isProductFavorite} (found in ${userFavorites.length} favorites)`);
      setIsFavorite(isProductFavorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!currentUser) {
      navigation.navigate('Auth');
      return;
    }

    try {
      setLocalLoading(true);
      console.log(`Toggling favorite for product: ${productId} from ${isFavorite} to ${!isFavorite}`);
      
      const newFavoriteStatus = !isFavorite;
      
      if (newFavoriteStatus) {
      
        const favorite: Favorite = {
          favoriteId: '', 
          userId: currentUser.userId,
          productId: productId,
          addedAt: new Date().toISOString()
        };
        await DataService.favorites.addFavorite(favorite);
        console.log(`Added product ${productId} to favorites`);
      } else {
    
        await DataService.favorites.removeFavorite(currentUser.userId, productId);
        console.log(`Removed product ${productId} from favorites`);
        
      
        await new Promise(resolve => setTimeout(resolve, 800));
        
   
        const stillFavorite = await DataService.favorites.isFavorite(currentUser.userId, productId);
        if (stillFavorite) {
          console.error(`Failed to remove favorite - still exists in system!`);
          
      
          console.log('Attempting removal again with longer timeout...');
          await DataService.favorites.removeFavorite(currentUser.userId, productId);
          await new Promise(resolve => setTimeout(resolve, 1500));
          
    
          const finalCheck = await DataService.favorites.isFavorite(currentUser.userId, productId);
          if (finalCheck) {
            Alert.alert('Error', 'Failed to remove from favorites. Please try again later.');
            setIsFavorite(true); 
            setLocalLoading(false);
            return;
          }
        }
      }
      
  
      await checkFavoriteStatus();
      
  
      dispatch(updateProductFavoriteStatus({
        productId,
        isFavorite: newFavoriteStatus
      }));
      
   
      ToastAndroid.show(
        newFavoriteStatus ? 'Added to favorites' : 'Removed from favorites',
        ToastAndroid.SHORT
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorites');
      
   
      await checkFavoriteStatus();
    } finally {
      setLocalLoading(false);
    }
  };

  const renderTabContent = () => {
    if (!currentProduct) return null;
    
    switch (activeTab) {
      case 'nutrition':
        return (
          <ScrollView style={styles.tabContainer} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>{t('nutritionalFacts')}</Text>
            <Text style={styles.portionText}>На 100г продукту</Text>
            
            {/* Основні макронутрієнти */}
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionCard}>
                <Text style={styles.nutritionNumber}>
                  {formatNutrient(currentProduct.nutriments.calories, 'kcal')}
                </Text>
                <Text style={styles.nutritionLabelCompact}>{t('calories')}</Text>
              </View>
              
              <View style={styles.nutritionCard}>
                <Text style={styles.nutritionNumber}>
                  {formatNutrient(currentProduct.nutriments.proteins)}
                </Text>
                <Text style={styles.nutritionLabelCompact}>{t('proteins')}</Text>
              </View>
              
              <View style={styles.nutritionCard}>
                <Text style={styles.nutritionNumber}>
                  {formatNutrient(currentProduct.nutriments.carbohydrates.total)}
                </Text>
                <Text style={styles.nutritionLabelCompact}>{t('carbs')}</Text>
              </View>
              
              <View style={styles.nutritionCard}>
                <Text style={styles.nutritionNumber}>
                  {formatNutrient(currentProduct.nutriments.fats.total)}
                </Text>
                <Text style={styles.nutritionLabelCompact}>{t('fats')}</Text>
              </View>
            </View>

            {/* Детальна інформація */}
            <View style={styles.detailsSection}>
              <Text style={styles.detailsTitle}>Детальний склад</Text>
              
              <View style={styles.nutritionRowCompact}>
                <Text style={styles.nutritionLabelSmall}>{t('sugar')}</Text>
                <Text style={styles.nutritionValueSmall}>
                  {formatNutrient(currentProduct.nutriments.carbohydrates.sugar)}
                </Text>
              </View>

              <View style={styles.nutritionRowCompact}>
                <Text style={styles.nutritionLabelSmall}>{t('saturatedFats')}</Text>
                <Text style={styles.nutritionValueSmall}>
                  {formatNutrient(currentProduct.nutriments.fats.saturated)}
                </Text>
              </View>

              <View style={styles.nutritionRowCompact}>
                <Text style={styles.nutritionLabelSmall}>{t('salt')}</Text>
                <Text style={styles.nutritionValueSmall}>
                  {formatNutrient(currentProduct.nutriments.salt)}
                </Text>
              </View>
            </View>

            {currentProduct.weight && (
              <View style={styles.wholeProductSection}>
                <Text style={styles.wholeProductTitle}>
                  {t('wholeProduct')} ({currentProduct.weight}г)
                </Text>
                
                <View style={styles.wholeProductGrid}>
                  <View style={styles.wholeProductItem}>
                    <Text style={styles.wholeProductLabel}>{t('calories')}</Text>
                    <Text style={styles.wholeProductValue}>
                      {formatNutrient(
                        calculateWholeProduct(currentProduct.nutriments.calories, currentProduct.weight) ?? undefined,
                        'kcal'
                      )}
                    </Text>
                  </View>
                  
                  <View style={styles.wholeProductItem}>
                    <Text style={styles.wholeProductLabel}>{t('proteins')}</Text>
                    <Text style={styles.wholeProductValue}>
                      {formatNutrient(
                        calculateWholeProduct(currentProduct.nutriments.proteins, currentProduct.weight) ?? undefined
                      )}
                    </Text>
                  </View>
                  
                  <View style={styles.wholeProductItem}>
                    <Text style={styles.wholeProductLabel}>{t('carbs')}</Text>
                    <Text style={styles.wholeProductValue}>
                      {formatNutrient(
                        calculateWholeProduct(currentProduct.nutriments.carbohydrates.total, currentProduct.weight) ?? undefined
                      )}
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
            {/* Інгредієнти */}
            <View style={styles.compositionSection}>
              <View style={styles.compositionHeader}>
                <Icon name="format-list-bulleted" size={20} color="#34572a" />
                <Text style={styles.compositionTitle}>{t('composition')}</Text>
              </View>
              <View style={styles.ingredientsCard}>
                <Text style={styles.ingredientsText}>{currentProduct.ingredients}</Text>
              </View>
            </View>
            
            {/* Алергени */}
            <View style={styles.compositionSection}>
              <View style={styles.compositionHeader}>
                <Icon name="alert-circle-outline" size={20} color="#FF9800" />
                <Text style={styles.compositionTitle}>{t('allergens')}</Text>
              </View>
              {currentProduct.allergens && currentProduct.allergens.length > 0 ? (
                <View style={styles.allergensCard}>
                  <View style={styles.allergensList}>
                    {currentProduct.allergens.map((allergen, index) => (
                      <View key={index} style={styles.allergenTag}>
                        <Icon name="alert" size={14} color="#FF9800" />
                        <Text style={styles.allergenText}>{allergen}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : (
                <View style={styles.noAllergensCard}>
                  <Icon name="check-circle" size={20} color="#4CAF50" />
                  <Text style={styles.noAllergensText}>{t('noAllergensListed')}</Text>
                </View>
              )}
            </View>

            {/* Дієтична інформація */}
            <View style={styles.compositionSection}>
              <View style={styles.compositionHeader}>
                <Icon name="leaf" size={20} color="#4CAF50" />
                <Text style={styles.compositionTitle}>{t('dietaryInfo')}</Text>
              </View>
              <View style={styles.dietaryCard}>
                <View style={styles.dietaryGrid}>
                  <View style={styles.dietaryItem}>
                    <Icon 
                      name={currentProduct.isVegan ? 'check-circle' : 'close-circle'} 
                      size={24} 
                      color={currentProduct.isVegan ? '#4CAF50' : '#F44336'} 
                    />
                    <Text style={[
                      styles.dietaryText,
                      { color: currentProduct.isVegan ? '#4CAF50' : '#F44336' }
                    ]}>
                      {t('vegan')}
                    </Text>
                  </View>
                  
                  <View style={styles.dietaryItem}>
                    <Icon 
                      name={currentProduct.isVegetarian ? 'check-circle' : 'close-circle'} 
                      size={24} 
                      color={currentProduct.isVegetarian ? '#4CAF50' : '#F44336'} 
                    />
                    <Text style={[
                      styles.dietaryText,
                      { color: currentProduct.isVegetarian ? '#4CAF50' : '#F44336' }
                    ]}>
                      {t('vegetarian')}
                    </Text>
                  </View>
                  
                  <View style={styles.dietaryItem}>
                    <Icon 
                      name={!currentProduct.hasLactose ? 'check-circle' : 'close-circle'} 
                      size={24} 
                      color={!currentProduct.hasLactose ? '#4CAF50' : '#F44336'} 
                    />
                    <Text style={[
                      styles.dietaryText,
                      { color: !currentProduct.hasLactose ? '#4CAF50' : '#F44336' }
                    ]}>
                      {t('lactoseFree')}
                    </Text>
                  </View>
                  
                  <View style={styles.dietaryItem}>
                    <Icon 
                      name={!currentProduct.hasGluten ? 'check-circle' : 'close-circle'} 
                      size={24} 
                      color={!currentProduct.hasGluten ? '#4CAF50' : '#F44336'} 
                    />
                    <Text style={[
                      styles.dietaryText,
                      { color: !currentProduct.hasGluten ? '#4CAF50' : '#F44336' }
                    ]}>
                      {t('glutenFree')}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        );
        
      case 'reviews':
        return (
          <View style={styles.reviewsContainer}>
            <CommentSection productId={productId} />
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


  if (error && currentProduct && productFetchRetried) {
  
    console.log('Showing product despite error, using cached data');

  } else if (error && !currentProduct) {
    console.error('Product detail error:', error);
    return (
      <ErrorScreen 
        message={`${t('error')}. ${t('tryAgain')}`} 
        onRetry={loadProductData} 
      />
    );
  }

  if (loading && !currentProduct) {
    return <LoadingScreen message={t('loading')} />;
  }

  if (!currentProduct) {
    console.log('No product found for ID:', productId);
    return (
      <ErrorScreen 
        message={t('noResults')} 
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

            {currentProduct.description && (
              <Text style={styles.productDescription}>{currentProduct.description}</Text>
            )}
          </View>
        </View>
        
        <View style={styles.tabsContainer}>
          <AnimatedTouchableOpacity
            style={[
              styles.tabButton,
              { backgroundColor: activeTab === 'nutrition' ? '#fff' : 'transparent' }
            ]}
            onPress={() => setActiveTab('nutrition')}
          >
            <Icon 
              name="nutrition" 
              size={18} 
              color={activeTab === 'nutrition' ? '#34572a' : '#fff'} 
            />
            {activeTab === 'nutrition' && (
              <Animated.Text
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
                style={styles.activeTabText}
              >
                {t('nutritionShort')}
              </Animated.Text>
            )}
          </AnimatedTouchableOpacity>
          
          <AnimatedTouchableOpacity
            style={[
              styles.tabButton,
              { backgroundColor: activeTab === 'composition' ? '#fff' : 'transparent' }
            ]}
            onPress={() => setActiveTab('composition')}
          >
            <Icon 
              name="format-list-bulleted" 
              size={18} 
              color={activeTab === 'composition' ? '#34572a' : '#fff'} 
            />
            {activeTab === 'composition' && (
              <Animated.Text
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
                style={styles.activeTabText}
              >
                {t('compositionShort')}
              </Animated.Text>
            )}
          </AnimatedTouchableOpacity>
          
          <AnimatedTouchableOpacity
            style={[
              styles.tabButton,
              { backgroundColor: activeTab === 'reviews' ? '#fff' : 'transparent' }
            ]}
            onPress={() => setActiveTab('reviews')}
          >
            <Icon 
              name="comment-text-outline" 
              size={18} 
              color={activeTab === 'reviews' ? '#34572a' : '#fff'} 
            />
            {activeTab === 'reviews' && (
              <Animated.Text
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
                style={styles.activeTabText}
              >
                {t('reviewsShort')}
              </Animated.Text>
            )}
          </AnimatedTouchableOpacity>
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
  productNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  favoriteButton: {
    backgroundColor: '#34572a',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderRadius: 8,
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#34572a',
    width: '85%',
    alignSelf: 'center',
    marginVertical: 20,
    borderRadius: 40,
    paddingHorizontal: 8,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 8,
    borderRadius: 30,
    marginHorizontal: 2,
    minWidth: 0,
  },
  activeTabText: {
    color: '#34572a',
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 11,
    flexShrink: 1,
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
  },
  allergenTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  allergenText: {
    color: '#FF9800',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  noAllergensText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
    marginLeft: 8,
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
  subsectionTitle: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  portionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34572a',
    marginBottom: 4,
  },
  nutritionLabelCompact: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  detailsSection: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
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
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  nutritionLabelSmall: {
    fontSize: 14,
    color: '#555',
  },
  nutritionValueSmall: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34572a',
  },
  wholeProductSection: {
    backgroundColor: '#e8f5e8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  wholeProductTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#34572a',
    textAlign: 'center',
  },
  wholeProductGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  wholeProductItem: {
    alignItems: 'center',
    flex: 1,
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
  allergensCard: {
    backgroundColor: '#fff3cd',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
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
  dietaryCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  dietaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dietaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 8,
  },
  dietaryText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
  reviewsContainer: {
    padding: 16,
  },
});

export default ProductDetailScreen; 