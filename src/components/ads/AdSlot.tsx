"use client";

import { useEffect, useRef } from "react";

interface AdSlotProps {
  slotName: string;
  format?: "auto" | "horizontal" | "vertical" | "rectangle";
  className?: string;
  style?: React.CSSProperties;
}

const AD_CLIENT = "ca-pub-2344318084516150";

export function AdSlot({
  slotName,
  format = "auto",
  className = "",
  style,
}: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    const container = adRef.current;
    container.innerHTML = "";

    const ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.style.display = "block";
    ins.style.minHeight = format === "horizontal" ? "90px" : format === "vertical" ? "600px" : "280px";
    ins.style.width = "100%";
    ins.dataset.adClient = AD_CLIENT;
    ins.dataset.adSlot = slotName;
    ins.dataset.adFormat = format;
    ins.dataset.fullWidthResponsive = "true";

    container.appendChild(ins);

    try {
      const adsbygoogle = (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || [];
      (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle = adsbygoogle;
      adsbygoogle.push({});
    } catch {
      // AdSense script not loaded or blocked; container height stays reserved to prevent CLS
    }

    return () => {
      container.innerHTML = "";
    };
  }, [slotName, format]);

  return (
    <div
      ref={adRef}
      className={`ad-slot ${className}`}
      style={{
        minHeight: format === "horizontal" ? "90px" : format === "vertical" ? "600px" : "280px",
        width: "100%",
        overflow: "hidden",
        ...style,
      }}
      aria-label="Advertisement"
      role="complementary"
    />
  );
}

export function AdSlotLeaderboard({ className = "", slotName = "1234567890" }: { className?: string; slotName?: string }) {
  return <AdSlot slotName={slotName} format="horizontal" className={`ad-leaderboard ${className}`} />;
}

export function AdSlotRectangle({ className = "", slotName = "0987654321" }: { className?: string; slotName?: string }) {
  return <AdSlot slotName={slotName} format="rectangle" className={`ad-rectangle ${className}`} />;
}

export function AdSlotVertical({ className = "", slotName = "1122334455" }: { className?: string; slotName?: string }) {
  return <AdSlot slotName={slotName} format="vertical" className={`ad-vertical ${className}`} />;
}

export function AdSlotAuto({ className = "", slotName = "5566778899" }: { className?: string; slotName?: string }) {
  return <AdSlot slotName={slotName} format="auto" className={`ad-auto ${className}`} />;
}