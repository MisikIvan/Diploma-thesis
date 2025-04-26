import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppSelector } from '../hooks/useAppSelector';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function RecentlyViewedList() {
  const navigation = useNavigation<NavigationProp>();
  const recentlyViewed = useAppSelector((state) => state.products.recentlyViewed);

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Недавно переглянуто</Text>
      <FlatList
        data={recentlyViewed}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
          >
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  list: {
    paddingHorizontal: 16,
  },
  card: {
    width: 120,
    marginRight: 12,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 12,
    color: '#333',
  },
}); 