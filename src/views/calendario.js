import { html, raw, toHTML, stagger } from '../lib/html.js';
import { foto } from '../lib/img.js';
import { EVENTOS, ALL, MESES, ESTADOS, sinIngreso } from '../data/eventos.js';
import { TRAVEL } from '../data/travel.js';
import { fichaDe } from '../data/fichas.js';
import { restante, diasHasta } from '../data/resultados-historicos.js';
import { modalidadesDe, chipModalidad, pastilla } from '../components/ui.js';
import { icono } from '../components/iconos.js';

export const titulo = 'Calendario 2026/27';
export const descripcion =
  'Todas las fechas de aguas abiertas de la temporada 2026/27 en Argentina: Luján, San Pedro, Ramallo, Colón, Pinamar y Bariloche. Distancias, sedes e inscripción de cada carrera.';

/* ------------------------------------------------------------------ fechas */

const MES_ABR = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
const DIA_ABR = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

// Ojo con \b: sin él "A CONFIRMAR" matchea "MAR" y el evento se iba a marzo.
const abrevsDe = (txt) => (String(txt).match(/\b[A-Z]{3}\b/g) || []).filter((a) => MES_ABR.includes(a));

/** Días concretos de un evento. Vacío si la fecha es una ventana ("DIC 2026 –
    MAR 2027"), un mes suelto ("FEB 2027") o directamente no está. */
function diasDe(e) {
  const txt = String(e.fechaCorta || '');
  const abrevs = abrevsDe(txt);
  const anio = Number(e.anio);
  if (abrevs.length !== 1 || !anio) return [];
  const mes = MES_ABR.indexOf(abrevs[0]) + 1;
  // Los números que hay ANTES de la abreviatura son los días: "16, 17 O 18 FEB".
  const dias = (txt.split(abrevs[0])[0].match(/\d{1,2}/g) || []).map(Number).filter((d) => d >= 1 && d <= 31);
  return dias.map((d) => ({ anio, mes, dia: d }));
}

/** En qué mes del calendario cae el evento. Los que tienen mes estimado —un
    Challenge con ventana, una salida de Travel— entran en ese mes en vez de
    irse todos juntos al final: romper la cronología escondía, por ejemplo,
    que BVT es en febrero. Sólo queda afuera lo que no tiene ninguna
    referencia temporal. */
function mesDe(e) {
  const txt = String(e.fechaCorta || '');
  // "DIC 2026 – MAR 2027": vale el primero, que es cuando se abre la ventana.
  const conAnio = [...txt.matchAll(/\b([A-Z]{3})\s+(\d{4})\b/g)].filter((m) => MES_ABR.includes(m[1]));
  if (conAnio.length) return { ab: conAnio[0][1], anio: conAnio[0][2] };
  const abrevs = abrevsDe(txt);
  if (abrevs.length === 1 && e.anio) return { ab: abrevs[0], anio: String(e.anio) };
  return null;
}

const ordenMes = (ab, anio) => Number(anio) * 12 + MES_ABR.indexOf(ab);

// Las cuatro fechas puntuables, en el orden del calendario. Sirve para numerar
// "Fecha 2 de 4" sin escribir el número a mano en ningún lado.
const ORDEN_CORE = EVENTOS.filter((e) => e.tipo === 'core').map((e) => e.slug);

/* ------------------------------------------------------------------ travel */

// Las salidas de OWA Travel no viven en EVENTOS/CHALLENGES (otra forma:
// destino + fechas, no torneo ni sede de carrera), así que se normalizan acá
// nomás para poder reusar la misma tarjeta. Van siempre a /travel: no tienen
// landing propia por salida.
const normalizarTravel = (t) => ({
  slug: t.slug,
  tipo: 'travel',
  img: t.img,
  sigla: t.titulo,
  nombre: t.salidaTitulo,
  sede: `${t.destino} · ${t.pais}`,
  fechaCorta: t.fechaCorta.split(' ')[0],
  anio: t.fechaCorta.split(' ').slice(1).join(' '),
  estado: t.estado,
  chip: t.chip,
});

const TODOS_LOS_EVENTOS = [...ALL, ...TRAVEL.map(normalizarTravel)];

/* ------------------------------------------------------------------ estado */

const MODALIDADES = [
  ['TODAS', 'TODAS'],
  ['GRAND PRIX', 'GP'],
  ['CIRCUITO OWA', 'CIRC'],
  ['EVENTOS ESPECIALES', 'ESP'],
  ['CHALLENGE', 'CHA'],
  ['TRAVEL', 'TRAVEL'],
];

const s = { modalidad: 'TODAS', q: '' };

const TEXTO_MODALIDAD = {
  core: 'grand prix circuito owa puntuable',
  especial: 'evento especial',
  challenge: 'challenge travesía',
  travel: 'travel viaje',
};

