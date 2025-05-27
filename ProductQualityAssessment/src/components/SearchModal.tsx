import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User, Product } from '../types/index';
import { t } from '../utils/translations';

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  type: 'users' | 'products';
  onSearch: (query: string) => Promise<User | Product | null>;
  onUserUpdate?: (user: User, updates: Partial<User>) => Promise<void>;
  onProductEdit?: (product: Product) => void;
  onProductDelete?: (productId: string) => Promise<void>;
}

const SearchModal: React.FC<SearchModalProps> = ({
  visible,
  onClose,
  type,
  onSearch,
  onUserUpdate,
  onProductEdit,
  onProductDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<User | Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert(t('error'), `Please enter ${type === 'users' ? 'user ID' : 'product ID or name'}`);
      return;
    }

    setLoading(true);
    try {
      const result = await onSearch(searchQuery.trim());
      setSearchResult(result);
      setShowDetails(!!result);
      
      if (!result) {
        Alert.alert(t('error'), `${type === 'users' ? 'User' : 'Product'} not found`);
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert(t('error'), 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSearchResult(null);
    setShowDetails(false);
    onClose();
  };

  const handleUserRoleChange = async (user: User, newRole: 'user' | 'admin') => {
    if (onUserUpdate) {
      try {
        await onUserUpdate(user, { role: newRole });
        setSearchResult({ ...user, role: newRole });
        Alert.alert(t('success'), 'User role updated successfully');
      } catch (error) {
        Alert.alert(t('error'), 'Failed to update user role');
      }
    }
  };

  const handleUserBlockToggle = async (user: User) => {
    if (onUserUpdate) {
      try {
        await onUserUpdate(user, { isBlocked: !user.isBlocked });
        setSearchResult({ ...user, isBlocked: !user.isBlocked });
        Alert.alert(t('success'), `User ${user.isBlocked ? 'unblocked' : 'blocked'} successfully`);
      } catch (error) {
        Alert.alert(t('error'), 'Failed to update user status');
      }
    }
  };

  const handleProductDelete = async (product: Product) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (onProductDelete) {
              try {
                await onProductDelete(product.productId);
                Alert.alert(t('success'), 'Product deleted successfully');
                handleClose();
              } catch (error) {
                Alert.alert(t('error'), 'Failed to delete product');
              }
            }
          },
        },
      ]
    );
  };

  const renderUserDetails = (user: User) => (
    <ScrollView style={styles.detailsContainer}>
      <View style={styles.userHeader}>
        <Image
          source={{ uri: user.avatarUrl || 'https://via.placeholder.com/80x80?text=User' }}
          style={styles.userAvatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.displayName}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <View style={[styles.roleTag, user.role === 'admin' && styles.adminRoleTag]}>
            <Text style={[styles.roleText, user.role === 'admin' && styles.adminRoleText]}>
              {user.role?.toUpperCase() || 'USER'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>User Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>User ID:</Text>
          <Text style={styles.infoValue}>{user.userId}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Auth Method:</Text>
          <Text style={styles.infoValue}>{user.authMethod}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status:</Text>
          <View style={[styles.statusTag, user.isBlocked && styles.blockedTag]}>
            <Text style={[styles.statusText, user.isBlocked && styles.blockedText]}>
              {user.isBlocked ? 'BLOCKED' : 'ACTIVE'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Actions</Text>
        
        <View style={styles.actionRow}>
          <Text style={styles.actionLabel}>Role:</Text>
          <View style={styles.roleButtons}>
            <TouchableOpacity
              style={[styles.roleButton, user.role === 'user' && styles.activeRoleButton]}
              onPress={() => handleUserRoleChange(user, 'user')}
            >
              <Text style={[styles.roleButtonText, user.role === 'user' && styles.activeRoleButtonText]}>
                User
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleButton, user.role === 'admin' && styles.activeRoleButton]}
              onPress={() => handleUserRoleChange(user, 'admin')}
            >
              <Text style={[styles.roleButtonText, user.role === 'admin' && styles.activeRoleButtonText]}>
                Admin
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.actionButton, user.isBlocked ? styles.unblockButton : styles.blockButton]}
          onPress={() => handleUserBlockToggle(user)}
        >
          <Ionicons 
            name={user.isBlocked ? 'checkmark-circle' : 'close-circle'} 
            size={20} 
            color="#fff" 
          />
          <Text style={styles.actionButtonText}>
            {user.isBlocked ? 'Unblock User' : 'Block User'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderProductDetails = (product: Product) => (
    <ScrollView style={styles.detailsContainer}>
      <View style={styles.productHeader}>
        <Image
          source={{ uri: product.imageUrl || 'https://via.placeholder.com/80x80?text=Product' }}
          style={styles.productImage}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productId}>ID: {product.productId}</Text>
          <View style={styles.nutriScoreContainer}>
            <Text style={styles.nutriScoreLabel}>Nutri-Score:</Text>
            <View style={[styles.nutriScoreTag, { backgroundColor: getNutriScoreColor(product.nutriscoreGrade) }]}>
              <Text style={styles.nutriScoreText}>{product.nutriscoreGrade}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Product Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Categories:</Text>
          <Text style={styles.infoValue}>{product.categories?.join(', ') || 'None'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Created by:</Text>
          <Text style={styles.infoValue}>{product.createdBy || 'Unknown'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Created:</Text>
          <Text style={styles.infoValue}>
            {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'Unknown'}
          </Text>
        </View>
      </View>

      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Actions</Text>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => {
            if (onProductEdit) {
              onProductEdit(product);
              handleClose();
            }
          }}
        >
          <Ionicons name="create" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Edit Product</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleProductDelete(product)}
        >
          <Ionicons name="trash" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Delete Product</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

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

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {type === 'users' ? t('searchUsers') : t('searchProducts')}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {!showDetails ? (
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder={
                    type === 'users' 
                      ? 'Enter user ID...' 
                      : 'Enter product ID or name...'
                  }
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={handleSearch}
                />
              </View>
              
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.searchButtonText}>Search</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.resultsContainer}>
                              <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setShowDetails(false)}
                >
                  <Ionicons name="arrow-back" size={20} color="#34572a" />
                  <Text style={styles.backButtonText}>Back to Search</Text>
                </TouchableOpacity>

              {searchResult && (
                type === 'users' 
                  ? renderUserDetails(searchResult as User)
                  : renderProductDetails(searchResult as Product)
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    padding: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#34572a',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#34572a',
  },
  detailsContainer: {
    flex: 1,
    padding: 20,
  },
  userHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  roleTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  adminRoleTag: {
    backgroundColor: '#34572a',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  adminRoleText: {
    color: '#fff',
  },
  productHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productId: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  nutriScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nutriScoreLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  nutriScoreTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  nutriScoreText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  detailsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  statusTag: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  blockedTag: {
    backgroundColor: '#F44336',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  blockedText: {
    color: '#fff',
  },
  actionsSection: {
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  roleButtons: {
    flexDirection: 'row',
  },
  roleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginLeft: 8,
  },
  activeRoleButton: {
    backgroundColor: '#34572a',
    borderColor: '#34572a',
  },
  roleButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  activeRoleButtonText: {
    color: '#fff',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  blockButton: {
    backgroundColor: '#F44336',
  },
  unblockButton: {
    backgroundColor: '#4CAF50',
  },
  editButton: {
    backgroundColor: '#34572a',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default SearchModal; 