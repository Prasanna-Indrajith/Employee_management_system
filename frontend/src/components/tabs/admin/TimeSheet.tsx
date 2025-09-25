import React, { useState } from 'react';
import { Calendar, Clock, Filter, Download, Plus } from 'lucide-react';
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
  // const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter data based on selections
  const filteredData = timesheetData.filter((entry) => {
    const matchesSearch =
      entry.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === 'all' || entry.department === selectedDepartment;
    // const matchesStatus =
    //   selectedStatus === 'all' || entry.status === selectedStatus;

    return matchesSearch && matchesDepartment;
    // return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Calculate totals
  const totalHours = filteredData.reduce((sum, entry) => {
    const hours = parseFloat(entry.totalHours.replace('h', ''));
    return sum + hours;
  }, 0);

  const approvedEntries = filteredData.filter(
    (entry) => entry.status === 'Approved'
  ).length;
  const pendingEntries = filteredData.filter(
    (entry) => entry.status === 'Pending'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            TimeSheet Management
          </h1>
          <p className="text-muted-foreground">
            Track and manage employee work hours
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours}h</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
          <CardTitle>Daily TimeSheet</CardTitle>
          <CardDescription>
            Employee work hours for {selectedDate}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Employee
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
                  {/* <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Break Time
                  </th> */}
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
                      <td className="p-4 align-middle">
                        <div>
                          <div className="font-medium">
                            {entry.employeeName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {entry.employeeId}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">{entry.department}</td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {entry.clockIn}
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {entry.clockOut}
                        </div>
                      </td>
                      {/* <td className="p-4 align-middle">{entry.breakTime}</td> */}
                      <td className="p-4 align-middle font-medium">
                        {entry.totalHours}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="h-24 text-center p-4 align-middle"
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
