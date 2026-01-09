'use client';

import { useEffect, useState } from 'react';
import {
  DollarSign,
  Users,
  Activity,
  Play,
  FileText,
  Calendar,
  Download,
  MoreHorizontal,
  Loader2,
} from 'lucide-react';

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { payrollAPI } from '@/services/api'; // Import API
import type { PayrollRun } from '@/types';

export function PayrollTab() {
  const [runs, setRuns] = useState<PayrollRun[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data
  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        const response = await payrollAPI.getAllRuns();
        if (response.success && response.data) {
          setRuns(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch payroll runs', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayroll();
  }, []);

  // 2. Derive "Current Cycle" Stats from the latest run
  // (In a real app, you might have a specific endpoint for 'current_draft')
  const latestRun = runs.length > 0 ? runs[0] : null;

  const currentStats = {
    estimatedCost: latestRun ? latestRun.totalDisbursed : 0,
    payableEmployees: latestRun ? latestRun.employeeCount : 0,
    status: latestRun ? latestRun.status : 'No Data',
    // Example: "Oct 1 - Oct 31" derived from dates
    period: latestRun
      ? `${new Date(latestRun.payPeriodStart).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })} - ${new Date(latestRun.payPeriodEnd).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })}`
      : '-',
  };

  // Helper: Format Date
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Helper: Format Currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header with Primary Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payroll</h1>
          <p className="text-muted-foreground">
            Manage salary disbursements and view history.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button className="bg-primary shadow-sm">
            <Play className="mr-2 h-4 w-4" />
            Run Payroll
          </Button>
        </div>
      </div>

      {/* 2. Current Cycle Stats (Dynamic) */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 md:grid-cols-3 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
        {/* Total Cost Card */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Latest Run Cost</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              ${formatCurrency(currentStats.estimatedCost)}
            </CardTitle>
            <CardAction>
              <Badge
                variant="outline"
                className="text-green-600 border-green-200 bg-green-50"
              >
                <DollarSign className="size-4 mr-1" />
                Total
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>

        {/* Employees Card */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Payable Employees</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {currentStats.payableEmployees.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <Users className="size-4 mr-1" />
                Active
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>

        {/* Status Card */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Latest Status</CardDescription>
            <CardTitle
              className={`text-2xl font-semibold tabular-nums @[250px]/card:text-3xl ${
                currentStats.status === 'Completed'
                  ? 'text-green-600'
                  : currentStats.status === 'Processing'
                  ? 'text-blue-600'
                  : 'text-orange-600'
              }`}
            >
              {currentStats.status}
            </CardTitle>
            <CardAction>
              <Badge
                variant="outline"
                className="text-orange-600 border-orange-200 bg-orange-50"
              >
                <Activity className="size-4 mr-1" />
                {currentStats.period}
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
      </div>

      {/* 3. Payroll History Table (Dynamic) */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll History</CardTitle>
          <CardDescription>
            A record of all completed payroll runs and their statuses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50">
                  <TableHead>Run Date</TableHead>
                  <TableHead>Pay Period</TableHead>
                  <TableHead>Total Disbursed</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {runs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No payroll runs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  runs.map((run) => (
                    <TableRow key={run.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(run.runDate)}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(run.payPeriodStart)} -{' '}
                        {formatDate(run.payPeriodEnd)}
                      </TableCell>
                      <TableCell className="font-mono">
                        ${formatCurrency(run.totalDisbursed)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            run.status === 'Completed'
                              ? 'text-green-600 border-green-200 bg-green-50'
                              : run.status === 'Processing'
                              ? 'text-blue-600 border-blue-200 bg-blue-50'
                              : 'text-orange-600 border-orange-200 bg-orange-50'
                          }
                        >
                          {run.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" /> Download
                              Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
