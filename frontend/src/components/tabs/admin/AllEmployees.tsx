'use client';

import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpDown, ChevronDown, MoreHorizontal, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Employee data type
export type Employee = {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  joinDate: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  location: string;
};

// Mock employee data
const employeeData: Employee[] = [
  {
    id: 'emp001',
    name: 'John Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    position: 'Senior Developer',
    joinDate: '2022-01-15',
    status: 'Active',
    location: 'New York, NY',
  },
  {
    id: 'emp002',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    phone: '+1 (555) 234-5678',
    department: 'Marketing',
    position: 'Marketing Manager',
    joinDate: '2021-11-20',
    status: 'Active',
    location: 'Los Angeles, CA',
  },
  {
    id: 'emp003',
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    phone: '+1 (555) 345-6789',
    department: 'Sales',
    position: 'Sales Representative',
    joinDate: '2023-03-10',
    status: 'Active',
    location: 'Chicago, IL',
  },
  {
    id: 'emp004',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@company.com',
    phone: '+1 (555) 456-7890',
    department: 'HR',
    position: 'HR Specialist',
    joinDate: '2022-07-05',
    status: 'On Leave',
    location: 'Boston, MA',
  },
  {
    id: 'emp005',
    name: 'David Brown',
    email: 'david.brown@company.com',
    phone: '+1 (555) 567-8901',
    department: 'Engineering',
    position: 'Frontend Developer',
    joinDate: '2023-01-12',
    status: 'Active',
    location: 'Seattle, WA',
  },
  {
    id: 'emp006',
    name: 'Lisa Chen',
    email: 'lisa.chen@company.com',
    phone: '+1 (555) 678-9012',
    department: 'Design',
    position: 'UX Designer',
    joinDate: '2022-09-18',
    status: 'Active',
    location: 'San Francisco, CA',
  },
  {
    id: 'emp007',
    name: 'Robert Taylor',
    email: 'robert.taylor@company.com',
    phone: '+1 (555) 789-0123',
    department: 'Finance',
    position: 'Financial Analyst',
    joinDate: '2021-06-12',
    status: 'Inactive',
    location: 'Miami, FL',
  },
];

