// Resultados por carrera, temporada a temporada — todo lo que en owa.com.ar
// eran ~55 botones "ver resultados" (la mayoría rotos o duplicados, ver
// auditoría en el chat) se arma acá a mano con los links que confirma OWA.
//
// Agrupado por TEMPORADA y no por año calendario: una temporada cruza el
// verano (arranca en octubre/noviembre, cierra en marzo/abril del año
// siguiente), así que "10 de noviembre de 2024" y "6 de abril de 2025" son
// la misma temporada 24/25 y acá van juntas, aunque en el sitio viejo
// estuvieran repartidas entre el bloque "2024" y el "2025".
//
// Cada carrera de una temporada:
//   sigla    — la de siempre (VOB, SPD, LBC...)
//   nombre   — nombre propio de la fecha, no de la sede genérica
//   fecha    — como se muestra, ya redactada (no se calcula)
//   sede     — ciudad · provincia
//   etapa    — qué fue dentro de esa temporada (torneo + número de fecha)
//   url      — resultados en Cronometraje Instantáneo (se abre aparte)
//
// Una carrera sin `url` todavía no tiene el link confirmado: se muestra
// igual, en gris, sin CTA — nunca un botón que no lleva a ningún lado (ese
// era justo el problema del sitio viejo).
import { EVENTOS } from './eventos.js';
import { FICHAS } from './fichas.js';

/** Resultados de la temporada en curso: se pega la URL cuando la fecha se
    corre y listo. Todo lo demás (nombre, sede, fecha, sigla) sale del
    calendario, así una fecha que se mueve se corrige en un solo lugar.

    Las 4 fechas puntuables son 8 carreras: cada una corre su clasificación de
    Grand Prix y la de Circuito por separado. Por eso el valor es un objeto
    con una URL por torneo:

      'san-pedro': {
        'GRAND PRIX': 'https://…',     // VOB, sábado
        'CIRCUITO OWA': 'https://…',   // SPD, domingo
      },

    Si OWA publica las dos clasificaciones en una sola tabla —pasó en 25/26
    con Liebig a Colón, cuyo link dice "gp-circuito"— se pone un string suelto
    y las dos se muestran juntas en una fila. Los especiales, que corren una
    sola clasificación, también llevan string. */
const EN_CURSO = {
  // lujan: { 'GRAND PRIX': 'https://…', 'CIRCUITO OWA': 'https://…' },
  // pinamar: 'https://…',
};

const MESES_NOM = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

/** 'DD/MM/YYYY' -> '31 de octubre de 2026'. A mano y no con Intl: el prerender
    corre en Node y no toda build trae el ICU completo — sin datos de español
    devolvería el mes en inglés y recién se vería en producción. */
const fechaLegible = (f) => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(f || '');
  return m ? `${Number(m[1])} de ${MESES_NOM[Number(m[2]) - 1]} de ${m[3]}` : '';
};

const MES_ABR = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

/** '7 de noviembre de 2021' -> '7 NOV 2021', para las tarjetas del listado.
    Devuelve '' cuando la fecha no es un día único —"16, 17 o 18 de febrero"—
    y ahí la tarjeta muestra el texto largo tal cual: acortarlo elegiría uno
    de los tres días por su cuenta. */
export const fechaCorta = (larga) => {
  if (/,| o | y /.test(larga || '')) return '';
  const t = /(\d{1,2}) de ([a-záéíóúñ]+) de (\d{4})/i.exec(larga || '');
  const i = t ? MESES_NOM.indexOf(t[2].toLowerCase()) : -1;
  return i < 0 ? '' : `${Number(t[1])} ${MES_ABR[i]} ${t[3]}`;
};

const MES_NUM = { enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6, julio: 7, agosto: 8, septiembre: 9, octubre: 10, noviembre: 11, diciembre: 12 };

/** Fecha de largada en ISO, sólo cuando es inequívoca — la usa el contador de
    días. Sale de la primera jornada (DD/MM/YYYY, sin ambigüedad posible); un
    evento sin jornadas la saca de `fechaLarga`, pero únicamente si nombra un
    día solo: "16, 17 o 18 de febrero" es una ventana que OWA todavía no
    cerró, y un contador ahí afirmaría un día que nadie confirmó. */
