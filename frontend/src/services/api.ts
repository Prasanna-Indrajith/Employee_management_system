import axios, { AxiosError } from 'axios';
import type { ApiResponse, LoginCredentials, Employee, CreateEmployeeData, User } from '../types';
import { mockAuthAPI } from './mockAuth';
import { mockEmployeeAPI } from './mockEmployee';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> => {
    // Use mock authentication for development
    return mockAuthAPI.login(credentials);
    
    /* Original API code - uncomment when backend is ready
    try {
      const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
    */
  },

  logout: async (): Promise<ApiResponse<null>> => {
    // Use mock authentication for development
    return mockAuthAPI.logout();
    
    /* Original API code - uncomment when backend is ready
    try {
      const response: AxiosResponse<ApiResponse<null>> = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
    */
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    // Use mock authentication for development
    return mockAuthAPI.getCurrentUser();
    
    /* Original API code - uncomment when backend is ready
    try {
      const response: AxiosResponse<ApiResponse<User>> = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
    */
  },
};

// Employee API
export const employeeAPI = {
  getAll: async (): Promise<ApiResponse<Employee[]>> => {
    // Use mock employee API for development
    return mockEmployeeAPI.getAll();
    
    /* Original API code - uncomment when backend is ready
    try {
      const response: AxiosResponse<ApiResponse<Employee[]>> = await api.get('/employees');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
    */
  },

  getById: async (id: string): Promise<ApiResponse<Employee>> => {
    // Use mock employee API for development
    return mockEmployeeAPI.getById(id);
    
    /* Original API code - uncomment when backend is ready
    try {
      const response: AxiosResponse<ApiResponse<Employee>> = await api.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
    */
  },

  create: async (employeeData: CreateEmployeeData): Promise<ApiResponse<Employee>> => {
    // Use mock employee API for development
    return mockEmployeeAPI.create(employeeData);
    
    /* Original API code - uncomment when backend is ready
    try {
      const response: AxiosResponse<ApiResponse<Employee>> = await api.post('/employees', employeeData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
    */
  },

  update: async (id: string, employeeData: Partial<CreateEmployeeData>): Promise<ApiResponse<Employee>> => {
    // Use mock employee API for development
    return mockEmployeeAPI.update(id, employeeData);
    
    /* Original API code - uncomment when backend is ready
    try {
      const response: AxiosResponse<ApiResponse<Employee>> = await api.put(`/employees/${id}`, employeeData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
    */
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    // Use mock employee API for development
    return mockEmployeeAPI.delete(id);
    
    /* Original API code - uncomment when backend is ready
    try {
      const response: AxiosResponse<ApiResponse<null>> = await api.delete(`/employees/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
    */
  },

  getMyProfile: async (): Promise<ApiResponse<Employee>> => {
    // Use mock employee API for development
    return mockEmployeeAPI.getMyProfile();
    
    /* Original API code - uncomment when backend is ready
    try {
      const response: AxiosResponse<ApiResponse<Employee>> = await api.get('/employees/me');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
    */
  },
};

// Error handler
function handleApiError(error: any): Error {
  if (error.response) {
    const { status, data } = error.response;
    const message = data.message || `HTTP Error ${status}`;
    const apiError = new Error(message);
    (apiError as any).status = status;
    (apiError as any).errors = data.errors;
    return apiError;
  } else if (error.request) {
    return new Error('Network error: Unable to connect to server');
  } else {
    return new Error(error.message || 'An unexpected error occurred');
  }
}

export default api;