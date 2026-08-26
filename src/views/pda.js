import { html, raw, toHTML, stagger } from '../lib/html.js';
import { foto } from '../lib/img.js';
import { PDA_INTRO, PDA_BECAS, PDA_CONVOCATORIAS } from '../data/pda.js';
import { eyebrow, btnPrimario, btnBorde, olaSuperior, pendiente } from '../components/ui.js';

export const titulo = 'PDA';

export function render() {
  return toHTML(html`
    <section class="relative bg-owa-navy px-0 pt-18 pb-19 text-white">
      ${olaSuperior('#fff')}
      <div class="u-shell relative">
        ${eyebrow('PDA', 'sky')}
        <h1 class="mt-4 text-[clamp(2.125rem,4.6vw,4.25rem)] leading-[0.9]">
          Programa Desarrollo<br />Aguas Abiertas
        </h1>
        <p class="mt-5.5 max-w-[56ch] text-[17px] leading-relaxed text-owa-line">
          Más oportunidades para que nadadores, entrenadores, clubes y escuelas puedan crecer dentro de las aguas
          abiertas.
        </p>
      </div>
    </section>

    <!-- La declaración manda y ocupa dos tercios; los ejes van al costado como
         aclaración, con menos peso. Así el bloque llena el ancho sin repetir
         lo que ya desarrollan las secciones de abajo. -->
    <div class="u-shell grid gap-x-12 gap-y-6 pt-18 lg:grid-cols-[1.7fr_1fr] lg:items-start">
      <p class="text-[clamp(1.25rem,2.2vw,1.5rem)] leading-[1.45] text-owa-navy [&_strong]:font-bold">
        ${raw(PDA_INTRO.lead)}
      </p>
      <p
        class="border-owa-navy/12 text-[15px] leading-[1.7] text-owa-slate lg:border-s lg:ps-12 [&_strong]:font-bold [&_strong]:text-owa-navy"
      >
        ${raw(PDA_INTRO.ejes)}
      </p>
    </div>

    <!-- ------------------------------------------------------------- becas -->
    <section class="u-shell grid items-center gap-12 pt-16 lg:grid-cols-2" aria-labelledby="h-becas">
      <div>
        ${eyebrow(PDA_BECAS.kicker, 'blue')}
        <h2 id="h-becas" class="mt-3.5 text-[clamp(1.625rem,3.2vw,2.5rem)] leading-[0.98] text-owa-navy">
          ${PDA_BECAS.titulo}
        </h2>
        <div class="mt-4.5 grid max-w-[58ch] gap-3.5 text-base leading-[1.75] text-owa-slate [&_strong]:font-bold [&_strong]:text-owa-navy">
          ${PDA_BECAS.parrafos.map((p) => html`<p>${raw(p)}</p>`)}
        </div>
      </div>

      <div class="reveal-clip h-80 overflow-hidden rounded-owa-lg">
        ${foto({
          slug: 'pda-romeo',
          alt: 'Romeo Giménez con su certificado de beca del PDA',
          sizes: '(min-width: 1024px) 50vw, 100vw',
          className: 'block h-full w-full',
          imgClass: 'h-full w-full object-cover object-top',
        })}
      </div>
    </section>

    <!-- ------------------------------------------------------ convocatorias -->
    <section class="u-shell pt-16 pb-24" aria-labelledby="h-convocatorias">
      <h2 id="h-convocatorias" class="sr-only">Convocatorias abiertas</h2>
      <div class="grid gap-4.5 lg:grid-cols-2" data-stagger>
        ${PDA_CONVOCATORIAS.map(
          (c) => html`
            <article
              class="reveal flex flex-col rounded-owa-lg p-8 ${c.destacado
                ? 'bg-owa-mist'
                : 'border border-owa-line bg-white'}"
            >
              ${eyebrow(c.kicker, 'blue')}
              <h3 class="mt-3.5 text-[clamp(1.375rem,2.6vw,1.875rem)] leading-[1.02] text-owa-navy">${c.titulo}</h3>
              <div class="mt-4 grid gap-3.5 text-[15px] leading-[1.7] text-owa-slate [&_strong]:font-bold [&_strong]:text-owa-navy">
                ${c.parrafos.map((p) => html`<p>${raw(p)}</p>`)}
              </div>
              <div class="mt-7">
                ${c.destacado ? btnPrimario(c.cta.label, c.cta.href) : btnBorde(c.cta.label, c.cta.href)}
              </div>
            </article>
          `
        )}
      </div>

      ${pendiente('Los dos botones abren un mail a la organización. El formulario de postulación queda por definir.')}
    </section>
  `);
}

export function mount(root) {
  root.querySelectorAll('[data-stagger]').forEach((g) => stagger(g));
}