const fechaExacta = (e) => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(e.jornadas?.[0]?.fecha || '');
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;

  const larga = e.fechaLarga || '';
  if (/,| o | y /.test(larga)) return null;
  const t = /(\d{1,2}) de ([a-záéíóúñ]+) de (\d{4})/i.exec(larga);
  const mes = t && MES_NUM[t[2].toLowerCase()];
  return mes ? `${t[3]}-${String(mes).padStart(2, '0')}-${t[1].padStart(2, '0')}` : null;
};

/** El predio donde se corre, sin repetir la ciudad que ya va al lado:
    "Awass Beach Club · Surf Village, Luján" -> "Awass Beach Club · Surf Village". */
const predioDe = (slug) => (FICHAS[slug]?.sedeBarra || '').split(',')[0].trim();

/** Hora de la primera largada, sacada del cronograma de la ficha. Sin ella el
    contador se queda en días: contar horas y minutos hacia una fecha sin
    horario sería contar hasta la medianoche, que no es cuando se larga. */
const largadaDe = (slug) => {
  for (const c of FICHAS[slug]?.cronogramas || [])
    for (const d of c.dias || [])
      for (const i of d.items || []) {
        const m = i.destacado && /^(\d{2}):(\d{2})$/.exec(i.hora || '');
        if (m) return `${m[1]}:${m[2]}`;
      }
  return '';
};

/** Las filas de una fecha del calendario.

    Una fecha puntuable son dos carreras —la de Grand Prix y la de Circuito—,
    y cada una tiene su propia tabla en Cronometraje. Van como dos filas y no
    como una fila con dos botones: salvo Luján, las dos se corren en días
    distintos y cada una tiene sigla y nombre propios (San Pedro es "Vuelta de
    Obligado" el sábado y "San Pedro" el domingo). Una fila sola tendría que
    mostrar las dos fechas juntas y dejar al nadador adivinando cuál botón
    corresponde a qué día.

    El `evento` viaja en cada fila para la tarjeta destacada: lo próximo que
    pasa es la carrera entera, no una de sus dos clasificaciones. */
const carrerasDe = (e) => {
  const links = EN_CURSO[e.slug];
  const comun = {
    sede: e.sede,
    evento: {
      nombre: e.nombre,
      slug: e.slug,
      sede: e.sede,
      fecha: e.fechaLarga,
      fechaISO: fechaExacta(e),
      predio: predioDe(e.slug),
      hora: largadaDe(e.slug),
      // La misma foto de la tarjeta del calendario: no hay que curar una
      // imagen aparte para el banner de resultados.
      foto: e.img,
      torneo: e.tipo === 'core' ? 'GRAND PRIX Y CIRCUITO' : 'EVENTO ESPECIAL',
      etapa: '',
    },
  };

  // Un especial corre una sola clasificación; una fecha puntuable con las dos
  // clasificaciones en una misma tabla, también se muestra en una sola fila.
  if (!e.jornadas?.length || typeof links === 'string')
    return [
      {
        ...comun,
        sigla: e.sigla,
        nombre: e.nombre,
        torneo: comun.evento.torneo,
        etapa: '',
        fecha: e.fechaLarga,
        url: typeof links === 'string' ? links : '',
      },
    ];

  return e.jornadas.map((j) => ({
    ...comun,
    sigla: j.sigla,
    nombre: j.nombreLargo || e.nombre,
    torneo: j.torneo,
    etapa: '',
    fecha: fechaLegible(j.fecha) || e.fechaLarga,
    url: links?.[j.torneo] || '',
  }));
};

// Todas las fechas de la temporada en curso, corridas o no. Los Challenge
// quedan afuera: son travesías con ventana de cruce, no fechas cronometradas
// con tabla de resultados.
const CARRERAS_EN_CURSO = EVENTOS.flatMap(carrerasDe);

/** Las fechas de la temporada en curso agrupadas por evento, para la tarjeta
    de arriba: lo que se viene es la carrera entera, no una de sus dos
    clasificaciones. */
const EVENTOS_EN_CURSO = EVENTOS.map((e) => {
  const carreras = carrerasDe(e);
  return { ...carreras[0].evento, carreras };
});

