import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import KnockoutBracket from "@/components/KnockoutBracket";
import SeoJsonLd from "@/components/SeoJsonLd";
import { collectionPageJsonLd } from "@/lib/seo";
import { buildKnockoutRounds } from "@/lib/knockout-utils";
import { fetchAllFIFAResults } from "@/lib/live";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Eliminatorias Mundial 2026: fase final, cruces y bracket",
  description: "Cuadro de eliminación directa del Mundial 2026: dieciseisavos, octavos, cuartos, semifinales y final.",
  alternates: { canonical: "/eliminatorias" },
};

export default async function EliminatoriasPage() {
  const fifaResults = await fetchAllFIFAResults();
  const rounds = await buildKnockoutRounds(fifaResults);

  const jsonLd = collectionPageJsonLd({
    name: "Eliminatorias Mundial 2026",
    description: "Cuadro de eliminación directa del Mundial 2026",
    path: "/eliminatorias",
  });

  return (
    <div className="container-page pb-12">
      <SeoJsonLd data={jsonLd} />
      <PageHeader
        eyebrow="Mundial 2026"
        title="Fase eliminatoria"
        description="Cruces de eliminación directa: dieciseisavos, octavos, cuartos, semifinales y final."
      />
      <KnockoutBracket rounds={rounds} />
      <section className="mt-10 flex flex-wrap gap-3 border-t border-slate-200 pt-8 dark:border-white/10">
        <Link href="/tabla" className="btn-ghost text-sm">Ver tabla de grupos</Link>
        <Link href="/partidos" className="btn-ghost text-sm">Calendario de partidos</Link>
        <Link href="/predicciones" className="btn-ghost text-sm">Predicciones del torneo</Link>
      </section>
    </div>
  );
}
