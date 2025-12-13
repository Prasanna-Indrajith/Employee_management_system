'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CalendarDays, MapPin } from 'lucide-react';

export default function MyAttendance() {
  // Mock Data (Day name removed)
  const attendanceData = [
    {
      id: 1,
      date: 'Nov 30, 2025',
      clockIn: '08:30 AM',
      clockOut: '-',
      totalHours: 'Running...',
      status: 'Present',
      location: 'Office',
    },
    {
      id: 2,
      date: 'Nov 29, 2025',
      clockIn: '08:35 AM',
      clockOut: '05:05 PM',
      totalHours: '8h 30m',
      status: 'Late',
      location: 'Remote',
    },
    {
      id: 3,
      date: 'Nov 28, 2025',
      clockIn: '08:25 AM',
      clockOut: '05:00 PM',
      totalHours: '8h 35m',
      status: 'Present',
      location: 'Office',
    },
    {
      id: 4,
      date: 'Nov 27, 2025',
      clockIn: '08:30 AM',
      clockOut: '05:15 PM',
      totalHours: '8h 45m',
      status: 'Present',
      location: 'Office',
    },
    {
      id: 5,
      date: 'Nov 26, 2025',
      clockIn: '-',
      clockOut: '-',
      totalHours: '0h 00m',
      status: 'Absent',
      location: '-',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">My Attendance</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
          <CardDescription>
            Detailed logs of your check-ins, check-outs, and work duration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Check In
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Check Out
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Location
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Total Hours
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {attendanceData.length > 0 ? (
                  attendanceData.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      {/* Date Column */}
                      <td className="p-4 align-middle">
                        <div className="font-medium flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          {entry.date}
                        </div>
                      </td>

                      {/* Check In */}
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-green-600" />
                          <span className="font-medium">{entry.clockIn}</span>
                        </div>
                      </td>

                      {/* Check Out */}
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-orange-600" />
                          <span>{entry.clockOut}</span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          {entry.location !== '-' && (
                            <MapPin className="h-3 w-3" />
                          )}
                          {entry.location}
                        </div>
                      </td>

                      {/* Total Hours */}
                      <td className="p-4 align-middle font-medium">
                        {entry.totalHours}
                      </td>

                      {/* Status Badge */}
                      <td className="p-4 align-middle">
                        {entry.status === 'Present' && (
                          <Badge
                            variant="outline"
                            className="text-green-600 border-green-200 bg-green-50"
                          >
                            Present
                          </Badge>
                        )}
                        {entry.status === 'Late' && (
                          <Badge
                            variant="outline"
                            className="text-orange-600 border-orange-200 bg-orange-50"
                          >
                            Late
                          </Badge>
                        )}
                        {entry.status === 'Absent' && (
                          <Badge variant="destructive">Absent</Badge>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="h-24 text-center p-4 align-middle text-muted-foreground"
                    >
                      No attendance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