/** La temporada que se está corriendo, para encabezar la página. Sale de acá
    y no escrita a mano: al abrir la temporada siguiente se cambia una vez y
    el hero acompaña solo. */
export const TEMPORADA_ACTUAL = '2026/27';

const TEMPORADA_EN_CURSO = {
  id: '26-27',
  label: TEMPORADA_ACTUAL,
  enCurso: true,
  // Sólo lo que ya se corrió. Listar abajo las fechas que faltan sería repetir
  // el calendario, que ya es una sección propia del sitio: lo que viene se
  // muestra una sola vez, en la tarjeta de arriba.
  carreras: CARRERAS_EN_CURSO.filter((c) => c.url),
};

// De más reciente a más vieja. Dentro de cada temporada, las carreras van en
// orden cronológico ascendente (fecha 1 primero): así `destacada()` toma la
// última corrida con `.at(-1)` y el listado se lee como el calendario que fue.
export const TEMPORADAS = [
  TEMPORADA_EN_CURSO,
  {
    id: '25-26',
    label: '2025/26',
    carreras: [
      {
        sigla: 'VOB',
        nombre: 'Vuelta de Obligado',
        fecha: '29 de noviembre de 2025',
        sede: 'San Pedro · Buenos Aires',
        torneo: 'GRAND PRIX',
        etapa: 'Fecha 1',
        url: 'https://cronometrajeinstantaneo.com/resultados/vuelta-de-obligado-vob-gp-owa/filtros',
      },
      {
        sigla: 'SPD',
        nombre: 'San Pedro',
        // OWA pasó esta edición como "2025 diciembre", pero su propia página
        // de resultados la publica el 30 de noviembre. Va la fecha de la
        // página hasta que confirmen cuál de las dos es.
        fecha: '30 de noviembre de 2025',
        sede: 'San Pedro · Buenos Aires',
        torneo: 'CIRCUITO OWA',
        etapa: 'Fecha 1',
        url: 'https://cronometrajeinstantaneo.com/resultados/san-pedro-spd-circuito-owa-2526/filtros',
      },
      {
        sigla: 'PNR',
        nombre: 'Open Water Pinamar',
        fecha: '17 de enero de 2026',
        sede: 'Pinamar · Buenos Aires',
        torneo: 'CIRCUITO OWA',
        etapa: 'Fecha 3',
        url: 'https://cronometrajeinstantaneo.com/resultados/pinamar-pnr-circuito-owa-2526/filtros',
      },
      {
        sigla: 'VHU',
        nombre: 'Vuelta a la Huemul',
        fecha: '21 de febrero de 2026',
        sede: 'Bariloche · Río Negro',
        torneo: 'CIRCUITO OWA',
        etapa: 'Fecha 4',
        url: 'https://cronometrajeinstantaneo.com/resultados/vuelta-a-la-huemul-vhu-circuito-owa-2526/filtros',
      },
      {
        sigla: 'PAD',
        nombre: 'Puerto Alto Delta',
        fecha: '12 de abril de 2026',
        sede: 'Villa Paranacito · Entre Ríos',
        torneo: 'CIRCUITO OWA',
        etapa: 'Fecha final',
        url: 'https://cronometrajeinstantaneo.com/resultados/puerto-alto-delta-pad-circuito-owa-2526-final/filtros',
      },
      // Falta LBC (Liebig a Colón, 13/12/2025). El link está en la página
      // vieja de OWA pero todavía no lo confirmaron en la lista que mandaron.
    ],
  },
  {
    id: '24-25',
    label: '2024/25',
    carreras: [
      {
        sigla: 'SPD',
        nombre: 'San Pedro',
        fecha: '9 de noviembre de 2024',
        sede: 'San Pedro · Buenos Aires',
        torneo: 'CIRCUITO OWA',
        etapa: 'Etapa 1',
        url: 'https://cronometrajeinstantaneo.com/resultados/etapa-san-pedro-spd/filtros',
      },
      {
        sigla: 'VOB',
        nombre: 'Vuelta de Obligado',
        fecha: '10 de noviembre de 2024',
        sede: 'San Pedro · Buenos Aires',
        torneo: 'GRAND PRIX',
        etapa: 'Etapa 1',
        url: 'https://cronometrajeinstantaneo.com/resultados/etapa-vuelta-de-obligado-vob/filtros',
      },
      {
        sigla: 'LBC',
        nombre: 'Liebig a Colón',
        fecha: '14 y 15 de diciembre de 2024',
        sede: 'Colón · Entre Ríos',
        // Las dos competencias en una sola tabla, como las publicó OWA.
        torneo: 'GRAND PRIX y CIRCUITO OWA',
        etapa: 'Etapa 2',
        url: 'https://cronometrajeinstantaneo.com/resultados/etapa-liebig-colon-lbc/generales',
      },
      {
        sigla: 'PNR',
        nombre: 'Open Water Pinamar',
        fecha: '4 de enero de 2025',
        sede: 'Pinamar · Buenos Aires',
        torneo: 'CIRCUITO OWA',
        etapa: 'Etapa 3',
        url: 'https://cronometrajeinstantaneo.com/resultados/etapa-pinamar-pnr/filtros',
      },
      {
        sigla: 'CDM',
        nombre: 'Cruce del Moreno',
        fecha: '16 de febrero de 2025',
        sede: 'Bariloche · Río Negro',
        torneo: 'GRAND PRIX y CIRCUITO OWA',
        etapa: '',
        url: 'https://cronometrajeinstantaneo.com/resultados/etapa-cruce-del-moreno-cdm/generales',
      },
      {
        sigla: 'VHU',
        nombre: 'Vuelta a la Huemul',
        fecha: '22 de febrero de 2025',
        sede: 'Bariloche · Río Negro',
        torneo: 'CIRCUITO OWA',
        etapa: 'Etapa 5',
        url: 'https://cronometrajeinstantaneo.com/resultados/etapa-vuelta-a-la-huemul-vhu/filtros',
      },
      {
        sigla: 'ISC',
        nombre: 'Isla Caraballo',
        fecha: '15 de marzo de 2025',
        sede: 'Colón · Entre Ríos',
        torneo: 'GRAND PRIX',
        etapa: 'Etapa 4',
        url: 'https://cronometrajeinstantaneo.com/resultados/etapa-isla-caraballo-isc/filtros',
      },
      {
        sigla: 'CLN',
        nombre: 'Colón',
        fecha: '16 de marzo de 2025',
        sede: 'Colón · Entre Ríos',
        torneo: 'CIRCUITO OWA',
        etapa: 'Etapa 6',
        url: 'https://cronometrajeinstantaneo.com/resultados/etapa-colon-cln/filtros',
      },
      {
        sigla: 'PAD',
        nombre: 'Puerto Alto Delta',
        fecha: '6 de abril de 2025',
        sede: 'Villa Paranacito · Entre Ríos',
        torneo: 'GRAND PRIX y CIRCUITO OWA',
        etapa: '',
        url: 'https://cronometrajeinstantaneo.com/resultados/etapa-final-puerto-alto-delta-pad/filtros',
      },
    ],
  },
  {
    id: '23-24',
    label: '2023/24',
    carreras: [
      {
        sigla: 'SPD',
        nombre: 'San Pedro',
        // OWA pasó el mes, no el día.
        fecha: 'Noviembre de 2023',
        sede: 'San Pedro · Buenos Aires',
        torneo: 'CIRCUITO OWA',
        etapa: 'Etapa 2',
        url: 'https://cronometrajeinstantaneo.com/resultados/san-pedro-spd-etapa-2-circuito-owa-2324/filtros',
      },
      {
        sigla: 'VOB',
        nombre: 'Vuelta de Obligado',
        // Pendiente: el sitio viejo no publica la fecha exacta de esta
        // edición (el link estaba roto ahí). Confirmar con OWA.
        fecha: '',
        sede: 'San Pedro · Buenos Aires',
        torneo: 'CIRCUITO OWA',
        etapa: 'Etapa 3',
        url: 'https://cronometrajeinstantaneo.com/resultados/vuelta-de-obligado-vob-etapa-3-circuito-owa-2324/filtros',
      },
      {
        sigla: 'PNR',
        nombre: 'Open Water Pinamar',
        // OWA la listó sólo como "2024". Por el número de etapa cae en enero,
        // pero la fecha exacta queda pendiente de confirmación.
        fecha: '2024',
        sede: 'Pinamar · Buenos Aires',
        torneo: 'CIRCUITO OWA',
        etapa: 'Etapa 5',
        url: 'https://cronometrajeinstantaneo.com/resultados/pinamar-pnr-etapa-5-circuito-owa-2324/filtros',
      },
      {
        sigla: 'VHU',
        nombre: 'Vuelta a la Huemul',
        // Ídem: OWA la listó sólo como "2024".
        fecha: '2024',
        sede: 'Bariloche · Río Negro',
        torneo: 'CIRCUITO OWA',
        etapa: 'Etapa 7',
        url: 'https://cronometrajeinstantaneo.com/resultados/vuelta-a-la-huemul-vhu-etapa-7-circuito-owa-2324/filtros',
      },
      // Falta PAD 2024: el link que mandó OWA apunta al panel de
      // administración de Cronometraje (admin…/inicio), no a un resultado.
    ],
  },
  {
    id: '22-23',
    label: '2022/23',
    carreras: [
      {
        sigla: 'SPD',
        nombre: 'San Pedro',
        fecha: '5 de noviembre de 2022',
        sede: 'San Pedro · Buenos Aires',
        torneo: 'CIRCUITO OWA',
        etapa: 'Etapa 2',
        url: 'https://cronometrajeinstantaneo.com/resultados/san-pedro---etapa-2---circuito-owa-2223/filtros',
      },
      {
        sigla: 'VOB',
        nombre: 'Vuelta de Obligado 20k',
        fecha: '6 de noviembre de 2022',
        sede: 'San Pedro · Buenos Aires',
        torneo: 'CIRCUITO OWA',
        etapa: 'Etapa 3',
        url: 'https://cronometrajeinstantaneo.com/resultados/vuelta-de-obligado-2022---vob20k---fecha-3/filtros',
      },
      {
        sigla: 'PNR',
        nombre: 'Open Water Pinamar',
        fecha: '17 de diciembre de 2022',
        sede: 'Pinamar · Buenos Aires',
        torneo: 'CIRCUITO OWA',
        etapa: 'Etapa 5',
        url: 'https://cronometrajeinstantaneo.com/resultados/pinamar---etapa-5---circuito-owa-2223/filtros',
      },
      {
        sigla: 'VHU',
        nombre: 'Vuelta a la Huemul',
        fecha: '25 de febrero de 2023',
        sede: 'Bariloche · Río Negro',
        torneo: 'CIRCUITO OWA',
        etapa: 'Etapa 7',
        url: 'https://cronometrajeinstantaneo.com/resultados/vuelta-a-la-huemul-etapa-7-circuito-owa-2223/filtros',
      },
      {
        sigla: 'PAD',
        nombre: 'Puerto Alto Delta',
        fecha: '19 de marzo de 2023',
        sede: 'Villa Paranacito · Entre Ríos',
        torneo: 'CIRCUITO OWA',
        etapa: 'Etapa 8',
        url: 'https://cronometrajeinstantaneo.com/resultados/puerto-alto-delta-etapa-8-circuito-owa-2223/filtros',
      },
      {
        sigla: 'SPD',
        nombre: 'San Pedro',
        // Segunda vez de San Pedro en la misma temporada: abrió la 22/23 en
        // noviembre y la cerró en abril. OWA pasó el mes, no el día.
        fecha: 'Abril de 2023',
        sede: 'San Pedro · Buenos Aires',
        torneo: 'CIRCUITO OWA',
        etapa: 'Etapa final',
        url: 'https://cronometrajeinstantaneo.com/resultados/san-pedro-etapa-final-circuito-owa-2223/filtros',
      },
    ],
  },
  {
    id: '21-22',
    label: '2021/22',
    carreras: [
      {
        sigla: 'SPD',
        nombre: 'San Pedro',
        fecha: '6 de noviembre de 2021',
        sede: 'San Pedro · Buenos Aires',
        torneo: 'CIRCUITO OWA',
        etapa: 'Etapa 1',
        url: 'https://cronometrajeinstantaneo.com/resultados/san-pedro/filtros',
      },
      {
        sigla: 'VOB',
        nombre: 'Vuelta de Obligado 20k',
        fecha: '7 de noviembre de 2021',
        sede: 'San Pedro · Buenos Aires',
        torneo: 'CIRCUITO OWA',
        etapa: 'Etapa 2',
        url: 'https://cronometrajeinstantaneo.com/resultados/vuelta-de-obligado-20k/filtros',
      },
      {
        sigla: 'PNR',
        nombre: 'Open Water Pinamar',
        fecha: '19 de diciembre de 2021',
        sede: 'Pinamar · Buenos Aires',
        torneo: 'CIRCUITO OWA',
        etapa: 'Etapa 3',
        url: 'https://cronometrajeinstantaneo.com/resultados/open-water-pinamar/filtros',
      },
      {
        sigla: 'VHU',
        nombre: 'Vuelta a la Huemul',
        fecha: '26 de febrero de 2022',
        sede: 'Bariloche · Río Negro',
        torneo: 'CIRCUITO OWA',
        etapa: 'Etapa 5',
        url: 'https://cronometrajeinstantaneo.com/resultados/vuelta-a-la-huemul-2022/filtros',
      },
      {
        sigla: 'PAD',
        nombre: 'Puerto Alto Delta',
        fecha: '20 de marzo de 2022',
        sede: 'Villa Paranacito · Entre Ríos',
        torneo: 'CIRCUITO OWA',
        etapa: 'Etapa 6',
        url: 'https://cronometrajeinstantaneo.com/resultados/puerto-alto-delta-2022/filtros',
      },
      {
        sigla: 'SPD',
        nombre: 'San Pedro',
        // Igual que en la 22/23: San Pedro abrió y cerró la temporada.
        fecha: '10 de abril de 2022',
        sede: 'San Pedro · Buenos Aires',
        torneo: 'CIRCUITO OWA',
        etapa: 'Etapa final',
        url: 'https://cronometrajeinstantaneo.com/resultados/san-pedro-2022/filtros',
      },
    ],
  },
  {
    id: '20-21',
    label: '2020/21',
    carreras: [
      {
        sigla: 'VHU',
        nombre: 'Vuelta a la Huemul',
        fecha: '27 de febrero de 2021',
        sede: 'Bariloche · Río Negro',
        torneo: 'CIRCUITO OWA',
        etapa: '',
        url: 'https://cronometrajeinstantaneo.com/resultados/vuelta-a-la-huemul-2021/filtros',
      },
    ],
  },
  {
    id: '19-20',
    label: '2019/20',
    carreras: [
      {
        sigla: 'PAD',
        nombre: 'Puerto Alto Delta',
        fecha: '8 de diciembre de 2019',
        sede: 'Villa Paranacito · Entre Ríos',
        torneo: 'CIRCUITO OWA',
        etapa: 'Etapa 2',
        url: 'https://cronometrajeinstantaneo.com/resultados/etapa-2---puerto-alto-delta/filtros',
      },
      {
        sigla: 'VHU',
        nombre: 'Vuelta a la Huemul',
        fecha: '29 de febrero de 2020',
        sede: 'Bariloche · Río Negro',
        torneo: 'CIRCUITO OWA',
        etapa: 'Etapa 3',
        url: 'https://cronometrajeinstantaneo.com/resultados/vuelta-a-la-huemul-2020/filtros',
      },
    ],
  },
  {
    id: '18-19',
    label: '2018/19',
    carreras: [
      {
        sigla: 'VHU',
        nombre: 'Vuelta a la Huemul',
        fecha: '2 de marzo de 2019',
        sede: 'Bariloche · Río Negro',
        // Sin torneo: en esas ediciones la Huemul todavía no puntuaba para
        // ningún campeonato, se corría suelta.
        torneo: '',
        etapa: '',
        url: 'https://cronometrajeinstantaneo.com/resultados/vuelta-a-la-huemul--2019/filtros',
      },
    ],
  },
  {
    id: '17-18',
    label: '2017/18',
    carreras: [
      {
        sigla: 'VHU',
        nombre: 'Vuelta a la Huemul Sailfish',
        fecha: '3 de marzo de 2018',
        sede: 'Bariloche · Río Negro',
        torneo: '',
        etapa: '',
        url: 'https://cronometrajeinstantaneo.com/resultados/vuelta-a-la-huemul-sailfish/filtros',
      },
    ],
  },
];

