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
import { Clock, CalendarDays, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
// Import your new profileAPI
import { profileAPI, employeeAPI } from '@/services/api'; // Adjust path to where your api.ts is located

export default function MyAttendance() {
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

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
    
    // Handle database date format "2025-12-22" or timestamp format
    let dateObj: Date;
    if (dateString.includes(' ')) {
      // Convert timestamp "2025-12-22 08:30:00" to "2025-12-22T08:30:00"
      const isoString = dateString.replace(' ', 'T');
      dateObj = new Date(isoString);
    } else {
      dateObj = new Date(dateString);
    }
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString || timeString === '-') return '-';
    
    // Handle backend format which is already formatted as "HH24:MI" (e.g., "08:30", "17:30")
    // Backend uses to_char(t.clock_in, 'HH24:MI') so we just need to convert to 12-hour format
    if (timeString.match(/^\d{2}:\d{2}$/)) {
      // Format "08:30" -> "08:30 AM"
      const [hours, minutes] = timeString.split(':');
      const hour24 = parseInt(hours);
      const ampm = hour24 >= 12 ? 'PM' : 'AM';
      const hour12 = hour24 % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    }
    
    // Fallback: Handle full timestamp format "2025-12-22 08:30:00"
    if (timeString.includes(' ')) {
      const isoString = timeString.replace(' ', 'T');
      const dateObj = new Date(isoString);
      if (!isNaN(dateObj.getTime())) {
        return dateObj.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
      }
    }
    
    return timeString; // Return as-is if no formatting works
  };

  const handleDownloadPDF = async () => {
    // Get current month in YYYY-MM format
    const currentMonth = new Date().toISOString().slice(0, 7);
    setDownloading(true);
    try {
      const blob = await employeeAPI.downloadMyAttendancePDF(currentMonth);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance_${currentMonth}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      alert(error.message || 'Failed to download attendance PDF');
      console.error(error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">My Attendance</h2>
        <Button
          variant="outline"
          onClick={handleDownloadPDF}
          disabled={downloading || loading || attendanceData.length === 0}
        >
          {downloading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Download Current Month
        </Button>
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
                           <span className="font-medium">
                             {entry.clockIn}
                           </span>
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
