import type { Confederation, FormResult, Team } from "@/lib/types";

export const GROUP_IDS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

type TeamSeed = {
  slug: string;
  name: string;
  flag: string;
  isoCode: string;
  group: string;
  confederation: Confederation;
  fifaRank: number;
  condition?: string;
  keyPlayer?: string;
};

// Grupos reales del Mundial 2026 según el calendario público de FIFA/Wikipedia.
// Las métricas de modelo se derivan de ranking/grupo; no son resultados reales.
const teamSeeds: TeamSeed[] = [
  { slug: "mexico", name: "México", flag: "🇲🇽", isoCode: "mx", group: "A", confederation: "CONCACAF", fifaRank: 14, condition: "Anfitrión", keyPlayer: "Raúl Jiménez" },
  { slug: "sudafrica", name: "Sudáfrica", flag: "🇿🇦", isoCode: "za", group: "A", confederation: "CAF", fifaRank: 60 },
  { slug: "corea-del-sur", name: "Corea del Sur", flag: "🇰🇷", isoCode: "kr", group: "A", confederation: "AFC", fifaRank: 25, keyPlayer: "Son Heung-min" },
  { slug: "chequia", name: "Chequia", flag: "🇨🇿", isoCode: "cz", group: "A", confederation: "UEFA", fifaRank: 40, keyPlayer: "Patrik Schick" },

  { slug: "canada", name: "Canadá", flag: "🇨🇦", isoCode: "ca", group: "B", confederation: "CONCACAF", fifaRank: 28, condition: "Anfitrión", keyPlayer: "Alphonso Davies" },
  { slug: "bosnia-herzegovina", name: "Bosnia y Herzegovina", flag: "🇧🇦", isoCode: "ba", group: "B", confederation: "UEFA", fifaRank: 62 },
  { slug: "catar", name: "Catar", flag: "🇶🇦", isoCode: "qa", group: "B", confederation: "AFC", fifaRank: 53, keyPlayer: "Akram Afif" },
  { slug: "suiza", name: "Suiza", flag: "🇨🇭", isoCode: "ch", group: "B", confederation: "UEFA", fifaRank: 19, keyPlayer: "Granit Xhaka" },

  { slug: "brasil", name: "Brasil", flag: "🇧🇷", isoCode: "br", group: "C", confederation: "CONMEBOL", fifaRank: 5, keyPlayer: "Vinícius Júnior" },
  { slug: "marruecos", name: "Marruecos", flag: "🇲🇦", isoCode: "ma", group: "C", confederation: "CAF", fifaRank: 12, keyPlayer: "Achraf Hakimi" },
  { slug: "haiti", name: "Haití", flag: "🇭🇹", isoCode: "ht", group: "C", confederation: "CONCACAF", fifaRank: 83 },
  { slug: "escocia", name: "Escocia", flag: "🏴", isoCode: "gb-sct", group: "C", confederation: "UEFA", fifaRank: 39 },

  { slug: "estados-unidos", name: "Estados Unidos", flag: "🇺🇸", isoCode: "us", group: "D", confederation: "CONCACAF", fifaRank: 13, condition: "Anfitrión", keyPlayer: "Folarin Balogun" },
  { slug: "paraguay", name: "Paraguay", flag: "🇵🇾", isoCode: "py", group: "D", confederation: "CONMEBOL", fifaRank: 48 },
  { slug: "australia", name: "Australia", flag: "🇦🇺", isoCode: "au", group: "D", confederation: "AFC", fifaRank: 24 },
  { slug: "turquia", name: "Turquía", flag: "🇹🇷", isoCode: "tr", group: "D", confederation: "UEFA", fifaRank: 27 },

  { slug: "alemania", name: "Alemania", flag: "🇩🇪", isoCode: "de", group: "E", confederation: "UEFA", fifaRank: 9, keyPlayer: "Jamal Musiala" },
  { slug: "curazao", name: "Curaçao", flag: "🇨🇼", isoCode: "cw", group: "E", confederation: "CONCACAF", fifaRank: 82 },
  { slug: "costa-de-marfil", name: "Costa de Marfil", flag: "🇨🇮", isoCode: "ci", group: "E", confederation: "CAF", fifaRank: 42 },
  { slug: "ecuador", name: "Ecuador", flag: "🇪🇨", isoCode: "ec", group: "E", confederation: "CONMEBOL", fifaRank: 31 },

  { slug: "paises-bajos", name: "Países Bajos", flag: "🇳🇱", isoCode: "nl", group: "F", confederation: "UEFA", fifaRank: 7, keyPlayer: "Virgil van Dijk" },
  { slug: "japon", name: "Japón", flag: "🇯🇵", isoCode: "jp", group: "F", confederation: "AFC", fifaRank: 18 },
  { slug: "suecia", name: "Suecia", flag: "🇸🇪", isoCode: "se", group: "F", confederation: "UEFA", fifaRank: 32 },
  { slug: "tunez", name: "Túnez", flag: "🇹🇳", isoCode: "tn", group: "F", confederation: "CAF", fifaRank: 46 },

  { slug: "belgica", name: "Bélgica", flag: "🇧🇪", isoCode: "be", group: "G", confederation: "UEFA", fifaRank: 8, keyPlayer: "Jérémy Doku" },
  { slug: "egipto", name: "Egipto", flag: "🇪🇬", isoCode: "eg", group: "G", confederation: "CAF", fifaRank: 33, keyPlayer: "Mohamed Salah" },
  { slug: "iran", name: "Irán", flag: "🇮🇷", isoCode: "ir", group: "G", confederation: "AFC", fifaRank: 20, keyPlayer: "Mehdi Taremi" },
  { slug: "nueva-zelanda", name: "Nueva Zelanda", flag: "🇳🇿", isoCode: "nz", group: "G", confederation: "OFC", fifaRank: 89, keyPlayer: "Chris Wood" },

  { slug: "espana", name: "España", flag: "🇪🇸", isoCode: "es", group: "H", confederation: "UEFA", fifaRank: 2, keyPlayer: "Pedri" },
  { slug: "cabo-verde", name: "Cabo Verde", flag: "🇨🇻", isoCode: "cv", group: "H", confederation: "CAF", fifaRank: 70 },
  { slug: "arabia-saudita", name: "Arabia Saudita", flag: "🇸🇦", isoCode: "sa", group: "H", confederation: "AFC", fifaRank: 58 },
  { slug: "uruguay", name: "Uruguay", flag: "🇺🇾", isoCode: "uy", group: "H", confederation: "CONMEBOL", fifaRank: 15, keyPlayer: "Federico Valverde" },

  { slug: "francia", name: "Francia", flag: "🇫🇷", isoCode: "fr", group: "I", confederation: "UEFA", fifaRank: 3, keyPlayer: "Kylian Mbappé" },
  { slug: "senegal", name: "Senegal", flag: "🇸🇳", isoCode: "sn", group: "I", confederation: "CAF", fifaRank: 17 },
  { slug: "irak", name: "Irak", flag: "🇮🇶", isoCode: "iq", group: "I", confederation: "AFC", fifaRank: 59 },
  { slug: "noruega", name: "Noruega", flag: "🇳🇴", isoCode: "no", group: "I", confederation: "UEFA", fifaRank: 36, keyPlayer: "Erling Haaland" },

  { slug: "argentina", name: "Argentina", flag: "🇦🇷", isoCode: "ar", group: "J", confederation: "CONMEBOL", fifaRank: 1, keyPlayer: "Lionel Messi" },
  { slug: "argelia", name: "Argelia", flag: "🇩🇿", isoCode: "dz", group: "J", confederation: "CAF", fifaRank: 38 },
  { slug: "austria", name: "Austria", flag: "🇦🇹", isoCode: "at", group: "J", confederation: "UEFA", fifaRank: 22 },
  { slug: "jordania", name: "Jordania", flag: "🇯🇴", isoCode: "jo", group: "J", confederation: "AFC", fifaRank: 63 },

  { slug: "portugal", name: "Portugal", flag: "🇵🇹", isoCode: "pt", group: "K", confederation: "UEFA", fifaRank: 6, keyPlayer: "Bruno Fernandes" },
  { slug: "rd-congo", name: "RD Congo", flag: "🇨🇩", isoCode: "cd", group: "K", confederation: "CAF", fifaRank: 55 },
  { slug: "uzbekistan", name: "Uzbekistán", flag: "🇺🇿", isoCode: "uz", group: "K", confederation: "AFC", fifaRank: 54 },
  { slug: "colombia", name: "Colombia", flag: "🇨🇴", isoCode: "co", group: "K", confederation: "CONMEBOL", fifaRank: 10, keyPlayer: "Luis Díaz" },

  { slug: "inglaterra", name: "Inglaterra", flag: "🇬🇧", isoCode: "gb-eng", group: "L", confederation: "UEFA", fifaRank: 4, keyPlayer: "Jude Bellingham" },
  { slug: "croacia", name: "Croacia", flag: "🇭🇷", isoCode: "hr", group: "L", confederation: "UEFA", fifaRank: 11, keyPlayer: "Luka Modrić" },
  { slug: "ghana", name: "Ghana", flag: "🇬🇭", isoCode: "gh", group: "L", confederation: "CAF", fifaRank: 47 },
  { slug: "panama", name: "Panamá", flag: "🇵🇦", isoCode: "pa", group: "L", confederation: "CONCACAF", fifaRank: 35 },
];

