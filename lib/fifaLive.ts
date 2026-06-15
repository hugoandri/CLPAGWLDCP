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
  minuteRaw: string;   // "41'" or "45+2'"
  minuteOrder: number; // for sorting: parsed minute value
  team?: "home" | "away";
  primary: string;     // scorer / player carded / player off
  secondary?: string;  // assist / player on
  score?: string;      // "1-0" — only on goal events
}

function toTitle(name: string): string {
  return name
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function parseMin(raw: string): number {
  const s = raw.replace(/'/g, "").trim();
  const [base, extra] = s.split("+");
  return parseInt(base || "0", 10) + (extra ? parseInt(extra, 10) : 0);
}

export interface FIFACoverage {
  events: CoverageEvent[];
  period: number | null;   // 3=1H live, 4=HT, 5=2H live, 0=FT
  homeScore: number;
  awayScore: number;
}

export async function fetchFIFACoverage(slug: string): Promise<FIFACoverage | null> {
  try {
    // Fetch calendar (Next.js deduplicates this with the same call in readLiveUpdatesWithFIFA)
    const calUrl =
      `${FIFA_API}/calendar/matches?idCompetition=${ID_COMPETITION}&idSeason=${ID_SEASON}` +
      `&language=en&count=200&from=2026-06-01T00:00:00Z&to=2026-07-31T00:00:00Z`;
    const calRes = await fetch(calUrl, { next: { revalidate: 25 } });
    if (!calRes.ok) return null;

    const calData = await calRes.json();
    const fifaMatches: any[] = calData.Results ?? [];

    // Find the match
    const fm = fifaMatches.find((m) => {
      const hs = TEAM_SLUG[m.Home?.TeamName?.[0]?.Description ?? ""];
      const as = TEAM_SLUG[m.Away?.TeamName?.[0]?.Description ?? ""];
      return hs && as && `${hs}-vs-${as}` === slug;
    });

    if (!fm) return null;
    const isActive = fm.MatchStatus === 3 || fm.MatchStatus === 0;
    if (!isActive) return null;

    // Fetch live data
    const liveRes = await fetch(
      `${FIFA_API}/live/football/${fm.IdMatch}?language=en`,
      { next: { revalidate: 25 } },
    );
    if (!liveRes.ok) return null;
    const live = await liveRes.json();

    const ht = live.HomeTeam ?? {};
    const at = live.AwayTeam ?? {};

    // Build player name lookup
    const playerName: Record<string, string> = {};
    for (const p of [...(ht.Players ?? []), ...(at.Players ?? [])]) {
      const pid = String(p.IdPlayer ?? "");
      if (!pid) continue;
      const short = p.ShortName?.[0]?.Description;
      const full = p.PlayerName?.[0]?.Description;
      playerName[pid] = toTitle(short || full || "Desconocido");
    }

    const homeId = String(ht.IdTeam ?? fm.Home?.IdTeam ?? "");
    const homeScore = live.HomeTeamScore ?? fm.HomeTeamScore ?? 0;
    const awayScore = live.AwayTeamScore ?? fm.AwayTeamScore ?? 0;

    const events: CoverageEvent[] = [];

    // Running score tracker (to show score at moment of goal)
    let runH = 0;
    let runA = 0;

    // Collect all goals first to build running score
    const allGoals: any[] = [
      ...(ht.Goals ?? []).map((g: any) => ({ ...g, side: "home" })),
      ...(at.Goals ?? []).map((g: any) => ({ ...g, side: "away" })),
    ].sort((a, b) => parseMin(a.Minute ?? "0") - parseMin(b.Minute ?? "0"));

    for (const g of allGoals) {
      const isOwnGoal = g.Type === 34;
      const isPenalty = g.Type === 41;
      const scoringTeam = isOwnGoal
        ? g.side === "home" ? "away" : "home"
        : g.side;

      if (scoringTeam === "home") runH++;
      else runA++;

      events.push({
        type: isOwnGoal ? "own_goal" : isPenalty ? "penalty" : "goal",
        minuteRaw: g.Minute ?? "?'",
        minuteOrder: parseMin(g.Minute ?? "0"),
        team: g.side as "home" | "away",
        primary: playerName[String(g.IdPlayer ?? "")] ?? "Desconocido",
        secondary: g.IdAssistPlayer ? playerName[String(g.IdAssistPlayer)] : undefined,
        score: `${runH}-${runA}`,
      });
    }

    // Cards
    for (const [side, team] of [["home", ht], ["away", at]] as const) {
      for (const b of team.Bookings ?? []) {
        const cardType: CoverageEventType =
          b.Card === 2 ? "red" : b.Card === 3 ? "yellow_red" : "yellow";
        events.push({
          type: cardType,
          minuteRaw: b.Minute ?? "?'",
          minuteOrder: parseMin(b.Minute ?? "0"),
          team: side,
          primary: playerName[String(b.IdPlayer ?? "")] ?? "Desconocido",
        });
      }
    }

    // Substitutions
    for (const [side, team] of [["home", ht], ["away", at]] as const) {
      for (const s of team.Substitutions ?? []) {
        // FIFA API uses different field names across versions; try all known variants
        const offId = String(s.IdSubstitutedPlayer ?? s.IdPlayer ?? s.PlayerOff ?? "");
        const onId = String(s.IdPlayerOn ?? s.IdSubstitute ?? s.PlayerOn ?? "");
        events.push({
          type: "sub",
          minuteRaw: s.Minute ?? "?'",
          minuteOrder: parseMin(s.Minute ?? "0"),
          team: side,
          primary: playerName[offId] ?? (s.PlayerOff ? toTitle(String(s.PlayerOff)) : "Desconocido"),
          secondary: playerName[onId] ?? (s.PlayerOn ? toTitle(String(s.PlayerOn)) : "Desconocido"),
        });
      }
    }

    // Sort by minute desc (newest first for the feed)
    events.sort((a, b) => b.minuteOrder - a.minuteOrder);

    return {
      events,
      period: live.Period ?? null,
      homeScore,
      awayScore,
    };
  } catch {
    return null;
  }
}
