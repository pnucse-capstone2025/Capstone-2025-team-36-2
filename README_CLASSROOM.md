# StoryPixelApp - GitHub Classroom Version

이 프로젝트는 GitHub Classroom 사용을 위해 빌드 파일과 민감한 정보가 제거된 버전입니다.

## 제거된 파일들

### 빌드 파일 및 의존성
- `node_modules/` - Node.js 패키지 의존성
- `android/app/build/` - Android 빌드 출력물
- `ios/build/` - iOS 빌드 출력물
- `ios/Pods/` - CocoaPods 의존성
- `vendor/bundle/` - Ruby gem 의존성

### 민감한 정보 파일들
- `google-services.json` - Firebase Android 설정 (민감한 정보 포함)
- `storypixelappai-7465c8e24c8d.json` - Firebase 서비스 계정 키
- `.env` 파일들 - 환경 변수 및 API 키

### 기타 제거된 파일들
- `*.apk` - Android 빌드 결과물
- `*.jsbundle` - React Native 번들 파일
- `*.keystore` - Android 키스토어 파일 (debug.keystore 제외)

## 프로젝트 설정을 위해 필요한 작업

학생들이 이 프로젝트를 사용하기 위해서는 다음 파일들을 별도로 설정해야 합니다:

### 1. Firebase 설정
- Firebase 프로젝트 생성
- `google-services.json` (Android용)
- `GoogleService-Info.plist` (iOS용)
- Firebase 서비스 계정 키 파일

### 2. 환경 변수 설정
`.env` 파일 생성 및 다음 변수들 설정:
```
GOOGLE_AI_STUDIO_API_KEY=your_api_key_here
```

### 3. 의존성 설치
```bash
npm install
cd ios && pod install
```

## 원본 프로젝트
이 클린 버전은 원본 StoryPixelApp 프로젝트에서 파생되었습니다.

## 주의사항
- 민감한 정보 (API 키, 서비스 계정 키 등)는 절대 Git에 커밋하지 마세요
- `.gitignore` 파일이 이미 설정되어 있으니 확인하고 사용하세요
- Firebase 설정은 각자의 프로젝트에 맞게 개별적으로 설정해야 합니다
