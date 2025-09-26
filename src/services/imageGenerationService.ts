/**
 * 이미지 생성 서비스
 * 동화 문단에 맞는 그림을 생성하는 서비스
 * 
 * 주의: 현재 Gemini AI 모델은 이미지 생성을 직접 지원하지 않습니다.
 * 이 서비스는 향후 이미지 생성 모델이 추가될 때를 대비한 구조를 제공합니다.
 */

import { geminiAIService } from './geminiAIService';
import { API_DELAYS, IMAGE_CONFIG, TEXT_LIMITS } from '../constants/apiConstants';
import { base64ToImageUri, getImageMetadataRN } from '../utils/reactNativeImageUtils';
import { 
  IMAGE_GENERATION_BASE_PROMPT,
  IMAGE_STYLE_PROMPTS,
  IMAGE_MOOD_PROMPTS,
  IMAGE_COLOR_PALETTE_PROMPTS,
  IMAGE_GENERATION_OPTIMIZATION_PROMPT,
  formatPrompt
} from '../constants/prompts';

export interface ImageGenerationRequest {
  description: string;
  style?: ImageStyle;
  dimensions?: ImageDimensions;
  quality?: ImageQuality;
}

export interface ImageStyle {
  type: 'anime' | 'realistic' | 'fairytale' | 'cartoon' | 'watercolor' | 'oil_painting' | 'digital_art' | 'children_book';
  mood: 'happy' | 'sad' | 'mysterious' | 'adventurous' | 'peaceful' | 'exciting';
  colorPalette: 'vibrant' | 'pastel' | 'monochrome' | 'warm' | 'cool';
}

export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: 'square' | 'landscape' | 'portrait';
}

export interface ImageQuality {
  resolution: 'low' | 'medium' | 'high' | 'ultra';
  detail: 'simple' | 'detailed' | 'highly_detailed';
}

export interface GeneratedImage {
  id: string;
  url: string; // Blob URL 또는 Data URL
  base64Data: string; // 원본 Base64 데이터
  description: string;
  metadata: {
    style: ImageStyle;
    dimensions: ImageDimensions;
    quality: ImageQuality;
    generationTime: number;
    model: string;
    mimeType: string;
    fileSize: number;
  };
}

class ImageGenerationService {
  private readonly defaultStyle: ImageStyle = {
    type: 'children_book',
    mood: 'happy',
    colorPalette: 'vibrant'
  };


  private readonly defaultDimensions: ImageDimensions = {
    width: 512,
    height: 512,
    aspectRatio: 'square'
  };

  private readonly defaultQuality: ImageQuality = {
    resolution: 'high',
    detail: 'detailed'
  };

  /**
   * 동화 문단에 맞는 그림 설명을 기반으로 이미지 생성 요청을 준비
   * @param description 그림 설명
   * @param style 이미지 스타일 (선택사항)
   * @returns 이미지 생성 요청 객체
   */
  public prepareImageGenerationRequest(
    description: string,
    style?: Partial<ImageStyle>
  ): ImageGenerationRequest {
    const request: ImageGenerationRequest = {
      description: this.enhanceDescriptionForImageGeneration(description),
      style: { ...this.defaultStyle, ...style },
      dimensions: this.defaultDimensions,
      quality: this.defaultQuality
    };

    return request;
  }

  /**
   * 이미지 생성을 위한 프롬프트 생성
   * @param request 이미지 생성 요청
   * @returns 최적화된 이미지 생성 프롬프트
   */
  public generateImagePrompt(request: ImageGenerationRequest): string {
    const { description, style } = request;
    
    if (!style) {
      return formatPrompt(IMAGE_GENERATION_BASE_PROMPT, {
        description: description
      });
    }

    const stylePrompt = IMAGE_STYLE_PROMPTS[style.type] || IMAGE_STYLE_PROMPTS['children_book'];
    const moodPrompt = IMAGE_MOOD_PROMPTS[style.mood] || IMAGE_MOOD_PROMPTS['happy'];
    const colorPrompt = IMAGE_COLOR_PALETTE_PROMPTS[style.colorPalette] || IMAGE_COLOR_PALETTE_PROMPTS['vibrant'];
    
    return formatPrompt(IMAGE_GENERATION_OPTIMIZATION_PROMPT, {
      description: description,
      style: stylePrompt,
      mood: moodPrompt,
      colorPalette: colorPrompt
    });
  }

