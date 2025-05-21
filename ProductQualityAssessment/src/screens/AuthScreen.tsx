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
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setError(null);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const validateForm = (): boolean => {
    if (!email.trim()) {
      setError(t('emailRequired'));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t('validEmail'));
      return false;
    }

    if (!password.trim()) {
      setError(t('passwordRequired'));
      return false;
    }

    if (password.length < 8) {
      setError(t('passwordLength'));
      return false;
    }

    if (!isLogin) {
      if (!name.trim()) {
        setError(t('nameRequired'));
        return false;
      }

      if (password !== confirmPassword) {
        setError(t('passwordsDoNotMatch'));
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    setError(null);
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
      
        console.log('Logging in with:', email, password);
        await dispatch(login({ email, password })).unwrap();
      
      } else {

        console.log('Registering with:', email, password, name);
        await dispatch(register({ email, password, displayName: name })).unwrap();
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
      setError(err.message || t('error'));
      console.error('Auth error:', err);
    }
  };

  const handleForgotPassword = () => {
    // Firebase password reset
    Alert.alert(
      t('resetPassword'),
      t('resetPasswordPrompt'),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('send'), 
          onPress: () => {
            if (!email.trim()) {
              setError(t('emailRequired'));
              return;
            }
            
         
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
      setError(err.message || t('error'));
      console.error('Google sign in error:', err);
    }
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

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

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
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  appNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#ffebe6',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  errorText: {
    color: '#e63e11',
    fontSize: 14,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
  },
  buttonPrimary: {
    backgroundColor: '#5d8402',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonGoogle: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonGoogleText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchAuthContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  switchAuthText: {
    color: '#666',
    fontSize: 14,
    marginRight: 5,
  },
  switchAuthButton: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  separatorText: {
    color: '#666',
    fontSize: 14,
    marginHorizontal: 10,
  },
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
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
    marginTop: 10,
  },
  switchModeText: {
    color: '#666',
    fontSize: 14,
  },
  switchModeHighlight: {
    fontWeight: 'bold',
  },
});

export default AuthScreen; 