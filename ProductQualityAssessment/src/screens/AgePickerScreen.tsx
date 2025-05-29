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
import { t, getAgeText } from '../utils/translations';
import PickerWheel from '../components/PickerWheel';
import { RootStackParamList } from '../types/navigation';
import { StorageService } from '../utils/storage';
import { useAppSelector } from '../redux/hooks';
import { updateUserProfile } from '../api/userProfile';

type AgePickerScreenProps = StackScreenProps<RootStackParamList, 'AgePicker'>;

const AgePickerScreen: React.FC<AgePickerScreenProps> = ({ navigation, route }) => {
  const { currentAge, title } = route.params;
  const [selectedAge, setSelectedAge] = useState(currentAge || 25);
  const [isLoading, setIsLoading] = useState(false);

  const currentUserFromRedux = useAppSelector(state => state.user.currentUser);

  const generateAgeData = () => {
    const ages = [];
    for (let i = 1; i <= 120; i++) {
      ages.push(i);
    }
    return ages;
  };

  const ageData = generateAgeData();

  const formatAgeDisplay = (age: string | number): string => {
    return getAgeText(Number(age));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const userData = await StorageService.user.getUser();
      if (!userData) {
        Alert.alert(t('error'), t('failedToLoadUser'));
        return;
      }

      let updatedUser = { ...userData };
      updatedUser.age = selectedAge;

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
      console.error('Failed to save age data:', error);
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
        <Text style={styles.headerTitle}>{t('setAge')}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.pickerContainer}>
          <PickerWheel
            data={ageData}
            selectedValue={selectedAge}
            onValueChange={(value) => setSelectedAge(value as number)}
            unit=""
            itemHeight={60}
            visibleItems={7}
            formatDisplay={formatAgeDisplay}
          />
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
    paddingTop: 80,
  },
  pickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

export default AgePickerScreen; 