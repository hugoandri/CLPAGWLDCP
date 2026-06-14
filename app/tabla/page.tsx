import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import AdSlot from "@/components/AdSlot";
import TablaClient from "./TablaClient";
import SeoJsonLd from "@/components/SeoJsonLd";
import { groups } from "@/data/groups";
import { collectionPageJsonLd, itemListJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Tabla del Mundial 2026: posiciones por grupo en directo",
  description:
    "Tabla de posiciones del Mundial 2026 por grupos: puntos, partidos jugados, ganados, empatados, perdidos, goles a favor y en contra y diferencia. Clasificación actualizada de los 12 grupos.",
  alternates: { canonical: "/tabla" },
};

export default function TablaPage() {
  const jsonLd = [
    collectionPageJsonLd({
      name: "Tabla del Mundial 2026",
      description: metadata.description as string,
      path: "/tabla",
    }),
    itemListJsonLd(
      groups.map((group) => ({
        name: group.label,
        path: "/tabla",
      })),
      "Tablas por grupo del Mundial 2026",
    ),
  ];

  return (
    <div className="container-page pb-12">
      <SeoJsonLd data={jsonLd} />
      <PageHeader
        eyebrow="Clasificación"
        title="Tabla del Mundial 2026"
        description="Posiciones de los 12 grupos. Los dos primeros de cada grupo (en verde) avanzan de forma directa a la fase eliminatoria."
      />

      <div className="mb-6">
        <AdSlot slotName="tabla-top-banner" format="leaderboard" />
      </div>

      <TablaClient />

      {/* Explicación del formato */}
      <section className="card mt-10 p-6">
        <h2 className="section-title mb-4 text-xl">
          Cómo funciona la clasificación del Mundial 2026
        </h2>
        <div className="grid gap-4 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
          <div>
            <h3 className="mb-1 font-semibold text-navy dark:text-slate-100">
              Formato ampliado a 48 selecciones
            </h3>
            <p>
              Por primera vez participan 48 selecciones repartidas en 12 grupos
              (A–L) de cuatro equipos. Cada selección juega tres partidos en la
              fase de grupos.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-navy dark:text-slate-100">
              Quién avanza
            </h3>
            <p>
              Pasan a la fase eliminatoria los dos primeros de cada grupo más los
              ocho mejores terceros, formando un cuadro de 32 equipos
              (dieciseisavos de final).
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-navy dark:text-slate-100">
              Criterios de desempate
            </h3>
            <p>
              En caso de empate a puntos se aplican, por orden: diferencia de
              goles, goles a favor y resultado entre los implicados. En esta
              tabla se ordena por puntos, diferencia de goles y goles a favor.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-navy dark:text-slate-100">
              Puntuación
            </h3>
            <p>
              Victoria: 3 puntos · Empate: 1 punto · Derrota: 0 puntos. ¿Quieres
              simular escenarios? Usa nuestra{" "}
              <a href="/calculadora" className="data-link">
                calculadora de clasificación
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
