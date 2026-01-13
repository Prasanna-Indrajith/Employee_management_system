import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { type User, type LoginCredentials } from '@/types';
import { authAPI } from '@/services/api';

// Check for auth-related errors in API responses
const checkAuthError = (error: any) => {
  if (error?.response?.status === 401 || error?.response?.status === 403) {
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('authState');
    sessionStorage.clear();
    
    // Only redirect if not already on login page
    if (!window.location.pathname.includes('/login')) {
      const isExpired = error?.response?.data?.message?.toLowerCase().includes('expired');
      if (isExpired) {
        alert('Your session has expired. Please log in again.');
      } else {
        alert('You have been logged out. Please log in again.');
      }
      
      // Force redirect to login page
      window.location.href = '/login';
    }
  }
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<User | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Initialize Auth from LocalStorage
  useEffect(() => {
    const initializeAuth = () => {
      console.log('🔄 AuthProvider: Initializing...');
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (token && storedUser) {
        try {
          // Check if token is expired
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Date.now() / 1000;
          
          if (tokenPayload.exp && tokenPayload.exp < currentTime) {
            console.log('⏰ Token expired during initialization, clearing auth data');
            localStorage.clear();
            sessionStorage.clear();
            setUser(null);
          } else {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser) {
              setUser(parsedUser);
              console.log('✅ AuthProvider: Restored User from Storage');
            }
          }
        } catch (error) {
          console.error('❌ AuthProvider: Failed to parse user data', error);
          localStorage.clear();
          sessionStorage.clear();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // 2. The Login Function (FIXED)
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(credentials);

      // Handle the response structure
      const payload = response.data || response;
      const { user, token } = payload;

      if (user && token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return user; // <--- RETURN THE USER HERE
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Check for auth errors and handle automatically
      checkAuthError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('👋 Logging out...');
    // Clear all authentication data
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, logout }}
    >
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
