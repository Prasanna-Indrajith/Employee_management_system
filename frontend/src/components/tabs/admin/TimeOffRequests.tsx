import React, { useState } from 'react';
import { Calendar, Filter, Check, X, Clock, User } from 'lucide-react';
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

// Mock time off requests data
const mockRequests = [
  {
    id: 1,
    employeeName: 'John Doe',
    employeeId: 'emp001',
    department: 'Engineering',
    leaveType: 'Annual Leave',
    startDate: '2024-02-15',
    endDate: '2024-02-20',
    duration: '5 days',
    reason: 'Family vacation',
    status: 'Pending',
    requestedDate: '2024-01-20',
  },
  {
    id: 2,
    employeeName: 'Jane Smith',
    employeeId: 'emp002',
    department: 'Marketing',
    leaveType: 'Sick Leave',
    startDate: '2024-02-10',
    endDate: '2024-02-12',
    duration: '2 days',
    reason: 'Medical appointment',
    status: 'Pending',
    requestedDate: '2024-01-25',
  },
  {
    id: 3,
    employeeName: 'Mike Johnson',
    employeeId: 'emp003',
    department: 'Sales',
    leaveType: 'Annual Leave',
    startDate: '2024-03-01',
    endDate: '2024-03-05',
    duration: '4 days',
    reason: 'Personal matters',
    status: 'Approved',
    requestedDate: '2024-01-18',
  },
  {
    id: 4,
    employeeName: 'Sarah Wilson',
    employeeId: 'emp004',
    department: 'HR',
    leaveType: 'Casual Leave',
    startDate: '2024-02-08',
    endDate: '2024-02-08',
    duration: '1 day',
    reason: 'Personal work',
    status: 'Rejected',
    requestedDate: '2024-02-01',
  },
  {
    id: 5,
    employeeName: 'David Brown',
    employeeId: 'emp005',
    department: 'Engineering',
    leaveType: 'Annual Leave',
    startDate: '2024-02-25',
    endDate: '2024-02-28',
    duration: '3 days',
    reason: 'Wedding ceremony',
    status: 'Pending',
    requestedDate: '2024-01-22',
  },
];

export default function TimeOffRequests() {
  const [requests, setRequests] = useState(mockRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [processingId, setProcessingId] = useState(null);

  // Filter requests
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === 'all' || request.status === selectedStatus;
    const matchesDepartment =
      selectedDepartment === 'all' || request.department === selectedDepartment;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Handle approve request
  const handleApprove = async (requestId) => {
    setProcessingId(requestId);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: 'Approved' } : req
      )
    );

    setProcessingId(null);

    const request = requests.find((r) => r.id === requestId);
    alert(`Time off request for ${request.employeeName} has been approved!`);
  };

  // Handle reject request
  const handleReject = async (requestId) => {
    setProcessingId(requestId);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: 'Rejected' } : req
      )
    );

    setProcessingId(null);

    const request = requests.find((r) => r.id === requestId);
    alert(`Time off request for ${request.employeeName} has been rejected.`);
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusColors = {
      Approved: 'bg-green-100 text-green-800 hover:bg-green-100',
      Pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
      Rejected: 'bg-red-100 text-red-800 hover:bg-red-100',
    };

    return (
      <Badge
        className={
          statusColors[status] || 'bg-gray-100 text-gray-800 hover:bg-gray-100'
        }
      >
        {status}
      </Badge>
    );
  };

  // Calculate stats
  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const approvedCount = requests.filter((r) => r.status === 'Approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'Rejected').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Time Off Requests
          </h1>
          <p className="text-muted-foreground">
            Review and manage employee leave requests
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredRequests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {approvedCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {rejectedCount}
            </div>
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
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
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
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <Card
              key={request.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Employee Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg">
                          {request.employeeName}
                        </h3>
                        <span className="text-sm text-muted-foreground">
                          ({request.employeeId})
                        </span>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {request.department}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Leave Type:</span>
                          <span>{request.leaveType}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Duration:</span>
                          <span>{request.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">From:</span>
                          <span>{request.startDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">To:</span>
                          <span>{request.endDate}</span>
                        </div>
                      </div>

                      <div className="mt-2 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm">
                          <span className="font-medium">Reason:</span>{' '}
                          {request.reason}
                        </p>
                      </div>

                      <p className="text-xs text-muted-foreground mt-2">
                        Requested on: {request.requestedDate}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {request.status === 'Pending' && (
                    <div className="flex gap-2 lg:flex-col">
                      <Button
                        onClick={() => handleApprove(request.id)}
                        disabled={processingId === request.id}
                        className="flex-1 lg:flex-none bg-green-600 hover:bg-green-700"
                      >
                        {processingId === request.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Approve
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => handleReject(request.id)}
                        disabled={processingId === request.id}
                        variant="destructive"
                        className="flex-1 lg:flex-none"
                      >
                        {processingId === request.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        ) : (
                          <>
                            <X className="mr-2 h-4 w-4" />
                            Reject
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {request.status !== 'Pending' && (
                    <div className="lg:w-32 flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">
                        Already {request.status.toLowerCase()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No time off requests found.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
