import { html, toHTML, stagger } from '../lib/html.js';
import { EVENTOS } from '../data/eventos.js';
import { GP, CIRC, CLUBES_GP, CLUBES_CIRC, RESULTADOS, CATS, REGLAS } from '../data/rankings.js';
import { posicion, pastilla } from '../components/ui.js';

export const titulo = 'Resultados & Rankings';
export const descripcion =
  'Resultados y rankings de la temporada 2026/27 del Grand Prix y el Circuito OWA. Posiciones por nadador, por categoría y campeonato por equipos.';

const TABS = [
  ['RESULTADOS POR CARRERA', 'carrera'],
  ['RANKINGS GRAND PRIX', 'gp'],
  ['RANKINGS CIRCUITO OWA', 'circ'],
];

const VISTAS = [
  ['GENERALES MASCULINO', 'gen-m'],
  ['GENERALES FEMENINO', 'gen-f'],
  ['CATEGORÍAS MASCULINAS', 'cat-m'],
  ['CATEGORÍAS FEMENINAS', 'cat-f'],
  ['CAMPEONATO POR EQUIPOS', 'equipos'],
];

const s = {
  tab: 'carrera',
  vista: 'gen-m',
  cat: 'TODAS',
  q: '',
  sel: null,
  temporada: '2026/27',
  carrera: 'Open Water San Pedro · Grand Prix',
  distancia: 'TODAS',
};

const carrerasOpts = EVENTOS.flatMap((e) =>
  e.tipo === 'core' ? [`${e.nombre} · Grand Prix`, `${e.nombre} · Circuito`] : [e.nombre]
);

/* --------------------------------------------------------------- controles */

const selector = (id, label, valor, opciones, extra = '') => html`
  <label class="contents">
    <span class="sr-only">${label}</span>
    <select
      data-sel="${id}"
      class="select h-auto min-h-0 rounded-full border-owa-line bg-white px-5 py-3 text-sm text-owa-navy ${extra}"
    >
      ${opciones.map((o) => html`<option value="${o}" ${o === valor ? 'selected' : ''}>${o}</option>`)}
    </select>
  </label>
`;

const buscador = (placeholder) => html`
  <label class="flex max-w-110 min-w-65 flex-1 items-center gap-3 rounded-full border border-owa-line px-5 py-3">
    <span class="sr-only">${placeholder}</span>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4.5 shrink-0 text-owa-slate">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" stroke-linecap="round" />
    </svg>
    <input
      data-q
      type="search"
      value="${s.q}"
      placeholder="${placeholder}"
      class="min-w-0 flex-1 bg-transparent text-[15px] text-owa-navy outline-none placeholder:text-owa-slate/70"
    />
  </label>
`;

const vacio = (texto) => html`
  <p class="rounded-owa-lg border border-dashed border-owa-line px-6 py-14 text-center text-owa-slate">${texto}</p>
`;

/* ------------------------------------------------------- tab 1 · por carrera */

function tablaCarrera() {
  const q = s.q.trim().toLowerCase();
  const rows = RESULTADOS.filter((r) => !q || r.nombre.toLowerCase().includes(q));

  return html`
    <div class="flex flex-wrap items-center gap-3">
      ${selector('temporada', 'Temporada', s.temporada, ['2026/27', '2025/26'])}
      ${selector('carrera', 'Carrera', s.carrera, carrerasOpts, 'min-w-70')}
      ${selector('distancia', 'Distancia', s.distancia, ['TODAS', '1K', '3K', '5K'])}
    </div>

    <div class="mt-5.5">${buscador('Buscar nadador')}</div>

    ${rows.length
      ? html`
          <div class="mt-6 overflow-x-auto rounded-owa-lg border border-owa-line">
            <table class="w-full min-w-160 border-collapse text-left">
              <caption class="sr-only">${s.carrera} — ${s.temporada}</caption>
              <thead>
                <tr class="bg-owa-sand text-[10px] tracking-[0.14em] text-owa-slate">
                  ${['POS', 'NADADOR', 'SEXO', 'CATEGORÍA', 'CLUB', 'TIEMPO'].map(
                    (h) => html`<th scope="col" class="px-5.5 py-4 font-normal">${h}</th>`
                  )}
                  <th scope="col" class="px-5.5 py-4 text-right font-normal">PTOS</th>
                </tr>
              </thead>
              <tbody>
                ${rows.map(
                  (r, i) => html`
                    <tr class="border-t border-owa-sand transition-colors duration-200 ease-out hover:bg-owa-sand">
                      <td class="px-5.5 py-4">${posicion(i + 1)}</td>
                      <th scope="row" class="px-5.5 py-4 text-left font-display text-[15px] font-bold whitespace-nowrap text-owa-navy">
                        ${r.nombre}
                      </th>
                      <td class="px-5.5 py-4 text-[13px] text-owa-slate">${r.sexo}</td>
                      <td class="px-5.5 py-4 text-[13px] text-owa-slate">${r.cat}</td>
                      <td class="px-5.5 py-4 text-[13px] text-owa-slate">${r.club}</td>
                      <td class="px-5.5 py-4 font-display text-[15px] font-black text-owa-navy">${r.tiempo}</td>
                      <td class="px-5.5 py-4 text-right font-display text-[15px] font-black text-owa-blue">${r.puntos}</td>
                    </tr>
                  `
                )}
              </tbody>
            </table>
          </div>
        `
      : html`<div class="mt-6">${vacio(`Ningún nadador coincide con "${s.q}".`)}</div>`}
  `;
}

