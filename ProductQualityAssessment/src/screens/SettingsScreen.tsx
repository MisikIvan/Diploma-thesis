import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ProfileStackParamList } from '../navigation/types';

type SettingsScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'Settings'
>;

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    language: 'Українська',
  });

  const toggleSwitch = (key: string) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: !prevSettings[key as keyof typeof prevSettings]
    }));
  };

  const handleLanguageSelect = () => {
    Alert.alert('Зміна мови', 'Ця функція наразі не доступна.');
  };

  const handleClearCache = () => {
    Alert.alert(
      'Очистити кеш',
      'Ви впевнені, що хочете очистити кеш застосунку?',
      [
        {
          text: 'Відміна',
          style: 'cancel',
        },
        {
          text: 'Очистити',
          onPress: () => Alert.alert('Успіх', 'Кеш очищено!'),
        },
      ]
    );
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    description: string,
    rightElement: React.ReactNode
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIconContainer}>
        <Ionicons name={icon as any} size={24} color="#2ECC71" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <View style={styles.settingControl}>{rightElement}</View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Налаштування сповіщень</Text>
        {renderSettingItem(
          'notifications-outline',
          'Сповіщення',
          'Отримувати сповіщення про знижки та нові продукти',
          <Switch
            trackColor={{ false: '#ccc', true: '#a4e9c1' }}
            thumbColor={settings.notifications ? '#2ECC71' : '#f4f3f4'}
            onValueChange={() => toggleSwitch('notifications')}
            value={settings.notifications}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Оформлення</Text>
        {renderSettingItem(
          'moon-outline',
          'Темна тема',
          'Змінити кольорову схему застосунку',
          <Switch
            trackColor={{ false: '#ccc', true: '#a4e9c1' }}
            thumbColor={settings.darkMode ? '#2ECC71' : '#f4f3f4'}
            onValueChange={() => toggleSwitch('darkMode')}
            value={settings.darkMode}
          />
        )}
        {renderSettingItem(
          'language-outline',
          'Мова',
          'Оберіть мову застосунку',
          <TouchableOpacity onPress={handleLanguageSelect}>
            <Text style={styles.languageButton}>{settings.language}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Дані та пам'ять</Text>
        {renderSettingItem(
          'trash-outline',
          'Очистити кеш',
          'Видалити тимчасові файли застосунку',
          <TouchableOpacity onPress={handleClearCache}>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    marginLeft: 16,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  settingIconContainer: {
    width: 40,
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
    marginLeft: 12,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  settingControl: {
    marginLeft: 16,
  },
  languageButton: {
    color: '#2ECC71',
    fontSize: 14,
    fontWeight: '500',
  },
}); 