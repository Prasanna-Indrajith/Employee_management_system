import type { Employee, ApiResponse, CreateEmployeeData } from '@/types';

// Mock employee data that matches the Employee interface
const mockEmployees: Employee[] = [
  {
    id: 'EMP001',
    fullName: 'John Smith', // COMBINED
    email: 'john.smith@orian.com',
    phone: '+94771234567', // SL Phone format
    location: 'Colombo', // SL Location
    role: 'user', // Assigned role
    department: 'Engineering',
    position: 'Senior Developer', // Position matching your list
    hireDate: '2022-03-15',
    employmentType: 'Full-time', // Assigned type
    salary: 95000,
    status: 'active',
    managerId: 'EMP003',
    bio: 'Experienced in backend systems and cloud architecture.', // Mock bio
    skills: ['React', 'Node.js', 'TypeScript', 'AWS'], // Mock skills
  },
  {
    id: 'EMP002',
    fullName: 'Jane Doe', // COMBINED
    email: 'jane.doe@orian.com',
    phone: '+94719876543', // SL Phone format
    location: 'Kandy', // SL Location
    role: 'user', // Assigned role
    department: 'Marketing',
    position: 'Marketing Executive', // Position matching your list
    hireDate: '2023-01-10',
    employmentType: 'Full-time', // Assigned type
    salary: 75000,
    status: 'active',
    managerId: 'EMP004',
    bio: 'Manages all social media campaigns and content strategy.',
    skills: ['SEO', 'Content Creation', 'Adobe Suite'],
  },
  {
    id: 'EMP003',
    fullName: 'Mike Johnson', // COMBINED
    email: 'mike.johnson@orian.com',
    phone: '+94765432100', // SL Phone format
    location: 'Galle', // SL Location
    role: 'admin', // Assigned role
    department: 'Engineering',
    position: 'Team Lead', // Position matching your list
    hireDate: '2021-08-20',
    employmentType: 'Full-time', // Assigned type
    salary: 120000,
    status: 'active',
    managerId: undefined, // Optional/omitted
    bio: 'Oversees the Engineering department and project management.',
    skills: ['Management', 'Agile', 'Leadership'],
  },
  {
    id: 'EMP004',
    fullName: 'Sarah Wilson', // COMBINED
    email: 'sarah.wilson@orian.com',
    phone: '+94723334444', // SL Phone format
    location: 'Colombo', // SL Location
    role: 'admin', // Assigned role
    department: 'HR',
    position: 'HR Manager', // Position matching your list
    hireDate: '2020-11-05',
    employmentType: 'Full-time', // Assigned type
    salary: 110000,
    status: 'inactive', // Example inactive status
    managerId: undefined, // Optional/omitted
    bio: 'Director of Marketing, specializing in brand strategy.',
    skills: ['Strategy', 'Budgeting', 'Public Relations'],
  },
  {
    id: 'EMP005',
    fullName: 'David Brown', // COMBINED
    email: 'david.brown@orian.com',
    phone: '+94705550105', // SL Phone format
    location: 'Jaffna', // SL Location
    role: 'user', // Assigned role
    department: 'Sales',
    position: 'Sales Representative', // Position matching your list
    hireDate: '2023-11-15',
    employmentType: 'Part-time', // Example Part-time
    salary: 65000,
    status: 'active',
    managerId: 'EMP006',
    bio: 'Responsible for client acquisition and relationship management.',
    skills: ['Negotiation', 'CRM', 'Client Relations'],
  },
  {
    id: 'EMP006',
    fullName: 'Lisa Garcia', // COMBINED
    email: 'lisa.garcia@orian.com',
    phone: '+94776667777', // SL Phone format
    location: 'Negombo', // SL Location
    role: 'user', // Assigned role
    department: 'Sales',
    position: 'Sales Manager', // Position matching your list
    hireDate: '2022-07-12',
    employmentType: 'Contract', // Example Contract
    salary: 85000,
    status: 'active',
    managerId: undefined, // Optional/omitted
    bio: 'Leads the Sales team and drives revenue targets.',
    skills: ['Sales Leadership', 'Forecasting', 'Coaching'],
  },
];

export const mockEmployeeAPI = {
  getAll: async (): Promise<ApiResponse<Employee[]>> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      success: true,
      data: mockEmployees,
    };
  },

  getById: async (id: string): Promise<ApiResponse<Employee>> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const employee = mockEmployees.find((emp) => emp.id === id);

    if (!employee) {
      return {
        success: false,
        data: null as any,
        message: 'Employee not found',
      };
    }

    return {
      success: true,
      data: employee,
    };
  },

  create: async (
    employeeData: CreateEmployeeData
  ): Promise<ApiResponse<Employee>> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newEmployee: Employee = {
      id: `EMP${String(mockEmployees.length + 1).padStart(3, '0')}`,
      ...employeeData,
      location: `Location ${employeeData.locationId}`,
      department: `Department ${employeeData.departmentId}`,
      position: `Position ${employeeData.positionId}`,
      bio: employeeData.bio || '',
      status: 'active',
    };

    mockEmployees.push(newEmployee);

    return {
      success: true,
      data: newEmployee,
    };
  },

  update: async (
    id: string,
    employeeData: Partial<CreateEmployeeData>
  ): Promise<ApiResponse<Employee>> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const employeeIndex = mockEmployees.findIndex((emp) => emp.id === id);

    if (employeeIndex === -1) {
      return {
        success: false,
        data: null as any,
        message: 'Employee not found',
      };
    }

    const updatedEmployee = {
      ...mockEmployees[employeeIndex],
      ...employeeData,
    };

    mockEmployees[employeeIndex] = updatedEmployee;

    return {
      success: true,
      data: updatedEmployee,
    };
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const employeeIndex = mockEmployees.findIndex((emp) => emp.id === id);

    if (employeeIndex === -1) {
      return {
        success: false,
        data: null,
        message: 'Employee not found',
      };
    }

    mockEmployees.splice(employeeIndex, 1);

    return {
      success: true,
      data: null,
    };
  },

  getMyProfile: async (): Promise<ApiResponse<Employee>> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get current user from localStorage
    const userData = localStorage.getItem('user');
    if (!userData) {
      return {
        success: false,
        data: null as any,
        message: 'User not authenticated',
      };
    }

    const user = JSON.parse(userData);
    const employee = mockEmployees.find((emp) => emp.id === user.employeeId);

    if (!employee) {
      return {
        success: false,
        data: null as any,
        message: 'Employee profile not found',
      };
    }

    return {
      success: true,
      data: employee,
    };
  },
};
