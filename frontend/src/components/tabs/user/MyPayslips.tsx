'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { IconDownload, IconFileText, IconLoader2 } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import type { Payslip } from '@/types'; // Import your type

export default function MyPayslips() {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Mock Payslip Data matching the Payslip Interface
  const payslips: Payslip[] = [
    {
      id: 'slip_101',
      employeeId: 'emp001',
      payrollRunId: 'run001',
      monthYear: 'October 2025',
      netSalary: 150000,
      status: 'Paid',
      issueDate: 'Oct 30, 2025',
    },
    {
      id: 'slip_102',
      employeeId: 'emp001',
      payrollRunId: 'run002',
      monthYear: 'September 2025',
      netSalary: 150000,
      status: 'Paid',
      issueDate: 'Sep 30, 2025',
    },
    {
      id: 'slip_103',
      employeeId: 'emp001',
      payrollRunId: 'run003',
      monthYear: 'August 2025',
      netSalary: 145000,
      status: 'Paid',
      issueDate: 'Aug 30, 2025',
    },
    {
      id: 'slip_104',
      employeeId: 'emp001',
      payrollRunId: 'run004',
      monthYear: 'July 2025',
      netSalary: 145000,
      status: 'Paid',
      issueDate: 'Jul 30, 2025',
    },
  ];

  // Logic to simulate PDF download
  const handleDownload = (id: string, monthYear: string) => {
    setDownloadingId(id);

    // Simulate network request/PDF generation time
    setTimeout(() => {
      setDownloadingId(null);
      // In a real app, this would trigger: window.open(pdfUrl, '_blank');
      alert(
        `Downloaded Payslip_${monthYear.replace(' ', '_')}.pdf successfully!`
      );
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">My Payslips</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Salary History</CardTitle>
          <CardDescription>
            View and download your monthly salary slips.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month / Year</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Net Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payslips.map((slip) => (
                <TableRow key={slip.id}>
                  {/* Month Icon & Name */}
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-secondary rounded-md">
                        <IconFileText className="size-4" />
                      </div>
                      <span>{slip.monthYear}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {slip.issueDate}
                  </TableCell>

                  <TableCell className="font-semibold font-mono">
                    Rs. {slip.netSalary.toLocaleString()}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        slip.status === 'Paid'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }
                    >
                      {slip.status}
                    </Badge>
                  </TableCell>

                  {/* Download Button */}
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(slip.id, slip.monthYear)}
                      disabled={downloadingId === slip.id}
                    >
                      {downloadingId === slip.id ? (
                        <>
                          <IconLoader2 className="mr-2 size-4 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <IconDownload className="mr-2 size-4" />
                          Download PDF
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
