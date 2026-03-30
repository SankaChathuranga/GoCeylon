import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../api/axios';
import { LoginRequest, RegisterRequest, LoginResponse, User, ApiResponse } from '../types';

interface AuthContextType {
  user: LoginResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  userProfile: User | null;
  fetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('gc_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    const res = await api.post<ApiResponse<LoginResponse>>('/auth/login', data);
    const loginData = res.data.data;
    localStorage.setItem('gc_token', loginData.token);
    localStorage.setItem('gc_user', JSON.stringify(loginData));
    setUser(loginData);
  };

  const register = async (data: RegisterRequest) => {
    const res = await api.post<ApiResponse<LoginResponse>>('/auth/register', data);
    const loginData = res.data.data;
    localStorage.setItem('gc_token', loginData.token);
    localStorage.setItem('gc_user', JSON.stringify(loginData));
    setUser(loginData);
  };

  const logout = () => {
    localStorage.removeItem('gc_token');
    localStorage.removeItem('gc_user');
    setUser(null);
    setUserProfile(null);
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get<ApiResponse<User>>('/users/profile');
      setUserProfile(res.data.data);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      userProfile,
      fetchProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
