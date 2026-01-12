import { pool } from "../config/db"; // Assuming this matches your leave.repository.ts import

export class DashboardRepository {
  // Fetch all admin stats in one go using Promise.all for performance
  static async getAdminStats() {
    const [totalRes, activeRes, newHiresRes, pendingRes] = await Promise.all([
      // 1. Total Employees
      pool.query("SELECT COUNT(*) as count FROM employees"),

      // 2. Active Users
      pool.query(
        "SELECT COUNT(*) as count FROM employees WHERE status = 'active'"
      ),

      // 3. New Hires (Current Month)
      pool.query(`
        SELECT COUNT(*) as count FROM employees 
        WHERE EXTRACT(MONTH FROM hire_date) = EXTRACT(MONTH FROM CURRENT_DATE) 
        AND EXTRACT(YEAR FROM hire_date) = EXTRACT(YEAR FROM CURRENT_DATE)
      `),

      // 4. Pending Requests (Using 'leaves' table as seen in your upload)
      pool.query(
        "SELECT COUNT(*) as count FROM time_off_requests WHERE status = 'Pending'"
      ),
    ]);

    // Postgres COUNT returns a string (BigInt), so we parse it to a number
    return {
      totalEmployees: parseInt(totalRes.rows[0].count, 10) || 0,
      activeUsers: parseInt(activeRes.rows[0].count, 10) || 0,
      newHires: parseInt(newHiresRes.rows[0].count, 10) || 0,
      pendingRequests: parseInt(pendingRes.rows[0].count, 10) || 0,
    };
  }
}
