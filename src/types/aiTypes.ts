/**
 * AI 서비스 관련 타입 정의
 */

import { GenerativeModel } from '@google/generative-ai';

// Gemini AI 모델 타입
export interface GeminiTextModel {
  generateContent: (prompt: string) => Promise<{ response: { text: () => string } }>;
  generateContentStream: (prompt: string) => AsyncGenerator<{ response: { text: () => string } }>;
}

export interface GeminiVisionModel {
  generateContent: (prompt: string) => Promise<{ response: { text: () => string } }>;
}

// AI 서비스 인터페이스
export interface AIServiceInterface {
  isInitialized(): boolean;
  checkServiceStatus(): Promise<{ isInitialized: boolean; canConnect: boolean; message: string }>;
  generateText(prompt: string): Promise<string>;
  generateTextStream(prompt: string): AsyncGenerator<string>;
  divideStoryIntoParagraphs(storyText: string): Promise<string[]>;
  generateImageDescription(paragraph: string): Promise<string>;
  generateScenePrompt(paragraph: string): Promise<string>;
  generateImage(prompt: string, options?: {
    style?: string;
    dimensions?: { width: number; height: number };
    quality?: 'low' | 'medium' | 'high';
  }): Promise<{
    imageData: string;
    mimeType: string;
    prompt: string;
    model: string;
  }>;
}

// 이미지 생성 관련 타입
export interface ImageGenerationResult {
  id: string;
  url: string;
  description: string;
  style?: string;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface ImageStyle {
  id: string;
  name: string;
  displayName: string;
  description: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageGenerationRequest {
  description: string;
  style?: ImageStyle;
  dimensions?: ImageDimensions;
}

// 동화 처리 관련 타입
export interface StoryParagraph {
  id: string;
  content: string;
  imageDescription: string;
  order: number;
}

export interface ProcessedStory {
  paragraphs: StoryParagraph[];
  totalParagraphs: number;
  processingTime: number;
}

export interface ImageGenerationParagraph {
  id: string;
  content: string;
  scenePrompt?: string;
  keywords: string[];
  isGenerating: boolean;
}

// API 응답 타입
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 서비스 상태 타입
export interface ServiceStatus {
  isInitialized: boolean;
  canConnect: boolean;
  message: string;
  lastChecked?: Date;
  modelStatus?: string;
  error?: string;
}
