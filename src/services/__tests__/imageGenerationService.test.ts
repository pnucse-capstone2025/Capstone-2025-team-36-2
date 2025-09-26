/**
 * 이미지 생성 서비스 테스트 파일
 */

import { 
  imageGenerationService, 
  ImageStyle, 
  ImageDimensions, 
  ImageQuality,
  GeneratedImage 
} from '../imageGenerationService';

describe('ImageGenerationService', () => {
  describe('이미지 생성 요청 준비 테스트', () => {
    test('기본 이미지 생성 요청', () => {
      const request = imageGenerationService.prepareImageGenerationRequest(
        '토끼가 숲을 산책하고 있습니다.'
      );
      
      expect(request.description).toContain('토끼가 숲을 산책하고 있습니다.');
      expect(request.style).toBeDefined();
      expect(request.dimensions).toBeDefined();
      expect(request.quality).toBeDefined();
    });

    test('커스텀 스타일로 이미지 생성 요청', () => {
      const customStyle: Partial<ImageStyle> = {
        type: 'watercolor',
        mood: 'peaceful',
        colorPalette: 'pastel'
      };
      
      const request = imageGenerationService.prepareImageGenerationRequest(
        '토끼가 숲을 산책하고 있습니다.',
        customStyle
      );
      
      expect(request.style?.type).toBe('watercolor');
      expect(request.style?.mood).toBe('peaceful');
      expect(request.style?.colorPalette).toBe('pastel');
    });
  });

  describe('프롬프트 생성 테스트', () => {
    test('기본 프롬프트 생성', () => {
      const request = imageGenerationService.prepareImageGenerationRequest(
        '토끼가 숲을 산책하고 있습니다.'
      );
      
      const prompt = imageGenerationService.generateImagePrompt(request);
      
      expect(prompt).toContain('토끼가 숲을 산책하고 있습니다.');
      expect(prompt).toContain('children\'s story');
      expect(prompt).toContain('child-friendly');
      expect(prompt).toContain('colorful');
    });

    test('커스텀 스타일 프롬프트 생성', () => {
      const customStyle: Partial<ImageStyle> = {
        type: 'cartoon',
        mood: 'exciting',
        colorPalette: 'vibrant'
      };
      
      const request = imageGenerationService.prepareImageGenerationRequest(
        '토끼가 숲을 산책하고 있습니다.',
        customStyle
      );
      
      const prompt = imageGenerationService.generateImagePrompt(request);
      
      expect(prompt).toContain('cartoon');
      expect(prompt).toContain('exciting');
      expect(prompt).toContain('vibrant');
    });
  });

  describe('이미지 생성 테스트', () => {
    test('단일 이미지 생성', async () => {
      const image = await imageGenerationService.generateImage(
        '토끼가 숲을 산책하고 있습니다.'
      );
      
      expect(image.id).toBeDefined();
      expect(image.url).toBeDefined();
      expect(image.description).toBe('토끼가 숲을 산책하고 있습니다.');
      expect(image.metadata).toBeDefined();
      expect(image.metadata.style).toBeDefined();
      expect(image.metadata.dimensions).toBeDefined();
      expect(image.metadata.quality).toBeDefined();
    });

    test('커스텀 스타일로 이미지 생성', async () => {
      const customStyle: Partial<ImageStyle> = {
        type: 'watercolor',
        mood: 'peaceful'
      };
      
      const image = await imageGenerationService.generateImage(
        '토끼가 숲을 산책하고 있습니다.',
        customStyle
      );
      
      expect(image.metadata.style.type).toBe('watercolor');
      expect(image.metadata.style.mood).toBe('peaceful');
    });

    test('여러 이미지 일괄 생성', async () => {
      const descriptions = [
        '토끼가 숲을 산책하고 있습니다.',
        '사슴이 나타났습니다.',
        '토끼와 사슴이 친구가 되었습니다.'
      ];
      
      const images = await imageGenerationService.generateMultipleImages(descriptions);
      
      expect(images.length).toBe(3);
      images.forEach((image, index) => {
        expect(image.description).toBe(descriptions[index]);
        expect(image.id).toBeDefined();
        expect(image.url).toBeDefined();
      });
    });
  });

  describe('서비스 상태 확인 테스트', () => {
    test('서비스 상태 확인', async () => {
      const status = await imageGenerationService.checkServiceStatus();
      
      expect(typeof status.isInitialized).toBe('boolean');
      expect(typeof status.canConnect).toBe('boolean');
      // supportedFeatures는 checkServiceStatus에서 반환되지 않으므로 제거
      expect(status.supportedFeatures).toBeDefined();
      expect(Array.isArray(status.supportedFeatures)).toBe(true);
    });
  });

  describe('지원되는 스타일 테스트', () => {
    test('지원되는 스타일 목록 반환', () => {
      const styles = imageGenerationService.getSupportedStyles();
      
      expect(Array.isArray(styles)).toBe(true);
      expect(styles.length).toBeGreaterThan(0);
      
      styles.forEach(style => {
        expect(style.type).toBeDefined();
        expect(style.mood).toBeDefined();
        expect(style.colorPalette).toBeDefined();
      });
    });
  });

  describe('설명 향상 테스트', () => {
    test('설명이 아동 친화적으로 향상되는지 확인', () => {
      const originalDescription = '토끼가 숲을 산책하고 있습니다.';
      const request = imageGenerationService.prepareImageGenerationRequest(originalDescription);
      
      // 향상된 설명이 원본을 포함하는지 확인
      expect(request.description).toContain(originalDescription);
      // 아동 친화적 키워드가 추가되었는지 확인
      expect(request.description.toLowerCase()).toMatch(/child|children|kid/);
    });
  });
});

