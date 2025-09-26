// 일기 데이터 타입 정의

export interface DiaryEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  date: string; // YYYY-MM-DD 형식
  createdAt: Date;
  updatedAt: Date;
  
  // 이미지 관련
  mainImageUrl?: string; // 메인 이미지 URL
  paragraphs: DiaryParagraph[];
  
  // 메타데이터
  mood?: string;
  weather?: string;
  tags?: string[];
}

export interface DiaryParagraph {
  id: string;
  content: string;
  keywords: string[];
  scenePrompt?: string;
  generatedImageUrl?: string;
  isGenerating?: boolean;
  imageLoadError?: boolean;
}

// Firestore 저장용 타입 (Date 객체를 Timestamp로 변환)
export interface DiaryEntryFirestore {
  id: string;
  userId: string;
  title: string;
  content: string;
  date: string;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
  
  mainImageUrl?: string;
  paragraphs: DiaryParagraph[];
  
  mood?: string;
  weather?: string;
  tags?: string[];
}

// 일기 생성/수정용 타입
export interface CreateDiaryEntry {
  title: string;
  content: string;
  date: string;
  mainImageUrl?: string;
  paragraphs: DiaryParagraph[];
  mood?: string;
  weather?: string;
  tags?: string[];
}

// 일기 조회 필터 타입
export interface DiaryFilter {
  date?: string;
  month?: string; // YYYY-MM 형식
  year?: string; // YYYY 형식
  mood?: string;
  tags?: string[];
}

// 일기 정렬 옵션
export type DiarySortOption = 'date' | 'createdAt' | 'title';
export type DiarySortOrder = 'asc' | 'desc';
