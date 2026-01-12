import { DashboardRepository } from "../repositories/dashboard.repository";

export class DashboardService {
  static async getStats() {
    // Call repository to get the raw numbers
    const stats = await DashboardRepository.getAdminStats();
    return stats;
  }
}
