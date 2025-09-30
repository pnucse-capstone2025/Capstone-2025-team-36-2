# StoryPixelApp - AI 기반 그림일기·동화 생성 앱

> AI 기술을 활용하여 일상의 기록을 그림과 함께 아름다운 이야기로 만들어주는 React Native 모바일 애플리케이션

---

## 1. 프로젝트 배경

### 1.1. 국내외 시장 현황 및 문제점

**디지털 스토리텔링 시장의 급성장**
- 전 세계 디지털 스토리텔링 시장 규모: 2024년 100억 달러 → 2030년 300억 달러 예상 (연평균 15% 성장)
- 특히 AI 기반 콘텐츠 생성 도구에 대한 수요가 급증하고 있음

**기존 서비스들의 한계점**
- **높은 AI 진입장벽**: 원하는 이미지를 얻기 위한 프롬프트의 숙지 필요
- **시각적 표현의 한계**: 텍스트 기반 기록만으로는 감정과 추억을 생생하게 보존하기 어려움
- **동화 컨텐츠의 소비**: 어린이들이 어른이 쓴 이야기를 동화 라는 컨텐츠로 수동적인 소비만 함

### 1.2. 필요성과 기대효과

**개발 필요성**
- **인간의 창의성의 중요도 증가**: AI의 발전으로 인간 고유의 가치인 창의성의 중요도가 더욱 증가
- **AI 기술의 대중화**: Generative AI 기술의 발전으로 개인 맞춤형 콘텐츠 생성 가능

**기대효과**
- **창작 활동 활성화**: AI 도움으로 그림에 대한 부담 감소. 더 많은 사람들의 창작 참여 유도
- **창의성 증대**: 컨텐츠 소비자가 아닌 생산자로서 이야기를 만들며 창의성이 증대
---

## 2. 개발 목표

### 2.1. 목표 및 세부 내용

**전체 개발 목표**
> 사용자가 자신이 상상한 이야기를 쉽게 그림동화로 구현 할 수 있는 시스템의 개발

**주요 기능**

1. **AI 기반 일기 이미지 생성**
   - 사용자가 작성한 일기 내용을 바탕으로 이미지 자동 생성
   - 문단별로 분할하여 각 장면에 맞는 이미지 생성
   - 달력 기반 일기 관리 및 검색 기능

2. **동화 일러스트 생성 도구**
   - 사용자가 작성한 동화 텍스트를 문단별로 분석
   - 각 문단의 장면에 어울리는 일러스트 이미지 자동 생성
   - 다양한 이미지 스타일과 색상 팔레트 선택 가능

3. **개인화된 콘텐츠 관리**
   - Firebase 기반 클라우드 저장으로 안전한 데이터 보관
   - 작성한 일기와 동화의 체계적 분류 및 관리
   - 개인 취향에 맞는 이미지 스타일 커스터마이징

### 2.2. 기존 서비스 대비 차별성

| 구분 | 기존 서비스 | StoryPixelApp |
|------|-------------|---------------|
| **콘텐츠 생성** | 사용자가 직접 작성 | 사용자 텍스트 + AI 이미지 생성 |
| **시각화** | 텍스트 중심 또는 템플릿 이미지 | 텍스트 내용 분석 기반 맞춤 AI 이미지 |
| **이미지 품질** | 저해상도 또는 스톡 이미지 | Gemini AI 기반 고품질 커스텀 이미지 |
| **개인화** | 템플릿 기반 | 텍스트 분위기에 맞는 개별 생성 |
| **편의성** | 별도 이미지 검색/편집 필요 | 텍스트 작성 후 원터치 이미지 생성 |

**핵심 차별점**
- **텍스트-이미지 매칭**: 작성된 내용의 감정과 상황을 정확히 분석하여 어울리는 이미지 생성
- **감정 친화적 AI**: 단순한 키워드가 아닌, 전체 맥락과 분위기를 이해하는 AI 모델 활용
- **직관적 UX/UI**: 텍스트 작성 후 버튼 하나로 완성되는 간편한 워크플로우

### 2.3. 사회적 가치 도입 계획

**공공성**
- **문해력 향상**: AI와의 협업을 통해 자연스럽게 언어 표현 능력 개발
- **세대 간 소통**: 부모-자녀가 함께 동화를 만들며 가족 간 유대감 증진
- **창의성 교육**: 아이들의 상상력과 창의적 사고 능력 개발 도구로 활용
- **정신 건강 증진**: 일기 작성을 통한 감정 정리 및 자기 성찰 기회 제공

