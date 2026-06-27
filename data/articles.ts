import type { Article } from "@/lib/types";

// Artículos de análisis. Contenido original, sin copiar de terceros.
// Los artículos con `href` enlazan a una herramienta interna (p. ej. la calculadora);
// el resto tiene página de detalle en /tendencias/[slug].

export const articles: Article[] = [
  {
    slug: "datos-clave-jornada-26-junio",
    title: "La jornada más tensa del torneo: lo que dijeron los números del 26 de junio",
    category: "Datos",
    date: "2026-06-26",
    readingMinutes: 4,
    excerpt:
      "Solo 9 goles en 8 partidos. El miedo a perder ganó la jornada. Pero detrás de esa parálisis colectiva hubo destellos que valen la pena analizar.",
    author: "Redacción DataGoal",
    trend: "Datos",
    sections: [
      {
        heading: "Una jornada que se jugó con el freno puesto",
        body: "Nueve goles en ocho partidos. Uno punto uno de media. Si solo mirás ese número, pensás que fue una jornada aburrida. Y en parte lo fue. Pero el dato no te cuenta la tensión que había en cada estadio, la cantidad de veces que un entrenador se paró en el área técnica como si ese gesto pudiera empujar al equipo. La fase de grupos tiene eso: cuando lo que está en juego es clasificar o quedarte afuera, el miedo al error le gana a la valentía de atacar. La posesión media del día fue del 51%, un espejo perfecto de lo que fue la jornada: nadie dominó, nadie cedió, todos calcularon.",
      },
      {
        heading: "Marruecos disparó 17 veces y metió una. Japón tiró 4 y metió 2. El fútbol es así.",
        body: "Marruecos acumuló 17 remates, 8 entre los tres palos. Uno terminó adentro. El portero rival tuvo una de esas noches en que el travesaño es tu mejor amigo y la pelota rebota donde tiene que rebotar. Japón, del otro lado, tiró cuatro veces y convirtió dos. No es magia. Es que Japón no desperdicia. No se desesperan, no improvisan, esperan el momento exacto y cuando llega, lo aprovechan con una frialdad que pocos equipos tienen en este torneo. Esa diferencia entre eficiencia y volumen es lo que más me interesa de los datos: te dice qué equipo tiene sistema y cuál tiene esperanza.",
      },
      {
        heading: "El número que más llamó la atención: Pedri y los 94 pases",
        body: "El MVP del día, según el modelo DataGoal, no fue el que metió el gol más lindo ni el que salió en los titulares. Fue Pedri. 94 pases con 96% de precisión, 8 recuperaciones en campo rival, 3 situaciones de peligro generadas. No marcó. Pero España no necesitó que marcara: controló el partido como si fuera un entrenamiento. Hay jugadores que cambian el marcador y hay jugadores que cambian el partido. Pedri pertenece a la segunda categoría, que es la más difícil de entender y la más fácil de subestimar.",
      },
    ],
    faqs: [
      {
        question: "¿Dónde puedo ver las estadísticas completas de cada partido?",
        answer: "En las páginas de cada partido encontrás el desglose completo: remates totales y a puerta, posesión, tarjetas, cambios y los momentos que definieron el resultado. Entrá desde la sección Partidos.",
      },
    ],
  },
  {
    slug: "ranking-goleadores-mundial-2026",
    title: "La Bota de Oro: Haaland manda, pero esto está lejos de terminarse",
    category: "Datos",
    date: "2026-06-25",
    readingMinutes: 5,
    excerpt:
      "Haaland tiene 4 goles y lidera la tabla. Vinicius lo persigue con 3. Pero lo que más me interesa no es quién va primero: es quién está rindiendo mejor de lo que sus números sugieren.",
    author: "Redacción DataGoal",
    trend: "Goleo",
    sections: [
      {
        heading: "Haaland es una anomalía. Y eso ya lo sabíamos.",
        body: "Cuatro goles en tres partidos. No es una racha: es Haaland siendo Haaland. Lo que le hace diferente no es solo que convierte, sino que genera un xG acumulado inferior a sus goles reales, lo que en términos estadísticos es casi imposible de sostener. Está marcando más de lo que la calidad de sus ocasiones 'merecía'. Eso puede significar dos cosas: que está en un estado de gracia que pocos delanteros alcanzan, o que en algún momento los números lo van a atrapar. Vinicius Jr. lo persigue con tres goles y con la diferencia de que el brasileño sí está convirtiendo lo que el xG le prometía. Dos formas distintas de liderar. Las dos igualmente peligrosas.",
      },
      {
        heading: "Kane remata más que nadie y anota menos de lo que debería",
        body: "Harry Kane lleva 11 remates en el torneo. Tiene 2 goles. Eso es un 18% de eficacia: para el nivel que tiene, es una cifra baja. Y sin embargo, Inglaterra sigue bien en el torneo porque Kane genera espacio, asocia y libera a los que vienen detrás. El problema es que en una Copa del Mundo, cuando llegue el partido que defina la clasificación, un equipo necesita que su mejor delantero convierta. Kane ya lo vivió en Qatar. Ya sabe lo que pesa esa carga. La pregunta es si esta vez puede sacársela de encima. Lamine Yamal, mientras tanto, lleva 6 remates y 2 goles. 33% de eficacia. Con 18 años. Eso sí que da miedo.",
      },
      {
        heading: "Los minutos importan tanto como los goles",
        body: "Álvaro Morata tiene 2 goles en 180 minutos de titular. Si España sigue avanzando —y el modelo dice que lo hará— va a tener más partidos que cualquiera de los delanteros que hoy están por encima de él en la tabla. La Bota de Oro no se gana en la fase de grupos: se gana en los partidos que quedan. Y hay jugadores que llevan goles sumados como súper suplentes, en 30 o 40 minutos por partido, que también pueden escalar si sus selecciones avanzan lejos. Esta carrera no está ni cerca de definirse.",
      },
    ],
    faqs: [
      {
        question: "¿Los penaltis cuentan para la Bota de Oro?",
        answer: "Sí. Los goles de penalti cuentan igual que cualquier otro. En caso de empate en goles, el desempate es por asistencias primero y luego por minutos jugados. Por eso la fase eliminatoria puede dar vuelta la tabla completamente.",
      },
    ],
  },
  {
    slug: "sorpresas-primera-semana-mundial",
    title: "Los equipos que nadie esperaba: cinco selecciones que están rompiendo el guión",
    category: "Tendencias",
    date: "2026-06-25",
    readingMinutes: 5,
    excerpt:
      "Japón sin encajar un gol. Austria con línea de cinco ganando partidos. Ecuador defendiendo como si fuera Atlético de Madrid. Hay equipos que llegaron sin cartel y están siendo protagonistas.",
    author: "Redacción DataGoal",
    trend: "Sorpresa",
    sections: [
      {
        heading: "El ranking FIFA no vio lo que el modelo sí veía",
        body: "El ranking FIFA tiene un problema estructural: tarda. Tarda en reflejar los cambios de nivel real que tiene un equipo cuando lleva seis meses construyendo algo nuevo. Por eso antes del torneo, el modelo DataGoal ya marcaba a cinco selecciones como estadísticamente subvaloradas: su forma reciente, sus goles esperados y su cohesión táctica estaban muy por encima de lo que su puesto en el ranking oficial indicaba. El torneo lleva dos semanas y esas cinco selecciones están haciendo exactamente lo que el modelo anticipó. No es casualidad. Nunca lo es.",
      },
      {
        heading: "Japón es el equipo más difícil de enfrentar de este Mundial. Punto.",
        body: "Dos partidos, cero goles recibidos, dos victorias. Japón no depende de una estrella. No necesita que alguien aparezca y resuelva. Tienen un sistema. Cada jugador sabe exactamente qué tiene que hacer cuando el equipo pierde el balón: en menos de cuatro segundos, vuelven a estar organizados. Eso no se improvisa. Eso se ensaya durante meses. Son la selección con más recuperaciones de balón en campo rival del torneo, y encima son compactos en defensa. Esa combinación —presión alta más solidez baja— es la más difícil de jugar contra ella y la que más equipos quisieran tener.",
      },
      {
        heading: "Austria, Ecuador, Australia y Costa de Marfil: cuatro historias que merecen atención",
        body: "Austria está jugando con cinco defensas y ganando partidos ante selecciones con el doble de puntos FIFA. Ecuador tiene el mediocampo físico más duro del torneo según el dato de duelos ganados por partido. Australia ganó su primer partido y el dato que más me llamó la atención fue la intensidad de presión en los primeros 30 minutos: fue la más alta del torneo en esa jornada. Y Costa de Marfil, campeona de África, llegó con una confianza que el ranking no refleja pero que se nota en cada decisión que toman dentro del campo. Cinco selecciones que si hacen algo grande en este Mundial, nadie debería sorprenderse.",
      },
    ],
    faqs: [
      {
        question: "¿Estas sorpresas pueden aguantar la presión de las eliminatorias?",
        answer: "Japón y Marruecos tienen el perfil más sólido para aguantarlo: no dependen de una individualidad sino de un sistema, y los sistemas se reproducen partido a partido. Ecuador y Australia tienen el riesgo del desgaste físico en un calendario más comprimido. Austria depende de que nadie les encuentre la vuelta a la línea de cinco.",
      },
    ],
  },
  {
    slug: "analisis-goles-mundial-2026",
    title: "Cómo se está matando en este Mundial: el análisis de los goles del torneo",
    category: "Datos",
    date: "2026-06-24",
    readingMinutes: 6,
    excerpt:
      "El 58% de los goles se marcaron en el segundo tiempo. Los balones parados representan el 27% del total. Y la media distancia creció cuatro puntos respecto a Qatar 2022. Hay un fútbol nuevo tomando forma.",
    author: "Redacción DataGoal",
    trend: "Análisis",
    sections: [
      {
        heading: "El segundo tiempo manda. Siempre mandó. Pero ahora más.",
        body: "El 58% de los goles de este Mundial se marcaron en el segundo tiempo. No es un dato nuevo: ocurre en casi todos los grandes torneos. Lo que sí llama la atención es la distribución dentro de ese segundo tiempo: el 22% del total de goles apareció en los últimos diez minutos más el tiempo añadido. Es la cifra más alta de los últimos tres Mundiales. Lo que significa es que los partidos están siendo competidos hasta el final, que los equipos que van ganando no saben o no pueden cerrar los encuentros, y que hay una capacidad de reacción en la fase de grupos que en otras ediciones no era tan marcada. Ningún resultado está muerto hasta el pitido final. En serio.",
      },
      {
        heading: "La media distancia está volviendo. Y tiene un motivo.",
        body: "Los goles desde fuera del área representan el 17% del total en este Mundial, cuatro puntos más que en Qatar 2022. La hipótesis más razonable es esta: las defensas están cerrando muy bien el espacio interior. Los bloqueos de tiro cerca del área son más frecuentes, los defensas centrales son más altos y más fuertes, y los atacantes están encontrando que el camino directo hacia la portería está tapiado. Entonces buscan el disparo desde lejos. El gol de Pedri ante Croacia desde 25 metros es el ejemplo más vistoso, pero hay varios más de ese tipo que no son casualidad ni lucidez momentánea. Son el resultado lógico de defensas organizadas que obligan a buscar soluciones desde afuera.",
      },
      {
        heading: "El balón parado: el arma que los grandes subestiman y los pequeños dominan",
        body: "El 27% de los goles del torneo llegaron desde jugadas de estrategia. Córners, faltas laterales, tiros libres. Marruecos tiene el 40% de sus goles desde balón parado. Austria el 50%. Son selecciones que no tienen la capacidad técnica individual de España o Brasil, pero que han trabajado tan meticulosamente su sistema de jugadas ensayadas que se han convertido en equipos peligrosísimos en esas situaciones. Los entrenadores de las selecciones grandes saben que si subestiman ese trabajo previo, les puede costar un partido en octavos. La Copa del Mundo se gana también en los detalles que no aparecen en los titulares.",
      },
    ],
    faqs: [
      {
        question: "¿Cuántos goles se marcaron de penalti?",
        answer: "Los penaltis representan el 8% de los goles del torneo, ligeramente por debajo de la media histórica. Puede reflejar una mayor prudencia defensiva dentro del área o un criterio del VAR más conservador que en ediciones anteriores.",
      },
    ],
  },
  {
    slug: "rendimiento-anfitrionas-datos",
    title: "México, Estados Unidos y Canadá: tres anfitrionas, tres historias muy distintas",
    category: "Análisis",
    date: "2026-06-24",
    readingMinutes: 5,
    excerpt:
      "El Azteca lleno es una ventaja real, no un cliché. EEUU es vertical y apasionante pero tiene una defensa que te puede matar. Y Canadá está siendo la más sólida de las tres. Eso nadie lo esperaba.",
    author: "Redacción DataGoal",
    trend: "Análisis",
    sections: [
      {
        heading: "México y el Azteca: cuando el estadio es parte del equipo",
        body: "Hay estadios en el mundo que tienen algo que no se explica fácil. El Azteca en el Mundial es uno de ellos. México en casa genera un 23% más de ocasiones que fuera. No es porque sean mejores jugadores con su gente: es porque el empuje de la afición en los momentos de dificultad tiene un efecto real sobre la toma de decisiones del equipo. Hay un dato que lo ilustra mejor que cualquier otro: en el minuto 67 del segundo partido de El Tri, con el marcador igualado y el equipo sintiendo la presión, el estadio subió el volumen y México respondió con una presión que forzó el error del rival. La posesión en los 20 minutos siguientes fue del 64%. Eso no es casualidad. El Azteca empuja. Los datos lo confirman.",
      },
      {
        heading: "Estados Unidos: lo más divertido de ver y lo más preocupante de defender",
        body: "El equipo de Pochettino es el más joven de las tres anfitrionas y propone el fútbol más vertical del torneo entre los locales. Pulisic y Reyna son los extremos con más desmarques exitosos del torneo entre los equipos anfitriones. Pero hay una contradicción que los datos señalan: la misma agresividad que los hace peligrosos arriba los deja expuestos atrás. En dos partidos recibieron 5 situaciones claras de gol, más del doble que México. Una selección de alto nivel, con más pausa y más precisión en la transición, les va a cobrar ese precio. El talento ofensivo de EEUU es real. La madurez defensiva todavía no.",
      },
      {
        heading: "Canadá: la sorpresa de las anfitrionas y nadie está hablando de eso",
        body: "Canadá lleva dos partidos, un gol en contra, el xG concedido más bajo de su grupo. Están defendiendo bien de verdad. No por suerte ni por el nivel bajo de sus rivales: porque tienen un sistema defensivo claro y porque todos los jugadores del campo entienden que cuando pierden el balón, lo primero es volver a estar organizados. Alphonso Davies en el carril izquierdo y Jonathan David arriba son los dos argumentos ofensivos, pero lo que más me llama la atención es la disciplina colectiva. Nadie se despega, nadie rompe la línea sin que haya un motivo táctico claro. Para ser un equipo en su primera Copa del Mundo en décadas, están mostrando una madurez táctica que honestamente no esperaba ver.",
      },
    ],
    faqs: [
      {
        question: "¿Las anfitrionas tienen ventaja real en el modelo?",
        answer: "Sí. El modelo asigna un ajuste del +5% a las selecciones anfitrionas, basado en datos históricos de rendimiento en casa. Ese porcentaje sube en partidos jugados ante público propio masivo, como el Azteca para México.",
      },
    ],
  },
  {
    slug: "partidos-clave-tercera-jornada",
    title: "La última jornada: seis grupos abiertos y una sola certeza, que nada está decidido",
    category: "Clasificación",
    date: "2026-06-26",
    readingMinutes: 4,
    excerpt:
      "Seis de los doce grupos llegan a la última fecha sin clasificados definidos. En cuatro más, el segundo puesto todavía se disputa. Es la jornada más importante del torneo hasta ahora.",
    author: "Redacción DataGoal",
    trend: "Clasificación",
    sections: [
      {
        heading: "Nadie cierra lo que no controló antes",
        body: "Llegamos a la última jornada con seis grupos completamente abiertos: ninguno de los doce equipos que integran esos grupos tiene el pase asegurado. En otros cuatro, hay una plaza definida pero la segunda todavía la pelean dos o tres selecciones. Solo dos grupos tienen los dos clasificados sellados de antemano. Eso dice algo importante sobre este formato de 48 equipos: genera más incertidumbre, no menos. Hay más selecciones con opciones reales, más escenarios posibles, más partidos donde el resultado importa de verdad. Para los que seguimos el torneo partido a partido, esto es un regalo. Para los técnicos que tienen que preparar a sus equipos para jugar con la calculadora en la cabeza, es una pesadilla.",
      },
      {
        heading: "Ser primero de grupo no es un detalle: puede ser la diferencia entre avanzar en cuartos o quedar afuera en octavos",
        body: "En una fase eliminatoria de 32 equipos, el cruce que te toca puede definir tu torneo antes de jugarlo. Ser primero de grupo generalmente implica enfrentar al segundo de un grupo más asequible. Ser segundo puede significar cruzarte en octavos con Brasil, Francia o España. Por eso hay selecciones que ya tienen el pase asegurado pero que van a salir a ganar la última jornada con la misma intensidad que si les fuera la vida. Brasil puede terminar primero o segundo dependiendo del resultado, y esa diferencia cambia completamente su parte del cuadro eliminatorio. Los entrenadores lo saben. Los jugadores lo saben. El público todavía está aprendiendo a verlo.",
      },
      {
        heading: "La diferencia de goles puede meter y sacar selecciones en la misma tarde",
        body: "En cuatro de los seis grupos abiertos, tres equipos están separados por un solo punto. En ese contexto, la diferencia de goles no es un tecnicismo de desempate: es lo que decide quién sigue y quién agarra el vuelo de vuelta. Hay selecciones que necesitan ganar y que el otro partido del grupo no termine con una diferencia mayor a la que ellas puedan producir. Es el escenario más difícil de calcular de cabeza. Por eso existe la calculadora de clasificación de DataGoal: ponés los marcadores y ves en tiempo real quién clasifica y quién se queda afuera.",
      },
    ],
    faqs: [
      {
        question: "¿Dónde puedo simular los escenarios de clasificación de mi selección?",
        answer: "En la calculadora de clasificación: elegís tu grupo, ajustás los resultados de los dos partidos simultáneos y la tabla se recalcula en tiempo real, marcando qué selecciones avanzan a octavos.",
      },
    ],
  },
  {
    slug: "tendencias-tacticas-mundial-2026",
    title: "Cómo se está jugando este Mundial: las tendencias tácticas que están marcando el torneo",
    category: "Tendencias",
    date: "2026-06-23",
    readingMinutes: 6,
    excerpt:
      "El pressing ya no diferencia: todos presionan. La defensa de cinco está volviendo por la puerta grande. Y los mediocampistas físicos son los jugadores más valiosos del torneo. El fútbol de 2026 se parece cada vez menos al de 2018.",
    author: "Redacción DataGoal",
    trend: "Tendencias",
    sections: [
      {
        heading: "Todos presionan. Y cuando todos presionan, dejar de presionar es la ventaja.",
        body: "En Qatar 2022, el pressing alto era la herramienta de los equipos más modernos. En el Mundial 2026, más del 60% de las selecciones lo utilizan como plan base. El problema es obvio: cuando todos hacen lo mismo, hacerlo bien ya no alcanza. Lo que diferencia a España y Japón del resto no es que presionen, sino que lo hacen con una organización que les permite también replegarse cuando el rival escapa al primer press sin dejar espacios. Los equipos que presionan mal —corriendo detrás del balón sin estructura— son los que más goles están recibiendo en transición. El pressing sin orden no es pressing. Es cansancio.",
      },
      {
        heading: "La defensa de cinco está de vuelta. Y está ganando partidos.",
        body: "Cuando Austria salió con cinco defensas en su primer partido, la reacción fue de curiosidad mezclada con escepticismo. Después del segundo partido, el escepticismo desapareció. La línea de cinco, combinada con tres mediocampistas físicos que corren todo el campo y dos puntas listas para el contragolpe, es un sistema que puede hacer enormemente incómodo a cualquier equipo grande que dependa de la elaboración y el juego por dentro. Marruecos lo usa cuando necesita defender una ventaja. Ecuador lo empleó para neutralizar a un rival superior. El resultado es el mismo: un bloque difícil de romper y una amenaza real en transición.",
      },
      {
        heading: "Casemiro, Rice, Xhaka: los mediocampistas que nadie nombra en los titulares pero que ganan los partidos",
        body: "El dato de distancia recorrida por partido es contundente: los equipos con mediocentros de alto volumen de carrera dominan la segunda jugada en los últimos 20 minutos. Casemiro para Brasil, Declan Rice para Inglaterra y Granit Xhaka para Suiza son los tres mediocampistas con más kilómetros del torneo. Ya veteranos, ya conocidos, ya sin la novedad de años atrás. Pero siguen siendo determinantes porque el fútbol tiene una constante que ninguna tendencia táctica puede eliminar: los partidos los gana el equipo que gana los duelos físicos en el mediocampo cuando el partido se pone vertical y ya no hay energía para elaborar.",
      },
    ],
    faqs: [
      {
        question: "¿Hay algún equipo que esté marcando tendencia táctica en este torneo?",
        answer: "España en lo ofensivo: nadie combina posesión avanzada con presión tras pérdida de forma tan consistente. En lo defensivo, Marruecos y Japón: sistemas difíciles de romper incluso para rivales superiores en papel. Son los tres modelos tácticos que más van a influir en los análisis que se escriban sobre este Mundial.",
      },
    ],
  },
  {
    slug: "asistencias-jugadores-clave-mundial",
    title: "Los que fabrican los goles: los asistentes que están construyendo el torneo",
    category: "Datos",
    date: "2026-06-23",
    readingMinutes: 4,
    excerpt:
      "De Bruyne lleva 3 asistencias en dos partidos. Pedri y Bellingham tienen 2 cada uno. Pero más allá de los nombres, hay un patrón en este torneo que dice mucho sobre cómo se ganan los partidos.",
    author: "Redacción DataGoal",
    trend: "Datos",
    sections: [
      {
        heading: "De Bruyne y el pase que nadie más ve",
        body: "Kevin De Bruyne lleva tres asistencias en dos partidos. En un Mundial. Es una cifra absurda. Pero lo que más me llama la atención no es el número: son las dos asistencias que llegaron después de que el receptor había fallado una primera oportunidad. De Bruyne leyó que el compañero iba a tener otra chance antes de que el compañero lo supiera. Eso no es velocidad de pensamiento. Es comprensión del juego a un nivel que no se puede enseñar. Pedri y Bellingham tienen 2 asistencias cada uno y son los que más se le acercan en ese dato de 'generación de situaciones peligrosas'. Los tres comparten algo: juegan bien en espacios reducidos y no necesitan que el rival cometa un error para generar un pase de gol.",
      },
      {
        heading: "Equipos que dependen de uno para crear: la mayor vulnerabilidad táctica del torneo",
        body: "El modelo DataGoal llama 'concentración de generación' a cuando el 70% o más de las asistencias y los pases de peligro de un equipo pasan por un solo jugador. España tiene a Pedri como eje, pero también tiene a Lamine Yamal y a Fabián Ruiz como opciones alternativas de creación. Bélgica depende mucho más de De Bruyne: cuando él no está o está frenado, el equipo pierde fluidez visible. Identificar ese jugador en el rival es el primer paso de cualquier preparación táctica. Frenarlo es el segundo paso. Y el segundo paso es bastante más difícil.",
      },
      {
        heading: "El dato que nadie está mirando: las asistencias desde balón parado",
        body: "El 31% de las asistencias del torneo provienen de jugadas de estrategia. Saques de esquina, faltas laterales, tiros libres. El ejecutor de esos balones parados es uno de los jugadores más valiosos de cualquier selección y también uno de los más ignorados cuando se habla de los grandes protagonistas. Trent Alexander-Arnold participó directa o indirectamente en 4 de los últimos 6 goles de Inglaterra desde estrategia. Eso es un activo enorme que la mayoría de los análisis de Alexander-Arnold omiten porque cuando se habla de él, se habla de si juega de lateral o de mediocampista. La pregunta correcta es otra: ¿cuántos goles genera el equipo cuando él ejecuta el balón parado? La respuesta importa más que la posición.",
      },
    ],
    faqs: [
      {
        question: "¿Quién lidera la tabla de asistencias?",
        answer: "Kevin De Bruyne lidera con 3 asistencias en dos partidos. Le siguen Pedri y Bellingham con 2 cada uno. En caso de empate al final del torneo, el desempate es por minutos jugados, lo que favorece a los titulares indiscutibles.",
      },
    ],
  },
  {
    slug: "cinco-selecciones-sorprenden-datos",
    title: "Cinco selecciones que el modelo vio venir mucho antes que el ranking FIFA",
    category: "Tendencias",
    date: "2026-06-14",
    readingMinutes: 5,
    excerpt:
      "Ecuador, Australia, Austria, Costa de Marfil y Japón. El modelo DataGoal los tenía como subvalorados antes de que arrancara el torneo. Ahora que se están jugando los partidos, tenía razón.",
    author: "Redacción DataGoal",
    trend: "Sorpresa",
    sections: [
      {
        heading: "El ranking FIFA tarda. El modelo no espera.",
        body: "El ranking FIFA recompensa cuatro años de resultados acumulados. Eso tiene sentido como medida de historial, pero como medida de nivel actual tiene un problema grave: no ve los cambios. No ve al equipo que lleva seis meses con un técnico nuevo y un sistema nuevo que ya está funcionando. No ve a la generación de jugadores que acaba de ganar la AFCON y llega al Mundial con una confianza que ningún número oficial refleja todavía. El modelo DataGoal combina forma reciente, goles esperados y cohesión táctica. Con esas variables, antes de que arrancara el torneo, ya había cinco selecciones que aparecían significativamente por encima de su puesto oficial. Las fui a buscar. Las marqué. Ahora están haciendo exactamente lo que el modelo anticipó.",
      },
      {
        heading: "Ecuador y Australia: los que más suben y los que más me convencen",
        body: "Australia arrancó el torneo con una victoria en el Grupo D que no fue suerte. En la primera media hora, su intensidad de presión fue la más alta registrada en esa jornada. No es un equipo que busque el empate: busca dominar desde el físico y la organización. Ecuador, por su parte, tiene el mediocampo físico más duro del torneo según el dato de duelos ganados por partido. Lleva dos partidos sin encajar. Eso no lo hace un campeón, pero sí lo hace un equipo muy difícil de enfrentar para cualquier selección que necesite elaborar para crear peligro. Que su ranking FIFA diga otra cosa es exactamente el tipo de información que el modelo DataGoal existe para corregir.",
      },
      {
        heading: "Austria, Costa de Marfil y Japón: tres argumentos más para no fiarse solo del ranking",
        body: "Austria ganó partidos con línea de cinco ante selecciones con más nombre y más historia. Costa de Marfil llegó como campeona de África con la confianza de quien sabe que puede competir con cualquiera. Y Japón —que merece párrafo aparte en prácticamente todos los análisis de este torneo— está siendo el modelo defensivo de la competición: sin estrellas globales, sin un nombre que acapare los titulares, pero con un sistema que se reproduce exactamente igual en cada partido. Si alguno de estos cinco equipos llega lejos, nadie debería sorprenderse. Los datos ya lo veían venir.",
      },
    ],
    faqs: [
      {
        question: "¿Cómo determina el modelo qué selección está subvalorada?",
        answer: "Compara el ranking interno de DataGoal con el ranking FIFA oficial. Cuando el ranking interno es significativamente más alto que el oficial, la selección aparece como 'subvalorada estadísticamente'. No predice resultados: detecta equipos cuyo nivel real puede estar mejor que lo que el ranking sugiere.",
      },
      {
        question: "¿Esto es un consejo de apuestas?",
        answer: "No. Es análisis estadístico informativo. No constituye consejo de apuestas ni garantía de ningún resultado. El fútbol tiene un componente de azar que ningún modelo elimina.",
      },
    ],
  },
  {
    slug: "que-necesita-mexico-clasificar",
    title: "México tiene la clasificación en la mano. La pregunta es si la va a agarrar.",
    category: "Clasificación",
    date: "2026-06-14",
    readingMinutes: 4,
    excerpt:
      "El Tri llega a la última jornada con el 78% de probabilidades de avanzar y jugando como local en el Azteca. Todo está dado para pasar. La historia de México en Mundiales dice que a veces eso no alcanza.",
    author: "Redacción DataGoal",
    trend: "Clasificación",
    sections: [
      {
        heading: "78% de probabilidades. No es garantía. Es una oportunidad.",
        body: "El modelo le da a México un 78% de probabilidades de clasificar a octavos. Para un aficionado mexicano, ese número debería tranquilizar. Para quien conoce la historia de El Tri en Mundiales, ese número tiene matices. Mexico ha vivido situaciones similares y las ha resuelto bien. También ha vivido noches en las que el marcador y los nervios se combinaron de una manera que nadie quería. El 78% es una probabilidad, no una garantía. Lo que convierte ese 78% en algo más cercano a la certeza es lo que El Tri haga en el campo en la última jornada. Y ese campo es el Azteca, con su afición, con su presión y con todo lo que eso significa.",
      },
      {
        heading: "Los tres escenarios y qué implica cada uno",
        body: "Si México gana, clasifica prácticamente en todos los escenarios posibles, salvo diferencias de goles catastróficas que el modelo considera improbables. Si México empata, la clasificación depende de lo que haga el tercer equipo del grupo en el otro partido: habría que mirar el otro marcador en tiempo real y esperar. Si México pierde, necesita que el cuarto del grupo no supere su diferencia de goles, que en algunos escenarios es posible pero que implica depender de lo que hagan otros. El mensaje es el mismo que en todos los Mundiales de El Tri: ganar en la última jornada cierra el debate. Todo lo demás abre una puerta que no conviene dejar abierta.",
      },
      {
        heading: "El dato que da confianza y el dato que genera duda",
        body: "La buena noticia: en el Azteca, México tiene una media de 2.3 goles anotados en sus últimos 8 partidos como local. La afición empuja, el equipo responde. La duda que señala el modelo: entre los minutos 70 y 85, hay una tendencia a bajar la concentración defensiva que ya les costó en partidos anteriores. Si México llega ganando a esa franja horaria y no sabe gestionarla, puede complicarse un partido que estaba ganado. Eso no significa que vaya a pasar: significa que hay que estar atentos. Que nadie se relaje antes del pitido final.",
      },
    ],
    faqs: [
      {
        question: "¿Le vale el empate a México?",
        answer: "Depende del resultado paralelo. En algunos escenarios sí; en otros necesitaría mayor diferencia de goles. La calculadora de clasificación te permite simular exactamente qué pasa con cada combinación de marcadores.",
      },
      {
        question: "¿Qué probabilidad tiene México de pasar de fase de grupos?",
        answer: "El modelo le asigna un 78% con el balance actual. Una victoria en la última jornada elevaría ese porcentaje por encima del 95%.",
      },
    ],
  },
  {
    slug: "que-necesita-argentina-clasificar",
    title: "Argentina tiene el pase casi asegurado. El problema empieza después.",
    category: "Clasificación",
    date: "2026-06-13",
    readingMinutes: 4,
    excerpt:
      "El modelo le da un 90% de probabilidades de clasificar. Pero el Grupo J con Austria no es tan sencillo como parece, y hay una pregunta más importante que el pase de ronda: ¿en qué forma llega Argentina a las eliminatorias?",
    author: "Redacción DataGoal",
    trend: "Clasificación",
    sections: [
      {
        heading: "El 90% tranquiliza. El 10% restante tiene forma de Austria.",
        body: "Argentina lidera el Grupo J con un 90% de probabilidades de clasificar. Eso la pone entre los diez equipos con mayor certeza de avanzar en todo el torneo. Pero ese 10% restante tiene un nombre concreto: Austria. No porque Austria sea una selección histórica o tenga al mejor plantel del torneo. Sino porque Austria es exactamente el tipo de equipo que puede hacerle daño a Argentina en una noche concreta: bloque compacto, línea de cinco bien trabajada, contragolpes directos y ningún complejo ante rivales con más historia. Subestimar a Austria sería un error. La historia del fútbol está llena de selecciones históricas que se complicaron contra rivales que 'en el papel' no tenían que complicarlos.",
      },
      {
        heading: "Clasificar es el mínimo. El objetivo real es el primer puesto.",
        body: "La Albiceleste depende de sí misma en todos los escenarios relevantes: no perder en la última jornada la clasifica con el primer puesto en la gran mayoría de las combinaciones posibles. El modelo asigna menos del 4% de probabilidad al escenario en que Argentina queda segunda de grupo. Pero ese segundo puesto importa: cambia el cruce de octavos y puede significar encontrarse antes de tiempo con un rival de mayor nivel. Scaloni lo sabe. La selección lo sabe. El objetivo de la última jornada no es solo pasar: es pasar primera.",
      },
      {
        heading: "El dato que el modelo marca y que nadie está hablando",
        body: "Argentina tiene los mejores números de efectividad del torneo: la mejor relación entre ocasiones generadas y goles marcados. Y tiene la mejor fortaleza defensiva en partidos de alta presión. Son las dos variables que más pesan en el modelo para estimar probabilidades en las eliminatorias. La única penalización que aparece en el análisis es la edad media de los jugadores titulares: varios referentes tienen más de 30 años, y siete partidos en cuatro semanas con el nivel de exigencia que plantean los cruces directos es mucho desgaste físico. Clasificar no es el problema. Llegar entero a las semanas finales sí puede serlo.",
      },
    ],
    faqs: [
      {
        question: "¿Puede quedar primera de grupo Argentina?",
        answer: "Sí, y es el objetivo prioritario. En la mayoría de escenarios, no perder en la última jornada le asegura el primer puesto del Grupo J. Simulá los resultados en la calculadora de clasificación.",
      },
      {
        question: "¿Es Argentina favorita al título?",
        answer: "El modelo la sitúa entre las dos máximas candidatas junto a España. Su probabilidad de campeona ronda el 18%, la más alta del torneo.",
      },
    ],
  },
  {
    slug: "que-necesita-espana-clasificar",
    title: "España lidera el modelo y lidera el torneo. ¿Cuánto puede durar eso?",
    category: "Clasificación",
    date: "2026-06-13",
    readingMinutes: 4,
    excerpt:
      "La Roja tiene el 91% de probabilidades de clasificar y encabeza el ranking interno de DataGoal. Pero hay una duda que el modelo señala y que puede ser decisiva cuando lleguen los partidos que realmente importan.",
    author: "Redacción DataGoal",
    trend: "Líder",
    sections: [
      {
        heading: "España primera del modelo: no es arbitrario, son los números",
        body: "El ranking FIFA tiene a España entre los cuatro mejores del mundo. El modelo DataGoal la coloca directamente primera. La diferencia no es capricho: es que el modelo pondera la forma reciente, el juego generado en los últimos seis partidos y la cohesión táctica medida por acciones colectivas, y en esas tres variables España es la mejor del torneo. Mayor posesión en campo rival. Mayor número de recuperaciones de balón en posiciones avanzadas. Menor xG concedido por partido. El 91% de probabilidad de clasificar es el reflejo numérico de que este equipo, tal como está jugando ahora mismo, es el más completo de todos los que están en el torneo.",
      },
      {
        heading: "La clasificación no tiene drama. El primer puesto sí importa.",
        body: "Con el rendimiento que proyecta el modelo, España tiene la clasificación prácticamente resuelta antes de llegar a la tercera jornada. El escenario complicado —una derrota con pérdida de diferencia de goles significativa— aparece en menos del 3% de los escenarios posibles. Pero hay un matiz que no es menor: ser primero o segundo de grupo puede definir el cruce de octavos. España primero evita al segundo de un grupo difícil. España segunda puede toparse antes de tiempo con un rival al que hubiera preferido ver más tarde. Por eso La Roja no debería conformarse con pasar: debería apuntar al primer puesto con la misma intensidad que si no tuviera nada asegurado.",
      },
      {
        heading: "La única duda real: el nueve",
        body: "España tiene todo. Tiene posesión, tiene presión organizada, tiene amplitud con los laterales, tiene creatividad en el mediocampo y tiene a Lamine Yamal siendo Lamine Yamal. La única variable donde el modelo señala una debilidad potencial es en el delantero centro. Morata es el titular y cumple bien cuando los extremos y los mediocampistas le acercan el balón en buenas condiciones. Pero en los partidos donde el rival cierra bien los espacios interiores y los laterales no llegan con facilidad, España tiene dificultades para romper el bloque desde dentro. En octavos, en cuartos, en semifinales, el rival va a intentar exactamente eso. Cómo resuelve España ese problema puede ser lo que decida si llega hasta el final o no.",
      },
    ],
    faqs: [
      {
        question: "¿Por qué España es la número 1 del modelo y no la 1 de la FIFA?",
        answer: "El modelo pondera forma reciente, xG generado y recibido, y cohesión táctica. El ranking FIFA premia el historial acumulado de cuatro años. En el rendimiento actual del torneo, España es la número uno sin discusión.",
      },
      {
        question: "¿Está clasificada España?",
        answer: "Con el rendimiento actual tiene el pase muy encaminado. Cualquier punto en la segunda jornada prácticamente lo sella. Simulá los escenarios en la calculadora.",
      },
    ],
  },
  {
    slug: "calculadora-clasificacion-grupos",
    title: "Calculadora de clasificación: simulá quién pasa de grupo en tiempo real",
    category: "Herramienta",
    date: "2026-06-14",
    readingMinutes: 2,
    excerpt:
      "Cambiás los marcadores, la tabla se actualiza al instante. La herramienta más directa para resolver la pregunta que todos se hacen en la última jornada: ¿qué necesita mi selección para pasar?",
    author: "Redacción DataGoal",
    trend: "Herramienta",
    href: "/calculadora",
    sections: [
      {
        heading: "Para no depender de nadie que te lo explique en redes",
        body: "La última jornada de la fase de grupos tiene un problema: hay dos partidos simultáneos por grupo y los escenarios cambian en tiempo real. Si tu selección necesita ganar y que el otro partido termine en empate, querés saberlo antes de que termine, no después. La calculadora de clasificación de DataGoal resuelve exactamente eso: elegís el grupo, ajustás los marcadores de los dos partidos y la tabla se recalcula al instante. Sin fórmulas de desempate que recordar, sin depender de que alguien te lo explique mientras el partido todavía se está jugando.",
      },
    ],
    faqs: [
      {
        question: "¿La calculadora usa datos reales?",
        answer: "Utiliza el calendario oficial y los resultados del snapshot local del torneo. La lógica de clasificación respeta los criterios FIFA: puntos, diferencia de goles, goles a favor y, en último caso, fair play.",
      },
    ],
  },
  {
    slug: "camino-mas-dificil-mundial-2026",
    title: "El grupo de la muerte existe. Y no está donde muchos creían.",
    category: "Análisis",
    date: "2026-06-12",
    readingMinutes: 6,
    excerpt:
      "El Grupo C reúne a Brasil, Marruecos, Escocia y Haití con la mayor dificultad media del torneo. Pero hay favoritos al título que también tienen exámenes complicados. El sorteo ya repartió ventajas y desventajas antes de que se jugara un solo partido.",
    author: "Redacción DataGoal",
    trend: "Análisis",
    sections: [
      {
        heading: "La dificultad del grupo no es un dato menor: puede ser la diferencia entre llegar a semis o quedar afuera en octavos",
        body: "Para cada selección, el modelo calcula la fuerza media de sus tres rivales de grupo. Cuanto más alta es esa media, más exigente es el examen inicial. Y la diferencia no es pequeña: para equipos de nivel similar, compartir grupo con rivales del top 15 mundial en lugar de rivales del top 40 puede significar hasta 25 puntos porcentuales menos de probabilidad de clasificar. El sorteo no es neutral. Nunca lo fue. Y el que dice que 'si sos bueno pasás siempre' no está mirando los números.",
      },
      {
        heading: "Grupo C: el más difícil del torneo y eso lo complica hasta a Brasil",
        body: "El Grupo C concentra más fuerza media que ningún otro. Brasil llega como favorita histórica al título, pero su probabilidad de clasificar en el modelo es del 81%: para el nivel que tiene, eso es un número moderado que refleja lo duro que es el grupo. Marruecos es la defensa más sólida de las selecciones no cabeza de serie. Escocia llega a su primer Mundial desde 1998 con un bloque físico que puede incomodar a cualquiera. Y Haití, el que parece el rival más asequible, llegó con la motivación y el apoyo de todo un país detrás. Brasil debería pasar. Pero en el Grupo C, cualquier jornada puede terminar con una sorpresa.",
      },
      {
        heading: "Argentina en el Grupo J, Francia en el Grupo I: los grandes que no tienen un camino fácil",
        body: "Argentina comparte el Grupo J con Austria, que como ya dijimos es uno de los equipos más incómodos del torneo pese a su ranking. Francia tiene en el Grupo I a Senegal con Sadio Mané como argumento ofensivo, y a Noruega con Haaland, que está siendo el goleador del torneo. Que Argentina y Francia tengan probabilidades de fase de grupos ligeramente inferiores a las de España no habla de debilidad: habla de que sus grupos son genuinamente más difíciles. El modelo es honesto con eso. El sorteo decidió que las dos grandes favoritas al título junto a España tuvieran el examen más exigente desde el primer día.",
      },
      {
        heading: "Los que tienen el camino más libre: donde pueden aparecer las sorpresas del torneo",
        body: "En el otro extremo están selecciones que, sin ser favoritas al título, cayeron en grupos donde el rival más peligroso está en el puesto 30 del ranking mundial. Eso les da la oportunidad de llegar a octavos frescos, con confianza y sin haber expuesto sus debilidades ante rivales de primer nivel. El modelo identifica varios de esos casos, y en todos la probabilidad de llegar a cuartos es notablemente más alta de lo que su ranking FIFA sugeriría en abstracto. Parte de lo que hace interesante un Mundial es que el cuadro eliminatorio puede sorprender de maneras que el papel no anticipaba. El sorteo ya plantó las semillas de esas sorpresas.",
      },
    ],
    faqs: [
      {
        question: "¿Cómo se calcula la dificultad del grupo?",
        answer: "Promediando la fuerza de los tres rivales de cada selección según el ranking interno de DataGoal. Es una de las cinco variables del modelo y tiene un peso del 15% en la estimación final de probabilidades.",
      },
      {
        question: "¿Dónde puedo ver la dificultad de cada grupo?",
        answer: "En la sección de Predicciones mostramos el desglose completo de variables para cada selección, incluyendo el índice de dificultad del grupo.",
      },
    ],
  },
  {
    slug: "introduccion-analisis-estadistico-futbol",
    title: "Para entender el fútbol más allá del marcador: las métricas que usa DataGoal",
    category: "Análisis",
    date: "2026-06-10",
    readingMinutes: 6,
    excerpt:
      "El xG, la presión tras pérdida y la posesión en campo rival no son inventos de analistas sin fútbol. Son herramientas que los mejores entrenadores del mundo usan antes de cada partido. Y entenderlas cambia cómo ves el juego.",
    author: "Redacción DataGoal",
    trend: "Análisis",
    sections: [
      {
        heading: "El marcador puede mentir. Los mejores entrenadores del mundo lo saben.",
        body: "Hay entrenadores de primer nivel que, antes de mirar el resultado del último partido, revisan más de 40 variables estadísticas. No porque los goles no importen. Sino porque el marcador puede mentir, y ellos necesitan saber si ganaron bien o si ganaron con suerte. Un equipo que gana 1-0 con un xG de 0.3 a favor y 2.1 en contra ganó el partido pero perdió el análisis del juego real. Si eso ocurre tres veces seguidas, el modelo está gritando que algo no funciona aunque los puntos sigan llegando. Entender las métricas detrás del marcador no te hace más analista: te hace mejor espectador. Y eso es lo que buscamos en DataGoal.",
      },
      {
        heading: "El xG: la métrica que cambió cómo se entiende el fútbol profesional",
        body: "El xG —goles esperados— asigna un valor entre 0 y 1 a cada remate según su posición en el campo, el tipo de pase previo, el ángulo hacia portería y la presión del defensor más cercano. Un remate desde el punto de penalti sin oposición tiene un xG cercano a 0.76. Un disparo desde 30 metros con un defensor encima puede tener un xG de 0.03. La diferencia entre el xG acumulado de un partido y los goles reales marcados te dice si el resultado refleja lo que pasó de verdad. Un equipo que gana 2-0 con un xG de 0.8 tuvo suerte. Un equipo que pierde 0-1 con un xG de 2.5 jugó mucho mejor de lo que el marcador cuenta. Eso no cambia el resultado. Pero cambia la lectura del partido.",
      },
      {
        heading: "Posesión sí, pero dónde y con qué propósito",
        body: "Durante años, la posesión fue el número de moda: más tiempo con el balón significaba mejor equipo. Esa lectura sola es demasiado simple. Una posesión del 65% en campo propio, circulando de lateral a lateral sin progresar, vale menos que una posesión del 52% concentrada en campo rival con constantes llegadas al área. Por eso el modelo de DataGoal separa las dos cosas: cuánto tiene el balón el equipo y dónde lo tiene. Y encima mide la presión tras pérdida: cuánto tarda el equipo en recuperar el balón después de perderlo y a qué altura del campo lo hace. Esas tres variables juntas —posesión, ubicación y recuperación— cuentan la historia del juego mucho mejor que el número solo.",
      },
      {
        heading: "El contexto del rival: por qué un 0.8 xG concedido no siempre dice lo mismo",
        body: "Un 0.8 xG concedido ante Brasil no es lo mismo que un 0.8 xG concedido ante el último del ranking. Si no ajustás por la calidad del rival, estás comparando cosas que no son comparables. En DataGoal cada estadística se contextualiza: el xG generado se ajusta por la fortaleza defensiva del rival enfrentado, y el xG concedido se ajusta por la calidad ofensiva de ese mismo rival. Eso permite comparar selecciones que han jugado contra rivales muy distintos en la fase de grupos y tener una imagen real de cuál es más sólida.",
      },
      {
        heading: "Lo que los números no pueden hacer: ser honestos con los límites",
        body: "Ninguna métrica anticipa la lesión de un jugador clave en el calentamiento. Ningún modelo predice el gol en propia puerta que cambia la psicología de un partido, ni la motivación extra de una selección que juega ante su propia afición. Por eso en DataGoal insistimos en que las probabilidades son estimaciones, no predicciones. Usar los datos bien significa generar contexto, enriquecer la conversación y entender mejor lo que está pasando en el campo. No significa reemplazar la emoción del fútbol. Significa añadir una capa más a algo que ya de por sí es extraordinario.",
      },
    ],
    faqs: [
      {
        question: "¿Qué métrica es la más fiable para predecir resultados?",
        answer: "Ninguna por sí sola. La combinación de xG generado y concedido, posesión en campo rival y presión tras pérdida es la que mejor correlaciona con el rendimiento a medio plazo. Para un partido individual, el azar sigue siendo un factor determinante que ningún modelo elimina.",
      },
      {
        question: "¿El xG predice quién va a ganar un partido?",
        answer: "Correlaciona bien con resultados cuando se analizan muchos partidos juntos, pero en un único encuentro el margen de varianza es enorme. Un equipo con 2.0 xG puede perfectamente perder 1-0. Por eso siempre hablamos de tendencias y probabilidades, nunca de certezas.",
      },
    ],
  },
  {
    slug: "ranking-selecciones-rendimiento",
    title: "El ranking interno de DataGoal: por qué España aparece primera y qué significa eso",
    category: "Datos",
    date: "2026-06-12",
    readingMinutes: 4,
    excerpt:
      "No es el ranking FIFA. Es un ranking de rendimiento actual, construido con cinco variables que el oficial no pondera igual. España lidera. Aquí explicamos por qué y qué implica.",
    author: "Redacción DataGoal",
    trend: "Datos",
    sections: [
      {
        heading: "El ranking FIFA es bueno. Para lo que está diseñado.",
        body: "El ranking FIFA lleva décadas siendo el referente oficial del fútbol internacional y tiene sentido dentro de su lógica: premia cuatro años de resultados y premia ganar torneos importantes. Pero tiene un límite estructural que en contexto de un Mundial se vuelve relevante: tarda en reflejar los cambios de nivel reales. Un equipo que lleva dos años construyendo algo nuevo con un técnico que ya domina el sistema puede estar varios puestos por debajo de su nivel actual porque los puntos FIFA de victorias de hace tres años todavía pesan. El ranking interno de DataGoal no compite con el oficial: lo complementa desde un ángulo distinto, enfocado en el momento presente del torneo.",
      },
      {
        heading: "Las cinco variables y lo que aporta cada una",
        body: "El modelo combina forma reciente (30%), ranking relativo ajustado (20%), xG generado y recibido en el torneo (20%), fortaleza defensiva medida por xG concedido (15%) y dificultad del grupo enfrentado (15%). La forma reciente pesa más porque en un torneo, quién sos hoy importa más que quién fuiste hace dos años. El xG ajusta los resultados por la calidad de las ocasiones, no solo por los goles. La fortaleza defensiva captura algo que el marcador puede ocultar cuando el portero tiene una noche extraordinaria. Y la dificultad del grupo contextualiza todo: no es lo mismo tener buenos números contra rivales del top 10 que contra selecciones de ranking bajo.",
      },
      {
        heading: "Cómo leer el ranking sin que te genere expectativas equivocadas",
        body: "España primera en el ranking no garantiza que España gane el Mundial. Argentina segunda no garantiza que Argentina llegue a la final. El ranking es una foto del nivel estimado de cada selección en este momento del torneo: dice quién está rindiendo mejor ahora mismo, no quién va a ganar. Su valor está en la comparación relativa: si España está 15 puntos por encima de Portugal en el ranking interno, eso quiere decir que en condiciones neutrales España ganaría ese partido más veces que no. Pero 'más veces' puede ser el 58%. Y el otro 42% también existe, también ocurre, y el fútbol lo sabe mejor que nadie.",
      },
    ],
    faqs: [
      {
        question: "¿El ranking interno predice quién va a ganar el Mundial?",
        answer: "No. Estima la fuerza relativa de cada selección en el momento actual del torneo. La primera del ranking tiene la mayor probabilidad de campeona, pero esa probabilidad rara vez supera el 25% porque hay demasiadas selecciones capaces de ganar cualquier partido en una noche buena.",
      },
      {
        question: "¿Cada cuánto se actualiza el ranking?",
        answer: "Con datos reales conectados, el modelo se recalcula después de cada jornada. En la versión actual del sitio, se actualiza desde el snapshot local del calendario y los resultados registrados.",
      },
    ],
  },
];

// Merge editorial articles (published via /admin)
import editorialSnapshot from "@/data/editorial-articles.json";

const editorialArticles: (Article & { status?: string })[] = (editorialSnapshot as { articles: (Article & { status?: string })[] }).articles ?? [];
// Only include published editorial articles (no status = published)
const publishedEditorial = editorialArticles.filter((a) => a.status !== "draft");
const allArticles = [...publishedEditorial, ...articles] as Article[];

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
