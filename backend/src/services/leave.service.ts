import { leaveRepository } from "../repositories/leave.repository";

export const leaveService = {
  requestLeave: async (
    userId: string,
    data: {
      leaveType: string;
      reason: string;
      startDate: string;
      endDate: string;
    }
  ) => {
    // 1. Convert strings to Date objects
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    // Validation: Ensure Start is not after End
    if (start > end) {
      throw new Error("Start date cannot be after End date");
    }

    // 2. CALCULATION LOGIC
    // We get the full list of dates (e.g., [Mon, Tue, Wed])
    const dateArray = getDatesInRange(start, end);

    // We count the days automatically
    const daysCount = dateArray.length;

    // We format the string for the database (e.g., "3 Days")
    const durationString = `${daysCount} Day${daysCount > 1 ? "s" : ""}`;

    // 3. Save to DB
    // Notice we pass 'durationString' and 'dateArray', not the raw inputs
    return await leaveRepository.create({
      employeeId: userId,
      leaveType: data.leaveType,
      reason: data.reason,
      duration: durationString, // <--- Calculated Value
      dates: dateArray, // <--- Calculated Array
    });
  },

  getMyHistory: async (userId: string) => {
    return await leaveRepository.findByEmployeeId(userId);
  },

  getAllRequests: async () => {
    return await leaveRepository.findAll();
  },

  reviewRequest: async (id: string, status: "Approved" | "Rejected") => {
    return await leaveRepository.updateStatus(id, status);
  },
};

// --- Helper Function ---
// This generates the array of dates and ensures inclusive calculation
// e.g. Jan 1 to Jan 3 returns ['2025-01-01', '2025-01-02', '2025-01-03']
function getDatesInRange(startDate: Date, endDate: Date): string[] {
  const dates = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    // Format as YYYY-MM-DD to match Postgres date type
    dates.push(currentDate.toISOString().split("T")[0]);

    // Add 1 day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}
