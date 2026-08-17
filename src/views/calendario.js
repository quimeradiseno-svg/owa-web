import { html, toHTML, stagger } from '../lib/html.js';
import { foto } from '../lib/img.js';
import { EVENTOS, ALL, MESES } from '../data/eventos.js';
import { modalidadesDe, pastilla } from '../components/ui.js';
import { fechaBadge } from '../components/tarjeta-evento.js';

export const titulo = 'Calendario 2026/27';

const FILTROS = [
  ['TODOS', 'TODOS'],
  ['GRAND PRIX', 'GP'],
  ['CIRCUITO', 'CIRC'],
  ['EVENTOS ESPECIALES', 'ESP'],
  ['CHALLENGE', 'CHA'],
];

let filtro = 'TODOS';

const pasaFiltro = (e) => {
  if (filtro === 'TODOS') return true;
  if (filtro === 'ESP') return e.tipo === 'especial';
  if (filtro === 'CHA') return e.tipo === 'challenge';
  return e.tipo === 'core';
};

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
  return grupos;
}

function fila(e) {
  const abierta = e.estado === 'abierta';
  const chal = e.tipo === 'challenge';
  const { dia, mes } = fechaBadge(e);

  return html`
    <li>
      <a
        href="/carrera/${e.slug}"
        class="group grid items-center gap-x-5 gap-y-4 border-b border-owa-sand p-4 transition-colors duration-200 ease-out hover:bg-owa-mist/50 md:grid-cols-[15rem_8rem_minmax(0,1fr)_auto]"
      >
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
          <p class="font-display text-[clamp(1rem,1.5vw,1.375rem)] leading-tight text-owa-slate uppercase">
            ${e.fechaCorta}${e.anio ? html` <span class="text-owa-slate">${e.anio}</span>` : ''}
          </p>
          ${e.nota ? html`<p class="mt-2 text-[11px] text-owa-slate">${e.nota}</p>` : ''}
        </div>

        <div>
          <p class="font-display text-[13px] font-black tracking-[0.18em] text-owa-blue">${e.sigla}</p>
          <h3 class="mt-2 text-[clamp(1.1875rem,2vw,1.5625rem)] leading-[1.05] text-owa-navy">${e.nombre}</h3>
          <p class="mt-1.5 text-[13px] text-owa-slate">${e.sede}</p>
          <p class="mt-2.5 flex flex-wrap gap-1.5">${modalidadesDe(e)}</p>
        </div>

        <div class="grid gap-2 md:min-w-43">
          <!-- Badge de estado, no una acción propia: toda la fila es un único
               link a "ver detalles" (la inscripción real vive ahí adentro),
               así que esto no reacciona al hover — si lo hiciera, parecería
               un botón distinto llevando a otro lado. -->
          <span
            class="rounded-full px-5 py-3 text-center font-display text-xs font-black tracking-[0.06em] ${abierta || chal
              ? 'bg-owa-blue text-white'
              : 'bg-owa-sand text-owa-slate'}"
            >${chal ? 'POSTULARME' : abierta ? 'INSCRIBIRSE →' : 'PRÓXIMAMENTE'}</span
          >
          <span
            class="rounded-full border border-owa-line px-4.5 py-2.5 text-center font-display text-[11px] font-bold tracking-[0.06em] text-owa-slate transition-colors duration-200 ease-out group-hover:border-owa-navy group-hover:bg-owa-navy group-hover:text-white"
            >VER DETALLES</span
          >
        </div>
      </a>
    </li>
  `;
}

const lista = () => {
  const grupos = agrupar(ALL.filter(pasaFiltro));
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
      <div class="mb-7 flex flex-wrap gap-2" role="group" aria-label="Filtrar por modalidad" data-filtros>
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
    barra.innerHTML = toHTML(FILTROS.map(([label, v]) => pastilla(label, filtro === v, `data-f="${v}"`)));
    contenedor.innerHTML = toHTML(lista());
    contenedor.querySelectorAll('.reveal').forEach((el) => el.setAttribute('data-visible', ''));
    stagger(contenedor, '.reveal');
  });
}
