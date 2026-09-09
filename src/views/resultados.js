import { html, raw, toHTML, stagger } from '../lib/html.js';
import { foto } from '../lib/img.js';
import { TEMPORADA, FECHAS, CATEGORIAS, RANKING, EQUIPOS } from '../data/ranking-2526.js';
import { MADRES } from '../data/madres.js';
import { TEMPORADAS, TEMPORADA_ACTUAL, destacada, restante, fechaCorta } from '../data/resultados-historicos.js';
import { posicion, numero, eyebrow } from '../components/ui.js';
import { icono } from '../components/iconos.js';

export const titulo = 'Resultados & Rankings';
export const descripcion =
  `Ranking final de la temporada ${TEMPORADA} del Grand Prix y el Circuito OWA: posiciones por nadador, por categoría y campeonato por equipos.`;

// El campeonato por equipos es una tabla sola —OWA suma Grand Prix y Circuito
// juntos— así que va como pestaña propia y no como una vista dentro de cada
// torneo: colgarlo de un torneo daría a entender que hay uno por competencia.
const TABS = [
  ['RESULTADOS POR TEMPORADA', 'temporadas'],
  ['RANKING GRAND PRIX', 'grand-prix'],
  ['RANKING CIRCUITO OWA', 'circuito'],
  ['CAMPEONATO POR EQUIPOS', 'equipos'],
];

// Sólo separa por género: la categoría ya la elige el selector "Categoría" de
// la toolbar, que filtra sobre cualquiera de las dos. Antes había cuatro
// vistas (general/categorías × masculino/femenino) y las dos de categorías
// duplicaban exactamente lo que ese selector ya resuelve.
const VISTAS = [
  ['GENERAL MASCULINO', 'gen-m', 'MASCULINO'],
  ['GENERAL FEMENINO', 'gen-f', 'FEMENINO'],
];

// Filas por página. El Circuito masculino tiene más de 500 nadadores: en una
// sola tirada la página no se termina más de scrollear, y el HTML
// prerenderizado se vuelve enorme.
const PAGINA = 50;

const s = {
  tab: 'grand-prix',
  vista: 'gen-m',
  cat: 'TODAS',
  club: 'TODOS',
  q: '',
  sel: null,
  pagina: 1,
  temporada: TEMPORADAS[0]?.id,
};

const sexoDe = (v) => (v === 'gen-f' ? 'F' : 'M');

// Título de la tabla según la vista, para encabezar la tarjeta del ranking.
const TITULOS = {
  'gen-m': 'Ranking general masculino',
  'gen-f': 'Ranking general femenino',
};

/* --------------------------------------------------------------- controles */

// `appearance-none` saca la flecha nativa del <select>, así que hay que
// reponerla. Va como SVG hermano y no como background-image con data URI: esa
// URI lleva comillas dobles y adentro de un atributo style="" el HTML corta
// ahí, así que el chevron no llegaba a pintarse nunca.
// pointer-events-none para que el clic sobre la flecha abra el desplegable.
const chevron = () => html`
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-owa-slate"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
`;

const selector = (id, label, valor, opciones) => html`
  <label class="relative block">
    <span class="sr-only">${label}</span>
    <select
      data-sel="${id}"
      class="w-full cursor-pointer appearance-none rounded-lg border border-owa-line bg-white py-3 pr-11 pl-5 font-body text-sm text-owa-navy transition-colors duration-200 hover:border-owa-navy focus-visible:border-owa-navy focus-visible:outline-none"
    >
      ${opciones.map(
        ([valorOpcion, textoOpcion]) =>
          html`<option value="${valorOpcion}" ${raw(valorOpcion === valor ? 'selected' : '')}>${textoOpcion}</option>`
      )}
    </select>
    ${chevron()}
  </label>
`;

const buscador = (placeholder) => html`
  <label
    class="flex min-w-0 flex-1 items-center gap-3 rounded-lg border border-owa-line bg-white px-5 py-3 transition-colors duration-200 focus-within:border-owa-navy"
  >
    <span class="sr-only">${placeholder}</span>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4.5 shrink-0 text-owa-slate">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" stroke-linecap="round" />
    </svg>
    <input
      data-q
      type="search"
      value="${s.q}"
      placeholder="${placeholder}"
      class="min-w-0 flex-1 bg-transparent text-[15px] text-owa-navy outline-none placeholder:text-owa-slate/70"
    />
  </label>
`;

const vacio = (texto) => html`
  <p class="rounded-owa-md border border-dashed border-owa-line px-6 py-14 text-center text-owa-slate">${texto}</p>
`;

/** Encabezado de la tarjeta de ranking: título, metadata discreta y la toolbar
    a la derecha, en la misma línea. Va en Lato y no en Vito: la tabla entera
    usa la fuente de interfaz y el título tiene que pertenecer a ese bloque. */
const encabezadoTabla = (titulo, detalle, herramientas = '') => html`
  <div class="flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
    <div>
      <h2 class="text-[clamp(1.25rem,2.4vw,1.5rem)] leading-none text-owa-navy">${titulo}</h2>
      <p class="mt-2 text-[13px] text-owa-slate">${detalle}</p>
    </div>
    ${herramientas}
  </div>
`;

/* -------------------------------------------------------------- paginador */

/** El tramo de páginas que se muestra: siempre la primera, la última y las
    vecinas de la actual. Los saltos van como `null` y se pintan como "…".
    Con 11 páginas (Circuito masculino) listarlas todas no entra en un móvil. */
function numerosDePagina(actual, total) {
  const cerca = new Set([1, total, actual - 1, actual, actual + 1]);
  // En los extremos se completa hacia adentro para que el ancho no salte al
  // pasar de página.
  if (actual <= 3) [2, 3, 4].forEach((n) => cerca.add(n));
  if (actual >= total - 2) [total - 3, total - 2, total - 1].forEach((n) => cerca.add(n));

  const salida = [];
  let previo = 0;
  for (const n of [...cerca].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b)) {
    if (n - previo > 1) salida.push(null);
    salida.push(n);
    previo = n;
  }
  return salida;
}

const botonPagina = (n, actual) => html`
  <button
    type="button"
    data-pagina="${n}"
    data-nums
    aria-label="Página ${n}"
    aria-current="${n === actual ? 'page' : 'false'}"
    class="u-press size-9 shrink-0 cursor-pointer rounded-full font-display text-[13px] font-black transition-colors duration-200 ${n === actual
      ? 'bg-owa-navy text-white'
      : 'text-owa-slate hover:bg-owa-mist/60 hover:text-owa-navy'}"
  >
    ${n}
  </button>
`;

