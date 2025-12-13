'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Filter,
  Download,
  Users,
  Briefcase,
  Search,
  Timer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction, // Assumed this is exported based on your snippet
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

// Mock timesheet data
const timesheetData = [
  {
    id: 1,
    employeeName: 'John Doe',
    employeeId: 'emp001',
    date: '2024-01-15',
    clockIn: '09:00',
    clockOut: '17:30',
    breakTime: '1h',
    totalHours: '7.5h',
    status: 'Approved',
    department: 'Engineering',
  },
  {
    id: 2,
    employeeName: 'Jane Smith',
    employeeId: 'emp002',
    date: '2024-01-15',
    clockIn: '08:30',
    clockOut: '17:00',
    breakTime: '45min',
    totalHours: '7.75h',
    status: 'Pending',
    department: 'Marketing',
  },
  {
    id: 3,
    employeeName: 'Mike Johnson',
    employeeId: 'emp003',
    date: '2024-01-15',
    clockIn: '09:15',
    clockOut: '18:00',
    breakTime: '1h',
    totalHours: '7.75h',
    status: 'Approved',
    department: 'Sales',
  },
  {
    id: 4,
    employeeName: 'Sarah Wilson',
    employeeId: 'emp004',
    date: '2024-01-15',
    clockIn: '08:45',
    clockOut: '16:45',
    breakTime: '30min',
    totalHours: '7.5h',
    status: 'Rejected',
    department: 'HR',
  },
  {
    id: 5,
    employeeName: 'David Brown',
    employeeId: 'emp005',
    date: '2024-01-15',
    clockIn: '09:30',
    clockOut: '17:45',
    breakTime: '1h 15min',
    totalHours: '7h',
    status: 'Pending',
    department: 'Engineering',
  },
];

export default function TimeSheet() {
  const [selectedDate, setSelectedDate] = useState('2024-01-15');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter data
  const filteredData = timesheetData.filter((entry) => {
    const matchesSearch =
      entry.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === 'all' || entry.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  // Calculate totals
  const totalHours = filteredData.reduce((sum, entry) => {
    const hours = parseFloat(entry.totalHours.replace('h', ''));
    return sum + hours;
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

      {/* Stats Cards - Updated to match SectionCards style */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 md:grid-cols-2 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
        {/* Card 1: Total Entries */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Entries</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {filteredData.length}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <Users className="size-4 mr-1" />
                Records
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>

        {/* Card 2: Total Hours */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Man-Hours</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalHours}h
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <Timer className="size-4 mr-1" />
                Work Time
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
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employee name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
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
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full sm:w-48"
            />
          </div>
        </CardContent>
      </Card>

      {/* TimeSheet Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Log</CardTitle>
          <CardDescription>
            Detailed work hours for{' '}
            <span className="font-semibold text-foreground">
              {selectedDate}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Employee Details
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Department
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Clock In
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Clock Out
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Total Hours
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {filteredData.length > 0 ? (
                  filteredData.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      {/* Employee Column */}
                      <td className="p-4 align-middle">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {entry.employeeName}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">
                            {entry.employeeId}
                          </span>
                        </div>
                      </td>

                      {/* Department Column */}
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-secondary rounded-md">
                            <Briefcase className="h-3 w-3 text-muted-foreground" />
                          </div>
                          <span>{entry.department}</span>
                        </div>
                      </td>

                      {/* Clock In */}
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded-md bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                            <Clock className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-medium text-green-700 dark:text-green-300">
                            {entry.clockIn}
                          </span>
                        </div>
                      </td>

                      {/* Clock Out */}
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded-md bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                            <Clock className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-medium text-orange-700 dark:text-orange-300">
                            {entry.clockOut}
                          </span>
                        </div>
                      </td>

                      {/* Total Hours */}
                      <td className="p-4 align-middle">
                        <Badge variant="outline" className="font-mono">
                          {entry.totalHours}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="h-24 text-center p-4 align-middle text-muted-foreground"
                    >
                      No timesheet entries found.
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
