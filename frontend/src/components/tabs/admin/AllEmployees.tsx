'use client';

import * as React from 'react';
import { employeeAPI } from '@/services/api'; // Ensure this path matches your file structure
import type { Employee } from '@/types'; // Import from your central types file
import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { ArrowUpDown, ChevronDown, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function EmployeeDataTable() {
  const navigate = useNavigate();

  // State for data
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // State for filters/sorting
  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(
    new Set()
  );

  // Sorting state
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    email: true,
    department: true,
    position: true,
    status: true,
    joinDate: true,
    actions: true,
  });

  // FETCH DATA ON MOUNT
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await employeeAPI.getAll();
        if (response.success) {
          setEmployees(response.data);
        }
      } catch (error) {
        console.error('Failed to load employees', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle view profile
  const handleViewProfile = (employee: Employee) => {
    navigate(`/admin/employees/${employee.id}`);
  };

  // Filter employees
  const filteredEmployees = React.useMemo(() => {
    return employees.filter((employee) => {
      const fullName =
        `${employee.firstName} ${employee.lastName}`.toLowerCase();
      const matchesName = fullName.includes(nameFilter.toLowerCase());
      const matchesEmail = employee.email
        .toLowerCase()
        .includes(emailFilter.toLowerCase());
      const matchesDept =
        departmentFilter === '' || employee.department === departmentFilter;

      return matchesName && matchesEmail && matchesDept;
    });
  }, [employees, nameFilter, emailFilter, departmentFilter]);

  // Sort employees
  const sortedEmployees = React.useMemo(() => {
    if (!sortField) return filteredEmployees;

    return [...filteredEmployees].sort((a, b) => {
      let aValue: any = a[sortField as keyof Employee];
      let bValue: any = b[sortField as keyof Employee];

      // Handle special sorting for "Name" (combining first and last)
      if (sortField === 'name') {
        aValue = `${a.firstName} ${a.lastName}`;
        bValue = `${b.firstName} ${b.lastName}`;
      }

      // Handle date sorting
      if (sortField === 'hireDate') {
        aValue = new Date(a.hireDate).getTime();
        bValue = new Date(b.hireDate).getTime();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredEmployees, sortField, sortDirection]);

  // Paginate
  const paginatedEmployees = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedEmployees.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedEmployees, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);

  // Handle Sort Click
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Selection Logic
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(new Set(paginatedEmployees.map((emp) => emp.id)));
    } else {
      setSelectedEmployees(new Set());
    }
  };

  const handleSelectEmployee = (employeeId: string, checked: boolean) => {
    const newSelected = new Set(selectedEmployees);
    if (checked) {
      newSelected.add(employeeId);
    } else {
      newSelected.delete(employeeId);
    }
    setSelectedEmployees(newSelected);
  };

  // Badge Logic (using 'active' | 'inactive' from your types)
  const getStatusBadge = (status: string) => {
    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus === 'active') {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
          Active
        </Badge>
      );
    } else if (normalizedStatus === 'inactive') {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
          Inactive
        </Badge>
      );
    } else {
      return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Unique Departments
  const departments = React.useMemo(() => {
    return [...new Set(employees.map((emp) => emp.department))];
  }, [employees]);

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading employees...
      </div>
    );
  }

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

      {/* Filters Bar */}
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
                    paginatedEmployees.length > 0 &&
                    selectedEmployees.size === paginatedEmployees.length
                  }
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </th>

              {/* NAME COLUMN */}
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

              {/* EMAIL COLUMN */}
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

              {/* DEPARTMENT COLUMN */}
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
                      aria-label={`Select ${employee.firstName}`}
                    />
                  </td>

                  {/* Name (Combined First + Last) */}
                  {visibleColumns.name && (
                    <td className="p-4 align-middle font-medium">
                      {employee.firstName} {employee.lastName}
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

                  {/* Hire Date */}
                  {visibleColumns.joinDate && (
                    <td className="p-4 align-middle">{employee.hireDate}</td>
                  )}

                  {visibleColumns.actions && (
                    <td className="p-4 align-middle">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewProfile(employee)}
                      >
                        View Profile
                      </Button>
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

      {/* Pagination Controls */}
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
