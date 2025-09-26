import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { signUpWithEmail } from '../services/authService';

const { width, height } = Dimensions.get('window');

interface SignUpScreenProps {
  navigation: any;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !username || !password || !confirmPassword) {
      Alert.alert('오류', '모든 필드를 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('오류', '비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('오류', '올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUpWithEmail(email.trim(), password, username.trim());
      
      if (result.success) {
        Alert.alert('성공', '회원가입이 완료되었습니다.', [
          { text: '확인', onPress: () => navigation.navigate('SignIn') }
        ]);
      } else {
        Alert.alert('회원가입 실패', result.error || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={[styles.content, { paddingTop: insets.top }]}>
          <Text style={styles.title}>Story Pixel</Text>
          <Text style={styles.screenTitle}>회원가입</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>이메일 *</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="이메일을 입력하세요"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>사용자 명 *</Text>
            <TextInput
              style={styles.textInput}
              value={username}
              onChangeText={setUsername}
              placeholder="사용자명을 입력하세요"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>비밀번호 *</Text>
            <TextInput
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
              placeholder="비밀번호를 입력하세요"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              secureTextEntry
            />
            <Text style={styles.passwordHint}>* 비밀번호는 최소 6자 이상</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>비밀번호 재입력*</Text>
            <TextInput
              style={styles.textInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="비밀번호를 다시 입력하세요"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.signUpButton, isLoading && styles.disabledButton]}
            onPress={handleSignUp}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.signUpButtonText}>회원가입</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleBackToSignIn} style={styles.backButton}>
            <Text style={styles.backButtonText}>이미 계정이 있으신가요?</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
    letterSpacing: -2.4,
    fontFamily: 'JalnanOTF',
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
    letterSpacing: -0.9,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
    letterSpacing: -0.8,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    height: 49,
    borderRadius: 30,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: -0.8,
  },
  passwordHint: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    letterSpacing: -0.65,
  },
  signUpButton: {
    backgroundColor: '#4884FF',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    letterSpacing: -0.8,
  },
  backButton: {
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.7)',
    textDecorationLine: 'underline',
    letterSpacing: -0.7,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default SignUpScreen;
