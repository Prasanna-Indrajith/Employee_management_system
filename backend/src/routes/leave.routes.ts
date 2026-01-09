import express from "express";
import { leaveController } from "../controllers/leave.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/request", authenticateToken, leaveController.requestLeave);
router.get("/me", authenticateToken, leaveController.getMyLeaves);

// Admin Routes (Make sure these are protected!)
router.get("/admin/all", authenticateToken, leaveController.getAllRequests);
router.patch(
  "/admin/:id/status",
  authenticateToken,
  leaveController.updateStatus
);

export default router;
