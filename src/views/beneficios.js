import { html, toHTML, stagger } from '../lib/html.js';
import { porSlug } from '../data/eventos.js';
import { beneficiosDe } from '../data/beneficios.js';
import { eyebrow, olaSuperior, btnAccent } from '../components/ui.js';
import { icono } from '../components/iconos.js';
import { grafo, migas } from '../lib/schema.js';

/* Beneficios de UNA carrera: lo que gana quien se inscribe a esa fecha.
   Es una página por carrera y no una general porque el acuerdo con cada marca
   se cierra fecha por fecha (ver src/data/beneficios.js). */

const carreraDe = (ctx) => porSlug(ctx.params.slug);

export const titulo = (ctx) => {
  const e = carreraDe(ctx);
  return e ? `Beneficios · ${e.nombre}` : 'Beneficios';
};

export const descripcion = (ctx) => {
  const e = carreraDe(ctx);
  if (!e) return '';
  const bs = beneficiosDe(e.slug);
  if (!bs.length) return '';
  // Se arma con los beneficios reales cargados, no con una plantilla. Los de
  // servicio (Endorphin, sin destacado/unidad) van con su título en vez de
  // un número.
  const lista = bs.map((b) => (b.lista ? `${b.titulo} de ${b.marca.nombre}` : `${b.destacado} ${b.unidad} en ${b.marca.nombre}`)).join('. ');
  return `Beneficios para quienes se inscriben a ${e.nombre}: ${lista}.`;
};

// Sin beneficios cargados la página existe (el link directo sigue andando)
// pero no se indexa: no se llega desde ningún lado y no tiene contenido
// propio que ofrecer.
export const noindex = (ctx) => {
  const e = carreraDe(ctx);
  return !e || !beneficiosDe(e.slug).length;
};

export const schema = (ctx) => {
  const e = carreraDe(ctx);
  if (!e) return null;
  return grafo(
    migas([
      ['Calendario', '/calendario'],
      [e.nombre, `/carrera/${e.slug}`],
      ['Beneficios', `/carrera/${e.slug}/beneficios`],
    ])
  );
};

/* ------------------------------------------------------------------ código */

/** El código va en un recuadro aparte y con botón de copiar: es un dato que
    se usa copiándolo en otra web, no leyéndolo. Sin código todavía se dice
    así, en vez de mostrar un placeholder que en vivo se lee como un error. */
const bloqueCodigo = (b) =>
  b.codigo
    ? html`
        <div class="flex flex-wrap items-center gap-3">
          <p class="flex items-center gap-3 rounded-owa-md border border-dashed border-owa-blue/40 bg-owa-mist/60 px-5 py-3.5">
            <span class="text-[10px] font-bold tracking-[0.16em] text-owa-slate uppercase">Código</span>
            <span data-nums class="font-display text-[17px] font-black tracking-[0.14em] text-owa-navy">${b.codigo}</span>
          </p>
          <button
            type="button"
            data-copiar="${b.codigo}"
            class="u-press cursor-pointer rounded-full border-2 border-owa-navy px-5 py-3 font-display text-[12px] font-black tracking-[0.06em] text-owa-navy uppercase transition-colors duration-200 hover:bg-owa-navy hover:text-white"
          >
            Copiar
          </button>
        </div>
      `
    : html`
        <p class="flex items-center gap-3 rounded-owa-md border border-dashed border-owa-line bg-owa-sand px-5 py-3.5">
          <span class="shrink-0 text-owa-slate">${icono('reloj', 'size-4.5')}</span>
          <span class="text-[13px] leading-relaxed text-owa-slate">
            <strong class="font-bold text-owa-navy">El código todavía no está publicado.</strong> Aparece acá apenas OWA
            lo confirme.
          </span>
        </p>
      `;

/* ---------------------------------------------------------------- tarjeta */

