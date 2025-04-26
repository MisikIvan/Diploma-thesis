import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CATEGORIES } from '../constants';
import { HomeStackParamList } from '../navigation/types';

type AllCategoriesNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'AllCategories'>;

export default function AllCategoriesScreen() {
  const navigation = useNavigation<AllCategoriesNavigationProp>();

  return (
    <View style={styles.container}>
      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => navigation.navigate('CategoryProducts', {
              categoryId: item.id,
              categoryName: item.name,
            })}
          >
            <Text style={styles.categoryIcon}>{item.icon}</Text>
            <Text style={styles.categoryName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
}); 