import { attendanceRepository } from "../repositories/attendance.repository";
import { PDFService } from "./pdf.service";

// const attendanceRepository = new attendanceRepository();

export const attendanceService = {
  // Logic for "My Attendance"
  getMyHistory: async (userId: string) => {
    return await attendanceRepository.findByEmployeeId(userId);
  },

  // Logic for "Admin Daily View"
  getAllDailyLogs: async (date?: string) => {
    // Default to today if no date provided
    const targetDate = date || new Date().toISOString().split("T")[0];
    return await attendanceRepository.findAllByDate(targetDate);
  },

  async generateDailyTimesheetPDF(date: string): Promise<string> {
    try {
      // Get all timesheet data for the date
      const timesheets = await attendanceRepository.getTimesheetsByDate(date);

      // Generate PDF
      const pdfPath = await PDFService.generateTimesheetPDF(timesheets, date);

      return pdfPath;
    } catch (error) {
      console.error("Error generating timesheet PDF:", error);
      throw error;
    }
  },

  async getTimesheetPDF(date: string): Promise<string> {
    // Check if PDF already exists
    if (PDFService.pdfExists(date)) {
      return PDFService.getPDFPath(date);
    }

    // If not, generate it
    return await this.generateDailyTimesheetPDF(date);
  },
};
