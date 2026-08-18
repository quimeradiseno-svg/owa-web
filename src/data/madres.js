// Las cuatro páginas madre: los dos torneos puntuables, los especiales y el
// Challenge. Cada una explica su modalidad y lista sus fechas.

export const MADRES = {
  'grand-prix': {
    kicker: 'TORNEO PUNTUABLE',
    titulo: 'GRAND PRIX OWA',
    intro:
      'Maratones acuáticas de entre 8 y 18 km, en escenarios que exigen estrategia, resistencia y adaptación.',
    img: 'gp-contraluz',
    alt: 'Nadador a contraluz encarando una brazada en aguas abiertas',
    bloque1Kicker: 'QUÉ ES',
    bloque1Titulo: 'COMPETITIVO LARGA DISTANCIA',
    bloque1Texto:
      'El torneo de mayor exigencia del calendario. Cuatro fechas para definir a los campeones absolutos, los campeones de cada categoría y al equipo campeón de la temporada.',
    cajaTitulo: 'SISTEMA DE PUNTAJE',
    cajaItems: [
      'Cada etapa otorga puntos según el rendimiento de cada nadador en relación con el mejor tiempo general de su sexo.',
      'Las pruebas XL y XXL tienen distintos coeficientes de puntuación.',
      'Al cierre de la temporada se descarta automáticamente el menor puntaje obtenido por cada nadador.',
      'El campeonato por equipos suma los puntos obtenidos por todos los integrantes de cada equipo.',
    ],
    cajaCta: 'VER RANKING GRAND PRIX',
    reglamento: 'https://drive.google.com/open?id=1EIbzGs8ObKESwSOEv-dfO1Y83-TT_3We&usp=drive_fs',
    listaKicker: 'FECHAS 26/27',
  },
  circuito: {
    kicker: 'TORNEO PUNTUABLE',
    titulo: 'CIRCUITO OWA',
    intro:
      'Tu lugar para vivir las aguas abiertas. Distancias para distintos niveles, diferentes desafíos y una experiencia pensada para nadar, superarte y compartir el día con tu equipo, amigos y familia.',
    img: 'circuito-grupo',
    alt: 'Grupo de nadadores avanzando juntos en el río',
    bloque1Kicker: 'QUÉ ES',
    bloque1Titulo: 'PARA ANIMARSE, COMPARTIR Y SUPERARSE',
    bloque1Texto: [
      'El Circuito OWA está pensado para quienes quieren vivir una experiencia de aguas abiertas, tanto si están dando sus primeros pasos como si ya compiten habitualmente.',
      'Cada fecha ofrece distancias de menos de 8 km, clasificadas como S, M y L, dentro de un entorno organizado y seguro. Podés participar por un objetivo personal, buscar tu lugar en la categoría o sumar puntos junto a tu equipo.',
      'No hace falta ser un nadador de elite. Hace falta estar preparado para la distancia y tener ganas de ser parte.',
    ],
    cajaTitulo: 'SISTEMA DE PUNTAJE',
    cajaItems: [
      'Cada distancia suma puntos según el rendimiento de cada nadador.',
      'Las distancias S, M y L tienen distintos coeficientes de puntuación.',
      'Se descarta automáticamente el menor puntaje obtenido durante la temporada.',
      'Cada nadador también suma para el campeonato anual de su equipo.',
      'Los eventos especiales pueden otorgar puntos adicionales para la clasificación por equipos.',
    ],
    cajaCta: 'VER RANKING CIRCUITO',
    reglamento: 'https://drive.google.com/open?id=1V3ZYQ69vP2PzOh0dbLN5sB2HkAaZAsZ7&usp=drive_fs',
    listaKicker: 'FECHAS 26/27',
  },
  especiales: {
    kicker: 'FUERA DE LOS TORNEOS',
    titulo: 'EVENTOS ESPECIALES',
    intro:
      'Experiencias fuera de los calendarios puntuables, elegidas por la singularidad de sus escenarios y por el desafío que propone cada recorrido.',
    img: 'especiales-panoramica',
    alt: 'Vista panorámica del río con nadadores y tablas de SUP',
    bloque1Kicker: 'QUÉ SON',
    bloque1Titulo: 'ESCENARIOS ÚNICOS. DESAFÍOS DIFERENTES.',
    bloque1Texto: [
      'Mar, lago y río en locaciones seleccionadas por su espectacularidad, sus condiciones naturales o la exigencia particular de cada una. No forman parte de los rankings de Grand Prix ni Circuito: cada evento tiene identidad, recorrido y dinámica propios.',
      'Aunque no suman puntos para la temporada, cada carrera tiene su propia competencia, con ganador y ganadora absolutos, ganadores por categoría y clasificación por equipos.',
    ],
    cajaTitulo: 'CÓMO FUNCIONAN',
    cajaItems: [
      'No suman puntos a los rankings de temporada.',
      'Cada evento define sus propias distancias, cupos y requisitos.',
      'Cada carrera reconoce a sus ganadores absolutos, por categoría y por equipos.',
      'Las condiciones naturales forman parte del desafío y pueden determinar recorridos, horarios o modalidad de la prueba.',
    ],
    cajaCta: 'VER CALENDARIO COMPLETO',
    listaKicker: 'EVENTOS DISPONIBLES',
  },
  challenge: {
    kicker: 'ULTRADISTANCIA',
    titulo: 'OWA CHALLENGE',
    intro:
      'De 21 a 70 kilómetros. Cupo limitado, admisión por postulación y una organización pensada para travesías de ultradistancia.',
    img: 'challenge-lago',
    // El nadador queda a la izquierda del encuadre original; el panel enmascara
    // justo ese lado, así que se espeja para que caiga del lado visible.
    imgEspejo: true,
    // Y sobre el borde inferior de la foto — el panel es bajo (2.5:1), centrado
    // por defecto sólo mostraba montaña y cielo.
    imgPos: 'bottom',
    alt: 'Nadador en aguas abiertas con boya de seguridad, montañas nevadas de fondo',
    bloque1Kicker: 'QUÉ ES',
    bloque1Titulo: 'TRAVESÍAS DE 21K A 70K',
    bloque1Texto:
      'Los Challenge son travesías de ultradistancia para nadadores individuales o equipos de relay, con embarcación de apoyo y equipo propio. No se inscribe en una plataforma: se postula por mail y la organización evalúa antecedentes antes de confirmar el cupo.',
    cajaTitulo: 'ADMISIÓN',
    cajaItems: [
      'Postulación por mail, con antecedentes en aguas abiertas.',
      'Participación individual o por equipos de relay.',
      'Cupo limitado por edición y por desafío.',
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
  {
    titulo: 'OWA TRAVEL',
    desc: 'Viajes grupales de nado: islas, snorkel y travesías fuera del calendario local.',
    meta: '2 EXPERIENCIAS',
    cta: 'VER OWA TRAVEL',
    href: '/travel',
  },
];

export const TRAVEL_INCLUYE = [
  'Traslados y aéreos coordinados',
  'Hospedaje del grupo',
  'Acompañamiento de la organización',
  'Inscripción a la competencia gestionada',
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
