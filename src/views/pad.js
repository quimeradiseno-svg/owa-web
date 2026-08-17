import { html, toHTML, stagger } from '../lib/html.js';
import { foto } from '../lib/img.js';
import { PAD_BLOQUES } from '../data/madres.js';
import { eyebrow, btnPrimario, olaSuperior } from '../components/ui.js';

export const titulo = 'PAD';

export function render() {
  return toHTML(html`
    <section class="relative bg-owa-navy px-0 pt-18 pb-19 text-white">
      ${olaSuperior('#fff')}
      <div class="u-shell relative">
        ${eyebrow('PAD', 'sky')}
        <!-- Escala ajustada para que "Programa de desarrollo" entre en una
             línea: el <br> del diseño marca dos, no tres. -->
        <h1 class="mt-4 text-[clamp(2.125rem,4.5vw,4.25rem)] leading-[0.9]">
          Programa de desarrollo<br />de aguas abiertas
        </h1>
        <p class="mt-5.5 max-w-[56ch] text-[17px] leading-relaxed text-owa-line">
          Una estructura de formación para que nadar en aguas abiertas deje de ser un salto al vacío: preparación,
          acompañamiento y una primera carrera con red.
        </p>
      </div>
    </section>

    <div class="u-shell pt-18 pb-24">
      <div class="grid gap-4 md:grid-cols-3" data-stagger>
        ${PAD_BLOQUES.map(
          (b) => html`
            <article class="reveal rounded-owa-lg border border-owa-line p-7.5">
              <h2 class="u-eyebrow text-owa-blue">${b.k}</h2>
              <p class="mt-3.5 font-display text-xl leading-[1.05] font-black text-owa-navy uppercase">${b.t}</p>
              <p class="mt-3 text-[15px] leading-[1.7] text-owa-slate">${b.d}</p>
            </article>
          `
        )}
      </div>

      <div class="reveal-clip mt-6.5 h-90 overflow-hidden rounded-owa-lg">
        ${foto({
          slug: 'pad-familia',
          alt: 'Familia acompañando a un chico con la remera de OWA en la orilla',
          sizes: '(min-width: 1280px) 1216px, 100vw',
          className: 'block h-full w-full',
          imgClass: 'h-full w-full object-cover',
          position: 'center 30%',
        })}
      </div>

      <div class="mt-6.5 flex flex-wrap items-center justify-between gap-5.5 rounded-owa-lg bg-owa-mist p-9">
        <div class="max-w-[56ch]">
          <h2 class="text-[clamp(1.375rem,2.8vw,2rem)] text-owa-navy">Sumate al PAD</h2>
          <p class="mt-2 text-[15px] text-owa-slate">
            Actividades, sedes y calendario propio: contenido a completar por OWA. El canal de inscripción (formulario o
            contacto directo) queda a definir.
          </p>
        </div>
        ${btnPrimario('Quiero información', 'mailto:info@owa.com.ar?subject=PAD%20—%20quiero%20informaci%C3%B3n')}
      </div>
    </div>
  `);
}

export function mount(root) {
  root.querySelectorAll('[data-stagger]').forEach((g) => stagger(g));
}
