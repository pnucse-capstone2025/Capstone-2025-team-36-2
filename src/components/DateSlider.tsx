import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { formatDateToLocalString } from '../utils/dateUtils';

const { width } = Dimensions.get('window');

interface DateSliderProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  diaryDates: string[]; // YYYY-MM-DD 형식의 일기가 있는 날짜들
}

const DateSlider: React.FC<DateSliderProps> = ({ selectedDate, onDateSelect, diaryDates }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [dates, setDates] = useState<Date[]>([]);
  const [itemWidth, setItemWidth] = useState(0);

  useEffect(() => {
    // 선택된 날짜 기준으로 앞뒤 30일씩 생성 (동기화를 위해)
    const baseDate = selectedDate;
    const dateList: Date[] = [];
    
    for (let i = -30; i <= 30; i++) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i);
      dateList.push(date);
    }
    
    setDates(dateList);
    console.log('📅 [DateSlider] 날짜 목록 업데이트:', { baseDate, dateCount: dateList.length });
  }, [selectedDate]);

  useEffect(() => {
    // 선택된 날짜로 스크롤 (중앙 정렬)
    const selectedIndex = dates.findIndex(date => 
      date.toDateString() === selectedDate.toDateString()
    );
    
    console.log('📅 [DateSlider] 스크롤 시도:', { 
      selectedDate, 
      selectedIndex, 
      datesLength: dates.length 
    });
    
    if (selectedIndex !== -1 && scrollViewRef.current) {
      const itemWidth = 60; // 고정 아이템 너비
      const scrollX = selectedIndex * itemWidth;
      console.log('📅 [DateSlider] 스크롤 위치:', { scrollX, itemWidth });
      
      // 약간의 지연을 두고 스크롤 (렌더링 완료 후)
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: scrollX,
          animated: true,
        });
      }, 100);
    }
  }, [selectedDate, dates]);

  const handleDatePress = (date: Date) => {
    console.log('📅 [DateSlider] 날짜 선택됨:', { 
      selectedDate: date, 
      dateString: formatDateToLocalString(date) 
    });
    onDateSelect(date);
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const isSelected = date.toDateString() === selectedDate.toDateString();
    
    return {
      day: date.getDate().toString(),
      month: (date.getMonth() + 1).toString(),
      isToday,
      isSelected,
    };
  };

  const hasDiary = (date: Date) => {
    const dateString = formatDateToLocalString(date);
    return diaryDates.includes(dateString);
  };

  const onLayout = (event: any) => {
    const { width: layoutWidth } = event.nativeEvent.layout;
    const itemWidth = 60; // 고정 아이템 너비 (50 + margin 10)
    setItemWidth(itemWidth);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onLayout={onLayout}
        decelerationRate="fast"
        snapToInterval={60}
        snapToAlignment="center"
        contentInsetAdjustmentBehavior="never"
      >
        {dates.map((date, index) => {
          const { day, month, isToday, isSelected } = formatDate(date);
          const hasDiaryEntry = hasDiary(date);
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateItem,
                isSelected && styles.selectedDateItem,
                isToday && !isSelected && styles.todayDateItem,
              ]}
              onPress={() => handleDatePress(date)}
            >
              <View style={[
                styles.dateCircle,
                isSelected && styles.selectedDateCircle,
                isToday && !isSelected && styles.todayDateCircle,
              ]}>
                <Text style={[
                  styles.dateText,
                  isSelected && styles.selectedDateText,
                  isToday && !isSelected && styles.todayDateText,
                ]}>
                  {day}
                </Text>
              </View>
              {hasDiaryEntry && (
                <View style={styles.diaryIndicator} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  scrollContent: {
    paddingHorizontal: width / 2 - 30, // 화면 중앙에 첫 번째 아이템이 오도록 패딩
    alignItems: 'center',
  },
  dateItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 60,
    marginHorizontal: 5,
  },
  selectedDateItem: {
    // 선택된 날짜 스타일
  },
  todayDateItem: {
    // 오늘 날짜 스타일
  },
  dateCircle: {
    width: 29,
    height: 29,
    borderRadius: 29 / 2, // 정확한 원형을 위해 width/2 사용
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    overflow: 'hidden', // Android에서 borderRadius가 제대로 적용되도록
  },
  selectedDateCircle: {
    backgroundColor: '#4CAF50', // 초록색 원
  },
  todayDateCircle: {
    backgroundColor: '#E0E0E0', // 회색 원
  },
  dateText: {
    fontSize: 20,
    color: '#7d7d7d',
    fontWeight: '400',
  },
  selectedDateText: {
    color: '#FFFFFF',
  },
  todayDateText: {
    color: '#7d7d7d',
  },
  diaryIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4CAF50',
  },
});

export default DateSlider;