// La flecha inactiva se hunde (fondo arena) en vez de aclararse: en gris claro
// sobre blanco medía 1.26:1 y directamente no se veía. Así se lee que no está
// disponible y sigue cumpliendo AA.
const flecha = (n, habilitada, etiqueta, glifo) => html`
  <button
    type="button"
    ${raw(habilitada ? `data-pagina="${n}"` : 'disabled')}
    aria-label="${etiqueta}"
    class="u-press size-9 shrink-0 rounded-full border font-display text-[13px] font-black transition-colors duration-200 ${habilitada
      ? 'cursor-pointer border-owa-line text-owa-navy hover:bg-owa-navy hover:text-white'
      : 'cursor-not-allowed border-transparent bg-owa-sand text-owa-slate'}"
  >
    ${glifo}
  </button>
`;

/** Pie de tabla: el paginador y el recuento de lo que se está viendo. */
const paginador = (total, singular, plural) => {
  const paginas = Math.ceil(total / PAGINA);
  const nombre = total === 1 ? singular : plural;
  if (paginas <= 1)
    return html`<p class="mt-5 text-center text-[13px] text-owa-slate">${numero(total)} ${nombre}</p>`;

  const desde = (s.pagina - 1) * PAGINA + 1;
  const hasta = Math.min(s.pagina * PAGINA, total);
  return html`
    <nav class="mt-7 flex flex-col items-center gap-3" aria-label="Paginación de resultados">
      <div class="flex max-w-full items-center gap-1 overflow-x-auto">
        ${flecha(s.pagina - 1, s.pagina > 1, 'Página anterior', '‹')}
        ${numerosDePagina(s.pagina, paginas).map((n) =>
          n === null
            ? html`<span class="grid size-9 shrink-0 place-items-center text-owa-slate" aria-hidden="true">…</span>`
            : botonPagina(n, s.pagina)
        )}
        ${flecha(s.pagina + 1, s.pagina < paginas, 'Página siguiente', '›')}
      </div>
      <p class="text-[13px] text-owa-slate">${numero(desde)}–${numero(hasta)} de ${numero(total)} ${nombre}</p>
    </nav>
  `;
};

/** Cabecera de tabla. Cada columna es [texto, extra] y `extra` lleva las
    utilidades propias de esa columna (alineación, en qué breakpoint aparece). */
const cabecera = (columnas) => html`
  <tr class="bg-owa-mist/45 text-[10px] tracking-[0.14em] text-owa-slate">
    ${columnas.map(
      ([texto, extra = '']) => html`<th scope="col" class="px-3 py-3.5 sm:px-5.5 font-normal ${extra}">${texto}</th>`
    )}
  </tr>
`;

/** Barra proporcional al puntaje. No es una barra de progreso: no hay un 100%
    absoluto, se mide contra el puntero de la tabla que se está mirando. */
const barraPuntos = (puntos, tope) => html`
  <span class="block h-2 w-full overflow-hidden rounded-full bg-owa-line" aria-hidden="true">
    <span class="block h-full rounded-full bg-owa-navy" style="width:${Math.max(2, (puntos / tope) * 100).toFixed(1)}%"></span>
  </span>
`;

/* --------------------------------------------- pestaña 1 · por carrera */

// Los resultados carrera por carrera viven en Cronometraje Instantáneo: acá se
// enlazan, no se replican. Arriba, la fecha que se viene (o su resultado, ya
// corrida); abajo, el archivo por temporada.

/* Acento por competencia. La franja es decoración y puede ir en cian; el
   rótulo de texto no, que sobre blanco el cian queda en 2.6:1 — ahí va el
   azul profundo. Mismos colores de familia que los chips del resto del sitio. */
const ACENTO = {
  'GRAND PRIX': { franja: 'bg-owa-cyan', rotulo: 'text-owa-deep', borde: 'hover:border-owa-cyan' },
  CIRCUITO: { franja: 'bg-owa-blue', rotulo: 'text-owa-blue', borde: 'hover:border-owa-blue' },
  ESPECIAL: { franja: 'bg-owa-sky', rotulo: 'text-owa-navy', borde: 'hover:border-owa-sky' },
};

const acentoDe = (torneo = '') =>
  /^CIRCUITO/.test(torneo) ? ACENTO.CIRCUITO : /ESPECIAL/.test(torneo) ? ACENTO.ESPECIAL : ACENTO['GRAND PRIX'];

/** Fila compacta, para las temporadas ya cerradas. Una temporada completa son
    doce carreras o más, y con la tarjeta grande de la temporada en curso el
    archivo se vuelve un scroll interminable. Acá todo entra en un renglón —
    barra de color, sigla, nombre y el botón a la derecha— y la fecha pasa a
    ser el dato de apoyo, no el titular: lo que se viene a buscar es el
    resultado, no cuándo fue. */
const filaCompacta = (c) => {
  const a = acentoDe(c.torneo);
  return html`
    <li
      class="group flex items-stretch overflow-hidden rounded-owa-md border border-owa-line bg-white transition-colors duration-200 ${c.url
        ? a.borde
        : 'opacity-65'}"
    >
      <span class="w-1 shrink-0 ${a.franja}" aria-hidden="true"></span>
      <div class="flex flex-1 flex-wrap items-center gap-x-4 gap-y-1.5 px-4 py-3.5 sm:px-5">
        <p class="w-14 shrink-0 font-display text-[17px] leading-none font-black text-owa-navy">${c.sigla}</p>
        <div class="min-w-0 flex-1">
          <p class="font-display text-[14px] leading-tight font-black text-owa-navy">${c.nombre}</p>
          <p class="mt-1 text-[11px] font-bold tracking-[0.08em] text-owa-slate uppercase">
            ${[c.torneo, c.etapa, c.sede.split('·')[0].trim(), fechaCorta(c.fecha) || c.fecha].filter(Boolean).join(' · ')}
          </p>
        </div>
        ${c.url
          ? html`
              <a
                href="${c.url}"
                target="_blank"
                rel="noopener noreferrer"
                class="u-nudge inline-flex shrink-0 items-center gap-2 font-display text-[12px] font-black tracking-[0.08em] text-owa-blue uppercase hover:underline"
              >
                Ver resultados <span class="u-nudge-arrow" aria-hidden="true">↗</span>
              </a>
            `
          : html`
              <span class="shrink-0 rounded-full bg-owa-sand px-3 py-1.5 text-[10px] font-black tracking-[0.12em] text-owa-slate uppercase">
                Sin publicar
              </span>
            `}
      </div>
    </li>
  `;
};

