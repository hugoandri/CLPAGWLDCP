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
  { slug: "sudafrica", name: "Sudáfrica", flag: "🇿🇦", isoCode: "za", group: "A", confederation: "CAF", fifaRank: 60, keyPlayer: "Percy Tau" },
  { slug: "corea-del-sur", name: "Corea del Sur", flag: "🇰🇷", isoCode: "kr", group: "A", confederation: "AFC", fifaRank: 25, keyPlayer: "Son Heung-min" },
  { slug: "chequia", name: "Chequia", flag: "🇨🇿", isoCode: "cz", group: "A", confederation: "UEFA", fifaRank: 40, keyPlayer: "Patrik Schick" },

  { slug: "canada", name: "Canadá", flag: "🇨🇦", isoCode: "ca", group: "B", confederation: "CONCACAF", fifaRank: 28, condition: "Anfitrión", keyPlayer: "Alphonso Davies" },
  { slug: "bosnia-herzegovina", name: "Bosnia y Herzegovina", flag: "🇧🇦", isoCode: "ba", group: "B", confederation: "UEFA", fifaRank: 62, keyPlayer: "Ermedin Demirović" },
  { slug: "catar", name: "Catar", flag: "🇶🇦", isoCode: "qa", group: "B", confederation: "AFC", fifaRank: 53, keyPlayer: "Akram Afif" },
  { slug: "suiza", name: "Suiza", flag: "🇨🇭", isoCode: "ch", group: "B", confederation: "UEFA", fifaRank: 19, keyPlayer: "Granit Xhaka" },

  { slug: "brasil", name: "Brasil", flag: "🇧🇷", isoCode: "br", group: "C", confederation: "CONMEBOL", fifaRank: 5, keyPlayer: "Vinícius Júnior" },
  { slug: "marruecos", name: "Marruecos", flag: "🇲🇦", isoCode: "ma", group: "C", confederation: "CAF", fifaRank: 12, keyPlayer: "Achraf Hakimi" },
  { slug: "haiti", name: "Haití", flag: "🇭🇹", isoCode: "ht", group: "C", confederation: "CONCACAF", fifaRank: 83, keyPlayer: "Jean-Ricner Bellegarde" },
  { slug: "escocia", name: "Escocia", flag: "🏴", isoCode: "gb-sct", group: "C", confederation: "UEFA", fifaRank: 39, keyPlayer: "John McGinn" },

  { slug: "estados-unidos", name: "Estados Unidos", flag: "🇺🇸", isoCode: "us", group: "D", confederation: "CONCACAF", fifaRank: 13, condition: "Anfitrión", keyPlayer: "Folarin Balogun" },
  { slug: "paraguay", name: "Paraguay", flag: "🇵🇾", isoCode: "py", group: "D", confederation: "CONMEBOL", fifaRank: 48, keyPlayer: "Julio Enciso" },
  { slug: "australia", name: "Australia", flag: "🇦🇺", isoCode: "au", group: "D", confederation: "AFC", fifaRank: 24, keyPlayer: "Nestory Irankunda" },
  { slug: "turquia", name: "Turquía", flag: "🇹🇷", isoCode: "tr", group: "D", confederation: "UEFA", fifaRank: 27, keyPlayer: "Arda Güler" },

  { slug: "alemania", name: "Alemania", flag: "🇩🇪", isoCode: "de", group: "E", confederation: "UEFA", fifaRank: 9, keyPlayer: "Jamal Musiala" },
  { slug: "curazao", name: "Curaçao", flag: "🇨🇼", isoCode: "cw", group: "E", confederation: "CONCACAF", fifaRank: 82, keyPlayer: "Leandro Bacuna" },
  { slug: "costa-de-marfil", name: "Costa de Marfil", flag: "🇨🇮", isoCode: "ci", group: "E", confederation: "CAF", fifaRank: 42, keyPlayer: "Franck Kessié" },
  { slug: "ecuador", name: "Ecuador", flag: "🇪🇨", isoCode: "ec", group: "E", confederation: "CONMEBOL", fifaRank: 31, keyPlayer: "Moisés Caicedo" },

  { slug: "paises-bajos", name: "Países Bajos", flag: "🇳🇱", isoCode: "nl", group: "F", confederation: "UEFA", fifaRank: 7, keyPlayer: "Virgil van Dijk" },
  { slug: "japon", name: "Japón", flag: "🇯🇵", isoCode: "jp", group: "F", confederation: "AFC", fifaRank: 18, keyPlayer: "Takefusa Kubo" },
  { slug: "suecia", name: "Suecia", flag: "🇸🇪", isoCode: "se", group: "F", confederation: "UEFA", fifaRank: 32, keyPlayer: "Alexander Isak" },
  { slug: "tunez", name: "Túnez", flag: "🇹🇳", isoCode: "tn", group: "F", confederation: "CAF", fifaRank: 46, keyPlayer: "Ellyes Skhiri" },

  { slug: "belgica", name: "Bélgica", flag: "🇧🇪", isoCode: "be", group: "G", confederation: "UEFA", fifaRank: 8, keyPlayer: "Jérémy Doku" },
  { slug: "egipto", name: "Egipto", flag: "🇪🇬", isoCode: "eg", group: "G", confederation: "CAF", fifaRank: 33, keyPlayer: "Mohamed Salah" },
  { slug: "iran", name: "Irán", flag: "🇮🇷", isoCode: "ir", group: "G", confederation: "AFC", fifaRank: 20, keyPlayer: "Mehdi Taremi" },
  { slug: "nueva-zelanda", name: "Nueva Zelanda", flag: "🇳🇿", isoCode: "nz", group: "G", confederation: "OFC", fifaRank: 89, keyPlayer: "Chris Wood" },

  { slug: "espana", name: "España", flag: "🇪🇸", isoCode: "es", group: "H", confederation: "UEFA", fifaRank: 2, keyPlayer: "Pedri" },
  { slug: "cabo-verde", name: "Cabo Verde", flag: "🇨🇻", isoCode: "cv", group: "H", confederation: "CAF", fifaRank: 70, keyPlayer: "Jovane Cabral" },
  { slug: "arabia-saudita", name: "Arabia Saudita", flag: "🇸🇦", isoCode: "sa", group: "H", confederation: "AFC", fifaRank: 58, keyPlayer: "Salem Al-Dawsari" },
  { slug: "uruguay", name: "Uruguay", flag: "🇺🇾", isoCode: "uy", group: "H", confederation: "CONMEBOL", fifaRank: 15, keyPlayer: "Federico Valverde" },

  { slug: "francia", name: "Francia", flag: "🇫🇷", isoCode: "fr", group: "I", confederation: "UEFA", fifaRank: 3, keyPlayer: "Kylian Mbappé" },
  { slug: "senegal", name: "Senegal", flag: "🇸🇳", isoCode: "sn", group: "I", confederation: "CAF", fifaRank: 17, keyPlayer: "Sadio Mané" },
  { slug: "irak", name: "Irak", flag: "🇮🇶", isoCode: "iq", group: "I", confederation: "AFC", fifaRank: 59, keyPlayer: "Ayman Hussein" },
  { slug: "noruega", name: "Noruega", flag: "🇳🇴", isoCode: "no", group: "I", confederation: "UEFA", fifaRank: 36, keyPlayer: "Erling Haaland" },

  { slug: "argentina", name: "Argentina", flag: "🇦🇷", isoCode: "ar", group: "J", confederation: "CONMEBOL", fifaRank: 1, keyPlayer: "Lionel Messi" },
  { slug: "argelia", name: "Argelia", flag: "🇩🇿", isoCode: "dz", group: "J", confederation: "CAF", fifaRank: 38, keyPlayer: "Mohamed Amoura" },
  { slug: "austria", name: "Austria", flag: "🇦🇹", isoCode: "at", group: "J", confederation: "UEFA", fifaRank: 22, keyPlayer: "Marcel Sabitzer" },
  { slug: "jordania", name: "Jordania", flag: "🇯🇴", isoCode: "jo", group: "J", confederation: "AFC", fifaRank: 63, keyPlayer: "Mousa Al-Taamari" },

  { slug: "portugal", name: "Portugal", flag: "🇵🇹", isoCode: "pt", group: "K", confederation: "UEFA", fifaRank: 6, keyPlayer: "Bruno Fernandes" },
  { slug: "rd-congo", name: "RD Congo", flag: "🇨🇩", isoCode: "cd", group: "K", confederation: "CAF", fifaRank: 55, keyPlayer: "Yoane Wissa" },
  { slug: "uzbekistan", name: "Uzbekistán", flag: "🇺🇿", isoCode: "uz", group: "K", confederation: "AFC", fifaRank: 54, keyPlayer: "Eldor Shomurodov" },
  { slug: "colombia", name: "Colombia", flag: "🇨🇴", isoCode: "co", group: "K", confederation: "CONMEBOL", fifaRank: 10, keyPlayer: "Luis Díaz" },

  { slug: "inglaterra", name: "Inglaterra", flag: "🇬🇧", isoCode: "gb-eng", group: "L", confederation: "UEFA", fifaRank: 4, keyPlayer: "Jude Bellingham" },
  { slug: "croacia", name: "Croacia", flag: "🇭🇷", isoCode: "hr", group: "L", confederation: "UEFA", fifaRank: 11, keyPlayer: "Luka Modrić" },
  { slug: "ghana", name: "Ghana", flag: "🇬🇭", isoCode: "gh", group: "L", confederation: "CAF", fifaRank: 47, keyPlayer: "Mohammed Kudus" },
  { slug: "panama", name: "Panamá", flag: "🇵🇦", isoCode: "pa", group: "L", confederation: "CONCACAF", fifaRank: 35, keyPlayer: "Adalberto Carrasquilla" },
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
  const strengths: string[] = [];

  if (seed.fifaRank <= 10) {
    strengths.push("Jerarquía contrastada: pertenece a la élite del ranking FIFA y parte como favorita en su grupo");
  } else if (seed.fifaRank <= 25) {
    strengths.push("Nivel competitivo para disputar la clasificación ante cualquier rival del grupo");
  } else if (seed.fifaRank <= 50) {
    strengths.push("Capacidad para competir en partidos cerrados y aprovechar errores rivales");
  } else {
    strengths.push("Margen para sorprender desde un perfil bajo y sin presión externa");
  }

  if (seed.condition === "Anfitrión") {
    strengths.push("Juega como local: estadios conocidos, menor desgaste de viaje y apoyo masivo");
  }

  if (seed.keyPlayer && seed.fifaRank <= 30) {
    strengths.push(`Cuenta con ${seed.keyPlayer} como generador de desequilibrio en ataque`);
  }

  strengths.push(generateRegionalStrength(seed));

  return strengths.filter(Boolean);
}

