import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { type User, type LoginCredentials } from '@/types';
import { authAPI } from '@/services/api';

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
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser) {
            setUser(parsedUser);
            console.log('✅ AuthProvider: Restored User from Storage');
          }
        } catch (error) {
          console.error('❌ AuthProvider: Failed to parse user data', error);
          localStorage.clear();
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
      throw error;
    } finally {
      setIsLoading(false);
    }
    return null; // Fallback
  };

  const logout = () => {
    console.log('👋 Logging out...');
    // Optional: Call API logout if needed
    authAPI.logout();
    localStorage.clear();
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
