
import { AppSettings, DayRecord, AttendanceStatus, MonthSummary } from '../types';

/**
 * Calculates the monthly summary.
 * Professional Salaried Model: Total = Monthly Salary - (Absences * Daily Rate) + (OT * OT Rate)
 */
export const calculateSummary = (
  settings: AppSettings,
  records: DayRecord[]
): MonthSummary => {
  const { monthlySalary, workingDaysPerMonth, workingHoursPerDay, otRateMode, manualOtRate } = settings;
  
  // Daily rate is calculated based on the standard working days in a month
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

  // Base earnings in a Salaried context is usually the full contract amount
  const baseEarnings = monthlySalary;
  // Deductions for days not worked
  const absentDeduction = absentDays * dailyRate;
  // Extra earnings for OT
  const otEarnings = totalOtHours * effectiveOtRate;
  
  // Net Total
  const totalEarnings = baseEarnings - absentDeduction + otEarnings;

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
    // Ensure code is valid before formatting
    const safeCode = currencyCode && currencyCode.length === 3 ? currencyCode : 'USD';
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: safeCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (e) {
    // Ultimate fallback if Intl fails
    return `${value.toFixed(2)}`;
  }
};
