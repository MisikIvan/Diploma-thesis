import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Alert, ScrollView } from 'react-native';
import { useAppSelector } from '../redux/hooks';
import { t } from '../utils/translations';
import { User, Product, AdminAction } from '../types/index';
import { 
  getAllUsers, 
  blockUser, 
  unblockUser, 
  toggleCommentPermission,
  getAllProducts,
  deleteProduct,
  getAdminActions
} from '../api/firebase';

enum Tab {
  PRODUCTS = 'products',
  USERS = 'users',
  ACTIVITY = 'activity'
}

const AdminPanel: React.FC = () => {
  const { currentUser } = useAppSelector(state => state.user);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.PRODUCTS);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [adminActions, setAdminActions] = useState<AdminAction[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Check if user is admin
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{t('adminPanelTitle')}</Text>
        <Text style={styles.errorText}>{t('featureNotImplemented')}</Text>
      </View>
    );
  }
  
  useEffect(() => {
    loadData();
  }, [activeTab]);
  
  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === Tab.USERS) {
        const allUsers = await getAllUsers();
        setUsers(allUsers);
      } else if (activeTab === Tab.PRODUCTS) {
        const allProducts = await getAllProducts();
        setProducts(allProducts);
      } else if (activeTab === Tab.ACTIVITY) {
        const actions = await getAdminActions();
        setAdminActions(actions.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ));
      }
    } catch (error) {
      Alert.alert(t('error'), (error as Error).message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleBlockUser = async (user: User) => {
    if (!currentUser) return;
    
    try {
      if (user.isBlocked) {
        await unblockUser(user.userId, currentUser.userId);
        Alert.alert(t('success'), t('userUnblocked'));
      } else {
        await blockUser(user.userId, currentUser.userId);
        Alert.alert(t('success'), t('userBlocked'));
      }
      
      // Refresh user list
      loadData();
    } catch (error) {
      Alert.alert(t('error'), (error as Error).message);
    }
  };
  
  const handleToggleComments = async (user: User) => {
    if (!currentUser) return;
    
    try {
      await toggleCommentPermission(user.userId, !user.canComment, currentUser.userId);
      Alert.alert(t('success'), user.canComment ? t('commentBlocked') : t('unblockComments'));
      
      // Refresh user list
      loadData();
    } catch (error) {
      Alert.alert(t('error'), (error as Error).message);
    }
  };
  
  const handleDeleteProduct = async (productId: string) => {
    if (!currentUser) return;
    
    Alert.alert(
      t('areYouSure'),
      t('thisActionCannot'),
      [
        {
          text: t('cancel'),
          style: 'cancel'
        },
        {
          text: t('deleteProduct'),
          onPress: async () => {
            try {
              await deleteProduct(productId, currentUser.userId);
              Alert.alert(t('success'), t('productDeleted'));
              loadData();
            } catch (error) {
              Alert.alert(t('error'), (error as Error).message);
            }
          },
          style: 'destructive'
        }
      ]
    );
  };
  
  const filteredUsers = users.filter(user => 
    user.displayName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(productSearchQuery.toLowerCase())
  );
  
  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.displayName}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userDetail}>{t('lastLogin')}: {new Date(item.lastLogin).toLocaleString()}</Text>
        <View style={styles.statusContainer}>
          {item.isBlocked && (
            <View style={[styles.statusBadge, styles.blockedBadge]}>
              <Text style={styles.statusText}>{t('blockUser')}</Text>
            </View>
          )}
          {!item.canComment && (
            <View style={[styles.statusBadge, styles.commentsBadge]}>
              <Text style={styles.statusText}>{t('blockComments')}</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.userActions}>
        <TouchableOpacity 
          style={[styles.actionButton, item.isBlocked ? styles.unblockButton : styles.blockButton]}
          onPress={() => handleBlockUser(item)}
        >
          <Text style={styles.actionButtonText}>
            {item.isBlocked ? t('unblockUser') : t('blockUser')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, item.canComment ? styles.blockButton : styles.unblockButton]}
          onPress={() => handleToggleComments(item)}
        >
          <Text style={styles.actionButtonText}>
            {item.canComment ? t('blockComments') : t('unblockComments')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productDetail}>
        {item.categories.join(', ')}
      </Text>
      <Text style={styles.productDetail}>
        {t('rating')}: {item.averageRating ? item.averageRating.toFixed(1) : 'N/A'} ({item.ratingCount || 0})
      </Text>
      
      <View style={styles.productActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => Alert.alert(t('featureNotImplemented'))}
        >
          <Text style={styles.actionButtonText}>{t('editProduct')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteProduct(item.productId)}
        >
          <Text style={styles.actionButtonText}>{t('deleteProduct')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const renderActionItem = ({ item }: { item: AdminAction }) => (
    <View style={styles.actionCard}>
      <Text style={styles.actionType}>{item.actionType.replace('_', ' ').toUpperCase()}</Text>
      <Text style={styles.actionDetail}>{item.details}</Text>
      <Text style={styles.actionDate}>{new Date(item.timestamp).toLocaleString()}</Text>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('adminPanelTitle')}</Text>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === Tab.PRODUCTS && styles.activeTab]}
          onPress={() => setActiveTab(Tab.PRODUCTS)}
        >
          <Text style={styles.tabText}>{t('manageProducts')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === Tab.USERS && styles.activeTab]}
          onPress={() => setActiveTab(Tab.USERS)}
        >
          <Text style={styles.tabText}>{t('manageUsers')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === Tab.ACTIVITY && styles.activeTab]}
          onPress={() => setActiveTab(Tab.ACTIVITY)}
        >
          <Text style={styles.tabText}>{t('activityLog')}</Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === Tab.USERS && (
        <View style={styles.tabContent}>
          <TextInput
            style={styles.searchInput}
            placeholder={t('searchUser')}
            value={userSearchQuery}
            onChangeText={setUserSearchQuery}
          />
          
          <FlatList
            data={filteredUsers}
            renderItem={renderUserItem}
            keyExtractor={(item) => item.userId}
            style={styles.list}
            ListEmptyComponent={
              <Text style={styles.emptyText}>{t('noResults')}</Text>
            }
          />
        </View>
      )}
      
      {activeTab === Tab.PRODUCTS && (
        <View style={styles.tabContent}>
          <View style={styles.productsHeader}>
            <TextInput
              style={styles.searchInput}
              placeholder={t('search')}
              value={productSearchQuery}
              onChangeText={setProductSearchQuery}
            />
            
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => Alert.alert(t('featureNotImplemented'))}
            >
              <Text style={styles.addButtonText}>{t('addProduct')}</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.productId}
            style={styles.list}
            ListEmptyComponent={
              <Text style={styles.emptyText}>{t('noResults')}</Text>
            }
          />
        </View>
      )}
      
      {activeTab === Tab.ACTIVITY && (
        <View style={styles.tabContent}>
          <FlatList
            data={adminActions}
            renderItem={renderActionItem}
            keyExtractor={(item) => item.actionId}
            style={styles.list}
            ListEmptyComponent={
              <Text style={styles.emptyText}>{t('noResults')}</Text>
            }
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabContent: {
    flex: 1,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  userCard: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  userInfo: {
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userDetail: {
    fontSize: 12,
    color: '#888',
  },
  statusContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
  },
  blockedBadge: {
    backgroundColor: '#f44336',
  },
  commentsBadge: {
    backgroundColor: '#ff9800',
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  userActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  blockButton: {
    backgroundColor: '#f44336',
  },
  unblockButton: {
    backgroundColor: '#4CAF50',
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productCard: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  productsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 4,
    marginLeft: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  actionCard: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  actionType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  actionDetail: {
    fontSize: 14,
  },
  actionDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    color: '#888',
  },
});

export default AdminPanel; 