const pasaModalidad = (e) => {
  if (s.modalidad === 'TODAS') return true;
  if (s.modalidad === 'ESP') return e.tipo === 'especial';
  if (s.modalidad === 'CHA') return e.tipo === 'challenge';
  if (s.modalidad === 'TRAVEL') return e.tipo === 'travel';
  return e.tipo === 'core';
};

const sinTildes = (t) => String(t ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '');

const pasaBusqueda = (e) => {
  const q = sinTildes(s.q).trim().toLowerCase();
  if (!q) return true;
  // `sedeCorta` va aparte de `sede`: la ciudad con la que la gente nombra la
  // fecha no siempre está en la sede larga — Nahuel y Huemul dicen "Lago
  // Nahuel Huapi · Río Negro" y todo el mundo las busca como "Bariloche".
  // Sin tildes de los dos lados, así "colon" encuentra "Colón".
  const campos = [e.nombre, e.sede, e.sedeCorta, e.sigla, TEXTO_MODALIDAD[e.tipo]];
  return sinTildes(campos.join(' ')).toLowerCase().includes(q);
};

const MES_ABR_A_LARGO = (ab) => MESES[ab] || ab;

/* -------------------------------------------------------- próxima carrera */

// Mismos filtros que usa el hero de la ficha para armar la pastilla de
// distancias (ver evento.js): Kids y OWA Relay/arena no son competitivas y no
// tienen lugar en una tarjeta de tres o cuatro chips.
const esArena = (d) => /^arena /.test(d.rotulo || '');
const esKids = (d) => /^kids?$/i.test(d.rotulo || '');
const distCorta = (km) => km.replace(',', '.').toUpperCase().replace(/\s*KM$/, 'K').replace(/\s*M$/, 'M');

// Misma búsqueda que largadaDe() en resultados-historicos.js, pero local: esa
// no se exporta porque es un detalle interno de esa página.
const horaLargadaDe = (slug) => {
  for (const c of fichaDe(slug)?.cronogramas || [])
    for (const d of c.dias || [])
      for (const i of d.items || []) {
        const m = i.destacado && /^(\d{2}):(\d{2})$/.exec(i.hora || '');
        if (m) return `${m[1]}:${m[2]}`;
      }
  return '';
};

// Primer link de inscripción que encuentra la ficha, sin importar el torneo:
// para la tarjeta destacada no hay un filtro de torneo activo que elegir.
const primeraInscripcionDe = (slug) => Object.values(fichaDe(slug)?.inscripcion || {})[0] || null;

/** La próxima fecha con día concreto y todavía por venir, de cualquier
    modalidad — Travel incluido, es la misma agenda. Ignora las que sólo
    tienen mes o ventana (un Challenge sin fecha exacta no puede tener cuenta
    regresiva) y las que ya cerraron. */
function proximaCarrera() {
  const candidatas = TODOS_LOS_EVENTOS
    .map((e) => {
      const d = diasDe(e)[0];
      if (!d) return null;
      const iso = `${d.anio}-${String(d.mes).padStart(2, '0')}-${String(d.dia).padStart(2, '0')}`;
      const falta = diasHasta(iso);
      return falta === null || falta < 0 ? null : { e, iso, falta };
    })
    .filter(Boolean)
    .sort((a, b) => a.falta - b.falta);
  return candidatas[0] || null;
}

/** Una caja del reloj: horas, minutos o segundos. Mismo patrón que el
    contador de /resultados, en versión clara para la tarjeta de la sidebar. */
const casillaCuenta = (valor, rotulo) => html`
  <div class="text-center">
    <p data-nums class="rounded-md bg-white px-2 py-1.5 font-display text-[15px] leading-none font-black text-owa-navy tabular-nums">
      ${String(valor).padStart(2, '0')}
    </p>
    <p class="mt-1 text-[8px] font-bold tracking-[0.1em] text-owa-slate uppercase">${rotulo}</p>
  </div>
`;

/** La cuenta regresiva de la tarjeta destacada. Sin hora de largada muestra
    sólo los días — igual criterio que /resultados: un reloj hacia la
    medianoche sería un dato inventado. */
const cuentaRegresiva = (iso, hora = '') => {
  const r = restante(iso, hora);
  if (!r) return '';
  if (r.pasado)
    return html`<p class="font-display text-[15px] font-black text-owa-blue">¡Es hoy!</p>`;

  return html`
    <div class="flex items-end gap-3.5">
      <div>
        <p class="text-[10px] font-bold tracking-[0.1em] text-owa-slate uppercase">Faltan</p>
        <p data-nums class="font-display text-[2rem] leading-none font-black text-owa-blue">${r.dias}</p>
        <p class="mt-0.5 text-[11px] font-bold tracking-[0.06em] text-owa-navy uppercase">${r.dias === 1 ? 'día' : 'días'}</p>
      </div>
      ${hora
        ? html`<div class="flex items-end gap-1.5 pb-1">
            ${casillaCuenta(r.horas, 'hs')}
            <span class="pb-1.5 font-display text-[13px] font-black text-owa-slate">:</span>
            ${casillaCuenta(r.minutos, 'min')}
            <span class="pb-1.5 font-display text-[13px] font-black text-owa-slate">:</span>
            ${casillaCuenta(r.segundos, 'seg')}
          </div>`
        : ''}
    </div>
  `;
};