function normalizedPower(fifaRank: number): number {
  return Math.max(35, Math.min(92, 96 - fifaRank));
}

function advanceProbability(seed: TeamSeed): number {
  const group = teamSeeds.filter((team) => team.group === seed.group);
  const sorted = [...group].sort((a, b) => a.fifaRank - b.fifaRank);
  const position = sorted.findIndex((team) => team.slug === seed.slug) + 1;
  const base = [78, 62, 43, 24][position - 1] ?? 35;
  return Math.min(90, base + (seed.condition === "Anfitrión" ? 5 : 0));
}

function formFromRank(fifaRank: number): FormResult[] {
  if (fifaRank <= 10) return ["W", "W", "D", "W", "W"];
  if (fifaRank <= 25) return ["W", "D", "W", "D", "L"];
  if (fifaRank <= 50) return ["D", "W", "L", "D", "W"];
  return ["L", "D", "W", "L", "D"];
}

function groupSeedPosition(seed: TeamSeed): number {
  return [...teamSeeds]
    .filter((team) => team.group === seed.group)
    .sort((a, b) => a.fifaRank - b.fifaRank)
    .findIndex((team) => team.slug === seed.slug) + 1;
}

function groupContext(seed: TeamSeed): string {
  const rivals = [...teamSeeds]
    .filter((team) => team.group === seed.group && team.slug !== seed.slug)
    .sort((a, b) => a.fifaRank - b.fifaRank)
    .map((team) => team.name);

  return `${seed.name} comparte el Grupo ${seed.group} con ${rivals.join(", ")}.`;
}

