'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CalendarDays } from 'lucide-react';
// Import your new profileAPI
import { profileAPI } from '@/services/api'; // Adjust path to where your api.ts is located

export default function MyAttendance() {
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);

        // 1. CALL THE API
        // No need to manually get ID or Token. The api.ts interceptor handles it.
        const response = await profileAPI.getMyAttendance();

        if (response.success && response.data) {
          // 2. FORMAT THE DATA
          // We map the raw backend data to your UI structure
          const formattedData = response.data.map((item: any) => ({
            id: item.id,
            date: formatDate(item.date || item.clockIn),
            clockIn: formatTime(item.clockIn),
            clockOut: item.clockOut ? formatTime(item.clockOut) : '-',
            status: item.status || 'Absent',
            // If your backend doesn't send location, default to 'Office'
            location: item.location || 'Office',
          }));

          setAttendanceData(formattedData);
        } else {
          setError('Failed to load attendance records.');
        }
      } catch (err: any) {
        console.error('Error fetching attendance:', err);
        setError('Could not load attendance. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  // --- Helper Functions for Formatting ---

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '-';
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">My Attendance</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
          <CardDescription>
            Detailed logs of your check-ins and check-outs.
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
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="h-24 text-center p-4 align-middle text-muted-foreground"
                    >
                      Loading attendance records...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="h-24 text-center p-4 align-middle text-red-500"
                    >
                      {error}
                    </td>
                  </tr>
                ) : attendanceData.length > 0 ? (
                  attendanceData.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4 align-middle">
                        <div className="font-medium flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          {entry.date}
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-green-600" />
                          <span className="font-medium">{entry.clockIn}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-orange-600" />
                          <span>{entry.clockOut}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <Badge
                          variant={
                            entry.status === 'Present'
                              ? 'default' // or use your custom styles
                              : entry.status === 'Late'
                              ? 'secondary'
                              : entry.status === 'Absent'
                              ? 'destructive'
                              : 'outline'
                          }
                          // Keep your custom classNames if you prefer them over standard variants
                          className={
                            entry.status === 'Present'
                              ? 'text-green-600 border-green-200 bg-green-50 hover:bg-green-50'
                              : entry.status === 'Late'
                              ? 'text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-50'
                              : ''
                          }
                        >
                          {entry.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
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