/** Tarjeta destacada de la sidebar: la próxima fecha del calendario, con
    foto, cuenta regresiva y el botón de inscripción cuando ya está abierta. */
const proximaCarreraCard = () => {
  const prox = proximaCarrera();
  if (!prox) return '';
  const { e, iso } = prox;
  const hora = horaLargadaDe(e.slug);
  const travel = e.tipo === 'travel';
  const href = travel ? '/travel' : `/carrera/${e.slug}`;
  const inscripcionUrl = travel ? null : primeraInscripcionDe(e.slug);
  const f = travel ? null : fichaDe(e.slug);
  const chips = (f?.distancias || [])
    .filter((d) => d.torneo && !esArena(d) && !esKids(d))
    .map((d) => distCorta(d.km));

  const d = diasDe(e)[0];
  const semana = DIA_ABR[new Date(d.anio, d.mes - 1, d.dia).getDay()];

  return html`
    <div class="overflow-hidden rounded-owa-lg border border-owa-sky/40 bg-owa-sky/12">
      <p class="flex items-center gap-2 px-5 pt-4 font-display text-[11px] font-black tracking-[0.1em] text-owa-blue uppercase">
        ${icono('reloj', 'size-3.5')} Próxima carrera
      </p>
      <a href="${href}" class="mt-3 block h-32 overflow-hidden bg-owa-abyss">
        ${foto({
          slug: e.img,
          alt: '',
          sizes: '19rem',
          className: 'block h-full w-full',
          imgClass: 'h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-105',
        })}
      </a>
      <div class="p-5">
        <p data-nums class="font-display text-[12px] font-black tracking-[0.08em] text-owa-slate uppercase">
          ${semana} ${d.dia} ${MES_ABR[d.mes - 1]} ${d.anio}
        </p>
        <a href="${href}" class="mt-1 block">
          <h3 class="text-[19px] leading-tight text-owa-navy">${e.nombre}</h3>
        </a>
        <p class="mt-1.5 flex items-center gap-1.5 text-[12px] text-owa-slate">
          <span class="shrink-0 text-owa-cyan">${icono('pin', 'size-3.5')}</span>${e.sede}
        </p>
        ${chips.length
          ? html`<p class="mt-3 flex flex-wrap gap-2">
              ${chips.map(
                (c) => html`<span class="rounded-full bg-white px-3 py-1.5 font-display text-[12px] font-black text-owa-navy">${c}</span>`
              )}
            </p>`
          : ''}

        <!-- Va siempre a la ficha propia de la carrera, no directo a
             Cronometraje: la inscripción real se hace ahí adentro, junto con
             el resto de la info (distancias, cronograma, kit). -->
        <a
          href="${href}"
          class="u-press u-nudge mt-4 flex items-center justify-center gap-2 rounded-full bg-owa-blue px-5 py-2.5 font-display text-[13px] font-black tracking-[0.04em] text-white uppercase hover:bg-owa-navy"
          >${inscripcionUrl ? 'Inscribirme' : travel ? 'Ver viaje' : 'Ver carrera'}
          <span class="u-nudge-arrow" aria-hidden="true">→</span></a
        >

        <div data-contador="${iso}" data-hora="${hora}" class="mt-4 border-t border-owa-line/60 pt-3.5">
          ${cuentaRegresiva(iso, hora)}
        </div>
      </div>
    </div>
  `;
};

/* --------------------------------------------- expansión por torneo */

const fechaCortaDeJornada = (f) => {
  const [dd, mm] = f.split('/');
  return `${+dd} ${MES_ABR[+mm - 1]}`;
};

// San Pedro, Ramallo y Colón corren Grand Prix y Circuito en días distintos.
// Filtrando por un torneo puntual, cada evento se reemplaza por SU jornada de
// ese torneo —fecha, sigla y nombre propios— en vez de seguir mostrando el
// resumen combinado ("14 Y 15 NOV"), que sólo tiene sentido en "Todas".
function expandirPorTorneo(lista) {
  if (s.modalidad !== 'GP' && s.modalidad !== 'CIRC') return lista;
  const torneo = s.modalidad === 'GP' ? 'GRAND PRIX' : 'CIRCUITO OWA';
  const out = [];
  for (const e of lista) {
    if (e.tipo !== 'core' || !e.jornadas?.length) {
      out.push(e);
      continue;
    }
    const j = e.jornadas.find((x) => x.torneo === torneo);
    if (!j) continue;
    out.push({
      ...e,
      jornadaActiva: j,
      sigla: j.sigla,
      nombre: j.nombreLargo || e.nombre,
      fechaCorta: fechaCortaDeJornada(j.fecha),
    });
  }
  return out;
}

