import { html } from '../lib/html.js';
import { foto } from '../lib/img.js';
import { modalidadesDe, chipEstado } from './ui.js';

/** "14 Y 15 NOV" -> { dia: "14–15", mes: "NOV 2026" } */
export function fechaBadge(e) {
  const nums = e.fechaCorta.match(/\d+/g) || [];
  const mes = (e.fechaCorta.match(/[A-ZÁÉÍÓÚ]{3,}$/) || [''])[0];
  const dia = nums.length > 1 ? `${nums[0]}–${nums.at(-1)}` : nums[0] || '—';
  return { dia, mes: mes ? `${mes} ${e.anio}` : e.anio || 'A CONFIRMAR' };
}

const ALT = {
  core: (e) => `Nadadores en competencia en ${e.sedeCorta.toLowerCase()}`,
  especial: (e) => `Escenario del evento especial en ${e.sedeCorta.toLowerCase()}`,
  challenge: (e) => `Travesía de ultradistancia: ${e.sede}`,
};

/** Tarjeta grande de carrera. Se usa en Home y en las páginas madre. */
export function tarjetaEvento(e, { sizes = '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw' } = {}) {
  const { dia, mes } = fechaBadge(e);
  const abierta = e.estado === 'abierta';

  return html`
    <a
      href="/carrera/${e.slug}"
      class="reveal u-lift group flex min-h-[27rem] flex-col overflow-hidden rounded-owa-lg bg-linear-to-b from-owa-navy to-owa-abyss text-white"
    >
      <div class="relative h-53 shrink-0 overflow-hidden u-pico-ola">
        ${foto({
          slug: e.img,
          alt: ALT[e.tipo](e),
          sizes,
          className: 'block h-full w-full',
          imgClass: 'h-full w-full object-cover',
        })}
        <div class="absolute inset-0 bg-linear-to-b from-owa-abyss/10 to-owa-abyss/45"></div>
        <p
          class="absolute top-0 left-0 flex flex-col items-center rounded-br-[20px] bg-owa-cyan px-5 pt-3.5 pb-3 text-center leading-none text-owa-deep"
        >
          <span data-nums class="font-display text-[2rem] font-black tracking-[-0.02em]">${dia}</span>
          <span class="mt-1.5 font-display text-[10px] font-bold tracking-[0.18em]">${mes}</span>
        </p>
      </div>

      <div class="flex flex-1 flex-col p-5.5 pt-3.5">
        <span
          class="self-start rounded-full border px-3.5 py-1.5 font-display text-[10px] font-black tracking-[0.12em] ${abierta
            ? 'border-owa-sky/70 text-owa-sky'
            : 'border-white/28 text-owa-line'}"
          >${abierta ? 'INSCRIPCIÓN ABIERTA' : 'PRÓXIMAMENTE'}</span
        >
        <p class="mt-3 font-display text-[11px] font-bold tracking-[0.2em] text-owa-sky">${e.sigla}</p>
        <h3 class="mt-2 text-[clamp(1.625rem,2.6vw,2.125rem)] leading-[0.94]">${e.corto}</h3>
        <p class="mt-2.5 text-[13px] text-owa-line">${e.sede}</p>
        <p class="mt-4 mb-7 flex flex-wrap gap-1.5">${modalidadesDe(e, { oscuro: true })}</p>

        <span class="mt-auto flex items-center justify-between gap-2.5 border-t border-white/18 pt-5.5">
          <span class="font-display text-xs font-black tracking-[0.08em]">VER DETALLES</span>
          <span
            class="grid size-7.5 place-items-center rounded-full bg-owa-cyan text-sm text-owa-deep transition-transform duration-200 ease-out group-hover:translate-x-1"
            aria-hidden="true"
            >→</span
          >
        </span>
      </div>
    </a>
  `;
}

/** Tarjeta de Challenge: no hay fecha cerrada, así que el dato que manda es la
    distancia y debajo la ventana (o la condición de cupo, como en SNP). */
export function tarjetaChallenge(e) {
  return html`
    <a
      href="/carrera/${e.slug}"
      class="reveal u-lift group flex flex-col overflow-hidden rounded-owa-lg bg-linear-to-b from-owa-navy to-owa-abyss text-white"
    >
      <div class="relative h-44 shrink-0 overflow-hidden u-pico-ola-derecha">
        ${foto({
          slug: e.img,
          alt: ALT.challenge(e),
          sizes: '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
          className: 'block h-full w-full',
          imgClass: 'h-full w-full object-cover',
        })}
        <div class="absolute inset-0 bg-linear-to-b from-owa-abyss/0 to-owa-abyss/58"></div>
        <h3 class="absolute bottom-4 left-5.5 text-[clamp(2.25rem,4.2vw,3rem)] leading-[0.9]">${e.corto}</h3>
      </div>

      <div class="flex flex-1 flex-col p-5.5">
        <p class="flex items-baseline gap-1.5">
          <span data-nums class="font-display text-2xl leading-none font-black text-owa-cyan">${e.km.replace(' km', '')}</span>
          <span class="font-display text-[11px] font-bold tracking-[0.14em] text-owa-sky">KM</span>
        </p>
        <p class="mt-2.5 text-[15px] font-bold text-white">${e.sede}</p>
        <p class="mt-1 font-display text-sm font-black tracking-[0.02em] text-owa-sky">${e.ventana}</p>

        <span class="mt-6 flex items-center justify-between gap-2.5 border-t border-white/18 pt-5">
          <span class="font-display text-xs font-black tracking-[0.08em]">VER DETALLES</span>
          <span
            class="grid size-7.5 place-items-center rounded-full bg-owa-cyan text-sm text-owa-deep transition-transform duration-200 ease-out group-hover:translate-x-1"
            aria-hidden="true"
            >→</span
          >
        </span>
      </div>
    </a>
  `;
}

