import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Flag from "@/components/Flag";
import SeoJsonLd from "@/components/SeoJsonLd";
import { collectionPageJsonLd, itemListJsonLd } from "@/lib/seo";
import { nonQualifiedTeams, getNonQualifiedByConfederation, confederationLabels } from "@/data/teams-nq";
import type { Confederation } from "@/lib/types";

export const metadata: Metadata = {
  title: "Las selecciones que NO clasificaron al Mundial 2026",
  description:
    "Repaso por confederación de las selecciones más destacadas que no lograron clasificar al Mundial 2026: Italia, Chile, Nigeria, China y muchas más con sus jugadores clave.",
  alternates: { canonical: "/eliminatorias" },
};

export default function EliminatoriasPage() {
  const confederations: Confederation[] = ["UEFA", "CONMEBOL", "CAF", "AFC", "CONCACAF", "OFC"];

  const jsonLd = [
    collectionPageJsonLd({
      name: "Eliminatorias Mundial 2026",
      description: metadata.description as string,
      path: "/eliminatorias",
    }),
  ];

  const allSlugs = nonQualifiedTeams.map((t) => ({
    name: t.name,
    path: `/eliminatorias/${t.slug}`,
  }));

  const jsonLdList = itemListJsonLd(allSlugs, "Selecciones no clasificadas al Mundial 2026");

  return (
    <div className="container-page pb-12">
      <SeoJsonLd data={[...jsonLd, jsonLdList]} />
      <PageHeader
        eyebrow="Eliminatorias"
        title="Las que se quedaron fuera"
        description="Más de 200 selecciones compitieron por un lugar en el Mundial 2026. Estas son las más destacadas que no lograron clasificar, organizadas por confederación."
      />

      {confederations.map((conf) => {
        const teams = getNonQualifiedByConfederation(conf);
        if (teams.length === 0) return null;
        return (
          <section key={conf} className="mb-12">
            <h2 className="section-title mb-4 text-2xl">{confederationLabels[conf]}</h2>
            <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
              {conf === "UEFA" && "De 55 selecciones europeas, solo 16 clasificaron. Estas son las más destacadas que se quedaron fuera."}
              {conf === "CONMEBOL" && "De 10 selecciones sudamericanas, 7 lograron el pase. La eliminatoria más exigente del mundo dejó fuera a estas cuatro."}
              {conf === "CAF" && "África tuvo 9 plazas para el Mundial ampliado. Varias selecciones tradicionales no lograron el boleto."}
              {conf === "AFC" && "Asia contó con 8 plazas directas + 1 play-off. Estas selecciones compitieron hasta el final."}
              {conf === "CONCACAF" && "Norteamérica, Centroamérica y el Caribe tuvieron 6 plazas directas. Estas son las selecciones que se quedaron cerca."}
              {conf === "OFC" && "Oceanía tuvo 1 plaza directa + 1 play-off. La competencia en la OFC sigue creciendo."}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {teams.map((team) => (
                <article key={team.slug} className="card overflow-hidden p-5">
                  <div className="flex items-center gap-3">
                    <span aria-hidden>
                      <Flag isoCode={team.isoCode} alt={team.name} width={40} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-display text-lg font-bold text-navy dark:text-slate-100">
                        {team.name}
                      </h3>
                      <p className="text-xs text-slate-400">
                        FIFA #{team.fifaRank} · {team.eliminatedIn}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-3">
                    {team.analysis}
                  </p>

                  <div className="mt-4 border-t border-slate-100 pt-3 dark:border-white/5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Jugadores clave
                    </p>
                    <ul className="space-y-1.5">
                      {team.keyPlayers.map((p) => (
                        <li key={p.name} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="inline-block h-5 w-5 rounded-full bg-slate-100 text-center text-[10px] font-bold leading-5 text-slate-500 dark:bg-white/10 dark:text-slate-300">
                            {p.position}
                          </span>
                          <span className="font-medium text-navy dark:text-slate-200">{p.name}</span>
                          <span className="ml-auto">{p.club}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}

      <section className="card bg-gradient-to-br from-slate-50 to-white p-6 dark:from-white/[0.03] dark:to-navy-900">
        <h2 className="font-display text-xl font-bold text-navy dark:text-slate-100">
          ¿Cómo funciona la clasificación?
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          El Mundial 2026 es el primero con 48 selecciones. Las plazas se distribuyeron
          así: UEFA 16, CAF 9, CONCACAF 6, AFC 8, CONMEBOL 6, OFC 1, más 2 play-offs
          intercontinentales. En total participaron más de 200 selecciones de las 6
          confederaciones.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/selecciones" className="btn-ghost text-sm">
            Ver selecciones clasificadas
          </Link>
          <Link href="/metodologia" className="btn-ghost text-sm">
            Sobre los datos
          </Link>
        </div>
      </section>
    </div>
  );
}
