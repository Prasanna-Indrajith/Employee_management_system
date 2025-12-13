'use client';

import { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';

// Sri Lankan locations
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

// Departments
const departments = [
  'Engineering',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Design',
];

// Positions
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

// Employment types
const employmentTypes = ['Full-time', 'Part-time', 'Contract'];

export default function AddEmployee() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate next employee ID
  const generateEmployeeId = () => {
    const lastId = 5;
    const nextId = lastId + 1;
    return `emp${String(nextId).padStart(3, '0')}`;
  };

  // Form state
  const [formData, setFormData] = useState({
    employeeId: generateEmployeeId(),
    fullName: '',
    emailUsername: '',
    phone: '',
    location: '',
    department: '',
    position: '',
    joinDate: '',
    employmentType: '',
    salary: '',
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName || formData.fullName.length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.emailUsername || formData.emailUsername.length < 3) {
      newErrors.emailUsername = 'Email username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9._-]+$/.test(formData.emailUsername)) {
      newErrors.emailUsername =
        'Only letters, numbers, dots, hyphens and underscores allowed';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(?:\+94|0)?[1-9]\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid Sri Lankan phone number format';
    }

    if (!formData.location) {
      newErrors.location = 'Please select a location';
    }

    if (!formData.department) {
      newErrors.department = 'Please select a department';
    }

    if (!formData.position) {
      newErrors.position = 'Please select a position';
    }

    if (!formData.joinDate) {
      newErrors.joinDate = 'Please select a join date';
    }

    if (!formData.employmentType) {
      newErrors.employmentType = 'Please select employment type';
    }

    if (!formData.salary) {
      newErrors.salary = 'Salary is required';
    } else if (!/^\d+$/.test(formData.salary)) {
      newErrors.salary = 'Salary must be a valid number';
    } else if (parseInt(formData.salary) <= 0) {
      newErrors.salary = 'Salary must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Construct full email
    const fullEmail = `${formData.emailUsername}@orian.com`;

    // Format phone number
    let formattedPhone = formData.phone;
    if (!formattedPhone.startsWith('+94')) {
      formattedPhone = formattedPhone.startsWith('0')
        ? `+94${formattedPhone.substring(1)}`
        : `+94${formattedPhone}`;
    }

    // Format salary
    const formattedSalary = `Rs. ${parseInt(formData.salary).toLocaleString(
      'en-US'
    )}`;

    const employeeData = {
      id: formData.employeeId,
      name: formData.fullName,
      email: fullEmail,
      phone: formattedPhone,
      location: formData.location,
      department: formData.department,
      position: formData.position,
      joinDate: formData.joinDate,
      employmentType: formData.employmentType,
      salary: formattedSalary,
      status: 'Active',
    };

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log('New Employee Data:', employeeData);

    alert(`Employee ${formData.fullName} added successfully!`);

    setIsSubmitting(false);

    // In real app: navigate back to employee list
    navigate('/admin/employees/all');
  };

  const handleCancel = () => {
    // console.log('Cancel - navigate back');
    navigate('/admin/employees/all');
  };

  // Get today's date for max date validation
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Add New Employee
          </h1>
          <p className="text-muted-foreground">Create a new employee profile</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Employee ID - Read Only */}
        <Card>
          <CardHeader>
            <CardTitle>Employee ID</CardTitle>
            <CardDescription>
              Auto-generated employee identification number
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              value={formData.employeeId}
              disabled
              className="max-w-xs font-mono bg-muted"
            />
            <p className="text-sm text-muted-foreground mt-2">
              This ID is automatically generated and cannot be changed
            </p>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic employee details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name *</label>
                <Input
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              {/* Email Username */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Email *</label>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="john.doe"
                    value={formData.emailUsername}
                    onChange={(e) =>
                      handleChange('emailUsername', e.target.value)
                    }
                  />
                  <span className="text-muted-foreground whitespace-nowrap">
                    @orian.com
                  </span>
                </div>
                {formData.emailUsername && !errors.emailUsername && (
                  <p className="text-sm text-muted-foreground">
                    Email: {formData.emailUsername}@orian.com
                  </p>
                )}
                {errors.emailUsername && (
                  <p className="text-sm text-red-600">{errors.emailUsername}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number *</label>
                <Input
                  placeholder="0712345678"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Location *</label>
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
            <CardDescription>Job and compensation information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Department */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Department *</label>
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
                {errors.department && (
                  <p className="text-sm text-red-600">{errors.department}</p>
                )}
              </div>

              {/* Position */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Position *</label>
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
                {errors.position && (
                  <p className="text-sm text-red-600">{errors.position}</p>
                )}
              </div>

              {/* Join Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Join Date *</label>
                <Input
                  type="date"
                  max={today}
                  value={formData.joinDate}
                  onChange={(e) => handleChange('joinDate', e.target.value)}
                />
                {errors.joinDate && (
                  <p className="text-sm text-red-600">{errors.joinDate}</p>
                )}
              </div>

              {/* Employment Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Employment Type *</label>
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
                {errors.employmentType && (
                  <p className="text-sm text-red-600">
                    {errors.employmentType}
                  </p>
                )}
              </div>

              {/* Salary */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">
                  Salary (Monthly) *
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Rs.</span>
                  <Input
                    type="text"
                    placeholder="50000"
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
                      Salary: Rs.{' '}
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
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Adding Employee...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Add Employee
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
