import { html, raw, join } from '../lib/html.js';
import { ESTADOS } from '../data/eventos.js';

/* ------------------------------------------------------------------ texto */

// El cian de marca sólo llega a 2.6:1 sobre blanco, así que en superficies
// claras la volanta usa blue-2 (13:1) y el cian queda para fondos oscuros,
// botones y trazos. Misma paleta del DS, contraste que sí se lee.
export const eyebrow = (texto, tono = 'blue') =>
  html`<p class="u-eyebrow ${tono === 'sky' ? 'text-owa-sky' : tono === 'cyan' ? 'text-owa-cyan' : 'text-owa-blue'}">
    ${texto}
  </p>`;

/** Encabezado de sección: volanta + título, con el aire correcto arriba.
    Sin max-width: los cortes de línea de los titulares los decide el <br> del
    diseño, no una medida en ch (que además se calcula con la fuente del padre). */
export const tituloSeccion = (volanta, titulo, tono = 'blue') => html`
  <div>
    ${eyebrow(volanta, tono)}
    <h2 class="u-h2 mt-3.5">${raw(titulo)}</h2>
  </div>
`;

/* ------------------------------------------------------------------ chips */

export function chipModalidad(label, { oscuro = false } = {}) {
  const esGP = label.startsWith('GRAND PRIX');
  const esEspecial = label.startsWith('EVENTO ESPECIAL');
  const tono = esGP
    ? 'bg-owa-cyan text-owa-deep'
    : esEspecial
      ? oscuro
        ? 'border border-white/35 text-owa-line'
        : 'bg-owa-sand text-owa-slate'
      : oscuro
        ? 'bg-white text-owa-blue'
        : 'bg-owa-mist text-owa-blue';
  return html`<span
    class="inline-block whitespace-nowrap rounded-full px-2.5 py-1 font-display text-[10px] font-black tracking-[0.12em] ${tono}"
    >${label}</span
  >`;
}

export function chipEstado(estado, { oscuro = false } = {}) {
  const label = ESTADOS[estado] || ESTADOS.proximamente;
  const tono =
    estado === 'abierta'
      ? 'bg-owa-cyan text-owa-deep'
      : oscuro
        ? 'border border-white/40 text-white'
        : 'border border-owa-line text-owa-slate';
  return html`<span class="inline-block rounded-full px-2.5 py-1 font-display text-[10px] font-black tracking-[0.1em] ${tono}"
    >${label}</span
  >`;
}

export const chipVivo = () => html`
  <span class="inline-flex items-center gap-2 rounded-full bg-owa-live px-2.5 py-1 font-display text-[10px] font-black tracking-[0.1em] text-white">
    <span class="live-dot size-1.5 rounded-full bg-white"></span>EN VIVO
  </span>
`;

export const modalidadesDe = (e, opts) => {
  if (e.tipo === 'core') return join([chipModalidad('GRAND PRIX', opts), chipModalidad('CIRCUITO OWA', opts)], ' ');
  if (e.tipo === 'challenge') return chipModalidad(`CHALLENGE · ${e.km}`, opts);
  return chipModalidad('EVENTO ESPECIAL', opts);
};

/* -------------------------------------------------------------- posiciones */

// El oro sobre blanco da 1.5:1: como número de posición es ilegible. En vez de
// apagar el color, el podio pasa a chapita rellena con la cifra en navy —
// se lee a 9:1 y el metal queda más claro que antes.
const MEDALLA = { 1: 'bg-owa-gold', 2: 'bg-owa-gray', 3: 'bg-owa-bronze' };

export const posicion = (p, { oscuro = false } = {}) =>
  MEDALLA[p]
    ? html`<span
        data-nums
        class="grid size-8 place-items-center rounded-full font-display text-sm font-black text-owa-navy ${MEDALLA[p]}"
        >${p}</span
      >`
    : html`<span data-nums class="grid size-8 place-items-center font-display text-base font-black ${oscuro ? 'text-owa-line' : 'text-owa-slate'}"
        >${p}</span
      >`;

/* ---------------------------------------------------------------- botones */

const FLECHA = raw('<span class="u-nudge-arrow" aria-hidden="true">→</span>');

const BASE_LAYOUT = 'btn u-press u-nudge h-auto min-h-0 gap-2.5 border-0 tracking-[0.06em] uppercase';
const BASE = `${BASE_LAYOUT} text-[13px] font-display font-black`;
// btnBlanco es un punto más grande que el resto (14px) — la propia clase trae
// su tamaño en vez de heredar el de BASE, así no depende del orden en que
// Tailwind emite las utilidades arbitrarias en la hoja de estilos.
const BASE_BLANCO = `${BASE_LAYOUT} text-[14px] font-display font-black`;

export const btnAccent = (label, href, extra = '') =>
  html`<a href="${href}" class="${BASE} bg-owa-cyan px-7 py-4 text-owa-deep hover:bg-owa-sky ${extra}">${label} ${FLECHA}</a>`;

export const btnBlanco = (label, href, extra = '') =>
  html`<a href="${href}" class="${BASE_BLANCO} bg-white px-7 py-4 text-owa-navy hover:bg-owa-mist ${extra}">${label} ${FLECHA}</a>`;

