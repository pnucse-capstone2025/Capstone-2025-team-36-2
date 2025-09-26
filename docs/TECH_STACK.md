# StoryPixelApp 기술 스택

## 📱 프로젝트 개요

**StoryPixelApp**은 그림일기와 그림동화를 생성해주는 React Native 기반의 모바일 애플리케이션입니다. Google Gemini AI와 Firebase를 활용하여 사용자가 작성한 텍스트를 기반으로 동화를 생성하고, 각 문단에 맞는 이미지를 자동으로 생성하는 기능을 제공합니다.

---

## 🏗️ 핵심 기술 스택

### **Frontend Framework**
- **React Native 0.81.1** - 크로스 플랫폼 모바일 앱 개발
- **React 19.1.0** - UI 라이브러리
- **TypeScript 5.8.3** - 정적 타입 검사 및 개발 생산성 향상

### **네비게이션**
- **@react-navigation/native 7.1.17** - 화면 간 네비게이션 관리
- **@react-navigation/stack 7.4.8** - 스택 기반 네비게이션
- **react-native-gesture-handler 2.28.0** - 제스처 처리
- **react-native-screens 4.16.0** - 네이티브 화면 최적화

### **UI/UX 라이브러리**
- **react-native-safe-area-context 5.6.1** - 안전 영역 처리
- **react-native-vector-icons 10.3.0** - 아이콘 라이브러리
- **react-native-svg 15.13.0** - SVG 지원
- **react-native-image-picker 8.2.1** - 이미지 선택 및 캡처

### **상태 관리 및 데이터 저장**
- **@react-native-async-storage/async-storage 1.24.0** - 로컬 데이터 저장
- **react-native-get-random-values 1.11.0** - 암호화를 위한 랜덤 값 생성
- **react-native-url-polyfill 2.0.0** - URL API 폴리필

---

## 🤖 AI 및 백엔드 서비스

### **AI 서비스**
- **@google/generative-ai 0.24.1** - Google Gemini AI SDK
- **Gemini 2.5 Flash** - 텍스트 생성 및 처리 모델
- **Gemini 2.5 Flash Image Preview** - 이미지 생성 모델 (실험적)

### **Firebase 백엔드**
- **@react-native-firebase/app 23.3.1** - Firebase 코어
- **@react-native-firebase/auth 23.3.1** - 사용자 인증
- **@react-native-firebase/firestore 23.3.1** - NoSQL 데이터베이스
- **@react-native-firebase/storage 23.3.1** - 클라우드 스토리지
- **@react-native-google-signin/google-signin 16.0.0** - Google 로그인

### **AI 서비스 아키텍처**
```
src/services/
├── geminiAIService.ts          # Gemini AI 기본 서비스
├── storyProcessingService.ts   # 동화 텍스트 처리
├── imageGenerationService.ts   # 이미지 생성 서비스
├── imageStorageService.ts      # 이미지 저장 관리
├── authService.ts              # Firebase 인증
├── diaryService.ts             # 일기 데이터 관리
├── fairytaleService.ts         # 동화 데이터 관리
└── __tests__/                  # 서비스 테스트
```

### **AI 기능**
- **동화 텍스트 생성**: 사용자 입력을 바탕으로 동화 스토리 생성
- **문단 분할**: 생성된 동화를 적절한 문단으로 분할
- **이미지 설명 생성**: 각 문단에 맞는 이미지 설명 생성
- **이미지 생성**: 텍스트 설명을 바탕으로 이미지 생성 (실험적 기능)
- **키워드 추출**: 이미지 생성을 위한 핵심 키워드 추출
- **스타일 적용**: 다양한 이미지 스타일 (애니메이션, 실사, 동화책 등)

---

## 🔧 개발 도구 및 빌드 시스템

### **번들러 및 빌드**
- **Metro** - React Native 번들러 (사용자 정의 설정 포함)
- **Babel 7.25.2** - JavaScript 트랜스파일러
- **Gradle** - Android 빌드 시스템
- **CocoaPods** - iOS 의존성 관리

