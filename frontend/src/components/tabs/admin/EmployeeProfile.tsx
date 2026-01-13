'use client';

import * as React from 'react';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Building,
  Clock,
  Edit,
  Trash2,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate, useParams } from 'react-router-dom';

import DeleteConfirmationCard from '../../ui/delete-confirmation'; // Verify this path

// Import API and Shared Types
import { employeeAPI, payrollAPI } from '@/services/api';
import type { Employee, EmployeeSalaryBreakdown } from '@/types';

import { toast } from 'sonner';

export default function EmployeeProfile() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL (e.g. /employees/123)

  const [showDeleteCard, setShowDeleteCard] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [employee, setEmployee] = React.useState<Employee | null>(null);
  const [salaryBreakdown, setSalaryBreakdown] = React.useState<EmployeeSalaryBreakdown | null>(null);

  // --- FETCH DATA ---
  React.useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await employeeAPI.getById(id!);
        if (response.success) {
          setEmployee(response.data);
          // Also fetch salary breakdown
          fetchSalaryBreakdown(id!);
        }
      } catch (error) {
        console.error('Failed to fetch employee:', error);
        toast.error('Failed to load employee data');
      } finally {
        setLoading(false);
      }
    };

    const fetchSalaryBreakdown = async (employeeId: string) => {
      if (!employeeId) return;
      
      try {
        const response = await payrollAPI.getSingleEmployeeBreakdown(employeeId);
        if (response.success && response.data) {
          setSalaryBreakdown(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch salary breakdown:', error);
        // Don't show error toast for salary breakdown as it's secondary
      }
    };

    if (id) {
      fetchEmployee();
    }
  }, [id]);

  // --- HANDLERS ---

  const handleGoBack = () => {
    navigate(`/admin/employees/all`);
  };

  const handleEdit = () => {
    if (employee) {
      navigate(`/admin/employees/${employee.id}/edit`);
    }
  };

  const handleConfirmDelete = async () => {
    if (!employee) return;

    setIsDeleting(true);

    // We return the promise so toast.promise can track it
    toast.promise(employeeAPI.delete(employee.id), {
      loading: `Removing ${employee.fullName} from the system...`,
      success: (response) => {
        // Small check if your API returns success: false instead of throwing
        if (response.success) {
          navigate(`/admin/employees/all`);
          return 'Employee deleted successfully.';
        }
        throw new Error('Delete failed');
      },
      error: (err) => {
        console.error('Delete error:', err);
        return 'Could not delete employee. They may have linked records (like leaves).';
      },
      finally: () => {
        setIsDeleting(false);
        setShowDeleteCard(false);
      },
    });
  };

  const handleCancelDelete = () => {
    setShowDeleteCard(false);
  };

  // --- HELPERS ---

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return 'N/A';
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    // Normalize status to lowercase for comparison
    const s = status?.toLowerCase() || 'inactive';

    if (s === 'active') {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Active
        </Badge>
      );
    } else if (s === 'on leave') {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          On Leave
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          Inactive
        </Badge>
      );
    }
  };

  // --- RENDER ---

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading employee profile...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Employee Not Found</h2>
          <p className="text-muted-foreground">
            The employee you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <Button onClick={handleGoBack} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button onClick={handleGoBack} variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex items-center gap-2">
          {/* Action Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Employee Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(employee.id)}
              >
                <User className="mr-2 h-4 w-4" />
                Copy Database ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteCard(true)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Employee
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Profile Header */}
      <div className="flex flex-row gap-6 items-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
          {/* Initials Avatar */}
          {employee.fullName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {employee.fullName}
          </h1>
          <p className="text-muted-foreground">
            {employee.position} • {employee.department}
          </p>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteCard && (
        <DeleteConfirmationCard
          title="Delete Employee?"
          description="This will permanently delete this employee record and remove their system access. This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isLoading={isDeleting}
        />
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Job Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Department</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.department}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Position</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.position}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Join Date</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(employee.hireDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Bio</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {employee.bio}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card>
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {employee.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Employment Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Employment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {/* ID (Using ID from API if available, else standard ID) */}
                <div>
                  <p className="text-sm font-medium">Employee ID</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {/* If your backend sends 'employeeId' (EMP001), use it. Otherwise fall back to UUID */}
                    {(employee as any).employeeId ||
                      employee.id.substring(0, 8)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium">Status</p>
                  <div className="mt-1">{getStatusBadge(employee.status)}</div>
                </div>

                {employee.employmentType && (
                  <div>
                    <p className="text-sm font-medium">Employment Type</p>
                    <p className="text-sm text-muted-foreground">
                      {employee.employmentType}
                    </p>
                  </div>
                )}

                {employee.salary !== undefined && (
                  <div>
                    <p className="text-sm font-medium">Salary</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(employee.salary)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Salary Breakdown */}
          {salaryBreakdown && (
            <Card>
              <CardHeader>
                <CardTitle>Salary Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Salary</span>
                    <span>{formatCurrency(salaryBreakdown.baseSalary)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Earnings</span>
                    <span className="text-green-600 font-medium">+{formatCurrency(salaryBreakdown.totalEarnings)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Deductions</span>
                    <span className="text-red-600 font-medium">-{formatCurrency(salaryBreakdown.totalDeductions)}</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                    <span>Net Pay</span>
                    <span>{formatCurrency(salaryBreakdown.netPay)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={handleEdit}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() =>
                  (window.location.href = `mailto:${employee.email}`)
                }
              >
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
