import { Request, Response } from "express";
import { DashboardService } from "../services/dashboard.service";

export class DashboardController {
  static async getStats(req: Request, res: Response) {
    try {
      const stats = await DashboardService.getStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      console.error("Dashboard Stats Error:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to fetch dashboard statistics",
        error: error.message,
      });
    }
  }
}