### **개발 환경**
- **Node.js 20+** - 런타임 환경
- **ESLint 8.19.0** - 코드 품질 관리
- **Prettier 2.8.8** - 코드 포맷팅
- **Jest 29.6.3** - 테스트 프레임워크
- **react-native-dotenv 3.4.11** - 환경 변수 관리

### **Metro 설정 (사용자 정의)**
```javascript
// metro.config.js
const config = {
  resolver: {
    alias: {
      crypto: 'react-native-crypto',
      stream: 'readable-stream',
      buffer: '@craftzdog/react-native-buffer',
      events: 'events',
      util: 'util',
      path: 'path-browserify',
      os: 'os-browserify',
    },
    platforms: ['ios', 'android', 'native', 'web'],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
```

### **테스트 설정**
```javascript
// jest.config.js
module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(@google-cloud|uuid|gaxios|gcp-metadata|google-auth-library)/)'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'node',
};
```

### **환경 변수 관리**
```javascript
// babel.config.js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      },
    ],
  ],
};
```

---

## 📱 플랫폼별 설정

### **Android**
- **Compile SDK**: 36
- **Target SDK**: 36
- **Min SDK**: 24
- **Build Tools**: 36.0.0
- **NDK**: 27.1.12297006
- **Kotlin**: 2.1.20
- **Application ID**: com.storypixelapp
- **Google Play Services Auth**: 20.7.0
- **Build Tools**: Gradle 기반
- **Firebase**: Google Services 플러그인 4.4.0

### **iOS**
- **Target**: iOS 최소 지원 버전 (React Native 기본값)
- **의존성 관리**: CocoaPods
- **네이티브 모듈**: Swift로 작성된 네이티브 코드
- **Hermes**: JavaScript 엔진 (활성화됨)
- **Framework Linkage**: 환경 변수 기반 설정

---

## 🔐 환경 설정 및 보안

### **환경 변수 관리**
- **.env 파일** - 환경 변수 관리 (react-native-dotenv)
- **Google AI Studio API 키** - Gemini AI 서비스 인증
- **Firebase 설정** - 하드코딩된 공개 설정값 사용

### **필수 환경 변수**
```env
# Google AI Studio API 키 (필수)
GOOGLE_API_KEY=your-google-ai-studio-api-key-here

# Gemini 모델 설정
GEMINI_MODEL_TEXT=gemini-2.5-flash
GEMINI_MODEL_VISION=gemini-2.5-flash
GEMINI_MODEL_IMAGE=gemini-2.5-flash-image-preview

# 개발 환경 설정
NODE_ENV=development
DEBUG=true
MAX_STORY_LENGTH=10000
API_RATE_LIMIT_DELAY=1000
```

### **보안 설정**
```typescript
// src/config/environment.ts
// 환경 변수 검증 및 중앙 관리
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
```

---

## 🛠️ 개발 스크립트

### **NPM 스크립트**
```json
{
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "lint": "eslint .",
    "start": "react-native start",
    "test": "jest",
    "setup:env": "echo 'Please create .env file with your Google AI Studio API key'",
    "check:gemini": "node check-gemini-setup.js",
    "test:gemini": "node test-gemini-ai.js"
  }
}
```

### **개발 워크플로우**
1. **환경 설정**: `npm run setup:env` - 환경 변수 설정 안내
2. **의존성 설치**: `npm install` - 모든 의존성 설치
3. **iOS 의존성**: `cd ios && pod install` - iOS 네이티브 의존성
4. **개발 서버**: `npm start` - Metro 번들러 시작
5. **Android 실행**: `npm run android` - Android 앱 빌드 및 실행
6. **iOS 실행**: `npm run ios` - iOS 앱 빌드 및 실행
7. **테스트**: `npm test` - Jest 테스트 실행
8. **AI 서비스 확인**: `npm run check:gemini` - Gemini AI 설정 검증
9. **AI 기능 테스트**: `npm run test:gemini` - AI 서비스 테스트

---

## 📦 주요 의존성 패키지

