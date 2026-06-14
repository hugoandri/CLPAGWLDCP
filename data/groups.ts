import { matches } from "@/data/matches";
import { GROUP_IDS, getTeamsByGroup } from "@/data/teams";
import type { Group, GroupStandingInput } from "@/lib/types";

function buildRows(groupId: string): GroupStandingInput[] {
  const rows = new Map<string, GroupStandingInput>();

  getTeamsByGroup(groupId).forEach((team) => {
    rows.set(team.slug, {
      teamSlug: team.slug,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
    });
  });

  matches
    .filter(
      (match) =>
        match.group === groupId &&
        match.status === "finished" &&
        match.homeScore !== undefined &&
        match.awayScore !== undefined,
    )
    .forEach((match) => {
      const home = rows.get(match.homeSlug);
      const away = rows.get(match.awaySlug);
      if (!home || !away) return;

      home.gf += match.homeScore ?? 0;
      home.ga += match.awayScore ?? 0;
      away.gf += match.awayScore ?? 0;
      away.ga += match.homeScore ?? 0;

      if ((match.homeScore ?? 0) > (match.awayScore ?? 0)) {
        home.won += 1;
        away.lost += 1;
      } else if ((match.homeScore ?? 0) < (match.awayScore ?? 0)) {
        away.won += 1;
        home.lost += 1;
      } else {
        home.drawn += 1;
        away.drawn += 1;
      }
    });

  return Array.from(rows.values());
}

export const groups: Group[] = GROUP_IDS.map((id) => ({
  id,
  label: `Grupo ${id}`,
  rows: buildRows(id),
}));

const groupById = new Map(groups.map((g) => [g.id, g]));

export function getGroup(id: string): Group | undefined {
  return groupById.get(id);
}
