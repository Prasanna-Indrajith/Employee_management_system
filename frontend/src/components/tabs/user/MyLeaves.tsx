'use client';

import React, { useEffect, useState } from 'react';
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
// Import the API we just created
import { leaveAPI } from '@/services/api';
import { toast } from 'sonner';

export default function MyLeaves() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaveHistory, setLeaveHistory] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  // 1. Fetch History on Mount
  const fetchLeaves = async () => {
    try {
      const response = await leaveAPI.getMyLeaves();
      if (response.success && response.data) {
        setLeaveHistory(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch leaves', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // 2. Handle Submit
  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // This one function handles Loading, Success, AND Error states
    toast.promise(leaveAPI.requestLeave(formData), {
      loading: 'Submitting your request...',
      success: () => {
        setFormData({ leaveType: '', startDate: '', endDate: '', reason: '' });
        fetchLeaves();
        return 'Request submitted! Your manager has been notified.';
      },
      error: () => {
        return 'Could not submit request. Please check your connection.';
      },
      finally: () => setIsSubmitting(false),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">My Leaves</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {/* REQUEST FORM */}
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
                <Select
                  value={formData.leaveType}
                  onValueChange={(val) =>
                    setFormData({ ...formData, leaveType: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Annual">Annual Leave</SelectItem>
                    <SelectItem value="Medical">Medical Leave</SelectItem>
                    <SelectItem value="Casual">Casual Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From Date</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>To Date</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Reason</Label>
                <Textarea
                  placeholder="Briefly describe why you need time off..."
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* HISTORY LIST */}
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
              {loading ? (
                <p className="text-sm text-muted-foreground">
                  Loading history...
                </p>
              ) : leaveHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No leave history found.
                </p>
              ) : (
                leaveHistory.map((leave) => (
                  <div
                    key={leave.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-medium leading-none">
                        {leave.leaveType || leave.type} Leave
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {/* If dates is an array, show the first one, or a summary */}
                        {new Date(
                          leave.dates?.[0] || leave.requestedOn
                        ).toLocaleDateString()}{' '}
                        • {leave.duration}
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
                      className={
                        leave.status === 'Approved'
                          ? 'bg-green-100 text-green-700 hover:bg-green-100'
                          : leave.status === 'Rejected'
                          ? 'bg-red-100 text-red-700 hover:bg-red-100'
                          : ''
                      }
                    >
                      {leave.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
