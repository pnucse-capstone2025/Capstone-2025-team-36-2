import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import { UI_CONSTANTS } from '../constants/apiConstants';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

import LandingScreen from '../screens/LandingScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import MainScreen from '../screens/MainScreen';
import SettingScreen from '../screens/SettingScreen';
import DiaryScreen from '../screens/DiaryScreen';
import DiaryCreateScreen from '../screens/DiaryCreateScreen';
import DiaryImgGenOptionScreen from '../screens/DiaryImgGenOptionScreen';
import DiarySaveScreen from '../screens/DiarySaveScreen';
import DiaryDetailViewScreen from '../screens/DiaryDetailViewScreen';
import FairytaleScreen from '../screens/FairytaleScreen';
import FairytaleCreateScreen from '../screens/FairytaleCreateScreen';
import FairytaleImgGenOptionScreen from '../screens/FairytaleImgGenOptionScreen';
import FairytaleSaveScreen from '../screens/FairytaleSaveScreen';
import FairytaleDetailViewScreen from '../screens/FairytaleDetailViewScreen';

export type RootStackParamList = {
  Landing: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ResetPassword: undefined;
  Main: undefined;
  Settings: undefined;
  Diary: undefined;
  DiaryCreate: undefined;
  DiaryDetail: {
    diaryId: string;
  };
  DiaryImgGenOption: {
    diaryTitle: string;
    diaryContent: string;
    paragraphs?: Array<{
      id: string;
      content: string;
      keywords: string[];
      scenePrompt?: string;
      generatedImageUrl?: string;
      isGenerating?: boolean;
      imageLoadError?: boolean;
    }>;
  };
  DiarySaveScreen: {
    diaryTitle: string;
    diaryContent: string;
    paragraphs: Array<{
      id: string;
      content: string;
      generatedImageUrl: string;
    }>;
    generatedImageUrl?: string;
    generationMode: 'single' | 'paragraphs' | 'image';
  };
  Fairytale: undefined;
  FairytaleCreate: undefined;
  FairytaleDetail: {
    fairytaleId: string;
  };
  FairytaleImgGenOption: {
    fairytaleTitle: string;
    fairytaleContent: string;
    paragraphs?: Array<{
      id: string;
      content: string;
      keywords: string[];
      scenePrompt?: string;
      generatedImageUrl?: string;
      isGenerating?: boolean;
      imageLoadError?: boolean;
    }>;
  };
  FairytaleSaveScreen: {
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

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isLoggedIn, isLoading } = useAuth();

  // 로딩 중일 때 스플래시 화면 표시
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#4884FF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          cardStyleInterpolator: ({ current }) => {
            return {
              cardStyle: {
                opacity: current.progress,
              },
            };
          },
          transitionSpec: {
            open: {
              animation: 'timing',
              config: {
                duration: UI_CONSTANTS.ANIMATION_DURATION,
              },
            },
            close: {
              animation: 'timing',
              config: {
                duration: UI_CONSTANTS.ANIMATION_DURATION,
              },
            },
          },
        }}
      >
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Settings" component={SettingScreen} />
        <Stack.Screen name="Diary" component={DiaryScreen} />
        <Stack.Screen name="DiaryCreate" component={DiaryCreateScreen} />
        <Stack.Screen name="DiaryDetail" component={DiaryDetailViewScreen} />
        <Stack.Screen name="DiaryImgGenOption" component={DiaryImgGenOptionScreen} />
        <Stack.Screen name="DiarySaveScreen" component={DiarySaveScreen} />
        <Stack.Screen name="Fairytale" component={FairytaleScreen} />
        <Stack.Screen name="FairytaleCreate" component={FairytaleCreateScreen} />
        <Stack.Screen name="FairytaleDetail" component={FairytaleDetailViewScreen} />
        <Stack.Screen name="FairytaleImgGenOption" component={FairytaleImgGenOptionScreen} />
        <Stack.Screen name="FairytaleSaveScreen" component={FairytaleSaveScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// AuthProvider로 감싸진 메인 앱 컴포넌트
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;
