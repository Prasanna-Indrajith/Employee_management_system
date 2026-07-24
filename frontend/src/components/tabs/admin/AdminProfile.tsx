'use client';

import { useState } from 'react';
import { User, Mail, ShieldCheck, Key, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
// import { Switch } from '@/components/ui/switch'; // Ensure you have this, or remove if not

export default function AdminProfile() {
  const [isSaving, setIsSaving] = useState(false);

  // Mock Admin Data
  const adminData = {
    name: 'Admin User',
    email: 'admin@orian.com',
    role: 'Super Administrator',
    lastLogin: 'Today, 09:41 AM',
    avatar: '/avatars/admin.jpg',
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings updated successfully');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile and security preferences.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* LEFT COLUMN: Identity Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your visible admin identity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar & Role */}
            <div className="flex flex-col items-center gap-4 p-4 bg-muted/30 rounded-lg border border-dashed">
              <Avatar className="h-24 w-24">
                <AvatarImage src={adminData.avatar} />
                <AvatarFallback className="text-2xl">AD</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-semibold">{adminData.name}</h2>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    {adminData.role}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Basic Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Display Name</Label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input defaultValue={adminData.name} className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input defaultValue={adminData.email} className="pl-9" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT COLUMN: Security & Preferences */}
        <div className="space-y-6">
          {/* Security Card */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Update your password and access.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <div className="relative">
                  <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <div className="relative">
                  <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/20 py-3">
              <p className="text-xs text-muted-foreground">
                Last login:{' '}
                <span className="font-mono text-foreground">
                  {adminData.lastLogin}
                </span>
              </p>
            </CardFooter>
          </Card>

          {/* Preferences Card (Simplified) */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Alerts</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive daily summaries.
                  </p>
                </div>
                {/* If you don't have Switch component, use a Checkbox or simple Button */}
                <div className="h-6 w-10 bg-primary/20 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 h-4 w-4 bg-primary rounded-full shadow-sm"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Security Alerts</Label>
                  <p className="text-xs text-muted-foreground">
                    Login attempts & changes.
                  </p>
                </div>
                <div className="h-6 w-10 bg-primary/20 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 h-4 w-4 bg-primary rounded-full shadow-sm"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                'Saving...'
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
