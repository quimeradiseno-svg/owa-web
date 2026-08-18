import { html, toHTML, stagger } from '../lib/html.js';
import { foto, fondo } from '../lib/img.js';
import { MODALIDADES_TRAVEL } from '../data/travel.js';
import { eyebrow, btnPrimario, btnBorde, olaSuperior } from '../components/ui.js';

export const titulo = 'OWA Travel';

const WA = 'https://wa.me/5491125543112';
const MAIL = 'mailto:info@owa.com.ar?subject=OWA%20Travel';

/** Bloque de modalidad. El segundo invierte las columnas para que la página
    no lea como dos fichas iguales apiladas. */
function modalidad(m, i) {
  const invertido = i % 2 === 1;

  return html`
    <section class="${invertido ? 'bg-owa-mist' : 'bg-white'} px-0 py-20" aria-labelledby="h-${m.slug}">
      <div class="u-shell grid items-center gap-12 lg:grid-cols-2">
        <div class="${invertido ? 'lg:order-2' : ''}">
          <h2 id="h-${m.slug}" class="text-[clamp(1.75rem,4vw,3rem)] leading-[0.96] text-owa-navy">${m.nombre}</h2>
          <p class="mt-3.5 font-display text-[clamp(1rem,1.6vw,1.25rem)] font-bold text-owa-blue">${m.tagline}</p>
          <div class="mt-5 grid max-w-[62ch] gap-3.5 text-base leading-[1.75] text-owa-slate">
            ${m.parrafos.map((p) => html`<p>${p}</p>`)}
          </div>
        </div>

        <div class="reveal-clip h-80 overflow-hidden rounded-owa-lg ${invertido ? 'lg:order-1' : ''}">
          ${foto({
            slug: m.img,
            alt: m.alt,
            sizes: '(min-width: 1024px) 50vw, 100vw',
            className: 'block h-full w-full',
            imgClass: 'h-full w-full object-cover',
          })}
        </div>
      </div>

      <!-- Los 5 ítems van dentro de una caja y a dos columnas: sueltos en tres
           columnas la última fila quedaba coja y los bordes se leían como una
           tabla rota. -->
      <div class="u-shell mt-11">
        <div class="rounded-owa-lg ${invertido ? 'bg-white' : 'bg-owa-sand'} p-8">
          <h3 class="u-eyebrow text-owa-blue">La experiencia</h3>
          <ul class="mt-4 grid gap-x-9 md:grid-cols-2">
            ${m.experiencia.map(
              (e) => html`
                <li class="flex gap-3 border-b border-owa-navy/10 py-3 last:border-b-0">
                  <span class="font-display font-black text-owa-blue" aria-hidden="true">·</span>
                  <span class="text-sm leading-relaxed text-owa-slate">${e}</span>
                </li>
              `
            )}
          </ul>
        </div>
      </div>
    </section>
  `;
}

export function render() {
  return toHTML(html`
    <section class="relative flex min-h-[60svh] items-end overflow-hidden bg-owa-abyss">
      <!-- travel-playa se usa en el bloque de Swim & Adventure: repetirla acá
           dejaba la misma foto dos veces en una pantalla. -->
      ${fondo({
        slug: 'especiales-panoramica',
        alt: 'Vista panorámica de nadadores y tablas de SUP en el río',
        opacity: 0.68,
        priority: true,
      })}
      <div class="u-hero-scrim-sm absolute inset-0"></div>
      ${olaSuperior('#fff')}
      <div class="u-shell relative pt-28 pb-19 text-white">
        ${eyebrow('Viajes grupales', 'sky')}
        <h1 class="mt-4 text-[clamp(2.375rem,6.4vw,6rem)] leading-[0.9]">OWA Travel</h1>
        <p class="mt-6 max-w-[46ch] text-[19px] leading-relaxed text-owa-line">
          Dos formas de conocer el mundo a través del agua.
        </p>
      </div>
    </section>

    ${MODALIDADES_TRAVEL.map(modalidad)}

    <section class="bg-owa-navy px-0 py-18 text-white">
      <div class="u-shell flex flex-wrap items-center justify-between gap-6">
        <div>
          <p class="font-display text-[clamp(1.5rem,3vw,2.375rem)] leading-none font-black uppercase">
            ¿Te interesa alguna salida?
          </p>
          <p class="mt-2.5 max-w-[52ch] text-[15px] text-owa-line">
            Escribinos y te pasamos el detalle del viaje: itinerario, valores y todo lo que incluye.
          </p>
        </div>
        <div class="flex flex-wrap gap-2.5">
          ${btnPrimario('Consultar por WhatsApp', WA)} ${btnBorde('Escribir por mail', MAIL, 'border-white/60 text-white hover:bg-white hover:text-owa-navy')}
        </div>
      </div>
    </section>
  `);
}

export function mount(root) {
  root.querySelectorAll('[data-stagger]').forEach((g) => stagger(g));
}
