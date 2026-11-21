"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { TimeCardData, defaultTimeCardData } from "./types";
import { saveTimeCardToLocalStorage, loadTimeCardFromLocalStorage } from "./utils";
import { calculateTimeCard } from "./utils";
import { FeatureCard } from "./FeatureCard";

// Dynamically import heavy components to improve initial load time
const TimeCardEditor = dynamic(
  () => import("./TimeCardEditor").then(mod => mod.TimeCardEditor),
  { ssr: false }
);

const TimeCardPreview = dynamic(
  () => import("./TimeCardPreview").then(mod => mod.TimeCardPreview),
  { ssr: false }
);

// Custom hook for time card state management
function useTimeCardState() {
  const [timeCardData, setTimeCardData] = useState<TimeCardData>(defaultTimeCardData);
  const searchParams = useSearchParams();

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = loadTimeCardFromLocalStorage();
    if (savedData) {
      setTimeCardData(savedData);
    }

    // Load data from URL parameters if provided
    const sessionId = searchParams.get("session");
    if (sessionId) {
      // TODO: Implement session loading from API if needed
      console.log("Loading session:", sessionId);
    }
  }, [searchParams]);

  // Auto-save to localStorage whenever data changes
  useEffect(() => {
    saveTimeCardToLocalStorage(timeCardData);
  }, [timeCardData]);

  const updateTimeCardData = useCallback((updates: Partial<TimeCardData>) => {
    setTimeCardData(prev => ({ ...prev, ...updates }));
  }, []);

  const resetTimeCard = useCallback(() => {
    setTimeCardData(defaultTimeCardData);
  }, []);

  return {
    timeCardData,
    updateTimeCardData,
    resetTimeCard,
  };
}

// Provider component for TimeCard context
export function TimeCardProviderWrapper({ children }: { children: React.ReactNode }) {
  const { timeCardData, updateTimeCardData, resetTimeCard } = useTimeCardState();

  // Create context value
  const contextValue = {
    timeCardData,
    updateTimeCardData,
    resetTimeCard,
    calculatedPreview: calculateTimeCard(timeCardData),
  };

  // Provide context to children
  return (
    <TimeCardContext.Provider value={contextValue}>
      {children}
    </TimeCardContext.Provider>
  );
}

// Context for time card data
const TimeCardContext = createContext<ReturnType<typeof useTimeCardState> & {
  calculatedPreview: ReturnType<typeof calculateTimeCard>;
}>({} as any);

// Editor wrapper component
export function TimeCardEditorWrapper() {
  const { timeCardData, updateTimeCardData, calculatedPreview } = useTimeCardContext();

  return <TimeCardEditor timeCardData={timeCardData} onUpdate={updateTimeCardData} calculatedPreview={calculatedPreview} />;
}

// Preview wrapper component
export function TimeCardPreviewWrapper() {
  const { timeCardData, calculatedPreview } = useTimeCardContext();

  return <TimeCardPreview timeCardData={timeCardData} calculatedPreview={calculatedPreview} />;
}

// Custom hook to use the time card context
function useTimeCardContext() {
  const context = useContext(TimeCardContext);
  if (!context) {
    throw new Error("useTimeCardContext must be used within a TimeCardProvider");
  }
  return context;
}