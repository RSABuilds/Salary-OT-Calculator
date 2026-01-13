
export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  UNSET = 'UNSET'
}

export interface DayRecord {
  date: string; // ISO format
  status: AttendanceStatus;
  otHours: number;
}

export interface AppSettings {
  monthlySalary: number;
  workingDaysPerMonth: number;
  workingHoursPerDay: number;
  otRateMode: 'auto' | 'manual';
  manualOtRate: number;
  currency: string;
  currencySymbol: string;
  countryName: string;
  mobileNumber: string;
  isLoggedIn: boolean;
  lastSyncedAt?: string;
  syncEnabled: boolean;
  offDays: number[]; // 0 for Sunday, 1 for Monday, etc.
}

export interface MonthSummary {
  presentDays: number;
  absentDays: number;
  totalOtHours: number;
  baseEarnings: number;
  otEarnings: number;
  absentDeduction: number;
  totalEarnings: number;
}
