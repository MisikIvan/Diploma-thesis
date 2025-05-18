import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { testFirebasePermissions, getFirebaseRulesFixInstructions } from '../utils/firebase-permissions';
import { FIREBASE_CONFIG } from '../utils/config';
import * as Clipboard from 'expo-clipboard';
import { getCurrentUser } from '../api/firebase';
import { t } from '../utils/translations';

interface FirebaseDiagnosticScreenProps {
  navigation: any;
}

const FirebaseDiagnosticScreen: React.FC<FirebaseDiagnosticScreenProps> = ({ navigation }) => {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    navigation.setOptions({
      title: t('firebaseDiagnostics')
    });
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  };

  const runTests = async () => {
    setLoading(true);
    try {
      const results = await testFirebasePermissions();
      setTestResults(results);
    } catch (error) {
      console.error('Error running tests:', error);
      Alert.alert(t('error'), t('error'));
    } finally {
      setLoading(false);
    }
  };

  const copyFixesToClipboard = async () => {
    const fixes = getFirebaseRulesFixInstructions();
    await Clipboard.setStringAsync(fixes);
    Alert.alert(t('success'), t('copyInstructions'));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>{t('firebaseDiagnostics')}</Text>
        
        <View style={styles.configSection}>
          <Text style={styles.sectionTitle}>{t('firebaseConfiguration')}</Text>
          <Text style={styles.configItem}>{t('projectId')}: {FIREBASE_CONFIG.projectId}</Text>
          <Text style={styles.configItem}>{t('apiKey')}: {FIREBASE_CONFIG.apiKey.substring(0, 5)}...{FIREBASE_CONFIG.apiKey.substring(FIREBASE_CONFIG.apiKey.length - 5)}</Text>
        </View>

        <View style={styles.userSection}>
          <Text style={styles.sectionTitle}>{t('currentUser')}</Text>
          {currentUser ? (
            <>
              <Text style={styles.userItem}>ID: {currentUser.userId}</Text>
              <Text style={styles.userItem}>{t('email')}: {currentUser.email}</Text>
              <Text style={styles.userItem}>{t('role')}: {currentUser.role}</Text>
              <Text style={styles.userItem}>
                {t('status')}: {currentUser.isBlocked ? t('blocked') : t('active')}
              </Text>
            </>
          ) : (
            <Text style={styles.warning}>{t('notLoggedIn')}</Text>
          )}
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={runTests}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? t('runningTests') : t('runPermissionTests')}
          </Text>
        </TouchableOpacity>

        {testResults && (
          <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>{t('testResults')}</Text>
            
            <View style={styles.resultItem}>
              <Text style={styles.resultTitle}>{t('productsCollection')}:</Text>
              <Text style={testResults.products.success ? styles.success : styles.error}>
                {testResults.products.success ? t('accessGranted') : t('permissionDenied')}
              </Text>
              {!testResults.products.success && testResults.products.error && (
                <Text style={styles.errorMessage}>{testResults.products.error}</Text>
              )}
            </View>
            
            <View style={styles.resultItem}>
              <Text style={styles.resultTitle}>{t('usersCollection')}:</Text>
              <Text style={testResults.users.success ? styles.success : styles.error}>
                {testResults.users.success ? t('accessGranted') : t('permissionDenied')}
              </Text>
              {!testResults.users.success && testResults.users.error && (
                <Text style={styles.errorMessage}>{testResults.users.error}</Text>
              )}
            </View>
            
            <View style={styles.resultItem}>
              <Text style={styles.resultTitle}>{t('commentsCollection')}:</Text>
              <Text style={testResults.comments.success ? styles.success : styles.error}>
                {testResults.comments.success ? t('accessGranted') : t('permissionDenied')}
              </Text>
              {!testResults.comments.success && testResults.comments.error && (
                <Text style={styles.errorMessage}>{testResults.comments.error}</Text>
              )}
            </View>

            {Object.values(testResults).some((result: any) => !result.success) && (
              <View style={styles.fixSection}>
                <Text style={styles.fixTitle}>{t('howToFix')}</Text>
                <Text style={styles.fixText}>
                  {t('securityRulesUpdate')}
                </Text>
                <TouchableOpacity style={styles.fixButton} onPress={copyFixesToClipboard}>
                  <Text style={styles.fixButtonText}>{t('copyInstructions')}</Text>
                </TouchableOpacity>

                <View style={styles.quickFixSection}>
                  <Text style={styles.quickFixTitle}>{t('quickFixSteps')}:</Text>
                  <Text style={styles.quickFixStep}>1. {t('firebaseDiagnostics')} → {t('firebaseConfiguration')} → {t('firebaseDiagnostics')} → {t('testResults')}</Text>
                  <Text style={styles.quickFixStep}>2. {t('developmentRulesWarning')}</Text>
                  <Text style={styles.quickFixStep}>3. {t('securityRulesUpdate')}</Text>
                  <Text style={styles.quickFixWarning}>{t('developmentRulesWarning')}</Text>
                  <Text style={styles.quickFixStep}>
                    {t('rulesUpdateTime')}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  configSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  configItem: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  userSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  userItem: {
    fontSize: 14,
    marginBottom: 4,
  },
  warning: {
    color: 'orange',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultsSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    elevation: 2,
  },
  resultItem: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  success: {
    color: 'green',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
  },
  errorMessage: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'monospace',
  },
  fixSection: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0066cc',
  },
  fixTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  fixText: {
    marginBottom: 12,
    lineHeight: 20,
  },
  fixButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  fixButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  quickFixSection: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffda6a',
  },
  quickFixTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#856404',
  },
  quickFixStep: {
    marginBottom: 6,
    lineHeight: 20,
    color: '#533f03',
  },
  quickFixWarning: {
    color: '#dc3545',
    fontWeight: 'bold',
    marginVertical: 8,
  },
});

export default FirebaseDiagnosticScreen; 