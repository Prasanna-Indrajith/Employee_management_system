import express from "express";
import { payrollController } from "../controllers/payroll.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = express.Router();

// Admin Routes
router.get("/runs", authenticateToken, payrollController.getRuns);

// User Routes
router.get("/payslips/me", authenticateToken, payrollController.getMyPayslips);
router.get("/payslips/:id/pdf", authenticateToken, payrollController.downloadPayslip);
router.get(
  "/salary-history/me",
  authenticateToken,
  payrollController.getMySalaryHistory
);
router.get("/reports", authenticateToken, payrollController.getReports);

export default router;