/** Todas las ediciones de una carrera, de la más nueva a la más vieja.

    Es el mismo dato que arma el listado por temporada de /resultados, leído
    al revés: OWA lleva su archivo por carrera ("la Huemul tiene nueve
    ediciones") y el nadador que entra a una ficha se pregunta lo mismo. Con
    una sola fuente las dos vistas no se pueden contradecir.

    Recibe varias siglas porque una fecha puede correr dos competencias con
    nombre propio: la ficha de San Pedro es la casa de VOB y de SPD. */
export const edicionesDe = (siglas) => {
  const busco = new Set([].concat(siglas).filter(Boolean));
  return TEMPORADAS.flatMap((t) =>
    t.carreras
      .filter((c) => busco.has(c.sigla) && c.url)
      // Dentro de la temporada las carreras van de la más vieja a la más
      // nueva; acá se listan al revés, así que se dan vuelta también adentro.
      .slice()
      .reverse()
      .map((c) => ({ ...c, temporada: t.label }))
  );
};

/** Qué va en la tarjeta destacada, arriba de todo.

    Con la temporada ya arrancada manda el último resultado publicado. Hasta
    entonces —que es donde estamos hoy— manda la fecha que viene, con su
    cuenta regresiva: mostrar como destacado un resultado de la temporada
    pasada, cuando lo próximo que va a pasar es Luján, sería mirar para atrás.

    Devuelve `{ modo, carrera, temporada }`, o null si no hay ni una ni otra. */
