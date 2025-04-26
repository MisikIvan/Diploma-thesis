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
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../hooks/useAppSelector';
import ProductCard from '../components/ProductCard';
import { RootStackParamList } from '../navigation/types';

type FavoritesNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function FavoritesScreen() {
  const navigation = useNavigation<FavoritesNavigationProp>();
  const favorites = useAppSelector((state) => state.products.favorites);
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return (
      <View style={styles.authContainer}>
        <Text style={styles.authTitle}>Увійдіть в обліковий запис</Text>
        <Text style={styles.authDesc}>
          Щоб зберігати улюблені продукти, вам потрібно увійти в систему
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

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="#ddd" />
          <Text style={styles.emptyTitle}>Немає збережених продуктів</Text>
          <Text style={styles.emptyDesc}>
            Додавайте продукти до обраного, натискаючи на іконку серця
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('ProductDetails', { product: item })}
            />
          )}
          numColumns={2}
          columnWrapperStyle={styles.productColumns}
          contentContainerStyle={styles.productList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  productList: {
    padding: 16,
  },
  productColumns: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
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