**지속 가능성 및 환경 보호**
- **친환경적 기록**: 종이 다이어리 대신 디지털 플랫폼 사용으로 환경 보호
- **장기적 데이터 보존**: 클라우드 기반 저장으로 소중한 추억의 영구 보관

---

## 3. 시스템 설계

### 3.1. 시스템 구성도

```
┌─────────────────────────────────────────────────────────────┐
│                    StoryPixelApp 아키텍처                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │  Firebase Cloud │    │  Google AI      │
│  (React Native) │    │    Services     │    │   Platform      │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • 일기 작성       │    │ • Authentication│    │ • Gemini AI     │
│ • 동화 생성       │◄──►│ • Firestore DB  │◄──►│ • Text Generation│
│ • 이미지 뷰어      │    │ • Cloud Storage │    │ • Image Creation│
│ • 사용자 인증      │    │ • Real-time Sync│    │ • Multi-modal   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Components │    │   Data Layer    │    │   AI Services   │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • DateSlider    │    │ • User Profiles │    │ • Story Process │
│ • Calendar      │    │ • Diary Entries │    │ • Image Generate│
│ • ImageSelector │    │ • Fairytale Data│    │ • Prompt Engine │
│ • Navigation    │    │ • Media Files   │    │ • Style Control │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 3.2. 사용 기술

#### **Frontend**
- **React Native 0.81.1**: 크로스 플랫폼 모바일 앱 개발
- **TypeScript 5.8.3**: 타입 안전성과 개발 생산성 향상
- **React Navigation 7.x**: 화면 간 네비게이션 관리
- **React Native Vector Icons**: 직관적인 UI 아이콘

#### **Backend & Cloud Services**
- **Firebase Authentication**: 안전한 사용자 인증 관리
- **Cloud Firestore**: NoSQL 데이터베이스로 실시간 동기화
- **Firebase Cloud Storage**: 이미지 및 미디어 파일 저장
- **Google AI Platform**: Gemini AI 모델 활용

#### **AI & ML**
- **Google Gemini 2.5 Flash**: 빠른 텍스트 생성 및 처리
- **Google Gemini 2.5 Pro**: 고품질 콘텐츠 생성
- **Gemini Image Generation**: AI 기반 이미지 생성

#### **개발 도구**
- **Metro Bundler**: React Native 번들링 및 빌드
- **ESLint & Prettier**: 코드 품질 관리 및 포맷팅
- **Jest**: 단위 테스트 및 통합 테스트
- **Git**: 버전 관리 및 협업

---

## 4. 개발 결과

### 4.1. 전체 시스템 흐름도

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  사용자 입력   │───►│  AI 처리     │───►│  결과 생성    │
│ (키워드/텍스트) │    │ (Gemini AI) │    │ (스토리+이미지)│
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  입력 검증    │    │  프롬프트      │    │  데이터 저장  │
│  및 전처리    │    │  엔지니어링    │    │  (Firebase) │
└─────────────┘    └─────────────┘    └─────────────┘

**일기 작성 플로우**
1. 사용자가 날짜 선택 및 일기 제목과 내용 직접 작성
2. 작성 완료 후 '이미지 생성' 버튼 클릭
3. AI가 일기 내용을 분석하여 문단별로 분할 및 키워드 추출
4. AI의 스타일 추천 및 사용자 커스텀 스타일 선택
5. 각 문단에 맞는 이미지 자동 생성
6. 완성된 일기와 이미지를 Firebase에 저장
7. 달력 뷰에서 작성된 일기 확인 가능

**동화 생성 플로우**
1. 사용자가 동화 제목과 내용을 직접 작성
2. 작성 완료 후 '이미지 생성' 버튼 클릭
3. AI가 동화 텍스트를 장면별로 분할하여 문단 구성
4. AI의 스타일 추천 및 사용자 커스텀 스타일 선택
5. 각 문단에 맞는 이미지 자동 생성
6. 완성된 일기와 이미지를 Firebase에 저장
7. 동화 뷰에서 작성된 동화 확인 가능
```

### 4.2. 기능 설명 및 주요 기능 명세서

#### **핵심 기능 명세**

