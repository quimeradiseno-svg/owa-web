import { html, toHTML, stagger } from '../lib/html.js';
import { foto, fondo, fondoVideo, montarFondoVideo } from '../lib/img.js';
import { PUNTUABLES, ESPECIALES, CHALLENGES } from '../data/eventos.js';
import { TRAVEL } from '../data/travel.js';
import { MODALIDADES } from '../data/madres.js';
import { GP, CIRC, CLUBES_GP } from '../data/rankings.js';
import { tarjetaEvento, tarjetaFecha, tarjetaChallenge, tarjetaTravel } from '../components/tarjeta-evento.js';
import { icono } from '../components/iconos.js';
import { eyebrow, tituloSeccion, btnAccent, btnBlanco, btnBorde, linkFuerte, olaCentrada } from '../components/ui.js';

export const titulo = 'El agua nos une';

/* --------------------------------------------------------------- rankings */

const estadoHome = { tab: 'gp' };

const PANELES = [
  { id: 'gp', label: 'GRAND PRIX', data: GP, ruta: 'gp' },
  { id: 'circ', label: 'CIRCUITO OWA', data: CIRC, ruta: 'circ' },
];

// Avatar placeholder hasta que OWA mande la foto real de cada nadador: mismo
// círculo en toda la sección, para que no se lea como "roto" ni finjan ser
// una foto real de alguien que no es. `oscuro` lo adapta a la tarjeta navy de
// clubes (mismo criterio que el resto de la marca sobre fondo oscuro).
const avatar = (clase, oscuro = false) =>
  html`<span class="grid ${clase} shrink-0 place-items-center rounded-full ${oscuro ? 'bg-white/10 text-owa-sky' : 'bg-owa-mist text-owa-blue'}"
    >${icono('persona', 'size-1/2')}</span
  >`;

// Número de posición "suelto", sin chapita: más grande y en el color de cada
// metal, tal como lo pidió el mockup de referencia.
// El dorado/bronce de marca (pensados para chapita rellena) no llegan a 3:1
// como texto suelto sobre blanco: acá van oscurecidos sólo para esa tarjeta;
// sobre navy el tono de marca ya contrasta bien y queda como está.
const numeroPos = (p, oscuro = false) => {
  const color =
    p === 1
      ? oscuro
        ? 'text-owa-gold'
        : 'text-[#a18600]'
      : p === 3
        ? oscuro
          ? 'text-owa-bronze'
          : 'text-[#9d8132]'
        : oscuro
          ? 'text-owa-gray'
          : 'text-owa-slate';
  return html`<span data-nums class="w-7 shrink-0 font-display text-2xl leading-none font-black ${color}">${p}</span>`;
};

const columnaGenero = (panel, sexo) => {
  const rows = panel.data.filter((r) => r.sexo === sexo).slice(0, 3);
  return html`
    <div>
      <p class="flex items-center gap-2 font-display text-xs font-black tracking-[0.12em] text-owa-navy">
        ${avatar('size-6')}
        ${sexo === 'M' ? 'HOMBRES' : 'MUJERES'}
      </p>
      ${rows.length
        ? html`
            <ol class="mt-3.5 grid">
              ${rows.map(
                (r, i) => html`
                  <li class="flex items-center gap-3 border-b border-owa-sand py-3 last:border-0">
                    ${numeroPos(i + 1)} ${avatar('size-11')}
                    <span class="min-w-0 flex-1">
                      <span class="block truncate font-display text-[15px] font-bold text-owa-navy">${r.nombre}</span>
                      <span data-nums class="mt-0.5 block font-display text-sm font-black text-owa-blue">${r.puntos} pts</span>
                    </span>
                  </li>
                `
              )}
            </ol>
          `
        : html`<p class="py-6 text-sm text-owa-slate">Todavía no hay nadadores cargados.</p>`}
    </div>
  `;
};

