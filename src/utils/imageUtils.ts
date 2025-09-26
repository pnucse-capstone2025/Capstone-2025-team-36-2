/**
 * 이미지 관련 유틸리티 함수들
 */

/**
 * Base64 이미지 데이터를 Blob URL로 변환
 * @param base64Data Base64 인코딩된 이미지 데이터
 * @param mimeType 이미지 MIME 타입
 * @returns Blob URL
 */
export function base64ToBlobUrl(base64Data: string, mimeType: string = 'image/png'): string {
  try {
    // Base64 데이터를 바이너리로 변환
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    
    // Blob URL 생성
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Base64 to Blob URL 변환 실패:', error);
    throw new Error('이미지 데이터 변환에 실패했습니다.');
  }
}

/**
 * Base64 이미지 데이터를 Data URL로 변환
 * @param base64Data Base64 인코딩된 이미지 데이터
 * @param mimeType 이미지 MIME 타입
 * @returns Data URL
 */
export function base64ToDataUrl(base64Data: string, mimeType: string = 'image/png'): string {
  return `data:${mimeType};base64,${base64Data}`;
}

/**
 * Blob URL을 정리 (메모리 누수 방지)
 * @param blobUrl 정리할 Blob URL
 */
export function revokeBlobUrl(blobUrl: string): void {
  try {
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.warn('Blob URL 정리 실패:', error);
  }
}

/**
 * 이미지 크기 계산 (React Native 호환)
 * @param base64Data Base64 인코딩된 이미지 데이터
 * @returns Promise<{width: number, height: number}>
 */
export function getImageDimensions(base64Data: string): Promise<{width: number, height: number}> {
  return new Promise((resolve, reject) => {
    // React Native에서는 Image 컴포넌트를 사용
    const { Image } = require('react-native');
    
    const imageUri = base64ToDataUrl(base64Data);
    
    Image.getSize(
      imageUri,
      (width: number, height: number) => {
        resolve({ width, height });
      },
      (error: any) => {
        console.error('이미지 크기 계산 실패:', error);
        // 기본값 반환
        resolve({ width: 512, height: 512 });
      }
    );
  });
}

/**
 * 이미지 압축 (React Native 호환 - 기본 구현)
 * @param base64Data Base64 인코딩된 이미지 데이터
 * @param quality 압축 품질 (0.1 ~ 1.0)
 * @param maxWidth 최대 너비
 * @param maxHeight 최대 높이
 * @returns Promise<string> 압축된 Base64 데이터
 */
export function compressImage(
  base64Data: string, 
  quality: number = 0.8, 
  maxWidth: number = 1024, 
  maxHeight: number = 1024
): Promise<string> {
  // React Native에서는 기본적으로 압축을 지원하지 않으므로 원본 데이터 반환
  console.warn('React Native에서는 이미지 압축이 제한적으로 지원됩니다. 원본 데이터를 반환합니다.');
  return Promise.resolve(base64Data);
}

/**
 * 이미지 메타데이터 추출
 * @param base64Data Base64 인코딩된 이미지 데이터
 * @returns Promise<{size: number, type: string, dimensions: {width: number, height: number}}>
 */
export async function getImageMetadata(base64Data: string): Promise<{
  size: number;
  type: string;
  dimensions: {width: number, height: number};
}> {
  try {
    const dimensions = await getImageDimensions(base64Data);
    const size = Math.round((base64Data.length * 3) / 4); // Base64 크기를 바이트로 변환
    
    return {
      size,
      type: 'image/png', // Gemini는 PNG로 반환
      dimensions
    };
  } catch (error) {
    console.error('이미지 메타데이터 추출 실패:', error);
    // 기본값 반환
    return {
      size: Math.round((base64Data.length * 3) / 4),
      type: 'image/png',
      dimensions: { width: 512, height: 512 }
    };
  }
}
