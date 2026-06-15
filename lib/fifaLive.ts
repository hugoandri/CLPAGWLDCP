const FIFA_API = "https://api.fifa.com/api/v3";
const ID_COMPETITION = "17";
const ID_SEASON = "285023";

const TEAM_SLUG: Record<string, string> = {
  Germany: "alemania", "Curaçao": "curazao", Netherlands: "paises-bajos",
  Japan: "japon", Haiti: "haiti", Scotland: "escocia",
  Australia: "australia", "Türkiye": "turquia", Turkey: "turquia",
  Mexico: "mexico", "South Africa": "sudafrica", "Korea Republic": "corea-del-sur",
  "Czech Republic": "chequia", Czechia: "chequia", Canada: "canada",
  "Bosnia and Herzegovina": "bosnia-herzegovina", USA: "estados-unidos",
  "United States": "estados-unidos", Paraguay: "paraguay", Qatar: "catar",
  Switzerland: "suiza", Brazil: "brasil", Morocco: "marruecos",
  "Côte d'Ivoire": "costa-de-marfil", Ecuador: "ecuador", Sweden: "suecia",
  Tunisia: "tunez", "Saudi Arabia": "arabia-saudita", Uruguay: "uruguay",
  Spain: "espana", "Cabo Verde": "cabo-verde", "Cape Verde": "cabo-verde",
  Iran: "iran", "IR Iran": "iran", "New Zealand": "nueva-zelanda",
  Belgium: "belgica", Egypt: "egipto", France: "francia", Senegal: "senegal",
  Iraq: "irak", Norway: "noruega", Argentina: "argentina", Algeria: "argelia",
  Austria: "austria", Jordan: "jordania", Ghana: "ghana", Panama: "panama",
  England: "inglaterra", Croatia: "croacia", Portugal: "portugal",
  "DR Congo": "rd-congo", "Congo DR": "rd-congo", Uzbekistan: "uzbekistan",
  Colombia: "colombia",
};

export type CoverageEventType =
  | "goal" | "own_goal" | "penalty"
  | "yellow" | "red" | "yellow_red"
  | "sub"
  | "halftime" | "kickoff";

export interface CoverageEvent {
  type: CoverageEventType;
  minuteRaw: string;
  minuteOrder: number;
  team?: "home" | "away";
  primary: string;
  secondary?: string;
  score?: string; // only on goal events
}

export interface LiveStats {
  possession?: { home: number; away: number };
  shots?: { home: number; away: number };
  shotsOnTarget?: { home: number; away: number };
  corners?: { home: number; away: number };
  fouls?: { home: number; away: number };
  offsides?: { home: number; away: number };
}

export interface FIFACoverage {
  events: CoverageEvent[];
  period: number | null;
  homeScore: number;
  awayScore: number;
  stats: LiveStats;
}