function panelRanking() {
  const panel = PANELES.find((p) => p.id === estadoHome.tab);
  return html`
    <article class="reveal rounded-owa-lg bg-white p-7 shadow-[var(--shadow-card)]" data-panel-ranking>
      <div class="flex gap-6 border-b border-owa-sand" role="tablist" aria-label="Torneo">
        ${PANELES.map(
          (p) => html`
            <button
              type="button"
              role="tab"
              data-tab="${p.id}"
              aria-selected="${p.id === panel.id ? 'true' : 'false'}"
              class="u-press border-b-2 pb-3.5 font-display text-[13px] font-black tracking-[0.06em] transition-colors duration-200 ease-out ${p.id === panel.id
                ? 'border-owa-blue text-owa-navy'
                : 'border-transparent text-owa-slate hover:text-owa-navy'}"
            >
              ${p.label}
            </button>
          `
        )}
      </div>

      <div class="mt-6 grid gap-6 sm:grid-cols-2">${columnaGenero(panel, 'M')} ${columnaGenero(panel, 'F')}</div>
    </article>
  `;
}

// Los 3 clubes que van acá son el campeonato por equipos general: no dependen
// de la pestaña Grand Prix/Circuito que arma el bloque de nadadores de al lado.
function panelClubes() {
  return html`
    <article class="reveal rounded-owa-lg bg-owa-navy p-7 text-white" data-panel-clubes>
      <h3 class="font-display text-[13px] font-black tracking-[0.14em] text-owa-sky">CLUBES</h3>
      <ol class="mt-4.5">
        ${CLUBES_GP.map(
          (c, i) => html`
            <li class="flex items-center gap-3.5 border-t border-white/12 py-3.5 first:border-0 first:pt-0">
              ${numeroPos(i + 1, true)} ${avatar('size-12', true)}
              <span class="min-w-0 flex-1">
                <span class="block font-display text-[15px] leading-tight font-bold">${c.nombre}</span>
                <span data-nums class="mt-1 block font-display text-sm font-black text-owa-sky">${c.puntos} pts</span>
              </span>
            </li>
          `
        )}
      </ol>
      <a
        href="/resultados?vista=equipos"
        class="u-nudge mt-5 inline-flex items-center gap-2 font-display text-[13px] font-black tracking-[0.08em] text-owa-cyan uppercase transition-colors hover:text-owa-sky"
      >
        Ver todos los clubes
        <span class="u-nudge-arrow" aria-hidden="true">→</span>
      </a>
    </article>
  `;
}

/* ------------------------------------------------------------------ vista */