const tarjeta = (b) => html`
  <article class="reveal rounded-owa-lg border border-owa-line bg-white p-7 shadow-[var(--shadow-card)] sm:p-9">
    <div class="flex flex-wrap items-start justify-between gap-5">
      <p class="text-[11px] font-bold tracking-[0.16em] text-owa-blue uppercase">${b.etiqueta}</p>
      <!-- El logo de la marca arriba a la derecha: el beneficio es de ella,
           no de OWA, y eso tiene que quedar claro de una. -->
      <a
        href="${b.marca.href}"
        target="_blank"
        rel="noopener noreferrer sponsored"
        class="u-press flex h-9 shrink-0 items-center"
        aria-label="${b.marca.nombre} (se abre en una pestaña nueva)"
      >
        <img src="${b.marca.logoClaro}" alt="${b.marca.nombre}" loading="lazy" decoding="async" class="${b.marca.alto} w-auto object-contain" />
      </a>
    </div>

    <!-- El número es lo que se lee primero, con la unidad al lado y no debajo:
         "20%" solo no dice nada, "20% OFF" sí. -->
    <p class="mt-6 flex items-baseline gap-2.5">
      <span data-nums class="font-display text-[clamp(3rem,8vw,4.5rem)] leading-[0.85] font-black text-owa-blue">${b.destacado}</span>
      <span class="font-display text-[clamp(1.25rem,3vw,1.75rem)] leading-none font-black tracking-[0.04em] text-owa-navy">${b.unidad}</span>
    </p>

    <h2 class="mt-4 font-display text-[clamp(1.125rem,2.2vw,1.5rem)] leading-tight font-black text-owa-navy">${b.titulo}</h2>
    <p class="mt-2 text-[15px] leading-relaxed text-owa-slate">${b.detalle}</p>

    <div class="mt-7 flex flex-wrap items-center gap-4">
      ${bloqueCodigo(b)}
      <a
        href="${b.href}"
        target="_blank"
        rel="noopener noreferrer sponsored"
        class="u-nudge inline-flex items-center gap-2 font-display text-[13px] font-black tracking-[0.08em] text-owa-blue uppercase hover:underline"
      >
        Ir a ${b.marca.nombre} <span class="u-nudge-arrow" aria-hidden="true">↗</span>
      </a>
    </div>
  </article>
`;

/** Variante para beneficios que son un servicio y no un descuento con código
    (hoy sólo Endorphin): en vez del número gigante + botón de copiar, una
    lista de qué incluye y un botón directo de contacto — acá WhatsApp, en
    vez del link "Ir a [marca]" que abre la web de Nexalba/arena. */
const tarjetaServicio = (b) => {
  // El nombre de la marca, resaltado dentro del párrafo: bold y en su propio
  // marrón (el de su isotipo), no el navy/blue del resto del sitio — es la
  // única mención de "Endorphin" en todo el texto corrido y tiene que
  // saltar igual que salta el logo al lado.
  const detalle = b.detalle
    .split(b.marca.nombre)
    .flatMap((parte, i) => (i === 0 ? [parte] : [html`<strong class="font-bold text-[#6b4423]">${b.marca.nombre}</strong>`, parte]));

  return html`
    <article class="reveal flex h-full flex-col rounded-owa-lg border border-owa-line bg-white p-7 shadow-[var(--shadow-card)] sm:p-9">
      <!-- Sin la etiqueta "Beneficio para inscriptos": acá el logo solo ya
           dice de qué es la tarjeta, y sin la etiqueta al lado tiene margen
           para crecer bastante más. Logo y título en la misma fila, no uno
           debajo del otro: el título es corto y entra cómodo al lado. -->
      <div class="flex items-center gap-5">
        <img
          src="${b.marca.logoClaro}"
          alt="${b.marca.nombre}"
          loading="lazy"
          decoding="async"
          class="${b.marca.alto} w-auto shrink-0"
        />
        <h2 class="font-display text-[clamp(1.25rem,2.6vw,1.75rem)] leading-tight font-black text-owa-navy">${b.titulo}</h2>
      </div>
      <p class="mt-3.5 max-w-[62ch] text-[15px] leading-snug text-owa-slate">${detalle}</p>

      <!-- Leading más apretado (leading-none en vez del normal) y menos gap
           entre filas: son cinco frases cortas, de una sola línea, y con el
           interlineado por defecto la lista quedaba más alta de lo que
           necesita — la tarjeta terminaba bastante más abajo que la de
           Nexalba al lado. -->
      <ul class="mt-3.5 grid gap-1.5 sm:grid-cols-2">
        ${b.lista.map(
          (item) => html`
            <li class="flex items-start gap-2.5 text-[14px] leading-none text-owa-navy">
              <span class="mt-1 size-1.5 shrink-0 rounded-full bg-owa-blue" aria-hidden="true"></span>${item}
            </li>
          `
        )}
      </ul>

      <!-- mt-auto: empuja el botón al fondo de la tarjeta en vez de dejarlo
           pegado a la lista, así las dos tarjetas terminan a la misma
           altura (h-full arriba, más el grid que ya iguala la fila). -->
      <div class="mt-auto pt-6">
        ${b.href
          ? html`<a
              href="${b.href}"
              target="_blank"
              rel="noopener noreferrer"
              class="u-nudge inline-flex items-center gap-2 font-display text-[13px] font-black tracking-[0.08em] text-owa-blue uppercase hover:underline"
            >
              Reservar por WhatsApp <span class="u-nudge-arrow" aria-hidden="true">↗</span>
            </a>`
          : html`<p class="flex items-center gap-3 rounded-owa-md border border-dashed border-owa-line bg-owa-sand px-5 py-3.5">
              <span class="shrink-0 text-owa-slate">${icono('reloj', 'size-4.5')}</span>
              <span class="text-[13px] leading-relaxed text-owa-slate">
                <strong class="font-bold text-owa-navy">El contacto todavía no está publicado.</strong> Aparece acá apenas
                OWA lo confirme.
              </span>
            </p>`}
      </div>
    </article>
  `;
};

