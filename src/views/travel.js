import { html, raw, toHTML, stagger } from '../lib/html.js';
import { foto, fondoVideo, montarFondoVideo } from '../lib/img.js';
import { MODALIDADES_TRAVEL, GALERIA_TRAVEL, TRAVEL, RACE_TRAVEL_AGENDA, MUCHO_MAS_QUE_NADAR, COMPETIR_LEJOS, MAS_CARRERAS } from '../data/travel.js';
import { icono } from '../components/iconos.js';
import { eyebrow, btnPrimario, btnBordeClaro, olaSuperior } from '../components/ui.js';

export const titulo = 'OWA Travel';

const WA = 'https://wa.me/5491125543112';
const MAIL = 'mailto:info@owa.com.ar?subject=OWA%20Travel';

/** WhatsApp con mensaje precargado: los CTA "Quiero recibir información" del
    cliente piden disparar mail o WhatsApp — se eligió WhatsApp como único
    canal para no duplicar el mismo pedido en dos botones por card. */
const waLink = (asunto) => `${WA}?text=${encodeURIComponent(`Hola! Quiero recibir información sobre ${asunto}.`)}`;

/** Pastilla de estado de una salida o carrera. Los tres textos son fijos,
    tal como los pasó OWA (no son estados genéricos del sitio). */
function chipViaje(texto) {
  const clase =
    texto === 'CUPOS DISPONIBLES'
      ? 'bg-owa-cyan text-owa-deep'
      : texto === 'SOLD OUT'
        ? 'bg-owa-navy/85 text-white'
        : 'border border-owa-line bg-white text-owa-slate';
  return html`<span class="rounded-full px-3.5 py-1.5 font-display text-[10px] font-black tracking-[0.14em] ${clase}">${texto}</span>`;
}

/** Card de "Próximas salidas": itinerario de Búzios, una por fecha. */
function tarjetaSalida(t) {
  return html`
    <div class="overflow-hidden rounded-owa-lg border border-owa-line bg-white">
      <div class="relative h-40">
        ${foto({
          slug: t.img,
          alt: `Vista de ${t.destino}`,
          sizes: '(min-width: 640px) 50vw, 100vw',
          className: 'block h-full w-full',
          imgClass: 'h-full w-full object-cover',
        })}
        <p class="absolute top-3.5 left-3.5">${chipViaje(t.chip)}</p>
      </div>
      <div class="p-6.5">
        <h4 class="text-[1.375rem] leading-[0.98] text-owa-navy">${t.salidaTitulo}</h4>
        <p data-nums class="mt-2 font-display text-xs font-black tracking-[0.06em] text-owa-blue uppercase">${t.fechaLarga}</p>
        <p class="mt-3 text-sm leading-relaxed text-owa-slate">${t.resumen}</p>
        ${t.cta
          ? html`
              <a
                href="${waLink(t.salidaTitulo)}"
                target="_blank"
                rel="noopener noreferrer"
                class="u-press mt-5 inline-flex items-center gap-2 rounded-full bg-owa-blue px-5 py-2.5 font-display text-xs font-black tracking-[0.08em] text-white transition-colors duration-200 ease-out hover:bg-owa-electric"
              >
                Quiero recibir información
              </a>
            `
          : ''}
      </div>
    </div>
  `;
}

/** Card de "Agenda 2027". Capri-Nápoli tiene fotos reales de la propia
    carrera; Portugal y Mykonos todavía no (van con foto de referencia del
    destino, en escala de grises: no fingen ser la carrera todavía). */
function tarjetaAgenda(r) {
  const activa = r.estado === 'abierta';
  return html`
    <div class="overflow-hidden rounded-owa-lg border ${activa ? 'border-owa-cyan/60' : 'border-owa-line'} bg-white">
      <div class="relative h-40">
        ${foto({
          slug: r.img,
          alt: activa ? `Nadadores en ${r.destino}, ${r.pais}` : '',
          sizes: '(min-width: 640px) 33vw, 100vw',
          className: 'block h-full w-full',
          imgClass: `h-full w-full object-cover ${activa ? '' : 'grayscale'}`,
        })}
        <p class="absolute top-3.5 left-3.5">${chipViaje(r.chip)}</p>
      </div>
      <div class="flex flex-col p-6.5">
        <h4 class="text-[1.375rem] leading-[0.98] text-owa-navy">${r.destino}</h4>
        <p class="mt-1 font-display text-xs font-bold tracking-[0.1em] text-owa-blue uppercase">${r.pais} · ${r.fecha}</p>
        <p class="mt-3 text-sm leading-relaxed text-owa-slate">${r.resumen}</p>
        <p class="mt-2.5 text-sm font-bold ${activa ? 'text-owa-navy' : 'text-owa-slate'}">${r.nota}</p>
        ${r.cta
          ? html`
              <a
                href="${waLink(`${r.destino} · ${r.pais}`)}"
                target="_blank"
                rel="noopener noreferrer"
                class="u-press mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-owa-blue px-5 py-2.5 font-display text-xs font-black tracking-[0.08em] text-white transition-colors duration-200 ease-out hover:bg-owa-electric"
              >
                Quiero recibir información
              </a>
            `
          : ''}
      </div>
    </div>
  `;
}

