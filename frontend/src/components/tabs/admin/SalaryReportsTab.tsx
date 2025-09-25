// src/components/tabs/SalaryReportsTab.tsx

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { IconDownload } from "@tabler/icons-react";

import { DepartmentSalaryChart } from '@/components/ui/pie-chart-label'
import { SalaryGrowthChart } from '../../ui/line-chart';

export function SalaryReportsTab() {
  return (
    <div className="grid gap-6">
      {/* Tab Title */}
      <span>
        <h1 className="text-2xl font-medium">Salary Report</h1>
        <p className="text-muted-foreground text-sm">Detailed salary overview</p>
      </span>
      {/* Tab Title End */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        <div className="flex flex-wrap gap-4">
          <Button variant={'outline'}>Department</Button>
          <Button variant={'outline'}>2025</Button>
        </div>
        <Button variant="outline">
          <IconDownload className="mr-2 h-4 w-4" /> Download Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Average Salary by Department</CardTitle>
            <CardDescription>
              A visual breakdown of compensation per team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center text-muted-foreground">
              <DepartmentSalaryChart/>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Salary Growth Over Time</CardTitle>
            <CardDescription>
              Trend of average salaries across the company.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for a line chart */}
            <div className="flex items-center justify-center text-muted-foreground">
              <SalaryGrowthChart/>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Employee Salary Breakdown</CardTitle>
          <CardDescription>
            Sortable and searchable table of all employee salaries.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Current Salary</TableHead>
                <TableHead>Last Raise Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Placeholder table rows. You would populate this with your employee data */}
              <TableRow>
                <TableCell className="font-medium">John Doe</TableCell>
                <TableCell>Engineering</TableCell>
                <TableCell>$85,000</TableCell>
                <TableCell>Jan 1, 2025</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Jane Smith</TableCell>
                <TableCell>Marketing</TableCell>
                <TableCell>$72,500</TableCell>
                <TableCell>Mar 15, 2025</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}