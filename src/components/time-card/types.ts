export type Session = {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  unpaidBreakMins: number;
  endsNextDay: boolean;
  comment?: string;
};

export type Currency = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "PKR";

export interface TimeCardConfig {
  hourlyRate: number;
  currency: Currency;
  overtimeEnabled: boolean;
  overtimeThresholdHours: number; // hours
  overtimeMultiplier: number; // e.g., 1.5
}

export interface TimeCardData {
  clientName: string;
  hourlyRate: number;
  currency: Currency;
  payPeriodStartDate: string;
  sessions: Session[];
  overtimeThreshold: number;
  overtimeMultiplier: number;
  isExportingPDF?: boolean;
  isExportingCSV?: boolean;
}

export const defaultTimeCardData: TimeCardData = {
  clientName: "",
  hourlyRate: 0,
  currency: "USD",
  payPeriodStartDate: new Date().toISOString().split('T')[0],
  sessions: [
    {
      id: "1",
      date: new Date().toISOString().split('T')[0],
      startTime: "09:00",
      endTime: "17:00",
      unpaidBreakMins: 30,
      endsNextDay: false,
    },
  ],
  overtimeThreshold: 40,
  overtimeMultiplier: 1.5,
};

export interface CalculatedTimeCardPreview {
  totalWorkedHours: number;
  unpaidBreakHours: number;
  netWorkedHours: number;
  hourlyRate: number;
  currency: Currency;
  grossPay: number;
  overtimeApplied: number;
  overtimeMultiplier: number;
  overtimePay: number;
  totalPay: number;
}