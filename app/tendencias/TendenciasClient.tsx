"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getLatestArticles } from "@/data/articles";
import { groups } from "@/data/groups";
import { computeStandings } from "@/lib/utils";
import ArticleCard from "@/components/ArticleCard";
import GlobalStandingsTable from "@/components/GlobalStandingsTable";
import KnockoutBracket from "@/components/KnockoutBracket";
import Flag from "@/components/Flag";
import AdSlot from "@/components/AdSlot";
import FilterTabs, { type FilterOption } from "@/components/FilterTabs";
import { nonQualifiedTeams, getNonQualifiedByConfederation, confederationLabels } from "@/data/teams-nq";
import type { Confederation } from "@/lib/types";

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

// ColumnCard is preserved for future editorial content but not currently active

const TAB_OPTIONS: FilterOption[] = [
  { value: "articulos", label: "Artículos" },
  { value: "tabla", label: "Tabla general" },
  { value: "eliminatorias", label: "Eliminatorias" },
  { value: "noclasi", label: "No clasificados" },
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

export default function TendenciasClient({ defaultTab = "articulos", columns = [] }: TendenciasClientProps) {
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

      {tab === "noclasi" && (
        <NonQualifiedSection />
      )}
    </div>
  );
}

function NonQualifiedSection() {
  const confederations: Confederation[] = ["UEFA", "CONMEBOL", "CAF", "AFC", "CONCACAF", "OFC"];
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Más de 200 selecciones compitieron por un lugar en el Mundial 2026. Estas son las más
        destacadas que no lograron clasificar, organizadas por confederación.
      </p>
      {confederations.map((conf) => {
        const teams = getNonQualifiedByConfederation(conf);
        if (teams.length === 0) return null;
        return (
          <details key={conf} className="group rounded-xl border border-slate-200 dark:border-white/10">
            <summary className="flex cursor-pointer items-center gap-2 px-5 py-3 font-display text-lg font-bold text-navy transition hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-white/[0.03]">
              <span>{confederationLabels[conf]}</span>
              <span className="ml-auto text-xs font-normal text-slate-400">{teams.length} selecciones</span>
              <span className="text-pitch-500 transition-transform group-open:rotate-45">+</span>
            </summary>
            <div className="border-t border-slate-100 p-4 dark:border-white/5">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {teams.map((team) => (
                  <div key={team.slug} className="rounded-lg bg-slate-50 p-3 dark:bg-white/[0.03]">
                    <div className="flex items-center gap-2">
                      <Flag isoCode={team.isoCode} alt={team.name} width={28} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-navy dark:text-slate-100">{team.name}</p>
                        <p className="text-[11px] text-slate-400">FIFA #{team.fifaRank}</p>
                      </div>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{team.analysis}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {team.keyPlayers.slice(0, 2).map((p) => (
                        <span key={p.name} className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-white/10 dark:text-slate-300">
                          {p.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </details>
        );
      })}
    </div>
  );
}
