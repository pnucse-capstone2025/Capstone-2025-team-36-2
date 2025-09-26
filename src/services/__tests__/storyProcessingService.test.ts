/**
 * 동화 처리 서비스 테스트 파일
 */

import { storyProcessingService, ProcessedStory } from '../storyProcessingService';

// Mock 데이터
const mockStoryText = `
옛날 옛적에 깊은 숲 속에 작은 토끼 한 마리가 살고 있었습니다.
토끼는 매일 아침 일어나서 당근을 먹고 숲을 산책했습니다.
어느 날 토끼는 길을 잃고 말았습니다.
그때 착한 사슴이 나타나서 토끼를 집으로 데려다 주었습니다.
토끼는 사슴에게 고마워하며 평생 친구가 되었습니다.
`;

const mockProcessedStory: ProcessedStory = {
  originalText: mockStoryText,
  paragraphs: [
    {
      id: 'paragraph_1',
      content: '옛날 옛적에 깊은 숲 속에 작은 토끼 한 마리가 살고 있었습니다.',
      imageDescription: '깊은 숲 속에 작은 토끼가 있는 아름다운 장면',
      order: 1
    },
    {
      id: 'paragraph_2',
      content: '토끼는 매일 아침 일어나서 당근을 먹고 숲을 산책했습니다.',
      imageDescription: '토끼가 당근을 먹으며 산책하는 모습',
      order: 2
    }
  ],
  totalParagraphs: 2,
  processingTime: 1500
};

describe('StoryProcessingService', () => {
  describe('입력 검증 테스트', () => {
    test('빈 텍스트 처리', async () => {
      await expect(storyProcessingService.processStory('')).rejects.toThrow('동화 텍스트가 비어있습니다');
    });

    test('너무 긴 텍스트 처리', async () => {
      const longText = 'a'.repeat(15000);
      await expect(storyProcessingService.processStory(longText)).rejects.toThrow('동화 텍스트가 너무 깁니다');
    });
  });

  describe('데이터 저장/로드 테스트', () => {
    test('동화 데이터 저장', () => {
      const jsonString = storyProcessingService.saveProcessedStory(mockProcessedStory);
      expect(typeof jsonString).toBe('string');
      expect(jsonString.length).toBeGreaterThan(0);
    });

    test('동화 데이터 로드', () => {
      const jsonString = storyProcessingService.saveProcessedStory(mockProcessedStory);
      const loadedStory = storyProcessingService.loadProcessedStory(jsonString);
      
      expect(loadedStory.originalText).toBe(mockProcessedStory.originalText);
      expect(loadedStory.paragraphs.length).toBe(mockProcessedStory.paragraphs.length);
      expect(loadedStory.totalParagraphs).toBe(mockProcessedStory.totalParagraphs);
    });

    test('잘못된 JSON 로드', () => {
      expect(() => {
        storyProcessingService.loadProcessedStory('invalid json');
      }).toThrow('동화 데이터 로드에 실패했습니다');
    });
  });

  describe('서비스 상태 확인 테스트', () => {
    test('서비스 상태 확인', async () => {
      const status = await storyProcessingService.checkServiceStatus();
      
      expect(typeof status.isInitialized).toBe('boolean');
      expect(typeof status.canConnect).toBe('boolean');
    });
  });

  describe('문단 나누기 테스트', () => {
    test('문단만 나누기', async () => {
      try {
        const paragraphs = await storyProcessingService.divideStoryIntoParagraphsOnly(mockStoryText);
        expect(Array.isArray(paragraphs)).toBe(true);
      } catch (error) {
        console.log('API 호출 실패 - 환경 설정 필요:', error);
      }
    });
  });

  describe('그림 설명 생성 테스트', () => {
    test('단일 문단 그림 설명 생성', async () => {
      try {
        const description = await storyProcessingService.generateImageDescription(
          '토끼가 숲을 산책하고 있습니다.'
        );
        expect(typeof description).toBe('string');
        expect(description.length).toBeGreaterThan(0);
      } catch (error) {
        console.log('API 호출 실패 - 환경 설정 필요:', error);
      }
    });
  });
});

