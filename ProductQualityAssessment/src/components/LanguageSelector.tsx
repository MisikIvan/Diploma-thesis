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
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#34572a',
  },
  languageOption: {
    flexDirection: 'row',
    width: '100%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: '#fff',
  },
  selectedLanguage: {
    backgroundColor: '#f8f9fa',
    borderColor: '#34572a',
    shadowColor: '#34572a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  languageText: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '500',
  },
  selectedLanguageText: {
    fontWeight: 'bold',
    color: '#34572a',
  },
  checkmark: {
    color: '#34572a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 16,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  cancelButtonText: {
    color: '#6c757d',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LanguageSelector; 