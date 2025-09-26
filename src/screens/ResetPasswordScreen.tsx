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
import { sendPasswordReset } from '../services/authService';

const { width, height } = Dimensions.get('window');

interface ResetPasswordScreenProps {
  navigation: any;
}

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('오류', '이메일을 입력해주세요.');
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
      const result = await sendPasswordReset(email.trim());
      
      if (result.success) {
        Alert.alert('성공', '비밀번호 재설정 링크가 이메일로 전송되었습니다.', [
          { text: '확인', onPress: () => navigation.navigate('SignIn') }
        ]);
      } else {
        Alert.alert('전송 실패', result.error || '이메일 전송에 실패했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '비밀번호 재설정 중 오류가 발생했습니다.');
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
          <Text style={styles.screenTitle}>비밀번호 찾기</Text>

          <Text style={styles.description}>
            가입 시 사용한 이메일을 입력하시면{'\n'}비밀번호 재설정 링크를 보내 드립니다.
          </Text>

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

          <TouchableOpacity
            style={[styles.resetButton, isLoading && styles.disabledButton]}
            onPress={handleResetPassword}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.resetButtonText}>비밀번호 재설정 링크 받기</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleBackToSignIn} style={styles.backButton}>
            <Text style={styles.backButtonText}>로그인 페이지로 돌아가기</Text>
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
    marginBottom: 20,
    letterSpacing: -0.9,
  },
  description: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 25,
    marginBottom: 40,
    letterSpacing: -0.75,
  },
  inputContainer: {
    marginBottom: 30,
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
  resetButton: {
    backgroundColor: '#4884FF',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  resetButtonText: {
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

export default ResetPasswordScreen;
