import { html, raw } from '../lib/html.js';
import { foto } from '../lib/img.js';
import { btnAccent } from './ui.js';

/* Franja de cierre con acceso directo a la inscripcion. La foto entra desde la
   derecha con una mascara: sin ella el borde corta el navy con una linea
   vertical dura. Mismo recurso que el hero de las paginas madre. */
export const bannerCTA = (b) => html`
  <section class="u-shell pb-24">
    <div class="relative overflow-hidden rounded-owa-lg bg-owa-navy">
      <div
        class="absolute inset-y-0 right-0 hidden w-[64%] sm:block"
        aria-hidden="true"
        style="mask-image:linear-gradient(90deg,transparent 0%,#000 62%);-webkit-mask-image:linear-gradient(90deg,transparent 0%,#000 62%)"
      >
        ${foto({
          slug: b.img,
          alt: '',
          sizes: '(min-width: 1280px) 780px, 64vw',
          className: 'block h-full w-full',
          imgClass: 'h-full w-full object-cover opacity-55',
        })}
      </div>

      <div class="relative flex flex-wrap items-center justify-between gap-x-10 gap-y-6 px-8 py-9 sm:px-10 sm:py-10">
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
    </div>
  </section>
`;