const filtrados = () => expandirPorTorneo(TODOS_LOS_EVENTOS.filter((e) => pasaModalidad(e) && pasaBusqueda(e)));

/* ---------------------------------------------------------------- agrupar */

function agrupar(lista) {
  const grupos = [];
  for (const e of lista) {
    const m = mesDe(e);
    const key = m ? `${m.ab} ${m.anio}` : 'SIN-FECHA';
    let g = grupos.find((x) => x.key === key);
    if (!g) {
      g = {
        key,
        mes: m ? MES_ABR_A_LARGO(m.ab) : 'A confirmar',
        anio: m ? m.anio : '',
        orden: m ? ordenMes(m.ab, m.anio) : Infinity,
        items: [],
      };
      grupos.push(g);
    }
    g.items.push(e);
  }
  // Dentro del mes, por día. Los que no tienen día concreto van al final.
  for (const g of grupos)
    g.items.sort((a, b) => (diasDe(a)[0]?.dia ?? 99) - (diasDe(b)[0]?.dia ?? 99));

  // Sello de fecha puntuable. Sólo los meses con una fecha del torneo lo
  // llevan: en los demás no hay nada que numerar.
  // El torneo se nombra únicamente cuando hay un filtro puesto. En "Todas" no
  // se nombra ninguno a propósito: las cuatro sedes puntúan para Grand Prix y
  // para Circuito por igual, así que decir sólo uno de los dos sería falso.
  const nombreTorneo = s.modalidad === 'GP' ? 'Grand Prix' : s.modalidad === 'CIRC' ? 'Circuito OWA' : '';
  for (const g of grupos) {
    g.id = 'mes-' + g.key.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const core = g.items.find((x) => ORDEN_CORE.includes(x.slug));
    g.fecha = core ? `${nombreTorneo ? `${nombreTorneo} · ` : ''}Fecha ${ORDEN_CORE.indexOf(core.slug) + 1} de ${ORDEN_CORE.length}` : '';
  }
  return grupos.sort((a, b) => a.orden - b.orden);
}

/* ------------------------------------------------------------------ estado */

// El estado nunca se apoya sólo en el color: siempre lleva su texto, y el punto
// es un refuerzo. Sin verde en la paleta de OWA, "abierta" usa el cyan de marca.
// Va con filete y fondo apenas teñido —no relleno sólido— y el punto titila
// (misma animación que .live-dot del chip EN VIVO): es la única fila con una
// acción real pendiente, y ese parpadeo la señala sin gritar. "Próximamente"
// va en navy y no en el celeste/cyan que tenía antes: de esa familia se
// confundía a simple vista con "Inscripción abierta". Los otros dos estados
// quedan en gris neutro, quietos, que es lo que son.
const TONO_ESTADO = {
  abierta: ['bg-owa-cyan live-dot', 'text-owa-blue', 'border border-owa-cyan bg-owa-cyan/10'],
  proximamente: ['bg-owa-navy', 'text-owa-navy', 'border border-owa-navy/25 bg-owa-navy/5'],
  'a-confirmar': ['bg-owa-gray', 'text-owa-slate', 'bg-owa-sand'],
  cerrada: ['bg-owa-gray', 'text-owa-slate', 'bg-owa-sand'],
};

const badgeEstado = (e) => {
  const [punto, texto, fondo] = TONO_ESTADO[e.estado] || TONO_ESTADO.proximamente;
  const label = e.tipo === 'travel' ? e.chip : ESTADOS[e.estado] || 'PRÓXIMAMENTE';
  // El punto queda sólo para "abierta": ahí titila y señala la única fila
  // con una acción real pendiente. En el resto de los estados no suma nada
  // —no hay nada "vivo" que reforzar— y competía con ese parpadeo.
  return html`<span
    class="inline-flex items-center gap-2 rounded-full ${fondo} px-3 py-1.5 font-display text-[10px] font-black tracking-[0.1em] ${texto}"
  >
    ${e.estado === 'abierta' ? html`<span class="size-1.5 shrink-0 rounded-full ${punto}" aria-hidden="true"></span>` : ''}${label}
  </span>`;
};

/* ----------------------------------------------------------- bloque fecha */

/** El día manda; el resto es contexto. Cuando no hay fecha cerrada no se
    simula una: se dice lo que se sabe. */
