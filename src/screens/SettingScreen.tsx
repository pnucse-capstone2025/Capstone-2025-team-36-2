import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONT_SIZES, FONT_WEIGHTS, COLORS, SPACING } from '../constants/styleConstants';
import { useAuth } from '../contexts/AuthContext';
import { signOutUser } from '../services/authService';

const { width, height } = Dimensions.get('window');

interface SettingScreenProps {
  navigation: any;
}

const SettingScreen: React.FC<SettingScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: async () => {
            const result = await signOutUser();
            if (!result.success) {
              Alert.alert('오류', result.error || '로그아웃에 실패했습니다.');
            }
          },
        },
      ]
    );
  };


  const handleAccountInfo = () => {
    Alert.alert(
      '계정 정보',
      `이메일: ${user?.email || 'N/A'}\n사용자명: ${user?.displayName || 'N/A'}`,
      [{ text: '확인' }]
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <ScrollView style={[styles.content, { paddingTop: insets.top }]}>
          {/* 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>← 돌아가기</Text>
            </TouchableOpacity>
            <Text style={styles.title}>설정</Text>
            <View style={styles.placeholder} />
          </View>

          {/* 사용자 정보 섹션 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>계정</Text>
            <View style={styles.userInfo}>
              <Text style={styles.welcomeText}>
                안녕하세요, {user?.displayName || '사용자'}님!
              </Text>
              <Text style={styles.emailText}>{user?.email}</Text>
            </View>
          </View>

          {/* 설정 옵션들 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>기능</Text>
            
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleAccountInfo}
              activeOpacity={0.7}
            >
              <Text style={styles.settingItemText}>계정 정보 보기</Text>
              <Text style={styles.settingItemArrow}>›</Text>
            </TouchableOpacity>

          </View>

          {/* 로그아웃 섹션 */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <Text style={styles.logoutButtonText}>로그아웃</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

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
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 30,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.WHITE,
    fontWeight: FONT_WEIGHTS.MEDIUM,
  },
  title: {
    fontSize: FONT_SIZES.TITLE,
    fontWeight: FONT_WEIGHTS.REGULAR,
    color: COLORS.WHITE,
    fontFamily: 'JalnanOTF',
  },
  placeholder: {
    width: 60,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: FONT_WEIGHTS.BOLD,
    color: COLORS.WHITE,
    marginBottom: 15,
    letterSpacing: -0.9,
  },
  userInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 18,
    color: COLORS.WHITE,
    fontWeight: FONT_WEIGHTS.BOLD,
    marginBottom: 5,
  },
  emailText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: FONT_WEIGHTS.REGULAR,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
  },
  settingItemText: {
    fontSize: 16,
    color: COLORS.WHITE,
    fontWeight: FONT_WEIGHTS.MEDIUM,
  },
  settingItemArrow: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: FONT_WEIGHTS.BOLD,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: FONT_WEIGHTS.BOLD,
  },
});

export default SettingScreen;