### **핵심 의존성**
```json
{
  "dependencies": {
    "@google/generative-ai": "^0.24.1",
    "@react-native-async-storage/async-storage": "^1.24.0",
    "@react-native-firebase/app": "^23.3.1",
    "@react-native-firebase/auth": "^23.3.1",
    "@react-native-firebase/firestore": "^23.3.1",
    "@react-native-firebase/storage": "^23.3.1",
    "@react-native-google-signin/google-signin": "^16.0.0",
    "@react-navigation/native": "^7.1.17",
    "@react-navigation/stack": "^7.4.8",
    "react": "19.1.0",
    "react-native": "0.81.1",
    "react-native-gesture-handler": "^2.28.0",
    "react-native-get-random-values": "^1.11.0",
    "react-native-image-picker": "^8.2.1",
    "react-native-safe-area-context": "^5.6.1",
    "react-native-screens": "^4.16.0",
    "react-native-svg": "^15.13.0",
    "react-native-url-polyfill": "^2.0.0",
    "react-native-vector-icons": "^10.3.0"
  }
}
```

### **개발 의존성**
```json
{
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@babel/preset-env": "^7.25.3",
    "@babel/runtime": "^7.25.0",
    "@react-native-community/cli": "20.0.0",
    "@react-native-community/cli-platform-android": "20.0.0",
    "@react-native-community/cli-platform-ios": "20.0.0",
    "@react-native/babel-preset": "0.81.1",
    "@react-native/eslint-config": "0.81.1",
    "@react-native/metro-config": "0.81.1",
    "@react-native/typescript-config": "0.81.1",
    "@types/jest": "^29.5.13",
    "@types/react": "^19.1.0",
    "@types/react-test-renderer": "^19.1.0",
    "eslint": "^8.19.0",
    "jest": "^29.6.3",
    "prettier": "2.8.8",
    "react-native-dotenv": "^3.4.11",
    "react-test-renderer": "19.1.0",
    "typescript": "^5.8.3"
  }
}
```

### **Node.js 엔진 요구사항**
```json
{
  "engines": {
    "node": ">=20"
  }
}
```

---

## 🏛️ 프로젝트 구조

```
StoryPixelApp/
├── src/                    # 소스 코드
│   ├── components/          # 재사용 가능한 UI 컴포넌트
│   │   ├── Calendar.tsx
│   │   ├── DateSlider.tsx
│   │   ├── ImageStyleSelector.tsx
│   │   └── icons/          # SVG 아이콘 컴포넌트
│   │       ├── BackArrowIcon.tsx
│   │       ├── CalendarIcon.tsx
│   │       ├── DiskIcon.tsx
│   │       ├── GoogleIcon.tsx
│   │       ├── ImgGenerateIcon.tsx
│   │       └── PlusIcon.tsx
│   ├── screens/            # 화면 컴포넌트
│   │   ├── DiaryCreateScreen.tsx
│   │   ├── DiaryDetailViewScreen.tsx
│   │   ├── DiaryImgGenOptionScreen.tsx
│   │   ├── DiarySaveScreen.tsx
│   │   ├── DiaryScreen.tsx
│   │   ├── FairytaleCreateScreen.tsx
│   │   ├── FairytaleDetailViewScreen.tsx
│   │   ├── FairytaleImgGenOptionScreen.tsx
│   │   ├── FairytaleSaveScreen.tsx
│   │   ├── FairytaleScreen.tsx
│   │   ├── LandingScreen.tsx
│   │   ├── MainScreen.tsx
│   │   ├── ResetPasswordScreen.tsx
│   │   ├── SettingScreen.tsx
│   │   ├── SignInScreen.tsx
│   │   └── SignUpScreen.tsx
│   ├── services/           # 비즈니스 로직 서비스
│   │   ├── geminiAIService.ts          # Gemini AI 기본 서비스
│   │   ├── storyProcessingService.ts   # 동화 텍스트 처리
│   │   ├── imageGenerationService.ts   # 이미지 생성
│   │   ├── imageStorageService.ts      # 이미지 저장
│   │   ├── authService.ts              # Firebase 인증
│   │   ├── diaryService.ts             # 일기 관리
│   │   ├── fairytaleService.ts         # 동화 관리
│   │   └── __tests__/                  # 서비스 테스트
│   │       ├── geminiImageGeneration.test.ts
│   │       ├── imageGenerationService.test.ts
│   │       └── storyProcessingService.test.ts
│   ├── navigation/         # 네비게이션 설정
│   │   └── AppNavigator.tsx
│   ├── contexts/           # React Context
│   │   └── AuthContext.tsx
│   ├── config/            # 설정 파일
│   │   ├── environment.ts  # 환경 변수 관리
│   │   └── firebase.ts     # Firebase 설정
│   ├── constants/         # 상수 정의
│   │   ├── apiConstants.ts
│   │   ├── prompts.ts
│   │   └── styleConstants.ts
│   ├── types/             # TypeScript 타입 정의
│   │   ├── aiTypes.ts
│   │   ├── diaryTypes.ts
│   │   └── env.d.ts
│   ├── utils/             # 유틸리티 함수
│   │   ├── dateUtils.ts
│   │   ├── imageUtils.ts
│   │   └── reactNativeImageUtils.ts
│   ├── examples/          # 예제 코드
│   │   └── geminiImageGenerationExample.ts
│   └── assets/            # 정적 자산
│       └── images/
│           ├── BackArrow.svg
│           ├── background.png
│           ├── calander.svg
│           ├── disk.svg
│           ├── google.svg
│           └── imgGenerate.svg
├── android/               # Android 네이티브 코드
├── ios/                   # iOS 네이티브 코드
├── docs/                  # 문서
│   ├── GEMINI_SETUP.md
│   ├── GEMINI_IMAGE_GENERATION_GUIDE.md
│   ├── PROJECT_OVERVIEW.md
│   ├── REACT_NATIVE_SETUP.md
│   └── TECH_STACK.md
├── __tests__/            # 앱 레벨 테스트
├── firebase.json         # Firebase 설정
├── firestore.rules       # Firestore 보안 규칙
├── firestore.indexes.json # Firestore 인덱스
├── storage.rules         # Firebase Storage 규칙
└── .env                  # 환경 변수 (Git에서 제외)
```

