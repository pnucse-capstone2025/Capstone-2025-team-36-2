import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  DiaryEntry,
  DiaryEntryFirestore,
  CreateDiaryEntry,
  DiaryFilter,
  DiarySortOption,
  DiarySortOrder,
} from '../types/diaryTypes';

// Firestore 컬렉션 이름
const DIARY_COLLECTION = 'diaries';

// Firestore 데이터를 DiaryEntry로 변환
const convertFirestoreToDiaryEntry = (doc: any): DiaryEntry => {
  const data = doc.data();
  return {
    id: doc.id,
    userId: data.userId,
    title: data.title,
    content: data.content,
    date: data.date,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    mainImageUrl: data.mainImageUrl,
    paragraphs: data.paragraphs || [],
    mood: data.mood,
    weather: data.weather,
    tags: data.tags || [],
  };
};

// 일기 생성
export const createDiaryEntry = async (
  diaryData: CreateDiaryEntry
): Promise<{ success: boolean; diary?: DiaryEntry; error?: string }> => {
  try {
    const user = auth().currentUser;
    console.log('📝 일기 저장 - 사용자 인증 상세 정보:');
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

    // undefined 필드 제거 및 타임스탬프 사용
    const diaryEntry: any = {
      userId: user.uid,
      title: diaryData.title,
      content: diaryData.content,
      date: diaryData.date,
      createdAt: firestore.Timestamp.now(),
      updatedAt: firestore.Timestamp.now(),
      paragraphs: diaryData.paragraphs || [],
    };

    // 선택적 필드만 추가 (undefined가 아닌 경우만)
    if (diaryData.mainImageUrl) {
      diaryEntry.mainImageUrl = diaryData.mainImageUrl;
    }
    if (diaryData.mood) {
      diaryEntry.mood = diaryData.mood;
    }
    if (diaryData.weather) {
      diaryEntry.weather = diaryData.weather;
    }
    if (diaryData.tags && diaryData.tags.length > 0) {
      diaryEntry.tags = diaryData.tags;
    }

    console.log('📝 Firestore에 일기 데이터 저장 중...', { title: diaryEntry.title, userId: diaryEntry.userId });
    const docRef = await firestore().collection(DIARY_COLLECTION).add(diaryEntry);
    console.log('✅ 일기 저장 성공, 문서 ID:', docRef.id);
    
    // 생성된 문서를 다시 조회하여 반환
    const createdDoc = await docRef.get();
    if (createdDoc.exists) {
      const diary = convertFirestoreToDiaryEntry(createdDoc);
      console.log('✅ 일기 데이터 조회 성공:', diary.title);
      return { success: true, diary };
    } else {
      console.error('❌ 일기 생성 후 조회 실패');
      return { success: false, error: '일기 생성 후 조회에 실패했습니다.' };
    }
  } catch (error) {
    console.error('일기 생성 오류:', error);
    return { success: false, error: '일기 생성 중 오류가 발생했습니다.' };
  }
};

// 일기 수정
export const updateDiaryEntry = async (
  diaryId: string,
  updates: Partial<CreateDiaryEntry>
): Promise<{ success: boolean; diary?: DiaryEntry; error?: string }> => {
  try {
    const user = auth().currentUser;
    if (!user) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    const diaryRef = firestore().collection(DIARY_COLLECTION).doc(diaryId);
    
    // 기존 일기 확인
    const existingDoc = await diaryRef.get();
    if (!existingDoc.exists) {
      return { success: false, error: '일기를 찾을 수 없습니다.' };
    }

    const existingData = existingDoc.data();
    if (existingData?.userId !== user.uid) {
      return { success: false, error: '권한이 없습니다.' };
    }

    const updateData = {
      ...updates,
      updatedAt: firestore.Timestamp.now(),
    };

    await diaryRef.update(updateData);

    // 수정된 문서를 다시 조회하여 반환
    const updatedDoc = await diaryRef.get();
    if (updatedDoc.exists) {
      const diary = convertFirestoreToDiaryEntry(updatedDoc);
      return { success: true, diary };
    } else {
      return { success: false, error: '일기 수정 후 조회에 실패했습니다.' };
    }
  } catch (error) {
    console.error('일기 수정 오류:', error);
    return { success: false, error: '일기 수정 중 오류가 발생했습니다.' };
  }
};

