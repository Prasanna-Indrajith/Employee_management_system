'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { IconCalendarPlus, IconHistory } from '@tabler/icons-react';

export default function MyLeaves() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Leave requested successfully!');
    }, 1000);
  };

  const leaveHistory = [
    {
      id: 1,
      type: 'Medical',
      date: 'Nov 12, 2025',
      days: 1,
      status: 'Approved',
    },
    {
      id: 2,
      type: 'Annual',
      date: 'Oct 05, 2025',
      days: 2,
      status: 'Rejected',
    },
    {
      id: 3,
      type: 'Casual',
      date: 'Sep 20, 2025',
      days: 1,
      status: 'Approved',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">My Leaves</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {/* 1. Request Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconCalendarPlus className="size-5" />
              Request Time Off
            </CardTitle>
            <CardDescription>
              Submit a new leave request for approval.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRequest} className="space-y-4">
              <div className="space-y-2">
                <Label>Leave Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annual">Annual Leave</SelectItem>
                    <SelectItem value="medical">Medical Leave</SelectItem>
                    <SelectItem value="casual">Casual Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>To Date</Label>
                  <Input type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Reason</Label>
                <Textarea placeholder="Briefly describe why you need time off..." />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 2. Leave History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconHistory className="size-5" />
              Request History
            </CardTitle>
            <CardDescription>
              Status of your recent leave applications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaveHistory.map((leave) => (
                <div
                  key={leave.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium leading-none">
                      {leave.type} Leave
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {leave.date} • {leave.days} Day(s)
                    </p>
                  </div>
                  <Badge
                    variant={
                      leave.status === 'Approved'
                        ? 'default'
                        : leave.status === 'Rejected'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {leave.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
