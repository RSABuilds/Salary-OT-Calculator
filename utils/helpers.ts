
import { AppSettings, DayRecord, AttendanceStatus, MonthSummary } from '../types';

/**
 * Calculates the monthly summary.
 */
export const calculateSummary = (
  settings: AppSettings,
  records: DayRecord[]
): MonthSummary => {
  const { monthlySalary, workingDaysPerMonth, workingHoursPerDay, otRateMode, manualOtRate } = settings;
  
  const dailyRate = monthlySalary / (workingDaysPerMonth || 1);
  const hourlyRate = dailyRate / (workingHoursPerDay || 1);
  
  const effectiveOtRate = otRateMode === 'auto' ? hourlyRate : manualOtRate;

  let presentDays = 0;
  let absentDays = 0;
  let totalOtHours = 0;

  records.forEach(record => {
    if (record.status === AttendanceStatus.PRESENT) {
      presentDays++;
    }
    if (record.status === AttendanceStatus.ABSENT) {
      absentDays++;
    }
    if (record.otHours > 0) {
      totalOtHours += record.otHours;
    }
  });

  const baseEarnings = presentDays * dailyRate;
  const absentDeduction = absentDays * dailyRate;
  const otEarnings = totalOtHours * effectiveOtRate;
  const totalEarnings = baseEarnings + otEarnings;

  return {
    presentDays,
    absentDays,
    totalOtHours,
    baseEarnings,
    otEarnings,
    absentDeduction,
    totalEarnings
  };
};

export const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

export const formatCurrency = (value: number, currencyCode: string = 'USD') => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (e) {
    // Fallback if currency code is invalid
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }
};