function bloqueFecha(e) {
  const dias = diasDe(e);
  const bloqueada = sinIngreso(e);

  if (bloqueada || !dias.length) {
    const m = mesDe(e);
    const texto = bloqueada
      ? ['FECHA', 'A CONFIRMAR']
      : m
        ? [MES_ABR_A_LARGO(m.ab).slice(0, 3), m.anio]
        : ['FECHA', 'A CONFIRMAR'];
    // "A CONFIRMAR" es más largo que cualquier mes abreviado (VOB, DIC…) y al
    // tamaño de esa segunda línea se salía del recuadro angosto (6rem): va un
    // escalón más chico y sin el tracking ancho, sólo para ese texto.
    const largo = texto[1].length > 4;
    return html`
      <p class="font-display leading-tight text-owa-slate">
        <span class="block text-[11px] font-bold tracking-[0.14em]">${texto[0]}</span>
        <span class="mt-0.5 block ${largo ? 'text-[10px] tracking-[0.02em]' : 'text-[13px] tracking-[0.06em]'} font-black"
          >${texto[1]}</span
        >
      </p>
    `;
  }

  const { anio, mes } = dias[0];
  // El guion leía como rango de fechas corridas y además chocaba con el resto
  // del bloque. Se usa el mismo nexo que la fuente: "14 Y 15" va con "y",
  // "16, 17 O 18" con "o", que no es lo mismo (ahí se corre un día solo).
  // Varios días van apilados, sin nexo ni guion: se leen como los días de esa
  // fecha y el número no compite con nada. Cuantos más días, más chico, para
  // que la columna mantenga siempre más o menos el mismo alto.
  //
  // Cruce del Nahuel apila tres, aunque ahí se corra uno solo de esos días:
  // lo aclara la nota que la tarjeta muestra debajo del título ("Fecha a
  // confirmar según condiciones").
  const alternativas = /\bO\b/.test(String(e.fechaCorta));
  const numero =
    dias.length === 1
      ? String(dias[0].dia)
      : dias.map((d) => html`<span class="block">${d.dia}</span>`);
  const tam =
    dias.length === 1 ? 'text-[2rem]' : dias.length === 2 ? 'text-[1.75rem] leading-[0.88]' : 'text-[1.375rem] leading-[0.92]';
  // El día de la semana sólo se muestra cuando la fecha es un único día: con
  // varios habría que poner dos y el bloque deja de leerse de un vistazo.
  const semana = dias.length === 1 ? DIA_ABR[new Date(anio, mes - 1, dias[0].dia).getDay()] : '';

  return html`
    <p class="font-display leading-none text-owa-navy">
      <!-- Muestra el día de la semana sólo cuando la fecha es un único día.
           Alto fijo para que todos los bloques arranquen a la misma altura. -->
      <span class="block h-3.5 text-[11px] font-bold tracking-[0.14em] text-owa-slate">${semana}</span>
      <span data-nums class="mt-1 block ${tam} font-black tracking-[-0.02em]">${numero}</span>
      <span class="mt-1.5 block text-[12px] font-black tracking-[0.12em] text-owa-blue">${MES_ABR[mes - 1]}</span>
      <span data-nums class="mt-0.5 block text-[11px] font-bold tracking-[0.08em] text-owa-slate">${anio}</span>
    </p>
  `;
}

/* --------------------------------------------------------------- tarjeta */

