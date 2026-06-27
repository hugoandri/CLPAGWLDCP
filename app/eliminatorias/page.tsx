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
import { fetchAllFIFAResults, type FIFAMatchResult } from "@/lib/live";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Eliminatorias Mundial 2026: fase final, cruces y bracket",
  description: "Cuadro de eliminación directa del Mundial 2026: dieciseisavos, octavos, cuartos, semifinales y final.",
  alternates: { canonical: "/eliminatorias" },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

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
  return getTeam(slug)?.name ?? defaultLabel;
}

/**
 * Overlays a FIFA API result onto a computed bracket match.
 * Handles both direct ({home}-vs-{away}) and reversed key lookups.
 */
function applyFIFAResult(
  match: KnockoutMatch,
  fifaResults: Map<string, FIFAMatchResult>,
): KnockoutMatch {
  if (!match.homeSlug || !match.awaySlug) return match;

  const directKey = `${match.homeSlug}-vs-${match.awaySlug}`;
  const reverseKey = `${match.awaySlug}-vs-${match.homeSlug}`;

  const direct = fifaResults.get(directKey);
  if (direct) {
    return {
      ...match,
      homeScore: direct.homeScore,
      awayScore: direct.awayScore,
      homePenalties: direct.homePenalties,
      awayPenalties: direct.awayPenalties,
      status: direct.status === "finished" ? "finished" : "upcoming",
    };
  }

  const reversed = fifaResults.get(reverseKey);
  if (reversed) {
    // FIFA has the teams in opposite order — swap the scores and penalties
    return {
      ...match,
      homeScore: reversed.awayScore,
      awayScore: reversed.homeScore,
      homePenalties: reversed.awayPenalties,
      awayPenalties: reversed.homePenalties,
      status: reversed.status === "finished" ? "finished" : "upcoming",
    };
  }

  return match;
}

/** Returns the winner of a finished match, or a placeholder label.
 *  Handles extra time and penalty shootouts correctly. */
function winner(m: KnockoutMatch): { slug: string | null; label: string } {
  if (m.status !== "finished") return { slug: null, label: `Gan. ${m.slug.toUpperCase()}` };
  // Penalties: use shootout score to break the tie
  const homeWins =
    m.homePenalties !== undefined && m.awayPenalties !== undefined
      ? m.homePenalties > m.awayPenalties
      : (m.homeScore ?? 0) > (m.awayScore ?? 0);
  return homeWins
    ? { slug: m.homeSlug, label: m.homeLabel }
    : { slug: m.awaySlug, label: m.awayLabel };
}

/** Returns the loser of a finished match (for 3rd-place).
 *  Handles penalty shootouts correctly. */
function loser(m: KnockoutMatch): { slug: string | null; label: string } {
  if (m.status !== "finished") return { slug: null, label: `Per. ${m.slug.toUpperCase()}` };
  const homeWins =
    m.homePenalties !== undefined && m.awayPenalties !== undefined
      ? m.homePenalties > m.awayPenalties
      : (m.homeScore ?? 0) > (m.awayScore ?? 0);
  return homeWins
    ? { slug: m.awaySlug, label: m.awayLabel }
    : { slug: m.homeSlug, label: m.homeLabel };
}

// ── R32: built from group standings ──────────────────────────────────────────

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
    const awayLabelResolved = resolveLabel(awaySlug, awayLabel);

    return {
      slug: `r32-${i + 1}`,
      round: "dieciseisavos" as const,
      roundLabel: "Dieciseisavos de final",
      homeSlug,
      awaySlug,
      homeLabel,
      awayLabel: awayLabelResolved,
      status: homeSlug && awaySlug ? "upcoming" : "placeholder",
    } as KnockoutMatch;
  });
}

// ── Generic round builder: derives next round from winners of prev ─────────────

function buildNextRound(
  prev: KnockoutMatch[],
  round: KnockoutMatch["round"],
  roundLabel: string,
  slugPrefix: string,
): KnockoutMatch[] {
  return Array.from({ length: Math.floor(prev.length / 2) }, (_, i) => {
    const home = winner(prev[i * 2]);
    const away = winner(prev[i * 2 + 1]);
    return {
      slug: `${slugPrefix}-${i + 1}`,
      round,
      roundLabel,
      homeSlug: home.slug,
      awaySlug: away.slug,
      homeLabel: home.slug ? resolveLabel(home.slug, home.label) : home.label,
      awayLabel: away.slug ? resolveLabel(away.slug, away.label) : away.label,
      status: home.slug && away.slug ? "upcoming" : "placeholder",
    } as KnockoutMatch;
  });
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function EliminatoriasPage() {
  const [qualified, fifaResults] = await Promise.all([
    Promise.resolve(getQualifiedTeams()),
    fetchAllFIFAResults(),
  ]);

  // Build each round, then overlay real scores from the FIFA API
  const r32 = buildR32(qualified).map((m) => applyFIFAResult(m, fifaResults));
  const r16 = buildNextRound(r32, "octavos", "Octavos de final", "r16")
                .map((m) => applyFIFAResult(m, fifaResults));
  const qf  = buildNextRound(r16, "cuartos", "Cuartos de final", "qf")
                .map((m) => applyFIFAResult(m, fifaResults));
  const sf  = buildNextRound(qf, "semifinales", "Semifinales", "sf")
                .map((m) => applyFIFAResult(m, fifaResults));

  // 3rd place: losers of SF
  const third3rd = loser(sf[0]);
  const third4th = loser(sf[1]);
  const thirdPlace: KnockoutMatch = applyFIFAResult({
    slug: "3rd",
    round: "tercer-puesto",
    roundLabel: "Tercer puesto",
    homeSlug: third3rd.slug,
    awaySlug: third4th.slug,
    homeLabel: third3rd.slug ? resolveLabel(third3rd.slug, third3rd.label) : third3rd.label,
    awayLabel: third4th.slug ? resolveLabel(third4th.slug, third4th.label) : third4th.label,
    status: third3rd.slug && third4th.slug ? "upcoming" : "placeholder",
  }, fifaResults);

  // Final: winners of SF
  const finalHome = winner(sf[0]);
  const finalAway = winner(sf[1]);

  // Keep static date/stadium from knockout.ts for the final
  const storedFinal = rawKnockoutRounds.find((r) => r.id === "final")?.matches[0];
  const finalMatch: KnockoutMatch = applyFIFAResult({
    slug: "final",
    round: "final",
    roundLabel: "Final",
    homeSlug: finalHome.slug,
    awaySlug: finalAway.slug,
    homeLabel: finalHome.slug ? resolveLabel(finalHome.slug, finalHome.label) : finalHome.label,
    awayLabel: finalAway.slug ? resolveLabel(finalAway.slug, finalAway.label) : finalAway.label,
    status: finalHome.slug && finalAway.slug ? "upcoming" : "placeholder",
    date: storedFinal?.date,
    time: storedFinal?.time,
    stadium: storedFinal?.stadium,
    city: storedFinal?.city,
  }, fifaResults);

  const rounds: KnockoutRound[] = [
    { id: "dieciseisavos", label: "Dieciseisavos de final", matches: r32 },
    { id: "octavos",       label: "Octavos de final",       matches: r16 },
    { id: "cuartos",       label: "Cuartos de final",       matches: qf  },
    { id: "semifinales",   label: "Semifinales",            matches: sf  },
    { id: "tercer-puesto", label: "Tercer puesto",          matches: [thirdPlace] },
    { id: "final",         label: "Final",                  matches: [finalMatch] },
  ];

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
