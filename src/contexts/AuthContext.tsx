import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('🔐 사용자 로그인:', user.email);
      } else {
        console.log('🔓 사용자 로그아웃');
      }
      
      setUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isLoggedIn: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
