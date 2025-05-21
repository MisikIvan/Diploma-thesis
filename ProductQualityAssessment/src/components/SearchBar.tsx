import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useAppDispatch } from '../hooks/reduxHooks';
import { setSearchQuery } from '../redux/slices/productSlice';
import { APP_CONSTANTS } from '../utils/config';
import { t } from '../utils/translations';

interface SearchBarProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
  onFilterPress: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  initialQuery = '',
  onSearch,
  onFilterPress 
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const dispatch = useAppDispatch();


  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleChangeText = (text: string) => {
    setQuery(text);
    

    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
 
    const newTimeoutId = setTimeout(() => {
      dispatch(setSearchQuery(text));
      onSearch(text);
    }, APP_CONSTANTS.DEBOUNCE_SEARCH);
    
    setTimeoutId(newTimeoutId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder={t('search')}
          value={query}
          onChangeText={handleChangeText}
          returnKeyType="search"
          onSubmitEditing={() => onSearch(query)}
          clearButtonMode="while-editing"
        />
      </View>
      <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
        <Text style={styles.filterIcon}>🔍</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    backgroundColor: '#007AFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  filterIcon: {
    fontSize: 20,
    color: 'white',
  },
});

export default SearchBar; 