---

## 🚀 배포 및 빌드

### **Android 빌드**
```bash
# 개발 빌드
npm run android

# 릴리즈 빌드 (gradle)
cd android && ./gradlew assembleRelease

# 빌드 정리
cd android && ./gradlew clean
```

### **iOS 빌드**
```bash
# 개발 빌드
npm run ios

# iOS 의존성 설치
cd ios && pod install

# 빌드 정리
cd ios && rm -rf build
```

### **개발 환경 초기화**
```bash
# 전체 프로젝트 초기화
npm install
cd ios && pod install
cd ..

# Metro 캐시 클리어
npx react-native start --reset-cache
```

---

## 🔍 테스트 전략

### **테스트 유형**
1. **단위 테스트**: 개별 서비스 및 함수 테스트
2. **통합 테스트**: AI 서비스 연동 테스트 
3. **컴포넌트 테스트**: React Native 컴포넌트 테스트

### **테스트 파일**
- `src/services/__tests__/geminiImageGeneration.test.ts` - Gemini 이미지 생성 테스트
- `src/services/__tests__/imageGenerationService.test.ts` - 이미지 생성 서비스 테스트
- `src/services/__tests__/storyProcessingService.test.ts` - 동화 처리 서비스 테스트
- `__tests__/App.test.tsx` - 앱 컴포넌트 테스트

### **테스트 실행**
```bash
# 전체 테스트
npm test

# AI 기능 테스트 (개발용 스크립트)
npm run test:gemini

# Gemini AI 설정 확인
npm run check:gemini
```

### **AI 서비스 테스트 환경**
- 실제 Gemini AI API를 사용한 통합 테스트
- Mock 데이터를 사용한 단위 테스트
- 에러 핸들링 및 예외 상황 테스트
- 환경 변수 검증 테스트

---

## 📈 성능 최적화

### **Metro 번들러 최적화**
- **Hermes 엔진**: JavaScript 성능 향상 (활성화됨)
- **인라인 Requires**: 지연 로딩을 통한 시작 시간 단축
- **실험적 Import 지원**: 비활성화로 안정성 확보
- **Node.js 폴리필**: React Native 환경에서 웹 라이브러리 호환성

### **의존성 최적화**
- **번들 크기 줄이기**: 사용하지 않는 의존성 제거
- **트리 셰이킹**: 불필요한 코드 자동 제거
- **SVG 최적화**: react-native-svg를 통한 벡터 이미지 사용

