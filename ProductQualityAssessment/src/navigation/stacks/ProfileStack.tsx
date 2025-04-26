import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../../screens/ProfileScreen';
import EditProfileScreen from '../../screens/EditProfileScreen';
import SettingsScreen from '../../screens/SettingsScreen';
import ViewHistoryScreen from '../../screens/ViewHistoryScreen';
import AdminPanelScreen from '../../screens/AdminPanelScreen';
import { ProfileStackParamList } from '../types';
import { useAppSelector } from '../../hooks/useAppSelector';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'admin';

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          title: 'Профіль',
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          title: 'Редагувати профіль',
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Налаштування',
        }}
      />
      <Stack.Screen
        name="ViewHistory"
        component={ViewHistoryScreen}
        options={{
          title: 'Історія переглядів',
        }}
      />
      {isAdmin && (
        <Stack.Screen
          name="AdminPanel"
          component={AdminPanelScreen}
          options={{
            title: 'Панель адміністратора',
          }}
        />
      )}
    </Stack.Navigator>
  );
} 