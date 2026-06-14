"use client";

import { useMemo, useState } from "react";
import { teams, GROUP_IDS } from "@/data/teams";
import { slugify } from "@/lib/utils";
import TeamCard from "@/components/TeamCard";
import SearchInput from "@/components/SearchInput";
import FilterTabs, { type FilterOption } from "@/components/FilterTabs";
import AdSlot from "@/components/AdSlot";

const sortedTeams = [...teams].sort((a, b) => a.internalRank - b.internalRank);

export default function SeleccionesClient() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");

  const options: FilterOption[] = useMemo(
    () => [
      { value: "all", label: "Todas" },
      ...GROUP_IDS.map((g) => ({ value: g, label: `Grupo ${g}` })),
    ],
    [],
  );

  const filtered = useMemo(() => {
    const q = slugify(query.trim());
    return sortedTeams.filter((t) => {
      if (group !== "all" && t.group !== group) return false;
      if (q && !slugify(t.name).includes(q)) return false;
      return true;
    });
  }, [query, group]);

  return (
    <div className="space-y-5">
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Buscar selección (p. ej. Argentina)…"
        aria-label="Buscar selección"
        className="sm:max-w-md"
      />

      <FilterTabs
        options={options}
        value={group}
        onChange={setGroup}
        aria-label="Filtrar por grupo"
      />

      <p className="text-sm text-slate-500 dark:text-slate-400">
        {filtered.length} {filtered.length === 1 ? "selección" : "selecciones"}
      </p>

      {filtered.length === 0 ? (
        <p className="card p-8 text-center text-slate-500 dark:text-slate-400">
          No se encontró ninguna selección con ese nombre.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t, i) => {
            const card = <TeamCard key={t.slug} team={t} />;
            if (i === 5) {
              return (
                <div key="ad-wrap" className="contents">
                  {card}
                  <AdSlot
                    slotName="selecciones-infeed"
                    format="in-feed"
                    className="sm:col-span-2 lg:col-span-3"
                  />
                </div>
              );
            }
            return card;
          })}
        </div>
      )}
    </div>
  );
}
