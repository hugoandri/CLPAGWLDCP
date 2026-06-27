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

/** Returns the winner of a finished match, or a placeholder label. */
function winner(m: KnockoutMatch): { slug: string | null; label: string } {
  if (m.status !== "finished") return { slug: null, label: `Gan. ${m.slug.toUpperCase()}` };
  const homeWins = (m.homeScore ?? 0) > (m.awayScore ?? 0);
  return homeWins
    ? { slug: m.homeSlug, label: m.homeLabel }
    : { slug: m.awaySlug, label: m.awayLabel };
}

/** Returns the loser of a finished match (for 3rd-place). */
function loser(m: KnockoutMatch): { slug: string | null; label: string } {
  if (m.status !== "finished") return { slug: null, label: `Per. ${m.slug.toUpperCase()}` };
  const homeWins = (m.homeScore ?? 0) > (m.awayScore ?? 0);
  return homeWins
    ? { slug: m.awaySlug, label: m.awayLabel }
    : { slug: m.homeSlug, label: m.homeLabel };
}

// ── R32: built from group standings + results stored in knockout.ts ───────────

function buildR32(qualified: ReturnType<typeof getQualifiedTeams>): KnockoutMatch[] {
  // Official World Cup 2026 R32 pairings (based on FIFA bracket)
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

  // Stored results in knockout.ts (homeScore / awayScore / status = "finished")
  const storedR32 = rawKnockoutRounds.find((r) => r.id === "dieciseisavos")?.matches ?? [];

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

    // Overlay stored result if this match is finished
    const stored = storedR32[i];
    const isFinished = stored?.status === "finished";

    return {
      slug: `r32-${i + 1}`,
      round: "dieciseisavos" as const,
      roundLabel: "Dieciseisavos de final",
      homeSlug,
      awaySlug,
      homeLabel,
      awayLabel: awayLabelResolved,
      homeScore: isFinished ? stored.homeScore : undefined,
      awayScore: isFinished ? stored.awayScore : undefined,
      status: isFinished ? "finished" : (homeTeam && awaySlug ? "upcoming" : "placeholder"),
      date: stored?.date,
      time: stored?.time,
      stadium: stored?.stadium,
      city: stored?.city,
    } as KnockoutMatch;
  });
}

// ── Generic round builder: derives next round from winners of prev ─────────────

function buildNextRound(
  prev: KnockoutMatch[],
  round: KnockoutMatch["round"],
  roundLabel: string,
  slugPrefix: string,
  stored: KnockoutMatch[],
): KnockoutMatch[] {
  return Array.from({ length: Math.floor(prev.length / 2) }, (_, i) => {
    const home = winner(prev[i * 2]);
    const away = winner(prev[i * 2 + 1]);

    const storedMatch = stored[i];
    const isFinished = storedMatch?.status === "finished";

    return {
      slug: `${slugPrefix}-${i + 1}`,
      round,
      roundLabel,
      homeSlug: home.slug,
      awaySlug: away.slug,
      homeLabel: home.slug ? resolveLabel(home.slug, home.label) : home.label,
      awayLabel: away.slug ? resolveLabel(away.slug, away.label) : away.label,
      homeScore: isFinished ? storedMatch.homeScore : undefined,
      awayScore: isFinished ? storedMatch.awayScore : undefined,
      status: isFinished ? "finished" : (home.slug && away.slug ? "upcoming" : "placeholder"),
      date: storedMatch?.date,
      time: storedMatch?.time,
      stadium: storedMatch?.stadium,
      city: storedMatch?.city,
    } as KnockoutMatch;
  });
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function EliminatoriasPage() {
  const qualified = getQualifiedTeams();

  // Stored results per round (for overlaying scores)
  const storedByRound = Object.fromEntries(
    rawKnockoutRounds.map((r) => [r.id, r.matches])
  );

  // Build each round by cascading winners from the previous
  const r32 = buildR32(qualified);
  const r16 = buildNextRound(r32, "octavos", "Octavos de final", "r16", storedByRound["octavos"] ?? []);
  const qf  = buildNextRound(r16, "cuartos", "Cuartos de final",  "qf",  storedByRound["cuartos"] ?? []);
  const sf  = buildNextRound(qf,  "semifinales", "Semifinales",   "sf",  storedByRound["semifinales"] ?? []);

  // 3rd place: losers of SF
  const stored3rd = storedByRound["tercer-puesto"]?.[0];
  const third3rd = loser(sf[0]);
  const third4th = loser(sf[1]);
  const thirdPlace: KnockoutMatch = {
    slug: "3rd",
    round: "tercer-puesto",
    roundLabel: "Tercer puesto",
    homeSlug: third3rd.slug,
    awaySlug: third4th.slug,
    homeLabel: third3rd.slug ? resolveLabel(third3rd.slug, third3rd.label) : third3rd.label,
    awayLabel: third4th.slug ? resolveLabel(third4th.slug, third4th.label) : third4th.label,
    homeScore: stored3rd?.status === "finished" ? stored3rd.homeScore : undefined,
    awayScore: stored3rd?.status === "finished" ? stored3rd.awayScore : undefined,
    status: stored3rd?.status === "finished" ? "finished" : (third3rd.slug && third4th.slug ? "upcoming" : "placeholder"),
    date: stored3rd?.date,
    time: stored3rd?.time,
    stadium: stored3rd?.stadium,
    city: stored3rd?.city,
  };

  // Final: winners of SF
  const storedFinal = storedByRound["final"]?.[0];
  const finalHome = winner(sf[0]);
  const finalAway = winner(sf[1]);
  const finalMatch: KnockoutMatch = {
    slug: "final",
    round: "final",
    roundLabel: "Final",
    homeSlug: finalHome.slug,
    awaySlug: finalAway.slug,
    homeLabel: finalHome.slug ? resolveLabel(finalHome.slug, finalHome.label) : finalHome.label,
    awayLabel: finalAway.slug ? resolveLabel(finalAway.slug, finalAway.label) : finalAway.label,
    homeScore: storedFinal?.status === "finished" ? storedFinal.homeScore : undefined,
    awayScore: storedFinal?.status === "finished" ? storedFinal.awayScore : undefined,
    status: storedFinal?.status === "finished" ? "finished" : (finalHome.slug && finalAway.slug ? "upcoming" : "placeholder"),
    date: storedFinal?.date ?? "2026-07-19",
    time: storedFinal?.time ?? "15:00",
    stadium: storedFinal?.stadium ?? "AT&T Stadium",
    city: storedFinal?.city ?? "Dallas",
  };

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