function buildStrengths(seed: TeamSeed): string[] {
  const strengths = ["Calendario y grupo ya confirmados"];

  if (seed.fifaRank <= 10) {
    strengths.push("Perfil de candidata: ranking alto y margen para dominar partidos");
  } else if (seed.fifaRank <= 25) {
    strengths.push("Nivel competitivo probado contra rivales de alta exigencia");
  } else if (seed.fifaRank <= 50) {
    strengths.push("Capacidad para competir en partidos cerrados y robar puntos");
  } else {
    strengths.push("Menor presión externa y margen para sorprender desde un plan simple");
  }

  if (seed.condition === "Anfitrión") {
    strengths.push("Factor local: viaje, ambiente y adaptación juegan a favor");
  } else if (seed.keyPlayer) {
    strengths.push(`Cuenta con ${seed.keyPlayer} como referencia diferencial`);
  } else {
    strengths.push("Puede crecer si encuentra una estructura colectiva estable");
  }

  return strengths;
}

function buildWeaknesses(seed: TeamSeed): string[] {
  const position = groupSeedPosition(seed);
  const weaknesses = ["Plantilla final y roles titulares todavía por confirmar"];

  if (position >= 3) {
    weaknesses.push("Parte por detrás de al menos dos rivales en ranking dentro del grupo");
  } else if (seed.fifaRank <= 10) {
    weaknesses.push("La obligación de dominar puede castigar cualquier partido trabado");
  } else {
    weaknesses.push("Necesita transformar competitividad en puntos desde la primera jornada");
  }

  return weaknesses;
}

