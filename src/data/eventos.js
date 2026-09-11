// Calendario real de la temporada 2026/27, portado del prototipo aprobado.
// `img` referencia un slug de public/img (ver scripts/images.mjs).

export const EVENTOS = [
  {
    slug: 'lujan',
    // Lleva el nombre del sponsor en el titular: "... by arena".
    sponsor: 'arena',
    distancias: { gp: 8, circuito: [2, 4] },
    sigla: 'LJN',
    nombre: 'Open Water Luján',
    corto: 'LUJÁN',
    sede: 'Luján · Buenos Aires',
    sedeCorta: 'LUJÁN',
    tipo: 'core',
    fechaCorta: '31 OCT',
    anio: '2026',
    fechaLarga: 'Sábado 31 de octubre de 2026',
    nota: '',
    estado: 'abierta',
    img: 'ev-lujan',
    jornadas: [
      {
        torneo: 'GRAND PRIX',
        sigla: 'LJN',
        img: 'ljn-sede',
        nombreLargo: 'Luján',
        fecha: '31/10/2026',
        dia: 'Jornada Grand Prix',
        desc: 'Élite y máster competitivo. Puntúa para el ranking Grand Prix.',
        tagline: 'Ocho kilómetros en<br>agua sin corriente',
      },
      {
        torneo: 'CIRCUITO OWA',
        sigla: 'LJN',
        img: 'ljn-largada',
        nombreLargo: 'Luján',
        fecha: '31/10/2026',
        dia: 'Jornada Circuito · mismo día',
        desc: 'Única fecha del calendario donde ambas competencias se corren el mismo día.',
        tagline: 'Única jornada compartida:<br>Grand Prix y Circuito',
      },
    ],
  },
  {
    slug: 'san-pedro',
    sponsor: 'arena',
    distancias: { gp: 18, circuito: [4, 7] },
    // Dos jornadas con nombre propio: la Vuelta de Obligado abre el fin de
    // semana y la de San Pedro lo cierra (ver `jornadas`).
    sigla: 'VOB · SPD',
    nombre: 'Open Water San Pedro',
    corto: 'SAN PEDRO',
    sede: 'San Pedro · Buenos Aires',
    sedeCorta: 'SAN PEDRO',
    tipo: 'core',
    fechaCorta: '14 Y 15 NOV',
    anio: '2026',
    fechaLarga: '14 y 15 de noviembre de 2026',
    nota: '',
    estado: 'abierta',
    img: 'ev-san-pedro',
    historial: true,
    jornadas: [
      {
        torneo: 'GRAND PRIX',
        sigla: 'VOB',
        img: 'vob-rio-barco',
        imgPos: 'object-[50%_75%]',
        nombreLargo: 'Vuelta de Obligado',
        fecha: '14/11/2026',
        dia: 'Día 1 · Grand Prix',
        desc: 'Sobre el Paraná, con largada desde la costanera de San Pedro.',
        tagline: 'Km de historia,<br>río y desafío.',
      },
      {
        torneo: 'CIRCUITO OWA',
        sigla: 'SPD',
        img: 'spd-brazada-colores',
        nombreLargo: 'San Pedro',
        fecha: '15/11/2026',
        dia: 'Día 2 · Circuito OWA',
        desc: 'Distancias accesibles y clasificación por categoría de edad.',
        tagline: 'Un clásico del<br>Circuito OWA.',
      },
    ],
  },
  {
    slug: 'ramallo',
    distancias: { gp: 12, circuito: [3, 7] },
    sigla: 'RML',
    nombre: 'Open Water Ramallo',
    corto: 'RAMALLO',
    sede: 'Ramallo · Buenos Aires',
    sedeCorta: 'RAMALLO',
    tipo: 'core',
    fechaCorta: '12 Y 13 DIC',
    anio: '2026',
    fechaLarga: '12 y 13 de diciembre de 2026',
    nota: '',
    // Ramallo todavía no confirmó la fecha: hasta que lo haga, la tarjeta
    // lo dice y no se puede entrar a la ficha (ver `sinIngreso`).
    estado: 'a-confirmar',
    img: 'ev-ramallo',
    jornadas: [
      { torneo: 'GRAND PRIX', sigla: 'RML', fecha: '12/12/2026', dia: 'Día 1 · Grand Prix', desc: 'Tercera fecha puntuable del Grand Prix.' },
      { torneo: 'CIRCUITO OWA', sigla: 'RML', fecha: '13/12/2026', dia: 'Día 2 · Circuito OWA', desc: 'Tercera fecha puntuable del Circuito.' },
    ],
  },
  {
    slug: 'pinamar',
    escenario: 'MAR',
    sigla: 'PNR',
    nombre: 'Open Water Pinamar',
    corto: 'PINAMAR',
    sede: 'Pinamar · Buenos Aires',
    sedeCorta: 'PINAMAR',
    tipo: 'especial',
    fechaCorta: '16 ENE',
    anio: '2027',
    fechaLarga: 'Sábado 16 de enero de 2027',
    nota: '',
    estado: 'proximamente',
    img: 'ev-pinamar',
    // Galería de la ficha, sobre fondo blanco antes del banner de
    // beneficios. Nueve fotos reales de ediciones anteriores en la playa de
    // Pinamar. Igual criterio que Cruce del Nahuel: `grande` abre el
    // mosaico ocupando el doble de espacio, el resto entra pareja de a 4 por
    // fila (8 chicas + 1 grande cierran justo un rectángulo de 4×3).
    galeria: [
      { slug: 'pnr-galeria-1', grande: true, alt: 'Nadadores corriendo hacia el mar en la largada, en la playa de Pinamar' },
      { slug: 'pnr-galeria-2', alt: 'Nadador con traje de neopreno arena corriendo por la orilla, con una tabla de rescate detrás' },
      { slug: 'pnr-galeria-3', alt: 'Nadadores saliendo a correr bajo el arco de arena y OWA en la playa' },
      { slug: 'pnr-galeria-4', alt: 'Nadador corriendo hacia la llegada bajo el arco de arena, de espaldas' },
      { slug: 'pnr-galeria-5', alt: 'Dos nadadores saliendo del mar entre olas, sonriendo' },
      { slug: 'pnr-galeria-6', alt: 'Nadadora corriendo hacia el agua junto a una boya de arena, con otro nadador detrás' },
      { slug: 'pnr-galeria-7', alt: 'Grupo de nadadores caminando entre las dunas hacia la playa' },
      { slug: 'pnr-galeria-8', alt: 'Nadadores metiéndose al mar entre olas grandes' },
      { slug: 'pnr-galeria-9', alt: 'Nadadores cruzando una ola rompiente en el mar de Pinamar' },
    ],
  },
  {
    slug: 'cruce-del-nahuel',
    escenario: 'LAGO',
    sigla: 'NHL',
    nombre: 'Cruce del Nahuel',
    corto: 'CRUCE DEL NAHUEL',
    sede: 'Lago Nahuel Huapi · Río Negro',
    sedeCorta: 'BARILOCHE',
    tipo: 'especial',
    fechaCorta: '16, 17 O 18 FEB',
    anio: '2027',
    fechaLarga: '16, 17 o 18 de febrero de 2027',
    nota: 'Fecha a confirmar según condiciones',
    estado: 'proximamente',
    img: 'ev-nahuel',
    // "Cruce del Nahuel" entra entero en una línea; sin esto el corte por
    // defecto (última palabra sola) lo partía en "Cruce del" / "Nahuel".
    heroCorte: 0,
    // Logo institucional invitado: el Museo Malvinas acompaña esta fecha. Va
    // en blanco porque se apoya sobre la foto de la tarjeta. Necesita velo:
    // sobre el cielo de esta foto el blanco mide 1.99:1.
    logo: { src: '/brand/museo-malvinas-blanco.webp', alt: 'Museo Malvinas, Antártida y Atlántico Sur' },
    velo: true,
    // Galería de la ficha, sobre fondo blanco antes del banner de
    // beneficios. Nueve de la selección oficial de la edición 2025, con el
    // crédito del Museo Malvinas horneado por el fotógrafo — es la sede
    // anfitriona acreditando su propia foto, no algo que recortar. Se
    // dejaron afuera las fotos de la banda militar y las de la bandera de
    // Malvinas: son de otro momento del evento, no del agua.
    // `grande` marca la que abre el mosaico ocupando el doble de espacio; el
    // resto entra pareja de a 4 por fila — 8 chicas + 1 grande cierran
    // justo un rectángulo de 4×3, sin fila suelta al final.
    galeria: [
      {
        slug: 'nhl-galeria-1',
        grande: true,
        alt: 'Nadadores esperando la largada, de espaldas, con las montañas de Bariloche al fondo',
      },
      { slug: 'nhl-galeria-2', alt: 'Nadadores cruzando el lago Nahuel Huapi al atardecer, con la cordillera de fondo' },
      { slug: 'nhl-galeria-3', alt: 'Nadador saliendo del agua a contraluz, en el atardecer sobre el lago Nahuel Huapi' },
      { slug: 'nhl-galeria-4', alt: 'Grupo de nadadores acompañados por lanchas de seguridad, con las montañas de Bariloche de fondo' },
      { slug: 'nhl-galeria-5', alt: 'Nadadores en el cruce, con la cadena montañosa y el lago detrás' },
      { slug: 'nhl-galeria-6', alt: 'Lanchas de apoyo sobre el lago Nahuel Huapi, con la cordillera en el horizonte' },
      { slug: 'nhl-galeria-7', alt: 'Nadadores ingresando al agua antes de la largada, con una lancha de apoyo cerca de la costa' },
      { slug: 'nhl-galeria-8', alt: 'Grupo de nadadores en pleno cruce, con las montañas de Bariloche de fondo' },
      { slug: 'nhl-galeria-9', alt: 'Tripulantes de una lancha de OWA acompañando el cruce, con la cordillera al frente' },
    ],
  },
  {
    slug: 'vuelta-a-la-huemul',
    escenario: 'LAGO',
    sigla: 'VHU',
    nombre: 'Vuelta a la Huemul',
    corto: 'VUELTA A LA HUEMUL',
    sede: 'Lago Nahuel Huapi · Río Negro',
    sedeCorta: 'BARILOCHE',
    tipo: 'especial',
    fechaCorta: '20 FEB',
    anio: '2027',
    fechaLarga: 'Sábado 20 de febrero de 2027',
    nota: '',
    estado: 'proximamente',
    img: 'ev-huemul',
    // Décima edición de la travesía. `src` es el original (navy sobre
    // blanco) para la mini-tarjeta del calendario/home, que ya tiene buen
    // contraste ahí; `srcHero` es la versión en blanco que usa el hero de la
    // ficha propia, donde el sello cae sobre foto y el navy se perdía.
    sello: {
      src: '/brand/sello-10-anios.webp',
      srcHero: '/brand/sello-10-anios-blanco.webp',
      alt: '10 años de la Vuelta a la Huemul',
    },
    // Galería de la ficha, mismo criterio que Cruce del Nahuel y Pinamar:
    // `grande` abre el mosaico ocupando el doble de espacio, el resto entra
    // pareja de a 4 por fila (8 chicas + 1 grande cierran un rectángulo de
    // 4×3 sin fila suelta). Se dejó afuera la foto con el arco de Golden
    // Haus (sponsor de una edición anterior, no está en sponsors.js).
    galeria: [
      {
        slug: 'vhu-galeria-1',
        grande: true,
        alt: 'Nadadores cruzando el lago Nahuel Huapi con la isla Huemul de fondo',
      },
      { slug: 'vhu-galeria-2', alt: 'Boyas de largada al amanecer sobre el lago Nahuel Huapi' },
      { slug: 'vhu-galeria-3', alt: 'Nadadores reunidos en la costa antes de la largada, con el lago de fondo' },
      { slug: 'vhu-galeria-4', alt: 'Grupo de nadadores con gorra y antiparras esperando la largada' },
      { slug: 'vhu-galeria-5', alt: 'Nadadores entrando al agua antes de la largada' },
      { slug: 'vhu-galeria-6', alt: 'Nadadores acompañados por un kayak de seguridad, con las montañas de fondo' },
      { slug: 'vhu-galeria-7', alt: 'Nadador rodeando una boya de largada en el lago Nahuel Huapi' },
      { slug: 'vhu-galeria-8', alt: 'Nadador llegando a la meta bajo el arco de OWA' },
      { slug: 'vhu-galeria-9', alt: 'Vista de la isla Huemul desde el lago Nahuel Huapi' },
    ],
  },
  {
    slug: 'colon',
    distancias: { gp: 10, circuito: [2.5, 5] },
    sigla: 'LBC · CLN',
    nombre: 'Open Water Colón',
    corto: 'COLÓN',
    sede: 'Colón · Entre Ríos',
    sedeCorta: 'COLÓN',
    tipo: 'core',
    fechaCorta: '20 Y 21 MAR',
    anio: '2027',
    fechaLarga: '20 y 21 de marzo de 2027',
    nota: '',
    estado: 'proximamente',
    img: 'ev-colon',
    jornadas: [
      {
        torneo: 'GRAND PRIX',
        sigla: 'LBC',
        nombreLargo: 'Liebig a Colón',
        fecha: '20/03/2027',
        dia: 'Día 1 · Grand Prix',
        // En recuadro y no como descripción suelta: es una condición para
        // consagrarse campeón, no un dato de color.
        aviso: 'Última fecha puntuable del Grand Prix 26/27. Para el título general o por categoría hay que estar presente.',
        tagline: 'Un clásico del<br>río Uruguay.',
        // Foto propia de la jornada: sin esto las dos tarjetas de Colón
        // repetían la misma imagen del evento.
        img: 'lbc-crawl',
      },
      {
        torneo: 'CIRCUITO OWA',
        sigla: 'CLN',
        nombreLargo: 'Colón',
        fecha: '21/03/2027',
        dia: 'Día 2 · Circuito OWA',
        aviso: 'Última fecha puntuable del Circuito 26/27. Para el título general o por categoría hay que estar presente.',
        // Provisoria, a la espera del texto de OWA. Evita "cierre de
        // temporada" (es el sello de la Maratón San Pedro, que cierra el
        // calendario) y no repite el "clásico" de la tarjeta de al lado.
        tagline: 'Distancias para<br>animarse.',
      },
    ],
  },
  {
    slug: 'maraton-acuatica-san-pedro',
    escenario: 'RÍO',
    sigla: 'SPD',
    nombre: 'Maratón Acuática San Pedro',
    corto: 'MARATÓN SAN PEDRO',
    sede: 'San Pedro · Buenos Aires',
    sedeCorta: 'SAN PEDRO',
    tipo: 'especial',
    fechaCorta: '10 ABR',
    anio: '2027',
    fechaLarga: 'Sábado 10 de abril de 2027',
    nota: '',
    estado: 'proximamente',
    img: 'ev-maraton',
    // "San Pedro" cae junto en el segundo renglón; el corte por defecto
    // (última palabra sola) dejaba "San" colgado arriba con "Pedro" solo.
    heroCorte: 2,
    // Última fecha del calendario 26/27. El sello es cian y esta foto es agua
    // con espuma: sin velo mide 1.44:1 y se pierde. `srcHero` (blanco) es
    // para el hero de la ficha propia — ver nota en VHU más arriba.
    sello: {
      src: '/brand/sello-cierre-temporada.webp',
      srcHero: '/brand/sello-cierre-temporada-blanco.webp',
      alt: 'Cierre de temporada',
    },
    velo: true,
  },
];

