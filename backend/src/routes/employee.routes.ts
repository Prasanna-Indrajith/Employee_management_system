import { Router } from "express";
import { EmployeeController } from "../controllers/employee.controller";
import { authenticateToken, isAdmin } from "../middlewares/auth.middleware"; // <--- Import

const router = Router();
const employeeController = new EmployeeController();

router.get("/me", authenticateToken, employeeController.getMe);
router.put("/me", authenticateToken, employeeController.updateMe);

// 1. Protect GET (Only logged in users can see employees)
router.get(
  "/",
  authenticateToken,
  employeeController.getAll.bind(employeeController)
);

// Timesheet data capture
router.get("/timesheets", employeeController.getTimesheets);

// Search by id
router.get("/:id", authenticateToken, employeeController.getById);

// Update Employee profile data
router.put("/:id", employeeController.update);

// Delete Employee
router.delete("/:id", authenticateToken, isAdmin, employeeController.delete);

// 2. Protect POST (Only ADMINS can create employees)
router.post(
  "/",
  authenticateToken,
  isAdmin,
  employeeController.create.bind(employeeController)
);

export default router;
