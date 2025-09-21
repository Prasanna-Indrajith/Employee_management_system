import type { Employee, ApiResponse, CreateEmployeeData } from '../types';

// Mock employee data for development
const mockEmployees: Employee[] = [
  {
    id: 'EMP001',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@company.com',
    phone: '+1-555-0101',
    department: 'Engineering',
    position: 'Senior Software Engineer',
    salary: 95000,
    hireDate: '2022-03-15',
    status: 'active',
    managerId: 'EMP003',
    address: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105'
    }
  },
  {
    id: 'EMP002',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@company.com',
    phone: '+1-555-0102',
    department: 'Marketing',
    position: 'Marketing Manager',
    salary: 75000,
    hireDate: '2023-01-10',
    status: 'active',
    managerId: 'EMP004',
    address: {
      street: '456 Oak Ave',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107'
    }
  },
  {
    id: 'EMP003',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@company.com',
    phone: '+1-555-0103',
    department: 'Engineering',
    position: 'Engineering Manager',
    salary: 120000,
    hireDate: '2021-08-20',
    status: 'active',
    address: {
      street: '789 Pine St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94108'
    }
  },
  {
    id: 'EMP004',
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah.wilson@company.com',
    phone: '+1-555-0104',
    department: 'Marketing',
    position: 'Marketing Director',
    salary: 110000,
    hireDate: '2020-11-05',
    status: 'active',
    address: {
      street: '321 Elm St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94109'
    }
  },
  {
    id: 'EMP005',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@company.com',
    phone: '+1-555-0105',
    department: 'Sales',
    position: 'Sales Representative',
    salary: 65000,
    hireDate: '2023-11-15',
    status: 'active',
    managerId: 'EMP006',
    address: {
      street: '654 Maple Ave',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94110'
    }
  },
  {
    id: 'EMP006',
    firstName: 'Lisa',
    lastName: 'Garcia',
    email: 'lisa.garcia@company.com',
    phone: '+1-555-0106',
    department: 'Sales',
    position: 'Sales Manager',
    salary: 85000,
    hireDate: '2022-07-12',
    status: 'active',
    address: {
      street: '987 Cedar St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94111'
    }
  }
];

export const mockEmployeeAPI = {
  getAll: async (): Promise<ApiResponse<Employee[]>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      data: mockEmployees
    };
  },

  getById: async (id: string): Promise<ApiResponse<Employee>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const employee = mockEmployees.find(emp => emp.id === id);
    
    if (!employee) {
      return {
        success: false,
        data: null as any,
        message: 'Employee not found'
      };
    }
    
    return {
      success: true,
      data: employee
    };
  },

  create: async (employeeData: CreateEmployeeData): Promise<ApiResponse<Employee>> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newEmployee: Employee = {
      id: `EMP${String(mockEmployees.length + 1).padStart(3, '0')}`,
      ...employeeData,
      status: 'active'
    };
    
    mockEmployees.push(newEmployee);
    
    return {
      success: true,
      data: newEmployee
    };
  },

  update: async (id: string, employeeData: Partial<CreateEmployeeData>): Promise<ApiResponse<Employee>> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const employeeIndex = mockEmployees.findIndex(emp => emp.id === id);
    
    if (employeeIndex === -1) {
      return {
        success: false,
        data: null as any,
        message: 'Employee not found'
      };
    }
    
    const updatedEmployee = {
      ...mockEmployees[employeeIndex],
      ...employeeData
    };
    
    mockEmployees[employeeIndex] = updatedEmployee;
    
    return {
      success: true,
      data: updatedEmployee
    };
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const employeeIndex = mockEmployees.findIndex(emp => emp.id === id);
    
    if (employeeIndex === -1) {
      return {
        success: false,
        data: null,
        message: 'Employee not found'
      };
    }
    
    mockEmployees.splice(employeeIndex, 1);
    
    return {
      success: true,
      data: null
    };
  },

  getMyProfile: async (): Promise<ApiResponse<Employee>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get current user from localStorage
    const userData = localStorage.getItem('user');
    if (!userData) {
      return {
        success: false,
        data: null as any,
        message: 'User not authenticated'
      };
    }
    
    const user = JSON.parse(userData);
    const employee = mockEmployees.find(emp => emp.id === user.employeeId);
    
    if (!employee) {
      return {
        success: false,
        data: null as any,
        message: 'Employee profile not found'
      };
    }
    
    return {
      success: true,
      data: employee
    };
  }
};