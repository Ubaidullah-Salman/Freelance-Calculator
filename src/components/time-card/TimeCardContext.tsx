"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";

import { Session, TimeCardConfig } from "./types";
import {
  generateId,
  computeWorkedMinutes,
  formatMinutes,
  formatDecimalHours,
  DEFAULT_CONFIG,
} from "./utils";

export interface TimeCardContextValue {
  sessions: Session[];
  config: TimeCardConfig;
  setConfig: (config: TimeCardConfig) => void;
  totalMinutes: number;
  totalHoursFormatted: string;
  decimalHours: number;
  overtimeMinutes: number;
  overtimeHoursFormatted: string;
  totalPay: number;
  formattedPay: string;
  addSession: (session: Omit<Session, "id">) => void;
  updateSession: (id: string, updated: Partial<Omit<Session, "id">>) => void;
  removeSession: (id: string) => void;
  clearAll: () => void;
}

const TimeCardContext = createContext<TimeCardContextValue | undefined>(undefined);

export function TimeCardProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("timeCardDraft");
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [config, setConfig] = useState<TimeCardConfig>(() => {
    if (typeof window === "undefined") return DEFAULT_CONFIG;
    const saved = localStorage.getItem("timeCardConfig");
    try {
      return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  // Persist on change
  useEffect(() => {
    localStorage.setItem("timeCardDraft", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem("timeCardConfig", JSON.stringify(config));
  }, [config]);

  // Session helpers
  const addSession = (session: Omit<Session, "id">) => {
    setSessions((prev) => [...prev, { ...session, id: generateId() }]);
  };

  const updateSession = (id: string, updated: Partial<Omit<Session, "id">>) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
  };

  const removeSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const clearAll = () => {
    setSessions([]);
  };

  // Derived calculations
  const { totalMinutes, overtimeMinutes } = useMemo(() => {
    const total = sessions.reduce((sum, s) => sum + computeWorkedMinutes(s), 0);
    let overtime = 0;
    if (config.overtimeEnabled) {
      const threshold = config.overtimeThresholdHours * 60;
      overtime = Math.max(0, total - threshold);
    }
    return { totalMinutes: total, overtimeMinutes: overtime };
  }, [sessions, config.overtimeEnabled, config.overtimeThresholdHours]);

  const totalHoursFormatted = formatMinutes(totalMinutes);
  const decimalHours = formatDecimalHours(totalMinutes);
  const overtimeHoursFormatted = formatMinutes(overtimeMinutes);

  const totalPay = (() => {
    const ordinary = totalMinutes - overtimeMinutes;
    const ordinaryHours = ordinary / 60;
    const overtimeHours = overtimeMinutes / 60;
    const rate = config.hourlyRate;
    const multiplier = config.overtimeMultiplier;
    return ordinaryHours * rate + overtimeHours * rate * multiplier;
  })();

  const formattedPay = totalPay.toLocaleString(undefined, {
    style: "currency",
    currency: config.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <TimeCardContext.Provider
      value={{
        sessions,
        addSession,
        updateSession,
        removeSession,
        clearAll,
        config,
        setConfig,
        totalMinutes,
        totalHoursFormatted,
        decimalHours,
        overtimeMinutes,
        overtimeHoursFormatted,
        totalPay,
        formattedPay,
      }}
    >
      {children}
    </TimeCardContext.Provider>
  );
}

export function useTimeCard() {
  const ctx = useContext(TimeCardContext);
  if (!ctx) {
    throw new Error("useTimeCard must be used within a TimeCardProvider");
  }
  return ctx;
}