| 기능명 | 입력 | 출력 | 설명 |
|--------|------|------|------|
| **텍스트 분석 및 분할** | 사용자 작성 텍스트 | 문단별 분할된 텍스트 | AI가 텍스트를 장면별로 의미있게 분할 |
| **이미지 자동 생성** | 분할된 텍스트 문단 | 각 문단에 맞는 AI 생성 이미지 | Gemini AI가 텍스트 분위기에 맞는 일러스트 자동 생성 |
| **스타일 커스터마이징** | 이미지 스타일 선택 | 스타일 적용된 이미지 | 수채화, 유화, 애니메이션 등 다양한 스타일 선택 |
| **달력 기반 관리** | 날짜 선택 | 해당 날짜 일기 목록 | 직관적인 달력 UI로 일기 관리 |
| **클라우드 동기화** | 사용자 데이터 | 실시간 백업 | Firebase 기반 안전한 데이터 저장 |

#### **상세 기능 설명**

**1. 텍스트 기반 이미지 생성**
- **입력**: 사용자가 직접 작성한 일기나 동화 텍스트
- **처리**: Gemini AI가 텍스트 내용을 분석하여 문단별로 분할하고 각 장면의 시각적 요소 추출
- **출력**: 텍스트 내용과 완벽하게 매칭되는 감성적 이미지
- **특징**: 텍스트의 감정, 분위기, 상황을 정확히 반영한 개별 맞춤 이미지

**2. 지능형 문단 분할**
- **입력**: 긴 텍스트 (일기나 동화)
- **처리**: AI가 내용을 분석하여 시각적으로 표현 가능한 의미 단위로 분할
- **출력**: 각각 독립적인 장면을 담은 문단들
- **특징**: 단순한 문장 분할이 아닌, 이미지 생성에 최적화된 지능적 분할

**3. 개인화된 이미지 생성**
- **스타일 옵션**: 수채화, 유화, 애니메이션, 실사 등
- **색상 팔레트**: 따뜻한 톤, 차가운 톤, 빈티지 등
- **분위기 설정**: 밝고 경쾌한, 차분하고 감성적인 등

### 4.3. 디렉토리 구조

