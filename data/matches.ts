import { getTeam } from "@/data/teams";
import liveUpdatesSnapshot from "@/data/live-updates.json";
import type { Match, MatchDetail } from "@/lib/types";

// Fecha de referencia para el MVP. Los marcadores son el estado disponible en
// el feed público consultado; los partidos sin marcador quedan como próximos.
export const TOURNAMENT_TODAY = "2026-06-14";

type FixtureInput = Omit<Match, "probHome" | "probDraw" | "probAway" | "whatToWatch"> & {
  whatToWatch?: string[];
};

type LiveMatchUpdate = Partial<Pick<Match, "status" | "homeScore" | "awayScore" | "minute">> & {
  slug: string;
  evidenceUrl?: string;
  confidence?: number;
  detail?: MatchDetail;
};

const liveMatchUpdates = new Map(
  (liveUpdatesSnapshot.matches as LiveMatchUpdate[]).map((update) => [update.slug, update]),
);

function probability(homeSlug: string, awaySlug: string) {
  const homeRank = getTeam(homeSlug)?.fifaRank ?? 48;
  const awayRank = getTeam(awaySlug)?.fifaRank ?? 48;
  const homePower = Math.max(8, 100 - homeRank);
  const awayPower = Math.max(8, 100 - awayRank);
  const probDraw = Math.round(18 + Math.min(10, Math.abs(homePower - awayPower) / 8));
  const remaining = 100 - probDraw;
  const probHome = Math.round((remaining * homePower) / (homePower + awayPower));

  return {
    probHome,
    probDraw,
    probAway: 100 - probHome - probDraw,
  };
}

function fixture(input: FixtureInput): Match {
  const base: Match = {
    ...input,
    ...probability(input.homeSlug, input.awaySlug),
    whatToWatch: input.whatToWatch ?? [
      `Cruce del Grupo ${input.group} con impacto directo en la tabla.`,
      "Estado físico y gestión de ritmo tras el calendario de fase de grupos.",
      "Duelos individuales clave en transición y balón parado.",
    ],
  };

  const update = liveMatchUpdates.get(input.slug);
  if (!update) return base;

  return {
    ...base,
    status: update.status ?? base.status,
    homeScore: update.homeScore ?? base.homeScore,
    awayScore: update.awayScore ?? base.awayScore,
    minute: update.minute ?? base.minute,
    detail: update.detail ?? base.detail,
  };
}

