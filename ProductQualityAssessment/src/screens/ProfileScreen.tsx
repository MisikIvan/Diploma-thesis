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
  Switch,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { User } from '../types/index';
import { StorageService } from '../utils/storage';
import { Language, t, getCurrentLanguage } from '../utils/translations';
import { saveLanguage } from '../utils/languageStorage';
import LanguageSelector from '../components/LanguageSelector';
import AvatarSelector from '../components/AvatarSelector';
import BMIIndicator from '../components/BMIIndicator';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { logout } from '../redux/slices/userSlice';
import { updateUserProfile } from '../api/userProfile';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(getCurrentLanguage());

  const dispatch = useAppDispatch();
  const currentUserFromRedux = useAppSelector(state => state.user.currentUser);

  const getAvatarSource = (avatarUrl?: string) => {
    if (!avatarUrl) return require('../assets/profile1.png');
    
    if (avatarUrl.includes('profile') && (avatarUrl.includes('.png') || avatarUrl.includes('.jpg'))) {
      switch (avatarUrl) {
        case 'profile1.png': return require('../assets/profile1.png');
        case 'profile2.png': return require('../assets/profile2.png');
        case 'profile3.png': return require('../assets/profile3.png');
        case 'profile4.png': return require('../assets/profile4.png');
        case 'profile5.png': return require('../assets/profile5.png');
        case 'profile6.png': return require('../assets/profile6.png');
        case 'profile-currents.jpg': return require('../assets/profile-currents.jpg');
        default: return require('../assets/profile1.png');
      }
    }
    
    return { uri: avatarUrl };
  };

  useEffect(() => {
    loadUserData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const userData = await StorageService.user.getUser();
      if (userData) {
        setUser(userData);
      } else if (currentUserFromRedux) {
        setUser(currentUserFromRedux);
      } else {
        navigation.navigate('Auth');
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      Alert.alert(t('error'), t('error'));
    } finally {
      setIsLoading(false);
    }
  };

  const calculateBMI = (weight?: number, height?: number): number => {
    if (!weight || !height) return 0;
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const handleAvatarSelect = async (avatarPath: string) => {
    if (!user) return;

    try {
      const updatedUser: User = {
        ...user,
        avatarUrl: avatarPath,
      };

      await saveUserData(updatedUser);
      Alert.alert(t('success'), t('avatarUpdateSuccess'));
    } catch (error) {
      console.error('Failed to update avatar:', error);
      Alert.alert(t('error'), t('avatarUpdateError'));
    }
  };

  const saveUserData = async (updatedUser: User) => {
    try {
      await StorageService.user.saveUser(updatedUser);
      
      if (currentUserFromRedux && 
          updatedUser.userId !== 'user123' && 
          !updatedUser.userId.startsWith('demo_') && 
          !updatedUser.userId.startsWith('local_')) {
        try {
          await updateUserProfile(updatedUser.userId, updatedUser);
        } catch (firebaseError) {
          console.warn('Firebase update failed, but local storage updated:', firebaseError);
          
        }
      }
      
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to save user data:', error);
      throw error;
    }
  };

  const handleOpenPicker = (type: 'weight' | 'height' | 'age' | 'goalWeight', title: string) => {
    switch (type) {
      case 'weight':
        navigation.navigate('WeightPicker', {
          currentWeight: user?.currentWeight || 60,
          title: title,
          type: 'weight'
        });
        break;
      case 'goalWeight':
        navigation.navigate('WeightPicker', {
          currentWeight: user?.goalWeight || 70,
          title: title,
          type: 'goalWeight'
        });
        break;
    }
  };

  const handleChangeGoal = () => {
    handleOpenPicker('goalWeight', 'Change Goal Weight');
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

  const handleDeleteAccount = async () => {
    Alert.alert(
      t('deleteAccount'),
      t('deleteAccountConfirmation'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('continue'),
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              t('deleteAccountWarning'),
              t('deleteAccountIrreversible'),
              [
                { text: t('goBack'), style: 'cancel' },
                {
                  text: t('understand'),
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      setIsLoading(true);
                      await dispatch(logout()).unwrap();
                      Alert.alert(t('accountDeleted'));
                    } catch (error) {
                      console.error('Account deletion failed:', error);
                      Alert.alert(t('error'), t('accountDeletionError'));
                    } finally {
                      setIsLoading(false);
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleTermsPress = () => {
    navigation.navigate('TermsOfService');
  };

  const handlePrivacyPress = () => {
    navigation.navigate('PrivacyPolicy');
  };

  const handleLanguageChange = async (language: Language) => {
    setCurrentLanguage(language);
    await saveLanguage(language);
    
  
    setUser(null);
    setIsLoading(true);
    
   
    setTimeout(async () => {
      await loadUserData();
      
      Alert.alert(t('languageChanged'), '', [
        { text: t('ok'), onPress: () => {
         
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          });
        }}
      ]);
    }, 100);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#34572a" />
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

  const bmi = calculateBMI(user.currentWeight, user.height);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('settings')}</Text>
        </View>

        <View style={styles.profileSection}>
          <TouchableOpacity onPress={() => setShowAvatarSelector(true)}>
            <Image 
              source={getAvatarSource(user.avatarUrl)} 
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <Text style={styles.profileName}>{user.displayName || user.email || 'User'}</Text>
        </View>

        <View style={styles.bannerContainer}>
          <Image 
            source={require('../assets/settings-baner1.png')} 
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>{t('fillYourPersonalData')}</Text>
            <Text style={styles.bannerSubtitle}>{t('personalDataBanner')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.settingsGrid}>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>{t('age')}</Text>
              <Text style={styles.settingValue}>{user.age || '27'}</Text>
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>{t('height')}</Text>
              <View style={styles.settingValueContainer}>
                <Text style={styles.settingValue}>{user.height || '170.0'} {t('cm')}</Text>
              </View>
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>{t('currentWeight')}</Text>
              <View style={styles.settingValueContainer}>
                <Text style={styles.settingValue}>{user.currentWeight || '60'} {t('kg')}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('overview')}</Text>
          
          <View style={styles.goalContainer}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalLabel}>{t('weightGoal')}</Text>
              <TouchableOpacity style={styles.updateButton} onPress={handleChangeGoal}>
                <Text style={styles.updateButtonText}>{t('update')}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.goalValue}>{user.goalWeight || '70'} {t('kg')}</Text>
          </View>

          <View style={styles.currentWeightCard}>
            <Text style={styles.currentWeightValue}>{user.currentWeight || '60'} {t('kg')}</Text>
            <Text style={styles.currentWeightLabel}>{t('currentWeight')}</Text>
            <Text style={styles.weightAdvice}>
              {t('tryToUpdateOnceAWeek')}. {t('ensureYouHitYourGoal')}.
            </Text>
            <TouchableOpacity 
              style={styles.logWeightButton} 
              onPress={() => handleOpenPicker('weight', 'Log Weight')}
            >
              <Text style={styles.logWeightButtonText}>{t('logWeight')}</Text>
            </TouchableOpacity>
          </View>

          <BMIIndicator 
            bmi={bmi} 
            weight={user.currentWeight} 
            height={user.height} 
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('customization')}</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('PersonalDetails')}
          >
            <Text style={styles.menuItemText}>{t('personalDetails')}</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.languageMenuItem}
            onPress={() => setShowLanguageSelector(true)}
          >
            <View style={styles.menuItemWithIcon}>
              <Ionicons name="language" size={20} color="#666" style={styles.menuIcon} />
              <Text style={styles.menuItemTextFixed}>{t('languageSettings')}</Text>
            </View>
            <View style={styles.languageInfo}>
              <Text style={styles.languageText} numberOfLines={1}>
                {currentLanguage === 'uk' ? t('ukrainianShort') : t('englishShort')}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('legal')}</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleTermsPress}>
            <Text style={styles.menuItemText}>{t('termsAndConditions')}</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={handlePrivacyPress}>
            <Text style={styles.menuItemText}>{t('privacyPolicy')}</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleDeleteAccount}>
            <Text style={[styles.menuItemText, { color: '#e74c3c' }]}>{t('deleteAccount')}</Text>
          </TouchableOpacity>
        </View>

         
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>{t('logout')}</Text>
        </TouchableOpacity>

        <LanguageSelector 
          isVisible={showLanguageSelector}
          onClose={() => setShowLanguageSelector(false)}
          onLanguageChange={handleLanguageChange}
        />
        
        <AvatarSelector
          visible={showAvatarSelector}
          onClose={() => setShowAvatarSelector(false)}
          onSelectAvatar={handleAvatarSelect}
          currentAvatar={user.avatarUrl}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
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
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#34572a',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  bannerContainer: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 16,
    overflow: 'hidden',
    height: 120,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
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
    marginBottom: 16,
  },
  settingsGrid: {
    gap: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 16,
    color: '#666',
  },
  settingValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalContainer: {
    marginBottom: 20,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalLabel: {
    fontSize: 16,
    color: '#666',
  },
  updateButton: {
    backgroundColor: '#34572a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  goalValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#34572a',
  },
  currentWeightCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  currentWeightValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  currentWeightLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  weightAdvice: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  logWeightButton: {
    backgroundColor: '#34572a',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logWeightButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  detailLabel: {
    fontSize: 16,
    color: '#333',
  },
  detailRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailValue: {
    fontSize: 16,
    color: '#666',
  },
  changeGoalButton: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  changeGoalText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  menuItemSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  preferenceLeft: {
    flex: 1,
  },
  preferenceLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  preferenceSubtext: {
    fontSize: 12,
    color: '#666',
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
  scrollContent: {
    paddingBottom: 120,
  },
  menuItemWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  menuIcon: {
    marginRight: 8,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    maxWidth: 120,
    justifyContent: 'flex-end',
  },
  languageText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
    flexShrink: 1,
  },
  menuItemTextFixed: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  languageMenuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
});

export default ProfileScreen; 