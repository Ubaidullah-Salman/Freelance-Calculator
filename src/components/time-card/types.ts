export type Session = {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm (24-hour)
  endTime: string; // HH:mm (24-hour)
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
  workerName?: string;
  clientName: string;
  projectName?: string;
  hourlyRate: number;
  rateType?: "pay" | "billing"; // "pay" for Worker Gross Pay, "billing" for Client Billing
  currency: Currency;
  payPeriodStartDate: string;
  payPeriodEndDate?: string;
  sessions: Session[];
  overtimeThreshold: number;
  overtimeMultiplier: number;
  includePayDetails?: boolean; // Show financial details in export (default true)
  includeSignatures?: boolean; // Show signature fields in PDF (default false)
  includeCredit?: boolean; // Show footer credit (default false)
  csvFormat?: "data_only" | "with_summary"; // default "data_only"
  isExportingPDF?: boolean;
  isExportingCSV?: boolean;
}

export const defaultTimeCardData: TimeCardData = {
  workerName: "",
  clientName: "",
  projectName: "",
  hourlyRate: 0,
  rateType: "pay",
  currency: "USD",
  payPeriodStartDate: new Date().toISOString().split("T")[0],
  payPeriodEndDate: "",
  sessions: [
    {
      id: "1",
      date: new Date().toISOString().split("T")[0],
      startTime: "09:00",
      endTime: "17:00",
      unpaidBreakMins: 30,
      endsNextDay: false,
    },
  ],
  overtimeThreshold: 40,
  overtimeMultiplier: 1.5,
  includePayDetails: true,
  includeSignatures: false,
  includeCredit: false,
  csvFormat: "data_only",
};

export interface CalculatedTimeCardPreview {
  totalWorkedHours: number; // decimal hours
  unpaidBreakHours: number; // decimal hours
  netWorkedHours: number; // decimal hours
  totalElapsedMinutes: number;
  totalBreakMinutes: number;
  totalWorkedMinutes: number;
  hourlyRate: number;
  currency: Currency;
  grossPay: number;
  overtimeApplied: number;
  overtimeMultiplier: number;
  overtimePay: number;
  totalPay: number;
}