/* ----------------------------------------------------- tab 2/3 · rankings */

const datosRank = () => (s.tab === 'circ' ? CIRC : GP);
const clubesRank = () => (s.tab === 'circ' ? CLUBES_CIRC : CLUBES_GP);

function tablaEquipos() {
  return html`
    <div class="overflow-x-auto rounded-owa-lg border border-owa-line">
      <table class="w-full min-w-120 border-collapse text-left">
        <caption class="sr-only">Campeonato por equipos</caption>
        <thead>
          <tr class="bg-owa-sand text-[10px] tracking-[0.14em] text-owa-slate">
            <th scope="col" class="px-5.5 py-4 font-normal">POS</th>
            <th scope="col" class="px-5.5 py-4 font-normal">CLUB</th>
            <th scope="col" class="px-5.5 py-4 font-normal">NADADORES</th>
            <th scope="col" class="px-5.5 py-4 text-right font-normal">PUNTOS</th>
          </tr>
        </thead>
        <tbody>
          ${clubesRank().map(
            (c, i) => html`
              <tr class="border-t border-owa-sand">
                <td class="px-5.5 py-4.5">${posicion(i + 1)}</td>
                <th scope="row" class="px-5.5 py-4.5 text-left font-display text-[15px] font-bold whitespace-nowrap text-owa-navy">
                  ${c.nombre}
                </th>
                <td class="px-5.5 py-4.5 text-[13px] text-owa-slate">${c.nadadores}</td>
                <td class="px-5.5 py-4.5 text-right font-display text-base font-black text-owa-blue">${c.puntos}</td>
              </tr>
            `
          )}
        </tbody>
      </table>
    </div>
  `;
}