### **메모리 관리**
- **AsyncStorage**: 효율적인 로컬 데이터 저장
- **이미지 캐싱**: 생성된 이미지 캐싱 및 최적화
- **메모리 누수 방지**: 컴포넌트 언마운트 시 정리
- **AI API 호출 최적화**: 요청 빈도 제한 및 캐싱

### **Firebase 최적화**
- **Firestore 인덱스**: 쿼리 성능 향상
- **Storage 규칙**: 보안 및 성능 최적화
- **오프라인 지원**: Firestore 오프라인 캐싱

---

## 🔧 개발 환경 설정

### **필수 요구사항**
- **Node.js 20 이상** - JavaScript 런타임
- **React Native CLI** - React Native 개발 도구
- **Android Studio** - Android 개발 (SDK, NDK, 에뮬레이터)
- **Xcode** - iOS 개발 (macOS 전용)
- **Google AI Studio 계정** - Gemini AI API 키 발급
- **Firebase 계정** - 백엔드 서비스 (이미 설정됨)

### **초기 설정**
```bash
# 1. 프로젝트 클론 및 이동
git clone <repository-url>
cd StoryPixelApp

# 2. 의존성 설치
npm install

# 3. iOS 의존성 설치 (macOS만)
cd ios && pod install && cd ..

# 4. 환경 변수 설정
touch .env
# .env 파일에 Google AI Studio API 키 추가:
# GOOGLE_API_KEY=your-google-ai-studio-api-key-here

# 5. AI 서비스 설정 확인
npm run check:gemini

# 6. 개발 서버 시작
npm start
```

### **플랫폼별 실행**
```bash
# Android 실행 (에뮬레이터 또는 디바이스 필요)
npm run android

# iOS 실행 (macOS + Xcode 필요)
npm run ios
```

### **문제 해결**
```bash
# Metro 캐시 클리어
npx react-native start --reset-cache

# Android 빌드 클리어
cd android && ./gradlew clean && cd ..

# iOS 빌드 클리어
cd ios && rm -rf build && cd ..

# 전체 재설치
rm -rf node_modules package-lock.json
npm install
cd ios && pod install && cd ..
```

---

## 📚 추가 리소스

### **공식 문서**
- [React Native 공식 문서](https://reactnative.dev/) - React Native 개발 가이드
- [Google AI Studio](https://aistudio.google.com/) - Gemini AI API 키 발급
- [Gemini API 문서](https://ai.google.dev/docs) - AI 서비스 통합 가이드
- [Firebase 문서](https://firebase.google.com/docs) - 백엔드 서비스 가이드
- [React Navigation 문서](https://reactnavigation.org/) - 네비게이션 설정
- [TypeScript 문서](https://www.typescriptlang.org/) - 타입스크립트 가이드

### **프로젝트 문서**
- [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - 프로젝트 개요
- [GEMINI_SETUP.md](./GEMINI_SETUP.md) - Gemini AI 설정 가이드
- [GEMINI_IMAGE_GENERATION_GUIDE.md](./GEMINI_IMAGE_GENERATION_GUIDE.md) - 이미지 생성 상세 가이드
- [REACT_NATIVE_SETUP.md](./REACT_NATIVE_SETUP.md) - React Native 설정 가이드

### **개발 도구**
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger) - 디버깅 도구
- [Flipper](https://fbflipper.com/) - 모바일 앱 디버깅 플랫폼
- [Reactotron](https://github.com/infinitered/reactotron) - React Native 디버깅 도구

---

## 📞 지원 및 문의

프로젝트 관련 문의사항이 있으시면:

1. **기술적 문제**: GitHub Issues를 통해 문의
2. **AI 서비스 관련**: GEMINI_SETUP.md 문서 참조
3. **환경 설정 문제**: REACT_NATIVE_SETUP.md 문서 참조
4. **이미지 생성 관련**: GEMINI_IMAGE_GENERATION_GUIDE.md 문서 참조

---

**참고**: 이 문서는 StoryPixelApp 프로젝트의 기술 스택과 아키텍처를 상세히 설명합니다. 프로젝트 개발 시 참고 자료로 활용하시기 바랍니다.
