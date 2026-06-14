"use client";

import { useState } from "react";
import {
  predictionsRankedBy,
  PREDICTION_METRICS,
  type PredictionMetric,
} from "@/data/predictions";
import { getTeam } from "@/data/teams";
import PredictionCard from "@/components/PredictionCard";
import AdSlot from "@/components/AdSlot";
import FilterTabs, { type FilterOption } from "@/components/FilterTabs";

const METRIC_OPTIONS: FilterOption[] = PREDICTION_METRICS.map((m) => ({
  value: m.key,
  label: m.label,
}));

export default function PrediccionesClient() {
  const [metric, setMetric] = useState<PredictionMetric>("winner");
  const ranked = predictionsRankedBy(metric);
  const active = PREDICTION_METRICS.find((m) => m.key === metric);

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
          Ordenar ranking por:
        </p>
        <FilterTabs
          options={METRIC_OPTIONS}
          value={metric}
          onChange={(v) => setMetric(v as PredictionMetric)}
          aria-label="Ordenar predicciones por ronda"
        />
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Selecciones ordenadas por probabilidad de{" "}
        <span className="font-semibold text-navy dark:text-slate-200">
          {active?.label.toLowerCase()}
        </span>
        .
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ranked.map((p, i) => {
          const team = getTeam(p.teamSlug);
          if (!team) return null;
          const card = (
            <PredictionCard key={p.teamSlug} team={team} prediction={p} rank={i + 1} />
          );
          // Inserta un anuncio in-feed tras la 6.ª tarjeta.
          if (i === 5) {
            return (
              <div key="ad-wrap" className="contents">
                {card}
                <AdSlot
                  key="ad"
                  slotName="predicciones-infeed"
                  format="in-feed"
                  className="sm:col-span-2 lg:col-span-3"
                />
              </div>
            );
          }
          return card;
        })}
      </div>
    </div>
  );
}
