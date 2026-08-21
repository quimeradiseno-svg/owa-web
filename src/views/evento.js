import { html, raw, toHTML, stagger } from '../lib/html.js';
import { foto, fondo } from '../lib/img.js';
import { porSlug, ESTADOS, linkInscripcion } from '../data/eventos.js';
import { fichaDe } from '../data/fichas.js';
import { carrusel, montarCarruseles } from '../components/carrusel.js';
import { EVENTO_FICHA } from '../data/madres.js';
import { RESULTADOS } from '../data/rankings.js';
import {
  eyebrow,
  chipEstado,
  chipVivo,
  chipModalidad,
  modalidadesDe,
  posicion,
  btnAccent,
  btnBorde,
  btnPrimario,
  pastillaChica,
  pendiente,
} from '../components/ui.js';

export const titulo = (ctx) => porSlug(ctx.params.slug)?.nombre ?? 'Carrera no encontrada';

// Estado de demo: deja ver las tres caras de la misma página.
let raceState = 'proxima';
let demoAbierto = false;

const VUELVE_A = {
  core: ['/grand-prix', 'GRAND PRIX'],
  especial: ['/especiales', 'EVENTOS ESPECIALES'],
  challenge: ['/challenge', 'OWA CHALLENGE'],
};

function distanciasDe(e) {
  if (e.tipo === 'core')
    return [
      { km: 'LARGA', torneo: 'GRAND PRIX', desc: 'Distancia principal del Grand Prix.', cats: 'Élite + edad' },
      { km: 'MEDIA', torneo: 'GRAND PRIX', desc: 'Segunda distancia puntuable del día 1.', cats: 'Por edad' },
      { km: 'CORTA', torneo: 'CIRCUITO OWA', desc: 'Primera carrera en aguas abiertas.', cats: 'Por edad' },
    ];
  if (e.tipo === 'challenge')
    return [{ km: e.km, torneo: 'CHALLENGE', desc: `${e.sede}. Travesía con embarcación de apoyo.`, cats: 'Única' }];
  return [
    { km: 'LARGA', torneo: 'ESPECIAL', desc: 'Distancia principal del evento.', cats: 'Por edad' },
    { km: 'CORTA', torneo: 'ESPECIAL', desc: 'Distancia de participación.', cats: 'Por edad' },
  ];
}

const podios = () =>
  ['1K · CABALLEROS', '1K · DAMAS', '5K · CABALLEROS', '5K · DAMAS'].map((t) => {
    const [dist, genero] = t.split(' · ');
    const src = RESULTADOS.filter((r) => (genero === 'DAMAS' ? r.sexo === 'F' : r.sexo === 'M'));
    return { dist, genero, rows: src.slice(0, 3) };
  });

/* ------------------------------------------------------------- fragmentos */

/** Resumen de una jornada a partir de sus recorridos: qué distancias corre y
    a qué hora larga cada una. Sale de la ficha real, no de un placeholder. */
const resumenJornada = (f, torneo) => {
  const rs = (f?.recorridos || []).filter((r) => r.torneo === torneo);
  const hora = (r) => (r.ficha.find(([k]) => k === 'Horario de largada') || [])[1];
  return {
    distancias: rs.map((r) => r.titulo).join(' · ') || 'A confirmar',
    largada: rs.map(hora).filter(Boolean).join(' · ') || 'A confirmar',
  };
};

/** Datos de la ficha que se muestran arriba, junto a la distancia, en vez de
    en la lista de detalles técnicos. */
const CABECERA_RECORRIDO = ['Fecha', 'Horario de largada'];

/** Cada torneo abre su propio formulario cuando la ficha lo define. */
const inscripcionDe = (e, f, torneo) => f?.inscripcion?.[torneo] || linkInscripcion(e);

