/**
 * 스타일 관련 상수 정의
 */

// 폰트 크기
export const FONT_SIZES = {
  TITLE: 48,
  SUBTITLE: 20,
  HEADER: 18,
  SECTION_TITLE: 16,
  BODY: 16,
  CAPTION: 14,
  SMALL: 12,
} as const;

// 폰트 두께
export const FONT_WEIGHTS = {
  LIGHT: '300' as const,
  REGULAR: '400' as const,
  MEDIUM: '500' as const,
  SEMIBOLD: '600' as const,
  BOLD: '700' as const,
};

// 색상
export const COLORS = {
  PRIMARY: '#333333',
  SECONDARY: '#666666',
  ACCENT: '#1976D2',
  SUCCESS: '#4CAF50',
  ERROR: '#F44336',
  WARNING: '#FF9800',
  WHITE: '#FFFFFF',
  LIGHT_GRAY: '#F5F5F5',
  BORDER: '#E0E0E0',
  PLACEHOLDER: '#7d7d7d',
  TRANSPARENT_WHITE: 'rgba(255, 255, 255, 0.7)',
  TEXT_PRIMARY: '#333333',
  TEXT_SECONDARY: '#666666',
} as const;

// 간격
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 20,
  XXL: 24,
  XXXL: 32,
} as const;

// 테두리 반경
export const BORDER_RADIUS = {
  SM: 4,
  MD: 8,
  LG: 12,
  XL: 16,
} as const;

// 그림자
export const SHADOWS = {
  SMALL: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  MEDIUM: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  LARGE: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
} as const;

