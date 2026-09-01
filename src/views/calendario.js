import { html, toHTML, stagger } from '../lib/html.js';
import { foto } from '../lib/img.js';
import { EVENTOS, ALL, MESES } from '../data/eventos.js';
import { TRAVEL } from '../data/travel.js';
import { fichaDe } from '../data/fichas.js';
import { modalidadesDe, chipModalidad, pastilla } from '../components/ui.js';
import { fechaBadge } from '../components/tarjeta-evento.js';

export const titulo = 'Calendario 2026/27';
export const descripcion =
  'Todas las fechas de aguas abiertas de la temporada 2026/27 en Argentina: Luján, San Pedro, Ramallo, Colón, Pinamar y Bariloche. Distancias, sedes e inscripción de cada carrera.';

const FILTROS = [
  ['TODOS', 'TODOS'],
  ['GRAND PRIX', 'GP'],
  ['CIRCUITO', 'CIRC'],
  ['EVENTOS ESPECIALES', 'ESP'],
  ['CHALLENGE', 'CHA'],
  ['TRAVEL', 'TRAVEL'],
];

// Las salidas de OWA Travel no viven en EVENTOS/CHALLENGES (otra forma:
// destino + fechas, no torneo ni sede de carrera), así que se normalizan acá
// nomás para poder reusar la misma fila del calendario. Van siempre a /travel:
// no tienen landing propia por salida.
const normalizarTravel = (t) => ({
  slug: t.slug,
  tipo: 'travel',
  img: t.img,
  sigla: t.titulo,
  nombre: t.salidaTitulo,
  sede: `${t.destino} · ${t.pais}`,
  // "OCT 2026" se parte en mes + año: la fila los vuelve a juntar al
  // renderizar, y así cae en el mismo grupo que las carreras de ese mes.
  fechaCorta: t.fechaCorta.split(' ')[0],
  anio: t.fechaCorta.split(' ').slice(1).join(' '),
  estado: t.estado,
  chip: t.chip,
});

let filtro = 'TODOS';

const pasaFiltro = (e) => {
  if (filtro === 'TODOS') return true;
  if (filtro === 'ESP') return e.tipo === 'especial';
  if (filtro === 'CHA') return e.tipo === 'challenge';
  return e.tipo === 'core';
};

const MES_ABR = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
const fechaCortaDeJornada = (f) => {
  const [dd, mm] = f.split('/');
  return `${+dd} ${MES_ABR[+mm - 1]}`;
};

