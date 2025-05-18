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
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getAllProducts, getAllUsers, blockUser, unblockUser, toggleCommentPermission, deleteProduct, addProduct } from '../api/firebase';
import { User, Product, NutriScoreGrade } from '../types/index';
import { t } from '../utils/translations';

// Extend the User type to include canComment property
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
    imageUrl: '',
    nutriscoreGrade: 'C' as NutriScoreGrade,
    ingredients: '',
    categories: [],
  });

  // Current user from Redux
  const currentUser = useAppSelector(state => state.user.currentUser);
  
  // Load data on component mount
  useEffect(() => {
    if (currentUser?.role !== 'admin') {
      Alert.alert(t('accessDenied'), t('accessDenied'));
      navigation.goBack();
      return;
    }
    
    // Set navigation options with Firebase diagnostics button
    navigation.setOptions({
      title: t('adminScreen'),
      headerRight: () => (
        <TouchableOpacity
          style={styles.diagnosticButton}
          onPress={() => navigation.navigate('FirebaseDiagnostic')}
        >
          <Text style={styles.diagnosticButtonText}>
            <Ionicons name="medical" size={16} color="#fff" /> {t('diagnostics')}
          </Text>
        </TouchableOpacity>
      ),
    });
    
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (activeTab === 'products') {
        try {
          const productsData = await getAllProducts();
          setProducts(productsData);
        } catch (err) {
          console.error('Error getting all products:', err);
          setError('Firebase permissions error. Please run diagnostics to fix Firebase permissions.');
          setIsDemo(false); // Keep trying to use Firebase
        }
      } else {
        try {
          const usersData = await getAllUsers();
          setUsers(usersData as ExtendedUser[]);
        } catch (err) {
          console.error('Error getting users:', err);
          setError('Firebase permissions error. Please run diagnostics to fix Firebase permissions.');
          setIsDemo(false); // Keep trying to use Firebase
        }
      }
    } catch (err) {
      setError('Failed to load data. Please run diagnostics to fix Firebase permissions.');
      console.error('Admin screen error:', err);
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
          // In demo mode, just add to local state
          const mockProduct: Product = {
            productId: `mock-product-${Date.now()}`,
            name: newProduct.name || '',
            imageUrl: newProduct.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image',
            nutriscoreGrade: newProduct.nutriscoreGrade || 'C',
            ingredients: newProduct.ingredients || '',
            categories: newProduct.categories || [],
            allergens: [],
            additives: [],
            createdBy: 'admin',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            nutriments: {
              calories: 0,
              proteins: 0,
              fats: { total: 0, saturated: 0 },
              carbohydrates: { total: 0, sugar: 0 },
              salt: 0
            },
            isVegan: false,
            isVegetarian: false,
            hasLactose: false,
            hasGluten: false,
          };
          
          setProducts([mockProduct, ...products]);
          Alert.alert('Success', 'Product added in demo mode');
        } else {
          // Real mode - use Firebase
          await addProduct({
            name: newProduct.name || '',
            imageUrl: newProduct.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image',
            nutriscoreGrade: newProduct.nutriscoreGrade || 'C',
            ingredients: newProduct.ingredients || '',
            categories: newProduct.categories || [],
            allergens: [],
            additives: [],
            createdBy: 'admin',
            nutriments: {
              calories: 0,
              proteins: 0,
              fats: { total: 0, saturated: 0 },
              carbohydrates: { total: 0, sugar: 0 },
              salt: 0
            },
            isVegan: false,
            isVegetarian: false,
            hasLactose: false,
            hasGluten: false,
          }, currentUser.userId);
          
          // Reload products
          loadData();
        }
        
        setShowAddProductModal(false);
        setNewProduct({
          name: '',
          imageUrl: '',
          nutriscoreGrade: 'C' as NutriScoreGrade,
          ingredients: '',
          categories: [],
        });
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to add product');
      console.error('Add product error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    Alert.alert(
      t('confirmDelete'),
      t('deleteProductConfirmation'),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('delete'), 
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              if (isDemo) {
                // In demo mode, just remove from local state
                setProducts(products.filter(p => p.productId !== productId));
                Alert.alert('Success', 'Product deleted in demo mode');
              } else if (currentUser?.userId) {
                // Real mode - use Firebase
                await deleteProduct(productId, currentUser.userId);
                setProducts(products.filter(p => p.productId !== productId));
              }
            } catch (err) {
              Alert.alert('Error', 'Failed to delete product');
              console.error('Delete product error:', err);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleToggleUserBlock = async (user: ExtendedUser) => {
    if (!currentUser?.userId) return;
    
    setLoading(true);
    try {
      if (isDemo) {
        // In demo mode, just update local state
        setUsers(users.map(u => 
          u.userId === user.userId 
            ? { ...u, isBlocked: !u.isBlocked } 
            : u
        ));
        Alert.alert('Success', `User ${user.isBlocked ? 'unblocked' : 'blocked'} in demo mode`);
      } else {
        // Real mode - use Firebase
        if (user.isBlocked) {
          await unblockUser(user.userId, currentUser.userId);
        } else {
          await blockUser(user.userId, currentUser.userId);
        }
        
        // Update local state
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
        // In demo mode, just update local state
        setUsers(users.map(u => 
          u.userId === user.userId 
            ? { ...u, canComment: !u.canComment } 
            : u
        ));
        Alert.alert('Success', `Comment permission updated in demo mode`);
      } else {
        // Real mode - use Firebase
        await toggleCommentPermission(user.userId, !user.canComment, currentUser.userId);
        
        // Update local state
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
        <View style={styles.nutriscoreBadge}>
          <Text style={styles.nutriscoreText}>{item.nutriscoreGrade}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDeleteProduct(item.productId)}
      >
        <Ionicons name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
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
            
            <Text style={styles.inputLabel}>{t('productImageUrl')}</Text>
            <TextInput
              style={styles.input}
              value={newProduct.imageUrl}
              onChangeText={(text) => setNewProduct({...newProduct, imageUrl: text})}
              placeholder="https://example.com/image.jpg"
            />
            
            <Text style={styles.inputLabel}>{t('nutriscoreGrade')}</Text>
            <View style={styles.nutriScoreSelector}>
              {['A', 'B', 'C', 'D', 'E'].map((grade) => (
                <TouchableOpacity
                  key={grade}
                  style={[
                    styles.nutriScoreOption,
                    newProduct.nutriscoreGrade === grade && styles.selectedNutriScore
                  ]}
                  onPress={() => setNewProduct({...newProduct, nutriscoreGrade: grade as NutriScoreGrade})}
                >
                  <Text style={styles.nutriScoreOptionText}>{grade}</Text>
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('adminScreen')}</Text>
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.diagnosticButton} 
            onPress={() => navigation.navigate('FirebaseDiagnostic')}
          >
            <Text style={styles.diagnosticButtonText}>
              <Ionicons name="medical" size={16} color="#fff" /> {t('diagnostics')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'products' && styles.activeTab]} 
          onPress={() => {
            setActiveTab('products');
            loadData();
          }}
        >
          <Text style={[styles.tabText, activeTab === 'products' && styles.activeTabText]}>
            {t('products')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'users' && styles.activeTab]} 
          onPress={() => {
            setActiveTab('users');
            loadData();
          }}
        >
          <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>
            {t('users')}
          </Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
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
                onPress={() => setShowAddProductModal(true)}
              >
                <Ionicons name="add" size={30} color="white" />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    padding: 10,
    backgroundColor: '#ffefef',
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b6b',
  },
  errorText: {
    color: '#e53e3e',
    marginBottom: 10,
  },
  diagnosticButton: {
    backgroundColor: '#3182ce',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  diagnosticButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productBrand: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  nutriscoreBadge: {
    backgroundColor: '#4CAF50',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 8,
  },
  nutriscoreText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    justifyContent: 'center',
    padding: 8,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  userRole: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  userActions: {
    justifyContent: 'center',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  blockButton: {
    backgroundColor: '#F44336',
  },
  unblockButton: {
    backgroundColor: '#4CAF50',
  },
  enableButton: {
    backgroundColor: '#2196F3',
  },
  disableButton: {
    backgroundColor: '#FF9800',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    maxHeight: 400,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  nutriScoreSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  nutriScoreOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  selectedNutriScore: {
    backgroundColor: '#4CAF50',
  },
  nutriScoreOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  saveButton: {
    backgroundColor: '#007AFF',
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
  },
  centeredErrorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AdminScreen; 