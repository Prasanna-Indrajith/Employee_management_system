import puppeteer from 'puppeteer';
import { Payslip } from '../types';

export const payslipPdfService = {
  generate: async (payslip: Payslip, employeeName: string): Promise<Buffer> => {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // Helper for currency formatting
    const formatCurrency = (amount?: number) => 
      amount ? `Rs. ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Rs. 0.00';

    // HTML Template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Helvetica', 'Arial', sans-serif; padding: 40px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .header h1 { margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; }
          .header h2 { margin: 5px 0 0; font-size: 14px; font-weight: normal; color: #666; }
          .period { margin-top: 10px; font-size: 16px; font-weight: bold; }
          
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
          .info-item { margin-bottom: 5px; font-size: 14px; }
          .label { font-weight: bold; color: #555; width: 100px; display: inline-block; }

          .tables-container { display: flex; gap: 30px; margin-bottom: 30px; }
          .table-box { flex: 1; }
          .table-header { background: #f4f4f4; padding: 10px; font-weight: bold; border-bottom: 1px solid #ddd; font-size: 14px; }
          
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          td { padding: 8px 10px; border-bottom: 1px solid #eee; }
          td.amount { text-align: right; font-family: 'Courier New', monospace; }
          
          .summary { margin-top: 30px; border-top: 2px solid #333; padding-top: 20px; }
          .summary-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
          .net-pay { font-size: 18px; font-weight: bold; border-top: 1px solid #ddd; padding-top: 10px; margin-top: 10px; }

          .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #eee; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Payslip</h1>
          <h2>Employee Management System</h2>
          <div class="period">Period: ${payslip.monthYear}</div>
        </div>

        <div class="info-grid">
          <div>
            <div class="info-item"><span class="label">Employee:</span> ${employeeName}</div>
            <div class="info-item"><span class="label">ID:</span> ${payslip.employeeId}</div>
            <div class="info-item"><span class="label">Status:</span> ${payslip.status}</div>
          </div>
          <div style="text-align: right;">
             <div class="info-item"><span class="label">Issue Date:</span> ${new Date(payslip.issueDate).toLocaleDateString()}</div>
             <div class="info-item"><span class="label">Slip ID:</span> ${payslip.id.substring(0, 8)}</div>
          </div>
        </div>

        <div class="tables-container">
          <div class="table-box">
            <div class="table-header">Earnings</div>
            <table>
              ${(payslip.baseSalary || 0) > 0 ? `<tr><td>Base Salary</td><td class="amount">${formatCurrency(payslip.baseSalary)}</td></tr>` : ''}
              ${(payslip.bonuses || 0) > 0 ? `<tr><td>Bonuses</td><td class="amount">${formatCurrency(payslip.bonuses)}</td></tr>` : ''}
              ${(payslip.allowances || 0) > 0 ? `<tr><td>Allowances</td><td class="amount">${formatCurrency(payslip.allowances)}</td></tr>` : ''}
              ${(payslip.overtimePay || 0) > 0 ? `<tr><td>Overtime</td><td class="amount">${formatCurrency(payslip.overtimePay)}</td></tr>` : ''}
              ${(payslip.commissions || 0) > 0 ? `<tr><td>Commissions</td><td class="amount">${formatCurrency(payslip.commissions)}</td></tr>` : ''}
            </table>
          </div>

          <div class="table-box">
            <div class="table-header">Deductions</div>
            <table>
              ${(payslip.federalTax || 0) > 0 ? `<tr><td>Federal Tax</td><td class="amount">${formatCurrency(payslip.federalTax)}</td></tr>` : ''}
              ${(payslip.stateTax || 0) > 0 ? `<tr><td>State Tax</td><td class="amount">${formatCurrency(payslip.stateTax)}</td></tr>` : ''}
              ${(payslip.insurance || 0) > 0 ? `<tr><td>Insurance</td><td class="amount">${formatCurrency(payslip.insurance)}</td></tr>` : ''}
              ${(payslip.otherDeductions || 0) > 0 ? `<tr><td>Other</td><td class="amount">${formatCurrency(payslip.otherDeductions)}</td></tr>` : ''}
            </table>
          </div>
        </div>

        <div class="summary">
          <div class="summary-row">
            <span>Gross Pay</span>
            <span>${formatCurrency(payslip.grossPay)}</span>
          </div>
          <div class="summary-row" style="color: #c0392b;">
            <span>Total Deductions</span>
            <span>- ${formatCurrency(payslip.totalDeductions)}</span>
          </div>
          <div class="summary-row net-pay">
            <span>Net Pay</span>
            <span>${formatCurrency(payslip.netSalary)}</span>
          </div>
        </div>

        <div class="footer">
          This is a computer-generated document. No signature is required.<br>
          Generated on ${new Date().toLocaleString()}
        </div>
      </body>
      </html>
    `;

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();
    return Buffer.from(pdfBuffer);
  }
};