const barraDatos = (e, esChallenge, f) => {
  const boton = (extra) =>
    esChallenge
      ? btnPrimario('POSTULARME', 'mailto:info@owa.com.ar?subject=Postulaci%C3%B3n%20' + e.sigla, extra)
      : btnPrimario('INSCRIBITE', linkInscripcion(e), extra);

  return html`
    <!-- Compacta y fija, sólo en mobile: la banda completa de abajo no sigue
         el scroll (pedido explícito, tapaba media pantalla), pero perder de
         vista el botón de inscripción mientras se lee toda la ficha tampoco
         sirve. Esta es la versión mínima — fecha + CTA — para no repetir el
         problema con menos datos. -->
    <div
      class="sticky top-(--nav-h) z-40 flex items-center justify-between gap-3 border-b border-owa-line bg-white px-4 py-2.5 shadow-[0_8px_24px_rgb(33_30_95/0.06)] md:hidden"
    >
      <p class="min-w-0 truncate font-display text-[13px] font-bold text-owa-navy">
        ${e.fechaCorta}${e.anio ? ' ' + e.anio : ''}
      </p>
      ${boton('shrink-0')}
    </div>

    <!-- Bloque normal, no fijo: a pedido explícito, no debe seguir el scroll. -->
    <div class="z-40 border-b border-owa-line bg-white shadow-[0_8px_24px_rgb(33_30_95/0.06)]">
      <div class="u-shell grid grid-cols-2 gap-x-7.5 gap-y-3 py-3.5 md:flex md:flex-wrap md:items-center">
        ${[
          ['FECHA', `${e.fechaCorta}${e.anio ? ' ' + e.anio : ''}`],
          ['SEDE', f?.sedeBarra || e.sede],
          ['MODALIDAD', e.tipo === 'core' ? 'GP + CIRCUITO' : esChallenge ? 'CHALLENGE' : 'ESPECIAL'],
          ['ESTADO', raceState === 'vivo' ? 'EN VIVO' : raceState === 'finalizada' ? 'FINALIZADA' : ESTADOS[e.estado]],
        ].map(
          ([k, v]) => html`
            <div>
              <p class="mb-1 text-[10px] tracking-[0.16em] text-owa-slate">${k}</p>
              <p class="font-display text-[15px] font-bold text-owa-navy">${v}</p>
            </div>
          `
        )}
        <div class="col-span-2 md:ml-auto">${boton('w-full md:w-auto')}</div>
      </div>
    </div>
  `;
};

const bandaVivo = () => html`
  <a
    href="https://cronometrajeinstantaneo.com"
    target="_blank"
    rel="noopener noreferrer"
    class="u-press block bg-owa-live px-0 py-10 text-white transition-colors hover:bg-[#a91b21]"
  >
    <div class="u-shell flex flex-wrap items-center justify-between gap-5.5">
      <div>
        <p class="flex items-center gap-2.5">
          <span class="live-dot size-2.75 rounded-full bg-white"></span>
          <span class="font-display text-[13px] font-black tracking-[0.14em]">EN VIVO</span>
        </p>
        <p class="mt-2.5 font-display text-[clamp(1.625rem,3.2vw,2.625rem)] leading-none font-black uppercase">
          Resultados en vivo
        </p>
        <p class="mt-2.5 text-[15px] text-white/85">
          Cronometraje Instantáneo · se actualiza a medida que pasan por las boyas
        </p>
      </div>
      <span
        class="rounded-full bg-white px-8 py-4.5 font-display text-sm font-black tracking-[0.06em] text-owa-live"
        >ABRIR RESULTADOS EN VIVO →</span
      >
    </div>
  </a>
`;

