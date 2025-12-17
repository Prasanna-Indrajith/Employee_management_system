export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'user';
  employeeId?: string;
}

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

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// This has "Foreign Key" IDs for storage
export interface CreateEmployeeData {
  fullName: string;
  email: string;
  phone: string;
  departmentId: number; // <--- Number (Database ID)
  positionId: number; // <--- Number (Database ID)
  locationId: number; // <--- Number (Database ID)
  hireDate: string;
  salary: number;
  role: 'admin' | 'user';
  employmentType: 'Full-time' | 'Part-time' | 'Contract';
  bio?: string;
  skills: string[];
}

export interface TimeSheet {
  id: string;
  date: Date;
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
  dates: Date[];
  requestedOn: Date;
  reason: string;
  status: 'Pending' | 'Rejected' | 'Approved';
  isApproved: boolean;
}

// --- PAYROLL (Admin Side) ---

export type PayrollStatus = 'Pending' | 'Processing' | 'Processed' | 'Failed';

// Matches "Payroll History" table in Screenshot 3
export interface PayrollRun {
  id: string;
  runDate: string; // "Oct 1, 2025"
  payPeriodStart: string; // "Sep 1, 2025"
  payPeriodEnd: string; // "Sep 30, 2025"
  totalDisbursed: number; // 148120.50
  status: PayrollStatus;
  employeeCount: number; // For "Payable Employees" count
}

// --- PAYSLIPS (User Side) ---

// Matches "My Payslips" table in Screenshot 2
export interface Payslip {
  id: string;
  employeeId: string;
  payrollRunId: string; // Links to the specific payroll cycle
  monthYear: string; // "October 2025"
  issueDate: string; // "Oct 30, 2025"
  netSalary: number; // 150000
  status: 'Paid' | 'Pending';
  pdfUrl?: string; // For the "Download PDF" button
}

// --- SALARY REPORTS (Admin Side) ---

// Matches "Detailed Breakdown" table in Screenshot 1
export interface EmployeeSalaryDetail {
  id: string; // Employee ID
  fullName: string;
  department: string;
  currentSalary: number;
  lastRaiseDate: string; // "Jan 1, 2025"
  avatarUrl?: string; // For the user icon
}

// Matches "Salary Distribution" Pie Chart
export interface DepartmentSalaryStats {
  department: string;
  totalSalary: number; // The value shown on the pie slices (e.g., 780000)
  percentage: number;
  color: string; // Hex code for the chart
}

// Matches "Growth Trend" Line Chart
export interface SalaryGrowthTrend {
  month: string; // "Jan", "Feb"
  averageSalary: number;
}

export interface LookupData {
  departments: { id: number; name: string }[];
  positions: { id: number; title: string; department_id: number }[];
  locations: { id: number; name: string }[];
}