// `ventana` es la línea que se muestra en las tarjetas: los Challenge no tienen
// una fecha cerrada sino un período (o una condición de cupo, como SNP).
export const CHALLENGES = [
  {
    slug: 'rdp40',
    sigla: 'RDP',
    nombre: 'RDP · Cruce Río de la Plata',
    corto: 'RDP',
    sede: 'Colonia a Punta Lara',
    sedeCorta: 'PUNTA LARA',
    tipo: 'challenge',
    fechaCorta: 'DIC – ABR',
    anio: '',
    ventana: 'Diciembre a abril',
    fechaLarga: 'Ventanas de cruce: diciembre a abril',
    nota: '',
    estado: 'proximamente',
    km: '40 km',
    img: 'ev-rdp40',
    // Postulación por mail y no por WhatsApp, a diferencia de los otros dos
    // Challenge.
    postulacionEmail: 'info@owa.com.ar',
    // La nadadora con la boya está abajo y a la izquierda del cuadro: el
    // recorte la corre hacia el centro-derecha del hero, donde queda espacio
    // libre debajo del titular.
    heroPos: 'object-[34%_58%]',
    // El cruce lo fiscaliza la Asociación Civil Náutica Río de la Plata.
    fiscalizacion: { nombre: 'ACNRP', href: 'https://www.acnrp.com', logo: '/brand/acnrp-logo.webp' },
    // Video de contexto histórico del cruce (embed sin cookies).
    video: { id: '64q-LL9XFNw', titulo: 'Conocé la historia de este cruce centenario' },
    // Distancia única del challenge, con su descripción y categorías propias.
    distancia: {
      km: '40 km',
      torneo: 'CHALLENGE',
      desc: 'Colonia a Punta Lara. Travesía con embarcación de apoyo logístico.',
      cats: 'Solo Swim y Relay de 2 a 6 participantes',
    },
    // Requisitos propios: el apoyo lo pone la organización, así que no se pide
    // embarcación propia como en el resto de los Challenge.
    requisitos: [
      { icono: 'nadador', t: 'Experiencia comprobable', d: 'Antecedentes verificables en aguas abiertas.' },
      { icono: 'documento', t: 'Apto médico vigente', d: 'Certificado médico específico para ultradistancia.' },
      { icono: 'equipo', t: 'Confirmación de la organización', d: 'El cupo se asigna luego de evaluar la postulación.' },
    ],
    recorridoMapa: {
      slug: 'mapa-rdp',
      alt: 'Mapa del cruce del Río de la Plata, de Colonia (Uruguay) a Punta Lara (Argentina)',
    },
    galeria: [
      { slug: 'rdp-galeria-1', grande: true, alt: 'Vista aérea del Río de la Plata en la zona del cruce' },
      { slug: 'rdp-galeria-2', alt: 'Nadador durante el cruce del Río de la Plata' },
      { slug: 'rdp-galeria-3', alt: 'Nadador acompañado por la embarcación de apoyo en el Río de la Plata' },
      { slug: 'rdp-galeria-4', alt: 'Nadador en pleno cruce del Río de la Plata' },
      { slug: 'rdp-galeria-5', alt: 'Brazada de un nadador en las aguas del Río de la Plata' },
      { slug: 'rdp-galeria-6', alt: 'Nadador y embarcación de apoyo durante la travesía' },
      { slug: 'rdp-galeria-7', alt: 'Nadador del cruce del Río de la Plata visto de cerca' },
      { slug: 'rdp-galeria-8', alt: 'Nadador avanzando en el Río de la Plata con la costa de fondo' },
      { slug: 'rdp-galeria-9', alt: 'Nadador durante la travesía del Río de la Plata' },
      { slug: 'rdp-galeria-10', alt: 'Nadador y embarcación de apoyo en el cruce del Río de la Plata' },
      { slug: 'rdp-galeria-11', alt: 'Nadador en aguas abiertas del Río de la Plata' },
      { slug: 'rdp-galeria-12', alt: 'Nadador durante el cruce, con la lancha de apoyo al lado' },
      { slug: 'rdp-galeria-13', alt: 'Nadador avanzando en el Río de la Plata' },
    ],
  },
  {
    slug: 'snp70',
    sigla: 'SNP',
    nombre: 'SNP · San Nicolás a San Pedro',
    corto: 'SNP',
    sede: 'San Pedro · Buenos Aires',
    sedeCorta: 'SAN PEDRO',
    tipo: 'challenge',
    fechaCorta: 'A CONFIRMAR',
    anio: '',
    ventana: 'Se activa con 5 nadadores confirmados',
    fechaLarga: 'El Challenge se activa con 5 nadadores confirmados',
    nota: '',
    estado: 'proximamente',
    km: '70 km',
    img: 'ev-snp70',
    // El nadador con la boya está abajo y al centro: se baja el recorte para
    // que se lo vea en el hero.
    heroPos: 'object-[45%_64%]',
    distancia: {
      km: '70 km',
      torneo: 'CHALLENGE',
      desc: '70 km de nado por el Paraná, desde San Nicolás de los Arroyos a San Pedro, Buenos Aires.',
      cats: 'Solo Swim y Relay de 2 a 6 participantes',
    },
    requisitos: [
      { icono: 'nadador', t: 'Experiencia comprobable', d: 'Antecedentes verificables en aguas abiertas.' },
      { icono: 'documento', t: 'Apto médico vigente', d: 'Certificado médico específico para ultradistancia.' },
      { icono: 'equipo', t: 'Confirmación de la organización', d: 'El cupo se asigna luego de evaluar la postulación.' },
    ],
    recorridoMapa: {
      slug: 'mapa-snp',
      alt: 'Mapa del cruce de San Nicolás de los Arroyos a San Pedro por el río Paraná',
    },
    resena: {
      titulo: 'Raidistas del Paraná',
      bajada: 'Nadadores que completaron el cruce de San Nicolás a San Pedro.',
      unidad: 'raidistas',
      bloques: [
        {
          fecha: '17 de abril de 2023',
          cruces: [
            { nadador: 'Marcio Junqueira', pais: 'BRA', neopreno: false, tiempo: '11 h 18 min' },
            { nadador: 'Lorenzo Raggio', pais: 'ARG', neopreno: true, tiempo: '10 h 42 min' },
            { nadador: 'Tomás Larocca', pais: 'ARG', neopreno: true, tiempo: '11 h 30 min' },
            { nadador: 'Mariana Díaz', pais: 'ARG', neopreno: true, tiempo: '11 h 32 min' },
            { nadador: 'Machu Pereyra', pais: 'ARG', neopreno: true, tiempo: '11 h 49 min' },
            { nadador: "Julieta O'Connor", pais: 'ARG', neopreno: true, tiempo: '12 h 23 min' },
          ],
        },
        {
          fecha: '13 de noviembre de 2024',
          cruces: [
            { nadador: 'Tobías Breme', pais: 'ARG', neopreno: true, tiempo: '13 h 39 min' },
            { nadador: 'Luis Sufid', pais: 'ARG', neopreno: false, tiempo: '13 h 47 min' },
            { nadador: 'Damián Wachowicz', pais: 'ARG', neopreno: false, tiempo: '13 h 48 min' },
          ],
        },
      ],
    },
    galeria: [
      { slug: 'snp-galeria-1', grande: true, alt: 'Nadador en el río Paraná durante el cruce de San Nicolás a San Pedro' },
      { slug: 'snp-galeria-2', alt: 'Nadador y embarcación de apoyo en el río Paraná' },
      { slug: 'snp-galeria-3', alt: 'Nadador cruzando el Paraná al amanecer' },
      { slug: 'snp-galeria-4', alt: 'Brazada de un nadador en las aguas del río Paraná' },
      { slug: 'snp-galeria-5', alt: 'Nadador acompañado por la lancha de apoyo en el Paraná' },
      { slug: 'snp-galeria-6', alt: 'Nadador en pleno cruce del río Paraná' },
      { slug: 'snp-galeria-7', alt: 'Nadador y equipo de apoyo durante la travesía' },
      { slug: 'snp-galeria-8', alt: 'Nadador avanzando por el Paraná con la costa de fondo' },
      { slug: 'snp-galeria-9', alt: 'Nadador del cruce San Nicolás a San Pedro visto de cerca' },
      { slug: 'snp-galeria-10', alt: 'Embarcación de apoyo siguiendo al nadador en el Paraná' },
      { slug: 'snp-galeria-11', alt: 'Nadador durante la larga travesía del Paraná' },
      { slug: 'snp-galeria-12', alt: 'Nadador entrando al agua antes de la largada en San Nicolás' },
      { slug: 'snp-galeria-13', alt: 'Nadador en el río Paraná camino a San Pedro' },
    ],
  },
  {
    slug: 'bvt21',
    sigla: 'BVT',
    nombre: 'BVT · Blest a Villa Tacul',
    corto: 'BVT',
    sede: 'Bariloche · Río Negro',
    sedeCorta: 'BARILOCHE',
    tipo: 'challenge',
    fechaCorta: 'FEB 2027',
    // El año ya va en fechaCorta: repetirlo en `anio` lo imprime dos veces.
    anio: '',
    ventana: 'Febrero 2027',
    fechaLarga: 'Febrero de 2027',
    nota: '',
    estado: 'proximamente',
    km: '21 km',
    img: 'ev-bvt21',
    // Los nadadores con las boyas están en el tercio inferior: se baja el
    // recorte para que queden a la vista en el hero.
    heroPos: 'object-[50%_66%]',
    distancia: {
      km: '21 km',
      torneo: 'CHALLENGE',
      desc: 'Largada en Puerto Blest y llegada en Villa Tacul, Bariloche, Río Negro.',
      cats: 'Solo Swim y Relay de 2 a 6 participantes',
    },
    // Mismos requisitos que el resto de los Challenge con apoyo de la
    // organización (ver rdp40).
    requisitos: [
      { icono: 'nadador', t: 'Experiencia comprobable', d: 'Antecedentes verificables en aguas abiertas.' },
      { icono: 'documento', t: 'Apto médico vigente', d: 'Certificado médico específico para ultradistancia.' },
      { icono: 'equipo', t: 'Confirmación de la organización', d: 'El cupo se asigna luego de evaluar la postulación.' },
    ],
    recorridoMapa: {
      slug: 'mapa-bvt',
      alt: 'Mapa del cruce del brazo Blest a Villa Tacul, lago Nahuel Huapi',
    },
    // En lugar de fiscalización + video: reseña histórica de cruces. Sin
    // `triple` (se sacó "Forma parte de"), la reseña ocupa el ancho entero y
    // sus bloques de fecha van de a dos por fila (ver resenaHistorica en
    // views/evento.js).
    resena: {
      titulo: 'Reseña histórica',
      bajada: 'Cruces registrados de Puerto Blest a Villa Tacul.',
      bloques: [
        {
          fecha: '21 de febrero de 2023',
          cruces: [
            { nadador: 'Sergio Salomone', pais: 'ARG', neopreno: false, tiempo: '7 h 26 min' },
            { nadador: 'Gastón Pagniez', pais: 'ARG', neopreno: true, tiempo: '6 h 28 min' },
            { nadador: 'Mariano Mortara', pais: 'ARG', neopreno: true, tiempo: '6 h 30 min' },
            { nadador: 'Tomás Larocca', pais: 'ARG', neopreno: true, tiempo: '7 h 21 min' },
            { nadador: 'Joaquina Dalmazzo', pais: 'ARG', neopreno: true, tiempo: '7 h 25 min' },
          ],
        },
        {
          fecha: '18 de febrero de 2025',
          cruces: [
            { nadador: 'Benicio Raggio', pais: 'ARG', neopreno: true, tiempo: '6 h 20 min' },
            { nadador: 'Diego Suárez', pais: 'ARG', neopreno: true, tiempo: '6 h 48 min' },
            { nadador: "Julieta O'Connor", pais: 'ARG', neopreno: true, tiempo: '7 h 2 min' },
            { nadador: 'Mariana Díaz', pais: 'ARG', neopreno: true, tiempo: '7 h 11 min' },
          ],
        },
      ],
    },
    galeria: [
      { slug: 'bvt-galeria-1', grande: true, alt: 'Nadadores en el lago Nahuel Huapi durante el cruce Blest a Villa Tacul' },
      { slug: 'bvt-galeria-2', alt: 'Nadador cruzando el lago Nahuel Huapi con la cordillera de fondo' },
      { slug: 'bvt-galeria-3', alt: 'Nadador acompañado por una embarcación de apoyo en el Nahuel Huapi' },
      { slug: 'bvt-galeria-4', alt: 'Nadador en pleno cruce del lago, con las montañas detrás' },
      { slug: 'bvt-galeria-5', alt: 'Nadador del cruce Blest a Villa Tacul en aguas abiertas' },
      { slug: 'bvt-galeria-6', alt: 'Nadador y lancha de apoyo sobre el lago Nahuel Huapi' },
      { slug: 'bvt-galeria-7', alt: 'Nadador durante la travesía del brazo Blest' },
      { slug: 'bvt-galeria-8', alt: 'Nadador llegando a Villa Tacul' },
      { slug: 'bvt-galeria-9', alt: 'Largada del cruce en el brazo Blest' },
      { slug: 'bvt-galeria-10', alt: 'Nadadores y kayaks de apoyo en el lago Nahuel Huapi' },
      { slug: 'bvt-galeria-11', alt: 'Cruce del lago Nahuel Huapi con la costa de Bariloche de fondo' },
      { slug: 'bvt-galeria-12', alt: 'Nadador entrando al agua antes de la largada' },
      { slug: 'bvt-galeria-13', alt: 'Nadador en la travesía Blest a Villa Tacul' },
    ],
  },
];

