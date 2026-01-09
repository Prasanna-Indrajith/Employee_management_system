// ==========================================
// 1. CORE / AUTH TYPES
// ==========================================

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'user';
  employeeId?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// ==========================================
// 2. EMPLOYEE MANAGEMENT
// ==========================================

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  role: 'admin' | 'user';
  department: string;
  position: string;
  hireDate: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract';
  salary: number;
  status: 'active' | 'inactive';
  managerId?: string;
  bio: string;
  skills: string[];
}

// Used for Creating/Editing (Foreign Keys)
export interface CreateEmployeeData {
  fullName: string;
  email: string;
  phone: string;
  departmentId: number;
  positionId: number;
  locationId: number;
  hireDate: string;
  salary: number;
  role: 'admin' | 'user';
  employmentType: 'Full-time' | 'Part-time' | 'Contract';
  bio?: string;
  skills: string[];
}

export interface LookupData {
  departments: { id: number; name: string }[];
  positions: { id: number; title: string; department_id: number }[];
  locations: { id: number; name: string }[];
}

// ==========================================
// 3. ATTENDANCE & LEAVES
// ==========================================

export interface TimeSheet {
  id: string;
  date: Date | string;
  fullName: string;
  department: string;
  clockIn: Date | string;
  clockOut: Date | string;
  status: 'Present' | 'Late' | 'Absent';
}

export interface TimeOffSheet {
  id: string;
  fullName: string;
  department: string;
  leaveType: 'Annual leave' | 'Medical leave' | 'Casual leave';
  duration: string;
  dates: Date[] | string[]; // Allow strings for API responses
  requestedOn: Date | string;
  reason: string;
  status: 'Pending' | 'Rejected' | 'Approved';
  isApproved: boolean;
}

// ==========================================
// 4. PAYROLL & SALARY (Merged & Fixed)
// ==========================================

// Define Status Types First
export type PayslipStatus = 'Paid' | 'Pending';
export type PayrollStatus = 'Completed' | 'Draft' | 'Processing' | 'Failed';

export interface PayrollRun {
  id: string;
  runDate: string; // e.g. "Oct 1, 2025"
  payPeriodStart: string;
  payPeriodEnd: string;
  totalDisbursed: number;
  employeeCount: number;
  status: PayrollStatus; // Uses the strict type above
}

export interface Payslip {
  id: string;
  employeeId: string;
  payrollRunId: string;
  monthYear: string; // e.g. "October 2025"
  issueDate: string;
  netSalary: number;
  status: PayslipStatus; // Uses the strict type above
  pdfUrl?: string;
}

export interface SalaryHistory {
  id: string;
  employeeId: string;
  oldSalary: number;
  newSalary: number;
  changeDate: string;
  reason: string;
}

// ==========================================
// 5. ANALYTICS / CHARTS
// ==========================================

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

// Matches "Growth Trend" Line Chart
export interface SalaryGrowthTrend {
  month: string;
  averageSalary: number;
}
