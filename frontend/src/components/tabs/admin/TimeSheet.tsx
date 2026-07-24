'use client';

import { useState, useEffect } from 'react';
import { Filter, Download, Users, Search, Timer, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { employeeAPI } from '@/services/api';

export default function TimeSheet() {
  const [timesheets, setTimesheets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await employeeAPI.getTimesheets(selectedDate);
        if (response.success) {
          setTimesheets(response.data);
        }
      } catch (error) {
        console.error('Failed to load timesheets', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  // Handle PDF Download
  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const blob = await employeeAPI.generateTimesheetPDF(selectedDate);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `timesheet_${selectedDate}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      alert(error.message || 'Failed to download timesheet PDF');
      console.error(error);
    } finally {
      setDownloading(false);
    }
  };

  // --- Helper Function for Time Formatting ---
  const formatTime = (timeString: string) => {
    if (!timeString || timeString === '--:--') return '--:--';
    
    // Handle backend format which is already formatted as "HH24:MI" (e.g., "08:30", "17:30")
    if (timeString.match(/^\d{2}:\d{2}$/)) {
      const [hours, minutes] = timeString.split(':');
      const hour24 = parseInt(hours);
      const ampm = hour24 >= 12 ? 'PM' : 'AM';
      const hour12 = hour24 % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    }
    
    return timeString; // Return as-is if no formatting works
  };

  // Client-side Filtering
  const filteredData = timesheets.filter((entry) => {
    const matchesSearch =
      entry.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.employeeId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      selectedDepartment === 'all' || entry.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timesheets</h1>
          <p className="text-muted-foreground">
            Monitor daily attendance and work hours.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            disabled={downloading || loading}
          >
            {downloading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Total Present</CardDescription>
              <Badge variant="outline">
                <Users className="h-3 w-3 mr-1" />
                <span className="text-xs">Staff</span>
              </Badge>
            </div>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {loading ? '-' : filteredData.length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Late Arrivals</CardDescription>
              <Badge variant="outline">
                <Timer className="h-3 w-3 mr-1" />
                <span className="text-xs">Alert</span>
              </Badge>
            </div>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {loading
                ? '-'
                : filteredData.filter((x) => x.status === 'Late').length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="h-4 w-4 text-muted-foreground" />
            Filter Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Department Dropdown */}
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Picker */}
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full sm:w-48"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left font-medium">
                      Employee
                    </th>
                    <th className="h-12 px-4 text-left font-medium">Dept</th>
                    <th className="h-12 px-4 text-left font-medium">In</th>
                    <th className="h-12 px-4 text-left font-medium">Out</th>
                    <th className="h-12 px-4 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((entry) => (
                      <tr key={entry.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {entry.employeeName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {entry.employeeId}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary" className="font-normal">
                            {entry.department}
                          </Badge>
                        </td>
                        <td className="p-4 text-green-600 font-medium">
                          {formatTime(entry.clockIn)}
                        </td>
                        <td className="p-4 text-orange-600 font-medium">
                          {formatTime(entry.clockOut)}
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={
                              entry.status === 'Late'
                                ? 'destructive'
                                : 'default'
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
                        colSpan={5}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No records found for this date.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
