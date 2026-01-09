import { Request, Response } from "express";
import { attendanceService } from "../services/attendance.service";

export const attendanceController = {
  // 1. GET /api/attendance/me
  getMyAttendance: async (req: Request, res: Response) => {
    try {
      // We assume your auth middleware attaches 'user' to the request
      const userId = (req as any).user?.id;

      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized: No User ID" });
      }

      const data = await attendanceService.getMyHistory(userId);

      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error("Error in getMyAttendance:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // 2. GET /api/attendance?date=2025-12-15 (Admin)
  getAllByDate: async (req: Request, res: Response) => {
    try {
      const { date } = req.query;
      const data = await attendanceService.getAllDailyLogs(date as string);

      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};
