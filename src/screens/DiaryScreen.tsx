import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  ImageBackground,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Calendar from '../components/Calendar';
import DateSlider from '../components/DateSlider';
import BackArrowIcon from '../components/icons/BackArrowIcon';
import CalendarIcon from '../components/icons/CalendarIcon';
import PlusIcon from '../components/icons/PlusIcon';
import { DiaryEntry } from '../types/diaryTypes';
import { getDiaryByDate, getDiariesByMonth, getUserDiaries } from '../services/diaryService';
import { formatDateToLocalString, formatDateToKorean } from '../utils/dateUtils';

const { width, height } = Dimensions.get('window');

interface DiaryScreenProps {
  navigation: any;
}

const DiaryScreen: React.FC<DiaryScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [diaryDates, setDiaryDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 선택된 날짜의 모든 일기 로드
  const loadDiaryForDate = async (date: Date) => {
    try {
      setIsLoading(true);
      const dateString = formatDateToLocalString(date); // 로컬 시간대 기준 YYYY-MM-DD 형식
      console.log('📅 [DiaryScreen] 일기 로드 시작:', { date, dateString });
      
      // 해당 날짜의 모든 일기를 가져오기 위해 getUserDiaries 사용
      const result = await getUserDiaries({ date: dateString }, 'createdAt', 'desc');
      console.log('📅 [DiaryScreen] 일기 로드 결과:', result);
      
      if (result.success && result.diaries) {
        setDiaryEntries(result.diaries);
        console.log('📅 [DiaryScreen] 일기 데이터 설정 완료:', {
          count: result.diaries.length,
          titles: result.diaries.map(d => d.title)
        });
      } else {
        setDiaryEntries([]);
        console.log('📅 [DiaryScreen] 일기 데이터 없음');
      }
    } catch (error) {
      console.error('❌ [DiaryScreen] 일기 로드 오류:', error);
      setDiaryEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 현재 월의 일기 날짜들 로드
  const loadDiaryDatesForMonth = async (date: Date) => {
    try {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const monthString = `${year}-${month}`;
      
      console.log('📅 [DiaryScreen] 월별 일기 날짜 로드:', { date, monthString });
      
      const result = await getDiariesByMonth(monthString);
      console.log('📅 [DiaryScreen] 월별 일기 로드 결과:', result);
      
      if (result.success && result.diaries) {
        // 중복된 날짜 제거 (같은 날짜에 여러 일기가 있어도 한 번만 표시)
        const uniqueDates = [...new Set(result.diaries.map(diary => diary.date))];
        setDiaryDates(uniqueDates);
        console.log('📅 [DiaryScreen] 일기 날짜들 설정:', {
          totalDiaries: result.diaries.length,
          uniqueDates: uniqueDates.length,
          dates: uniqueDates
        });
      } else {
        setDiaryDates([]);
        console.log('📅 [DiaryScreen] 일기 날짜 없음');
      }
    } catch (error) {
      console.error('❌ [DiaryScreen] 일기 날짜 로드 오류:', error);
      setDiaryDates([]);
    }
  };

  // 초기 로드
  useEffect(() => {
    loadDiaryForDate(selectedDate);
    loadDiaryDatesForMonth(selectedDate);
  }, []);

  // 날짜 변경 시 일기 로드
  useEffect(() => {
    console.log('📅 [DiaryScreen] selectedDate 변경됨, 일기 로드 시작:', selectedDate);
    loadDiaryForDate(selectedDate);
    // 달력이 열려있을 때는 해당 월의 일기 날짜들도 업데이트
    if (isCalendarExpanded) {
      loadDiaryDatesForMonth(selectedDate);
    }
  }, [selectedDate, isCalendarExpanded]);

  // 새로고침
  const onRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      loadDiaryForDate(selectedDate),
      loadDiaryDatesForMonth(selectedDate)
    ]);
    setIsRefreshing(false);
  };

  const handleBackPress = () => {
    navigation.navigate('Main');
  };

  const handleCalendarPress = () => {
    const newExpandedState = !isCalendarExpanded;
    setIsCalendarExpanded(newExpandedState);
    
    // 달력이 열릴 때 해당 월의 일기 날짜들을 로드
    if (newExpandedState) {
      console.log('📅 [DiaryScreen] 달력 열림, 일기 날짜들 로드:', selectedDate);
      loadDiaryDatesForMonth(selectedDate);
    }
  };

  const handlePlusPress = () => {
    const dateString = formatDateToLocalString(selectedDate);
    navigation.navigate('DiaryCreate', { selectedDate: dateString });
  };

  const handleDateSelect = (date: Date) => {
    console.log('📅 [DiaryScreen] 날짜 선택됨:', { 
      selectedDate: date, 
      dateString: formatDateToLocalString(date) 
    });
    setSelectedDate(date);
    setIsCalendarExpanded(false);
  };

  const handleDiaryPress = (diary: DiaryEntry) => {
    navigation.navigate('DiaryDetail', { diaryId: diary.id });
  };

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
          
          <View style={styles.rightButtons}>
            <TouchableOpacity onPress={handleCalendarPress} style={styles.calendarButton}>
              <CalendarIcon size={24} color="#7D7D7D" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePlusPress} style={styles.plusButton}>
              <PlusIcon size={24} color="#7D7D7D" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <DateSlider
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        diaryDates={diaryDates}
      />

      {isCalendarExpanded && (
        <View style={styles.calendarContainer}>
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            diaryDates={diaryDates}
          />
        </View>
      )}

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#7D7D7D" />
            <Text style={styles.loadingText}>일기를 불러오는 중...</Text>
          </View>
        ) : diaryEntries.length > 0 ? (
          <View style={styles.diaryListContainer}>
            {diaryEntries.map((entry, index) => (
              <TouchableOpacity
                key={entry.id}
                style={[
                  styles.diaryCard,
                  index > 0 && styles.diaryCardNotFirst // 첫 번째가 아닌 카드에 추가 스타일
                ]}
                onPress={() => handleDiaryPress(entry)}
                activeOpacity={0.8}
              >
                <View style={styles.diaryImageContainer}>
                  <ImageBackground
                    source={{ 
                      uri: entry.mainImageUrl || 
                           (entry.paragraphs?.find(p => p.generatedImageUrl)?.generatedImageUrl) || 
                           'https://via.placeholder.com/400x270?text=No+Image' 
                    }}
                    style={styles.diaryImage}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.diaryTitle}>{entry.title}</Text>
                <Text style={styles.diaryContent}>{entry.content}</Text>
                {diaryEntries.length > 1 && (
                  <View style={styles.diaryIndexContainer}>
                    <Text style={styles.diaryIndexText}>
                      {index + 1} / {diaryEntries.length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              이 날짜에는 일기가 없습니다.{'\n'}우측 상단의 + 를 눌러 일기를 작성하세요.
            </Text>
          </View>
        )}
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
    fontSize: 20,
    fontWeight: '400',
    color: '#7d7d7d',
    letterSpacing: -1,
    marginTop: 5,
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  calendarButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  plusButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    marginBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  diaryListContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7d7d7d',
    letterSpacing: -0.8,
  },
  diaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  diaryCardNotFirst: {
    marginTop: 10,
  },
  diaryImageContainer: {
    height: 270,
    width: '100%',
  },
  diaryImage: {
    flex: 1,
    width: '100%',
  },
  diaryTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: '#7d7d7d',
    textAlign: 'center',
    marginVertical: 15,
    letterSpacing: -1,
  },
  diaryContent: {
    fontSize: 16,
    color: '#7d7d7d',
    lineHeight: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
    letterSpacing: -0.8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#7d7d7d',
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: -0.8,
  },
  diaryIndexContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  diaryIndexText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default DiaryScreen;