function generateRegionalStrength(seed: TeamSeed): string {
  const map: Record<string, string> = {
    "CONMEBOL": "La exigencia de las eliminatorias sudamericanas la ha preparado para partidos de alta intensidad",
    "UEFA": "La densidad competitiva de las clasificatorias europeas garantiza un piso táctico alto",
    "CAF": "El ritmo competitivo del fútbol africano la ha curtido en partidos físicos y de transición rápida",
    "AFC": "La velocidad y disciplina táctica del fútbol asiático son su sello distintivo",
    "CONCACAF": "Acostumbrada a eliminatorias con desplazamientos largos y estilos de juego diversos",
    "OFC": "Llega con menos exposición internacional pero con un bloque consolidado tras años de trabajo",
  };
  return map[seed.confederation] ?? "Trayectoria competitiva en su confederación";
}

function buildWeaknesses(seed: TeamSeed): string[] {
  const position = groupSeedPosition(seed);
  const weaknesses: string[] = [];

  if (position >= 3) {
    weaknesses.push("Parte por detrás de al menos dos selecciones del grupo en el ranking FIFA");
  } else if (seed.fifaRank <= 10) {
    weaknesses.push("Soportar el rol de favorita en un torneo corto donde cualquier tropiezo penaliza")
  } else {
    weaknesses.push("Necesita convertir su competitividad en resultados desde la primera jornada");
  }

  if (seed.fifaRank > 50) {
    weaknesses.push("Plantilla con menos experiencia en torneos de la FIFA frente a rivales del grupo");
  }

  if (seed.fifaRank > 70) {
    weaknesses.push("Diferencia de recursos y profundidad de banquillo respecto a las cabezas de serie");
  }

  weaknesses.push(generateRegionalWeakness(seed));

  return weaknesses.filter(Boolean);
}

