"use client";

import { useEffect, useState } from "react";

interface LocalTimeProps {
  date: string;
  time: string;
  showDate?: boolean;
  className?: string;
}

export default function LocalTime({ date, time, showDate, className }: LocalTimeProps) {
  const [display, setDisplay] = useState<string | null>(null);

  useEffect(() => {
    const utc = new Date(`${date}T${time}:00Z`);
    const local = utc.toLocaleString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      day: showDate ? "numeric" : undefined,
      month: showDate ? "short" : undefined,
      timeZoneName: "short",
    });
    setDisplay(local);
  }, [date, time, showDate]);

  if (!display) {
    const fallback = new Date(`${date}T${time}:00Z`);
    const h = fallback.getUTCHours().toString().padStart(2, "0");
    const m = fallback.getUTCMinutes().toString().padStart(2, "0");
    return <span className={className}>{h}:{m}</span>;
  }

  return <span className={className}>{display}</span>;
}