```
StoryPixelApp/
├── src/
│   ├── components/              # 재사용 가능한 UI 컴포넌트
│   │   ├── Calendar.tsx         # 달력 컴포넌트
│   │   ├── DateSlider.tsx       # 날짜 슬라이더
│   │   ├── ImageStyleSelector.tsx # 이미지 스타일 선택기
│   │   └── icons/               # SVG 아이콘 컴포넌트
│   │       ├── BackArrowIcon.tsx
│   │       ├── CalendarIcon.tsx
│   │       ├── PlusIcon.tsx
│   │       ├── SettingsIcon.tsx
│   │       ├── TrashIcon.tsx
│   │       └── UserIcon.tsx
│   ├── screens/                 # 화면 컴포넌트
│   │   ├── LandingScreen.tsx    # 랜딩/인트로 화면
│   │   ├── MainScreen.tsx       # 메인 화면
│   │   ├── DiaryScreen.tsx      # 일기 목록 화면
│   │   ├── DiaryCreateScreen.tsx # 일기 작성 화면
│   │   ├── DiaryDetailViewScreen.tsx # 일기 상세 보기
│   │   ├── DiarySaveScreen.tsx  # 일기 저장 화면
│   │   ├── DiaryImgGenOptionScreen.tsx # 일기 이미지 생성 옵션
│   │   ├── FairytaleScreen.tsx  # 동화 목록 화면
│   │   ├── FairytaleCreateScreen.tsx # 동화 작성 화면
│   │   ├── FairytaleDetailViewScreen.tsx # 동화 상세 보기
│   │   ├── FairytaleSaveScreen.tsx # 동화 저장 화면
│   │   ├── FairytaleImgGenOptionScreen.tsx # 동화 이미지 생성 옵션
│   │   ├── SignInScreen.tsx     # 로그인 화면
│   │   ├── SignUpScreen.tsx     # 회원가입 화면
│   │   ├── ResetPasswordScreen.tsx # 비밀번호 재설정
│   │   └── SettingScreen.tsx    # 설정 화면
│   ├── services/                # 비즈니스 로직 서비스
│   │   ├── authService.ts       # 사용자 인증 서비스
│   │   ├── diaryService.ts      # 일기 관련 서비스
│   │   ├── fairytaleService.ts  # 동화 관련 서비스
│   │   ├── geminiAIService.ts   # Gemini AI 서비스
│   │   ├── imageGenerationService.ts # 이미지 생성 서비스
│   │   ├── imageStorageService.ts # 이미지 저장 서비스
│   │   ├── storyProcessingService.ts # 스토리 처리 서비스
│   │   └── __tests__/           # 서비스 테스트
│   ├── navigation/              # 네비게이션 설정
│   │   └── AppNavigator.tsx     # 앱 네비게이션 구성
│   ├── contexts/                # React Context
│   │   └── AuthContext.tsx      # 인증 컨텍스트
│   ├── config/                  # 설정 파일
│   │   ├── environment.ts       # 환경 변수 관리
│   │   └── firebase.ts          # Firebase 설정
│   ├── constants/               # 상수 정의
│   │   ├── apiConstants.ts      # API 관련 상수
│   │   ├── prompts.ts           # AI 프롬프트 템플릿
│   │   └── styleConstants.ts    # 스타일 상수
│   ├── types/                   # TypeScript 타입 정의
│   │   ├── aiTypes.ts           # AI 관련 타입
│   │   ├── diaryTypes.ts        # 일기 관련 타입
│   │   └── env.d.ts             # 환경 변수 타입
│   ├── utils/                   # 유틸리티 함수
│   │   ├── dateUtils.ts         # 날짜 처리 유틸
│   │   ├── imageUtils.ts        # 이미지 처리 유틸
│   │   └── reactNativeImageUtils.ts # RN 이미지 유틸
│   └── assets/                  # 정적 자산
│       ├── images/              # 이미지 파일
│       └── icons/               # 아이콘 파일
├── android/                     # Android 네이티브 코드
├── ios/                         # iOS 네이티브 코드
├── functions/                   # Firebase Cloud Functions
├── __tests__/                   # 앱 레벨 테스트
├── package.json                 # NPM 의존성 관리
├── tsconfig.json               # TypeScript 설정
├── jest.config.js              # Jest 테스트 설정
├── metro.config.js             # Metro 번들러 설정
├── babel.config.js             # Babel 트랜스파일러 설정
├── firebase.json               # Firebase 프로젝트 설정
├── firestore.rules             # Firestore 보안 규칙
├── firestore.indexes.json      # Firestore 인덱스 설정
└── storage.rules               # Cloud Storage 보안 규칙
```

---

## 5. 설치 및 실행 방법

### 5.1. 설치절차 및 실행 방법

#### **사전 요구사항**
```bash
# Node.js 20 이상 필요
node --version  # v20.0.0+

# React Native CLI 설치
npm install -g @react-native-community/cli

# 개발 환경 확인
npx react-native doctor
```

#### **프로젝트 설치**
```bash
# 1. 저장소 클론
git clone https://github.com/your-repo/StoryPixelApp.git
cd StoryPixelApp

# 2. 의존성 설치
npm install

# 3. iOS 의존성 설치 (iOS 개발 시)
cd ios && pod install && cd ..

# 4. 환경 변수 설정
cp .env.example .env
# .env 파일에 Google AI Studio API 키 추가
# GOOGLE_API_KEY=your_api_key_here
```

#### **Firebase 설정**
```bash
# Firebase 프로젝트 생성 후
# 1. google-services.json을 android/app/ 폴더에 복사
# 2. GoogleService-Info.plist를 ios/ 폴더에 복사
# 3. Firebase 설정 파일들이 프로젝트에 포함되어 있는지 확인
```

#### **실행 명령어**
```bash
# Metro 번들러 시작
npm start

# Android에서 실행
npm run android

# iOS에서 실행 (macOS만 가능)
npm run ios

# 개발 도구
npm run test          # 테스트 실행
npm run lint          # 코드 품질 검사
npm run check:gemini  # Gemini AI 연결 확인
```

#### **포트 정보**
- **Metro Bundler**: http://localhost:8081
- **Android Emulator**: 기본 포트 (자동 할당)
- **iOS Simulator**: 기본 포트 (자동 할당)

### 5.2. 오류 발생 시 해결 방법

#### **자주 발생하는 오류 및 해결책**

**1. Metro 번들러 캐시 오류**
```bash
# 증상: 빌드 오류, 변경사항 반영 안됨
npx react-native start --reset-cache
```

