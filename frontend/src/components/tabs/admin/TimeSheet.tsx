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
  CardAction,
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
import { employeeAPI } from '@/services/api'; // Import API

export default function TimeSheet() {
  // 1. State for Data
  const [timesheets, setTimesheets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. State for Filters
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  ); // Default to today
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 3. Fetch Data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch data for the specific selected Date
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
  }, [selectedDate]); // Re-run when date changes

  // 4. Client-side Filtering (Search & Department)
  const filteredData = timesheets.filter((entry) => {
    const matchesSearch =
      entry.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.employeeId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      selectedDepartment === 'all' || entry.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  // Calculate totals
  const totalHours = filteredData.reduce((sum, entry) => {
    // Simple calculation: You might need more complex math if hours are strings
    // Assuming backend returns hours, or we calculate diff.
    // For now, let's just count entries or use a safe fallback.
    return sum + 8; // Placeholder: 8 hours per person
  }, 0);

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
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Total Present</CardDescription>
            <CardTitle className="text-2xl font-semibold">
              {loading ? '-' : filteredData.length}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {' '}
                <Users className="size-4 mr-1" /> Staff
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Late Arrivals</CardDescription>
            <CardTitle className="text-2xl font-semibold text-orange-600">
              {loading
                ? '-'
                : filteredData.filter((x) => x.status === 'Late').length}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {' '}
                <Timer className="size-4 mr-1" /> Alert
              </Badge>
            </CardAction>
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

            {/* Department Dropdown (Hardcoded for now, or fetch from Lookups API) */}
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
                          {entry.clockIn || '--:--'}
                        </td>
                        <td className="p-4 text-orange-600 font-medium">
                          {entry.clockOut || '--:--'}
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
