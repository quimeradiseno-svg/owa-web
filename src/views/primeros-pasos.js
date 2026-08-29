import { html, raw, toHTML, stagger } from '../lib/html.js';
import { foto } from '../lib/img.js';
import { PUNTUABLES, km } from '../data/eventos.js';
import { MODALIDADES } from '../data/madres.js';
import { tarjetaFecha } from '../components/tarjeta-evento.js';
import {
  HERO,
  INTRO,
  CHECKLIST,
  DUDAS,
  PERFILES,
  HABILIDADES,
  ETAPAS,
  ACOMPANADO,
  KIDS,
  NIVELES_MODALIDAD,
  CIERRE,
  CTA_FINAL,
} from '../data/primeros-pasos.js';
import { icono } from '../components/iconos.js';
import { eyebrow, olaSuperior } from '../components/ui.js';

export const titulo = 'Primeros pasos';

/** Ítem de "De la pileta al agua abierta": ícono, título y texto alineados
    en fila, sin card ni fondo propio — la sección funciona como respiro
    visual frente a las de arriba y abajo, que sí usan cards. */
const itemHabilidad = (h) => html`
  <li class="reveal max-w-[390px]">
    <span class="grid size-10 place-items-center rounded-full bg-owa-mist text-owa-blue">
      ${icono(h.icono, 'size-4.5')}
    </span>
    <p class="mt-3 font-display text-[13px] font-bold tracking-[0.03em] text-owa-navy uppercase">${h.t}</p>
    <p class="mt-1 text-[13px] leading-relaxed text-owa-slate">${raw(h.d)}</p>
  </li>
`;

/** Card de duda. `destacada` la saca del lenguaje de la grilla: borde cian,
    fondo blanco y el ícono en positivo, para la pregunta de asistencia. */
const dudaCard = (i, { destacada = false } = {}) => html`
  <article
    class="reveal flex gap-5 rounded-owa-lg px-6.5 py-5.5 ${destacada
      ? 'mt-4.5 border-2 border-owa-cyan/55 bg-white'
      : 'border border-owa-line bg-owa-mist/30'}"
  >
    <span
      class="grid size-10.5 shrink-0 place-items-center rounded-full ${destacada
        ? 'bg-owa-blue text-white'
        : 'bg-owa-mist text-owa-blue'}"
    >
      ${icono(i.icono, 'size-5')}
    </span>
    <div class="${destacada ? 'max-w-[62rem]' : ''}">
      <p class="font-display text-[1.0625rem] leading-snug font-bold text-owa-navy">“${i.q}”</p>
      <p class="mt-2.5 text-[14px] leading-relaxed text-owa-slate">${raw(i.a)}</p>
    </div>
  </article>
`;

// La distancia más chica del Circuito de cada fecha: es la recomendada para
// una primera experiencia, según el propio criterio del documento de OWA.
function distanciaRecomendada(e) {
  const circuito = e.distancias?.circuito || [];
  return circuito.length ? Math.min(...circuito) : null;
}

