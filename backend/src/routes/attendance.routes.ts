import express from "express";
import { attendanceController } from "../controllers/attendance.controller";
// IMPORT YOUR AUTH MIDDLEWARE HERE
import { authenticateToken } from "../middlewares/auth.middleware";

const router = express.Router();

// 1. User Route: Get MY data
// URL: http://localhost:8080/api/attendance/me
router.get("/me", authenticateToken, attendanceController.getMyAttendance);

// 2. Admin Route: Get ALL data by date
// URL: http://localhost:8080/api/attendance?date=2025-12-15
// Note: You should probably add an 'isAdmin' middleware check here too
router.get("/", authenticateToken, attendanceController.getAllByDate);

// Download timesheet PDF
router.get(
  "/timesheets/download/:date",
  authenticateToken,
  attendanceController.downloadTimesheet.bind(attendanceController)
);

export default router;
