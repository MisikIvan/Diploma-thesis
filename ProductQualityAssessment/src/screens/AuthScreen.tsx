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
  Alert
} from 'react-native';
import { translations } from '../utils/translations';

interface AuthScreenProps {
  navigation: any; 
}

const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
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
      setError(translations.emailRequired);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(translations.validEmail);
      return false;
    }

    if (!password.trim()) {
      setError(translations.passwordRequired);
      return false;
    }

    if (password.length < 8) {
      setError(translations.passwordLength);
      return false;
    }

    if (!isLogin) {
      if (!name.trim()) {
        setError(translations.nameRequired);
        return false;
      }

      if (password !== confirmPassword) {
        setError(translations.passwordsDoNotMatch);
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
        // Handle login
        // Firebase Auth login would go here
        console.log('Logging in with:', email, password);

        // Mock successful login for now
        setTimeout(() => {
          setIsLoading(false);
          navigation.replace('Main');
        }, 1000);
      } else {
        // Handle registration
        // Firebase Auth registration would go here
        console.log('Registering with:', email, password, name);

        // Mock successful registration for now
        setTimeout(() => {
          setIsLoading(false);
          Alert.alert(
            'Registration Successful',
            'Your account has been created. You can now log in.',
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
        }, 1000);
      }
    } catch (err) {
      setIsLoading(false);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleForgotPassword = () => {
    // Firebase password reset here
    Alert.alert(
      translations.resetPassword,
      translations.resetPasswordPrompt,
      [
        { text: translations.cancel, style: 'cancel' },
        { 
          text: translations.send, 
          onPress: () => {
            if (!email.trim()) {
              setError(translations.emailRequired);
              return;
            }
            
            // Firebase password reset here
            Alert.alert(
              translations.resetEmailSent,
              translations.resetPasswordConfirmation.replace('{email}', email)
            );
          } 
        }
      ]
    );
  };

  const handleGoogleSignIn = () => {
    // Firebase Google OAuth here
    Alert.alert('Google Sign In', 'This feature is not implemented yet.');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{translations.appName}</Text>
          <Text style={styles.subtitle}>
            {isLogin ? translations.signIn : translations.createAccount}
          </Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!isLogin && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{translations.name}</Text>
            <TextInput
              style={styles.input}
              placeholder={translations.name}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{translations.email}</Text>
          <TextInput
            style={styles.input}
            placeholder={translations.email}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{translations.password}</Text>
          <TextInput
            style={styles.input}
            placeholder={translations.password}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {!isLogin && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{translations.confirmPassword}</Text>
            <TextInput
              style={styles.input}
              placeholder={translations.confirmPassword}
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
              {translations.forgotPassword}
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
              {isLogin ? translations.login : translations.register}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonGoogle}
          onPress={handleGoogleSignIn}
          disabled={isLoading}
        >
          <Text style={styles.buttonGoogleText}>
            {translations.signInWithGoogle}
          </Text>
        </TouchableOpacity>

        <View style={styles.switchAuthContainer}>
          <Text style={styles.switchAuthText}>
            {isLogin ? translations.dontHaveAccount : translations.alreadyHaveAccount}
          </Text>
          <TouchableOpacity onPress={toggleAuthMode}>
            <Text style={styles.switchAuthButton}>
              {isLogin ? translations.register : translations.login}
            </Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#007AFF',
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
});

export default AuthScreen; 