export default function EmployeeDataTable() {
  const navigate = useNavigate();

  const [employees, setEmployees] = React.useState<Employee[]>(employeeData);
  const [nameFilter, setNameFilter] = React.useState('');
  const [emailFilter, setEmailFilter] = React.useState('');
  const [departmentFilter, setDepartmentFilter] = React.useState('');
  const [selectedEmployees, setSelectedEmployees] = React.useState<Set<string>>(
    new Set()
  );
  const [sortField, setSortField] = React.useState<keyof Employee | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>(
    'asc'
  );
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(5);
  const [visibleColumns, setVisibleColumns] = React.useState({
    name: true,
    email: true,
    department: true,
    position: true,
    status: true,
    joinDate: true,
    actions: true,
  });

  // Function to handle view profile - you can customize this
  const handleViewProfile = (employee: Employee) => {
    // console.log("View profile for:", employee)
    // alert(`Viewing profile for ${employee.name}. You can customize this action!`)
    navigate(`/admin/employees/${employee.id}`);
  };

  const deactivateAccount = (employee: Employee) => {
    alert('Aye you sure?');
  };

  // Filter employees based on search criteria
  const filteredEmployees = React.useMemo(() => {
    return employeeData.filter((employee) => {
      return (
        employee.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
        employee.email.toLowerCase().includes(emailFilter.toLowerCase()) &&
        (departmentFilter === '' || employee.department === departmentFilter)
      );
    });
  }, [nameFilter, emailFilter, departmentFilter]);

  // Sort employees
  const sortedEmployees = React.useMemo(() => {
    if (!sortField) return filteredEmployees;

    return [...filteredEmployees].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredEmployees, sortField, sortDirection]);

  // Paginate employees
  const paginatedEmployees = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedEmployees.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedEmployees, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);

  // Handle sorting
  const handleSort = (field: keyof Employee) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(new Set(paginatedEmployees.map((emp) => emp.id)));
    } else {
      setSelectedEmployees(new Set());
    }
  };

  // Handle individual selection
  const handleSelectEmployee = (employeeId: string, checked: boolean) => {
    const newSelected = new Set(selectedEmployees);
    if (checked) {
      newSelected.add(employeeId);
    } else {
      newSelected.delete(employeeId);
    }
    setSelectedEmployees(newSelected);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusColors = {
      Active: 'bg-green-100 text-green-800 hover:bg-green-100',
      'On Leave': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
      Inactive: 'bg-red-100 text-red-800 hover:bg-red-100',
    };

    return (
      <Badge
        className={
          statusColors[status as keyof typeof statusColors] ||
          'bg-gray-100 text-gray-800 hover:bg-gray-100'
        }
      >
        {status}
      </Badge>
    );
  };

  // Get unique departments for filter
  const departments = React.useMemo(() => {
    return [...new Set(employeeData.map((emp) => emp.department))];
  }, []);

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Employee Management
          </h1>
          <p className="text-muted-foreground">
            Manage your organization's employees
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by name..."
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="pl-8 max-w-sm"
          />
        </div>
        <Input
          placeholder="Filter by email..."
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background max-w-sm"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Object.entries(visibleColumns).map(([key, visible]) => (
              <DropdownMenuCheckboxItem
                key={key}
                className="capitalize"
                checked={visible}
                onCheckedChange={(checked) =>
                  setVisibleColumns((prev) => ({ ...prev, [key]: checked }))
                }
              >
                {key}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[50px]">
                <Checkbox
                  checked={
                    selectedEmployees.size === paginatedEmployees.length &&
                    paginatedEmployees.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </th>
              {visibleColumns.name && (
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('name')}
                    className="h-auto p-0 font-medium"
                  >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
              )}
              {visibleColumns.email && (
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('email')}
                    className="h-auto p-0 font-medium"
                  >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
              )}
              {visibleColumns.department && (
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('department')}
                    className="h-auto p-0 font-medium"
                  >
                    Department
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
              )}
              {visibleColumns.position && (
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Position
                </th>
              )}
              {visibleColumns.status && (
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Status
                </th>
              )}
              {visibleColumns.joinDate && (
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Join Date
                </th>
              )}
              {visibleColumns.actions && (
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {paginatedEmployees.length > 0 ? (
              paginatedEmployees.map((employee) => (
                <tr
                  key={employee.id}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  <td className="p-4 align-middle">
                    <Checkbox
                      checked={selectedEmployees.has(employee.id)}
                      onCheckedChange={(checked) =>
                        handleSelectEmployee(employee.id, checked as boolean)
                      }
                      aria-label={`Select ${employee.name}`}
                    />
                  </td>
                  {visibleColumns.name && (
                    <td className="p-4 align-middle font-medium">
                      {employee.name}
                    </td>
                  )}
                  {visibleColumns.email && (
                    <td className="p-4 align-middle">{employee.email}</td>
                  )}
                  {visibleColumns.department && (
                    <td className="p-4 align-middle">{employee.department}</td>
                  )}
                  {visibleColumns.position && (
                    <td className="p-4 align-middle">{employee.position}</td>
                  )}
                  {visibleColumns.status && (
                    <td className="p-4 align-middle">
                      {getStatusBadge(employee.status)}
                    </td>
                  )}
                  {visibleColumns.joinDate && (
                    <td className="p-4 align-middle">{employee.joinDate}</td>
                  )}
                  {visibleColumns.actions && (
                    <td className="p-4 align-middle">
                      <div>
                        <DropdownMenu>
                          <Button
                            variant={'outline'}
                            onClick={() => handleViewProfile(employee)}
                          >
                            View Profile
                          </Button>
                        </DropdownMenu>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={
                    Object.values(visibleColumns).filter(Boolean).length + 1
                  }
                  className="h-24 text-center p-4 align-middle"
                >
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          {selectedEmployees.size} of {sortedEmployees.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
