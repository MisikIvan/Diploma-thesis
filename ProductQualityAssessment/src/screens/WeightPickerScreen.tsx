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
import { t, getWeightText } from '../utils/translations';
import PickerWheel from '../components/PickerWheel';
import { RootStackParamList } from '../types/navigation';
import { StorageService } from '../utils/storage';
import { useAppSelector } from '../redux/hooks';
import { updateUserProfile } from '../api/userProfile';

type WeightPickerScreenProps = StackScreenProps<RootStackParamList, 'WeightPicker'>;

const WeightPickerScreen: React.FC<WeightPickerScreenProps> = ({ navigation, route }) => {
  const { currentWeight, title, type } = route.params;
  const [selectedWeight, setSelectedWeight] = useState(currentWeight || 60);
  const [isLoading, setIsLoading] = useState(false);

  const currentUserFromRedux = useAppSelector(state => state.user.currentUser);

  
  const generateWeightData = () => {
    const weights = [];
    for (let i = 30; i <= 150; i += 0.5) {
      weights.push(Math.round(i * 10) / 10);
    }
    return weights;
  };

  const weightData = generateWeightData();

  const formatWeightDisplay = (weight: string | number): string => {
    return getWeightText(Number(weight));
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
      
      if (type === 'goalWeight') {
        updatedUser.goalWeight = selectedWeight;
      } else {
        updatedUser.currentWeight = selectedWeight;
   
        const weightHistory = updatedUser.weightHistory || [];
        weightHistory.push({
          weight: selectedWeight,
          date: new Date().toISOString()
        });
        updatedUser.weightHistory = weightHistory;
      }

    
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
      console.error('Failed to save weight data:', error);
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
        <Text style={styles.headerTitle}>{t('setWeight')}</Text>
        <View style={styles.placeholder} />
      </View>

 
      <View style={styles.content}>
    
        <View style={styles.pickerContainer}>
          <PickerWheel
            data={weightData}
            selectedValue={selectedWeight}
            onValueChange={(value) => setSelectedWeight(value as number)}
            unit=""
            itemHeight={60}
            visibleItems={7}
            formatDisplay={formatWeightDisplay}
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
    paddingTop: 40,
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

export default WeightPickerScreen; 