'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, AlertCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

export default function EditUserProfile() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State (Mock data loaded)
  const [formData, setFormData] = useState({
    name: 'Kasun Perera',
    email: 'kasun.perera@orian.com',
    id: 'emp005',
    department: 'Engineering',
    position: 'Senior Developer',
    phone: '+94 77 123 4567',
    location: 'Colombo, Sri Lanka',
    bio: 'Frontend developer with a passion for creating beautiful and intuitive user interfaces.',
    skills: 'React, Vue.js, CSS, JavaScript, UI/UX Design', // Comma separated for easier editing
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API Update
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In real app: Update context/DB
    console.log('Updated Profile:', formData);

    setIsSubmitting(false);
    navigate('/user/profile'); // Go back to profile view
  };

  return (
    <div className="w-full mx-auto space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => navigate('/user/profile')}
          variant="ghost"
          size="sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Edit Your Profile</h1>
      </div>

      {/* Info Alert */}
      <Alert variant="default" className="bg-muted/50 border-muted">
        <div className="flex gap-1 font-bold">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-bold">
            Why are some fields locked?
          </AlertTitle>
        </div>
        <AlertDescription>
          To ensure data integrity, fields like Name, Email, and Department are
          managed by HR. Please contact HR to update legal information.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: Locked Info */}
        <Card className="bg-muted/20 border-dashed">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
              <Lock className="h-4 w-4" />
              Official Information (Read-Only)
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Full Name</Label>
              <Input disabled value={formData.name} className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Email Address</Label>
              <Input disabled value={formData.email} className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Department</Label>
              <Input
                disabled
                value={formData.department}
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Position</Label>
              <Input disabled value={formData.position} className="bg-muted" />
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2: Editable Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your contact details and location.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location / City</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 3: Bio & Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Details</CardTitle>
            <CardDescription>
              Share a bit about yourself and your skills.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bio">Bio / About Me</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills (Comma separated)</Label>
              <Input
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Design, Marketing..."
              />
              <p className="text-xs text-muted-foreground">
                Example: React, Project Management, Figma
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/user/profile')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
