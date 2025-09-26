import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackArrowIcon from '../components/icons/BackArrowIcon';
import DiskIcon from '../components/icons/DiskIcon';
import { createFairytaleEntry } from '../services/fairytaleService';
import { uploadAIImage, uploadMultipleAIImages } from '../services/imageStorageService';
import { DiaryParagraph } from '../types/diaryTypes';
import { useAuth } from '../contexts/AuthContext';

interface FairytaleSaveScreenProps {
  navigation: any;
  route: {
    params: {
      fairytaleTitle: string;
      fairytaleContent: string;
      paragraphs: Array<{
        id: string;
        content: string;
        generatedImageUrl: string;
      }>;
      generatedImageUrl?: string;
      generationMode: 'single' | 'paragraphs' | 'image';
    };
  };
}

const FairytaleSaveScreen: React.FC<FairytaleSaveScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const insets = useSafeAreaInsets();
  const { user, isLoggedIn } = useAuth();
  const { fairytaleTitle, fairytaleContent, paragraphs, generatedImageUrl, generationMode } = route.params;
  
  const [isSaving, setIsSaving] = useState(false);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSavePress = async () => {
    console.log('📚 동화 저장 시작');
    
    setIsSaving(true);
    
    try {
      // 현재 날짜를 동화 저장 날짜로 사용
      const currentDate = new Date();
      const dateString = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식
      const timestamp = Date.now();
      
      // 1. 메인 이미지 업로드 (있는 경우)
      let mainImageUrl: string | undefined;
      if (generatedImageUrl) {
        const mainImageResult = await uploadAIImage(
          generatedImageUrl, 
          `fairytale_main_${timestamp}`,
          'fairytale'
        );
        
        if (mainImageResult.success) {
          mainImageUrl = mainImageResult.url;
        } else {
          Alert.alert('이미지 업로드 실패', mainImageResult.error || '메인 이미지 업로드에 실패했습니다.');
          setIsSaving(false);
          return;
        }
      }

      // 2. 문단별 이미지들 업로드
      const paragraphImageUrls: string[] = [];
      const imageUris = paragraphs
        .map(p => p.generatedImageUrl)
        .filter((url): url is string => !!url);

      if (imageUris.length > 0) {
        const paragraphImagesResult = await uploadMultipleAIImages(
          imageUris,
          `fairytale_paragraphs_${timestamp}`,
          'fairytale'
        );
        
        if (paragraphImagesResult.success) {
          paragraphImageUrls.push(...paragraphImagesResult.urls!);
        } else {
          Alert.alert('이미지 업로드 실패', paragraphImagesResult.error || '문단 이미지 업로드에 실패했습니다.');
          setIsSaving(false);
          return;
        }
      }

      // 3. paragraphs를 DiaryParagraph 타입으로 변환 (업로드된 URL 사용)
      const fairytoleParagraphs: DiaryParagraph[] = paragraphs.map((paragraph, index) => ({
        id: paragraph.id,
        content: paragraph.content,
        keywords: [], // 키워드는 현재 없으므로 빈 배열
        generatedImageUrl: paragraph.generatedImageUrl ? paragraphImageUrls[index] : undefined,
      }));

      // 4. 동화 데이터 생성 (일기 서비스를 재활용하되 태그로 구분)
      const fairytaleData = {
        title: fairytaleTitle,
        content: fairytaleContent,
        date: dateString,
        mainImageUrl: mainImageUrl,
        paragraphs: fairytoleParagraphs,
        tags: ['fairytale'], // 동화임을 나타내는 태그 추가
      };

      // 5. Firebase Firestore에 저장 (동화 서비스 사용)
      console.log('📚 Firestore 저장 시작:', { title: fairytaleData.title, date: fairytaleData.date });
      const result = await createFairytaleEntry(fairytaleData);
      
      if (result.success) {
        console.log('✅ 동화 저장 최종 성공');
        Alert.alert(
          '저장 완료',
          '동화가 성공적으로 저장되었습니다!',
          [
            {
              text: '확인',
              onPress: () => navigation.navigate('Fairytale')
            }
          ]
        );
      } else {
        console.error('❌ 동화 저장 실패:', result.error);
        Alert.alert('저장 실패', result.error || '동화 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('동화 저장 오류:', error);
      Alert.alert('저장 실패', '동화 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderSingleImageLayout = () => (
    <View style={styles.singleImageLayout}>
      <Text style={styles.fairytaleTitle}>{fairytaleTitle}</Text>
      <Text style={styles.fairytaleDate}>{new Date().toLocaleDateString('ko-KR')}</Text>
      
      {generatedImageUrl && (
        <Image source={{ uri: generatedImageUrl }} style={styles.mainImage} />
      )}
      
      <Text style={styles.fairytaleContent}>{fairytaleContent}</Text>
    </View>
  );

  const renderParagraphImageLayout = () => (
    <View style={styles.paragraphImageLayout}>
      <Text style={styles.fairytaleTitle}>{fairytaleTitle}</Text>
      <Text style={styles.fairytaleDate}>{new Date().toLocaleDateString('ko-KR')}</Text>
      
      {paragraphs.map((paragraph, index) => (
        <View key={paragraph.id} style={styles.paragraphSection}>
          <Image 
            source={{ uri: paragraph.generatedImageUrl }} 
            style={styles.paragraphImage} 
          />
          <Text style={styles.paragraphContent}>{paragraph.content}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <BackArrowIcon size={24} color="#7D7D7D" />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>동화 저장</Text>
          </View>
          
          <TouchableOpacity 
            onPress={handleSavePress} 
            style={[
              styles.saveButton,
              isSaving && styles.saveButtonDisabled
            ]}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#4884FF" />
            ) : (
              <DiskIcon size={24} color="#4884FF" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>저장 미리보기</Text>
          
          {generationMode === 'single' ? renderSingleImageLayout() : renderParagraphImageLayout()}
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
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    letterSpacing: -0.8,
    marginTop: 5,
  },
  saveButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  previewContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  singleImageLayout: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paragraphImageLayout: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fairytaleTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  fairytaleDate: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
    textAlign: 'center',
  },
  mainImage: {
    width: '100%',
    minHeight: 270,
    borderRadius: 8,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  fairytaleContent: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    textAlign: 'left',
  },
  paragraphSection: {
    marginBottom: 24,
  },
  paragraphImage: {
    width: '100%',
    minHeight: 150,
    borderRadius: 8,
    marginBottom: 12,
    resizeMode: 'contain',
  },
  paragraphContent: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 22,
    textAlign: 'left',
  },
});

export default FairytaleSaveScreen;
