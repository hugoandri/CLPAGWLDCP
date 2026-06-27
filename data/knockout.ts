export interface KnockoutMatch {
  slug: string;
  round: "dieciseisavos" | "octavos" | "cuartos" | "semifinales" | "tercer-puesto" | "final";
  roundLabel: string;
  homeSlug: string | null;
  awaySlug: string | null;
  homeLabel: string;
  awayLabel: string;
  homeScore?: number;
  awayScore?: number;
  homePenalties?: number;
  awayPenalties?: number;
  date?: string;
  time?: string;
  stadium?: string;
  city?: string;
  status: "upcoming" | "finished" | "placeholder";
}

export interface KnockoutRound {
  id: string;
  label: string;
  matches: KnockoutMatch[];
}

const R32: KnockoutMatch[] = [
  { slug: "r32-1", round: "dieciseisavos", roundLabel: "Dieciseisavos de final", homeSlug: null, awaySlug: null, homeLabel: "1° Grupo A", awayLabel: "3° Grupo B/C/D", status: "placeholder" },
  { slug: "r32-2", round: "dieciseisavos", roundLabel: "Dieciseisavos de final", homeSlug: null, awaySlug: null, homeLabel: "2° Grupo C", awayLabel: "2° Grupo D", status: "placeholder" },
  { slug: "r32-3", round: "dieciseisavos", roundLabel: "Dieciseisavos de final", homeSlug: null, awaySlug: null, homeLabel: "1° Grupo E", awayLabel: "3° Grupo A/C/D", status: "placeholder" },
  { slug: "r32-4", round: "dieciseisavos", roundLabel: "Dieciseisavos de final", homeSlug: null, awaySlug: null, homeLabel: "2° Grupo A", awayLabel: "2° Grupo B", status: "placeholder" },
  { slug: "r32-5", round: "dieciseisavos", roundLabel: "Dieciseisavos de final", homeSlug: null, awaySlug: null, homeLabel: "1° Grupo C", awayLabel: "3° Grupo A/B/F", status: "placeholder" },
  { slug: "r32-6", round: "dieciseisavos", roundLabel: "Dieciseisavos de final", homeSlug: null, awaySlug: null, homeLabel: "2° Grupo E", awayLabel: "2° Grupo F", status: "placeholder" },
  { slug: "r32-7", round: "dieciseisavos", roundLabel: "Dieciseisavos de final", homeSlug: null, awaySlug: null, homeLabel: "1° Grupo G", awayLabel: "3° Grupo E/F/H", status: "placeholder" },
  { slug: "r32-8", round: "dieciseisavos", roundLabel: "Dieciseisavos de final", homeSlug: null, awaySlug: null, homeLabel: "2° Grupo G", awayLabel: "2° Grupo H", status: "placeholder" },
  { slug: "r32-9", round: "dieciseisavos", roundLabel: "Dieciseisavos de final", homeSlug: null, awaySlug: null, homeLabel: "1° Grupo B", awayLabel: "3° Grupo A/E/F", status: "placeholder" },
  { slug: "r32-10", round: "dieciseisavos", roundLabel: "Dieciseisavos de final", homeSlug: null, awaySlug: null, homeLabel: "2° Grupo I", awayLabel: "2° Grupo J", status: "placeholder" },
  { slug: "r32-11", round: "dieciseisavos", roundLabel: "Dieciseisavos de final", homeSlug: null, awaySlug: null, homeLabel: "1° Grupo K", awayLabel: "3° Grupo G/H/I", status: "placeholder" },
  { slug: "r32-12", round: "dieciseisavos", roundLabel: "Dieciseisavos de final", homeSlug: null, awaySlug: null, homeLabel: "2° Grupo K", awayLabel: "2° Grupo L", status: "placeholder" },
  { slug: "r32-13", round: "dieciseisavos", roundLabel: "Dieciseisavos de final", homeSlug: null, awaySlug: null, homeLabel: "1° Grupo D", awayLabel: "3° Grupo B/C/F", status: "placeholder" },
  { slug: "r32-14", round: "dieciseisavos", roundLabel: "Dieciseisavos de final", homeSlug: null, awaySlug: null, homeLabel: "2° Grupo E", awayLabel: "2° Grupo F", status: "placeholder" },
  { slug: "r32-15", round: "dieciseisavos", roundLabel: "Dieciseisavos de final", homeSlug: null, awaySlug: null, homeLabel: "1° Grupo I", awayLabel: "3° Grupo J/K/L", status: "placeholder" },
  { slug: "r32-16", round: "dieciseisavos", roundLabel: "Dieciseisavos de final", homeSlug: null, awaySlug: null, homeLabel: "2° Grupo I", awayLabel: "2° Grupo J", status: "placeholder" },
];

