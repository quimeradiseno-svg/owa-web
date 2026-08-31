import { html, raw } from '../lib/html.js';
import { foto } from '../lib/img.js';
import { btnAccent } from './ui.js';

/* Franja de cierre con acceso directo a la inscripcion.
   Va a sangre: la foto y el velo ocupan el ancho completo de la ventana,
   mientras el contenido se mantiene sobre la misma grilla que el resto del
   sitio (u-shell). Antes la franja entera vivia dentro de la grilla y
   quedaba como una tarjeta suelta al pie de la pagina. */
export const bannerCTA = (b) => html`
  <section class="relative overflow-hidden bg-owa-navy">
    <!-- La foto se apaga de izquierda a derecha: el texto vive sobre el margen
         izquierdo de la grilla, asi que ese tramo va casi opaco y el derecho
         se libera para que se entienda que hay una foto detras.
         Oculta en mobile: a ese ancho el texto ocupa toda la franja y la foto
         solo aportaria ruido. -->
    <div class="absolute inset-0 hidden sm:block" aria-hidden="true">
      ${foto({
        slug: b.img,
        alt: '',
        sizes: '100vw',
        className: 'block h-full w-full',
        imgClass: 'h-full w-full object-cover',
      })}
      <div
        class="absolute inset-0 [background-image:linear-gradient(90deg,rgb(33_30_95/0.97)_0%,rgb(33_30_95/0.92)_40%,rgb(33_30_95/0.62)_72%,rgb(33_30_95/0.42)_100%)]"
      ></div>
    </div>

    <div
      class="u-shell relative flex flex-wrap items-center justify-between gap-x-10 gap-y-6 py-11 sm:py-12"
    >
      <div class="flex items-center gap-5 sm:gap-6">
        <!-- El logo es decorativo: la pagina ya es Circuito y el boton lo
             vuelve a decir, asi que no suma nada al arbol de accesibilidad. -->
        ${b.logo
          ? html`<img src="${b.logo}" alt="" aria-hidden="true" class="h-16 w-auto shrink-0 sm:h-20" />
              <span class="hidden h-16 w-px shrink-0 bg-white/25 sm:block" aria-hidden="true"></span>`
          : ''}
        <div>
          <p class="u-eyebrow text-owa-cyan">${b.kicker}</p>
          <p
            class="mt-3.5 font-display text-[clamp(1.375rem,2.8vw,2rem)] leading-[1.08] font-black text-white uppercase"
          >
            ${raw(b.titulo)}
          </p>
        </div>
      </div>
      ${btnAccent(b.cta, b.href, 'shrink-0')}
    </div>
  </section>
`;
