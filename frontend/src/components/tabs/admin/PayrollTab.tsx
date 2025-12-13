// src/components/tabs/PayrollTab.tsx

import {
  DollarSign,
  Users,
  Activity,
  Play,
  FileText,
  Calendar,
  Download,
  MoreHorizontal,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction, // Assumed available based on previous context
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

export function PayrollTab() {
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

      {/* 2. Current Cycle Stats - Using Gradient Card Style */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 md:grid-cols-3 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
        {/* Total Cost Card */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Estimated Cost</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              $150,450.00
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
              1,250
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
            <CardDescription>Cycle Status</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-orange-600">
              Pending
            </CardTitle>
            <CardAction>
              <Badge
                variant="outline"
                className="text-orange-600 border-orange-200 bg-orange-50"
              >
                <Activity className="size-4 mr-1" />
                Oct 01 - Oct 31
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
      </div>

      {/* 3. Payroll History Table */}
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
                {/* Row 1 */}
                <TableRow className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      Oct 1, 2025
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    Sep 1 - Sep 30, 2025
                  </TableCell>
                  <TableCell className="font-mono">$148,120.50</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-200 bg-green-50"
                    >
                      Processed
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
                          <Download className="mr-2 h-4 w-4" /> Download Report
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>

                {/* Row 2 */}
                <TableRow className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      Sep 1, 2025
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    Aug 1 - Aug 31, 2025
                  </TableCell>
                  <TableCell className="font-mono">$145,900.00</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-200 bg-green-50"
                    >
                      Processed
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
                          <Download className="mr-2 h-4 w-4" /> Download Report
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
