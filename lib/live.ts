import type { MatchDetail } from "@/lib/types";
import { readFileSync } from "node:fs";
import { join } from "node:path";

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

/**
 * Fetches FIFA calendar and overlays live/finished status + scores on top of
 * the file data. Cache is shared across concurrent requests (25 s revalidate).
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
      const homeSlug = TEAM_SLUG[fm.Home?.TeamName?.[0]?.Description ?? ""];
      const awaySlug = TEAM_SLUG[fm.Away?.TeamName?.[0]?.Description ?? ""];
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
        // Use FIFA's own match clock ("30'", "45+2'", etc.) when available
        const apiMinute = typeof fm.MatchTime === "string"
          ? parseInt(fm.MatchTime, 10)
          : undefined;
        if (apiMinute && !isNaN(apiMinute)) {
          minute = apiMinute;
        } else if (fm.Date) {
          const elapsed = Math.floor((Date.now() - new Date(fm.Date).getTime()) / 60_000);
          const adj = elapsed > 60 ? Math.min(elapsed - 15, 90) : Math.min(elapsed, 45);
          minute = Math.max(1, adj);
        }
      }

      const existing = bySlug.get(slug)!;
      bySlug.set(slug, {
        ...existing,
        status: isLive ? "live" : "finished",
        homeScore,
        awayScore,
        ...(minute !== undefined ? { minute } : {}),
      });
    }

    return Array.from(bySlug.values());
  } catch {
    return fromFile;
  }
}
