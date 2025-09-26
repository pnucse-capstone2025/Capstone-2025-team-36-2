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
import BackArrowIcon from '../components/icons/BackArrowIcon';
import PlusIcon from '../components/icons/PlusIcon';
import { DiaryEntry } from '../types/diaryTypes';
import { getUserFairytales } from '../services/fairytaleService';

const { width, height } = Dimensions.get('window');

interface FairytaleScreenProps {
  navigation: any;
}

const FairytaleScreen: React.FC<FairytaleScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [fairytaleEntries, setFairytaleEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 모든 동화 로드
  const loadAllFairytales = async () => {
    try {
      setIsLoading(true);
      console.log('📚 [FairytaleScreen] 동화 로드 시작');
      
      // 모든 동화를 가져오기 위해 getUserFairytales 사용 (날짜 필터 없이)
      const result = await getUserFairytales({}, 'createdAt', 'desc');
      console.log('📚 [FairytaleScreen] 동화 로드 결과:', result);
      
      if (result.success && result.fairytales) {
        setFairytaleEntries(result.fairytales);
        console.log('📚 [FairytaleScreen] 동화 데이터 설정 완료:', {
          count: result.fairytales.length,
          titles: result.fairytales.map(d => d.title)
        });
      } else {
        setFairytaleEntries([]);
        console.log('📚 [FairytaleScreen] 동화 데이터 없음');
      }
    } catch (error) {
      console.error('❌ [FairytaleScreen] 동화 로드 오류:', error);
      setFairytaleEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    loadAllFairytales();
  }, []);

  // 새로고침
  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadAllFairytales();
    setIsRefreshing(false);
  };

  const handleBackPress = () => {
    navigation.navigate('Main');
  };

  const handlePlusPress = () => {
    navigation.navigate('FairytaleCreate');
  };

  const handleFairytalePress = (fairytale: DiaryEntry) => {
    navigation.navigate('FairytaleDetail', { fairytaleId: fairytale.id });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <BackArrowIcon size={24} color="#7D7D7D" />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Fairytale</Text>
          </View>
          
          <View style={styles.rightButtons}>
            <TouchableOpacity onPress={handlePlusPress} style={styles.plusButton}>
              <PlusIcon size={24} color="#7D7D7D" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

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
            <Text style={styles.loadingText}>동화를 불러오는 중...</Text>
          </View>
        ) : fairytaleEntries.length > 0 ? (
          <View style={styles.fairytaleListContainer}>
            {fairytaleEntries.map((entry, index) => (
              <TouchableOpacity
                key={entry.id}
                style={[
                  styles.fairytaleCard,
                  index > 0 && styles.fairytaleCardNotFirst
                ]}
                onPress={() => handleFairytalePress(entry)}
                activeOpacity={0.8}
              >
                <View style={styles.fairytaleImageContainer}>
                  <ImageBackground
                    source={{ 
                      uri: entry.mainImageUrl || 
                           (entry.paragraphs?.find(p => p.generatedImageUrl)?.generatedImageUrl) || 
                           'https://via.placeholder.com/400x270?text=No+Image' 
                    }}
                    style={styles.fairytaleImage}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.fairytaleTitle}>{entry.title}</Text>
                {fairytaleEntries.length > 1 && (
                  <View style={styles.fairytaleIndexContainer}>
                    <Text style={styles.fairytaleIndexText}>
                      {index + 1} / {fairytaleEntries.length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              아직 동화가 없습니다.{'\n'}우측 상단의 + 를 눌러 동화를 작성하세요.
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
  plusButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  fairytaleListContainer: {
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
  fairytaleCard: {
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
  fairytaleCardNotFirst: {
    marginTop: 10,
  },
  fairytaleImageContainer: {
    height: 270,
    width: '100%',
  },
  fairytaleImage: {
    flex: 1,
    width: '100%',
  },
  fairytaleTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: '#7d7d7d',
    textAlign: 'center',
    marginVertical: 15,
    letterSpacing: -1,
  },
  fairytaleContent: {
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
  fairytaleIndexContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  fairytaleIndexText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default FairytaleScreen;