function tablaNadadores() {
  const esCat = s.vista === 'cat-m' || s.vista === 'cat-f';
  const sexo = s.vista === 'gen-f' || s.vista === 'cat-f' ? 'F' : 'M';
  const q = s.q.trim().toLowerCase();

  const rows = datosRank()
    .filter((r) => r.sexo === sexo)
    .filter((r) => !esCat || s.cat === 'TODAS' || r.cat === s.cat)
    .filter((r) => !q || r.nombre.toLowerCase().includes(q));

  return html`
    <div class="mb-5.5 flex flex-wrap items-center gap-4.5">
      ${esCat
        ? html`
            <div class="flex items-center gap-2.5">
              <span class="text-[10px] tracking-[0.16em] text-owa-slate">CATEGORÍA</span>
              ${selector('cat', 'Categoría', s.cat, CATS)}
            </div>
          `
        : ''}
      <div class="ml-auto">${buscador('Buscá tu posición')}</div>
    </div>

    ${rows.length
      ? html`
          <div class="overflow-x-auto rounded-owa-lg border border-owa-line">
            <table class="w-full min-w-160 border-collapse text-left">
              <caption class="sr-only">Ranking ${s.tab === 'circ' ? 'Circuito OWA' : 'Grand Prix'}</caption>
              <thead>
                <tr class="bg-owa-sand text-[10px] tracking-[0.14em] text-owa-slate">
                  ${['POS', 'NADADOR', 'CATEGORÍA', 'CLUB', 'CARRERAS'].map(
                    (h) => html`<th scope="col" class="px-5.5 py-4 font-normal">${h}</th>`
                  )}
                  <th scope="col" class="px-5.5 py-4 text-right font-normal">PUNTOS</th>
                </tr>
              </thead>
              <tbody>
                ${rows.map(
                  (r, i) => html`
                    <tr
                      data-nadador="${r.nombre}"
                      tabindex="0"
                      role="button"
                      aria-label="Ver ficha de ${r.nombre}"
                      class="cursor-pointer border-t border-owa-sand transition-colors duration-200 ease-out hover:bg-owa-mist focus-visible:bg-owa-mist"
                    >
                      <td class="px-5.5 py-4.5">${posicion(i + 1)}</td>
                      <th scope="row" class="px-5.5 py-4.5 text-left font-display text-[15px] font-bold whitespace-nowrap text-owa-navy">
                        ${r.nombre}
                      </th>
                      <td class="px-5.5 py-4.5 text-[13px] text-owa-slate">${r.cat}</td>
                      <td class="px-5.5 py-4.5 text-[13px] text-owa-slate">${r.club}</td>
                      <td class="px-5.5 py-4.5 text-[13px] text-owa-slate">${r.carreras}</td>
                      <td class="px-5.5 py-4.5 text-right font-display text-base font-black text-owa-blue">${r.puntos}</td>
                    </tr>
                  `
                )}
              </tbody>
            </table>
          </div>
        `
      : vacio(q ? `Ningún nadador coincide con "${s.q}".` : 'Todavía no hay nadadores puntuando en esta vista.')}
    ${s.sel ? ficha(s.sel) : ''}
  `;
}

const ficha = (r) => html`
  <div class="ficha-in mt-6.5 rounded-owa-lg bg-owa-navy p-8 text-white">
    <div class="flex flex-wrap items-start justify-between gap-4.5">
      <div>
        <p class="text-[11px] tracking-[0.16em] text-owa-sky">FICHA DE NADADOR</p>
        <p class="mt-2.5 font-display text-[clamp(1.5rem,3vw,2.375rem)] leading-none font-black uppercase">${r.nombre}</p>
        <p class="mt-2 text-[13px] text-owa-line">${r.cat} · ${r.club}</p>
      </div>
      <button
        type="button"
        data-cerrar-ficha
        class="u-press cursor-pointer rounded-full px-3 py-2 text-[13px] tracking-[0.1em] text-owa-line transition-colors hover:text-white"
      >
        CERRAR ✕
      </button>
    </div>
    <dl class="mt-6.5 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
      ${[
        ['PUNTOS', r.puntos],
        ['CARRERAS', r.carreras],
        ['PODIOS', r.podios],
        ['CATEGORÍA', r.cat],
      ].map(
        ([k, v]) => html`
          <div class="rounded-owa-md bg-white/6 p-5">
            <dd data-nums class="font-display text-[2rem] font-black text-owa-cyan">${v}</dd>
            <dt class="mt-2 text-[11px] tracking-[0.12em] text-owa-line/80">${k}</dt>
          </div>
        `
      )}
    </dl>
  </div>
`;

const comoSeCalcula = () => html`
  <section class="mt-13 rounded-owa-lg bg-owa-mist p-9" aria-labelledby="h-calculo">
    <h2 id="h-calculo" class="text-[clamp(1.375rem,2.8vw,2rem)] text-owa-navy">¿Cómo se calcula el ranking?</h2>
    <p class="mt-2.5 max-w-[64ch] text-[15px] leading-relaxed text-owa-slate">
      Propuesta de sistema, pendiente de definición oficial por OWA. La estructura de la página soporta cualquier
      esquema de puntaje sin cambios de diseño.
    </p>
    <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      ${REGLAS.map(
        (g) => html`
          <article class="rounded-owa-md bg-white p-6">
            <h3 class="font-display text-[15px] font-black text-owa-navy">${g.t}</h3>
            <p class="mt-2.5 text-sm leading-relaxed text-owa-slate">${g.d}</p>
          </article>
        `
      )}
    </div>
  </section>
`;