/** El contador de la fecha que viene. Va aparte porque se recalcula en el
    cliente al montar: el HTML prerenderizado se escribe una vez, en el build,
    y sin esto mostraría los días que faltaban ese día para siempre.
    Devuelve '' si la carrera no tiene fecha exacta confirmada. */
/** Una caja del reloj: horas, minutos o segundos. */
const casilla = (valor, rotulo) => html`
  <div class="text-center">
    <p data-nums class="rounded-owa-md bg-white/10 px-2.5 py-2 font-display text-[19px] leading-none font-black tabular-nums">
      ${String(valor).padStart(2, '0')}
    </p>
    <p class="mt-1.5 text-[9px] font-bold tracking-[0.12em] text-white/55 uppercase">${rotulo}</p>
  </div>
`;

/** La cuenta regresiva. Los días mandan —es el dato que se busca de un
    vistazo— y el reloj va abajo, en cajas, corriendo segundo a segundo.
    Sin hora de largada confirmada se muestran sólo los días: el reloj
    contaría hacia una medianoche en la que no larga nadie. */
const contador = (iso, hora = '') => {
  const r = restante(iso, hora);
  if (!r) return '';
  if (r.pasado)
    return html`<p class="font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-none font-black text-owa-cyan">
      ¡ES HOY!
    </p>`;

  return html`
    <p class="text-[11px] font-bold tracking-[0.16em] text-white/60 uppercase">Faltan</p>
    <p data-nums class="mt-1 font-display text-[clamp(2.75rem,7vw,4rem)] leading-[0.85] font-black text-owa-cyan">
      ${r.dias}
    </p>
    <p class="mt-1 text-[13px] font-black tracking-[0.14em] text-white/85 uppercase">
      ${r.dias === 1 ? 'día' : 'días'}
    </p>
    ${hora
      ? html`<div class="mt-4 flex items-start gap-1.5">
          ${casilla(r.horas, 'horas')}
          <span class="pt-1.5 font-display text-[17px] font-black text-white/40">:</span>
          ${casilla(r.minutos, 'minutos')}
          <span class="pt-1.5 font-display text-[17px] font-black text-white/40">:</span>
          ${casilla(r.segundos, 'segundos')}
        </div>`
      : ''}
  `;
};

/* Los logos de torneo sólo existen en versión para fondo oscuro (los cuatro
   archivos de /brand tienen los trazos en blanco o casi blanco), así que se
   usan únicamente acá, sobre el navy de la tarjeta destacada. En las filas
   del listado, que son blancas, el torneo va como chip de texto. */
const LOGO_TORNEO = { gp: '/brand/owa-grandprix-s.svg', circuito: '/brand/owa-circuito-s.svg' };

const logosDe = (torneo = '') => {
  // El combinado va primero: "GRAND PRIX Y CIRCUITO" también empieza con
  // "GRAND PRIX" y si no se chequea antes se lleva un solo logo.
  if (/^GRAND PRIX Y CIRCUITO/.test(torneo)) return [['Grand Prix', LOGO_TORNEO.gp], ['Circuito OWA', LOGO_TORNEO.circuito]];
  if (/^GRAND PRIX/.test(torneo)) return [['Grand Prix', LOGO_TORNEO.gp]];
  if (/^CIRCUITO/.test(torneo)) return [['Circuito OWA', LOGO_TORNEO.circuito]];
  return [];
};

/** Tarjeta destacada. Dos caras según el momento de la temporada: la fecha
    que viene con su cuenta regresiva, o el último resultado publicado. */
const CTA_DESTACADO =
  'u-press inline-flex items-center gap-2.5 rounded-full bg-owa-cyan px-6 py-3.5 font-display text-[13px] font-black tracking-[0.06em] text-owa-deep uppercase hover:bg-owa-sky';

const tarjetaDestacada = ({ modo, evento: e, carreras = [] }) => {
  const logos = logosDe(e.torneo);
  const proxima = modo === 'proxima';
  // "31 OCT 2026" -> ['31','OCT','2026'], para el bloque de fecha aparte.
  const [dia, mes, anio] = (fechaCorta(e.fecha) || '').split(' ');

  return html`
    <article class="relative overflow-hidden rounded-owa-lg bg-owa-navy text-white shadow-[var(--shadow-card)]">
      <!-- La foto de la sede entra por la derecha y se funde con el navy. En
           pantalla chica no hay lugar para una banda lateral, así que pasa a
           fondo de toda la tarjeta bajo un velo casi opaco: se intuye el
           lugar sin pelearle legibilidad al texto. -->
      ${e.foto
        ? html`<div class="absolute inset-y-0 right-0 w-full lg:w-[42%]" aria-hidden="true">
            ${foto({
              slug: e.foto,
              alt: '',
              sizes: '(min-width: 1024px) 42vw, 100vw',
              className: 'block h-full w-full',
              imgClass: 'h-full w-full object-cover',
            })}
            <div
              class="absolute inset-0 bg-owa-navy/88 lg:bg-linear-to-r lg:from-owa-navy lg:via-owa-navy/55 lg:to-owa-navy/10"
            ></div>
          </div>`
        : ''}

      <div
        class="relative grid gap-x-9 gap-y-7 p-7 sm:p-9 lg:grid-cols-[auto_minmax(0,1fr)_auto_auto] lg:items-center lg:gap-x-10"
      >
        <!-- fecha -->
        <div class="lg:border-e lg:border-white/15 lg:pe-10">
          <p data-nums class="font-display text-[clamp(2.5rem,6vw,3.5rem)] leading-[0.8] font-black">${dia}</p>
          <p class="font-display text-[clamp(1.125rem,2.6vw,1.5rem)] leading-none font-black">${mes}</p>
          <p data-nums class="mt-1.5 font-display text-[15px] leading-none font-black text-white/45">${anio}</p>
        </div>

        <!-- identidad -->
        <div class="min-w-0 lg:border-e lg:border-white/15 lg:pe-10">
          <p class="text-[11px] font-bold tracking-[0.16em] text-owa-cyan uppercase">
            ${proxima ? 'Próxima fecha' : 'Resultados de la fecha'}
          </p>
          <h2 class="mt-2 font-display text-[clamp(1.5rem,3.4vw,2.375rem)] leading-[0.95] font-black uppercase">
            ${e.nombre}
          </h2>

          <!-- Predio y ciudad en la misma línea: uno completa al otro y
               separarlos en dos renglones sólo alargaba la tarjeta sin
               agregar nada que no se leyera junto. El predio manda en blanco
               y bold, la ciudad queda atrás en el mismo tono discreto que
               tenía antes. -->
          <p class="mt-3.5 flex items-start gap-2 text-[15px] leading-snug">
            <span class="mt-px shrink-0 text-owa-cyan">${icono('pin', 'size-4.5')}</span>
            <span>
              ${e.predio ? html`<span class="font-bold text-white">${e.predio}</span> · ` : ''}
              <span class="text-[13px] text-white/60">${e.sede}</span>
            </span>
          </p>

          ${logos.length
            ? html`<div class="mt-5 flex flex-wrap items-center gap-6">
                ${logos.map(([nombre, src]) => html`<img src="${src}" alt="${nombre}" class="h-9 w-auto" />`)}
              </div>`
            : ''}
        </div>

        <!-- contador: se re-escribe en mount() y late segundo a segundo, así
             que el atributo lleva fecha y hora para poder recalcularlo sin
             repintar la tarjeta entera. -->
        ${proxima && e.fechaISO
          ? html`<div data-contador="${e.fechaISO}" data-hora="${e.hora || ''}">${contador(e.fechaISO, e.hora)}</div>`
          : html`<div></div>`}

        <!-- cta -->
        <div class="lg:text-right">
          ${proxima
            ? html`
                <a href="/carrera/${e.slug}" class="${CTA_DESTACADO}">Ver carrera →</a>
              `
            : html`
                <!-- Una fecha puntuable publica dos tablas, así que puede
                     haber dos botones: cada uno dice de qué competencia es.
                     Con una sola tabla el rótulo sobra y el botón va derecho
                     al grano. -->
                <div class="flex flex-wrap gap-3 lg:justify-end">
                  ${carreras.map(
                    (c) => html`
                      <a href="${c.url}" target="_blank" rel="noopener noreferrer" class="${CTA_DESTACADO}">
                        ${carreras.length > 1 ? `Resultados ${c.sigla}` : 'Ver resultados completos'} ↗
                      </a>
                    `
                  )}
                </div>
              `}
        </div>
      </div>
    </article>
`;
};

