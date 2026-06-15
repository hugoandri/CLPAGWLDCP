/**
 * Daily opinion column generator for DataGoal 2026
 * Uses Groq to write a journalistic column covering all finished matches of a date.
 *
 * Usage:
 *   node scripts/generate-opinion.mjs              # yesterday Chile time (auto)
 *   node scripts/generate-opinion.mjs --date=2026-06-13
 *   node scripts/generate-opinion.mjs --seed       # generate all past dates with no column
 */
import { writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const GROQ_API_KEY = process.env.GROQ_API_KEY ?? "";
const GROQ_MODEL = "llama-3.3-70b-versatile";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const COLUMNS_FILE = join(ROOT, "data/opinion-columns.json");
const UPDATES_FILE = join(ROOT, "data/live-updates.json");

const TEAM_NAMES = {
  "mexico": "México", "sudafrica": "Sudáfrica", "corea-del-sur": "Corea del Sur",
  "chequia": "Chequia", "canada": "Canadá", "bosnia-herzegovina": "Bosnia-Herzegovina",
  "estados-unidos": "Estados Unidos", "paraguay": "Paraguay", "catar": "Catar",
  "suiza": "Suiza", "brasil": "Brasil", "marruecos": "Marruecos",
  "haiti": "Haití", "escocia": "Escocia", "australia": "Australia",
  "turquia": "Turquía", "costa-de-marfil": "Costa de Marfil", "ecuador": "Ecuador",
  "alemania": "Alemania", "curazao": "Curazao", "paises-bajos": "Países Bajos",
  "japon": "Japón", "suecia": "Suecia", "tunez": "Túnez",
  "arabia-saudita": "Arabia Saudita", "uruguay": "Uruguay", "espana": "España",
  "cabo-verde": "Cabo Verde", "belgica": "Bélgica", "egipto": "Egipto",
  "iran": "Irán", "nueva-zelanda": "Nueva Zelanda", "francia": "Francia",
  "senegal": "Senegal", "irak": "Irak", "noruega": "Noruega",
  "argentina": "Argentina", "argelia": "Argelia", "austria": "Austria",
  "jordania": "Jordania", "ghana": "Ghana", "panama": "Panamá",
  "inglaterra": "Inglaterra", "croacia": "Croacia", "portugal": "Portugal",
  "rd-congo": "RD Congo", "uzbekistan": "Uzbekistán", "colombia": "Colombia",
};

function getName(slug) {
  return TEAM_NAMES[slug] ?? slug.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
}

// Read matches from matches.ts (static) and merge with live-updates.json
function loadMatches() {
  const src = readFileSync(join(ROOT, "data/matches.ts"), "utf-8");
  const re = /fixture\(\{\s*slug:\s*"([^"]+)"[^}]*?homeSlug:\s*"([^"]+)"[^}]*?awaySlug:\s*"([^"]+)"[^}]*?date:\s*"([^"]+)"[^}]*?group:\s*"([^"]+)"[^}]*?(?:stage:\s*"([^"]+)")?(?:[^}]*?status:\s*"([^"]+)")?(?:[^}]*?homeScore:\s*(\d+))?(?:[^}]*?awayScore:\s*(\d+))?/gs;
  const results = [];
  let m;
  while ((m = re.exec(src)) !== null) {
    results.push({
      slug: m[1], homeSlug: m[2], awaySlug: m[3],
      date: m[4], group: m[5], stage: m[6] ?? "",
      status: m[7] ?? "upcoming",
      homeScore: m[8] != null ? parseInt(m[8]) : undefined,
      awayScore: m[9] != null ? parseInt(m[9]) : undefined,
    });
  }

  // Merge with live-updates.json for current scores/status
  let updates = [];
  try {
    updates = JSON.parse(readFileSync(UPDATES_FILE, "utf-8")).matches ?? [];
  } catch { /* file may not exist yet */ }
  const bySlug = new Map(updates.map(u => [u.slug, u]));

  return results.map(match => {
    const u = bySlug.get(match.slug);
    if (!u) return match;
    return {
      ...match,
      status: u.status ?? match.status,
      homeScore: u.homeScore ?? match.homeScore,
      awayScore: u.awayScore ?? match.awayScore,
    };
  });
}

function readColumns() {
  try {
    return JSON.parse(readFileSync(COLUMNS_FILE, "utf-8")).columns ?? [];
  } catch { return []; }
}

function saveColumn(col) {
  const existing = readColumns();
  const idx = existing.findIndex(c => c.date === col.date);
  if (idx >= 0) existing[idx] = col;
  else existing.push(col);
  existing.sort((a, b) => b.date.localeCompare(a.date)); // newest first
  writeFileSync(COLUMNS_FILE, JSON.stringify({ columns: existing }, null, 2));
}

