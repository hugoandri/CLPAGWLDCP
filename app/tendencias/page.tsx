import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import AdSlot from "@/components/AdSlot";
import TendenciasClient from "./TendenciasClient";
import SeoJsonLd from "@/components/SeoJsonLd";
import { getArticlesWithDetail } from "@/data/articles";
import { collectionPageJsonLd, itemListJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Tendencias del Mundial 2026: análisis y datos virales",
  description:
    "Análisis, sorpresas y herramientas del Mundial 2026: qué selecciones rinden por encima de su ranking, qué necesita cada selección para clasificar y la calculadora de grupos.",
  alternates: { canonical: "/tendencias" },
};

export default function TendenciasPage() {
  const articles = getArticlesWithDetail();
  const jsonLd = [
    collectionPageJsonLd({
      name: "Tendencias del Mundial 2026",
      description: metadata.description as string,
      path: "/tendencias",
    }),
    itemListJsonLd(
      articles.map((article) => ({
        name: article.title,
        path: `/tendencias/${article.slug}`,
      })),
      "Artículos y tendencias del Mundial 2026",
    ),
  ];

  return (
    <div className="container-page pb-12">
      <SeoJsonLd data={jsonLd} />
      <PageHeader
        eyebrow="Editorial · Datos"
        title="Tendencias del Mundial 2026"
        description="Lo que cuentan los números: sorpresas, escenarios de clasificación y herramientas para entender el torneo."
      />

      <div className="mb-6">
        <AdSlot slotName="tendencias-top-banner" format="leaderboard" />
      </div>

      <TendenciasClient />

      <section className="card mt-10 p-6">
        <h2 className="section-title mb-3 text-xl">
          Análisis para búsquedas del Mundial 2026
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          En Tendencias agrupamos respuestas buscables sobre clasificación,
          escenarios de grupo, selecciones sorpresa, ranking de rendimiento y
          dificultad del calendario. Cada artículo está escrito para explicar una
          pregunta concreta del torneo con datos, contexto y enlaces a páginas de
          partidos, tablas y selecciones.
        </p>
      </section>
    </div>
  );
}
