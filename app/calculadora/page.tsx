import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import AdSlot from "@/components/AdSlot";
import CalculadoraClient from "./CalculadoraClient";
import SeoJsonLd from "@/components/SeoJsonLd";
import { siteConfig } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Calculadora de clasificación del Mundial 2026",
  description:
    "Simula los resultados de la última jornada y descubre qué selecciones se clasifican. Calculadora interactiva de la fase de grupos del Mundial 2026: cambia los marcadores y la tabla se recalcula al instante.",
  alternates: { canonical: "/calculadora" },
};

export default function CalculadoraPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Calculadora de clasificación del Mundial 2026",
    description: metadata.description,
    url: absoluteUrl("/calculadora"),
    applicationCategory: "SportsApplication",
    operatingSystem: "Web",
    inLanguage: "es",
    publisher: {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <div className="container-page pb-12">
      <SeoJsonLd data={jsonLd} />
      <PageHeader
        eyebrow="Herramienta interactiva"
        title="Calculadora de clasificación"
        description="Elige un grupo, ajusta los marcadores y mira en tiempo real qué selecciones avanzan a la fase eliminatoria."
      />

      <div className="mb-6">
        <AdSlot slotName="calculadora-top-banner" format="leaderboard" />
      </div>

      <CalculadoraClient />

      <section className="card mt-8 p-6">
        <h2 className="section-title mb-3 text-xl">Cómo usar la calculadora</h2>
        <ol className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li>
            <strong className="text-navy dark:text-slate-100">1.</strong> Selecciona
            el grupo que quieres analizar en el desplegable.
          </li>
          <li>
            <strong className="text-navy dark:text-slate-100">2.</strong> Cambia los
            goles de cada partido con los botones − / + o escribiendo el marcador.
          </li>
          <li>
            <strong className="text-navy dark:text-slate-100">3.</strong> La tabla y
            los clasificados se actualizan automáticamente con la lógica oficial
            (puntos y diferencia de goles).
          </li>
        </ol>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Los marcadores iniciales son una proyección del modelo; modifícalos para
          explorar tus propios escenarios.
        </p>
      </section>
    </div>
  );
}
