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

export type MatchStatus = "upcoming" | "live" | "finished";

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
  /** Emoji de bandera — sin logos ni imágenes con copyright. */
  flag: string;
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
}

export interface GroupStandingInput {
  teamSlug: string;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
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
  category: ArticleCategory;
  date: string; // ISO
  readingMinutes: number;
  excerpt: string;
  author: string;
  trend?: string; // etiqueta corta para TrendBadge
  /** Ruta interna a la que enlaza la tarjeta (herramienta o detalle). */
  href?: string;
  sections: ArticleSection[];
  faqs: FaqItem[];
}