/** Nivel 3: resultados por carrera. Arriba, la tarjeta destacada; debajo, un
    selector de temporada —mismo patrón que barraVistas— con el listado
    completo de esa temporada. */
const panelCarrera = () => {
  // El selector manda sobre todo lo que sigue, así que va primero. La
  // temporada en curso está siempre y viene abierta, aunque todavía no tenga
  // resultados: su contenido es la fecha que se viene. Las cerradas entran
  // sólo si tienen algo cargado — una píldora vacía es un callejón sin salida.
  const visibles = TEMPORADAS.filter((t) => t.enCurso || t.carreras.length);
  const temporadaActiva = visibles.find((t) => t.id === s.temporada) ?? visibles[0];
  if (!temporadaActiva)
    return vacio('Estamos preparando esta sección. Los resultados de cada fecha se publican al cierre de la carrera.');

  const dest = temporadaActiva.enCurso ? destacada() : null;

  return html`
    <div>
      <!-- No va como pestaña nueva del nivel 1, que en móvil ya corre con el
           dedo. -->
      <div class="flex snap-x gap-2 overflow-x-auto sm:gap-2.5" role="group" aria-label="Temporada" data-scroller>
        ${visibles.map((t) => pastillaFiltro(t.label, temporadaActiva.id === t.id, `data-temporada="${t.id}"`, { viva: t.enCurso }))}
      </div>

      <!-- La temporada en curso abre con la fecha que se viene en tarjeta
           grande, y debajo lo que ya se corrió. Las cerradas van directo al
           listado: son doce carreras o más por temporada y en tarjetas serían
           un scroll sin fin. -->
      ${dest ? html`<div class="mt-6">${tarjetaDestacada(dest)}</div>` : ''}
      ${temporadaActiva.carreras.length
        ? html`<ul class="mt-6 grid gap-3">${temporadaActiva.carreras.map(filaCompacta)}</ul>`
        : dest
          ? ''
          : html`<div class="mt-6">
              ${vacio(`Todavía no cargamos las carreras de la temporada ${temporadaActiva.label}.`)}
            </div>`}
    </div>
  `;
};

/* ------------------------------------------------ pestañas 2/3 · rankings */

