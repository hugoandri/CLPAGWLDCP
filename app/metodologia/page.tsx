import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import DisclaimerBox from "@/components/DisclaimerBox";
import { DISCLAIMER_SHORT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Metodología: cómo calculamos los datos del Mundial 2026",
  description:
    "Cómo construye DataGoal 2026 sus estimaciones: variables del modelo, límites, snapshots de datos y fuentes externas que podrían conectarse en el futuro. No es un sitio de apuestas.",
  alternates: { canonical: "/metodologia" },
};

const VARIABLES = [
  ["Forma reciente", "Resultados de los últimos partidos para captar el momento de cada selección dentro del torneo."],
  ["Ranking relativo", "Posición de cada selección frente al resto, combinando su historial y el contexto del grupo."],
  ["Goles esperados (xG)", "Aproximación a la calidad de las ocasiones generadas y recibidas, más allá del marcador."],
  ["Fortaleza defensiva", "Capacidad para limitar las ocasiones del rival y mantener la solidez en partidos cerrados."],
  ["Dificultad del grupo", "Fuerza media de los rivales: el contexto del grupo cambia la probabilidad de forma significativa."],
];

const SOURCES = [
  ["Calendario oficial FIFA", "Grupos, sedes, horarios y estado de cada partido del Mundial 2026."],
  ["Datos históricos", "Resultados y estadísticas de torneos anteriores para calibrar el modelo."],
  ["Ranking FIFA", "Posición oficial de cada selección como referencia externa."],
  ["Estadísticas del torneo", "Goles, tarjetas, alineaciones y posesión registrados durante la competición."],
];

export default function MetodologiaPage() {
  return (
    <div className="container-page pb-12">
      <PageHeader
        eyebrow="Transparencia"
        title="Metodología"
        description="Creemos en explicar de dónde salen los números. Esto es lo que hace —y lo que no hace— el modelo de DataGoal 2026."
      />

      <div className="mx-auto max-w-3xl space-y-8">
        <DisclaimerBox title="Lo primero: qué NO es DataGoal 2026">
          No es un sitio de apuestas. No vendemos pronósticos ni prometemos
          resultados. Todo el contenido es análisis informativo y estadístico, y
          no constituye consejo de apuestas.
        </DisclaimerBox>

        <section>
          <h2 className="section-title mb-3 text-2xl">Los datos son estimaciones</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Las probabilidades que verás en el sitio son estimaciones, no
            certezas. Reflejan la fuerza relativa de cada selección según un
            modelo; el fútbol mantiene un componente de azar que ningún modelo
            elimina. Un 80% de probabilidad de avanzar significa que, en
            escenarios parecidos, esa selección avanzaría 8 de cada 10 veces:
            también puede quedar fuera.
          </p>
          <p className="mt-3 rounded-xl bg-slate-100 p-4 text-sm text-slate-600 dark:bg-white/[0.03] dark:text-slate-300">
            <strong className="text-navy dark:text-slate-100">Nota sobre los datos:</strong>{" "}
            los grupos, el calendario y los resultados se cargan desde fuentes
            públicas oficiales. Las probabilidades son estimaciones del modelo
            y se actualizan a medida que avanza el torneo. Este sitio no utiliza
            contenido generado automáticamente sin revisión editorial.
          </p>
        </section>

        <section>
          <h2 className="section-title mb-3 text-2xl">Variables del modelo</h2>
          <p className="mb-4 text-slate-600 dark:text-slate-300">
            La estimación de fuerza de cada selección combina cinco variables:
          </p>
          <ul className="space-y-3">
            {VARIABLES.map(([title, desc]) => (
              <li key={title} className="card p-4">
                <p className="font-semibold text-navy dark:text-slate-100">{title}</p>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{desc}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="section-title mb-3 text-2xl">Límites del modelo</h2>
          <ul className="list-disc space-y-2 pl-5 text-slate-600 dark:text-slate-300">
            <li>No anticipa lesiones, expulsiones ni decisiones arbitrales.</li>
            <li>No captura factores emocionales ni el peso de un partido concreto.</li>
            <li>Con muestras cortas, la incertidumbre es alta: son orientaciones, no predicciones exactas.</li>
            <li>Las cuotas de campeón son ilustrativas y no deben usarse para apostar.</li>
          </ul>
        </section>

        <section>
          <h2 className="section-title mb-3 text-2xl">Fuentes de datos</h2>
          <p className="mb-4 text-slate-600 dark:text-slate-300">
            Los datos utilizados en DataGoal Lab provienen de las siguientes fuentes:
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {SOURCES.map(([title, desc]) => (
              <div key={title} className="card p-4">
                <p className="font-semibold text-navy dark:text-slate-100">{title}</p>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="card p-6">
          <h2 className="section-title mb-2 text-xl">Independencia</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">{DISCLAIMER_SHORT}</p>
          <p className="mt-4 text-sm">
            <Link href="/predicciones" className="data-link">
              Ver las predicciones del modelo →
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
