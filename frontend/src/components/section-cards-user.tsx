'use client';

import { useState, useEffect } from 'react';
import {
  IconClock,
  IconCalendarUser,
  IconCoffee,
  IconGitPullRequest,
  IconBriefcase,
  IconSun,
} from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { attendanceAPI, leaveAPI } from '@/services/api';
import { getUpcomingHolidays, getHolidayByDate } from '@/lib/holiday-utils';

export function UserSectionCards() {
  const [loading, setLoading] = useState(true);

  // Data State
  const [todayStatus, setTodayStatus] = useState({
    title: '00:00',
    badge: 'Not Clocked In',
    color: 'default', // default, green, yellow, blue
    icon: <IconClock className="size-4 mr-1" />,
  });

  const [leaveBalance, setLeaveBalance] = useState(14);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [nextHoliday, setNextHoliday] = useState<{
    date: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get Today in Local YYYY-MM-DD format
        const today = new Date();
        const todayStr = today.toLocaleDateString('en-CA'); // 'en-CA' gives YYYY-MM-DD in local time

        let statusFound = false;

        // 1. CHECK: Is Today a Holiday?
        const holidayToday = getHolidayByDate(today);
        if (holidayToday) {
          setTodayStatus({
            title: 'Holiday',
            badge: 'Office Closed',
            color: 'blue',
            icon: <IconSun className="size-4 mr-1" />,
          });
          statusFound = true;
        }

        // 2. FETCH LEAVES (Fix: Extract .data correctly)
        // We type this explicitly as any[] to solve the "type 'never'" error
        const leavesRes = await leaveAPI
          .getMyLeaves()
          .catch(() => ({ success: false, data: [] }));

        const leavesData: any[] = leavesRes.data || [];

        // 3. CHECK: Is Today an Approved Leave?
        if (!statusFound && leavesData.length > 0) {
          const onLeaveToday = leavesData.find((l: any) => {
            if (l.status !== 'Approved' || !l.dates) return false;

            // Check if TODAY matches any date in the leave's date array
            return l.dates.some((dateIso: string) => {
              const leaveDateStr = new Date(dateIso).toLocaleDateString(
                'en-CA'
              );
              return leaveDateStr === todayStr;
            });
          });

          if (onLeaveToday) {
            setTodayStatus({
              title: 'On Leave',
              badge: onLeaveToday.leaveType, // Now valid because leavesData is any[]
              color: 'yellow',
              icon: <IconBriefcase className="size-4 mr-1" />,
            });
            statusFound = true;
          }
        }

        // 4. CHECK: Is Clocked In? (Only if not holiday/leave)
        if (!statusFound) {
          try {
            const attendance = await attendanceAPI.getTodayStatus();
            if (attendance && attendance.clockInTime) {
              setTodayStatus({
                title: calculateDuration(attendance.clockInTime),
                badge: 'Checked In',
                color: 'green',
                icon: <IconClock className="size-4 mr-1" />,
              });
            }
          } catch (e) {
            // Not clocked in, keep default
          }
        }

        // --- Other Stats Calculations (Using leavesData) ---
        if (leavesData.length > 0) {
          // Count Pending
          const pending = leavesData.filter(
            (l: any) => l.status === 'Pending'
          ).length;
          setPendingRequests(pending);

          // Calculate Balance (14 - Approved Days)
          const approvedDays = leavesData
            .filter((l: any) => l.status === 'Approved')
            .reduce((acc: number, curr: any) => {
              // Parse "2 Days" string to number 2
              const days = parseInt(curr.duration) || 0;
              return acc + days;
            }, 0);
          setLeaveBalance(Math.max(0, 14 - approvedDays));
        }

        // Next Holiday
        const upcoming = getUpcomingHolidays(1);
        if (upcoming.length > 0) {
          const h = upcoming[0];
          const dateObj = new Date(h.start);
          const formattedDate = dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
          setNextHoliday({ date: formattedDate, name: h.summary });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateDuration = (timeStr: string) => {
    if (!timeStr) return '00:00';
    const now = new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    const clockIn = new Date();
    clockIn.setHours(hours, minutes, 0);
    const diffMs = now.getTime() - clockIn.getTime();
    if (diffMs < 0) return '00:00';
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${String(diffHrs).padStart(2, '0')}:${String(diffMins).padStart(
      2,
      '0'
    )}`;
  };

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Card 1: Dynamic Status */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Today's Status</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {todayStatus.title}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className={
                todayStatus.color === 'green'
                  ? 'text-green-600 border-green-200 bg-green-50'
                  : todayStatus.color === 'yellow'
                  ? 'text-orange-600 border-orange-200 bg-orange-50'
                  : todayStatus.color === 'blue'
                  ? 'text-blue-600 border-blue-200 bg-blue-50'
                  : 'text-muted-foreground'
              }
            >
              {todayStatus.icon}
              {todayStatus.badge}
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Leave Balance */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Annual Leave</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {leaveBalance} Days
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCalendarUser className="size-4 mr-1" /> Available
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Next Holiday */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Next Holiday</CardDescription>
          <CardTitle
            className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl truncate"
            title={nextHoliday?.name}
          >
            {nextHoliday ? nextHoliday.date : '-'}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="truncate max-w-[120px]">
              <IconCoffee className="size-4 mr-1" />
              {nextHoliday
                ? nextHoliday.name.includes('Poya')
                  ? 'Poya Day'
                  : 'Public'
                : 'None'}
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Pending Requests */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>My Requests</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {pendingRequests}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className={
                pendingRequests > 0
                  ? 'text-orange-600 border-orange-200 bg-orange-50'
                  : ''
              }
            >
              <IconGitPullRequest className="size-4 mr-1" />
              Pending
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  );
}