// Calendario real de fase de grupos del Mundial 2026. `date` y `time` siguen
// el UTC del feed original para preservar la fuente sin conversiones ambiguas.
export const matches: Match[] = [
  fixture({ slug: "mexico-vs-sudafrica", homeSlug: "mexico", awaySlug: "sudafrica", date: "2026-06-11", time: "19:00", group: "A", stage: "Fase de grupos · J1", stadium: "Mexico City Stadium", city: "Ciudad de México", status: "finished", homeScore: 2, awayScore: 0 }),
  fixture({ slug: "corea-del-sur-vs-chequia", homeSlug: "corea-del-sur", awaySlug: "chequia", date: "2026-06-12", time: "02:00", group: "A", stage: "Fase de grupos · J1", stadium: "Guadalajara Stadium", city: "Guadalajara", status: "finished", homeScore: 2, awayScore: 1 }),
  fixture({ slug: "canada-vs-bosnia-herzegovina", homeSlug: "canada", awaySlug: "bosnia-herzegovina", date: "2026-06-12", time: "19:00", group: "B", stage: "Fase de grupos · J1", stadium: "Toronto Stadium", city: "Toronto", status: "finished", homeScore: 1, awayScore: 1 }),
  fixture({ slug: "estados-unidos-vs-paraguay", homeSlug: "estados-unidos", awaySlug: "paraguay", date: "2026-06-13", time: "01:00", group: "D", stage: "Fase de grupos · J1", stadium: "Los Angeles Stadium", city: "Los Ángeles", status: "finished", homeScore: 4, awayScore: 1 }),
  fixture({ slug: "haiti-vs-escocia", homeSlug: "haiti", awaySlug: "escocia", date: "2026-06-14", time: "01:00", group: "C", stage: "Fase de grupos · J1", stadium: "Boston Stadium", city: "Boston", status: "finished", homeScore: 0, awayScore: 1 }),
  fixture({ slug: "australia-vs-turquia", homeSlug: "australia", awaySlug: "turquia", date: "2026-06-14", time: "04:00", group: "D", stage: "Fase de grupos · J1", stadium: "BC Place Vancouver", city: "Vancouver", status: "finished", homeScore: 2, awayScore: 0 }),
  fixture({ slug: "brasil-vs-marruecos", homeSlug: "brasil", awaySlug: "marruecos", date: "2026-06-13", time: "22:00", group: "C", stage: "Fase de grupos · J1", stadium: "New York/New Jersey Stadium", city: "Nueva York / Nueva Jersey", status: "finished", homeScore: 1, awayScore: 1 }),
  fixture({ slug: "catar-vs-suiza", homeSlug: "catar", awaySlug: "suiza", date: "2026-06-13", time: "19:00", group: "B", stage: "Fase de grupos · J1", stadium: "San Francisco Bay Area Stadium", city: "Área de la Bahía de San Francisco", status: "finished", homeScore: 1, awayScore: 1 }),
  fixture({ slug: "costa-de-marfil-vs-ecuador", homeSlug: "costa-de-marfil", awaySlug: "ecuador", date: "2026-06-14", time: "23:00", group: "E", stage: "Fase de grupos · J1", stadium: "Philadelphia Stadium", city: "Filadelfia", status: "upcoming" }),
  fixture({ slug: "alemania-vs-curazao", homeSlug: "alemania", awaySlug: "curazao", date: "2026-06-14", time: "17:00", group: "E", stage: "Fase de grupos · J1", stadium: "Houston Stadium", city: "Houston", status: "upcoming" }),
  fixture({ slug: "paises-bajos-vs-japon", homeSlug: "paises-bajos", awaySlug: "japon", date: "2026-06-14", time: "20:00", group: "F", stage: "Fase de grupos · J1", stadium: "Dallas Stadium", city: "Dallas", status: "upcoming" }),
  fixture({ slug: "suecia-vs-tunez", homeSlug: "suecia", awaySlug: "tunez", date: "2026-06-15", time: "02:00", group: "F", stage: "Fase de grupos · J1", stadium: "Monterrey Stadium", city: "Monterrey", status: "upcoming" }),
  fixture({ slug: "arabia-saudita-vs-uruguay", homeSlug: "arabia-saudita", awaySlug: "uruguay", date: "2026-06-15", time: "22:00", group: "H", stage: "Fase de grupos · J1", stadium: "Miami Stadium", city: "Miami", status: "upcoming" }),
  fixture({ slug: "espana-vs-cabo-verde", homeSlug: "espana", awaySlug: "cabo-verde", date: "2026-06-15", time: "16:00", group: "H", stage: "Fase de grupos · J1", stadium: "Atlanta Stadium", city: "Atlanta", status: "upcoming" }),
  fixture({ slug: "iran-vs-nueva-zelanda", homeSlug: "iran", awaySlug: "nueva-zelanda", date: "2026-06-16", time: "01:00", group: "G", stage: "Fase de grupos · J1", stadium: "Los Angeles Stadium", city: "Los Ángeles", status: "upcoming" }),
  fixture({ slug: "belgica-vs-egipto", homeSlug: "belgica", awaySlug: "egipto", date: "2026-06-15", time: "19:00", group: "G", stage: "Fase de grupos · J1", stadium: "Seattle Stadium", city: "Seattle", status: "upcoming" }),
  fixture({ slug: "francia-vs-senegal", homeSlug: "francia", awaySlug: "senegal", date: "2026-06-16", time: "19:00", group: "I", stage: "Fase de grupos · J1", stadium: "New York/New Jersey Stadium", city: "Nueva York / Nueva Jersey", status: "upcoming" }),
  fixture({ slug: "irak-vs-noruega", homeSlug: "irak", awaySlug: "noruega", date: "2026-06-16", time: "22:00", group: "I", stage: "Fase de grupos · J1", stadium: "Boston Stadium", city: "Boston", status: "upcoming" }),
  fixture({ slug: "argentina-vs-argelia", homeSlug: "argentina", awaySlug: "argelia", date: "2026-06-17", time: "01:00", group: "J", stage: "Fase de grupos · J1", stadium: "Kansas City Stadium", city: "Kansas City", status: "upcoming" }),
  fixture({ slug: "austria-vs-jordania", homeSlug: "austria", awaySlug: "jordania", date: "2026-06-17", time: "04:00", group: "J", stage: "Fase de grupos · J1", stadium: "San Francisco Bay Area Stadium", city: "Área de la Bahía de San Francisco", status: "upcoming" }),
  fixture({ slug: "ghana-vs-panama", homeSlug: "ghana", awaySlug: "panama", date: "2026-06-17", time: "23:00", group: "L", stage: "Fase de grupos · J1", stadium: "Toronto Stadium", city: "Toronto", status: "upcoming" }),
  fixture({ slug: "inglaterra-vs-croacia", homeSlug: "inglaterra", awaySlug: "croacia", date: "2026-06-17", time: "20:00", group: "L", stage: "Fase de grupos · J1", stadium: "Dallas Stadium", city: "Dallas", status: "upcoming" }),
  fixture({ slug: "portugal-vs-rd-congo", homeSlug: "portugal", awaySlug: "rd-congo", date: "2026-06-17", time: "17:00", group: "K", stage: "Fase de grupos · J1", stadium: "Houston Stadium", city: "Houston", status: "upcoming" }),
  fixture({ slug: "uzbekistan-vs-colombia", homeSlug: "uzbekistan", awaySlug: "colombia", date: "2026-06-18", time: "02:00", group: "K", stage: "Fase de grupos · J1", stadium: "Mexico City Stadium", city: "Ciudad de México", status: "upcoming" }),
  fixture({ slug: "chequia-vs-sudafrica", homeSlug: "chequia", awaySlug: "sudafrica", date: "2026-06-18", time: "16:00", group: "A", stage: "Fase de grupos · J2", stadium: "Atlanta Stadium", city: "Atlanta", status: "upcoming" }),
  fixture({ slug: "suiza-vs-bosnia-herzegovina", homeSlug: "suiza", awaySlug: "bosnia-herzegovina", date: "2026-06-18", time: "19:00", group: "B", stage: "Fase de grupos · J2", stadium: "Los Angeles Stadium", city: "Los Ángeles", status: "upcoming" }),
  fixture({ slug: "canada-vs-catar", homeSlug: "canada", awaySlug: "catar", date: "2026-06-18", time: "22:00", group: "B", stage: "Fase de grupos · J2", stadium: "BC Place Vancouver", city: "Vancouver", status: "upcoming" }),
  fixture({ slug: "mexico-vs-corea-del-sur", homeSlug: "mexico", awaySlug: "corea-del-sur", date: "2026-06-19", time: "01:00", group: "A", stage: "Fase de grupos · J2", stadium: "Guadalajara Stadium", city: "Guadalajara", status: "upcoming" }),
  fixture({ slug: "brasil-vs-haiti", homeSlug: "brasil", awaySlug: "haiti", date: "2026-06-20", time: "01:00", group: "C", stage: "Fase de grupos · J2", stadium: "Philadelphia Stadium", city: "Filadelfia", status: "upcoming" }),
  fixture({ slug: "escocia-vs-marruecos", homeSlug: "escocia", awaySlug: "marruecos", date: "2026-06-19", time: "22:00", group: "C", stage: "Fase de grupos · J2", stadium: "Boston Stadium", city: "Boston", status: "upcoming" }),
  fixture({ slug: "turquia-vs-paraguay", homeSlug: "turquia", awaySlug: "paraguay", date: "2026-06-20", time: "04:00", group: "D", stage: "Fase de grupos · J2", stadium: "San Francisco Bay Area Stadium", city: "Área de la Bahía de San Francisco", status: "upcoming" }),
  fixture({ slug: "estados-unidos-vs-australia", homeSlug: "estados-unidos", awaySlug: "australia", date: "2026-06-19", time: "19:00", group: "D", stage: "Fase de grupos · J2", stadium: "Seattle Stadium", city: "Seattle", status: "upcoming" }),
  fixture({ slug: "alemania-vs-costa-de-marfil", homeSlug: "alemania", awaySlug: "costa-de-marfil", date: "2026-06-20", time: "20:00", group: "E", stage: "Fase de grupos · J2", stadium: "Toronto Stadium", city: "Toronto", status: "upcoming" }),
  fixture({ slug: "ecuador-vs-curazao", homeSlug: "ecuador", awaySlug: "curazao", date: "2026-06-21", time: "00:00", group: "E", stage: "Fase de grupos · J2", stadium: "Kansas City Stadium", city: "Kansas City", status: "upcoming" }),
  fixture({ slug: "paises-bajos-vs-suecia", homeSlug: "paises-bajos", awaySlug: "suecia", date: "2026-06-20", time: "17:00", group: "F", stage: "Fase de grupos · J2", stadium: "Houston Stadium", city: "Houston", status: "upcoming" }),
  fixture({ slug: "tunez-vs-japon", homeSlug: "tunez", awaySlug: "japon", date: "2026-06-21", time: "04:00", group: "F", stage: "Fase de grupos · J2", stadium: "Monterrey Stadium", city: "Monterrey", status: "upcoming" }),
  fixture({ slug: "uruguay-vs-cabo-verde", homeSlug: "uruguay", awaySlug: "cabo-verde", date: "2026-06-21", time: "22:00", group: "H", stage: "Fase de grupos · J2", stadium: "Miami Stadium", city: "Miami", status: "upcoming" }),
  fixture({ slug: "espana-vs-arabia-saudita", homeSlug: "espana", awaySlug: "arabia-saudita", date: "2026-06-21", time: "16:00", group: "H", stage: "Fase de grupos · J2", stadium: "Atlanta Stadium", city: "Atlanta", status: "upcoming" }),
  fixture({ slug: "belgica-vs-iran", homeSlug: "belgica", awaySlug: "iran", date: "2026-06-21", time: "19:00", group: "G", stage: "Fase de grupos · J2", stadium: "Los Angeles Stadium", city: "Los Ángeles", status: "upcoming" }),
  fixture({ slug: "nueva-zelanda-vs-egipto", homeSlug: "nueva-zelanda", awaySlug: "egipto", date: "2026-06-22", time: "01:00", group: "G", stage: "Fase de grupos · J2", stadium: "BC Place Vancouver", city: "Vancouver", status: "upcoming" }),
  fixture({ slug: "noruega-vs-senegal", homeSlug: "noruega", awaySlug: "senegal", date: "2026-06-23", time: "00:00", group: "I", stage: "Fase de grupos · J2", stadium: "New York/New Jersey Stadium", city: "Nueva York / Nueva Jersey", status: "upcoming" }),
  fixture({ slug: "francia-vs-irak", homeSlug: "francia", awaySlug: "irak", date: "2026-06-22", time: "21:00", group: "I", stage: "Fase de grupos · J2", stadium: "Philadelphia Stadium", city: "Filadelfia", status: "upcoming" }),
  fixture({ slug: "argentina-vs-austria", homeSlug: "argentina", awaySlug: "austria", date: "2026-06-22", time: "17:00", group: "J", stage: "Fase de grupos · J2", stadium: "Dallas Stadium", city: "Dallas", status: "upcoming" }),
  fixture({ slug: "jordania-vs-argelia", homeSlug: "jordania", awaySlug: "argelia", date: "2026-06-23", time: "03:00", group: "J", stage: "Fase de grupos · J2", stadium: "San Francisco Bay Area Stadium", city: "Área de la Bahía de San Francisco", status: "upcoming" }),
  fixture({ slug: "inglaterra-vs-ghana", homeSlug: "inglaterra", awaySlug: "ghana", date: "2026-06-23", time: "20:00", group: "L", stage: "Fase de grupos · J2", stadium: "Boston Stadium", city: "Boston", status: "upcoming" }),
  fixture({ slug: "panama-vs-croacia", homeSlug: "panama", awaySlug: "croacia", date: "2026-06-23", time: "23:00", group: "L", stage: "Fase de grupos · J2", stadium: "Toronto Stadium", city: "Toronto", status: "upcoming" }),
  fixture({ slug: "portugal-vs-uzbekistan", homeSlug: "portugal", awaySlug: "uzbekistan", date: "2026-06-23", time: "17:00", group: "K", stage: "Fase de grupos · J2", stadium: "Houston Stadium", city: "Houston", status: "upcoming" }),
  fixture({ slug: "colombia-vs-rd-congo", homeSlug: "colombia", awaySlug: "rd-congo", date: "2026-06-24", time: "02:00", group: "K", stage: "Fase de grupos · J2", stadium: "Guadalajara Stadium", city: "Guadalajara", status: "upcoming" }),
  fixture({ slug: "escocia-vs-brasil", homeSlug: "escocia", awaySlug: "brasil", date: "2026-06-24", time: "22:00", group: "C", stage: "Fase de grupos · J3", stadium: "Miami Stadium", city: "Miami", status: "upcoming" }),
  fixture({ slug: "marruecos-vs-haiti", homeSlug: "marruecos", awaySlug: "haiti", date: "2026-06-24", time: "22:00", group: "C", stage: "Fase de grupos · J3", stadium: "Atlanta Stadium", city: "Atlanta", status: "upcoming" }),
  fixture({ slug: "suiza-vs-canada", homeSlug: "suiza", awaySlug: "canada", date: "2026-06-24", time: "19:00", group: "B", stage: "Fase de grupos · J3", stadium: "BC Place Vancouver", city: "Vancouver", status: "upcoming" }),
  fixture({ slug: "bosnia-herzegovina-vs-catar", homeSlug: "bosnia-herzegovina", awaySlug: "catar", date: "2026-06-24", time: "19:00", group: "B", stage: "Fase de grupos · J3", stadium: "Seattle Stadium", city: "Seattle", status: "upcoming" }),
  fixture({ slug: "chequia-vs-mexico", homeSlug: "chequia", awaySlug: "mexico", date: "2026-06-25", time: "01:00", group: "A", stage: "Fase de grupos · J3", stadium: "Mexico City Stadium", city: "Ciudad de México", status: "upcoming" }),
  fixture({ slug: "sudafrica-vs-corea-del-sur", homeSlug: "sudafrica", awaySlug: "corea-del-sur", date: "2026-06-25", time: "01:00", group: "A", stage: "Fase de grupos · J3", stadium: "Monterrey Stadium", city: "Monterrey", status: "upcoming" }),
  fixture({ slug: "curazao-vs-costa-de-marfil", homeSlug: "curazao", awaySlug: "costa-de-marfil", date: "2026-06-25", time: "20:00", group: "E", stage: "Fase de grupos · J3", stadium: "Philadelphia Stadium", city: "Filadelfia", status: "upcoming" }),
  fixture({ slug: "ecuador-vs-alemania", homeSlug: "ecuador", awaySlug: "alemania", date: "2026-06-25", time: "20:00", group: "E", stage: "Fase de grupos · J3", stadium: "New York/New Jersey Stadium", city: "Nueva York / Nueva Jersey", status: "upcoming" }),
  fixture({ slug: "japon-vs-suecia", homeSlug: "japon", awaySlug: "suecia", date: "2026-06-25", time: "23:00", group: "F", stage: "Fase de grupos · J3", stadium: "Dallas Stadium", city: "Dallas", status: "upcoming" }),
  fixture({ slug: "tunez-vs-paises-bajos", homeSlug: "tunez", awaySlug: "paises-bajos", date: "2026-06-25", time: "23:00", group: "F", stage: "Fase de grupos · J3", stadium: "Kansas City Stadium", city: "Kansas City", status: "upcoming" }),
  fixture({ slug: "turquia-vs-estados-unidos", homeSlug: "turquia", awaySlug: "estados-unidos", date: "2026-06-26", time: "02:00", group: "D", stage: "Fase de grupos · J3", stadium: "Los Angeles Stadium", city: "Los Ángeles", status: "upcoming" }),
  fixture({ slug: "paraguay-vs-australia", homeSlug: "paraguay", awaySlug: "australia", date: "2026-06-26", time: "02:00", group: "D", stage: "Fase de grupos · J3", stadium: "San Francisco Bay Area Stadium", city: "Área de la Bahía de San Francisco", status: "upcoming" }),
  fixture({ slug: "noruega-vs-francia", homeSlug: "noruega", awaySlug: "francia", date: "2026-06-26", time: "19:00", group: "I", stage: "Fase de grupos · J3", stadium: "Boston Stadium", city: "Boston", status: "upcoming" }),
  fixture({ slug: "senegal-vs-irak", homeSlug: "senegal", awaySlug: "irak", date: "2026-06-26", time: "19:00", group: "I", stage: "Fase de grupos · J3", stadium: "Toronto Stadium", city: "Toronto", status: "upcoming" }),
  fixture({ slug: "egipto-vs-iran", homeSlug: "egipto", awaySlug: "iran", date: "2026-06-27", time: "03:00", group: "G", stage: "Fase de grupos · J3", stadium: "Seattle Stadium", city: "Seattle", status: "upcoming" }),
  fixture({ slug: "nueva-zelanda-vs-belgica", homeSlug: "nueva-zelanda", awaySlug: "belgica", date: "2026-06-27", time: "03:00", group: "G", stage: "Fase de grupos · J3", stadium: "BC Place Vancouver", city: "Vancouver", status: "upcoming" }),
  fixture({ slug: "cabo-verde-vs-arabia-saudita", homeSlug: "cabo-verde", awaySlug: "arabia-saudita", date: "2026-06-27", time: "00:00", group: "H", stage: "Fase de grupos · J3", stadium: "Houston Stadium", city: "Houston", status: "upcoming" }),
  fixture({ slug: "uruguay-vs-espana", homeSlug: "uruguay", awaySlug: "espana", date: "2026-06-27", time: "00:00", group: "H", stage: "Fase de grupos · J3", stadium: "Guadalajara Stadium", city: "Guadalajara", status: "upcoming" }),
  fixture({ slug: "panama-vs-inglaterra", homeSlug: "panama", awaySlug: "inglaterra", date: "2026-06-27", time: "21:00", group: "L", stage: "Fase de grupos · J3", stadium: "New York/New Jersey Stadium", city: "Nueva York / Nueva Jersey", status: "upcoming" }),
  fixture({ slug: "croacia-vs-ghana", homeSlug: "croacia", awaySlug: "ghana", date: "2026-06-27", time: "21:00", group: "L", stage: "Fase de grupos · J3", stadium: "Philadelphia Stadium", city: "Filadelfia", status: "upcoming" }),
  fixture({ slug: "argelia-vs-austria", homeSlug: "argelia", awaySlug: "austria", date: "2026-06-28", time: "02:00", group: "J", stage: "Fase de grupos · J3", stadium: "Kansas City Stadium", city: "Kansas City", status: "upcoming" }),
  fixture({ slug: "jordania-vs-argentina", homeSlug: "jordania", awaySlug: "argentina", date: "2026-06-28", time: "02:00", group: "J", stage: "Fase de grupos · J3", stadium: "Dallas Stadium", city: "Dallas", status: "upcoming" }),
  fixture({ slug: "colombia-vs-portugal", homeSlug: "colombia", awaySlug: "portugal", date: "2026-06-27", time: "23:30", group: "K", stage: "Fase de grupos · J3", stadium: "Miami Stadium", city: "Miami", status: "upcoming" }),
  fixture({ slug: "rd-congo-vs-uzbekistan", homeSlug: "rd-congo", awaySlug: "uzbekistan", date: "2026-06-27", time: "23:30", group: "K", stage: "Fase de grupos · J3", stadium: "Atlanta Stadium", city: "Atlanta", status: "upcoming" }),
];

const matchBySlug = new Map(matches.map((m) => [m.slug, m]));

export function getMatch(slug: string): Match | undefined {
  return matchBySlug.get(slug);
}

export function getMatchesByDate(date: string): Match[] {
  return matches.filter((m) => m.date === date);
}

export function getTodayMatches(): Match[] {
  return getMatchesByDate(TOURNAMENT_TODAY);
}

export function getLiveMatches(): Match[] {
  return matches.filter((m) => m.status === "live");
}

export function getUpcomingMatchesByTeam(teamSlug: string, limit = 3): Match[] {
  return matches
    .filter(
      (m) =>
        m.status === "upcoming" &&
        (m.homeSlug === teamSlug || m.awaySlug === teamSlug),
    )
    .slice(0, limit);
}

export function getMatchOfTheDay(): Match {
  const match = getTodayMatches()[0] ?? matches.find((m) => m.status === "upcoming") ?? matches[0];
  if (!match) throw new Error("No hay partidos cargados en data/matches.ts");
  return match;
}
