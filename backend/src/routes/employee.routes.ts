import { Router } from "express";
import { EmployeeController } from "../controllers/employee.controller";
import { authenticateToken, isAdmin } from "../middlewares/auth.middleware";

const router = Router();
const employeeController = new EmployeeController();

// --- 1. SPECIFIC ROUTES (Must come before /:id) ---

// Current User Routes
router.get("/me", authenticateToken, employeeController.getMe);
router.put("/me", authenticateToken, employeeController.updateMe);
router.get(
  "/me/attendance",
  authenticateToken,
  employeeController.getMyAttendance
);

// Timesheet & PDF Routes
router.get("/timesheets", authenticateToken, employeeController.getTimesheets);
router.get(
  "/timesheets/pdf/:date",
  authenticateToken,
  isAdmin,
  employeeController.downloadTimesheetPDF
);
router.get(
  "/my-attendance/pdf/:month",
  authenticateToken,
  employeeController.downloadMyAttendancePDF
);

// Attendance Redirect
router.get("/attendance/today", authenticateToken, (req, res) => {
  res.redirect(
    "/api/employees/timesheets?date=" + new Date().toISOString().split("T")[0]
  );
});

// --- 2. GENERAL COLLECTION ROUTES ---

// Get All Employees
router.get(
  "/",
  authenticateToken,
  employeeController.getAll.bind(employeeController)
);

// Create Employee (Admin only)
router.post(
  "/",
  authenticateToken,
  isAdmin,
  employeeController.create.bind(employeeController)
);

// --- 3. DYNAMIC ID ROUTES (Must be last) ---

// Get Individual Employee (This was capturing "timesheets" before)
router.get(
  "/:id",
  authenticateToken,
  employeeController.getById.bind(employeeController)
);

// Update Employee
router.put(
  "/:id",
  authenticateToken,
  isAdmin,
  employeeController.update.bind(employeeController)
);

// Delete Employee
router.delete(
  "/:id",
  authenticateToken,
  isAdmin,
  employeeController.delete.bind(employeeController)
);

export default router;
