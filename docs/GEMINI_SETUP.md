# Gemini AI 설정 가이드

StoryPixelApp에서 Gemini AI를 사용하기 위한 완전한 설정 가이드입니다.

## 📋 목차

1. [필요 조건](#필요-조건)
2. [Google AI Studio API 키 생성](#google-ai-studio-api-키-생성)
3. [환경 변수 설정](#환경-변수-설정)
4. [설정 검증](#설정-검증)
5. [사용법](#사용법)
6. [문제 해결](#문제-해결)

## 🔧 필요 조건

- Node.js 20 이상
- Google 계정
- Google AI Studio 접근 권한

## 🔑 Google AI Studio API 키 생성

### 1. Google AI Studio 접속
1. [Google AI Studio](https://aistudio.google.com/)에 접속
2. Google 계정으로 로그인

### 2. API 키 생성
1. "Get API Key" 클릭
2. "Create API Key" 선택
3. API 키 복사 (예: `AIzaSyDjc4z8SevkAV2qPaOag8eDqMG2BsvJP8o`)

## 🔐 환경 변수 설정

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

## ✅ 설정 검증

### 1. 설정 확인
```bash
npm run check:gemini
```

### 2. AI 기능 테스트
```bash
npm run test:gemini
```

## 🚀 사용법

### 1. 기본 사용법
```typescript
import { storyProcessingService } from './src/services/storyProcessingService';

// 동화 텍스트 처리
const storyText = `
옛날 옛적에 깊은 숲 속에 작은 토끼 한 마리가 살고 있었습니다.
토끼는 매일 아침 일어나서 당근을 먹고 숲을 산책했습니다.
`;

try {
  const processedStory = await storyProcessingService.processStory(storyText);
  console.log('처리된 동화:', processedStory);
} catch (error) {
  console.error('처리 실패:', error);
}
```

### 2. 서비스 상태 확인
```typescript
import { geminiAIService } from './src/services/geminiAIService';

// 서비스 상태 확인
const status = await geminiAIService.checkServiceStatus();
console.log('서비스 상태:', status);
```

## 🔍 문제 해결

### 1. "GOOGLE_API_KEY가 설정되지 않았습니다" 오류
**해결방법**:
- `.env` 파일이 프로젝트 루트에 있는지 확인
- `GOOGLE_API_KEY` 값이 올바른지 확인
- API 키가 `your-google-ai-studio-api-key-here`가 아닌 실제 키인지 확인

### 2. "API 키가 유효하지 않습니다" 오류
**해결방법**:
- Google AI Studio에서 새로운 API 키 생성
- API 키가 올바르게 복사되었는지 확인
- API 키에 공백이나 특수문자가 포함되지 않았는지 확인

### 3. "API 할당량을 초과했습니다" 오류
**해결방법**:
- Google AI Studio에서 할당량 확인
- 요청 빈도를 줄이기 위해 `API_RATE_LIMIT_DELAY` 값 증가
- 유료 플랜으로 업그레이드 고려

### 4. 네트워크 연결 오류
**해결방법**:
- 인터넷 연결 상태 확인
- 방화벽 설정 확인
- 프록시 설정 확인

## 📚 추가 리소스

- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API 문서](https://ai.google.dev/docs)
- [Google AI SDK 문서](https://ai.google.dev/docs/sdks)

## 🆘 지원

문제가 지속되면 다음을 확인해주세요:

1. Google AI Studio에서 API 키 상태 확인
2. 할당량 및 제한 확인
3. 네트워크 연결 상태 확인
4. 환경 변수 설정 확인

---

**참고**: 이 앱은 Gemini 2.5 Flash 모델을 사용하여 동화 처리 및 이미지 설명 생성을 수행합니다.

