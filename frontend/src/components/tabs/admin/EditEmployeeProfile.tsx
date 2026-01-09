'use client';

import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Save, X, AlertCircle, Loader2 } from 'lucide-react';
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

// API & Types
import { employeeAPI } from '@/services/api';
import type { LookupData, Employee } from '@/types';
import { toast } from 'sonner';

export default function EditEmployee() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    emailUser: '', // We only store the "kasun.perera" part here
    phone: '',
    locationId: '',
    departmentId: '',
    positionId: '',
    joinDate: '',
    employmentType: '',
    salary: '',
    status: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- 3. FETCH DATA ON LOAD ---
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        // Run both requests in parallel for speed
        const [lookupRes, empRes] = await Promise.all([
          employeeAPI.getLookups(),
          employeeAPI.getById(id),
        ]);

        if (lookupRes.success) setLookups(lookupRes.data);

        if (empRes.success && empRes.data) {
          const emp = empRes.data;

          // Split Name
          const nameParts = emp.fullName.split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';

          // Split Email (Extract username part)
          const emailUser = emp.email.split('@')[0] || '';

          // Find IDs based on names (Since GET returns strings like "Engineering")
          // In a real app, GET /:id should ideally return IDs.
          // If your API returns names, we map them back to IDs here:
          const dept = lookupRes.data.departments.find(
            (d) => d.name === emp.department
          );
          const pos = lookupRes.data.positions.find(
            (p) => p.title === emp.position
          );
          const loc = lookupRes.data.locations.find(
            (l) => l.name === emp.location
          );

          setFormData({
            firstName,
            lastName,
            emailUser,
            phone: emp.phone,
            locationId: loc ? loc.id.toString() : '',
            departmentId: dept ? dept.id.toString() : '',
            positionId: pos ? pos.id.toString() : '',
            joinDate: emp.hireDate ? emp.hireDate.split('T')[0] : '',
            employmentType: emp.employmentType || 'Full-time',
            salary: emp.salary?.toString() || '',
            status: emp.status || 'active',
          });
        }
      } catch (error) {
        console.error('Failed to load data', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  // --- 4. FILTER POSITIONS LOGIC ---
  const filteredPositions = useMemo(() => {
    if (!formData.departmentId) return [];
    return lookups.positions.filter(
      (pos) => pos.department_id === Number(formData.departmentId)
    );
  }, [formData.departmentId, lookups.positions]);

  // --- HANDLERS ---
  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Reset position if department changes
    if (name === 'departmentId') {
      setFormData((prev) => ({ ...prev, departmentId: value, positionId: '' }));
    }

    if (errors[name]) {
      setErrors((prev) => {
        const newErr = { ...prev };
        delete newErr[name];
        return newErr;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.emailUser) newErrors.emailUser = 'Email username is required';

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(?:\+94|0)?[1-9]\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid Sri Lankan phone number';
    }

    if (!formData.locationId) newErrors.locationId = 'Required';
    if (!formData.departmentId) newErrors.departmentId = 'Required';
    if (!formData.positionId) newErrors.positionId = 'Required';

    if (!formData.salary || isNaN(Number(formData.salary))) {
      newErrors.salary = 'Invalid salary';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !id) return;

    // 1. Data Preparation Logic
    let formattedPhone = formData.phone;
    if (!formattedPhone.startsWith('+94')) {
      formattedPhone = formattedPhone.startsWith('0')
        ? `+94${formattedPhone.substring(1)}`
        : `+94${formattedPhone}`;
    }

    const fullEmail = `${formData.emailUser}@orian.com`.toLowerCase();

    const payload: any = {
      fullName: `${formData.firstName} ${formData.lastName}`,
      email: fullEmail,
      phone: formattedPhone,
      departmentId: Number(formData.departmentId),
      positionId: Number(formData.positionId),
      locationId: Number(formData.locationId),
      employmentType: formData.employmentType,
      salary: Number(formData.salary),
      status: formData.status,
    };

    // 2. The Clean UI Implementation
    setIsSubmitting(true);

    toast.promise(employeeAPI.update(id, payload), {
      loading: `Updating records for ${formData.firstName}...`,
      success: (response) => {
        // Check if the API returned success: true
        if (response.success) {
          navigate('/admin/employees/all');
          return 'Employee profile updated successfully.';
        }
        throw new Error(response.message || 'Update rejected by server.');
      },
      error: (err) => {
        console.error('Update failed', err);
        // Extracts backend error message or uses a fallback
        return (
          err.response?.data?.message ||
          'Failed to update profile. Please check the data.'
        );
      },
      finally: () => setIsSubmitting(false),
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
            Updating details for{' '}
            <span className="font-semibold text-foreground">
              {formData.firstName} {formData.lastName}
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

      <div className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                />
              </div>

              {/* Email Editor */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <div className="flex items-center gap-2">
                  <Input
                    value={formData.emailUser}
                    onChange={(e) => handleChange('emailUser', e.target.value)}
                    className="text-right"
                  />
                  <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-2 rounded-md border">
                    @orian.com
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Updating this will change their login username.
                </p>
                {errors.emailUser && (
                  <p className="text-sm text-red-600">{errors.emailUser}</p>
                )}
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

              {/* Location (Dynamic) */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select
                  value={formData.locationId}
                  onValueChange={(val) => handleChange('locationId', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {lookups.locations.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id.toString()}>
                        {loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.locationId && (
                  <p className="text-sm text-red-600">{errors.locationId}</p>
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
              {/* Department (Dynamic) */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Select
                  value={formData.departmentId}
                  onValueChange={(val) => handleChange('departmentId', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {lookups.departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.departmentId && (
                  <p className="text-sm text-red-600">{errors.departmentId}</p>
                )}
              </div>

              {/* Position (Dynamic & Filtered) */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Position</label>
                <Select
                  value={formData.positionId}
                  onValueChange={(val) => handleChange('positionId', val)}
                  disabled={!formData.departmentId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Position" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredPositions.map((pos) => (
                      <SelectItem key={pos.id} value={pos.id.toString()}>
                        {pos.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.positionId && (
                  <p className="text-sm text-red-600">{errors.positionId}</p>
                )}
              </div>

              {/* Employment Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Employment Type</label>
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

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => handleChange('status', val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on leave">On Leave</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Salary */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Salary (Monthly)</label>
                <Input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => handleChange('salary', e.target.value)}
                />
                {errors.salary && (
                  <p className="text-sm text-red-600">{errors.salary}</p>
                )}
              </div>

              {/* Join Date (ReadOnly) */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Join Date</label>
                <Input
                  value={formData.joinDate}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Historical records cannot be modified.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/employees/all')}
          >
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
