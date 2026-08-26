// OWA Travel — viajes grupales de nado. Los datos de Búzios salen de la
// propuesta "Buzios Propuesta Octubre 2026" pasada por OWA. Copys de esta
// página y de Race Travel, pasados por OWA por mail.

export const TRAVEL = [
  {
    slug: 'buzios-2026',
    destino: 'Búzios',
    pais: 'Brasil',
    titulo: 'Swim & Adventure',
    salidaTitulo: 'Búzios · Octubre 2026',
    fechaCorta: 'OCT 2026',
    fechaLarga: '22 al 27 de octubre de 2026',
    anio: '2026',
    estado: 'cerrada',
    chip: 'SOLD OUT',
    cta: false,
    img: 'tv-hero',
    resumen: 'Islas, playas, trilhas, snorkel y una experiencia de natación diferente cada día.',
    supervisa: 'Damián Blaum',
    itinerario: [
      { dia: '22/10', t: 'Llegada a Búzios', d: 'Check-in, tarde libre para aclimatarse y reunión de bienvenida con el equipo OWA.' },
      { dia: '23/10', t: 'João Fernández e Ilha Branca', d: 'Nado en Ilha Branca y João Fernández, snorkel sobre los corales y almuerzo en playa de Ossos.' },
      { dia: '24/10', t: 'Ilha Feia', d: 'Nado en Ilha Feia, ingreso nadando a una caverna natural y trilha hasta la cima de la isla.' },
      { dia: '25/10', t: 'Playa Ferradura', d: 'Día de playa y nado en la playa más tranquila de Búzios. A la noche, nado con luna llena.' },
      { dia: '26/10', t: 'Ilha de Âncora', d: 'Nado con tortugas. Buceo opcional, no incluido. Almuerzo en playa de Ossos.' },
      { dia: '27/10', t: 'Regreso', d: 'Desayuno y check-out.' },
    ],
    incluye: [
      'Alojamiento con desayuno',
      '4 almuerzos (días 1, 2, 3 y 4)',
      'Excursiones en barco (3 días)',
      'Supervisión profesional de Damián Blaum y el equipo OWA',
      'Boya de seguridad OWA e indumentaria oficial',
      'Snorkel y caminatas en islas (trilhas)',
    ],
    noIncluye: [
      'Pasajes aéreos ni traslados al hotel',
      'Buceo (actividad opcional)',
      'Seguro de asistencia al viajero (obligatorio; recomendamos que cubra deportes acuáticos)',
    ],
    llevar: [
      'Traje de baño, antiparras, toalla',
      'Lycra o traje de neoprene (opcional)',
      'Zapatillas cómodas para caminar',
      'Ropa liviana, protector solar, gorro, botella reutilizable',
      'Documentación personal, seguro médico, repelente',
    ],
    alojamientos: [
      { nombre: 'Hotel Río Búzios Beach', doble: 'USD 1.500', simple: 'USD 1.850' },
      { nombre: 'Pousada Centro Class', doble: 'USD 1.300', simple: 'USD 1.450' },
    ],
    nota: 'Todas las salidas en barco son desde Playa dos Ossos. Desde la Pousada Centro Class se llega caminando en 10 minutos.',
  },
  {
    slug: 'travel-mayo-2027',
    destino: 'Búzios',
    pais: 'Brasil',
    titulo: 'Swim & Adventure',
    salidaTitulo: 'Mayo 2027',
    fechaCorta: 'MAY 2027',
    fechaLarga: '20 al 25 de mayo de 2027',
    anio: '2027',
    estado: 'abierta',
    chip: 'CUPOS DISPONIBLES',
    cta: true,
    // Buzios tambien: travel-barco era una carrera en Argentina.
    img: 'tv-costa',
    resumen: 'Una nueva oportunidad para vivir Swim & Adventure. Nadamos, exploramos y compartimos el destino dentro y fuera del agua.',
    supervisa: '',
    itinerario: [],
    incluye: [],
    noIncluye: [],
    llevar: [],
    alojamientos: [],
    nota: '',
  },
];

