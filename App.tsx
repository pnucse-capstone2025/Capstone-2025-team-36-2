/**
 * Story Pixel App
 * 그림일기와 그림동화를 생성해주는 앱
 *
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, useColorScheme, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-gesture-handler';

import AppNavigator from './src/navigation/AppNavigator';
import { geminiAIService } from './src/services/geminiAIService';
import { configureGoogleSignIn } from './src/services/authService';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  // 서비스 초기화
  useEffect(() => {
    const initializeServices = async () => {
      try {
        // 구글 로그인 초기화
        console.log('🔐 Google Sign-In 초기화 중...');
        configureGoogleSignIn();
        console.log('✅ Google Sign-In 초기화 완료');

        // Gemini AI 서비스 초기화
        console.log('🤖 Gemini AI 서비스 초기화 중...');
        const status = await geminiAIService.checkServiceStatus();
        
        if (status.isInitialized && status.canConnect) {
          console.log('✅ Gemini AI 서비스 초기화 완료:', status.message);
        } else {
          console.warn('⚠️ Gemini AI 서비스 초기화 실패:', status.message);
          Alert.alert(
            'AI 서비스 오류',
            'AI 서비스 초기화에 실패했습니다. 설정을 확인해주세요.',
            [{ text: '확인' }]
          );
        }
      } catch (error) {
        console.error('❌ 서비스 초기화 오류:', error);
        Alert.alert(
          '서비스 오류',
          '서비스 초기화 중 오류가 발생했습니다.',
          [{ text: '확인' }]
        );
      }
    };

    initializeServices();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor="transparent"
        translucent
      />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;
