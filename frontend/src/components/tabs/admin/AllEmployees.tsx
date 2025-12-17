'use client';

import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpDown, ChevronDown, Search } from 'lucide-react';

import { employeeAPI } from '@/services/api';
import type { Employee } from '@/types';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Helper: Format Dates nicely
const formatDate = (dateString: string | Date) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default function EmployeeDataTable() {
  const navigate = useNavigate();

  // --- STATE ---
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  // Sorting
  const [sortField, setSortField] = useState<keyof Employee | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Column Visibility
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    email: true,
    department: true,
    position: true,
    status: true,
    hireDate: true, // Changed from 'joinDate' to match DB field
    actions: true,
  });

  // --- API FETCH ---
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

  // --- MEMOS (Derived State) ---

  // 1. Get Unique Departments for the Filter Dropdown
  const uniqueDepartments = useMemo(() => {
    // We use a Set to get unique values, filtering out nulls
    const depts = employees.map((e) => e.department).filter(Boolean);
    return [...new Set(depts)].sort();
  }, [employees]);

  // 2. Filter Logic
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const fullName = employee.fullName ? employee.fullName.toLowerCase() : '';
      const email = employee.email ? employee.email.toLowerCase() : '';

      const matchesName = fullName.includes(nameFilter.toLowerCase());
      const matchesEmail = email.includes(emailFilter.toLowerCase());
      const matchesDept =
        departmentFilter === '' || employee.department === departmentFilter;

      return matchesName && matchesEmail && matchesDept;
    });
  }, [employees, nameFilter, emailFilter, departmentFilter]);

  // 3. Sort Logic
  const sortedEmployees = useMemo(() => {
    if (!sortField) return filteredEmployees;

    return [...filteredEmployees].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      // Handle nulls
      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // String comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Default comparison (numbers/dates)
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredEmployees, sortField, sortDirection]);

  // 4. Pagination Logic
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedEmployees.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedEmployees, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);

  // --- HANDLERS ---

  const handleSort = (field: keyof Employee) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status ? status.toLowerCase() : 'unknown';

    switch (normalizedStatus) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
            Active
          </Badge>
        );
      case 'inactive':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
            Inactive
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="capitalize">
            {normalizedStatus}
          </Badge>
        );
    }
  };

  // --- RENDER ---

  if (loading) {
    return (
      <div className="p-12 text-center text-muted-foreground animate-pulse">
        Loading employee data...
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
            Manage your organization's workforce
          </p>
        </div>
        <Button onClick={() => navigate('/admin/employees/add')}>
          + Add Employee
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Name Filter */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by name..."
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Email Filter */}
        <Input
          placeholder="Filter by email..."
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
          className="w-full sm:max-w-xs"
        />

        {/* Department Filter */}
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="flex h-10 w-full sm:max-w-xs items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">All Departments</option>
          {uniqueDepartments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* Column Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Object.keys(visibleColumns).map((key) => (
              <DropdownMenuCheckboxItem
                key={key}
                className="capitalize"
                checked={visibleColumns[key as keyof typeof visibleColumns]}
                onCheckedChange={(checked) =>
                  setVisibleColumns((prev) => ({ ...prev, [key]: checked }))
                }
              >
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b bg-muted/30">
            <tr className="border-b transition-colors hover:bg-muted/50">
              {visibleColumns.name && (
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('fullName')}
                    className="-ml-4 h-8"
                  >
                    Name <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
              )}

              {visibleColumns.email && (
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('email')}
                    className="-ml-4 h-8"
                  >
                    Email <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
              )}

              {visibleColumns.department && (
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('department')}
                    className="-ml-4 h-8"
                  >
                    Department <ArrowUpDown className="ml-2 h-4 w-4" />
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

              {visibleColumns.hireDate && (
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Hire Date
                </th>
              )}

              {visibleColumns.actions && (
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
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
                  {visibleColumns.name && (
                    <td className="p-4 align-middle font-medium text-foreground">
                      {employee.fullName}
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

                  {visibleColumns.hireDate && (
                    <td className="p-4 align-middle">
                      {formatDate(employee.hireDate)}
                    </td>
                  )}

                  {visibleColumns.actions && (
                    <td className="p-4 align-middle text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigate(`/admin/employees/${employee.id}`)
                        }
                      >
                        View
                      </Button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={Object.values(visibleColumns).filter(Boolean).length}
                  className="h-24 text-center p-4 align-middle text-muted-foreground"
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
          Showing {paginatedEmployees.length} of {sortedEmployees.length}{' '}
          result(s).
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium mr-4">
            Page {currentPage} of {totalPages || 1}
          </p>
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
            disabled={currentPage >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
