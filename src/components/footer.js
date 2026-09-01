import { html, raw } from '../lib/html.js';

const COLUMNAS = [
  {
    t: 'CARRERAS',
    items: [
      ['Calendario 26/27', '/calendario'],
      ['Grand Prix', '/grand-prix'],
      ['Circuito OWA', '/circuito'],
      ['Eventos Especiales', '/especiales'],
    ],
  },
  {
    // Challenge sale de CARRERAS: no se inscribe como una fecha más, se postula.
    // OWA Travel lo acompaña porque tampoco es competencia del calendario.
    t: 'TRAVESÍAS',
    items: [
      ['OWA Challenge', '/challenge'],
      ['OWA Travel', '/travel'],
    ],
  },
  {
    t: 'INFO',
    items: [
      ['Cómo empezar', '/primeros-pasos'],
      ['Resultados & Rankings', '/resultados'],
      ['PDA', '/pda'],
      ['Reglamentos', '/reglamentos'],
    ],
  },
];

/* Trazo único (stroke-width 1.75, sin relleno) para que Instagram y Facebook
   respeten el mismo peso que el resto de los íconos del sitio; YouTube lleva
   el triángulo de play sólido porque así se lee la marca, no como excepción
   de estilo. */
const ICONOS = {
  instagram: raw(
    '<rect x="2.5" y="2.5" width="19" height="19" rx="5"></rect><circle cx="12" cy="12" r="4.2"></circle><circle cx="17.15" cy="6.85" r="0.65" fill="currentColor" stroke="none"></circle>'
  ),
  facebook: raw(
    '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>'
  ),
  youtube: raw(
    '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none"></polygon>'
  ),
};

const REDES = [
  ['Instagram', 'https://www.instagram.com/owargentina/', 'instagram'],
  ['Facebook', 'https://www.facebook.com/OpenWaterArgentina/', 'facebook'],
  ['YouTube', 'https://www.youtube.com/@openwaterargentina7389', 'youtube'],
];

export const footer = () => html`
  <footer class="bg-owa-abyss px-0 pt-18 pb-8 text-white">
    <div class="u-shell">
      <div class="grid gap-10 border-b border-white/12 pb-11 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1.2fr]">
        <div>
          <img
            src="/brand/owa-claim-white.svg"
            alt="Open Water Argentina — el agua nos une"
            width="190"
            height="66"
            class="h-auto w-[190px] max-w-full"
          />
        </div>

        ${COLUMNAS.map(
          (c) => html`
            <nav aria-label="${c.t}">
              <h2 class="mb-4 font-body text-[10px] font-normal tracking-[0.16em] text-owa-gray normal-case">${c.t}</h2>
              <ul class="grid gap-2.5">
                ${c.items.map(
                  ([label, href]) => html`
                    <li>
                      <a href="${href}" class="text-sm text-owa-line transition-colors hover:text-owa-cyan">${label}</a>
                    </li>
                  `
                )}
              </ul>
            </nav>
          `
        )}

        <div>
          <h2 class="mb-4 font-body text-[10px] font-normal tracking-[0.16em] text-owa-gray normal-case">CONTACTO</h2>
          <ul class="grid gap-2.5 text-sm text-owa-line">
            <li><a href="mailto:info@owa.com.ar" class="transition-colors hover:text-owa-cyan">info@owa.com.ar</a></li>
            <li>
              <a href="https://wa.me/5491125543112" target="_blank" rel="noopener noreferrer" class="transition-colors hover:text-owa-cyan"
                >WhatsApp +54 9 11 2554 3112</a
              >
            </li>
          </ul>
          <ul class="mt-5 flex flex-wrap gap-2.5">
            ${REDES.map(
              ([label, href, icono]) => html`
                <li>
                  <a
                    href="${href}"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="${label} de Open Water Argentina"
                    class="u-press grid size-10 place-items-center rounded-full border border-white/25 text-owa-line transition-colors hover:border-owa-cyan hover:text-owa-cyan"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.75"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="size-4.5"
                      aria-hidden="true"
                    >
                      ${ICONOS[icono]}
                    </svg>
                  </a>
                </li>
              `
            )}
          </ul>
        </div>
      </div>

      <div class="flex flex-wrap justify-between gap-3.5 pt-5.5 text-xs text-owa-gray">
        <p>© 2026 Open Water Argentina · Las inscripciones se procesan en plataforma externa</p>
        <p>Cronometraje oficial: Cronometraje Instantáneo</p>
      </div>
    </div>
  </footer>
`;
