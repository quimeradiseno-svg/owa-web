import { html, raw, toHTML, stagger } from '../lib/html.js';
import { foto, fondoVideo, montarFondoVideo } from '../lib/img.js';
import { MODALIDADES_TRAVEL, GALERIA_TRAVEL } from '../data/travel.js';
import { eyebrow, btnPrimario, btnBordeClaro, olaSuperior } from '../components/ui.js';

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
            ${m.parrafos.map((p) => html`<p>${raw(p)}</p>`)}
          </div>
        </div>

        <div class="reveal-clip h-80 overflow-hidden rounded-owa-lg ${invertido ? 'lg:order-1' : ''}">
          ${foto({
            slug: m.img,
            alt: m.alt,
            sizes: '(min-width: 1024px) 50vw, 100vw',
            className: 'block h-full w-full',
            // zoom acerca el encuadre al grupo: la toma de drone abierta los
            // dejaba diminutos contra el mar.
            imgClass: `h-full w-full object-cover ${m.zoom ? 'scale-150 object-[50%_42%]' : ''}`,
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
                <li class="border-b border-owa-navy/10 py-3.5 last:border-b-0 md:[&:nth-last-child(2)]:border-b-0">
                  <p class="font-display text-[13px] font-black tracking-[0.05em] text-owa-navy uppercase">${e.t}</p>
                  <p class="mt-1 text-sm leading-relaxed text-owa-slate">${raw(e.d)}</p>
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
      ${fondoVideo({
        posterSlug: 'tv-hero',
        mp4: '/video/travel-buzios.mp4',
        alt: 'Vista aérea del grupo de OWA Travel cruzando la bahía de Búzios',
        opacity: 0.88,
      })}
      <div class="u-hero-scrim-video absolute inset-0"></div>
      ${olaSuperior('#fff')}

      <div class="u-shell relative w-full pt-28 pb-19 text-white">
        ${eyebrow('Viajes grupales', 'sky')}

        <!-- El logo va absoluto: es mas alto que el titulo y, en el flujo,
             estiraba la fila y separaba el subtitulo mas que en el resto de
             las paginas. Con top-0 igual arranca a la altura del h1. -->
        <div class="relative mt-4">
          <h1 class="text-[clamp(2.375rem,6.4vw,6rem)] leading-[0.9]">OWA Travel</h1>
          <img
            src="/brand/owa-travel-blanco.svg"
            alt=""
            aria-hidden="true"
            width="89"
            height="151"
            class="absolute top-0 right-0 hidden h-auto w-[clamp(3.1rem,4.75vw,4.275rem)] opacity-90 lg:block"
          />
        </div>

        <p class="mt-6 max-w-[46ch] text-[19px] leading-relaxed text-owa-line">
          Dos formas de conocer el mundo a través del agua.
        </p>
      </div>
    </section>

    ${MODALIDADES_TRAVEL.map(modalidad)}

    <!-- Galeria: la tortuga ocupa dos columnas y dos filas porque es la unica
         foto que documenta lo que promete el itinerario. El resto entra en la
         grilla de a una. Sin lightbox: son fotos de ambiente, no material que
         alguien vaya a querer inspeccionar de cerca. -->
    <section class="bg-owa-abyss px-0 py-19 text-white" aria-labelledby="h-galeria">
      <div class="u-shell">
        <h2 id="h-galeria" class="u-eyebrow text-owa-sky">Búzios en fotos</h2>
        <p class="mt-3.5 max-w-[46ch] text-[17px] leading-relaxed text-owa-line">
          Islas, corales, tortugas y un grupo que vuelve. Así se vive un Swim &amp; Adventure.
        </p>

        <!-- Filas de alto fijo: la destacada ocupa dos, y como todas las fotos
             llenan su celda (h-full) la grilla cierra sin huecos. Con alto por
             imagen en vez de por fila quedaban espacios negros al lado de la
             destacada. -->
        <ul
          class="mt-8 grid auto-rows-[8.5rem] grid-cols-2 gap-3 md:auto-rows-[10.5rem] md:grid-cols-4"
          data-stagger
        >
          ${GALERIA_TRAVEL.map(
            (g) => html`
              <li class="reveal-clip overflow-hidden rounded-owa-md ${g.destacada ? 'col-span-2 row-span-2' : ''}">
                ${foto({
                  slug: g.slug,
                  alt: g.alt,
                  sizes: g.destacada ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 25vw, 50vw',
                  className: 'block h-full w-full',
                  imgClass: 'h-full w-full object-cover',
                })}
              </li>
            `
          )}
        </ul>
      </div>
    </section>

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
          ${btnPrimario('Consultar por WhatsApp', WA)} ${btnBordeClaro('Escribir por mail', MAIL)}
        </div>
      </div>
    </section>
  `);
}

export function mount(root) {
  montarFondoVideo(root);
  root.querySelectorAll('[data-stagger]').forEach((g) => stagger(g));
}
