import { Request, Response } from "express";
import { payrollService } from "../services/payroll.service"; // <--- Only import Service

export const payrollController = {
  // GET /api/payroll/runs
  getRuns: async (req: Request, res: Response) => {
    try {
      const data = await payrollService.getAllRuns();
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // GET /api/payroll/payslips/me
  getMyPayslips: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const data = await payrollService.getMyPayslips(userId);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // GET /api/payroll/salary-history/me
  getMySalaryHistory: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const data = await payrollService.getMySalaryHistory(userId);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // GET /api/payroll/reports (The new one)
  getReports: async (req: Request, res: Response) => {
    try {
      // Correct: Call the Service, not the Repository
      const data = await payrollService.getReports();
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
