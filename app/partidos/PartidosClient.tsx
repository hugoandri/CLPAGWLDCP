"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getTeam, GROUP_IDS } from "@/data/teams";
import type { Match, MatchStatus } from "@/lib/types";
import type { KnockoutMatch } from "@/data/knockout";
import { formatDateShort, matchLocalDateKey } from "@/lib/utils";
import FilterTabs, { type FilterOption } from "@/components/FilterTabs";
import SearchInput from "@/components/SearchInput";
import MatchTable from "@/components/MatchTable";
import KnockMatchCard from "@/components/KnockMatchCard";

type StatusFilter = "all" | MatchStatus | "eliminatorias";

const STATUS_OPTIONS: FilterOption[] = [
  { value: "all", label: "Todos" },
  { value: "eliminatorias", label: "Eliminatorias" },
  { value: "upcoming", label: "Próximos" },
  { value: "live", label: "En vivo" },
  { value: "halftime", label: "Descanso" },
  { value: "finished", label: "Finalizados" },
];

export default function PartidosClient({
  matches,
  knockoutMatches = [],
}: {
  matches: Match[];
  knockoutMatches?: KnockoutMatch[];
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dateKeyOf = useCallback(
    (m: Match) => (mounted ? matchLocalDateKey(m.date, m.time) : m.date),
    [mounted],
  );

  const uniqueDates = useMemo(
    () => Array.from(new Set(matches.map(dateKeyOf))).sort(),
    [matches, dateKeyOf],
  );
  const [status, setStatus] = useState<StatusFilter>("all");
  const [group, setGroup] = useState<string>("all");
  const [date, setDate] = useState<string>("all");
  const [query, setQuery] = useState("");

  const groupOptions: FilterOption[] = useMemo(
    () => [
      { value: "all", label: "Todos los grupos" },
      ...GROUP_IDS.map((g) => ({ value: g, label: g })),
    ],
    [],
  );

  // Show knockout matches sorted by date
  const knockoutSorted = useMemo(
    () =>
      knockoutMatches
        .filter((m) => m.status !== "placeholder")
        .sort((a, b) => {
          const aDate = a.date || "2099-12-31";
          const bDate = b.date || "2099-12-31";
          return aDate.localeCompare(bDate);
        }),
    [knockoutMatches],
  );

  const filtered = useMemo(() => {
    if (status === "eliminatorias") return [];

    const q = query.trim().toLowerCase();
    return matches
      .filter((m) => {
        if (status !== "all" && m.status !== status) return false;
        if (group !== "all" && m.group !== group) return false;
        if (date !== "all" && dateKeyOf(m) !== date) return false;
        if (q) {
          const home = getTeam(m.homeSlug)?.name.toLowerCase() ?? "";
          const away = getTeam(m.awaySlug)?.name.toLowerCase() ?? "";
          if (!home.includes(q) && !away.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
  }, [matches, status, group, date, query, dateKeyOf]);

  const count = status === "eliminatorias" ? knockoutSorted.length : filtered.length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Buscar selección…"
          aria-label="Buscar partidos por selección"
          className="sm:max-w-xs"
        />
        <div className="relative sm:w-56">
          <label htmlFor="date-filter" className="sr-only">
            Filtrar por fecha
          </label>
          <select
            id="date-filter"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full appearance-none rounded-full border border-slate-300 bg-white py-2.5 pl-4 pr-9 text-sm font-medium text-navy transition focus:border-pitch dark:border-white/15 dark:bg-navy-900 dark:text-slate-100"
          >
            <option value="all">Todas las fechas</option>
            {uniqueDates.map((d) => (
              <option key={d} value={d}>
                {formatDateShort(d)}
              </option>
            ))}
          </select>
          <span aria-hidden className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            ▾
          </span>
        </div>
      </div>

      <FilterTabs
        options={STATUS_OPTIONS}
        value={status}
        onChange={(v) => setStatus(v as StatusFilter)}
        aria-label="Filtrar por estado"
      />

      {status !== "eliminatorias" && (
        <FilterTabs
          options={groupOptions}
          value={group}
          onChange={setGroup}
          aria-label="Filtrar por grupo"
        />
      )}

      <p className="text-sm text-slate-500 dark:text-slate-400">
        {count} {count === 1 ? "partido" : "partidos"}
      </p>

      {status === "eliminatorias" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {knockoutSorted.map((m) => (
            <KnockMatchCard key={m.slug} match={m} />
          ))}
          {knockoutSorted.length === 0 && (
            <p className="card col-span-full p-8 text-center text-slate-500 dark:text-slate-400">
              No hay partidos de eliminatoria disponibles.
            </p>
          )}
        </div>
      ) : (
        <MatchTable matches={filtered} />
      )}
    </div>
  );
}
