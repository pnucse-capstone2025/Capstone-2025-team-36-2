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
import { FONT_SIZES, FONT_WEIGHTS, COLORS, SPACING } from '../constants/styleConstants';
import BackArrowIcon from '../components/icons/BackArrowIcon';
import ImgGenerateIcon from '../components/icons/ImgGenerateIcon';
import { storyProcessingService } from '../services/storyProcessingService';

const { width, height } = Dimensions.get('window');

interface FairytaleCreateScreenProps {
  navigation: any;
}

const FairytaleCreateScreen: React.FC<FairytaleCreateScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [fairytaleTitle, setFairytaleTitle] = useState('');
  const [fairytaleContent, setFairytaleContent] = useState('');
  const [isProcessingParagraphs, setIsProcessingParagraphs] = useState(false);

  const handleBackPress = () => {
    navigation.navigate('Fairytale');
  };

  const handleGenerateImage = async () => {
    if (!fairytaleTitle.trim() || !fairytaleContent.trim()) {
      Alert.alert('알림', '제목과 내용을 모두 입력한 후 이미지를 생성해주세요.');
      return;
    }
    
    setIsProcessingParagraphs(true);
    
    try {
      // 문단 나누기 자동 실행
      console.log('📖 [동화 작성] 문단 나누기 시작');
      const paragraphs = await storyProcessingService.divideIntoImageGenerationParagraphs(fairytaleContent);
      
      console.log('✅ [동화 작성] 문단 나누기 완료:', {
        paragraphCount: paragraphs.length,
        paragraphs: paragraphs.map(p => ({
          id: p.id,
          content: p.content.substring(0, 50) + '...',
          keywords: p.keywords.slice(0, 3)
        }))
      });
      
      // 다음 스크린으로 문단 데이터 전달
      navigation.navigate('FairytaleImgGenOption', {
        fairytaleTitle,
        fairytaleContent,
        paragraphs, // 전체 문단 배열 전달
      });
      
    } catch (error) {
      console.error('❌ [동화 작성] 문단 나누기 실패:', error);
      Alert.alert(
        '문단 처리 실패', 
        '문단 나누기에 실패했습니다. 다시 시도해주세요.',
        [{ text: '확인', style: 'default' }]
      );
    } finally {
      setIsProcessingParagraphs(false);
    }
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
        {/* 제목 입력 */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>제목</Text>
          <TextInput
            style={styles.titleInput}
            value={fairytaleTitle}
            onChangeText={setFairytaleTitle}
            placeholder="동화 제목을 입력하세요"
            placeholderTextColor="#999999"
            maxLength={50}
          />
        </View>

        {/* 내용 입력 */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>내용</Text>
          <TextInput
            style={styles.contentInput}
            value={fairytaleContent}
            onChangeText={setFairytaleContent}
            placeholder="상상력이 넘치는 동화를 작성해보세요. 어떤 모험이 기다리고 있을까요?"
            placeholderTextColor="#999999"
            multiline
            textAlignVertical="top"
            maxLength={GEMINI_CONFIG.MAX_DIARY_CONTENT_LENGTH}
          />
        </View>
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
  inputSection: {
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
});

export default FairytaleCreateScreen;