  /**
   * 동화 문단에 맞는 그림 생성 (현재는 프롬프트 생성만 지원)
   * @param description 그림 설명
   * @param style 이미지 스타일 (선택사항)
   * @returns 생성된 이미지 정보 (현재는 플레이스홀더)
   */
  public async generateImage(
    description: string,
    style?: Partial<ImageStyle>
  ): Promise<GeneratedImage> {
    try {
      console.log('🎨 [이미지 생성 서비스] 이미지 생성 시작:', {
        description: description.substring(0, TEXT_LIMITS.MAX_DESCRIPTION_PREVIEW) + '...',
        style,
        timestamp: new Date().toISOString()
      });

      // 실제 AI 이미지 생성 시도
      const request = this.prepareImageGenerationRequest(description, style);
      const prompt = this.generateImagePrompt(request);
      
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('🎨 [이미지 생성 서비스] 요청 준비 완료:', {
        requestId: requestId,
        prompt: prompt.substring(0, TEXT_LIMITS.MAX_PROMPT_PREVIEW) + '...'
      });
      
      // Gemini AI를 통한 실제 이미지 생성 시도
      console.log('🤖 [AI 이미지 생성] Gemini AI를 통한 실제 이미지 생성 시도...');
      
      // Gemini API를 사용한 이미지 생성
      const imageResult = await this.generateImageWithGemini(prompt, request);
      
      if (!imageResult) {
        throw new Error('AI 이미지 생성에 실패했습니다. 실제 AI 모델을 사용할 수 없습니다.');
      }
      
      const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('🎨 [이미지 생성 서비스] AI 이미지 생성 성공:', {
        imageId,
        dataSize: imageResult.imageData.length
      });
      
      const generatedImage: GeneratedImage = {
        id: imageId,
        url: imageResult.url,
        base64Data: imageResult.imageData,
        description: description,
        metadata: {
          style: request.style || this.defaultStyle,
          dimensions: request.dimensions || this.defaultDimensions,
          quality: request.quality || this.defaultQuality,
          generationTime: Date.now(),
          model: 'gemini-2.5-flash-image-preview',
          mimeType: imageResult.mimeType,
          fileSize: imageResult.metadata.size
        }
      };

      console.log('🎨 [이미지 생성 서비스] 이미지 생성 완료:', {
        imageId,
        description: description.substring(0, TEXT_LIMITS.MAX_DESCRIPTION_PREVIEW) + '...',
        fullPrompt: prompt
      });

      return generatedImage;
    } catch (error) {
      console.error('❌ [이미지 생성 서비스] 이미지 생성 중 오류 발생:', {
        error: (error as Error).message,
        stack: (error as Error).stack,
        description: description?.substring(0, 100) + '...',
        timestamp: new Date().toISOString()
      });
      throw new Error('이미지 생성에 실패했습니다.');
    }
  }

  /**
   * 여러 이미지를 일괄 생성
   * @param descriptions 그림 설명 배열
   * @param style 공통 이미지 스타일 (선택사항)
   * @returns 생성된 이미지 배열
   */
  public async generateMultipleImages(
    descriptions: string[],
    style?: Partial<ImageStyle>
  ): Promise<GeneratedImage[]> {
    const generatedImages: GeneratedImage[] = [];
    
    try {
      for (let i = 0; i < descriptions.length; i++) {
        const description = descriptions[i];
        
        try {
          const image = await this.generateImage(description, style);
          generatedImages.push(image);
          
          // API 호출 간격 조절
          if (i < descriptions.length - 1) {
            await this.delay(API_DELAYS.IMAGE_GENERATION);
          }
        } catch (error) {
          console.error(`이미지 ${i + 1} 생성 실패:`, error);
          // 실패한 경우 플레이스홀더 이미지 추가
          generatedImages.push({
            id: `placeholder_${i + 1}`,
            url: this.generatePlaceholderImageUrl(description),
            base64Data: '', // 플레이스홀더는 Base64 데이터 없음
            description: description,
            metadata: {
              style: style ? { ...this.defaultStyle, ...style } : this.defaultStyle,
              dimensions: this.defaultDimensions,
              quality: this.defaultQuality,
              generationTime: Date.now(),
              model: 'placeholder',
              mimeType: 'image/png',
              fileSize: 0
            }
          });
        }
      }
      
      return generatedImages;
    } catch (error) {
      console.error('일괄 이미지 생성 중 오류 발생:', error);
      throw error;
    }
  }

  /**
   * 이미지 설명을 이미지 생성을 위해 향상
   * @param description 원본 설명
   * @returns 향상된 설명
   */
  private enhanceDescriptionForImageGeneration(description: string): string {
    // 아동 친화적 키워드 추가
    let enhancedDescription = description;
    
    // 이미 아동 친화적 표현이 없는 경우 추가
    if (!enhancedDescription.toLowerCase().includes('child') && 
        !enhancedDescription.toLowerCase().includes('children') &&
        !enhancedDescription.toLowerCase().includes('kid')) {
      enhancedDescription = `A child-friendly illustration of ${enhancedDescription.toLowerCase()}`;
    }
    
    // 색상과 분위기 강화
    if (!enhancedDescription.toLowerCase().includes('colorful') &&
        !enhancedDescription.toLowerCase().includes('bright')) {
      enhancedDescription += ', with bright and colorful details';
    }
    
    return enhancedDescription;
  }