function tarjeta(e) {
  const travel = e.tipo === 'travel';
  const chal = e.tipo === 'challenge';
  const bloqueada = sinIngreso(e);
  const href = travel ? '/travel' : `/carrera/${e.slug}`;

  // Sólo hay link real de inscripción cuando la fila es de UN torneo puntual
  // (filtro Grand Prix o Circuito activo) y esa carrera ya tiene ficha. En
  // "Todas" la fila combina los dos torneos y no hay un único link válido.
  const torneo = e.jornadaActiva?.torneo;
  const ficha = torneo && !travel && !chal ? fichaDe(e.slug) : null;
  const inscripcionUrl = ficha?.inscripcion?.[torneo];

  // Botón sólo cuando hay una acción primaria de verdad. El resto de las
  // tarjetas se abre haciendo click en la tarjeta, sin repetir un "ver
  // detalles" idéntico en cada fila.
  const accion = inscripcionUrl
    ? { label: 'INSCRIBIRME', url: inscripcionUrl, externo: true }
    : chal && !bloqueada
      ? { label: 'POSTULARME', url: href, externo: false }
      : travel && e.estado === 'abierta'
        ? { label: 'QUIERO IR', url: '/travel', externo: false }
        : null;

  return html`
    <li
      id="ev-${e.slug}"
      class="reveal u-lift-sm group scroll-mt-24 overflow-hidden rounded-owa-lg border border-owa-line bg-white transition-shadow duration-250 ease-out hover:shadow-[var(--shadow-elevated)]"
    >
      <div class="grid gap-x-5 gap-y-4 p-4 md:grid-cols-[9.5rem_6rem_minmax(0,1fr)_1.25rem_auto] md:items-center">
        <!-- class="contents": el link no genera caja propia, así sus hijos
             siguen siendo celdas de esta grilla y el botón de acción puede
             quedar afuera como <a> independiente (nada de links anidados). -->
        <${bloqueada ? 'div' : 'a'} ${raw(bloqueada ? '' : `href="${href}"`)} class="contents">
          <div class="relative h-36 overflow-hidden rounded-owa-md bg-owa-abyss md:h-24">
            ${foto({
              slug: e.img,
              alt: '',
              sizes: '(min-width: 768px) 152px, 100vw',
              className: 'block h-full w-full',
              imgClass: 'h-full w-full object-cover',
            })}
          </div>

          <!-- En mobile, uno debajo del otro: al lado ("items-center gap-4"),
               el pill del estado quedaba flotando a la altura del número
               grande de la fecha —centrado contra un bloque de 4 líneas—, en
               vez de leerse pegado a ella. -->
          <div class="flex flex-col items-start gap-2.5 md:block md:rounded-owa-md md:border md:border-owa-line md:px-2 md:py-3.5 md:text-center">
            ${bloqueFecha(e)}
            <span class="md:hidden">${badgeEstado(e)}</span>
          </div>

          <div class="min-w-0">
            <!-- El código va SIEMPRE arriba del nombre: es el identificador
                 con el que la organización y los nadadores nombran la fecha. -->
            <p class="font-display text-[11px] font-black tracking-[0.2em] text-owa-blue">${e.sigla}</p>
            <h3 class="mt-1.5 text-[clamp(1.125rem,1.8vw,1.375rem)] leading-[1.1] text-owa-navy">${e.nombre}</h3>
            <p class="mt-1.5 flex items-center gap-1.5 text-[13px] text-owa-slate">
              <span class="shrink-0 text-owa-cyan">${icono('pin', 'size-4')}</span>${e.sede}
            </p>
            <p class="mt-2.5 flex flex-wrap gap-1.5">
              ${travel ? chipModalidad('TRAVEL') : torneo ? chipModalidad(torneo) : modalidadesDe(e)}
            </p>
            ${e.nota ? html`<p class="mt-2 text-[11px] text-owa-slate">${e.nota}</p>` : ''}
          </div>

          <span
            class="hidden shrink-0 self-center text-[1.25rem] leading-none text-owa-slate transition-all duration-200 ease-out group-hover:translate-x-1 group-hover:text-owa-blue md:block"
            aria-hidden="true"
            >${bloqueada ? '' : '›'}</span
          >
        </${bloqueada ? 'div' : 'a'}>

        <div class="flex items-center justify-between gap-3 md:w-52 md:flex-col md:items-end md:justify-center md:gap-3">
          <span class="hidden md:block">${badgeEstado(e)}</span>
          <!-- Siempre un botón sólido, nunca un texto plano: antes sólo lo
               llevaban las fechas con una acción "fuerte" (inscribirme,
               postularme) y el resto se abría con un link de texto suelto,
               que en la fila se sentía como una tarjeta a medio terminar. -->
          ${accion
            ? html`<a
                href="${accion.url}"
                ${raw(accion.externo ? 'target="_blank" rel="noopener noreferrer"' : '')}
                class="u-press u-nudge w-full rounded-full bg-owa-blue px-5 py-2.5 text-center font-display text-[11px] font-black tracking-[0.06em] text-white transition-colors duration-200 ease-out hover:bg-owa-navy"
                >${accion.label} <span class="u-nudge-arrow" aria-hidden="true">→</span></a
              >`
            : bloqueada
              ? ''
              : html`<a
                  href="${href}"
                  class="u-press u-nudge w-full rounded-full bg-owa-blue px-5 py-2.5 text-center font-display text-[11px] font-black tracking-[0.06em] text-white transition-colors duration-200 ease-out hover:bg-owa-navy"
                  >${travel ? 'VER VIAJE' : chal ? 'VER TRAVESÍA' : 'VER CARRERA'}
                  <span class="u-nudge-arrow" aria-hidden="true">→</span></a
                >`}
        </div>
      </div>
    </li>
  `;
}

/* ----------------------------------------------------------------- lista */

