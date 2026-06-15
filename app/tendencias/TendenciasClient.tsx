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

export interface OpinionColumn {
  date: string;
  title: string;
  body: string;
  matchCount: number;
  generatedAt: string;
}

interface TendenciasClientProps {
  defaultTab?: string;
  columns?: OpinionColumn[];
}

const TAB_OPTIONS: FilterOption[] = [
  { value: "columna", label: "Columna diaria" },
  { value: "articulos", label: "Artículos" },
  { value: "tabla", label: "Tabla general" },
  { value: "eliminatorias", label: "Eliminatorias" },
];

function ColumnCard({ col }: { col: OpinionColumn }) {
  const [expanded, setExpanded] = useState(false);

  // Split body into paragraphs and detect "Opinión personal:"
  const paragraphs = col.body.split(/\n\n+/).filter(Boolean);

  const preview = paragraphs.slice(0, 2);
  const rest = paragraphs.slice(2);

  return (
    <article className="card p-6 space-y-4">
      <header>
        <p className="text-[11px] font-bold uppercase tracking-widest text-pitch-600 dark:text-pitch-400 mb-1">
          Columna · {col.matchCount} {col.matchCount === 1 ? "partido" : "partidos"}
        </p>
        <h2 className="font-display text-xl font-bold text-navy dark:text-slate-100">
          {col.title}
        </h2>
      </header>

      <div className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {preview.map((p, i) => {
          const isOpinion = p.startsWith("Opinión personal:");
          return (
            <p key={i} className={isOpinion ? "font-medium text-navy dark:text-slate-100" : ""}>
              {isOpinion ? (
                <>
                  <span className="text-pitch-600 dark:text-pitch-400 font-bold">Opinión personal: </span>
                  {p.replace(/^Opinión personal:\s*/i, "")}
                </>
              ) : p}
            </p>
          );
        })}

        {expanded && rest.map((p, i) => {
          const isOpinion = p.startsWith("Opinión personal:");
          return (
            <p key={`r${i}`} className={isOpinion ? "font-medium text-navy dark:text-slate-100" : ""}>
              {isOpinion ? (
                <>
                  <span className="text-pitch-600 dark:text-pitch-400 font-bold">Opinión personal: </span>
                  {p.replace(/^Opinión personal:\s*/i, "")}
                </>
              ) : p}
            </p>
          );
        })}
      </div>

      {rest.length > 0 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm font-semibold text-pitch-600 dark:text-pitch-400 hover:underline"
        >
          {expanded ? "Leer menos ↑" : "Leer columna completa ↓"}
        </button>
      )}

      <p className="text-[11px] text-slate-400 pt-1">
        Generado por IA · DataGoal
      </p>
    </article>
  );
}

export default function TendenciasClient({ defaultTab = "columna", columns = [] }: TendenciasClientProps) {
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
      <FilterTabs
        options={TAB_OPTIONS}
        value={tab}
        onChange={(v) => { setTab(v); setCategory("all"); }}
        aria-label="Sección de tendencias"
      />

      {tab === "columna" && (
        <div className="space-y-6">
          {columns.length === 0 ? (
            <p className="text-sm text-slate-400">La primera columna se publica a la 1 AM hora Chile.</p>
          ) : (
            columns.map(col => <ColumnCard key={col.date} col={col} />)
          )}
          <AdSlot slotName="tendencias-columna-banner" format="leaderboard" />
        </div>
      )}

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
            Clasificación general del Mundial 2026 ordenada por puntos.
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
            Cuadro de desarrollo desde dieciseisavos de final.
          </p>
          <KnockoutBracket />
        </div>
      )}
    </div>
  );
}
