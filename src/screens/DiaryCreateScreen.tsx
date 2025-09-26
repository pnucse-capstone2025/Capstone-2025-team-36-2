import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GEMINI_CONFIG } from '../constants/apiConstants';
import { FONT_SIZES, FONT_WEIGHTS, COLORS, SPACING, BORDER_RADIUS } from '../constants/styleConstants';
import Calendar from '../components/Calendar';
import BackArrowIcon from '../components/icons/BackArrowIcon';
import ImgGenerateIcon from '../components/icons/ImgGenerateIcon';
import { storyProcessingService } from '../services/storyProcessingService';
import { formatDateToLocalString, formatDateToKorean } from '../utils/dateUtils';

const { width, height } = Dimensions.get('window');

interface DiaryCreateScreenProps {
  navigation: any;
  route?: {
    params?: {
      selectedDate?: string;
    };
  };
}

const DiaryCreateScreen: React.FC<DiaryCreateScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(() => {
    if (route?.params?.selectedDate) {
      return new Date(route.params.selectedDate);
    }
    return new Date();
  });
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [diaryTitle, setDiaryTitle] = useState('');
  const [diaryContent, setDiaryContent] = useState('');
  const [isProcessingParagraphs, setIsProcessingParagraphs] = useState(false);

  const handleBackPress = () => {
    navigation.navigate('Diary');
  };

  const handleCalendarPress = () => {
    setIsCalendarExpanded(!isCalendarExpanded);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsCalendarExpanded(false);
  };

  const handleGenerateImage = async () => {
    if (!diaryTitle.trim() || !diaryContent.trim()) {
      Alert.alert('알림', '제목과 내용을 모두 입력한 후 이미지를 생성해주세요.');
      return;
    }
    
    setIsProcessingParagraphs(true);
    
    try {
      // 문단 나누기 자동 실행
      console.log('📖 [일기 작성] 문단 나누기 시작');
      const paragraphs = await storyProcessingService.divideIntoImageGenerationParagraphs(diaryContent);
      
      console.log('✅ [일기 작성] 문단 나누기 완료:', {
        paragraphCount: paragraphs.length,
        paragraphs: paragraphs.map(p => ({
          id: p.id,
          content: p.content.substring(0, 50) + '...',
          keywords: p.keywords.slice(0, 3)
        }))
      });
      
      // 다음 스크린으로 문단 데이터 전달
      navigation.navigate('DiaryImgGenOption', {
        diaryTitle,
        diaryContent,
        paragraphs, // 전체 문단 배열 전달
        selectedDate: formatDateToLocalString(selectedDate), // 로컬 시간대 기준 YYYY-MM-DD 형식으로 전달
      });
      
    } catch (error) {
      console.error('❌ [일기 작성] 문단 나누기 실패:', error);
      Alert.alert(
        '문단 처리 실패', 
        '문단 나누기에 실패했습니다. 다시 시도해주세요.',
        [{ text: '확인', style: 'default' }]
      );
    } finally {
      setIsProcessingParagraphs(false);
    }
  };

  // handleSaveDiary 함수 제거 - 이미지 생성 기능으로 대체됨

  const formatDate = (date: Date) => {
    return formatDateToKorean(date);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <BackArrowIcon size={24} color="#7D7D7D" />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Diary</Text>
          </View>
          
          <TouchableOpacity 
            onPress={handleGenerateImage} 
            style={[
              styles.generateButton,
              isProcessingParagraphs && styles.generateButtonDisabled
            ]}
            activeOpacity={0.7}
            disabled={isProcessingParagraphs}
          >
            {isProcessingParagraphs ? (
              <ActivityIndicator size="small" color="#7D7D7D" />
            ) : (
              <ImgGenerateIcon size={24} color="#7D7D7D" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 날짜 선택 섹션 */}
        <View style={styles.dateSection}>
          <Text style={styles.sectionTitle}>날짜 선택</Text>
          <TouchableOpacity 
            style={styles.dateButton} 
            onPress={handleCalendarPress}
            activeOpacity={0.8}
          >
            <Text style={styles.dateButtonText}>{formatDate(selectedDate)}</Text>
          </TouchableOpacity>
        </View>

        {/* 달력 */}
        {isCalendarExpanded && (
          <View style={styles.calendarContainer}>
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              diaryDates={[]}
            />
          </View>
        )}

        {/* 제목 입력 */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>제목</Text>
          <TextInput
            style={styles.titleInput}
            value={diaryTitle}
            onChangeText={setDiaryTitle}
            placeholder="일기 제목을 입력하세요"
            placeholderTextColor="#999999"
            maxLength={50}
          />
        </View>

        {/* 내용 입력 */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>내용</Text>
          <TextInput
            style={styles.contentInput}
            value={diaryContent}
            onChangeText={setDiaryContent}
            placeholder="오늘 하루는 어땠나요? 자유롭게 작성해보세요."
            placeholderTextColor="#999999"
            multiline
            textAlignVertical="top"
            maxLength={GEMINI_CONFIG.MAX_DIARY_CONTENT_LENGTH}
          />
        </View>

        {/* 저장 버튼 제거 - 이미지 생성 기능으로 대체됨 */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingVertical: 15,
    paddingTop: 20,
    minHeight: 80,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    position: 'relative',
  },
  backButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    zIndex: 1,
  },
  headerTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
    pointerEvents: 'none',
  },
  headerTitle: {
    fontSize: FONT_SIZES.SUBTITLE,
    fontWeight: FONT_WEIGHTS.REGULAR,
    color: COLORS.PLACEHOLDER,
    letterSpacing: -1,
    marginTop: 5,
  },
  generateButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    zIndex: 1,
  },
  generateButtonDisabled: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dateSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: FONT_WEIGHTS.SEMIBOLD,
    color: COLORS.PRIMARY,
    marginBottom: SPACING.MD,
    letterSpacing: -0.8,
  },
  dateButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    letterSpacing: -0.8,
  },
  calendarContainer: {
    marginBottom: 20,
  },
  inputSection: {
    marginBottom: 20,
  },
  titleInput: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 16,
    color: '#333333',
    letterSpacing: -0.8,
  },
  contentInput: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 16,
    color: '#333333',
    letterSpacing: -0.8,
    minHeight: 200,
  },
  // saveButton, saveButtonText 스타일 제거 - 저장 버튼 제거됨
});

export default DiaryCreateScreen;

