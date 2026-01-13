import { Request, Response } from "express";
import { payrollService } from "../services/payroll.service"; 
import { payslipPdfService } from "../services/payslip-pdf.service";
import { EmployeeService } from "../services/employee.service";

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

  // GET /api/payroll/payslips/:id/pdf
  downloadPayslip: async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const { id } = req.params; // Payslip ID

    try {
      // 1. Get Payslip (Ensure it belongs to the user)
      // Note: We need to get the employee ID associated with the user first.
      // But getPayslipsByEmployee uses 'employeeId' which is actually the user's ID in the repo logic?
      // Let's check the repo logic... 
      // getPayslipsByEmployee: async (employeeId: string) ... WHERE p.employee_id = $1
      // In getMyPayslips controller: const userId = (req as any).user?.id; ... getMyPayslips(userId);
      // So 'employeeId' in repo IS the 'userId' passed from controller? 
      // Let's verify 'p.employee_id'. If the user is an employee, their user.id might NOT be the employee.id.
      // Usually user.id != employee.id unless they are the same table or linked.
      
      // Checking auth.service.ts or login... 
      // The token contains { id: user.id, role... }.
      // Checking EmployeeService... 
      // Often there is a mapping. 
      // If the system uses the same ID for User and Employee (unlikely) or if we need to look it up.
      
      // Looking at `payrollRepository.getPayslipsByEmployee`, it expects `employeeId`.
      // But `payrollController.getMyPayslips` passes `userId`.
      // This implies `userId` == `employeeId` OR the variable naming is loose.
      // Let's assume for now we need the *real* employee ID.
      
      const employeeService = new EmployeeService();
      // We need a method to get employee by user ID or assume the token has it?
      // The token payload has `employeeId`? 
      // Let's check `backend/src/services/auth.service.ts` login method again.
      // const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, ...);
      // It does NOT have employeeId in the token.
      
      // So we need to fetch the employee profile using the user ID.
      const employee = await employeeService.getProfile(userId);
      if (!employee) {
        return res.status(404).json({ success: false, message: "Employee profile not found" });
      }

      const payslip = await payrollService.getPayslipById(id, employee.id);

      if (!payslip) {
        return res.status(404).json({ success: false, message: "Payslip not found" });
      }

      // 2. Generate PDF
      const pdfBuffer = await payslipPdfService.generate(payslip, employee.fullName);

      // 3. Send Response
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=Payslip_${payslip.monthYear.replace(/ /g, '_')}.pdf`);
      res.send(pdfBuffer);

    } catch (error: any) {
      console.error("PDF Download Error:", error);
      res.status(500).json({ success: false, message: "Failed to generate PDF" });
    }
  },

  // GET /api/payroll/payslips/me
  getMyPayslips: async (req: Request, res: Response) => {
    // const { ipAddress, userAgent } = auditService.getUserFromRequest(req);
    const userId = (req as any).user?.id;

    try {
      const data = await payrollService.getMyPayslips(userId);

      // Log payslip access
      // await auditService.logDataAccess(
      //   userId,
      //   'payslip' as any,
      //   undefined,
      //   AuditAction.PAYSLIP_DOWNLOADED,
      //   ipAddress,
      //   userAgent
      // );

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
    // const { ipAddress, userAgent } = auditService.getUserFromRequest(req);
    const userId = (req as any).user?.id;

    try {
      // Correct: Call the Service, not the Repository
      const data = await payrollService.getReports();

      // Log report access
      // await auditService.logUserAction(
      //   userId,
      //   AuditAction.REPORT_DOWNLOADED,
      //   'report',
      //   undefined,
      //   undefined,
      //   ipAddress,
      //   userAgent
      // );

      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
