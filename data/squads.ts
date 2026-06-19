import squadsSnapshot from "@/data/squads.json";
import type { SquadPlayer } from "@/lib/types";

interface SquadEntry {
  evidenceUrl?: string;
  players: SquadPlayer[];
}

const squads = squadsSnapshot.squads as Record<string, SquadEntry>;

/** Nómina completa (titulares + suplentes) de una selección, si ya disputó algún partido. */
export function getSquad(teamSlug: string): SquadPlayer[] | undefined {
  return squads[teamSlug]?.players;
}