/** Bloque de modalidad. El segundo invierte las columnas para que la página
    no lea como dos fichas iguales apiladas. Cada modalidad suma, además de la
    bajada + "la experiencia" de siempre, el contenido concreto que pasó OWA:
    las salidas reales (Swim & Adventure) o la agenda de carreras (Race
    Travel), y su bloque de cierre. */
function modalidad(m, i) {
  const invertido = i % 2 === 1;

  return html`
    <section class="${invertido ? 'bg-owa-mist' : 'bg-white'} px-0 py-20" aria-labelledby="h-${m.slug}">
      <div class="u-shell grid items-center gap-12 lg:grid-cols-2">
        <div class="${invertido ? 'lg:order-2' : ''}">
          <h2 id="h-${m.slug}" class="text-[clamp(1.75rem,4vw,3rem)] leading-[0.96] text-owa-navy">${m.nombre}</h2>
          <p class="mt-3.5 font-display text-[clamp(1rem,1.6vw,1.25rem)] font-bold text-owa-blue">${m.tagline}</p>
          <div class="mt-5 grid max-w-[62ch] gap-3.5 text-base leading-[1.75] text-owa-slate">
            ${m.parrafos.map((p) => html`<p>${raw(p)}</p>`)}
          </div>
        </div>

        <div class="reveal-clip h-80 overflow-hidden rounded-owa-lg ${invertido ? 'lg:order-1' : ''}">
          ${foto({
            slug: m.img,
            alt: m.alt,
            sizes: '(min-width: 1024px) 50vw, 100vw',
            className: 'block h-full w-full',
            // zoom acerca el encuadre al grupo: la toma de drone abierta los
            // dejaba diminutos contra el mar.
            imgClass: `h-full w-full object-cover ${m.zoom ? 'scale-150 object-[50%_42%]' : ''}`,
          })}
        </div>
      </div>

      <!-- Los 5 ítems van dentro de una caja y a dos columnas: sueltos en tres
           columnas la última fila quedaba coja y los bordes se leían como una
           tabla rota. -->
      <div class="u-shell mt-11">
        <div class="rounded-owa-lg ${invertido ? 'bg-white' : 'bg-owa-sand'} p-8">
          <h3 class="u-eyebrow text-owa-blue">La experiencia</h3>
          <ul class="mt-5 grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-5">
            ${m.experiencia.map(
              (e) => html`
                <li>
                  <span class="grid size-11 place-items-center rounded-full ${invertido ? 'bg-owa-mist' : 'bg-white'} text-owa-blue">
                    ${icono(e.icono, 'size-5.5')}
                  </span>
                  <p class="mt-3 font-display text-[13px] font-black tracking-[0.03em] text-owa-navy uppercase break-words">${e.t}</p>
                  <p class="mt-1 text-[13px] leading-relaxed text-owa-slate">${raw(e.d)}</p>
                </li>
              `
            )}
          </ul>
        </div>
      </div>

      ${m.slug === 'swim-adventure'
        ? html`
            <div class="u-shell mt-14">
              <h3 class="u-eyebrow text-owa-blue">Próximas salidas</h3>
              <div class="mt-5 grid gap-5 sm:grid-cols-2">${TRAVEL.map(tarjetaSalida)}</div>
            </div>

            <div class="u-shell mt-11">
              <div class="rounded-owa-lg bg-owa-navy p-8 text-white sm:p-11">
                <h3 class="text-[clamp(1.5rem,2.6vw,2.125rem)] leading-[0.98]">${MUCHO_MAS_QUE_NADAR.titulo}</h3>
                <div class="mt-4 grid max-w-[56ch] gap-2.5 text-[15px] leading-relaxed text-owa-line">
                  ${MUCHO_MAS_QUE_NADAR.parrafos.map((p) => html`<p>${raw(p)}</p>`)}
                </div>
              </div>
            </div>
          `
        : ''}
      ${m.slug === 'race-travel'
        ? html`
            <div class="u-shell mt-14">
              <h3 class="u-eyebrow text-owa-blue">Agenda 2027</h3>
              <div class="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">${RACE_TRAVEL_AGENDA.map(tarjetaAgenda)}</div>
            </div>

            <div class="u-shell mt-11">
              <div class="rounded-owa-lg bg-white p-8 sm:p-11">
                <h3 class="text-[clamp(1.5rem,2.6vw,2.125rem)] leading-[0.98] text-owa-navy">${COMPETIR_LEJOS.titulo}</h3>
                <div class="mt-4 grid max-w-[56ch] gap-2.5 text-[15px] leading-relaxed text-owa-slate">
                  ${COMPETIR_LEJOS.parrafos.map((p) => html`<p>${raw(p)}</p>`)}
                </div>
                <a
                  href="${waLink('OWA Race Travel 2027')}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="u-press mt-6 inline-flex items-center gap-2 rounded-full bg-owa-blue px-6 py-3 font-display text-xs font-black tracking-[0.08em] text-white transition-colors duration-200 ease-out hover:bg-owa-electric"
                >
                  ${COMPETIR_LEJOS.cta}
                </a>
              </div>
            </div>

            <div class="u-shell mt-8">
              <p class="font-display text-sm font-black tracking-[0.04em] text-owa-navy uppercase">${MAS_CARRERAS.titulo}</p>
              <div class="mt-2 grid max-w-[52ch] gap-1 text-sm leading-relaxed text-owa-slate">
                ${MAS_CARRERAS.parrafos.map((p) => html`<p>${raw(p)}</p>`)}
              </div>
            </div>
          `
        : ''}
    </section>
  `;
}

