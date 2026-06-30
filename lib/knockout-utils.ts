import fs from "node:fs";
import path from "node:path";
import { computeStandings } from "@/lib/utils";
import { groups } from "@/data/groups";
import { knockoutRounds as rawKnockoutRounds, type KnockoutMatch, type KnockoutRound } from "@/data/knockout";
import { getTeam } from "@/data/teams";
import { fetchAllFIFAResults, type FIFAMatchResult } from "@/lib/live";

interface FIFAEntry {
  matchNumber: number;
  date?: string;
  homeSlug: string | null;
  awaySlug: string | null;
  homeLabel: string | null;
  awayLabel: string | null;
  homeScore?: number | null;
  awayScore?: number | null;
  homePenalties?: number | null;
  awayPenalties?: number | null;
  status: string;
  stadium?: string | null;
  city?: string | null;
}

interface FIFARounds {
  dieciseisavos: FIFAEntry[];
  octavos: FIFAEntry[];
  cuartos: FIFAEntry[];
  semifinales: FIFAEntry[];
  "tercer-puesto": FIFAEntry[];
  final: FIFAEntry[];
}

const ROUND_ORDER = ["dieciseisavos", "octavos", "cuartos", "semifinales", "tercer-puesto", "final"] as const;

function resolveLabel(slug: string | null, defaultLabel: string): string {
  if (!slug) return defaultLabel;
  return getTeam(slug)?.name ?? defaultLabel;
}

function winner(m: KnockoutMatch): { slug: string | null; label: string } {
  if (m.status !== "finished") return { slug: null, label: `Gan. ${m.slug.toUpperCase()}` };
  const homeWins =
    m.homePenalties !== undefined && m.awayPenalties !== undefined
      ? m.homePenalties > m.awayPenalties
      : (m.homeScore ?? 0) > (m.awayScore ?? 0);
  return homeWins
    ? { slug: m.homeSlug, label: m.homeLabel }
    : { slug: m.awaySlug, label: m.awayLabel };
}

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

function loadFIFARounds(): FIFARounds | null {
  try {
    const p = path.join(process.cwd(), "data/knockout-fifa.json");
    const data = JSON.parse(fs.readFileSync(p, "utf-8"));
    return data.rounds ?? null;
  } catch {
    return null;
  }
}

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

export async function buildKnockoutRounds(fifaResults: Map<string, FIFAMatchResult>): Promise<KnockoutRound[]> {
  const fifaRounds = loadFIFARounds();

  if (fifaRounds) {
    return buildFromFIFA(fifaRounds, fifaResults);
  }

  return buildFromStandings(fifaResults);
}

const ROUND_MAP: Record<string, { round: KnockoutMatch["round"]; label: string; slugPrefix: string }> = {
  dieciseisavos: { round: "dieciseisavos", label: "Dieciseisavos de final", slugPrefix: "r32" },
  octavos: { round: "octavos", label: "Octavos de final", slugPrefix: "r16" },
  cuartos: { round: "cuartos", label: "Cuartos de final", slugPrefix: "qf" },
  semifinales: { round: "semifinales", label: "Semifinales", slugPrefix: "sf" },
  "tercer-puesto": { round: "tercer-puesto", label: "Tercer puesto", slugPrefix: "3rd" },
  final: { round: "final", label: "Final", slugPrefix: "final" },
};

function buildFromFIFA(
  fifaRounds: FIFARounds,
  fifaResults: Map<string, FIFAMatchResult>,
): KnockoutRound[] {
  const result: KnockoutRound[] = [];

  for (const [roundKey, info] of Object.entries(ROUND_MAP)) {
    const entries = fifaRounds[roundKey as keyof FIFARounds] || [];
    const matches: KnockoutMatch[] = [];

    entries.forEach((entry, i) => {
      const slug = info.slugPrefix === "3rd" ? "3rd" : `${info.slugPrefix}-${i + 1}`;
      const hasTeams = !!(entry.homeSlug && entry.awaySlug &&
        entry.homeSlug !== "?" && entry.awaySlug !== "?");

      const match: KnockoutMatch = {
        slug,
        round: info.round,
        roundLabel: info.label,
        homeSlug: hasTeams ? entry.homeSlug : null,
        awaySlug: hasTeams ? entry.awaySlug : null,
        homeLabel: hasTeams
          ? (entry.homeSlug ? resolveLabel(entry.homeSlug, entry.homeSlug) : entry.homeLabel ?? "?")
          : "Por definir",
        awayLabel: hasTeams
          ? (entry.awaySlug ? resolveLabel(entry.awaySlug, entry.awaySlug) : entry.awayLabel ?? "?")
          : "Por definir",
        status: hasTeams ? (entry.status as any) : "placeholder",
        date: entry.date ?? undefined,
        stadium: entry.stadium ?? undefined,
        city: entry.city ?? undefined,
      };

      if (hasTeams && entry.homeScore != null) match.homeScore = entry.homeScore;
      if (hasTeams && entry.awayScore != null) match.awayScore = entry.awayScore;
      if (hasTeams && entry.homePenalties != null) match.homePenalties = entry.homePenalties;
      if (hasTeams && entry.awayPenalties != null) match.awayPenalties = entry.awayPenalties;

      matches.push(applyFIFAResult(match, fifaResults));
    });

    result.push({ id: roundKey, label: info.label, matches });
  }

  return result;
}