// San Pedro, Ramallo y Colón corren Grand Prix y Circuito en días distintos
// (Luján es la única fecha donde caen el mismo día). Filtrando por un torneo
// puntual, cada evento se reemplaza por SU jornada de ese torneo — fecha,
// sigla y nombre propios — en vez de seguir mostrando el resumen combinado
// ("14 Y 15 NOV") que sólo tiene sentido en la vista "Todos".
function expandirPorFiltro(lista) {
  if (filtro !== 'GP' && filtro !== 'CIRC') return lista;
  const torneo = filtro === 'GP' ? 'GRAND PRIX' : 'CIRCUITO OWA';
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

/** Agrupa por mes de la fecha corta; los Challenge caen en "a confirmar". */
function agrupar(lista) {
  const grupos = [];
  const ordenCore = EVENTOS.filter((x) => x.tipo === 'core').map((x) => x.slug);

  for (const e of lista) {
    const abrevs = (String(e.fechaCorta).match(/[A-ZÁÉÍÓÚ]{3}/g) || []).filter((a) => MESES[a]);
    const ab = abrevs.at(-1) || '';
    const sinFecha = !ab || e.tipo === 'challenge';
    const key = sinFecha ? 'SIN-FECHA' : `${ab} ${e.anio}`;

    let g = grupos.find((x) => x.key === key);
    if (!g) {
      g = { key, mes: sinFecha ? 'A confirmar' : MESES[ab], anio: sinFecha ? '' : e.anio, items: [] };
      grupos.push(g);
    }
    g.items.push(e);
  }

  for (const g of grupos) {
    const core = g.items.find((x) => ordenCore.includes(x.slug));
    g.cuenta = core ? `FECHA ${String(ordenCore.indexOf(core.slug) + 1).padStart(2, '0')}` : '';
  }
  // Los Challenge no tienen fecha cerrada: su grupo cierra siempre la lista,
  // sin importar en qué orden hayan entrado los eventos.
  const sinFecha = grupos.findIndex((g) => g.key === 'SIN-FECHA');
  if (sinFecha >= 0) grupos.push(...grupos.splice(sinFecha, 1));

  return grupos;
}

function fila(e) {
  const travel = e.tipo === 'travel';
  const abierta = e.estado === 'abierta';
  const chal = e.tipo === 'challenge';
  const { dia, mes } = fechaBadge(e);
  const href = travel ? '/travel' : `/carrera/${e.slug}`;

  // Sólo hay link real de inscripción/starting list cuando la fila es de UN
  // torneo puntual (filtro Grand Prix o Circuito activo: `jornadaActiva`) y
  // esa carrera ya tiene ficha cargada en fichas.js. En "Todos" la fila
  // combina los dos torneos y no hay un único link que valga para ambos.
  const torneo = e.jornadaActiva?.torneo;
  const ficha = torneo && !travel && !chal ? fichaDe(e.slug) : null;
  const inscripcionUrl = ficha?.inscripcion?.[torneo];
  const startingListUrl = ficha?.startingList?.[torneo];

  return html`
    <li
      class="group grid items-center gap-x-5 gap-y-4 border-b border-owa-sand p-4 transition-colors duration-200 ease-out hover:bg-owa-mist/50 md:grid-cols-[15rem_9rem_minmax(0,1fr)_auto]"
    >
      <!-- class="contents": el link no genera su propia caja, así sus tres
           hijos (foto, fecha, info) siguen siendo celdas directas de esta
           grilla — necesario para poder sacar los botones de acá afuera y
           que cada uno sea un <a> real a su propio destino. -->
      <a href="${href}" class="contents">
        <div class="relative h-30 overflow-hidden rounded-owa-md bg-owa-abyss md:h-29.5">
          ${foto({
            slug: e.img,
            alt: '',
            sizes: '(min-width: 768px) 240px, 100vw',
            className: 'block h-full w-full',
            imgClass: 'h-full w-full object-cover',
          })}
        </div>

        <div class="min-w-0">
          <p class="font-display text-[clamp(1rem,1.5vw,1.375rem)] leading-tight break-words text-owa-slate uppercase">
            ${e.fechaCorta}${e.anio ? html` <span class="text-owa-slate">${e.anio}</span>` : ''}
          </p>
          ${e.nota ? html`<p class="mt-2 text-[11px] text-owa-slate">${e.nota}</p>` : ''}
        </div>

        <div>
          <p class="font-display text-[13px] font-black tracking-[0.18em] text-owa-blue">${e.sigla}</p>
          <h3 class="mt-2 text-[clamp(1.1875rem,2vw,1.5625rem)] leading-[1.05] text-owa-navy">${e.nombre}</h3>
          <p class="mt-1.5 text-[13px] text-owa-slate">${e.sede}</p>
          <p class="mt-2.5 flex flex-wrap gap-1.5">${travel ? '' : torneo ? chipModalidad(torneo) : modalidadesDe(e)}</p>
        </div>
      </a>

      <div class="grid gap-2 md:min-w-43">
        ${inscripcionUrl
          ? html`
              <a
                href="${inscripcionUrl}"
                target="_blank"
                rel="noopener noreferrer"
                class="u-press rounded-full bg-owa-blue px-5 py-3 text-center font-display text-xs font-black tracking-[0.06em] text-white transition-colors duration-200 ease-out hover:bg-owa-navy"
                >INSCRIBIRSE →</a
              >
            `
          : html`
              <span
                class="rounded-full px-5 py-3 text-center font-display text-xs font-black tracking-[0.06em] ${abierta || chal
                  ? 'bg-owa-blue text-white'
                  : 'bg-owa-sand text-owa-slate'}"
                >${travel ? e.chip : chal ? 'POSTULARME' : abierta ? 'INSCRIBIRSE →' : 'PRÓXIMAMENTE'}</span
              >
            `}
        ${startingListUrl
          ? html`
              <a
                href="${startingListUrl}"
                target="_blank"
                rel="noopener noreferrer"
                class="u-press rounded-full border border-owa-line px-4.5 py-2.5 text-center font-display text-[11px] font-bold tracking-[0.06em] text-owa-slate transition-colors duration-200 ease-out hover:border-owa-navy hover:bg-owa-navy hover:text-white"
                >STARTING LIST</a
              >
            `
          : html`
              <a
                href="${href}"
                class="rounded-full border border-owa-line px-4.5 py-2.5 text-center font-display text-[11px] font-bold tracking-[0.06em] text-owa-slate transition-colors duration-200 ease-out group-hover:border-owa-navy group-hover:bg-owa-navy group-hover:text-white"
                >VER DETALLES</a
              >
            `}
      </div>
    </li>
  `;
}

