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

function buildFromFIFA(
  fifaRounds: FIFARounds,
  fifaResults: Map<string, FIFAMatchResult>,
): KnockoutRound[] {
  // Build R32 from FIFA
  const r32Matches = (fifaRounds.dieciseisavos || []).map((entry, i) => {
    const m = fifaEntryToMatch(entry, `r32-${i + 1}`, "dieciseisavos", "Dieciseisavos de final");
    return applyFIFAResult(m, fifaResults);
  });

  // Build R16 using the REAL bracket pairing from Wikipedia:
  // 89:W74-W78  90:W73-W75  91:W76-W77  92:W79-W80
  // 93:W81-W82  94:W83-W84  95:W86-W88  96:W85-W87
  const R16_PAIRS = [[1,5],[0,2],[3,4],[6,7],[8,9],[10,11],[13,15],[12,14]];
  const r16Matches = R16_PAIRS.map(([a, b], i) => {
    const w1 = winner(r32Matches[a]);
    const w2 = winner(r32Matches[b]);
    const homeLabel = w1.slug ? resolveLabel(w1.slug, w1.label) : w1.label;
    const awayLabel = w2.slug ? resolveLabel(w2.slug, w2.label) : w2.label;
    const match: KnockoutMatch = {
      slug: `r16-${i + 1}`,
      round: "octavos",
      roundLabel: "Octavos de final",
      homeSlug: w1.slug,
      awaySlug: w2.slug,
      homeLabel,
      awayLabel,
      status: w1.slug && w2.slug ? "upcoming" : "placeholder",
    };
    return applyFIFAResult(match, fifaResults);
  });

  // QF: Wikipedia pairs: 97(89v90),98(93v94),99(91v92),100(95v96)
  const QF_PAIRS = [[0,1],[4,5],[2,3],[6,7]];
  const qfMatches = QF_PAIRS.map(([a, b], i) => {
    const w1 = winner(r16Matches[a]);
    const w2 = winner(r16Matches[b]);
    const match: KnockoutMatch = {
      slug: `qf-${i + 1}`,
      round: "cuartos",
      roundLabel: "Cuartos de final",
      homeSlug: w1.slug,
      awaySlug: w2.slug,
      homeLabel: w1.slug ? resolveLabel(w1.slug, w1.label) : w1.label,
      awayLabel: w2.slug ? resolveLabel(w2.slug, w2.label) : w2.label,
      status: w1.slug && w2.slug ? "upcoming" : "placeholder",
    };
    return applyFIFAResult(match, fifaResults);
  });

  // SF: consecutive QF pairs [0,1],[2,3]
  const sfMatches = buildNextRound(qfMatches, "semifinales", "Semifinales", "sf")
    .map((m) => applyFIFAResult(m, fifaResults));

  // Overlay FIFA scores on R16 matches where available
  const fifaR16 = fifaRounds.octavos || [];
  r16Matches.forEach((m, i) => {
    const fEntry = fifaR16[i];
    if (!fEntry) return;
    const hasTeams = !!(fEntry.homeSlug && fEntry.awaySlug &&
      fEntry.homeSlug !== "?" && fEntry.awaySlug !== "?");
    if (!hasTeams) return;
    const fm = applyFIFAResult(
      fifaEntryToMatch(fEntry, `r16-${i + 1}`, "octavos", "Octavos de final"),
      fifaResults
    );
    if (fm.homeScore !== undefined) m.homeScore = fm.homeScore;
    if (fm.awayScore !== undefined) m.awayScore = fm.awayScore;
    if (fm.homePenalties !== undefined) m.homePenalties = fm.homePenalties;
    if (fm.awayPenalties !== undefined) m.awayPenalties = fm.awayPenalties;
    if (fm.status !== "placeholder") m.status = fm.status;
    if (fm.date) m.date = fm.date;
  });

  return buildRounds(r32Matches, r16Matches, qfMatches, sfMatches, fifaResults);
}

function fifaEntryToMatch(
  entry: FIFAEntry,
  slug: string,
  round: KnockoutMatch["round"],
  roundLabel: string,
): KnockoutMatch {
  const hasTeams = !!(entry.homeSlug && entry.awaySlug &&
    entry.homeSlug !== "?" && entry.awaySlug !== "?");

  const match: KnockoutMatch = {
    slug,
    round,
    roundLabel,
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

  return match;
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
