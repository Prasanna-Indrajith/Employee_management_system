import { pool } from "../config/db";
import { AttendanceRecord } from "../types";

export const attendanceRepository = {
  // 1. For USER: Get their personal history
  findByEmployeeId: async (employeeId: string): Promise<AttendanceRecord[]> => {
    // Postgres uses $1, $2 for parameters
    const sql = `
      SELECT * FROM timesheets 
      WHERE employee_id = $1 
      ORDER BY date DESC
    `;

    const result = await pool.query(sql, [employeeId]);

    // Postgres returns rows in result.rows
    return result.rows.map(mapRowToAttendance);
  },

  // 2. For ADMIN: Get EVERYONE's timesheets for a specific date
  findAllByDate: async (dateStr: string): Promise<AttendanceRecord[]> => {
    // Join with employees table
    const sql = `
      SELECT 
        a.*, 
        e.first_name as emp_first_name, 
        e.last_name as emp_last_name, 
        e.department as emp_dept
      FROM timesheets a
      JOIN employees e ON a.employee_id = e.id
      WHERE a.date = $1
      ORDER BY a.clock_in ASC
    `;

    const result = await pool.query(sql, [dateStr]);

    return result.rows.map((row) => ({
      ...mapRowToAttendance(row),
      // Add the nested employee object for the Admin view
      employee: {
        firstName: row.emp_first_name,
        lastName: row.emp_last_name,
        department: row.emp_dept,
      },
    }));
  },
};

// --- Helper to map DB columns (snake_case) to TS Object (camelCase) ---
const mapRowToAttendance = (row: any): AttendanceRecord => {
  return {
    id: row.id,
    employeeId: row.employee_id,
    date: row.date,
    clockIn: row.clock_in,
    clockOut: row.clock_out, // Postgres returns null correctly
    status: row.status,
  };
};
