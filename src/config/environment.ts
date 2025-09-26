/**
 * 환경 변수 설정 및 검증 (React Native용)
 */

import { GOOGLE_API_KEY } from '@env';

// 환경 변수 타입 정의
interface EnvironmentConfig {
  // Google AI 설정
  GOOGLE_API_KEY: string;
  GEMINI_MODEL_TEXT: string;
  GEMINI_MODEL_VISION: string;
  GEMINI_MODEL_IMAGE: string;
  
  // Firebase 설정
  FIREBASE_API_KEY: string;
  FIREBASE_AUTH_DOMAIN: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_STORAGE_BUCKET: string;
  FIREBASE_MESSAGING_SENDER_ID: string;
  FIREBASE_APP_ID: string;
  
  // 개발 환경 설정
  NODE_ENV: string;
  DEBUG: boolean;
  
  // 기타 설정
  MAX_STORY_LENGTH: number;
  API_RATE_LIMIT_DELAY: number;
}

// 환경 변수 검증 함수
function validateEnvironmentConfig(): EnvironmentConfig {
  const requiredEnvVars = [
    'GOOGLE_API_KEY',
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID'
  ];

  const missingVars = requiredEnvVars.filter(varName => {
    switch (varName) {
      case 'GOOGLE_API_KEY':
        return !GOOGLE_API_KEY;
      case 'FIREBASE_API_KEY':
      case 'FIREBASE_AUTH_DOMAIN':
      case 'FIREBASE_PROJECT_ID':
      case 'FIREBASE_STORAGE_BUCKET':
      case 'FIREBASE_MESSAGING_SENDER_ID':
      case 'FIREBASE_APP_ID':
        return false; // 하드코딩된 값 사용
      default:
        return true;
    }
  });
  
  if (missingVars.length > 0) {
    throw new Error(`필수 환경 변수가 설정되지 않았습니다: ${missingVars.join(', ')}`);
  }

  return {
    // Google AI 설정
    GOOGLE_API_KEY: GOOGLE_API_KEY!,
    GEMINI_MODEL_TEXT: 'gemini-2.5-flash',
    GEMINI_MODEL_VISION: 'gemini-2.5-flash',
    GEMINI_MODEL_IMAGE: 'gemini-2.5-flash-image-preview',
    
    // Firebase 설정 (하드코딩된 값 사용)
    FIREBASE_API_KEY: 'AIzaSyDjc4z8SevkAV2qPaOag8eDqMG2BsvJP8o',
    FIREBASE_AUTH_DOMAIN: 'storypixelapp.firebaseapp.com',
    FIREBASE_PROJECT_ID: 'storypixelapp',
    FIREBASE_STORAGE_BUCKET: 'storypixelapp.firebasestorage.app',
    FIREBASE_MESSAGING_SENDER_ID: '553577037646',
    FIREBASE_APP_ID: '1:553577037646:web:9034368b069c6b510ee81f',
    
    // 개발 환경 설정
    NODE_ENV: 'development',
    DEBUG: true,
    
    // 기타 설정
    MAX_STORY_LENGTH: 10000,
    API_RATE_LIMIT_DELAY: 1000
  };
}

// 환경 변수 설정 검증 및 내보내기
let environmentConfig: EnvironmentConfig;

try {
  environmentConfig = validateEnvironmentConfig();
} catch (error) {
  console.error('환경 변수 설정 오류:', error);
  throw error;
}

export default environmentConfig;

// 개별 환경 변수 접근을 위한 헬퍼 함수들
export const getGoogleAPIKey = (): string => environmentConfig.GOOGLE_API_KEY;
export const getGeminiTextModel = (): string => environmentConfig.GEMINI_MODEL_TEXT;
export const getGeminiVisionModel = (): string => environmentConfig.GEMINI_MODEL_VISION;
export const getGeminiImageModel = (): string => environmentConfig.GEMINI_MODEL_IMAGE;
export const getFirebaseConfig = () => ({
  apiKey: environmentConfig.FIREBASE_API_KEY,
  authDomain: environmentConfig.FIREBASE_AUTH_DOMAIN,
  projectId: environmentConfig.FIREBASE_PROJECT_ID,
  storageBucket: environmentConfig.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: environmentConfig.FIREBASE_MESSAGING_SENDER_ID,
  appId: environmentConfig.FIREBASE_APP_ID
});
export const isDevelopment = (): boolean => environmentConfig.NODE_ENV === 'development';
export const isDebugMode = (): boolean => environmentConfig.DEBUG;
export const getMaxStoryLength = (): number => environmentConfig.MAX_STORY_LENGTH;
export const getAPIRateLimitDelay = (): number => environmentConfig.API_RATE_LIMIT_DELAY;
