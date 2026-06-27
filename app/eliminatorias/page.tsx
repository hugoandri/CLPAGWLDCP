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
import Flag from "@/components/Flag";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Eliminatorias Mundial 2026: fase final, cruces y bracket",
  description:
    "Cuadro de eliminación directa del Mundial 2026: dieciseisavos, octavos, cuartos, semifinales y final. Resultados en vivo y próximos cruces.",
  alternates: { canonical: "/eliminatorias" },
};

// Compute which teams qualify from each group (top 2)
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

// Build R32 matchups from group standings
function buildR32(qualified: ReturnType<typeof getQualifiedTeams>): KnockoutMatch[] {
  // For 48 teams (12 groups of 4): top 2 from each group + 8 best 3rd places = 32 teams
  // Standard R32 pairing based on group position
  const pairings: { home: string; away: string }[] = [
    { home: "1A", away: "3B/3C/3D" },
    { home: "1C", away: "2C/2D" },
    { home: "1E", away: "3A/3C/3D" },
    { home: "2A", away: "2B" },
    { home: "1C", away: "3A/3B/3F" },
    { home: "2E", away: "2F" },
    { home: "1G", away: "3E/3F/3H" },
    { home: "2G", away: "2H" },
    { home: "1B", away: "3A/3E/3F" },
    { home: "2I", away: "2J" },
    { home: "1K", away: "3G/3H/3I" },
    { home: "2K", away: "2L" },
    { home: "1D", away: "3B/3C/3F" },
    { home: "2E", away: "2F" },
    { home: "1I", away: "3J/3K/3L" },
    { home: "2I", away: "2J" },
  ];

  return pairings.map((p, i) => {
    const homePos = p.home;
    const groupId1 = homePos.slice(-1);
    const pos1 = parseInt(homePos.charAt(0));
    const groupTeams1 = qualified[groupId1] || [];
    const homeTeam = groupTeams1.find((t) => t.position === pos1);
    const homeLabel = homeTeam ? (getTeam(homeTeam.teamSlug)?.name ?? `1° Grupo ${groupId1}`) : `1° Grupo ${groupId1}`;

    const awayLabel = p.away;
    // Try to find the specific team for the away slot
    // For "2C/2D" style, check both groups
    const awayParts = p.away.split("/");
    let awayTeamSlug: string | null = null;
    for (const part of awayParts) {
      const g = part.slice(-1);
      const pos = part.charAt(0) === "3" ? 3 : 2;
      const groupTeams = qualified[g] || [];
      // For position 3, we need best 3rd places - simplified
      const t = groupTeams.find((t) => t.position === pos);
      if (t) { awayTeamSlug = t.teamSlug; break; }
    }
    const resolvedAway = awayTeamSlug ? (getTeam(awayTeamSlug)?.name ?? awayLabel) : awayLabel;

    return {
      slug: `r32-${i + 1}`,
      round: "dieciseisavos" as const,
      roundLabel: "Dieciseisavos de final",
      homeSlug: homeTeam?.teamSlug ?? null,
      awaySlug: awayTeamSlug,
      homeLabel,
      awayLabel: resolvedAway,
      status: (homeTeam && awayTeamSlug ? "upcoming" : "placeholder") as "upcoming" | "placeholder",
    };
  });
}

function hasRealMatches(round: KnockoutRound): boolean {
  return round.matches.some((m) => m.status !== "placeholder" && m.homeSlug !== null);
}

export default function EliminatoriasPage() {
  const qualified = getQualifiedTeams();
  const r32 = buildR32(qualified);

  // Replace the first round with computed data
  const rounds = rawKnockoutRounds.map((r) => {
    if (r.id === "dieciseisavos") {
      return { ...r, matches: r32 };
    }
    return r;
  });

  const visibleRounds = rounds.filter(hasRealMatches);
  const futureRounds = rounds.filter((r) => !hasRealMatches(r));

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

      {visibleRounds.length > 0 ? (
        <KnockoutBracket rounds={visibleRounds} />
      ) : (
        <div className="card p-10 text-center">
          <p className="text-lg font-semibold text-navy dark:text-slate-100">
            La fase de grupos aún está en curso
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Los cruces de eliminación directa se definirán cuando finalice la fase de grupos.
            Mientras tanto, seguí la tabla de posiciones en{" "}
            <Link href="/tabla" className="text-pitch-600 hover:underline dark:text-pitch-400">
              Tabla de grupos
            </Link>.
          </p>
        </div>
      )}

      {futureRounds.length > 0 && (
        <section className="mt-10">
          <h2 className="section-title mb-4 text-xl">Próximas rondas</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {futureRounds.map((round) => (
              <div key={round.id} className="card p-5">
                <h3 className="font-display text-base font-bold text-navy dark:text-slate-100">
                  {round.label}
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  {round.matches.length} partido{round.matches.length !== 1 ? "s" : ""}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Se define cuando avance la fase de grupos
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10 flex flex-wrap gap-3 border-t border-slate-200 pt-8 dark:border-white/10">
        <Link href="/tabla" className="btn-ghost text-sm">Ver tabla de grupos</Link>
        <Link href="/partidos" className="btn-ghost text-sm">Calendario de partidos</Link>
        <Link href="/predicciones" className="btn-ghost text-sm">Predicciones del torneo</Link>
      </section>
    </div>
  );
}
