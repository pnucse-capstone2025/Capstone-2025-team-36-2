import auth from '@react-native-firebase/auth';
import storage, { getStorage, ref, uploadString, getDownloadURL } from '@react-native-firebase/storage';

// 인증 상태를 기다리는 헬퍼 함수
const waitForAuthState = (timeoutMs: number = 5000): Promise<any> => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('인증 상태 확인 시간 초과'));
    }, timeoutMs);

    const unsubscribe = auth().onAuthStateChanged((user) => {
      clearTimeout(timeout);
      unsubscribe();
      resolve(user);
    });
  });
};

// AI가 생성한 Base64 이미지를 Firebase Storage에 업로드하는 간단한 함수
export const uploadAIImage = async (
  base64Data: string,
  filename: string,
  type: 'diary' | 'fairytale' = 'diary'
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // 인증 상태 확인
    let user = auth().currentUser;
    
    // 사용자가 null인 경우 인증 상태 재확인
    if (!user) {
      console.log('🔄 인증 상태 재확인 중...');
      try {
        user = await waitForAuthState(3000);
      } catch (error) {
        console.error('❌ 인증 상태 재확인 실패:', error);
      }
    }
    
    if (!user) {
      console.error('❌ 사용자 인증 실패: currentUser가 여전히 null');
      return { success: false, error: '로그인이 필요합니다. 앱을 다시 시작하거나 다시 로그인해주세요.' };
    }

    // Base64 데이터에서 헤더 제거 (data:image/jpeg;base64, 등)
    const cleanBase64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
    
    // 고유한 파일명 생성
    const timestamp = Date.now();
    const uniqueFilename = `${filename}_${timestamp}.jpg`;
    
    // Firebase Storage 경로 설정
    const storagePath = `${type}s/${user.uid}/${uniqueFilename}`;
    const storageRef = ref(storage(), storagePath);
    
    // Base64 데이터를 직접 업로드 (최신 modular API 사용)
    await uploadString(storageRef, cleanBase64, 'base64', {
      contentType: 'image/jpeg',
    });
    
    // 다운로드 URL 가져오기
    const downloadURL = await getDownloadURL(storageRef);
    
    console.log('✅ 이미지 업로드 성공:', uniqueFilename);
    return { success: true, url: downloadURL };
    
  } catch (error) {
    console.error('AI 이미지 업로드 오류:', error);
    return { 
      success: false, 
      error: `이미지 업로드 실패: ${(error as Error).message}` 
    };
  }
};

// 다중 AI 이미지 업로드 (일기/동화용)
export const uploadMultipleAIImages = async (
  base64Images: string[],
  baseName: string,
  type: 'diary' | 'fairytale' = 'diary'
): Promise<{ success: boolean; urls?: string[]; error?: string }> => {
  try {
    const uploadPromises = base64Images.map((base64Data, index) => 
      uploadAIImage(base64Data, `${baseName}_${index}`, type)
    );

    const results = await Promise.all(uploadPromises);
    
    // 모든 업로드가 성공했는지 확인
    const failedUploads = results.filter(result => !result.success);
    if (failedUploads.length > 0) {
      return { 
        success: false, 
        error: `${failedUploads.length}개의 이미지 업로드에 실패했습니다.` 
      };
    }

    const urls = results.map(result => result.url!);
    return { success: true, urls };
  } catch (error) {
    console.error('다중 AI 이미지 업로드 오류:', error);
    return { success: false, error: '이미지 업로드 중 오류가 발생했습니다.' };
  }
};

// 이미지 삭제
export const deleteImage = async (
  imageUrl: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const storageRef = ref(storage(), imageUrl);
    await storageRef.delete();
    return { success: true };
  } catch (error) {
    console.error('이미지 삭제 오류:', error);
    return { success: false, error: '이미지 삭제 중 오류가 발생했습니다.' };
  }
};