/* ----------------------------------------------------------------- vista */

const panel = () =>
  s.tab === 'carrera'
    ? tablaCarrera()
    : html`
        <div class="mb-6.5 flex flex-wrap gap-2" role="group" aria-label="Vista del ranking">
          ${VISTAS.map(([label, v]) => pastilla(label, s.vista === v, `data-vista="${v}"`))}
        </div>
        ${s.vista === 'equipos' ? tablaEquipos() : tablaNadadores()} ${comoSeCalcula()}
      `;

const barraTabs = () => html`
  <!-- Apilados en móvil las tres pestañas con esquina redondeada arriba se leen
       como tarjetas rotas; en pantalla chica scrollean en una sola fila. -->
  <div
    class="mt-9 flex snap-x gap-1 overflow-x-auto pb-px md:flex-wrap md:overflow-visible"
    role="tablist"
    aria-label="Secciones de resultados"
  >
    ${TABS.map(
      ([label, v]) => html`
        <button
          type="button"
          role="tab"
          data-tab="${v}"
          aria-selected="${s.tab === v ? 'true' : 'false'}"
          class="u-press shrink-0 snap-start cursor-pointer rounded-t-owa-md px-5.5 py-3.5 font-display text-xs font-black tracking-[0.08em] whitespace-nowrap transition-colors duration-200 ease-out ${s.tab ===
          v
            ? 'bg-white text-owa-navy'
            : 'bg-white/8 text-white/70 hover:bg-white/14 hover:text-white'}"
        >
          ${label}
        </button>
      `
    )}
  </div>
`;

export function render(ctx) {
  const pedida = ctx.query.get('tab');
  if (pedida && TABS.some(([, v]) => v === pedida)) s.tab = pedida;

  return toHTML(html`
    <section class="bg-owa-navy px-0 pt-15 text-white">
      <div class="u-shell">
        <h1 class="text-[clamp(2.375rem,4.5vw,4.25rem)] leading-[0.9]">Resultados<br />&amp; rankings</h1>
        <p class="mt-3.5 font-display text-sm font-bold tracking-[0.14em] text-owa-sky">TEMPORADA 2026/27</p>
        <div data-tabs>${barraTabs()}</div>
      </div>
    </section>

    <div class="u-shell pt-9.5 pb-24" data-panel>${panel()}</div>
  `);
}

export function mount(root) {
  const cont = root.querySelector('[data-panel]');
  const tabs = root.querySelector('[data-tabs]');

  const repintar = ({ foco } = {}) => {
    cont.innerHTML = toHTML(panel());
    tabs.innerHTML = toHTML(barraTabs());
    cont.querySelectorAll('[data-stagger]').forEach((g) => stagger(g));
    if (foco) cont.querySelector(foco)?.focus();
  };

  root.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-tab]');
    if (tab) {
      if (tab.dataset.tab === s.tab) return;
      s.tab = tab.dataset.tab;
      s.sel = null;
      s.q = '';
      history.replaceState({}, '', s.tab === 'carrera' ? '/resultados' : `/resultados?tab=${s.tab}`);
      return repintar();
    }

    const vista = e.target.closest('[data-vista]');
    if (vista) {
      if (vista.dataset.vista === s.vista) return;
      s.vista = vista.dataset.vista;
      s.sel = null;
      return repintar();
    }

    if (e.target.closest('[data-cerrar-ficha]')) {
      s.sel = null;
      return repintar();
    }

    const fila = e.target.closest('[data-nadador]');
    if (fila) {
      const r = datosRank().find((x) => x.nombre === fila.dataset.nadador);
      s.sel = s.sel?.nombre === r.nombre ? null : r;
      repintar();
    }
  });

  root.addEventListener('keydown', (e) => {
    const fila = e.target.closest('[data-nadador]');
    if (!fila || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    fila.click();
  });

  root.addEventListener('change', (e) => {
    const sel = e.target.closest('[data-sel]');
    if (!sel) return;
    s[sel.dataset.sel] = sel.value;
    repintar();
  });

  let t;
  root.addEventListener('input', (e) => {
    if (!e.target.closest('[data-q]')) return;
    s.q = e.target.value;
    clearTimeout(t);
    t = setTimeout(() => repintar({ foco: '[data-q]' }), 180);
  });
}