const lista = () => {
  const grupos = agrupar(filtrados());
  if (!grupos.length)
    return html`<p class="rounded-owa-lg border border-dashed border-owa-line px-6 py-16 text-center text-owa-slate">
      Ninguna fecha coincide con lo que buscás.
    </p>`;

  return html`
    <div class="grid gap-9">
      ${grupos.map(
        (g) => html`
          <section aria-labelledby="${g.id}">
            <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-owa-navy/25 pb-2.5">
              <h2 id="${g.id}" class="font-display text-[15px] font-black tracking-[0.14em] text-owa-navy uppercase">
                ${g.mes} <span data-nums class="text-owa-slate">${g.anio}</span>
              </h2>
              ${g.fecha
                ? html`<span class="ml-auto font-body text-[13px] whitespace-nowrap text-owa-slate">${g.fecha}</span>`
                : ''}
            </div>
            <ul class="mt-4 grid gap-3" data-stagger>
              ${g.items.map(tarjeta)}
            </ul>
          </section>
        `
      )}
    </div>
  `;
};

/* ----------------------------------------------------------- ir a un mes */

/** Un mes de la temporada con su conteo de fechas, para el salto rápido de
    la sidebar. Sale de TODOS_LOS_EVENTOS —no de la lista filtrada— porque el
    panorama de la temporada tiene que quedar igual sin importar qué filtro
    esté puesto; el propio link ya no hace nada si ese mes no está en
    pantalla (ver nota en cada <a>). Mismo `id` que arma agrupar(), así el
    anchor apunta siempre al encabezado correcto. */
function resumenMeses() {
  const mapa = new Map();
  for (const e of TODOS_LOS_EVENTOS) {
    const m = mesDe(e);
    if (!m) continue;
    const key = `${m.ab} ${m.anio}`;
    if (!mapa.has(key))
      mapa.set(key, {
        key,
        ab: m.ab,
        anio: m.anio,
        orden: ordenMes(m.ab, m.anio),
        n: 0,
        id: 'mes-' + key.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      });
    mapa.get(key).n++;
  }
  return [...mapa.values()].sort((a, b) => a.orden - b.orden);
}

function irAUnMes() {
  const meses = resumenMeses();
  if (!meses.length) return '';
  // El mes de la próxima carrera es el que se resalta: es el dato que
  // importa hoy, y no depende de ningún filtro puesto.
  const prox = proximaCarrera();
  const mesActivo = prox ? mesDe(prox.e) : null;
  const idActivo = mesActivo ? `mes-${mesActivo.ab} ${mesActivo.anio}`.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';

  return html`
    <div class="rounded-owa-md border border-owa-line p-4">
      <h2 class="font-display text-[12px] font-black tracking-[0.1em] text-owa-navy uppercase">Ir a un mes</h2>
      <div class="mt-3.5 grid grid-cols-3 gap-2">
        <!-- Ancla simple y no un botón con JS: el scroll suave ya lo da la
             regla global de scroll-behavior (ver app.css) y así el link
             sigue funcionando si el mes no está en pantalla —con un filtro
             puesto que lo saca de la lista— en vez de fallar en silencio. -->
        ${meses.map(
          (m) => html`
            <a
              href="#${m.id}"
              class="u-press rounded-owa-md border px-2 py-2.5 text-center transition-colors duration-200 ${m.id === idActivo
                ? 'border-owa-navy bg-owa-navy text-white'
                : 'border-owa-line text-owa-navy hover:border-owa-navy hover:bg-owa-mist/60'}"
            >
              <span class="block font-display text-[11px] font-black tracking-[0.06em]">${m.ab}</span>
              <span
                data-nums
                class="mt-1 block text-[10px] ${m.id === idActivo ? 'text-white/75' : 'text-owa-slate'}"
                >${m.n} ${m.n === 1 ? 'carrera' : 'carreras'}</span
              >
            </a>
          `
        )}
      </div>
    </div>
  `;
}

/* --------------------------------------------------------------- sidebar */

const sidebar = () => html`
  <div class="grid gap-4 lg:sticky lg:top-24">
    ${proximaCarreraCard()} ${irAUnMes()}
  </div>
`;

/* ---------------------------------------------------------------- filtros */

const barraFiltros = () => html`
  <div class="u-scroll-x flex gap-2" role="group" aria-label="Filtrar por modalidad" data-grupo="modalidad">
    ${MODALIDADES.map(([label, v]) => pastilla(label, s.modalidad === v, `data-modalidad="${v}"`))}
  </div>
`;

// Mismo alto que las pastillas de la barra de filtros (py-2.5): antes
// llevaba más padding vertical que ellas y quedaba más gruesa, aunque las dos
// viven en la misma fila.
const buscador = () => html`
  <label
    class="flex min-w-0 items-center gap-3 rounded-full border border-owa-line bg-white px-5 py-2.5 transition-colors duration-200 focus-within:border-owa-navy lg:w-72"
  >
    <span class="sr-only">Buscar carrera o ciudad</span>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4 shrink-0 text-owa-slate">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" stroke-linecap="round" />
    </svg>
    <input
      data-q
      type="search"
      value="${s.q}"
      placeholder="Buscar carrera o ciudad..."
      class="min-w-0 flex-1 bg-transparent text-[14px] text-owa-navy outline-none placeholder:text-owa-slate/70"
    />
  </label>
`;

