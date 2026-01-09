import { query } from "../config/db";
import { User } from "../types";

export class UserRepository {
  // Helper: Converts DB "snake_case" -> App "camelCase"
  private mapRowToUser(row: any): User {
    return {
      id: row.id,
      email: row.email,
      password_hash: row.password_hash, // We keep this internal for Auth check
      fullName: row.full_name, // <--- THE FIX
      role: row.role,
      employeeId: row.employee_id, // <--- THE FIX
      created_at: row.created_at,
    };
  }

  // Find a user by their Email (for Login)
  async findByEmail(email: string): Promise<User | null> {
    const sql = `SELECT * FROM users WHERE email = $1`;
    const result = await query(sql, [email]);

    if (result.rows.length > 0) {
      return this.mapRowToUser(result.rows[0]);
    }
    return null;
  }

  // Create a new User (Registration)
  async create(
    email: string,
    passwordHash: string,
    fullName: string,
    role: string,
    employeeId?: string
  ): Promise<User> {
    const sql = `
      INSERT INTO users (email, password_hash, full_name, role, employee_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const result = await query(sql, [
      email,
      passwordHash,
      fullName,
      role,
      employeeId,
    ]);
    return this.mapRowToUser(result.rows[0]);
  }
}
