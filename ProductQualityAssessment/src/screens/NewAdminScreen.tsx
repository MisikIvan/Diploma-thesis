import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { getAllProducts, getAllUsers, blockUser, unblockUser, deleteProduct, addProduct } from '../api/firebase';
import { User, Product, ProductSubmission } from '../types/index';
import { t } from '../utils/translations';
import AddProductModal from '../components/AddProductModal';
import ProductSubmissionsScreen from './ProductSubmissionsScreen';
import { searchProducts } from '../redux/slices/productsSlice';

interface ExtendedUser extends User {
  canComment: boolean;
}

interface NewAdminScreenProps {
  navigation: any;
}

const NewAdminScreen: React.FC<NewAdminScreenProps> = ({ navigation }) => {
  // State
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Add product modal state
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // Product submissions state
  const [showSubmissionsScreen, setShowSubmissionsScreen] = useState(false);

  const currentUser = useAppSelector(state => state.user.currentUser);
  const dispatch = useAppDispatch();

  // Check admin access
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      Alert.alert(
        'Access Denied',
        'You do not have permission to access this page.',
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    }
  }, [currentUser, navigation]);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, productsData] = await Promise.all([
        getAllUsers(),
        getAllProducts()
      ]);
      
      setUsers(usersData || []);
      setProducts(productsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert(t('error'), t('errorLoadingData'));
    } finally {
      setLoading(false);
    }
  };

  const handleUserUpdate = async (user: User, updates: Partial<User>) => {
    if (!currentUser) return;

    if (updates.isBlocked !== undefined) {
      try {
        if (updates.isBlocked) {
          await blockUser(user.userId, currentUser.userId);
        } else {
          await unblockUser(user.userId, currentUser.userId);
        }
      } catch (error) {
        console.error('Error updating user block status:', error);
        Alert.alert(t('error'), t('failedToUpdateUserStatus'));
        return;
      }
    }

    setUsers(prev => prev.map(u => 
      u.userId === user.userId ? { ...u, ...updates } : u
    ));
  };

  const handleProductEdit = (product: Product) => {
    navigation.navigate('EditProduct', { product });
  };

  const handleProductDelete = async (productId: string) => {
    if (!currentUser) return;

    Alert.alert(
      t('confirmDelete'),
      t('deleteProductConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProduct(productId, currentUser.userId);
              setProducts(prev => prev.filter(p => p.productId !== productId));
              Alert.alert(t('success'), t('productDeletedSuccessfully'));
            } catch (error) {
              console.error('Error deleting product:', error);
              Alert.alert(t('error'), t('productDeleteError'));
            }
          }
        }
      ]
    );
  };


  const handleSubmissionApproved = async (submission: ProductSubmission, productData: Product) => {
    if (!currentUser) return;

    try {
  
      const savedProduct = await addProduct(
        {
          name: productData.name,
          brand: productData.brand || '',
          description: productData.description || '',
          imageUrl: productData.imageUrl || '',
          allergens: productData.allergens || [],
          additives: productData.additives || [],
          tags: productData.tags || [],
          nutriscoreGrade: productData.nutriscoreGrade || 'C',
          nutriments: productData.nutriments || {
            calories: 0,
            proteins: 0,
            carbohydrates: { total: 0, sugar: 0 },
            fats: { total: 0, saturated: 0, unsaturated: 0 },
            salt: 0
          },
          ingredients: productData.ingredients || '',
          isVegan: productData.isVegan || false,
          isVegetarian: productData.isVegetarian || false,
          hasLactose: productData.hasLactose || false,
          hasGluten: productData.hasGluten || false,
          weight: productData.weight || 0,
          createdBy: 'admin'
        },
        currentUser.userId
      );

     
      setProducts(prev => [...prev, savedProduct]);
      
      
      dispatch(searchProducts({ query: '', page: 1, pageSize: 100 }));
      
      Alert.alert(
        t('submissionApproved'), 
        t('productApprovedSuccessfully')
      );
      
    
      loadData();
      
    } catch (error) {
      console.error('Error creating approved product:', error);
      Alert.alert(t('error'), t('errorCreatingProductInDatabase'));
    }
  };

  const handleSubmissionRejected = (submissionId: string, reason: string) => {
    
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('adminPanel')}</Text>
        <View style={styles.headerRight}>
          <View style={styles.statusIndicator}>
            <Ionicons 
              name="cloud-done" 
              size={16} 
              color="#fff" 
            />
            <Text style={styles.statusText}>
              Live
            </Text>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Users Statistics */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>{t('userGrowth')}</Text>
          <View style={styles.mainStatCard}>
            <Text style={styles.mainStatValue}>{users.length}</Text>
            <Text style={styles.mainStatLabel}>{t('totalUsers')}</Text>
          </View>
        </View>

        {/* Users Search Section */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>{t('userManagement')}</Text>
          <Text style={styles.sectionSubtitle}>{t('searchAndManageUsers')}</Text>
          
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => navigation.navigate('UserSearch')}
          >
            <Ionicons name="people" size={20} color="#34572a" />
            <Text style={styles.searchButtonText}>{t('searchUsers')}</Text>
            <Ionicons name="chevron-forward" size={20} color="#34572a" />
          </TouchableOpacity>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{users.filter(u => u.role === 'admin').length}</Text>
              <Text style={styles.statLabel}>{t('admins')}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{users.filter(u => u.role === 'user').length}</Text>
              <Text style={styles.statLabel}>{t('users')}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{users.filter(u => u.isBlocked).length}</Text>
              <Text style={styles.statLabel}>{t('blocked')}</Text>
            </View>
          </View>
        </View>

        {/* Products Statistics */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>{t('productGrowth')}</Text>
          <View style={styles.mainStatCard}>
            <Text style={styles.mainStatValue}>{products.length}</Text>
            <Text style={styles.mainStatLabel}>{t('totalProducts')}</Text>
          </View>
        </View>

        {/* Products Search Section */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>{t('productManagement')}</Text>
          <Text style={styles.sectionSubtitle}>{t('searchAndManageProducts')}</Text>
          
          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => navigation.navigate('ProductSearch')}
            >
              <Ionicons name="search" size={20} color="#34572a" />
              <Text style={styles.searchButtonText}>{t('searchProducts')}</Text>
              <Ionicons name="chevron-forward" size={20} color="#34572a" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowAddProductModal(true)}
            >
              <Ionicons name="add-circle" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>{t('addProduct')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.submissionsButton]}
              onPress={() => setShowSubmissionsScreen(true)}
            >
              <Ionicons name="document-text" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>{t('reviewSubmissions')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <AddProductModal
        visible={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        onProductAdded={() => {
          setShowAddProductModal(false);
          loadData(); 
        }}
      />

      <ProductSubmissionsScreen
        visible={showSubmissionsScreen}
        onClose={() => setShowSubmissionsScreen(false)}
        onSubmissionApproved={handleSubmissionApproved}
        onSubmissionRejected={handleSubmissionRejected}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#34C759',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },

  content: {
    flex: 1,
    paddingTop: 8,
  },
  scrollContent: {
    paddingBottom: 120, 
  },
  searchSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f8f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#34572a',
    marginBottom: 8,
  },
  searchButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#34572a',
    fontWeight: '500',
    marginLeft: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  quickActions: {
    marginTop: 10,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34572a',
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  mainStatCard: {
    backgroundColor: '#f0f8f0',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#34572a',
  },
  mainStatValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#34572a',
    marginBottom: 8,
  },
  mainStatLabel: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  submissionsButton: {
    backgroundColor: '#FF9500',
  },
});

export default NewAdminScreen; 