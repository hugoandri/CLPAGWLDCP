import type { Article } from "@/lib/types";

// Artículos de análisis. Contenido original, sin copiar de terceros.
// Los artículos con `href` enlazan a una herramienta interna (p. ej. la calculadora);
// el resto tiene página de detalle en /tendencias/[slug].

export const articles: Article[] = [
  {
    slug: "cinco-selecciones-sorprenden-datos",
    title: "Las 5 selecciones que están sorprendiendo según los datos",
    category: "Tendencias",
    date: "2026-06-14",
    readingMinutes: 5,
    excerpt:
      "El modelo DataGoal valora a estas cinco selecciones por encima de su ranking FIFA. Te explicamos por qué los números les dan más crédito del esperado.",
    author: "Redacción DataGoal",
    trend: "Sorpresa",
    sections: [
      {
        heading: "Cuando el ranking se queda corto",
        body: "El ranking FIFA recompensa la historia y los resultados acumulados, pero tarda en reflejar la forma reciente. Nuestro modelo combina forma, goles esperados y dificultad del grupo, y ahí aparecen selecciones que rinden por encima de su puesto oficial.",
      },
      {
        heading: "Ecuador y Australia, las que más suben",
        body: "Australia escala posiciones tras su arranque ganador en el Grupo D. Ecuador, por su parte, destaca por un mediocampo físico y una solidez defensiva impropia de su ranking, lo que el modelo premia con una alta probabilidad de competir por la clasificación.",
      },
      {
        heading: "Austria, Costa de Marfil y Uruguay completan la lista",
        body: "Austria figura entre las selecciones con mayor intensidad de presión; Costa de Marfil llega como campeona de África vigente; y Australia arrancó con una victoria que mejora su escenario en el Grupo D. En los tres casos, los datos cuentan una historia más optimista que la clasificación oficial.",
      },
    ],
    faqs: [
      {
        question: "¿Cómo decide el modelo qué selección sorprende?",
        answer:
          "Compara el ranking interno de DataGoal (basado en forma, goles esperados y contexto) con el ranking FIFA. Cuando la diferencia es favorable, la selección se considera una sorpresa estadística.",
      },
      {
        question: "¿Esto es un consejo de apuestas?",
        answer:
          "No. Es un análisis informativo y estadístico. No constituye consejo de apuestas ni garantiza ningún resultado.",
      },
    ],
  },
  {
    slug: "que-necesita-mexico-clasificar",
    title: "Qué necesita México para clasificar a octavos del Mundial 2026",
    category: "Clasificación",
    date: "2026-06-14",
    readingMinutes: 4,
    excerpt:
      "Escenarios, combinaciones y probabilidades: esto es lo que necesita El Tri para avanzar de la fase de grupos según el modelo.",
    author: "Redacción DataGoal",
    trend: "Clasificación",
    sections: [
      {
        heading: "El punto de partida",
        body: "México afronta la última jornada como local y con la clasificación en su mano. El modelo le asigna cerca de un 78% de probabilidad de avanzar, el segundo registro más alto de su grupo tras los cabezas de serie.",
      },
      {
        heading: "Los escenarios",
        body: "Con una victoria, El Tri sella el pase de forma matemática en prácticamente todos los escenarios. Un empate le mantiene dependiente de la diferencia de goles, mientras que una derrota le obligaría a esperar otros resultados. La localía en el Azteca es el factor que más empuja sus opciones.",
      },
      {
        heading: "La clave estadística",
        body: "Su mejor baza es la profundidad ofensiva y el apoyo de su público. Su asignatura pendiente, cerrar los partidos: el modelo detecta cierta irregularidad en los tramos finales.",
      },
    ],
    faqs: [
      {
        question: "¿Le vale el empate a México?",
        answer:
          "Depende de la diferencia de goles y de los otros resultados del grupo. Puedes simular todos los escenarios en nuestra calculadora de clasificación.",
      },
      {
        question: "¿Qué probabilidad tiene México de pasar?",
        answer:
          "El modelo le asigna en torno a un 78% de avanzar de la fase de grupos, reforzado por la ventaja de jugar como anfitrión.",
      },
    ],
  },
  {
    slug: "que-necesita-argentina-clasificar",
    title: "Qué necesita Argentina para clasificar en el Mundial 2026",
    category: "Clasificación",
    date: "2026-06-13",
    readingMinutes: 4,
    excerpt:
      "La campeona vigente parte como favorita de su grupo. Repasamos sus escenarios de clasificación y lo que dicen los datos.",
    author: "Redacción DataGoal",
    trend: "Clasificación",
    sections: [
      {
        heading: "Favorita y con margen",
        body: "Argentina lidera su grupo en el modelo con cerca de un 90% de probabilidad de avanzar. Su combinación de jerarquía, oficio y efectividad la coloca entre las dos máximas candidatas al título.",
      },
      {
        heading: "Los escenarios",
        body: "La Albiceleste depende de sí misma: sumar en la última jornada le garantiza el primer puesto en la mayoría de combinaciones. Incluso una derrota ajustada la dejaría clasificada por diferencia de goles.",
      },
      {
        heading: "La clave estadística",
        body: "Su ataque y su definición figuran entre los más altos del torneo. El modelo solo penaliza la edad de algunos referentes de cara a las rondas más exigentes.",
      },
    ],
    faqs: [
      {
        question: "¿Puede quedar primera de grupo Argentina?",
        answer:
          "Sí. En la mayoría de escenarios del modelo, sumar en la última jornada le asegura el primer puesto. Pruébalo en la calculadora.",
      },
      {
        question: "¿Es Argentina favorita al título?",
        answer:
          "El modelo la sitúa entre las dos máximas candidatas, junto a España, por su efectividad y experiencia.",
      },
    ],
  },
  {
    slug: "que-necesita-espana-clasificar",
    title: "Qué necesita España para clasificar y por qué lidera el modelo",
    category: "Clasificación",
    date: "2026-06-13",
    readingMinutes: 4,
    excerpt:
      "La Roja es la número 1 del ranking interno de DataGoal. Te contamos sus escenarios de clasificación y la base estadística de su favoritismo.",
    author: "Redacción DataGoal",
    trend: "Líder",
    sections: [
      {
        heading: "La número 1 del modelo",
        body: "España encabeza el ranking interno de DataGoal gracias a la posesión y la presión más altas del torneo. Su probabilidad de avanzar ronda el 91%, la mayor de toda la competición.",
      },
      {
        heading: "Los escenarios",
        body: "Con su pleno de puntos, La Roja tiene la clasificación encarrilada y pelea por el primer puesto para evitar a los grandes en octavos. Solo una combinación muy adversa de resultados complicaría su pase.",
      },
      {
        heading: "La clave estadística",
        body: "Domina el balón y recupera rápido tras pérdida. Su única duda es la falta de un '9' fijo, un matiz que el modelo señala de cara a los partidos más cerrados.",
      },
    ],
    faqs: [
      {
        question: "¿Por qué España es la número 1 del modelo y no la 1 de la FIFA?",
        answer:
          "El ranking interno pondera forma reciente, goles esperados y dificultad del grupo, no solo el histórico. En esas variables, España lidera.",
      },
      {
        question: "¿Está clasificada España?",
        answer:
          "Con su balance actual tiene el pase muy encaminado. Simula los escenarios restantes en la calculadora de clasificación.",
      },
    ],
  },
  {
    slug: "calculadora-clasificacion-grupos",
    title: "Calculadora de clasificación: simula quién pasa de grupo",
    category: "Herramienta",
    date: "2026-06-14",
    readingMinutes: 2,
    excerpt:
      "Cambia los resultados de la última jornada y mira en tiempo real qué selecciones se clasifican. Una herramienta interactiva para jugar con los escenarios.",
    author: "Redacción DataGoal",
    trend: "Herramienta",
    href: "/calculadora",
    sections: [
      {
        heading: "Juega con los escenarios",
        body: "Elige un grupo, ajusta los marcadores y la tabla se recalcula al instante, marcando a los dos clasificados. Ideal para resolver de una vez por todas el clásico '¿qué necesita mi selección?'.",
      },
    ],
    faqs: [
      {
        question: "¿La calculadora usa datos reales?",
        answer:
          "Utiliza el calendario y los resultados cargados en el snapshot local del torneo. La lógica de clasificación (puntos y diferencia de goles) es la oficial.",
      },
    ],
  },
  {
    slug: "camino-mas-dificil-mundial-2026",
    title: "La selección con el camino más difícil del Mundial 2026",
    category: "Análisis",
    date: "2026-06-12",
    readingMinutes: 6,
    excerpt:
      "No todos los grupos pesan igual. Analizamos qué selección afronta el recorrido más complicado según el índice de dificultad del modelo.",
    author: "Redacción DataGoal",
    trend: "Análisis",
    sections: [
      {
        heading: "Qué es el índice de dificultad",
        body: "Para cada selección calculamos la fuerza media de sus rivales de grupo a partir del ranking interno. Cuanto más alta es esa media, más difícil es el camino inicial. No es lo mismo enfrentarse a tres rivales de top 20 mundial que compartir grupo con selecciones de ranking más bajo: la probabilidad de avanzar cambia de forma significativa incluso si el nivel propio es el mismo.",
      },
      {
        heading: "El 'grupo de la muerte'",
        body: "El Grupo C reúne a Brasil, Marruecos, Escocia y Haití, con un favorito histórico y dos rivales capaces de disputar la clasificación. Pasar de ahí tiene un mérito estadístico superior al de otros grupos más asequibles. El modelo refleja esta asimetría: Brasil sigue siendo favorita, pero su probabilidad de avanzar es menor que la de otras selecciones de su mismo nivel que enfrentan grupos más accesibles.",
      },
      {
        heading: "Favoritos con examen exigente",
        body: "Entre los grandes, quienes comparten grupo con rivales de ranking alto ven reducida su probabilidad de avanzar pese a su calidad. El modelo lo refleja: mismo nivel, distinto contexto, distinta probabilidad. Es el caso de Francia en el Grupo I con Senegal y Noruega, o de Argentina en el Grupo J con Austria. Ambas son favoritas al título, pero su camino de grupo es más exigente que el de otros cabezas de serie.",
      },
      {
        heading: "Las tapadas con grupo accesible",
        body: "En el otro extremo, selecciones que parten con menos nombre pueden ver aumentadas sus opciones si el grupo es asequible. El modelo premia a quienes, sin ser favoritas, tienen un calendario que les permite soñar con la clasificación. La diferencia entre un grupo equilibrado y uno desnivelado puede ser de hasta 20 puntos porcentuales en la probabilidad de avanzar.",
      },
    ],
    faqs: [
      {
        question: "¿Cómo se calcula la dificultad del grupo?",
        answer:
          "Promediando la fuerza de los rivales de cada selección según el ranking interno de DataGoal. Es una de las cinco variables del modelo de predicción.",
      },
      {
        question: "¿Dónde puedo ver la dificultad de cada selección?",
        answer:
          "En la página de Predicciones mostramos el desglose de variables, incluida la dificultad del grupo, para cada selección.",
      },
    ],
  },
  {
    slug: "introduccion-analisis-estadistico-futbol",
    title: "Introducción al análisis estadístico en el fútbol: métricas clave para entender el juego",
    category: "Análisis",
    date: "2026-06-10",
    readingMinutes: 6,
    excerpt:
      "Del xG a la presión tras pérdida: guía básica de las métricas que usamos en DataGoal Lab para analizar el rendimiento futbolístico sin depender del marcador.",
    author: "Redacción DataGoal",
    trend: "Análisis",
    sections: [
      {
        heading: "Más allá del marcador",
        body: "El fútbol ha cambiado: donde antes solo importaban los goles, hoy existen decenas de métricas que permiten evaluar el rendimiento de un equipo con más profundidad. En DataGoal Lab creemos que entender estos números ayuda a ver el juego de forma más completa, tanto para seguir a tu selección como para disfrutar de un partido cualquiera.",
      },
      {
        heading: "Los goles esperados (xG)",
        body: "El xG mide la calidad de las ocasiones de gol. No todas las oportunidades son iguales: un remate desde el punto de penalti tiene más probabilidad de acabar en gol que un disparo lejano. El xG asigna un valor entre 0 y 1 a cada remate según su posición, el tipo de pase recibido y la presión del defensor. Si un equipo acumula 2.5 xG pero solo marca un gol, puede tener un problema de puntería o simplemente mala suerte. Al revés, ganar 1-0 con 0.4 xG en contra sugiere que el resultado no refleja lo que ocurrió en el campo.",
      },
      {
        "heading": "Posesión y presión: dos caras de la misma moneda",
        "body": "La posesión sola no gana partidos, pero combinada con una presión efectiva tras pérdida sí es un indicador potente. Los equipos que recuperan rápido el balón en campo rival generan más ocasiones y conceden menos contraataques. Por eso nuestro modelo incluye tanto la posesión como la intensidad de presión como variables separadas: una posesión estéril en campo propio no vale lo mismo que una posesión avanzada y agresiva.",
      },
      {
        "heading": "El contexto del rival y el grupo",
        "body": "Una de las claves del análisis estadístico que no siempre se menciona es el contexto. Enfrentarse a un equipo defensivo no es lo mismo que enfrentarse a uno abierto. Por eso en DataGoal no evaluamos a las selecciones solo por sus números absolutos: también miramos la dificultad del grupo y la calidad de los rivales. Una defensa sólida contra Francia no vale lo mismo que una defensa sólida ante un equipo de menor ranking, y nuestro modelo lo refleja.",
      },
      {
        "heading": "Lo que los números no cuentan",
        "body": "Ninguna métrica captura la lesión de un jugador clave en el calentamiento, el error arbitral que cambia un partido o la motivación extra de una selección anfitriona. Por eso en DataGoal insistimos en que las probabilidades son estimaciones, no predicciones. El valor del análisis estadístico está en generar contexto, no en reemplazar la emoción del fútbol.",
      },
    ],
    faqs: [
      {
        question: "¿Qué métrica es la más fiable para predecir resultados?",
        answer: "Ninguna métrica aislada es fiable al 100%. La combinación de varias variables (forma reciente, goles esperados, contexto del rival) ofrece una imagen más completa que cualquier número por separado.",
      },
      {
        question: "¿El xG predice quién ganará un partido?",
        answer: "El xG correlaciona bien con los resultados a largo plazo, pero en un solo partido el margen de azar es demasiado alto. Por eso nuestros análisis siempre hablan de tendencias y probabilidades, no de certezas.",
      },
    ],
  },
  {
    slug: "ranking-selecciones-rendimiento",
    title: "El ranking de selecciones por rendimiento, explicado",
    category: "Datos",
    date: "2026-06-12",
    readingMinutes: 4,
    excerpt:
      "Cómo construimos el ranking interno de DataGoal y en qué se diferencia del ranking FIFA. Las cinco variables que mueven la aguja.",
    author: "Redacción DataGoal",
    trend: "Datos",
    sections: [
      {
        heading: "Más que el ranking oficial",
        body: "Nuestro ranking interno no sustituye al ranking FIFA: lo complementa. Mientras el oficial premia el histórico, el nuestro pondera el momento de forma y el contexto del torneo.",
      },
      {
        heading: "Las cinco variables",
        body: "Forma reciente, ranking relativo, goles esperados aproximados, fortaleza defensiva y dificultad del grupo. Cada una aporta una pieza del rompecabezas y juntas explican por qué una selección sube o baja respecto a su puesto oficial.",
      },
      {
        heading: "Cómo leerlo",
        body: "Un puesto alto no garantiza nada: es una probabilidad, no una certeza. El valor del ranking está en comparar selecciones y entender los porqués, no en predecir resultados exactos.",
      },
    ],
    faqs: [
      {
        question: "¿El ranking interno predice quién ganará?",
        answer:
          "No. Ofrece una estimación de fuerza relativa. El fútbol mantiene un componente de azar que ningún modelo elimina.",
      },
      {
        question: "¿Cada cuánto se actualizaría con datos reales?",
        answer:
          "Con una API conectada podría recalcularse tras cada jornada. En esta versión se recalcula desde el snapshot local de calendario y resultados.",
      },
    ],
  },
];

const articleBySlug = new Map(articles.map((a) => [a.slug, a]));

export function getArticle(slug: string): Article | undefined {
  return articleBySlug.get(slug);
}

/** Artículos con página de detalle propia (excluye los que enlazan a herramientas). */
export function getArticlesWithDetail(): Article[] {
  return articles.filter((a) => !a.href);
}

export function getLatestArticles(limit?: number): Article[] {
  const sorted = [...articles].sort((a, b) => (a.date < b.date ? 1 : -1));
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}
