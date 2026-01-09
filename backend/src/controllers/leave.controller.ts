import { Request, Response } from "express";
import { leaveService } from "../services/leave.service";

export const leaveController = {
  // POST /api/leaves/request
  requestLeave: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const { leaveType, reason, startDate, endDate } = req.body;

      if (!leaveType || !startDate || !endDate) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
      }

      const result = await leaveService.requestLeave(userId, {
        leaveType,
        reason,
        startDate,
        endDate,
      });

      return res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // GET /api/leaves/me
  getMyLeaves: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const data = await leaveService.getMyHistory(userId);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // GET /api/leaves/admin/all
  getAllRequests: async (req: Request, res: Response) => {
    try {
      const data = await leaveService.getAllRequests();
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // PATCH /api/leaves/admin/:id/status
  updateStatus: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body; // Expect { "status": "Approved" }

      if (!["Approved", "Rejected"].includes(status)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid status" });
      }

      const updated = await leaveService.reviewRequest(id, status);
      return res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};
