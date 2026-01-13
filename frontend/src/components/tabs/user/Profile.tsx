'use client';

import { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Building,
  Edit,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { employeeAPI, payrollAPI } from '@/services/api';
import type { Employee } from '@/types';
// Import the Interface from the component to ensure types match exactly
// import {
//   SalaryBreakdownCard,
//   SalaryBreakdown,
// } from '@/components/ui/salary-breakdown-card';

export default function UserProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Employee | null>(null);

  // FIX 1: State uses the UI Component's type, not the API type
  // const [salaryBreakdown, setSalaryBreakdown] =
  //   useState<SalaryBreakdown | null>(null);

  // FIX 2: Helper function to transform API data to UI format
  // const transformSalaryData = (apiData: any): SalaryBreakdown => {
  //   // defaults to 0 to prevent NaN
  //   const base = apiData.baseSalary || 0;
  //   const overtime = apiData.overtimePay || 0;
  //   const bonuses = apiData.bonuses || 0;
  //   const allowances = apiData.allowances || 0;
  //   const commissions = apiData.commissions || 0;

  //   // Calculate total earnings if missing
  //   const totalEarnings = base + overtime + bonuses + allowances + commissions;

  //   const fedTax = apiData.federalTax || 0;
  //   const stateTax = apiData.stateTax || 0;
  //   const insurance = apiData.insurance || 0;
  //   const retirement = apiData.retirement || 0;
  //   const other = apiData.otherDeductions || 0;

  //   // Calculate total deductions if missing
  //   const totalDeductions = fedTax + stateTax + insurance + retirement + other;

  //   return {
  //     baseSalary: base,
  //     grossPay: apiData.grossPay || totalEarnings,
  //     netPay: apiData.netPay || totalEarnings - totalDeductions,
  //     earnings: {
  //       base: base,
  //       overtime: overtime,
  //       bonuses: bonuses,
  //       allowances: allowances,
  //       commissions: commissions,
  //       total: totalEarnings,
  //     },
  //     deductions: {
  //       federalTax: fedTax,
  //       stateTax: stateTax,
  //       insurance: insurance,
  //       retirement: retirement,
  //       otherDeductions: other,
  //       total: totalDeductions,
  //     },
  //     yearToDate: apiData.yearToDate || undefined,
  //   };
  // };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await employeeAPI.getMyProfile();
        if (response.success && response.data) {
          setProfile(response.data);
          fetchSalaryBreakdown(response.data.id);
        }
      } catch (error) {
        console.error('Failed to load profile', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSalaryBreakdown = async (employeeId: string) => {
      if (!employeeId) return;

      try {
        const response = await payrollAPI.getSingleEmployeeBreakdown(
          employeeId
        );
        if (response.success && response.data) {
          // FIX 3: Transform data before setting state
          // const formattedData = transformSalaryData(response.data);
          // setSalaryBreakdown(formattedData);
        }
      } catch (error) {
        console.error('Failed to fetch salary breakdown:', error);
      }
    };

    fetchProfile();
  }, []);

  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toLocaleString('en-US')}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">
          Loading your profile...
        </span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center text-muted-foreground">
        <User className="h-12 w-12 mb-2 opacity-20" />
        <p>Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-row gap-4 items-center">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center border-2 border-background shadow-sm">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {profile.fullName}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>{profile.position}</span>
              <span>•</span>
              <span>{profile.department}</span>
            </div>
          </div>
        </div>

        <Button onClick={() => navigate('/user/profile/edit')}>
          <Edit className="mr-2 h-4 w-4" />
          Edit My Profile
        </Button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal Info & Skills */}
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
                {/* Contact */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary rounded-md">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">
                        {profile.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary rounded-md">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">
                        {profile.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary rounded-md">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">
                        {profile.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Work Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary rounded-md">
                      <Building className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Department</p>
                      <p className="text-sm text-muted-foreground">
                        {profile.department}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary rounded-md">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Join Date</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(profile.hireDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">About Me</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {profile.bio || 'No bio information provided.'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1"
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No skills listed.
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Employment Meta */}
        <div className="space-y-6">
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-base">Employment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-muted-foreground">
                    Employee ID
                  </span>
                  <span className="text-sm font-medium font-mono">
                    {profile.id.length > 8
                      ? `...${profile.id.slice(-6)}`
                      : profile.id}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge
                    variant="outline"
                    className={
                      profile.status === 'active'
                        ? 'text-green-600 border-green-200 bg-green-50'
                        : 'text-red-600 border-red-200 bg-red-50'
                    }
                  >
                    {profile.status ? profile.status.toUpperCase() : 'UNKNOWN'}
                  </Badge>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="text-sm font-medium">
                    {profile.employmentType}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-muted-foreground">
                    Basic Salary
                  </span>
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    <ShieldCheck className="h-3 w-3 text-muted-foreground" />
                    <span>{formatCurrency(profile.salary)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Salary Breakdown */}
          {/* {salaryBreakdown && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Salary Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <SalaryBreakdownCard
                  breakdown={salaryBreakdown}
                  employeeName=""
                  department=""
                  position=""
                  payPeriod=""
                  compact={true}
                />
              </CardContent>
            </Card>
          )} */}
        </div>
      </div>
    </div>
  );
}
