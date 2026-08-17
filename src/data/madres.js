// Las cuatro páginas madre: los dos torneos puntuables, los especiales y el
// Challenge. Cada una explica su modalidad y lista sus fechas.

export const MADRES = {
  'grand-prix': {
    kicker: 'TORNEO PUNTUABLE',
    titulo: 'GRAND PRIX OWA',
    intro:
      'El torneo de mayor exigencia del calendario. Cuatro fechas, una tabla y un campeón por categoría al cierre de la temporada.',
    img: 'gp-contraluz',
    alt: 'Nadador a contraluz encarando una brazada en aguas abiertas',
    bloque1Kicker: 'QUÉ ES',
    bloque1Titulo: 'ÉLITE Y MÁSTER COMPETITIVO',
    bloque1Texto:
      'El Grand Prix reúne a quienes compiten por tiempo y posición. Se corre el primer día de cada evento core, sobre las distancias largas del fin de semana, y cada resultado suma al ranking general y al de categoría.',
    cajaTitulo: 'SISTEMA DE PUNTAJE',
    cajaItems: [
      'Puntaje por posición dentro de cada categoría.',
      'Suman las mejores fechas de la temporada (cantidad a confirmar por OWA).',
      'Campeonato por equipos con los puntos de los nadadores de cada club.',
    ],
    cajaCta: 'VER RANKING GRAND PRIX',
    listaKicker: 'FECHAS 26/27',
  },
  circuito: {
    kicker: 'TORNEO PUNTUABLE',
    titulo: 'CIRCUITO OWA',
    intro:
      'La puerta de entrada a las aguas abiertas. Mismas sedes que el Grand Prix, al día siguiente, con distancias para empezar.',
    img: 'circuito-grupo',
    alt: 'Grupo de nadadores avanzando juntos en el río',
    bloque1Kicker: 'QUÉ ES',
    bloque1Titulo: 'ACCESIBLE, APTO PRINCIPIANTES',
    bloque1Texto:
      'El Circuito se corre el segundo día de cada evento core sobre distancias cortas, con el mismo despliegue de seguridad y cronometraje que el Grand Prix. Es el torneo pensado para la primera carrera y para quienes compiten por su categoría, no por el podio general.',
    cajaTitulo: 'SISTEMA DE PUNTAJE',
    cajaItems: [
      'Puntaje por posición dentro de cada categoría de edad.',
      'Suman las mejores fechas de la temporada (cantidad a confirmar por OWA).',
      'Campeonato por equipos propio, separado del Grand Prix.',
    ],
    cajaCta: 'VER RANKING CIRCUITO',
    listaKicker: 'FECHAS 26/27',
  },
  especiales: {
    kicker: 'FUERA DEL TORNEO',
    titulo: 'EVENTOS ESPECIALES',
    intro: 'Carreras que no forman parte del torneo regular: no suman puntos, pero son las que más se cuentan después.',
    img: 'especiales-panoramica',
    alt: 'Vista panorámica del río con nadadores y tablas de SUP',
    bloque1Kicker: 'QUÉ SON',
    bloque1Titulo: 'NO PUNTÚAN, IMPORTAN IGUAL',
    bloque1Texto:
      'Mar, lago y río en escenarios que se corren una vez al año. Quedan fuera de los rankings de Grand Prix y Circuito, con inscripción y logística propias de cada sede.',
    cajaTitulo: 'CÓMO FUNCIONAN',
    cajaItems: [
      'No suman puntos a los rankings de temporada.',
      'Cada evento tiene sus distancias, cupos y requisitos.',
      'Algunas fechas dependen de las condiciones del agua.',
    ],
    cajaCta: 'VER CALENDARIO COMPLETO',
    listaKicker: 'EVENTOS DISPONIBLES',
  },
  challenge: {
    kicker: 'ULTRADISTANCIA',
    titulo: 'OWA CHALLENGE',
    intro: 'De 21 a 70 kilómetros. Cupo limitado, admisión por postulación y una organización pensada para cruces largos.',
    img: 'challenge-lago',
    // El nadador queda a la izquierda del encuadre original; el panel enmascara
    // justo ese lado, así que se espeja para que caiga del lado visible.
    imgEspejo: true,
    // Y sobre el borde inferior de la foto — el panel es bajo (2.5:1), centrado
    // por defecto sólo mostraba montaña y cielo.
    imgPos: 'bottom',
    alt: 'Nadador en aguas abiertas con boya de seguridad, montañas nevadas de fondo',
    bloque1Kicker: 'QUÉ ES',
    bloque1Titulo: 'CRUCES DE 21K A 70K',
    bloque1Texto:
      'Los Challenge son travesías de ultradistancia con embarcación de apoyo y equipo propio por nadador. No se inscribe en una plataforma: se postula por mail y la organización evalúa antecedentes antes de confirmar el cupo.',
    cajaTitulo: 'ADMISIÓN',
    cajaItems: [
      'Postulación por mail, con antecedentes en aguas abiertas.',
      'Cupo limitado por edición y por desafío.',
      'La sigla es el nombre del desafío y va siempre con el recorrido.',
    ],
    cajaCta: 'ESCRIBIR A LA ORGANIZACIÓN',
    listaKicker: 'DESAFÍOS DISPONIBLES',
  },
};

