"use client";

import { useMemo, useState } from "react";
import { groups } from "@/data/groups";
import { computeStandings } from "@/lib/utils";
import GroupTable from "@/components/GroupTable";
import FilterTabs, { type FilterOption } from "@/components/FilterTabs";
import AdSlot from "@/components/AdSlot";

export default function TablaClient() {
  const [group, setGroup] = useState("all");

  const options: FilterOption[] = useMemo(
    () => [
      { value: "all", label: "Todos" },
      ...groups.map((g) => ({ value: g.id, label: g.id })),
    ],
    [],
  );

  const visible = group === "all" ? groups : groups.filter((g) => g.id === group);

  return (
    <div className="space-y-5">
      <FilterTabs
        options={options}
        value={group}
        onChange={setGroup}
        aria-label="Filtrar por grupo"
      />

      <div
        className={
          group === "all"
            ? "grid gap-5 lg:grid-cols-2"
            : "mx-auto max-w-2xl"
        }
      >
        {visible.map((g, i) => (
          <div key={g.id} className="contents">
            <GroupTable
              standings={computeStandings(g.rows)}
              label={g.label}
            />
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
  );
}
