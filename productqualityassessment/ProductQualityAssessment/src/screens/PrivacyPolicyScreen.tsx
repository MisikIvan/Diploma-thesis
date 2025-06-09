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

const PrivacyPolicyScreen: React.FC = () => {
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
        <Text style={styles.headerTitle}>{t('privacyPolicyTitle')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>
            {t('lastUpdatedDate29May')}
          </Text>

          <Text style={styles.sectionTitle}>{t('introduction')}</Text>
          <Text style={styles.paragraph}>
            {t('privacyIntroText')}
          </Text>

          <Text style={styles.paragraph}>
            {t('privacyIntroText2')}
          </Text>

          <Text style={styles.sectionTitle}>{t('dataCollection')}</Text>
          <Text style={styles.paragraph}>
            {t('dataCollectionFullText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('dataUsage')}</Text>
          <Text style={styles.paragraph}>
            {t('dataUsageFullText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('dataSecurity')}</Text>
          <Text style={styles.paragraph}>
            {t('dataSecurityFullText')}
          </Text>

          <Text style={styles.paragraph}>
            {t('dataSecurityMeasuresText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('userRights')}</Text>
          <Text style={styles.paragraph}>
            {t('userRightsFullText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('cookiesAndTracking')}</Text>
          <Text style={styles.paragraph}>
            {t('cookiesTrackingFullText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('thirdPartyServices')}</Text>
          <Text style={styles.paragraph}>
            {t('thirdPartyServicesFullText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('dataRetention')}</Text>
          <Text style={styles.paragraph}>
            {t('dataRetentionFullText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('internationalTransfers')}</Text>
          <Text style={styles.paragraph}>
            {t('internationalTransfersFullText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('changesPrivacyPolicy')}</Text>
          <Text style={styles.paragraph}>
            {t('changesPrivacyPolicyFullText')}
          </Text>

          <Text style={styles.sectionTitle}>{t('contactInformation')}</Text>
          <Text style={styles.paragraph}>
            {t('privacyContactInformationFullText')}
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

export default PrivacyPolicyScreen; 