import { html } from '../lib/html.js';

/** Botón flotante que aparece al bajar y devuelve al principio de la página
    en la que se está (no siempre a "/"): quien scrolleó adentro de Grand Prix
    quiere volver arriba de Grand Prix, no que lo saquen de ahí. */
export const volverArriba = () => html`
  <button
    type="button"
    data-volver-arriba
    aria-label="Volver arriba"
    class="volver-arriba u-press fixed right-5 bottom-5 z-40 grid size-12 place-items-center rounded-full bg-owa-navy text-white shadow-[var(--shadow-elevated)] transition-colors duration-200 ease-out hover:bg-owa-cyan hover:text-owa-deep sm:right-7 sm:bottom-7"
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-5" aria-hidden="true">
      <path d="M12 19V5" />
      <path d="M5 12l7-7 7 7" />
    </svg>
  </button>
`;

export function montarVolverArriba(root) {
  const boton = root.querySelector('[data-volver-arriba]');
  if (!boton) return;

  let visible = false;
  const actualizar = () => {
    const mostrar = window.scrollY > window.innerHeight * 0.6;
    if (mostrar === visible) return;
    visible = mostrar;
    boton.toggleAttribute('data-visible', visible);
  };

  window.addEventListener('scroll', actualizar, { passive: true });
  window.addEventListener('resize', actualizar, { passive: true });
  actualizar();

  boton.addEventListener('click', () => {
    const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reducido ? 'auto' : 'smooth' });
  });
}