**2. iOS 빌드 오류**
```bash
# 증상: iOS 빌드 실패
cd ios
pod deintegrate
pod install
cd ..
```

**3. Android 빌드 오류**
```bash
# 증상: Android 빌드 실패
cd android
./gradlew clean
cd ..
npx react-native run-android
```

**4. API 키 관련 오류**
```bash
# 증상: Gemini AI 연결 실패
# 해결: .env 파일에 올바른 API 키 설정 확인
echo $GOOGLE_API_KEY  # 환경 변수 확인
npm run check:gemini  # API 연결 테스트
```

**5. Firebase 연결 오류**
```bash
# 증상: Firebase 인증/데이터베이스 연결 실패
# 해결: 
# 1. google-services.json (Android) 파일 위치 확인
# 2. GoogleService-Info.plist (iOS) 파일 위치 확인
# 3. Firebase 프로젝트 설정에서 앱 등록 확인
```

**6. 메모리 부족 오류**
```bash
# 증상: 앱 크래시, 이미지 로딩 실패
# 해결: 
export NODE_OPTIONS="--max-old-space-size=8192"
npm start
```

---

## 6. 소개 자료 및 시연 영상

### 6.1. 프로젝트 소개 자료

> ./docs/03.발표자료/발표자료.pdf

### 6.2. 시연 영상

> [![2025 전기 졸업과제 36 스토리픽셀](https://www.youtube.com/watch?v=K8SzoP5nCNY)] 


## 7. 팀 구성

### 7.1. 팀원별 소개 및 역할 분담

#### **팀 소개**
> **팀명**: 스토리픽셀 (StoryPixel)

> **팀장 - 이승민**: 
AI api 설정, Firebase Data 구조 정리, OAuth 인증 기능, AI 프롬프트 엔지니어링 및 파인튜닝

> **팀원 - 여현준**: 
일기/동화 CRUD 기능, AI 장면 분할 및 이미지 생성 적용, 반응형 UI/UX, Firebase 백엔드


### 7.2. 팀원 별 참여 후기

#### **팀장 - 이승민**

> 이번 프로젝트를 통해 AI 기술이 단순한 도구가 아닌, 사용자의 창작 활동을 도와주는 진정한 파트너가 될 수 있음을 깨달았습니다. 특히 Gemini AI의 프롬프트 엔지니어링 과정에서 AI와 대화하듯 원하는 결과를 얻어내는 과정이 마치 새로운 언어를 배우는 것 같았습니다.

#### **팀원 - 여현준**
> 이번 프로젝트로 AI 기술을 적극적으로 활용해보는 시간을 가질 수 있었습니다. 또한, 크로스플랫폼 앱 개발 과정에서 초기 빌드를 하는 데 많은 어려움이 있었지만 이번 기회로 다음에 앱을 만들게 된다면 더 좋은 앱을 만들 수 있는 원동력이 되었습니다.

**디자인 철학과 구현**
- 부드러운 곡선과 파스텔 톤의 색상 팔레트로 친근한 분위기 조성
- 한국어 사용자를 고려한 타이포그래피와 여백 설계
- 3번의 터치만으로 원하는 결과를 얻을 수 있는 단순하지만 강력한 UX 플로우

## 8. 참고 문헌 및 출처

#### **기술 문서 및 가이드**
1. [React Native 공식 문서](https://reactnative.dev/docs/getting-started)
   
2. [Google AI Studio 개발자 가이드](https://ai.google.dev/docs)

3. [Firebase 개발자 문서](https://firebase.google.com/docs)

4. [TypeScript 핸드북](https://www.typescriptlang.org/docs/)

#### **UI/UX 디자인 참고자료**
5. [Material Design Guidelines](https://material.io/design)

6. [Human Interface Guidelines (Apple)](https://developer.apple.com/design/human-interface-guidelines/)

#### **오픈소스 라이브러리**
7. [React Navigation](https://reactnavigation.org/)

8. [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons)

9. [React Native Safe Area Context](https://github.com/th3rdwave/react-native-safe-area-context)

### **프로젝트 관리 도구**
10. [Git 버전 관리 시스템](https://git-scm.com/)

11. [npm 패키지 매니저](https://www.npmjs.com/)

12. [Jest 테스팅 프레임워크](https://jestjs.io/)

### **기타 참고 사항**
13. [디지털 스토리텔링 전망](https://www.futuredatastats.com/digital-storytelling-market)

---
