
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import * as firebaseAuth from 'firebase/auth';

interface AuthContextType {
  user: firebaseAuth.User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  login: (email: string) => Promise<void>; 
  signup: (email: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginWithGoogle: async () => {},
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<firebaseAuth.User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to real Firebase Auth state changes
  useEffect(() => {
    // If auth is undefined (firebase not configured), we stop loading
    if (!auth) {
        setLoading(false);
        return;
    }

    const unsubscribe = firebaseAuth.onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    if (!auth) {
        // MOCK LOGIN for prototype mode
        console.warn("Firebase Auth not configured. simulating login.");
        const mockUser: any = {
            uid: 'mock-user-123',
            displayName: 'Guest User',
            email: 'guest@linkup.com',
            photoURL: 'https://ui-avatars.com/api/?name=Guest+User&background=6A4CFF&color=fff',
            emailVerified: true
        };
        setUser(mockUser);
        return;
    }

    try {
      await firebaseAuth.signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google Auth Error:", error);
      throw error;
    }
  };

  // Legacy/Email wrappers
  const login = async (email: string) => {
    console.warn("Email login requested.");
  };

  const signup = async (email: string, name: string) => {
    console.warn("Email signup requested.");
  };

  const logout = async () => {
    if (auth) {
        await firebaseAuth.signOut(auth);
    } else {
        setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
    