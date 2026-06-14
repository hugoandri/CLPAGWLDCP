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
// FIFA team name → project slug
// -------------------------------------------------------------------
const TEAM_SLUG = {
  Germany: "alemania",
  "Curaçao": "curazao",
  Netherlands: "paises-bajos",
  Japan: "japon",
  Haiti: "haiti",
  Scotland: "escocia",
  Australia: "australia",
  "Türkiye": "turquia",
  Turkey: "turquia",
  Mexico: "mexico",
  "South Africa": "sudafrica",
  "Korea Republic": "corea-del-sur",
  "Czech Republic": "chequia",
  Czechia: "chequia",
  Canada: "canada",
  "Bosnia and Herzegovina": "bosnia-herzegovina",
  USA: "estados-unidos",
  "United States": "estados-unidos",
  Paraguay: "paraguay",
  Qatar: "catar",
  Switzerland: "suiza",
  Brazil: "brasil",
  Morocco: "marruecos",
  "Côte d'Ivoire": "costa-de-marfil",
  Ecuador: "ecuador",
  Sweden: "suecia",
  Tunisia: "tunez",
  "Saudi Arabia": "arabia-saudita",
  Uruguay: "uruguay",
  Spain: "espana",
  "Cabo Verde": "cabo-verde",
  "Cape Verde": "cabo-verde",
  Iran: "iran",
  "IR Iran": "iran",
  "New Zealand": "nueva-zelanda",
  Belgium: "belgica",
  Egypt: "egipto",
  France: "francia",
  Senegal: "senegal",
  Iraq: "irak",
  Norway: "noruega",
  Argentina: "argentina",
  Algeria: "argelia",
  Austria: "austria",
  Jordan: "jordania",
  Ghana: "ghana",
  Panama: "panama",
  England: "inglaterra",
  Croatia: "croacia",
  Portugal: "portugal",
  "DR Congo": "rd-congo",
  "Congo DR": "rd-congo",
  Uzbekistan: "uzbekistan",
  Colombia: "colombia",
};

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

async function getFinishedMatches() {
  const url =
    `${FIFA_API}/calendar/matches` +
    `?idCompetition=${ID_COMPETITION}&idSeason=${ID_SEASON}` +
    `&language=${LANG}&count=200` +
    `&from=2026-06-01T00:00:00Z&to=2026-07-31T00:00:00Z`;
  const data = await fetchJSON(url);
  return (data.Results ?? []).filter((m) => m.MatchStatus === 0);
}

async function getTimeline(matchId) {
  try {
    const data = await fetchJSON(`${FIFA_API}/timelines/${matchId}?language=${LANG}`);
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

  console.log("→ Fetching finished matches from FIFA API…");
  const fifaMatches = await getFinishedMatches();
  console.log(`  Found ${fifaMatches.length} finished matches\n`);

  // Start from existing matches list, update in-place
  const bySlug = new Map((existing.matches ?? []).map((u) => [u.slug, u]));

  for (const fm of fifaMatches) {
    const homeName = fm.Home?.TeamName?.[0]?.Description ?? "";
    const awayName = fm.Away?.TeamName?.[0]?.Description ?? "";
    const homeSlug = TEAM_SLUG[homeName];
    const awaySlug = TEAM_SLUG[awayName];

    if (!homeSlug || !awaySlug) {
      console.warn(`  SKIP (no slug): ${homeName} vs ${awayName}`);
      continue;
    }

    const pm = projectMatches.find(
      (p) => p.homeSlug === homeSlug && p.awaySlug === awaySlug
    );
    if (!pm) {
      console.warn(`  SKIP (not in project): ${homeSlug} vs ${awaySlug}`);
      continue;
    }

    const matchId = fm.IdMatch;
    process.stdout.write(`  ${pm.slug} … `);

    const [timeline, liveData] = await Promise.all([
      getTimeline(matchId),
      getLiveMatch(matchId),
    ]);

    const homeTeamId = fm.Home?.IdTeam;
    const goals = extractGoals(timeline, homeTeamId);
    const cards = extractCards(timeline, homeTeamId);
    const subs = liveData
      ? [
          ...extractSubs(liveData, "home"),
          ...extractSubs(liveData, "away"),
        ].sort((a, b) => a.minute - b.minute)
      : [];
    const lineupHome = liveData ? extractLineup(liveData, "home") : [];
    const lineupAway = liveData ? extractLineup(liveData, "away") : [];

    process.stdout.write(`goals=${goals.length} cards=${cards.length} subs=${subs.length} lineup=${lineupHome.length}+${lineupAway.length} … `);

    const fmtSlug = (s) => s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    const groqComment = await generateGroqComment(
      fmtSlug(homeSlug), fmtSlug(awaySlug),
      fm.HomeTeamScore, fm.AwayTeamScore,
      goals, cards
    );
    const aiNotes = groqComment ?? buildAiNotes(fm, goals, homeSlug, awaySlug);
    console.log(groqComment ? "✓ Groq" : "fallback");

    // Respect Groq free-tier TPM limit
    await sleep(1500);

    const detail = {
      goals,
      cards,
      substitutions: subs,
      lineup: { home: lineupHome, away: lineupAway },
      stats: {},
      aiNotes,
      confidence: 0.97,
      evidenceUrl: `https://api.fifa.com/api/v3/timelines/${matchId}`,
    };

    bySlug.set(pm.slug, {
      slug: pm.slug,
      status: "finished",
      homeScore: fm.HomeTeamScore,
      awayScore: fm.AwayTeamScore,
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
