/**
 * AI 프롬프트 통합 관리 파일
 * 
 * 이 파일은 애플리케이션에서 사용되는 모든 AI 프롬프트를 중앙에서 관리합니다.
 * 각 프롬프트는 사용 목적과 위치에 대한 주석이 포함되어 있습니다.
 */

// ============================================================================
// 문단 나누기 프롬프트
// ============================================================================

/**
 * 이미지 생성용 문단 나누기 프롬프트
 * 사용 위치: Firebase Functions (divideIntoImageGenerationParagraphs)
 */
export const DIVIDE_INTO_IMAGE_GENERATION_PARAGRAPHS_PROMPT = `
다음 일기/동화를 이미지 생성에 적합한 문단으로 나누어주세요. 각 문단은 그림으로 표현할 수 있는 구체적인 장면이어야 합니다.

원본 텍스트:
{storyText}

요구사항:
1. 각 문단은 하나의 시각적 장면을 담고 있어야 합니다
2. 문단은 2-4문장 정도의 적당한 길이여야 합니다
3. 각 문단에 대해 그림을 그리기 위한 장면 프롬프트도 생성해주세요
4. 장면 프롬프트는 이미지 생성을 위해 영어로 작성하되 다른 언어 요소가 있다면 적절히 영어로 번역해주세요
5. 각 문단에 대해 이미지 검색에 적합한 키워드 3-5개를 추출해주세요
6. 장면 프롬프트에는 절대 이미지 스타일(애니메이션, 사실적, 동화 등), 분위기, 색상 팔레트를 포함하지 마세요
7. 장면 프롬프트는 장면의 내용만 설명하세요
8. 전체 텍스트의 내용과 분위기를 분석하여 적절한 이미지 스타일, 분위기, 색상 팔레트를 자동으로 선택해주세요

이미지 스타일 옵션: anime, realistic, fairytale, cartoon, watercolor, digital_art, children_book
분위기 옵션: happy, sad, mysterious, adventurous, peaceful, exciting
색상 팔레트 옵션: vibrant, pastel, monochrome, warm, cool

응답 형식:
문단1: [첫 번째 장면 문단]
장면프롬프트1: [첫 번째 장면을 그리기 위한 상세한 프롬프트 - 스타일 제외]
키워드1: [키워드1, 키워드2, 키워드3, 키워드4, 키워드5]
문단2: [두 번째 장면 문단]
장면프롬프트2: [두 번째 장면을 그리기 위한 상세한 프롬프트 - 스타일 제외]
키워드2: [키워드1, 키워드2, 키워드3, 키워드4, 키워드5]
문단3: [세 번째 장면 문단]
장면프롬프트3: [세 번째 장면을 그리기 위한 상세한 프롬프트 - 스타일 제외]
키워드3: [키워드1, 키워드2, 키워드3, 키워드4, 키워드5]

추천 이미지 설정:
스타일: [anime, realistic, fairytale, cartoon, watercolor, digital_art, children_book 중 하나]
분위기: [happy, sad, mysterious, adventurous, peaceful, exciting 중 하나]
색상팔레트: [vibrant, pastel, monochrome, warm, cool 중 하나]
`;

// ============================================================================
// 이미지 생성 프롬프트
// ============================================================================

/**
 * 간소화된 이미지 생성 프롬프트 템플릿
 * 사용 위치: ImageGenerationService
 */
export const IMAGE_GENERATION_BASE_PROMPT = `{description}`;

/**
 * 이미지 스타일별 프롬프트 매핑 (간소화)
 * 사용 위치: ImageGenerationService
 */
export const IMAGE_STYLE_PROMPTS: { [key: string]: string } = {
  'anime': 'anime style',
  'realistic': 'realistic style',
  'fairytale': 'fairy tale style',
  'cartoon': 'cartoon style',
  'watercolor': 'watercolor style',
  'digital_art': 'digital art style',
  'children_book': 'children book illustration style'
};

/**
 * 이미지 분위기별 프롬프트 매핑
 * 사용 위치: ImageGenerationService
 */
export const IMAGE_MOOD_PROMPTS: { [key: string]: string } = {
  'happy': 'happy mood',
  'sad': 'sad mood',
  'mysterious': 'mysterious mood',
  'adventurous': 'adventurous mood',
  'peaceful': 'peaceful mood',
  'exciting': 'exciting mood'
};

/**
 * 이미지 색상 팔레트별 프롬프트 매핑
 * 사용 위치: ImageGenerationService
 */
export const IMAGE_COLOR_PALETTE_PROMPTS: { [key: string]: string } = {
  'vibrant': 'vibrant colors',
  'pastel': 'pastel colors',
  'monochrome': 'monochrome',
  'warm': 'warm colors',
  'cool': 'cool colors'
};

/**
 * 간소화된 이미지 생성 프롬프트 최적화 템플릿
 * 사용 위치: GeminiAIService
 */
export const IMAGE_GENERATION_OPTIMIZATION_PROMPT = `Create a beautiful illustration based on the following description: {description}, {style}, {mood}, {colorPalette}`;

// ============================================================================
// 시스템 인스트럭션
// ============================================================================

/**
 * AI 모델용 시스템 인스트럭션
 * 사용 위치: Firebase Functions
 */
export const SYSTEM_INSTRUCTION = '당신은 어린이를 위한 창의적인 동화 처리 전문가입니다.';

// ============================================================================
// 프롬프트 유틸리티 함수
// ============================================================================

/**
 * 프롬프트 템플릿에서 플레이스홀더를 실제 값으로 치환
 * @param template 프롬프트 템플릿
 * @param variables 치환할 변수들
 * @returns 치환된 프롬프트
 */
export function formatPrompt(template: string, variables: Record<string, string>): string {
  let formattedPrompt = template;
  
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{${key}}`;
    formattedPrompt = formattedPrompt.replace(new RegExp(placeholder, 'g'), value);
  }
  
  return formattedPrompt;
}

// buildStylePrompt와 buildQualityPrompt 함수 제거 - 직접 프롬프트 구성 사용
