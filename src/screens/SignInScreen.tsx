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
import GoogleIcon from '../components/icons/GoogleIcon';
import { signInWithEmail, signInWithGoogle } from '../services/authService';

const { width, height } = Dimensions.get('window');

interface SignInScreenProps {
  navigation: any;
}

const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('오류', '이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await signInWithEmail(email.trim(), password);
      
      if (result.success) {
        // 로그인 성공 - AuthContext가 자동으로 상태를 업데이트하고 네비게이션이 처리됨
        // 수동 네비게이션은 필요하지 않음
      } else {
        Alert.alert('로그인 실패', result.error || '로그인에 실패했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isGoogleLoading || isLoading) return;

    setIsGoogleLoading(true);
    
    try {
      const result = await signInWithGoogle();
      
      if (result.success) {
        // 로그인 성공 - AuthContext가 자동으로 상태를 업데이트하고 네비게이션이 처리됨
        console.log('✅ Google 로그인 성공:', result.user?.email);
      } else {
        Alert.alert('Google 로그인 실패', result.error || 'Google 로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('Google 로그인 오류:', error);
      Alert.alert('오류', 'Google 로그인 중 오류가 발생했습니다.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ResetPassword');
  };

  const handleBack = () => {
    navigation.goBack();
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
          <Text style={styles.screenTitle}>로그인</Text>

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
            <Text style={styles.inputLabel}>비밀번호 *</Text>
            <TextInput
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
              placeholder="비밀번호를 입력하세요"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              secureTextEntry
            />
          </View>

          <View style={styles.linkContainer}>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.linkText}>비밀번호 찾기</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.linkText}>회원가입</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.signInButton, isLoading && styles.disabledButton]}
            onPress={handleSignIn}
            activeOpacity={0.8}
            disabled={isLoading || isGoogleLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.signInButtonText}>이메일로 로그인</Text>
            )}
          </TouchableOpacity>

{/* Google 로그인 버튼 - 임시 비활성화
          <TouchableOpacity
            style={[styles.googleButton, (isGoogleLoading || isLoading) && styles.disabledButton]}
            onPress={handleGoogleSignIn}
            activeOpacity={0.8}
            disabled={isLoading || isGoogleLoading}
          >
            {isGoogleLoading ? (
              <ActivityIndicator color="#32363E" size="small" />
            ) : (
              <>
                <GoogleIcon size={20} />
                <Text style={styles.googleButtonText}>GOOGLE 계정으로 로그인</Text>
              </>
            )}
          </TouchableOpacity>
          */}

          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>돌아가기</Text>
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
    marginTop: 60,
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
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.7)',
    textDecorationLine: 'underline',
    letterSpacing: -0.7,
  },
  signInButton: {
    backgroundColor: '#4884FF',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    letterSpacing: -0.8,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  googleIcon: {
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#32363E',
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

export default SignInScreen;
