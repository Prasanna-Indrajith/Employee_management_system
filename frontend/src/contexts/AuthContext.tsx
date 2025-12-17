// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   type ReactNode,
// } from 'react';
// import type { User, LoginCredentials } from '@/types';
// import { authAPI } from '@/services/api';

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   login: (credentials: LoginCredentials) => Promise<void>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // 1. Check LocalStorage on Mount
//   useEffect(() => {
//     const initializeAuth = () => {
//       const storedUser = localStorage.getItem('user');
//       const token = localStorage.getItem('token');

//       if (token && storedUser) {
//         try {
//           setUser(JSON.parse(storedUser));
//         } catch (error) {
//           console.error('Failed to parse user data', error);
//           localStorage.removeItem('user');
//           localStorage.removeItem('token');
//         }
//       }
//       setIsLoading(false);
//     };

//     initializeAuth();
//   }, []);

//   // 2. Login Action
//   const login = async (credentials: LoginCredentials) => {
//     setIsLoading(true);
//     try {
//       // API Call is handled here now
//       const response = await authAPI.login(credentials);
//       if (response.success) {
//         setUser(response.data.user);
//         // localStorage is already set inside authAPI.login,
//         // but updating state here triggers re-render across the app
//       }
//     } catch (error) {
//       throw error; // Let the UI handle the error message
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // 3. Logout Action
//   const logout = () => {
//     authAPI.logout(); // Clears localStorage
//     setUser(null);
//     window.location.href = '/login'; // Hard redirect to ensure clean state
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isAuthenticated: !!user,
//         isLoading,
//         login,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // Custom Hook for easy access
// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }

import React, {
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
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      console.log('🔄 AuthProvider: Initializing...');
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log('✅ AuthProvider: Found User in Storage:', parsedUser);

          // Force role check
          if (!parsedUser.role) {
            console.error(
              "❌ AuthProvider: User missing 'role'! Invalid data."
            );
            localStorage.clear();
            setUser(null);
          } else {
            setUser(parsedUser);
          }
        } catch (error) {
          console.error('❌ AuthProvider: Failed to parse user data', error);
          localStorage.clear();
          setUser(null);
        }
      } else {
        console.warn('⚠️ AuthProvider: No token or user found in storage.');
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(credentials);
      if (response.success) {
        console.log('✅ Login Success API Data:', response.data.user);
        setUser(response.data.user);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('👋 Logging out...');
    authAPI.logout();
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
