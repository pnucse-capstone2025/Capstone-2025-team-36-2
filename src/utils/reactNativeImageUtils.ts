/**
 * React Native용 이미지 유틸리티 함수들
 */

import { Platform } from 'react-native';

/**
 * Base64 이미지 데이터를 React Native에서 사용할 수 있는 형태로 변환
 * @param base64Data Base64 인코딩된 이미지 데이터
 * @param mimeType 이미지 MIME 타입
 * @returns React Native에서 사용할 수 있는 이미지 URI
 */
export function base64ToImageUri(base64Data: string, mimeType: string = 'image/png'): string {
  return `data:${mimeType};base64,${base64Data}`;
}

/**
 * Base64 이미지 데이터를 파일로 저장 (React Native)
 * @param base64Data Base64 인코딩된 이미지 데이터
 * @param filename 저장할 파일명
 * @returns Promise<string> 저장된 파일 경로
 */
export async function saveBase64ImageToFile(
  base64Data: string, 
  filename: string = `image_${Date.now()}.png`
): Promise<string> {
  try {
    // React Native의 FileSystem을 사용하여 파일 저장
    const RNFS = require('react-native-fs');
    
    const path = `${RNFS.DocumentDirectoryPath}/${filename}`;
    await RNFS.writeFile(path, base64Data, 'base64');
    
    console.log('이미지 파일 저장 완료:', path);
    return path;
  } catch (error) {
    console.error('이미지 파일 저장 실패:', error);
    throw new Error('이미지 파일 저장에 실패했습니다.');
  }
}

/**
 * Base64 이미지 데이터를 임시 파일로 저장
 * @param base64Data Base64 인코딩된 이미지 데이터
 * @param mimeType 이미지 MIME 타입
 * @returns Promise<string> 임시 파일 경로
 */
export async function createTempImageFile(
  base64Data: string, 
  mimeType: string = 'image/png'
): Promise<string> {
  try {
    const RNFS = require('react-native-fs');
    const extension = mimeType.split('/')[1] || 'png';
    const filename = `temp_image_${Date.now()}.${extension}`;
    const path = `${RNFS.CachesDirectoryPath}/${filename}`;
    
    await RNFS.writeFile(path, base64Data, 'base64');
    
    console.log('임시 이미지 파일 생성 완료:', path);
    return path;
  } catch (error) {
    console.error('임시 이미지 파일 생성 실패:', error);
    throw new Error('임시 이미지 파일 생성에 실패했습니다.');
  }
}

/**
 * 이미지 크기 계산 (React Native)
 * @param base64Data Base64 인코딩된 이미지 데이터
 * @returns Promise<{width: number, height: number}>
 */
export function getImageDimensionsRN(base64Data: string): Promise<{width: number, height: number}> {
  return new Promise((resolve, reject) => {
    const Image = require('react-native').Image;
    
    const imageUri = base64ToImageUri(base64Data);
    
    Image.getSize(
      imageUri,
      (width: number, height: number) => {
        resolve({ width, height });
      },
      (error: any) => {
        console.error('이미지 크기 계산 실패:', error);
        reject(new Error('이미지 크기 계산에 실패했습니다.'));
      }
    );
  });
}

/**
 * 이미지 압축 (React Native)
 * @param base64Data Base64 인코딩된 이미지 데이터
 * @param quality 압축 품질 (0.1 ~ 1.0)
 * @param maxWidth 최대 너비
 * @param maxHeight 최대 높이
 * @returns Promise<string> 압축된 Base64 데이터
 */
export async function compressImageRN(
  base64Data: string,
  quality: number = 0.8,
  maxWidth: number = 1024,
  maxHeight: number = 1024
): Promise<string> {
  try {
    const ImageResizer = require('react-native-image-resizer').default;
    
    // 임시 파일 생성
    const tempPath = await createTempImageFile(base64Data);
    
    // 이미지 리사이징
    const resizedImage = await ImageResizer.createResizedImage(
      tempPath,
      maxWidth,
      maxHeight,
      'JPEG',
      quality * 100,
      0,
      undefined,
      false,
      {
        mode: 'contain',
        onlyScaleDown: true,
      }
    );
    
    // 리사이즈된 이미지를 Base64로 변환
    const RNFS = require('react-native-fs');
    const compressedBase64 = await RNFS.readFile(resizedImage.uri, 'base64');
    
    // 임시 파일 정리
    await RNFS.unlink(tempPath);
    await RNFS.unlink(resizedImage.uri);
    
    return compressedBase64;
  } catch (error) {
    console.error('이미지 압축 실패:', error);
    throw new Error('이미지 압축에 실패했습니다.');
  }
}

/**
 * 이미지 메타데이터 추출 (React Native)
 * @param base64Data Base64 인코딩된 이미지 데이터
 * @returns Promise<{size: number, type: string, dimensions: {width: number, height: number}}>
 */
export async function getImageMetadataRN(base64Data: string): Promise<{
  size: number;
  type: string;
  dimensions: {width: number, height: number};
}> {
  try {
    const dimensions = await getImageDimensionsRN(base64Data);
    const size = Math.round((base64Data.length * 3) / 4); // Base64 크기를 바이트로 변환
    
    return {
      size,
      type: 'image/png', // Gemini는 PNG로 반환
      dimensions
    };
  } catch (error) {
    console.error('이미지 메타데이터 추출 실패:', error);
    throw new Error('이미지 메타데이터 추출에 실패했습니다.');
  }
}

/**
 * 플랫폼별 이미지 유틸리티 선택
 */
export const ImageUtils = Platform.select({
  ios: {
    base64ToImageUri,
    saveBase64ImageToFile,
    createTempImageFile,
    getImageDimensions: getImageDimensionsRN,
    compressImage: compressImageRN,
    getImageMetadata: getImageMetadataRN,
  },
  android: {
    base64ToImageUri,
    saveBase64ImageToFile,
    createTempImageFile,
    getImageDimensions: getImageDimensionsRN,
    compressImage: compressImageRN,
    getImageMetadata: getImageMetadataRN,
  },
  default: {
    base64ToImageUri,
    saveBase64ImageToFile,
    createTempImageFile,
    getImageDimensions: getImageDimensionsRN,
    compressImage: compressImageRN,
    getImageMetadata: getImageMetadataRN,
  },
});

