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
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

// Mock Data for the currently logged-in user
const currentUser = {
  id: 'emp005',
  name: 'Kasun Perera',
  email: 'kasun.perera@orian.com',
  phone: '+94 77 123 4567',
  department: 'Engineering',
  position: 'Senior Developer',
  joinDate: '2023-01-15',
  status: 'Active',
  location: 'Colombo, Sri Lanka',
  salary: 'Rs. 120,000',
  employeeType: 'Full-time',
  bio: 'Frontend developer with a passion for creating beautiful and intuitive user interfaces using modern web technologies.',
  skills: ['React', 'Vue.js', 'CSS', 'JavaScript', 'UI/UX Design', 'Figma'],
};

export default function UserProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Simulate loading data
  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-muted-foreground">Loading your profile...</div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-row gap-4 items-center">
          {/* Avatar Placeholder */}
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center border-2 border-background shadow-sm">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {currentUser.name}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>{currentUser.position}</span>
              <span>•</span>
              <span>{currentUser.department}</span>
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
          {/* 1. Contact & Basic Info */}
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
                        {currentUser.email}
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
                        {currentUser.phone}
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
                        {currentUser.location}
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
                        {currentUser.department}
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
                        {currentUser.joinDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              {currentUser.bio && (
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">About Me</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {currentUser.bio}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 2. Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {currentUser.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
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
                    {currentUser.id}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-200 bg-green-50"
                  >
                    {currentUser.status}
                  </Badge>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="text-sm font-medium">
                    {currentUser.employeeType}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-muted-foreground">
                    Basic Salary
                  </span>
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    <ShieldCheck className="h-3 w-3 text-muted-foreground" />
                    <span>{currentUser.salary}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
