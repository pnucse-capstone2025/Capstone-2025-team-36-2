# React Native 앱에서 Gemini AI 설정 가이드

StoryPixelApp을 React Native 환경에서 실행하기 위한 완전한 설정 가이드입니다.

## 목차

1. [필요 조건](#필요-조건)
2. [환경 변수 설정](#환경-변수-설정)
3. [앱 실행](#앱-실행)
4. [AI 기능 테스트](#ai-기능-테스트)
5. [문제 해결](#문제-해결)

## 필요 조건

- Node.js 20 이상
- React Native 개발 환경 설정 완료
- Android Studio (Android 개발용)
- Xcode (iOS 개발용)
- Google AI Studio API 키

## 환경 변수 설정

### 1. .env 파일 생성
프로젝트 루트에 `.env` 파일을 생성하세요:

```env
# Google AI Studio API 키 설정
GOOGLE_API_KEY=your-google-ai-studio-api-key-here

# Firebase 설정 (기존)
FIREBASE_API_KEY=AIzaSyDjc4z8SevkAV2qPaOag8eDqMG2BsvJP8o
FIREBASE_AUTH_DOMAIN=storypixelapp.firebaseapp.com
FIREBASE_PROJECT_ID=storypixelapp
FIREBASE_STORAGE_BUCKET=storypixelapp.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=553577037646
FIREBASE_APP_ID=1:553577037646:web:9034368b069c6b510ee81f

# Gemini AI 모델 설정
GEMINI_MODEL_TEXT=gemini-2.5-flash
GEMINI_MODEL_VISION=gemini-2.5-flash

# 개발 환경 설정
NODE_ENV=development
DEBUG=true

# 기타 설정
MAX_STORY_LENGTH=10000
API_RATE_LIMIT_DELAY=1000
```

### 2. API 키 교체
`.env` 파일에서 `your-google-ai-studio-api-key-here`를 실제 API 키로 교체하세요.

## 앱 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. Metro 서버 시작
```bash
npm start
```

### 3. Android 앱 실행
```bash
npm run android
```

### 4. iOS 앱 실행
```bash
npm run ios
```

## 🔍 문제 해결

### 1. "GOOGLE_API_KEY가 설정되지 않았습니다" 오류
**해결방법**:
- `.env` 파일이 프로젝트 루트에 있는지 확인
- `GOOGLE_API_KEY` 값이 올바른지 확인
- 앱을 완전히 종료하고 다시 실행

### 2. "API 키가 유효하지 않습니다" 오류
**해결방법**:
- Google AI Studio에서 새로운 API 키 생성
- API 키가 올바르게 복사되었는지 확인
- API 키에 공백이나 특수문자가 포함되지 않았는지 확인

### 3. Metro 서버 오류
**해결방법**:
```bash
# Metro 캐시 클리어
npx react-native start --reset-cache

# 또는
npm start -- --reset-cache
```

### 4. Android 빌드 오류
**해결방법**:
```bash
# Android 빌드 클리어
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### 5. iOS 빌드 오류
**해결방법**:
```bash
# iOS 빌드 클리어
cd ios
rm -rf build
cd ..
npx react-native run-ios
```

### 6. 환경 변수가 로드되지 않는 경우
**해결방법**:
- `babel.config.js`에서 `react-native-dotenv` 설정 확인
- 앱을 완전히 종료하고 다시 실행
- Metro 서버 재시작

## 앱 사용법

### 1. 메인 화면
- **일기장**: 일기 작성 및 이미지 생성
- **동화**: 동화 생성 및 문단 나누기
- **다른 친구의 이야기**: 공유된 이야기 보기
- **🤖 AI 테스트**: 개발자용 AI 기능 테스트

### 2. AI 기능
- **동화 문단 나누기**: 긴 동화를 의미있는 문단으로 분할
- **이미지 설명 생성**: 문단에 맞는 이미지 설명 생성
- **키워드 추출**: 이미지 생성에 필요한 키워드 추출

## 개발자 도구

### 1. 로그 확인
```bash
# Android 로그
npx react-native log-android

# iOS 로그
npx react-native log-ios
```

### 2. 디버깅
- React Native Debugger 사용
- Chrome DevTools 사용
- Flipper 사용

## 추가 리소스

- [React Native 문서](https://reactnative.dev/)
- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API 문서](https://ai.google.dev/docs)
- [react-native-dotenv 문서](https://github.com/goatandsheep/react-native-dotenv)


