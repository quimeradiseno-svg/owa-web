import { html, toHTML } from '../lib/html.js';
import { btnBlanco, btnBordeClaro } from '../components/ui.js';

export const titulo = 'Página no encontrada';
export const descripcion =
  'La página que buscabas no existe. Volvé al calendario para ver todas las fechas de la temporada.';

export const render = () =>
  toHTML(html`
    <section class="flex min-h-[70svh] items-center bg-owa-navy px-0 py-24 text-white">
      <div class="u-shell">
        <p class="font-display text-sm font-bold tracking-[0.2em] text-owa-sky">ERROR 404</p>
        <h1 class="mt-4 text-[clamp(2.5rem,6.4vw,5.5rem)] leading-[0.9]">Esta página<br />no está en el agua</h1>
        <p class="mt-5 max-w-[48ch] text-[17px] leading-relaxed text-owa-line">
          El enlace que seguiste no existe o cambió de lugar. Desde el calendario llegás a todas las carreras de la
          temporada.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          ${btnBlanco('Ver calendario 26/27', '/calendario')} ${btnBordeClaro('Volver al inicio', '/')}
        </div>
      </div>
    </section>
  `);
