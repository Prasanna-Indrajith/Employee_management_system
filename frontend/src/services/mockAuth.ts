import type { User, LoginCredentials, ApiResponse } from '../types';

// Mock users for development
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: 'admin@company.com',
    fullName: 'John Admin',
    role: 'admin',
    password: 'admin123',
    employeeId: 'EMP001'
  },
  {
    id: '2',
    email: 'user@company.com',
    fullName: 'Jane User',
    role: 'user',
    password: 'user123',
    employeeId: 'EMP002'
  }
];

export const mockAuthAPI = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === credentials.email && u.password === credentials.password);
    
    if (!user) {
      return {
        success: false,
        data: null as any,
        message: 'Invalid email or password'
      };
    }
    
    const { password, ...userWithoutPassword } = user;
    const token = `mock-jwt-token-${user.id}`;
    
    return {
      success: true,
      data: {
        user: userWithoutPassword,
        token
      }
    };
  },

  logout: async (): Promise<ApiResponse<null>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: null
    };
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const token = localStorage.getItem('token');
    if (!token || !token.startsWith('mock-jwt-token-')) {
      return {
        success: false,
        data: null as any,
        message: 'Invalid token'
      };
    }
    
    const userId = token.replace('mock-jwt-token-', '');
    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
      return {
        success: false,
        data: null as any,
        message: 'User not found'
      };
    }
    
    const { password, ...userWithoutPassword } = user;
    return {
      success: true,
      data: userWithoutPassword
    };
  }
};
