import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { Ionicons } from '@expo/vector-icons';
import { t } from '../utils/translations';

interface SearchBarProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
  onFilterPress?: () => void;
  onBarcodePress?: () => void;
  loading?: boolean;
  showBarcodeButton?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  initialQuery = '',
  onSearch,
  onFilterPress,
  onBarcodePress,
  loading = false,
  showBarcodeButton = true
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleChangeText = (text: string) => {
    setQuery(text);
    setIsTyping(true);
    
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    const newTimeoutId = setTimeout(() => {
      onSearch(text);
      setIsTyping(false);
    }, 300);
    
    setTimeoutId(newTimeoutId);
  };

  const handleSubmit = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsTyping(false);
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    setIsTyping(false);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    onSearch('');
  };

  const isBarcode = (text: string) => {
    // Check if text is a barcode 
    return /^\d{8,13}$/.test(text.trim());
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#6c757d" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder={t('searchPlaceholder') + ' або штрих-код'}
          value={query}
          onChangeText={handleChangeText}
          returnKeyType="search"
          onSubmitEditing={handleSubmit}
          clearButtonMode="while-editing"
          placeholderTextColor="#6c757d"
          keyboardType="default"
        />
        {query.length > 0 && (
          <View style={styles.inputActions}>
            {isBarcode(query) && (
              <View style={styles.barcodeIndicator}>
                <Ionicons name="barcode-outline" size={16} color="#34572a" />
              </View>
            )}
            <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
              <Feather name="x-circle" size={18} color="#6c757d" />
            </TouchableOpacity>
          </View>
        )}
        {showBarcodeButton && (
          <TouchableOpacity 
            style={styles.barcodeButton} 
            onPress={onBarcodePress}
            disabled={loading}
          >
            <Ionicons name="scan" size={20} color="#34572a" />
          </TouchableOpacity>
        )}
      </View>
      {onFilterPress && (
        <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
          <MaterialCommunityIcons name="tune-variant" size={22} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barcodeIndicator: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    padding: 4,
  },
  barcodeButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 20,
    backgroundColor: '#f0f8f0',
    borderWidth: 1,
    borderColor: '#34572a',
  },
  filterButton: {
    backgroundColor: '#34572a',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default SearchBar; 