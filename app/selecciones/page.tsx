import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import AdSlot from "@/components/AdSlot";
import SeleccionesClient from "./SeleccionesClient";
import SeoJsonLd from "@/components/SeoJsonLd";
import { teams } from "@/data/teams";
import { collectionPageJsonLd, itemListJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Selecciones del Mundial 2026: perfiles, grupos y datos",
  description:
    "Las 48 selecciones del Mundial 2026 con buscador y filtro por grupo. Ranking interno, probabilidad de avanzar, jugador clave y enlace al perfil completo de cada selección.",
  alternates: { canonical: "/selecciones" },
};

export default function SeleccionesPage() {
  const jsonLd = [
    collectionPageJsonLd({
      name: "Selecciones del Mundial 2026",
      description: metadata.description as string,
      path: "/selecciones",
    }),
    itemListJsonLd(
      teams.map((team) => ({
        name: `${team.name} - Grupo ${team.group}`,
        path: `/selecciones/${team.slug}`,
      })),
      "48 selecciones del Mundial 2026",
    ),
  ];

  return (
    <div className="container-page pb-12">
      <SeoJsonLd data={jsonLd} />
      <PageHeader
        eyebrow="48 selecciones"
        title="Selecciones del Mundial 2026"
        description="Explora las 48 selecciones del torneo. Busca por nombre o filtra por grupo y entra en cada perfil para ver su análisis completo."
      />

      <div className="mb-6">
        <AdSlot slotName="selecciones-top-banner" format="leaderboard" />
      </div>

      <SeleccionesClient />

      <section className="card mt-10 p-6">
        <h2 className="section-title mb-3 text-xl">
          Guía SEO de selecciones del Mundial 2026
        </h2>
        <div className="grid gap-4 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-3">
          <p>
            Cada perfil incluye grupo, calendario, próximos partidos, ranking FIFA,
            probabilidad estimada de avanzar y análisis editorial de fortalezas.
          </p>
          <p>
            Usa el filtro por grupo para revisar rivales directos y abrir las páginas
            individuales de México, Argentina, España, Brasil, Estados Unidos y más.
          </p>
          <p>
            Las páginas se actualizan desde el snapshot local de grupos, resultados y
            partidos cargados para el torneo.
          </p>
        </div>
      </section>
    </div>
  );
}
