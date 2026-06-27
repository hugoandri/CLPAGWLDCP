import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import GroupTable from "@/components/GroupTable";
import KnockoutBracket from "@/components/KnockoutBracket";
import SeoJsonLd from "@/components/SeoJsonLd";
import Flag from "@/components/Flag";
import { collectionPageJsonLd } from "@/lib/seo";
import { groups } from "@/data/groups";
import { computeStandings } from "@/lib/utils";
import { GROUP_IDS } from "@/data/teams";
import { nonQualifiedTeams, getNonQualifiedByConfederation, confederationLabels } from "@/data/teams-nq";
import type { Confederation } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Eliminatorias Mundial 2026: tabla de grupos, resultados y fase final",
  description:
    "Sigue las eliminatorias del Mundial 2026: tabla de posiciones de los 12 grupos, fase de eliminación directa, resultados en vivo y selecciones eliminadas.",
  alternates: { canonical: "/eliminatorias" },
};

export default function EliminatoriasPage() {
  const jsonLd = collectionPageJsonLd({
    name: "Eliminatorias Mundial 2026",
    description: "Tabla de posiciones de los 12 grupos y fase eliminatoria del Mundial 2026",
    path: "/eliminatorias",
  });

  const confederations: Confederation[] = ["UEFA", "CONMEBOL", "CAF", "AFC", "CONCACAF", "OFC"];

  return (
    <div className="container-page pb-12">
      <SeoJsonLd data={jsonLd} />
      <PageHeader
        eyebrow="Mundial 2026"
        title="Eliminatorias"
        description="Tabla de posiciones de la fase de grupos, eliminatorias directas y selecciones eliminadas."
      />

      {/* ─── Fase de Grupos ─── */}
      <section className="mb-12">
        <h2 className="section-title mb-6 text-2xl">Fase de grupos</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => {
            const standings = computeStandings(group.rows);
            return (
              <GroupTable
                key={group.id}
                standings={standings}
                label={`Grupo ${group.id}`}
              />
            );
          })}
        </div>
      </section>

      {/* ─── Fase Eliminatoria ─── */}
      <section className="mb-12">
        <h2 className="section-title mb-6 text-2xl">Fase eliminatoria</h2>
        <KnockoutBracket />
      </section>

      {/* ─── No clasificados ─── */}
      <section>
        <h2 className="section-title mb-6 text-2xl">Las que se quedaron fuera</h2>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          Más de 200 selecciones compitieron por un lugar en el Mundial 2026. Estas son las más
          destacadas que no lograron clasificar.
        </p>
        {confederations.map((conf) => {
          const teams = getNonQualifiedByConfederation(conf);
          if (teams.length === 0) return null;
          return (
            <details key={conf} className="group mb-4">
              <summary className="flex cursor-pointer items-center gap-2 rounded-xl bg-slate-50 px-5 py-3 font-display text-lg font-bold text-navy transition hover:bg-slate-100 dark:bg-white/[0.03] dark:text-slate-100 dark:hover:bg-white/[0.06]">
                <span>{confederationLabels[conf]}</span>
                <span className="ml-auto text-xs font-normal text-slate-400">
                  {teams.length} selecciones
                </span>
                <span className="text-pitch-500 transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {teams.map((team) => (
                  <div key={team.slug} className="card p-4">
                    <div className="flex items-center gap-3">
                      <Flag isoCode={team.isoCode} alt={team.name} width={32} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-navy dark:text-slate-100">{team.name}</p>
                        <p className="text-xs text-slate-400">FIFA #{team.fifaRank}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {team.analysis}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {team.keyPlayers.slice(0, 2).map((p) => (
                        <span key={p.name} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500 dark:bg-white/10 dark:text-slate-300">
                          {p.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </details>
          );
        })}
      </section>
    </div>
  );
}