function buildRounds(
  r32: KnockoutMatch[],
  r16: KnockoutMatch[],
  qf: KnockoutMatch[],
  sf: KnockoutMatch[],
  fifaResults: Map<string, FIFAMatchResult>,
): KnockoutRound[] {
  const hasSF = sf.length >= 2;
  const third3rd = hasSF ? loser(sf[0]) : { slug: null, label: "Pendiente" };
  const third4th = hasSF ? loser(sf[1]) : { slug: null, label: "Pendiente" };
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

  const finalHome = hasSF ? winner(sf[0]) : { slug: null, label: "Pendiente" };
  const finalAway = hasSF ? winner(sf[1]) : { slug: null, label: "Pendiente" };
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

  return [
    { id: "dieciseisavos", label: "Dieciseisavos de final", matches: r32 },
    { id: "octavos",       label: "Octavos de final",       matches: r16 },
    { id: "cuartos",       label: "Cuartos de final",       matches: qf  },
    { id: "semifinales",   label: "Semifinales",            matches: sf  },
    { id: "tercer-puesto", label: "Tercer puesto",          matches: [thirdPlace] },
    { id: "final",         label: "Final",                  matches: [finalMatch] },
  ];
}

function buildFromStandings(fifaResults: Map<string, FIFAMatchResult>): KnockoutRound[] {
  const qualified = getQualifiedTeams();
  const r32 = buildR32(qualified).map((m) => applyFIFAResult(m, fifaResults));
  const r16 = buildNextRound(r32, "octavos", "Octavos de final", "r16")
    .map((m) => applyFIFAResult(m, fifaResults));
  const qf = buildNextRound(r16, "cuartos", "Cuartos de final", "qf")
    .map((m) => applyFIFAResult(m, fifaResults));
  const sf = buildNextRound(qf, "semifinales", "Semifinales", "sf")
    .map((m) => applyFIFAResult(m, fifaResults));

  return buildRounds(r32, r16, qf, sf, fifaResults);
}

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

function buildR32(qualified: ReturnType<typeof getQualifiedTeams>): KnockoutMatch[] {
  const pairings = [
    ["1A", "3B/3C/3D"], ["2E", "2F"],
    ["1E", "3A/3C/3D"], ["2G", "2H"],
    ["1C", "3A/3B/3F"], ["2I", "2J"],
    ["1G", "3E/3F/3H"], ["2K", "2L"],
    ["1B", "3A/3E/3F"], ["1F", "2A"],
    ["1K", "3G/3H/3I"], ["1H", "2B"],
    ["1D", "3B/3C/3F"], ["1J", "2C"],
    ["1I", "3J/3K/3L"], ["1L", "2D"],
  ];

  return pairings.map(([homePos, awayLabel], i) => {
    const g1 = homePos.slice(-1);
    const p1 = parseInt(homePos.charAt(0));
    const homeTeam = (qualified[g1] || []).find((t) => t.position === p1);
    const homeSlug = homeTeam?.teamSlug ?? null;
    const homeLabel = resolveLabel(homeSlug, `${p1}° Grupo ${g1}`);

    const awayParts = awayLabel.split("/").map((s) => s.trim());
    let awaySlug: string | null = null;
    for (const part of awayParts) {
      if (part.length < 2) continue;
      const g = part.slice(-1);
      const pos = parseInt(part.charAt(0));
      if (isNaN(pos)) continue;
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
