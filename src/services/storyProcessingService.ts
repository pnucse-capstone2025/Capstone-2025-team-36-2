/**
 * 동화 처리 서비스
 * 동화 텍스트를 문단으로 나누고 각 문단에 맞는 그림 설명을 생성하는 서비스
 */

import { geminiAIService } from './geminiAIService';
import { GEMINI_CONFIG, API_DELAYS } from '../constants/apiConstants';

export interface StoryParagraph {
  id: string;
  content: string;
  imageDescription: string;
  order: number;
}

export interface ImageGenerationParagraph {
  id: string;
  content: string;
  scenePrompt: string;
  keywords: string[];
  generatedImageUrl?: string;
  isGenerating?: boolean;
}

export interface ProcessedStory {
  originalText: string;
  paragraphs: StoryParagraph[];
  totalParagraphs: number;
  processingTime: number;
}

class StoryProcessingService {
  /**
   * 동화 텍스트를 처리하여 문단으로 나누고 각 문단에 맞는 그림 설명 생성
   * @param storyText 원본 동화 텍스트
   * @returns 처리된 동화 데이터
   */
  public async processStory(storyText: string): Promise<ProcessedStory> {
    const startTime = Date.now();
    
    try {
      this.validateStoryInput(storyText);
      this.validateAIService();
      
      const paragraphs = await this.divideStoryIntoParagraphs(storyText);
      const storyParagraphs = await this.generateImageDescriptionsForParagraphs(paragraphs);
      
      const processingTime = Date.now() - startTime;

      const result: ProcessedStory = {
        originalText: storyText,
        paragraphs: storyParagraphs,
        totalParagraphs: storyParagraphs.length,
        processingTime: processingTime
      };

      console.log(`동화 처리 완료: ${result.totalParagraphs}개 문단, ${processingTime}ms 소요`);
      return result;

    } catch (error) {
      console.error('동화 처리 중 오류 발생:', error);
      throw error;
    }
  }

  /**
   * 동화 입력 검증
   * @param storyText 동화 텍스트
   */
  private validateStoryInput(storyText: string): void {
    if (!storyText || storyText.trim().length === 0) {
      throw new Error('동화 텍스트가 비어있습니다.');
    }

    if (storyText.length > GEMINI_CONFIG.MAX_STORY_LENGTH) {
      throw new Error(`동화 텍스트가 너무 깁니다. (최대 ${GEMINI_CONFIG.MAX_STORY_LENGTH}자)`);
    }
  }

  /**
   * AI 서비스 상태 검증
   */
  private validateAIService(): void {
    if (!geminiAIService.isInitialized()) {
      throw new Error('AI 서비스가 초기화되지 않았습니다.');
    }
  }

  /**
   * 동화를 문단으로 나누기
   * @param storyText 동화 텍스트
   * @returns 문단 배열
   */
  private async divideStoryIntoParagraphs(storyText: string): Promise<string[]> {
    console.log('동화 문단 나누기 시작...');
    const paragraphs = await geminiAIService.divideStoryIntoParagraphs(storyText);
    
    if (paragraphs.length === 0) {
      throw new Error('문단 나누기에 실패했습니다.');
    }
    
    return paragraphs;
  }

  /**
   * 각 문단에 맞는 그림 설명 생성
   * @param paragraphs 문단 배열
   * @returns 그림 설명이 포함된 문단 배열
   */
  private async generateImageDescriptionsForParagraphs(paragraphs: string[]): Promise<StoryParagraph[]> {
    console.log('그림 설명 생성 시작...');
    const storyParagraphs: StoryParagraph[] = [];
    
    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i];
      
