// OWA Travel — viajes grupales de nado. Los datos de Búzios salen de la
// propuesta "Buzios Propuesta Octubre 2026" pasada por OWA.
//
// OJO: el destino de mayo 2027 todavía no está definido; queda como placeholder
// explícito para que no se lea como contenido real.

export const TRAVEL = [
  {
    slug: 'buzios-2026',
    destino: 'Búzios',
    pais: 'Brasil',
    titulo: 'Swim & Adventure',
    fechaCorta: 'OCT 2026',
    fechaLarga: 'Del 22 al 27 de octubre de 2026',
    anio: '2026',
    estado: 'abierta',
    img: 'travel-playa',
    resumen:
      'Seis días nadando entre islas: Ilha Branca, Ilha Feia y una caverna natural a la que se entra nadando. Snorkel sobre corales, trilhas hasta la cima de las islas y un nado nocturno con luna llena.',
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
    destino: 'Destino a confirmar',
    pais: '',
    titulo: 'Segunda salida de la temporada',
    fechaCorta: 'MAY 2027',
    fechaLarga: 'Mayo de 2027',
    anio: '2027',
    estado: 'proximamente',
    img: 'travel-barco',
    resumen: 'La segunda experiencia OWA Travel de la temporada. Destino, itinerario y valores a confirmar por la organización.',
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

/** Las dos modalidades de OWA Travel. Es el contenido de la página /travel:
    explica la propuesta, no el detalle de cada salida (eso va en el PDF que
    la organización manda a quien consulta). */
export const MODALIDADES_TRAVEL = [
  {
    slug: 'swim-adventure',
    nombre: 'Swim & Adventure',
    tagline: 'Viajar para nadar, descubrir y disfrutar.',
    img: 'travel-playa',
    alt: 'Grupo de nadadores abrazados en la playa antes de entrar al agua',
    parrafos: [
      'Experiencias grupales en destinos elegidos por sus paisajes, su entorno y las posibilidades que ofrecen para disfrutar del agua de una manera diferente.',
      'Swim & Adventure no tiene a la competencia como objetivo. La propuesta es viajar, nadar, conocer nuevos lugares y compartir la experiencia con otros nadadores, amigos y acompañantes.',
      'OWA diseña cada viaje y acompaña al grupo durante toda la estadía, combinando natación, turismo y momentos para disfrutar el destino dentro y fuera del agua.',
    ],
    experiencia: [
      'Destinos seleccionados por su entorno y atractivo natural.',
      'Travesías y actividades de natación sin enfoque competitivo.',
      'Traslados, hospedaje y logística coordinados.',
      'Acompañamiento de OWA durante toda la experiencia.',
      'Tiempo para conocer, compartir y disfrutar el destino.',
    ],
  },
  {
    slug: 'race-travel',
    nombre: 'Race Travel',
    tagline: 'Viajar para competir.',
    img: 'travel-barco',
    alt: 'Largada de una carrera de aguas abiertas con embarcación de apoyo',
    parrafos: [
      'Viajes grupales para participar en competencias de aguas abiertas en distintos destinos del mundo.',
      'OWA reúne al grupo y coordina la experiencia alrededor de cada carrera: viaje, hospedaje, inscripción y acompañamiento durante la estadía. Vos elegís el desafío y te concentrás en llegar preparado para competir.',
      'Una forma de conocer nuevas carreras, representar a tu equipo y compartir la experiencia de competir lejos de casa junto a otros nadadores.',
    ],
    experiencia: [
      'Viajes grupales a competencias seleccionadas.',
      'Inscripción y coordinación con el evento.',
      'Traslados y hospedaje organizados.',
      'Acompañamiento de OWA durante toda la estadía.',
      'Una experiencia compartida antes, durante y después de la carrera.',
    ],
  },
];
