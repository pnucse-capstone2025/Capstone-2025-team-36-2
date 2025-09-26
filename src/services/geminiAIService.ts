/**
 * Gemini AI 서비스
 * Google AI SDK를 직접 사용하여 간단하고 효율적인 AI 서비스
 */

import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { GEMINI_CONFIG } from '../constants/apiConstants';
import { GeminiTextModel, GeminiVisionModel, AIServiceInterface, ServiceStatus } from '../types/aiTypes';
import { getGoogleAPIKey, getGeminiTextModel, getGeminiVisionModel, getGeminiImageModel } from '../config/environment';
import { 
  DIVIDE_INTO_IMAGE_GENERATION_PARAGRAPHS_PROMPT,
  IMAGE_GENERATION_BASE_PROMPT,
  IMAGE_STYLE_PROMPTS,
  IMAGE_MOOD_PROMPTS,
  IMAGE_COLOR_PALETTE_PROMPTS,
  IMAGE_GENERATION_OPTIMIZATION_PROMPT,
  SYSTEM_INSTRUCTION,
  formatPrompt
} from '../constants/prompts';

class GeminiAIService implements AIServiceInterface {
  private genAI: GoogleGenerativeAI;
  private textModel: GenerativeModel;
  private visionModel: GenerativeModel;
  private imageModel: GenerativeModel;

  constructor() {
    // API 키는 중앙 관리된 환경 설정에서 가져옴
    const apiKey = getGoogleAPIKey();
    
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY 환경 변수가 설정되지 않았습니다. .env 파일을 확인해주세요.');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);

    // 텍스트 생성 모델 초기화
    this.textModel = this.genAI.getGenerativeModel({
      model: getGeminiTextModel(),
      systemInstruction: SYSTEM_INSTRUCTION
    });

    // 비전 모델 초기화 (이미지 처리용)
    this.visionModel = this.genAI.getGenerativeModel({
      model: getGeminiVisionModel()
    });

    // 이미지 생성 모델 초기화
    this.imageModel = this.genAI.getGenerativeModel({
      model: getGeminiImageModel(),
      systemInstruction: SYSTEM_INSTRUCTION
    });

    console.log('Gemini AI 서비스 초기화됨 (React Native 환경)');
  }

  /**
   * 서비스 상태 확인
   */
  public async checkServiceStatus(): Promise<ServiceStatus> {
    return {
      isInitialized: true,
      canConnect: true,
      message: 'Gemini AI 서비스 정상 작동 중'
    };
  }

  /**
   * 텍스트 생성
   */
  public async generateText(prompt: string): Promise<string> {
    try {
      console.log('Gemini AI 텍스트 생성 요청:', prompt);
      
      const result = await this.textModel.generateContent(prompt);
      const response = result.response.text();
      
      console.log('Gemini AI 응답:', response);
      return response;
      
    } catch (error) {
      console.error('Gemini AI 텍스트 생성 오류:', error);
      throw new Error('텍스트 생성에 실패했습니다.');
    }
  }