const jornadas = (e, f) => html`
  <section class="bg-owa-navy px-0 py-19 text-white" aria-labelledby="h-jornadas">
    <div class="u-shell">
      <div>
        ${eyebrow('Dos jornadas, un fin de semana', 'sky')}
        <h2 id="h-jornadas" class="mt-3.5 text-[clamp(1.75rem,3.6vw,2.875rem)] leading-[0.96]">
          Día 1 Grand Prix · Día 2 Circuito
        </h2>
      </div>
      <div class="mt-8.5 grid gap-4.5 md:grid-cols-2" data-stagger>
        ${e.jornadas.map((j) => {
          const gp = j.torneo === 'GRAND PRIX';
          const r = resumenJornada(f, j.torneo);
          return html`
            <article
              class="reveal rounded-owa-lg border p-7 ${gp ? 'border-white/22 bg-white/10' : 'border-white/13 bg-white/5'}"
            >
              <div class="flex flex-wrap items-center justify-between gap-3">
                ${chipModalidad(j.torneo, { oscuro: true })}
                <span class="font-display text-[13px] font-bold tracking-[0.06em] text-owa-line">${j.fecha}</span>
              </div>
              <h3 class="mt-4.5 text-[clamp(1.375rem,2.4vw,1.875rem)] leading-[1.05]">${j.dia}</h3>

              <!-- Las distancias del día, grandes: es lo que se viene a saber
                   acá, y antes competían en tamaño con el resto del texto. -->
              <p
                data-nums
                class="mt-4 font-display text-[clamp(2rem,4.5vw,2.75rem)] leading-[0.9] font-black text-owa-cyan"
              >
                ${r.distancias}
              </p>
              <p class="mt-2 font-display text-[13px] font-bold tracking-[0.06em] text-owa-line">
                Largada <span data-nums class="text-white">${r.largada}</span>
              </p>

              <p class="mt-4 text-sm leading-relaxed text-owa-line">${j.desc}</p>
              <p class="mt-4.5">
                <a
                  href="${inscripcionDe(e, f, j.torneo)}"
                  class="u-press block rounded-full bg-owa-cyan py-3.5 text-center font-display text-xs font-black tracking-[0.06em] text-owa-deep transition-colors hover:bg-owa-sky"
                  >INSCRIBITE A ${j.torneo} →</a
                >
              </p>
            </article>
          `;
        })}
      </div>
    </div>
  </section>
`;

const requisitos = () => html`
  <section class="bg-owa-navy px-0 py-19 text-white" aria-labelledby="h-admision">
    <div class="u-shell grid gap-12 lg:grid-cols-2">
      <div>
        ${eyebrow('Admisión', 'sky')}
        <h2 id="h-admision" class="mt-3.5 text-[clamp(1.625rem,3.4vw,2.625rem)] leading-[0.96]">
          No se inscribe:<br />se postula
        </h2>
        <p class="mt-4 max-w-[58ch] text-base leading-[1.75] text-owa-line">
          Los Challenge son de ultradistancia y tienen cupo limitado. La postulación se hace por mail y la organización
          evalúa antecedentes en aguas abiertas antes de confirmar.
        </p>
        <div class="mt-6.5">
          ${btnAccent('Postularme por mail', 'mailto:info@owa.com.ar?subject=Postulaci%C3%B3n%20OWA%20Challenge')}
        </div>
      </div>
      <div class="rounded-owa-lg border border-white/13 bg-white/6 p-7.5">
        <h3 class="mb-2 font-display text-[17px] font-black">Requisitos</h3>
        <ul>
          ${EVENTO_FICHA.requisitos.map(
            (r) => html`
              <li class="flex gap-3 border-t border-white/12 py-3">
                <span class="font-display font-black text-owa-cyan" aria-hidden="true">·</span>
                <span class="text-sm leading-relaxed text-owa-line">${r}</span>
              </li>
            `
          )}
        </ul>
      </div>
    </div>
  </section>
`;

