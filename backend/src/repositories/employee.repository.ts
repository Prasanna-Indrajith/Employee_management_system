import { query, pool } from "../config/db";
import { Employee, CreateEmployeeDTO } from "../types";
import bcrypt from "bcryptjs";

export class EmployeeRepository {
  // --- HELPER: Generate Custom ID (EMP001...) ---
  private async generateEmployeeId(client: any): Promise<string> {
    const sql = `
      SELECT employee_id 
      FROM employees 
      WHERE employee_id LIKE 'EMP%' 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    // Use the transaction client
    const result = await client.query(sql);

    if (result.rows.length === 0) return "EMP001";

    const lastId = result.rows[0].employee_id;
    const numberPart = parseInt(lastId.replace("EMP", ""), 10);
    return `EMP${(numberPart + 1).toString().padStart(3, "0")}`;
  }

  // --- FETCH ALL ---
  async findAll(): Promise<Employee[]> {
    const sql = `
      SELECT 
        e.id, 
        e.employee_id as "employeeId",
        e.full_name as "fullName", 
        e.email, 
        e.phone,
        d.name as department, 
        p.title as position, 
        l.name as location,
        e.hire_date as "hireDate",
        e.role,
        e.status,
        e.salary,
        e.skills,
        e.employment_type as "employmentType"
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN positions p ON e.position_id = p.id
      LEFT JOIN locations l ON e.location_id = l.id
      ORDER BY e.created_at DESC;
    `;
    const result = await query(sql);
    return result.rows;
  }

  // --- FIND BY ID ---
  async findById(id: string): Promise<Employee | null> {
    const sql = `
      SELECT 
        e.id, 
        e.employee_id as "employeeId",
        e.full_name as "fullName", 
        e.email, 
        e.phone,
        d.name as department, 
        p.title as position, 
        l.name as location,
        e.hire_date as "hireDate",
        e.role,
        e.status,
        e.bio,
        e.salary,
        e.skills,
        e.employment_type as "employmentType"
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN positions p ON e.position_id = p.id
      LEFT JOIN locations l ON e.location_id = l.id
      WHERE e.id = $1;
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  // --- CREATE NEW EMPLOYEE ---
  async create(data: CreateEmployeeDTO): Promise<Employee> {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1. Hash the Default Password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("123", salt);

      // 2. Insert into USERS table first
      const userSql = `
        INSERT INTO users (email, password_hash, full_name, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
      `;
      const userResult = await client.query(userSql, [
        data.email,
        hashedPassword,
        data.fullName,
        data.role,
      ]);
      const newUserId = userResult.rows[0].id;

      // 3. Generate Custom Employee ID
      const newEmployeeId = await this.generateEmployeeId(client);

      // 4. Insert into EMPLOYEES table
      const empSql = `
        INSERT INTO employees (
          id,             
          employee_id,
          full_name, 
          email, 
          phone, 
          department_id, 
          position_id, 
          location_id, 
          hire_date, 
          salary, 
          role, 
          employment_type, 
          bio, 
          skills,
          status
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'active') 
        RETURNING id;
      `;

      const empParams = [
        newUserId, // Link to User ID
        newEmployeeId,
        data.fullName,
        data.email,
        data.phone,
        data.departmentId,
        data.positionId,
        data.locationId,
        data.hireDate,
        data.salary,
        data.role,
        data.employmentType,
        data.bio,
        data.skills,
      ];

      await client.query(empSql, empParams);

      await client.query("COMMIT");

      // 5. Return the full object
      const fullEmployee = await this.findById(newUserId);
      if (!fullEmployee) throw new Error("Failed to retrieve created employee");

      return fullEmployee;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  // --- UPDATE EMPLOYEE ---
  async update(
    id: string,
    data: Partial<CreateEmployeeDTO>
  ): Promise<Employee | null> {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1. UPDATE EMPLOYEES TABLE
      const fieldMap: Record<string, string> = {
        fullName: "full_name",
        email: "email",
        phone: "phone",
        departmentId: "department_id",
        positionId: "position_id",
        locationId: "location_id",
        salary: "salary",
        role: "role",
        employmentType: "employment_type",
        status: "status",
        bio: "bio",
        skills: "skills",
      };

      const empUpdateParts: string[] = [];
      const empValues: any[] = [];
      let empCounter = 1;

      Object.keys(data).forEach((key) => {
        const dbColumn = fieldMap[key];
        const value = (data as any)[key];

        if (dbColumn && value !== undefined) {
          empUpdateParts.push(`${dbColumn} = $${empCounter++}`);
          empValues.push(value);
        }
      });

      if (empUpdateParts.length > 0) {
        empValues.push(id);
        const empSql = `
            UPDATE employees 
            SET ${empUpdateParts.join(", ")} 
            WHERE id = $${empCounter}
        `;
        await client.query(empSql, empValues);
      }

      // 2. SYNC USERS TABLE (Keep Login Details Updated)
      if (data.email || data.fullName) {
        const userUpdateParts: string[] = [];
        const userValues: any[] = [];
        let userCounter = 1;

        if (data.email) {
          userUpdateParts.push(`email = $${userCounter++}`);
          userValues.push(data.email);
        }

        if (data.fullName) {
          userUpdateParts.push(`full_name = $${userCounter++}`);
          userValues.push(data.fullName);
        }

        if (userUpdateParts.length > 0) {
          userValues.push(id);

          // Corrected: Updating users where 'id' matches (since it's a 1:1 match with employees.id)
          const userSql = `
            UPDATE users 
            SET ${userUpdateParts.join(", ")} 
            WHERE id = $${userCounter} 
          `;

          await client.query(userSql, userValues);
        }
      }

      await client.query("COMMIT");

      return this.findById(id);
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Update Transaction Failed:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  // --- GET TIMESHEETS (Admin View) ---
  async findTimesheets(date?: string): Promise<any[]> {
    const queryParams: any[] = [];
    let whereClause = "";

    if (date) {
      whereClause = "WHERE DATE(t.date) = $1";
      queryParams.push(date);
    }

    const sql = `
      SELECT 
        t.id,
        t.date,
        to_char(t.clock_in, 'HH24:MI') as "clockIn",
        to_char(t.clock_out, 'HH24:MI') as "clockOut",
        t.status,
        e.full_name as "employeeName",
        e.employee_id as "employeeId",
        d.name as "department"
      FROM timesheets t
      JOIN employees e ON t.employee_id = e.id
      LEFT JOIN departments d ON e.department_id = d.id
      ${whereClause}
      ORDER BY t.clock_in DESC;
    `;

    const result = await query(sql, queryParams);
    return result.rows;
  }

  // --- FIND PROFILE BY USER ID ---
  async findProfileByUserId(userId: string): Promise<Employee | null> {
    const sql = `
      SELECT
        e.id,
        e.employee_id as "employeeId",
        e.full_name as "fullName",
        e.email,
        e.phone,
        d.name as department,
        p.title as position,
        l.name as location,
        e.hire_date as "hireDate",
        e.role,
        e.status,
        e.salary,
        e.skills,
        e.employment_type as "employmentType",
        e.bio
      FROM employees e
      -- Removed unnecessary JOIN to users if we already have the ID
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN positions p ON e.position_id = p.id
      LEFT JOIN locations l ON e.location_id = l.id
      WHERE e.id = $1 
      `;

    // Note: We query employees directly using userId because they share the same Primary Key (id)
    const result = await pool.query(sql, [userId]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    return {
      id: row.id, // Correct: Use UUID
      employeeId: row.employeeId, // Correct: Use Custom ID (EMP001)
      fullName: row.fullName,
      email: row.email,
      phone: row.phone,
      role: row.role || "user",
      location: row.location || "N/A",
      department: row.department || "General",
      position: row.position || "Staff",
      hireDate: row.hireDate,
      status: row.status,
      salary: parseFloat(row.salary),
      employmentType: row.employmentType,
      bio: row.bio,
      skills: row.skills || [],
    };
  }

  // --- UPDATE PROFILE (Restricted Fields Only) ---
  async updateProfile(
    userId: string,
    data: { phone: string; bio: string; skills: string[] }
  ) {
    try {
      const sql = `
        UPDATE employees
        SET 
          phone = $1,
          bio = $2,
          skills = $3
        WHERE id = $4
        RETURNING *;
      `;

      const values = [data.phone, data.bio, data.skills, userId];

      const result = await pool.query(sql, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  // --- DELETE EMPLOYEE ---
  async delete(id: string): Promise<boolean> {
    const sql = `DELETE FROM employees WHERE id = $1 RETURNING id`;
    const result = await pool.query(sql, [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  // --- GET USER MONTHLY ATTENDANCE ---
  async getUserMonthlyAttendance(
    employeeId: string,
    month: string
  ): Promise<any[]> {
    const sql = `
    SELECT 
      t.date,
      to_char(t.clock_in, 'HH24:MI') as "clockIn",
      to_char(t.clock_out, 'HH24:MI') as "clockOut",
      t.status,
      COALESCE(l.name, 'Office') as "location"
    FROM timesheets t
    LEFT JOIN employees e ON t.employee_id = e.id
    LEFT JOIN locations l ON e.location_id = l.id 
    WHERE t.employee_id = $1 
      AND TO_CHAR(t.date, 'YYYY-MM') = $2
    ORDER BY t.date ASC;
  `;

    const result = await query(sql, [employeeId, month]);
    return result.rows;
  }

  // --- GET TIMESHEETS (Public method) ---
  async getTimesheets(date?: string): Promise<any[]> {
    return this.findTimesheets(date);
  }

  // --- GET EMPLOYEE ATTENDANCE (for current user) ---
  async findEmployeeAttendance(
    employeeId: string,
    date?: string
  ): Promise<any[]> {
    const queryParams: any[] = [employeeId];
    let whereClause = "WHERE t.employee_id = $1";

    if (date) {
      whereClause += " AND DATE(t.date) = $2";
      queryParams.push(date);
    } else {
      whereClause +=
        " AND TO_CHAR(t.date, 'YYYY-MM') = TO_CHAR(CURRENT_DATE, 'YYYY-MM')";
    }

    const sql = `
    SELECT 
      t.id,
      t.date,
      to_char(t.clock_in, 'HH24:MI') as "clockIn",
      to_char(t.clock_out, 'HH24:MI') as "clockOut",
      t.status,
      COALESCE(l.name, 'Office') as "location"
    FROM timesheets t
    LEFT JOIN employees e ON t.employee_id = e.id
    LEFT JOIN locations l ON e.location_id = l.id
    ${whereClause}
    ORDER BY t.date DESC;
  `;

    const result = await query(sql, queryParams);
    return result.rows;
  }
}
