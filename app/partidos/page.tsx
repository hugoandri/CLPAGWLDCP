import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import AdSlot from "@/components/AdSlot";
import DisclaimerBox from "@/components/DisclaimerBox";
import PartidosClient from "./PartidosClient";
import { DISCLAIMER_BETTING } from "@/lib/site";
import SeoJsonLd from "@/components/SeoJsonLd";
import { matches } from "@/data/matches";
import { getTeam } from "@/data/teams";
import { collectionPageJsonLd, itemListJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Partidos del Mundial 2026: calendario, horarios y probabilidades",
  description:
    "Calendario completo del Mundial 2026 con filtros por fecha, grupo, selección y estado. Horarios, estadios, marcadores y probabilidades estadísticas de cada partido.",
  alternates: { canonical: "/partidos" },
};

export default function PartidosPage() {
  const jsonLd = [
    collectionPageJsonLd({
      name: "Partidos del Mundial 2026",
      description: metadata.description as string,
      path: "/partidos",
    }),
    itemListJsonLd(
      matches.map((match) => {
        const home = getTeam(match.homeSlug);
        const away = getTeam(match.awaySlug);
        return {
          name: `${home?.name ?? match.homeSlug} vs ${away?.name ?? match.awaySlug} - Grupo ${match.group}`,
          path: `/partidos/${match.slug}`,
        };
      }),
      "Calendario de partidos del Mundial 2026",
    ),
  ];

  return (
    <div className="container-page pb-12">
      <SeoJsonLd data={jsonLd} />
      <PageHeader
        eyebrow="Calendario"
        title="Partidos del Mundial 2026"
        description="Filtra por fecha, grupo, selección o estado. Cada partido incluye horario, estadio y probabilidades estadísticas estimadas."
      />

      <div className="mb-6">
        <AdSlot slotName="partidos-top-banner" format="leaderboard" />
      </div>

      <PartidosClient />

      <section className="card mt-10 p-6">
        <h2 className="section-title mb-3 text-xl">
          Calendario del Mundial 2026: cómo encontrar cada partido
        </h2>
        <div className="grid gap-4 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-3">
          <p>
            Esta página reúne el calendario de fase de grupos con fecha, hora,
            sede, marcador si ya existe y probabilidad estadística de cada cruce.
          </p>
          <p>
            Puedes buscar por selección o filtrar por grupo para encontrar rápido
            partidos como México vs Sudáfrica, Brasil vs Marruecos o Argentina vs Austria.
          </p>
          <p>
            Cada partido tiene una URL propia con previa, comparativa de selecciones,
            qué mirar y enlaces a los perfiles de ambos equipos.
          </p>
        </div>
      </section>

      <DisclaimerBox className="mt-8">{DISCLAIMER_BETTING}</DisclaimerBox>
    </div>
  );
}