const resultadosBloque = (e) => {
  if (raceState !== 'finalizada')
    return html`
      <div
        class="flex flex-wrap items-center justify-between gap-5 rounded-owa-lg border border-dashed border-owa-line p-8.5"
      >
        <div class="max-w-[52ch]">
          <h3 class="text-[clamp(1.25rem,2.4vw,1.75rem)] text-owa-navy">Todavía no se corrió</h3>
          <p class="mt-2 text-[15px] text-owa-slate">
            Al cierre de la carrera se publican acá los podios por distancia y género, y la tabla completa en
            Resultados.
          </p>
        </div>
        ${btnBorde('Ir a resultados', '/resultados')}
      </div>
    `;

  return html`
    <div>
      <h3 class="mb-6.5 text-[clamp(1.625rem,3.2vw,2.625rem)] text-owa-navy">Podios de esta edición</h3>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
        ${podios().map(
          (pd) => html`
            <article class="reveal rounded-owa-lg border border-owa-line p-6">
              <div class="flex items-baseline justify-between gap-2.5">
                <h4 class="font-display text-[1.625rem] font-black text-owa-navy">${pd.dist}</h4>
                <span class="text-[11px] tracking-[0.12em] text-owa-slate">${pd.genero}</span>
              </div>
              <ol>
                ${pd.rows.map(
                  (r, i) => html`
                    <li class="grid grid-cols-[1.625rem_1fr_auto] items-center gap-3 border-t border-owa-sand py-3">
                      ${posicion(i + 1)}
                      <span class="truncate font-display text-sm font-bold text-owa-navy">${r.nombre}</span>
                      <span data-nums class="font-display text-[13px] font-black text-owa-slate">${r.tiempo}</span>
                    </li>
                  `
                )}
              </ol>
            </article>
          `
        )}
      </div>
      <div class="mt-6">${btnBorde('Ver tabla completa', '/resultados')}</div>
      ${e.historial
        ? html`
            <div class="mt-6.5 rounded-owa-lg bg-owa-sand p-7.5">
              <h4 class="font-display text-[17px] font-black text-owa-navy">Ganadores históricos · desde 2019</h4>
              <p class="mt-2.5 max-w-[70ch] text-sm leading-relaxed text-owa-slate">
                Siete ediciones de la Vuelta de Obligado con sus ganadores por distancia y género. Datos a cargar con el
                archivo histórico de OWA.
              </p>
            </div>
          `
        : ''}
    </div>
  `;
};

/* ----------------------------------------------------------------- vista */

