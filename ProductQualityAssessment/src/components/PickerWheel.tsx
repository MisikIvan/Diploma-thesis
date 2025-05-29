import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  Vibration,
} from 'react-native';

interface PickerWheelProps {
  data: string[] | number[];
  selectedValue: string | number;
  onValueChange: (value: string | number) => void;
  itemHeight?: number;
  visibleItems?: number;
  unit?: string;
  formatDisplay?: (value: string | number) => string;
}

const { height: screenHeight } = Dimensions.get('window');

const PickerWheel: React.FC<PickerWheelProps> = ({
  data,
  selectedValue,
  onValueChange,
  itemHeight = 60,
  visibleItems = 5,
  unit = '',
  formatDisplay,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerHeight = itemHeight * visibleItems;
  const paddingVertical = itemHeight * Math.floor(visibleItems / 2);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const index = data.findIndex(item => item === selectedValue);
    if (index !== -1) {
      setCurrentIndex(index);
      scrollViewRef.current?.scrollTo({
        y: index * itemHeight,
        animated: false,
      });
    }
  }, [selectedValue, data, itemHeight]);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handleScroll = useCallback((event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / itemHeight);
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      if (index !== currentIndex && index >= 0 && index < data.length) {
        setCurrentIndex(index);
        onValueChange(data[index]);
        
       
        if (Platform.OS === 'android') {
          Vibration.vibrate(10);
        }
      }
    }, 50);
  }, [currentIndex, data, itemHeight, onValueChange]);

  const handleMomentumScrollEnd = useCallback((event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / itemHeight);
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
   
    if (index !== currentIndex && index >= 0 && index < data.length) {
      setCurrentIndex(index);
      onValueChange(data[index]);
    }
    
  
    scrollViewRef.current?.scrollTo({
      y: index * itemHeight,
      animated: true,
    });
  }, [currentIndex, data, itemHeight, onValueChange]);

  const renderItem = (item: string | number, index: number) => {
    const distance = Math.abs(index - currentIndex);
    
   
    if (distance > Math.ceil(visibleItems / 2) + 1) {
      return (
        <View
          key={index}
          style={[styles.item, { height: itemHeight, opacity: 0 }]}
        />
      );
    }
    
    const opacity = distance === 0 ? 1 : distance === 1 ? 0.6 : 0.3;
    const scale = distance === 0 ? 1 : 0.8;
    const isSelected = index === currentIndex;

    return (
      <View
        key={index}
        style={[
          styles.item,
          {
            height: itemHeight,
            opacity,
            transform: [{ scale }],
          },
          isSelected && styles.selectedItem,
        ]}
      >
        <Text
          style={[
            styles.itemText,
            isSelected && styles.selectedItemText,
          ]}
        >
          {formatDisplay ? formatDisplay(item) : item} {unit}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { height: containerHeight }]}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={{
          paddingVertical: paddingVertical,
        }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={32}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        removeClippedSubviews={true}
      >
        {data.map((item, index) => renderItem(item, index))}
      </ScrollView>
      
  
      <View style={[styles.selectionIndicator, { height: itemHeight }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  selectedItem: {
    backgroundColor: 'rgba(52, 87, 42, 0.1)',
  },
  itemText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '400',
  },
  selectedItemText: {
    fontSize: 20,
    color: '#333',
    fontWeight: '600',
  },
  selectionIndicator: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    marginTop: -30,
    backgroundColor: 'rgba(52, 87, 42, 0.1)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(52, 87, 42, 0.2)',
    pointerEvents: 'none',
  },
});

export default PickerWheel; 