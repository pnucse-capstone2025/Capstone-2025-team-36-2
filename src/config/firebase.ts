import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getRemoteConfig } from 'firebase/remote-config';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getFirebaseConfig } from './environment';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase 설정 (중앙 관리된 환경 설정 사용)
const firebaseConfig = getFirebaseConfig();

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firebase Auth 초기화
export const auth = getAuth(app);

// Firestore 초기화
export const db = getFirestore(app);

// Firebase AI Logic 초기화 (사용 중단 - Gemini API 직접 사용으로 대체)
// export const firebaseAI = {
//   googleAI: () => ({
//     generativeModel: (config: any) => {
//       // Google AI SDK를 사용하여 모델 생성
//       const { GoogleGenerativeAI } = require('@google/generative-ai');
//       const genAI = new GoogleGenerativeAI(firebaseConfig.apiKey);
//       return genAI.getGenerativeModel(config);
//     }
//   })
// };

// Cloud Storage 초기화
export const storage = getStorage(app);

// Remote Config 초기화
export const remoteConfig = getRemoteConfig(app);

// App Check 초기화 (보안) - 개발 환경에서는 비활성화
// export const appCheck = initializeAppCheck(app, {
//   provider: new ReCaptchaV3Provider('your-recaptcha-site-key'),
//   isTokenAutoRefreshEnabled: true
// });

export default app;