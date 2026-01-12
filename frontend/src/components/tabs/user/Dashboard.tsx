'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  DollarSign,
  Briefcase,
  AlertCircle,
  ArrowRight,
  FileText,
  Loader2,
  Clock,
  CheckCircle2,
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

// Imports from your API
import { employeeAPI, attendanceAPI, leaveAPI } from '@/services/api';
import { UserSectionCards } from '@/components/section-cards-user';
import { getHolidayByDate, getUpcomingHolidays } from '@/lib/holiday-utils';

// Types
interface ActivityItem {
  id: string | number;
  type: 'Leave' | 'Payroll' | 'Announcement';
  message: string;
  date: string;
  status: string;
}

export default function UserDashboard() {
  const navigate = useNavigate();

  // State
  const [employeeName, setEmployeeName] = useState('Employee');
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Attendance State (Read-Only from DB)
  const [attendance, setAttendance] = useState<{
    clockIn: string | null;
    clockOut: string | null;
    status: string;
  }>({ clockIn: null, clockOut: null, status: 'absent' });

  // Date Formatter
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Helper for dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // 1. Fetch Dashboard Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // --- A. Get Profile Name ---
        const profileRes = await employeeAPI.getMyProfile();
        if (profileRes.success && profileRes.data) {
          setEmployeeName(profileRes.data.fullName.split(' ')[0]);
        }

        // --- B. Get Attendance Status (Fingerprint Data) ---
        try {
          const attendanceRes = await attendanceAPI.getTodayStatus();
          setAttendance({
            clockIn: attendanceRes.clockInTime || null,
            clockOut: attendanceRes.clockOutTime || null,
            status: attendanceRes.status || 'absent',
          });
        } catch (error) {
          console.log('No attendance record found for today yet.');
        }

        // --- C. Get Recent Leaves (FIXED MAPPING) ---
        const leavesRes = await leaveAPI
          .getMyLeaves()
          .catch(() => ({ success: false, data: [] }));

        const rawLeaves = leavesRes.data || [];

        const mappedLeaves: ActivityItem[] = rawLeaves
          // 1. Filter out invalid entries (ensure dates array exists)
          .filter(
            (leave: any) =>
              leave.leaveType && leave.dates && leave.dates.length > 0
          )
          .slice(0, 3)
          .map((leave: any) => ({
            id: leave.id,
            type: 'Leave',
            // FIX: Map 'leaveType' and 'duration' correctly
            message: `${leave.leaveType} (${leave.duration})`,
            // FIX: Map 'dates[0]' because backend sends an array
            date: new Date(leave.dates[0]).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            }),
            status:
              leave.status.charAt(0).toUpperCase() + leave.status.slice(1),
          }));

        // --- D. Get Holidays & Merge Activities ---
        const todayHoliday = getHolidayByDate(new Date());
        let holidayAnnouncement: ActivityItem | null = null;

        if (todayHoliday) {
          holidayAnnouncement = {
            id: 'holiday-today',
            type: 'Announcement',
            message: `Holiday Today: ${todayHoliday.summary}`,
            date: 'Today',
            status: 'Info',
          };
        } else {
          const nextHoliday = getUpcomingHolidays(1)[0];
          if (nextHoliday) {
            const hDate = new Date(nextHoliday.start).toLocaleDateString(
              'en-US',
              { month: 'short', day: 'numeric' }
            );

            holidayAnnouncement = {
              id: `holiday-${nextHoliday.uid}`,
              type: 'Announcement',
              message: `Upcoming: ${nextHoliday.summary}`,
              date: hDate,
              status: 'Info',
            };
          }
        }

        // Merge & Clean
        const finalActivities: ActivityItem[] = [];
        if (holidayAnnouncement) finalActivities.push(holidayAnnouncement);

        if (mappedLeaves.length > 0) {
          finalActivities.push(...mappedLeaves);
        }

        // Fallback if empty
        if (finalActivities.length === 0) {
          finalActivities.push({
            id: 999,
            type: 'Announcement',
            message: 'No recent updates',
            date: 'Today',
            status: 'Info',
          });
        }

        setActivities(finalActivities);
      } catch (error) {
        console.error('Dashboard load failed', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {getGreeting()}, {employeeName} 👾
          </h1>
          <p className="text-muted-foreground">{today}</p>
        </div>

        {/* Read-Only Attendance Display */}
        <div className="flex items-center gap-6 bg-card border rounded-xl px-5 py-3 shadow-sm">
          {/* Clock In Time */}
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${
                attendance.clockIn
                  ? 'bg-green-100 text-green-600'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <Clock className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Clock In
              </span>
              <span className="text-sm font-semibold tabular-nums">
                {attendance.clockIn ? attendance.clockIn : '--:--'}
              </span>
            </div>
          </div>

          <div className="h-8 w-px bg-border hidden sm:block"></div>

          {/* Clock Out Time */}
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${
                attendance.clockOut
                  ? 'bg-orange-100 text-orange-600'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Clock Out
              </span>
              <span className="text-sm font-semibold tabular-nums">
                {attendance.clockOut ? attendance.clockOut : '--:--'}
              </span>
            </div>
          </div>
        </div>
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
            {activities.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No recent activity.
              </p>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 border-b pb-4 last:border-0 last:pb-0"
                >
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
                    {activity.status === 'Approved' && (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        Approved
                      </Badge>
                    )}
                    {activity.status === 'Pending' && (
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700 border-yellow-200"
                      >
                        Pending
                      </Badge>
                    )}
                    {activity.status === 'Rejected' && (
                      <Badge variant="destructive">Rejected</Badge>
                    )}
                    {activity.status === 'Info' && (
                      <Badge variant="secondary">Info</Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-sm h-fit">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
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
