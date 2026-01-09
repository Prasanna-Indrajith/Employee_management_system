import { query, pool } from "../config/db"; // Ensure you export 'pool' from db config
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
    // Use the transaction client, not the global query
    const result = await client.query(sql);

    if (result.rows.length === 0) return "EMP001";

    const lastId = result.rows[0].employee_id;
    const numberPart = parseInt(lastId.replace("EMP", ""), 10);
    return `EMP${(numberPart + 1).toString().padStart(3, "0")}`;
  }

  // --- FETCH ALL ---
  async findAll(): Promise<Employee[]> {
    // ... (Your existing findAll code is fine) ...
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
    // ... (Your existing findById code is fine) ...
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

  // --- CREATE NEW EMPLOYEE (The Big Change) ---
  async create(data: CreateEmployeeDTO): Promise<Employee> {
    const client = await pool.connect(); // Get a dedicated client for transaction

    try {
      await client.query("BEGIN"); // Start Transaction

      // 1. Hash the Default Password ("123")
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
      const newUserId = userResult.rows[0].id; // We get the UUID here

      // 3. Generate Custom Employee ID (EMP001)
      const newEmployeeId = await this.generateEmployeeId(client);

      // 4. Insert into EMPLOYEES table (Linking to User via ID)
      const empSql = `
        INSERT INTO employees (
          id,             -- Explicitly use the User ID (One-to-One link)
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
        newUserId, // $1 (Same as users.id)
        newEmployeeId, // $2
        data.fullName, // $3
        data.email, // $4
        data.phone, // $5
        data.departmentId, // $6
        data.positionId, // $7
        data.locationId, // $8
        data.hireDate, // $9
        data.salary, // $10
        data.role, // $11
        data.employmentType, // $12
        data.bio, // $13
        data.skills, // $14
      ];

      await client.query(empSql, empParams);

      await client.query("COMMIT"); // Save everything

      // 5. Return the full object
      const fullEmployee = await this.findById(newUserId);
      if (!fullEmployee) throw new Error("Failed to retrieve created employee");

      return fullEmployee;
    } catch (error) {
      await client.query("ROLLBACK"); // If anything fails, undo everything
      throw error;
    } finally {
      client.release(); // Release connection back to pool
    }
  }

  // --- UPDATE EMPLOYEE ---
  async update(
    id: string,
    data: Partial<CreateEmployeeDTO>
  ): Promise<Employee | null> {
    const client = await pool.connect();

    console.log("Done : repository : 20");

    try {
      await client.query("BEGIN");

      // =========================================================
      // 1. UPDATE EMPLOYEES TABLE (Dynamic Logic)
      // =========================================================

      // Map DTO (camelCase) to Database Columns (snake_case)
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

        // Ensure we only update valid mapped columns that have a value
        if (dbColumn && value !== undefined) {
          empUpdateParts.push(`${dbColumn} = $${empCounter++}`);
          empValues.push(value);
        }
      });

      if (empUpdateParts.length > 0) {
        console.log(empUpdateParts);
        empValues.push(id); // Add ID as the final parameter
        const empSql = `
            UPDATE employees 
            SET ${empUpdateParts.join(", ")} 
            WHERE id = $${empCounter}
        `;
        await client.query(empSql, empValues);
      }

      // =========================================================
      // 2. SYNC USERS TABLE (Keep Login Details Updated)
      // =========================================================

      // If the employee changes their Name or Email, we must update the 'users' table
      // so they can still login (if you use email for login) and see their new name.
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
          userValues.push(id); // Use Employee ID to find the User

          // NOTE: We update 'users' WHERE 'employee_id' matches
          const userSql = `
              UPDATE users 
              SET ${userUpdateParts.join(", ")} 
              WHERE employee_id = $${userCounter}
          `;
          await client.query(userSql, userValues);
        }
      }

      await client.query("COMMIT");

      // 3. Return the fresh, updated object
      return this.findById(id);
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Update Transaction Failed:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  // --- GET TIMESHEETS (With Employee Details) ---
  async findTimesheets(date?: string): Promise<any[]> {
    // If date is provided, filter by it. Otherwise get recent ones.
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
        to_char(t.clock_in, 'HH24:MI') as "clockIn",   -- Format as 09:00
        to_char(t.clock_out, 'HH24:MI') as "clockOut", -- Format as 17:30
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

  // Find the employee profile linked to the logged-in User ID
  async findProfileByUserId(userId: string): Promise<Employee | null> {
    const sql = `
      SELECT
        e.id,
        e.employee_id as "employeeId", -- Ensure your column names match your DB
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
      JOIN users u ON u.id = e.id
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN positions p ON e.position_id = p.id
      LEFT JOIN locations l ON e.location_id = l.id
      WHERE u.id = $1
      `;

    // const sql = `
    //   SELECT e.*
    //   FROM employees e
    //   JOIN users u ON u.employee_id = e.id
    //   WHERE id = $1;
    // `;

    const result = await pool.query(sql, [userId]);

    // 2. [CRITICAL FIX] Check if a row was actually found!
    if (result.rows.length === 0) {
      console.warn(`No employee profile found for User ID: ${userId}`);
      return null; // Return null safely instead of crashing
    }

    // Map the raw DB result to your Employee type
    const row = result.rows[0];

    return {
      id: row.employeeId,
      fullName: row.fullName, // Map snake_case to camelCase
      email: row.email,
      phone: row.phone,
      role: "user",
      location: row.location || "N/A",
      department: row.department || "General",
      position: row.position || "Staff",
      hireDate: row.hireDate,
      status: row.status,
      salary: parseFloat(row.salary),
      employmentType: row.employmentType,
      bio: row.bio,
      skills: row.skills || [], // Assuming skills is a string array column
    };
  }

  // --- UPDATE PROFILE (Restricted Fields Only) ---
  async updateProfile(
    userId: string,
    data: { phone: string; bio: string; skills: string[] }
  ) {
    try {
      // 1. Ensure the SQL has access to the 'users' table (u)
      // 2. Ensure every $n matches the index in the array below
      const sql = `
      UPDATE employees e
      SET 
        phone = $1,
        bio = $2,
        skills = $3
      FROM users u
      WHERE u.employee_id = e.id AND u.id = $4
      RETURNING e.*;
      `;
      // location = $2,

      const values = [
        data.phone, // $1
        // data.location, // $2
        data.bio, // $3
        data.skills, // $4
        userId, // $5
      ];

      const result = await pool.query(sql, values);

      return result.rows[0];
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error; // Rethrow so the caller knows it failed
    }
  }

  // --- DELETE EMPLOYEE ---
  async delete(id: string): Promise<boolean> {
    const sql = `DELETE FROM employees WHERE id = $1 RETURNING id`;
    const result = await pool.query(sql, [id]);

    // Returns true if a row was actually deleted
    return result.rowCount !== null && result.rowCount > 0;
  }
}