/* ------------------------------------------------------------------ vista */

export function render() {
  return toHTML(html`
    <section class="relative overflow-hidden bg-owa-navy px-0 pt-14 pb-11 text-white">
      <!-- La foto se desvanece hacia la izquierda con una máscara, igual que en
           las páginas madre: sin ella el borde del bloque corta el navy con una
           línea vertical muy visible. Debajo de lg no entra y no se muestra.
           Mismas proporciones que ese patrón (56% de ancho, máscara al 52%,
           opacity-45 en la propia foto) y no las que tenía antes (50%/58%,
           más un velo aparte hasta 96% de navy): ese velo extra existía para
           que el resumen de temporada se leyera encima del agua, y al sacar
           el resumen se quedó sin motivo — la foto quedaba casi toda tapada. -->
      <div
        class="absolute inset-y-0 right-0 hidden w-[56%] lg:block"
        aria-hidden="true"
        style="mask-image:linear-gradient(90deg,transparent 0%,#000 52%);-webkit-mask-image:linear-gradient(90deg,transparent 0%,#000 52%)"
      >
        ${foto({
          slug: 'lbc-crawl',
          alt: '',
          sizes: '56vw',
          priority: true,
          className: 'block h-full w-full',
          imgClass: 'h-full w-full object-cover opacity-45',
        })}
      </div>

      <div class="u-shell relative">
        <!-- Misma escala que los heros de PDA y Primeros pasos. La utilidad
             u-h1 llega hasta 5.75rem y esta era la única página de sección
             que la usaba, así que quedaba mucho más grande que sus hermanas. -->
        <h1 class="text-[clamp(2.125rem,4.6vw,4.25rem)] leading-[0.9]">
          Calendario<br /><span class="text-owa-cyan">2026/27</span>
        </h1>
        <p class="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-owa-line">
          Todas las fechas de la temporada. Las inscripciones se realizan desde la plataforma de cada carrera.
        </p>
      </div>
    </section>

    <div class="u-shell pt-8 pb-24">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between" data-filtros>
        <div class="min-w-0 flex-1">${barraFiltros()}</div>
        ${buscador()}
      </div>

      <div class="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-10">
        <div data-lista>${lista()}</div>
        <!-- En móvil la columna auxiliar va después del listado: el calendario
             es apoyo, no la puerta de entrada. -->
        <aside data-sidebar>${sidebar()}</aside>
      </div>
    </div>
  `);
}

export function mount(root) {
  const contenedor = root.querySelector('[data-lista]');
  const barra = root.querySelector('[data-filtros]');
  const aside = root.querySelector('[data-sidebar]');

  const repintarLista = () => {
    aside.innerHTML = toHTML(sidebar());
    contenedor.innerHTML = toHTML(lista());
    contenedor.querySelectorAll('.reveal').forEach((el) => el.setAttribute('data-visible', ''));
    contenedor.querySelectorAll('[data-stagger]').forEach((g) => stagger(g));
  };

  const repintarFiltros = () => {
    // La tira scrollea: repintarla la mandaba al principio y el filtro recién
    // tocado se salía de vista.
    const tira = barra.querySelector('[data-grupo="modalidad"]');
    const x = tira.scrollLeft;
    tira.parentElement.innerHTML = toHTML(barraFiltros());
    barra.querySelector('[data-grupo="modalidad"]').scrollLeft = x;
  };

  root.addEventListener('click', (e) => {
    const mod = e.target.closest('[data-modalidad]');
    if (mod) {
      if (mod.dataset.modalidad === s.modalidad) return;
      s.modalidad = mod.dataset.modalidad;
      repintarFiltros();
      return repintarLista();
    }
  });

  let t;
  root.addEventListener('input', (e) => {
    if (!e.target.closest('[data-q]')) return;
    s.q = e.target.value;
    clearTimeout(t);
    t = setTimeout(repintarLista, 160);
  });

  // La cuenta regresiva de "Próxima carrera" late segundo a segundo. El HTML
  // prerenderizado trae el tiempo que faltaba al momento del build, así que
  // se recalcula acá con el reloj del visitante — mismo patrón que
  // /resultados. Se corta solo cuando `root` deja de colgar del documento:
  // el router reemplaza el nodo entero y no llama a un unmount.
  const ponerAlDia = () =>
    root.querySelectorAll('[data-contador]').forEach((el) => {
      el.innerHTML = toHTML(cuentaRegresiva(el.dataset.contador, el.dataset.hora));
    });
  const reloj = setInterval(() => {
    if (!root.isConnected) return clearInterval(reloj);
    ponerAlDia();
  }, 1000);
}
