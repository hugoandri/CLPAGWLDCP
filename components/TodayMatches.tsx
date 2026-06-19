"use client";

import { useEffect, useState } from "react";
import type { Match } from "@/lib/types";
import { matchLocalDateKey } from "@/lib/utils";
import MatchCard from "@/components/MatchCard";
import AdSlot from "@/components/AdSlot";

interface TodayMatchesProps {
  matches: Match[];
  /** Día de hoy en UTC (calculado en el servidor), usado como primer render. */
  initialTodayKey: string;
}

/**
 * Filtra los partidos de "hoy" según el día calendario LOCAL del navegador
 * (no el día UTC con el que se guardan los partidos), para que un partido que
 * ya es hoy localmente no quede excluido hasta que el día UTC lo alcance.
 */
export default function TodayMatches({ matches, initialTodayKey }: TodayMatchesProps) {
  const [todayKey, setTodayKey] = useState(initialTodayKey);

  useEffect(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    setTodayKey(`${y}-${m}-${d}`);
  }, []);

  const todayMatches = matches.filter((m) => matchLocalDateKey(m.date, m.time) === todayKey);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {todayMatches.slice(0, 2).map((m) => (
        <MatchCard key={m.slug} match={m} />
      ))}

      {/* Anuncio in-feed entre tarjetas */}
      <AdSlot slotName="home-infeed" format="in-feed" className="sm:col-span-2 lg:col-span-1" />

      {todayMatches.slice(2).map((m) => (
        <MatchCard key={m.slug} match={m} />
      ))}
    </div>
  );
}
