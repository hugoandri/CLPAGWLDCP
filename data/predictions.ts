import type { Prediction } from "@/lib/types";
import { teams, getTeamsByGroup } from "@/data/teams";

// ────────────────────────────────────────────────────────────────────────────
// MODELO ESTIMATIVO DE PREDICCIONES
//
// Punto de partida: una cuota de campeón curada por selección (`winnerShare`,
// suma ≈ 100%) que refleja el favoritismo relativo, más la probabilidad de
// pasar de grupo definida en cada selección (`team.probAdvance`).
//
// Las rondas intermedias se interpolan geométricamente entre ambos extremos,
// lo que garantiza una cadena SIEMPRE decreciente y coherente:
//   pasar de grupo ≥ octavos ≥ semifinal ≥ final ≥ campeón
//
// Es un modelo ilustrativo. Para producción puedes sustituirlo por una
// simulación Monte Carlo o por cuotas de una fuente externa (ver /metodologia).
// ────────────────────────────────────────────────────────────────────────────

const winnerShare: Record<string, number> = {
  espana: 15,
  argentina: 14,
  francia: 13,
  brasil: 11,
  inglaterra: 9,
  portugal: 6,
  "paises-bajos": 6,
  alemania: 5,
  belgica: 3.5,
  colombia: 1.8,
  uruguay: 1.5,
  croacia: 1.5,
  marruecos: 1.2,
  japon: 1.0,
  "estados-unidos": 0.8,
  mexico: 0.7,
  senegal: 0.7,
  suiza: 0.6,
  noruega: 0.5,
  "corea-del-sur": 0.4,
  ecuador: 0.3,
  turquia: 0.3,
  austria: 0.25,
  "costa-de-marfil": 0.2,
  egipto: 0.2,
  canada: 0.2,
  australia: 0.15,
  iran: 0.15,
  ghana: 0.15,
  argelia: 0.12,
  paraguay: 0.1,
  "arabia-saudita": 0.06,
  catar: 0.05,
  sudafrica: 0.05,
  panama: 0.04,
  irak: 0.03,
  uzbekistan: 0.03,
  "nueva-zelanda": 0.03,
  "rd-congo": 0.03,
  chequia: 0.03,
  escocia: 0.03,
  suecia: 0.03,
  tunez: 0.03,
  "cabo-verde": 0.03,
  "bosnia-herzegovina": 0.03,
  jordania: 0.03,
  haiti: 0.03,
  curazao: 0.03,
};

function rankingFactor(internalRank: number): number {
  return Math.round(((48 - internalRank) / 47) * 100);
}

function formScore(form: Array<"W" | "D" | "L">): number {
  const pts = form.reduce((acc, r) => acc + (r === "W" ? 3 : r === "D" ? 1 : 0), 0);
  return Math.round((pts / (form.length * 3)) * 100);
}

function groupDifficulty(slug: string, group: string): number {
  const rivals = getTeamsByGroup(group).filter((t) => t.slug !== slug);
  if (rivals.length === 0) return 50;
  const avg =
    rivals.reduce((acc, t) => acc + rankingFactor(t.internalRank), 0) /
    rivals.length;
  return Math.round(avg);
}

export const predictions: Prediction[] = teams.map((team) => {
  const pass = team.probAdvance;
  const winner = winnerShare[team.slug] ?? 0.03;

  // Interpolación geométrica entre "pasar de grupo" y "ganar el torneo".
  const ratio = Math.pow(winner / pass, 1 / 4);
  let roundOf16 = Math.round(pass * ratio);
  let semifinal = Math.min(Math.round(pass * ratio ** 2), roundOf16);
  let final = Math.min(Math.round(pass * ratio ** 3), semifinal);
  const winnerVal = Math.min(winner, final);

  // Asegura monotonía estricta tras el redondeo.
  roundOf16 = Math.min(roundOf16, pass);

  return {
    teamSlug: team.slug,
    passGroup: pass,
    roundOf16,
    semifinal,
    final,
    winner: winnerVal,
    factors: {
      form: formScore(team.form),
      ranking: rankingFactor(team.internalRank),
      xg: Math.round(team.stats.attack * 0.6 + team.stats.finishing * 0.4),
      defense: team.stats.defense,
      groupDifficulty: groupDifficulty(team.slug, team.group),
    },
  };
});

const predictionBySlug = new Map(predictions.map((p) => [p.teamSlug, p]));

export function getPrediction(slug: string): Prediction | undefined {
  return predictionBySlug.get(slug);
}

export type PredictionMetric =
  | "passGroup"
  | "roundOf16"
  | "semifinal"
  | "final"
  | "winner";

export const PREDICTION_METRICS: {
  key: PredictionMetric;
  label: string;
  short: string;
}[] = [
  { key: "passGroup", label: "Pasar de grupo", short: "Grupo" },
  { key: "roundOf16", label: "Llegar a octavos", short: "Octavos" },
  { key: "semifinal", label: "Llegar a semifinal", short: "Semis" },
  { key: "final", label: "Llegar a la final", short: "Final" },
  { key: "winner", label: "Ganar el torneo", short: "Campeón" },
];

/** Devuelve las predicciones ordenadas (desc) por una métrica concreta. */
export function predictionsRankedBy(metric: PredictionMetric): Prediction[] {
  return [...predictions].sort((a, b) => b[metric] - a[metric]);
}
