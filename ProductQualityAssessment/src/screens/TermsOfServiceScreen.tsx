import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { t } from '../utils/translations';

const TermsOfServiceScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('termsOfServiceTitle')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>
            {t('lastUpdatedDate29May')}
          </Text>

          <Text style={styles.sectionTitle}>{t('introduction')}</Text>
          <Text style={styles.paragraph}>
            {t('termsIntroText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('acceptanceOfTerms')}</Text>
          <Text style={styles.paragraph}>
            {t('termsAcceptanceFullText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('servicesProvided')}</Text>
          <Text style={styles.paragraph}>
            {t('servicesProvidedFullText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('userResponsibilities')}</Text>
          <Text style={styles.paragraph}>
            {t('userResponsibilitiesFullText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('privacyAndDataProtection')}</Text>
          <Text style={styles.paragraph}>
            {t('privacyDataProtectionFullText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('limitationOfLiability')}</Text>
          <Text style={styles.paragraph}>
            {t('limitationLiabilityFullText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('terminationOfServices')}</Text>
          <Text style={styles.paragraph}>
            {t('terminationServicesFullText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('modificationsToTerms')}</Text>
          <Text style={styles.paragraph}>
            {t('modificationsTermsFullText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('contactInformation')}</Text>
          <Text style={styles.paragraph}>
            {t('contactInformationFullText')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34572a',
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    marginBottom: 16,
    textAlign: 'justify',
  },
});

export default TermsOfServiceScreen; 