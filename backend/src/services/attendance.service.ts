import { attendanceRepository } from "../repositories/attendance.repository";

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
};
