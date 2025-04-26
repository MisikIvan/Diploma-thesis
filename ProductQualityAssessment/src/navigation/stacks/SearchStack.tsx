import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchScreen from '../../screens/SearchScreen';
import SearchResultsScreen from '../../screens/SearchResultsScreen';
import { SearchStackParamList } from '../types';

const Stack = createNativeStackNavigator<SearchStackParamList>();

export default function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          title: 'Пошук',
        }}
      />
      <Stack.Screen
        name="SearchResults"
        component={SearchResultsScreen}
        options={({ route }) => ({
          title: `Результати: ${route.params.query}`,
        })}
      />
    </Stack.Navigator>
  );
} 