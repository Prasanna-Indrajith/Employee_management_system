'use client';

import { useState, useEffect } from 'react';
import {
  Filter,
  Check,
  X,
  Clock,
  User,
  Search,
  FileText,
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
import { leaveAPI } from '@/services/api';

export default function TimeOffRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [processingId, setProcessingId] = useState<string | null>(null);

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

  const handleStatusChange = async (
    requestId: string,
    newStatus: 'Approved' | 'Rejected'
  ) => {
    setProcessingId(requestId);
    try {
      const response = await leaveAPI.updateStatus(requestId, newStatus);

      if (response.success) {
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

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const d = Array.isArray(dateString) ? dateString[0] : dateString;
    return new Date(d).toLocaleDateString();
  };

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
            className="text-slate-600 border-slate-200 bg-slate-50"
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Total Requests</CardDescription>
              <Badge variant="outline">
                <FileText className="h-3 w-3 mr-1" />
                <span className="text-xs">All</span>
              </Badge>
            </div>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {requests.length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Pending Action</CardDescription>
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                <span className="text-xs">New</span>
              </Badge>
            </div>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {pendingCount}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Approved</CardDescription>
              <Badge variant="outline">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                <span className="text-xs">Done</span>
              </Badge>
            </div>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {approvedCount}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Rejected</CardDescription>
              <Badge variant="outline">
                <XCircle className="h-3 w-3 mr-1" />
                <span className="text-xs">Void</span>
              </Badge>
            </div>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {rejectedCount}
            </CardTitle>
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
      <div className="grid grid-cols-1 gap-3">
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
              className="hover:shadow-sm transition-all border-l-2"
              style={{
                borderLeftColor:
                  request.status === 'Pending'
                    ? '#94a3b8'
                    : request.status === 'Approved'
                    ? '#16a34a'
                    : request.status === 'Rejected'
                    ? '#dc2626'
                    : 'transparent',
              }}
            >
              <CardContent className="pt-4 pb-4">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Employee Info Section */}
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-base leading-none">
                          {request.employeeName}
                        </h3>
                        <span className="text-xs text-muted-foreground font-mono">
                          #{request.employeeId?.substring(0, 6)}
                        </span>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {request.department || 'General Staff'}
                      </p>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3 text-xs">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-muted-foreground">
                            Leave Type
                          </span>
                          <span className="font-medium">
                            {request.leaveType}
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-muted-foreground">
                            Duration
                          </span>
                          <span className="font-medium">
                            {request.duration}
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-muted-foreground">
                            Dates
                          </span>
                          <span className="font-medium">
                            {request.dates && request.dates.length > 0
                              ? `${formatDate(request.dates[0])} - ${formatDate(
                                  request.dates[request.dates.length - 1]
                                )}`
                              : 'N/A'}
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-muted-foreground">
                            Requested
                          </span>
                          <span className="font-medium">
                            {formatDate(request.requestedOn)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t">
                        <p className="text-xs text-muted-foreground">
                          {request.reason}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="lg:min-w-[120px] flex justify-end">
                    {request.status === 'Pending' ? (
                      <div className="flex gap-2 w-full lg:flex-col">
                        <Button
                          onClick={() =>
                            handleStatusChange(request.id, 'Approved')
                          }
                          disabled={processingId === request.id}
                          className="flex-1 lg:flex-none"
                          size="sm"
                        >
                          {processingId === request.id ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                          ) : (
                            <>
                              <Check className="mr-1.5 h-3.5 w-3.5" /> Approve
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() =>
                            handleStatusChange(request.id, 'Rejected')
                          }
                          disabled={processingId === request.id}
                          variant="outline"
                          className="flex-1 lg:flex-none"
                          size="sm"
                        >
                          {processingId === request.id ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent" />
                          ) : (
                            <>
                              <X className="mr-1.5 h-3.5 w-3.5" /> Reject
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
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
