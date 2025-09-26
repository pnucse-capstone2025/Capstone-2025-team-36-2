import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { API_DELAYS, IMAGE_CONFIG, TEXT_LIMITS } from '../constants/apiConstants';
import { launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import BackArrowIcon from '../components/icons/BackArrowIcon';
import DiskIcon from '../components/icons/DiskIcon';
import { storyProcessingService } from '../services/storyProcessingService';
import { imageGenerationService } from '../services/imageGenerationService';

const { width } = Dimensions.get('window');

interface FairytaleImgGenOptionScreenProps {
  navigation: any;
  route: {
    params: {
      fairytaleTitle: string;
      fairytaleContent: string;
      paragraphs: Paragraph[];
    };
  };
}

interface ImageStyle {
  id: string;
  name: string;
  displayName: string;
}

interface ImageMood {
  id: string;
  name: string;
  displayName: string;
}

interface ImageColorPalette {
  id: string;
  name: string;
  displayName: string;
}

interface Paragraph {
  id: string;
  content: string;
  keywords: string[];
  scenePrompt?: string;
  generatedImageUrl?: string;
  isGenerating?: boolean;
  imageLoadError?: boolean;
}

const DEFAULT_IMAGE_STYLES: ImageStyle[] = [
  { id: 'anime', name: 'anime', displayName: '애니메이션 스타일' },
  { id: 'realistic', name: 'realistic', displayName: '사실적 스타일' },
  { id: 'fairytale', name: 'fairytale', displayName: '동화 스타일' },
  { id: 'cartoon', name: 'cartoon', displayName: '만화 스타일' },
  { id: 'watercolor', name: 'watercolor', displayName: '수채화 스타일' },
  { id: 'digital_art', name: 'digital_art', displayName: '디지털 아트' },
  { id: 'children_book', name: 'children_book', displayName: '동화책 스타일' },
];

const DEFAULT_IMAGE_MOODS: ImageMood[] = [
  { id: 'happy', name: 'happy', displayName: '즐거운' },
  { id: 'sad', name: 'sad', displayName: '슬픈' },
  { id: 'mysterious', name: 'mysterious', displayName: '신비로운' },
  { id: 'adventurous', name: 'adventurous', displayName: '모험적인' },
  { id: 'peaceful', name: 'peaceful', displayName: '평화로운' },
  { id: 'exciting', name: 'exciting', displayName: '흥미진진한' },
  { id: 'magical', name: 'magical', displayName: '마법 같은' },
];

const DEFAULT_COLOR_PALETTES: ImageColorPalette[] = [
  { id: 'vibrant', name: 'vibrant', displayName: '생생한' },
  { id: 'pastel', name: 'pastel', displayName: '파스텔' },
  { id: 'monochrome', name: 'monochrome', displayName: '흑백' },
  { id: 'warm', name: 'warm', displayName: '따뜻한' },
  { id: 'cool', name: 'cool', displayName: '시원한' },
  { id: 'rainbow', name: 'rainbow', displayName: '무지개' },
];

const FairytaleImgGenOptionScreen: React.FC<FairytaleImgGenOptionScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const insets = useSafeAreaInsets();
  const { fairytaleTitle, fairytaleContent, paragraphs: initialParagraphs } = route.params;
  
  // 키워드 관련 상태
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  
  // 문단 관련 상태
  const [paragraphs, setParagraphs] = useState<Paragraph[]>(initialParagraphs || []);
  const [selectedParagraphIndex, setSelectedParagraphIndex] = useState(0);
  const [isParagraphSelectionMode, setIsParagraphSelectionMode] = useState(false);
  
  // 이미지 스타일 관련 상태 (동화에 더 적합한 기본값)
  const [imageStyles, setImageStyles] = useState<ImageStyle[]>(DEFAULT_IMAGE_STYLES);
  const [selectedStyle, setSelectedStyle] = useState<string>('fairytale');
  const [customStyle, setCustomStyle] = useState('');
  const [isCustomStyle, setIsCustomStyle] = useState(false);
  
  // 이미지 분위기 관련 상태 (동화에 더 적합한 기본값)
  const [imageMoods, setImageMoods] = useState<ImageMood[]>(DEFAULT_IMAGE_MOODS);
  const [selectedMood, setSelectedMood] = useState<string>('magical');
  const [customMood, setCustomMood] = useState('');
  const [isCustomMood, setIsCustomMood] = useState(false);
  
  // 이미지 색상 팔레트 관련 상태 (동화에 더 적합한 기본값)
  const [colorPalettes, setColorPalettes] = useState<ImageColorPalette[]>(DEFAULT_COLOR_PALETTES);
  const [selectedColorPalette, setSelectedColorPalette] = useState<string>('rainbow');
  const [customColorPalette, setCustomColorPalette] = useState('');
  const [isCustomColorPalette, setIsCustomColorPalette] = useState(false);
  
  // 추천 이미지 설정 상태
  const [recommendedSettings, setRecommendedSettings] = useState<{
    style?: string;
    mood?: string;
    colorPalette?: string;
  } | null>(null);
  
  // 이미지 업로드 관련 상태
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageInputMode, setImageInputMode] = useState<'text' | 'image'>('text');
  
  // 이미지 생성 관련 상태
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [generationMode, setGenerationMode] = useState<'single' | 'paragraphs' | 'image'>('single');
  
  // 사용자 추가 프롬프트 상태
  const [userPrompt, setUserPrompt] = useState<string>('');

  useEffect(() => {
    // 컴포넌트 마운트 시 AI로부터 키워드 자동 생성
    generateKeywordsFromFairytale();
    
    // 문단에서 추천 이미지 설정 추출
    extractRecommendedSettings();
  }, []);

  const handleBackPress = () => {
    navigation.navigate('FairytaleCreate');
  };

  // 저장 버튼 활성화 여부 확인
  const isSaveButtonEnabled = () => {
    // 단일 이미지가 생성되었거나, 문단별 이미지 중 하나라도 생성되었으면 활성화
    if (generatedImageUrl) return true;
    
    return paragraphs.some(paragraph => paragraph.generatedImageUrl);
  };

  const handleSavePress = () => {
    if (!isSaveButtonEnabled()) return;
    
    // 저장할 데이터 준비
    const saveData = {
      fairytaleTitle,
      fairytaleContent,
      paragraphs: paragraphs.filter(p => p.generatedImageUrl), // 이미지가 생성된 문단만
      generatedImageUrl, // 단일 이미지 URL
      generationMode,
    };
    
    navigation.navigate('FairytaleSaveScreen', saveData);
  };

  const generateKeywordsFromFairytale = async () => {
    if (!fairytaleContent.trim()) return;

    setIsGeneratingKeywords(true);
    try {
      // 문단에서 이미 추출된 키워드 사용 (중복 추출 방지)
      const allKeywords = paragraphs.flatMap(paragraph => paragraph.keywords || []);
      const uniqueKeywords = [...new Set(allKeywords)].slice(0, 10); // 최대 10개로 제한
      
      setKeywords(uniqueKeywords);
      console.log('문단에서 추출된 키워드 사용:', uniqueKeywords);
    } catch (error) {
      console.error('키워드 생성 오류:', error);
      // 기본 키워드 사용
      setKeywords(['동화', '모험', '마법', '상상']);
    } finally {
      setIsGeneratingKeywords(false);
    }
  };

  // 문단에서 추천 이미지 설정 추출
  const extractRecommendedSettings = () => {
    if (paragraphs.length === 0) return;
    
    // 동화에 적합한 추천 설정
    const recommended = {
      style: 'fairytale',
      mood: 'magical',
      colorPalette: 'rainbow'
    };
    
    setRecommendedSettings(recommended);
    
    // 추천 설정을 현재 선택된 값으로 적용
    setSelectedStyle(recommended.style);
    setSelectedMood(recommended.mood);
    setSelectedColorPalette(recommended.colorPalette);
    
    console.log('🎨 [추천 설정] 동화용 이미지 설정:', recommended);
  };

  const generateImageForParagraph = async (paragraphIndex: number) => {
    const paragraph = paragraphs[paragraphIndex];
    if (!paragraph) {
      console.log('❌ [문단 이미지 생성] 문단을 찾을 수 없음:', paragraphIndex);
      return;
    }

    console.log('🎨 [문단 이미지 생성] 시작:', {
      paragraphIndex: paragraphIndex + 1,
      paragraphId: paragraph.id,
      content: paragraph.content.substring(0, TEXT_LIMITS.MAX_DESCRIPTION_PREVIEW) + '...',
      scenePrompt: paragraph.scenePrompt?.substring(0, TEXT_LIMITS.MAX_DESCRIPTION_PREVIEW) + '...',
      selectedStyle
    });

    // 해당 문단의 생성 상태를 true로 설정
    setParagraphs(prev => 
      prev.map((p, i) => 
        i === paragraphIndex ? { ...p, isGenerating: true } : p
      )
    );

    try {
      // 장면 프롬프트를 우선 사용하고, 없으면 문단 내용 사용
      const imageDescription = paragraph.scenePrompt || paragraph.content;
      
      console.log('🎨 [문단 이미지 생성] 이미지 설명 결정:', {
        paragraphIndex: paragraphIndex + 1,
        usingScenePrompt: !!paragraph.scenePrompt,
        fullImageDescription: imageDescription
      });
      
      // AI 이미지 생성 서비스 호출
      const selectedStyleObj = imageStyles.find(style => style.id === selectedStyle);
      const selectedMoodObj = imageMoods.find(mood => mood.id === selectedMood);
      const selectedColorPaletteObj = colorPalettes.find(palette => palette.id === selectedColorPalette);
      
      const styleConfig = { 
        type: (selectedStyleObj?.name || 'fairytale') as any, 
        mood: (selectedMoodObj?.name || 'magical') as any, 
        colorPalette: (selectedColorPaletteObj?.name || 'rainbow') as any 
      };
        
      const result = await imageGenerationService.generateImage(imageDescription, styleConfig);
      
      console.log('🎨 [문단 이미지 생성] 서비스 응답 받음:', {
        paragraphIndex: paragraphIndex + 1,
        resultId: result.id,
        resultDescription: result.description?.substring(0, TEXT_LIMITS.MAX_DESCRIPTION_PREVIEW) + '...'
      });
      
      // 생성된 이미지 URL을 해당 문단에 저장
      setParagraphs(prev => {
        const updatedParagraphs = prev.map((p, i) => 
          i === paragraphIndex ? { ...p, generatedImageUrl: result.url, isGenerating: false } : p
        );
        
        console.log('🎨 [문단 이미지 생성] 상태 업데이트 완료:', {
          paragraphIndex: paragraphIndex + 1,
          updatedParagraphsCount: updatedParagraphs.length
        });
        
        return updatedParagraphs;
      });

    } catch (error) {
      console.error(`❌ [문단 이미지 생성] 문단 ${paragraphIndex + 1} 이미지 생성 오류:`, {
        error: (error as Error).message,
        stack: (error as Error).stack,
        paragraphIndex: paragraphIndex + 1,
        paragraphId: paragraph.id
      });
      
      Alert.alert(
        'AI 이미지 생성 실패', 
        `문단 ${paragraphIndex + 1}의 AI 이미지 생성에 실패했습니다.\n\n실제 AI 모델을 사용할 수 없어 이미지를 생성할 수 없습니다.`,
        [{ text: '확인', style: 'default' }]
      );
      
      // 오류 시 생성 상태를 false로 설정
      setParagraphs(prev => 
        prev.map((p, i) => 
          i === paragraphIndex ? { ...p, isGenerating: false } : p
        )
      );
    }
  };

  const generateAllParagraphImages = async () => {
    for (let i = 0; i < paragraphs.length; i++) {
      await generateImageForParagraph(i);
      // 각 이미지 생성 사이에 잠시 대기 (API 제한 방지)
      await new Promise<void>(resolve => setTimeout(() => resolve(), API_DELAYS.IMAGE_SAVE_DELAY));
    }
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
    setIsCustomStyle(false);
    setCustomStyle('');
  };

  const handleCustomStyleToggle = () => {
    setIsCustomStyle(!isCustomStyle);
    if (!isCustomStyle) {
      setSelectedStyle('');
    }
  };

  const handleCustomStyleAdd = (newStyle: string) => {
    if (newStyle.trim()) {
      const existingStyle = imageStyles.find(style => 
        style.name.toLowerCase() === newStyle.toLowerCase() || 
        style.displayName.toLowerCase() === newStyle.toLowerCase()
      );
      
      if (!existingStyle) {
        const customStyleId = `custom_${Date.now()}`;
        const newCustomStyle: ImageStyle = {
          id: customStyleId,
          name: newStyle,
          displayName: newStyle
        };
        
        setImageStyles(prev => [...prev, newCustomStyle]);
        setSelectedStyle(customStyleId);
        setIsCustomStyle(false);
        setCustomStyle('');
      } else {
        setSelectedStyle(existingStyle.id);
        setIsCustomStyle(false);
        setCustomStyle('');
      }
    }
  };

  // Mood 관련 핸들러들
  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    setIsCustomMood(false);
    setCustomMood('');
  };

  const handleCustomMoodToggle = () => {
    setIsCustomMood(!isCustomMood);
    if (!isCustomMood) {
      setSelectedMood('');
    }
  };

  const handleCustomMoodAdd = (newMood: string) => {
    if (newMood.trim()) {
      const existingMood = imageMoods.find(mood => 
        mood.name.toLowerCase() === newMood.toLowerCase() || 
        mood.displayName.toLowerCase() === newMood.toLowerCase()
      );
      
      if (!existingMood) {
        const customMoodId = `custom_${Date.now()}`;
        const newCustomMood: ImageMood = {
          id: customMoodId,
          name: newMood,
          displayName: newMood
        };
        
        setImageMoods(prev => [...prev, newCustomMood]);
        setSelectedMood(customMoodId);
        setIsCustomMood(false);
        setCustomMood('');
      } else {
        setSelectedMood(existingMood.id);
        setIsCustomMood(false);
        setCustomMood('');
      }
    }
  };

  // Color Palette 관련 핸들러들
  const handleColorPaletteSelect = (colorPaletteId: string) => {
    setSelectedColorPalette(colorPaletteId);
    setIsCustomColorPalette(false);
    setCustomColorPalette('');
  };

  const handleCustomColorPaletteToggle = () => {
    setIsCustomColorPalette(!isCustomColorPalette);
    if (!isCustomColorPalette) {
      setSelectedColorPalette('');
    }
  };

  const handleCustomColorPaletteAdd = (newColorPalette: string) => {
    if (newColorPalette.trim()) {
      const existingColorPalette = colorPalettes.find(palette => 
        palette.name.toLowerCase() === newColorPalette.toLowerCase() || 
        palette.displayName.toLowerCase() === newColorPalette.toLowerCase()
      );
      
      if (!existingColorPalette) {
        const customColorPaletteId = `custom_${Date.now()}`;
        const newCustomColorPalette: ImageColorPalette = {
          id: customColorPaletteId,
          name: newColorPalette,
          displayName: newColorPalette
        };
        
        setColorPalettes(prev => [...prev, newCustomColorPalette]);
        setSelectedColorPalette(customColorPaletteId);
        setIsCustomColorPalette(false);
        setCustomColorPalette('');
      } else {
        setSelectedColorPalette(existingColorPalette.id);
        setIsCustomColorPalette(false);
        setCustomColorPalette('');
      }
    }
  };

  const pickImage = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: IMAGE_CONFIG.MAX_HEIGHT,
      maxWidth: IMAGE_CONFIG.MAX_WIDTH,
      quality: IMAGE_CONFIG.QUALITY as any,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets && response.assets[0]) {
        setSelectedImage(response.assets[0].uri || null);
        setGenerationMode('image');
      }
    });
  };

  const removeImage = () => {
    setSelectedImage(null);
    setGenerationMode('single');
  };

  const handleGenerateImage = async () => {
    if (generationMode === 'image' && !selectedImage) {
      Alert.alert('알림', '이미지를 선택해주세요.');
      return;
    }

    setIsGeneratingImage(true);
    setIsLoading(true);

    try {
      // 서비스 상태 확인
      const status = await imageGenerationService.checkServiceStatus();
      if (!status.isInitialized || !status.canConnect) {
        Alert.alert('오류', '이미지 생성 서비스에 연결할 수 없습니다.');
        return;
      }

      let imageDescription = '';
      
      if (generationMode === 'single') {
        // 단일 이미지: 선택된 문단 사용
        console.log('🎯 [단일 이미지] 선택된 문단으로 이미지 생성:', {
          selectedIndex: selectedParagraphIndex,
          paragraphId: paragraphs[selectedParagraphIndex]?.id
        });
        
        const selectedParagraph = paragraphs[selectedParagraphIndex];
        if (!selectedParagraph) {
          throw new Error('선택된 문단을 찾을 수 없습니다.');
        }
        
        // 장면 프롬프트를 이미지 설명으로 사용
        let baseDescription = selectedParagraph.scenePrompt || selectedParagraph.content;
        
        // 사용자 추가 프롬프트가 있으면 상단에 추가
        if (userPrompt.trim()) {
          imageDescription = `${userPrompt.trim()}, ${baseDescription}`;
        } else {
          imageDescription = baseDescription;
        }
        
        console.log('🎯 [단일 이미지] 문단 정보:', {
          content: selectedParagraph.content.substring(0, 100) + '...',
          scenePrompt: selectedParagraph.scenePrompt?.substring(0, 100) + '...'
        });
      } else {
        // 이미지 기반 생성 (현재는 텍스트로 변환)
        imageDescription = `${fairytaleContent}의 내용을 바탕으로 한 아름다운 동화 이미지`;
      }

      // 이미지 생성 요청
      const selectedStyleObj = imageStyles.find(style => style.id === selectedStyle);
      const selectedMoodObj = imageMoods.find(mood => mood.id === selectedMood);
      const selectedColorPaletteObj = colorPalettes.find(palette => palette.id === selectedColorPalette);
      
      const styleConfig = { 
        type: (selectedStyleObj?.name || 'fairytale') as any, 
        mood: (selectedMoodObj?.name || 'magical') as any, 
        colorPalette: (selectedColorPaletteObj?.name || 'rainbow') as any 
      };

      console.log('🎯 [단일 이미지 생성] AI 요청 프롬프트:', {
        imageDescription: imageDescription,
        styleConfig: styleConfig
      });

      const generatedImage = await imageGenerationService.generateImage(imageDescription, styleConfig);
      
      setGeneratedImageUrl(generatedImage.url);
      
      Alert.alert('성공', '이미지가 성공적으로 생성되었습니다!');
      
    } catch (error) {
      console.error('이미지 생성 오류:', error);
      Alert.alert(
        'AI 이미지 생성 실패', 
        'AI 이미지 생성에 실패했습니다.\n\n실제 AI 모델을 사용할 수 없어 이미지를 생성할 수 없습니다.',
        [{ text: '확인', style: 'default' }]
      );
    } finally {
      setIsGeneratingImage(false);
      setIsLoading(false);
    }
  };

  const renderKeywordItem = (keyword: string, index: number) => (
    <View key={index} style={styles.keywordItem}>
      <Text style={styles.keywordText}>{keyword}</Text>
      <TouchableOpacity
        onPress={() => removeKeyword(index)}
        style={styles.removeKeywordButton}
      >
        <Text style={styles.removeKeywordText}>×</Text>
      </TouchableOpacity>
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
            <Text style={styles.headerTitle}>이미지 생성 옵션</Text>
          </View>
          
          <TouchableOpacity 
            onPress={handleSavePress} 
            style={[
              styles.saveButton,
              !isSaveButtonEnabled() && styles.saveButtonDisabled
            ]}
            disabled={!isSaveButtonEnabled()}
          >
            <DiskIcon size={24} color={isSaveButtonEnabled() ? "#4884FF" : "#CCCCCC"} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 동화 미리보기 */}
        <View style={styles.fairytalePreview}>
          <Text style={styles.fairytaleTitle}>{fairytaleTitle}</Text>
          <Text style={styles.fairytaleContent} numberOfLines={3}>
            {fairytaleContent}
          </Text>
        </View>

        {/* 추천 이미지 설정 표시 */}
        {recommendedSettings && (
          <View style={styles.recommendedSettingsContainer}>
            <Text style={styles.recommendedSettingsTitle}>🎨 AI 추천 이미지 설정</Text>
            <View style={styles.recommendedSettingsContent}>
              <Text style={styles.recommendedSettingsText}>
                스타일: {imageStyles.find(s => s.id === recommendedSettings.style)?.displayName || recommendedSettings.style}
              </Text>
              <Text style={styles.recommendedSettingsText}>
                분위기: {imageMoods.find(m => m.id === recommendedSettings.mood)?.displayName || recommendedSettings.mood}
              </Text>
              <Text style={styles.recommendedSettingsText}>
                색상: {colorPalettes.find(c => c.id === recommendedSettings.colorPalette)?.displayName || recommendedSettings.colorPalette}
              </Text>
            </View>
            <Text style={styles.recommendedSettingsNote}>
              아래에서 원하는 대로 변경할 수 있습니다
            </Text>
          </View>
        )}

        {/* 생성 방식 선택 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>생성 방식</Text>
          <View style={styles.modeSelector}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                generationMode === 'single' && styles.modeButtonActive,
                isLoading && styles.modeButtonDisabled
              ]}
              onPress={() => !isLoading && setGenerationMode('single')}
              disabled={isLoading}
            >
              <Text style={[
                styles.modeButtonText,
                generationMode === 'single' && styles.modeButtonTextActive,
                isLoading && styles.modeButtonTextDisabled
              ]}>
                단일 이미지
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                generationMode === 'paragraphs' && styles.modeButtonActive,
                isLoading && styles.modeButtonDisabled
              ]}
              onPress={() => !isLoading && setGenerationMode('paragraphs')}
              disabled={isLoading}
            >
              <Text style={[
                styles.modeButtonText,
                generationMode === 'paragraphs' && styles.modeButtonTextActive,
                isLoading && styles.modeButtonTextDisabled
              ]}>
                문단별 이미지
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 문단별 이미지 생성 모드 */}
        {generationMode === 'paragraphs' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>문단별 이미지 생성</Text>
            
            {paragraphs.length === 0 ? (
              <View style={styles.paragraphProcessSection}>
                <Text style={styles.paragraphProcessText}>
                  문단 데이터가 없습니다. 동화 작성 화면에서 다시 시도해주세요.
                </Text>
              </View>
            ) : (
              <View style={styles.paragraphsContainer}>
                <View style={styles.paragraphsHeader}>
                  <Text style={styles.paragraphsCount}>
                    총 {paragraphs.length}개 문단
                  </Text>
                  <TouchableOpacity
                    style={styles.generateAllButton}
                    onPress={generateAllParagraphImages}
                  >
                    <Text style={styles.generateAllButtonText}>모든 이미지 생성</Text>
                  </TouchableOpacity>
                </View>
                
                {/* 문단별 이미지용 스타일 선택 UI */}
                <View style={styles.imageSettingsContainer}>
                  {/* 이미지 스타일 선택 */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>이미지 스타일</Text>
                    <View style={styles.optionsContainer}>
                      {imageStyles.map((style) => (
                        <TouchableOpacity
                          key={style.id}
                          style={[
                            styles.optionButton,
                            selectedStyle === style.id && styles.optionButtonActive
                          ]}
                          onPress={() => handleStyleSelect(style.id)}
                        >
                          <Text style={[
                            styles.optionButtonText,
                            selectedStyle === style.id && styles.optionButtonTextActive
                          ]}>
                            {style.displayName}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    
                    {/* 커스텀 스타일 입력 */}
                    <View style={styles.customOptionContainer}>
                      <TouchableOpacity
                        style={[
                          styles.customOptionToggle,
                          isCustomStyle && styles.customOptionToggleActive
                        ]}
                        onPress={handleCustomStyleToggle}
                      >
                        <Text style={[
                          styles.customOptionToggleText,
                          isCustomStyle && styles.customOptionToggleTextActive
                        ]}>
                          + 커스텀 스타일
                        </Text>
                      </TouchableOpacity>
                      
                      {isCustomStyle && (
                        <View style={styles.customOptionInputContainer}>
                          <TextInput
                            style={styles.customOptionInput}
                            placeholder="스타일을 입력하세요"
                            value={customStyle}
                            onChangeText={setCustomStyle}
                            onSubmitEditing={() => handleCustomStyleAdd(customStyle)}
                          />
                          <TouchableOpacity
                            style={styles.customOptionAddButton}
                            onPress={() => handleCustomStyleAdd(customStyle)}
                          >
                            <Text style={styles.customOptionAddButtonText}>추가</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  {/* 이미지 분위기 선택 */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>이미지 분위기</Text>
                    <View style={styles.optionsContainer}>
                      {imageMoods.map((mood) => (
                        <TouchableOpacity
                          key={mood.id}
                          style={[
                            styles.optionButton,
                            selectedMood === mood.id && styles.optionButtonActive
                          ]}
                          onPress={() => handleMoodSelect(mood.id)}
                        >
                          <Text style={[
                            styles.optionButtonText,
                            selectedMood === mood.id && styles.optionButtonTextActive
                          ]}>
                            {mood.displayName}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    
                    {/* 커스텀 분위기 입력 */}
                    <View style={styles.customOptionContainer}>
                      <TouchableOpacity
                        style={[
                          styles.customOptionToggle,
                          isCustomMood && styles.customOptionToggleActive
                        ]}
                        onPress={handleCustomMoodToggle}
                      >
                        <Text style={[
                          styles.customOptionToggleText,
                          isCustomMood && styles.customOptionToggleTextActive
                        ]}>
                          + 커스텀 분위기
                        </Text>
                      </TouchableOpacity>
                      
                      {isCustomMood && (
                        <View style={styles.customOptionInputContainer}>
                          <TextInput
                            style={styles.customOptionInput}
                            placeholder="분위기를 입력하세요"
                            value={customMood}
                            onChangeText={setCustomMood}
                            onSubmitEditing={() => handleCustomMoodAdd(customMood)}
                          />
                          <TouchableOpacity
                            style={styles.customOptionAddButton}
                            onPress={() => handleCustomMoodAdd(customMood)}
                          >
                            <Text style={styles.customOptionAddButtonText}>추가</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  {/* 이미지 색상 팔레트 선택 */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>색상 팔레트</Text>
                    <View style={styles.optionsContainer}>
                      {colorPalettes.map((palette) => (
                        <TouchableOpacity
                          key={palette.id}
                          style={[
                            styles.optionButton,
                            selectedColorPalette === palette.id && styles.optionButtonActive
                          ]}
                          onPress={() => handleColorPaletteSelect(palette.id)}
                        >
                          <Text style={[
                            styles.optionButtonText,
                            selectedColorPalette === palette.id && styles.optionButtonTextActive
                          ]}>
                            {palette.displayName}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    
                    {/* 커스텀 색상 팔레트 입력 */}
                    <View style={styles.customOptionContainer}>
                      <TouchableOpacity
                        style={[
                          styles.customOptionToggle,
                          isCustomColorPalette && styles.customOptionToggleActive
                        ]}
                        onPress={handleCustomColorPaletteToggle}
                      >
                        <Text style={[
                          styles.customOptionToggleText,
                          isCustomColorPalette && styles.customOptionToggleTextActive
                        ]}>
                          + 커스텀 색상 팔레트
                        </Text>
                      </TouchableOpacity>
                      
                      {isCustomColorPalette && (
                        <View style={styles.customOptionInputContainer}>
                          <TextInput
                            style={styles.customOptionInput}
                            placeholder="색상 팔레트를 입력하세요"
                            value={customColorPalette}
                            onChangeText={setCustomColorPalette}
                            onSubmitEditing={() => handleCustomColorPaletteAdd(customColorPalette)}
                          />
                          <TouchableOpacity
                            style={styles.customOptionAddButton}
                            onPress={() => handleCustomColorPaletteAdd(customColorPalette)}
                          >
                            <Text style={styles.customOptionAddButtonText}>추가</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
                
                {paragraphs.map((paragraph, index) => (
                  <View key={paragraph.id} style={styles.paragraphItem}>
                    <View style={styles.paragraphHeader}>
                      <Text style={styles.paragraphNumber}>문단 {index + 1}</Text>
                      <TouchableOpacity
                        style={[
                          styles.generateParagraphButton,
                          paragraph.isGenerating && styles.generateParagraphButtonDisabled
                        ]}
                        onPress={() => generateImageForParagraph(index)}
                        disabled={paragraph.isGenerating}
                      >
                        {paragraph.isGenerating ? (
                          <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : null}
                        <Text style={styles.generateParagraphButtonText}>
                          {paragraph.isGenerating ? '생성 중...' : '이미지 생성'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    
                    <Text style={styles.paragraphContent}>{paragraph.content}</Text>
                    
                    {paragraph.scenePrompt && (
                      <View style={styles.paragraphScenePrompt}>
                        <Text style={styles.paragraphScenePromptLabel}>장면 프롬프트:</Text>
                        <Text style={styles.paragraphScenePromptText}>{paragraph.scenePrompt}</Text>
                      </View>
                    )}
                    
                    <View style={styles.paragraphKeywords}>
                      <Text style={styles.paragraphKeywordsLabel}>키워드:</Text>
                      <View style={styles.paragraphKeywordsList}>
                        {paragraph.keywords.map((keyword, keywordIndex) => (
                          <View key={keywordIndex} style={styles.paragraphKeywordTag}>
                            <Text style={styles.paragraphKeywordText}>{keyword}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    
                    {paragraph.generatedImageUrl && (
                      <View style={styles.paragraphImageContainer}>
                        {paragraph.imageLoadError ? (
                          <View style={styles.imageErrorContainer}>
                            <Text style={styles.imageErrorText}>
                              ❌ 이미지를 불러올 수 없습니다
                            </Text>
                            <TouchableOpacity 
                              style={styles.retryImageButton}
                              onPress={() => {
                                setParagraphs(prev => 
                                  prev.map((p, i) => 
                                    i === index ? { ...p, imageLoadError: false } : p
                                  )
                                );
                              }}
                            >
                              <Text style={styles.retryImageButtonText}>다시 시도</Text>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <Image
                            source={{ uri: paragraph.generatedImageUrl }}
                            style={styles.paragraphImage}
                            resizeMode="cover"
                            onLoad={() => {
                              console.log('✅ [이미지 표시] 이미지 로드 성공:', {
                                paragraphIndex: index + 1,
                                url: paragraph.generatedImageUrl
                              });
                            }}
                            onError={(error) => {
                              console.error('❌ [이미지 표시] 이미지 로드 실패:', {
                                paragraphIndex: index + 1,
                                url: paragraph.generatedImageUrl,
                                error: error.nativeEvent
                              });
                              
                              setParagraphs(prev => 
                                prev.map((p, i) => 
                                  i === index ? { ...p, imageLoadError: true } : p
                                )
                              );
                            }}
                          />
                        )}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* 단일 이미지 생성 옵션 */}
        {generationMode === 'single' && (
          <>
            {/* 문단 선택 섹션 */}
            {paragraphs.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {isParagraphSelectionMode ? '문단 선택' : '선택된 문단'}
                </Text>
                
                {isParagraphSelectionMode ? (
                  // 전체 문단 목록 표시
                  <View style={styles.paragraphSelectionContainer}>
                    {paragraphs.map((paragraph, index) => (
                      <TouchableOpacity
                        key={paragraph.id}
                        style={[
                          styles.paragraphSelectionCard,
                          index === selectedParagraphIndex && styles.paragraphSelectionCardSelected
                        ]}
                        onPress={() => {
                          setSelectedParagraphIndex(index);
                          setIsParagraphSelectionMode(false);
                        }}
                      >
                        <Text style={styles.paragraphSelectionNumber}>문단 {index + 1}</Text>
                        <Text style={styles.paragraphSelectionContent}>
                          {paragraph.content.substring(0, 100)}...
                        </Text>
                        {paragraph.scenePrompt && (
                          <Text style={styles.paragraphSelectionPrompt}>
                            {paragraph.scenePrompt.substring(0, 80)}...
                          </Text>
                        )}
                        <View style={styles.paragraphSelectionKeywords}>
                          {paragraph.keywords.slice(0, 3).map((keyword, i) => (
                            <Text key={i} style={styles.paragraphSelectionKeyword}>
                              {keyword}
                            </Text>
                          ))}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  // 선택된 문단만 표시
                  <TouchableOpacity
                    style={styles.selectedParagraphCard}
                    onPress={() => setIsParagraphSelectionMode(true)}
                  >
                    <View style={styles.selectedParagraphHeader}>
                      <Text style={styles.selectedParagraphNumber}>
                        문단 {selectedParagraphIndex + 1}
                      </Text>
                      <Text style={styles.changeParagraphText}>변경</Text>
                    </View>
                    <Text style={styles.selectedParagraphContent}>
                      {paragraphs[selectedParagraphIndex]?.content}
                    </Text>
                    {paragraphs[selectedParagraphIndex]?.scenePrompt && (
                      <Text style={styles.selectedParagraphPrompt}>
                        {paragraphs[selectedParagraphIndex].scenePrompt}
                      </Text>
                    )}
                    <View style={styles.selectedParagraphKeywords}>
                      {paragraphs[selectedParagraphIndex]?.keywords.slice(0, 5).map((keyword, i) => (
                        <Text key={i} style={styles.selectedParagraphKeyword}>
                          {keyword}
                        </Text>
                      ))}
                    </View>
                    
                    {/* 사용자 추가 프롬프트 입력란 */}
                    <View style={styles.userPromptSection}>
                      <Text style={styles.userPromptLabel}>추가 요구사항 (선택사항)</Text>
                      <TextInput
                        style={styles.userPromptInput}
                        value={userPrompt}
                        onChangeText={setUserPrompt}
                        placeholder="이미지에 추가하고 싶은 요소를 입력하세요 (예: 마법의 빛, 환상적인 분위기 등)"
                        placeholderTextColor="#999999"
                        multiline
                        numberOfLines={3}
                        maxLength={200}
                      />
                      <Text style={styles.userPromptCounter}>
                        {userPrompt.length}/200
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* 이미지 설정 섹션 */}
            <View style={styles.imageSettingsContainer}>
              {/* 이미지 스타일 선택 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>이미지 스타일</Text>
                <View style={styles.optionsContainer}>
                  {imageStyles.map((style) => (
                    <TouchableOpacity
                      key={style.id}
                      style={[
                        styles.optionButton,
                        selectedStyle === style.id && styles.optionButtonActive
                      ]}
                      onPress={() => handleStyleSelect(style.id)}
                    >
                      <Text style={[
                        styles.optionButtonText,
                        selectedStyle === style.id && styles.optionButtonTextActive
                      ]}>
                        {style.displayName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                {/* 커스텀 스타일 입력 */}
                <View style={styles.customOptionContainer}>
                  <TouchableOpacity
                    style={[
                      styles.customOptionToggle,
                      isCustomStyle && styles.customOptionToggleActive
                    ]}
                    onPress={handleCustomStyleToggle}
                  >
                    <Text style={[
                      styles.customOptionToggleText,
                      isCustomStyle && styles.customOptionToggleTextActive
                    ]}>
                      + 커스텀 스타일
                    </Text>
                  </TouchableOpacity>
                  
                  {isCustomStyle && (
                    <View style={styles.customOptionInputContainer}>
                      <TextInput
                        style={styles.customOptionInput}
                        placeholder="스타일을 입력하세요"
                        value={customStyle}
                        onChangeText={setCustomStyle}
                        onSubmitEditing={() => handleCustomStyleAdd(customStyle)}
                      />
                      <TouchableOpacity
                        style={styles.customOptionAddButton}
                        onPress={() => handleCustomStyleAdd(customStyle)}
                      >
                        <Text style={styles.customOptionAddButtonText}>추가</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
              
              {/* 이미지 분위기 선택 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>이미지 분위기</Text>
                <View style={styles.optionsContainer}>
                  {imageMoods.map((mood) => (
                    <TouchableOpacity
                      key={mood.id}
                      style={[
                        styles.optionButton,
                        selectedMood === mood.id && styles.optionButtonActive
                      ]}
                      onPress={() => handleMoodSelect(mood.id)}
                    >
                      <Text style={[
                        styles.optionButtonText,
                        selectedMood === mood.id && styles.optionButtonTextActive
                      ]}>
                        {mood.displayName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                {/* 커스텀 분위기 입력 */}
                <View style={styles.customOptionContainer}>
                  <TouchableOpacity
                    style={[
                      styles.customOptionToggle,
                      isCustomMood && styles.customOptionToggleActive
                    ]}
                    onPress={handleCustomMoodToggle}
                  >
                    <Text style={[
                      styles.customOptionToggleText,
                      isCustomMood && styles.customOptionToggleTextActive
                    ]}>
                      + 커스텀 분위기
                    </Text>
                  </TouchableOpacity>
                  
                  {isCustomMood && (
                    <View style={styles.customOptionInputContainer}>
                      <TextInput
                        style={styles.customOptionInput}
                        placeholder="분위기를 입력하세요"
                        value={customMood}
                        onChangeText={setCustomMood}
                        onSubmitEditing={() => handleCustomMoodAdd(customMood)}
                      />
                      <TouchableOpacity
                        style={styles.customOptionAddButton}
                        onPress={() => handleCustomMoodAdd(customMood)}
                      >
                        <Text style={styles.customOptionAddButtonText}>추가</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
              
              {/* 이미지 색상 팔레트 선택 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>색상 팔레트</Text>
                <View style={styles.optionsContainer}>
                  {colorPalettes.map((palette) => (
                    <TouchableOpacity
                      key={palette.id}
                      style={[
                        styles.optionButton,
                        selectedColorPalette === palette.id && styles.optionButtonActive
                      ]}
                      onPress={() => handleColorPaletteSelect(palette.id)}
                    >
                      <Text style={[
                        styles.optionButtonText,
                        selectedColorPalette === palette.id && styles.optionButtonTextActive
                      ]}>
                        {palette.displayName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                {/* 커스텀 색상 팔레트 입력 */}
                <View style={styles.customOptionContainer}>
                  <TouchableOpacity
                    style={[
                      styles.customOptionToggle,
                      isCustomColorPalette && styles.customOptionToggleActive
                    ]}
                    onPress={handleCustomColorPaletteToggle}
                  >
                    <Text style={[
                      styles.customOptionToggleText,
                      isCustomColorPalette && styles.customOptionToggleTextActive
                    ]}>
                      + 커스텀 색상 팔레트
                    </Text>
                  </TouchableOpacity>
                  
                  {isCustomColorPalette && (
                    <View style={styles.customOptionInputContainer}>
                      <TextInput
                        style={styles.customOptionInput}
                        placeholder="색상 팔레트를 입력하세요"
                        value={customColorPalette}
                        onChangeText={setCustomColorPalette}
                        onSubmitEditing={() => handleCustomColorPaletteAdd(customColorPalette)}
                      />
                      <TouchableOpacity
                        style={styles.customOptionAddButton}
                        onPress={() => handleCustomColorPaletteAdd(customColorPalette)}
                      >
                        <Text style={styles.customOptionAddButtonText}>추가</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </>
        )}

        {/* 이미지 기반 생성 옵션 */}
        {generationMode === 'image' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>참조 이미지</Text>
            
            {selectedImage ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                <TouchableOpacity
                  onPress={removeImage}
                  style={styles.removeImageButton}
                >
                  <Text style={styles.removeImageButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.imageUploadButton} onPress={pickImage}>
                <Text style={styles.imageUploadButtonText}>이미지 선택</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* 생성된 이미지 표시 */}
        {(isGeneratingImage || generatedImageUrl) && (
          <View style={styles.generatedImageSection}>
            <Text style={styles.sectionTitle}>생성된 이미지</Text>
            
            {isGeneratingImage ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4884FF" />
                <Text style={styles.loadingText}>이미지를 생성하고 있습니다...</Text>
                <Text style={styles.loadingSubText}>잠시만 기다려주세요</Text>
              </View>
            ) : generatedImageUrl ? (
              <View style={styles.generatedImageContainer}>
                <Image source={{ uri: generatedImageUrl }} style={styles.generatedImage} />
                <TouchableOpacity
                  style={styles.saveImageButton}
                  onPress={() => {
                    Alert.alert('알림', '이미지 저장 기능은 준비 중입니다.');
                  }}
                >
                  <Text style={styles.saveImageButtonText}>이미지 저장</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        )}

        {/* 생성 버튼 - 문단별 이미지 모드에서는 숨김 */}
        {generationMode !== 'paragraphs' && (
          <TouchableOpacity 
            style={[
              styles.generateButton,
              isLoading && styles.generateButtonDisabled
            ]} 
            onPress={handleGenerateImage}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isGeneratingImage ? (
              <View style={styles.buttonLoadingContent}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={[styles.generateButtonText, { marginLeft: 8 }]}>
                  {generationMode === 'single' ? '장면 분석 중...' : '생성 중...'}
                </Text>
              </View>
            ) : (
              <Text style={styles.generateButtonText}>
                {generationMode === 'single' ? '단일 이미지 생성' : '이미지 생성'}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

// DiaryImgGenOptionScreen과 동일한 스타일 사용 (일부 색상만 변경)
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
  fairytalePreview: {
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  fairytaleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  fairytaleContent: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 10,
    letterSpacing: -0.8,
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  modeButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modeButtonText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  modeButtonTextActive: {
    color: '#333333',
    fontWeight: '600',
  },
  modeButtonDisabled: {
    opacity: 0.5,
  },
  modeButtonTextDisabled: {
    color: '#999999',
  },
  keywordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  keywordText: {
    fontSize: 14,
    color: '#1976D2',
    marginRight: 6,
  },
  removeKeywordButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#1976D2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeKeywordText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  generateButton: {
    backgroundColor: '#4884FF',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 40,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.8,
  },
  generateButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonLoadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  generatedImageSection: {
    marginBottom: 25,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginTop: 15,
    marginBottom: 5,
  },
  loadingSubText: {
    fontSize: 14,
    color: '#666666',
  },
  generatedImageContainer: {
    alignItems: 'center',
  },
  generatedImage: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 10,
    marginBottom: 15,
  },
  saveImageButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveImageButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // 문단별 이미지 생성 스타일
  paragraphProcessSection: {
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    alignItems: 'center',
  },
  paragraphProcessText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  paragraphsContainer: {
    marginTop: 10,
  },
  paragraphsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  paragraphsCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  generateAllButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  generateAllButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  paragraphItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paragraphHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paragraphNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
  },
  generateParagraphButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  generateParagraphButtonDisabled: {
    backgroundColor: '#BBDEFB',
  },
  generateParagraphButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  paragraphContent: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    marginBottom: 12,
  },
  paragraphScenePrompt: {
    marginBottom: 12,
    backgroundColor: '#F0F8FF',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  paragraphScenePromptLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 6,
  },
  paragraphScenePromptText: {
    fontSize: 13,
    color: '#424242',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  paragraphKeywords: {
    marginBottom: 12,
  },
  paragraphKeywordsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
  },
  paragraphKeywordsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  paragraphKeywordTag: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  paragraphKeywordText: {
    fontSize: 12,
    color: '#2E7D32',
  },
  // 단일 이미지용 스타일
  paragraphSelectionContainer: {
    marginBottom: 16,
  },
  paragraphSelectionCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  paragraphSelectionCardSelected: {
    borderColor: '#4CAF50',
    borderWidth: 2,
    backgroundColor: '#F8F9FA',
  },
  paragraphSelectionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 8,
  },
  paragraphSelectionContent: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
    marginBottom: 8,
  },
  paragraphSelectionPrompt: {
    fontSize: 13,
    color: '#666666',
    fontStyle: 'italic',
    lineHeight: 18,
    marginBottom: 8,
  },
  paragraphSelectionKeywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  paragraphSelectionKeyword: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
    fontSize: 12,
    color: '#2E7D32',
  },
  selectedParagraphCard: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    marginBottom: 8,
  },
  selectedParagraphHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedParagraphNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  changeParagraphText: {
    fontSize: 14,
    color: '#1976D2',
    textDecorationLine: 'underline',
  },
  selectedParagraphContent: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
    marginBottom: 8,
  },
  selectedParagraphPrompt: {
    fontSize: 13,
    color: '#666666',
    fontStyle: 'italic',
    lineHeight: 18,
    marginBottom: 8,
  },
  selectedParagraphKeywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedParagraphKeyword: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
    fontSize: 12,
    color: '#2E7D32',
  },
  paragraphImageContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  paragraphImage: {
    width: '100%',
    minHeight: 150,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  imageErrorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFCDD2',
    minHeight: IMAGE_CONFIG.DEFAULT_HEIGHT,
    justifyContent: 'center',
  },
  imageErrorText: {
    fontSize: 14,
    color: '#C62828',
    marginBottom: 12,
    textAlign: 'center',
  },
  retryImageButton: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryImageButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  // 이미지 설정 UI 스타일
  imageSettingsContainer: {
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    marginRight: 10,
    marginBottom: 10,
  },
  optionButtonActive: {
    backgroundColor: '#4884FF',
    borderColor: '#4884FF',
  },
  optionButtonText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  optionButtonTextActive: {
    color: '#FFFFFF',
  },
  customOptionContainer: {
    marginTop: 8,
    marginBottom: 5,
  },
  customOptionToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  customOptionToggleActive: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  customOptionToggleText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
  customOptionToggleTextActive: {
    color: '#1976D2',
    fontWeight: '600',
  },
  customOptionInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  customOptionInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 14,
    color: '#333333',
    marginRight: 10,
  },
  customOptionAddButton: {
    backgroundColor: '#4884FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  customOptionAddButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  // 추천 설정 UI 스타일
  recommendedSettingsContainer: {
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  recommendedSettingsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 12,
  },
  recommendedSettingsContent: {
    marginBottom: 8,
  },
  recommendedSettingsText: {
    fontSize: 14,
    color: '#424242',
    marginBottom: 4,
    lineHeight: 20,
  },
  recommendedSettingsNote: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
  },
  imagePreviewContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  imagePreview: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageUploadButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  imageUploadButtonText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  // 사용자 프롬프트 스타일
  userPromptSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8F5E8',
  },
  userPromptLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 8,
  },
  userPromptInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333333',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  userPromptCounter: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'right',
    marginTop: 4,
  },
});

export default FairytaleImgGenOptionScreen;
