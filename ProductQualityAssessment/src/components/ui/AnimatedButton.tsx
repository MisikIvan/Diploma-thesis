import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 150,
    });
    opacity.value = withTiming(0.8, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
    opacity.value = withTiming(1, { duration: 100 });
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      // Add haptic feedback
      scale.value = withSpring(0.9, {
        damping: 15,
        stiffness: 150,
      }, () => {
        scale.value = withSpring(1, {
          damping: 15,
          stiffness: 150,
        });
      });
      
      runOnJS(onPress)();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const getButtonStyle = (): ViewStyle[] => {
    const baseStyle: ViewStyle[] = [styles.button, styles[size]];
    
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primary);
        break;
      case 'secondary':
        baseStyle.push(styles.secondary);
        break;
      case 'danger':
        baseStyle.push(styles.danger);
        break;
      case 'success':
        baseStyle.push(styles.success);
        break;
    }

    if (disabled || loading) {
      baseStyle.push(styles.disabled);
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle[] => {
    const baseStyle: TextStyle[] = [styles.text, styles[`${size}Text` as keyof typeof styles]];
    
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primaryText);
        break;
      case 'secondary':
        baseStyle.push(styles.secondaryText);
        break;
      case 'danger':
        baseStyle.push(styles.dangerText);
        break;
      case 'success':
        baseStyle.push(styles.successText);
        break;
    }

    if (disabled || loading) {
      baseStyle.push(styles.disabledText);
    }

    return baseStyle;
  };

  return (
    <AnimatedTouchableOpacity
      style={[getButtonStyle(), animatedStyle, style]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={1}
    >
      {loading ? (
        <ActivityIndicator 
          size={size === 'small' ? 'small' : 'small'} 
          color={variant === 'secondary' ? '#34572a' : '#ffffff'} 
        />
      ) : (
        <>
          {icon && (
            <Ionicons 
              name={icon} 
              size={size === 'small' ? 16 : size === 'medium' ? 20 : 24} 
              color={variant === 'secondary' ? '#34572a' : '#ffffff'}
              style={styles.icon}
            />
          )}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  
  // Sizes
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 44,
  },
  large: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 52,
  },

  // Variants
  primary: {
    backgroundColor: '#34572a',
  },
  secondary: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#34572a',
  },
  danger: {
    backgroundColor: '#e74c3c',
  },
  success: {
    backgroundColor: '#27ae60',
  },

  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },

  // Text colors
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#34572a',
  },
  dangerText: {
    color: '#ffffff',
  },
  successText: {
    color: '#ffffff',
  },

  // Disabled state
  disabled: {
    backgroundColor: '#bdc3c7',
    elevation: 0,
    shadowOpacity: 0,
  },
  disabledText: {
    color: '#7f8c8d',
  },

  // Icon
  icon: {
    marginRight: 8,
  },
});

export default AnimatedButton; 