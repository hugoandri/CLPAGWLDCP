import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import AdSlot from "@/components/AdSlot";
import DisclaimerBox from "@/components/DisclaimerBox";
import StatBar from "@/components/StatBar";
import PrediccionesClient from "./PrediccionesClient";
import { predictionsRankedBy, getPrediction } from "@/data/predictions";
import { getTeam } from "@/data/teams";
import SeoJsonLd from "@/components/SeoJsonLd";
import { collectionPageJsonLd, itemListJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Predicciones del Mundial 2026: probabilidades por selección",
  description:
    "Predicciones estadísticas del Mundial 2026: probabilidad de pasar de grupo, llegar a octavos, semifinal, final y ganar el torneo para cada selección. Estimaciones, no certezas.",
  alternates: { canonical: "/predicciones" },
};

const METHODOLOGY = [
  {
    title: "Forma reciente",
    desc: "Resultados de los últimos partidos. Premia las rachas y penaliza la irregularidad.",
  },
  {
    title: "Ranking relativo",
    desc: "Posición de la selección frente al resto, combinando histórico y nivel actual.",
  },
  {
    title: "Goles esperados (xG)",
    desc: "Aproximación a la calidad de las ocasiones generadas, no solo a los goles marcados.",
  },
  {
    title: "Fortaleza defensiva",
    desc: "Solidez atrás: ocasiones concedidas y capacidad de mantener la portería a cero.",
  },
  {
    title: "Dificultad del grupo",
    desc: "Fuerza media de los rivales de grupo. Un mismo nivel rinde distinto según el contexto.",
  },
];

export default function PrediccionesPage() {
  // La favorita al título, como ejemplo de "metodología en acción".
  const topWinner = predictionsRankedBy("winner")[0];
  const topTeam = getTeam(topWinner.teamSlug);
  const factors = getPrediction(topWinner.teamSlug)?.factors;
  const jsonLd = [
    collectionPageJsonLd({
      name: "Predicciones del Mundial 2026",
      description: metadata.description as string,
      path: "/predicciones",
    }),
    itemListJsonLd(
      predictionsRankedBy("winner").map((prediction) => {
        const team = getTeam(prediction.teamSlug);
        return {
          name: `${team?.name ?? prediction.teamSlug}: ${prediction.winner}% campeón`,
          path: team ? `/selecciones/${team.slug}` : "/predicciones",
        };
      }),
      "Ranking de probabilidades del Mundial 2026",
    ),
  ];

  return (
    <div className="container-page pb-12">
      <SeoJsonLd data={jsonLd} />
      <PageHeader
        eyebrow="Modelo DataGoal"
        title="Predicciones del Mundial 2026"
        description="Probabilidad estimada de cada selección de superar cada ronda. Son estimaciones estadísticas basadas en datos, no certezas."
      />

      <DisclaimerBox title="Son estimaciones, no certezas" className="mb-6">
        Los porcentajes reflejan probabilidades del modelo, no resultados
        garantizados. El fútbol mantiene un componente de azar que ningún modelo
        elimina. Este contenido no constituye consejo de apuestas.
      </DisclaimerBox>

      <div className="mb-8">
        <AdSlot slotName="predicciones-top-banner" format="leaderboard" />
      </div>

      <PrediccionesClient />

      {/* Metodología */}
      <section className="mt-12">
        <p className="eyebrow">Cómo lo calculamos</p>
        <h2 className="section-title mt-2">Metodología del modelo</h2>
        <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
          El modelo combina cinco variables para estimar la fuerza relativa de
          cada selección y, a partir de ahí, su probabilidad de avanzar en cada
          ronda.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {METHODOLOGY.map((m, i) => (
            <div key={m.title} className="card p-5">
              <span className="stat-num text-sm font-bold text-pitch-600 dark:text-pitch-300">
                0{i + 1}
              </span>
              <h3 className="mt-2 font-display text-lg font-bold text-navy dark:text-slate-100">
                {m.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {m.desc}
              </p>
            </div>
          ))}

          {/* Metodología en acción: desglose de la favorita */}
          {topTeam && factors && (
            <div className="card border-pitch/30 bg-pitch/[0.03] p-5 sm:col-span-2 lg:col-span-1">
              <p className="eyebrow">Ejemplo</p>
              <h3 className="mt-2 flex items-center gap-2 font-display text-lg font-bold text-navy dark:text-slate-100">
                <span aria-hidden>{topTeam.flag}</span> {topTeam.name}
              </h3>
              <div className="mt-3 space-y-2.5">
                <StatBar label="Forma reciente" value={factors.form} />
                <StatBar label="Ranking relativo" value={factors.ranking} />
                <StatBar label="Goles esperados" value={factors.xg} />
                <StatBar label="Fortaleza defensiva" value={factors.defense} />
                <StatBar label="Dificultad del grupo" value={factors.groupDifficulty} tone="gold" />
              </div>
            </div>
          )}
        </div>

        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          ¿Quieres más detalle sobre fuentes y límites?{" "}
          <Link href="/metodologia" className="data-link">
            Lee la metodología completa
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