export const MODALIDADES = [
  {
    titulo: 'GRAND PRIX',
    desc: 'Élite y máster competitivo. Cuatro fechas puntuables por el título de la temporada.',
    meta: '4 FECHAS · PUNTUABLE',
    cta: 'VER GRAND PRIX',
    href: '/grand-prix',
  },
  {
    titulo: 'CIRCUITO OWA',
    desc: 'Accesible y apto principiantes. Mismas sedes, distancias para empezar.',
    meta: '4 FECHAS · PUNTUABLE',
    cta: 'VER CIRCUITO',
    href: '/circuito',
  },
  {
    titulo: 'EVENTOS ESPECIALES',
    desc: 'Mar, lago y río fuera del torneo regular. No suman puntos al ranking.',
    meta: '4 EVENTOS',
    cta: 'VER EVENTOS',
    href: '/especiales',
  },
  {
    titulo: 'OWA CHALLENGE',
    desc: 'Ultradistancia de 21K a 70K, con admisión por postulación.',
    meta: '3 DESAFÍOS',
    cta: 'VER CHALLENGE',
    href: '/challenge',
  },
];

export const TRAVEL_INCLUYE = [
  'Traslados y aéreos coordinados',
  'Hospedaje del grupo',
  'Acompañamiento de la organización',
  'Inscripción a la competencia gestionada',
];

export const PAD_BLOQUES = [
  {
    k: 'QUÉ ES',
    t: 'Formación en aguas abiertas',
    d: 'Un programa de OWA para llevar nadadores de pileta al río, el lago y el mar con preparación real.',
  },
  {
    k: 'A QUIÉN',
    t: 'Debutantes y clubes',
    d: 'Nadadores que quieren su primera carrera y clubes o escuelas que buscan sumar aguas abiertas a su calendario.',
  },
  {
    k: 'CÓMO FUNCIONA',
    t: 'Prácticas y primera carrera',
    d: 'Prácticas en aguas abiertas, seguridad, técnica de largada y una primera competencia acompañada.',
  },
];

// Contenido fijo de la ficha de evento, común a todas las carreras.
export const EVENTO_FICHA = {
  requisitos: [
    'Antecedentes verificables en aguas abiertas.',
    'Apto médico específico para ultradistancia.',
    'Equipo de apoyo propio (kayak o embarcación).',
    'Confirmación de cupo por parte de la organización.',
  ],
  kit: [
    { t: 'Gorra oficial', d: 'Incluida' },
    { t: 'Chip de cronometraje', d: 'Incluido' },
    { t: 'Numeración', d: 'Incluida' },
    { t: 'Medalla finisher', d: 'Incluida' },
    { t: 'Remera del evento', d: 'A confirmar' },
  ],
  cronograma: [
    { hora: '07:00', titulo: 'Acreditación', detalle: 'Presentación de DNI y apto médico.' },
    { hora: '07:30', titulo: 'Entrega de kit', detalle: 'Gorra, chip y numeración.' },
    { hora: '08:30', titulo: 'Charla técnica', detalle: 'Obligatoria para todas las distancias.' },
    { hora: '09:00', titulo: 'Largada', detalle: 'Por tandas según distancia.', destacado: true },
    { hora: '12:30', titulo: 'Premiación', detalle: 'General y por categoría.' },
  ],
  logistica: [
    { t: 'Cómo llegar', d: 'Accesos, transporte y punto exacto de largada.', cta: 'ABRIR MAPA' },
    { t: 'Acreditación', d: 'Horarios y documentación obligatoria.', cta: 'VER DETALLE' },
    { t: 'Recomendaciones', d: 'Temperatura del agua, neoprene y qué llevar el día de carrera.', cta: 'VER GUÍA' },
    { t: 'Seguridad', d: 'Kayaks, lanchas y guardavidas por tramo.', cta: 'VER PROTOCOLO' },
  ],
  turismo:
    'Alojamiento, gastronomía y qué hacer el fin de semana de la carrera. Convenios y promociones para nadadores inscriptos, a confirmar con la sede.',
  promos: ['Hoteles con convenio · a confirmar', 'Descuentos gastronómicos · a confirmar', 'Actividades para acompañantes'],
};
