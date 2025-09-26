import auth from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { DiaryEntry, CreateDiaryEntry } from '../types/diaryTypes';

const FAIRYTALE_COLLECTION = 'fairytales';

const convertFirestoreToFairytaleEntry = (doc: FirebaseFirestoreTypes.DocumentSnapshot): DiaryEntry => {
  const data = doc.data();
  return {
    id: doc.id,
    userId: data?.userId,
    title: data?.title,
    content: data?.content,
    date: data?.date,
    createdAt: data?.createdAt?.toDate() || new Date(),
    updatedAt: data?.updatedAt?.toDate() || new Date(),
    mainImageUrl: data?.mainImageUrl,
    paragraphs: data?.paragraphs || [],
    mood: data?.mood,
    weather: data?.weather,
    tags: data?.tags || [],
  };
};

export const createFairytaleEntry = async (
  fairytaleData: CreateDiaryEntry
): Promise<{ success: boolean; fairytale?: DiaryEntry; error?: string }> => {
  try {
    const user = auth().currentUser;
    console.log('📚 동화 저장 - 사용자 인증 상세 정보:');
    console.log('- 사용자 존재:', !!user);
    if (user) {
      console.log('- UID:', user.uid);
      console.log('- 이메일:', user.email);
      console.log('- 이메일 인증:', user.emailVerified);
      console.log('- 토큰 유효성 확인 중...');
      
      try {
        const token = await user.getIdToken();
        console.log('- 인증 토큰 길이:', token ? token.length : 0);
      } catch (tokenError) {
        console.error('- 토큰 오류:', tokenError);
      }
    }
    
    if (!user) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    const fairytaleEntry: any = {
      userId: user.uid,
      title: fairytaleData.title,
      content: fairytaleData.content,
      date: fairytaleData.date,
      createdAt: firestore.Timestamp.now(),
      updatedAt: firestore.Timestamp.now(),
      paragraphs: fairytaleData.paragraphs || [],
    };

    if (fairytaleData.mainImageUrl) {
      fairytaleEntry.mainImageUrl = fairytaleData.mainImageUrl;
    }
    if (fairytaleData.mood) {
      fairytaleEntry.mood = fairytaleData.mood;
    }
    if (fairytaleData.weather) {
      fairytaleEntry.weather = fairytaleData.weather;
    }
    if (fairytaleData.tags && fairytaleData.tags.length > 0) {
      fairytaleEntry.tags = fairytaleData.tags;
    }

    console.log('📚 Firestore에 동화 데이터 저장 중...', { title: fairytaleEntry.title, userId: fairytaleEntry.userId });
    const docRef = await firestore().collection(FAIRYTALE_COLLECTION).add(fairytaleEntry);
    console.log('✅ 동화 저장 성공, 문서 ID:', docRef.id);
    
    const createdDoc = await docRef.get();
    if (createdDoc.exists) {
      const fairytale = convertFirestoreToFairytaleEntry(createdDoc);
      console.log('✅ 동화 데이터 조회 성공:', fairytale.title);
      return { success: true, fairytale };
    } else {
      console.error('❌ 동화 생성 후 조회 실패');
      return { success: false, error: '동화 생성 후 조회에 실패했습니다.' };
    }
  } catch (error) {
    console.error('동화 생성 오류:', error);
    return { success: false, error: '동화 생성 중 오류가 발생했습니다.' };
  }
};

export const getUserFairytales = async (
  filters?: { [key: string]: any },
  orderBy?: string,
  order?: 'asc' | 'desc',
  limitCount?: number
): Promise<{ success: boolean; fairytales?: DiaryEntry[]; error?: string }> => {
  try {
    const user = auth().currentUser;
    if (!user) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    let query = firestore().collection(FAIRYTALE_COLLECTION).where('userId', '==', user.uid);

    // 필터 적용
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.where(key, '==', value);
        }
      });
    }

    // 정렬 적용
    if (orderBy) {
      query = query.orderBy(orderBy, order || 'desc');
    }

    // 제한 적용
    if (limitCount) {
      query = query.limit(limitCount);
    }

    const querySnapshot = await query.get();
    
    if (querySnapshot.empty) {
      return { success: true, fairytales: [] };
    }

    const fairytales = querySnapshot.docs.map(convertFirestoreToFairytaleEntry);
    return { success: true, fairytales };
  } catch (error) {
    console.error('동화 조회 오류:', error);
    return { success: false, error: '동화 조회 중 오류가 발생했습니다.' };
  }
};

export const getFairytaleById = async (
  fairytaleId: string
): Promise<{ success: boolean; fairytale?: DiaryEntry; error?: string }> => {
  try {
    const user = auth().currentUser;
    if (!user) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    const fairytaleRef = firestore().collection(FAIRYTALE_COLLECTION).doc(fairytaleId);
    const fairytaleDoc = await fairytaleRef.get();

    if (!fairytaleDoc.exists) {
      return { success: false, error: '동화를 찾을 수 없습니다.' };
    }

    const fairytaleData = fairytaleDoc.data();
    if (fairytaleData?.userId !== user.uid) {
      return { success: false, error: '권한이 없습니다.' };
    }

    const fairytale = convertFirestoreToFairytaleEntry(fairytaleDoc);
    return { success: true, fairytale };
  } catch (error) {
    console.error('동화 조회 오류:', error);
    return { success: false, error: '동화 조회 중 오류가 발생했습니다.' };
  }
};

export const updateFairytaleEntry = async (
  fairytaleId: string,
  updates: Partial<CreateDiaryEntry>
): Promise<{ success: boolean; fairytale?: DiaryEntry; error?: string }> => {
  try {
    const user = auth().currentUser;
    if (!user) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    const fairytaleRef = firestore().collection(FAIRYTALE_COLLECTION).doc(fairytaleId);
    
    const existingDoc = await fairytaleRef.get();
    if (!existingDoc.exists) {
      return { success: false, error: '동화를 찾을 수 없습니다.' };
    }

    const existingData = existingDoc.data();
    if (existingData?.userId !== user.uid) {
      return { success: false, error: '권한이 없습니다.' };
    }

    const updateData = {
      ...updates,
      updatedAt: firestore.Timestamp.now(),
    };

    await fairytaleRef.update(updateData);

    const updatedDoc = await fairytaleRef.get();
    if (updatedDoc.exists) {
      const fairytale = convertFirestoreToFairytaleEntry(updatedDoc);
      return { success: true, fairytale };
    } else {
      return { success: false, error: '동화 수정 후 조회에 실패했습니다.' };
    }
  } catch (error) {
    console.error('동화 수정 오류:', error);
    return { success: false, error: '동화 수정 중 오류가 발생했습니다.' };
  }
};

export const deleteFairytaleEntry = async (
  fairytaleId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const user = auth().currentUser;
    if (!user) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    const fairytaleRef = firestore().collection(FAIRYTALE_COLLECTION).doc(fairytaleId);
    
    const existingDoc = await fairytaleRef.get();
    if (!existingDoc.exists) {
      return { success: false, error: '동화를 찾을 수 없습니다.' };
    }

    const existingData = existingDoc.data();
    if (existingData?.userId !== user.uid) {
      return { success: false, error: '권한이 없습니다.' };
    }

    await fairytaleRef.delete();
    return { success: true };
  } catch (error) {
    console.error('동화 삭제 오류:', error);
    return { success: false, error: '동화 삭제 중 오류가 발생했습니다.' };
  }
};
