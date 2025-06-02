import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image
} from 'react-native';
import { t } from '../utils/translations';
import { useAppDispatch } from '../redux/hooks';
import { login, register, googleLogin } from '../redux/slices/userSlice';
import { ValidationUtils } from '../utils/validation';

interface AuthScreenProps {
  navigation: any; 
}

const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setErrors({});
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string[] } = {};

    // Check rate limiting
    const rateLimitKey = `auth_${email}`;
    if (!ValidationUtils.checkRateLimit(rateLimitKey, 5, 300000)) { 
      Alert.alert(t('tooManyAttempts'), t('waitFiveMinutes'));
      return false;
    }

    // Email validation
    const emailResult = ValidationUtils.email(email);
    if (!emailResult.isValid) {
      newErrors.email = emailResult.errors;
    }

    // Password validation
    const passwordResult = ValidationUtils.password(password);
    if (!passwordResult.isValid) {
      newErrors.password = passwordResult.errors;
    }

   
    if (!isLogin) {
      const nameResult = ValidationUtils.name(name);
      if (!nameResult.isValid) {
        newErrors.name = nameResult.errors;
      }

      // Password confirmation
      if (password !== confirmPassword) {
        newErrors.confirmPassword = ['Passwords do not match'];
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const sanitizedEmail = ValidationUtils.sanitizeText(email).toLowerCase().trim();
      const sanitizedName = ValidationUtils.sanitizeText(name);

      if (isLogin) {
        await dispatch(login({ email: sanitizedEmail, password })).unwrap();
      } else {
        await dispatch(register({ 
          email: sanitizedEmail, 
          password, 
          displayName: sanitizedName 
        })).unwrap();
        Alert.alert(
          t('registrationSuccessful'),
          t('accountCreated'),
          [
            { 
              text: 'OK', 
              onPress: () => {
                setIsLogin(true);
                resetForm();
              } 
            }
          ]
        );
      }
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      
      // Handle specific Firebase errors
      let errorMessage = t('error');
      if (err.code) {
        switch (err.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            errorMessage = 'Invalid email or password';
            break;
          case 'auth/email-already-in-use':
            errorMessage = 'Email is already registered';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again later.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your connection.';
            break;
          default:
            errorMessage = err.message || t('error');
        }
      }
      
      Alert.alert(t('authenticationError'), errorMessage);
      console.error('Auth error:', err);
    }
  };

  const handleForgotPassword = () => {
    const emailResult = ValidationUtils.email(email);
    if (!emailResult.isValid) {
      Alert.alert(t('invalidEmail'), t('enterValidEmail'));
      return;
    }

    Alert.alert(
      t('resetPassword'),
      t('resetPasswordPrompt'),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('send'), 
          onPress: () => {
            Alert.alert(
              t('resetEmailSent'),
              t('resetPasswordConfirmation').replace('{email}', email)
            );
          } 
        }
      ]
    );
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await dispatch(googleLogin()).unwrap();
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      Alert.alert(t('googleSignInError'), err.message || t('error'));
      console.error('Google sign in error:', err);
    }
  };

  const renderFieldErrors = (fieldName: string) => {
    if (errors[fieldName] && errors[fieldName].length > 0) {
      return (
        <View style={styles.errorContainer}>
          {errors[fieldName].map((error, index) => (
            <Text key={index} style={styles.errorText}>• {error}</Text>
          ))}
        </View>
      );
    }
    return null;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image 
            source={require('../assets/logo.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <View style={styles.appNameContainer}>
            <Text style={styles.appNameRegular}>Calori</Text>
            <Text style={styles.appNameBold}>KO</Text>
          </View>
          <Text style={styles.subtitle}>
            {isLogin ? t('signIn') : t('createAccount')}
          </Text>
        </View>

        {renderFieldErrors('email')}
        {!isLogin && renderFieldErrors('name')}
        {renderFieldErrors('password')}
        {renderFieldErrors('confirmPassword')}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('email')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('email')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {!isLogin && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('name')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('name')}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('password')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {!isLogin && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('confirmPassword')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('confirmPassword')}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
        )}

        {isLogin && (
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>
              {t('forgotPassword')}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonPrimaryText}>
              {isLogin ? t('login') : t('register')}
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.separatorContainer}>
          <View style={styles.separator} />
          <Text style={styles.separatorText}>{t('or')}</Text>
          <View style={styles.separator} />
        </View>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
        >
          <Text style={styles.googleButtonText}>{t('continueWithGoogle')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchModeContainer}
          onPress={toggleAuthMode}
        >
          <Text style={styles.switchModeText}>
            {isLogin ? t('needAccount') : t('alreadyHaveAccount')}
            <Text style={styles.switchModeHighlight}>
              {' '}{isLogin ? t('register') : t('login')}
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  appNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  appNameRegular: {
    fontSize: 28,
    color: '#5d8402',
  },
  appNameBold: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#34572a',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#34572a',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f8d7da',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#495057',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#34572a',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonPrimary: {
    backgroundColor: '#34572a',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonGoogle: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonGoogleText: {
    color: '#495057',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchAuthContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  switchAuthText: {
    color: '#6c757d',
    fontSize: 14,
    marginRight: 6,
  },
  switchAuthButton: {
    color: '#34572a',
    fontSize: 14,
    fontWeight: 'bold',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#e9ecef',
  },
  separatorText: {
    color: '#6c757d',
    fontSize: 14,
    marginHorizontal: 16,
    fontWeight: '500',
  },
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  googleButtonText: {
    color: '#34572a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  switchModeText: {
    color: '#6c757d',
    fontSize: 14,
  },
  switchModeHighlight: {
    fontWeight: 'bold',
    color: '#34572a',
  },
});

export default AuthScreen; 