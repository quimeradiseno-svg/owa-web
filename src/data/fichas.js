// Ficha real de cada carrera, por slug. Lo que una carrera no defina acá cae
// en el EVENTO_FICHA genérico de madres.js, que sigue siendo placeholder.
//
// Datos pasados por OWA. Por decisión de la organización, el sitio no publica
// detalles de inscripción más allá del link a Cronometraje Instantáneo.

const CATS_COMPLETAS = 'Género · Edades · Neopreno';

// Se repiten idénticas en las tres distancias.
const PREMIACION = 'Generales 1 al 5 por género. 1 al 3 por categorías cada 5 años, por género';
const PREMIACION_NEOPRENE = 'Generales 1 al 3 por género';
const AGUA = 'Entre 23 y 26 °C, sin visibilidad, con corriente a favor';

export const FICHAS = {
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
      { t: 'Productos de auspiciantes', nota: true },
    ],
    kitNota: 'Según disponibilidad.',
  },
};

export const fichaDe = (slug) => FICHAS[slug] || null;