// 일기 삭제
export const deleteDiaryEntry = async (
  diaryId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const user = auth().currentUser;
    if (!user) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    const diaryRef = firestore().collection(DIARY_COLLECTION).doc(diaryId);
    
    // 기존 일기 확인
    const existingDoc = await diaryRef.get();
    if (!existingDoc.exists) {
      return { success: false, error: '일기를 찾을 수 없습니다.' };
    }

    const existingData = existingDoc.data();
    if (existingData?.userId !== user.uid) {
      return { success: false, error: '권한이 없습니다.' };
    }

    await diaryRef.delete();
    return { success: true };
  } catch (error) {
    console.error('일기 삭제 오류:', error);
    return { success: false, error: '일기 삭제 중 오류가 발생했습니다.' };
  }
};

// 특정 일기 조회
export const getDiaryEntry = async (
  diaryId: string
): Promise<{ success: boolean; diary?: DiaryEntry; error?: string }> => {
  try {
    const user = auth().currentUser;
    if (!user) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    const diaryRef = firestore().collection(DIARY_COLLECTION).doc(diaryId);
    const diaryDoc = await diaryRef.get();

    if (!diaryDoc.exists) {
      return { success: false, error: '일기를 찾을 수 없습니다.' };
    }

    const diaryData = diaryDoc.data();
    if (diaryData?.userId !== user.uid) {
      return { success: false, error: '권한이 없습니다.' };
    }

    const diary = convertFirestoreToDiaryEntry(diaryDoc);
    return { success: true, diary };
  } catch (error) {
    console.error('일기 조회 오류:', error);
    return { success: false, error: '일기 조회 중 오류가 발생했습니다.' };
  }
};

// 사용자의 일기 목록 조회
export const getUserDiaries = async (
  filter?: DiaryFilter,
  sortBy: DiarySortOption = 'date',
  sortOrder: DiarySortOrder = 'desc',
  limitCount?: number
): Promise<{ success: boolean; diaries?: DiaryEntry[]; error?: string }> => {
  try {
    const user = auth().currentUser;
    if (!user) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    let q = firestore()
      .collection(DIARY_COLLECTION)
      .where('userId', '==', user.uid);

    // 필터 적용
    if (filter?.date) {
      q = q.where('date', '==', filter.date);
    } else if (filter?.month) {
      q = q.where('date', '>=', `${filter.month}-01`)
           .where('date', '<=', `${filter.month}-31`);
    } else if (filter?.year) {
      q = q.where('date', '>=', `${filter.year}-01-01`)
           .where('date', '<=', `${filter.year}-12-31`);
    }

    if (filter?.mood) {
      q = q.where('mood', '==', filter.mood);
    }

    if (filter?.tags && filter.tags.length > 0) {
      q = q.where('tags', 'array-contains-any', filter.tags);
    }

    // 정렬 적용
    q = q.orderBy(sortBy, sortOrder);

    // 제한 적용
    if (limitCount) {
      q = q.limit(limitCount);
    }

    const querySnapshot = await q.get();
    const diaries: DiaryEntry[] = [];

    querySnapshot.forEach((doc) => {
      diaries.push(convertFirestoreToDiaryEntry(doc));
    });

    return { success: true, diaries };
  } catch (error) {
    console.error('일기 목록 조회 오류:', error);
    return { success: false, error: '일기 목록 조회 중 오류가 발생했습니다.' };
  }
};

// 특정 날짜의 일기 조회
export const getDiaryByDate = async (
  date: string
): Promise<{ success: boolean; diary?: DiaryEntry; error?: string }> => {
  const result = await getUserDiaries({ date });
  if (result.success && result.diaries && result.diaries.length > 0) {
    return { success: true, diary: result.diaries[0] };
  } else if (result.success) {
    return { success: true, diary: undefined };
  } else {
    return { success: false, error: result.error };
  }
};

// 특정 월의 일기 목록 조회
export const getDiariesByMonth = async (
  month: string
): Promise<{ success: boolean; diaries?: DiaryEntry[]; error?: string }> => {
  return getUserDiaries({ month });
};