export const destacada = () => {
  // La fecha que se viene es la primera cuyo día todavía no pasó. El día de la
  // carrera sigue siendo ésta —diasHasta da 0—, así que cuando OWA carga el
  // resultado la misma tarjeta cambia el contador por el link, sin saltar a la
  // fecha siguiente. Las de fecha ambigua (Cruce del Nahuel, "16, 17 o 18")
  // no entran en la cuenta: no se puede afirmar si ya pasaron.
  const proximo = EVENTOS_EN_CURSO.find((e) => e.fechaISO && diasHasta(e.fechaISO) >= 0);

  if (proximo) {
    const conResultado = proximo.carreras.filter((c) => c.url);
    return conResultado.length
      ? { modo: 'corrida', evento: proximo, carreras: conResultado }
      : { modo: 'proxima', evento: proximo };
  }

  // Temporada terminada: queda a la vista el último resultado publicado.
  const ultima = CARRERAS_EN_CURSO.filter((c) => c.url).at(-1);
  return ultima ? { modo: 'corrida', evento: ultima.evento, carreras: [ultima] } : null;
};

/** Lo que falta para la largada, desglosado. La hora se fija en UTC-3 y no
    en la del visitante: la carrera larga a las 12 de Argentina, así que desde
    España o Brasil el contador tiene que marcar lo mismo. Argentina no mueve
    la hora en todo el año, así que el desfase es fijo y no hay que consultar
    ninguna tabla de husos.

    Sin `hora` cuenta hasta el arranque del día, y ahí sólo se muestran los
    días: publicar horas y minutos hacia una medianoche en la que nadie larga
    sería un número inventado. */
export const restante = (iso, hora = '') => {
  if (!iso) return null;
  const [a, m, d] = iso.split('-').map(Number);
  const [hh, mm] = (hora || '00:00').split(':').map(Number);
  const ms = Date.UTC(a, m - 1, d, hh + 3, mm) - Date.now();
  if (ms <= 0) return { pasado: true, dias: 0, horas: 0, minutos: 0, segundos: 0 };

  const seg = Math.floor(ms / 1000);
  return {
    pasado: false,
    dias: Math.floor(seg / 86400),
    horas: Math.floor((seg % 86400) / 3600),
    minutos: Math.floor((seg % 3600) / 60),
    segundos: seg % 60,
  };
};

/** Días entre hoy y una fecha ISO. En UTC las dos puntas, así un cambio de
    horario de verano no suma ni resta un día fantasma. */
export const diasHasta = (iso) => {
  if (!iso) return null;
  const [a, m, d] = iso.split('-').map(Number);
  const hoy = new Date();
  return Math.round(
    (Date.UTC(a, m - 1, d) - Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())) / 86400000
  );
};
