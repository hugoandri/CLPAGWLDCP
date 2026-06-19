import type { Match, MatchSide } from "@/lib/types";

export interface PlayerStatRow {
  player: string;
  teamSlug: string;
  value: number;
}

function aggregate(
  matches: Match[],
  extract: (m: Match) => { team: MatchSide; player: string }[],
): PlayerStatRow[] {
  const map = new Map<string, PlayerStatRow>();
  for (const m of matches) {
    for (const { team, player } of extract(m)) {
      const teamSlug = team === "home" ? m.homeSlug : m.awaySlug;
      const key = `${teamSlug}__${player}`;
      const row = map.get(key);
      if (row) row.value++;
      else map.set(key, { player, teamSlug, value: 1 });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.value - a.value);
}

/** Ranking de goleadores del torneo a partir de los goles registrados por partido. */
export function computeTopScorers(matches: Match[]): PlayerStatRow[] {
  return aggregate(matches, (m) =>
    (m.detail?.goals ?? []).map((g) => ({ team: g.team, player: g.scorer })),
  );
}

/** Ranking de asistencias del torneo. */
export function computeTopAssists(matches: Match[]): PlayerStatRow[] {
  return aggregate(matches, (m) =>
    (m.detail?.goals ?? [])
      .filter((g) => g.assist)
      .map((g) => ({ team: g.team, player: g.assist as string })),
  );
}

/** Ranking de tarjetas amarillas (no incluye la segunda amarilla que deriva en roja). */
export function computeYellowCards(matches: Match[]): PlayerStatRow[] {
  return aggregate(matches, (m) =>
    (m.detail?.cards ?? [])
      .filter((c) => c.type === "yellow")
      .map((c) => ({ team: c.team, player: c.player })),
  );
}

/** Ranking de tarjetas rojas (directas y por doble amarilla). */
export function computeRedCards(matches: Match[]): PlayerStatRow[] {
  return aggregate(matches, (m) =>
    (m.detail?.cards ?? [])
      .filter((c) => c.type === "red" || c.type === "yellow_red")
      .map((c) => ({ team: c.team, player: c.player })),
  );
}
