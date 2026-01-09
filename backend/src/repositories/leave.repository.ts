import { pool } from "../config/db";
import { LeaveRecord } from "../types";

export const leaveRepository = {
  // 1. Create a new Leave Request
  create: async (
    leaveData: Omit<LeaveRecord, "id" | "requestedOn" | "status">
  ) => {
    const sql = `
      INSERT INTO time_off_requests 
      (employee_id, leave_type, reason, duration, dates, requested_on, status)
      VALUES ($1, $2, $3, $4, $5, NOW(), 'Pending')
      RETURNING *
    `;

    const values = [
      leaveData.employeeId,
      leaveData.leaveType,
      leaveData.reason,
      leaveData.duration,
      leaveData.dates, // Pass the array directly for Postgres
    ];

    const result = await pool.query(sql, values);
    return mapRowToLeave(result.rows[0]);
  },

  // 2. Get My Leaves
  findByEmployeeId: async (employeeId: string): Promise<LeaveRecord[]> => {
    const sql = `
      SELECT * FROM time_off_requests 
      WHERE employee_id = $1 
      ORDER BY requested_on DESC
    `;
    const result = await pool.query(sql, [employeeId]);
    return result.rows.map(mapRowToLeave);
  },

  // 3. ADMIN: Get ALL Requests (with Employee Info AND Department Name)
  findAll: async () => {
    const sql = `
      SELECT 
        r.*, 
        e.full_name,
        d.name as department_name,  -- Get the name from the departments table
        d.code as department_code   -- Optional: Get the code (e.g., 'ENG')
      FROM time_off_requests r
      JOIN employees e ON r.employee_id = e.id
      LEFT JOIN departments d ON e.department_id = d.id  -- Second Join
      ORDER BY 
        CASE WHEN r.status = 'Pending' THEN 1 ELSE 2 END,
        r.requested_on DESC
    `;

    const result = await pool.query(sql);

    return result.rows.map((row) => ({
      ...mapRowToLeave(row),
      employeeName: row.full_name,
      // Use the alias we created in the SQL query
      department: row.department_name || "N/A",
      employeeId: row.employee_id,
    }));
  },

  // 4. ADMIN: Update Status
  updateStatus: async (id: string, status: string) => {
    const sql = `
      UPDATE time_off_requests 
      SET status = $1 
      WHERE id = $2 
      RETURNING *
    `;
    const result = await pool.query(sql, [status, id]);
    return result.rows[0] ? mapRowToLeave(result.rows[0]) : null;
  },
};

// Helper: Map DB snake_case to CamelCase
const mapRowToLeave = (row: any): LeaveRecord => ({
  id: row.id,
  employeeId: row.employee_id,
  leaveType: row.leave_type,
  reason: row.reason,
  duration: row.duration,
  dates: row.dates, // Postgres returns this as an array of Dates or Strings
  requestedOn: row.requested_on,
  status: row.status,
});