export const porSlugTravel = (slug) => TRAVEL.find((t) => t.slug === slug) || null;

/** Contenido de cabecera de cada modalidad — tagline + bajada, tal como los
    pasó OWA por mail. `experiencia` (más abajo, sólo en Swim & Adventure)
    es contenido nuestro previo, que se mantiene como refuerzo. */
export const MODALIDADES_TRAVEL = [
  {
    slug: 'swim-adventure',
    nombre: 'Swim & Adventure',
    tagline: 'Viajar para nadar. Nadar para descubrir.',
    // La del hero anterior: el grupo entero en el agua turquesa de Buzios.
    img: 'tv-turquesa',
    alt: 'El grupo de OWA Travel flotando junto en el mar turquesa de Búzios',
    parrafos: [
      'Experiencias grupales diseñadas por <span class="u-sigla">OWA</span> para conocer destinos únicos desde una perspectiva diferente: el agua.',
      'Natación en aguas abiertas, naturaleza, aventura y tiempo para disfrutar, acompañados durante toda la experiencia por el equipo <span class="u-sigla">OWA</span>.',
    ],
    experiencia: [
      { icono: 'pin', t: 'Destinos elegidos', d: 'Seleccionados por su entorno y su atractivo natural.' },
      { icono: 'ola', t: 'Sin competencia', d: 'Travesías y actividades de natación sin enfoque competitivo.' },
      { icono: 'documento', t: 'Logística resuelta', d: 'Traslados, hospedaje y coordinación de todo el viaje.' },
      { icono: 'persona', t: 'Acompañamiento', d: 'El equipo de <span class="u-sigla">OWA</span> con el grupo durante toda la experiencia.' },
      { icono: 'reloj', t: 'Tiempo para disfrutar', d: 'Espacio para conocer, compartir y vivir el destino.' },
    ],
  },
  {
    slug: 'race-travel',
    nombre: 'Race Travel',
    tagline: 'Viajar juntos. Competir en el mundo.',
    // Drone sobre la isla, con zoom sobre el grupo (ver imgPos en la vista).
    img: 'tv-isla-drone',
    alt: 'Grupo de nadadores reunido en la cima de una isla frente al mar',
    zoom: true,
    parrafos: [
      '<span class="u-sigla">OWA</span> Race Travel reúne grupos de nadadores para viajar y participar en grandes competencias de aguas abiertas del calendario internacional.',
      'En algunas carreras competimos individualmente. En otras, formamos equipos. Pero la experiencia siempre es compartida: viajamos como grupo y vivimos cada desafío acompañados por <span class="u-sigla">OWA</span>.',
    ],
    experiencia: [
      { icono: 'bandera', t: 'Carreras seleccionadas', d: 'Viajes grupales a competencias elegidas del calendario internacional.' },
      { icono: 'documento', t: 'Inscripción gestionada', d: '<span class="u-sigla">OWA</span> coordina tu cupo con la organización del evento.' },
      { icono: 'pin', t: 'Traslados y hospedaje', d: 'Organizados para todo el grupo.' },
      { icono: 'persona', t: 'Acompañamiento', d: 'El equipo de <span class="u-sigla">OWA</span> con vos durante toda la estadía.' },
      { icono: 'equipo', t: 'En grupo', d: 'Una experiencia compartida antes, durante y después de la carrera.' },
    ],
  },
];

/** "Mucho más que nadar": cierre de la sección Swim & Adventure, tal como
    lo mandó OWA. */
export const MUCHO_MAS_QUE_NADAR = {
  titulo: 'Mucho más que nadar',
  parrafos: [
    'No venimos a competir.',
    'Venimos a descubrir lugares nuevos, nadar en escenarios increíbles y compartir la experiencia con otros nadadores, amigos y acompañantes.',
    '<span class="u-sigla">OWA</span> se ocupa de la experiencia. Vos, de vivirla.',
  ],
};

/** Agenda 2027 de Race Travel. Capri–Nápoli ya tiene cupos abiertos para
    equipos Relay; Portugal y Mykonos todavía no tienen fecha ni foto
    confirmadas por OWA — quedan "próximamente" hasta que las manden. */
