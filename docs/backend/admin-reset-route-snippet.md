import { Router, Request, Response } from "express";
import { pool } from "../config/db";
import bcrypt from "bcryptjs"; // or 'bcrypt' depending on what you installed

const router = Router();

// Route: GET /api/admin-reset
router.get("/", async (req: Request, res: Response) => {
  try {
    const email = "admin@orian.com";
    const newPassword = "password123";

    // 1. Hash the password using the ACTUAL library your app uses
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    // 2. Force Update the User
    // We update the hash AND ensure the role/email are correct
    const updateSql = `
      UPDATE users
      SET password_hash = $1, role = 'admin'
      WHERE email = $2
      RETURNING *;
    `;

    const result = await pool.query(updateSql, [hash, email]);

    if (result.rowCount === 0) {
      // If user doesn't exist, CREATE them
      const insertSql = `
        INSERT INTO users (email, password_hash, full_name, role)
        VALUES ($1, $2, 'Super Admin', 'admin')
        RETURNING *;
      `;
      await pool.query(insertSql, [email, hash]);
      return res.send(
        `<h1>Admin Created!</h1><p>Email: ${email}<br>Password: ${newPassword}</p>`
      );
    }

    res.send(
      `<h1>Admin Password Reset!</h1><p>Email: ${email}<br>Password: ${newPassword}</p><p>New Hash: ${hash}</p>`
    );
  } catch (error: any) {
    console.error(error);
    res.status(500).send(`Error: ${error.message}`);
  }
});

export default router;
