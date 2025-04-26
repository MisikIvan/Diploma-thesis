import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../hooks';
import { ProfileStackParamList } from '../navigation/types';

type EditProfileScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'EditProfile'
>;

export default function EditProfileScreen() {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();
  const user = useAppSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
  });

  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSave = () => {

    Alert.alert('Успіх', 'Профіль успішно оновлено!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Ім'я</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(value) => handleChange('name', value)}
          placeholder="Ваше ім'я"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(value) => handleChange('email', value)}
          placeholder="Ваш email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Телефон</Text>
        <TextInput
          style={styles.input}
          value={formData.phone}
          onChangeText={(value) => handleChange('phone', value)}
          placeholder="Ваш телефон"
          keyboardType="phone-pad"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Зберегти зміни</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  saveButton: {
    backgroundColor: '#2ECC71',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 