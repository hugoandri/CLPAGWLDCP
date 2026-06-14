import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, "config/sports-agent.json");
const PROMPT_PATH = path.join(ROOT, "prompts/sports-update.md");
const TEAMS_PATH = path.join(ROOT, "data/teams.ts");
const MATCHES_PATH = path.join(ROOT, "data/matches.ts");
const LIVE_UPDATES_PATH = path.join(ROOT, "data/live-updates.json");
const TEAM_NOTES_PATH = path.join(ROOT, "data/team-notes.json");
const DRAFTS_DIR = path.join(ROOT, "data/ai-updates");

const args = new Set(process.argv.slice(2));
const apply = args.has("--apply");
const checkOnly = args.has("--check");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function unique(values) {
  return [...new Set(values)];
}

function extractKnownState() {
  const teamsSource = fs.readFileSync(TEAMS_PATH, "utf8");
  const matchesSource = fs.readFileSync(MATCHES_PATH, "utf8");

  const teams = [...teamsSource.matchAll(/slug: "([^"]+)", name: "([^"]+)"/g)].map(
    ([, slug, name]) => ({ slug, name }),
  );
  const matches = [...matchesSource.matchAll(/fixture\(\{ slug: "([^"]+)", homeSlug: "([^"]+)", awaySlug: "([^"]+)"/g)].map(
    ([, slug, homeSlug, awaySlug]) => ({ slug, homeSlug, awaySlug }),
  );

  return { teams, matches };
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchSource(url, maxChars) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "DataGoalBot/0.1 (+https://datagoal.local; editorial data update)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.7",
      },
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    return {
      url,
      html, // kept for link discovery
      text: stripHtml(html).slice(0, maxChars),
    };
  } finally {
    clearTimeout(timeout);
  }
}

// Patrones de páginas de reporte de partido por dominio
const REPORT_PATTERNS = [
  { re: /bbc\.co\.uk\/sport\/football\/articles\/[a-z0-9]+/, label: "BBC article" },
  { re: /bbc\.co\.uk\/sport\/football\/live\/[a-z0-9-]+world-cup/, label: "BBC live" },
  { re: /theguardian\.com\/football\/\d{4}\/[a-z]+\/\d+\/[a-z0-9-]+-match-report/, label: "Guardian match report" },
  { re: /theguardian\.com\/football\/\d{4}\/[a-z]+\/\d+\/[a-z0-9-]+-world-cup/, label: "Guardian world cup" },
  { re: /skysports\.com\/football\/[a-z]+-vs-[a-z]+\/\d+/, label: "Sky match" },
  { re: /cbssports\.com\/soccer\/gametracker\/recap\//, label: "CBS recap" },
  { re: /cbssports\.com\/soccer\/world-cup\/[a-z0-9-]+-recap/, label: "CBS world cup recap" },
];

function extractMatchReportLinks(html, baseUrl) {
  const seen = new Set();
  const links = [];
  const re = /href="([^"#]+)"/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    let href;
    try { href = new URL(m[1], baseUrl).toString(); } catch { continue; }
    if (seen.has(href)) continue;
    seen.add(href);
    if (REPORT_PATTERNS.some((p) => p.re.test(href))) links.push(href);
  }
  return links;
}

function finishedSlugsWithoutDetail() {
  try {
    const live = JSON.parse(fs.readFileSync(LIVE_UPDATES_PATH, "utf8"));
    return new Set(
      (live.matches ?? [])
        .filter((m) => m.status === "finished" && !m.detail?.goals?.length && !m.detail?.stats?.possession)
        .map((m) => m.slug),
    );
  } catch {
    return new Set();
  }
}

async function discoverReportSources(hubSources, maxCharsReport, maxReports = 3) {
  // 1. Collect candidate links from all hub pages
  const candidates = new Set();
  for (const s of hubSources) {
    for (const link of extractMatchReportLinks(s.html ?? "", s.url)) {
      candidates.add(link);
    }
  }

  if (candidates.size === 0) return [];
  console.error(`[DISCOVERY] ${candidates.size} links de reporte encontrados`);

  // 2. Fetch up to maxReports unique report pages
  const reportSources = [];
  for (const url of [...candidates]) {
    if (reportSources.length >= maxReports) break;
    try {
      const source = await fetchSource(url, maxCharsReport);
      reportSources.push(source);
      console.error(`[REPORT] OK ${url}`);
    } catch (err) {
      console.error(`[REPORT] SKIP ${url} — ${err.message}`);
    }
  }
  return reportSources;
}

