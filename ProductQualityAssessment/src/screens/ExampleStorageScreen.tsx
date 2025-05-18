import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, ActivityIndicator, Alert } from 'react-native';
import { DataService } from '../utils/dataService';
import { FirebaseService } from '../utils/firebase';
import type { Product, Favorite } from '../types/index';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Example screen demonstrating the hybrid storage approach with AsyncStorage + Firebase Firestore
 */
const ExampleStorageScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  // Example product ID - replace with a valid ID in your database
  const sampleProductId = 'product123';
  
  // Simulated user ID - in a real app, this would come from authentication
  const userId = 'user123';

  // Check if user is signed in
  useEffect(() => {
    const checkUser = async () => {
      const currentUser = FirebaseService.auth.getCurrentUser();
      setIsSignedIn(!!currentUser);
      
      if (currentUser) {
        try {
          const userData = await DataService.user.getUser(currentUser.uid);
          setUser(userData);
        } catch (error) {
          console.error('Error getting user data:', error);
        }
      }
    };
    
    checkUser();
  }, []);

  // Example: Sign in with Firebase
  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      // This is a demonstration - you should never hardcode credentials in a real app
      const firebaseUser = await FirebaseService.auth.signIn('demo@example.com', 'password123');
      
      // Get user data
      const userData = await DataService.user.getUser(firebaseUser.uid);
      setUser(userData);
      setIsSignedIn(true);
      Alert.alert('Success', 'Signed in successfully');
    } catch (error) {
      console.error('Sign in error:', error);
      Alert.alert('Error', 'Sign in failed. Check credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Example: Sign out
  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await DataService.user.signOut();
      setUser(null);
      setIsSignedIn(false);
      Alert.alert('Success', 'Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Error', 'Sign out failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Example: Get product data
  const handleGetProduct = async () => {
    try {
      setIsLoading(true);
      const productData = await DataService.products.getProduct(sampleProductId);
      setProduct(productData);
      
      if (productData) {
        // Add to view history if product exists
        if (isSignedIn) {
          await DataService.viewHistory.addToViewHistory(userId, productData);
        }
      } else {
        Alert.alert('Not Found', 'Product not found');
      }
    } catch (error) {
      console.error('Error getting product:', error);
      Alert.alert('Error', 'Failed to get product data');
    } finally {
      setIsLoading(false);
    }
  };

  // Example: Get favorites
  const handleGetFavorites = async () => {
    try {
      setIsLoading(true);
      
      if (isSignedIn) {
        const userFavorites = await DataService.favorites.getUserFavorites(userId);
        setFavorites(userFavorites);
      } else {
        Alert.alert('Not Signed In', 'Please sign in to view favorites');
      }
    } catch (error) {
      console.error('Error getting favorites:', error);
      Alert.alert('Error', 'Failed to get favorites');
    } finally {
      setIsLoading(false);
    }
  };

  // Example: Add product to favorites
  const handleAddFavorite = async () => {
    try {
      setIsLoading(true);
      
      if (!product) {
        Alert.alert('No Product', 'Please load a product first');
        setIsLoading(false);
        return;
      }
      
      if (isSignedIn) {
        const favorite: Favorite = {
          favoriteId: `${userId}_${product.productId}_${Date.now()}`,
          userId,
          productId: product.productId,
          addedAt: new Date().toISOString()
        };
        
        const updatedFavorites = await DataService.favorites.addFavorite(favorite);
        setFavorites(updatedFavorites.filter(fav => fav.userId === userId));
        Alert.alert('Success', 'Product added to favorites');
      } else {
        Alert.alert('Not Signed In', 'Please sign in to add favorites');
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
      Alert.alert('Error', 'Failed to add favorite');
    } finally {
      setIsLoading(false);
    }
  };

  // Render favorites list item
  const renderFavoriteItem = ({ item }: { item: Favorite }) => (
    <View style={styles.favoriteItem}>
      <Text>Product ID: {item.productId}</Text>
      <Text>Added: {new Date(item.addedAt).toLocaleDateString()}</Text>
      <Button 
        title="Remove" 
        onPress={() => {
          DataService.favorites.removeFavorite(userId, item.productId)
            .then(updated => {
              setFavorites(updated.filter(fav => fav.userId === userId));
            })
            .catch(err => console.error('Error removing favorite:', err));
        }} 
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Storage Example</Text>
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
        </View>
      )}
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Authentication</Text>
        {isSignedIn ? (
          <>
            <Text>Signed in as: {user?.displayName || user?.email || 'User'}</Text>
            <Button title="Sign Out" onPress={handleSignOut} />
          </>
        ) : (
          <Button title="Sign In" onPress={handleSignIn} />
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Product Data</Text>
        <Button title="Get Product" onPress={handleGetProduct} />
        
        {product && (
          <View style={styles.productContainer}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text>Nutri-Score: {product.nutriscoreGrade}</Text>
            <Text>Categories: {product.categories.join(', ')}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Favorites</Text>
        <View style={styles.buttonRow}>
          <Button title="Get Favorites" onPress={handleGetFavorites} />
          <Button title="Add to Favorites" onPress={handleAddFavorite} />
        </View>
        
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={item => item.favoriteId}
          ListEmptyComponent={<Text style={styles.emptyText}>No favorites found</Text>}
          style={styles.favoritesList}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    zIndex: 1000,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  productContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  favoritesList: {
    maxHeight: 200,
  },
  favoriteItem: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    marginVertical: 4,
    borderRadius: 6,
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 12,
  },
});

export default ExampleStorageScreen; 