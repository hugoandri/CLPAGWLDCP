"use client";

import { useEffect, useState } from "react";
import { matchLocalDateKey, formatDateLong, formatDateShort, formatDayMonth } from "@/lib/utils";

const FORMATTERS = {
  long: formatDateLong,
  short: formatDateShort,
  dayMonth: formatDayMonth,
} as const;

interface LocalDateProps {
  date: string;
  time: string;
  format?: keyof typeof FORMATTERS;
  className?: string;
}

/** Día calendario de un partido en la zona horaria del navegador (ver matchLocalDateKey). */
export default function LocalDate({ date, time, format = "dayMonth", className }: LocalDateProps) {
  const [key, setKey] = useState(date);

  useEffect(() => {
    setKey(matchLocalDateKey(date, time));
  }, [date, time]);

  return <span className={className}>{FORMATTERS[format](key)}</span>;
}
