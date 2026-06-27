import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import KnockoutBracket from "@/components/KnockoutBracket";
import SeoJsonLd from "@/components/SeoJsonLd";
import { collectionPageJsonLd } from "@/lib/seo";
import { groups } from "@/data/groups";
import { computeStandings } from "@/lib/utils";
import { knockoutRounds as rawKnockoutRounds, type KnockoutMatch, type KnockoutRound } from "@/data/knockout";
import { getTeam } from "@/data/teams";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Eliminatorias Mundial 2026: fase final, cruces y bracket",
  description: "Cuadro de eliminación directa del Mundial 2026: dieciseisavos, octavos, cuartos, semifinales y final.",
  alternates: { canonical: "/eliminatorias" },
};

function getQualifiedTeams() {
  const qualified: Record<string, { position: number; teamSlug: string }[]> = {};
  for (const group of groups) {
    const standings = computeStandings(group.rows);
    qualified[group.id] = standings
      .filter((s) => s.qualifies)
      .map((s) => ({ position: s.position, teamSlug: s.teamSlug }));
  }
  return qualified;
}

function resolveLabel(slug: string | null, defaultLabel: string): string {
  if (!slug) return defaultLabel;
  const team = getTeam(slug);
  return team?.name ?? defaultLabel;
}

// Build proper R32 from group standings
function buildR32(qualified: ReturnType<typeof getQualifiedTeams>): KnockoutMatch[] {
  const pairings = [
    ["1A", "3B/3C/3D"], ["2C", "2D"],
    ["1E", "3A/3C/3D"], ["2A", "2B"],
    ["1C", "3A/3B/3F"], ["2E", "2F"],
    ["1G", "3E/3F/3H"], ["2G", "2H"],
    ["1B", "3A/3E/3F"], ["2I", "2J"],
    ["1K", "3G/3H/3I"], ["2K", "2L"],
    ["1D", "3B/3C/3F"], ["2E", "2F"],
    ["1I", "3J/3K/3L"], ["2I", "2J"],
  ];

  return pairings.map(([homePos, awayLabel], i) => {
    const g1 = homePos.slice(-1);
    const p1 = parseInt(homePos.charAt(0));
    const homeTeam = (qualified[g1] || []).find((t) => t.position === p1);
    const homeSlug = homeTeam?.teamSlug ?? null;
    const homeLabel = resolveLabel(homeSlug, `${p1}° Grupo ${g1}`);

    const awayParts = awayLabel.split("/");
    let awaySlug: string | null = null;
    for (const part of awayParts) {
      const g = part.slice(-1);
      const pos = parseInt(part.charAt(0));
      const t = (qualified[g] || []).find((t) => t.position === pos);
      if (t) { awaySlug = t.teamSlug; break; }
    }
    const resolvedAway = resolveLabel(awaySlug, awayLabel);

    return {
      slug: `r32-${i + 1}`,
      round: "dieciseisavos" as const,
      roundLabel: "Dieciseisavos de final",
      homeSlug,
      awaySlug,
      homeLabel,
      awayLabel: resolvedAway,
      status: (homeTeam && awaySlug ? "upcoming" : "placeholder") as "upcoming" | "placeholder",
      date: undefined,
      time: undefined,
      stadium: undefined,
      city: undefined,
    };
  });
}

export default function EliminatoriasPage() {
  const qualified = getQualifiedTeams();
  const r32 = buildR32(qualified);

  const rounds = rawKnockoutRounds.map((r) => {
    if (r.id === "dieciseisavos") return { ...r, matches: r32 };
    return r;
  });

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
