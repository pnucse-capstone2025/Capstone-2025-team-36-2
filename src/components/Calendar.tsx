import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import BackArrowIcon from './icons/BackArrowIcon';
import { formatDateToLocalString } from '../utils/dateUtils';

const { width } = Dimensions.get('window');

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  diaryDates: string[]; // YYYY-MM-DD 형식의 일기가 있는 날짜들
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect, diaryDates }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  const panRef = useRef<PanGestureHandler>(null);

  // selectedDate가 변경될 때 currentMonth도 업데이트
  useEffect(() => {
    const newMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const currentMonthTime = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getTime();
    const newMonthTime = newMonth.getTime();
    
    if (newMonthTime !== currentMonthTime) {
      console.log('📅 [Calendar] selectedDate 변경으로 currentMonth 업데이트:', { 
        selectedDate, 
        currentMonth, 
        newMonth 
      });
      setCurrentMonth(newMonth);
    }
  }, [selectedDate]);

  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // 이전 달의 마지막 날들
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        hasDiary: false,
        date: new Date(year, month - 1, prevMonthDays - i)
      });
    }

    // 현재 달의 날들
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = formatDateToLocalString(date);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const hasDiary = diaryDates.includes(dateString);

      days.push({
        day,
        isCurrentMonth: true,
        isToday,
        isSelected,
        hasDiary,
        date
      });
    }

    // 다음 달의 첫 날들
    const remainingDays = 42 - days.length; // 6주 * 7일 = 42
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        hasDiary: false,
        date: new Date(year, month + 1, day)
      });
    }

    return days;
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDatePress = (date: Date) => {
    console.log('📅 [Calendar] 날짜 선택됨:', { 
      selectedDate: date, 
      dateString: formatDateToLocalString(date),
      currentMonth: currentMonth.getFullYear() + '-' + (currentMonth.getMonth() + 1)
    });
    onDateSelect(date);
  };

  const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX } = event.nativeEvent;
      if (translationX > 50) {
        handlePreviousMonth();
      } else if (translationX < -50) {
        handleNextMonth();
      }
    }
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePreviousMonth} style={styles.arrowButton}>
          <BackArrowIcon size={20} color="#7d7d7d" />
        </TouchableOpacity>
        
        <Text style={styles.monthText}>
          {currentMonth.getFullYear()}년 {monthNames[currentMonth.getMonth()]}
        </Text>
        
        <TouchableOpacity onPress={handleNextMonth} style={styles.arrowButton}>
          <View style={styles.rightArrow}>
            <BackArrowIcon size={20} color="#7d7d7d" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.dayNamesRow}>
        {dayNames.map((dayName, index) => (
          <Text key={index} style={styles.dayName}>
            {dayName}
          </Text>
        ))}
      </View>

      <PanGestureHandler
        ref={panRef}
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onGestureEvent}
      >
        <View style={styles.daysContainer}>
          {days.map((dayData, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dayContainer}
              onPress={() => handleDatePress(dayData.date)}
            >
              <View style={[
                styles.dayCircle,
                dayData.isSelected && styles.selectedDay,
                dayData.isToday && !dayData.isSelected && styles.todayDay,
              ]}>
                <Text style={[
                  styles.dayText,
                  !dayData.isCurrentMonth && styles.otherMonthText,
                  dayData.isSelected && styles.selectedDayText,
                  dayData.isToday && !dayData.isSelected && styles.todayText,
                ]}>
                  {dayData.day}
                </Text>
              </View>
              {dayData.hasDiary && (
                <View style={styles.diaryIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  arrowButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightArrow: {
    transform: [{ scaleX: -1 }],
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  dayNamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayName: {
    fontSize: 14,
    color: '#7d7d7d',
    fontWeight: '400',
    textAlign: 'center',
    width: 40,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  dayContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    position: 'relative',
  },
  dayCircle: {
    width: 29,
    height: 29,
    borderRadius: 29 / 2, // 정확한 원형을 위해 width/2 사용
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Android에서 borderRadius가 제대로 적용되도록
  },
  selectedDay: {
    backgroundColor: '#4CAF50', // 초록색 원
  },
  todayDay: {
    backgroundColor: '#E0E0E0', // 회색 원
  },
  dayText: {
    fontSize: 20,
    color: '#7d7d7d',
    fontWeight: '400',
  },
  otherMonthText: {
    color: '#d9d9d9',
  },
  selectedDayText: {
    color: '#FFFFFF',
  },
  todayText: {
    color: '#7d7d7d',
  },
  diaryIndicator: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4CAF50',
  },
});

export default Calendar;
