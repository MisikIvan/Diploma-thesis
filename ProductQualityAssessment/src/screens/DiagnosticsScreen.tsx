import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { t } from '../utils/translations';
import { testFirebasePermissions } from '../utils/firebase-permissions';
import { useAppSelector } from '../redux/hooks';

interface TestResult {
  success: boolean;
  error: string | null;
}

interface TestResults {
  products: TestResult;
  users: TestResult;
  comments: TestResult;
}

const DiagnosticsScreen: React.FC = () => {
  const [results, setResults] = useState<TestResults | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { currentUser } = useAppSelector((state) => state.user);
  
  const runTests = async () => {
    setLoading(true);
    try {
      const testResults = await testFirebasePermissions();
      setResults(testResults);
    } catch (error) {
      console.error('Error running tests:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('firebaseDiagnostics')}</Text>
      
      <View style={styles.userSection}>
        <Text style={styles.sectionTitle}>{t('currentUser')}</Text>
        {currentUser ? (
          <>
            <Text style={styles.userItem}>ID: {currentUser.userId}</Text>
            <Text style={styles.userItem}>{t('email')}: {currentUser.email}</Text>
            <Text style={styles.userItem}>{t('displayName')}: {currentUser.displayName}</Text>
            <Text style={styles.userItem}>{t('role')}: {currentUser.role}</Text>
            <Text style={styles.userItem}>{t('status')}: {currentUser.isBlocked ? t('blocked') : t('active')}</Text>
            <Text style={styles.userItem}>{t('canComment')}: {currentUser.canComment ? 'Yes' : 'No'}</Text>
          </>
        ) : (
          <Text style={styles.noUser}>{t('notLoggedIn')}</Text>
        )}
      </View>
      
      <TouchableOpacity
        style={styles.button}
        onPress={runTests}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? t('runningTests') : t('runPermissionTests')}
        </Text>
      </TouchableOpacity>
      
      {results && (
        <View style={styles.resultsSection}>
          <Text style={styles.sectionTitle}>{t('testResults')}</Text>
          
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>{t('productsCollection')}: </Text>
            <Text style={results.products.success ? styles.success : styles.error}>
              {results.products.success ? t('accessGranted') : t('permissionDenied')}
            </Text>
            {results.products.error && <Text style={styles.errorDetails}>{results.products.error}</Text>}
          </View>
          
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>{t('usersCollection')}: </Text>
            <Text style={results.users.success ? styles.success : styles.error}>
              {results.users.success ? t('accessGranted') : t('permissionDenied')}
            </Text>
            {results.users.error && <Text style={styles.errorDetails}>{results.users.error}</Text>}
          </View>
          
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>{t('commentsCollection')}: </Text>
            <Text style={results.comments.success ? styles.success : styles.error}>
              {results.comments.success ? t('accessGranted') : t('permissionDenied')}
            </Text>
            {results.comments.error && <Text style={styles.errorDetails}>{results.comments.error}</Text>}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userSection: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userItem: {
    marginBottom: 6,
    fontSize: 14,
  },
  noUser: {
    fontStyle: 'italic',
    color: '#666',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  resultsSection: {
    marginVertical: 20,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  resultItem: {
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  success: {
    color: 'green',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
  },
  errorDetails: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: 2,
  }
});

export default DiagnosticsScreen; 