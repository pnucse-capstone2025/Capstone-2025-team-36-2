import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONT_SIZES, FONT_WEIGHTS, COLORS, SPACING } from '../constants/styleConstants';
import { useAuth } from '../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

interface MainScreenProps {
  navigation: any;
}

const MainScreen: React.FC<MainScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { isLoggedIn, isLoading } = useAuth();

  // 비로그인 사용자는 Landing 화면으로 리다이렉트
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigation.replace('Landing');
    }
  }, [isLoggedIn, isLoading, navigation]);

  const handleDiaryPress = () => {
    navigation.navigate('Diary');
  };

  const handleStoryPress = () => {
    navigation.navigate('Fairytale');
  };

  // 다른 친구의 이야기 버튼 핸들러 - 임시 비활성화
  // const handleOtherStoriesPress = () => {
  //   // TODO: 다른 친구의 이야기 화면으로 이동
  //   console.log('다른 친구의 이야기 버튼 클릭');
  // };
  

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={[styles.content, { paddingTop: insets.top }]}>
          <Text style={styles.title}>Story Pixel</Text>
          <Text style={styles.subtitle}>
            일상을 기록하고,{'\n'}그림으로 간직하세요
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.menuButton, { backgroundColor: '#2196F3' }]}
              onPress={handleDiaryPress}
              activeOpacity={0.8}
            >
              <Text style={styles.menuButtonText}>일기장</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuButton, { backgroundColor: '#FF9800' }]}
              onPress={handleStoryPress}
              activeOpacity={0.8}
            >
              <Text style={styles.menuButtonText}>동화</Text>
            </TouchableOpacity>

            {/* 다른 친구의 이야기 버튼 - 임시 비활성화 */}
            {/* <TouchableOpacity
              style={[styles.menuButton, { backgroundColor: '#9C27B0' }]}
              onPress={handleOtherStoriesPress}
              activeOpacity={0.8}
            >
              <Text style={styles.menuButtonText}>다른 친구의 이야기</Text>
            </TouchableOpacity> */}
          </View>

          <TouchableOpacity
            onPress={handleSettingsPress}
            style={styles.settingsButton}
          >
            <Text style={styles.settingsButtonText}>설정</Text>
          </TouchableOpacity>

        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: FONT_SIZES.TITLE,
    fontWeight: FONT_WEIGHTS.REGULAR,
    color: COLORS.WHITE,
    textAlign: 'center',
    marginBottom: SPACING.LG,
    letterSpacing: -2.4,
    fontFamily: 'JalnanOTF',
  },
  subtitle: {
    fontSize: FONT_SIZES.SUBTITLE,
    fontWeight: FONT_WEIGHTS.REGULAR,
    color: COLORS.WHITE,
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 50,
    letterSpacing: -1,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 290,
  },
  menuButton: {
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuButtonText: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: FONT_WEIGHTS.SEMIBOLD,
    color: COLORS.WHITE,
    letterSpacing: -0.8,
  },
  settingsButton: {
    marginTop: 40,
  },
  settingsButtonText: {
    fontSize: FONT_SIZES.CAPTION,
    fontWeight: FONT_WEIGHTS.REGULAR,
    color: COLORS.TRANSPARENT_WHITE,
    textDecorationLine: 'underline',
    letterSpacing: -0.7,
  },
});

export default MainScreen;
