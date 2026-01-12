import puppeteer from "puppeteer";
import { pool } from "../config/db";

export class PDFService {
  // Generate HTML template for daily timesheet (Admin)
  static generateDailyTimesheetHTML(data: any[], date: string): string {
    const totalPresent = data.length;
    const totalLate = data.filter((d) => d.status === "Late").length;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Arial', sans-serif;
            padding: 40px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
          }
          .header h1 {
            margin: 0;
            color: #1e40af;
            font-size: 28px;
          }
          .header p {
            margin: 5px 0;
            color: #64748b;
            font-size: 14px;
          }
          .stats {
            display: flex;
            justify-content: space-around;
            margin: 30px 0;
            gap: 20px;
          }
          .stat-card {
            flex: 1;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #e2e8f0;
          }
          .stat-card h3 {
            margin: 0 0 10px 0;
            color: #64748b;
            font-size: 14px;
            font-weight: normal;
          }
          .stat-card p {
            margin: 0;
            font-size: 32px;
            font-weight: bold;
            color: #1e293b;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th {
            background-color: #f1f5f9;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #475569;
            border-bottom: 2px solid #cbd5e1;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
          }
          .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
          }
          .badge-late {
            background-color: #fef2f2;
            color: #dc2626;
            border: 1px solid #fecaca;
          }
          .badge-ontime {
            background-color: #f0fdf4;
            color: #16a34a;
            border: 1px solid #bbf7d0;
          }
          .badge-dept {
            background-color: #eff6ff;
            color: #2563eb;
            border: 1px solid #bfdbfe;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #94a3b8;
            font-size: 12px;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
          }
          .time-in {
            color: #16a34a;
            font-weight: 500;
          }
          .time-out {
            color: #f59e0b;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Daily Timesheet Report</h1>
          <p>Date: ${new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}</p>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>

        <div class="stats">
          <div class="stat-card">
            <h3>Total Present</h3>
            <p>${totalPresent}</p>
          </div>
          <div class="stat-card">
            <h3>On Time</h3>
            <p>${totalPresent - totalLate}</p>
          </div>
          <div class="stat-card">
            <h3>Late Arrivals</h3>
            <p style="color: #f59e0b;">${totalLate}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Department</th>
              <th>Clock In</th>
              <th>Clock Out</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (entry) => `
              <tr>
                <td style="font-family: monospace; color: #64748b;">${
                  entry.employeeId
                }</td>
                <td style="font-weight: 500;">${entry.employeeName}</td>
                <td><span class="badge badge-dept">${
                  entry.department
                }</span></td>
                <td class="time-in">${entry.clockIn || "--:--"}</td>
                <td class="time-out">${entry.clockOut || "--:--"}</td>
                <td>
                  <span class="badge ${
                    entry.status === "Late" ? "badge-late" : "badge-ontime"
                  }">
                    ${entry.status}
                  </span>
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="footer">
          <p>This is a system-generated report. No signature required.</p>
          <p>© ${new Date().getFullYear()} HR Management System</p>
        </div>
      </body>
      </html>
    `;
  }

  // Generate HTML template for monthly employee timesheet
  static generateMonthlyEmployeeTimesheetHTML(
    data: any[],
    employeeName: string,
    month: string,
    year: number
  ): string {
    const totalPresent = data.filter((d) => d.status !== "Absent").length;
    const totalLate = data.filter((d) => d.status === "Late").length;
    const totalAbsent = data.filter((d) => d.status === "Absent").length;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #2563eb; padding-bottom: 20px; }
          .header h1 { margin: 0; color: #1e40af; font-size: 28px; }
          .header h2 { margin: 10px 0 0 0; color: #475569; font-size: 20px; font-weight: normal; }
          .header p { margin: 5px 0; color: #64748b; font-size: 14px; }
          .stats { display: flex; justify-content: space-around; margin: 30px 0; gap: 20px; }
          .stat-card { flex: 1; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0; }
          .stat-card h3 { margin: 0 0 10px 0; color: #64748b; font-size: 14px; font-weight: normal; }
          .stat-card p { margin: 0; font-size: 32px; font-weight: bold; color: #1e293b; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #f1f5f9; padding: 12px; text-align: left; font-weight: 600; color: #475569; border-bottom: 2px solid #cbd5e1; }
          td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500; }
          .badge-late { background-color: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
          .badge-ontime { background-color: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
          .badge-absent { background-color: #fef2f2; color: #991b1b; border: 1px solid #fca5a5; }
          .footer { margin-top: 40px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          .time-in { color: #16a34a; font-weight: 500; }
          .time-out { color: #f59e0b; font-weight: 500; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Monthly Timesheet Report</h1>
          <h2>${employeeName}</h2>
          <p>${month} ${year}</p>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>

        <div class="stats">
          <div class="stat-card">
            <h3>Days Present</h3>
            <p>${totalPresent}</p>
          </div>
          <div class="stat-card">
            <h3>Late Arrivals</h3>
            <p style="color: #f59e0b;">${totalLate}</p>
          </div>
          <div class="stat-card">
            <h3>Days Absent</h3>
            <p style="color: #dc2626;">${totalAbsent}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Day</th>
              <th>Clock In</th>
              <th>Clock Out</th>
              <th>Hours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (entry) => `
              <tr>
                <td style="font-weight: 500;">${new Date(
                  entry.date
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}</td>
                <td>${new Date(entry.date).toLocaleDateString("en-US", {
                  weekday: "short",
                })}</td>
                <td class="time-in">${entry.clockIn || "--:--"}</td>
                <td class="time-out">${entry.clockOut || "--:--"}</td>
                <td>${entry.hours || "--"}</td>
                <td>
                  <span class="badge ${
                    entry.status === "Late"
                      ? "badge-late"
                      : entry.status === "Absent"
                      ? "badge-absent"
                      : "badge-ontime"
                  }">
                    ${entry.status}
                  </span>
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="footer">
          <p>This is a system-generated report. No signature required.</p>
          <p>© ${new Date().getFullYear()} HR Management System</p>
        </div>
      </body>
      </html>
    `;
  }

  // Generate daily PDF and store in database
  static async generateAndStoreDailyPDF(
    data: any[],
    date: string,
    generatedBy?: string
  ): Promise<Buffer> {
    const html = this.generateDailyTimesheetHTML(data, date);
    const fileName = `timesheet_${date}.pdf`;

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
    });

    await browser.close();

    // Store in database
    const totalPresent = data.length;
    const totalLate = data.filter((d) => d.status === "Late").length;

    await pool.query(
      `INSERT INTO timesheet_reports 
        (report_date, report_type, pdf_data, file_name, file_size, total_present, total_late, generated_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (report_date) 
       DO UPDATE SET 
         pdf_data = EXCLUDED.pdf_data,
         file_size = EXCLUDED.file_size,
         total_present = EXCLUDED.total_present,
         total_late = EXCLUDED.total_late,
         generated_at = CURRENT_TIMESTAMP`,
      [
        date,
        "daily",
        pdfBuffer,
        fileName,
        pdfBuffer.length,
        totalPresent,
        totalLate,
        generatedBy || null,
      ]
    );

    return pdfBuffer;
  }

  // Generate monthly employee PDF and store in database
  static async generateAndStoreMonthlyEmployeePDF(
    data: any[],
    employeeId: string,
    employeeName: string,
    month: number,
    year: number
  ): Promise<Buffer> {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthName = monthNames[month - 1];

    const html = this.generateMonthlyEmployeeTimesheetHTML(
      data,
      employeeName,
      monthName,
      year
    );
    const fileName = `timesheet_${employeeId}_${year}-${month
      .toString()
      .padStart(2, "0")}.pdf`;
    const reportMonth = `${year}-${month.toString().padStart(2, "0")}-01`;

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
    });

    await browser.close();

    // Calculate stats
    const totalPresent = data.filter((d) => d.status !== "Absent").length;
    const totalLate = data.filter((d) => d.status === "Late").length;
    const totalAbsent = data.filter((d) => d.status === "Absent").length;
    const totalHours = data.reduce(
      (sum, d) => sum + (parseFloat(d.hours) || 0),
      0
    );

    // Store in database
    await pool.query(
      `INSERT INTO employee_timesheet_reports 
        (employee_id, report_month, report_year, month_number, pdf_data, file_name, file_size, 
         total_days_present, total_days_late, total_days_absent, total_work_hours)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (employee_id, report_month) 
       DO UPDATE SET 
         pdf_data = EXCLUDED.pdf_data,
         file_size = EXCLUDED.file_size,
         total_days_present = EXCLUDED.total_days_present,
         total_days_late = EXCLUDED.total_days_late,
         total_days_absent = EXCLUDED.total_days_absent,
         total_work_hours = EXCLUDED.total_work_hours,
         generated_at = CURRENT_TIMESTAMP`,
      [
        employeeId,
        reportMonth,
        year,
        month,
        pdfBuffer,
        fileName,
        pdfBuffer.length,
        totalPresent,
        totalLate,
        totalAbsent,
        totalHours,
      ]
    );

    return pdfBuffer;
  }

  // Get daily PDF from database
  static async getDailyPDFFromDB(date: string): Promise<Buffer | null> {
    const result = await pool.query(
      "SELECT pdf_data FROM timesheet_reports WHERE report_date = $1 AND report_type = $2",
      [date, "daily"]
    );

    if (result.rows.length > 0) {
      return result.rows[0].pdf_data;
    }
    return null;
  }

  // Get monthly employee PDF from database
  static async getMonthlyEmployeePDFFromDB(
    employeeId: string,
    month: number,
    year: number
  ): Promise<Buffer | null> {
    const reportMonth = `${year}-${month.toString().padStart(2, "0")}-01`;

    const result = await pool.query(
      "SELECT pdf_data FROM employee_timesheet_reports WHERE employee_id = $1 AND report_month = $2",
      [employeeId, reportMonth]
    );

    if (result.rows.length > 0) {
      return result.rows[0].pdf_data;
    }
    return null;
  }
}