/* ------------------------------------------------------------------ vista */

export function render(ctx) {
  const e = carreraDe(ctx);

  if (!e)
    return toHTML(html`
      <section class="u-shell py-24">
        <h1 class="text-[clamp(1.875rem,4vw,3rem)] text-owa-navy">Carrera no encontrada</h1>
        <p class="mt-4 max-w-[60ch] text-[15px] leading-relaxed text-owa-slate">
          El enlace no corresponde a ninguna fecha del calendario.
        </p>
        <div class="mt-7">${btnAccent('Ver el calendario', '/calendario')}</div>
      </section>
    `);

  const bs = beneficiosDe(e.slug);

  return toHTML(html`
    <!-- Hero corto: es una página secundaria a la que se llega desde un CTA,
         no una landing propia — no necesita el mismo peso que el hero de la
         ficha de la carrera. -->
    <section class="relative bg-owa-navy px-0 pt-10 pb-12 text-white">
      ${olaSuperior('#fff')}
      <div class="u-shell relative">
        <a
          href="/carrera/${e.slug}"
          class="u-nudge inline-flex items-center gap-2 font-display text-xs font-bold tracking-[0.12em] text-owa-sky transition-colors hover:text-owa-cyan"
        >
          <span class="u-nudge-arrow inline-block rotate-180" aria-hidden="true">→</span> ${e.nombre.toUpperCase()}
        </a>
        <div class="mt-3">${eyebrow(e.sigla, 'sky')}</div>
        <h1 class="mt-2.5 text-[clamp(1.875rem,3.6vw,2.75rem)] leading-[0.95]">Beneficios</h1>
        <p class="mt-3 max-w-[54ch] text-[15px] leading-relaxed text-owa-line">
          <!-- No dice "exclusivo para inscriptos": el código está a la vista de
               cualquiera que abra la página. Si OWA quiere que sea realmente
               exclusivo, hay que mandarlo por mail y acá sólo anunciarlo. -->
          ${bs.length
            ? 'Beneficios propios de esta fecha, para todas las personas inscriptas.'
            : 'Todavía no hay beneficios cargados para esta fecha.'}
        </p>
      </div>
    </section>

    <section class="u-shell py-16" aria-labelledby="h-beneficios">
      <h2 id="h-beneficios" class="sr-only">Beneficios de ${e.nombre}</h2>
      ${bs.length
        ? html`<div class="grid gap-4.5 lg:grid-cols-2" data-stagger>${bs.map((b) => (b.lista ? tarjetaServicio(b) : tarjeta(b)))}</div>`
        : html`
            <p class="rounded-owa-lg border border-dashed border-owa-line px-6 py-14 text-center text-owa-slate">
              Cuando OWA cierre un beneficio para esta carrera, aparece acá.
            </p>
          `}
    </section>
  `);
}

export function mount(root) {
  root.querySelectorAll('[data-stagger]').forEach((g) => stagger(g));

  root.addEventListener('click', async (ev) => {
    const btn = ev.target.closest('[data-copiar]');
    if (!btn) return;
    const original = btn.textContent.trim();
    try {
      await navigator.clipboard.writeText(btn.dataset.copiar);
      btn.textContent = '¡Copiado!';
    } catch {
      // Sin permiso de portapapeles (o sin HTTPS) el código igual está a la
      // vista: se avisa en vez de dejar el botón como si no hubiera pasado nada.
      btn.textContent = 'Copialo a mano';
    }
    setTimeout(() => {
      btn.textContent = original;
    }, 2000);
  });
}
