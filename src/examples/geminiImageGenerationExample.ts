/**
 * Gemini 2.5 Flash Image Preview 사용 예제
 * 공식 API 문서: https://ai.google.dev/gemini-api/docs/image-generation#rest
 */

import { geminiAIService } from '../services/geminiAIService';
import { imageGenerationService } from '../services/imageGenerationService';
import { base64ToImageUri, getImageMetadataRN } from '../utils/reactNativeImageUtils';

/**
 * 기본 이미지 생성 예제
 */
export async function basicImageGenerationExample() {
  try {
    console.log('🎨 [기본 이미지 생성 예제] 시작');
    
    // 1. Gemini AI 서비스 직접 사용 (Base64 데이터 반환)
    const imageResult = await geminiAIService.generateImage(
      'A cute rabbit playing in a colorful garden with flowers and butterflies',
      {
        style: 'children book illustration',
        dimensions: { width: 512, height: 512 },
        quality: 'high'
      }
    );
    
    // Base64 데이터를 React Native에서 사용할 수 있는 URI로 변환
    const imageUri = base64ToImageUri(imageResult.imageData, imageResult.mimeType);
    
    // 이미지 메타데이터 확인
    const metadata = await getImageMetadataRN(imageResult.imageData);
    
    console.log('✅ [Gemini 직접 사용] 이미지 생성 성공:', {
      uri: imageUri.substring(0, 50) + '...',
      dataSize: imageResult.imageData.length,
      mimeType: imageResult.mimeType,
      dimensions: metadata.dimensions,
      fileSize: metadata.size
    });
    
    return {
      imageResult,
      imageUri,
      metadata
    };
    
  } catch (error) {
    console.error('❌ [기본 이미지 생성] 실패:', error);
    throw error;
  }
}

/**
 * 동화책 스타일 이미지 생성 예제
 */
export async function storybookImageGenerationExample() {
  try {
    console.log('📚 [동화책 이미지 생성 예제] 시작');
    
    const storyText = '토끼가 숲속에서 친구들과 함께 놀고 있습니다.';
    
    // 1. 이미지 설명 생성
    const imageDescription = await geminiAIService.generateImageDescription(storyText);
    console.log('📝 [이미지 설명] 생성됨:', imageDescription);
    
    // 2. 이미지 생성
    const imageUrl = await imageGenerationService.generateImage(imageDescription, {
      style: {
        type: 'children_book',
        mood: 'happy',
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
    });
    
    console.log('✅ [동화책 이미지] 생성 성공:', imageUrl);
    return imageUrl;
    
  } catch (error) {
    console.error('❌ [동화책 이미지 생성] 실패:', error);
    throw error;
  }
}

/**
 * 배치 이미지 생성 예제
 */
export async function batchImageGenerationExample() {
  try {
    console.log('🔄 [배치 이미지 생성 예제] 시작');
    
    const storyParagraphs = [
      '옛날 옛적에 작은 마을에 살고 있던 토끼가 있었습니다.',
      '토끼는 매일 아침 숲으로 나가서 친구들을 만났습니다.',
      '어느 날, 토끼는 마법의 나무를 발견했습니다.',
      '마법의 나무는 토끼에게 소원을 들어주었습니다.',
      '토끼는 모든 친구들이 행복해지기를 소원했습니다.'
    ];
    
    const generatedImages = [];
    
    for (let i = 0; i < storyParagraphs.length; i++) {
      const paragraph = storyParagraphs[i];
      console.log(`📖 [문단 ${i + 1}] 처리 중:`, paragraph.substring(0, 30) + '...');
      
      try {
        // 이미지 설명 생성
        const imageDescription = await geminiAIService.generateImageDescription(paragraph);
        
        // 이미지 생성
        const imageUrl = await geminiAIService.generateImage(imageDescription, {
          style: 'children book illustration',
          dimensions: { width: 800, height: 600 },
          quality: 'high'
        });
        
        generatedImages.push({
          paragraphIndex: i + 1,
          paragraph: paragraph,
          imageDescription: imageDescription,
          imageUrl: imageUrl
        });
        
        console.log(`✅ [문단 ${i + 1}] 이미지 생성 완료`);
        
        // API 호출 간격 조절
        if (i < storyParagraphs.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
      } catch (error) {
        console.error(`❌ [문단 ${i + 1}] 이미지 생성 실패:`, error);
        generatedImages.push({
          paragraphIndex: i + 1,
          paragraph: paragraph,
          imageDescription: '이미지 생성 실패',
          imageUrl: null,
          error: (error as Error).message
        });
      }
    }
    
    console.log('✅ [배치 이미지 생성] 완료:', generatedImages.length, '개 문단 처리');
    return generatedImages;
    
  } catch (error) {
    console.error('❌ [배치 이미지 생성] 실패:', error);
    throw error;
  }
}

/**
 * 서비스 상태 확인 예제
 */
export async function serviceStatusExample() {
  try {
    console.log('🔍 [서비스 상태 확인 예제] 시작');
    
    // Gemini AI 서비스 상태 확인
    const geminiStatus = await geminiAIService.checkServiceStatus();
    console.log('🤖 [Gemini AI 상태]:', geminiStatus);
    
    // 이미지 생성 서비스 상태 확인
    const imageStatus = await imageGenerationService.checkServiceStatus();
    console.log('🎨 [이미지 생성 서비스 상태]:', imageStatus);
    
    return {
      gemini: geminiStatus,
      imageGeneration: imageStatus
    };
    
  } catch (error) {
    console.error('❌ [서비스 상태 확인] 실패:', error);
    throw error;
  }
}

/**
 * 모든 예제 실행
 */
export async function runAllExamples() {
  try {
    console.log('🚀 [모든 예제 실행] 시작');
    
    // 1. 서비스 상태 확인
    await serviceStatusExample();
    
    // 2. 기본 이미지 생성
    await basicImageGenerationExample();
    
    // 3. 동화책 이미지 생성
    await storybookImageGenerationExample();
    
    // 4. 배치 이미지 생성
    await batchImageGenerationExample();
    
    console.log('✅ [모든 예제 실행] 완료');
    
  } catch (error) {
    console.error('❌ [모든 예제 실행] 실패:', error);
    throw error;
  }
}
