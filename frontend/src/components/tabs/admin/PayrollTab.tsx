// src/components/tabs/PayrollTab.tsx

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  IconChevronsRight,
  IconFileText,
  IconCalendar,
} from '@tabler/icons-react';

export function PayrollTab() {
  return (
    <div className="grid gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payroll</h1>
          <p className="text-muted-foreground">Detailed salary overview</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Current Payroll Cycle</CardTitle>
            <CardDescription className="mt-1">
              Status for the payroll period from Oct 1 - Oct 31, 2025.
            </CardDescription>
          </div>
          <Button>
            <IconChevronsRight className="mr-2 h-4 w-4" /> Run Payroll
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <span className="text-muted-foreground">Total to be Paid:</span>
              <p className="text-2xl font-bold mt-1">$150,450.00</p>
            </div>
            <div className="flex-1">
              <span className="text-muted-foreground">Employees:</span>
              <p className="text-2xl font-bold mt-1">1,250</p>
            </div>
            <div className="flex-1">
              <span className="text-muted-foreground">Status : </span>
              <Badge className="bg-yellow-500 hover:bg-yellow-500 mt-1">
                Pending Approval
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payroll History</CardTitle>
          <CardDescription>
            A record of all completed payroll runs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* This is a placeholder. You'll map over your data here */}
              <TableRow>
                <TableCell className="font-medium">Oct 1, 2025</TableCell>
                <TableCell>Sep 1 - Sep 30, 2025</TableCell>
                <TableCell>$148,120.50</TableCell>
                <TableCell>
                  <Badge>Processed</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <IconFileText className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Sep 1, 2025</TableCell>
                <TableCell>Aug 1 - Aug 31, 2025</TableCell>
                <TableCell>$145,900.00</TableCell>
                <TableCell>
                  <Badge>Processed</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <IconFileText className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
