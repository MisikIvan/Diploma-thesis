import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../hooks';
import { signOut } from '../store/slices/authSlice';
import { ProfileStackParamList, RootStackParamList } from '../navigation/types';
import { RootState } from '../store';

type ProfileNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList & RootStackParamList,
  'ProfileScreen'
>;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileNavigationProp>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);

  if (!user) {
    return (
      <View style={styles.authContainer}>
        <Text style={styles.authTitle}>Увійдіть в обліковий запис</Text>
        <Text style={styles.authDesc}>
          Щоб переглядати профіль та керувати налаштуваннями, вам потрібно увійти в систему
        </Text>
        <TouchableOpacity
          style={styles.authButton}
          onPress={() => navigation.navigate('Auth')}
        >
          <Text style={styles.authButtonText}>Увійти</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSignOut = async () => {
    try {
      await dispatch(signOut()).unwrap();
      navigation.navigate('Auth');
    } catch (error) {
      console.error('Помилка при виході:', error);
    }
  };

  const renderMenuItem = (
    icon: keyof typeof Ionicons.glyphMap,
    title: string,
    onPress: () => void
  ) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={22} color="#333" style={styles.menuIcon} />
      <Text style={styles.menuTitle}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={user.avatarUrl ? { uri: user.avatarUrl } : require('../assets/images/default-avatar.png')}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          {user.role === 'admin' && (
            <View style={styles.adminBadge}>
              <Text style={styles.adminText}>Адміністратор</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Ionicons name="pencil" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Мій аккаунт</Text>
        {renderMenuItem('heart', 'Улюблені продукти', () => navigation.navigate('Main', { screen: 'Favorites' }))}
        {renderMenuItem('time', 'Історія переглядів', () => navigation.navigate('ViewHistory'))}
        {renderMenuItem('settings', 'Налаштування', () => navigation.navigate('Settings'))}
      </View>

      {user.role === 'admin' && (
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Панель адміністратора</Text>
          {renderMenuItem('grid', 'Керування продуктами', () => navigation.navigate('AdminPanel'))}
        </View>
      )}

      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={22} color="#E74C3C" style={styles.menuIcon} />
          <Text style={styles.signOutText}>Вийти з облікового запису</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  adminBadge: {
    backgroundColor: '#2ECC71',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  adminText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: '#2ECC71',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    right: 20,
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIcon: {
    marginRight: 16,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  signOutText: {
    fontSize: 16,
    color: '#E74C3C',
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  authTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  authDesc: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  authButton: {
    backgroundColor: '#2ECC71',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});