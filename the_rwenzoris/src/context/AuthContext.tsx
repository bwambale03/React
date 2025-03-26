// src/context/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

type User = {
  uid: string;
  email: string;
  name: string;
  role?: string;
} | null;

type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Validation helpers
const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Firebase only once
  const auth = getAuth(initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }));

  // Persistent auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken();
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || '',
          };
          sessionStorage.setItem('token', token); // Use sessionStorage instead
          setUser(userData);
        } else {
          sessionStorage.removeItem('token');
          setUser(null);
        }
      } catch (err) {
        setError('Failed to check auth state');
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, [auth]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!validateEmail(email)) throw new Error('Invalid email format');
      if (!validatePassword(password)) throw new Error('Password must be at least 6 characters');

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        name: userCredential.user.displayName || '',
      };
      sessionStorage.setItem('token', token);
      setUser(userData);
    } catch (err) {
      const error = err as FirebaseError;
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [auth]);

  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!validateEmail(email)) throw new Error('Invalid email format');
      if (!validatePassword(password)) throw new Error('Password must be at least 6 characters');
      if (!validateName(name)) throw new Error('Name must be at least 2 characters');

      // 1. Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Update profile with name
      await updateProfile(userCredential.user, { displayName: name });
      
      // 3. Get fresh token
      const token = await userCredential.user.getIdToken();
      
      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        name: name,
      };
      
      sessionStorage.setItem('token', token);
      setUser(userData);
    } catch (err) {
      const error = err as FirebaseError;
      setError(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [auth]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await signOut(auth);
      sessionStorage.removeItem('token');
      setUser(null);
    } catch (err) {
      const error = err as FirebaseError;
      setError(error.message || 'Logout failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [auth]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = {
    user,
    login,
    register,
    logout,
    loading,
    error,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