function tablaNadadores() {
  const lista = RANKING[s.tab]?.[sexoDe(s.vista)] ?? [];
  const q = s.q.trim().toLowerCase();

  // Las dos listas de opciones salen de la tabla que se está mirando, no del
  // total: ofrecer un club que no tiene a nadie acá sólo lleva a una tabla
  // vacía. Las categorías se ordenan como vienen de CATEGORIAS (por edad).
  const catsPresentes = CATEGORIAS.filter((c) => lista.some((r) => r.cat === c));
  const clubesPresentes = [...new Set(lista.map((r) => r.club).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));

  const filtradas = lista
    .filter((r) => s.cat === 'TODAS' || r.cat === s.cat)
    .filter((r) => s.club === 'TODOS' || r.club === s.club)
    .filter((r) => !q || r.nombre.toLowerCase().includes(q) || r.club.toLowerCase().includes(q));

  const filas = filtradas.slice((s.pagina - 1) * PAGINA, s.pagina * PAGINA);
  // Con una categoría elegida (por el selector de la toolbar) el puesto que
  // importa es el de esa categoría, no el general: es la tabla de esa
  // categoría, no un recorte de la general. Sin categoría elegida, general.
  const puestoDe = (r) => (s.cat !== 'TODAS' ? r.posCat : r.pos);
  // La barra se mide contra el puntero de lo que se está mirando, así que al
  // filtrar por club o categoría la escala se reajusta a esa tabla.
  const tope = Math.max(1, ...filtradas.map((r) => r.puntos));

  // El recuento en bold: es el dato que cambia al filtrar, la temporada no.
  // La categoría elegida se nombra acá y no en el título de la tarjeta: sin
  // esto, con el puesto ya mostrando la posición dentro de la categoría
  // (arriba), no quedaba dicho en ningún lado CUÁL categoría es esa.
  const detalle = html`<strong class="font-bold text-owa-navy"
      >${numero(filtradas.length)} ${filtradas.length === 1 ? 'nadador' : 'nadadores'}</strong
    >
    ${s.cat !== 'TODAS' ? html`· ${s.cat}` : ''} · Clasificación final ${TEMPORADA}`;

  return html`
    <div class="rounded-owa-lg border border-owa-line bg-white p-5 shadow-[var(--shadow-card)] sm:p-8">
      <!-- Toolbar al lado del título, no debajo: en una fila sola el bloque se
           lee como un solo encabezado. Recién en móvil se apila a ancho
           completo, donde no entran los tres controles juntos. -->
      ${encabezadoTabla(
        TITULOS[s.vista],
        detalle,
        html`
          <div class="grid w-full gap-3 sm:grid-cols-2 lg:flex lg:w-auto lg:items-center">
            <div class="sm:col-span-2 lg:w-56">${buscador('Buscar nadador...')}</div>
            <div class="lg:w-40">
              ${selector('cat', 'Categoría', s.cat, [['TODAS', 'Categoría'], ...catsPresentes.map((c) => [c, c])])}
            </div>
            <div class="lg:w-44">
              ${selector('club', 'Club', s.club, [['TODOS', 'Club'], ...clubesPresentes.map((c) => [c, c])])}
            </div>
          </div>
        `
      )}

      ${filas.length
        ? html`
            <div class="mt-6 overflow-x-auto">
              <table class="w-full border-collapse text-left">
                <caption class="sr-only">
                  ${TITULOS[s.vista]} — ${s.tab === 'circuito' ? 'Circuito OWA' : 'Grand Prix'} ${TEMPORADA}
                </caption>
                <thead>
                  ${cabecera([
                    ['POS'],
                    ['NADADOR'],
                    ['CATEGORÍA', 'hidden md:table-cell'],
                    ['CLUB', 'hidden lg:table-cell'],
                    ['FECHAS', 'hidden md:table-cell text-center'],
                    ['PUNTOS', 'text-right'],
                    ['', 'hidden xl:table-cell w-32'],
                  ])}
                </thead>
                <tbody>
                  ${filas.map(
                    (r) => html`
                      <tr
                        data-nadador="${r.nombre}"
                        tabindex="0"
                        role="button"
                        aria-label="Ver ficha de ${r.nombre}"
                        class="cursor-pointer border-t border-owa-line/70 transition-colors duration-200 ease-out hover:bg-owa-mist/40 focus-visible:bg-owa-mist/40"
                      >
                        <td class="px-3 py-3.5 sm:px-5.5">${posicion(puestoDe(r), { cuerpo: true })}</td>
                        <th scope="row" class="px-3 py-3.5 sm:px-5.5 text-left">
                          <span class="block font-body text-[15px] leading-tight font-bold text-owa-navy">${r.nombre}</span>
                          <!-- En pantalla chica las columnas de categoría y club
                               no entran: bajan acá en vez de desaparecer. -->
                          <span class="mt-1 block text-[12px] font-normal text-owa-slate lg:hidden">
                            <span class="md:hidden">${r.cat}${r.club ? ' · ' : ''}</span>${r.club || ''}
                          </span>
                        </th>
                        <td class="hidden px-3 py-3.5 sm:px-5.5 text-[13px] text-owa-slate md:table-cell">${r.cat}</td>
                        <td class="hidden px-3 py-3.5 sm:px-5.5 text-[13px] text-owa-slate lg:table-cell">${r.club || '—'}</td>
                        <td data-nums class="hidden px-3 py-3.5 sm:px-5.5 text-center text-[13px] text-owa-slate md:table-cell">
                          ${r.fechas.filter((n) => n > 0).length}
                        </td>
                        <td data-nums class="px-3 py-3.5 sm:px-5.5 text-right font-body text-[17px] font-bold whitespace-nowrap text-owa-navy">
                          ${numero(r.puntos)}
                        </td>
                        <td class="hidden py-3.5 pr-3 sm:pr-5.5 xl:table-cell">${barraPuntos(r.puntos, tope)}</td>
                      </tr>
                    `
                  )}
                </tbody>
              </table>
            </div>
            ${paginador(filtradas.length, 'nadador', 'nadadores')}
          `
        : vacio(
            q
              ? `Ningún nadador coincide con "${s.q}".`
              : 'No hay nadadores que cumplan con los filtros elegidos.'
          )}
      ${s.sel ? ficha(s.sel) : ''}
    </div>
  `;
}

/* ------------------------------------------------- pestaña 4 · equipos */

function tablaEquipos() {
  const q = s.q.trim().toLowerCase();
  const filtrados = EQUIPOS.filter((c) => !q || c.nombre.toLowerCase().includes(q));
  const filas = filtrados.slice((s.pagina - 1) * PAGINA, s.pagina * PAGINA);
  const tope = Math.max(1, ...filtrados.map((c) => c.puntos));

  const detalle = html`<strong class="font-bold text-owa-navy"
      >${numero(filtrados.length)} ${filtrados.length === 1 ? 'club' : 'clubes'}</strong
    >
    · Clasificación final ${TEMPORADA}`;

  return html`
    <div class="rounded-owa-lg border border-owa-line bg-white p-5 shadow-[var(--shadow-card)] sm:p-8">
      ${encabezadoTabla(
        'Campeonato por equipos',
        detalle,
        html`<div class="w-full lg:w-56">${buscador('Buscar club...')}</div>`
      )}

      ${filas.length
        ? html`
            <div class="mt-6 overflow-x-auto">
              <table class="w-full border-collapse text-left">
                <caption class="sr-only">Campeonato por equipos ${TEMPORADA}</caption>
                <thead>
                  ${cabecera([
                    ['POS'],
                    ['CLUB'],
                    ['NADADORES', 'hidden md:table-cell text-center'],
                    ['PUNTOS', 'text-right'],
                    ['', 'hidden xl:table-cell w-32'],
                  ])}
                </thead>
                <tbody>
                  ${filas.map(
                    (c) => html`
                      <tr class="border-t border-owa-line/70">
                        <td class="px-3 py-3.5 sm:px-5.5">${posicion(c.pos, { cuerpo: true })}</td>
                        <th scope="row" class="px-3 py-3.5 sm:px-5.5 text-left">
                          <span class="block font-body text-[15px] leading-tight font-bold text-owa-navy">${c.nombre}</span>
                          <span class="mt-1 block text-[12px] font-normal text-owa-slate md:hidden">
                            ${c.nadadores} ${c.nadadores === 1 ? 'nadador' : 'nadadores'}
                          </span>
                        </th>
                        <td data-nums class="hidden px-3 py-3.5 sm:px-5.5 text-center text-[13px] text-owa-slate md:table-cell">
                          ${c.nadadores}
                        </td>
                        <td data-nums class="px-3 py-3.5 sm:px-5.5 text-right font-body text-[17px] font-bold whitespace-nowrap text-owa-navy">
                          ${numero(c.puntos)}
                        </td>
                        <td class="hidden py-3.5 pr-3 sm:pr-5.5 xl:table-cell">${barraPuntos(c.puntos, tope)}</td>
                      </tr>
                    `
                  )}
                </tbody>
              </table>
            </div>
            ${paginador(filtrados.length, 'club', 'clubes')}
          `
        : vacio(`Ningún club coincide con "${s.q}".`)}
    </div>
  `;
}

