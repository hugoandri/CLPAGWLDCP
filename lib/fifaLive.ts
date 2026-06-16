import { unstable_cache } from "next/cache";

const FIFA_API = "https://api.fifa.com/api/v3";
const ID_COMPETITION = "17";
const ID_SEASON = "285023";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

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
  | "penalty_awarded" | "var"
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
  yellowCards?: { home: number; away: number };
  redCards?: { home: number; away: number };
  penaltiesAwarded?: { home: number; away: number };
  passAccuracy?: { home: number; away: number };
}

export interface FIFACoverage {
  events: CoverageEvent[];
  period: number | null;
  homeScore: number;
  awayScore: number;
  stats: LiveStats;
  aiNotes: string | null;
}

async function _groqMatchComment(
  homeName: string, awayName: string,
  homeScore: number, awayScore: number,
  // These args act as cache-busters: comment regenerates when any of them changes
  isFinished: boolean, isHalfTime: boolean,
  redCards: number, penalties: number,
  eventSummary: string,
): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  let context: string;
  let systemPrompt: string;

  if (isFinished) {
    context = `PARTIDO FINALIZADO: ${homeName} ${homeScore}-${awayScore} ${awayName}. ${eventSummary}`;
    systemPrompt =
      "Eres analista deportivo del Mundial 2026. El partido ha terminado. " +
      "Escribe exactamente 2-3 oraciones en español resumiendo el resultado: " +
      "qué equipo dominó, los momentos decisivos y una conclusión final. " +
      "Sin emojis. Sin lenguaje de apuestas. Sin inventar datos.";
  } else if (isHalfTime) {
    context = `DESCANSO: ${homeName} ${homeScore}-${awayScore} ${awayName}. ${eventSummary}`;
    systemPrompt =
      "Eres analista deportivo del Mundial 2026. El partido está en el descanso. " +
      "Escribe exactamente 2 oraciones en español: balance del primer tiempo y qué puede cambiar en la segunda parte. " +
      "Sin emojis. Sin lenguaje de apuestas.";
  } else {
    context = `EN DIRECTO: ${homeName} ${homeScore}-${awayScore} ${awayName}. ${eventSummary}`;
    systemPrompt =
      "Eres analista deportivo del Mundial 2026 cubriendo un partido EN DIRECTO. " +
      "Escribe exactamente 2 oraciones en español: una describe el momento del partido y la otra da una lectura táctica breve. " +
      "Sin emojis. Sin lenguaje de apuestas. Sin inventar datos.";
  }

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: GROQ_MODEL, max_tokens: 220, temperature: 0.6,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: context },
        ],
      }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json() as { choices?: { message?: { content?: string } }[] };
    return data.choices?.[0]?.message?.content?.trim() ?? null;
  } catch { return null; }
}

