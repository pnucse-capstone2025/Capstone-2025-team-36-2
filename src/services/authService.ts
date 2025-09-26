import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export interface AuthErrorType {
  code: string;
  message: string;
}

// 구글 로그인 초기화
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: '553577037646-1234567890abcdef1234567890abcdef.apps.googleusercontent.com', // google-services.json의 client_type: 3 client_id
    offlineAccess: true,
    scopes: ['email', 'profile'],
  });
};

// 에러 메시지 한국어 변환
const getKoreanErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return '등록되지 않은 이메일입니다.';
    case 'auth/wrong-password':
      return '잘못된 비밀번호입니다.';
    case 'auth/email-already-in-use':
      return '이미 사용 중인 이메일입니다.';
    case 'auth/weak-password':
      return '비밀번호는 최소 6자 이상이어야 합니다.';
    case 'auth/invalid-email':
      return '유효하지 않은 이메일 형식입니다.';
    case 'auth/user-disabled':
      return '비활성화된 계정입니다.';
    case 'auth/too-many-requests':
      return '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.';
    case 'auth/network-request-failed':
      return '네트워크 연결을 확인해주세요.';
    case 'auth/account-exists-with-different-credential':
      return '다른 방법으로 이미 가입된 이메일입니다.';
    case 'auth/invalid-credential':
      return '잘못된 인증 정보입니다.';
    case 'auth/operation-not-allowed':
      return '허용되지 않은 작업입니다.';
    case 'auth/user-cancelled':
      return '사용자가 로그인을 취소했습니다.';
    case 'auth/popup-closed-by-user':
      return '사용자가 팝업을 닫았습니다.';
    default:
      return '알 수 없는 오류가 발생했습니다.';
  }
};

// 회원가입
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<{ success: boolean; user?: FirebaseAuthTypes.User; error?: string }> => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // 사용자 프로필 업데이트 (사용자명 설정)
    await user.updateProfile({
      displayName: displayName,
    });

    return { success: true, user };
  } catch (error) {
    const authError = error as any;
    return {
      success: false,
      error: getKoreanErrorMessage(authError.code),
    };
  }
};

// 로그인
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<{ success: boolean; user?: FirebaseAuthTypes.User; error?: string }> => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    return { success: true, user };
  } catch (error) {
    const authError = error as any;
    return {
      success: false,
      error: getKoreanErrorMessage(authError.code),
    };
  }
};

// 로그아웃
export const signOutUser = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    await auth().signOut();
    return { success: true };
  } catch (error) {
    const authError = error as any;
    return {
      success: false,
      error: getKoreanErrorMessage(authError.code),
    };
  }
};

// 구글 로그인
export const signInWithGoogle = async (): Promise<{ success: boolean; user?: FirebaseAuthTypes.User; error?: string }> => {
  try {
    // Google Play 서비스 확인
    await GoogleSignin.hasPlayServices();

    // 구글 계정으로 로그인
    const signInResult = await GoogleSignin.signIn();

    if (signInResult.type === 'cancelled') {
      return {
        success: false,
        error: '로그인이 취소되었습니다.',
      };
    }

    if (signInResult.type !== 'success') {
      return {
        success: false,
        error: '구글 로그인에 실패했습니다.',
      };
    }

    const { data } = signInResult;

    // Firebase 인증 정보 생성
    const googleCredential = auth.GoogleAuthProvider.credential(data.idToken);

    // Firebase로 로그인
    const userCredential = await auth().signInWithCredential(googleCredential);
    const user = userCredential.user;

    return { success: true, user };
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    const authError = error as any;
    
    if (authError.code === 'auth/network-request-failed') {
      return {
        success: false,
        error: '네트워크 연결을 확인해주세요.',
      };
    }
    
    return {
      success: false,
      error: getKoreanErrorMessage(authError.code) || '구글 로그인 중 오류가 발생했습니다.',
    };
  }
};

// 비밀번호 재설정 이메일 전송
export const sendPasswordReset = async (
  email: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    await auth().sendPasswordResetEmail(email);
    return { success: true };
  } catch (error) {
    const authError = error as any;
    return {
      success: false,
      error: getKoreanErrorMessage(authError.code),
    };
  }
};
