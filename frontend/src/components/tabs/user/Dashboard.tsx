'use client';

import {
  Clock,
  Calendar,
  DollarSign,
  Briefcase,
  AlertCircle,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

// Import the themed cards
import { UserSectionCards } from '@/components/section-cards-user';

export default function UserDashboard() {
  const navigate = useNavigate();
  const employeeName = 'Kasun';
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Mock data
  const recentActivity = [
    {
      id: 1,
      type: 'Leave',
      message: 'Medical Leave request approved',
      date: '2 hours ago',
      status: 'Approved',
    },
    {
      id: 2,
      type: 'Announcement',
      message: 'Office closed on Monday (Poya)',
      date: 'Yesterday',
      status: 'Info',
    },
    {
      id: 3,
      type: 'Payroll',
      message: 'October Salary Slip generated',
      date: 'Oct 30',
      status: 'New',
    },
  ];

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Good Morning, {employeeName}
          </h1>
          <p className="text-muted-foreground">{today}</p>
        </div>

        {/* PRIMARY CTA: Uses default theme color (Black in light / White in dark) */}
        <Button size="lg" className="w-full md:w-auto shadow-sm">
          <Clock className="mr-2 h-5 w-5" />
          Clock In (08:30 AM)
        </Button>
      </div>

      {/* 2. STATS CARDS (Themed) */}
      <UserSectionCards />

      {/* 3. Activity and Actions Grid */}
      <div className="px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Feed */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 border-b pb-4 last:border-0 last:pb-0"
              >
                {/* Icons: Using 'muted' background and 'primary' text to adapt to theme */}
                <div className="mt-1 p-2 rounded-lg bg-secondary text-primary">
                  {activity.type === 'Leave' ? (
                    <Briefcase className="h-4 w-4" />
                  ) : activity.type === 'Payroll' ? (
                    <DollarSign className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                </div>
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.date}
                  </p>
                </div>
                <div>
                  {/* Badges: Using 'outline' or 'secondary' to stay monochrome */}
                  {activity.status === 'Approved' && (
                    <Badge variant="outline">Approved</Badge>
                  )}
                  {activity.status === 'Info' && (
                    <Badge variant="secondary">Info</Badge>
                  )}
                  {activity.status === 'New' && <Badge>New</Badge>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-sm h-fit">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {/* Action 1: Request Leave */}
            <Button
              variant="outline"
              className="justify-between h-auto py-4 px-4 group"
              onClick={() => navigate('../leaves')}
            >
              <div className="flex items-center">
                <div className="bg-secondary p-2 rounded-md mr-3 text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Request Leave</div>
                  <div className="text-xs text-muted-foreground">
                    Apply for time off
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Button>

            {/* Action 2: Payslips */}
            <Button
              variant="outline"
              className="justify-between h-auto py-4 px-4 group"
              onClick={() => navigate('../salary')}
            >
              <div className="flex items-center">
                <div className="bg-secondary p-2 rounded-md mr-3 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">View Payslips</div>
                  <div className="text-xs text-muted-foreground">
                    Download salary history
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
