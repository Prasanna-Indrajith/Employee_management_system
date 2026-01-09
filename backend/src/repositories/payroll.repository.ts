import { pool } from "../config/db";
import {
  PayrollRun,
  Payslip,
  SalaryHistory,
  DepartmentSalaryStats,
  EmployeeSalaryDetail,
} from "../types";

export const payrollRepository = {
  // 1. ADMIN: Get all Payroll Runs
  getAllRuns: async (): Promise<PayrollRun[]> => {
    const sql = `
      SELECT * FROM payroll_runs 
      ORDER BY run_date DESC
    `;
    const result = await pool.query(sql);
    return result.rows.map(mapRun);
  },

  // 2. USER: Get My Payslips
  getPayslipsByEmployee: async (employeeId: string): Promise<Payslip[]> => {
    const sql = `
      SELECT * FROM payslips 
      WHERE employee_id = $1 
      ORDER BY issue_date DESC
    `;
    const result = await pool.query(sql, [employeeId]);
    return result.rows.map(mapPayslip);
  },

  // 3. USER: Get My Salary History
  getSalaryHistory: async (employeeId: string): Promise<SalaryHistory[]> => {
    const sql = `
      SELECT * FROM salary_history 
      WHERE employee_id = $1 
      ORDER BY change_date DESC
    `;
    const result = await pool.query(sql, [employeeId]);
    return result.rows.map(mapHistory);
  },

  // 4. ADMIN: Get Salary Analytics Dashboard (THIS WAS MISSING)
  getAnalytics: async () => {
    // A. Summary Stats & Distribution (Group by Department)
    const distributionSql = `
      SELECT 
        d.name as department, 
        SUM(e.salary) as total_salary,
        COUNT(e.id) as employee_count
      FROM employees e
      JOIN departments d ON e.department_id = d.id
      WHERE e.status = 'active'
      GROUP BY d.name
    `;

    // B. Detailed List (Using full_name)
    const detailsSql = `
      SELECT 
        e.id, 
        e.full_name,
        d.name as department, 
        e.salary,
        (SELECT change_date FROM salary_history sh WHERE sh.employee_id = e.id ORDER BY change_date DESC LIMIT 1) as last_raise
      FROM employees e
      JOIN departments d ON e.department_id = d.id
      WHERE e.status = 'active'
      ORDER BY e.salary DESC
    `;

    // Execute queries in parallel
    const [distResult, detailsResult] = await Promise.all([
      pool.query(distributionSql),
      pool.query(detailsSql),
    ]);

    // Calculate Totals
    const totalPayroll = distResult.rows.reduce(
      (sum, row) => sum + parseFloat(row.total_salary),
      0
    );
    const totalEmployees = distResult.rows.reduce(
      (sum, row) => sum + parseInt(row.employee_count),
      0
    );
    const avgSalary = totalEmployees > 0 ? totalPayroll / totalEmployees : 0;

    // Format Distribution for Pie Chart
    const distribution: DepartmentSalaryStats[] = distResult.rows.map(
      (row, index) => ({
        department: row.department,
        totalSalary: parseFloat(row.total_salary),
        percentage:
          totalPayroll > 0
            ? (parseFloat(row.total_salary) / totalPayroll) * 100
            : 0,
        color: ["#0ea5e9", "#22c55e", "#eab308", "#f97316", "#a855f7"][
          index % 5
        ],
      })
    );

    // Format Details Table
    const details: EmployeeSalaryDetail[] = detailsResult.rows.map((row) => ({
      id: row.id,
      fullName: row.full_name,
      department: row.department,
      currentSalary: parseFloat(row.salary),
      lastRaiseDate: row.last_raise
        ? new Date(row.last_raise).toLocaleDateString()
        : "N/A",
      avatarUrl: undefined,
    }));

    return {
      summary: {
        totalAnnual: totalPayroll,
        averageSalary: avgSalary,
        yoyGrowth: 5.2, // Placeholder
      },
      distribution,
      details,
    };
  },
};

// --- Mappers ---

const mapRun = (row: any): PayrollRun => ({
  id: row.id,
  runDate: row.run_date,
  payPeriodStart: row.pay_period_start,
  payPeriodEnd: row.pay_period_end,
  totalDisbursed: parseFloat(row.total_disbursed),
  employeeCount: row.employee_count,
  status: row.status,
});

const mapPayslip = (row: any): Payslip => ({
  id: row.id,
  employeeId: row.employee_id,
  payrollRunId: row.payroll_run_id,
  monthYear: row.month_year,
  issueDate: row.issue_date,
  netSalary: parseFloat(row.net_salary),
  status: row.status,
  pdfUrl: row.pdf_url,
});

const mapHistory = (row: any): SalaryHistory => ({
  id: row.id,
  employeeId: row.employee_id,
  oldSalary: parseFloat(row.old_salary),
  newSalary: parseFloat(row.new_salary),
  changeDate: row.change_date,
  reason: row.reason,
});