      try {
        const imageDescription = await this.generateImageDescriptionForParagraph(paragraph, i);
        
        storyParagraphs.push({
          id: `paragraph_${i + 1}`,
          content: paragraph,
          imageDescription: imageDescription,
          order: i + 1
        });
        
        // API 호출 간격 조절 (Rate limiting 방지)
        if (i < paragraphs.length - 1) {
          await this.delay(API_DELAYS.STORY_PROCESSING);
        }
      } catch (error) {
        console.error(`문단 ${i + 1}의 그림 설명 생성 실패:`, error);
        storyParagraphs.push(this.createFallbackParagraph(paragraph, i));
      }
    }
    
    return storyParagraphs;
  }

  /**
   * 개별 문단의 그림 설명 생성
   * @param paragraph 문단 텍스트
   * @param index 문단 인덱스
   * @returns 그림 설명
   */
  private async generateImageDescriptionForParagraph(paragraph: string, index: number): Promise<string> {
    return await geminiAIService.generateImageDescription(paragraph);
  }

  /**
   * 단일 문단에 대한 그림 설명 생성 (public 메서드)
   * @param paragraph 문단 텍스트
   * @returns 그림 설명
   */
  public async generateImageDescription(paragraph: string): Promise<string> {
    try {
      if (!paragraph || paragraph.trim().length === 0) {
        throw new Error('문단 텍스트가 비어있습니다.');
      }

      if (!geminiAIService.isInitialized()) {
        throw new Error('AI 서비스가 초기화되지 않았습니다.');
      }

      return await geminiAIService.generateImageDescription(paragraph);
    } catch (error) {
      console.error('그림 설명 생성 중 오류 발생:', error);
      throw error;
    }
  }

  /**
   * 실패 시 사용할 기본 문단 생성
   * @param paragraph 문단 텍스트
   * @param index 문단 인덱스
   * @returns 기본 문단 객체
   */
  private createFallbackParagraph(paragraph: string, index: number): StoryParagraph {
    return {
      id: `paragraph_${index + 1}`,
      content: paragraph,
      imageDescription: `이 문단을 표현하는 아름다운 그림`,
      order: index + 1
    };
  }



  /**
   * 동화 텍스트를 문단으로만 나누기 (그림 설명 생성 없이)
   * @param storyText 원본 동화 텍스트
   * @returns 문단 배열
   */
  public async divideStoryIntoParagraphsOnly(storyText: string): Promise<string[]> {
    try {
      if (!storyText || storyText.trim().length === 0) {
        throw new Error('동화 텍스트가 비어있습니다.');
      }

      if (!geminiAIService.isInitialized()) {
        throw new Error('AI 서비스가 초기화되지 않았습니다.');
      }

      return await geminiAIService.divideStoryIntoParagraphs(storyText);
    } catch (error) {
      console.error('문단 나누기 중 오류 발생:', error);
      throw error;
    }
  }

  /**
   * 단일 이미지 생성을 위한 가장 중요한 문단 추출
   * @param storyText 원본 동화 텍스트
   * @returns 가장 중요한 문단의 장면 프롬프트와 키워드
   */
  public async extractMostImportantSceneForSingleImage(storyText: string): Promise<{
    scenePrompt: string;
    keywords: string[];
    selectedParagraph: string;
  }> {
    try {
      if (!storyText || storyText.trim().length === 0) {
        throw new Error('텍스트가 비어있습니다.');
      }

      if (!geminiAIService.isInitialized()) {
        throw new Error('AI 서비스가 초기화되지 않았습니다.');
      }

      console.log('🎯 [단일 이미지] 가장 중요한 장면 추출 시작:', {
        textLength: storyText.length,
        textPreview: storyText.substring(0, 100) + '...'
      });

      // 1. 문단으로 나누기
      const result = await geminiAIService.divideIntoImageGenerationParagraphs(storyText);
      const paragraphs = result.paragraphs;
      
      if (paragraphs.length === 0) {
        throw new Error('문단을 찾을 수 없습니다.');
      }

      console.log('📖 [단일 이미지] 문단 분할 완료:', {
        paragraphCount: paragraphs.length
      });

      // 2. 가장 중요한 문단 선택을 위한 프롬프트 생성
      const importancePrompt = `
다음 동화의 문단들 중에서 이미지로 표현하기에 가장 중요하고 핵심적인 장면을 선택해주세요.

동화 내용:
${storyText}

문단들:
${paragraphs.map((p, i) => `${i + 1}. ${p}`).join('\n')}

가장 중요한 문단의 번호(1부터 시작)와 그 이유를 간단히 설명해주세요.
형식: 번호: 이유
`;

      console.log('🎯 [단일 이미지] 중요도 분석 시작');

      // 3. AI를 사용하여 가장 중요한 문단 선택
      const importanceResponse = await geminiAIService.generateText(importancePrompt);
      
      // 응답에서 번호 추출
      const match = importanceResponse.match(/(\d+):/);
      let selectedIndex = match ? parseInt(match[1]) - 1 : 0; // 0부터 시작하는 인덱스로 변환
      
      if (selectedIndex < 0 || selectedIndex >= paragraphs.length) {
        console.warn('⚠️ [단일 이미지] 잘못된 문단 번호, 첫 번째 문단 사용:', selectedIndex);
        selectedIndex = 0;
      }

      const selectedParagraph = paragraphs[selectedIndex];
      
      console.log('🎯 [단일 이미지] 선택된 문단:', {
        index: selectedIndex + 1,
        content: selectedParagraph.substring(0, 100) + '...',
        reason: importanceResponse
      });

      // 4. 선택된 문단에 대해 장면 프롬프트 생성
      console.log('🎨 [단일 이미지] 장면 프롬프트 생성 시작');

      const scenePrompt = await geminiAIService.generateScenePrompt(selectedParagraph);
      // 키워드는 문단 나누기에서 이미 추출되었으므로 기본 키워드 사용
      const keywords = ['일기', '기록', '추억', '순간'];

      console.log('✅ [단일 이미지] 장면 프롬프트 생성 완료:', {
        scenePrompt: scenePrompt.substring(0, 100) + '...',
        keywords: keywords
      });

      return {
        scenePrompt,
        keywords,
        selectedParagraph: selectedParagraph
      };

    } catch (error) {
      console.error('❌ [단일 이미지] 장면 추출 실패:', error);
      
      // 실패한 경우 첫 번째 문단 사용
      const paragraphs = storyText.split('\n').filter(p => p.trim());
      const fallbackParagraph = paragraphs[0] || storyText;
      
      return {
        scenePrompt: `아름다운 동화 장면: ${fallbackParagraph}`,
        keywords: ['동화', '아름다운', '장면'],
        selectedParagraph: fallbackParagraph
      };
    }
  }

  /**
   * 이미지 생성에 적합한 문단으로 나누기
   * @param storyText 원본 텍스트
   * @returns 이미지 생성용 문단 배열
   */
  public async divideIntoImageGenerationParagraphs(storyText: string): Promise<ImageGenerationParagraph[]> {
    try {
      if (!storyText || storyText.trim().length === 0) {
        throw new Error('텍스트가 비어있습니다.');
      }

      if (!geminiAIService.isInitialized()) {
        throw new Error('AI 서비스가 초기화되지 않았습니다.');
      }

      // 1단계: 이미지 생성에 적합한 문단으로 나누기 (장면 프롬프트와 키워드 포함)
      const result = await geminiAIService.divideIntoImageGenerationParagraphs(storyText);
      
      // 2단계: 결과를 ImageGenerationParagraph 형태로 변환
      const imageGenerationParagraphs: ImageGenerationParagraph[] = [];
      
      for (let i = 0; i < result.paragraphs.length; i++) {
        const paragraph = result.paragraphs[i];
        const scenePrompt = result.scenePrompts[i] || '';
        const keywords = result.keywords[i] || ['일기', '기록', '추억', '순간'];
        
        imageGenerationParagraphs.push({
          id: `image_paragraph_${i + 1}`,
          content: paragraph,
          scenePrompt: scenePrompt,
          keywords: keywords,
          isGenerating: false,
        });
      }

      console.log(`이미지 생성용 문단 처리 완료: ${imageGenerationParagraphs.length}개 문단`);
      return imageGenerationParagraphs;
      
    } catch (error) {
      console.error('이미지 생성용 문단 나누기 중 오류 발생:', error);
      throw error;
    }
  }

  /**
   * 개별 문단에 대한 장면 프롬프트 생성
   * @param paragraph 문단 텍스트
   * @returns 장면 프롬프트
   */
  public async generateScenePromptForParagraph(paragraph: string): Promise<string> {
    try {
      if (!paragraph || paragraph.trim().length === 0) {
        throw new Error('문단 텍스트가 비어있습니다.');
      }

      if (!geminiAIService.isInitialized()) {
        throw new Error('AI 서비스가 초기화되지 않았습니다.');
      }

      return await geminiAIService.generateScenePromptForParagraph(paragraph);
    } catch (error) {
      console.error('장면 프롬프트 생성 중 오류 발생:', error);
      throw error;
    }
  }

  /**
   * 처리된 동화 데이터를 JSON 형태로 저장
   * @param processedStory 처리된 동화 데이터
   * @returns JSON 문자열
   */
  public saveProcessedStory(processedStory: ProcessedStory): string {
    try {
      return JSON.stringify(processedStory, null, 2);
    } catch (error) {
      console.error('동화 데이터 저장 중 오류 발생:', error);
      throw new Error('동화 데이터 저장에 실패했습니다.');
    }
  }

  /**
   * JSON 문자열에서 처리된 동화 데이터 로드
   * @param jsonString JSON 문자열
   * @returns 처리된 동화 데이터
   */
  public loadProcessedStory(jsonString: string): ProcessedStory {
    try {
      const data = JSON.parse(jsonString);
      
      // 데이터 검증
      if (!data.originalText || !data.paragraphs || !Array.isArray(data.paragraphs)) {
        throw new Error('잘못된 동화 데이터 형식입니다.');
      }

      return data as ProcessedStory;
    } catch (error) {
      console.error('동화 데이터 로드 중 오류 발생:', error);
      throw new Error('동화 데이터 로드에 실패했습니다.');
    }
  }

  /**
   * 지연 함수 (Rate limiting용)
   * @param ms 밀리초
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 서비스 상태 확인
   */
  public async checkServiceStatus(): Promise<{
    isInitialized: boolean;
    canConnect: boolean;
    message?: string;
    lastError?: string;
  }> {
    try {
      const isInitialized = geminiAIService.isInitialized();
      
      if (!isInitialized) {
        return {
          isInitialized: false,
          canConnect: false,
          message: 'AI 서비스가 초기화되지 않았습니다.',
          lastError: 'Service not initialized'
        };
      }

      const canConnect = await geminiAIService.testConnection();
      
      if (!canConnect) {
        return {
          isInitialized: true,
          canConnect: false,
          message: 'AI 서비스에 연결할 수 없습니다. 환경 설정을 확인해주세요.',
          lastError: 'Connection test failed'
        };
      }

      return {
        isInitialized: true,
        canConnect: true,
        message: 'AI 서비스가 정상적으로 연결되었습니다.'
      };
    } catch (error) {
      console.error('서비스 상태 확인 중 오류:', error);
      return {
        isInitialized: false,
        canConnect: false,
        message: 'AI 서비스 상태 확인 중 오류가 발생했습니다.',
        lastError: error instanceof Error ? error.message : '알 수 없는 오류'
      };
    }
  }
}

// 싱글톤 인스턴스 생성
export const storyProcessingService = new StoryProcessingService();
export default storyProcessingService;