async function generateColumn(date, dayMatches) {
  if (!GROQ_API_KEY) {
    console.error("  ✗ Missing GROQ_API_KEY");
    return null;
  }

  const [year, month, day] = date.split("-");
  const dateFormatted = `${day}-${month}-${year}`;

  const matchLines = dayMatches.map(m => {
    const h = getName(m.homeSlug);
    const a = getName(m.awaySlug);
    return `- ${h} ${m.homeScore}-${m.awayScore} ${a} (Grupo ${m.group})`;
  }).join("\n");

  const systemPrompt =
    "Eres columnista deportivo especializado en fútbol internacional para el Mundial 2026. " +
    "Tu estilo es directo, con criterio propio y apasionado: como un columnista de referencia " +
    "de un diario deportivo serio. Puedes criticar cuando algo te parece mal y elogiar " +
    "cuando algo merece elogio. Escribes en español, sin clichés y sin lenguaje de apuestas.";

  const userPrompt =
    `Escribe la columna de opinión sobre los partidos del ${dateFormatted} del Mundial 2026.\n\n` +
    `Partidos jugados:\n${matchLines}\n\n` +
    `La columna debe tener esta estructura exacta, con párrafos separados por línea en blanco:\n\n` +
    `1. Párrafo de apertura (2-3 oraciones): contextualiza qué nos dejó este día de fútbol.\n\n` +
    `2. Un párrafo por cada partido (3-4 oraciones): empieza con el nombre del enfrentamiento ` +
    `(ej: "México 2-0 Sudáfrica."). Analiza el resultado, qué ocurrió, y opina sobre el ` +
    `rendimiento de cada selección y qué dice de sus posibilidades en el torneo.\n\n` +
    `3. Párrafo final que empieza con "Opinión personal:" (3-4 oraciones): reflexión global ` +
    `sobre la jornada o algo que te haya sorprendido.\n\n` +
    `Escribe en párrafos corridos, sin listas, sin negritas, sin emojis, sin inventar datos.`;

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        max_tokens: 1000,
        temperature: 0.82,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!res.ok) {
      console.error(`  ✗ Groq ${res.status}: ${await res.text()}`);
      return null;
    }

    const data = await res.json();
    const body = data.choices?.[0]?.message?.content?.trim();
    if (!body) return null;

    return {
      date,
      title: `La opinión sobre la fecha ${dateFormatted}`,
      body,
      matchCount: dayMatches.length,
      generatedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error(`  ✗ ${err.message}`);
    return null;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const seedMode = args.includes("--seed");
  const forcedDate = args.find(a => a.startsWith("--date="))?.slice(7);

  const allMatches = loadMatches();

  let datesToProcess;

  if (seedMode) {
    const existingDates = new Set(readColumns().map(c => c.date));
    const datesWithFinished = [
      ...new Set(allMatches.filter(m => m.status === "finished").map(m => m.date)),
    ]
      .filter(d => !existingDates.has(d))
      .sort(); // oldest first
    datesToProcess = datesWithFinished;
    if (datesToProcess.length === 0) {
      console.log("Seed mode: all past dates already have columns.");
      return;
    }
    console.log(`Seed mode: will generate columns for: ${datesToProcess.join(", ")}`);
  } else if (forcedDate) {
    datesToProcess = [forcedDate];
    console.log(`Manual mode: generating for ${forcedDate}`);
  } else {
    // Default: yesterday in Chile time (UTC-4)
    const chileNow = new Date(Date.now() - 4 * 60 * 60 * 1000);
    const yesterday = new Date(chileNow.getTime() - 24 * 60 * 60 * 1000);
    const date = yesterday.toISOString().slice(0, 10);
    datesToProcess = [date];
    console.log(`Auto mode: generating for ${date} (yesterday Chile time)`);
  }

  for (const date of datesToProcess) {
    const dayMatches = allMatches.filter(
      m => m.date === date && m.status === "finished" &&
           m.homeScore != null && m.awayScore != null,
    );

    if (dayMatches.length === 0) {
      console.log(`\n${date}: no finished matches — skip`);
      continue;
    }

    console.log(`\n${date}: ${dayMatches.length} match(es)`);
    dayMatches.forEach(m =>
      console.log(`  ${getName(m.homeSlug)} ${m.homeScore}-${m.awayScore} ${getName(m.awaySlug)}`),
    );

    process.stdout.write("  Calling Groq... ");
    const column = await generateColumn(date, dayMatches);

    if (!column) {
      console.log("FAILED");
      continue;
    }

    saveColumn(column);
    console.log(`✓ Saved: "${column.title}"`);

    // Rate-limit between multiple requests
    if (datesToProcess.indexOf(date) < datesToProcess.length - 1) {
      await new Promise(r => setTimeout(r, 2500));
    }
  }

  console.log("\nDone.");
}

main().catch(err => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