function toTitle(name: string): string {
  return name
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Parses minute from string "45+2'" → 47, "30'" → 30, or number 30 → 30
function parseMin(raw: unknown): number {
  if (typeof raw === "number" && isFinite(raw)) return Math.round(raw);
  if (typeof raw !== "string" || !raw.trim()) return 0;
  const s = raw.replace(/'/g, "").trim();
  const [base, extra] = s.split("+");
  return parseInt(base || "0", 10) + (extra ? parseInt(extra, 10) : 0);
}

// Returns a display string like "45+2'" or "30'"
function formatMin(raw: unknown): string {
  if (typeof raw === "number" && isFinite(raw) && raw >= 0) return `${Math.round(raw)}'`;
  if (typeof raw === "string" && raw.trim()) {
    const s = raw.trim();
    return s.endsWith("'") ? s : `${s}'`;
  }
  return "?'";
}

// Parse FIFA MatchStatistics array (numeric Type codes or string names)
function parseMatchStats(statsArr: any[]): LiveStats {
  const result: LiveStats = {};
  for (const s of statsArr) {
    const h = parseFloat(String(s.Home ?? s.HomeValue ?? "")) || 0;
    const a = parseFloat(String(s.Away ?? s.AwayValue ?? "")) || 0;
    const t = String(s.Type ?? s.TypeId ?? s.Name ?? "").toLowerCase();
    if (t === "5" || t.includes("possession")) result.possession = { home: h, away: a };
    else if (t === "1" || t.includes("total_attempt") || (t.includes("shot") && !t.includes("target"))) result.shots = { home: h, away: a };
    else if (t === "2" || t.includes("on_target") || t.includes("ontarget")) result.shotsOnTarget = { home: h, away: a };
    else if (t === "3" || t.includes("corner")) result.corners = { home: h, away: a };
    else if (t === "4" || t.includes("foul")) result.fouls = { home: h, away: a };
    else if (t === "6" || t.includes("offside")) result.offsides = { home: h, away: a };
  }
  return result;
}

export async function fetchFIFACoverage(slug: string): Promise<FIFACoverage | null> {
  try {
    const calUrl =
      `${FIFA_API}/calendar/matches?idCompetition=${ID_COMPETITION}&idSeason=${ID_SEASON}` +
      `&language=en&count=200&from=2026-06-01T00:00:00Z&to=2026-07-31T00:00:00Z`;
    const calRes = await fetch(calUrl, { next: { revalidate: 25 } });
    if (!calRes.ok) return null;

    const calData = await calRes.json();
    const fifaMatches: any[] = calData.Results ?? [];

    const fm = fifaMatches.find((m) => {
      const hs = TEAM_SLUG[m.Home?.TeamName?.[0]?.Description ?? ""];
      const as = TEAM_SLUG[m.Away?.TeamName?.[0]?.Description ?? ""];
      return hs && as && `${hs}-vs-${as}` === slug;
    });

    if (!fm) return null;
    const isActive = fm.MatchStatus === 3 || fm.MatchStatus === 0;
    if (!isActive) return null;

    const liveRes = await fetch(
      `${FIFA_API}/live/football/${fm.IdMatch}?language=en`,
      { next: { revalidate: 25 } },
    );
    if (!liveRes.ok) return null;
    const live = await liveRes.json();

    const ht = live.HomeTeam ?? {};
    const at = live.AwayTeam ?? {};

    // Build player name lookup from both squads
    const playerName: Record<string, string> = {};
    for (const p of [...(ht.Players ?? []), ...(at.Players ?? [])]) {
      const pid = String(p.IdPlayer ?? "");
      if (!pid) continue;
      const short = p.ShortName?.[0]?.Description;
      const full = p.PlayerName?.[0]?.Description;
      playerName[pid] = toTitle(short || full || "");
    }

    const homeScore = live.HomeTeamScore ?? fm.HomeTeamScore ?? 0;
    const awayScore = live.AwayTeamScore ?? fm.AwayTeamScore ?? 0;

    const events: CoverageEvent[] = [];
    let runH = 0;
    let runA = 0;

    // Goals — sorted chronologically first to compute running score
    const allGoals: any[] = [
      ...(ht.Goals ?? []).map((g: any) => ({ ...g, side: "home" })),
      ...(at.Goals ?? []).map((g: any) => ({ ...g, side: "away" })),
    ].sort((a, b) => parseMin(a.Minute ?? a.MatchMinute ?? 0) - parseMin(b.Minute ?? b.MatchMinute ?? 0));

    for (const g of allGoals) {
      const isOwnGoal = g.Type === 34;
      const isPenalty = g.Type === 41;
      const scoringTeam = isOwnGoal
        ? g.side === "home" ? "away" : "home"
        : g.side;

      if (scoringTeam === "home") runH++;
      else runA++;

      const rawMin = g.Minute ?? g.MatchMinute;
      events.push({
        type: isOwnGoal ? "own_goal" : isPenalty ? "penalty" : "goal",
        minuteRaw: formatMin(rawMin),
        minuteOrder: parseMin(rawMin),
        team: g.side as "home" | "away",
        primary: playerName[String(g.IdPlayer ?? "")] || "Desconocido",
        secondary: g.IdAssistPlayer ? (playerName[String(g.IdAssistPlayer)] || undefined) : undefined,
        score: `${runH}-${runA}`,
      });
    }

    // Cards
    for (const [side, team] of [["home", ht], ["away", at]] as const) {
      for (const b of team.Bookings ?? []) {
        const cardType: CoverageEventType =
          b.Card === 2 ? "red" : b.Card === 3 ? "yellow_red" : "yellow";
        const rawMin = b.Minute ?? b.MatchMinute;
        events.push({
          type: cardType,
          minuteRaw: formatMin(rawMin),
          minuteOrder: parseMin(rawMin),
          team: side,
          primary: playerName[String(b.IdPlayer ?? "")] || "Desconocido",
        });
      }
    }

    // Substitutions
    // FIFA live API uses IdPlayerOff / IdPlayerOn and PlayerOffName / PlayerOnName arrays.
    // Minute is "" when the sub happens at half-time (Period=4).
    for (const [side, team] of [["home", ht], ["away", at]] as const) {
      for (const s of team.Substitutions ?? []) {
        const offId = String(s.IdPlayerOff ?? s.IdSubstitutedPlayer ?? s.IdPlayer ?? "");
        const onId = String(s.IdPlayerOn ?? s.IdSubstitute ?? "");
        // PlayerOffName / PlayerOnName can be an array [{Description}] or a plain string
        const offNameFallback = toTitle(
          s.PlayerOffName?.[0]?.Description ?? s.PlayerOffName ?? ""
        );
        const onNameFallback = toTitle(
          s.PlayerOnName?.[0]?.Description ?? s.PlayerOnName ?? ""
        );

        // Empty Minute string at half-time (Period 4) → show "HT"
        const rawMin = (s.Minute !== "" && s.Minute != null)
          ? s.Minute
          : (s.MatchMinute ?? s.GameTime ?? null);
        const minuteRaw = rawMin ? formatMin(rawMin)
          : s.Period === 4 ? "HT"
          : "?'";
        const minOrder = rawMin ? parseMin(rawMin)
          : s.Period === 4 ? 45
          : 0;

        events.push({
          type: "sub",
          minuteRaw,
          minuteOrder: minOrder,
          team: side,
          primary: playerName[offId] || offNameFallback || "Desconocido",
          secondary: playerName[onId] || onNameFallback || undefined,
        });
      }
    }

    // Sort newest first
    events.sort((a, b) => b.minuteOrder - a.minuteOrder);

    // Parse live stats
    const statsArr: any[] = live.MatchStatistics ?? live.Statistics ?? [];
    const stats = parseMatchStats(statsArr);

    return {
      events,
      period: live.Period ?? null,
      homeScore,
      awayScore,
      stats,
    };
  } catch {
    return null;
  }
}
