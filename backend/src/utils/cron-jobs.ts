import cron from "node-cron";
import { attendanceService } from "../services/attendance.service";

export function setupCronJobs() {
  // Run daily at 5:30 PM to generate timesheet PDF
  cron.schedule("30 17 * * *", async () => {
    const today = new Date().toISOString().split("T")[0];

    try {
      console.log(`[CRON] Generating timesheet PDF for ${today}...`);
      await attendanceService.generateDailyTimesheetPDF(today);
      console.log(`[CRON] Timesheet PDF generated successfully for ${today}`);
    } catch (error) {
      console.error("[CRON] Failed to generate timesheet PDF:", error);
    }
  });

  console.log("[CRON] Daily timesheet generation scheduled at 5:30 PM");
}
