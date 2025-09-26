# Gemini 2.5 Flash Image Preview (Nano Banana) 사용 가이드

## 개요

[Google AI 공식 문서](https://ai.google.dev/gemini-api/docs/image-generation#rest)에 따라 `gemini-2.5-flash-image-preview` (Nano Banana) 모델을 사용하여 StoryPixelApp에서 고품질의 동화책 일러스트를 생성하는 방법을 설명합니다.

## 🔍 주요 특징

- **Base64 데이터 반환**: 이미지가 URL이 아닌 Base64 인코딩된 데이터로 반환됩니다
- **SynthID 워터마크**: 모든 생성된 이미지에 SynthID 워터마크가 포함됩니다
- **대화형 편집**: 텍스트와 이미지를 조합한 편집 기능 지원
- **고품질 텍스트 렌더링**: 로고, 다이어그램, 포스터에 적합한 정확한 텍스트 생성

## 🚀 빠른 시작

### 1. 기본 이미지 생성

```typescript
import { geminiAIService } from './src/services/geminiAIService';
import { base64ToImageUri } from './src/utils/reactNativeImageUtils';

// 기본 이미지 생성 (Base64 데이터 반환)
const imageResult = await geminiAIService.generateImage(
  'A cute rabbit playing in a colorful garden',
  {
    style: 'children book illustration',
    dimensions: { width: 512, height: 512 },
    quality: 'high'
  }
);

// React Native에서 사용할 수 있는 URI로 변환
const imageUri = base64ToImageUri(imageResult.imageData, imageResult.mimeType);

console.log('생성된 이미지 URI:', imageUri);
console.log('이미지 메타데이터:', {
  dataSize: imageResult.imageData.length,
  mimeType: imageResult.mimeType,
  model: imageResult.model
});
```

### 2. ImageGenerationService 사용

```typescript
import { imageGenerationService } from './src/services/imageGenerationService';

// 고급 이미지 생성
const result = await imageGenerationService.generateImage(
  'A magical forest with talking animals',
  {
    style: {
      type: 'children_book',
      mood: 'mysterious',
      colorPalette: 'vibrant'
    },
    dimensions: {
      width: 1024,
      height: 768,
      aspectRatio: 'landscape'
    },
    quality: {
      resolution: 'high',
      detail: 'highly_detailed'
    }
  }
);

console.log('생성된 이미지:', result.url);
```

## 📋 API 참조

### GeminiAIService.generateImage()

```typescript
generateImage(
  prompt: string,
  options?: {
    style?: string;
    dimensions?: { width: number; height: number };
    quality?: 'low' | 'medium' | 'high';
  }
): Promise<string>
```

#### 매개변수

- **prompt** (string): 이미지 생성 프롬프트
- **options.style** (string, 선택사항): 이미지 스타일
  - `'children book illustration'` (기본값)
  - `'realistic'`
  - `'cartoon'`
  - `'watercolor'`
  - `'oil painting'`
  - `'digital art'`
- **options.dimensions** (object, 선택사항): 이미지 크기
  - `width`: 이미지 너비 (픽셀)
  - `height`: 이미지 높이 (픽셀)
- **options.quality** (string, 선택사항): 이미지 품질
  - `'low'`: 빠른 생성, 낮은 품질
  - `'medium'`: 균형잡힌 생성 (기본값)
  - `'high'`: 느린 생성, 높은 품질

#### 반환값

- **Promise<string>**: 생성된 이미지의 URL

### ImageGenerationService.generateImage()

```typescript
generateImage(
  description: string,
  request: ImageGenerationRequest
): Promise<GeneratedImage>
```

#### ImageGenerationRequest 인터페이스

```typescript
interface ImageGenerationRequest {
  description: string;
  style?: ImageStyle;
  dimensions?: ImageDimensions;
  quality?: ImageQuality;
}

interface ImageStyle {
  type: 'realistic' | 'cartoon' | 'watercolor' | 'oil_painting' | 'digital_art' | 'children_book';
  mood: 'happy' | 'sad' | 'mysterious' | 'adventurous' | 'peaceful' | 'exciting';
  colorPalette: 'vibrant' | 'pastel' | 'monochrome' | 'warm' | 'cool';
}

interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: 'square' | 'landscape' | 'portrait';
}

interface ImageQuality {
  resolution: 'low' | 'medium' | 'high' | 'ultra';
  detail: 'simple' | 'detailed' | 'highly_detailed';
}
```

## 🎨 사용 예제

### 1. 동화책 일러스트 생성

```typescript
// 동화 텍스트에서 이미지 생성
const storyText = '토끼가 숲속에서 친구들과 함께 놀고 있습니다.';

// 1단계: 이미지 설명 생성
const imageDescription = await geminiAIService.generateImageDescription(storyText);

// 2단계: 이미지 생성
const imageUrl = await geminiAIService.generateImage(imageDescription, {
  style: 'children book illustration',
  dimensions: { width: 800, height: 600 },
  quality: 'high'
});
```

### 2. 배치 이미지 생성

```typescript
const storyParagraphs = [
  '옛날 옛적에 작은 마을에 살고 있던 토끼가 있었습니다.',
  '토끼는 매일 아침 숲으로 나가서 친구들을 만났습니다.',
  '어느 날, 토끼는 마법의 나무를 발견했습니다.'
];

const images = [];

for (const paragraph of storyParagraphs) {
  try {
    const description = await geminiAIService.generateImageDescription(paragraph);
    const imageUrl = await geminiAIService.generateImage(description, {
      style: 'children book illustration',
      dimensions: { width: 1024, height: 768 },
      quality: 'high'
    });
    
    images.push({ paragraph, imageUrl });
    
    // API 호출 간격 조절
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (error) {
    console.error('이미지 생성 실패:', error);
  }
}
```

### 3. 다양한 스타일 실험

```typescript
const styles = [
  { name: 'realistic', prompt: 'A photorealistic forest scene' },
  { name: 'cartoon', prompt: 'A cartoon-style magical castle' },
  { name: 'watercolor', prompt: 'A watercolor painting of a garden' },
  { name: 'oil painting', prompt: 'An oil painting of a sunset' },
  { name: 'digital art', prompt: 'A digital art illustration of a dragon' }
];

for (const style of styles) {
  const imageUrl = await geminiAIService.generateImage(style.prompt, {
    style: style.name,
    dimensions: { width: 512, height: 512 },
    quality: 'medium'
  });
  
  console.log(`${style.name} 스타일 이미지:`, imageUrl);
}
```

## ⚙️ 설정

### 환경 변수

`.env` 파일에 다음 설정이 필요합니다:

```env
GOOGLE_API_KEY=your_google_api_key_here
```

### 모델 설정

`src/config/environment.ts`에서 모델을 변경할 수 있습니다:

```typescript
GEMINI_MODEL_IMAGE: 'gemini-2.5-flash-image-preview'
```

## 🔧 최적화 팁

### 1. 프롬프트 최적화

```typescript
// 좋은 프롬프트 예시
const goodPrompt = 'A cute rabbit playing in a colorful garden with flowers and butterflies, children book illustration style, high quality, detailed, vibrant colors, suitable for children, engaging, storybook illustration';

// 나쁜 프롬프트 예시
const badPrompt = 'rabbit'; // 너무 간단함
```

### 2. 성능 최적화

```typescript
// 낮은 품질로 빠른 생성
const quickImage = await geminiAIService.generateImage(prompt, {
  quality: 'low',
  dimensions: { width: 256, height: 256 }
});

// 높은 품질로 정교한 생성
const detailedImage = await geminiAIService.generateImage(prompt, {
  quality: 'high',
  dimensions: { width: 1024, height: 1024 }
});
```

### 3. 에러 처리

```typescript
try {
  const imageUrl = await geminiAIService.generateImage(prompt, options);
  // 이미지 사용
} catch (error) {
  console.error('이미지 생성 실패:', error);
  // 대체 이미지 또는 사용자에게 알림
}
```

## 🧪 테스트

### 단위 테스트 실행

```bash
npm test -- --testPathPattern=geminiImageGeneration.test.ts
```

### 예제 실행

```typescript
import { runAllExamples } from './src/examples/geminiImageGenerationExample';

// 모든 예제 실행
await runAllExamples();
```

## 🚨 주의사항

1. **API 제한**: Google AI API에는 요청 제한이 있습니다. 배치 처리 시 적절한 지연 시간을 두세요.

2. **비용**: 이미지 생성은 텍스트 생성보다 비용이 높을 수 있습니다.

3. **품질**: 프롬프트의 품질이 생성된 이미지의 품질에 직접적으로 영향을 줍니다.

4. **해상도**: 높은 해상도는 더 오래 걸리고 더 많은 비용이 발생할 수 있습니다.

## 🔗 관련 링크

- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API 문서](https://ai.google.dev/docs)
- [이미지 생성 모델 가이드](https://ai.google.dev/docs/gemini_api_overview#image_generation)

## 📞 지원

문제가 발생하면 다음을 확인하세요:

1. API 키가 올바르게 설정되었는지
2. 네트워크 연결 상태
3. 프롬프트가 적절한지
4. 서비스 초기화 상태

```typescript
// 서비스 상태 확인
const status = await geminiAIService.checkServiceStatus();
console.log('서비스 상태:', status);
```
