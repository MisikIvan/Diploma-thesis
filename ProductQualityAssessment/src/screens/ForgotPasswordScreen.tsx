import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/types';
import auth from '@react-native-firebase/auth';

type ForgotPasswordNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<ForgotPasswordNavigationProp>();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Електронна пошта обов\'язкова');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Некоректна електронна пошта');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateEmail(email)) {
      return;
    }

    setLoading(true);
    try {
      await auth().sendPasswordResetEmail(email);
      setSuccess(true);
    } catch (error: any) {
      let errorMessage = 'Сталася помилка. Спробуйте ще раз.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Користувача з цією електронною поштою не знайдено.';
      }
      Alert.alert('Помилка', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View style={styles.successContainer}>
        <Ionicons name="checkmark-circle-outline" size={80} color="#2ECC71" />
        <Text style={styles.successTitle}>Інструкції відправлено</Text>
        <Text style={styles.successMessage}>
          Ми відправили інструкції з відновлення пароля на вашу електронну пошту.
          Будь ласка, перевірте вашу скриньку.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text style={styles.backButtonText}>Повернутися до входу</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Відновлення пароля</Text>
        <Text style={styles.subtitle}>
          Введіть електронну пошту, пов'язану з вашим обліковим записом, і ми надішлемо вам інструкції
          для скидання пароля.
        </Text>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Електронна пошта</Text>
            <TextInput
              style={[styles.input, emailError ? styles.inputError : null]}
              placeholder="example@gmail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) validateEmail(text);
              }}
              onBlur={() => validateEmail(email)}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          </View>

          <TouchableOpacity
            style={[styles.resetButton, loading ? styles.buttonDisabled : null]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.resetButtonText}>Скинути пароль</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backLink}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color="#2ECC71" style={styles.backIcon} />
            <Text style={styles.backLinkText}>Повернутися до входу</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    lineHeight: 22,
  },
  formContainer: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#E74C3C',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 14,
    marginTop: 4,
  },
  resetButton: {
    backgroundColor: '#2ECC71',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    marginRight: 8,
  },
  backLinkText: {
    color: '#2ECC71',
    fontSize: 16,
    fontWeight: '500',
  },
  successContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 24,
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  backButton: {
    backgroundColor: '#2ECC71',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
}); 