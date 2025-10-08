'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // We could fetch user info here to populate the user state
      // For now, we'll just verify token exists
    }
    setLoading(false);
  };

  const login = async (login: string, password: string) => {
    console.log('Login function called with:', { login }); // Debug log
    try {
      // Use axios directly to avoid browser extension interference with fetch
      const axiosModule = await import('axios');
      const axios = axiosModule.default;
      
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const apiUrl = `${baseUrl}/api/login`;
      console.log('Making login request to:', apiUrl); // Debug log
      
      const response = await axios.post(apiUrl, { login, password });
      console.log('Login response status:', response.status); // Debug log
      console.log('Login response data:', response.data); // Debug log

      if (response.status === 200) {
        const { user, token } = response.data;
        console.log('Login successful, setting token and user'); // Debug log
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
      } else {
        console.log('Login failed with status:', response.status, 'and message:', response.data.message); // Debug log
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error); // Debug log
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  };

  const register = async (userData: any) => {
    console.log('Register function called with:', userData); // Debug log
    
    try {
      // Use axios directly to avoid browser extension interference with fetch
      const axiosModule = await import('axios');
      const axios = axiosModule.default;
      
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const apiUrl = `${baseUrl}/api/register`;
      console.log('Making register request to:', apiUrl); // Debug log
      
      const response = await axios.post(apiUrl, userData);
      console.log('Response status:', response.status); // Debug log
      console.log('Response data:', response.data); // Debug log

      if (response.status === 200 || response.status === 201) {
        const { user, token } = response.data;
        console.log('Registration successful, setting token and user'); // Debug log
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
      } else {
        console.log('Registration failed with status:', response.status, 'and message:', response.data.message); // Debug log
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error); // Debug log
      throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}