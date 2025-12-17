'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  Filter,
  Check,
  X,
  Clock,
  User,
  Search,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { leaveAPI } from '@/services/api'; // Import your API

export default function TimeOffRequests() {
  const [requests, setRequests] = useState<any[]>([]); // Dynamic State
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [processingId, setProcessingId] = useState<string | null>(null);

  // 1. Fetch Data on Load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await leaveAPI.getAllRequests();
        if (response.success && response.data) {
          setRequests(response.data);
        }
      } catch (error) {
        console.error('Failed to load requests', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Handle Approve/Reject
  const handleStatusChange = async (
    requestId: string,
    newStatus: 'Approved' | 'Rejected'
  ) => {
    setProcessingId(requestId);
    try {
      const response = await leaveAPI.updateStatus(requestId, newStatus);

      if (response.success) {
        // Optimistically update the UI
        setRequests((prev) =>
          prev.map((req) =>
            req.id === requestId ? { ...req, status: newStatus } : req
          )
        );
      }
    } catch (error) {
      alert('Failed to update status');
    } finally {
      setProcessingId(null);
    }
  };

  // 3. Helpers
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    // Handle array or string (your backend might return array of dates)
    const d = Array.isArray(dateString) ? dateString[0] : dateString;
    return new Date(d).toLocaleDateString();
  };

  // Filter Logic
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      (request.employeeName || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (request.employeeId || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === 'all' || request.status === selectedStatus;

    const matchesDepartment =
      selectedDepartment === 'all' || request.department === selectedDepartment;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Calculate stats
  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const approvedCount = requests.filter((r) => r.status === 'Approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'Rejected').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return (
          <Badge
            variant="outline"
            className="text-green-600 border-green-200 bg-green-50"
          >
            Approved
          </Badge>
        );
      case 'Pending':
        return (
          <Badge
            variant="outline"
            className="text-orange-600 border-orange-200 bg-orange-50"
          >
            Pending
          </Badge>
        );
      case 'Rejected':
        return (
          <Badge
            variant="outline"
            className="text-red-600 border-red-200 bg-red-50"
          >
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leave Requests</h1>
          <p className="text-muted-foreground">
            Manage employee time off and absences.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <Card className="bg-gradient-to-t from-primary/5 to-card">
          <CardHeader>
            <CardDescription>Total Requests</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {requests.length}
            </CardTitle>
            <div className="flex justify-end mt-[-20px]">
              <Badge variant="outline">
                <FileText className="size-4 mr-1" /> All
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Pending */}
        <Card className="bg-gradient-to-t from-orange-500/5 to-card">
          <CardHeader>
            <CardDescription>Pending Action</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-orange-600">
              {pendingCount}
            </CardTitle>
            <div className="flex justify-end mt-[-20px]">
              <Badge
                variant="outline"
                className="text-orange-600 border-orange-200 bg-orange-50"
              >
                <AlertCircle className="size-4 mr-1" /> New
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Approved */}
        <Card className="bg-gradient-to-t from-green-500/5 to-card">
          <CardHeader>
            <CardDescription>Approved</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-green-600">
              {approvedCount}
            </CardTitle>
            <div className="flex justify-end mt-[-20px]">
              <Badge
                variant="outline"
                className="text-green-600 border-green-200 bg-green-50"
              >
                <CheckCircle2 className="size-4 mr-1" /> Done
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Rejected */}
        <Card className="bg-gradient-to-t from-red-500/5 to-card">
          <CardHeader>
            <CardDescription>Rejected</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-red-600">
              {rejectedCount}
            </CardTitle>
            <div className="flex justify-end mt-[-20px]">
              <Badge
                variant="outline"
                className="text-red-600 border-red-200 bg-red-50"
              >
                <XCircle className="size-4 mr-1" /> Void
              </Badge>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="h-4 w-4 text-muted-foreground" /> Filter Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
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
                {/* Dynamically populate this if you have a department API, otherwise hardcode common ones */}
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Loading requests...
            </CardContent>
          </Card>
        ) : filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <Card
              key={request.id}
              className="hover:shadow-sm transition-all border-l-4"
              style={{
                borderLeftColor:
                  request.status === 'Pending'
                    ? '#f97316'
                    : request.status === 'Approved'
                    ? '#16a34a'
                    : request.status === 'Rejected'
                    ? '#dc2626'
                    : 'transparent',
              }}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Employee Info Section */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                      <User className="h-6 w-6" />
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg leading-none">
                          {request.employeeName}
                        </h3>
                        {/* We use id suffix as a visual ID if no real employee ID is available */}
                        <span className="text-sm text-muted-foreground font-mono">
                          #{request.employeeId?.substring(0, 6)}
                        </span>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {request.department || 'General Staff'}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-sm">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-xs">
                            Leave Type
                          </span>
                          <span className="font-medium flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                            {request.leaveType}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-xs">
                            Duration
                          </span>
                          <span className="font-medium flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            {request.duration}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-xs">
                            Dates
                          </span>
                          <span className="font-medium flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            {/* Logic to show Start - End based on your date array */}
                            {request.dates && request.dates.length > 0
                              ? `${formatDate(request.dates[0])} - ${formatDate(
                                  request.dates[request.dates.length - 1]
                                )}`
                              : 'N/A'}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-xs">
                            Requested On
                          </span>
                          <span className="font-medium">
                            {formatDate(request.requestedOn)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-muted/50 rounded-md border border-muted">
                        <p className="text-sm">
                          <span className="font-medium">Reason:</span>{' '}
                          <span className="text-muted-foreground">
                            {request.reason}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="lg:min-w-[140px] flex justify-end">
                    {request.status === 'Pending' ? (
                      <div className="flex gap-2 w-full lg:flex-col">
                        <Button
                          onClick={() =>
                            handleStatusChange(request.id, 'Approved')
                          }
                          disabled={processingId === request.id}
                          className="flex-1 lg:flex-none bg-green-600 hover:bg-green-700 text-white shadow-sm"
                          size="sm"
                        >
                          {processingId === request.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" /> Approve
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() =>
                            handleStatusChange(request.id, 'Rejected')
                          }
                          disabled={processingId === request.id}
                          variant="outline"
                          className="flex-1 lg:flex-none text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                          size="sm"
                        >
                          {processingId === request.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                          ) : (
                            <>
                              <X className="mr-2 h-4 w-4" /> Reject
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-end gap-1 text-sm text-muted-foreground">
                        <span className="italic">Action taken</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center flex flex-col items-center justify-center">
              <div className="bg-muted p-4 rounded-full mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="font-medium text-lg">No requests found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
