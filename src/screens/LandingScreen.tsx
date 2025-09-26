import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

interface LandingScreenProps {
  navigation: any;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { isLoggedIn, isLoading } = useAuth();

  // 로그인된 사용자는 Main 화면으로 리다이렉트
  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      navigation.replace('Main');
    }
  }, [isLoggedIn, isLoading, navigation]);

  const handleLoginPress = () => {
    navigation.navigate('SignIn');
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
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLoginPress}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Story Pixel 로그인</Text>
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
    fontSize: 48,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: -2.4,
    fontFamily: 'JalnanOTF',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 40,
    letterSpacing: -1,
  },
  loginButton: {
    backgroundColor: '#4884FF',
    width: 290,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.8,
  },
});

export default LandingScreen;
