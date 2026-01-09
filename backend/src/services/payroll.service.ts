import { payrollRepository } from "../repositories/payroll.repository";

export const payrollService = {
  // Admin Logic
  getAllRuns: async () => {
    return await payrollRepository.getAllRuns();
  },

  // User Logic
  getMyPayslips: async (userId: string) => {
    return await payrollRepository.getPayslipsByEmployee(userId);
  },

  getMySalaryHistory: async (userId: string) => {
    return await payrollRepository.getSalaryHistory(userId);
  },

  // Analytics Logic (The one you were missing)
  getReports: async () => {
    // Just call the repository, no req/res here!
    return await payrollRepository.getAnalytics();
  },
};
