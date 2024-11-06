import React, { createContext, useContext, useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../lib/firebase';
import { toast } from 'react-hot-toast';

interface User {
  username: string;
  isAdmin: boolean;
  isActive: boolean;
  uid: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      const userRef = ref(db, `users/${username.toLowerCase()}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();

      if (!userData) {
        throw new Error('User not found');
      }

      if (!userData.isActive) {
        throw new Error('Account is blocked');
      }

      if (userData.password !== password) {
        throw new Error('Invalid password');
      }

      const user = {
        username: userData.username,
        isAdmin: userData.isAdmin || false,
        isActive: userData.isActive,
        uid: userData.uid || username.toLowerCase()
      };

      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success('Welcome back!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Invalid username or password');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      localStorage.removeItem('user');
      toast.success('Successfully signed out!');
    } catch (error) {
      toast.error('Failed to sign out');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAdmin: user?.isAdmin || false,
      signIn, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}