/** Las cuatro fechas que suman puntos a los rankings. */
export const PUNTUABLES = EVENTOS.filter((e) => e.tipo === 'core');

/** Fuera del torneo regular: no suman puntos. */
export const ESPECIALES = EVENTOS.filter((e) => e.tipo === 'especial');

/** 2.5 -> "2,5 km": coma decimal, que es como se escribe en Argentina. */
export const km = (n) => `${String(n).replace('.', ',')} km`;

export const ALL = [...EVENTOS, ...CHALLENGES];

export const porSlug = (slug) => ALL.find((e) => e.slug === slug) || null;

export const MESES = {
  ENE: 'ENERO',
  FEB: 'FEBRERO',
  MAR: 'MARZO',
  ABR: 'ABRIL',
  MAY: 'MAYO',
  JUN: 'JUNIO',
  JUL: 'JULIO',
  AGO: 'AGOSTO',
  SEP: 'SEPTIEMBRE',
  OCT: 'OCTUBRE',
  NOV: 'NOVIEMBRE',
  DIC: 'DICIEMBRE',
};

export const ESTADOS = {
  abierta: 'INSCRIPCIÓN ABIERTA',
  proximamente: 'PRÓXIMAMENTE',
  'a-confirmar': 'FECHA A CONFIRMAR',
  cerrada: 'CERRADA',
};

/** A dónde manda "Inscribite". Hasta que OWA pase el link real de cada carrera,
    todo va al calendario, que es donde van a vivir esos links. Cuando lleguen,
    se agrega `inscripcion: 'https://…'` al evento y esta función lo toma sola. */
// Una carrera sin fecha confirmada no abre ficha: la tarjeta se muestra
// igual (la fecha está en el calendario) pero no lleva a ningún lado, para
// no publicar recorrido, cronograma ni inscripción de algo que puede
// cambiar. Alcanza con sacarle el estado para que vuelva a entrar.
export const sinIngreso = (e) => e?.estado === 'a-confirmar';

export const linkInscripcion = (e) => e?.inscripcion || '/calendario';
