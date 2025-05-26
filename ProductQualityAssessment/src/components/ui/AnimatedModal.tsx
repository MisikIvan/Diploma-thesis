import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { t } from '../../utils/translations';

const { width, height } = Dimensions.get('window');

interface AnimatedModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  type?: 'confirm' | 'alert' | 'success' | 'error';
  children?: React.ReactNode;
}

const AnimatedModal: React.FC<AnimatedModalProps> = ({
  visible,
  onClose,
  title,
  message,
  confirmText = t('confirm'),
  cancelText = t('cancel'),
  onConfirm,
  onCancel,
  type = 'confirm',
  children,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = withSpring(0, {
        damping: 15,
        stiffness: 150,
      });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const getIconName = () => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'close-circle';
      case 'alert':
        return 'warning';
      default:
        return 'help-circle';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return '#27ae60';
      case 'error':
        return '#e74c3c';
      case 'alert':
        return '#f39c12';
      default:
        return '#3498db';
    }
  };

  const handleConfirm = () => {
    onConfirm?.();
  
    setTimeout(() => {
      onClose();
    }, 100);
  };

  const handleCancel = () => {
    onCancel?.();
   
    setTimeout(() => {
      onClose();
    }, 100);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Animated.View 
        style={styles.overlay}
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlayTouchable} />
        </TouchableWithoutFeedback>
        
        <Animated.View
          style={[styles.modalContainer, animatedStyle]}
          entering={SlideInDown.duration(300).springify()}
          exiting={SlideOutDown.duration(200)}
        >
          <View style={styles.iconContainer}>
            <Ionicons 
              name={getIconName() as any} 
              size={48} 
              color={getIconColor()} 
            />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {children}

          <View style={styles.buttonContainer}>
            {type === 'confirm' && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[
                styles.button, 
                styles.confirmButton,
                type === 'confirm' ? styles.confirmButtonHalf : styles.confirmButtonFull
              ]}
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>
                {type === 'confirm' ? confirmText : 'OK'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    width: width * 0.85,
    maxWidth: 400,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelButton: {
    backgroundColor: '#ecf0f1',
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  confirmButton: {
    backgroundColor: '#34572a',
  },
  confirmButtonHalf: {
    flex: 1,
  },
  confirmButtonFull: {
    width: '100%',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default AnimatedModal; 