const groqMatchComment = unstable_cache(_groqMatchComment, ["fifa-match-comment"], { revalidate: 120 });

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
    const homeName = fm.Home?.TeamName?.[0]?.Description ?? "";
    const awayName = fm.Away?.TeamName?.[0]?.Description ?? "";

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

    // live.HomeTeamScore is undefined in the live endpoint; score is under ht.Score
    const homeScore = ht.Score ?? live.HomeTeamScore ?? fm.HomeTeamScore ?? 0;
    const awayScore = at.Score ?? live.AwayTeamScore ?? fm.AwayTeamScore ?? 0;

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

    // Fetch match statistics from timelines endpoint (Type codes: 12=shot, 16=corner, 18=foul, 15=offside, 2=yellow)
    let stats: LiveStats = {};
    const homeId = String(ht.IdTeam ?? "");
    const awayId = String(at.IdTeam ?? "");
    const tlRes = await fetch(
      `${FIFA_API}/timelines/${fm.IdMatch}?language=en`,
      { next: { revalidate: 25 } },
    );
    if (tlRes.ok) {
      const tlData = await tlRes.json();
      const tlEvents: any[] = tlData.Event ?? [];
      const cnt = {
        shots:            { home: 0, away: 0 },
        corners:          { home: 0, away: 0 },
        fouls:            { home: 0, away: 0 },
        offsides:         { home: 0, away: 0 },
        yellowCards:      { home: 0, away: 0 },
        redCards:         { home: 0, away: 0 },
        penaltiesAwarded: { home: 0, away: 0 },
      };
      for (const ev of tlEvents) {
        const sid = String(ev.IdTeam ?? "");
        const side: "home" | "away" | null = sid === homeId ? "home" : sid === awayId ? "away" : null;
        if (!side) continue;
        if (ev.Type === 12) cnt.shots[side]++;
        else if (ev.Type === 16) cnt.corners[side]++;
        else if (ev.Type === 18) cnt.fouls[side]++;
        else if (ev.Type === 15) cnt.offsides[side]++;
        else if (ev.Type === 2)  cnt.yellowCards[side]++;
        else if (ev.Type === 3)  cnt.redCards[side]++;
        else if (ev.Type === 6)  cnt.penaltiesAwarded[side]++;
      }
      const nonZero = (o: {home:number;away:number}) => o.home + o.away > 0 ? o : undefined;
      stats = {
        shots:            nonZero(cnt.shots),
        corners:          nonZero(cnt.corners),
        fouls:            nonZero(cnt.fouls),
        offsides:         nonZero(cnt.offsides),
        yellowCards:      nonZero(cnt.yellowCards),
        redCards:         nonZero(cnt.redCards),
        penaltiesAwarded: nonZero(cnt.penaltiesAwarded),
      };

      // Extract Penalty Awarded (6) and VAR (71) as coverage events
      const varDescES: Record<string, string> = {
        "Red card given":        "Tarjeta roja confirmada",
        "Yellow card reassigned":"Tarjeta amarilla revisada",
        "Goal awarded":          "Gol confirmado",
        "Goal disallowed":       "Gol anulado",
        "Penalty awarded":       "Penalti confirmado",
        "No penalty":            "Sin penalti",
        "No card":               "Sin tarjeta",
      };
      for (const ev of tlEvents) {
        const minute = String(ev.MatchMinute ?? "");
        if (ev.Type === 6) {
          const sid = String(ev.IdTeam ?? "");
          const side = sid === homeId ? "home" : sid === awayId ? "away" : undefined;
          events.push({
            type: "penalty_awarded",
            minuteRaw: formatMin(minute),
            minuteOrder: parseMin(minute),
            team: side,
            primary: playerName[String(ev.IdPlayer ?? "")] || "Penalti concedido",
          });
        } else if (ev.Type === 71) {
          const rawDesc = String(ev.EventDescription ?? "");
          events.push({
            type: "var",
            minuteRaw: formatMin(minute),
            minuteOrder: parseMin(minute),
            primary: varDescES[rawDesc] ?? rawDesc,
          });
        }
      }
    } else {
      // Fallback: try MatchStatistics field in live endpoint
      const statsArr: any[] = live.MatchStatistics ?? live.Statistics ?? [];
      if (statsArr.length) stats = parseMatchStats(statsArr);
    }

    // Build event summary for Groq context
    const goalEvs  = events.filter(e => e.type === "goal" || e.type === "own_goal" || e.type === "penalty");
    const redEvs   = events.filter(e => e.type === "red");
    const penEvs   = events.filter(e => e.type === "penalty_awarded");
    let eventSummary = "";
    if (goalEvs.length)
      eventSummary += `Goles: ${goalEvs.map(e => `${e.primary} (${e.minuteRaw})`).join(", ")}. `;
    if (redEvs.length)
      eventSummary += `Tarjetas rojas: ${redEvs.map(e => `${e.primary} (${e.minuteRaw})`).join(", ")}. `;
    if (penEvs.length)
      eventSummary += `Penaltis: ${penEvs.length}. `;

    const isFinished = fm.MatchStatus === 0;
    const isHT      = !isFinished && (live.Period === 4 || fm.MatchTime === "");
    const aiNotes = await groqMatchComment(
      homeName, awayName, homeScore, awayScore,
      isFinished, isHT,
      redEvs.length, penEvs.length,
      eventSummary,
    );

    return {
      events,
      period: live.Period ?? null,
      homeScore,
      awayScore,
      stats,
      aiNotes,
    };
  } catch {
    return null;
  }
}
