import { html, toHTML } from '../lib/html.js';

const LINKS = [
  ['HOME', '/'],
  ['GRAND PRIX', '/grand-prix'],
  ['CIRCUITO', '/circuito'],
  ['ESPECIALES', '/especiales'],
  ['CHALLENGE', '/challenge'],
  ['RESULTADOS', '/resultados'],
  ['TRAVEL', '/travel'],
  ['PDA', '/pda'],
];

const item = (label, href, extra = '') => html`
  <a
    href="${href}"
    data-nav="${href}"
    class="whitespace-nowrap font-body text-[13px] font-bold tracking-[0.09em] text-white/90 transition-colors duration-200 hover:text-owa-cyan aria-[current=page]:text-owa-cyan ${extra}"
    >${label}</a
  >
`;

export function navbar() {
  return html`
    <header class="sticky top-0 z-50 border-b border-white/10 bg-owa-navy/94 backdrop-blur-xl">
      <div class="u-shell flex items-center justify-between gap-4 py-3">
        <a href="/" class="u-press shrink-0" aria-label="Open Water Argentina — inicio">
          <img src="/brand/owa-logo-cyan-white.svg" alt="OWA" width="124" height="30" class="h-[30px] w-auto" />
        </a>

        <nav class="relative hidden flex-1 items-center justify-end gap-5 lg:flex" aria-label="Principal">
          ${LINKS.map(([l, h]) => item(l, h, 'py-1'))}
          <span class="nav-indicator" data-hidden aria-hidden="true"></span>
        </nav>

        <a
          href="/calendario"
          class="u-press u-nudge hidden shrink-0 items-center gap-2 rounded-full bg-owa-cyan px-5 py-3 font-display text-xs font-black tracking-[0.06em] text-owa-deep transition-colors hover:bg-owa-sky sm:inline-flex"
        >
          INSCRIBITE <span class="u-nudge-arrow" aria-hidden="true">→</span>
        </a>

        <button
          type="button"
          data-menu-toggle
          aria-expanded="false"
          aria-controls="menu-movil"
          class="u-press -mr-2 grid size-11 shrink-0 place-items-center rounded-full text-white lg:hidden"
        >
          <span class="sr-only">Abrir menú</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="size-6">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      <div
        id="menu-movil"
        data-menu
        hidden
        class="origin-top border-t border-white/10 bg-owa-navy/98 backdrop-blur-xl lg:hidden"
      >
        <nav class="u-shell grid gap-1 py-4" aria-label="Principal (móvil)">
          ${LINKS.map(
            ([l, h]) => html`
              <a
                href="${h}"
                data-nav="${h}"
                class="rounded-2xl px-4 py-3 font-body text-[15px] font-bold tracking-[0.09em] text-white/90 transition-colors hover:bg-white/8 aria-[current=page]:bg-white/10 aria-[current=page]:text-owa-cyan"
                >${l}</a
              >
            `
          )}
          <a
            href="/calendario"
            data-nav="/calendario"
            class="mt-2 flex items-center justify-between rounded-full bg-owa-cyan px-5 py-3.5 font-display text-sm font-black tracking-[0.06em] text-owa-deep"
            >INSCRIBITE <span aria-hidden="true">→</span></a
          >
        </nav>
      </div>
    </header>
  `;
}

export function montarNavbar(header) {
  const toggle = header.querySelector('[data-menu-toggle]');
  const panel = header.querySelector('[data-menu]');
  const nav = header.querySelector('nav[aria-label="Principal"]');
  const indicador = header.querySelector('.nav-indicator');

  let abierto = false;
  const cerrar = () => {
    if (!abierto) return;
    abierto = false;
    toggle.setAttribute('aria-expanded', 'false');
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(-8px)';
    panel.addEventListener('transitionend', () => abierto || (panel.hidden = true), { once: true });
  };

  panel.style.transition = 'opacity 200ms var(--ease-out), transform 200ms var(--ease-out)';

  toggle.addEventListener('click', () => {
    if (abierto) return cerrar();
    abierto = true;
    panel.hidden = false;
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(-8px)';
    requestAnimationFrame(() => {
      panel.style.opacity = '1';
      panel.style.transform = 'translateY(0)';
    });
    toggle.setAttribute('aria-expanded', 'true');
  });

  panel.addEventListener('click', (e) => e.target.closest('a') && cerrar());
  document.addEventListener('keydown', (e) => e.key === 'Escape' && cerrar());

  // Indicador deslizante: un único elemento, así el color y la posición
  // cambian juntos en vez de transicionar cada link por separado.
  let primeraVez = true;
  const colocar = (path) => {
    header.querySelectorAll('[data-nav]').forEach((a) => {
      const activo = a.dataset.nav === path;
      activo ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
    });
    // Buscar por atributo con CSS.escape es frágil (escapa identificadores, no
    // valores entrecomillados): con rutas como "/pad" quedaba sin match y el
    // indicador se dibujaba al ancho cero, al lado del logo.
    const activo = [...nav.querySelectorAll('[data-nav]')].find((a) => a.dataset.nav === path);
    if (!activo) return indicador.setAttribute('data-hidden', '');
    indicador.removeAttribute('data-hidden');
    const r = activo.getBoundingClientRect();
    const base = nav.getBoundingClientRect();

    // La primera colocación no es un cambio de ruta: aparece donde va, sin
    // deslizarse desde el ancho cero que tiene junto al logo.
    if (primeraVez) {
      primeraVez = false;
      indicador.style.transition = 'none';
      indicador.style.setProperty('--nav-x', `${r.left - base.left}px`);
      indicador.style.setProperty('--nav-w', r.width);
      indicador.offsetWidth; // fuerza el reflow antes de devolver la transición
      indicador.style.transition = '';
      return;
    }

    indicador.style.setProperty('--nav-x', `${r.left - base.left}px`);
    indicador.style.setProperty('--nav-w', r.width);
  };

  // La barra de datos de cada carrera se pega debajo del header; en vez de
  // hardcodear su alto, lo publicamos como variable.
  let altoPrevio = -1;
  const medir = () => {
    const h = header.offsetHeight;
    // Escribir la variable siempre reinvalida estilos y vuelve a disparar el
    // observer: sólo escribimos cuando el alto realmente cambió.
    if (h === altoPrevio) return;
    altoPrevio = h;
    document.documentElement.style.setProperty('--nav-h', `${h}px`);
  };
  medir();
  new ResizeObserver(medir).observe(header);

  window.addEventListener('resize', () => colocar(location.pathname), { passive: true });
  // Vito Wide llega después del primer pintado: sin esto el indicador queda
  // con el ancho que medía la fuente de fallback.
  document.fonts?.ready.then(() => colocar(location.pathname));
  return colocar;
}
