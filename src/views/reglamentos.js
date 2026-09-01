import { html, toHTML, stagger } from '../lib/html.js';
import { REGLAMENTO_GENERAL, REGLAMENTOS } from '../data/reglamentos.js';
import { eyebrow, olaSuperior } from '../components/ui.js';
import { icono } from '../components/iconos.js';

export const titulo = 'Reglamentos';
export const descripcion =
  'Reglamento general, reglamentos deportivos del Grand Prix y el Circuito OWA, y los anexos de cada carrera: neopreno, categorías, cortes de tiempo y seguridad en el agua.';

/** Fila de anexo. Sin link todavía no es un enlace: un <a> que no lleva a
    ningún lado es peor que un texto que avisa que falta. */
const anexo = (a) =>
  a.url
    ? html`
        <li>
          <a
            href="${a.url}"
            target="_blank"
            rel="noopener noreferrer"
            class="u-press group flex items-center gap-4 border-t border-owa-navy/12 py-3.5 transition-colors hover:bg-owa-mist/60"
          >
            <span class="font-display text-[13px] font-black tracking-[0.1em] text-owa-blue">${a.sigla}</span>
            <span class="min-w-0 flex-1 truncate border-l border-owa-navy/20 pl-4 text-sm text-owa-slate">
              ${a.carrera}
            </span>
            <span
              class="shrink-0 font-display text-[11px] font-black tracking-[0.06em] text-owa-navy transition-transform duration-200 ease-out group-hover:translate-x-0.5"
            >
              ABRIR ↗
            </span>
          </a>
        </li>
      `
    : html`
        <li class="flex items-center gap-4 border-t border-owa-navy/12 py-3.5">
          <span class="font-display text-[13px] font-black tracking-[0.1em] text-owa-navy/35">${a.sigla}</span>
          <span class="min-w-0 flex-1 truncate border-l border-owa-navy/12 pl-4 text-sm text-owa-navy/45">
            ${a.carrera}
          </span>
          <span class="shrink-0 font-display text-[11px] font-black tracking-[0.06em] text-owa-navy/40">PENDIENTE</span>
        </li>
      `;

export function render() {
  return toHTML(html`
    <section class="relative bg-owa-navy px-0 pt-18 pb-16 text-white">
      ${olaSuperior('#fff')}
      <div class="u-shell relative">
        ${eyebrow('Temporada 2026/27', 'sky')}
        <h1 class="mt-4 text-[clamp(2.375rem,6vw,5.375rem)] leading-[0.9]">Reglamentos</h1>
        <p class="mt-6 max-w-[54ch] text-[17px] leading-relaxed text-owa-line">
          El reglamento general, el deportivo de cada torneo y el anexo particular de cada carrera.
        </p>
      </div>
    </section>

    <div class="u-shell pt-16 pb-24">
      <!-- El general va aparte y arriba: rige sobre todo lo demás. -->
      <a
        href="${REGLAMENTO_GENERAL.url}"
        target="_blank"
        rel="noopener noreferrer"
        class="u-press group flex flex-wrap items-center justify-between gap-5 rounded-owa-lg bg-owa-navy p-8 text-white transition-colors hover:bg-owa-abyss"
      >
        <div class="flex items-center gap-5">
          <span class="shrink-0 text-owa-cyan">${icono('documento', 'size-9')}</span>
          <div>
            <p class="font-display text-[clamp(1.125rem,2.2vw,1.5rem)] font-black uppercase">${REGLAMENTO_GENERAL.t}</p>
            <p class="mt-1.5 text-sm text-owa-line">${REGLAMENTO_GENERAL.d}</p>
          </div>
        </div>
        <span
          class="shrink-0 rounded-full bg-owa-cyan px-6 py-3 font-display text-xs font-black tracking-[0.06em] text-owa-deep transition-transform duration-200 ease-out group-hover:translate-x-0.5"
        >
          ABRIR ↗
        </span>
      </a>

      <div class="mt-5 grid gap-5 lg:grid-cols-2" data-stagger>
        ${REGLAMENTOS.map(
          (r) => html`
            <section class="reveal rounded-owa-lg border border-owa-line p-8" aria-labelledby="h-${r.sigla || r.torneo.replace(/\s+/g, '-').toLowerCase()}">
              <h2
                id="h-${r.torneo.replace(/\s+/g, '-').toLowerCase()}"
                class="text-[clamp(1.25rem,2.4vw,1.625rem)] text-owa-navy"
              >
                ${r.torneo}
              </h2>

              <a
                href="${r.deportivo.url}"
                target="_blank"
                rel="noopener noreferrer"
                class="u-press group mt-5 flex items-center justify-between gap-4 rounded-owa-md bg-owa-mist p-5 transition-colors hover:bg-owa-sand"
              >
                <span class="font-display text-sm font-black text-owa-navy uppercase">${r.deportivo.t}</span>
                <span
                  class="shrink-0 font-display text-[11px] font-black tracking-[0.06em] text-owa-blue transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                >
                  ABRIR ↗
                </span>
              </a>

              <h3 class="u-eyebrow mt-7 text-owa-blue">Anexos por carrera</h3>
              <ul class="mt-3.5">
                ${r.anexos.map(anexo)}
              </ul>
            </section>
          `
        )}
      </div>
    </div>
  `);
}

export function mount(root) {
  root.querySelectorAll('[data-stagger]').forEach((g) => stagger(g));
}
