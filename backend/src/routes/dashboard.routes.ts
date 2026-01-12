import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { authenticateToken } from "../middlewares/auth.middleware"; // Adjust import path to match your project

const router = Router();

// GET /api/dashboard/stats
// Protected route: Only Admins should access this
router.get("/stats", authenticateToken, DashboardController.getStats);

export default router;
