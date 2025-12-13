// src/components/tabs/SalaryReportsTab.tsx

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction, // Assumed available based on previous context
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Download,
  Filter,
  DollarSign,
  TrendingUp,
  Briefcase,
  Users,
  Eye,
} from 'lucide-react';

// Keep your existing Chart imports
import { DepartmentSalaryChart } from '@/components/ui/pie-chart-label';
import { SalaryGrowthChart } from '../../ui/line-chart';

export function SalaryReportsTab() {
  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Salary Report</h1>
          <p className="text-muted-foreground">
            Compensation analytics and trends.
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </div>

      {/* 2. Stats Overview - Gradient Cards */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 md:grid-cols-3 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
        {/* Total Annual Payroll */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Annual Payroll</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              $4,250,000
            </CardTitle>
            <CardAction>
              <Badge
                variant="outline"
                className="text-blue-600 border-blue-200 bg-blue-50"
              >
                <DollarSign className="size-4 mr-1" />
                FY 2025
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>

        {/* Average Salary */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Avg. Employee Salary</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              $78,500
            </CardTitle>
            <CardAction>
              <Badge
                variant="outline"
                className="text-green-600 border-green-200 bg-green-50"
              >
                <Users className="size-4 mr-1" />
                Per Annum
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>

        {/* Growth Trend */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>YoY Growth</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              +5.2%
            </CardTitle>
            <CardAction>
              <Badge
                variant="outline"
                className="text-purple-600 border-purple-200 bg-purple-50"
              >
                <TrendingUp className="size-4 mr-1" />
                vs 2024
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
      </div>

      {/* 3. Filters Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="h-4 w-4 text-muted-foreground" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select defaultValue="2025">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Fiscal Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">FY 2025</SelectItem>
                <SelectItem value="2024">FY 2024</SelectItem>
                <SelectItem value="2023">FY 2023</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="eng">Engineering</SelectItem>
                <SelectItem value="mkt">Marketing</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 4. Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Salary Distribution</CardTitle>
            <CardDescription>
              Compensation breakdown by department.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <div className="flex items-center justify-center min-h-[300px]">
              <DepartmentSalaryChart />
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Growth Trend</CardTitle>
            <CardDescription>
              Average salary progression over the last 12 months.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <div className="flex items-center justify-center min-h-[300px]">
              <SalaryGrowthChart />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 5. Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Breakdown</CardTitle>
          <CardDescription>
            Individual employee salary data for the selected period.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50">
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Current Salary</TableHead>
                  <TableHead>Last Raise</TableHead>
                  {/* <TableHead className="text-right">Action</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Row 1 */}
                <TableRow className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src="/avatars/01.png" alt="JD" />
                        <AvatarFallback className="rounded-lg">
                          JD
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span>John Doe</span>
                        <span className="text-xs text-muted-foreground">
                          emp001
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-secondary rounded-md">
                        <Briefcase className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <span>Engineering</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-base">$85,000</TableCell>
                  <TableCell className="text-muted-foreground">
                    Jan 1, 2025
                  </TableCell>
                </TableRow>

                {/* Row 2 */}
                <TableRow className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src="/avatars/02.png" alt="JS" />
                        <AvatarFallback className="rounded-lg">
                          JS
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span>Jane Smith</span>
                        <span className="text-xs text-muted-foreground">
                          emp002
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-secondary rounded-md">
                        <Briefcase className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <span>Marketing</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-base">$72,500</TableCell>
                  <TableCell className="text-muted-foreground">
                    Mar 15, 2025
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