function buildAnalysis(seed: TeamSeed) {
  const position = groupSeedPosition(seed);
  const role =
    seed.fifaRank <= 10
      ? "candidata fuerte"
      : seed.fifaRank <= 25
        ? "selección de octavos"
        : seed.fifaRank <= 50
          ? "aspirante incómoda"
          : "tapada del grupo";

  const goodThings =
    seed.condition === "Anfitrión"
      ? `${seed.name} tiene a favor el contexto de sede: menor desgaste, estadios conocidos y una presión ambiental que puede pesar en partidos equilibrados.`
      : seed.fifaRank <= 10
        ? `${seed.name} llega con jerarquía para llevar la iniciativa, atacar con muchos jugadores y resolver incluso cuando el partido no fluye.`
        : seed.fifaRank <= 25
          ? `${seed.name} combina experiencia internacional con recursos para competir contra favoritos sin necesitar posesiones largas.`
          : `${seed.name} puede hacerse peligrosa si mantiene el bloque compacto, cuida las pérdidas y maximiza las acciones de balón parado.`;

  const expectation =
    position === 1
      ? `Se espera que pelee el primer puesto del Grupo ${seed.group}. Si gana su primer partido, el camino a octavos debería abrirse rápido.`
      : position === 2
        ? `Se espera que dispute una de las dos plazas directas. Su torneo dependerá de sumar contra los rivales directos y no dejar puntos ante el equipo de menor ranking.`
        : position === 3
          ? `Se espera un torneo de resistencia: mantenerse viva hasta la última jornada, reducir diferencias de gol y aprovechar cualquier tropiezo de los favoritos.`
          : `Se espera que compita desde el orden y busque una sorpresa. Para avanzar necesita puntuar pronto y evitar derrotas amplias.`;

  const watchPoint =
    seed.keyPlayer && seed.keyPlayer !== "Por confirmar"
      ? `El termómetro será ${seed.keyPlayer}: si recibe cómodo, ${seed.name} tendrá más salida y más amenaza en campo rival.`
      : `La clave será identificar rápido un líder ofensivo y sostener la concentración en los tramos finales.`;

  return {
    headline: `${seed.name} llega como ${role} del Grupo ${seed.group}`,
    goodThings,
    expectation,
    watchPoint,
  };
}

export const teams: Team[] = teamSeeds.map((seed, index) => {
  const power = normalizedPower(seed.fifaRank);
  const groupRivals = teamSeeds
    .filter((team) => team.group === seed.group && team.slug !== seed.slug)
    .map((team) => team.name)
    .join(", ");

  return {
    slug: seed.slug,
    name: seed.name,
    flag: seed.flag,
    isoCode: seed.isoCode,
    group: seed.group,
    confederation: seed.confederation,
    fifaRank: seed.fifaRank,
    internalRank: index + 1,
    probAdvance: advanceProbability(seed),
    coach: "Por confirmar",
    nickname: seed.condition ?? "Clasificada al Mundial 2026",
    keyPlayer: seed.keyPlayer ?? "Por confirmar",
    keyPlayerRole: seed.keyPlayer ? "Referente" : "Por confirmar",
    stats: {
      attack: power,
      defense: Math.max(35, power - 2),
      possession: Math.max(35, power - 4),
      pressing: Math.max(35, power - 5),
      finishing: Math.max(35, power - 3),
    },
    form: formFromRank(seed.fifaRank),
    strengths: buildStrengths(seed),
    weaknesses: buildWeaknesses(seed),
    analysis: buildAnalysis(seed),
    style: `${groupContext(seed)} Su plan base debe ajustarse a rivales como ${groupRivals}, con margen para alternar presión, repliegue y ataques más directos según el marcador.`,
    quickFacts: [
      { label: "Grupo", value: seed.group },
      { label: "Confederación", value: seed.confederation },
      { label: "Ranking FIFA", value: `#${seed.fifaRank}` },
      { label: "Estado", value: seed.condition ?? "Clasificada" },
    ],
    faqs: [
      {
        question: `¿En qué grupo está ${seed.name}?`,
        answer: `${seed.name} está en el Grupo ${seed.group} del Mundial 2026.`,
      },
      {
        question: `¿Los datos de ${seed.name} son reales?`,
        answer: "El grupo, calendario y resultados cargados son reales; las métricas de probabilidad son estimaciones del modelo DataGoal.",
      },
    ],
  };
});

const teamBySlug = new Map(teams.map((t) => [t.slug, t]));

export function getTeam(slug: string): Team | undefined {
  return teamBySlug.get(slug);
}

export function getTeamsByGroup(group: string): Team[] {
  return teams.filter((t) => t.group === group);
}

export function searchTeams(query: string): Team[] {
  const q = query.trim().toLowerCase();
  if (!q) return teams;
  return teams.filter((t) =>
    [t.name, t.slug, t.confederation, t.group].some((v) =>
      v.toLowerCase().includes(q),
    ),
  );
}
