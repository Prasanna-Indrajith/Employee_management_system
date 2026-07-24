'use client';

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Loader2 } from 'lucide-react';
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

// Import your API and Types
import { employeeAPI } from '@/services/api';
import type { LookupData } from '@/types';
import { toast } from 'sonner';

export default function AddEmployee() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLookups, setIsLoadingLookups] = useState(true);

  // --- 1. DYNAMIC DATA STATE ---
  const [lookups, setLookups] = useState<LookupData>({
    departments: [],
    positions: [],
    locations: [],
  });

  // --- 2. FORM STATE ---
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    location: '', // Will store Location ID (as string)
    department: '', // Will store Department ID (as string)
    position: '', // Will store Position ID (as string)
    hireDate: new Date().toISOString().split('T')[0],
    employmentType: 'Full-time',
    salary: '',
    role: 'user',
    status: 'active',
    bio: '',
    skills: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- 3. FETCH DATA ON LOAD ---
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await employeeAPI.getLookups();
        if (response.success) {
          setLookups(response.data);
        }
      } catch (error) {
        console.error('Failed to load dropdowns', error);
      } finally {
        setIsLoadingLookups(false);
      }
    };
    fetchOptions();
  }, []);

  // --- 4. FILTER POSITIONS (Optional but good UX) ---
  // Only show positions that belong to the selected department
  const filteredPositions = useMemo(() => {
    if (!formData.department) return [];
    return lookups.positions.filter(
      (pos) => pos.department_id === Number(formData.department)
    );
  }, [formData.department, lookups.positions]);

  // --- HANDLERS ---
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Reset position if department changes
    if (field === 'department') {
      setFormData((prev) => ({ ...prev, department: value, position: '' }));
    }

    // Clear error
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(?:\+94|0)?[1-9]\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid Sri Lankan phone number';
    }

    if (!formData.location) newErrors.location = 'Please select a location';
    if (!formData.department)
      newErrors.department = 'Please select a department';
    if (!formData.position) newErrors.position = 'Please select a position';

    if (
      !formData.salary ||
      isNaN(Number(formData.salary)) ||
      Number(formData.salary) <= 0
    ) {
      newErrors.salary = 'Salary must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // 1. Generate logic
    const fullName = `${formData.firstName} ${formData.lastName}`;
    const email =
      `${formData.firstName}.${formData.lastName}@orian.com`.toLowerCase();

    // Phone Formatting
    let formattedPhone = formData.phone;
    if (!formattedPhone.startsWith('+94')) {
      formattedPhone = formattedPhone.startsWith('0')
        ? `+94${formattedPhone.substring(1)}`
        : `+94${formattedPhone}`;
    }

    // 2. Prepare Payload (Converting IDs to Numbers)
    const payload: any = {
      fullName,
      email,
      phone: formattedPhone,
      departmentId: Number(formData.department), // Convert String ID to Number
      positionId: Number(formData.position), // Convert String ID to Number
      locationId: Number(formData.location), // Convert String ID to Number
      hireDate: formData.hireDate,
      salary: Number(formData.salary),
      role: formData.role as 'admin' | 'user',
      employmentType: formData.employmentType as any,
      bio: formData.bio,
      skills: formData.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    toast.promise(employeeAPI.create(payload), {
      loading: `Creating profile for ${fullName}...`,
      success: () => {
        // Small delay or immediate navigation
        navigate('/admin/employees/all');
        return `${formData.firstName} has been added to the system.`;
      },
      error: (err) => {
        // Extracts the specific backend error message if it exists
        return (
          err.response?.data?.message || 'Could not create employee record.'
        );
      },
      finally: () => setIsSubmitting(false),
    });
  };

  if (isLoadingLookups) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* SECTION 1: Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Identity and contact details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">First Name *</label>
              <Input
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
              />
              {errors.firstName && (
                <p className="text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Last Name *</label>
              <Input
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
              />
              {errors.lastName && (
                <p className="text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number *</label>
              <Input
                placeholder="077 123 4567"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Location (DYNAMIC) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Location *</label>
              <Select
                value={formData.location}
                onValueChange={(val) => handleChange('location', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {lookups.locations.map((loc) => (
                    // Use ID as value, Name as Label
                    <SelectItem key={loc.id} value={loc.id.toString()}>
                      {loc.name}
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

      {/* SECTION 2: Employment Details */}
      <Card>
        <CardHeader>
          <CardTitle>Employment Details</CardTitle>
          <CardDescription>Role and compensation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Department (DYNAMIC) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Department *</label>
              <Select
                value={formData.department}
                onValueChange={(val) => handleChange('department', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {lookups.departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department && (
                <p className="text-sm text-red-600">{errors.department}</p>
              )}
            </div>

            {/* Position (DYNAMIC & FILTERED) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Position *</label>
              <Select
                value={formData.position}
                onValueChange={(val) => handleChange('position', val)}
                disabled={!formData.department} // Disable if no department selected
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      formData.department
                        ? 'Select position'
                        : 'Select Department first'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {filteredPositions.map((pos) => (
                    <SelectItem key={pos.id} value={pos.id.toString()}>
                      {pos.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.position && (
                <p className="text-sm text-red-600">{errors.position}</p>
              )}
            </div>

            {/* Employment Type (Static is fine here) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Type *</label>
              <Select
                value={formData.employmentType}
                onValueChange={(val) => handleChange('employmentType', val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Hire Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Join Date *</label>
              <Input
                type="date"
                value={formData.hireDate}
                onChange={(e) => handleChange('hireDate', e.target.value)}
              />
            </div>

            {/* Salary */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">
                Monthly Salary (LKR) *
              </label>
              <Input
                type="number"
                placeholder="150000"
                value={formData.salary}
                onChange={(e) => handleChange('salary', e.target.value)}
              />
              {errors.salary && (
                <p className="text-sm text-red-600">{errors.salary}</p>
              )}
            </div>

            {/* Bio */}
            {/* <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Short Bio</label>
              <Input
                placeholder="Brief professional summary..."
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
              />
            </div> */}

            {/* Skills */}
            {/* <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">
                Skills (Comma separated)
              </label>
              <Input
                placeholder="React, TypeScript, Node.js"
                value={formData.skills}
                onChange={(e) => handleChange('skills', e.target.value)}
              />
            </div> */}
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          type="button"
          onClick={() => navigate('/admin/employees/all')}
        >
          <X className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Add Employee
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
