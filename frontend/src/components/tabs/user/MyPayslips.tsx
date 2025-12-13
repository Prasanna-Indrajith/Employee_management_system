'use client';

import React, { useState } from 'react';
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

export default function MyPayslips() {
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  // Mock Payslip Data
  const payslips = [
    {
      id: 101,
      month: 'October',
      year: 2025,
      amount: 'Rs. 150,000',
      status: 'Paid',
      date: 'Oct 30, 2025',
    },
    {
      id: 102,
      month: 'September',
      year: 2025,
      amount: 'Rs. 150,000',
      status: 'Paid',
      date: 'Sep 30, 2025',
    },
    {
      id: 103,
      month: 'August',
      year: 2025,
      amount: 'Rs. 145,000',
      status: 'Paid',
      date: 'Aug 30, 2025',
    },
    {
      id: 104,
      month: 'July',
      year: 2025,
      amount: 'Rs. 145,000',
      status: 'Paid',
      date: 'Jul 30, 2025',
    },
  ];

  // Logic to simulate PDF download
  const handleDownload = (id: number, month: string) => {
    setDownloadingId(id);

    // Simulate network request/PDF generation time
    setTimeout(() => {
      setDownloadingId(null);
      // In a real app, this would trigger: window.open(pdfUrl, '_blank');
      alert(`Downloaded Payslip_${month}_2025.pdf successfully!`);
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
                      <span>
                        {slip.month} {slip.year}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {slip.date}
                  </TableCell>
                  <TableCell className="font-semibold">{slip.amount}</TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      {slip.status}
                    </Badge>
                  </TableCell>

                  {/* Download Button */}
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(slip.id, slip.month)}
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