const lista = () => {
  const travel = TRAVEL.map(normalizarTravel);
  // "Todos" es todo: antes las dos salidas de Travel sólo se veían con su
  // propio filtro y la vista general las dejaba afuera.
  const base =
    filtro === 'TRAVEL'
      ? travel
      : filtro === 'TODOS'
        ? [...ALL.filter(pasaFiltro), ...travel]
        : expandirPorFiltro(ALL.filter(pasaFiltro));
  const grupos = agrupar(base);
  if (!grupos.length)
    return html`<p class="py-16 text-center text-owa-slate">No hay carreras en esta modalidad todavía.</p>`;

  return html`
    <div class="grid gap-10">
      ${grupos.map(
        (g) => html`
          <section class="reveal">
            <div class="flex flex-wrap items-baseline gap-x-3.5 gap-y-2 border-b-2 border-owa-navy pb-3.5">
              <h2 class="text-[clamp(1.375rem,2.6vw,2rem)] leading-[1.05] text-owa-navy">${g.mes}</h2>
              ${g.anio ? html`<span class="font-display text-[15px] font-bold text-owa-blue">${g.anio}</span>` : ''}
              ${g.cuenta
                ? html`<span
                    class="ml-auto rounded-full bg-owa-mist px-4.5 py-1.5 font-display text-sm font-black tracking-[0.12em] whitespace-nowrap text-owa-navy"
                    >${g.cuenta}</span
                  >`
                : ''}
            </div>
            <ul>
              ${g.items.map(fila)}
            </ul>
          </section>
        `
      )}
    </div>
  `;
};

export function render() {
  return toHTML(html`
    <section class="bg-owa-navy px-0 pt-16 pb-11 text-white">
      <div class="u-shell">
        <h1 class="u-h1">Calendario<br />2026/27</h1>
        <p class="mt-5 max-w-[52ch] text-base leading-relaxed text-owa-line">
          Todas las fechas de la temporada. Las inscripciones se procesan en la plataforma externa; desde acá vas al
          formulario de cada carrera.
        </p>
      </div>
    </section>

    <div class="u-shell pt-8 pb-24">
      <div class="u-scroll-x mb-7 flex gap-2" role="group" aria-label="Filtrar por modalidad" data-filtros>
        ${FILTROS.map(([label, v]) => pastilla(label, filtro === v, `data-f="${v}"`))}
      </div>

      <div data-lista>${lista()}</div>
    </div>
  `);
}

export function mount(root) {
  const contenedor = root.querySelector('[data-lista]');
  const barra = root.querySelector('[data-filtros]');

  root.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-f]');
    if (!btn || btn.dataset.f === filtro) return;
    filtro = btn.dataset.f;
    // La tira scrollea: repintarla la mandaba de vuelta al principio y el
    // filtro recién tocado se salía de vista.
    const x = barra.scrollLeft;
    barra.innerHTML = toHTML(FILTROS.map(([label, v]) => pastilla(label, filtro === v, `data-f="${v}"`)));
    barra.scrollLeft = x;
    contenedor.innerHTML = toHTML(lista());
    contenedor.querySelectorAll('.reveal').forEach((el) => el.setAttribute('data-visible', ''));
    stagger(contenedor, '.reveal');
  });
}
