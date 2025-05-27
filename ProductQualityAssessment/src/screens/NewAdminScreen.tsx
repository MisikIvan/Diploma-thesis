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
import { useAppSelector } from '../redux/hooks';
import { getAllProducts, getAllUsers, blockUser, unblockUser, deleteProduct } from '../api/firebase';
import { User, Product } from '../types/index';
import { t } from '../utils/translations';
import SearchModal from '../components/SearchModal';
import AddProductModal from '../components/AddProductModal';

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
  const [isDemo, setIsDemo] = useState(false);
  
  // Search modal state
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [showProductSearch, setShowProductSearch] = useState(false);
  
  // Add product modal state
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const currentUser = useAppSelector(state => state.user.currentUser);

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
      // Try to load from Firebase
      const [usersData, productsData] = await Promise.all([
        getAllUsers(),
        getAllProducts()
      ]);
      
      setUsers(usersData || []);
      setProducts(productsData || []);
      setIsDemo(false);
    } catch (error) {
      console.log('Firebase not available, using demo mode');
      // Use mock data
      setUsers([
        {
          userId: 'demo-user-1',
          email: 'user1@demo.com',
          displayName: 'Demo User 1',
          avatarUrl: 'https://via.placeholder.com/50x50?text=U1',
          authMethod: 'email',
          role: 'user',
          isBlocked: false,
          canComment: true
        },
        {
          userId: 'demo-user-2',
          email: 'user2@demo.com',
          displayName: 'Demo User 2',
          avatarUrl: 'https://via.placeholder.com/50x50?text=U2',
          authMethod: 'email',
          role: 'user',
          isBlocked: false,
          canComment: true
        },
        {
          userId: 'demo-admin',
          email: 'admin@demo.com',
          displayName: 'Demo Admin',
          avatarUrl: 'https://via.placeholder.com/50x50?text=A',
          authMethod: 'email',
          role: 'admin',
          isBlocked: false,
          canComment: true
        }
      ]);
      
      setProducts([
        {
          productId: 'demo-product-1',
          name: 'Demo Product 1',
          imageUrl: 'https://via.placeholder.com/300x300?text=Product+1',
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
          tags: ['vegan'],
          isVegan: true,
          isVegetarian: true,
          hasLactose: false,
          hasGluten: false,
          createdBy: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          productId: 'demo-product-2',
          name: 'Demo Product 2',
          imageUrl: 'https://via.placeholder.com/300x300?text=Product+2',
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
          tags: ['vegetarian'],
          isVegan: false,
          isVegetarian: true,
          hasLactose: true,
          hasGluten: false,
          createdBy: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]);
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  };



 
  const searchUser = async (query: string): Promise<User | null> => {
    const user = users.find(u => 
      u.userId.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()) ||
      u.displayName.toLowerCase().includes(query.toLowerCase())
    );
    return user || null;
  };

  const searchProduct = async (query: string): Promise<Product | null> => {
    const product = products.find(p => 
      p.productId.toLowerCase().includes(query.toLowerCase()) ||
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    return product || null;
  };

   
   const handleUserUpdate = async (user: User, updates: Partial<User>) => {
     if (isDemo) {
     
       setUsers(prev => prev.map(u => 
         u.userId === user.userId ? { ...u, ...updates } : u
       ));
       return;
     }

     if (!currentUser) return;

   
     if (updates.isBlocked !== undefined) {
       if (updates.isBlocked) {
         await blockUser(user.userId, currentUser.userId);
       } else {
         await unblockUser(user.userId, currentUser.userId);
       }
     }
     
   
     await loadData();
   };

 
  const handleProductEdit = (product: Product) => {
    navigation.navigate('EditProduct', { product });
  };

     const handleProductDelete = async (productId: string) => {
     if (isDemo) {
       setProducts(prev => prev.filter(p => p.productId !== productId));
       return;
     }

     if (!currentUser) return;

     await deleteProduct(productId, currentUser.userId);
     await loadData();
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
          <View style={[styles.statusIndicator, isDemo ? styles.demoMode : styles.liveMode]}>
            <Ionicons 
              name={isDemo ? 'cloud-offline' : 'cloud-done'} 
              size={16} 
              color="#fff" 
            />
            <Text style={styles.statusText}>
              {isDemo ? t('demo') : t('live')}
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
            onPress={() => setShowUserSearch(true)}
          >
            <Ionicons name="search" size={20} color="#34572a" />
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
              onPress={() => setShowProductSearch(true)}
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
          </View>
        </View>
      </ScrollView>

      {/* Search Modals */}
      <SearchModal
        visible={showUserSearch}
        onClose={() => setShowUserSearch(false)}
        type="users"
        onSearch={searchUser}
        onUserUpdate={handleUserUpdate}
      />

      <SearchModal
        visible={showProductSearch}
        onClose={() => setShowProductSearch(false)}
        type="products"
        onSearch={searchProduct}
        onProductEdit={handleProductEdit}
        onProductDelete={handleProductDelete}
      />

      <AddProductModal
        visible={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        onProductAdded={() => {
          setShowAddProductModal(false);
          loadData(); 
        }}
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
  },
  demoMode: {
    backgroundColor: '#FF9500',
  },
  liveMode: {
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
});

export default NewAdminScreen; 