export function render() {
  return toHTML(html`
    <section class="relative flex min-h-[60svh] items-end overflow-hidden bg-owa-abyss">
      ${fondoVideo({
        posterSlug: 'tv-hero',
        mp4: '/video/travel-buzios.mp4',
        alt: 'Vista aérea del grupo de OWA Travel cruzando la bahía de Búzios',
        opacity: 0.88,
      })}
      <div class="u-hero-scrim-video absolute inset-0"></div>
      ${olaSuperior('#fff')}

      <div class="u-shell relative w-full pt-28 pb-19 text-white">
        ${eyebrow('Viajes grupales', 'sky')}

        <!-- El logo va absoluto: es mas alto que el titulo y, en el flujo,
             estiraba la fila y separaba el subtitulo mas que en el resto de
             las paginas. Con top-0 igual arranca a la altura del h1. -->
        <div class="relative mt-4">
          <h1 class="text-[clamp(2.375rem,6.4vw,6rem)] leading-[0.9]">OWA Travel</h1>
          <img
            src="/brand/owa-travel-blanco.svg"
            alt=""
            aria-hidden="true"
            width="89"
            height="151"
            class="absolute top-0 right-0 hidden h-auto w-[clamp(3.1rem,4.75vw,4.275rem)] opacity-90 lg:block"
          />
        </div>

        <p class="mt-6 max-w-[46ch] text-[19px] leading-relaxed text-owa-line">
          Dos formas de conocer el mundo a través del agua.
        </p>
      </div>
    </section>

    ${MODALIDADES_TRAVEL.map(modalidad)}

    <!-- Galeria: la tortuga ocupa dos columnas y dos filas porque es la unica
         foto que documenta lo que promete el itinerario. El resto entra en la
         grilla de a una. Sin lightbox: son fotos de ambiente, no material que
         alguien vaya a querer inspeccionar de cerca. -->
    <section class="bg-owa-abyss px-0 py-19 text-white" aria-labelledby="h-galeria">
      <div class="u-shell">
        <h2 id="h-galeria" class="u-eyebrow text-owa-sky">Búzios en fotos</h2>
        <p class="mt-3.5 max-w-[46ch] text-[17px] leading-relaxed text-owa-line">
          Islas, corales, tortugas y un grupo que vuelve. Así se vive un Swim &amp; Adventure.
        </p>

        <!-- Filas de alto fijo: la destacada ocupa dos, y como todas las fotos
             llenan su celda (h-full) la grilla cierra sin huecos. Con alto por
             imagen en vez de por fila quedaban espacios negros al lado de la
             destacada. -->
        <ul
          class="mt-8 grid auto-rows-[8.5rem] grid-cols-2 gap-3 md:auto-rows-[10.5rem] md:grid-cols-4"
          data-stagger
        >
          ${GALERIA_TRAVEL.map(
            (g) => html`
              <li class="reveal-clip overflow-hidden rounded-owa-md ${g.destacada ? 'col-span-2 row-span-2' : ''}">
                ${foto({
                  slug: g.slug,
                  alt: g.alt,
                  sizes: g.destacada ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 25vw, 50vw',
                  className: 'block h-full w-full',
                  imgClass: 'h-full w-full object-cover',
                })}
              </li>
            `
          )}
        </ul>
      </div>
    </section>

    <section class="bg-owa-navy px-0 py-18 text-white">
      <div class="u-shell flex flex-wrap items-center justify-between gap-6">
        <div>
          <p class="font-display text-[clamp(1.5rem,3vw,2.375rem)] leading-none font-black uppercase">
            ¿Te interesa alguna salida?
          </p>
          <p class="mt-2.5 max-w-[52ch] text-[15px] text-owa-line">
            Escribinos y te pasamos el detalle del viaje: itinerario, valores y todo lo que incluye.
          </p>
        </div>
        <div class="flex flex-wrap gap-2.5">
          ${btnPrimario('Consultar por WhatsApp', WA)} ${btnBordeClaro('Escribir por mail', MAIL)}
        </div>
      </div>
    </section>
  `);
}

export function mount(root) {
  montarFondoVideo(root);
  root.querySelectorAll('[data-stagger]').forEach((g) => stagger(g));
}