const R16: KnockoutMatch[] = [
  { slug: "r16-1", round: "octavos", roundLabel: "Octavos de final", homeSlug: null, awaySlug: null, homeLabel: "Ganador 32-1", awayLabel: "Ganador 32-2", status: "placeholder" },
  { slug: "r16-2", round: "octavos", roundLabel: "Octavos de final", homeSlug: null, awaySlug: null, homeLabel: "Ganador 32-3", awayLabel: "Ganador 32-4", status: "placeholder" },
  { slug: "r16-3", round: "octavos", roundLabel: "Octavos de final", homeSlug: null, awaySlug: null, homeLabel: "Ganador 32-5", awayLabel: "Ganador 32-6", status: "placeholder" },
  { slug: "r16-4", round: "octavos", roundLabel: "Octavos de final", homeSlug: null, awaySlug: null, homeLabel: "Ganador 32-7", awayLabel: "Ganador 32-8", status: "placeholder" },
  { slug: "r16-5", round: "octavos", roundLabel: "Octavos de final", homeSlug: null, awaySlug: null, homeLabel: "Ganador 32-9", awayLabel: "Ganador 32-10", status: "placeholder" },
  { slug: "r16-6", round: "octavos", roundLabel: "Octavos de final", homeSlug: null, awaySlug: null, homeLabel: "Ganador 32-11", awayLabel: "Ganador 32-12", status: "placeholder" },
  { slug: "r16-7", round: "octavos", roundLabel: "Octavos de final", homeSlug: null, awaySlug: null, homeLabel: "Ganador 32-13", awayLabel: "Ganador 32-14", status: "placeholder" },
  { slug: "r16-8", round: "octavos", roundLabel: "Octavos de final", homeSlug: null, awaySlug: null, homeLabel: "Ganador 32-15", awayLabel: "Ganador 32-16", status: "placeholder" },
];

const QF: KnockoutMatch[] = [
  { slug: "qf-1", round: "cuartos", roundLabel: "Cuartos de final", homeSlug: null, awaySlug: null, homeLabel: "Ganador 16-1", awayLabel: "Ganador 16-2", status: "placeholder" },
  { slug: "qf-2", round: "cuartos", roundLabel: "Cuartos de final", homeSlug: null, awaySlug: null, homeLabel: "Ganador 16-3", awayLabel: "Ganador 16-4", status: "placeholder" },
  { slug: "qf-3", round: "cuartos", roundLabel: "Cuartos de final", homeSlug: null, awaySlug: null, homeLabel: "Ganador 16-5", awayLabel: "Ganador 16-6", status: "placeholder" },
  { slug: "qf-4", round: "cuartos", roundLabel: "Cuartos de final", homeSlug: null, awaySlug: null, homeLabel: "Ganador 16-7", awayLabel: "Ganador 16-8", status: "placeholder" },
];

const SF: KnockoutMatch[] = [
  { slug: "sf-1", round: "semifinales", roundLabel: "Semifinales", homeSlug: null, awaySlug: null, homeLabel: "Ganador CF-1", awayLabel: "Ganador CF-2", status: "placeholder" },
  { slug: "sf-2", round: "semifinales", roundLabel: "Semifinales", homeSlug: null, awaySlug: null, homeLabel: "Ganador CF-3", awayLabel: "Ganador CF-4", status: "placeholder" },
];

const THIRD: KnockoutMatch[] = [
  { slug: "3rd", round: "tercer-puesto", roundLabel: "Tercer puesto", homeSlug: null, awaySlug: null, homeLabel: "Perdedor SF-1", awayLabel: "Perdedor SF-2", status: "placeholder" },
];

const FINAL: KnockoutMatch[] = [
  { slug: "final", round: "final", roundLabel: "Final", homeSlug: null, awaySlug: null, homeLabel: "Ganador SF-1", awayLabel: "Ganador SF-2", status: "placeholder", date: "2026-07-19", time: "15:00", stadium: "AT&T Stadium", city: "Dallas" },
];

export const knockoutRounds: KnockoutRound[] = [
  { id: "dieciseisavos", label: "Dieciseisavos de final", matches: R32 },
  { id: "octavos", label: "Octavos de final", matches: R16 },
  { id: "cuartos", label: "Cuartos de final", matches: QF },
  { id: "semifinales", label: "Semifinales", matches: SF },
  { id: "tercer-puesto", label: "Tercer puesto", matches: THIRD },
  { id: "final", label: "Final", matches: FINAL },
];

export function getKnockoutMatch(slug: string): KnockoutMatch | undefined {
  for (const round of knockoutRounds) {
    const match = round.matches.find((m) => m.slug === slug);
    if (match) return match;
  }
}
