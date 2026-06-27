// Modelo de datos central de DataGoal 2026.
// Calendario, grupos y resultados se cargan desde snapshots locales; los tipos
// están pensados para mapear 1:1 con la respuesta de una futura API de fútbol.

export type Confederation =
  | "UEFA"
  | "CONMEBOL"
  | "CONCACAF"
  | "CAF"
  | "AFC"
  | "OFC";

export type MatchStatus = "upcoming" | "live" | "halftime" | "finished";

export type FormResult = "W" | "D" | "L";

/** Fortalezas normalizadas 0–100 para visualización en barras. */
export interface TeamStats {
  attack: number;
  defense: number;
  possession: number;
  pressing: number;
  finishing: number;
}

export interface QuickFact {
  label: string;
  value: string;
}

export interface TeamAnalysis {
  headline: string;
  goodThings: string;
  expectation: string;
  watchPoint: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Team {
  slug: string;
  name: string;
  flag: string;
  /** Código ISO 3166-1 alpha-2 para cargar la bandera desde flagcdn.com. */
  isoCode: string;
  group: string; // "A" … "L"
  confederation: Confederation;
  fifaRank: number;
  /** Ranking interno del modelo DataGoal (1 = mejor). */
  internalRank: number;
  /** Probabilidad estimada de avanzar de la fase de grupos (%). */
  probAdvance: number;
  coach: string;
  nickname: string;
  keyPlayer: string;
  keyPlayerRole: string;
  stats: TeamStats;
  /** Últimos 5 resultados, del más reciente al más antiguo. */
  form: FormResult[];
  strengths: string[];
  weaknesses: string[];
  analysis: TeamAnalysis;
  /** Descripción táctica corta. */
  style: string;
  quickFacts: QuickFact[];
  faqs: FaqItem[];
}

export type GoalType = "goal" | "own_goal" | "penalty";
export type CardType = "yellow" | "red" | "yellow_red";
export type MatchSide = "home" | "away";
export type LineupPosition = "GK" | "DEF" | "MID" | "FWD";

export interface GoalEvent {
  minute: number;
  team: MatchSide;
  scorer: string;
  assist?: string;
  type: GoalType;
}

export interface CardEvent {
  minute: number;
  team: MatchSide;
  player: string;
  type: CardType;
}

export interface SubEvent {
  minute: number;
  team: MatchSide;
  playerOut: string;
  playerIn: string;
}

export interface LineupPlayer {
  name: string;
  number?: number;
  position?: LineupPosition;
}

/** Jugador de la nómina completa de una selección (titulares + suplentes). */
export interface SquadPlayer {
  id: string;
  name: string;
  number?: number;
  position?: LineupPosition;
  starter: boolean;
  captain: boolean;
  photoUrl?: string;
  /** Club profesional actual (no viene de la API de FIFA, ver scripts/fetch-squad-clubs.py). */
  club?: string;
}

export interface MatchStats {
  shots?: { home: number; away: number };
  corners?: { home: number; away: number };
  fouls?: { home: number; away: number };
  offsides?: { home: number; away: number };
  yellowCards?: { home: number; away: number };
  redCards?: { home: number; away: number };
  penaltiesAwarded?: { home: number; away: number };
  possession?: { home: number; away: number };
  shotsOnTarget?: { home: number; away: number };
  passAccuracy?: { home: number; away: number };
}

export interface MatchDetail {
  goals: GoalEvent[];
  cards: CardEvent[];
  substitutions: SubEvent[];
  lineup: { home: LineupPlayer[]; away: LineupPlayer[] };
  stats: MatchStats;
  aiNotes?: string;
  confidence: number;
  evidenceUrl: string;
}

export interface Match {
  slug: string;
  homeSlug: string;
  awaySlug: string;
  /** Fecha ISO (YYYY-MM-DD). */
  date: string;
  /** Hora local del estadio "HH:mm". */
  time: string;
  group: string;
  stage: string;
  stadium: string;
  city: string;
  status: MatchStatus;
  homeScore?: number;
  awayScore?: number;
  /** Probabilidades estadísticas (%) — suman ~100. */
  probHome: number;
  probDraw: number;
  probAway: number;
  /** Minuto actual si está en vivo. */
  minute?: number;
  whatToWatch: string[];
  /** Ficha detallada del partido (disponible solo para partidos finalizados con datos de IA). */
  detail?: MatchDetail;
}

export interface GroupStandingInput {
  teamSlug: string;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  yellowCards?: number;
  redCards?: number;
}

export interface Group {
  id: string; // "A" … "L"
  label: string; // "Grupo A"
  rows: GroupStandingInput[];
}

/** Fila de standings con campos derivados (puntos, DG, posición). */
export interface ComputedStanding extends GroupStandingInput {
  played: number;
  gd: number;
  points: number;
  position: number;
  qualifies: boolean;
}

export interface PredictionFactors {
  form: number; // forma reciente 0–100
  ranking: number; // ranking relativo 0–100
  xg: number; // goles esperados aproximados 0–100
  defense: number; // fortaleza defensiva 0–100
  groupDifficulty: number; // dificultad del grupo 0–100 (100 = más difícil)
}

export interface Prediction {
  teamSlug: string;
  passGroup: number; // % pasar de grupo
  roundOf16: number; // % llegar a octavos
  semifinal: number; // % llegar a semifinal
  final: number; // % llegar a la final
  winner: number; // % ganar el torneo
  factors: PredictionFactors;
}

export type ArticleCategory =
  | "Análisis"
  | "Tendencias"
  | "Herramienta"
  | "Clasificación"
  | "Datos";

export interface ArticleSection {
  heading: string;
  body: string;
}

export interface Article {
  slug: string;
  title: string;
  subtitle?: string;
  category: ArticleCategory;
  date: string; // ISO
  readingMinutes: number;
  excerpt: string;
  author: string;
  authorSocial?: string;
  imageUrl?: string;
  imageCaption?: string;
  trend?: string;
  href?: string;
  sections: ArticleSection[];
  faqs: FaqItem[];
}
