import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { User } from '../types/index';
import { getAllUsers, blockUser, unblockUser, auth } from '../api/firebase';
import { updateUserRole, updateUserBlockStatus } from '../api/userManagement';
import { t } from '../utils/translations';

type UserSearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'UserSearch'>;

const UserSearchScreen: React.FC = () => {
  const navigation = useNavigation<UserSearchScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

 
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    
    const query = searchQuery.toLowerCase().trim();
    return users.filter(user => 
      user.displayName?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.userId.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert(t('error'), t('loadingUsers'));
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Main');
    }
  };

  const handleToggleUserRole = async (user: User) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    
    Alert.alert(
      t('changeUserRole'),
      `${t('changeUserRole')} "${user.displayName}"?`,
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('save'),
          onPress: async () => {
            try {
              await updateUserRole(user.userId, newRole);
              Alert.alert(t('success'), t('userRoleChanged'));
              await loadUsers();
            } catch (error) {
              console.error('Error updating user role:', error);
              Alert.alert(t('error'), t('userRoleChangeError'));
            }
          },
        },
      ]
    );
  };

  const handleToggleUserBlock = async (user: User) => {
    const action = user.isBlocked ? t('unblockUser') : t('blockUser');
    
    Alert.alert(
      action,
      `${action} "${user.displayName}"?`,
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: action,
          style: user.isBlocked ? 'default' : 'destructive',
          onPress: async () => {
            try {
              await updateUserBlockStatus(user.userId, !user.isBlocked);
              Alert.alert(t('success'), user.isBlocked ? t('userUnblocked') : t('userBlocked'));
              await loadUsers();
            } catch (error) {
              console.error('Error updating user block status:', error);
              Alert.alert(t('error'), t('userBlockError'));
            }
          },
        },
      ]
    );
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <Image
        source={item.avatarUrl ? { uri: item.avatarUrl } : require('../assets/profile1.png')}
        style={styles.userAvatar}
      />
      
      <View style={styles.userInfo}>
        <Text style={styles.userName} numberOfLines={1}>
          {item.displayName || t('unknownName')}
        </Text>
        <Text style={styles.userEmail} numberOfLines={1}>
          {item.email}
        </Text>
        <Text style={styles.userId}>
          ID: {item.userId}
        </Text>
        
        <View style={styles.userMeta}>
          <View style={[styles.roleTag, item.role === 'admin' && styles.adminRoleTag]}>
            <Text style={[styles.roleText, item.role === 'admin' && styles.adminRoleText]}>
              {item.role?.toUpperCase() || 'USER'}
            </Text>
          </View>
          
          <View style={[styles.statusTag, item.isBlocked && styles.blockedTag]}>
            <Text style={[styles.statusText, item.isBlocked && styles.blockedText]}>
              {item.isBlocked ? t('blocked').toUpperCase() : t('userState').toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.roleButton]}
          onPress={() => handleToggleUserRole(item)}
        >
          <Ionicons 
            name={item.role === 'admin' ? 'person' : 'shield'} 
            size={20} 
            color="#fff" 
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, item.isBlocked ? styles.unblockButton : styles.blockButton]}
          onPress={() => handleToggleUserBlock(item)}
        >
          <Ionicons 
            name={item.isBlocked ? 'checkmark-circle' : 'close-circle'} 
            size={20} 
            color="#fff" 
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="people" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>
        {searchQuery ? t('usersNotFound') : t('loadingUsers')}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery 
          ? t('tryAnotherSearch')
          : t('waitForLoading')
        }
      </Text>
    </View>
  );

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>{t('searchUsers')}</Text>
        
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
        >
          <Ionicons name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('enterUserDetails')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
            autoFocus={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        
        <Text style={styles.resultsCount}>
          {loading ? t('loading') : `${t('foundUsers')}: ${filteredUsers.length}`}
        </Text>
      </View>

      {/* Users List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#34572a" />
          <Text style={styles.loadingText}>{t('loadingUsers')}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.userId}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#34572a']}
              tintColor="#34572a"
            />
          }
          ListEmptyComponent={renderEmptyState}
        />
      )}
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
    alignItems: 'center',
    backgroundColor: '#34572a',
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  resultsCount: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userId: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleTag: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  adminRoleTag: {
    backgroundColor: '#34572a',
    borderColor: '#2a4521',
  },
  roleText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
  },
  adminRoleText: {
    color: '#fff',
  },
  statusTag: {
    backgroundColor: '#d4edda',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#c3e6cb',
  },
  blockedTag: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#155724',
  },
  blockedText: {
    color: '#721c24',
  },
  actions: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  roleButton: {
    backgroundColor: '#007bff',
  },
  blockButton: {
    backgroundColor: '#dc3545',
  },
  unblockButton: {
    backgroundColor: '#28a745',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default UserSearchScreen; 