// src/lib/holiday-utils.ts
import { HOLIDAYS_2026, type Holiday } from '@/data/holidays';

export const getHolidayByDate = (dateObj: Date): Holiday | undefined => {
  // 1. Convert Date Object to "YYYY-MM-DD" (Local Time)
  // We use this method to ensure we don't get UTC shifts
  const offset = dateObj.getTimezoneOffset();
  const localDate = new Date(dateObj.getTime() - offset * 60 * 1000);
  const dateString = localDate.toISOString().split('T')[0];

  // 2. Search the array
  return HOLIDAYS_2026.find((h) => h.start === dateString);
};

export const getUpcomingHolidays = (limit: number = 3): Holiday[] => {
  const today = new Date().toISOString().split('T')[0];

  return HOLIDAYS_2026.filter((h) => h.start >= today)
    .sort((a, b) => a.start.localeCompare(b.start))
    .slice(0, limit);
};
