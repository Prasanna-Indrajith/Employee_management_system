'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// --- REUSING CONSTANTS (Ideally move these to a shared constants file) ---
const sriLankanLocations = [
  'Colombo',
  'Kandy',
  'Galle',
  'Jaffna',
  'Negombo',
  'Trincomalee',
  'Batticaloa',
  'Matara',
  'Anuradhapura',
  'Kurunegala',
  'Ratnapura',
  'Badulla',
  'Gampaha',
  'Kalutara',
  'Nuwara Eliya',
];
const departments = [
  'Engineering',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Design',
];
const positions = [
  'Senior Developer',
  'Junior Developer',
  'Team Lead',
  'Manager',
  'Senior Manager',
  'Specialist',
  'Senior Specialist',
  'Associate',
  'Executive',
  'Senior Executive',
  'Analyst',
  'Designer',
  'UI/UX Designer',
  'Product Manager',
  'Project Manager',
  'HR Manager',
  'Sales Representative',
  'Marketing Executive',
  'Finance Officer',
  'Accountant',
];
const employmentTypes = ['Full-time', 'Part-time', 'Contract'];

export default function EditEmployee() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the ID from the URL (e.g., /edit/emp005)

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state for fetching data

  // Form state
  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    email: '', // Storing full email for edit mode
    phone: '',
    location: '',
    department: '',
    position: '',
    joinDate: '',
    employmentType: '',
    salary: '',
  });

  const [errors, setErrors] = useState({});

  // Simulate fetching data based on ID
  useEffect(() => {
    // In a real app, you would fetch from API: axios.get(`/api/employees/${id}`)
    const fetchEmployeeData = async () => {
      setIsLoading(true);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // MOCK DATA - Simulating what the database returns
      const mockData = {
        employeeId: id || 'emp005',
        fullName: 'Kasun Perera',
        email: 'kasun.perera@orian.com',
        phone: '0771234567',
        location: 'Colombo',
        department: 'Engineering',
        position: 'Senior Developer',
        joinDate: '2023-01-15',
        employmentType: 'Full-time',
        salary: '120000', // Raw number string
      };

      setFormData(mockData);
      setIsLoading(false);
    };

    fetchEmployeeData();
  }, [id]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName || formData.fullName.length < 2)
      newErrors.fullName = 'Name must be at least 2 characters';

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(?:\+94|0)?[1-9]\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid Sri Lankan phone number format';
    }

    if (!formData.location) newErrors.location = 'Please select a location';
    if (!formData.department)
      newErrors.department = 'Please select a department';
    if (!formData.position) newErrors.position = 'Please select a position';
    if (!formData.employmentType)
      newErrors.employmentType = 'Please select employment type';

    if (!formData.salary) {
      newErrors.salary = 'Salary is required';
    } else if (!/^\d+$/.test(formData.salary)) {
      newErrors.salary = 'Salary must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Format phone if changed
    let formattedPhone = formData.phone;
    if (!formattedPhone.startsWith('+94')) {
      formattedPhone = formattedPhone.startsWith('0')
        ? `+94${formattedPhone.substring(1)}`
        : `+94${formattedPhone}`;
    }

    // Prepare update payload
    const updateData = {
      ...formData,
      phone: formattedPhone,
      salary: `Rs. ${parseInt(formData.salary).toLocaleString('en-US')}`,
    };

    // Simulate API Update
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Updated Employee Data:', updateData);

    alert(`Profile for ${formData.fullName} updated successfully!`);
    setIsSubmitting(false);
    navigate('/admin/employees/all');
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading employee profile...
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Employee</h1>
          <p className="text-muted-foreground">
            Managing details for{' '}
            <span className="font-semibold text-foreground">
              {formData.employeeId}
            </span>
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/admin/employees/all')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
        </Button>
      </div>

      {/* Admin Notice Alert */}
      <Alert variant="default" className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">Admin Access</AlertTitle>
        <AlertDescription className="text-blue-700">
          Some sensitive fields (Email, Join Date) are locked and cannot be
          modified directly. Contact super-admin for sensitive data changes.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Employee ID (Read Only) */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Employee ID</label>
                <Input
                  value={formData.employeeId}
                  disabled
                  className="bg-muted font-mono"
                />
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              {/* Email (Read Only - Locked for Admin) */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input
                  value={formData.email}
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed while active.
                </p>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => handleChange('location', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    {sriLankanLocations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.location && (
                  <p className="text-sm text-red-600">{errors.location}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employment Details */}
        <Card>
          <CardHeader>
            <CardTitle>Employment Details</CardTitle>
            <CardDescription>Manage role and compensation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Department */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleChange('department', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Position */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Position</label>
                <Select
                  value={formData.position}
                  onValueChange={(value) => handleChange('position', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((pos) => (
                      <SelectItem key={pos} value={pos}>
                        {pos}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Join Date (Read Only - Locked) */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Join Date</label>
                <Input
                  type="date"
                  value={formData.joinDate}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Historical records cannot be modified.
                </p>
              </div>

              {/* Employment Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Employment Type</label>
                <Select
                  value={formData.employmentType}
                  onValueChange={(value) =>
                    handleChange('employmentType', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {employmentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Salary */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Salary (Monthly)</label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Rs.</span>
                  <Input
                    type="text"
                    value={formData.salary}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      handleChange('salary', value);
                    }}
                  />
                </div>
                {formData.salary &&
                  parseInt(formData.salary) > 0 &&
                  !errors.salary && (
                    <p className="text-sm text-muted-foreground">
                      Current: Rs.{' '}
                      {parseInt(formData.salary).toLocaleString('en-US')}
                    </p>
                  )}
                {errors.salary && (
                  <p className="text-sm text-red-600">{errors.salary}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/employees/all')}
            disabled={isSubmitting}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Updating Profile...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
