import axios, { AxiosError } from 'axios';
import type {
  ApiResponse,
  LoginCredentials,
  Employee,
  CreateEmployeeData,
  User,
  LookupData,
  Payslip,
  PayrollRun,
  SalaryHistory,
} from '../types';

// Point to your Backend URL
const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// 1. Request Interceptor: Attach Token
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

// 2. Response Interceptor: Handle Token Expiry
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// --- AUTH API ---
export const authAPI = {
  login: async (
    credentials: LoginCredentials
  ): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true, data: null };
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// --- EMPLOYEE API ---
export const employeeAPI = {
  // 1. Get All Employees (Used in Data Table)
  getAll: async (): Promise<ApiResponse<Employee[]>> => {
    const response = await api.get('/employees');
    return response.data;
  },

  // 2. Get Dropdown Options (Used in Add Form)
  getLookups: async (): Promise<ApiResponse<LookupData>> => {
    const response = await api.get('/lookups');
    return response.data;
  },

  // 3. Get Single Employee
  getById: async (id: string): Promise<ApiResponse<Employee>> => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  // 4. Create New Employee
  create: async (
    employeeData: CreateEmployeeData
  ): Promise<ApiResponse<Employee>> => {
    const response = await api.post('/employees', employeeData);
    return response.data;
  },

  // 5. Update Employee (ACTUAL IMPLEMENTATION)
  update: async (
    id: string,
    employeeData: Partial<CreateEmployeeData>
  ): Promise<ApiResponse<Employee>> => {
    // We use PUT for full updates or partial updates depending on backend design.
    // Ensure your backend route is set to accept PUT /employees/:id
    const response = await api.put(`/employees/${id}`, employeeData);
    return response.data;
  },

  // 6. Delete Employee (Placeholder)
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },

  // 7. My Profile (Placeholder)
  getMyProfile: async (): Promise<ApiResponse<Employee>> => {
    // Calls the backend route we just created: router.get('/me', ...)
    const response = await api.get('/employees/me');
    return response.data;
  },

  // Update my profile
  updateMyProfile: async (data: {
    phone: string;
    // location: string;
    bio: string;
    skills: string[];
  }) => {
    const response = await api.put('/employees/me', data);
    return response.data;
  },

  // Timesheet
  getTimesheets: async (date?: string): Promise<ApiResponse<any[]>> => {
    const query = date ? `?date=${date}` : '';
    const response = await api.get(`/employees/timesheets${query}`);
    return response.data;
  },
};

// --- PROFILE API (For the Logged-in User) ---
export const profileAPI = {
  // 1. Get MY Attendance
  getMyAttendance: async (date?: string): Promise<ApiResponse<any[]>> => {
    const query = date ? `?date=${date}` : '';
    // Use a specific 'me' endpoint or rely on backend to default to current user
    const response = await api.get(`/attendance/me${query}`);
    return response.data;
  },

  // 1. Get MY Profile details
  // (Backend should extract ID from the JWT Token, no ID param needed)
  // getMyProfile: async (): Promise<ApiResponse<Employee>> => {
  //   // Ideally, your backend has an endpoint like '/employees/profile/me'
  //   // If not, and you must use ID, you need to get the ID from authAPI first.
  //   const response = await api.get('/employees/profile/me');
  //   return response.data;
  // },

  // // // 2. Update MY Profile (e.g. change phone number)
  // updateMyProfile: async (
  //   data: Partial<CreateEmployeeData>
  // ): Promise<ApiResponse<Employee>> => {
  //   const response = await api.put('/employees/profile/me', data);
  //   return response.data;
  // },
};

export interface CreateLeaveData {
  leaveType: string;
  reason: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

// --- LEAVE API ---
export const leaveAPI = {
  // 1. Get My Leave History
  getMyLeaves: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/leaves/me');
    return response.data;
  },

  // 2. Request New Leave
  requestLeave: async (data: CreateLeaveData): Promise<ApiResponse<any>> => {
    const response = await api.post('/leaves/request', data);
    return response.data;
  },

  // 3. ADMIN: Get All
  getAllRequests: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/leaves/admin/all');
    return response.data;
  },

  // 4. ADMIN: Approve/Reject
  updateStatus: async (
    id: string,
    status: 'Approved' | 'Rejected'
  ): Promise<ApiResponse<any>> => {
    const response = await api.patch(`/leaves/admin/${id}/status`, { status });
    return response.data;
  },
};

// --- PAYROLL API ---
export const payrollAPI = {
  // 1. Get All Payroll Runs (Admin Dashboard)
  getAllRuns: async (): Promise<ApiResponse<PayrollRun[]>> => {
    const response = await api.get('/payroll/runs');
    return response.data;
  },

  // 2. Get My Payslips (Employee Portal)
  getMyPayslips: async (): Promise<ApiResponse<Payslip[]>> => {
    const response = await api.get('/payroll/payslips/me');
    return response.data;
  },

  // 3. Get My Salary History (Employee Portal)
  getMySalaryHistory: async (): Promise<ApiResponse<SalaryHistory[]>> => {
    const response = await api.get('/payroll/salary-history/me');
    return response.data;
  },

  getSalaryReports: async (): Promise<ApiResponse<SalaryAnalyticsResponse>> => {
    const response = await api.get('/payroll/reports');
    return response.data;
  },
};

export interface SalaryAnalyticsResponse {
  summary: {
    totalAnnual: number;
    averageSalary: number;
    yoyGrowth: number;
  };
  distribution: DepartmentSalaryStats[];
  details: EmployeeSalaryDetail[];
}

// Matches "Detailed Breakdown" Table
export interface EmployeeSalaryDetail {
  id: string;
  fullName: string;
  department: string;
  currentSalary: number;
  lastRaiseDate: string;
  avatarUrl?: string;
}

// Matches "Salary Distribution" Pie Chart
export interface DepartmentSalaryStats {
  department: string;
  totalSalary: number;
  percentage: number;
  color: string;
}

// Matches the Analytics Response Wrapper
export interface SalaryAnalyticsResponse {
  summary: {
    totalAnnual: number;
    averageSalary: number;
    yoyGrowth: number;
  };
  distribution: DepartmentSalaryStats[];
  details: EmployeeSalaryDetail[];
}

export default api;