  /**
   * 스트리밍 텍스트 생성
   */
  public async *generateTextStream(prompt: string): AsyncGenerator<string> {
    try {
      const result = await this.textModel.generateContentStream(prompt);
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          yield chunkText;
        }
      }
    } catch (error) {
      console.error('스트리밍 텍스트 생성 오류:', error);
      throw new Error('스트리밍 텍스트 생성에 실패했습니다.');
    }
  }

  /**
   * 멀티모달 콘텐츠 생성 (텍스트 + 이미지)
   */
  public async generateMultimodalContent(textPrompt: string, imageUri: string): Promise<string> {
    try {
      const imagePart = {
        fileData: {
          mimeType: 'image/jpeg',
          fileUri: imageUri
        }
      };

      console.log('Gemini AI 멀티모달 생성 요청:', { textPrompt, imageUri });
      
      const result = await this.visionModel.generateContent([textPrompt, imagePart]);
      const response = result.response.text();
      
      console.log('Gemini AI 멀티모달 응답:', response);
      return response;
      
    } catch (error) {
      console.error('Gemini AI 멀티모달 생성 오류:', error);
      throw new Error('멀티모달 콘텐츠 생성에 실패했습니다.');
    }
  }

  /**
   * 이미지 설명 생성
   */
  public async generateImageDescription(prompt: string): Promise<string> {
    try {
      console.log('Gemini AI 이미지 설명 생성 요청:', prompt);
      
      const result = await this.textModel.generateContent(prompt);
      const response = result.response.text();
      
      console.log('Gemini AI 이미지 설명 응답:', response);
      return response;
      
    } catch (error) {
      console.error('Gemini AI 이미지 설명 생성 오류:', error);
      throw new Error('이미지 설명 생성에 실패했습니다.');
    }
  }

  /**
   * 동화를 문단으로 나누기
   */
  public async divideStoryIntoParagraphs(storyText: string): Promise<string[]> {
    try {
      const prompt = formatPrompt(DIVIDE_INTO_IMAGE_GENERATION_PARAGRAPHS_PROMPT, { storyText });

      const response = await this.generateText(prompt);
      
      // AI 응답에서 문단 추출
      const paragraphs = this.parseParagraphsFromResponse(response);
      
      // AI 응답이 유효하지 않은 경우 폴백 로직
      if (paragraphs.length === 0) {
        return this.fallbackParagraphDivision(storyText);
      }
      
      return paragraphs;
    } catch (error) {
      console.error('Gemini AI 문단 나누기 실패:', error);
      // 실패 시 폴백 로직 사용
      return this.fallbackParagraphDivision(storyText);
    }
  }

  /**
   * 이미지 생성에 적합한 문단으로 나누기
   * 각 문단은 시각적으로 표현 가능한 장면을 담고 있어야 함
   */
  public async divideIntoImageGenerationParagraphs(storyText: string): Promise<{
    paragraphs: string[];
    scenePrompts: string[];
    keywords: string[][];
  }> {
    try {
      const prompt = formatPrompt(DIVIDE_INTO_IMAGE_GENERATION_PARAGRAPHS_PROMPT, { storyText });

      const response = await this.generateText(prompt);
      
      // AI 응답에서 문단과 장면 프롬프트 추출
      const result = this.parseImageGenerationResponse(response);
      
      // AI 응답이 유효하지 않은 경우 폴백 로직
      if (result.paragraphs.length === 0) {
        const fallbackParagraphs = this.fallbackParagraphDivision(storyText);
        const fallbackPrompts = fallbackParagraphs.map(paragraph => 
          this.generateFallbackScenePrompt(paragraph)
        );
        const fallbackKeywords = fallbackParagraphs.map(() => ['일기', '기록', '추억', '순간']);
        return {
          paragraphs: fallbackParagraphs,
          scenePrompts: fallbackPrompts,
          keywords: fallbackKeywords
        };
      }
      
      return result;
    } catch (error) {
      console.error('Gemini AI 이미지 생성용 문단 나누기 실패:', error);
      // 실패 시 폴백 로직 사용
      const fallbackParagraphs = this.fallbackParagraphDivision(storyText);
      const fallbackPrompts = fallbackParagraphs.map(paragraph => 
        this.generateFallbackScenePrompt(paragraph)
      );
      const fallbackKeywords = fallbackParagraphs.map(() => ['일기', '기록', '추억', '순간']);
      return {
        paragraphs: fallbackParagraphs,
        scenePrompts: fallbackPrompts,
        keywords: fallbackKeywords
      };
    }
  }

  /**
   * 개별 문단에 대한 장면 프롬프트 생성
   */
  public async generateScenePromptForParagraph(paragraph: string): Promise<string> {
    try {
      const prompt = formatPrompt(DIVIDE_INTO_IMAGE_GENERATION_PARAGRAPHS_PROMPT, { storyText: paragraph });

      const response = await this.generateText(prompt);
      
      // AI 응답에서 장면 프롬프트 추출
      const scenePrompt = this.parseScenePromptFromResponse(response);
      
      return scenePrompt.length > 0 ? scenePrompt : this.generateFallbackScenePrompt(paragraph);
    } catch (error) {
      console.error('Gemini AI 장면 프롬프트 생성 실패:', error);
      return this.generateFallbackScenePrompt(paragraph);
    }
  }


  /**
   * 장면 프롬프트 생성
   * @param text 원본 텍스트
   * @returns 장면 프롬프트
   */
  public async generateScenePrompt(text: string): Promise<string> {
    try {
      const prompt = formatPrompt(DIVIDE_INTO_IMAGE_GENERATION_PARAGRAPHS_PROMPT, { storyText: text });

      const result = await this.textModel.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('장면 프롬프트 생성 오류:', error);
      return `아름다운 동화 장면: ${text}`;
    }
  }

  /**
   * 이미지 생성 (Gemini 2.5 Flash Image Preview)
   * @param prompt 이미지 생성 프롬프트
   * @param options 이미지 생성 옵션
   * @returns 생성된 이미지의 Base64 데이터와 메타데이터
   */
  public async generateImage(prompt: string, options?: {
    style?: string;
    dimensions?: { width: number; height: number };
    quality?: 'low' | 'medium' | 'high';
  }): Promise<{
    imageData: string; // Base64 인코딩된 이미지 데이터
    mimeType: string;
    prompt: string;
    model: string;
  }> {
    try {
      if (!this.imageModel) {
        throw new Error('이미지 생성 모델이 초기화되지 않았습니다.');
      }

      // ImageGenerationService에서 이미 완전한 프롬프트를 받으므로 추가 처리 불필요
      const finalPrompt = prompt;
      
      console.log('🎨 [Gemini 이미지 생성] 시작:', {
        fullPrompt: finalPrompt,
        model: getGeminiImageModel()
      });

      // 이미지 생성 요청
      const result = await this.imageModel.generateContent(finalPrompt);
      const response = await result.response;
      
      // Gemini 2.5 Flash Image Preview는 Base64 인코딩된 이미지 데이터를 반환
      let imageData = '';
      let mimeType = 'image/png'; // 기본값
      
      if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            imageData = part.inlineData.data;
            mimeType = part.inlineData.mimeType || 'image/png';
            break;
          }
        }
      }
      
      if (!imageData) {
        throw new Error('이미지 데이터를 찾을 수 없습니다.');
      }

      console.log('✅ [Gemini 이미지 생성] 성공:', {
        dataSize: imageData.length,
        mimeType: mimeType,
        prompt: finalPrompt.substring(0, 50) + '...'
      });

      return {
        imageData,
        mimeType,
        prompt: finalPrompt,
        model: getGeminiImageModel()
      };
    } catch (error) {
      console.error('❌ [Gemini 이미지 생성] 실패:', error);
      throw new Error(`이미지 생성에 실패했습니다: ${(error as Error).message}`);
    }
  }


  /**
   * 서비스 초기화 확인
   */
  public isInitialized(): boolean {
    return !!(this.textModel && this.visionModel && this.imageModel);
  }

  /**
   * 연결 상태 확인
   */
  public canConnect(): boolean {
    return this.isInitialized();
  }


  /**
   * AI 응답에서 문단 파싱
   */
  private parseParagraphsFromResponse(response: string): string[] {
    try {
      const paragraphs = [];
      const lines = response.split('\n');
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('문단') && trimmedLine.includes(':')) {
          const paragraph = trimmedLine.split(':').slice(1).join(':').trim();
          if (paragraph.length > 0) {
            paragraphs.push(paragraph);
          }
        }
      }
      
      return paragraphs;
    } catch (error) {
      console.error('문단 파싱 오류:', error);
      return [];
    }
  }

  /**
   * 폴백 문단 분할 로직
   */
  private fallbackParagraphDivision(storyText: string): string[] {
    const sentences = storyText.split(/[.!?]\s+/);
    const paragraphs = [];
    let currentParagraph = '';
    
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim();
      if (sentence.length === 0) continue;
      
      currentParagraph += sentence;
      
      // 2-3문장마다 문단으로 분할하거나, 문장이 길면 단독 문단으로 처리
      if ((i + 1) % GEMINI_CONFIG.PARAGRAPH_DIVISION_INTERVAL === 0 || sentence.length > GEMINI_CONFIG.SENTENCE_LENGTH_THRESHOLD) {
        if (currentParagraph.length > 0) {
          paragraphs.push(currentParagraph + '.');
          currentParagraph = '';
        }
      }
    }
    
    // 마지막 문단 처리
    if (currentParagraph.length > 0) {
      paragraphs.push(currentParagraph + '.');
    }
    
    return paragraphs.length > 0 ? paragraphs : [storyText];
  }

  /**
   * AI 응답에서 키워드 파싱
   */
  private parseKeywordsFromResponse(response: string): string[] {
    try {
      // 다양한 응답 형식 처리
      let keywords = [];
      
      // 쉼표로 구분된 키워드 추출
      if (response.includes(',')) {
        keywords = response
          .split(',')
          .map(keyword => keyword.trim())
          .filter(keyword => {
            // 프롬프트 관련 텍스트 필터링
            const lowerKeyword = keyword.toLowerCase();
            return keyword.length > 0 && 
                   keyword.length <= 20 &&
                   !lowerKeyword.includes('키워드') &&
                   !lowerKeyword.includes('예시') &&
                   !lowerKeyword.includes('응답') &&
                   !lowerKeyword.includes('형식');
          });
      }
      // 줄바꿈으로 구분된 키워드 추출
      else if (response.includes('\n')) {
        keywords = response
          .split('\n')
          .map(keyword => keyword.trim())
          .filter(keyword => {
            const lowerKeyword = keyword.toLowerCase();
            return keyword.length > 0 && 
                   keyword.length <= 20 &&
                   !lowerKeyword.includes('키워드') &&
                   !lowerKeyword.includes('예시') &&
                   !lowerKeyword.includes('응답') &&
                   !lowerKeyword.includes('형식');
          });
      }
      // 공백으로 구분된 키워드 추출
      else {
        keywords = response
          .split(/\s+/)
          .map(keyword => keyword.trim())
          .filter(keyword => {
            const lowerKeyword = keyword.toLowerCase();
            return keyword.length > 0 && 
                   keyword.length <= 20 &&
                   !lowerKeyword.includes('키워드') &&
                   !lowerKeyword.includes('예시') &&
                   !lowerKeyword.includes('응답') &&
                   !lowerKeyword.includes('형식');
          });
      }
      
      // 최대 8개로 제한하고 중복 제거
      const uniqueKeywords = [...new Set(keywords)].slice(0, 8);
      
      console.log('AI 응답에서 추출된 키워드:', uniqueKeywords);
      return uniqueKeywords;
      
    } catch (error) {
      console.error('키워드 파싱 오류:', error);
      return [];
    }
  }

  /**
   * 이미지 생성용 응답에서 문단과 장면 프롬프트 파싱
   */
  private parseImageGenerationResponse(response: string): {
    paragraphs: string[];
    scenePrompts: string[];
    keywords: string[][];
  } {
    try {
      const paragraphs: string[] = [];
      const scenePrompts: string[] = [];
      const keywords: string[][] = [];
      
      const lines = response.split('\n');
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        
        // 문단 추출
        if (trimmedLine.startsWith('문단') && trimmedLine.includes(':')) {
          const paragraph = trimmedLine.split(':').slice(1).join(':').trim();
          if (paragraph.length > 0) {
            paragraphs.push(paragraph);
          }
        }
        
        // 장면 프롬프트 추출
        if (trimmedLine.startsWith('장면프롬프트') && trimmedLine.includes(':')) {
          const prompt = trimmedLine.split(':').slice(1).join(':').trim();
          if (prompt.length > 0) {
            scenePrompts.push(prompt);
          }
        }
        
        // 키워드 추출
        if (trimmedLine.startsWith('키워드') && trimmedLine.includes(':')) {
          const keywordText = trimmedLine.split(':').slice(1).join(':').trim();
          if (keywordText.length > 0) {
            // 대괄호 제거하고 쉼표로 분리
            const cleanKeywords = keywordText
              .replace(/[\[\]]/g, '')
              .split(',')
              .map(k => k.trim())
              .filter(k => k.length > 0);
            keywords.push(cleanKeywords);
          }
        }
      }
      
      // 문단, 프롬프트, 키워드 개수가 맞지 않으면 조정
      const minLength = Math.min(paragraphs.length, scenePrompts.length, keywords.length);
      
      console.log('AI 응답에서 추출된 문단, 장면 프롬프트, 키워드:', { 
        paragraphs: paragraphs.length, 
        scenePrompts: scenePrompts.length,
        keywords: keywords.length
      });
      
      return { 
        paragraphs: paragraphs.slice(0, minLength),
        scenePrompts: scenePrompts.slice(0, minLength),
        keywords: keywords.slice(0, minLength)
      };
      
    } catch (error) {
      console.error('이미지 생성용 응답 파싱 오류:', error);
      return { paragraphs: [], scenePrompts: [], keywords: [] };
    }
  }

  /**
   * 장면 프롬프트 응답 파싱
   */
  private parseScenePromptFromResponse(response: string): string {
    try {
      const lines = response.split('\n');
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        
        if (trimmedLine.startsWith('장면프롬프트') && trimmedLine.includes(':')) {
          const prompt = trimmedLine.split(':').slice(1).join(':').trim();
          if (prompt.length > 0) {
            return prompt;
          }
        }
      }
      
      // 장면프롬프트 라벨이 없으면 전체 응답을 사용
      return response.trim();
      
    } catch (error) {
      console.error('장면 프롬프트 파싱 오류:', error);
      return '';
    }
  }

  /**
   * 폴백 장면 프롬프트 생성
   */
  private generateFallbackScenePrompt(paragraph: string): string {
    // 간단한 키워드 추출 및 기본 프롬프트 생성
    const keywords = paragraph
      .split(/\s+/)
      .filter(word => word.length > 2)
      .slice(0, 5)
      .join(', ');
    
    return `A warm and friendly illustration showing ${keywords}, children's book style, soft colors, cozy atmosphere`;
  }
}

// 싱글톤 인스턴스 생성
export const geminiAIService = new GeminiAIService();
export default geminiAIService;
