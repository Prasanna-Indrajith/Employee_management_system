'use client';

import { useState, useEffect } from 'react';
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
import { payrollAPI } from '@/services/api'; // Import API
import type { Payslip } from '@/types';

export default function MyPayslips() {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // 1. Fetch Payslips on Mount
  useEffect(() => {
    const fetchPayslips = async () => {
      try {
        const response = await payrollAPI.getMyPayslips();
        if (response.success && response.data) {
          setPayslips(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch payslips', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayslips();
  }, []);

  // 2. Handle PDF Download (Simulated)
  const handleDownload = (id: string, monthYear: string, pdfUrl?: string) => {
    if (!pdfUrl) {
      // If we don't have a real URL yet, simulate it
      setDownloadingId(id);
      setTimeout(() => {
        setDownloadingId(null);
        alert(
          `Downloaded Payslip_${monthYear.replace(' ', '_')}.pdf successfully!`
        );
      }, 1500);
      return;
    }

    // If we have a real URL, open it
    window.open(pdfUrl, '_blank');
  };

  // Helper: Format date string to "Oct 30, 2025"
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <IconLoader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
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
                {payslips.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center h-24 text-muted-foreground"
                    >
                      No payslips found.
                    </TableCell>
                  </TableRow>
                ) : (
                  payslips.map((slip) => (
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
                        {formatDate(slip.issueDate)}
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
                          onClick={() =>
                            handleDownload(slip.id, slip.monthYear, slip.pdfUrl)
                          }
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
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
