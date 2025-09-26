# StoryPixelApp 기술 스택

## 📱 프로젝트 개요

**StoryPixelApp**은 그림일기와 그림동화를 생성해주는 React Native 기반의 모바일 애플리케이션입니다. AI 기술을 활용하여 사용자가 작성한 텍스트를 기반으로 동화를 생성하고, 각 문단에 맞는 이미지를 자동으로 생성하는 기능을 제공합니다.

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
- **react-native-safe-area-context 5.6.1** - 안전 영역 처리 [[memory:8656392]]
- **react-native-vector-icons 10.3.0** - 아이콘 라이브러리
- **react-native-svg 15.13.0** - SVG 지원
- **react-native-image-picker 8.2.1** - 이미지 선택 및 캡처

### **상태 관리 및 데이터 저장**
- **@react-native-async-storage/async-storage 2.2.0** - 로컬 데이터 저장
- **react-native-get-random-values 1.11.0** - 암호화를 위한 랜덤 값 생성

---

## 🤖 AI 및 백엔드 서비스

### **AI 서비스**
- **Google Gemini AI** - 텍스트 생성 및 처리
- **Gemini 2.5 Flash** - 텍스트 생성 모델 [[memory:6087656]]
- **Gemini 2.5 Pro** - 고급 텍스트 처리 [[memory:6087635]]

### **AI 서비스 아키텍처**
```
src/services/
├── geminiAIService.ts          # Gemini AI 기본 서비스
├── storyProcessingService.ts   # 동화 텍스트 처리
├── imageGenerationService.ts   # 이미지 생성 서비스
└── __tests__/                  # 서비스 테스트
```

### **AI 기능**
- **동화 텍스트 생성**: 사용자 입력을 바탕으로 동화 스토리 생성
- **문단 분할**: 생성된 동화를 적절한 문단으로 분할
- **이미지 설명 생성**: 각 문단에 맞는 이미지 설명 생성
- **이미지 생성**: 텍스트 설명을 바탕으로 이미지 생성 (플레이스홀더)

---

## 🔧 개발 도구 및 빌드 시스템

### **번들러 및 빌드**
- **Metro** - React Native 번들러
- **Babel** - JavaScript 트랜스파일러
- **Gradle** - Android 빌드 시스템
- **CocoaPods** - iOS 의존성 관리

### **개발 환경**
- **Node.js 20+** - 런타임 환경
- **ESLint 8.19.0** - 코드 품질 관리
- **Prettier 2.8.8** - 코드 포맷팅
- **Jest 29.6.3** - 테스트 프레임워크

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

---

## 📱 플랫폼별 설정

### **Android**
- **Target SDK**: 최신 Android API
- **Min SDK**: Android 21+
- **Build Tools**: Gradle 기반
- **네이티브 모듈**: Kotlin으로 작성된 네이티브 코드

### **iOS**
- **Target**: iOS 11.0+
- **의존성 관리**: CocoaPods
- **네이티브 모듈**: Swift로 작성된 네이티브 코드
- **Hermes**: JavaScript 엔진 (선택적)

---

## 🔐 환경 설정 및 보안

### **환경 변수 관리**
- **.env 파일** - 환경 변수 관리 [[memory:6087573]]
- **Google AI Studio API 키** - Gemini AI 서비스 인증

### **보안 설정**
```typescript
// src/config/environment.ts
export const getGoogleAPIKey = () => {
  return process.env.GOOGLE_API_KEY;
};
```

---

## 🛠️ 개발 스크립트

### **NPM 스크립트**
```json
{
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest",
    "test:gemini": "jest --testPathPattern=geminiAI --verbose",
    "test:services": "jest --testPathPattern=services --verbose",
    "setup:env": "echo 'Please create .env file with your Google Cloud credentials'"
  }
}
```

---

## 📦 주요 의존성 패키지

### **핵심 의존성**
```json
{
  "dependencies": {
    "@craftzdog/react-native-buffer": "^6.1.0",
    "@react-native-async-storage/async-storage": "^2.2.0",
    "@react-navigation/native": "^7.1.17",
    "@react-navigation/stack": "^7.4.8",
    "dotenv": "^17.2.2",
    "react": "19.1.0",
    "react-native": "0.81.1",
    "react-native-crypto": "^2.2.1",
    "react-native-gesture-handler": "^2.28.0",
    "react-native-image-picker": "^8.2.1",
    "react-native-safe-area-context": "^5.6.1",
    "react-native-screens": "^4.16.0",
    "react-native-svg": "^15.13.0",
    "react-native-vector-icons": "^10.3.0"
  }
}
```

