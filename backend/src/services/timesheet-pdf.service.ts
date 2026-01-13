import puppeteer from 'puppeteer';
import { EmployeeRepository } from '../repositories/employee.repository';

interface TimesheetData {
  id: string;
  date: string;
  clockIn: string;
  clockOut: string;
  status: string;
  employeeName: string;
  employeeId: string;
  department: string;
}

interface MonthlyAttendanceData {
  date: string;
  clockIn: string;
  clockOut: string;
  status: string;
  location: string;
}

export class TimesheetPDFService {
  private employeeRepository: EmployeeRepository;

  constructor() {
    this.employeeRepository = new EmployeeRepository();
  }

  async generateAdminTimesheetPDF(date: string, filters?: {
    department?: string;
    status?: string;
  }): Promise<Buffer> {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    try {
      // Fetch timesheet data
      const timesheetData = await this.employeeRepository.getTimesheets(date);
      
      // Apply filters if provided
      let filteredData = timesheetData;
      if (filters?.department && filters.department !== 'all') {
        filteredData = timesheetData.filter(item => item.department === filters.department);
      }
      if (filters?.status && filters.status !== 'all') {
        filteredData = timesheetData.filter(item => item.status === filters.status);
      }

      // Calculate statistics
      const totalEmployees = filteredData.length;
      const presentCount = filteredData.filter(item => item.status === 'Present').length;
      const lateCount = filteredData.filter(item => item.status === 'Late').length;
      const absentCount = filteredData.filter(item => item.status === 'Absent').length;

      // Department breakdown
      const departmentStats = this.getDepartmentStats(filteredData);

      const html = this.generateAdminTimesheetHTML(
        date,
        filteredData,
        {
          totalEmployees,
          presentCount,
          lateCount,
          absentCount,
          departmentStats
        }
      );

      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm'
        }
      });

      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }

  async generateUserMonthlyPDF(employeeId: string, month: string): Promise<Buffer> {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    try {
      // Fetch user's monthly attendance data
      const attendanceData = await this.employeeRepository.getUserMonthlyAttendance(employeeId, month);
      const employee = await this.employeeRepository.findById(employeeId);

      // Calculate statistics
      const totalDays = attendanceData.length;
      const presentDays = attendanceData.filter(item => item.status === 'Present').length;
      const lateDays = attendanceData.filter(item => item.status === 'Late').length;
      const averageHours = this.calculateAverageHours(attendanceData);

      const html = this.generateUserMonthlyHTML(
        employee?.fullName || 'Unknown Employee',
        month,
        attendanceData,
        {
          totalDays,
          presentDays,
          lateDays,
          averageHours
        }
      );

      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm'
        }
      });

      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }

  private generateAdminTimesheetHTML(
    date: string,
    data: TimesheetData[],
    stats: any
  ): string {
    const reportDate = new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const departmentRows = stats.departmentStats.map((dept: any) => 
      `<tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${dept.department}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${dept.count}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${((dept.count / stats.totalEmployees) * 100).toFixed(1)}%</td>
      </tr>`
    ).join('');

    const employeeRows = data.map((item) => 
      `<tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.employeeName}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.employeeId}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.department}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.clockIn || '--:--'}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.clockOut || '--:--'}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">
          <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; background-color: ${
            item.status === 'Present' ? '#d4edda' : item.status === 'Late' ? '#f8d7da' : '#e2e3e5'
          }; color: ${
            item.status === 'Present' ? '#155724' : item.status === 'Late' ? '#721c24' : '#383d41'
          };">
            ${item.status}
          </span>
        </td>
      </tr>`
    ).join('');

    return `<!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #007bff;
              padding-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              color: #007bff;
              font-size: 28px;
            }
            .header h2 {
              margin: 10px 0 0 0;
              color: #666;
              font-size: 18px;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 20px;
              margin-bottom: 30px;
            }
            .stat-card {
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
              border-left: 4px solid #007bff;
            }
            .stat-number {
              font-size: 24px;
              font-weight: bold;
              color: #007bff;
            }
            .stat-label {
              color: #666;
              font-size: 14px;
              margin-top: 5px;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              margin: 30px 0 15px 0;
              color: #333;
              border-bottom: 1px solid #eee;
              padding-bottom: 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th {
              background-color: #007bff;
              color: white;
              padding: 12px;
              text-align: left;
              font-weight: bold;
            }
            td {
              padding: 8px;
              border: 1px solid #ddd;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #666;
              font-size: 12px;
              border-top: 1px solid #eee;
              padding-top: 20px;
            }
            @media print {
              .stat-card { break-inside: avoid; }
              table { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Employee Management System</h1>
            <h2>Daily Timesheet Report</h2>
            <p style="margin: 5px 0 0 0; font-size: 16px; color: #666;">${reportDate}</p>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">${stats.totalEmployees}</div>
              <div class="stat-label">Total Employees</div>
            </div>
            <div class="stat-card" style="border-left-color: #28a745;">
              <div class="stat-number" style="color: #28a745;">${stats.presentCount}</div>
              <div class="stat-label">Present</div>
            </div>
            <div class="stat-card" style="border-left-color: #ffc107;">
              <div class="stat-number" style="color: #ffc107;">${stats.lateCount}</div>
              <div class="stat-label">Late</div>
            </div>
            <div class="stat-card" style="border-left-color: #dc3545;">
              <div class="stat-number" style="color: #dc3545;">${stats.absentCount}</div>
              <div class="stat-label">Absent</div>
            </div>
          </div>

          <div class="section-title">Department Breakdown</div>
          <table>
            <thead>
              <tr>
                <th style="padding: 12px; text-align: left;">Department</th>
                <th style="padding: 12px; text-align: left;">Employees</th>
                <th style="padding: 12px; text-align: left;">Percentage</th>
              </tr>
            </thead>
            <tbody>
              ${departmentRows}
            </tbody>
          </table>

          <div class="section-title">Employee Details</div>
          <table>
            <thead>
              <tr>
                <th style="padding: 12px; text-align: left;">Employee Name</th>
                <th style="padding: 12px; text-align: left;">ID</th>
                <th style="padding: 12px; text-align: left;">Department</th>
                <th style="padding: 12px; text-align: left;">Clock In</th>
                <th style="padding: 12px; text-align: left;">Clock Out</th>
                <th style="padding: 12px; text-align: left;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${employeeRows}
            </tbody>
          </table>

          <div class="footer">
            <p>Generated on ${new Date().toLocaleString()} | Employee Management System</p>
          </div>
        </body>
      </html>`;
  }

  private generateUserMonthlyHTML(
    employeeName: string,
    month: string,
    data: MonthlyAttendanceData[],
    stats: any
  ): string {
    const monthYear = new Date(month + '-01').toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });

    const attendanceRows = data.map((item) => 
      `<tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${new Date(item.date).toLocaleDateString()}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.clockIn || '--:--'}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.clockOut || '--:--'}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${this.calculateHours(item.clockIn, item.clockOut)}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">
          <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; background-color: ${
            item.status === 'Present' ? '#d4edda' : item.status === 'Late' ? '#f8d7da' : '#e2e3e5'
          }; color: ${
            item.status === 'Present' ? '#155724' : item.status === 'Late' ? '#721c24' : '#383d41'
          };">
            ${item.status}
          </span>
        </td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.location || 'Office'}</td>
      </tr>`
    ).join('');

    return `<!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #007bff;
              padding-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              color: #007bff;
              font-size: 28px;
            }
            .header h2 {
              margin: 10px 0 0 0;
              color: #666;
              font-size: 18px;
            }
            .employee-info {
              text-align: center;
              margin-bottom: 30px;
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 20px;
              margin-bottom: 30px;
            }
            .stat-card {
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
              border-left: 4px solid #007bff;
            }
            .stat-number {
              font-size: 24px;
              font-weight: bold;
              color: #007bff;
            }
            .stat-label {
              color: #666;
              font-size: 14px;
              margin-top: 5px;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              margin: 30px 0 15px 0;
              color: #333;
              border-bottom: 1px solid #eee;
              padding-bottom: 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th {
              background-color: #007bff;
              color: white;
              padding: 12px;
              text-align: left;
              font-weight: bold;
            }
            td {
              padding: 8px;
              border: 1px solid #ddd;
            }
            .signature-section {
              margin-top: 50px;
              display: flex;
              justify-content: space-between;
            }
            .signature-box {
              text-align: center;
            }
            .signature-line {
              border-bottom: 1px solid #333;
              width: 200px;
              margin-top: 40px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #666;
              font-size: 12px;
              border-top: 1px solid #eee;
              padding-top: 20px;
            }
            @media print {
              .stat-card { break-inside: avoid; }
              table { break-inside: avoid; }
              .signature-section { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Employee Management System</h1>
            <h2>Monthly Attendance Report</h2>
          </div>

          <div class="employee-info">
            <h3>${employeeName}</h3>
            <p style="margin: 5px 0 0 0; font-size: 16px; color: #666;">${monthYear}</p>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">${stats.totalDays}</div>
              <div class="stat-label">Total Working Days</div>
            </div>
            <div class="stat-card" style="border-left-color: #28a745;">
              <div class="stat-number" style="color: #28a745;">${stats.presentDays}</div>
              <div class="stat-label">Days Present</div>
            </div>
            <div class="stat-card" style="border-left-color: #ffc107;">
              <div class="stat-number" style="color: #ffc107;">${stats.lateDays}</div>
              <div class="stat-label">Days Late</div>
            </div>
            <div class="stat-card" style="border-left-color: #17a2b8;">
              <div class="stat-number" style="color: #17a2b8;">${stats.averageHours}</div>
              <div class="stat-label">Average Hours</div>
            </div>
          </div>

          <div class="section-title">Daily Attendance Details</div>
          <table>
            <thead>
              <tr>
                <th style="padding: 12px; text-align: left;">Date</th>
                <th style="padding: 12px; text-align: left;">Day</th>
                <th style="padding: 12px; text-align: left;">Clock In</th>
                <th style="padding: 12px; text-align: left;">Clock Out</th>
                <th style="padding: 12px; text-align: left;">Hours</th>
                <th style="padding: 12px; text-align: left;">Status</th>
                <th style="padding: 12px; text-align: left;">Location</th>
              </tr>
            </thead>
            <tbody>
              ${attendanceRows}
            </tbody>
          </table>

          <div class="signature-section">
            <div class="signature-box">
              <p>Employee Signature</p>
              <div class="signature-line"></div>
            </div>
            <div class="signature-box">
              <p>Manager Signature</p>
              <div class="signature-line"></div>
            </div>
          </div>

          <div class="footer">
            <p>Generated on ${new Date().toLocaleString()} | Employee Management System</p>
          </div>
        </body>
      </html>`;
  }

  private getDepartmentStats(data: TimesheetData[]) {
    const deptMap = new Map<string, number>();
    
    data.forEach(item => {
      deptMap.set(item.department, (deptMap.get(item.department) || 0) + 1);
    });

    return Array.from(deptMap.entries()).map(([department, count]) => ({
      department,
      count
    }));
  }

  private calculateHours(clockIn: string, clockOut: string): string {
    if (!clockIn || !clockOut) return '--';
    
    try {
      const [inHour, inMin] = clockIn.split(':').map(Number);
      const [outHour, outMin] = clockOut.split(':').map(Number);
      
      const totalMinutes = (outHour * 60 + outMin) - (inHour * 60 + inMin);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      
      return `${hours}.${minutes.toString().padStart(2, '0')}`;
    } catch {
      return '--';
    }
  }

  private calculateAverageHours(data: MonthlyAttendanceData[]): string {
    const validHours = data
      .filter(item => item.clockIn && item.clockOut)
      .map(item => this.calculateHours(item.clockIn, item.clockOut))
      .filter(hours => hours !== '--')
      .map(hours => parseFloat(hours));

    if (validHours.length === 0) return '0';
    
    const average = validHours.reduce((sum, hours) => sum + hours, 0) / validHours.length;
    return average.toFixed(1);
  }
}