/** Tarjeta de OWA Travel: es un viaje, no una carrera — manda el destino. */
export function tarjetaTravel(t) {
  const porConfirmar = t.estado !== 'abierta';
  return html`
    <a
      href="/travel"
      class="reveal u-lift-sm group grid overflow-hidden rounded-owa-lg border border-owa-line bg-white transition-shadow duration-250 ease-out hover:shadow-[var(--shadow-elevated)] sm:grid-cols-2"
    >
      <div class="relative h-52 sm:h-full sm:min-h-58 sm:-mr-4 sm:u-horizonte">
        ${foto({
          slug: t.img,
          alt: porConfirmar ? '' : `Nadadores en ${t.destino}`,
          sizes: '(min-width: 640px) 25vw, 100vw',
          className: 'block h-full w-full',
          imgClass: 'h-full w-full object-cover',
        })}
        <p
          class="absolute top-0 left-0 rounded-br-[20px] bg-owa-cyan px-4.5 py-2.5 font-display text-[11px] font-black tracking-[0.14em] text-owa-deep"
        >
          ${t.fechaCorta}
        </p>
      </div>

      <div class="flex flex-col p-6.5">
        <h3 class="text-[clamp(1.5rem,2.4vw,2rem)] leading-[0.98] text-owa-navy">${t.destino}</h3>
        <p class="mt-2 font-display text-[11px] font-bold tracking-[0.16em] text-owa-blue">${t.titulo}</p>
        <p class="mt-3.5 text-[13px] leading-relaxed text-owa-slate">${t.resumen}</p>
        <p
          class="mt-auto flex items-center gap-2 pt-5 font-display text-xs font-black tracking-[0.08em] text-owa-blue"
        >
          <!-- /travel explica el programa, no el itinerario de cada salida: el
               detalle lo manda la organización por mail o WhatsApp. -->
          ${porConfirmar ? 'PEDIR INFORMACIÓN' : 'CONOCER OWA TRAVEL'}
          <span class="transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
        </p>
      </div>
    </a>
  `;
}

/** Tarjeta chica para las listas de fechas de las páginas madre.
    `estado` se puede apagar donde el chip no aporta: en Challenge no hay fecha
    de inscripción, así que "PRÓXIMAMENTE" sólo agregaría ruido. */
export function tarjetaFecha(e, { orden, linea, sublinea, estado = true }) {
  return html`
    <a
      href="/carrera/${e.slug}"
      class="reveal u-lift-sm group overflow-hidden rounded-owa-lg border border-owa-line bg-white transition-shadow duration-250 ease-out hover:shadow-[var(--shadow-elevated)]"
    >
      <div class="relative h-35 bg-owa-abyss">
        ${foto({
          slug: e.img,
          alt: ALT[e.tipo](e),
          sizes: '(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw',
          className: 'block h-full w-full',
          imgClass: 'h-full w-full object-cover',
        })}
        <div class="absolute inset-0 bg-linear-to-b from-owa-abyss/10 to-owa-abyss/80"></div>
        <div class="absolute bottom-3.5 left-4.5 text-white">
          <p class="font-display text-[11px] font-bold tracking-[0.16em] text-owa-sky">${orden}</p>
          <h3 class="mt-1.5 text-xl leading-none">${e.corto}</h3>
        </div>
      </div>
      <div class="p-5">
        ${estado ? chipEstado(e.estado) : ''}
        <p class="${estado ? 'mt-3' : ''} font-display text-base font-black text-owa-navy">${linea}</p>
        <p class="mt-1.5 text-[13px] text-owa-slate">${sublinea}</p>
        <p
          class="mt-4 flex items-center gap-2 border-t border-owa-sand pt-3.5 font-display text-xs font-bold tracking-[0.08em] text-owa-blue"
        >
          VER DETALLES
          <span class="transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
        </p>
      </div>
    </a>
  `;
}

/** Tarjeta grande a toda foto para Eventos Especiales: sin panel de texto
    aparte, el título y la bajada se leen directo sobre la imagen. */
export function tarjetaEspecial(e) {
  return html`
    <a
      href="/carrera/${e.slug}"
      data-sobre-foto
      class="reveal u-lift-sm group relative block aspect-[2/1] overflow-hidden rounded-owa-lg"
    >
      ${foto({
        slug: e.img,
        alt: ALT.especial(e),
        sizes: '(min-width: 640px) 50vw, 100vw',
        className: 'block h-full w-full',
        imgClass: 'h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105',
      })}
      <div class="absolute inset-0 bg-linear-to-t from-owa-abyss/90 via-owa-abyss/5 to-transparent"></div>
      <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6.5 sm:p-7.5">
        <div>
          <p class="font-display text-xs font-bold tracking-[0.14em] text-owa-sky">${e.sigla}</p>
          <h3 class="mt-1.5 text-[clamp(1.625rem,3vw,2.5rem)] leading-[0.95] text-white">${e.corto}</h3>
          <p class="mt-2 font-display text-xs font-bold tracking-[0.14em] text-owa-line uppercase">${e.fechaCorta} ${e.anio}</p>
        </div>
        <span
          class="grid size-11 shrink-0 place-items-center rounded-full border border-white/40 text-white transition-colors duration-200 ease-out group-hover:border-owa-cyan group-hover:bg-owa-cyan group-hover:text-owa-deep"
          aria-hidden="true"
          >→</span
        >
      </div>
    </a>
  `;
}