  /**
   * Gemini AI를 사용한 실제 이미지 생성
   * @param prompt 이미지 생성 프롬프트
   * @param request 이미지 생성 요청 정보
   * @returns 생성된 이미지 데이터 또는 null
   */
  private async generateImageWithGemini(prompt: string, request: ImageGenerationRequest): Promise<{
    imageData: string;
    mimeType: string;
    url: string;
    metadata: {size: number; type: string; dimensions: {width: number; height: number}};
  } | null> {
    try {
      console.log('🤖 [Gemini 이미지 생성] 시작:', {
        prompt: prompt.substring(0, TEXT_LIMITS.MAX_PROMPT_PREVIEW) + '...',
        style: request.style,
        dimensions: request.dimensions
      });

      // Gemini AI 서비스가 이미지 생성을 지원하는지 확인
      if (!geminiAIService.isInitialized()) {
        throw new Error('Gemini AI 서비스가 초기화되지 않았습니다.');
      }

      // generateImagePrompt에서 이미 스타일이 포함된 프롬프트를 생성하므로 추가 처리 불필요
      const finalPrompt = prompt;

      // AI에게 전송할 전체 프롬프트 로깅
      console.log('🤖 [Gemini 이미지 생성] AI 요청 프롬프트 전문:', {
        originalPrompt: prompt,
        finalPrompt: finalPrompt
      });

      // Gemini 2.5 Flash Image Preview를 사용한 실제 이미지 생성
      const imageResult = await geminiAIService.generateImage(finalPrompt, {
        dimensions: request.dimensions ? {
          width: request.dimensions.width,
          height: request.dimensions.height
        } : undefined,
        quality: request.quality?.resolution === 'high' ? 'high' : 
                 request.quality?.resolution === 'low' ? 'low' : 'medium'
      });
      
      // Base64 데이터를 React Native Image URI로 변환
      const imageUrl = base64ToImageUri(imageResult.imageData, imageResult.mimeType);
      
      // 이미지 메타데이터 추출 (React Native 호환)
      const metadata = await getImageMetadataRN(imageResult.imageData);
      
      console.log('✅ [Gemini 이미지 생성] 성공:', {
        dataSize: imageResult.imageData.length,
        mimeType: imageResult.mimeType,
        dimensions: metadata.dimensions,
        finalPrompt: finalPrompt
      });

      return {
        imageData: imageResult.imageData,
        mimeType: imageResult.mimeType,
        url: imageUrl,
        metadata: metadata
      };
      
    } catch (error) {
      console.error('❌ [Gemini 이미지 생성] 오류 발생:', {
        error: (error as Error).message,
        stack: (error as Error).stack
      });
      return null;
    }
  }



  /**
   * 플레이스홀더 이미지 URL 생성
   * @param description 이미지 설명
   * @returns 플레이스홀더 이미지 URL
   */
  private generatePlaceholderImageUrl(description: string): string {
    // 간단한 플레이스홀더 이미지 URL 생성 (실제로는 더 정교한 플레이스홀더 서비스 사용)
    const encodedDescription = encodeURIComponent(description.substring(0, 50));
    return `https://via.placeholder.com/512x512/cccccc/666666?text=${encodedDescription}`;
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
    supportedFeatures: string[];
  }> {
    try {
      const isInitialized = geminiAIService.isInitialized();
      const canConnect = geminiAIService.canConnect();
      
      return {
        isInitialized,
        canConnect,
        supportedFeatures: [
          'prompt_generation',
          'style_configuration',
          'gemini_ai_integration'
        ]
      };
    } catch (error) {
      return {
        isInitialized: geminiAIService.isInitialized(),
        canConnect: false,
        supportedFeatures: []
      };
    }
  }

  /**
   * 지원되는 이미지 스타일 목록 반환
   */
  public getSupportedStyles(): ImageStyle[] {
    return [
      { type: 'children_book', mood: 'happy', colorPalette: 'vibrant' },
      { type: 'cartoon', mood: 'happy', colorPalette: 'vibrant' },
      { type: 'watercolor', mood: 'peaceful', colorPalette: 'pastel' },
      { type: 'digital_art', mood: 'exciting', colorPalette: 'vibrant' },
      { type: 'realistic', mood: 'peaceful', colorPalette: 'warm' }
    ];
  }

  // buildStylePrompt 메서드 제거 - 직접 프롬프트 구성 사용
}

// 싱글톤 인스턴스 생성
export const imageGenerationService = new ImageGenerationService();
export default imageGenerationService;