export const btnPrimario = (label, href, extra = '') =>
  html`<a href="${href}" class="${BASE} bg-owa-blue px-6 py-3.5 text-white hover:bg-owa-navy ${extra}">${label} ${FLECHA}</a>`;

export const btnBorde = (label, href, extra = '') =>
  html`<a
    href="${href}"
    class="${BASE} border-2 border-owa-navy bg-transparent px-6 py-3.5 text-owa-navy hover:bg-owa-navy hover:text-white ${extra}"
    >${label} ${FLECHA}</a
  >`;

export const btnBordeClaro = (label, href, extra = '') =>
  html`<a
    href="${href}"
    class="${BASE} border-2 border-white/60 bg-transparent px-6 py-3.5 text-white hover:border-white hover:bg-white hover:text-owa-navy ${extra}"
    >${label} ${FLECHA}</a
  >`;

/** Link de texto con subrayado grueso, para "ver todo". */
export const linkFuerte = (label, href, extra = '') =>
  html`<a
    href="${href}"
    class="u-nudge inline-flex items-center gap-2 border-b-2 border-owa-blue pb-1 font-display text-[13px] font-black tracking-[0.08em] text-owa-blue uppercase transition-colors hover:border-owa-electric hover:text-owa-electric ${extra}"
    >${label} ${FLECHA}</a
  >`;

/* -------------------------------------------------------------- pastillas */

export const pastilla = (label, activo, attrs = '') => html`
  <button
    type="button"
    ${raw(attrs)}
    aria-pressed="${activo ? 'true' : 'false'}"
    class="u-press cursor-pointer rounded-full px-4.5 py-2.5 font-display text-xs font-black tracking-[0.08em] transition-colors duration-200 ${activo
      ? 'bg-owa-navy text-white'
      : 'border border-owa-line bg-white text-owa-slate hover:border-owa-navy hover:text-owa-navy'}"
  >
    ${label}
  </button>
`;

export const pastillaChica = (label, activo, attrs = '', { oscuro = false } = {}) => html`
  <button
    type="button"
    ${raw(attrs)}
    aria-pressed="${activo ? 'true' : 'false'}"
    class="u-press cursor-pointer rounded-full px-3.5 py-1.5 font-display text-[11px] font-black tracking-[0.08em] transition-colors duration-200 ${activo
      ? oscuro
        ? 'bg-owa-cyan text-owa-deep'
        : 'bg-owa-navy text-white'
      : oscuro
        ? 'bg-white/8 text-owa-line hover:bg-white/16 hover:text-white'
        : 'text-owa-slate hover:text-owa-navy'}"
  >
    ${label}
  </button>
`;

/* ------------------------------------------------------------------- olas */

/* Las olas usan preserveAspectRatio="none": el viewBox de 1200 unidades se
   comprime al ancho real mientras el alto queda fijo en píxeles. En un celular
   de 390px eso achica el pico 3× a lo ancho sin bajarle el alto, y el pico
   termina puntiagudo. Por eso cada ola lleva un trazado propio para pantallas
   angostas, mucho más extendido, que al comprimirse da la misma pendiente
   suave que en desktop. */

/** El pico de ola del branding, recortando el borde superior de una sección.

    Va compuesto en dos piezas en vez de un SVG estirado a todo el ancho: una
    barra de base full-bleed y el pico con ancho propio, anclado adentro de
    u-shell. Así el pico arranca exactamente donde arranca el texto en vez de
    caer en un punto arbitrario del viewport, y al no estirarse mantiene la
    misma pendiente en cualquier pantalla. */
export const olaSuperior = (fill = '#fff') => html`
  <div class="pointer-events-none absolute inset-x-0 -bottom-px" aria-hidden="true">
    <div class="u-shell relative">
      <svg
        viewBox="0 0 208 24"
        preserveAspectRatio="none"
        class="absolute bottom-0 left-5 h-6 w-[clamp(11rem,22vw,15.625rem)] md:left-8"
      >
        <path
          d="M0,24 C40,24 62,19 86,7 C96,2 101,0 104,0 C107,0 112,2 122,7 C146,19 168,24 208,24 Z"
          fill="${fill}"
        />
      </svg>
    </div>
    <div class="h-2" style="background:${fill}"></div>
  </div>
`;

export const olaCentrada = (fill = '#fff') => html`
  <svg viewBox="0 0 1200 52" preserveAspectRatio="none" aria-hidden="true" class="block h-13 w-full">
    <path
      class="sm:hidden"
      d="M0,52 L0,40 L140,40 C320,40 430,31 545,15 C578,10 590,8 600,8 C610,8 622,10 655,15 C770,31 880,40 1060,40 L1200,40 L1200,52 Z"
      fill="${fill}"
    />
    <path
      class="hidden sm:block"
      d="M0,52 L0,40 L470,40 C520,40 548,33 578,15 C590,7 596,3 600,3 C604,3 610,7 622,15 C652,33 680,40 730,40 L1200,40 L1200,52 Z"
      fill="${fill}"
    />
  </svg>
`;

/** Aviso de dato pendiente de confirmación por OWA. */
export const pendiente = (texto) => html`<p class="mt-4 text-xs text-owa-slate/80">${texto}</p>`;
