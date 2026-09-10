// Ficha real de cada carrera, por slug. Lo que una carrera no defina acá cae
// en el EVENTO_FICHA genérico de madres.js, que sigue siendo placeholder.
//
// Datos pasados por OWA. Por decisión de la organización, el sitio no publica
// detalles de inscripción más allá del link a Cronometraje Instantáneo.

const CATS_COMPLETAS = 'Género · Edades · Neopreno';

// La Vuelta a la Huemul es con neopreno obligatorio para todos los que
// compiten: no hay categoría "sin neopreno" que distinguir, así que no se
// repite acá (a diferencia de CATS_COMPLETAS, que sí distingue esa opción).
const CATS_VHU = 'Género · Edades';

// Se repiten idénticas en las tres distancias.
const PREMIACION = 'Generales 1 al 5 por género. 1 al 3 por categorías cada 5 años, por género';
const PREMIACION_NEOPRENE = 'Generales 1 al 3 por género';
const AGUA = 'Entre 23 y 26 °C, sin visibilidad, con corriente a favor';

export const FICHAS = {
  lujan: {
    sedeBarra: 'Awass Beach Club · Surf Village, Luján',
    sedeCiudad: 'Luján, Buenos Aires, Argentina',

    // Un solo formulario para las dos jornadas: Luján las corre el mismo día
    // y la propia página de inscripción se titula "Open Water Luján 2026 -
    // Grand Prix & Circuito OWA", así que el slug "circuito" cubre las dos.
    inscripcion: {
      'GRAND PRIX': 'https://cronometrajeinstantaneo.com/inscripciones/lujan-ljn-circuito-owa-2627',
      'CIRCUITO OWA': 'https://cronometrajeinstantaneo.com/inscripciones/lujan-ljn-circuito-owa-2627',
    },
    // Armadas con el patrón que OWA confirmó para San Pedro
    // (/resultados/<slug>/participantes). Verificadas: la página responde y
    // se titula "Lujan - LJN - Circuito Owa 26/27 - Listado de participantes".
    startingList: {
      'GRAND PRIX': 'https://cronometrajeinstantaneo.com/resultados/lujan-ljn-circuito-owa-2627/participantes?orden=categoria',
      'CIRCUITO OWA': 'https://cronometrajeinstantaneo.com/resultados/lujan-ljn-circuito-owa-2627/participantes?orden=categoria',
    },

    // La largada va en `hora` y no sale de `recorridos` como en San Pedro:
    // de Luján todavía no hay mapas ni fichas técnicas por distancia.
    distancias: [
      { rotulo: 'Larga', torneo: 'GRAND PRIX', km: '8 km', hora: '12:00', puntaje: 'XXL · 1.600 puntos', cats: CATS_COMPLETAS },
      { rotulo: 'Media', torneo: 'CIRCUITO OWA', km: '4 km', hora: '12:00', puntaje: 'L · 1.200 puntos', cats: CATS_COMPLETAS },
      { rotulo: 'Corta', torneo: 'CIRCUITO OWA', km: '2 km', hora: '14:30', puntaje: 'M · 1.000 puntos' },
      { rotulo: 'Kids', km: '200 m', hora: '16:00', cats: 'Participativo · No competitivo' },
      { rotulo: 'OWA Relay', km: '4 × 50 m', hora: '16:45', nota: 'Por equipos · 1.000 puntos al equipo ganador' },
    ],

    // Un solo cronograma para toda la fecha, no uno por torneo: en Luján
    // Grand Prix y Circuito comparten la jornada y a las 12:00 largan juntos
    // el 8K y el 4K, así que separarlos daría dos listas casi idénticas.
    cronogramas: [
      {
        torneo: 'GRAND PRIX Y CIRCUITO OWA',
        dias: [
          {
            fecha: 'Sábado 31 de octubre',
            lugar: 'Awass Beach Club · Surf Village',
            items: [
              { hora: '08:30', t: 'Apertura del predio', d: 'Y acreditaciones.' },
              { hora: '08:30 a 10:45', t: 'Entrega de kits', d: 'Aptos médicos y documentación.' },
              { hora: '12:00', t: 'Largada 8K + 4K', d: '', destacado: true },
              { hora: '14:30', t: 'Largada 2K', d: '', destacado: true },
              { hora: '16:00', t: 'Largada Kids 200 m', d: '', destacado: true },
              { hora: '16:45', t: 'Largada OWA Relay 4 × 50 m', d: '', destacado: true },
              { hora: '17:30', t: 'Premiación general', d: '' },
            ],
          },
        ],
      },
    ],

    // Un solo mapa para toda la fecha: las tres distancias se corren dentro
    // de la misma laguna, así que no hay una lámina por recorrido como en
    // San Pedro. Por eso `mapa` y no `recorridos`, que arma las pestañas.
    mapa: { slug: 'mapa-ljn', alt: 'Vista aérea de la laguna Cantera Aguas con el circuito de Luján marcado en rojo' },

    kit: [
      { t: 'Remera del evento' },
      { t: 'Gorra oficial' },
      { t: 'Chip de cronometraje' },
      { t: 'Numeración' },
      { t: 'Medalla finisher' },
    ],
  },

  'san-pedro': {
    // Dos versiones de la sede: la barra de datos necesita el predio (es el
    // punto de encuentro), el subtítulo del hero ya lo dice el propio título
    // "Open Water San Pedro" y ahí alcanza con ubicar la ciudad.
    sedeBarra: 'Camping Club América, San Pedro',
    sedeCiudad: 'San Pedro, Buenos Aires, Argentina',

    // Un link por jornada: cada torneo abre su propio formulario.
    inscripcion: {
      'GRAND PRIX': 'https://cronometrajeinstantaneo.com/inscripciones/vuelta-de-obligado-vob-gp-owa-2627',
      'CIRCUITO OWA': 'https://cronometrajeinstantaneo.com/inscripciones/san-pedro-spd-circuito-owa-2627',
    },
    // Starting list (lista de inscriptos) de Cronometraje Instantáneo, misma
    // plataforma que la inscripción. Las dos las pasó OWA.
    startingList: {
      'GRAND PRIX':
        'https://cronometrajeinstantaneo.com/resultados/vuelta-de-obligado-vob-gp-owa-2627/participantes?orden=categoria',
      'CIRCUITO OWA':
        'https://cronometrajeinstantaneo.com/resultados/san-pedro-spd-circuito-owa-2627/participantes?orden=categoria',
    },

    distancias: [
      {
        rotulo: 'Larga',
        torneo: 'GRAND PRIX',
        km: '18 km',
        nota: 'Única distancia del día 1',
        puntaje: 'XXL · 1.600 puntos',
        cats: CATS_COMPLETAS,
      },
      {
        rotulo: 'Media',
        torneo: 'CIRCUITO OWA',
        km: '7 km',
        nota: 'Primera distancia del día 2',
        puntaje: 'L · 1.200 puntos',
        cats: CATS_COMPLETAS,
      },
      {
        rotulo: 'Corta',
        torneo: 'CIRCUITO OWA',
        km: '4 km',
        nota: 'Segunda distancia del día 2',
        puntaje: 'M · 1.000 puntos',
        cats: CATS_COMPLETAS,
      },
      {
        rotulo: 'arena Super Sprint',
        torneo: 'CIRCUITO OWA',
        km: '1,5 km',
        nota: 'Prueba por invitación. Un cupo por cada 5 inscriptos',
        cats: 'Por género',
      },
      {
        rotulo: 'Kid',
        torneo: 'CIRCUITO OWA',
        km: '500 m',
        nota: 'Prueba gratuita para nadadores de hasta 13 años',
        cats: 'Participativo · No competitivo',
      },
    ],

    // Cada recorrido lleva sus láminas de mapa y su ficha técnica.
    recorridos: [
      {
        id: 'gp-18k',
        torneo: 'GRAND PRIX',
        titulo: '18 km',
        // Reemplaza el "Punto a punto" genérico: esta distancia se conoce por
        // el nombre de la prueba, no por su formato.
        subtitulo: 'Vuelta de Obligado',
        largada: 'Vuelta de Obligado',
        llegada: 'San Pedro',
        mapas: [
          { slug: 'mapa-vob-tramo1', alt: 'Mapa del tramo 1 de la Vuelta de Obligado, desde la largada hasta el km 5,5' },
          { slug: 'mapa-vob-tramo2', alt: 'Mapa del tramo 2 de la Vuelta de Obligado, con los puestos de hidratación y los km 12 y 14,5' },
          { slug: 'mapa-vob-llegada', alt: 'Mapa del tramo final de la Vuelta de Obligado hasta la llegada' },
        ],
        ficha: [
          ['Fecha', 'Sábado 14 de noviembre de 2026'],
          ['Horario de largada', '10:00 hs'],
          ['Distancia', '18 km · recorrido punto a punto'],
          ['Cupos disponibles', '150 nadadores'],
          ['Condiciones del agua', 'Entre 23 y 26 °C, sin visibilidad, corriente a favor'],
          ['Tiempo estimado', 'Entre 2 h 20 min y 4 h'],
          ['Tiempo límite', '4 h 30 min'],
          ['Uso de neopreno', 'Optativo · categoría única'],
          ['Requisitos', '14 años cumplidos y acreditar 1.000 m nadados en menos de 22 minutos'],
          ['Premiación', PREMIACION],
          ['Premiación con neopreno', PREMIACION_NEOPRENE],
          ['Puntaje Grand Prix', 'XXL · 1.600 puntos'],
        ],
      },
      {
        id: 'circ-7k',
        torneo: 'CIRCUITO OWA',
        titulo: '7 km',
        largada: 'Apart',
        llegada: 'San Pedro',
        mapas: [{ slug: 'mapa-spd-7k', alt: 'Mapa del recorrido de 7 km, desde el apart hasta la llegada' }],
        ficha: [
          ['Fecha', 'Domingo 15 de noviembre de 2026'],
          ['Horario de largada', '10:30 hs'],
          ['Distancia', '7 km · punto a punto con corriente a favor'],
          ['Cupos disponibles', '200 nadadores'],
          ['Condiciones del agua', AGUA],
          ['Tiempo estimado', 'Entre 40 y 80 minutos'],
          ['Tiempo límite', '2 horas'],
          ['Uso de neopreno', 'Optativo'],
          ['Premiación', PREMIACION],
          ['Premiación con neopreno', PREMIACION_NEOPRENE],
          ['Puntaje Circuito OWA', 'L · 1.200 puntos'],
        ],
      },
      {
        id: 'circ-4k',
        torneo: 'CIRCUITO OWA',
        titulo: '4 km',
        largada: 'Cantando',
        llegada: 'San Pedro',
        mapas: [{ slug: 'mapa-spd-4k', alt: 'Mapa del recorrido de 4 km, desde Cantando hasta la llegada' }],
        ficha: [
          ['Fecha', 'Domingo 15 de noviembre de 2026'],
          ['Horario de largada', '12:30 hs'],
          ['Distancia', '4 km · punto a punto con corriente a favor'],
          ['Cupos disponibles', '200 nadadores'],
          ['Condiciones del agua', AGUA],
          ['Tiempo estimado', 'Entre 20 minutos y 1 hora'],
          ['Tiempo límite', '1 h 20 min'],
          ['Uso de neopreno', 'Optativo'],
          ['Premiación', PREMIACION],
          ['Premiación con neopreno', PREMIACION_NEOPRENE],
          ['Puntaje Circuito OWA', 'M · 1.000 puntos'],
        ],
      },
    ],

    cronogramas: [
      {
        torneo: 'GRAND PRIX',
        dias: [
          {
            fecha: 'Viernes 13 de noviembre',
            lugar: 'Camping América',
            items: [
              { hora: '17:00', t: 'Entrega de kits', d: 'Recepción de aptos médicos y firma de deslindes de responsabilidad.' },
              { hora: '19:00', t: 'Charla técnica obligatoria', d: 'Presencial.' },
            ],
          },
          {
            fecha: 'Sábado 14 de noviembre',
            lugar: 'Día del evento',
            items: [
              { hora: '07:30', t: 'Última entrega de kits', d: 'Y recepción de documentación pendiente.' },
              { hora: '08:45', t: 'Traslado en micro', d: 'Desde el Camping América hacia la playa de Vuelta de Obligado.' },
              { hora: '09:30', t: 'Acreditación final', d: 'En la playa.' },
              { hora: '10:00', t: 'Largada oficial · 18 km', d: '', destacado: true },
              { hora: '15:00', t: 'Premiación', d: 'En Camping América, San Pedro.' },
            ],
          },
        ],
      },
      {
        torneo: 'CIRCUITO OWA',
        aviso: 'No se realizan inscripciones presenciales durante el evento.',
        dias: [
          {
            fecha: 'Sábado 14 de noviembre',
            lugar: 'Camping América · San Pedro',
            items: [
              {
                hora: '17:00 a 19:00',
                t: 'Entrega de kits',
                d: 'Aptos médicos y firma de deslindes. Para las tres pruebas: 4 km, 7 km y Super Sprint 1,5 km.',
              },
            ],
          },
          {
            fecha: 'Domingo 15 de noviembre',
            lugar: 'Día del evento',
            items: [
              { hora: '07:45', zona: 'Zona de acreditación', t: 'Entrega de kits · 7 km', d: 'Aptos médicos, deslindes y numeración.' },
              { hora: '09:30', zona: 'Zona central', t: 'Charla técnica obligatoria · 7 km', d: '' },
              { hora: '09:40', t: 'Partida de micros', d: 'Hacia el punto de largada de 7 km.' },
              { hora: '09:50', zona: 'Zona de acreditación', t: 'Entrega de kits · 4 km', d: 'Aptos médicos, deslindes y numeración.' },
              { hora: '10:00', zona: 'Zona de largada 7 km', t: 'Acreditación final', d: 'Checklist.' },
              { hora: '10:20', t: 'Largada grupo 1 · 7 km', d: 'Ritmo lento. Puntual.' },
              { hora: '10:30', t: 'Largada grupo general · 7 km', d: 'Puntual.', destacado: true },
              { hora: '12:00', zona: 'Zona central', t: 'Charla técnica obligatoria · 4 km', d: '' },
              { hora: '12:10', t: 'Partida de micros', d: 'Hacia el punto de largada de 4 km.' },
              { hora: '12:20', zona: 'Zona de largada 4 km', t: 'Acreditación final', d: 'Checklist.' },
              { hora: '12:30', t: 'Largada única · 4 km', d: 'Puntual.', destacado: true },
              {
                hora: '13:00',
                zona: 'Zona central',
                t: 'Charla técnica final',
                d: 'Y partida del micro hacia la largada del Super Sprint 1,5 km y la prueba Kid.',
              },
              { hora: '13:10', t: 'Largada prueba Kid', d: 'Puntual.' },
              { hora: '13:20', t: 'Largada Super Sprint · mujeres', d: 'Puntual.' },
              { hora: '13:30', t: 'Largada Super Sprint · hombres', d: 'Puntual.' },
              { hora: '15:00', t: 'Ceremonia de premiación general', d: 'Camping América.' },
            ],
          },
        ],
      },
    ],

    kit: [
      { t: 'Remera OWA del evento' },
      { t: 'Gorra de silicona arena' },
      { t: 'Mochila kit' },
      { t: 'Productos de auspiciantes' },
    ],
  },

  colon: {
    sedeBarra: 'Camping Club Piedras Coloradas, Colón',
    sedeCiudad: 'Colón, Entre Ríos, Argentina',
    // Colón corre sobre el Uruguay, no sobre el Paraná como San Pedro y
    // Ramallo: la vista lo tenía fijo y ahora lo lee de acá.
    rio: 'Uruguay',

    // Un formulario por jornada, como San Pedro: LBC (Liebig a Colón) es el
    // Grand Prix del día 1 y CLN el Circuito del día 2. Los dos links los
    // pasó OWA.
    inscripcion: {
      'GRAND PRIX': 'https://cronometrajeinstantaneo.com/inscripciones/liebig-colon-lbc-gp-owa-2627',
      'CIRCUITO OWA': 'https://cronometrajeinstantaneo.com/inscripciones/open-water-colon-cln-circuito-owa-2627',
    },
    // Mismo patrón /resultados/<slug>/participantes que San Pedro y Luján.
    // Verificadas: las dos responden con su "Listado de participantes".
    startingList: {
      'GRAND PRIX':
        'https://cronometrajeinstantaneo.com/resultados/liebig-colon-lbc-gp-owa-2627/participantes?orden=categoria',
      'CIRCUITO OWA':
        'https://cronometrajeinstantaneo.com/resultados/open-water-colon-cln-circuito-owa-2627/participantes?orden=categoria',
    },

    distancias: [
      {
        rotulo: 'Larga',
        torneo: 'GRAND PRIX',
        km: '10 km',
        nota: 'Única distancia del día 1',
        puntaje: '1.200 puntos',
        cats: CATS_COMPLETAS,
      },
      { rotulo: 'Media', torneo: 'CIRCUITO OWA', km: '5 km', puntaje: '1.000 puntos', cats: CATS_COMPLETAS },
      { rotulo: 'Corta', torneo: 'CIRCUITO OWA', km: '2,5 km', puntaje: '800 puntos', cats: CATS_COMPLETAS },
      {
        rotulo: 'arena Knock Out Swim',
        torneo: 'CIRCUITO OWA',
        km: '2 × 350 m',
        nota: 'Prueba por invitación. Un cupo por género cada 5 inscriptos',
        cats: 'Por género',
      },
      {
        rotulo: 'Kids',
        torneo: 'CIRCUITO OWA',
        km: '350 m',
        nota: 'Prueba gratuita',
        cats: 'Participativo · No competitivo',
      },
    ],

    recorridos: [
      {
        id: 'gp-10k',
        torneo: 'GRAND PRIX',
        titulo: '10 km',
        subtitulo: 'Liebig',
        largada: 'Playa pública Liebig',
        llegada: 'Colón',
        mapas: [{ slug: 'mapa-cln-10k', alt: 'Mapa del recorrido de 10 km sobre el río Uruguay, desde Liebig hasta Colón' }],
        ficha: [
          ['Fecha', 'Sábado 20 de marzo de 2027'],
          ['Distancia', '10 km · recorrido punto a punto'],
          ['Cupos disponibles', '200 nadadores'],
          // Sólo la corriente: de Colón no hay dato de temperatura ni
          // visibilidad. De acá sale el "A favor" de la franja de abajo.
          ['Condiciones del agua', 'Con corriente a favor'],
          ['Tiempo estimado', 'Entre 1 h 35 min y 2 h 30 min'],
          ['Tiempo límite', '3 horas'],
          ['Uso de neopreno', 'Optativo · categoría única'],
          ['Requisitos', '14 años cumplidos y acreditar 1.000 m nadados en menos de 22 minutos'],
          ['Premiación', PREMIACION],
          ['Premiación con neopreno', PREMIACION_NEOPRENE],
          ['Puntaje OWA', '1.200 puntos'],
        ],
      },
      {
        id: 'circ-5k',
        torneo: 'CIRCUITO OWA',
        titulo: '5 km',
        subtitulo: 'San José',
        largada: 'Playa pública San José',
        llegada: 'Colón',
        mapas: [{ slug: 'mapa-cln-5k', alt: 'Mapa del recorrido de 5 km sobre el río Uruguay, desde San José hasta Colón' }],
        ficha: [
          ['Fecha', 'Domingo 21 de marzo de 2027'],
          ['Distancia', '5 km · recorrido punto a punto'],
          ['Cupos disponibles', '200 nadadores'],
          ['Condiciones del agua', 'Con corriente a favor'],
          ['Tiempo estimado', 'Entre 45 min y 1 h 20 min'],
          ['Tiempo límite', '2 horas'],
          ['Uso de neopreno', 'Optativo · categoría única'],
          ['Requisitos', '14 años cumplidos'],
          ['Premiación', PREMIACION],
          ['Premiación con neopreno', PREMIACION_NEOPRENE],
          ['Puntaje OWA', '1.000 puntos'],
        ],
      },
      {
        id: 'circ-25k',
        torneo: 'CIRCUITO OWA',
        titulo: '2,5 km',
        subtitulo: 'Termas',
        largada: 'Extremo Playa Norte',
        llegada: 'Colón',
        mapas: [
          { slug: 'mapa-cln-25k', alt: 'Mapa del recorrido de 2,5 km sobre el río Uruguay, desde Playa Norte hasta Colón' },
        ],
        ficha: [
          ['Fecha', 'Domingo 21 de marzo de 2027'],
          ['Distancia', '2,5 km · recorrido punto a punto'],
          ['Cupos disponibles', '200 nadadores'],
          ['Condiciones del agua', 'Con corriente a favor'],
          ['Tiempo estimado', 'Entre 25 y 40 minutos'],
          ['Tiempo límite', '1 h 15 min'],
          ['Uso de neopreno', 'Optativo · categoría única'],
          ['Requisitos', '14 años cumplidos'],
          ['Premiación', PREMIACION],
          ['Premiación con neopreno', PREMIACION_NEOPRENE],
          ['Puntaje OWA', '800 puntos'],
        ],
      },
    ],

    // Armado con el mismo modelo que San Pedro pero sin horarios: OWA todavía
    // no los pasó. Los `aviso` lo dicen en la propia página para que no se lea
    // como un cronograma cerrado.
    cronogramas: [
      {
        torneo: 'GRAND PRIX',
        aviso: 'Horarios a confirmar.',
        dias: [
          {
            fecha: 'Viernes 19 de marzo',
            lugar: 'Camping Club Piedras Coloradas',
            items: [
              { hora: 'A confirmar', t: 'Entrega de kits', d: 'Recepción de aptos médicos y firma de deslindes.' },
              { hora: 'A confirmar', t: 'Charla técnica obligatoria', d: '' },
            ],
          },
          {
            fecha: 'Sábado 20 de marzo',
            lugar: 'Día del evento',
            items: [
              { hora: 'A confirmar', t: 'Traslado a la largada', d: 'Hacia la playa pública de Liebig.' },
              { hora: 'A confirmar', t: 'Largada · 10 km', d: '', destacado: true },
              { hora: 'A confirmar', t: 'Premiación', d: '' },
            ],
          },
        ],
      },
      {
        torneo: 'CIRCUITO OWA',
        aviso: 'Horarios a confirmar.',
        dias: [
          {
            fecha: 'Sábado 20 de marzo',
            lugar: 'Camping Club Piedras Coloradas',
            items: [{ hora: 'A confirmar', t: 'Entrega de kits', d: 'Aptos médicos, deslindes y numeración.' }],
          },
          {
            fecha: 'Domingo 21 de marzo',
            lugar: 'Día del evento',
            items: [
              { hora: 'A confirmar', t: 'Charla técnica obligatoria', d: '' },
              { hora: 'A confirmar', t: 'Largada · 5 km', d: '', destacado: true },
              { hora: 'A confirmar', t: 'Largada · 2,5 km', d: '', destacado: true },
              { hora: 'A confirmar', t: 'Largada arena Knock Out Swim', d: '' },
              { hora: 'A confirmar', t: 'Largada prueba Kids', d: '' },
              { hora: 'A confirmar', t: 'Ceremonia de premiación general', d: '' },
            ],
          },
        ],
      },
    ],

    kit: [
      { t: 'Remera OWA del evento' },
      { t: 'Gorra de silicona arena' },
      { t: 'Mochila kit' },
      { t: 'Productos de auspiciantes' },
    ],
  },
  pinamar: {
    sedeBarra: 'Balneario Cocodrilo, Pinamar',
    sedeCiudad: 'Pinamar, Buenos Aires, Argentina',

    // Las dos distancias no puntúan para ningún campeonato: Pinamar es un
    // evento especial. Por eso el torneo dice "ESPECIAL" y no hay puntaje.
    distancias: [
      {
        rotulo: 'Larga',
        torneo: 'ESPECIAL',
        km: '3,5 km',
        nota: 'Distancia principal del evento',
        cats: CATS_COMPLETAS,
      },
      {
        rotulo: 'Corta',
        torneo: 'ESPECIAL',
        km: '1,8 km',
        nota: 'Ideal para una primera vez en el mar',
        cats: CATS_COMPLETAS,
      },
      {
        rotulo: 'Wave Relay',
        km: '4 × 50 m',
        nota: 'Participan los equipos con mayor cantidad de inscriptos',
      },
      {
        // La clínica no es una distancia, pero comparte la fila porque es
        // parte de lo que incluye la inscripción. Lo que se destaca es que
        // no se paga aparte.
        rotulo: 'Clínica',
        km: 'Gratuita',
        nota: 'Lectura e ingreso al mar: aprendé a filtrar para entrar de modo eficiente. Para todos los inscriptos',
      },
    ],

    recorridos: [
      {
        id: 'pnr-35k',
        torneo: 'ESPECIAL',
        titulo: '3,5 km',
        largada: 'Kota Beach',
        llegada: 'Cocodrilo Beach',
        // Propia, en vez de la frase de río que usan San Pedro y Colón.
        desc: 'Recorrido punto a punto pasando la segunda rompiente.',
        mapas: [
          {
            slug: 'mapa-pnr-35',
            alt: 'Mapa del recorrido de 3,5 km sobre la costa de Pinamar, con la largada al norte y la llegada en el balneario Cocodrilo',
          },
        ],
        ficha: [
          ['Fecha', 'Sábado 16 de enero de 2027'],
          ['Horario de largada', '09:00 hs'],
          ['Distancia', '3,5 km · recorrido punto a punto'],
          ['Cupos disponibles', '200 nadadores'],
          ['Tiempo estimado', 'Entre 40 minutos y 2 horas'],
          ['Tiempo límite', '2 h 20 min'],
          ['Condiciones del agua', 'Corriente a favor'],
          ['Uso de neopreno', 'Optativo · categoría única'],
          ['Requisitos', '14 años cumplidos'],
          ['Premiación', PREMIACION],
          ['Premiación con neopreno', PREMIACION_NEOPRENE],
          // Dato propio del mar: si la deriva va al sur, la largada se muda.
          ['Cambio de largada por deriva sur', 'Calypso Beach'],
        ],
      },
      {
        id: 'pnr-18k',
        torneo: 'ESPECIAL',
        titulo: '1,8 km',
        largada: 'CR Beach',
        llegada: 'Cocodrilo Beach',
        desc: 'Recorrido punto a punto pasando la segunda rompiente.',
        mapas: [
          {
            slug: 'mapa-pnr-18',
            alt: 'Mapa del recorrido de 1,8 km sobre la costa de Pinamar, con la largada al norte y la llegada en el balneario Cocodrilo',
          },
        ],
        ficha: [
          ['Fecha', 'Sábado 16 de enero de 2027'],
          ['Horario de largada', '09:30 hs'],
          ['Distancia', '1,8 km · recorrido punto a punto'],
          ['Cupos disponibles', '200 nadadores'],
          ['Tiempo estimado', 'Entre 25 y 60 minutos'],
          ['Tiempo límite', '1 h 30 min'],
          ['Condiciones del agua', 'Corriente a favor'],
          ['Uso de neopreno', 'Optativo · categoría única'],
          ['Requisitos', '14 años cumplidos'],
          ['Premiación', PREMIACION],
          ['Premiación con neopreno', PREMIACION_NEOPRENE],
          ['Cambio de largada por deriva sur', 'Av. Bunge'],
        ],
      },
    ],

    cronogramas: [
      {
        torneo: 'ESPECIAL',
        aviso: 'No se realizan inscripciones durante el evento.',
        dias: [
          {
            fecha: 'Viernes 15 de enero',
            lugar: 'Balneario Cocodrilo',
            items: [
              {
                hora: '15:00 a 17:30',
                t: 'Entrega de kits',
                d: 'Recepción de aptos médicos y firma de deslindes.',
              },
              {
                hora: '18:00',
                t: 'Clínica "Lectura e ingreso al mar"',
                d: 'Teoría y práctica. Gratuita para inscriptos.',
              },
            ],
          },
          {
            fecha: 'Sábado 16 de enero',
            lugar: 'Día del evento · Balneario Cocodrilo',
            items: [
              { hora: '07:00', t: 'Acreditaciones', d: 'Numeración, retiro de kit y certificados. Ambas distancias.' },
              { hora: '08:00', t: 'Reunión técnica · 3,5 km', d: '' },
              { hora: '08:10', t: 'Traslado a la largada · 3,5 km', d: '' },
              { hora: '08:35', t: 'Reunión técnica · 1,8 km', d: '' },
              { hora: '08:45', t: 'Traslado a la largada · 1,8 km', d: '' },
              { hora: '09:00', t: 'Largada · 3,5 km', d: 'Puntual.', destacado: true },
              { hora: '09:30', t: 'Largada · 1,8 km', d: 'Al paso de los punteros de 3,5 km.', destacado: true },
              { hora: '12:00', t: 'Inicio prueba Wave Relay', d: '', destacado: true },
              { hora: '12:30', t: 'Premiación', d: '' },
            ],
          },
        ],
      },
    ],

    kit: [
      { t: 'Gorra oficial', d: 'Incluida' },
      { t: 'Chip de cronometraje', d: 'Incluido' },
      { t: 'Numeración', d: 'Incluida' },
      { t: 'Medalla finisher', d: 'Incluida' },
      { t: 'Regalo OWA', d: 'Incluido' },
    ],
  },

  'cruce-del-nahuel': {
    sedeBarra: 'Museo Malvinas Antártida y Atlántico Sur, San Carlos de Bariloche',
    sedeCiudad: 'San Carlos de Bariloche, Río Negro, Argentina',

    // Especial: no puntúa para ningún campeonato, por eso el torneo dice
    // "ESPECIAL" y no hay fila de puntaje.
    distancias: [
      {
        rotulo: 'Larga',
        torneo: 'ESPECIAL',
        km: '8 km',
        nota: 'Única distancia del evento',
        cats: CATS_COMPLETAS,
      },
    ],

    recorridos: [
      {
        id: 'nhl-8k',
        torneo: 'ESPECIAL',
        titulo: '8 km',
        largada: 'Playa del Arroyo Castilla',
        llegada: 'Museo Malvinas del Atlántico Sur',
        // Propia, en vez de la frase de río que usan San Pedro y Colón: acá
        // se cruza un lago de punta a punta, no se nada punto a punto sobre
        // un río.
        desc: 'Recorrido punto a punto cruzando el lago Nahuel Huapi.',
        mapas: [
          {
            slug: 'mapa-nhl-8k',
            alt: 'Mapa del recorrido de 8 km cruzando el lago Nahuel Huapi, con la largada en Playa del Arroyo Castilla y la llegada en el Museo Malvinas del Atlántico Sur',
          },
        ],
        ficha: [
          // La fecha real depende de cuál de los tres días del período
          // ventana se confirme (ver el aviso del cronograma): "A confirmar"
          // y no una fecha puntual, para no inventar cuál de los tres es.
          ['Fecha', 'A confirmar'],
          ['Distancia', '8 km · recorrido punto a punto'],
          ['Cupos disponibles', '50 nadadores'],
          ['Tiempo estimado', 'Entre 2 h 20 min y 3 h 30 min'],
          ['Tiempo límite', '3 h 30 min'],
          ['Condiciones del agua', 'Sin corriente, con orientación de ola variable por viento'],
          ['Uso de neopreno', 'Obligatorio'],
          ['Requisitos', '14 años cumplidos y acreditar 1.000 m nadados en menos de 22 minutos'],
          // Propia y no la constante PREMIACION genérica: acá el desempate
          // por categoría es cada 10 años, no cada 5.
          ['Premiación', 'Generales 1 al 5 por género. 1, 2 y 3 por categoría cada 10 años'],
        ],
      },
    ],

    cronogramas: [
      {
        torneo: 'ESPECIAL',
        // Modalidad de período ventana: no hay un cronograma con fechas fijas
        // como en las demás carreras, sino un día previo y un día de
        // competencia que se ubican dentro de la ventana según el clima.
        aviso:
          'Modalidad de período ventana: la fecha definitiva se confirma unos días antes según el pronóstico y la autorización de Prefectura Naval Argentina. El cronograma se ajusta automáticamente al día elegido dentro del 16, 17 o 18 de febrero de 2027.',
        dias: [
          {
            fecha: 'Día previo a la competencia',
            lugar: 'Museo Malvinas Antártida y Atlántico Sur, San Carlos de Bariloche',
            items: [
              { hora: '14:00 a 16:00', t: 'Acreditaciones, entrega de kits y verificación médica', d: '' },
              { hora: '16:00', t: 'Charla técnica obligatoria', d: 'Para todos los/las participantes.' },
              { hora: '16:30', t: 'Visita guiada al museo', d: '' },
            ],
          },
          {
            fecha: 'Día de la competencia',
            lugar: 'Playa Museo / Puerto San Carlos → Arroyo Castilla',
            items: [
              {
                hora: '08:00',
                t: 'Embarque y traslado',
                d: 'En Playa Museo o Puerto San Carlos, hacia el punto de partida.',
              },
              {
                hora: '08:30',
                t: 'Largada · Grupo Lento',
                d: 'Desde Playa del Arroyo Castilla (Neuquén).',
                destacado: true,
              },
              { hora: '08:40', t: 'Largada · Grupo Rápido', d: '', destacado: true },
              {
                hora: '12:45',
                t: 'Ceremonia de premiación',
                d: 'Aproximada, en el Museo Malvinas Antártida y Atlántico Sur.',
              },
            ],
          },
        ],
      },
    ],
  },

  'vuelta-a-la-huemul': {
    // Sin la provincia acá: la línea de sede la arma el propio render pegando
    // sedeBarra + el resto de sedeCiudad (provincia, país) — repetirla acá
    // duplicaba "Río Negro" en el pie del hero.
    sedeBarra: 'Playa Bonita · Lago Nahuel Huapi',
    sedeCiudad: 'San Carlos de Bariloche, Río Negro, Argentina',

    // Tres distancias que puntúan para el propio circuito del evento (no para
    // Grand Prix ni Circuito OWA, por eso torneo: 'ESPECIAL' en las tres) más
    // dos prueblas de participación —Super Sprint y Kids— sin torneo asignado:
    // así quedan afuera de la pastilla de distancias del hero y del podio,
    // igual que Kids y OWA Relay en Luján.
    distancias: [
      { rotulo: 'Larga', torneo: 'ESPECIAL', km: '6,5 km', nota: 'Una vuelta a la isla Huemul.', cats: CATS_VHU },
      { rotulo: 'Media', torneo: 'ESPECIAL', km: '3 km', nota: 'Dos vueltas al circuito boyado.', cats: CATS_VHU },
      { rotulo: 'Corta', torneo: 'ESPECIAL', km: '1,5 km', nota: 'Una vuelta al circuito boyado.', cats: CATS_VHU },
      { rotulo: 'Super Sprint', km: '500 m', cats: 'Participativo · No competitivo' },
      { rotulo: 'Kids', km: '200 m', cats: 'Participativo · No competitivo' },
    ],

    recorridos: [
      {
        id: 'vhu-6-5k',
        torneo: 'ESPECIAL',
        titulo: '6,5 km',
        largada: 'Playa Bonita',
        llegada: 'Playa Bonita',
        desc: 'Bordea la isla Huemul en una vuelta completa, con largada y llegada en Playa Bonita.',
        mapas: [
          { slug: 'mapa-vhu-6-5k', alt: 'Mapa del recorrido de 6,5 km, con una vuelta completa a la isla Huemul' },
        ],
        // Cupos, tiempo estimado/límite, condiciones del agua, requisitos y
        // premiación: pendientes de que OWA los confirme. Sólo va lo que sí
        // está confirmado (fecha, distancia y que el neopreno es obligatorio).
        ficha: [
          ['Fecha', 'Sábado 20 de febrero de 2027'],
          ['Distancia', '6,5 km · una vuelta a la isla Huemul'],
          ['Uso de neopreno', 'Obligatorio'],
        ],
      },
      {
        id: 'vhu-3k',
        torneo: 'ESPECIAL',
        titulo: '3 km',
        largada: 'Playa Bonita',
        llegada: 'Playa Bonita',
        desc: 'Dos vueltas a un circuito boyado frente a Playa Bonita.',
        mapas: [{ slug: 'mapa-vhu-3k', alt: 'Mapa del recorrido de 3 km, dos vueltas a un circuito boyado' }],
        ficha: [
          ['Fecha', 'Sábado 20 de febrero de 2027'],
          ['Distancia', '3 km · dos vueltas al circuito boyado'],
          ['Uso de neopreno', 'Obligatorio'],
        ],
      },
      {
        id: 'vhu-1-5k',
        torneo: 'ESPECIAL',
        titulo: '1,5 km',
        largada: 'Playa Bonita',
        llegada: 'Playa Bonita',
        desc: 'Una vuelta a un circuito boyado frente a Playa Bonita.',
        mapas: [{ slug: 'mapa-vhu-1-5k', alt: 'Mapa del recorrido de 1,5 km, una vuelta a un circuito boyado' }],
        ficha: [
          ['Fecha', 'Sábado 20 de febrero de 2027'],
          ['Distancia', '1,5 km · una vuelta al circuito boyado'],
          ['Uso de neopreno', 'Obligatorio'],
        ],
      },
    ],

    cronogramas: [
      {
        torneo: 'ESPECIAL',
        dias: [
          {
            fecha: 'Viernes 19 de febrero',
            lugar: 'Kuntzmann, Av. Ezequiel Bustillo 7966',
            items: [
              {
                hora: '13:00 a 16:00',
                t: 'Entrega de kits',
                d: 'Recepción de aptos médicos y firma de deslindes. No se realizan inscripciones este día.',
              },
            ],
          },
          {
            fecha: 'Sábado 20 de febrero · Día del evento',
            lugar: 'Playa Bonita, debajo del Apart del Lago. Ingreso por Playa Pública.',
            items: [
              { hora: '07:45', t: 'Recepción de nadadores 6,5 km', d: '' },
              { hora: '08:45', t: 'Charla técnica 6,5 km', d: '' },
              { hora: '08:55', t: 'Largada 6,5 km · Grupo lento', d: '', destacado: true },
              { hora: '09:00', t: 'Largada 6,5 km', d: '', destacado: true },
              { hora: '09:30', t: 'Recepción de nadadores 1,5 km, 3 km y Kids', d: '' },
              { hora: '11:45', t: 'Charla técnica 3 km y 1,5 km', d: '' },
              { hora: '12:00', t: 'Largada 3 km', d: '', destacado: true },
              { hora: '12:10', t: 'Largada 1,5 km', d: '', destacado: true },
              { hora: '13:30', t: 'Largada Super Sprint', d: '', destacado: true },
              { hora: '13:40', t: 'Largada Kids', d: '', destacado: true },
              { hora: '14:15', t: 'Premiación', d: '' },
            ],
          },
        ],
      },
    ],

    kit: [
      { t: 'Gorra oficial', d: 'Incluida' },
      { t: 'Chip de cronometraje', d: 'Incluido' },
      { t: 'Numeración', d: 'Incluida' },
      { t: 'Medalla finisher', d: 'Incluida' },
      { t: 'Regalo OWA', d: 'Incluido' },
    ],
  },

  // Cierre de temporada del Circuito OWA, en la misma sede que San Pedro pero
  // sin las pruebas complementarias (arena Super Sprint y Kid): acá son dos
  // distancias, punto.
  'maraton-acuatica-san-pedro': {
    sedeBarra: 'Camping Club América, San Pedro',
    sedeCiudad: 'San Pedro, Buenos Aires, Argentina',

    distancias: [
      { rotulo: 'Larga', torneo: 'ESPECIAL', km: '7 km', nota: 'Distancia larga de la Maratón.', cats: CATS_COMPLETAS },
      { rotulo: 'Corta', torneo: 'ESPECIAL', km: '4 km', nota: 'Distancia corta de la Maratón.', cats: CATS_COMPLETAS },
    ],

    // Mismos recorridos que corre el Circuito OWA en San Pedro (mismos mapas,
    // misma largada y llegada): es el mismo río, no una carrera distinta.
    recorridos: [
      {
        id: 'maraton-7k',
        torneo: 'ESPECIAL',
        titulo: '7 km',
        largada: 'Apart',
        llegada: 'San Pedro',
        mapas: [{ slug: 'mapa-spd-7k', alt: 'Mapa del recorrido de 7 km, desde el apart hasta la llegada' }],
        ficha: [
          ['Fecha', 'Sábado 10 de abril de 2027'],
          ['Horario de largada', '10:30 hs'],
          ['Distancia', '7 km · recorrido punto a punto'],
          ['Uso de neopreno', 'Optativo'],
        ],
      },
      {
        id: 'maraton-4k',
        torneo: 'ESPECIAL',
        titulo: '4 km',
        largada: 'Cantando',
        llegada: 'San Pedro',
        mapas: [{ slug: 'mapa-spd-4k', alt: 'Mapa del recorrido de 4 km, desde Cantando hasta la llegada' }],
        ficha: [
          ['Fecha', 'Sábado 10 de abril de 2027'],
          ['Horario de largada', '12:30 hs'],
          ['Distancia', '4 km · recorrido punto a punto'],
          ['Uso de neopreno', 'Optativo'],
        ],
      },
    ],

    // Calco del cronograma del domingo de San Pedro (mismos horarios), corrido
    // un día para atrás — viernes de entrega de kits, sábado de carrera— y sin
    // los bloques de arena Super Sprint y Kid, que esta fecha no tiene.
    cronogramas: [
      {
        torneo: 'ESPECIAL',
        aviso: 'No se realizan inscripciones presenciales durante el evento.',
        dias: [
          {
            fecha: 'Viernes 9 de abril',
            lugar: 'Camping América · San Pedro',
            items: [
              {
                hora: '17:00 a 19:00',
                t: 'Entrega de kits',
                d: 'Aptos médicos y firma de deslindes. Para las dos pruebas: 7 km y 4 km.',
              },
            ],
          },
          {
            fecha: 'Sábado 10 de abril',
            lugar: 'Día del evento',
            items: [
              { hora: '07:45', zona: 'Zona de acreditación', t: 'Entrega de kits · 7 km', d: 'Aptos médicos, deslindes y numeración.' },
              { hora: '09:30', zona: 'Zona central', t: 'Charla técnica obligatoria · 7 km', d: '' },
              { hora: '09:40', t: 'Partida de micros', d: 'Hacia el punto de largada de 7 km.' },
              { hora: '09:50', zona: 'Zona de acreditación', t: 'Entrega de kits · 4 km', d: 'Aptos médicos, deslindes y numeración.' },
              { hora: '10:00', zona: 'Zona de largada 7 km', t: 'Acreditación final', d: 'Checklist.' },
              { hora: '10:20', t: 'Largada grupo 1 · 7 km', d: 'Ritmo lento. Puntual.' },
              { hora: '10:30', t: 'Largada grupo general · 7 km', d: 'Puntual.', destacado: true },
              { hora: '12:00', zona: 'Zona central', t: 'Charla técnica obligatoria · 4 km', d: '' },
              { hora: '12:10', t: 'Partida de micros', d: 'Hacia el punto de largada de 4 km.' },
              { hora: '12:20', zona: 'Zona de largada 4 km', t: 'Acreditación final', d: 'Checklist.' },
              { hora: '12:30', t: 'Largada única · 4 km', d: 'Puntual.', destacado: true },
              { hora: '15:00', t: 'Ceremonia de premiación general', d: 'Camping América.' },
            ],
          },
        ],
      },
    ],

    kit: [
      { t: 'Gorra oficial', d: 'Incluida' },
      { t: 'Chip de cronometraje', d: 'Incluido' },
      { t: 'Numeración', d: 'Incluida' },
      { t: 'Medalla finisher', d: 'Incluida' },
      { t: 'Regalo OWA', d: 'Incluido' },
    ],
  },

};

export const fichaDe = (slug) => FICHAS[slug] || null;