function asUrl(value) {
  try {
    return new URL(value).toString();
  } catch {
    return null;
  }
}

function extractJsonObject(text) {
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) throw new Error("Groq no devolvio JSON parseable");
    return JSON.parse(text.slice(start, end + 1));
  }
}

async function callGroq({ config, systemPrompt, knownState, sources }) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("Falta GROQ_API_KEY en el entorno");

  const context = {
    knownTeams: knownState.teams,
    knownMatches: knownState.matches,
    sources,
  };

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify(context) },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Groq API fallo: HTTP ${res.status} ${body}`);
  }

  const json = await res.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("Groq no devolvio contenido");
  return extractJsonObject(content);
}

function sanitizeDetail(raw) {
  if (!raw || typeof raw !== "object") return undefined;

  const VALID_SIDES = new Set(["home", "away"]);
  const VALID_GOAL_TYPES = new Set(["goal", "own_goal", "penalty"]);
  const VALID_CARD_TYPES = new Set(["yellow", "red", "yellow_red"]);
  const VALID_POSITIONS = new Set(["GK", "DEF", "MID", "FWD"]);

  const validMinute = (m) => Number.isInteger(Number(m)) && Number(m) >= 0 && Number(m) <= 130;
  const validPct = (v) => Number.isFinite(Number(v)) && Number(v) >= 0 && Number(v) <= 100;
  const validCount = (v) => Number.isInteger(Number(v)) && Number(v) >= 0 && Number(v) <= 100;
  const cleanStr = (s, max) => { const t = String(s ?? "").trim(); return t.length > 0 && t.length <= max ? t : null; };

  const goals = [];
  for (const g of Array.isArray(raw.goals) ? raw.goals : []) {
    const scorer = cleanStr(g.scorer, 80);
    if (!validMinute(g.minute) || !VALID_SIDES.has(g.team) || !scorer || !VALID_GOAL_TYPES.has(g.type)) continue;
    const goal = { minute: Number(g.minute), team: g.team, scorer, type: g.type };
    const assist = cleanStr(g.assist, 80);
    if (assist) goal.assist = assist;
    goals.push(goal);
  }

  const cards = [];
  for (const c of Array.isArray(raw.cards) ? raw.cards : []) {
    const player = cleanStr(c.player, 80);
    if (!validMinute(c.minute) || !VALID_SIDES.has(c.team) || !player || !VALID_CARD_TYPES.has(c.type)) continue;
    cards.push({ minute: Number(c.minute), team: c.team, player, type: c.type });
  }

  const substitutions = [];
  for (const s of Array.isArray(raw.substitutions) ? raw.substitutions : []) {
    const playerOut = cleanStr(s.playerOut, 80);
    const playerIn = cleanStr(s.playerIn, 80);
    if (!validMinute(s.minute) || !VALID_SIDES.has(s.team) || !playerOut || !playerIn) continue;
    substitutions.push({ minute: Number(s.minute), team: s.team, playerOut, playerIn });
  }

  const sanitizeLineup = (arr) =>
    (Array.isArray(arr) ? arr : [])
      .map((p) => {
        const name = cleanStr(p.name, 80);
        if (!name) return null;
        const entry = { name };
        if (Number.isInteger(Number(p.number)) && Number(p.number) > 0 && Number(p.number) <= 99) entry.number = Number(p.number);
        if (VALID_POSITIONS.has(p.position)) entry.position = p.position;
        return entry;
      })
      .filter(Boolean);

  const homeLineup = sanitizeLineup(raw.lineup?.home);
  const awayLineup = sanitizeLineup(raw.lineup?.away);

  const stats = {};
  const rawStats = raw.stats ?? {};
  if (validPct(rawStats.possession?.home) && validPct(rawStats.possession?.away))
    stats.possession = { home: Number(rawStats.possession.home), away: Number(rawStats.possession.away) };
  if (validCount(rawStats.shotsOnTarget?.home) && validCount(rawStats.shotsOnTarget?.away))
    stats.shotsOnTarget = { home: Number(rawStats.shotsOnTarget.home), away: Number(rawStats.shotsOnTarget.away) };
  if (validCount(rawStats.corners?.home) && validCount(rawStats.corners?.away))
    stats.corners = { home: Number(rawStats.corners.home), away: Number(rawStats.corners.away) };
  if (validPct(rawStats.passAccuracy?.home) && validPct(rawStats.passAccuracy?.away))
    stats.passAccuracy = { home: Number(rawStats.passAccuracy.home), away: Number(rawStats.passAccuracy.away) };

  const aiNotes = cleanStr(raw.aiNotes, 600);
  const evidenceUrl = asUrl(raw.evidenceUrl);
  const confidence = Number(raw.confidence);

  if (!evidenceUrl || !Number.isFinite(confidence)) return undefined;

  const hasContent = goals.length > 0 || cards.length > 0 || substitutions.length > 0
    || homeLineup.length > 0 || awayLineup.length > 0 || Object.keys(stats).length > 0 || aiNotes;
  if (!hasContent) return undefined;

  return {
    goals: goals.sort((a, b) => a.minute - b.minute),
    cards: cards.sort((a, b) => a.minute - b.minute),
    substitutions: substitutions.sort((a, b) => a.minute - b.minute),
    lineup: { home: homeLineup, away: awayLineup },
    stats,
    ...(aiNotes ? { aiNotes } : {}),
    confidence,
    evidenceUrl,
  };
}

function sanitizeGroqOutput(raw, knownState, minimumConfidence) {
  const teamSlugs = new Set(knownState.teams.map((team) => team.slug));
  const matchSlugs = new Set(knownState.matches.map((match) => match.slug));
  const validStatuses = new Set(["upcoming", "live", "finished"]);
  const validTrends = new Set(["positive", "neutral", "negative"]);

  const matchUpdates = [];
  for (const item of Array.isArray(raw.matchUpdates) ? raw.matchUpdates : []) {
    const confidence = Number(item.confidence);
    const evidenceUrl = asUrl(item.evidenceUrl);
    const homeScore = Number(item.homeScore);
    const awayScore = Number(item.awayScore);
    const minute = item.minute === undefined || item.minute === null ? undefined : Number(item.minute);

    if (!matchSlugs.has(item.slug)) continue;
    if (!validStatuses.has(item.status)) continue;
    if (!Number.isFinite(confidence) || confidence < minimumConfidence) continue;
    if (!evidenceUrl) continue;
    if ((item.status === "finished" || item.status === "live") && (!Number.isInteger(homeScore) || !Number.isInteger(awayScore))) continue;
    if (Number.isFinite(homeScore) && (homeScore < 0 || homeScore > 30)) continue;
    if (Number.isFinite(awayScore) && (awayScore < 0 || awayScore > 30)) continue;
    if (minute !== undefined && (!Number.isInteger(minute) || minute < 0 || minute > 130)) continue;

    const detail = item.status === "finished" ? sanitizeDetail(item.detail) : undefined;

    matchUpdates.push({
      slug: item.slug,
      status: item.status,
      ...(Number.isInteger(homeScore) ? { homeScore } : {}),
      ...(Number.isInteger(awayScore) ? { awayScore } : {}),
      ...(minute !== undefined ? { minute } : {}),
      evidenceUrl,
      confidence,
      ...(detail ? { detail } : {}),
    });
  }

  const teamNotes = [];
  for (const item of Array.isArray(raw.teamNotes) ? raw.teamNotes : []) {
    const confidence = Number(item.confidence);
    const evidenceUrls = unique((Array.isArray(item.evidenceUrls) ? item.evidenceUrls : [])
      .map(asUrl)
      .filter(Boolean));
    const headline = String(item.headline ?? "").trim();
    const body = String(item.body ?? "").trim();

    if (!teamSlugs.has(item.teamSlug)) continue;
    if (!validTrends.has(item.trend)) continue;
    if (!Number.isFinite(confidence) || confidence < minimumConfidence) continue;
    if (!headline || headline.length > 120) continue;
    if (!body || body.length > 320) continue;
    if (evidenceUrls.length === 0) continue;

    teamNotes.push({
      teamSlug: item.teamSlug,
      headline,
      body,
      trend: item.trend,
      evidenceUrls,
      confidence,
    });
  }

  return { matchUpdates, teamNotes };
}

function mergeByKey(existing, updates, key) {
  const merged = new Map((Array.isArray(existing) ? existing : []).map((item) => [item[key], item]));
  for (const update of updates) merged.set(update[key], { ...merged.get(update[key]), ...update });
  return [...merged.values()];
}

function applyUpdates(sanitized, generatedAt) {
  const currentLive = readJson(LIVE_UPDATES_PATH);
  const currentNotes = readJson(TEAM_NOTES_PATH);

  writeJson(LIVE_UPDATES_PATH, {
    generatedAt,
    source: "groq-sports-agent",
    matches: mergeByKey(currentLive.matches, sanitized.matchUpdates, "slug"),
  });

  writeJson(TEAM_NOTES_PATH, {
    generatedAt,
    source: "groq-sports-agent",
    notes: mergeByKey(currentNotes.notes, sanitized.teamNotes, "teamSlug"),
  });
}

async function main() {
  const config = readJson(CONFIG_PATH);
  const knownState = extractKnownState();

  if (!Array.isArray(config.sources)) throw new Error("config/sports-agent.json necesita sources: []");
  if (!Number.isFinite(Number(config.minimumConfidence))) throw new Error("minimumConfidence debe ser numerico");
  if (!Number.isFinite(Number(config.maxCharsPerSource))) throw new Error("maxCharsPerSource debe ser numerico");

  if (checkOnly) {
    console.log(`Config OK. Equipos: ${knownState.teams.length}. Partidos: ${knownState.matches.length}. Sources: ${config.sources.length}.`);
    return;
  }

  if (config.sources.length === 0) {
    throw new Error("Agrega al menos una URL en config/sports-agent.json -> sources antes de ejecutar el agente.");
  }

  const sourceUrls = config.sources.map(asUrl).filter(Boolean);
  if (sourceUrls.length !== config.sources.length) throw new Error("Hay sources invalidas en config/sports-agent.json");

  // Paso 1: hub pages (para scores generales + descubrimiento de links)
  const hubSources = [];
  for (const url of sourceUrls) {
    try {
      hubSources.push(await fetchSource(url, Number(config.maxCharsPerSource)));
    } catch (err) {
      console.error(`[SKIP] ${url} — ${err.message}`);
    }
  }
  if (hubSources.length === 0) throw new Error("Todas las fuentes fallaron. Verifica las URLs en config/sports-agent.json.");

  // Paso 2: descubrir y fetchear páginas de reporte de partido
  // Los reportes tienen más chars porque son la fuente de detalle real
  const maxCharsReport = Math.min(Number(config.maxCharsPerSource) * 2, 8000);
  const reportSources = await discoverReportSources(hubSources, maxCharsReport, config.maxReports ?? 3);

  // Si hay reportes, usarlos como fuentes principales + 1 hub para contexto de scores
  // Si no hay reportes, usar hub pages (comportamiento anterior)
  const sources = reportSources.length > 0
    ? [...reportSources, hubSources[0]]
    : hubSources;

  console.error(`[SOURCES] ${reportSources.length} reportes + ${sources.length - reportSources.length} hub(s)`);

  const raw = await callGroq({
    config,
    systemPrompt: fs.readFileSync(PROMPT_PATH, "utf8"),
    knownState,
    sources: sources.map(({ url, text }) => ({ url, text })), // no pasar html a Groq
  });

  const generatedAt = new Date().toISOString();
  const sanitized = sanitizeGroqOutput(raw, knownState, Number(config.minimumConfidence));
  const draft = { generatedAt, apply, sources: sourceUrls, ...sanitized };

  fs.mkdirSync(DRAFTS_DIR, { recursive: true });
  const draftPath = path.join(DRAFTS_DIR, `sports-update-${generatedAt.replace(/[:.]/g, "-")}.json`);
  writeJson(draftPath, draft);

  if (apply) applyUpdates(sanitized, generatedAt);

  console.log(JSON.stringify({
    draftPath: path.relative(ROOT, draftPath),
    applied: apply,
    matchUpdates: sanitized.matchUpdates.length,
    teamNotes: sanitized.teamNotes.length,
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
