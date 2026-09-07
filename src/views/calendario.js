import { html, raw, toHTML, stagger } from '../lib/html.js';
import { foto } from '../lib/img.js';
import { EVENTOS, ALL, MESES, ESTADOS, sinIngreso } from '../data/eventos.js';
import { TRAVEL } from '../data/travel.js';
import { fichaDe } from '../data/fichas.js';
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

/* ---------------------------------------------------------------- resumen */

// Los tres números del hero salen de los datos: si entra una fecha nueva, se
// actualizan solos.
const RESUMEN = {
  carreras: ALL.length,
  destinos: new Set(ALL.map((e) => e.sedeCorta || e.sede)).size,
  // Grand Prix, Circuito OWA, Especiales y Challenge: las cuatro páginas madre.
  // No se llaman "circuitos" porque circuitos hay dos (Grand Prix y Circuito
  // OWA); los otros dos no puntúan.
  modalidades: 4,
};

/* ------------------------------------------------------------------ estado */

const MODALIDADES = [
  ['TODAS', 'TODAS'],
  ['GRAND PRIX', 'GP'],
  ['CIRCUITO OWA', 'CIRC'],
  ['EVENTOS ESPECIALES', 'ESP'],
  ['CHALLENGE', 'CHA'],
  ['TRAVEL', 'TRAVEL'],
];

const s = { modalidad: 'TODAS', q: '', mes: 0 };

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
const TONO_ESTADO = {
  abierta: ['bg-owa-cyan', 'text-owa-deep', 'bg-owa-cyan/15'],
  proximamente: ['bg-owa-sky', 'text-owa-navy', 'bg-owa-mist'],
  'a-confirmar': ['bg-owa-gray', 'text-owa-slate', 'bg-owa-sand'],
  cerrada: ['bg-owa-gray', 'text-owa-slate', 'bg-owa-sand'],
};

