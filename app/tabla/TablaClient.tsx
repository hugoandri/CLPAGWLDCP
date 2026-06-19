"use client";

import { useMemo, useState } from "react";
import { groups } from "@/data/groups";
import { matches } from "@/data/matches";
import { computeStandings, cn } from "@/lib/utils";
import {
  computeTopScorers,
  computeTopAssists,
  computeYellowCards,
  computeRedCards,
} from "@/lib/stats";
import GroupTable from "@/components/GroupTable";
import PlayerStatTable from "@/components/PlayerStatTable";
import FilterTabs, { type FilterOption } from "@/components/FilterTabs";
import AdSlot from "@/components/AdSlot";

type Tab = "grupos" | "goleadores" | "tarjetas";

const TABS: { value: Tab; label: string }[] = [
  { value: "grupos", label: "Grupos" },
  { value: "goleadores", label: "Goleadores y asistencias" },
  { value: "tarjetas", label: "Tarjetas" },
];

export default function TablaClient() {
  const [tab, setTab] = useState<Tab>("grupos");
  const [group, setGroup] = useState("all");

  const groupOptions: FilterOption[] = useMemo(
    () => [
      { value: "all", label: "Todos" },
      ...groups.map((g) => ({ value: g.id, label: g.id })),
    ],
    [],
  );

  const visibleGroups = group === "all" ? groups : groups.filter((g) => g.id === group);

  const topScorers = useMemo(() => computeTopScorers(matches), []);
  const topAssists = useMemo(() => computeTopAssists(matches), []);
  const yellowCards = useMemo(() => computeYellowCards(matches), []);
  const redCards = useMemo(() => computeRedCards(matches), []);

  return (
    <div className="space-y-5">
      <div
        role="tablist"
        aria-label="Secciones de la tabla"
        className="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-white/5"
      >
        {TABS.map((t) => (
          <button
            key={t.value}
            role="tab"
            aria-selected={tab === t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              "flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-all",
              tab === t.value
                ? "bg-white text-navy shadow-sm dark:bg-white/10 dark:text-white"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "grupos" && (
        <div className="space-y-5">
          <FilterTabs
            options={groupOptions}
            value={group}
            onChange={setGroup}
            aria-label="Filtrar por grupo"
          />
          <div
            className={
              group === "all" ? "grid gap-5 lg:grid-cols-2" : "mx-auto max-w-2xl"
            }
          >
            {visibleGroups.map((g, i) => (
              <div key={g.id} className="contents">
                <GroupTable standings={computeStandings(g.rows)} label={g.label} />
                {/* Anuncio in-feed cada 4 grupos cuando se muestran todos */}
                {group === "all" && i === 3 && (
                  <div className="lg:col-span-2">
                    <AdSlot slotName="tabla-infeed" format="horizontal" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "goleadores" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <PlayerStatTable
            title="Goleadores"
            rows={topScorers}
            valueLabel="Goles"
            emptyLabel="Aún no hay goles registrados."
          />
          <PlayerStatTable
            title="Asistencias"
            rows={topAssists}
            valueLabel="Asist."
            emptyLabel="Aún no hay asistencias registradas."
          />
        </div>
      )}

      {tab === "tarjetas" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <PlayerStatTable
            title="Tarjetas amarillas"
            rows={yellowCards}
            valueLabel="TA"
            emptyLabel="Sin tarjetas amarillas registradas."
          />
          <PlayerStatTable
            title="Tarjetas rojas"
            rows={redCards}
            valueLabel="TR"
            emptyLabel="Sin tarjetas rojas registradas."
          />
        </div>
      )}
    </div>
  );
}