export function render(ctx) {
  const e = porSlug(ctx.params.slug);
  if (!e) return '<div class="u-shell py-40"><h1>Carrera no encontrada</h1></div>';

  const esChallenge = e.tipo === 'challenge';
  const [volverHref, volverLabel] = VUELVE_A[e.tipo];
  const f = fichaDe(e.slug);

  return toHTML(html`
    <section class="relative flex min-h-[66svh] items-end overflow-hidden bg-owa-abyss">
      ${fondo({ slug: e.img, alt: '', opacity: 0.7, priority: true })}
      <div class="u-hero-scrim-sm absolute inset-0"></div>

      <div class="u-shell relative pt-28 pb-15 text-white">
        <a
          href="${volverHref}"
          class="u-nudge inline-flex items-center gap-2 font-display text-xs font-bold tracking-[0.12em] text-owa-sky transition-colors hover:text-owa-cyan"
        >
          <span class="u-nudge-arrow inline-block rotate-180" aria-hidden="true">→</span> ${volverLabel}
        </a>

        <p class="mt-6.5 flex flex-wrap items-center gap-2.5">
          <span
            class="rounded-md border border-white/30 px-2.25 py-1 font-display text-[11px] font-black tracking-[0.14em] text-owa-line"
            >${e.sigla}</span
          >
          ${modalidadesDe(e, { oscuro: true })}
          ${raceState === 'vivo' ? chipVivo() : chipEstado(raceState === 'finalizada' ? 'cerrada' : e.estado, { oscuro: true })}
        </p>

        <h1 class="mt-5 text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.88]">${e.nombre}</h1>
        <p class="mt-5 font-display text-[clamp(0.875rem,1.6vw,1.1875rem)] font-bold tracking-[0.08em] text-owa-sky">
          ${e.fechaLarga} · ${f?.sedeCiudad || e.sede}
        </p>
      </div>
    </section>

    ${barraDatos(e, esChallenge, f)} ${raceState === 'vivo' ? bandaVivo() : ''}
    ${e.tipo === 'core' ? jornadas(e, f) : esChallenge ? requisitos() : ''}

    <!-- distancias -->
    <section class="u-shell pt-20 pb-10" aria-labelledby="h-distancias">
      <h2 id="h-distancias" class="u-eyebrow text-owa-blue">Distancias y categorías</h2>
      ${f?.distancias
        ? html`
            <ul class="mt-5.5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-stagger>
              ${f.distancias.map(
                (d) => html`
                  <!-- El número manda: es el dato que se busca primero. Debajo,
                       en orden, torneo → puntaje → categorías, sin que ninguna
                       línea chica compita con la distancia. -->
                  <li
                    class="reveal u-lift-sm flex flex-col rounded-owa-lg border border-owa-line p-6 transition-shadow duration-250 ease-out hover:shadow-[var(--shadow-elevated)]"
                  >
                    <p class="font-display text-[12px] font-black tracking-[0.14em] text-owa-slate uppercase">
                      ${d.rotulo}
                    </p>
                    <p
                      data-nums
                      class="mt-1.5 font-display text-[clamp(3rem,6vw,4rem)] leading-[0.85] font-black text-owa-navy"
                    >
                      ${d.km}
                    </p>
                    ${d.torneo
                      ? html`<p class="mt-2.5 font-display text-[12px] font-black tracking-[0.1em] text-owa-blue">
                          ${d.torneo}
                        </p>`
                      : ''}
                    ${d.nota ? html`<p class="mt-2.5 text-[13px] leading-relaxed text-owa-slate">${d.nota}</p>` : ''}
                    <div class="mt-auto space-y-1.5 pt-5">
                      ${d.puntaje
                        ? html`<p class="flex flex-wrap justify-between gap-x-4 border-t border-owa-sand pt-2.5 text-[13px]">
                            <span class="text-owa-slate">Puntaje</span>
                            <span class="font-display font-bold text-owa-navy">${d.puntaje}</span>
                          </p>`
                        : ''}
                      <p class="flex flex-wrap justify-between gap-x-4 border-t border-owa-sand pt-2.5 text-[13px]">
                        <span class="text-owa-slate">Categorías</span>
                        <span class="font-display font-bold text-owa-navy">${d.cats}</span>
                      </p>
                    </div>
                  </li>
                `
              )}
            </ul>
          `
        : html`
            <div class="mt-5.5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-stagger>
              ${distanciasDe(e).map(
                (d) => html`
                  <article
                    class="reveal u-lift-sm rounded-owa-lg border border-owa-line p-6.5 transition-shadow duration-250 ease-out hover:shadow-[var(--shadow-elevated)]"
                  >
                    <p class="font-display text-[2.875rem] leading-[0.9] font-black text-owa-navy">${d.km}</p>
                    <p class="mt-2.5 text-xs tracking-[0.1em] text-owa-blue">${d.torneo}</p>
                    <p class="mt-2.5 text-[13px] leading-relaxed text-owa-slate">${d.desc}</p>
                    <p class="mt-5.5 flex justify-between border-t border-owa-sand pt-3.5 text-[13px]">
                      <span class="text-owa-slate">Categorías</span>
                      <span class="font-display font-bold text-owa-navy">${d.cats}</span>
                    </p>
                  </article>
                `
              )}
            </div>
            ${pendiente('Distancias, horarios y valores de inscripción: pendientes de confirmación por OWA.')}
          `}
    </section>

    <!-- recorridos: un bloque por distancia, con sus láminas y su ficha -->
    ${f?.recorridos
      ? html`
          <section class="u-shell pt-10 pb-20" aria-labelledby="h-recorridos">
            <h2 id="h-recorridos" class="u-eyebrow text-owa-blue">Recorridos y fichas técnicas</h2>
            <div class="mt-6 grid gap-5">
              ${f.recorridos.map((r) => {
                const dato = (k) => (r.ficha.find(([kk]) => kk === k) || [])[1];
                // Fecha y hora suben al encabezado: son el segundo dato que se
                // busca después de la distancia. El resto queda en la ficha.
                const resto = r.ficha.filter(([k]) => !CABECERA_RECORRIDO.includes(k));

                return html`
                  <article class="overflow-hidden rounded-owa-lg border border-owa-line">
                    <div
                      class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-owa-line px-6 py-4"
                    >
                      <div class="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                        ${chipModalidad(r.torneo)}
                        <h3
                          data-nums
                          class="font-display text-[clamp(1.875rem,4vw,2.75rem)] leading-none font-black text-owa-navy"
                        >
                          ${r.titulo}
                        </h3>
                      </div>
                      <p data-nums class="font-display text-[13px] font-bold text-owa-slate">
                        ${dato('Fecha')} · <span class="text-owa-blue">${dato('Horario de largada')}</span>
                      </p>
                    </div>

                    <!-- Mapa y datos en paralelo: apilados, cada recorrido se
                         comía una pantalla entera y eran tres seguidos. -->
                    <div class="grid lg:grid-cols-[1.4fr_1fr]">
                      <div class="reveal-clip flex items-center overflow-hidden bg-owa-mist lg:border-r lg:border-owa-line">
                        ${carrusel(r.id, r.mapas, { sizes: '(min-width: 1024px) 700px, 100vw' })}
                      </div>
                      <dl class="px-6 py-3">
                        ${resto.map(
                          ([k, v]) => html`
                            <div class="flex flex-wrap justify-between gap-x-5 gap-y-0.5 border-b border-owa-sand py-2 last:border-b-0">
                              <dt class="text-[13px] text-owa-slate">${k}</dt>
                              <dd class="font-display text-[13px] font-bold text-owa-navy">${v}</dd>
                            </div>
                          `
                        )}
                      </dl>
                    </div>
                  </article>
                `;
              })}
            </div>
          </section>
        `
      : html`
          <section class="u-shell pt-10 pb-20" aria-labelledby="h-recorrido">
            ${eyebrow('Recorrido')}
            <h2 id="h-recorrido" class="mt-3.5 text-[clamp(1.625rem,3.2vw,2.625rem)]">Recorrido ${e.corto}</h2>
            <div class="mt-5.5 grid h-105 place-items-center rounded-owa-lg bg-owa-mist">
              <div class="max-w-[34ch] px-6 text-center">
                <img src="/brand/owa-iso-cyan.svg" alt="" width="44" height="46" class="mx-auto h-11 w-auto opacity-60" />
                <p class="mt-4 font-display text-base font-black text-owa-navy">Mapa del recorrido</p>
                <p class="mt-2 text-sm text-owa-slate">
                  Pendiente del export del track de ${e.sedeCorta.toLowerCase()} por parte de la organización.
                </p>
              </div>
            </div>
          </section>
        `}

    <!-- cronograma -->
    <section class="bg-owa-navy px-0 py-19 text-white" aria-labelledby="h-cronograma">
      <div class="u-shell">
        <h2 id="h-cronograma" class="u-eyebrow text-owa-sky">Cronograma del evento</h2>
        ${f?.cronogramas
          ? html`
              <div class="mt-6.5 grid gap-x-10 gap-y-8 lg:grid-cols-2">
                ${f.cronogramas.map(
                  (c) => html`
                    <div>
                      <div class="flex flex-wrap items-center gap-3">
                        ${chipModalidad(c.torneo, { oscuro: true })}
                        ${c.aviso ? html`<p class="text-[13px] text-owa-line">${c.aviso}</p>` : ''}
                      </div>
                      ${c.dias.map(
                        (dia) => html`
                          <div class="mt-7">
                            <p class="font-display text-[15px] font-black text-white uppercase">${dia.fecha}</p>
                            <p class="mt-1 text-[13px] text-owa-line/80">${dia.lugar}</p>
                            <ol class="mt-4">
                              ${dia.items.map(
                                (i) => html`
                                  <li class="flex gap-4 border-t border-white/12 py-2.5">
                                    <span
                                      data-nums
                                      class="w-22 shrink-0 font-display text-[13px] font-black ${i.destacado
                                        ? 'text-owa-cyan'
                                        : 'text-owa-sky'}"
                                      >${i.hora}</span
                                    >
                                    <span class="min-w-0">
                                      ${i.zona
                                        ? html`<span
                                            class="block text-[10px] tracking-[0.14em] text-owa-line/70 uppercase"
                                            >${i.zona}</span
                                          >`
                                        : ''}
                                      <span class="block font-display text-sm font-bold ${i.zona ? 'mt-1' : ''}"
                                        >${i.t}</span
                                      >
                                      ${i.d
                                        ? html`<span class="mt-1 block text-[13px] text-owa-line/85">${i.d}</span>`
                                        : ''}
                                    </span>
                                  </li>
                                `
                              )}
                            </ol>
                          </div>
                        `
                      )}
                    </div>
                  `
                )}
              </div>
            `
          : html`
              <ol class="mt-6.5 grid gap-y-9 sm:grid-cols-2 lg:grid-cols-5" data-stagger>
                ${EVENTO_FICHA.cronograma.map(
                  (c) => html`
                    <li class="reveal relative pr-4.5">
                      <div class="relative mb-5.5 h-0.5 bg-white/18">
                        <span
                          class="absolute left-0 rounded-full ${c.destacado
                            ? '-top-2.25 size-5 border-4 border-owa-cyan bg-white'
                            : '-top-1.75 size-4 bg-owa-cyan'}"
                        ></span>
                      </div>
                      <p data-nums class="font-display text-[1.5625rem] font-black text-owa-cyan">${c.hora}</p>
                      <p class="mt-2 font-display text-[15px] font-bold uppercase">${c.titulo}</p>
                      <p class="mt-1.5 text-[13px] leading-normal text-owa-line/80">${c.detalle}</p>
                    </li>
                  `
                )}
              </ol>
            `}
      </div>
    </section>

    <!-- reglamento + kit -->
    <div class="u-shell grid gap-4.5 pt-20 lg:grid-cols-2">
      <section class="rounded-owa-lg bg-owa-mist p-8" aria-labelledby="h-reglamento">
        ${eyebrow('Reglamento', 'blue')}
        <h2 id="h-reglamento" class="mt-3.5 text-[clamp(1.375rem,2.6vw,1.875rem)] text-owa-navy">
          Lo que hay que saber antes de largar
        </h2>
        <p class="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-owa-slate">
          Neoprene, categorías, cortes de tiempo, causales de descalificación y protocolo de seguridad en el agua.
        </p>
        <!-- Todos los reglamentos viven en un solo lugar, no un PDF suelto por
             carrera: el general, el deportivo de cada torneo y los anexos. -->
        <div class="mt-6">${btnPrimario('Ver reglamentos', '/reglamentos')}</div>
      </section>

      <section class="rounded-owa-lg border border-owa-line p-8" aria-labelledby="h-kit">
        ${eyebrow('Kit del nadador')}
        <h2 id="h-kit" class="mt-3.5 text-[clamp(1.375rem,2.6vw,1.875rem)] text-owa-navy">Qué te llevás</h2>
        ${f?.kit
          ? html`
              <ul class="mt-4.5">
                ${f.kit.map(
                  (k) => html`
                    <li class="border-t border-owa-sand py-3 text-sm text-owa-navy">
                      ${k.t}${k.nota ? html`<span class="align-super text-[11px] text-owa-slate">*</span>` : ''}
                    </li>
                  `
                )}
              </ul>
              ${f.kitNota ? html`<p class="mt-3.5 text-[12px] text-owa-slate">* ${f.kitNota}</p>` : ''}
            `
          : html`
              <dl class="mt-4.5">
                ${EVENTO_FICHA.kit.map(
                  (k) => html`
                    <div class="flex justify-between gap-3.5 border-t border-owa-sand py-3">
                      <dt class="text-sm text-owa-slate">${k.t}</dt>
                      <dd class="text-right font-display text-[13px] font-bold text-owa-navy">${k.d}</dd>
                    </div>
                  `
                )}
              </dl>
            `}
      </section>
    </div>

    <!-- logística -->
    <section class="u-shell pt-15 pb-20" aria-labelledby="h-logistica">
      <h2 id="h-logistica" class="u-eyebrow text-owa-blue">Logística</h2>
      <div class="mt-5.5 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
        ${EVENTO_FICHA.logistica.map(
          (i) => html`
            <article class="reveal u-lift-sm rounded-owa-lg bg-owa-sand p-6.5">
              <h3 class="font-display text-[17px] font-black text-owa-navy">${i.t}</h3>
              <p class="mt-2.5 text-sm leading-relaxed text-owa-slate">${i.d}</p>
              <p class="mt-4 text-xs tracking-[0.08em] text-owa-blue">${i.cta} →</p>
            </article>
          `
        )}
      </div>
    </section>

    <!-- resultados -->
    <section class="u-shell py-20" aria-labelledby="h-resultados">
      <h2 id="h-resultados" class="u-eyebrow mb-5.5 text-owa-blue">Resultados</h2>
      ${resultadosBloque(e)}
    </section>

    <!-- cta final -->
    <section class="bg-owa-blue px-0 py-18 text-white">
      <div class="u-shell flex flex-wrap items-center justify-between gap-6">
        <div>
          <p class="font-display text-[clamp(1.625rem,3.4vw,2.75rem)] leading-none font-black uppercase">
            ${esChallenge ? 'Postulate a este desafío' : `Nos vemos en ${e.sedeCorta}`}
          </p>
          <p class="mt-2.5 text-[15px] text-white/80">
            ${esChallenge
              ? 'La organización responde cada postulación por mail.'
              : 'La inscripción se completa en la plataforma externa de OWA.'}
          </p>
        </div>
        ${esChallenge
          ? btnAccent('Postularme', 'mailto:info@owa.com.ar?subject=Postulaci%C3%B3n%20' + e.sigla)
          : btnAccent('Inscribite', linkInscripcion(e))}
      </div>
    </section>

    <!-- Control de demo: deja ver las tres caras de la misma ficha sin tocar
         datos. Arranca plegado para no taparle contenido a quien revisa. -->
    <details
      data-demo
      ${raw(demoAbierto ? 'open' : '')}
      class="fixed bottom-4 left-4 z-90 max-w-[calc(100vw-2rem)] rounded-owa-md border border-white/16 bg-owa-abyss/94 text-white shadow-[0_16px_44px_rgb(0_0_0/0.3)] backdrop-blur-lg"
    >
      <summary
        class="u-press flex cursor-pointer list-none items-center gap-2 px-4 py-2.5 font-display text-[10px] font-black tracking-[0.14em] text-owa-sky"
      >
        <span class="size-1.5 rounded-full bg-owa-cyan" aria-hidden="true"></span>
        ESTADO DE CARRERA · DEMO
      </summary>
      <div class="flex flex-wrap gap-1.5 border-t border-white/12 px-3 pt-2.5 pb-3">
        ${[
          ['PRÓXIMA', 'proxima'],
          ['EN VIVO', 'vivo'],
          ['FINALIZADA', 'finalizada'],
        ].map(([label, v]) => pastillaChica(label, raceState === v, `data-estado="${v}"`, { oscuro: true }))}
      </div>
    </details>
  `);
}

export function mount(root, ctx) {
  root.querySelectorAll('[data-stagger]').forEach((g) => stagger(g));
  montarCarruseles(root);

  root.querySelector('[data-demo]')?.addEventListener('toggle', (e) => {
    demoAbierto = e.target.open;
  });

  root.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-estado]');
    if (!btn || btn.dataset.estado === raceState) return;
    raceState = btn.dataset.estado;
    const y = window.scrollY;
    const nuevo = document.createElement('div');
    nuevo.innerHTML = render(ctx);
    nuevo.querySelectorAll('.reveal, .reveal-clip').forEach((el) => el.setAttribute('data-visible', ''));
    root.replaceWith(nuevo);
    mount(nuevo, ctx);
    window.scrollTo(0, y);
  });
}
