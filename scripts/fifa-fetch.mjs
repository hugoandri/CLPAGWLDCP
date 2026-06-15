/**
 * FIFA API data fetcher for DataGoal 2026
 * Pulls structured match data (goals, cards, lineups, subs) from api.fifa.com
 * and uses Groq to generate a short analytical comment per match.
 *
 * Usage:
 *   npm run fifa:fetch          # preview in data/ai-updates/
 *   npm run fifa:fetch:apply    # write directly to data/live-updates.json
 */
import { writeFileSync, readFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const FIFA_API = "https://api.fifa.com/api/v3";
const ID_COMPETITION = "17";
const ID_SEASON = "285023";
const LANG = "en";

const GROQ_API_KEY = process.env.GROQ_API_KEY ?? "";
const GROQ_MODEL = "llama-3.3-70b-versatile";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// -------------------------------------------------------------------
// FIFA team name → { slug, rank, keyPlayer }
// -------------------------------------------------------------------
const TEAM_INFO = {
  Germany:                   { slug: "alemania",          rank: 9,  keyPlayer: "Jamal Musiala" },
  "Curaçao":                 { slug: "curazao",           rank: 82, keyPlayer: "Leandro Bacuna" },
  Netherlands:               { slug: "paises-bajos",      rank: 7,  keyPlayer: "Virgil van Dijk" },
  Japan:                     { slug: "japon",             rank: 18, keyPlayer: "Takefusa Kubo" },
  Haiti:                     { slug: "haiti",             rank: 83, keyPlayer: "Jean-Ricner Bellegarde" },
  Scotland:                  { slug: "escocia",           rank: 39, keyPlayer: "John McGinn" },
  Australia:                 { slug: "australia",         rank: 24, keyPlayer: "Nestory Irankunda" },
  "Türkiye":                 { slug: "turquia",           rank: 27, keyPlayer: "Arda Güler" },
  Turkey:                    { slug: "turquia",           rank: 27, keyPlayer: "Arda Güler" },
  Mexico:                    { slug: "mexico",            rank: 14, keyPlayer: "Raúl Jiménez" },
  "South Africa":            { slug: "sudafrica",         rank: 60, keyPlayer: "Percy Tau" },
  "Korea Republic":          { slug: "corea-del-sur",     rank: 25, keyPlayer: "Son Heung-min" },
  "Czech Republic":          { slug: "chequia",           rank: 40, keyPlayer: "Patrik Schick" },
  Czechia:                   { slug: "chequia",           rank: 40, keyPlayer: "Patrik Schick" },
  Canada:                    { slug: "canada",            rank: 28, keyPlayer: "Alphonso Davies" },
  "Bosnia and Herzegovina":  { slug: "bosnia-herzegovina",rank: 62, keyPlayer: "Ermedin Demirović" },
  USA:                       { slug: "estados-unidos",    rank: 13, keyPlayer: "Folarin Balogun" },
  "United States":           { slug: "estados-unidos",    rank: 13, keyPlayer: "Folarin Balogun" },
  Paraguay:                  { slug: "paraguay",          rank: 48, keyPlayer: "Julio Enciso" },
  Qatar:                     { slug: "catar",             rank: 53, keyPlayer: "Akram Afif" },
  Switzerland:               { slug: "suiza",             rank: 19, keyPlayer: "Granit Xhaka" },
  Brazil:                    { slug: "brasil",            rank: 5,  keyPlayer: "Vinícius Júnior" },
  Morocco:                   { slug: "marruecos",         rank: 12, keyPlayer: "Achraf Hakimi" },
  "Côte d'Ivoire":           { slug: "costa-de-marfil",  rank: 42, keyPlayer: "Franck Kessié" },
  Ecuador:                   { slug: "ecuador",           rank: 31, keyPlayer: "Moisés Caicedo" },
  Sweden:                    { slug: "suecia",            rank: 32, keyPlayer: "Alexander Isak" },
  Tunisia:                   { slug: "tunez",             rank: 46, keyPlayer: "Ellyes Skhiri" },
  "Saudi Arabia":            { slug: "arabia-saudita",    rank: 58, keyPlayer: "Salem Al-Dawsari" },
  Uruguay:                   { slug: "uruguay",           rank: 15, keyPlayer: "Federico Valverde" },
  Spain:                     { slug: "espana",            rank: 2,  keyPlayer: "Pedri" },
  "Cabo Verde":              { slug: "cabo-verde",        rank: 70, keyPlayer: "Jovane Cabral" },
  "Cape Verde":              { slug: "cabo-verde",        rank: 70, keyPlayer: "Jovane Cabral" },
  Iran:                      { slug: "iran",              rank: 20, keyPlayer: "Mehdi Taremi" },
  "IR Iran":                 { slug: "iran",              rank: 20, keyPlayer: "Mehdi Taremi" },
  "New Zealand":             { slug: "nueva-zelanda",     rank: 89, keyPlayer: "Chris Wood" },
  Belgium:                   { slug: "belgica",           rank: 8,  keyPlayer: "Jérémy Doku" },
  Egypt:                     { slug: "egipto",            rank: 33, keyPlayer: "Mohamed Salah" },
  France:                    { slug: "francia",           rank: 3,  keyPlayer: "Kylian Mbappé" },
  Senegal:                   { slug: "senegal",           rank: 17, keyPlayer: "Sadio Mané" },
  Iraq:                      { slug: "irak",              rank: 59, keyPlayer: "Ayman Hussein" },
  Norway:                    { slug: "noruega",           rank: 36, keyPlayer: "Erling Haaland" },
  Argentina:                 { slug: "argentina",         rank: 1,  keyPlayer: "Lionel Messi" },
  Algeria:                   { slug: "argelia",           rank: 38, keyPlayer: "Mohamed Amoura" },
  Austria:                   { slug: "austria",           rank: 22, keyPlayer: "Marcel Sabitzer" },
  Jordan:                    { slug: "jordania",          rank: 63, keyPlayer: "Mousa Al-Taamari" },
  Ghana:                     { slug: "ghana",             rank: 47, keyPlayer: "Mohammed Kudus" },
  Panama:                    { slug: "panama",            rank: 35, keyPlayer: "Adalberto Carrasquilla" },
  England:                   { slug: "inglaterra",        rank: 4,  keyPlayer: "Jude Bellingham" },
  Croatia:                   { slug: "croacia",           rank: 11, keyPlayer: "Luka Modrić" },
  Portugal:                  { slug: "portugal",          rank: 6,  keyPlayer: "Bruno Fernandes" },
  "DR Congo":                { slug: "rd-congo",          rank: 55, keyPlayer: "Yoane Wissa" },
  "Congo DR":                { slug: "rd-congo",          rank: 55, keyPlayer: "Yoane Wissa" },
  Uzbekistan:                { slug: "uzbekistan",        rank: 54, keyPlayer: "Eldor Shomurodov" },
  Colombia:                  { slug: "colombia",          rank: 10, keyPlayer: "Luis Díaz" },
};

// Backwards-compat helper used in extractGoals/cards
const TEAM_SLUG = Object.fromEntries(
  Object.entries(TEAM_INFO).map(([k, v]) => [k, v.slug])
);

// FIFA Position code → project LineupPosition
const POS = { 0: "GK", 1: "DEF", 2: "MID", 3: "FWD" };

// -------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------

/** "45'+5'" → 50, "6'" → 6 */
function parseMinute(str) {
  if (!str) return 0;
  const s = String(str).replace(/'/g, "").trim();
  const parts = s.split("+");
  return parseInt(parts[0] || "0") + (parts[1] ? parseInt(parts[1]) : 0);
}

/** Capitalise first letter of each word (for tidy names from all-caps sources) */
function titleCase(str) {
  return str
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} – ${url}`);
  return res.json();
}

// -------------------------------------------------------------------
// FIFA API calls
// -------------------------------------------------------------------

async function getAllMatches() {
  const url =
    `${FIFA_API}/calendar/matches` +
    `?idCompetition=${ID_COMPETITION}&idSeason=${ID_SEASON}` +
    `&language=${LANG}&count=200` +
    `&from=2026-06-01T00:00:00Z&to=2026-07-31T00:00:00Z`;
  const data = await fetchJSON(url);
  // 0=finished, 1=upcoming, 3=live
  return data.Results ?? [];
}

async function getTimeline(matchId, idStage) {
  try {
    const url = `${FIFA_API}/timelines/${ID_COMPETITION}/${ID_SEASON}/${idStage}/${matchId}?language=${LANG}`;
    const data = await fetchJSON(url);
    return data.Event ?? [];
  } catch {
    return [];
  }
}

async function getLiveMatch(matchId) {
  try {
    return await fetchJSON(`${FIFA_API}/live/football/${matchId}?language=${LANG}`);
  } catch {
    return null;
  }
}

// -------------------------------------------------------------------
// Data extraction
// -------------------------------------------------------------------

function extractGoals(events, homeTeamId) {
  // 0=regular goal, 34=own goal, 41=penalty goal
  const GOAL_TYPES = new Set([0, 34, 41]);

  // Build assist lookup: index of following goal → assister name
  const assistFor = {};
  for (let i = 0; i < events.length; i++) {
    if (events[i].Type !== 1) continue;
    const desc = events[i].EventDescription?.[0]?.Description ?? "";
    const name = desc.replace(/^Assisted by\s+/i, "").trim();
    for (let j = i + 1; j < Math.min(i + 4, events.length); j++) {
      if (GOAL_TYPES.has(events[j].Type)) {
        assistFor[j] = name;
        break;
      }
    }
  }

  const goals = [];
  for (let i = 0; i < events.length; i++) {
    const e = events[i];
    if (!GOAL_TYPES.has(e.Type)) continue;

    const desc = e.EventDescription?.[0]?.Description ?? "";
    const minute = parseMinute(e.MatchMinute);

    // Own goal (Type=34): IdTeam is the player's team, goal counts for the opponent
    let team;
    if (e.Type === 34) {
      team = String(e.IdTeam) === String(homeTeamId) ? "away" : "home";
    } else {
      team = String(e.IdTeam) === String(homeTeamId) ? "home" : "away";
    }

    // Scorer: "NMECHA (Germany) scores!!" → "NMECHA"
    const match = desc.match(/^([^(]+)\s*\(/);
    const rawName = match ? match[1].trim() : "Unknown";
    const scorer = rawName === rawName.toUpperCase() ? titleCase(rawName) : rawName;

    let type = "goal";
    if (e.Type === 41) type = "penalty";
    else if (e.Type === 34) type = "own_goal";

    goals.push({
      minute,
      team,
      scorer,
      ...(assistFor[i] ? { assist: assistFor[i] } : {}),
      type,
    });
  }

  return goals.sort((a, b) => a.minute - b.minute);
}

function extractCards(events, homeTeamId) {
  const cards = [];
  for (const e of events) {
    // 2 = yellow, 3 = red (assumption based on pattern — only yellow seen so far)
    if (e.Type !== 2 && e.Type !== 3) continue;

    const desc = e.EventDescription?.[0]?.Description ?? "";
    const minute = parseMinute(e.MatchMinute);
    const team = String(e.IdTeam) === String(homeTeamId) ? "home" : "away";

    const match = desc.match(/^([^(]+)\s*\(/);
    const rawName = match ? match[1].trim() : "Unknown";
    const player = rawName === rawName.toUpperCase() ? titleCase(rawName) : rawName;

    const type = e.Type === 3 ? "red" : "yellow";
    cards.push({ minute, team, player, type });
  }
  return cards.sort((a, b) => a.minute - b.minute);
}

function extractLineup(liveMatch, side) {
  const team = side === "home" ? liveMatch.HomeTeam : liveMatch.AwayTeam;
  if (!team?.Players) return [];

  return team.Players.filter((p) => p.Status === 1)
    .map((p) => ({
      name: p.PlayerName?.[0]?.Description ?? "Unknown",
      ...(p.ShirtNumber != null ? { number: p.ShirtNumber } : {}),
      ...(POS[p.Position] ? { position: POS[p.Position] } : {}),
    }));
}

function extractSubs(liveMatch, side) {
  const team = side === "home" ? liveMatch.HomeTeam : liveMatch.AwayTeam;
  if (!team?.Substitutions) return [];

  return team.Substitutions.map((s) => ({
    minute: parseMinute(s.Minute),
    team: side,
    playerOut: s.PlayerOffName?.[0]?.Description ?? "Unknown",
    playerIn: s.PlayerOnName?.[0]?.Description ?? "Unknown",
  })).sort((a, b) => a.minute - b.minute);
}

function extractStats(events, homeTeamId) {
  const home = String(homeTeamId);
  const byTeam = (type) => {
    const homeCount = events.filter((e) => e.Type === type && String(e.IdTeam) === home).length;
    const awayCount = events.filter((e) => e.Type === type && e.IdTeam && String(e.IdTeam) !== home).length;
    return homeCount + awayCount > 0 ? { home: homeCount, away: awayCount } : null;
  };

  const stats = {};
  const shots    = byTeam(12); if (shots)       stats.shots       = shots;
  const corners  = byTeam(16); if (corners)     stats.corners     = corners;
  const fouls    = byTeam(18); if (fouls)       stats.fouls       = fouls;
  const offsides = byTeam(15); if (offsides)    stats.offsides    = offsides;
  const yellow   = byTeam(2);  if (yellow)      stats.yellowCards = yellow;
  return stats;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function generateGroqComment(homeName, awayName, homeScore, awayScore, goals, cards) {
  if (!GROQ_API_KEY) return null;

  const goalLines = goals
    .map((g) => {
      const side = g.team === "home" ? homeName : awayName;
      const extra = g.type === "penalty" ? " (pen.)" : g.type === "own_goal" ? " (p.p.)" : "";
      const assist = g.assist ? `, asist. ${g.assist}` : "";
      return `min.${g.minute} – ${g.scorer}${extra} (${side}${assist})`;
    })
    .join("\n");

  const cardLines = cards
    .map((c) => {
      const side = c.team === "home" ? homeName : awayName;
      return `${c.type === "yellow" ? "Amarilla" : "Roja"} min.${c.minute} – ${c.player} (${side})`;
    })
    .join("\n");

  const userMsg =
    `Partido: ${homeName} ${homeScore}-${awayScore} ${awayName}\n` +
    `Goles:\n${goalLines || "Ninguno"}\n` +
    (cardLines ? `Tarjetas:\n${cardLines}\n` : "");

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        max_tokens: 160,
        temperature: 0.6,
        messages: [
          {
            role: "system",
            content:
              "Eres analista deportivo del Mundial 2026. Con los datos del partido que te dan, " +
              "escribe exactamente 2 oraciones en español: una describe lo que pasó en el partido " +
              "(resultado, goleadores clave, momento decisivo) y la otra da una opinión analítica " +
              "breve (rendimiento táctico, sorpresa, o contexto del torneo). " +
              "Sin emojis. Sin lenguaje de apuestas. Sin inventar datos.",
          },
          { role: "user", content: userMsg },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.warn(`  Groq error ${res.status}: ${err.slice(0, 80)}`);
      return null;
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() ?? null;
  } catch (err) {
    console.warn(`  Groq request failed: ${err.message}`);
    return null;
  }
}

async function generateGroqLiveComment(homeName, awayName, homeScore, awayScore, minute, goals, cards) {
  if (!GROQ_API_KEY) return null;

  const goalLines = goals.map((g) => {
    const side = g.team === "home" ? homeName : awayName;
    const extra = g.type === "penalty" ? " (pen.)" : g.type === "own_goal" ? " (p.p.)" : "";
    return `min.${g.minute} – ${g.scorer}${extra} (${side})`;
  }).join("\n");

  const cardLines = cards.map((c) => {
    const side = c.team === "home" ? homeName : awayName;
    return `${c.type === "yellow" ? "Amarilla" : "Roja"} min.${c.minute} – ${c.player} (${side})`;
  }).join("\n");

  const userMsg =
    `Partido EN DIRECTO (min.${minute}): ${homeName} ${homeScore}-${awayScore} ${awayName}\n` +
    `Goles:\n${goalLines || "Ninguno todavía"}\n` +
    (cardLines ? `Tarjetas:\n${cardLines}\n` : "");

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify({
        model: GROQ_MODEL,
        max_tokens: 160,
        temperature: 0.6,
        messages: [
          {
            role: "system",
            content:
              "Eres analista deportivo del Mundial 2026 cubriendo un partido EN DIRECTO. " +
              "Con los datos actuales del partido, escribe exactamente 2 oraciones en español: " +
              "una describe cómo va el partido en este momento (marcador, quién domina, goles clave) " +
              "y la otra da una lectura táctica breve o qué puede pasar en lo que resta. " +
              "Sin emojis. Sin lenguaje de apuestas. Sin inventar datos.",
          },
          { role: "user", content: userMsg },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() ?? null;
  } catch {
    return null;
  }
}

async function generateGroqPreview(homeName, homeRank, homeKeyPlayer, awayName, awayRank, awayKeyPlayer, group) {
  if (!GROQ_API_KEY) return null;

  const userMsg =
    `Partido: ${homeName} (FIFA #${homeRank}, referente: ${homeKeyPlayer}) ` +
    `vs ${awayName} (FIFA #${awayRank}, referente: ${awayKeyPlayer}). ` +
    `Grupo ${group} del Mundial 2026.`;

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify({
        model: GROQ_MODEL,
        max_tokens: 180,
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content:
              "Eres analista deportivo del Mundial 2026. Antes de que se juegue el partido, " +
              "escribe exactamente 2 oraciones en español: una describe cómo llegan ambos equipos " +
              "(fortalezas, forma reciente, jugador clave a seguir) y la otra da tu expectativa " +
              "del partido (qué equipo tiene ventaja y por qué, o si es parejo). " +
              "Sin emojis. Sin lenguaje de apuestas. Sé directo y analítico.",
          },
          { role: "user", content: userMsg },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() ?? null;
  } catch {
    return null;
  }
}

function buildAiNotes(fifaMatch, goals, homeSlug, awaySlug) {
  const fmt = (slug) =>
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  const hs = fifaMatch.HomeTeamScore;
  const as = fifaMatch.AwayTeamScore;
  const homeName = fmt(homeSlug);
  const awayName = fmt(awaySlug);

  const winnerLine =
    hs > as
      ? `${homeName} ganó ${hs}-${as} a ${awayName}`
      : as > hs
      ? `${awayName} ganó ${as}-${hs} a ${homeName}`
      : `${homeName} y ${awayName} empataron ${hs}-${as}`;

  const topGoals = goals
    .slice(0, 4)
    .map((g) => `${g.scorer} (min.${g.minute})`)
    .join(", ");

  return `${winnerLine} en el Mundial 2026.${topGoals ? ` Goles: ${topGoals}.` : ""}`;
}

// -------------------------------------------------------------------
// Load project slugs from matches.ts
// -------------------------------------------------------------------
function loadProjectMatches() {
  const src = readFileSync(join(ROOT, "data/matches.ts"), "utf-8");
  const re =
    /fixture\(\{\s*slug:\s*"([^"]+)"[^}]*?homeSlug:\s*"([^"]+)"[^}]*?awaySlug:\s*"([^"]+)"/gs;
  const results = [];
  let m;
  while ((m = re.exec(src)) !== null) {
    results.push({ slug: m[1], homeSlug: m[2], awaySlug: m[3] });
  }
  return results;
}

// -------------------------------------------------------------------
// Main
// -------------------------------------------------------------------
async function main() {
  const apply = process.argv.includes("--apply");

  const livePath = join(ROOT, "data/live-updates.json");
  const existing = JSON.parse(readFileSync(livePath, "utf-8"));
  const projectMatches = loadProjectMatches();

  console.log("→ Fetching all matches from FIFA API…");
  const allFifaMatches = await getAllMatches();
  const liveCount     = allFifaMatches.filter((m) => m.MatchStatus === 3).length;
  const finishedCount = allFifaMatches.filter((m) => m.MatchStatus === 0).length;
  const upcomingCount = allFifaMatches.filter((m) => m.MatchStatus === 1).length;
  console.log(`  Found ${finishedCount} finished, ${liveCount} live, ${upcomingCount} upcoming\n`);

  // Start from existing matches list, update in-place
  const bySlug = new Map((existing.matches ?? []).map((u) => [u.slug, u]));

  for (const fm of allFifaMatches) {
    const homeName = fm.Home?.TeamName?.[0]?.Description ?? "";
    const awayName = fm.Away?.TeamName?.[0]?.Description ?? "";
    const homeInfo = TEAM_INFO[homeName];
    const awayInfo = TEAM_INFO[awayName];

    if (!homeInfo || !awayInfo) {
      console.warn(`  SKIP (no info): ${homeName} vs ${awayName}`);
      continue;
    }

    const homeSlug = homeInfo.slug;
    const awaySlug = awayInfo.slug;

    const pm = projectMatches.find(
      (p) => p.homeSlug === homeSlug && p.awaySlug === awaySlug
    );
    if (!pm) {
      console.warn(`  SKIP (not in project): ${homeSlug} vs ${awaySlug}`);
      continue;
    }

    const isLive     = fm.MatchStatus === 3;
    const isFinished = fm.MatchStatus === 0;
    const isUpcoming = fm.MatchStatus === 1;
    const matchId    = fm.IdMatch;
    const label      = isLive ? "LIVE" : isFinished ? "FIN " : "PRE ";

    // --- UPCOMING: only generate preview if not already cached ---
    if (isUpcoming) {
      const existing = bySlug.get(pm.slug);
      if (existing?.detail?.aiNotes) {
        process.stdout.write(`  [${label}] ${pm.slug} … cached\n`);
        continue;
      }
      process.stdout.write(`  [${label}] ${pm.slug} … `);
      const preview = await generateGroqPreview(
        homeName, homeInfo.rank, homeInfo.keyPlayer,
        awayName, awayInfo.rank, awayInfo.keyPlayer,
        pm.slug.includes("grupo") ? "?" : fm.GroupName?.[0]?.Description ?? "?"
      );
      console.log(preview ? "✓ Groq preview" : "skip");
      if (preview) {
        bySlug.set(pm.slug, {
          slug: pm.slug,
          status: "upcoming",
          detail: {
            goals: [], cards: [], substitutions: [],
            lineup: { home: [], away: [] },
            stats: {},
            aiNotes: preview,
            confidence: 0.8,
            evidenceUrl: `https://api.fifa.com/api/v3/live/football/${matchId}`,
          },
        });
      }
      await sleep(1500);
      continue;
    }

    // --- LIVE or FINISHED ---
    process.stdout.write(`  [${label}] ${pm.slug} … `);

    const [timeline, liveData] = await Promise.all([
      getTimeline(matchId, fm.IdStage),
      getLiveMatch(matchId),
    ]);

    const homeTeamId = fm.Home?.IdTeam;
    const goals = extractGoals(timeline, homeTeamId);
    const cards = extractCards(timeline, homeTeamId);
    const stats = extractStats(timeline, homeTeamId);
    const subs = liveData
      ? [...extractSubs(liveData, "home"), ...extractSubs(liveData, "away")]
          .sort((a, b) => a.minute - b.minute)
      : [];
    const lineupHome = liveData ? extractLineup(liveData, "home") : [];
    const lineupAway = liveData ? extractLineup(liveData, "away") : [];
    const currentMinute = isLive ? parseMinute(liveData?.MatchTime ?? "") : undefined;

    process.stdout.write(`goals=${goals.length} cards=${cards.length} stats=${Object.keys(stats).length}${isLive ? ` min=${currentMinute}` : ""} … `);

    let aiNotes;
    if (isLive) {
      // Always regenerate for live matches (state changes every run)
      aiNotes = await generateGroqLiveComment(
        homeName, awayName,
        fm.HomeTeamScore ?? 0, fm.AwayTeamScore ?? 0,
        currentMinute ?? 0, goals, cards
      ) ?? undefined;
      console.log(aiNotes ? "✓ Groq live" : "no comment");
      await sleep(1500);
    } else {
      // Finished: reuse cached aiNotes only if it was already a finished-match analysis
      // (not a live comment that was never refreshed after the match ended)
      const prevEntry = bySlug.get(pm.slug);
      const wasLive = prevEntry?.status === "live";
      const cached = !wasLive ? prevEntry?.detail?.aiNotes : null;
      if (cached) {
        aiNotes = cached;
        console.log("✓ cached");
      } else {
        const fmtSlug = (s) => s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        const groqComment = await generateGroqComment(
          fmtSlug(homeSlug), fmtSlug(awaySlug),
          fm.HomeTeamScore, fm.AwayTeamScore,
          goals, cards
        );
        aiNotes = groqComment ?? buildAiNotes(fm, goals, homeSlug, awaySlug);
        console.log(groqComment ? "✓ Groq" : "fallback");
        await sleep(1500);
      }
    }

    const detail = {
      goals,
      cards,
      substitutions: subs,
      lineup: { home: lineupHome, away: lineupAway },
      stats,
      ...(aiNotes ? { aiNotes } : {}),
      confidence: 0.97,
      evidenceUrl: isLive
        ? `https://api.fifa.com/api/v3/live/football/${matchId}`
        : `https://api.fifa.com/api/v3/timelines/${matchId}`,
    };

    bySlug.set(pm.slug, {
      slug: pm.slug,
      status: isLive ? "live" : "finished",
      homeScore: fm.HomeTeamScore ?? 0,
      awayScore: fm.AwayTeamScore ?? 0,
      ...(isLive && currentMinute ? { minute: currentMinute } : {}),
      evidenceUrl: `https://api.fifa.com/api/v3/live/football/${matchId}`,
      confidence: 0.97,
      detail,
    });
  }

  const output = {
    generatedAt: new Date().toISOString(),
    source: "fifa-api",
    matches: [...bySlug.values()],
  };

  if (apply) {
    writeFileSync(livePath, JSON.stringify(output, null, 2));
    console.log(`\n✓ live-updates.json updated (${bySlug.size} matches)`);
  } else {
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const previewDir = join(ROOT, "data/ai-updates");
    mkdirSync(previewDir, { recursive: true });
    const previewPath = join(previewDir, `fifa-fetch-${stamp}.json`);
    writeFileSync(previewPath, JSON.stringify(output, null, 2));
    console.log(`\nPreview → ${previewPath}`);
    console.log("Run with --apply to write live-updates.json");
  }
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