const badgeEstado = (e) => {
  const [punto, texto, fondo] = TONO_ESTADO[e.estado] || TONO_ESTADO.proximamente;
  const label = e.tipo === 'travel' ? e.chip : ESTADOS[e.estado] || 'PRÓXIMAMENTE';
  return html`<span
    class="inline-flex items-center gap-2 rounded-full ${fondo} px-3 py-1.5 font-display text-[10px] font-black tracking-[0.1em] ${texto}"
  >
    <span class="size-1.5 shrink-0 rounded-full ${punto}" aria-hidden="true"></span>${label}
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
    return html`
      <p class="font-display leading-tight text-owa-slate">
        <span class="block text-[11px] font-bold tracking-[0.14em]">${texto[0]}</span>
        <span class="mt-0.5 block text-[13px] font-black tracking-[0.06em]">${texto[1]}</span>
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

          <div class="flex items-center gap-4 md:block md:rounded-owa-md md:border md:border-owa-line md:px-2 md:py-3.5 md:text-center">
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
              ${travel ? '' : torneo ? chipModalidad(torneo) : modalidadesDe(e)}
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
          ${accion
            ? html`<a
                href="${accion.url}"
                ${raw(accion.externo ? 'target="_blank" rel="noopener noreferrer"' : '')}
                class="u-press u-nudge w-full rounded-full bg-owa-blue px-5 py-2.5 text-center font-display text-[11px] font-black tracking-[0.06em] text-white transition-colors duration-200 ease-out hover:bg-owa-navy"
                >${accion.label} <span class="u-nudge-arrow" aria-hidden="true">→</span></a
              >`
            : bloqueada
              ? ''
              : html`<span
                  class="hidden shrink-0 items-center gap-1.5 font-display text-[11px] font-bold tracking-[0.08em] text-owa-slate transition-colors duration-200 group-hover:text-owa-blue md:flex"
                  >${travel ? 'VER VIAJE' : chal ? 'VER TRAVESÍA' : 'VER CARRERA'}
                  <span class="transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
                </span>`}
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

/* -------------------------------------------------------- mini calendario */

const COLOR_TIPO = { core: 'bg-owa-cyan', especial: 'bg-owa-sky', challenge: 'bg-owa-blue', travel: 'bg-owa-gold' };
const LEYENDA = [
  ['core', 'Puntuables'],
  ['especial', 'Especiales'],
  ['challenge', 'Challenge'],
  ['travel', 'Travel'],
];

/** Meses de la temporada que tienen al menos un día concreto marcado. */
const mesesConDias = () => {
  const mapa = new Map();
  for (const e of TODOS_LOS_EVENTOS)
    for (const d of diasDe(e)) {
      const k = `${d.anio}-${d.mes}`;
      if (!mapa.has(k)) mapa.set(k, { anio: d.anio, mes: d.mes, dias: new Map() });
      const g = mapa.get(k);
      if (!g.dias.has(d.dia)) g.dias.set(d.dia, []);
      g.dias.get(d.dia).push(e);
    }
  return [...mapa.values()].sort((a, b) => a.anio * 12 + a.mes - (b.anio * 12 + b.mes));
};

const MESES_CAL = mesesConDias();

function miniCalendario() {
  if (!MESES_CAL.length) return '';
  // Un día sólo es clickeable si su evento está en la lista que se está
  // viendo: con un filtro puesto, mandar a una tarjeta que no está en pantalla
  // deja al usuario mirando la nada.
  const enPantalla = new Set(filtrados().map((e) => e.slug));
  const i = Math.max(0, Math.min(s.mes, MESES_CAL.length - 1));
  const { anio, mes, dias } = MESES_CAL[i];

  // Semana que arranca el lunes: getDay() da 0 para domingo.
  const primero = (new Date(anio, mes - 1, 1).getDay() + 6) % 7;
  const total = new Date(anio, mes, 0).getDate();
  const celdas = [...Array(primero).fill(null), ...Array.from({ length: total }, (_, k) => k + 1)];

  const flecha = (delta, etiqueta, glifo, habilitada) => html`
    <button
      type="button"
      ${raw(habilitada ? `data-mes="${i + delta}"` : 'disabled')}
      aria-label="${etiqueta}"
      class="u-press grid size-8 shrink-0 place-items-center rounded-full font-display text-[13px] font-black transition-colors duration-200 ${habilitada
        ? 'cursor-pointer text-owa-navy hover:bg-owa-mist'
        : 'cursor-not-allowed bg-owa-sand text-owa-slate'}"
    >
      ${glifo}
    </button>
  `;

  return html`
    <div class="rounded-owa-md border border-owa-line p-4">
      <div class="flex items-center justify-between gap-2">
        ${flecha(-1, 'Mes anterior', '‹', i > 0)}
        <p class="font-display text-[12px] font-black tracking-[0.1em] text-owa-navy uppercase">
          ${MES_ABR_A_LARGO(MES_ABR[mes - 1])} ${anio}
        </p>
        ${flecha(1, 'Mes siguiente', '›', i < MESES_CAL.length - 1)}
      </div>

      <div class="mt-3.5 grid grid-cols-7 gap-1 text-center">
        ${['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(
          (d, k) => html`<span class="text-[10px] font-bold text-owa-slate" aria-hidden="true">${d}</span>`
        )}
        ${celdas.map((d) => {
          if (d === null) return html`<span></span>`;
          const evs = dias.get(d);
          if (!evs)
            return html`<span data-nums class="grid size-8 place-items-center text-[12px] text-owa-slate">${d}</span>`;
          const nombres = evs.map((x) => x.nombre).join(', ');
          const activo = evs.find((x) => enPantalla.has(x.slug));
          const punto = html`<span
            class="absolute bottom-0.5 size-1 rounded-full ${COLOR_TIPO[evs[0].tipo] || 'bg-owa-blue'}"
            aria-hidden="true"
          ></span>`;
          if (!activo)
            return html`<span
              title="${nombres}"
              class="relative grid size-8 place-items-center rounded-full bg-owa-sand font-display text-[12px] font-black text-owa-slate"
              ><span data-nums>${d}</span>${punto}</span
            >`;
          return html`
            <a
              href="#ev-${activo.slug}"
              title="${nombres}"
              aria-label="${d} de ${MES_ABR_A_LARGO(MES_ABR[mes - 1]).toLowerCase()}: ${nombres}"
              class="u-press relative grid size-8 place-items-center rounded-full bg-owa-mist font-display text-[12px] font-black text-owa-navy transition-colors duration-200 hover:bg-owa-navy hover:text-white"
            >
              <span data-nums>${d}</span>${punto}
            </a>
          `;
        })}
      </div>

      <ul class="mt-4 flex flex-wrap gap-x-3.5 gap-y-1.5 border-t border-owa-line pt-3.5">
        ${LEYENDA.map(
          ([tipo, label]) => html`
            <li class="flex items-center gap-1.5 text-[11px] text-owa-slate">
              <span class="size-1.5 rounded-full ${COLOR_TIPO[tipo]}" aria-hidden="true"></span>${label}
            </li>
          `
        )}
      </ul>
    </div>
  `;
}

/* --------------------------------------------------------------- sidebar */

const sidebar = () => html`
  <div class="grid gap-4 lg:sticky lg:top-24">
    ${miniCalendario()}

    <div class="rounded-owa-md bg-owa-mist p-5">
      <h2 class="font-display text-[14px] font-black text-owa-navy">¿Dudas sobre las inscripciones?</h2>
      <p class="mt-2 text-[13px] leading-relaxed text-owa-slate">
        Las inscripciones se realizan desde la plataforma externa de cada carrera.
      </p>
      <a
        href="/primeros-pasos"
        class="u-nudge mt-3.5 inline-flex items-center gap-1.5 font-display text-[12px] font-black tracking-[0.06em] text-owa-blue hover:underline"
        >CÓMO INSCRIBIRME <span class="u-nudge-arrow" aria-hidden="true">→</span></a
      >
    </div>
  </div>
`;

/* ---------------------------------------------------------------- filtros */

const barraFiltros = () => html`
  <div class="u-scroll-x flex gap-2" role="group" aria-label="Filtrar por modalidad" data-grupo="modalidad">
    ${MODALIDADES.map(([label, v]) => pastilla(label, s.modalidad === v, `data-modalidad="${v}"`))}
  </div>
`;

const buscador = () => html`
  <label
    class="flex min-w-0 items-center gap-3 rounded-full border border-owa-line bg-white px-5 py-3 transition-colors duration-200 focus-within:border-owa-navy lg:w-72"
  >
    <span class="sr-only">Buscar carrera o ciudad</span>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4.5 shrink-0 text-owa-slate">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" stroke-linecap="round" />
    </svg>
    <input
      data-q
      type="search"
      value="${s.q}"
      placeholder="Buscar carrera o ciudad..."
      class="min-w-0 flex-1 bg-transparent text-[15px] text-owa-navy outline-none placeholder:text-owa-slate/70"
    />
  </label>
`;

/* ------------------------------------------------------------------ vista */

const datoResumen = (n, label, ico) => html`
  <li class="flex items-center gap-3">
    <span class="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-owa-cyan">${icono(ico, 'size-5')}</span>
    <span class="leading-tight">
      <span data-nums class="block font-display text-[1.375rem] font-black text-white">${n}</span>
      <span class="block text-[11px] tracking-[0.12em] text-owa-line uppercase">${label}</span>
    </span>
  </li>
`;

export function render() {
  return toHTML(html`
    <section class="relative overflow-hidden bg-owa-navy px-0 pt-14 pb-11 text-white">
      <!-- La foto se desvanece hacia la izquierda con una máscara, igual que en
           las páginas madre: sin ella el borde del bloque corta el navy con una
           línea vertical muy visible. Debajo de lg no entra y no se muestra. -->
      <div
        class="absolute inset-y-0 right-0 hidden w-[50%] lg:block"
        aria-hidden="true"
        style="mask-image:linear-gradient(90deg,transparent 0%,#000 58%);-webkit-mask-image:linear-gradient(90deg,transparent 0%,#000 58%)"
      >
        ${foto({
          slug: 'lbc-crawl',
          alt: '',
          sizes: '50vw',
          priority: true,
          className: 'block h-full w-full',
          imgClass: 'h-full w-full object-cover',
        })}
        <!-- El resumen de temporada cae justo sobre el agua, que es la zona más
             clara de la foto. Este velo oscurece el borde derecho para que los
             números se lean, y deja el centro despejado. -->
        <div class="absolute inset-0 bg-linear-to-l from-owa-navy/96 via-owa-navy/60 to-transparent"></div>
      </div>

      <div class="u-shell relative grid gap-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div>
          <!-- Misma escala que los heros de PDA y Primeros pasos. La utilidad
               u-h1 llega hasta 5.75rem y esta era la única página de sección
               que la usaba, así que quedaba mucho más grande que sus hermanas. -->
          <h1 class="text-[clamp(2.125rem,4.6vw,4.25rem)] leading-[0.9]">
            Calendario<br />2026/<span class="text-owa-cyan">27</span>
          </h1>
          <p class="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-owa-line">
            Todas las fechas de la temporada. Las inscripciones se realizan desde la plataforma de cada carrera.
          </p>
        </div>
        <!-- Resumen de temporada: los tres números salen de los datos. -->
        <ul class="flex flex-wrap gap-x-8 gap-y-4 lg:flex-col lg:gap-4">
          ${datoResumen(RESUMEN.carreras, 'Carreras', 'bandera')}
          ${datoResumen(RESUMEN.destinos, 'Destinos', 'pin')}
          ${datoResumen(RESUMEN.modalidades, 'Modalidades', 'trofeo')}
        </ul>
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

    const mes = e.target.closest('[data-mes]');
    if (mes) {
      s.mes = Number(mes.dataset.mes);
      aside.innerHTML = toHTML(sidebar());
      return;
    }

  });

  let t;
  root.addEventListener('input', (e) => {
    if (!e.target.closest('[data-q]')) return;
    s.q = e.target.value;
    clearTimeout(t);
    t = setTimeout(repintarLista, 160);
  });
}
