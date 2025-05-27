import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { t } from '../utils/translations';

const { width } = Dimensions.get('window');

interface AvatarSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelectAvatar: (avatarPath: string) => void;
  currentAvatar?: string;
}

const avatarOptions = [
  { id: 1, path: require('../assets/profile1.png'), name: 'Avatar 1' },
  { id: 2, path: require('../assets/profile2.png'), name: 'Avatar 2' },
  { id: 3, path: require('../assets/profile3.png'), name: 'Avatar 3' },
  { id: 4, path: require('../assets/profile4.png'), name: 'Avatar 4' },
  { id: 5, path: require('../assets/profile5.png'), name: 'Avatar 5' },
  { id: 6, path: require('../assets/profile6.png'), name: 'Avatar 6' },
  { id: 'currents', path: require('../assets/profile-currents.jpg'), name: 'Currents Avatar' },
];

const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  visible,
  onClose,
  onSelectAvatar,
  currentAvatar,
}) => {
  const handleSelectAvatar = (avatarPath: string) => {
    onSelectAvatar(avatarPath);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('selectAvatar')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView contentContainerStyle={styles.avatarGrid}>
            {avatarOptions.map((avatar) => {
              const avatarFileName = avatar.id === 'currents' 
                ? 'profile-currents.jpg' 
                : `profile${avatar.id}.png`;
              
              return (
                <TouchableOpacity
                  key={avatar.id}
                  style={[
                    styles.avatarOption,
                    currentAvatar === avatarFileName && styles.selectedAvatar,
                  ]}
                  onPress={() => handleSelectAvatar(avatarFileName)}
                >
                  <Image source={avatar.path} style={styles.avatarImage} />
                  <View style={styles.avatarOverlay}>
                    {currentAvatar === avatarFileName && (
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: width * 0.9,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  avatarOption: {
    width: (width * 0.9 - 80) / 3,
    aspectRatio: 1,
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  selectedAvatar: {
    borderWidth: 3,
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOpacity: 0.3,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  checkmarkText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AvatarSelector; 