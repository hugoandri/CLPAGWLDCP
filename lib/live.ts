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

/** Lee live-updates.json desde disco en cada llamada. Solo server-side. */
export function readLiveUpdates(): LiveMatchUpdate[] {
  try {
    const filePath = join(process.cwd(), "data/live-updates.json");
    return JSON.parse(readFileSync(filePath, "utf8")).matches ?? [];
  } catch {
    return [];
  }
}
