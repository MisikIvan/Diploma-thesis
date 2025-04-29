import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Language, setLanguage, getCurrentLanguage, t } from '../utils/translations';

interface LanguageSelectorProps {
  isVisible: boolean;
  onClose: () => void;
  onLanguageChange: (language: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  isVisible, 
  onClose, 
  onLanguageChange
}) => {
  const currentLanguage = getCurrentLanguage();

  const handleLanguageSelect = (language: Language) => {
    setLanguage(language);
    onLanguageChange(language);
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{t('selectLanguage')}</Text>
          
          <TouchableOpacity 
            style={[
              styles.languageOption, 
              currentLanguage === 'uk' && styles.selectedLanguage
            ]}
            onPress={() => handleLanguageSelect('uk')}
          >
            <Text 
              style={[
                styles.languageText, 
                currentLanguage === 'uk' && styles.selectedLanguageText
              ]}
            >
              {t('ukrainian')}
            </Text>
            {currentLanguage === 'uk' && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.languageOption, 
              currentLanguage === 'en' && styles.selectedLanguage
            ]}
            onPress={() => handleLanguageSelect('en')}
          >
            <Text 
              style={[
                styles.languageText, 
                currentLanguage === 'en' && styles.selectedLanguageText
              ]}
            >
              {t('english')}
            </Text>
            {currentLanguage === 'en' && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
          </TouchableOpacity>
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
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  languageOption: {
    flexDirection: 'row',
    width: '100%',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedLanguage: {
    backgroundColor: '#e6f2ff',
  },
  languageText: {
    fontSize: 16,
  },
  selectedLanguageText: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  checkmark: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default LanguageSelector; 