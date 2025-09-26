import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONT_SIZES, FONT_WEIGHTS, COLORS, SPACING } from '../constants/styleConstants';
import { DiaryEntry } from '../types/diaryTypes';
import { getDiaryEntry, deleteDiaryEntry } from '../services/diaryService';
import BackArrowIcon from '../components/icons/BackArrowIcon';

const { width, height } = Dimensions.get('window');

interface DiaryDetailViewScreenProps {
  navigation: any;
  route: {
    params: {
      diaryId: string;
    };
  };
}

const DiaryDetailViewScreen: React.FC<DiaryDetailViewScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { diaryId } = route.params;
  const [diary, setDiary] = useState<DiaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadDiary();
  }, [diaryId]);

  const loadDiary = async () => {
    try {
      setIsLoading(true);
      const result = await getDiaryEntry(diaryId);
      
      if (result.success && result.diary) {
        setDiary(result.diary);
      } else {
        Alert.alert('오류', result.error || '일기를 불러올 수 없습니다.');
        navigation.navigate('Diary');
      }
    } catch (error) {
      Alert.alert('오류', '일기 로딩 중 오류가 발생했습니다.');
      navigation.navigate('Diary');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      '일기 삭제',
      '정말로 이 일기를 삭제하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: confirmDelete,
        },
      ]
    );
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteDiaryEntry(diaryId);
      
      if (result.success) {
        Alert.alert('성공', '일기가 삭제되었습니다.', [
          { text: '확인', onPress: () => navigation.navigate('Diary') }
        ]);
      } else {
        Alert.alert('오류', result.error || '일기 삭제에 실패했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '일기 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBack = () => {
    navigation.navigate('Diary');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={styles.loadingText}>일기를 불러오는 중...</Text>
      </View>
    );
  }

  if (!diary) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>일기를 찾을 수 없습니다.</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <BackArrowIcon size={24} color="#7D7D7D" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={[styles.content, { paddingTop: insets.top }]}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <BackArrowIcon size={24} color="#7D7D7D" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            style={[styles.deleteButton, isDeleting && styles.disabledButton]}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="#FF3B30" />
            ) : (
              <Text style={styles.deleteButtonText}>삭제</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* 일기 제목 */}
        <Text style={styles.title}>{diary.title}</Text>
        
        {/* 날짜 */}
        <Text style={styles.date}>{formatDate(diary.date)}</Text>

        {/* 메인 이미지 */}
        {diary.mainImageUrl && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: diary.mainImageUrl }}
              style={styles.mainImage}
              resizeMode="cover"
            />
          </View>
        )}

        {/* 일기 내용 - 문단별 이미지가 없을 때만 표시 */}
        {(!diary.paragraphs || diary.paragraphs.length === 0 || !diary.paragraphs.some(p => p.generatedImageUrl)) && (
          <View style={styles.contentContainer}>
            <Text style={styles.contentText}>{diary.content}</Text>
          </View>
        )}

        {/* 문단별 이미지들 */}
        {diary.paragraphs && diary.paragraphs.length > 0 && diary.paragraphs.some(p => p.generatedImageUrl) && (
          <View style={styles.paragraphsContainer}>
            <Text style={styles.paragraphsTitle}>문단별 이미지</Text>
            {diary.paragraphs.map((paragraph, index) => (
              <View key={paragraph.id} style={styles.paragraphItem}>
                <Text style={styles.paragraphContent}>{paragraph.content}</Text>
                {paragraph.generatedImageUrl && (
                  <Image
                    source={{ uri: paragraph.generatedImageUrl }}
                    style={styles.paragraphImage}
                    resizeMode="cover"
                  />
                )}
              </View>
            ))}
          </View>
        )}

        {/* 태그 */}
        {diary.tags && diary.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            <Text style={styles.tagsTitle}>태그</Text>
            <View style={styles.tagsList}>
              {diary.tags.map((tag, index) => (
                <View key={index} style={styles.tagItem}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 메타데이터 */}
        <View style={styles.metadataContainer}>
          <Text style={styles.metadataTitle}>상세 정보</Text>
          <View style={styles.metadataItem}>
            <Text style={styles.metadataLabel}>작성일:</Text>
            <Text style={styles.metadataValue}>
              {diary.createdAt.toLocaleDateString('ko-KR')}
            </Text>
          </View>
          <View style={styles.metadataItem}>
            <Text style={styles.metadataLabel}>수정일:</Text>
            <Text style={styles.metadataValue}>
              {diary.updatedAt.toLocaleDateString('ko-KR')}
            </Text>
          </View>
          {diary.mood && (
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>기분:</Text>
              <Text style={styles.metadataValue}>{diary.mood}</Text>
            </View>
          )}
          {diary.weather && (
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>날씨:</Text>
              <Text style={styles.metadataValue}>{diary.weather}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 20,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: FONT_WEIGHTS.MEDIUM,
  },
  disabledButton: {
    opacity: 0.6,
  },
  title: {
    fontSize: 24,
    fontWeight: FONT_WEIGHTS.BOLD,
    color: COLORS.TEXT_PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    marginBottom: 1,
  },
  date: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  imageContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainImage: {
    width: '100%',
    minHeight: 270,
    resizeMode: 'contain',
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.TEXT_PRIMARY,
  },
  paragraphsContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paragraphsTitle: {
    fontSize: 18,
    fontWeight: FONT_WEIGHTS.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 15,
  },
  paragraphItem: {
    marginBottom: 20,
  },
  paragraphContent: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 10,
  },
  paragraphImage: {
    width: '100%',
    minHeight: 150,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  tagsContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tagsTitle: {
    fontSize: 18,
    fontWeight: FONT_WEIGHTS.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 15,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagItem: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: FONT_WEIGHTS.MEDIUM,
  },
  metadataContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metadataTitle: {
    fontSize: 18,
    fontWeight: FONT_WEIGHTS.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 15,
  },
  metadataItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  metadataLabel: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: FONT_WEIGHTS.MEDIUM,
  },
  metadataValue: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
  },
});

export default DiaryDetailViewScreen;
