import { Request, Response } from "express";
import { attendanceService } from "../services/attendance.service";

// const attendanceService = new attendanceService();

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

  async downloadTimesheet(req: Request, res: Response): Promise<void> {
    try {
      const { date } = req.params;

      // Validate date format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        res.status(400).json({
          success: false,
          message: "Invalid date format. Use YYYY-MM-DD",
        });
        return;
      }

      // Check if trying to download today's report before 5 PM
      const today = new Date().toISOString().split("T")[0];
      const currentHour = new Date().getHours();

      if (date === today && currentHour < 17) {
        res.status(400).json({
          success: false,
          message: "Today's timesheet will be available after 5:00 PM",
        });
        return;
      }

      // Get or generate PDF
      const pdfPath = await attendanceService.getTimesheetPDF(date);

      // Send file
      res.download(pdfPath, `timesheet_${date}.pdf`, (err) => {
        if (err) {
          console.error("Error sending file:", err);
          if (!res.headersSent) {
            res.status(500).json({
              success: false,
              message: "Error downloading file",
            });
          }
        }
      });
    } catch (error) {
      console.error("Download timesheet error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate timesheet PDF",
      });
    }
  },
};
