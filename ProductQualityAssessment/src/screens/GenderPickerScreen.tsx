import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { t } from '../utils/translations';
import { RootStackParamList } from '../types/navigation';
import { StorageService } from '../utils/storage';
import { useAppSelector } from '../redux/hooks';
import { updateUserProfile } from '../api/userProfile';

type GenderPickerScreenProps = StackScreenProps<RootStackParamList, 'GenderPicker'>;

const GenderPickerScreen: React.FC<GenderPickerScreenProps> = ({ navigation, route }) => {
  const { currentGender, title } = route.params;
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'other'>(currentGender || 'male');
  const [isLoading, setIsLoading] = useState(false);

  const currentUserFromRedux = useAppSelector(state => state.user.currentUser);

  const genderOptions = [
    { key: 'male', label: t('male'), icon: 'man' },
    { key: 'female', label: t('female'), icon: 'woman' },
    { key: 'other', label: t('other'), icon: 'person' },
  ] as const;

  const handleSave = async () => {
    setIsLoading(true);
    try {
    
      const userData = await StorageService.user.getUser();
      if (!userData) {
        Alert.alert(t('error'), t('failedToLoadUser'));
        return;
      }

    
      let updatedUser = { ...userData };
      updatedUser.gender = selectedGender;

    
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

      Alert.alert(t('success'), t('profileDataSaved'));
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save gender data:', error);
      Alert.alert(t('error'), t('profileDataError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('setGender')}</Text>
        <View style={styles.placeholder} />
      </View>

    
      <View style={styles.content}>
        <View style={styles.optionsContainer}>
          {genderOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.optionItem,
                selectedGender === option.key && styles.selectedOption
              ]}
              onPress={() => setSelectedGender(option.key)}
            >
              <Ionicons 
                name={option.icon as any} 
                size={32} 
                color={selectedGender === option.key ? '#34572a' : '#666'} 
              />
              <Text style={[
                styles.optionText,
                selectedGender === option.key && styles.selectedOptionText
              ]}>
                {option.label}
              </Text>
              {selectedGender === option.key && (
                <Ionicons name="checkmark-circle" size={24} color="#34572a" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

   
      <TouchableOpacity 
        style={[styles.saveButton, isLoading && styles.saveButtonDisabled]} 
        onPress={handleSave}
        disabled={isLoading}
      >
        <Text style={styles.saveButtonText}>
          {isLoading ? t('loading') : t('saveChanges')}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  optionsContainer: {
    gap: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: 'rgba(52, 87, 42, 0.1)',
    borderColor: '#34572a',
  },
  optionText: {
    fontSize: 18,
    color: '#666',
    marginLeft: 16,
    flex: 1,
  },
  selectedOptionText: {
    color: '#34572a',
    fontWeight: '600',
  },
  saveButton: {
    margin: 20,
    backgroundColor: '#34572a',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default GenderPickerScreen; 