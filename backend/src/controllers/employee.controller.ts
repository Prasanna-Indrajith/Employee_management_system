// src/controllers/employee.controller.ts
import { Request, Response } from "express";
import { z } from "zod"; // Validation Library
import { EmployeeService } from "../services/employee.service";
import { TimesheetPDFService } from "../services/timesheet-pdf.service";
// import { auditService, AuditAction } from "../services/audit.service";

// 1. Define Validation Schema (Production Grade Input Safety)
const createEmployeeSchema = z.object({
  fullName: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number required"),
  departmentId: z.number().int().positive(),
  positionId: z.number().int().positive(),
  locationId: z.number().int().positive(),
  hireDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  salary: z.number().positive("Salary must be positive"),
  role: z.enum(["admin", "user"]),
  employmentType: z.enum(["Full-time", "Part-time", "Contract"]),
  bio: z.string().optional(),
  skills: z.array(z.string()),
  // skills: z.array(z.string()).min(1, "At least one skill is required"),
});

export class EmployeeController {
  private employeeService: EmployeeService;

  constructor() {
    this.employeeService = new EmployeeService();
  }

  // GET /api/employees
  getAll = async (req: Request, res: Response) => {
    try {
      const employees = await this.employeeService.getAllEmployees();
      res.status(200).json({
        success: true,
        data: employees,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // POST /api/employees
  create = async (req: Request, res: Response) => {
    try {
      // 1. Validate Input (Zod)
      const validatedData = createEmployeeSchema.parse(req.body);

      // 2. Call Service
      const newEmployee = await this.employeeService.createEmployee(
        validatedData
      );

      // 3. Return Success
      res.status(201).json({
        success: true,
        data: newEmployee,
      });
    } catch (error: any) {
      // Handle Zod Validation Errors
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errors: error.issues, // <--- CHANGE THIS from .errors to .issues
        });
      }

      // Handle Server Errors
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // GET /api/employees/:id
  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // 1. Call the Service
      const employee = await this.employeeService.getEmployeeById(id);

      // 2. Handle "Not Found"
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }

      // 3. Return Success
      res.status(200).json({
        success: true,
        data: employee,
      });
    } catch (error: any) {
      console.error("Get Employee Error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve employee",
      });
    }
  };

  // PUT /api/employees/:id
  update = async (req: Request, res: Response) => {
    console.log("Done : Controller : 1");
    // const { ipAddress, userAgent } = auditService.getUserFromRequest(req);
    const userId = (req as any).user?.id;

    try {
      const { id } = req.params;
      console.log(req.body);

      // Get old employee data for audit
      const oldEmployee = await this.employeeService.getEmployeeById(id);

      // 1. Validate Partial Input (allow updating just some fields)
      // We use .partial() to make all fields optional for updates
      const validatedData = createEmployeeSchema.partial().parse(req.body);

      // 2. Call Service (You need to ensure your service has this method too!)
      const updatedEmployee = await this.employeeService.updateEmployee(
        id,
        validatedData
      );

      console.log("Done : Controller : 3");

      if (!updatedEmployee) {
        return res
          .status(404)
          .json({ success: false, message: "Employee not found" });
      }

      // Log employee update
      // await auditService.logAudit({
      //   action: AuditAction.EMPLOYEE_UPDATED,
      //   resourceType: 'employee' as any,
      //   resourceId: id,
      //   oldValues: oldEmployee ? {
      //     fullName: oldEmployee.fullName,
      //     email: oldEmployee.email,
      //     salary: oldEmployee.salary,
      //     status: oldEmployee.status
      //   } : null,
      //   newValues: validatedData,
      //   ipAddress,
      //   userAgent,
      //   status: 'SUCCESS',
      //   message: `Employee updated: ${id}`
      // });

      // Special logging for salary changes
      // if (oldEmployee && validatedData.salary && oldEmployee.salary !== validatedData.salary) {
      //   await auditService.logSalaryChange(
      //     userId,
      //     id,
      //     oldEmployee.salary,
      //     validatedData.salary,
      //     `Salary updated by ${userId}`,
      //     ipAddress,
      //     userAgent
      //   );
      // }

      res.status(200).json({
        success: true,
        data: updatedEmployee,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errors: error.issues,
        });
      }

      // Log failed update
      // await auditService.logAudit({
      //   action: AuditAction.EMPLOYEE_UPDATED,
      //   resourceType: 'employee' as any,
      //   resourceId: req.params.id,
      //   newValues: req.body,
      //   ipAddress,
      //   userAgent,
      //   status: 'FAILED',
      //   message: `Employee update failed: ${error.message}`
      // });

      res.status(500).json({ success: false, message: error.message });
    }
    console.log("Done : Controller : 4");
  };

  // GET /api/employees/timesheets?date=2025-12-14
  getTimesheets = async (req: Request, res: Response) => {
    try {
      const { date } = req.query; // Get date from URL like ?date=2024-01-15
      const data = await this.employeeService.getTimesheets(date as string);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // GET /api/employees/me
  getMe = async (req: Request, res: Response) => {
    try {
      // Get the User ID from the token (middleware puts it here)
      const userId = (req as any).user?.id;

      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const employee = await this.employeeService.getProfile(userId);

      if (!employee) {
        return res
          .status(404)
          .json({ success: false, message: "Profile not found for this user" });
      }

      res.json({ success: true, data: employee });
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // PUT /api/employees/me
  updateMe = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const { phone, location, bio, skills } = req.body;

      // Basic Validation
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      console.log(req.body);
      console.log(userId, "1 - Done");
      const updatedEmployee = await this.employeeService.updateProfile(userId, {
        phone,
        bio,
        skills, // Expecting array e.g. ["React", "CSS"]
      });

      res.json({
        success: true,
        data: updatedEmployee,
        message: "Profile updated successfully",
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errors: error.issues,
        });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // DELETE /api/employees/:id
  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const success = await this.employeeService.deleteEmployee(id);

      if (!success) {
        return res
          .status(404)
          .json({ success: false, message: "Employee not found" });
      }

      res
        .status(200)
        .json({ success: true, message: "Employee deleted successfully" });
    } catch (error: any) {
      // Handle Foreign Key constraints (e.g. if employee has payroll records)
      if (error.code === "23503") {
        return res.status(409).json({
          success: false,
          message:
            "Cannot delete employee: They have associated payroll or user records.",
        });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // GET /api/employees/timesheets/pdf/:date
  downloadTimesheetPDF = async (req: Request, res: Response) => {
    try {
      const { date } = req.params;
      const { department, status } = req.query;

      const pdfService = new TimesheetPDFService();
      const pdfBuffer = await pdfService.generateAdminTimesheetPDF(
        date as string,
        {
          department: department as string,
          status: status as string,
        }
      );

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="timesheet_${date}.pdf"`
      );
      res.send(pdfBuffer);
    } catch (error: any) {
      console.error("Error generating timesheet PDF:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // GET /api/employees/my-attendance/pdf/:month
  downloadMyAttendancePDF = async (req: Request, res: Response) => {
    try {
      const { month } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      // Get employee ID from user ID
      const employee = await this.employeeService.getProfile(userId);
      if (!employee) {
        return res
          .status(404)
          .json({ success: false, message: "Employee not found" });
      }

      const pdfService = new TimesheetPDFService();
      const pdfBuffer = await pdfService.generateUserMonthlyPDF(
        employee.id,
        month
      );

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="attendance_${month}.pdf"`
      );
      res.send(pdfBuffer);
    } catch (error: any) {
      console.error("Error generating attendance PDF:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // GET /api/employees/me/attendance - Get current user's attendance
  getMyAttendance = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      // Get user's employee profile first to get employee ID
      const employee = await this.employeeService.getProfile(userId);
      if (!employee) {
        return res
          .status(404)
          .json({ success: false, message: "Employee profile not found" });
      }

      // Get attendance data for this employee
      const { date } = req.query;
      const attendanceData = await this.employeeService.getEmployeeAttendance(
        employee.id,
        date as string
      );

      res.status(200).json({ success: true, data: attendanceData });
    } catch (error: any) {
      console.error("Error fetching my attendance:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
}
