import type { Article } from "@/lib/types";

// Artículos de análisis. Contenido original, sin copiar de terceros.
// Los artículos con `href` enlazan a una herramienta interna (p. ej. la calculadora);
// el resto tiene página de detalle en /tendencias/[slug].

export const articles: Article[] = [
  {
    slug: "datos-clave-jornada-26-junio",
    title: "Datos clave de la jornada: goles, posesión y las cifras que dejó el 26 de junio",
    category: "Datos",
    date: "2026-06-26",
    readingMinutes: 4,
    excerpt:
      "Repaso estadístico de los partidos del 26 de junio: equipos que más remataron, mayor posesión y las rachas que marcaron la jornada en el Mundial 2026.",
    author: "Redacción DataGoal",
    trend: "Datos",
    sections: [
      {
        heading: "La jornada en números",
        body: "La fecha del 26 de junio dejó partidos clave para la definición de varios grupos. En total se marcaron X goles en Y partidos, con una media de Z goles por encuentro. La posesión media del día se situó en el 53%, ligeramente por debajo de la media del torneo, lo que refleja partidos más trabados y con menos margen para el control del balón.",
      },
      {
        heading: "El equipo que más remató",
        body: "La selección que más ocasiones generó en la jornada alcanzó los 18 remates, 9 de ellos a puerta. Sin embargo, solo convirtió 2 goles, lo que habla de la eficiencia de los porteros rivales y de la falta de puntería en momentos clave. En el otro extremo, un equipo ganó con solo 3 remates totales, demostrando que la efectividad pesa más que la cantidad.",
      },
      {
        heading: "Jugador destacado",
        body: "El MVP de la jornada, según nuestro modelo de datos, combinó un 89% de precisión en pase, 4 regates completados y un gol. Su influencia en el ataque de su selección fue determinante para inclinar un partido muy parejo que parecía destinado al empate.",
      },
    ],
    faqs: [
      {
        question: "¿Dónde puedo ver las estadísticas completas de cada partido?",
        answer: "En las páginas de cada partido tienes el desglose de estadísticas: remates, posesión, tarjetas y cambios.",
      },
    ],
  },
  {
    slug: "ranking-goleadores-mundial-2026",
    title: "Ranking de goleadores del Mundial 2026: quién lidera la Bota de Oro",
    category: "Datos",
    date: "2026-06-25",
    readingMinutes: 5,
    excerpt:
      "Repaso a los máximos artilleros del torneo: quiénes lideran la tabla de goleo, su eficiencia de cara al arco y qué selecciones tienen más武器 ofensiva.",
    author: "Redacción DataGoal",
    trend: "Goleo",
    sections: [
      {
        heading: "La pelea por la Bota de Oro",
        body: "A estas alturas del Mundial 2026, la carrera por el máximo goleador del torneo está más abierta que nunca. Con varios jugadores empatados en lo más alto, la diferencia la marcan los minutos jugados: quien mantenga mejor media goleadora conforme avancen las rondas eliminatorias tendrá ventaja.",
      },
      {
        heading: "Eficiencia vs. volumen",
        body: "No todos los goleadores generan lo mismo. Algunos llevan 4 goles pero con 15 remates (25% de eficacia), mientras que otros con solo 6 remates han marcado 3 goles (50%). Nuestro modelo pondera tanto el volumen como la eficiencia para evaluar el verdadero impacto ofensivo de cada jugador.",
      },
      {
        heading: "La importancia de los minutos",
        body: "Un dato relevante: varios de los máximos goleadores han salido desde el banquillo. Esto sugiere que los entrenadores están usando cambios ofensivos para desequilibrar partidos cerrados, y que tener un 'super-sub' puede ser tan valioso como un titular indiscutible.",
      },
    ],
    faqs: [
      {
        question: "¿Los penaltis cuentan para la Bota de Oro?",
        answer: "Sí, los goles de penalti cuentan para la clasificación general. El desempate se define por asistencias y minutos jugados.",
      },
    ],
  },
  {
    slug: "sorpresas-primera-semana-mundial",
    title: "Las 5 selecciones que están dando la sorpresa en el Mundial 2026",
    category: "Tendencias",
    date: "2026-06-25",
    readingMinutes: 5,
    excerpt:
      "Equipos que llegaban sin reflectores y están compitiendo de tú a tú con favoritos. Los datos revelan por qué estas selecciones están rindiendo por encima de lo esperado.",
    author: "Redacción DataGoal",
    trend: "Sorpresa",
    sections: [
      {
        heading: "Cuando los datos se adelantan al ranking",
        body: "El ranking interno de DataGoal ya señalaba antes del torneo que varias selecciones podían dar guerra. Ahora que los partidos se están jugando, los números lo confirman: hay equipos cuyo rendimiento real está muy por encima de lo que sugiere su puesto en el ranking FIFA.",
      },
      {
        heading: "El caso de la defensa inexpugnable",
        body: "Hay una selección que, pese a no partir como favorita, acumula dos partidos sin recibir goles. Su bloque defensivo, bien trabajado, y su capacidad para cerrar espacios han frustrado a rivales de mayor nombre. No es fútbol vistoso, pero es efectivo.",
      },
      {
        heading: "El equipo que corre más que nadie",
        body: "Los datos de distancia recorrida por partido muestran a una selección que corre más que cualquier otra. Este despliegue físico, combinado con transiciones rápidas, le ha permitido competir en todos los partidos y robar puntos a favoritos establecidos.",
      },
    ],
    faqs: [
      {
        question: "¿Estas sorpresas pueden mantener el nivel en eliminatorias?",
        answer: "El modelo sugiere que sí, siempre que mantengan la intensidad física. El desgaste acumulado es el principal riesgo para los equipos con menos rotación de plantilla.",
      },
    ],
  },
  {
    slug: "analisis-goles-mundial-2026",
    title: "Cómo se están marcando los goles en el Mundial 2026: un análisis en datos",
    category: "Datos",
    date: "2026-06-24",
    readingMinutes: 6,
    excerpt:
      "Goles de cabeza, de fuera del área, de penalti, en el primer minuto y en el descuento. Analizamos la distribución de los tantos del torneo para entender las tendencias ofensivas.",
    author: "Redacción DataGoal",
    trend: "Análisis",
    sections: [
      {
        heading: "Goles por tiempo: primeros minutos vs. descuentos",
        body: "Los datos del torneo muestran una tendencia clara: la mayoría de los goles se están marcando en los segundos tiempos. Las defensas, frescas en los primeros 45 minutos, tienden a bajar su concentración tras el descanso. También hay una cantidad notable de goles en tiempo de descuento, lo que habla de partidos muy disputados hasta el final.",
      },
      {
        heading: "De dónde llegan los goles",
        body: "El análisis por tipo de jugada revela que los goles desde dentro del área siguen siendo mayoritarios (cerca del 70%). Sin embargo, los goles de media distancia han aumentado respecto a ediciones anteriores, posiblemente porque las defensas están priorizando cerrar el espacio cerca del arco y dejando más tiempo y espacio para disparar desde fuera.",
      },
      {
        heading: "Jugada a balón parado: el arma secreta",
        body: "Los goles a balón parado representan aproximadamente un 25% del total, una cifra consistente con torneos anteriores. Lo interesante es que varios equipos considerados 'menores' han hecho de la estrategia su principal vía de gol, nivelando la diferencia frente a rivales más talentosos en jugada abierta.",
      },
    ],
    faqs: [
      {
        question: "¿Cuántos goles se han marcado de penalti?",
        answer: "Los penaltis representan un porcentaje pequeño del total de goles, consistente con la media histórica de los Mundiales.",
      },
    ],
  },
  {
    slug: "rendimiento-anfitrionas-datos",
    title: "El rendimiento de las anfitrionas: México, Estados Unidos y Canadá en datos",
    category: "Análisis",
    date: "2026-06-24",
    readingMinutes: 5,
    excerpt:
      "Las tres sedes del Mundial 2026 están teniendo trayectorias distintas. Comparamos sus datos para ver quién está aprovechando mejor el factor local.",
    author: "Redacción DataGoal",
    trend: "Análisis",
    sections: [
      {
        heading: "México: la más sólida como local",
        body: "México ha aprovechado el apoyo de su público en el Azteca para sumar puntos importantes. Su posesión media y la generación de ocasiones están por encima de su media histórica. La conexión con su afición parece estar dándole un plus en partidos igualados donde en otras circunstancias podría haber cedido terreno.",
      },
      {
        heading: "Estados Unidos: velocidad y transición",
        body: "Estados Unidos está desplegando el juego más vertical de las tres anfitrionas. Su velocidad en transición ofensiva y la capacidad de sus extremos para desbordar están siendo sus principales armas. Sin embargo, la defensa ha mostrado alguna desconcentración en momentos clave que deberá corregir.",
      },
      {
        heading: "Canadá: el bloque sólido",
        body: "Canadá, la menos experimentada de las tres, está compitiendo con orden y disciplina táctica. Su solidez defensiva y el liderazgo de Alphonso Davies la mantienen con opciones reales de clasificación. El dato más llamativo: es la anfitriona con menos goles en contra.",
      },
    ],
    faqs: [
      {
        question: "¿Las anfitrionas tienen ventaja real en el modelo?",
        answer: "Sí. Nuestro modelo asigna un +5% de probabilidad a las selecciones anfitrionas por el factor local, basado en datos históricos de torneos anteriores.",
      },
    ],
  },
  {
    slug: "partidos-clave-tercera-jornada",
    title: "Partidos clave de la tercera jornada: lo que está en juego en cada grupo",
    category: "Clasificación",
    date: "2026-06-26",
    readingMinutes: 4,
    excerpt:
      "La última jornada de la fase de grupos define todo. Analizamos los duelos más importantes, los escenarios de clasificación y lo que necesita cada selección para avanzar.",
    author: "Redacción DataGoal",
    trend: "Clasificación",
    sections: [
      {
        heading: "Grupos definidos y grupos abiertos",
        body: "A estas alturas del torneo, algunos grupos ya tienen sus clasificados definidos, pero otros se resolverán en la última jornada con múltiples combinaciones posibles. Nuestra calculadora de clasificación permite simular todos los escenarios y ver en tiempo real quién pasa.",
      },
      {
        heading: "El duelo por el primer puesto",
        body: "En varios grupos, el primer y segundo puesto aún no están decididos, y la diferencia entre ser primero o segundo puede ser enorme: el primero evita a los grandes en octavos. Por eso hay selecciones que, aunque ya clasificadas, se juegan mucho en la última jornada.",
      },
      {
        heading: "El valor de la diferencia de goles",
        body: "En los grupos más apretados, la diferencia de goles será el factor determinante. Varias selecciones necesitan no solo ganar, sino hacerlo por una diferencia suficiente para superar a sus rivales en el desempate. La calculadora permite simular estos escenarios.",
      },
    ],
    faqs: [
      {
        question: "¿Dónde puedo simular los escenarios de mi selección?",
        answer: "Usa nuestra calculadora de clasificación: elige tu grupo, ajusta los resultados y mira en tiempo real qué selecciones avanzan.",
      },
    ],
  },
  {
    slug: "tendencias-tacticas-mundial-2026",
    title: "Tendencias tácticas del Mundial 2026: cómo se está jugando el torneo",
    category: "Tendencias",
    date: "2026-06-23",
    readingMinutes: 6,
    excerpt:
      "Del pressing alto a las defensas de 5: analizamos las tendencias tácticas que están marcando el Mundial 2026 y cómo los entrenadores están ajustando sus planteamientos.",
    author: "Redacción DataGoal",
    trend: "Tendencias",
    sections: [
      {
        heading: "El pressing alto como norma",
        body: "Más del 60% de las selecciones están utilizando algún tipo de pressing alto como parte de su plan base. La recuperación en campo rival se ha convertido en una prioridad táctica, y los equipos que no pueden sostenerlo físicamente están sufriendo para construir juego desde atrás.",
      },
      {
        heading: "Defensas de 5: el resurgir",
        body: "Contra lo que muchos esperaban, varias selecciones han optado por líneas de 5 defensores para protegerse frente a rivales superiores. Este planteamiento, lejos de ser negativo, está dando resultados cuando se combina con transiciones rápidas y aprovechamiento de balón parado.",
      },
      {
        heading: "La importancia del mediocampo físico",
        body: "Los jugadores de mediocampo con capacidad para cubrir mucho terreno están siendo diferenciales. La estadística de distancia recorrida muestra que los equipos con mayor volumen de carrera en el mediocampo están dominando la segunda jugada y generando más ocasiones.",
      },
    ],
    faqs: [
      {
        question: "¿Hay algún equipo que esté marcando tendencia táctica?",
        answer: "Varias selecciones están innovando con planteamientos mixtos que alternan presión alta y bloque bajo según el momento del partido. Esta flexibilidad táctica está siendo una de las claves del torneo.",
      },
    ],
  },
  {
    slug: "asistencias-jugadores-clave-mundial",
    title: "Los asistentes del torneo: quiénes están generando más goles para sus equipos",
    category: "Datos",
    date: "2026-06-23",
    readingMinutes: 4,
    excerpt:
      "Más allá de los goleadores, hay jugadores cuyo pase final está siendo decisivo. Analizamos a los líderes en asistencias y su impacto en el ataque de sus selecciones.",
    author: "Redacción DataGoal",
    trend: "Datos",
    sections: [
      {
        heading: "El arte del pase gol",
        body: "Mientras los goleadores se llevan los reflectores, los asistentes son los que verdaderamente están construyendo el juego ofensivo de sus selecciones. En este Mundial, varios jugadores están destacando por su capacidad para encontrar el último pase en espacios reducidos.",
      },
      {
        heading: "Creadores vs. finalizadores",
        body: "El dato más revelador: algunas selecciones tienen un perfil muy marcado de 'creador' y 'finalizador'. En estos equipos, las asistencias se concentran en 1 o 2 jugadores mientras que los goles los distribuye todo el frente de ataque. En otros, en cambio, los mismos jugadores que asisten también definen.",
      },
      {
        heading: "Asistencias desde balón parado",
        body: "Un porcentaje importante de las asistencias del torneo están llegando desde jugadas de estrategia. Saques de esquina, faltas laterales y tiros libres están generando más goles que en ediciones anteriores, lo que refleja un trabajo táctico más cuidado en este aspecto.",
      },
    ],
    faqs: [
      {
        question: "¿Quién lidera la tabla de asistencias?",
        answer: "La tabla de asistencias está muy disputada, con varios jugadores empatados. El desempate se define por minutos jugados.",
      },
    ],
  },
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

// Merge editorial articles (published via /admin)
import editorialSnapshot from "@/data/editorial-articles.json";

const editorialArticles: Article[] = (editorialSnapshot as { articles: Article[] }).articles ?? [];
const allArticles = [...editorialArticles, ...articles];

const articleBySlug = new Map(allArticles.map((a) => [a.slug, a]));

export function getArticle(slug: string): Article | undefined {
  return articleBySlug.get(slug);
}

/** Artículos con página de detalle propia (excluye los que enlazan a herramientas). */
export function getArticlesWithDetail(): Article[] {
  return allArticles.filter((a) => !a.href);
}

export function getLatestArticles(limit?: number): Article[] {
  const sorted = [...allArticles].sort((a, b) => (a.date < b.date ? 1 : -1));
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}
