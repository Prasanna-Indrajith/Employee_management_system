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
  SalaryAnalyticsResponse,
  EmployeeSalaryBreakdown,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
      console.log('🔒 JWT token expired or invalid - logging out');
      
      // Clear all authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Clear any other auth-related data
      localStorage.removeItem('authState');
      sessionStorage.clear();
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        // Show user-friendly message before redirect
        const isExpired = (error.response?.data as any)?.message?.toLowerCase().includes('expired');
        if (isExpired) {
          alert('Your session has expired. Please log in again.');
        } else {
          alert('You have been logged out. Please log in again.');
        }
        
        // Force redirect to login page
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
    try {
      console.log('🔌 API: Sending POST /auth/login...');
      const response = await api.post('/auth/login', credentials);

      // 1. Log the EXACT data structure (Check your console for this!)
      console.log('🔌 API: Success! Status:', response.status);
      console.log('🔌 API: Response Body (data):', response.data);

      // 2. Return the inner data directly
      // If your backend sends { success: true, data: { user, token } }
      // Then response.data is that object.
      return response.data;
    } catch (error: any) {
      console.error('🔌 API: Request Failed!', error.response || error.message);
      throw error; // Pass error to AuthContext
    }
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

  generateTimesheetPDF: async (date: string): Promise<Blob> => {
    const response = await api.get(`/employees/timesheets/pdf/${date}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  downloadMyAttendancePDF: async (month: string): Promise<Blob> => {
    const response = await api.get(`/employees/my-attendance/pdf/${month}`, {
      responseType: 'blob'
    });
    return response.data;
  },
};

// --- PROFILE API (For the Logged-in User) ---
export const profileAPI = {
  // 1. Get MY Attendance
  getMyAttendance: async (date?: string): Promise<ApiResponse<any[]>> => {
    const query = date ? `?date=${date}` : '';
    // Use the employee endpoint for user attendance
    const response = await api.get(`/employees/me/attendance${query}`);
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

  // NEW: Get employee salary breakdown
  getEmployeeSalaryBreakdown: async (employeeId?: string): Promise<ApiResponse<EmployeeSalaryBreakdown[]>> => {
    const endpoint = employeeId ? `/payroll/breakdown/${employeeId}` : '/payroll/breakdown';
    const response = await api.get(endpoint);
    return response.data;
  },

  // NEW: Get single employee's detailed salary breakdown
  getSingleEmployeeBreakdown: async (employeeId: string, payPeriod?: string): Promise<ApiResponse<EmployeeSalaryBreakdown>> => {
    const query = payPeriod ? `?payPeriod=${payPeriod}` : '';
    const response = await api.get(`/payroll/breakdown/${employeeId}${query}`);
    return response.data;
  },

  downloadPayslipPDF: async (payslipId: string): Promise<Blob> => {
    const response = await api.get(`/payroll/payslips/${payslipId}/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  },
};

// --- ATTENDANCE API ---
export const attendanceAPI = {
  // 1. Check status (Used on Dashboard load)
  getTodayStatus: async () => {
    const response = await api.get('/attendance/today');
    return response.data;
  },

  // 2. Clock In
  clockIn: async () => {
    const response = await api.post('/attendance/clock-in');
    return response.data;
  },

  // 3. Clock Out
  clockOut: async () => {
    const response = await api.post('/attendance/clock-out');
    return response.data;
  },
};

export const dashboardAPI = {
  // The Efficient Way: Fetch only the counts
  getAdminStats: async () => {
    // Determine endpoints based on your backend setup.
    // Ideally, you have ONE endpoint that returns all stats:
    // const response = await api.get('/dashboard/admin-stats');

    // If you don't have that yet, you can still optimize by requesting "counts"
    // if your generic endpoints support parameters like ?count=true,
    // but a dedicated endpoint is best.

    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};

export interface CreateLeaveData {
  leaveType: string;
  reason: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}



export default api;