/* ------------------------------------------------------------------ ficha */

const ficha = (r) => {
  const fechas = FECHAS[s.tab] ?? [];
  const corridas = r.fechas.filter((n) => n > 0);
  // El puntaje que la temporada descartó: el peor de todos, contando como cero
  // las fechas que no corrió. Se marca en la fila para que el total cierre.
  const descartado = Math.min(...r.fechas);
  let yaMarcado = false;

  return html`
    <div class="ficha-in mt-6.5 rounded-owa-lg bg-owa-navy p-8 text-white">
      <div class="flex flex-wrap items-start justify-between gap-4.5">
        <div>
          <p class="text-[11px] tracking-[0.16em] text-owa-sky">FICHA DE NADADOR</p>
          <p class="mt-2.5 font-display text-[clamp(1.5rem,3vw,2.375rem)] leading-none font-black uppercase">${r.nombre}</p>
          <p class="mt-2 text-[13px] text-owa-line">${r.cat}${r.club ? ` · ${r.club}` : ''}</p>
        </div>
        <button
          type="button"
          data-cerrar-ficha
          class="u-press cursor-pointer rounded-full px-3 py-2 text-[13px] tracking-[0.1em] text-owa-line transition-colors hover:text-white"
        >
          CERRAR ✕
        </button>
      </div>

      <dl class="mt-6.5 grid gap-3.5 sm:grid-cols-3">
        ${[
          ['PUNTOS', numero(r.puntos)],
          ['PUESTO GENERAL', r.pos],
          ['PUESTO EN SU CATEGORÍA', r.posCat],
        ].map(
          ([k, v]) => html`
            <div class="rounded-owa-md bg-white/6 p-5">
              <dd data-nums class="font-display text-[2rem] font-black text-owa-cyan">${v}</dd>
              <dt class="mt-2 text-[11px] tracking-[0.12em] text-owa-line/80">${k}</dt>
            </div>
          `
        )}
      </dl>

      <p class="mt-7 text-[11px] tracking-[0.16em] text-owa-sky">PUNTOS POR FECHA</p>
      <ul class="mt-3.5 grid gap-2">
        ${fechas.map((sigla, i) => {
          const puntos = r.fechas[i] ?? 0;
          // El descarte es uno solo: si empatan dos fechas en el mínimo, se
          // marca la primera y nada más.
          const esDescarte = !yaMarcado && puntos === descartado && (yaMarcado = true);
          return html`
            <li class="flex items-center gap-3.5 border-t border-white/12 py-2.5 first:border-0">
              <span class="w-12 shrink-0 font-display text-[13px] font-black tracking-[0.08em] text-owa-line">${sigla}</span>
              <span class="min-w-0 flex-1 text-[13px] ${esDescarte ? 'text-owa-line/60' : 'text-owa-line'}">
                ${puntos ? html`<span data-nums class="font-display font-black text-white">${numero(puntos)}</span> puntos` : 'No participó'}
              </span>
              ${esDescarte
                ? html`<span class="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[10px] tracking-[0.1em] text-owa-line/80">DESCARTADA</span>`
                : ''}
            </li>
          `;
        })}
      </ul>
      <p class="mt-4 text-[13px] text-owa-line/80">
        Corrió ${corridas.length} de ${fechas.length} fechas. Al cierre de la temporada se descarta el peor puntaje.
      </p>
    </div>
  `;
};

/* ------------------------------------------------------- cómo se calcula */

// Las reglas no se escriben acá: son las mismas que publican las páginas de
// cada torneo, así que salen de MADRES y no pueden quedar desincronizadas.
const comoSeCalcula = () => {
  const m = MADRES[s.tab];
  if (!m) return '';
  const ruta = s.tab === 'circuito' ? '/circuito' : '/grand-prix';
  return html`
    <!-- Va después del ranking y en tono más bajo: es apoyo, no compite con la
         tabla. Sin sombra ni tarjeta blanca, para que se lea como un pie. -->
    <section class="mt-10 rounded-owa-lg bg-owa-mist/60 p-6 sm:p-8" aria-labelledby="h-calculo">
      <div class="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <h2 id="h-calculo" class="font-display text-[clamp(1.125rem,2.2vw,1.375rem)] font-black text-owa-navy">
          ¿Cómo se calcula el ranking?
        </h2>
        <a
          href="${ruta}"
          class="u-nudge font-display text-[12px] font-black tracking-[0.06em] text-owa-blue hover:underline"
        >
          VER REGLAS COMPLETAS <span class="u-nudge-arrow" aria-hidden="true">→</span>
        </a>
      </div>
      <div class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        ${m.cajaItems
          .filter((i) => typeof i !== 'string')
          .map(
            (g) => html`
              <article class="rounded-owa-md bg-white p-5">
                <h3 class="font-display text-[13px] leading-tight font-black text-owa-navy">${g.t}</h3>
                <p class="mt-2 text-[13px] leading-relaxed text-owa-slate">${g.d}</p>
              </article>
            `
          )}
      </div>
    </section>
  `;
};

/* ------------------------------------------------------------------ vista */

/** Nivel 2 de navegación. A propósito NO usa las mismas pestañas del nivel 1:
    es un segmented control —una sola pista con la opción activa rellena— para
    que se lea como un filtro de la sección y no como otra sección. */