export const RACE_TRAVEL_AGENDA = [
  {
    slug: 'capri-napoli',
    destino: 'Capri–Nápoli',
    pais: 'Italia',
    fecha: 'Julio 2027',
    estado: 'abierta',
    chip: 'CUPOS DISPONIBLES',
    img: 'tv-capri-napoli',
    resumen: 'Una de las pruebas más emblemáticas de las aguas abiertas internacionales.',
    nota: 'Cupos disponibles para equipos Relay.',
    cta: true,
  },
  {
    slug: 'swim-gp-portugal',
    destino: 'Swim GP',
    pais: 'Portugal',
    fecha: 'Julio 2027',
    estado: 'proximamente',
    chip: 'PRÓXIMAMENTE',
    // Foto de referencia del destino (Lisboa), no de la carrera: todavía no
    // tiene fecha ni sede confirmadas.
    img: 'tv-portugal',
    resumen: 'Una nueva carrera, un nuevo destino y un grupo OWA viajando para competir.',
    nota: 'Próximamente más información.',
    cta: false,
  },
  {
    slug: 'swim-gp-mykonos',
    destino: 'Swim GP Mykonos',
    pais: 'Grecia',
    fecha: 'Octubre 2027',
    estado: 'proximamente',
    chip: 'PRÓXIMAMENTE',
    // Ídem: foto de referencia del destino, no de la carrera.
    img: 'tv-mykonos',
    resumen: 'Aguas abiertas y competencia en uno de los destinos más atractivos del Mediterráneo.',
    nota: 'Próximamente más información.',
    cta: false,
  },
];

/** "Competir lejos. Viajar acompañado.": cierre de la sección Race Travel. */
export const COMPETIR_LEJOS = {
  titulo: 'Competir lejos. Viajar acompañado.',
  parrafos: [
    '<span class="u-sigla">OWA</span> organiza la experiencia alrededor de cada competencia: inscripción, alojamiento, logística y acompañamiento durante el viaje.',
    'Competí individualmente, armá tu equipo o sumate a uno.',
    'Vos te preparás para el desafío. <span class="u-sigla">OWA</span> viaja con vos.',
  ],
  cta: 'Consultar Race Travel 2027',
};

/** Nota de cierre de Race Travel: la agenda sigue creciendo. */
export const MAS_CARRERAS = {
  titulo: 'Más carreras. Más destinos.',
  parrafos: ['La agenda <span class="u-sigla">OWA</span> Race Travel 2027 sigue creciendo.', 'Pronto sumaremos nuevas competencias internacionales.'],
};

/** Galería de Búzios. Curada de Fotos/TRAVEL: se dejaron afuera las tomas
    movidas o de baja resolución. El orden alterna agua / tierra / grupo para
    que la grilla no quede toda del mismo azul. */
export const GALERIA_TRAVEL = [
  // Destacada: el grupo nadando. Es la que cuenta de que se trata el viaje;
  // la tortuga entra igual pero en tamano normal.
  { slug: 'tv-caps', alt: 'El grupo nadando junto con gorras de colores y boyas naranjas en agua turquesa', destacada: true },
  { slug: 'tv-isla-drone', alt: 'Vista aérea del grupo en la cima de una isla frente al mar' },
  { slug: 'tv-tortuga', alt: 'Tortuga marina nadando bajo el agua en Ilha de Âncora' },
  { slug: 'tv-buceo', alt: 'Buzo con equipo completo bajo el agua turquesa' },
  { slug: 'tv-trilha', alt: 'Grupo de nadadores en una caminata por la isla' },
  { slug: 'tv-kayak', alt: 'Kayak de apoyo acompañando a los nadadores frente a la costa' },
  { slug: 'tv-costa', alt: 'Nadador cruzando frente a la costa de Búzios' },
  { slug: 'tv-playa-grupo', alt: 'El grupo posando en la playa después de nadar' },
  { slug: 'tv-lancha', alt: 'El grupo a bordo de la embarcación rumbo al punto de largada' },
];