### **개발 의존성**
```json
{
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@react-native-community/cli": "20.0.0",
    "@react-native/babel-preset": "0.81.1",
    "@react-native/eslint-config": "0.81.1",
    "@react-native/metro-config": "0.81.1",
    "@react-native/typescript-config": "0.81.1",
    "@types/jest": "^29.5.13",
    "@types/react": "^19.1.0",
    "eslint": "^8.19.0",
    "jest": "^29.6.3",
    "prettier": "2.8.8",
    "typescript": "^5.8.3"
  }
}
```

---

## 🏛️ 프로젝트 구조

```
StoryPixelApp/
├── src/
│   ├── components/          # 재사용 가능한 UI 컴포넌트
│   │   ├── Calendar.tsx
│   │   ├── DateSlider.tsx
│   │   └── icons/          # SVG 아이콘 컴포넌트
│   ├── screens/            # 화면 컴포넌트
│   │   ├── DiaryCreateScreen.tsx
│   │   ├── DiaryImgGenOptionScreen.tsx
│   │   ├── DiaryScreen.tsx
│   │   ├── LandingScreen.tsx
│   │   ├── MainScreen.tsx
│   │   ├── SignInScreen.tsx
│   │   └── SignUpScreen.tsx
│   ├── services/           # 비즈니스 로직 서비스
│   │   ├── geminiAIService.ts
│   │   ├── storyProcessingService.ts
│   │   ├── imageGenerationService.ts
│   │   └── __tests__/      # 서비스 테스트
│   ├── navigation/         # 네비게이션 설정
│   │   └── AppNavigator.tsx
│   ├── config/            # 설정 파일
│   │   └── environment.ts
│   └── assets/            # 정적 자산
│       ├── images/
│       └── icons/
├── android/               # Android 네이티브 코드
├── ios/                   # iOS 네이티브 코드
├── __tests__/            # 앱 레벨 테스트
└── .env                  # 환경 변수 (Git에서 제외)
```

---

## 🚀 배포 및 빌드

### **Android 빌드**
```bash
# 개발 빌드
npm run android

# 릴리즈 빌드
cd android && ./gradlew assembleRelease
```

### **iOS 빌드**
```bash
# 개발 빌드
npm run ios

# 릴리즈 빌드
cd ios && xcodebuild -workspace StoryPixelApp.xcworkspace -scheme StoryPixelApp -configuration Release
```

---

## 🔍 테스트 전략

### **테스트 유형**
1. **단위 테스트**: 개별 서비스 및 함수 테스트
2. **통합 테스트**: AI 서비스 연동 테스트
3. **컴포넌트 테스트**: React Native 컴포넌트 테스트

### **테스트 실행**
```bash
# 전체 테스트
npm test

# AI 서비스 테스트
npm run test:gemini

# 서비스 테스트
npm run test:services
```

---

## 📈 성능 최적화

### **Metro 설정 최적화**
- **Hermes 엔진**: JavaScript 성능 향상
- **번들 최적화**: 불필요한 코드 제거
- **이미지 최적화**: SVG 및 압축된 이미지 사용

### **메모리 관리**
- **AsyncStorage**: 효율적인 로컬 데이터 저장
- **이미지 캐싱**: 생성된 이미지 캐싱
- **메모리 누수 방지**: 컴포넌트 언마운트 시 정리

---

## 🔧 개발 환경 설정

### **필수 요구사항**
- Node.js 20 이상
- React Native CLI
- Android Studio (Android 개발)
- Xcode (iOS 개발)
- Google Cloud 계정

### **초기 설정**
```bash
# 의존성 설치
npm install

# iOS 의존성 설치
cd ios && pod install

# 환경 변수 설정
cp .env.example .env
# .env 파일에 Google Cloud 설정 추가

# 개발 서버 시작
npm start
```

---

## 📚 추가 리소스

- [React Native 공식 문서](https://reactnative.dev/)
- [Google AI Studio 문서](https://ai.google.dev/)
- [React Navigation 문서](https://reactnavigation.org/)
- [TypeScript 문서](https://www.typescriptlang.org/)

---

## 🆘 문제 해결

### **자주 발생하는 문제**
1. **Metro 번들러 오류**: `npx react-native start --reset-cache`
2. **iOS 빌드 오류**: `cd ios && pod install`
3. **Android 빌드 오류**: `cd android && ./gradlew clean`
4. **AI 서비스 연결 오류**: 환경 변수 및 인증 설정 확인

### **디버깅 도구**
- React Native Debugger
- Flipper
- Chrome DevTools
- Android Studio Logcat
- Xcode Console

---

*이 문서는 StoryPixelApp의 현재 기술 스택을 기반으로 작성되었으며, 프로젝트 발전에 따라 업데이트될 수 있습니다.*
