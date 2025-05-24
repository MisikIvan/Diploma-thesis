import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { User } from '../types/index';
import { StorageService } from '../utils/storage';
import { DataService } from '../utils/dataService';
import { Language, t, getCurrentLanguage } from '../utils/translations';
import { saveLanguage } from '../utils/languageStorage';
import LanguageSelector from '../components/LanguageSelector';
import { useAppDispatch } from '../redux/hooks';
import { logout } from '../redux/slices/userSlice';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(getCurrentLanguage());

  const dispatch = useAppDispatch();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
    
      const userData = await StorageService.user.getUser();
      
      if (userData) {
        setUser(userData);
        setEditedName(userData.displayName);
      } else {
      
        const mockUser: User = {
          userId: 'user123',
          email: 'demo@example.com',
          displayName: 'Demo User',
          avatarUrl: 'https://cdn.7tv.app/emote/01FSVRP2N00000QSWVVZJA08HV/4x.avif',
          canComment: true,
          authMethod: 'email',
          role: 'admin',
          isBlocked: false,
        };
        setUser(mockUser);
        setEditedName(mockUser.displayName);
     
        await StorageService.user.saveUser(mockUser);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      Alert.alert(t('error'), t('error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      t('logout'),
      t('logoutConfirmation'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('logout'),
          onPress: async () => {
            try {
              setIsLoading(true);
              await dispatch(logout()).unwrap();
              console.log('Logout successful');
            } catch (error) {
              console.error('Logout failed:', error);
              Alert.alert(t('error'), t('error'));
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    if (editedName.trim().length === 0) {
      Alert.alert(t('error'), t('nameEmpty'));
      return;
    }

    try {
      const updatedUser: User = {
        ...user,
        displayName: editedName,
      };

      await StorageService.user.saveUser(updatedUser);
      setUser(updatedUser);
      setIsEditing(false);
      Alert.alert(t('success'), t('profileUpdateSuccess'));
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert(t('error'), t('profileUpdateError'));
    }
  };

  const handleCancelEditing = () => {
    if (user) {
      setEditedName(user.displayName);
    }
    setIsEditing(false);
  };

  const handleViewHistory = () => {
   
    Alert.alert(t('viewHistory'), t('featureNotImplemented'));
  };

  const handleLanguageChange = async (language: Language) => {
    setCurrentLanguage(language);
    await saveLanguage(language);
    
    
    Alert.alert(t('languageChanged'), '', [
      { text: t('ok'), onPress: () => {
       
        loadUserData();
      }}
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t('failedToLoadUser')}</Text>
        <TouchableOpacity style={styles.button} onPress={loadUserData}>
          <Text style={styles.buttonText}>{t('retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: user.avatarUrl || 'https://cdn.7tv.app/emote/01FSVRP2N00000QSWVVZJA08HV/4x.avif' }}
          style={styles.avatar}
        />
        
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.nameInput}
              value={editedName}
              onChangeText={setEditedName}
              placeholder={t('name')}
            />
            <View style={styles.editButtonsRow}>
              <TouchableOpacity style={styles.editButton} onPress={handleSaveProfile}>
                <Text style={styles.editButtonText}>{t('ok')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editButton, styles.cancelButton]}
                onPress={handleCancelEditing}
              >
                <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.userInfo}>
            <Text style={styles.displayName}>{user.displayName}</Text>
            <Text style={styles.email}>{user.email}</Text>
            <TouchableOpacity style={styles.editProfileButton} onPress={handleStartEditing}>
              <Text style={styles.editProfileButtonText}>{t('editProfile')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{t('accountInfo')}</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleViewHistory}>
          <Text style={styles.menuItemText}>{t('viewHistory')}</Text>
          <Text style={styles.menuItemIcon}>📖</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{t('preferences')}</Text>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => setShowLanguageSelector(true)}
        >
          <Text style={styles.menuItemText}>{t('languageSettings')}</Text>
          <Text style={styles.menuItemValue}>
            {currentLanguage === 'uk' ? t('ukrainian') : t('english')}
          </Text>
          <Text style={styles.menuItemIcon}>🌐</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>{t('dietarySettings')}</Text>
          <Text style={styles.menuItemIcon}>🥗</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>{t('notificationSettings')}</Text>
          <Text style={styles.menuItemIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{t('aboutApp')}</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>{t('aboutAppInfo')}</Text>
          <Text style={styles.menuItemIcon}>ℹ️</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>{t('aboutApp')}</Text>
          <Text style={styles.menuItemIcon}>👨‍💻</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>{t('logout')}</Text>
      </TouchableOpacity>

      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>{t('appName')}</Text>
        <Text style={styles.versionText}>Version 0.0.2</Text>
      </View>

      <LanguageSelector 
        isVisible={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
        onLanguageChange={handleLanguageChange}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f8d7da',
  },
  header: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#34572a',
  },
  userInfo: {
    alignItems: 'center',
  },
  displayName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#212529',
  },
  email: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 16,
  },
  editProfileButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#34572a',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  editProfileButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  editContainer: {
    width: '100%',
    alignItems: 'center',
  },
  nameInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  editButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  editButton: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: '#34572a',
    borderRadius: 25,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#34572a',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  menuItemText: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '500',
  },
  menuItemIcon: {
    fontSize: 20,
  },
  logoutButton: {
    margin: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#dc3545',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#34572a',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  versionText: {
    fontSize: 12,
    color: '#6c757d',
  },
  menuItemValue: {
    fontSize: 14,
    color: '#6c757d',
    marginRight: 10,
  },
});

export default ProfileScreen; 