import { html, toHTML, stagger } from '../lib/html.js';
import { foto, fondo, fondoVideo, montarFondoVideo } from '../lib/img.js';
import { PUNTUABLES, ESPECIALES, CHALLENGES } from '../data/eventos.js';
import { TRAVEL, RACE_TRAVEL_AGENDA } from '../data/travel.js';
import { MODALIDADES } from '../data/madres.js';
import { GP, CIRC, CLUBES_GP, CLUBES_CIRC } from '../data/rankings.js';
import { tarjetaEvento, tarjetaEspecial, tarjetaChallenge } from '../components/tarjeta-evento.js';
import { icono } from '../components/iconos.js';
import { eyebrow, tituloSeccion, btnAccent, btnBlanco, btnBorde, linkFuerte, pastillaChica, olaCentrada } from '../components/ui.js';

export const titulo = 'El agua nos une';

/* --------------------------------------------------------------- rankings */

const estadoHome = { tab: 'gp' };

const PANELES = [
  { id: 'gp', label: 'GRAND PRIX OWA', data: GP, ruta: 'gp' },
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

// Número de posición "suelto", sin chapita: grande y en degradé del color de
// cada metal, tal como lo pidió el mockup de referencia.
// Los extremos del degradé están elegidos a mano para que incluso el tramo
// más claro llegue a 3:1 sobre blanco — el propio degradé usa `color:
// transparent`, así que el script de contraste no puede leerlo (ve un color
// vacío y lo deja pasar sin chequear), hay que sostenerlo verificado a mano.
const CLASE_METAL = {
  '1-claro': 'from-[#8a6d00] to-[#a88c00]',
  '1-oscuro': 'from-[#c9a227] to-[#f7ce00]',
  '2-claro': 'from-[#3a3b3c] to-[#6b6c6e]',
  '2-oscuro': 'from-[#9e9fa9] to-[#c7c8cf]',
  '3-claro': 'from-[#7c6428] to-[#a68835]',
  '3-oscuro': 'from-[#b89040] to-[#e0b848]',
};

const numeroPos = (p, oscuro = false) => {
  const clase = CLASE_METAL[`${p}-${oscuro ? 'oscuro' : 'claro'}`] || CLASE_METAL[`2-${oscuro ? 'oscuro' : 'claro'}`];
  return html`<span
    data-nums
    class="w-7 shrink-0 bg-linear-to-b ${clase} bg-clip-text font-display text-2xl leading-none font-black text-transparent"
    >${p}</span
  >`;
};

const columnaGenero = (panel, sexo) => {
  const rows = panel.data.filter((r) => r.sexo === sexo).slice(0, 3);
  return html`
    <div>
      <p class="flex items-center gap-2.5 font-display text-sm font-black tracking-[0.12em] text-owa-navy">
        <span class="grid size-9 shrink-0 place-items-center rounded-full bg-owa-navy text-white">
          ${icono('persona', 'size-4.5')}
        </span>
        ${sexo === 'M' ? 'HOMBRES' : 'MUJERES'}
      </p>
      ${rows.length
        ? html`
            <ol class="mt-3.5 grid">
              ${rows.map(
                (r, i) => html`
                  <li class="flex items-center gap-3.5 border-b border-owa-sand py-3.5 last:border-0">
                    ${numeroPos(i + 1)} ${avatar('size-15')}
                    <span class="min-w-0 flex-1">
                      <span class="block truncate font-display text-lg font-bold text-owa-navy">${r.nombre}</span>
                      <span data-nums class="mt-0.5 block text-sm font-bold text-owa-blue">${r.puntos} pts</span>
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
      <div class="flex gap-1.5 rounded-full bg-owa-sand p-1.5" role="group" aria-label="Torneo">
        ${PANELES.map(
          (p) => html`
            <button
              type="button"
              data-tab="${p.id}"
              aria-pressed="${p.id === panel.id ? 'true' : 'false'}"
              class="u-press cursor-pointer rounded-full px-5 py-2.5 font-display text-sm font-black tracking-[0.06em] transition-colors duration-200 ${p.id === panel.id
                ? 'bg-owa-navy text-white'
                : 'text-owa-slate hover:text-owa-navy'}"
            >
              <span class="hidden sm:inline">RANKING </span>${p.label}
            </button>
          `
        )}
      </div>

      <div class="mt-6 grid gap-6 sm:grid-cols-2 sm:gap-8 sm:divide-x sm:divide-owa-line">
        ${columnaGenero(panel, 'M')} ${columnaGenero(panel, 'F')}
      </div>
    </article>
  `;
}

// Clubes tiene su propio ranking por torneo (Grand Prix y Circuito son
// campeonatos por equipos distintos) — pastilla propia, independiente de la
// que elige el torneo de nadadores al lado.
const CLUBES_POR_TAB = { gp: CLUBES_GP, circ: CLUBES_CIRC };
const estadoClubes = { tab: 'gp' };

function panelClubes() {
  const clubes = CLUBES_POR_TAB[estadoClubes.tab];
  return html`
    <article class="reveal relative overflow-hidden rounded-owa-lg bg-owa-navy p-7 text-white" data-panel-clubes>
      <!-- Foto a sangre de toda la tarjeta: sin recorte visible, se apaga hacia
           arriba con un degradado para que el listado siga siendo lo que se lee. -->
      <div class="pointer-events-none absolute inset-0" aria-hidden="true">
        ${foto({ slug: 'podio-trofeo', alt: '', className: 'block h-full w-full', imgClass: 'h-full w-full object-cover' })}
        <div class="absolute inset-0 bg-linear-to-t from-owa-navy/45 via-owa-navy/85 to-owa-navy"></div>
      </div>

      <div class="relative">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h3 class="font-display text-xl font-black tracking-[0.1em] text-owa-sky">CLUBES</h3>
          <div class="flex gap-1.5 rounded-full bg-white/8 p-1.5" role="group" aria-label="Torneo — Clubes">
            ${pastillaChica('GP', estadoClubes.tab === 'gp', 'data-club-tab="gp"', { oscuro: true })}
            ${pastillaChica('CIRC', estadoClubes.tab === 'circ', 'data-club-tab="circ"', { oscuro: true })}
          </div>
        </div>
        <ol class="mt-9">
          ${clubes.map(
            (c, i) => html`
              <li class="flex items-center gap-3.5 border-t border-white/12 py-4 first:border-0 first:pt-0">
                ${numeroPos(i + 1, true)} ${avatar('size-15', true)}
                <span class="min-w-0 flex-1">
                  <span class="block font-display text-lg leading-tight font-bold">${c.nombre}</span>
                  <span data-nums class="mt-1 block text-sm font-bold text-owa-sky">${c.puntos} pts</span>
                </span>
              </li>
            `
          )}
        </ol>
        <a
          href="/resultados?vista=equipos"
          class="u-nudge mt-6 inline-flex items-center gap-2 rounded-full border border-owa-cyan/60 px-4.5 py-2 font-display text-[13px] font-black tracking-[0.08em] text-owa-cyan uppercase transition-colors hover:border-owa-sky hover:text-owa-sky"
        >
          Ver todos los clubes
          <span class="u-nudge-arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  `;
}

/* -------------------------------------------------------------- owa travel */

// La salida de mayo va a la izquierda (pedido del cliente) con una nota chica
// de que también hubo una salida en octubre, ya sin cupo. A la derecha, Race
// Travel promociona la primera carrera con cupos abiertos: Capri–Nápoli.
const salidaActiva = TRAVEL.find((t) => t.slug === 'travel-mayo-2027');
const salidaCerrada = TRAVEL.find((t) => t.slug === 'buzios-2026');
const raceDestacada = RACE_TRAVEL_AGENDA.find((r) => r.slug === 'capri-napoli');

function tarjetaSwimAdventureHome(t, otra) {
  return html`
    <a
      href="/travel#h-swim-adventure"
      class="reveal u-lift-sm group grid overflow-hidden rounded-owa-lg border border-owa-line bg-white transition-shadow duration-250 ease-out hover:shadow-[var(--shadow-elevated)] sm:grid-cols-2"
    >
      <div class="relative h-52 sm:h-full sm:min-h-64 sm:-mr-4 sm:u-horizonte">
        ${foto({
          slug: t.img,
          alt: `Nadadores en ${t.destino}`,
          sizes: '(min-width: 640px) 25vw, 100vw',
          className: 'block h-full w-full',
          imgClass: 'h-full w-full object-cover',
        })}
        <p
          class="absolute top-0 left-0 rounded-br-[20px] bg-owa-cyan px-4.5 py-2.5 font-display text-[11px] font-black tracking-[0.14em] text-owa-deep"
        >
          ${t.chip}
        </p>
      </div>

      <div class="flex flex-col p-6.5">
        <p class="font-display text-[11px] font-bold tracking-[0.16em] text-owa-blue uppercase">Swim &amp; Adventure</p>
        <h3 class="mt-2 text-[clamp(1.5rem,2.4vw,2rem)] leading-[0.98] text-owa-navy">${t.salidaTitulo}</h3>
        <p data-nums class="mt-1.5 font-display text-xs font-black tracking-[0.06em] text-owa-slate uppercase">${t.fechaLarga}</p>
        <p class="mt-3.5 text-[13px] leading-relaxed text-owa-slate">${t.resumen}</p>

        <p class="mt-4 flex items-center gap-2 rounded-full bg-owa-sand px-3.5 py-2 text-[12px] text-owa-slate">
          <span class="font-display font-black tracking-[0.04em] text-owa-navy">${otra.salidaTitulo}</span>
          <span class="font-display text-[10px] font-black tracking-[0.1em] text-owa-slate/80">${otra.chip}</span>
        </p>

        <p class="mt-auto flex items-center gap-2 pt-5 font-display text-xs font-black tracking-[0.08em] text-owa-blue">
          Quiero recibir información
          <span class="transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
        </p>
      </div>
    </a>
  `;
}

function tarjetaRaceTravelHome(r) {
  return html`
    <a
      href="/travel#h-race-travel"
      data-sobre-foto
      class="reveal u-lift-sm group relative flex min-h-64 flex-col overflow-hidden rounded-owa-lg text-white transition-shadow duration-250 ease-out hover:shadow-[var(--shadow-lifted)] sm:h-full"
    >
      ${foto({
        slug: r.img,
        alt: `Nadadores en ${r.destino}, ${r.pais}`,
        sizes: '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw',
        className: 'absolute inset-0 block h-full w-full',
        imgClass: 'h-full w-full object-cover',
      })}
      <div class="absolute inset-0 bg-linear-to-t from-owa-abyss/95 via-owa-abyss/45 to-owa-abyss/15"></div>

      <div class="relative flex flex-1 flex-col p-6.5">
        <div class="flex items-start justify-between gap-3">
          <img src="/brand/owa-iso-cyan.svg" alt="" class="size-10" aria-hidden="true" />
          <span class="rounded-full bg-owa-cyan px-3.5 py-1.5 font-display text-[10px] font-black tracking-[0.14em] text-owa-deep">
            ${r.chip}
          </span>
        </div>

        <div class="mt-auto">
          <p class="font-display text-[11px] font-bold tracking-[0.16em] text-owa-sky uppercase">Race Travel</p>
          <h3 class="mt-2 text-[clamp(1.5rem,2.4vw,2rem)] leading-[0.98]">${r.destino}</h3>
          <p data-nums class="mt-1.5 font-display text-xs font-black tracking-[0.06em] text-owa-sky uppercase">${r.pais} · ${r.fecha}</p>
          <p class="mt-3.5 text-[13px] leading-relaxed text-owa-line">${r.resumen}</p>
          <p class="mt-1.5 text-[13px] font-bold text-white">${r.nota}</p>

          <p class="mt-5 flex items-center gap-2 font-display text-xs font-black tracking-[0.08em] text-owa-cyan">
            Quiero recibir información
            <span class="transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
          </p>
        </div>
      </div>
    </a>
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

        <div class="grid gap-4 sm:grid-cols-2" data-stagger>${ESPECIALES.map((e) => tarjetaEspecial(e))}</div>
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

        <div class="grid gap-4.5 lg:grid-cols-2" data-stagger>
          ${tarjetaSwimAdventureHome(salidaActiva, salidaCerrada)} ${tarjetaRaceTravelHome(raceDestacada)}
        </div>
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
                    <span data-nums class="font-display text-[2rem] leading-none font-black tracking-[0.02em] text-owa-sky"
                      >${String(i + 1).padStart(2, '0')}</span
                    >
                    <span class="grid size-9 shrink-0 place-items-center rounded-full bg-white/10">
                      <img src="${m.iso || '/brand/owa-iso-cyan.svg'}" alt="" class="size-5" aria-hidden="true" />
                    </span>
                  </div>
                  <h3 class="mt-5 text-[clamp(1.25rem,2vw,1.625rem)] leading-[1.02] text-white">${m.titulo}</h3>
                  ${m.distancia
                    ? html`<p data-nums class="mt-2.5 font-display text-lg font-black tracking-[0.04em] text-owa-sky">${m.distancia}</p>`
                    : ''}
                  <p class="mt-3.5 text-sm leading-relaxed text-owa-line">${m.desc}</p>
                </div>
                <div class="relative">
                  <p class="mt-6 flex items-center gap-2 font-display text-xs font-black tracking-[0.08em] text-owa-cyan">
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
          ${btnBorde('VER RANKINGS COMPLETOS', '/resultados')}
        </div>

        <div class="grid gap-4.5 lg:grid-cols-[1.7fr_1fr]" data-stagger>${panelRanking()} ${panelClubes()}</div>

        <div class="reveal relative mt-4.5 overflow-hidden rounded-owa-lg bg-owa-navy">
          ${fondo({ slug: 'circuito-grupo', alt: '', opacity: 0.35 })}
          <div class="relative flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div class="flex items-center gap-5">
              <img src="/brand/owa-iso-cyan.svg" alt="" class="size-14 shrink-0" aria-hidden="true" />
              <div>
                <h3 class="text-[clamp(1.375rem,2.6vw,1.875rem)] leading-[0.98] text-white">Cada brazada suma</h3>
                <p class="mt-1.5 text-sm text-owa-line">Viví cada fecha. Sumá puntos. Dejá tu huella.</p>
              </div>
            </div>
            ${btnAccent('CÓMO FUNCIONA EL RANKING', '/resultados?tab=gp#h-calculo')}
          </div>
        </div>
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
            alt: 'Grupo de jóvenes nadadores del PDA con boyas, listos para entrar al agua',
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

  const repintar = (selector, render, estado, clave, valor) => {
    if (estado[clave] === valor) return;
    estado[clave] = valor;
    const viejo = root.querySelector(selector);
    const tmp = document.createElement('div');
    tmp.innerHTML = toHTML(render());
    const nuevo = tmp.firstElementChild;
    nuevo.setAttribute('data-visible', '');
    nuevo.style.setProperty('--i', viejo.style.getPropertyValue('--i'));
    viejo.replaceWith(nuevo);
  };

  root.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-tab]');
    if (tab) return repintar('[data-panel-ranking]', panelRanking, estadoHome, 'tab', tab.dataset.tab);

    const clubTab = e.target.closest('[data-club-tab]');
    if (clubTab) return repintar('[data-panel-clubes]', panelClubes, estadoClubes, 'tab', clubTab.dataset.clubTab);
  });
}