export function render() {
  return toHTML(html`
    <!-- --------------------------------------------------------------- hero -->
    <section class="relative bg-owa-navy px-0 pt-18 pb-19 text-white">
      ${olaSuperior('#fff')}
      <div class="u-shell relative">
        ${eyebrow(HERO.kicker, 'sky')}
        <h1 class="mt-4 text-[clamp(2.125rem,4.6vw,4.25rem)] leading-[0.94]">${raw(HERO.titulo)}</h1>
        <p class="mt-5.5 max-w-[56ch] text-[17px] leading-relaxed text-owa-line">${raw(HERO.subtitulo)}</p>
      </div>
    </section>

    <!-- --------------------------------------------------------------- intro -->
    <!-- Titular a la izquierda y el relato a la derecha: las dos columnas
         quedan llenas, y el destacado pasa a una franja a todo el ancho para
         que no sobre aire de un solo lado. -->
    <section class="u-shell py-18" aria-labelledby="h-intro">
      <!-- 42/58 con gap de 64px: las dos columnas se leen como una sola
           unidad editorial y no como dos secciones separadas. -->
      <div class="grid gap-10 lg:grid-cols-[0.72fr_1fr] lg:gap-16">
        <h2 id="h-intro" class="text-[clamp(1.625rem,2.85vw,2.25rem)] leading-[1] text-owa-navy">${INTRO.titulo}</h2>

        <div>
          <p class="font-display text-[clamp(1.25rem,2.2vw,1.875rem)] leading-snug font-bold text-owa-navy">
            ${INTRO.lead}
          </p>
          <p class="mt-5 text-[17px] leading-[1.7] text-owa-slate">${INTRO.dudas}</p>
          <p
            class="mt-9 mb-2 border-l-2 border-owa-cyan pl-5 font-display text-[1.125rem] leading-snug font-black tracking-[0.02em] text-owa-blue uppercase"
          >
            ${INTRO.remate}
          </p>
        </div>
      </div>

      <!-- Tarjeta más angosta que la grilla y con las dos columnas de texto
           equilibradas (34% / resto), para que no quede aire muerto entre el
           bloque destacado y el párrafo. -->
      <div
        class="mt-8 flex flex-col gap-8 rounded-[22px] bg-[#eaf7fa] p-8 sm:flex-row sm:items-start sm:gap-10 sm:px-12 sm:py-[34px]"
      >
        <img src="/brand/owa-iso-cyan.svg" alt="" aria-hidden="true" class="size-13 shrink-0" />

        <span class="hidden w-0.5 shrink-0 self-stretch bg-owa-cyan sm:block sm:h-28" aria-hidden="true"></span>

        <div class="sm:w-[32%] sm:shrink-0">
          <p class="font-display text-[1.0625rem] leading-snug font-black tracking-[0.02em] text-owa-navy uppercase">
            ${INTRO.destacado.fuerte}
          </p>
          <!-- Navy y no azul brillante: la protagonista de la columna es la
               línea de arriba, ésta la acompaña. -->
          <p class="mt-3.5 text-[15px] leading-relaxed text-owa-navy">${INTRO.destacado.suave}</p>
        </div>

        <p class="text-[16px] leading-relaxed text-owa-slate sm:flex-1">${raw(INTRO.cierre)}</p>
      </div>
    </section>

    <!-- ---------------------------------------------------------- checklist -->
    <section class="bg-owa-sand px-0 py-18" aria-labelledby="h-checklist">
      <div class="u-shell">
        <h2 id="h-checklist" class="max-w-[24ch] text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.04] text-owa-navy">
          ${CHECKLIST.titulo}
        </h2>
        <!-- Sin max-width: la bajada entra en una sola línea en desktop. -->
        <p class="mt-4 text-[15px] leading-relaxed text-owa-slate">${CHECKLIST.lead}</p>

        <ul class="mt-7 grid gap-4 sm:grid-cols-2" data-stagger>
          ${CHECKLIST.preguntas.map(
            (p) => html`
              <li class="reveal flex items-center gap-4 rounded-owa-md bg-white p-5 shadow-[var(--shadow-card)]">
                <span class="grid size-9 shrink-0 place-items-center rounded-full bg-owa-mist font-display text-sm font-black text-owa-blue">
                  ?
                </span>
                <span class="text-[15px] leading-snug font-bold text-owa-navy">${p}</span>
              </li>
            `
          )}
        </ul>

        <!-- Cierre de la sección: el mismo bloque icono + regla + destacado del
             intro, pero a lo ancho y con la aclaración al costado. -->
        <div class="reveal mt-6 flex flex-col gap-6 rounded-owa-lg bg-white p-7 sm:flex-row sm:items-center sm:gap-8 sm:p-8">
          <span class="grid size-14 shrink-0 place-items-center rounded-full bg-owa-mist text-owa-blue">
            ${icono('bandera', 'size-6.5')}
          </span>
          <p
            class="font-display text-[15px] leading-snug font-black tracking-[0.02em] text-owa-navy uppercase sm:max-w-[34ch] sm:border-l-2 sm:border-owa-cyan sm:pl-8"
          >
            ${CHECKLIST.destacado}
          </p>
          <div class="grid gap-2 text-[14px] leading-relaxed text-owa-slate sm:flex-1">
            ${CHECKLIST.cierre.map((p) => html`<p>${p}</p>`)}
          </div>
        </div>
      </div>
    </section>

    <!-- --------------------------------------------------------------- dudas -->
    <section class="u-shell py-18" aria-labelledby="h-dudas">
      <h2 id="h-dudas" class="max-w-[22ch] text-[clamp(1.625rem,3.1vw,2.375rem)] leading-[1.04] text-owa-navy">
        ${DUDAS.titulo}
      </h2>
      <p class="mt-2 max-w-[52ch] text-[15px] leading-relaxed text-owa-slate">${DUDAS.lead}</p>

      <div class="mt-8 grid gap-4.5 sm:grid-cols-2" data-stagger>
        ${DUDAS.items.slice(0, 4).map((i) => dudaCard(i))}
      </div>

      <!-- La quinta va aparte y con otro nivel: es la pregunta más sensible
           (asistencia en el agua), no una card que sobró de la grilla. -->
      ${dudaCard(DUDAS.items[4], { destacada: true })}

      <!-- El cierre de seguridad no es otra FAQ: sin caja ni radio, sólo una
           línea que separa y el texto. -->
      <div class="reveal mt-10 flex items-start gap-4 border-t border-owa-line pt-7">
        <span class="shrink-0 text-owa-blue">${icono('escudo', 'size-7')}</span>
        <p class="max-w-[62rem] text-[15px] leading-relaxed text-owa-slate">
          <strong class="font-bold text-owa-navy">${DUDAS.cierre.fuerte}</strong> ${DUDAS.cierre.resto}
        </p>
      </div>
    </section>

    <!-- ------------------------------------------------------------ perfiles -->
    <section class="bg-owa-mist px-0 py-18" aria-labelledby="h-perfiles">
      <div class="u-shell">
        ${eyebrow('Elegí tu punto de partida', 'blue')}
        <h2 id="h-perfiles" class="mt-3.5 u-h2 text-owa-navy">${PERFILES.titulo}</h2>

        <div class="mt-8 grid gap-4.5 sm:grid-cols-2" data-stagger>
          ${PERFILES.items.map(
            (p) => html`
              <article class="reveal flex flex-col rounded-owa-lg bg-white p-7">
                <span class="grid size-11 shrink-0 place-items-center rounded-full bg-owa-mist text-owa-blue">
                  ${icono(p.icono, 'size-5.5')}
                </span>
                <h3 class="mt-4 text-[1.375rem] leading-[1.02] text-owa-navy">${p.t}</h3>
                <p class="mt-1.5 text-[14px] leading-relaxed text-owa-slate">${p.d}</p>

                <div class="mt-5 border-t border-owa-sand pt-5">
                  <p class="font-display text-xs font-black tracking-[0.06em] text-owa-blue uppercase">${p.destino}</p>
                  <p class="mt-2 text-[13px] leading-relaxed text-owa-slate">${p.detalle}</p>
                </div>

                <a
                  href="${p.href}"
                  class="u-nudge u-press mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-owa-blue px-5 py-2.5 font-display text-xs font-black tracking-[0.08em] text-owa-blue uppercase transition-colors duration-200 ease-out hover:bg-owa-blue hover:text-white"
                >
                  ${p.cta}
                  <span class="u-nudge-arrow" aria-hidden="true">→</span>
                </a>
              </article>
            `
          )}
        </div>
      </div>
    </section>

    <!-- --------------------------------------------------------- habilidades -->
    <section class="u-shell py-18" aria-labelledby="h-habilidades">
      <h2 id="h-habilidades" class="max-w-[1000px] text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.04] text-owa-navy">
        ${HABILIDADES.titulo}
      </h2>
      <p class="mt-4.5 max-w-[58ch] text-[15px] leading-relaxed text-owa-slate">${raw(HABILIDADES.lead)}</p>

      <!-- Dos filas de tres, cada una su propia grilla: así el stretch por
           defecto alinea íconos, títulos y textos dentro de cada fila sin
           forzar alturas iguales entre fila 1 y fila 2 (Boya de seguridad y
           Conocer el recorrido son bastante más largos que el resto). Una
           regla apenas visible separa las dos filas, sin caja ni fondo. -->
      <ul class="mt-10 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3" data-stagger>
        ${HABILIDADES.items.slice(0, 3).map((h) => itemHabilidad(h))}
      </ul>
      <div class="my-8 h-px bg-owa-line" aria-hidden="true"></div>
      <ul class="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3" data-stagger>
        ${HABILIDADES.items.slice(3).map((h) => itemHabilidad(h))}
      </ul>
    </section>

    <!-- --------------------------------------------------------------- etapas -->
    <section class="bg-owa-navy px-0 py-18 text-white" aria-labelledby="h-etapas">
      <div class="u-shell">
        ${eyebrow('Qué te vas a encontrar', 'sky')}
        <h2 id="h-etapas" class="mt-3.5 u-h2">${ETAPAS.titulo}</h2>
        <p class="mt-3.5 max-w-[58ch] text-[15px] leading-relaxed text-owa-line">${ETAPAS.lead}</p>

        <ol class="mt-9 grid gap-8 sm:grid-cols-3 sm:gap-6" data-stagger>
          ${ETAPAS.items.map(
            (e, i) => html`
              <li class="reveal border-t border-white/18 pt-5">
                <span data-nums class="font-display text-2xl font-black text-owa-sky">${String(i + 1).padStart(2, '0')}</span>
                <p class="mt-2 text-lg leading-tight font-bold text-white">${e.t}</p>
                <div class="mt-2.5 grid gap-2 text-[14px] leading-relaxed text-owa-line">
                  ${e.d.map((p) => html`<p>${p}</p>`)}
                </div>
              </li>
            `
          )}
        </ol>

        <p class="mt-10 text-center font-display text-[clamp(1.25rem,2.4vw,1.75rem)] leading-snug font-bold text-owa-cyan">
          ${ETAPAS.destacado}
        </p>
      </div>
    </section>

    <!-- ----------------------------------------------------------- acompañado -->
    <section class="u-shell grid items-center gap-12 py-18 lg:grid-cols-2 lg:gap-16" aria-labelledby="h-acompanado">
      <div>
        ${eyebrow(ACOMPANADO.kicker, 'blue')}
        <h2 id="h-acompanado" class="mt-3.5 max-w-[16ch] text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.04] text-owa-navy">
          ${ACOMPANADO.titulo}
        </h2>
        <!-- Cada párrafo con su barra: son cinco ideas sueltas, no un texto
             corrido, y así se leen como una lista sin serlo. -->
        <div class="mt-6 grid gap-4">
          ${ACOMPANADO.parrafos.map(
            (p) => html`<p class="border-l-2 border-owa-sky/50 pl-5 text-[15px] leading-[1.7] text-owa-slate">${raw(p)}</p>`
          )}
        </div>

        <div class="mt-7 flex items-center gap-5 rounded-owa-md bg-owa-mist/50 p-5">
          <span class="grid size-12 shrink-0 place-items-center rounded-full bg-owa-blue text-white">
            ${icono('equipo', 'size-6')}
          </span>
          <p
            class="border-l-2 border-owa-cyan pl-5 font-display text-[15px] leading-snug font-black tracking-[0.02em] text-owa-blue uppercase"
          >
            ${ACOMPANADO.destacado}
          </p>
        </div>
      </div>

      <div class="reveal-clip h-[26rem] overflow-hidden rounded-owa-lg shadow-[var(--shadow-elevated)] lg:h-[34rem]">
        ${foto({
          slug: 'sede-comunidad',
          alt: 'Grupo de nadadores compartiendo un momento junto al agua',
          sizes: '(min-width: 1024px) 50vw, 100vw',
          className: 'block h-full w-full',
          imgClass: 'h-full w-full object-cover',
        })}
      </div>
    </section>

    <!-- ----------------------------------------------------------------- kids -->
    <section class="bg-owa-mist/40 px-0 py-18" aria-labelledby="h-kids">
      <!-- La columna de texto se lleva más ancho que la foto: el titular en
           Vito necesita ~780px para entrar en dos líneas. -->
      <div class="u-shell grid items-center gap-12 lg:grid-cols-[0.68fr_1.32fr] lg:gap-16">
        <div class="reveal-clip h-[22rem] overflow-hidden rounded-owa-lg shadow-[var(--shadow-card)] lg:h-[26rem]">
          ${foto({
            slug: 'pad-infantil',
            alt: 'Jóvenes nadadores con gorra de OWA, listos para entrar al agua',
            sizes: '(min-width: 1024px) 45vw, 100vw',
            className: 'block h-full w-full',
            imgClass: 'h-full w-full object-cover',
          })}
        </div>

        <div>
          ${eyebrow(KIDS.kicker, 'blue')}
          <h2 id="h-kids" class="mt-3.5 text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.04] text-owa-navy">
            ${KIDS.titulo}
          </h2>

          <div class="mt-6 flex flex-wrap gap-3">
            ${KIDS.datos.map(
              (d, i) => html`
                <span
                  class="inline-flex items-center gap-2.5 rounded-full px-4.5 py-2.5 font-display text-[13px] font-bold text-owa-navy ${i === 0
                    ? 'bg-owa-mist'
                    : 'border border-owa-line bg-white'}"
                >
                  <span class="text-owa-blue">${icono(d.icono, 'size-4.5')}</span> ${d.t}
                </span>
              `
            )}
          </div>

          <!-- Los tres ítems encadenados por una línea punteada: se leen como
               pasos de la misma explicación y no como bloques sueltos. -->
          <ul class="mt-7 grid gap-5">
            ${KIDS.items.map(
              (it, i) => html`
                <li class="relative flex gap-5">
                  ${i < KIDS.items.length - 1
                    ? html`<span
                        class="absolute top-12 bottom-[-1.25rem] left-[1.375rem] border-l border-dashed border-owa-sky/60"
                        aria-hidden="true"
                      ></span>`
                    : ''}
                  <span class="relative grid size-11 shrink-0 place-items-center rounded-full bg-owa-mist text-owa-blue">
                    ${icono(it.icono, 'size-5.5')}
                  </span>
                  <p class="pt-2 text-[15px] leading-relaxed text-owa-slate">${raw(it.texto)}</p>
                </li>
              `
            )}
          </ul>
        </div>
      </div>
    </section>

    <!-- ------------------------------------------------------------ modalidades -->
    <section class="bg-owa-navy px-0 py-18 text-white" aria-labelledby="h-modalidades">
      <div class="u-shell">
        ${eyebrow('Cuando quieras seguir descubriendo', 'sky')}
        <h2 id="h-modalidades" class="mt-3.5 u-h2">Cinco formas de vivir<br />las aguas abiertas</h2>

        <div class="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" data-stagger>
          ${MODALIDADES.map(
            (m) => html`
              <a
                href="${m.href}"
                class="reveal u-lift-sm group relative flex min-h-56 flex-col justify-between overflow-hidden rounded-owa-lg border border-white/13 bg-white/6 p-6.5 transition-colors duration-250 ease-out hover:border-owa-cyan/50"
              >
                <div>
                  <span class="grid size-9 shrink-0 place-items-center rounded-full bg-white/10">
                    <img src="${m.iso || '/brand/owa-iso-cyan.svg'}" alt="" class="size-5" aria-hidden="true" />
                  </span>
                  <h3 class="mt-4 text-[1.25rem] leading-[1.02] text-white">${m.titulo}</h3>
                </div>
                <p class="text-[13px] leading-relaxed text-owa-sky">
                  <span class="font-display font-black tracking-[0.03em] text-owa-line uppercase">Nivel recomendado:</span>
                  ${NIVELES_MODALIDAD[m.href]}
                </p>
              </a>
            `
          )}
        </div>
      </div>
    </section>

    <!-- ---------------------------------------------------------------- cierre -->
    <!-- Cierre sobre foto: es el remate emocional de la página, y en plano
         sobre blanco quedaba como un párrafo más. El nadador solitario del
         Challenge es la postal de "hasta dónde podés llegar". -->
    <section class="relative overflow-hidden bg-owa-abyss px-0 py-24 text-white" aria-labelledby="h-cierre">
      <!-- Sin velo plano: la foto se oscurece sólo del lado del texto y se
           abre hacia la derecha, así el agua no compite con las letras.
           El encuadre baja al 78%: centrado, la sección recorta la franja
           media y le cortaba los pies al nadador. Bajándolo entra entero y
           además se ve más agua. -->
      <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
        ${foto({
          slug: 'challenge-lago',
          alt: '',
          sizes: '100vw',
          className: 'block h-full w-full',
          imgClass: 'h-full w-full object-cover object-[50%_78%]',
        })}
      </div>
      <div
        class="absolute inset-0 [background-image:linear-gradient(to_right,rgb(13_16_48/0.9)_0%,rgb(13_16_48/0.65)_50%,rgb(13_16_48/0.4)_100%)]"
      ></div>

      <!-- El bloque azul arranca más abajo y más a la derecha (~56% del ancho)
           para leerse como conclusión del texto, no como una pieza aparte. -->
      <!-- Columna izquierda más angosta entre 1024 y 1280: con 52% el bloque
           azul no tiene ancho para entrar en una/dos líneas a esos tamaños. -->
      <div class="u-shell relative grid gap-12 lg:grid-cols-[46%_1fr] lg:items-start lg:gap-10 xl:grid-cols-[52%_1fr]">
        <div>
          <h2 id="h-cierre" class="text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.02]">${CIERRE.titulo}</h2>
          <div class="mt-8 grid max-w-[470px] gap-5 text-[17px] leading-[1.65] text-owa-line">
            <p>${raw(CIERRE.intro)}</p>
            <p class="font-body text-[1.0625rem] leading-snug font-bold tracking-[0.04em] text-white uppercase">
              ${CIERRE.enfasis}
            </p>
            ${CIERRE.parrafos.map((p) => html`<p>${raw(p)}</p>`)}
          </div>
        </div>

        <div class="grid gap-4 border-l-2 border-owa-cyan pl-6 lg:mt-79">
          <p class="font-display text-[clamp(1.5rem,2.2vw,2rem)] leading-snug font-black tracking-[0.01em] text-white uppercase">
            ${CIERRE.destacados[0]}
          </p>
          <!-- Tope en 34px: por encima de eso la frase no entra en dos líneas
               en el ancho de esta columna. -->
          <p
            class="font-display text-[clamp(1.75rem,2.5vw,2.125rem)] leading-[1.08] font-black tracking-[0.01em] text-owa-cyan uppercase"
          >
            ${CIERRE.destacados[1]}
          </p>
        </div>
      </div>
    </section>

    <!-- -------------------------------------------------------------- cta final -->
    <section id="recomendadas" class="bg-owa-mist px-0 py-20 scroll-mt-24" aria-labelledby="h-cta-final">
      <div class="u-shell">
        <div class="max-w-[52ch]">
          <h2 id="h-cta-final" class="u-h2 text-owa-navy">${CTA_FINAL.titulo}</h2>
          <p class="mt-3.5 text-[15px] leading-relaxed text-owa-slate">${raw(CTA_FINAL.lead)}</p>
        </div>

        <!-- Mismas tarjetas que las páginas madre, las cuatro en fila. La
             sublínea muestra la distancia más accesible de cada fecha, que es
             el dato que importa para una primera experiencia. -->
        <div class="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
          ${PUNTUABLES.map((e, i) => {
            const d = distanciaRecomendada(e);
            return tarjetaFecha(e, {
              orden: `FECHA ${String(i + 1).padStart(2, '0')}`,
              linea: `${e.fechaCorta} ${e.anio}`,
              sublinea: e.sede,
              destacado: d ? `Recomendada: ${km(d)}` : '',
            });
          })}
        </div>
      </div>
    </section>
  `);
}

export function mount(root) {
  root.querySelectorAll('[data-stagger]').forEach((g) => stagger(g));
}
