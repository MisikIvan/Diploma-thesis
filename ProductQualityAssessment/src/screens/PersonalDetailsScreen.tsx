import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { User } from '../types/index';
import { StorageService } from '../utils/storage';
import { t } from '../utils/translations';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { updateUser } from '../redux/slices/userSlice';
import { updateUserProfile } from '../api/userProfile';

interface PersonalDetailsScreenProps {
  navigation: any;
}

const PersonalDetailsScreen: React.FC<PersonalDetailsScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const currentUserFromRedux = useAppSelector(state => state.user.currentUser);
  const dispatch = useAppDispatch();

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

  const saveUserData = async (updatedUser: User) => {
    try {
   
      await StorageService.user.saveUser(updatedUser);
      
      // Update Redux state if this is the current user
      if (currentUserFromRedux && updatedUser.userId === currentUserFromRedux.userId) {
        console.log('🔄 Updating Redux state with personal details');
        dispatch(updateUser(updatedUser));
      }
      
    
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

  const handleOpenPicker = (type: 'weight' | 'height' | 'age' | 'gender', title: string) => {
    switch (type) {
      case 'weight':
        navigation.navigate('WeightPicker', {
          currentWeight: user?.currentWeight || 60,
          title: title,
          type: 'weight'
        });
        break;
      case 'height':
        navigation.navigate('HeightPicker', {
          currentHeight: user?.height || 170,
          title: title
        });
        break;
      case 'age':
        navigation.navigate('AgePicker', {
          currentAge: user?.age || 25,
          title: title
        });
        break;
      case 'gender':
        navigation.navigate('GenderPicker', {
          currentGender: user?.gender || 'male',
          title: title
        });
        break;
    }
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

  return (
    <SafeAreaView style={styles.container}>
    
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('personalDetails')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
   
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.detailItem} 
            onPress={() => handleOpenPicker('weight', 'Set Weight')}
          >
            <Text style={styles.detailLabel}>{t('currentWeight')}</Text>
            <View style={styles.detailRight}>
              <Text style={styles.detailValue}>{user.currentWeight || '60'} {t('kg')}</Text>
              <Ionicons name="create-outline" size={20} color="#666" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.detailItem} 
            onPress={() => handleOpenPicker('height', 'Set Height')}
          >
            <Text style={styles.detailLabel}>{t('height')}</Text>
            <View style={styles.detailRight}>
              <Text style={styles.detailValue}>{user.height || '170.0'} {t('cm')}</Text>
              <Ionicons name="create-outline" size={20} color="#666" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.detailItem} 
            onPress={() => handleOpenPicker('age', 'Set Age')}
          >
            <Text style={styles.detailLabel}>{t('age')}</Text>
            <View style={styles.detailRight}>
              <Text style={styles.detailValue}>{user.age || '27'}</Text>
              <Ionicons name="create-outline" size={20} color="#666" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.detailItem} 
            onPress={() => handleOpenPicker('gender', 'Set Gender')}
          >
            <Text style={styles.detailLabel}>{t('gender')}</Text>
            <View style={styles.detailRight}>
              <Text style={styles.detailValue}>
                {user.gender === 'male' ? t('male') : 
                 user.gender === 'female' ? t('female') : 
                 user.gender === 'other' ? t('other') : t('male')}
              </Text>
              <Ionicons name="create-outline" size={20} color="#666" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
});

export default PersonalDetailsScreen; 