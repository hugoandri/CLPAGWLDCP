"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Tab = "cobertura" | "estadisticas";

interface Props {
  defaultTab: Tab;
  coverageSlot: React.ReactNode;
  statsSlot: React.ReactNode;
  isActive?: boolean; // live or halftime
}

export default function MatchTabs({ defaultTab, coverageSlot, statsSlot, isActive }: Props) {
  const [active, setActive] = useState<Tab>(defaultTab);

  return (
    <div>
      {/* Tab bar */}
      <div className="mb-5 flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-white/5">
        <button
          onClick={() => setActive("cobertura")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all",
            active === "cobertura"
              ? "bg-white text-navy shadow-sm dark:bg-white/10 dark:text-white"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
          )}
        >
          {isActive && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-red-500" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
            </span>
          )}
          Cobertura
        </button>
        <button
          onClick={() => setActive("estadisticas")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all",
            active === "estadisticas"
              ? "bg-white text-navy shadow-sm dark:bg-white/10 dark:text-white"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
          )}
        >
          Estadísticas
        </button>
      </div>

      {/* Panels — both rendered, only one visible */}
      <div className={active === "cobertura" ? "block" : "hidden"}>
        {coverageSlot}
      </div>
      <div className={active === "estadisticas" ? "block" : "hidden"}>
        {statsSlot}
      </div>
    </div>
  );
}