function generateRegionalWeakness(seed: TeamSeed): string {
  const map: Record<string, string> = {
    "CONMEBOL": "El desgaste físico de las eliminatorias largas puede pesar en un torneo concentrado",
    "UEFA": "La alta exigencia táctica en Europa no siempre se traduce en torneos cortos contra estilos diversos",
    "CAF": "La irregularidad competitiva entre partidos de clasificación y torneos FIFA es un factor a vigilar",
    "AFC": "La exposición limitada a rivales de primer nivel europeo y sudamericano en partidos oficiales",
    "CONCACAF": "La diferencia de ritmo competitivo respecto a selecciones UEFA y CONMEBOL en torneos FIFA",
    "OFC": "La falta de partidos oficiales contra selecciones del top 30 FIFA reduce la preparación",
  };
  return map[seed.confederation] ?? "Exposición limitada a ciertos estilos de juego";
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

  const confederationNote: Record<string, string> = {
    "CONMEBOL": "viene de unas eliminatorias que exigen el máximo nivel en cada jornada",
    "UEFA": "llega tras una fase de clasificación exigente contra rivales de alto nivel táctico",
    "CAF": "ha demostrado solidez en el fútbol africano, donde el físico y la transición son clave",
    "AFC": "se ha labrado un estilo basado en la disciplina táctica y la velocidad colectiva",
    "CONCACAF": "llega con experiencia en eliminatorias marcadas por la diversidad de estilos y viajes",
    "OFC": "completó su clasificación con autoridad y llega con un bloque bien trabajado",
  };

  const goodThings =
    seed.condition === "Anfitrión"
      ? `${seed.name} disfruta del factor local en un Mundial con varias sedes. El apoyo masivo, el conocimiento de los estadios y la menor exposición a viajes largos le dan un colchón extra en partidos igualados.`
      : seed.fifaRank <= 10
        ? `${seed.name} está en el grupo de selecciones que pueden aspirar a todo. Su jerarquía le permite imponer su plan de partido incluso cuando el rival se cierra, y su experiencia en torneos grandes es un activo difícil de igualar. ${confederationNote[seed.confederation] ?? ""}`
        : seed.fifaRank <= 25
          ? `${seed.name} tiene argumentos para pelear por la clasificación. Su experiencia internacional y el bloque de jugadores que compite en las mejores ligas del mundo le dan un piso competitivo alto. ${confederationNote[seed.confederation] ?? ""}`
          : `${seed.name} parte con menos reflectores pero con la posibilidad de crecer a medida que avance el torneo. Su fortaleza colectiva y la capacidad de adaptarse a distintos planteamientos serán sus mejores armas.`;

  const expectation =
    position === 1
      ? `Pelea por el primer puesto del Grupo ${seed.group} con la obligación de sumar de a tres desde el inicio.`
      : position === 2
        ? `Disputa una de las dos plazas de clasificación. Su torneo depende de ganar los partidos contra los rivales directos y no ceder puntos inesperados.`
        : position === 3
          ? `Su objetivo es mantenerse viva hasta la última jornada. Aprovechar cualquier tropiezo de los favoritos será su mejor baza.`
          : `Necesita puntuar pronto para no quedar descolgada. Una victoria inicial cambiaría por completo su panorama en el grupo.`;

  const watchPoint =
    seed.keyPlayer && seed.fifaRank <= 20
      ? `El rendimiento de ${seed.keyPlayer} marcará el techo del equipo. Si recibe bien, el ataque de ${seed.name} gana profundidad y capacidad de desequilibrio.`
      : seed.keyPlayer
        ? `${seed.keyPlayer} es la referencia ofensiva: su forma determinará en buena medida las aspiraciones del equipo en cada partido.`
        : `La evolución del bloque colectivo será la clave: si encuentra un once tipo sólido pronto, puede competir en todos los partidos.`;

  return {
    headline: `${seed.name}: análisis y perfil para el Mundial 2026`,
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
