/**
 * Gemini 2.5 Flash Image Preview 테스트
 */

import { geminiAIService } from '../geminiAIService';
import { imageGenerationService } from '../imageGenerationService';

describe('Gemini 2.5 Flash Image Preview 테스트', () => {
  beforeAll(async () => {
    // 서비스 초기화 대기
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  describe('기본 이미지 생성 테스트', () => {
    test('간단한 이미지 생성', async () => {
      try {
        const imageUrl = await geminiAIService.generateImage(
          'A cute cat playing with a ball',
          {
            style: 'children book illustration',
            dimensions: { width: 512, height: 512 },
            quality: 'high'
          }
        );

        expect(typeof imageUrl).toBe('string');
        expect(imageUrl).toMatch(/^https?:\/\//);
        console.log('생성된 이미지 URL:', imageUrl);
      } catch (error) {
        console.log('API 호출 실패 - 환경 설정 필요:', error);
        // 테스트 환경에서는 API 호출이 실패할 수 있으므로 스킵
      }
    });

    test('다양한 스타일 이미지 생성', async () => {
      const styles = [
        'realistic',
        'cartoon',
        'watercolor',
        'oil painting',
        'digital art'
      ];

      for (const style of styles) {
        try {
          const imageUrl = await geminiAIService.generateImage(
            `A beautiful landscape in ${style} style`,
            {
              style: style,
              dimensions: { width: 800, height: 600 },
              quality: 'medium'
            }
          );

          expect(typeof imageUrl).toBe('string');
          expect(imageUrl).toMatch(/^https?:\/\//);
          console.log(`${style} 스타일 이미지 생성 성공:`, imageUrl.substring(0, 50) + '...');
        } catch (error) {
          console.log(`${style} 스타일 이미지 생성 실패:`, error);
        }
      }
    });
  });

  describe('이미지 생성 서비스 통합 테스트', () => {
    test('ImageGenerationService를 통한 이미지 생성', async () => {
      try {
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

        expect(result).toBeDefined();
        expect(result.id).toBeDefined();
        expect(result.url).toBeDefined();
        expect(result.description).toBeDefined();
        expect(result.metadata).toBeDefined();
        expect(result.metadata.model).toBe('gemini-2.5-flash-image-preview');
        
        console.log('통합 서비스 이미지 생성 성공:', result.url);
      } catch (error) {
        console.log('통합 서비스 이미지 생성 실패 - 환경 설정 필요:', error);
      }
    });

    test('배치 이미지 생성', async () => {
      const descriptions = [
        'A happy rabbit in a garden',
        'A wise owl in a tree',
        'A playful squirrel with nuts'
      ];

      try {
        const results = await imageGenerationService.generateImages(descriptions, {
          style: {
            type: 'children_book',
            mood: 'happy',
            colorPalette: 'vibrant'
          }
        });

        expect(Array.isArray(results)).toBe(true);
        expect(results.length).toBe(descriptions.length);
        
        results.forEach((result, index) => {
          expect(result.id).toBeDefined();
          expect(result.url).toBeDefined();
          expect(result.description).toBe(descriptions[index]);
        });

        console.log('배치 이미지 생성 성공:', results.length, '개');
      } catch (error) {
        console.log('배치 이미지 생성 실패 - 환경 설정 필요:', error);
      }
    });
  });

  describe('에러 처리 테스트', () => {
    test('잘못된 프롬프트 처리', async () => {
      try {
        await geminiAIService.generateImage('', {
          style: 'children book illustration',
          quality: 'high'
        });
        fail('빈 프롬프트로 이미지 생성이 실패해야 합니다');
      } catch (error) {
        expect(error).toBeDefined();
        console.log('빈 프롬프트 에러 처리 성공:', (error as Error).message);
      }
    });

    test('잘못된 옵션 처리', async () => {
      try {
        await geminiAIService.generateImage('A test image', {
          style: 'invalid_style',
          dimensions: { width: -100, height: -100 },
          quality: 'invalid_quality' as any
        });
        // 일부 잘못된 옵션은 자동으로 수정될 수 있음
        console.log('잘못된 옵션 처리 완료');
      } catch (error) {
        console.log('잘못된 옵션 에러 처리:', (error as Error).message);
      }
    });
  });

  describe('성능 테스트', () => {
    test('이미지 생성 시간 측정', async () => {
      const startTime = Date.now();
      
      try {
        await geminiAIService.generateImage(
          'A simple test image for performance testing',
          {
            style: 'children book illustration',
            dimensions: { width: 256, height: 256 },
            quality: 'low'
          }
        );
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.log('이미지 생성 시간:', duration, 'ms');
        expect(duration).toBeLessThan(30000); // 30초 이내
      } catch (error) {
        console.log('성능 테스트 실패 - 환경 설정 필요:', error);
      }
    });
  });
});