// Nivel 2: mismo criterio que el nivel 1, una fila que corre con el dedo.
// Siguen siendo píldoras sobre blanco, así que no se confunden con las
// pestañas del hero. Los rótulos cortos de móvil hacen que entren casi todas
// sin correr nada.
/** Píldora de filtro: borde, Lato y la elegida rellena. La comparten la barra
    de vistas del ranking y el selector de temporadas — son el mismo tipo de
    control dentro de la página, así que tienen que verse igual.

    `viva` marca la temporada en curso: el punto que late —el mismo `live-dot`
    del chip EN VIVO, que ya trae su apagado con prefers-reduced-motion— más
    el cian de marca. Se distingue por color y por ese punto, no por grosor:
    de Lato sólo se cargan la 400 y la 700, así que pedir más peso no traería
    otra tipografía sino el bold sintético que inventa el navegador. Y el cian
    va de fondo o de borde, nunca de texto: sobre blanco mide 2.6:1 y no
    llegaría a AA. El tamaño queda igual al del resto para que la tira no se
    desalinee — el punto ya dice cuál es la de ahora. */
const pastillaFiltro = (label, activo, attrs = '', { corto = '', viva = false } = {}) => html`
  <button
    type="button"
    ${raw(attrs)}
    aria-pressed="${activo ? 'true' : 'false'}"
    ${raw(corto ? `aria-label="${label}"` : '')}
    class="u-press inline-flex shrink-0 snap-start cursor-pointer items-center gap-2 rounded-full border px-4 py-2.5 font-body text-[12px] font-bold tracking-[0.08em] whitespace-nowrap transition-colors duration-200 sm:px-5 ${viva
      ? activo
        ? 'border-owa-cyan bg-owa-cyan text-owa-deep'
        : 'border-owa-cyan bg-white text-owa-deep hover:bg-owa-cyan/12'
      : activo
        ? 'border-owa-navy bg-owa-navy text-white'
        : 'border-owa-line bg-white text-owa-slate hover:border-owa-navy hover:text-owa-navy'}"
  >
    ${viva
      ? html`<span
          class="live-dot size-1.5 shrink-0 rounded-full ${activo ? 'bg-owa-deep' : 'bg-owa-cyan'}"
          aria-hidden="true"
        ></span>`
      : ''}
    <!-- Con rótulo corto el visible cambia por ancho, y el aria-label de
         arriba mantiene el nombre completo para lectores de pantalla. -->
    ${corto ? html`<span class="sm:hidden">${corto}</span><span class="hidden sm:inline">${label}</span>` : label}
  </button>
`;

const barraVistas = () => html`
  <div class="flex snap-x gap-2 overflow-x-auto sm:gap-2.5" role="group" aria-label="Vista del ranking" data-scroller>
    ${VISTAS.map(([label, v, corto]) => pastillaFiltro(label, s.vista === v, `data-vista="${v}"`, { corto }))}
  </div>
`;

const panel = () => {
  if (s.tab === 'temporadas') return panelCarrera();
  if (s.tab === 'equipos') return html`${tablaEquipos()}`;
  return html`
    <div class="mb-6">${barraVistas()}</div>
    ${tablaNadadores()} ${comoSeCalcula()}
  `;
};

const barraTabs = () => html`
  <!-- Nivel 1: pestañas ancladas al borde inferior del hero, con la activa
       "abriéndose" sobre el panel blanco. En pantalla chica no entran las
       cuatro, así que la tira corre con el dedo en una sola fila (apilarlas
       rompe el anclaje: una grilla de dos filas no se puede pegar al panel).
       El scroll lo acomoda traerAlaVista() en mount: al repintarse la tira
       vuelve a scrollLeft 0 y la elegida quedaba tapada contra el borde. -->
  <div
    class="mt-6 flex snap-x gap-1 overflow-x-auto lg:flex-wrap lg:overflow-visible"
    role="tablist"
    aria-label="Secciones de resultados"
    data-scroller
  >
    ${TABS.map(
      ([label, v]) => html`
        <button
          type="button"
          role="tab"
          data-tab="${v}"
          aria-selected="${s.tab === v ? 'true' : 'false'}"
          class="u-press shrink-0 snap-start cursor-pointer rounded-t-owa-md px-3 py-3 font-display text-[11px] font-black tracking-[0.03em] whitespace-nowrap transition-colors duration-200 ease-out sm:px-4 ${s.tab ===
          v
            ? 'bg-white text-owa-navy'
            : 'bg-white/10 text-white/75 hover:bg-white/16 hover:text-white'}"
        >
          ${label}
        </button>
      `
    )}
  </div>
`;

export function render(ctx) {
  const pedida = ctx.query.get('tab');
  if (pedida && TABS.some(([, v]) => v === pedida)) s.tab = pedida;

  return toHTML(html`
    <section class="relative overflow-hidden bg-owa-navy px-0 text-white">
      <!-- La foto vive detrás del contenido con un degradado navy encima: el
           lado izquierdo, donde va el texto, queda casi opaco. -->
      <div class="absolute inset-0" aria-hidden="true">
        ${foto({
          slug: 'spd-brazada-colores',
          alt: '',
          sizes: '100vw',
          priority: true,
          className: 'block h-full w-full',
          imgClass: 'h-full w-full object-cover',
        })}
        <!-- En móvil el texto ocupa todo el ancho, así que el velo tapa casi
             toda la foto; recién en sm el titular deja libre la derecha. -->
        <div class="absolute inset-0 bg-linear-to-r from-owa-navy via-owa-navy/95 to-owa-navy/75 sm:via-owa-navy/92 sm:to-owa-navy/30"></div>
        <div class="absolute inset-0 bg-linear-to-t from-owa-navy via-owa-navy/20 to-transparent"></div>
      </div>

      <!-- Hero corto: son cuatro pestañas de rótulo largo y con una bajada
           arriba quedaban demasiado abajo, empujando el contenido fuera de la
           primera pantalla. La bajada ("la temporada empieza el 31 de octubre
           en Luján") salió porque la tarjeta de la pestaña abierta ya lo dice,
           con la fecha y los días que faltan. -->
      <div class="u-shell relative pt-10">
        <!-- Volanta arriba del titular, como en el resto de los heros del
             sitio (PDA, Primeros pasos, las páginas madre). -->
        ${eyebrow(`Temporada ${TEMPORADA_ACTUAL}`, 'sky')}
        <!-- Sin <br>: en una línea en desktop, y en pantallas donde no entra
             corta solo. Techo un punto más bajo (3.25rem) porque el titular
             ahora mide el doble de ancho. -->
        <h1 class="mt-3.5 text-[clamp(2.125rem,4vw,3.25rem)] leading-[0.9]">Resultados &amp; rankings</h1>
        <div data-tabs>${barraTabs()}</div>
      </div>
    </section>

    <div class="u-shell pt-9 pb-24" data-panel>${panel()}</div>
  `);
}

