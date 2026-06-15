import type { MatchDetail } from "@/lib/types";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { unstable_cache } from "next/cache";

export interface LiveMatchUpdate {
  slug: string;
  status?: "upcoming" | "live" | "finished";
  homeScore?: number;
  awayScore?: number;
  minute?: number;
  detail?: MatchDetail;
}

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

function readFromFile(): LiveMatchUpdate[] {
  try {
    const filePath = join(process.cwd(), "data/live-updates.json");
    return JSON.parse(readFileSync(filePath, "utf8")).matches ?? [];
  } catch {
    return [];
  }
}

/** Sync fallback — use readLiveUpdatesWithFIFA() in server components instead. */
export function readLiveUpdates(): LiveMatchUpdate[] {
  return readFromFile();
}

async function _fetchGroqLiveComment(
  homeName: string,
  awayName: string,
  homeScore: number,
  awayScore: number,
  // minuteBucket rounds to nearest 5 min so the cache key doesn't change every minute
  minuteBucket: number,
): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
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
              "una describe cómo va el partido en este momento (marcador, quién domina, momento clave) " +
              "y la otra da una lectura táctica breve o qué puede pasar en lo que resta. " +
              "Sin emojis. Sin lenguaje de apuestas. Sin inventar datos.",
          },
          {
            role: "user",
            content: `Partido EN DIRECTO (min.${minuteBucket}): ${homeName} ${homeScore}-${awayScore} ${awayName}`,
          },
        ],
      }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return data.choices?.[0]?.message?.content?.trim() ?? null;
  } catch {
    return null;
  }
}

// Cache keyed by (homeName, awayName, homeScore, awayScore, minuteBucket).
// Refreshes automatically when a goal is scored (score changes → new cache key).
// Also revalidates every 2 minutes for mid-match context updates.
const getGroqLiveComment = unstable_cache(
  _fetchGroqLiveComment,
  ["groq-live-comment"],
  { revalidate: 120 },
);

/**
 * Fetches FIFA calendar and overlays live/finished status + scores on top of
 * the file data. For live matches, also generates a Groq commentary inline.
 * Cache is shared across concurrent requests (25 s revalidate for FIFA data).
 */
export async function readLiveUpdatesWithFIFA(): Promise<LiveMatchUpdate[]> {
  const fromFile = readFromFile();

  try {
    const url =
      `${FIFA_API}/calendar/matches?idCompetition=${ID_COMPETITION}&idSeason=${ID_SEASON}` +
      `&language=en&count=200&from=2026-06-01T00:00:00Z&to=2026-07-31T00:00:00Z`;

    const res = await fetch(url, { next: { revalidate: 25 } });
    if (!res.ok) return fromFile;

    const data = await res.json();
    const fifaMatches: any[] = data.Results ?? [];

    const bySlug = new Map(fromFile.map((m) => [m.slug, { ...m }]));

    for (const fm of fifaMatches) {
      const homeName = fm.Home?.TeamName?.[0]?.Description ?? "";
      const awayName = fm.Away?.TeamName?.[0]?.Description ?? "";
      const homeSlug = TEAM_SLUG[homeName];
      const awaySlug = TEAM_SLUG[awayName];
      if (!homeSlug || !awaySlug) continue;

      const slug = `${homeSlug}-vs-${awaySlug}`;
      if (!bySlug.has(slug)) continue;

      const isLive = fm.MatchStatus === 3;
      const isFinished = fm.MatchStatus === 0;
      if (!isLive && !isFinished) continue;

      const homeScore = fm.HomeTeamScore ?? 0;
      const awayScore = fm.AwayTeamScore ?? 0;

      let minute: number | undefined;
      if (isLive) {
        const apiMinute =
          typeof fm.MatchTime === "string" ? parseInt(fm.MatchTime, 10) : undefined;
        if (apiMinute && !isNaN(apiMinute)) {
          minute = apiMinute;
        } else if (fm.Date) {
          const elapsed = Math.floor((Date.now() - new Date(fm.Date).getTime()) / 60_000);
          const adj = elapsed > 60 ? Math.min(elapsed - 15, 90) : Math.min(elapsed, 45);
          minute = Math.max(1, adj);
        }
      }

      const existing = bySlug.get(slug)!;

      // For live matches: generate Groq commentary inline.
      // Cache key includes score so it auto-refreshes on every goal.
      let aiNotes = existing.detail?.aiNotes;
      if (isLive && minute !== undefined) {
        const minuteBucket = Math.floor(minute / 5) * 5;
        const comment = await getGroqLiveComment(
          homeName, awayName, homeScore, awayScore, minuteBucket,
        );
        if (comment) aiNotes = comment;
      }

      bySlug.set(slug, {
        ...existing,
        status: isLive ? "live" : "finished",
        homeScore,
        awayScore,
        ...(minute !== undefined ? { minute } : {}),
        ...(aiNotes && existing.detail
          ? { detail: { ...existing.detail, aiNotes } }
          : aiNotes
          ? { detail: { goals: [], cards: [], substitutions: [], lineup: { home: [], away: [] }, stats: {}, aiNotes, confidence: 0.9, evidenceUrl: "" } as unknown as MatchDetail }
          : {}),
      });
    }

    return Array.from(bySlug.values());
  } catch {
    return fromFile;
  }
}
