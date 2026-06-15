"use client";

import { useMemo, useState } from "react";
import { getLatestArticles } from "@/data/articles";
import { groups } from "@/data/groups";
import { computeStandings } from "@/lib/utils";
import ArticleCard from "@/components/ArticleCard";
import GlobalStandingsTable from "@/components/GlobalStandingsTable";
import KnockoutBracket from "@/components/KnockoutBracket";
import AdSlot from "@/components/AdSlot";
import FilterTabs, { type FilterOption } from "@/components/FilterTabs";

const allArticles = getLatestArticles();

const allStandings = groups.flatMap((g) => computeStandings(g.rows));
allStandings.sort(
  (a, b) =>
    b.points - a.points ||
    b.gd - a.gd ||
    b.gf - a.gf ||
    a.teamSlug.localeCompare(b.teamSlug),
);

interface TendenciasClientProps {
  defaultTab?: string;
}

const TAB_OPTIONS: FilterOption[] = [
  { value: "articulos", label: "Artículos" },
  { value: "tabla", label: "Tabla general" },
  { value: "eliminatorias", label: "Eliminatorias" },
];

export default function TendenciasClient({ defaultTab = "articulos" }: TendenciasClientProps) {
  const [tab, setTab] = useState(defaultTab);
  const [category, setCategory] = useState("all");

  const options: FilterOption[] = useMemo(() => {
    const cats = Array.from(new Set(allArticles.map((a) => a.category)));
    return [
      { value: "all", label: "Todo" },
      ...cats.map((c) => ({ value: c, label: c })),
    ];
  }, []);

  const filtered =
    category === "all"
      ? allArticles
      : allArticles.filter((a) => a.category === category);

  return (
    <div className="space-y-5">
      {/* Tabs principales */}
      <FilterTabs
        options={TAB_OPTIONS}
        value={tab}
        onChange={(v) => { setTab(v); setCategory("all"); }}
        aria-label="Sección de tendencias"
      />

      {tab === "articulos" && (
        <>
          <FilterTabs
            options={options}
            value={category}
            onChange={setCategory}
            aria-label="Filtrar por categoría"
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a, i) => {
              const card = <ArticleCard key={a.slug} article={a} />;
              if (i === 4) {
                return (
                  <div key="ad-wrap" className="contents">
                    {card}
                    <AdSlot
                      slotName="tendencias-infeed"
                      format="in-feed"
                      className="sm:col-span-2 lg:col-span-3"
                    />
                  </div>
                );
              }
              return card;
            })}
          </div>
        </>
      )}

      {tab === "tabla" && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Clasificación general del Mundial 2026 ordenada por puntos. Se muestran todos los equipos participantes con sus estadísticas completas.
          </p>
          <GlobalStandingsTable standings={allStandings} />

          <div className="mt-6">
            <AdSlot slotName="tendencias-tabla-banner" format="leaderboard" />
          </div>
        </div>
      )}

      {tab === "eliminatorias" && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Cuadro de desarrollo desde dieciseisavos de final. Los cruces se definirán al finalizar la fase de grupos.
          </p>
          <KnockoutBracket />
        </div>
      )}
    </div>
  );
}
