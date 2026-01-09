// --- EMPLOYEE TYPES ---

// The "View" Model (Sent to Frontend)
export interface Employee {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  department: string; // JOINed value
  position: string; // JOINed value
  location: string; // JOINed value
  hireDate: Date;
  role: "admin" | "user";
  status: "active" | "inactive";
  salary: number;
  employmentType: "Full-time" | "Part-time" | "Contract";
  bio?: string;
  skills: string[];
}

// The "Input" Model (Received from Frontend Form)
export interface CreateEmployeeDTO {
  fullName: string;
  email: string;
  phone: string;
  departmentId: number; // Foreign Key
  positionId: number; // Foreign Key
  locationId: number; // Foreign Key
  hireDate: string; // ISO Date String
  salary: number;
  role: "admin" | "user";
  employmentType: "Full-time" | "Part-time" | "Contract";
  bio?: string;
  skills: string[];
}

// --- AUTH & USER TYPES ---

// Represents a row in the 'users' table
export interface User {
  id: string;
  email: string;
  password_hash: string; // Internal use only (never send to frontend)
  fullName: string;
  role: "admin" | "user";
  employeeId?: string;
  created_at?: Date;
}

// Input for Login
export interface LoginCredentials {
  email: string;
  password: string;
}

// Input for Registration
export interface RegisterDTO {
  email: string;
  password: string;
  fullName: string;
  role: "admin" | "user";
  employeeId?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: Date | string;
  clockIn: Date | string;
  clockOut: Date | string | null;
  status: "Present" | "Late" | "Absent" | "On Leave";
  location?: string; // e.g. "Office", "Remote"

  // Optional: Include employee details for Admin view
  employee?: {
    firstName: string;
    lastName: string;
    department?: string;
  };
}

export interface LeaveRecord {
  id: string;
  employeeId: string;
  leaveType: string;
  reason: string;
  duration: string; // e.g. "2 Days"
  dates: string[]; // Array of date strings
  requestedOn: Date;
  status: "Pending" | "Approved" | "Rejected";
}

export interface PayrollRun {
  id: string;
  runDate: Date;
  payPeriodStart: Date;
  payPeriodEnd: Date;
  totalDisbursed: number;
  employeeCount: number;
  status: string; // e.g. 'Completed', 'Draft'
}

export interface Payslip {
  id: string;
  employeeId: string;
  payrollRunId: string;
  monthYear: string; // e.g. "January 2025"
  issueDate: Date;
  netSalary: number;
  status: string; // 'Paid', 'Pending'
  pdfUrl?: string;
}

export interface SalaryHistory {
  id: string;
  employeeId: string;
  oldSalary: number;
  newSalary: number;
  changeDate: Date;
  reason: string;
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
