import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  TextInput, 
  Modal, 
  ScrollView, 
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getAllProducts, getAllUsers, blockUser, unblockUser, toggleCommentPermission, deleteProduct, addProduct } from '../api/firebase';
import { User, Product, NutriScoreGrade } from '../types/index';
import { t } from '../utils/translations';
import AnimatedButton from '../components/ui/AnimatedButton';
import ImageUploader from '../components/ImageUploader';


interface ExtendedUser extends User {
  canComment: boolean;
}

interface AdminScreenProps {
  navigation: any;
}

// Mock data for demo mode
const MOCK_PRODUCTS: Product[] = [
  {
    productId: 'mock-product-1',
    name: 'Demo Product 1',
    imageUrl: 'https://via.placeholder.com/300x300?text=Demo+Product+1',
    nutriscoreGrade: 'A',
    ingredients: 'Water, sugar, salt',
    categories: ['beverages'],
    allergens: [],
    additives: [],
    nutriments: {
      calories: 100,
      proteins: 5,
      fats: { total: 2, saturated: 1 },
      carbohydrates: { total: 20, sugar: 10 },
      salt: 0.1
    },
    isVegan: true,
    isVegetarian: true,
    hasLactose: false,
    hasGluten: false,
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    productId: 'mock-product-2',
    name: 'Demo Product 2',
    imageUrl: 'https://via.placeholder.com/300x300?text=Demo+Product+2',
    nutriscoreGrade: 'B',
    ingredients: 'Milk, cocoa, sugar',
    categories: ['dairy'],
    allergens: ['milk'],
    additives: [],
    nutriments: {
      calories: 150,
      proteins: 8,
      fats: { total: 5, saturated: 3 },
      carbohydrates: { total: 15, sugar: 12 },
      salt: 0.2
    },
    isVegan: false,
    isVegetarian: true,
    hasLactose: true,
    hasGluten: false,
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const MOCK_USERS: ExtendedUser[] = [
  {
    userId: 'mock-user-1',
    email: 'demo@example.com',
    displayName: 'Demo User',
    avatarUrl: 'https://via.placeholder.com/50x50?text=User',
    authMethod: 'email',
    role: 'user',
    isBlocked: false,
    canComment: true
  },
  {
    userId: 'mock-user-2',
    email: 'admin@example.com',
    displayName: 'Admin User',
    avatarUrl: 'https://via.placeholder.com/50x50?text=Admin',
    authMethod: 'email',
    role: 'admin',
    isBlocked: false,
    canComment: true
  }
];

const AdminScreen: React.FC<AdminScreenProps> = ({ navigation }) => {
  // State
  const [activeTab, setActiveTab] = useState<'products' | 'users'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  
 
  
  // Product form state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    imageUrl: '',
    nutriscoreGrade: 'C' as NutriScoreGrade,
    ingredients: '',
    categories: [],
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

  const currentUser = useAppSelector(state => state.user.currentUser);
  
 
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      console.log('Unauthorized access attempt to AdminScreen');
      Alert.alert(
        t('accessDenied'), 
        t('accessDenied'), 
        [{ 
          text: 'OK', 
          onPress: () => navigation.navigate('Home')
        }]
      );
    }
  }, []);
  
 
  if (!currentUser || currentUser.role !== 'admin') {
    return <View style={styles.container}><ActivityIndicator size="large" /></View>;
  }
  
  useEffect(() => {
    initializeFirebase();
    
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => checkFirebaseConnection()}
          >
            <Ionicons name={isDemo ? 'cloud-offline' : 'cloud-done'} size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
    
    loadData();
    
    // Cleanup function
    return () => {
      setShowAddProductModal(false);
    };
  }, [activeTab]);

  const initializeFirebase = async () => {
    setLoading(true);
    try {
  
      const productsData = await getAllProducts();
      if (productsData && productsData.length > 0) {
    
        setIsDemo(false);
        setProducts(productsData);
        console.log('Using real Firebase mode with', productsData.length, 'products');
      } else {
    
        setIsDemo(false);
        setProducts([]);
        console.log('Using real Firebase mode with 0 products');
      }
    } catch (err) {
   
      console.error('Failed to connect to Firebase:', err);
      setError('Failed to connect to Firebase. Using demo mode.');
      setIsDemo(true);
      setProducts(MOCK_PRODUCTS);
      console.log('Using demo mode');
    } finally {
      setLoading(false);
    }
  };

  const checkFirebaseConnection = async () => {
    if (isDemo) {
      // Try to connect to Firebase
      setLoading(true);
      try {
        if (activeTab === 'products') {
          const productsData = await getAllProducts();
          if (productsData && productsData.length > 0) {
            setIsDemo(false);
            setProducts(productsData);
            setError(null);
            Alert.alert(t('success') || 'Success', t('firebaseConnected') || 'Connected to Firebase');
          }
        } else {
          const usersData = await getAllUsers();
          if (usersData && usersData.length > 0) {
            setIsDemo(false);
            setUsers(usersData as ExtendedUser[]);
            setError(null);
            Alert.alert(t('success') || 'Success', t('firebaseConnected') || 'Connected to Firebase');
          }
        }
      } catch (err) {
        console.error('Firebase connection check failed:', err);
        Alert.alert(t('error') || 'Error', t('firebaseConnectionFailed') || 'Failed to connect to Firebase');
      } finally {
        setLoading(false);
      }
    } else {
      // Switch to demo mode
      Alert.alert(
        t('confirmDemoMode') || 'Confirm Demo Mode',
        t('demoModeWarning') || 'Switch to demo mode?',
        [
          {
            text: t('cancel') || 'Cancel',
            style: 'cancel',
          },
          {
            text: t('confirm') || 'Confirm',
            onPress: () => {
              setIsDemo(true);
              setProducts(MOCK_PRODUCTS);
              setUsers(MOCK_USERS);
              Alert.alert(t('success') || 'Success', t('demoModeActivated') || 'Demo mode activated');
            },
          },
        ]
      );
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
  
    if (isDemo) {
      if (activeTab === 'products') {
        setProducts(MOCK_PRODUCTS);
      } else {
        setUsers(MOCK_USERS);
      }
      setLoading(false);
      return;
    }
    
    try {
      if (activeTab === 'products') {
        try {
          const productsData = await getAllProducts();
          setProducts(productsData);
          console.log('Successfully loaded', productsData.length, 'products from Firebase');
        } catch (err) {
          console.error('Error getting all products:', err);
          setError('Firebase permissions error. Please run diagnostics to fix Firebase permissions.');
          
       
          if (isDemo) {
            setProducts(MOCK_PRODUCTS);
          }
        }
      } else {
        try {
          const usersData = await getAllUsers();
          setUsers(usersData as ExtendedUser[]);
          console.log('Successfully loaded', usersData.length, 'users from Firebase');
        } catch (err) {
          console.error('Error getting users:', err);
          setError('Firebase permissions error. Please run diagnostics to fix Firebase permissions.');
          
       
          if (isDemo) {
            setUsers(MOCK_USERS);
          }
        }
      }
    } catch (err) {
      setError('Failed to load data. Please run diagnostics to fix Firebase permissions.');
      console.error('Admin screen error:', err);
      
    
      if (isDemo) {
        if (activeTab === 'products') {
          setProducts(MOCK_PRODUCTS);
        } else {
          setUsers(MOCK_USERS);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name) {
      Alert.alert('Error', 'Product name is required');
      return;
    }
    
    setLoading(true);
    
    try {
      if (currentUser?.userId) {
        if (isDemo) {
        
          Alert.alert(
            t('demoModeActive'),
            t('demoModeProductWarning'),
            [
              { text: t('cancel'), style: 'cancel' },
              { 
                text: t('tryFirebase'), 
                onPress: async () => {
                
                  try {
                    const newFirebaseProduct = await addProduct({
                      name: newProduct.name || '',
                      description: newProduct.description || '',
                      imageUrl: newProduct.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image',
                      nutriscoreGrade: newProduct.nutriscoreGrade || 'C',
                      ingredients: newProduct.ingredients || '',
                      categories: newProduct.categories || [],
                      allergens: newProduct.allergens || [],
                      additives: newProduct.additives || [],
                      createdBy: 'admin',
                      nutriments: newProduct.nutriments || {
                        calories: 0,
                        proteins: 0,
                        fats: { total: 0, saturated: 0 },
                        carbohydrates: { total: 0, sugar: 0 },
                        salt: 0
                      },
                      isVegan: newProduct.isVegan || false,
                      isVegetarian: newProduct.isVegetarian || false,
                      hasLactose: newProduct.hasLactose || false,
                      hasGluten: newProduct.hasGluten || false,
                      weight: newProduct.weight || 0
                    }, currentUser.userId);
                    
                  
                    Alert.alert(
                      t('success'),
                      t('firebaseProductAdded'),
                      [
                        { 
                          text: 'OK', 
                          onPress: () => {
                          
                            setIsDemo(false);
                          
                            loadData();
                       
                            setShowAddProductModal(false);
                         
                            resetProductForm();
                       
                            navigation.navigate('Home');
                          } 
                        }
                      ]
                    );
                  } catch (err) {
                    console.error('Error adding product to Firebase:', err);
                    
                    const mockProduct: Product = createMockProduct();
                    setProducts([mockProduct, ...products]);
                    Alert.alert(t('error'), t('firebaseConnectionFailed') + ' ' + t('productAddedLocally'));
                  
                    setShowAddProductModal(false);
                    resetProductForm();
                  }
                }
              },
              {
                text: t('continueDemo'),
                onPress: () => {
                
                  const mockProduct: Product = createMockProduct();
                  setProducts([mockProduct, ...products]);
                  Alert.alert(t('success'), t('productAddedLocally'));
                
                  setShowAddProductModal(false);
                  resetProductForm();
                }
              }
            ]
          );
        } else {
        
          await addProduct({
            name: newProduct.name || '',
            description: newProduct.description || '',
            imageUrl: newProduct.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image',
            nutriscoreGrade: newProduct.nutriscoreGrade || 'C',
            ingredients: newProduct.ingredients || '',
            categories: newProduct.categories || [],
            allergens: newProduct.allergens || [],
            additives: newProduct.additives || [],
            createdBy: 'admin',
            nutriments: newProduct.nutriments || {
              calories: 0,
              proteins: 0,
              fats: { total: 0, saturated: 0 },
              carbohydrates: { total: 0, sugar: 0 },
              salt: 0
            },
            isVegan: newProduct.isVegan || false,
            isVegetarian: newProduct.isVegetarian || false,
            hasLactose: newProduct.hasLactose || false,
            hasGluten: newProduct.hasGluten || false,
            weight: newProduct.weight || 0
          }, currentUser.userId);
          
          Alert.alert(
            t('success'), 
            t('productAdded'), 
            [
              {
                text: 'OK',
                onPress: () => {
                
                  setShowAddProductModal(false);
                  resetProductForm();
                  
                
                  navigation.navigate('Home');
                }
              }
            ]
          );
          
        
          loadData();
        }
      }
    } catch (err) {
      Alert.alert(t('error'), t('failedToAddProduct'));
      console.error('Add product error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  
  const createMockProduct = (): Product => {
    return {
      productId: `mock-product-${Date.now()}`,
      name: newProduct.name || '',
      description: newProduct.description || '',
      imageUrl: newProduct.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image',
      nutriscoreGrade: newProduct.nutriscoreGrade || 'C',
      ingredients: newProduct.ingredients || '',
      categories: newProduct.categories || [],
      allergens: newProduct.allergens || [],
      additives: newProduct.additives || [],
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nutriments: newProduct.nutriments || {
        calories: 0,
        proteins: 0,
        fats: { total: 0, saturated: 0 },
        carbohydrates: { total: 0, sugar: 0 },
        salt: 0
      },
      isVegan: newProduct.isVegan || false,
      isVegetarian: newProduct.isVegetarian || false,
      hasLactose: newProduct.hasLactose || false,
      hasGluten: newProduct.hasGluten || false,
      weight: newProduct.weight || 0
    };
  };
  

  const resetProductForm = () => {
    setNewProduct({
      name: '',
      description: '',
      imageUrl: '',
      nutriscoreGrade: 'C' as NutriScoreGrade,
      ingredients: '',
      categories: [],
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
      isVegan: false,
      isVegetarian: false,
      hasLactose: false,
      hasGluten: false,
      weight: 0
    });
  };

  const handleDeleteProduct = async (productId: string) => {
    Alert.alert(
      t('confirmDelete') || 'Confirm Delete',
      t('deleteProductConfirmation') || 'Are you sure you want to delete this product?',
      [
        {
          text: t('cancel') || 'Cancel',
          style: 'cancel',
        },
        {
          text: t('delete') || 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              if (isDemo) {
            
                setProducts(products.filter(p => p.productId !== productId));
                Alert.alert(t('success') || 'Success', 'Product deleted in demo mode');
              } else if (currentUser?.userId) {
              
                await deleteProduct(productId, currentUser.userId);
                setProducts(products.filter(p => p.productId !== productId));
                Alert.alert(t('success') || 'Success', 'Product deleted successfully');
              }
            } catch (err) {
              Alert.alert(t('error') || 'Error', 'Failed to delete product');
              console.error('Delete product error:', err);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleToggleUserBlock = async (user: ExtendedUser) => {
    if (!currentUser?.userId) return;
    
    setLoading(true);
    try {
      if (isDemo) {
      
        setUsers(users.map(u => 
          u.userId === user.userId 
            ? { ...u, isBlocked: !u.isBlocked } 
            : u
        ));
        Alert.alert('Success', `User ${user.isBlocked ? 'unblocked' : 'blocked'} in demo mode`);
      } else {
     
        if (user.isBlocked) {
          await unblockUser(user.userId, currentUser.userId);
        } else {
          await blockUser(user.userId, currentUser.userId);
        }
        
     
        setUsers(users.map(u => 
          u.userId === user.userId 
            ? { ...u, isBlocked: !u.isBlocked } 
            : u
        ));
      }
    } catch (err) {
      Alert.alert('Error', `Failed to ${user.isBlocked ? 'unblock' : 'block'} user`);
      console.error('Toggle user block error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCommentPermission = async (user: ExtendedUser) => {
    if (!currentUser?.userId) return;
    
    setLoading(true);
    try {
      if (isDemo) {
       
        setUsers(users.map(u => 
          u.userId === user.userId 
            ? { ...u, canComment: !u.canComment } 
            : u
        ));
        Alert.alert('Success', `Comment permission updated in demo mode`);
      } else {
    
        await toggleCommentPermission(user.userId, !user.canComment, currentUser.userId);
        
     
        setUsers(users.map(u => 
          u.userId === user.userId 
            ? { ...u, canComment: !u.canComment } 
            : u
        ));
      }
    } catch (err) {
      Alert.alert('Error', `Failed to update comment permissions`);
      console.error('Toggle comment permission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.itemCard}>
      <Image 
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image' }} 
        style={styles.productImage} 
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productBrand}>{item.createdBy}</Text>
        <View style={[styles.nutriscoreBadge, { backgroundColor: getNutriScoreColor(item.nutriscoreGrade) }]}>
          <Text style={styles.nutriscoreText}>{item.nutriscoreGrade}</Text>
        </View>
      </View>
      <View style={styles.productActions}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => {
            if (!loading) {
              navigation.navigate('EditProduct', { productId: item.productId });
            }
          }}
          disabled={loading}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => {
            if (!loading) {
              handleDeleteProduct(item.productId);
            }
          }}
          disabled={loading}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderUserItem = ({ item }: { item: ExtendedUser }) => (
    <View style={styles.itemCard}>
      <Image 
        source={{ uri: item.avatarUrl || 'https://via.placeholder.com/50x50?text=User' }} 
        style={styles.userAvatar} 
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.displayName}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userRole}>{t('role')}: {item.role}</Text>
      </View>
      <View style={styles.userActions}>
        <TouchableOpacity 
          style={[styles.actionButton, item.isBlocked ? styles.unblockButton : styles.blockButton]}
          onPress={() => handleToggleUserBlock(item)}
        >
          <Text style={styles.actionButtonText}>
            {item.isBlocked ? t('unblockUser') : t('blockUser')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, item.canComment ? styles.disableButton : styles.enableButton]}
          onPress={() => handleToggleCommentPermission(item)}
        >
          <Text style={styles.actionButtonText}>
            {item.canComment ? t('disableComments') : t('enableComments')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAddProductModal = () => (
    <Modal
      visible={showAddProductModal}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t('addNewProduct')}</Text>
          
          <ScrollView style={styles.formContainer}>
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
              placeholder="Детальний опис продукту..."
              multiline
              numberOfLines={3}
            />
            
            <ImageUploader
              onImageUploaded={(imageUrl) => setNewProduct({...newProduct, imageUrl})}
              currentImageUrl={newProduct.imageUrl}
            />
            
            <Text style={styles.inputLabel}>{t('productImageUrl')} (альтернативно)</Text>
            <TextInput
              style={styles.input}
              value={newProduct.imageUrl}
              onChangeText={(text) => setNewProduct({...newProduct, imageUrl: text})}
              placeholder="https://example.com/image.jpg"
            />
            
            <Text style={styles.inputLabel}>{t('weight')} (г)</Text>
            <TextInput
              style={styles.input}
              value={newProduct.weight?.toString()}
              onChangeText={(text) => {
                const weight = parseFloat(text) || 0;
                setNewProduct({...newProduct, weight});
              }}
              placeholder="0"
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
              placeholder="0"
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
              placeholder="0"
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
              placeholder="0"
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
              placeholder="0"
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
              placeholder="0"
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
              placeholder="0"
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
              placeholder="0"
              keyboardType="numeric"
            />
            
            <Text style={styles.sectionTitle}>{t('perWholeProduct')}</Text>
            <Text style={styles.inputHelper}>{t('calculatedAutomatically')}</Text>
            
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
              placeholder="Молоко, яйця, глютен..."
            />
            
            <Text style={styles.inputLabel}>{t('additives')}</Text>
            <TextInput
              style={styles.input}
              value={newProduct.additives?.join(', ')}
              onChangeText={(text) => setNewProduct({
                ...newProduct, 
                additives: text.split(',').map(additive => additive.trim()).filter(additive => additive)
              })}
              placeholder="E100, E200..."
            />
            
            <Text style={styles.inputLabel}>{t('categories')}</Text>
            <TextInput
              style={styles.input}
              value={newProduct.categories?.join(', ')}
              onChangeText={(text) => setNewProduct({
                ...newProduct, 
                categories: text.split(',').map(cat => cat.trim()).filter(cat => cat)
              })}
              placeholder={`${t('dairyCategory')}, ${t('beverageCategory')}`}
            />
            
            <Text style={styles.sectionTitle}>{t('dietaryInfo')}</Text>
            
            <View style={styles.checkboxRow}>
              <TouchableOpacity 
                style={styles.checkbox}
                onPress={() => setNewProduct({...newProduct, isVegan: !newProduct.isVegan})}
              >
                <View style={[
                  styles.checkboxInner, 
                  newProduct.isVegan && styles.checkboxChecked
                ]}>
                  {newProduct.isVegan && <Ionicons name="checkmark" size={16} color="#fff" />}
                </View>
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>{t('vegan')}</Text>
            </View>
            
            <View style={styles.checkboxRow}>
              <TouchableOpacity 
                style={styles.checkbox}
                onPress={() => setNewProduct({...newProduct, isVegetarian: !newProduct.isVegetarian})}
              >
                <View style={[
                  styles.checkboxInner, 
                  newProduct.isVegetarian && styles.checkboxChecked
                ]}>
                  {newProduct.isVegetarian && <Ionicons name="checkmark" size={16} color="#fff" />}
                </View>
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>{t('vegetarian')}</Text>
            </View>
            
            <View style={styles.checkboxRow}>
              <TouchableOpacity 
                style={styles.checkbox}
                onPress={() => setNewProduct({...newProduct, hasLactose: !newProduct.hasLactose})}
              >
                <View style={[
                  styles.checkboxInner, 
                  newProduct.hasLactose && styles.checkboxChecked
                ]}>
                  {newProduct.hasLactose && <Ionicons name="checkmark" size={16} color="#fff" />}
                </View>
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>{t('containsLactose')}</Text>
            </View>
            
            <View style={styles.checkboxRow}>
              <TouchableOpacity 
                style={styles.checkbox}
                onPress={() => setNewProduct({...newProduct, hasGluten: !newProduct.hasGluten})}
              >
                <View style={[
                  styles.checkboxInner, 
                  newProduct.hasGluten && styles.checkboxChecked
                ]}>
                  {newProduct.hasGluten && <Ionicons name="checkmark" size={16} color="#fff" />}
                </View>
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>{t('containsGluten')}</Text>
            </View>
          </ScrollView>
          
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={() => setShowAddProductModal(false)}
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

  return (
    <View style={styles.container}>
      {isDemo && (
        <View style={styles.demoBanner}>
          <Text style={styles.demoBannerText}>{t('demoMode')}</Text>
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'products' && styles.activeTab]} 
          onPress={() => {
            if (!loading) {
              setActiveTab('products');
              loadData();
            }
          }}
          disabled={loading}
        >
          <Text style={[styles.tabText, activeTab === 'products' && styles.activeTabText]}>
            {t('products')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'users' && styles.activeTab]} 
          onPress={() => {
            if (!loading) {
              setActiveTab('users');
              loadData();
            }
          }}
          disabled={loading}
        >
          <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>
            {t('users')}
          </Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#34572a" />
        </View>
      ) : error ? (
        <View style={styles.centeredErrorContainer}>
          <Text style={styles.centeredErrorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadData}>
            <Text style={styles.retryButtonText}>{t('retry')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {activeTab === 'products' && (
            <>
              <FlatList
                data={products}
                renderItem={renderProductItem}
                keyExtractor={(item) => item.productId}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>{t('noResults')}</Text>
                  </View>
                }
              />
              <TouchableOpacity 
                style={styles.floatingButton}
                onPress={() => {
                  if (!loading) {
                    setShowAddProductModal(true);
                  }
                }}
                disabled={loading}
              >
                <Ionicons name="add" size={32} color="white" />
              </TouchableOpacity>
            </>
          )}
          
          {activeTab === 'users' && (
            <FlatList
              data={users}
              renderItem={renderUserItem}
              keyExtractor={(item) => item.userId}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>{t('noResults')}</Text>
                </View>
              }
            />
          )}
        </>
      )}
      
      {renderAddProductModal()}
      
      {/*  */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerButton: {
    backgroundColor: '#34572a',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  demoBanner: {
    backgroundColor: '#FF9800',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  demoBannerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorText: {
    color: '#dc3545',
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#34572a',
  },
  tabText: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    fontWeight: '500',
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f1f3f4',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  nutriscoreBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  nutriscoreText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  deleteButton: {
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#dc3545',
    borderRadius: 8,
    marginLeft: 8,
  },
  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#007bff',
    borderRadius: 8,
    marginLeft: 8,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#34572a',
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 12,
    color: '#495057',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  userActions: {
    justifyContent: 'center',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    minWidth: 80,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  blockButton: {
    backgroundColor: '#dc3545',
  },
  unblockButton: {
    backgroundColor: '#28a745',
  },
  enableButton: {
    backgroundColor: '#17a2b8',
  },
  disableButton: {
    backgroundColor: '#fd7e14',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#34572a',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#34572a',
  },
  formContainer: {
    maxHeight: 500,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
    color: '#495057',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  nutriScoreSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  nutriScoreOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  nutriScoreOptionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
  },
  selectedNutriScoreText: {
    color: '#fff',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  saveButton: {
    backgroundColor: '#34572a',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  centeredErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  centeredErrorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  retryButton: {
    backgroundColor: '#34572a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34572a',
    marginTop: 24,
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#34572a',
    paddingBottom: 8,
  },
  indentedLabel: {
    marginLeft: 16,
    color: '#6c757d',
    fontSize: 14,
  },
  indentedInput: {
    marginLeft: 16,
    width: '90%',
  },
  inputHelper: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#fff',
  },
  checkboxInner: {
    width: 20,
    height: 20,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#34572a',
    borderColor: '#34572a',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '500',
  },
});

export default AdminScreen; 