export function render() {
  return toHTML(html`
    <!-- ------------------------------------------------------------ hero -->
    <section class="relative flex min-h-[86svh] items-end overflow-hidden bg-owa-abyss">
      ${fondoVideo({
        posterSlug: 'hero-drone',
        mp4: '/video/hero-drone.mp4',
        alt: 'Vista aérea de nadadores cruzando entre boyas de OWA, con público en la costa',
        opacity: 0.78,
      })}
      <div class="u-hero-scrim absolute inset-0"></div>

      <div class="u-shell relative pt-32 pb-36">
        <p class="hero-in flex items-center gap-3.5" style="--hero-delay:60ms">
          <span class="h-0.5 w-11 bg-owa-cyan"></span>
          <span class="u-eyebrow text-owa-sky">Temporada 2026/27</span>
        </p>

        <h1 class="hero-in mt-6 text-[clamp(3.25rem,9.5vw,9.25rem)] text-white" style="--hero-delay:140ms">
          El agua<br />nos une.
        </h1>

        <!-- En desktop el párrafo termina justo donde termina "NOS UNE.": el
             titular escala con 9.5vw y su segunda línea mide 5.53 veces el
             font-size, de ahí el clamp. Debajo de lg se queda en 560px, que es
             la medida de lectura cómoda.
             Los espacios duros del final evitan que a 1440 quede "agua." sola
             en la segunda línea; text-wrap:pretty no alcanza a resolverlo. -->
        <p
          class="hero-in mt-6.5 max-w-[560px] text-lg leading-relaxed text-pretty text-owa-line lg:max-w-[clamp(287px,52.5vw,818px)]"
          style="--hero-delay:220ms"
        >
          Elegí tu próximo desafío. Una temporada para disfrutar, competir y vivir nuevas experiencias
          en&nbsp;el&nbsp;agua.
        </p>

        <div class="hero-in mt-9 flex flex-wrap items-center gap-x-8 gap-y-6" style="--hero-delay:300ms">
          ${btnBlanco('VER CALENDARIO 26/27', '/calendario')}
          <!-- Los cuatro rótulos van a dos líneas para que queden del mismo alto
               y el bloque lea como una grilla, no como una lista despareja. -->
          <!-- Todos los ítems llevan separador; la lista se corre 21px a la
               izquierda (borde + padding) y el contenedor recorta esa columna.
               Así el borde desaparece solo en el primero de CADA fila, que en
               mobile son dos, y el "4" sigue alineado con el párrafo. -->
          <div class="overflow-hidden">
            <ul class="ms-[-21px] flex flex-wrap gap-y-3.5 font-display text-white/85">
              ${[
                ['4', 'Eventos', 'puntuables'],
                ['4', 'Eventos', 'especiales'],
                ['3', 'OWA', 'Challenge'],
                ['2', 'OWA', 'Travel'],
              ].map(
                ([n, l1, l2]) => html`
                  <li class="flex items-center gap-2 border-s border-white/25 px-5">
                    <span data-nums class="text-[1.5rem] leading-none font-black text-owa-cyan">${n}</span>
                    <span class="text-[11px] leading-[1.3] font-bold tracking-[0.12em] uppercase">${l1}<br />${l2}</span>
                  </li>
                `
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>

    <div class="relative z-2 -mt-13">${olaCentrada('#fff')}</div>

    <!-- ------------------------------------------------- eventos puntuables -->
    <section class="bg-white px-0 pt-8 pb-23" aria-labelledby="h-puntuables">
      <div class="u-shell">
        <div class="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            ${eyebrow('Suman al ranking')}
            <h2 id="h-puntuables" class="u-h2 mt-3.5">Eventos puntuables</h2>
          </div>
          ${linkFuerte('Calendario completo', '/calendario')}
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
          ${PUNTUABLES.map((e) => tarjetaEvento(e))}
        </div>
      </div>
    </section>

    <!-- -------------------------------------------------- eventos especiales -->
    <section class="bg-owa-sand px-0 py-22" aria-labelledby="h-especiales">
      <div class="u-shell">
        <div class="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            ${eyebrow('Fuera del torneo')}
            <h2 id="h-especiales" class="u-h2 mt-3.5">Eventos especiales</h2>
          </div>
          ${linkFuerte('Ver todos', '/especiales')}
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
          ${ESPECIALES.map((e) =>
            tarjetaFecha(e, {
              orden: e.sigla,
              linea: `${e.fechaCorta} ${e.anio}`,
              sublinea: e.nota || e.sede,
            })
          )}
        </div>
      </div>
    </section>

    <!-- --------------------------------------------------------- challenge -->
    <section class="bg-white px-0 py-22" aria-labelledby="h-challenge">
      <div class="u-shell">
        <div class="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            ${eyebrow('Ultradistancia')}
            <h2 id="h-challenge" class="u-h2 mt-3.5">OWA Challenge</h2>
          </div>
          ${linkFuerte('Conocer el Challenge', '/challenge')}
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-stagger>
          ${CHALLENGES.map((e) => tarjetaChallenge(e))}
        </div>
      </div>
    </section>

    <!-- -------------------------------------------------------- owa travel -->
    <section class="bg-owa-mist px-0 py-22" aria-labelledby="h-travel">
      <div class="u-shell">
        <div class="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            ${eyebrow('Viajes de nado', 'blue')}
            <h2 id="h-travel" class="u-h2 mt-3.5">OWA Travel</h2>
          </div>
          ${linkFuerte('Conocer OWA Travel', '/travel')}
        </div>

        <div class="grid gap-4.5 lg:grid-cols-2" data-stagger>${TRAVEL.map((t) => tarjetaTravel(t))}</div>
      </div>
    </section>

    <!-- ----------------------------------------------------------- modalidades -->
    <section class="bg-owa-navy px-0 py-22 text-white" aria-labelledby="h-modalidades">
      <div class="u-shell">
        <div>
          ${eyebrow('Modalidades', 'sky')}
          <h2 id="h-modalidades" class="u-h2 mt-3.5">Cinco formas<br />de entrar al agua</h2>
        </div>

        <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" data-stagger>
          ${MODALIDADES.map(
            (m, i) => html`
              <a
                href="${m.href}"
                class="reveal u-lift-sm group relative flex min-h-62 flex-col justify-between overflow-hidden rounded-owa-lg border border-white/13 bg-white/6 p-7.5 transition-colors duration-250 ease-out hover:border-owa-cyan/50"
              >
                <div class="absolute inset-0 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100">
                  ${fondo({ slug: m.img, opacity: 0.5 })}
                </div>

                <div class="relative">
                  <div class="flex items-start justify-between">
                    <span data-nums class="font-display text-sm font-black tracking-[0.08em] text-owa-sky"
                      >${String(i + 1).padStart(2, '0')}</span
                    >
                    ${m.iconoImg
                      ? html`<img src="${m.iconoImg}" alt="" class="size-7" aria-hidden="true" />`
                      : html`<span class="text-owa-sky">${icono(m.icono, 'size-6')}</span>`}
                  </div>
                  <h3 class="mt-5 text-[clamp(1.25rem,2vw,1.625rem)] leading-[1.02] text-white">${m.titulo}</h3>
                  <p class="mt-3.5 text-sm leading-relaxed text-owa-line">${m.desc}</p>
                </div>
                <div class="relative">
                  <p class="mt-6 font-display text-xs font-bold tracking-[0.1em] text-owa-sky">${m.meta}</p>
                  <p class="mt-3 flex items-center gap-2 font-display text-xs font-black tracking-[0.08em] text-owa-cyan">
                    ${m.cta}
                    <span class="transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
                  </p>
                </div>
              </a>
            `
          )}
        </div>
      </div>
    </section>

    <!-- ------------------------------------------------------------- rankings -->
    <section class="bg-owa-sand px-0 py-22" aria-labelledby="h-rankings">
      <div class="u-shell">
        <div class="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div>
            ${eyebrow('Rankings en vivo')}
            <h2 id="h-rankings" class="u-h2 mt-3.5">
              In aqua veritas<br />aqua autem nos unit
            </h2>
          </div>
          ${btnBorde('Ver rankings completos', '/resultados')}
        </div>

        <div class="grid gap-4.5 lg:grid-cols-[1.7fr_1fr]" data-stagger>${panelRanking()} ${panelClubes()}</div>
      </div>
    </section>

    <!-- ----------------------------------------------------------------- pad -->
    <section class="bg-owa-mist px-0 py-22" aria-labelledby="h-pda">
      <div class="u-shell grid items-center gap-13 lg:grid-cols-2">
        <div>
          ${eyebrow('PDA', 'blue')}
          <h2 id="h-pda" class="mt-4 text-[clamp(1.875rem,4vw,3.25rem)] leading-[0.95] text-owa-navy">
            Programa<br />Desarrollo<br />Aguas Abiertas
          </h2>
          <p class="mt-4.5 max-w-[46ch] text-[17px] leading-relaxed text-owa-slate">
            Más oportunidades para que nadadores, entrenadores, clubes y escuelas puedan crecer dentro de las aguas
            abiertas.
          </p>
          <div class="mt-7">${btnBorde('Conocer el PDA', '/pda')}</div>
        </div>

        <div class="reveal-clip h-85 overflow-hidden rounded-owa-lg">
          ${foto({
            slug: 'pad-infantil',
            alt: 'Chico con gorra de natación entrando al agua con su boya naranja',
            sizes: '(min-width: 1024px) 50vw, 100vw',
            className: 'block h-full w-full',
            imgClass: 'h-full w-full object-cover',
          })}
        </div>
      </div>
    </section>
  `);
}

export function mount(root) {
  root.querySelectorAll('[data-stagger]').forEach((g) => stagger(g));
  montarFondoVideo(root);

  root.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-tab]');
    if (!btn || btn.getAttribute('aria-selected') === 'true') return;
    estadoHome.tab = btn.dataset.tab;

    const viejo = root.querySelector('[data-panel-ranking]');
    const tmp = document.createElement('div');
    tmp.innerHTML = toHTML(panelRanking());
    const nuevo = tmp.firstElementChild;
    nuevo.setAttribute('data-visible', '');
    nuevo.style.setProperty('--i', viejo.style.getPropertyValue('--i'));
    viejo.replaceWith(nuevo);
  });
}