/** Corre la tira lo justo para que la opción elegida se vea entera.
    Las dos barras se repintan en cada cambio, y al repintarse el scroll vuelve
    a cero: si la elegida vivía más a la derecha quedaba tapada contra el
    borde, que es lo que hacía parecer que no había pasado nada al tocarla.
    Sólo toca el scrollLeft del contenedor, nunca el de la página. Salto
    directo y no animado: el elemento tiene que estar puesto antes de que el
    dedo se levante. */
function traerAlaVista(tira) {
  if (!tira || tira.scrollWidth <= tira.clientWidth) return;
  const activo = tira.querySelector('[aria-selected="true"], [aria-pressed="true"]');
  if (!activo) return;
  const c = tira.getBoundingClientRect();
  const a = activo.getBoundingClientRect();
  // Deja un respiro al costado, así se ve que la tira sigue y se puede correr.
  const margen = 20;
  if (a.left < c.left + margen) tira.scrollLeft += a.left - c.left - margen;
  else if (a.right > c.right - margen) tira.scrollLeft += a.right - c.right + margen;
}

export function mount(root) {
  const cont = root.querySelector('[data-panel]');
  const tabs = root.querySelector('[data-tabs]');

  const acomodarTiras = () => root.querySelectorAll('[data-scroller]').forEach(traerAlaVista);

  // El HTML que llega prerenderizado trae el tiempo que faltaba el momento
  // del build. Se recalcula acá, con el reloj del visitante.
  const ponerAlDia = () =>
    root.querySelectorAll('[data-contador]').forEach((el) => {
      el.innerHTML = toHTML(contador(el.dataset.contador, el.dataset.hora));
    });

  // Con hora de largada el reloj tiene segundero: sin este intervalo se
  // quedaría clavado en el número que trajo el último repintado, que puede
  // ser de varios minutos atrás. El router no llama a un unmount cuando
  // cambia de vista —reemplaza el nodo y listo—, así que el intervalo se
  // corta solo apenas nota que `root` ya no cuelga del documento: sin esto
  // cada visita a /resultados dejaría un temporizador corriendo para
  // siempre, encima del de la visita anterior.
  const reloj = setInterval(() => {
    if (!root.isConnected) return clearInterval(reloj);
    ponerAlDia();
  }, 1000);

  const repintar = ({ foco } = {}) => {
    cont.innerHTML = toHTML(panel());
    tabs.innerHTML = toHTML(barraTabs());
    cont.querySelectorAll('[data-stagger]').forEach((g) => stagger(g));
    acomodarTiras();
    ponerAlDia();
    if (foco) {
      const el = cont.querySelector(foco);
      el?.focus();
      // El buscador se vuelve a crear en cada repintado: sin esto el cursor
      // vuelve al principio y escribir rápido invierte las letras.
      if (el?.setSelectionRange) el.setSelectionRange(el.value.length, el.value.length);
    }
  };

  root.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-tab]');
    if (tab) {
      if (tab.dataset.tab === s.tab) return;
      s.tab = tab.dataset.tab;
      s.sel = null;
      s.q = '';
      s.cat = 'TODAS';
      s.club = 'TODOS';
      s.pagina = 1;
      history.replaceState({}, '', `/resultados?tab=${s.tab}`);
      return repintar();
    }

    const temporada = e.target.closest('[data-temporada]');
    if (temporada) {
      if (temporada.dataset.temporada === s.temporada) return;
      s.temporada = temporada.dataset.temporada;
      return repintar();
    }

    const vista = e.target.closest('[data-vista]');
    if (vista) {
      if (vista.dataset.vista === s.vista) return;
      s.vista = vista.dataset.vista;
      s.sel = null;
      // Las opciones de categoría y club se recalculan para la tabla nueva:
      // dejar elegido un club que no compite en esta vista da tabla vacía.
      s.cat = 'TODAS';
      s.club = 'TODOS';
      s.pagina = 1;
      return repintar();
    }

    const pag = e.target.closest('[data-pagina]');
    if (pag) {
      s.pagina = Number(pag.dataset.pagina);
      s.sel = null;
      repintar();
      // Al cambiar de página el usuario está abajo de todo, en el paginador:
      // sin esto la tabla nueva arranca fuera de pantalla y parece que no pasó
      // nada. Salto directo y no animado: son 3.000px de recorrido, y verlos
      // pasar es más molesto que útil (`scroll-behavior: smooth` es global, hay
      // que apagarlo acá a propósito). El 88 deja la tabla despejada debajo del
      // header sticky.
      window.scrollTo({ top: Math.max(0, cont.getBoundingClientRect().top + window.scrollY - 88), behavior: 'instant' });
      return;
    }

    if (e.target.closest('[data-cerrar-ficha]')) {
      s.sel = null;
      return repintar();
    }

    const fila = e.target.closest('[data-nadador]');
    if (fila) {
      const r = (RANKING[s.tab]?.[sexoDe(s.vista)] ?? []).find((x) => x.nombre === fila.dataset.nadador);
      s.sel = s.sel?.nombre === r?.nombre ? null : r;
      repintar();
    }
  });

  root.addEventListener('keydown', (e) => {
    const fila = e.target.closest('[data-nadador]');
    if (!fila || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    fila.click();
  });

  root.addEventListener('change', (e) => {
    const sel = e.target.closest('[data-sel]');
    if (!sel) return;
    s[sel.dataset.sel] = sel.value;
    s.pagina = 1;
    repintar();
  });

  let t;
  root.addEventListener('input', (e) => {
    if (!e.target.closest('[data-q]')) return;
    s.q = e.target.value;
    s.pagina = 1;
    clearTimeout(t);
    t = setTimeout(() => repintar({ foco: '[data-q]' }), 180);
  });

  // Al entrar directo con ?tab=equipos la pestaña activa es la última y arranca
  // fuera de la pantalla: hay que acomodar la tira ya en el primer pintado.
  acomodarTiras();
  ponerAlDia();
  // Y otra vez cuando termina de cargar Vito Wide. Con la tipografía de
  // reemplazo los rótulos miden menos, la tira todavía no desborda y por eso
  // la primera pasada no corrige nada; al cambiar la fuente crecen y la
  // pestaña activa se va del borde.
  document.fonts?.ready.then(acomodarTiras);
}

