import type {
  ComputedStanding,
  GroupStandingInput,
  Match,
} from "@/lib/types";

/** Une clases condicionales sin dependencias externas. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

const MONTHS_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

const WEEKDAYS_ES = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

/** Convierte "YYYY-MM-DD" en una fecha local (evita desfases de zona horaria). */
function parseISODate(iso: string): Date {
  if (!iso) return new Date(NaN);
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/**
 * `date`/`time` de un partido están en UTC. Esta función devuelve el día
 * calendario "YYYY-MM-DD" en la zona horaria del navegador (la misma que usa
 * LocalTime para la hora), para no mostrar partidos con la fecha del día
 * UTC cuando localmente caen en el día anterior o siguiente.
 */
export function matchLocalDateKey(date: string, time: string): string {
  if (!date) return "";
  if (!time) return date;
  const instant = new Date(`${date}T${time}:00Z`);
  if (isNaN(instant.getTime())) return date;
  const y = instant.getFullYear();
  const m = String(instant.getMonth() + 1).padStart(2, "0");
  const d = String(instant.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** "jueves, 11 de junio de 2026" */
export function formatDateLong(iso: string): string {
  const date = parseISODate(iso);
  return `${WEEKDAYS_ES[date.getDay()]}, ${date.getDate()} de ${
    MONTHS_ES[date.getMonth()]
  } de ${date.getFullYear()}`;
}

/** "11 jun 2026" */
export function formatDateShort(iso: string): string {
  if (!iso) return "";
  const date = parseISODate(iso);
  const month = MONTHS_ES[date.getMonth()];
  if (!month) return iso;
  return `${date.getDate()} ${month.slice(0, 3)} ${date.getFullYear()}`;
}

/** "11 jun" */
export function formatDayMonth(iso: string): string {
  if (!iso) return "";
  const date = parseISODate(iso);
  const month = MONTHS_ES[date.getMonth()];
  if (!month) return iso;
  return `${date.getDate()} ${month.slice(0, 3)}`;
}

/**
 * Calcula puntos, diferencia de goles, posición y clasificación.
 * Los 2 primeros de cada grupo se marcan como clasificados (top 2).
 */
export function computeStandings(
  rows: GroupStandingInput[],
  qualifyCount = 2,
): ComputedStanding[] {
  const computed = rows.map((r) => {
    const played = r.won + r.drawn + r.lost;
    const gd = r.gf - r.ga;
    const points = r.won * 3 + r.drawn;
    return { ...r, played, gd, points, position: 0, qualifies: false };
  });

  computed.sort(
    (a, b) =>
      b.points - a.points ||
      b.gd - a.gd ||
      b.gf - a.gf ||
      a.teamSlug.localeCompare(b.teamSlug),
  );

  return computed.map((row, i) => ({
    ...row,
    position: i + 1,
    qualifies: i < qualifyCount,
  }));
}

/** Devuelve el resultado de un partido como texto ("2 - 1" o "vs"). */
export function matchScoreLabel(match: Match): string {
  if (match.status === "upcoming") return "vs";
  return `${match.homeScore ?? 0} - ${match.awayScore ?? 0}`;
}

/** Convierte un porcentaje 0–100 a un ancho CSS seguro. */
export function pctWidth(value: number): string {
  return `${Math.max(0, Math.min(100, value))}%`;
}

const ACCENT_MAP: Record<string, string> = {
  á: "a",
  é: "e",
  í: "i",
  ó: "o",
  ú: "u",
  ü: "u",
  ñ: "n",
  ç: "c",
};

/** Normaliza un texto a slug ASCII en minúsculas (sin dependencias). */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[áéíóúüñç]/g, (ch) => ACCENT_MAP[ch] ?? ch)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
