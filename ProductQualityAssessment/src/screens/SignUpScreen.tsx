import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../hooks';
import { signUpWithEmail, clearError } from '../store/slices/authSlice';
import { RootStackParamList } from '../navigation/types';
import { PASSWORD_MIN_LENGTH } from '../constants';
import { RootState } from '../store';

type SignUpNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

export default function SignUpScreen() {
  const navigation = useNavigation<SignUpNavigationProp>();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state: RootState) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  React.useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const validateName = (name: string) => {
    if (!name) {
      setNameError('Ім\'я обов\'язкове');
      return false;
    } else if (name.length < 2) {
      setNameError('Ім\'я має бути не менше 2 символів');
      return false;
    }
    setNameError('');
    return true;
  };

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

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Пароль обов\'язковий');
      return false;
    } else if (password.length < PASSWORD_MIN_LENGTH) {
      setPasswordError(`Пароль має бути не менше ${PASSWORD_MIN_LENGTH} символів`);
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) {
      setConfirmPasswordError('Підтвердження пароля обов\'язкове');
      return false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Паролі не співпадають');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleSignUp = async () => {
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    try {
      await dispatch(signUpWithEmail({ name, email, password })).unwrap();
      navigation.navigate('Main', { screen: 'Home' });
    } catch (error) {
      console.error('Sign up error:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Створити обліковий запис</Text>
        <Text style={styles.subtitle}>Введіть свої дані для реєстрації</Text>

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#E74C3C" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ім'я</Text>
            <TextInput
              style={[styles.input, nameError ? styles.inputError : null]}
              placeholder="Ваше ім'я"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (nameError) validateName(text);
              }}
              onBlur={() => validateName(name)}
            />
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          </View>

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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Пароль</Text>
            <View style={[styles.passwordContainer, passwordError ? styles.inputError : null]}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Введіть пароль"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) validatePassword(text);
                  if (confirmPassword && confirmPasswordError) {
                    validateConfirmPassword(confirmPassword);
                  }
                }}
                onBlur={() => validatePassword(password)}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="#777"
                />
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Підтвердження пароля</Text>
            <View style={[styles.passwordContainer, confirmPasswordError ? styles.inputError : null]}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Повторіть пароль"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (confirmPasswordError) validateConfirmPassword(text);
                }}
                onBlur={() => validateConfirmPassword(confirmPassword)}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="#777"
                />
              </TouchableOpacity>
            </View>
            {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
          </View>

          <TouchableOpacity
            style={[styles.signUpButton, loading ? styles.buttonDisabled : null]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.signUpButtonText}>Зареєструватися</Text>
            )}
          </TouchableOpacity>

          <View style={styles.signinContainer}>
            <Text style={styles.signinText}>Вже є обліковий запис?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.signinLink}>Увійти</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
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
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDECEA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 14,
    marginLeft: 8,
  },
  formContainer: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  passwordToggle: {
    padding: 8,
  },
  signUpButton: {
    backgroundColor: '#2ECC71',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  signinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signinText: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  signinLink: {
    fontSize: 14,
    color: '#2ECC71',
    fontWeight: '500',
  },
}); 