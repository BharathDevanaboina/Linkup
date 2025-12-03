
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CURRENT_USER } from '../constants';
import { User } from '../types';

// Mock Auth Context
interface AuthContextType {
  user: any | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  signup: (email: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for a session
    const storedUser = localStorage.getItem('linkup_user');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string) => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create a mock user object
    const mockUser = {
        uid: 'user_123',
        email: email,
        displayName: 'Demo User',
        photoURL: 'https://ui-avatars.com/api/?name=Demo+User&background=6A4CFF&color=fff'
    };
    
    setUser(mockUser);
    localStorage.setItem('linkup_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const signup = async (email: string, name: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUser = {
        uid: 'user_' + Date.now(),
        email: email,
        displayName: name,
        photoURL: `https://ui-avatars.com/api/?name=${name}&background=6A4CFF&color=fff`
    };

    setUser(mockUser);
    localStorage.setItem('linkup_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('linkup_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
