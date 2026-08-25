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
  btnBlanco,
  pastillaChica,
  pendiente,
} from '../components/ui.js';
import { icono } from '../components/iconos.js';

export const titulo = (ctx) => porSlug(ctx.params.slug)?.nombre ?? 'Carrera no encontrada';

// Estado de demo: deja ver las tres caras de la misma página.
let raceState = 'proxima';
let demoAbierto = false;

// Tab de "Elegí tu distancia": qué recorrido está activo. No se resetea por
// carrera — el render cae al primer recorrido si el id no existe acá.
let recorridoActivo = null;

// Tab del cronograma: qué día está activo (índice sobre diasDeCronograma()).
let cronogramaActivo = 0;

// "Entre 23 y 26 °C, sin visibilidad, corriente a favor" -> "A favor". Es el
// único dato de corriente que hay: no vale la pena duplicarlo como campo
// aparte en fichas.js cuando ya vive adentro de "Condiciones del agua".
const corrienteDe = (r) => {
  const agua = (r.ficha.find(([k]) => k === 'Condiciones del agua') || [])[1] || '';
  if (/en contra/i.test(agua)) return 'En contra';
  if (/a favor/i.test(agua)) return 'A favor';
  return 'Variable';
};

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
    a qué hora larga cada una. Sale de la ficha real, no de un placeholder.
    Las distancias salen de `f.distancias` (no de `f.recorridos`) porque ahí
    también vive la arena Super Sprint, que no tiene mapa/ficha propia. */
const resumenJornada = (f, torneo) => {
  const ds = (f?.distancias || []).filter((d) => d.torneo === torneo);
  const rs = (f?.recorridos || []).filter((r) => r.torneo === torneo);
  const hora = (r) => (r.ficha.find(([k]) => k === 'Horario de largada') || [])[1];
  return {
    distancias: (ds.length ? ds.map((d) => d.km) : rs.map((r) => r.titulo)).join(' · ') || 'A confirmar',
    largada: rs.map(hora).filter(Boolean).join(' · ') || 'A confirmar',
  };
};

const MES_CORTO = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

/** 14/11/2026 → 14 NOV 26. Los datos vienen en formato numérico; en la tarjeta
    el mes escrito se lee de un vistazo y no se confunde con el día. */
const fechaCorta = (f) => {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(f).trim());
  return m ? `${+m[1]} ${MES_CORTO[+m[2] - 1]} ${m[3].slice(2)}` : f;
};

const MESES_LARGO = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

/** "Sábado 14 de noviembre de 2026" → "14 NOV 26". Misma idea que fechaCorta
    pero para el campo "Fecha" de la ficha, que viene en texto largo. */
const fechaCortaDesdeLarga = (f) => {
  const m = /(\d{1,2}) de (\p{L}+) de (\d{4})/iu.exec(String(f));
  if (!m) return f;
  const mes = MESES_LARGO.indexOf(m[2].toLowerCase());
  return mes === -1 ? f : `${+m[1]} ${MES_CORTO[mes]} ${m[3].slice(2)}`;
};

/** 14/11/2026 → "14 de noviembre", para la cinta de fecha estilo Instagram
    (mes escrito entero, sin año — igual que el material de difusión). */
const fechaRibbon = (f) => {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(f).trim());
  return m ? `${+m[1]} de ${MESES_LARGO[+m[2] - 1]}` : f;
};

/** "Viernes 13 de noviembre" → "VIERNES 13 NOV". Para la pestaña del día. */
const diaCorto = (f) => {
  const m = /^(\p{L}+) (\d{1,2}) de (\p{L}+)/iu.exec(String(f));
  if (!m) return f;
  const mes = MESES_LARGO.indexOf(m[3].toLowerCase());
  return mes === -1 ? f : `${m[1]} ${m[2]} ${MES_CORTO[mes]}`;
};

/** El cronograma real llega partido por torneo (Grand Prix / Circuito), pero
    el sábado ambos comparten la fecha: la entrega de kits del Circuito cae
    el mismo día que la carrera del Grand Prix. Acá se reagrupa por fecha real
    — cada pestaña es "un día en San Pedro", con un bloque por torneo que
    tenga algo ese día, en vez de dos columnas fijas por torneo. */
function diasDeCronograma(cronogramas) {
  const porFecha = new Map();
  for (const c of cronogramas) {
    for (const dia of c.dias) {
      if (!porFecha.has(dia.fecha)) porFecha.set(dia.fecha, { fecha: dia.fecha, bloques: [] });
      porFecha.get(dia.fecha).bloques.push({ torneo: c.torneo, lugar: dia.lugar, aviso: c.aviso, items: dia.items });
    }
  }
  return [...porFecha.values()];
}

/** Cada torneo abre su propio formulario cuando la ficha lo define. */
const inscripcionDe = (e, f, torneo) => f?.inscripcion?.[torneo] || linkInscripcion(e);

const barraDatos = (e, esChallenge, f) => {
  const boton = (extra) =>
    esChallenge
      ? btnPrimario('POSTULARME', 'mailto:info@owa.com.ar?subject=Postulaci%C3%B3n%20' + e.sigla, extra)
      : btnPrimario('INSCRIBITE', linkInscripcion(e), extra);

  return html`
    <!-- Bloque normal, no fijo en ningún ancho: a pedido explícito, no debe
         seguir el scroll. Hubo una versión compacta sticky sólo para mobile,
         pero al descartarse el sticky en general quedaba como un duplicado
         de esta misma info sin ningún propósito — se saca directamente. -->
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
  <section class="bg-owa-navy px-0 py-20 text-white" aria-labelledby="h-jornadas">
    <div class="u-shell">
      ${eyebrow('Dos jornadas, un fin de semana', 'sky')}
      <h2 id="h-jornadas" class="mt-3.5 u-h2">Días del evento</h2>

      <!-- EXPERIMENTO — estilo "afiche de Instagram": cinta de fecha, sigla
           gigante, bajada y pastillas de dato, en vez de la jerarquía
           torneo→distancia de antes. Sin subir. -->
      <div class="mt-9 grid gap-5 lg:grid-cols-2" data-stagger>
        ${e.jornadas.map((j) => {
          const gp = j.torneo === 'GRAND PRIX';
          // Kid no lleva `torneo: 'CIRCUITO OWA'` en los datos (es la única
          // sin puntaje, aparte de las competitivas) pero corre el domingo
          // de Circuito igual, así que se suma a mano acá.
          const distanciasTorneo = (f?.distancias || []).filter((d) => d.torneo === j.torneo || (!gp && d.rotulo === 'Kid'));
          const puntajeGP = distanciasTorneo[0]?.puntaje?.split(' · ')[1];
          const recorridoGP = f?.recorridos?.find((r) => r.torneo === 'GRAND PRIX');

          return html`
            <a
              href="${inscripcionDe(e, f, j.torneo)}"
              class="reveal u-lift group block rounded-owa-lg bg-linear-to-br from-owa-sky via-white/85 to-owa-blue p-px"
            >
              <div class="relative flex min-h-[34rem] flex-col overflow-hidden rounded-[27px]">
                <div class="absolute inset-0" aria-hidden="true">
                  ${foto({
                    slug: gp ? 'gp-contraluz' : 'circuito-grupo',
                    alt: '',
                    sizes: '(min-width: 1024px) 50vw, 100vw',
                    className: 'block h-full w-full',
                    imgClass: 'h-full w-full object-cover',
                  })}
                  <div class="absolute inset-0 bg-linear-to-b from-transparent via-owa-abyss/55 to-owa-abyss/97"></div>
                </div>

                <div class="relative z-10 flex flex-1 flex-col p-8 sm:p-10">
                <div class="flex items-start justify-between gap-4">
                  <p
                    class="inline-flex items-center gap-2 rounded-full bg-owa-cyan px-4 py-2 font-display text-[13px] font-black tracking-[0.06em] text-owa-deep uppercase"
                  >
                    ${fechaRibbon(j.fecha)}
                  </p>
                  <img
                    src="/brand/owa-${gp ? 'grandprix' : 'circuito'}-s.svg"
                    alt="${j.torneo}"
                    class="mt-1 h-8 w-auto shrink-0 opacity-90 sm:h-9"
                  />
                </div>

                <p data-nums class="mt-6 font-display text-[clamp(4rem,9vw,6rem)] leading-[0.82] font-black text-owa-cyan uppercase">
                  ${j.sigla}
                </p>
                <p class="mt-1.5 font-display text-sm font-black tracking-[0.16em] text-white uppercase">${j.nombreLargo}</p>

                <p class="mt-6 max-w-[26ch] font-display text-[clamp(1.375rem,2.4vw,1.75rem)] leading-tight font-black text-white uppercase">
                  ${raw(j.tagline)}
                </p>

                <div class="mt-5 h-px w-10 bg-white/30" aria-hidden="true"></div>

                <div class="mt-5 flex flex-wrap items-center gap-2.5">
                  ${gp
                    ? puntajeGP
                      ? html`<span class="inline-flex items-center gap-2 font-display text-[13px] font-black tracking-[0.02em] text-owa-sky uppercase">
                          ${icono('trofeo', 'size-4.5')} <span data-nums>${puntajeGP}</span> en juego</span
                        >`
                      : ''
                    : distanciasTorneo.map((d, i) => {
                        const etiqueta = d.rotulo === 'arena Super Sprint' ? `Super Sprint ${d.km}` : d.rotulo === 'Kid' ? `Kid ${d.km}` : d.km;
                        return html`
                          <span
                            class="rounded-full px-3.5 py-1.5 font-display text-[12px] font-black tracking-[0.04em] uppercase ${i < 2
                              ? 'bg-owa-cyan text-owa-deep'
                              : 'border border-white/30 text-white'}"
                            >${etiqueta}</span
                          >
                        `;
                      })}
                </div>

                <div class="mt-auto pt-8">
                  <p class="flex items-center gap-2 text-[13px] text-owa-line">
                    ${icono('pin', 'size-4 shrink-0 text-owa-sky')}
                    ${gp && recorridoGP ? `${recorridoGP.largada}, San Pedro` : f?.sedeBarra || j.desc}
                  </p>
                  <span
                    class="u-press mt-4 block rounded-full bg-owa-cyan py-4 text-center font-display text-[13px] font-black tracking-[0.06em] text-owa-deep transition-colors group-hover:bg-owa-sky"
                    >INSCRIBITE A ${j.torneo} →</span
                  >
                </div>
              </div>
              </div>
            </a>
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

// Sólo se llama con raceState === 'finalizada' (ver render): antes de
// correrse la carrera esta sección no se muestra.
const resultadosBloque = (e) => {
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

        <h1 class="mt-5 text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.88]">
          ${e.nombre}${e.slug === 'san-pedro'
            ? html`<span
                class="ml-4 align-middle font-display text-[clamp(1.25rem,2.6vw,2rem)] font-bold tracking-[0.04em] text-owa-line/80 normal-case"
                >by arena</span
              >`
            : ''}
        </h1>
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
            <!-- Cinco distancias, una sola fila desde xl: las tres que puntúan
                 (Larga/Media/Corta) van en columnas más anchas y con la
                 tarjeta completa; Kid y Super Sprint —participativa una,
                 por invitación la otra, ninguna suma al ranking— quedan en
                 columnas más angostas y con menos jerarquía tipográfica, así
                 la diferencia se lee de un vistazo y no hay que leer la letra
                 chica para saber cuáles son "las carreras". -->
            <ul
              class="mt-5.5 grid grid-cols-2 gap-3.5 sm:grid-cols-3 xl:grid-cols-[1.15fr_1.15fr_1.15fr_0.85fr_0.85fr] xl:gap-3"
              data-stagger
            >
              ${f.distancias.map((d) => {
                const principal = ['Larga', 'Media', 'Corta'].includes(d.rotulo);
                return html`
                  <li
                    class="reveal u-lift-sm flex flex-col rounded-owa-lg border transition-shadow duration-250 ease-out hover:shadow-[var(--shadow-elevated)] ${principal
                      ? 'border-owa-line p-6'
                      : 'border-dashed border-owa-line bg-owa-sand/50 p-4.5'}"
                  >
                    <p class="font-display text-[10px] font-bold tracking-[0.16em] text-owa-slate/75 uppercase">${d.rotulo}</p>
                    <p
                      data-nums
                      class="mt-1.5 font-display font-black text-owa-navy ${principal
                        ? 'text-[clamp(2.5rem,4.5vw,3.5rem)] leading-[0.85]'
                        : 'text-[clamp(1.5rem,2.4vw,1.875rem)] leading-none'}"
                    >
                      ${d.km}
                    </p>
                    ${d.torneo
                      ? html`<p class="mt-2 font-display text-xs font-black tracking-[0.06em] text-owa-blue">${d.torneo}</p>`
                      : html`<p class="mt-2 font-display text-xs font-black tracking-[0.06em] text-owa-slate">CIRCUITO OWA</p>`}
                    ${principal
                      ? html`
                          ${d.nota ? html`<p class="mt-2.5 text-[13px] leading-relaxed text-owa-slate">${d.nota}</p>` : ''}
                          <div class="mt-auto space-y-2 pt-5">
                            ${d.puntaje
                              ? html`<p class="flex flex-wrap items-baseline justify-between gap-x-4 border-t border-owa-sand pt-2.5">
                                  <span class="text-[11px] text-owa-slate/80">Puntaje</span>
                                  <span class="font-display text-sm font-black text-owa-navy">${d.puntaje}</span>
                                </p>`
                              : ''}
                            <p class="flex flex-wrap items-baseline justify-between gap-x-4 border-t border-owa-sand pt-2.5">
                              <span class="text-[11px] text-owa-slate/80">Categorías</span>
                              <span class="font-display text-sm font-black text-owa-navy">${d.cats}</span>
                            </p>
                          </div>
                        `
                      : html`
                          <p class="mt-auto pt-4 text-[12px] leading-relaxed text-owa-slate">${d.nota || d.cats}</p>
                        `}
                  </li>
                `;
              })}
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

    <!-- recorridos: una sola sección, todas las distancias como tabs. Cada
         tab lleva el torneo como subtítulo (Grand Prix / Circuito OWA) para
         que nunca haga falta adivinar a qué competencia pertenece un mapa. -->
    ${f?.recorridos
      ? (() => {
          const activoId = f.recorridos.find((x) => x.id === recorridoActivo)?.id || f.recorridos[0].id;
          const activo = f.recorridos.find((x) => x.id === activoId);
          const nombreTorneo = (t) => (t === 'GRAND PRIX' ? 'Grand Prix' : 'Circuito OWA');
          const siglaTorneo = (t) => e.jornadas?.find((j) => j.torneo === t)?.sigla || '';

          // La fecha de la arena Super Sprint no está cargada aparte: corre el
          // mismo día que el resto del Circuito, así que se toma de ahí.
          const fechaDelTorneo = (torneo) => {
            const conFicha = f.recorridos.find((x) => x.torneo === torneo && x.ficha);
            return conFicha ? fechaCortaDesdeLarga((conFicha.ficha.find(([k]) => k === 'Fecha') || [])[1]) : '';
          };

          // Sin mapa ni ficha técnica todavía (la arena Super Sprint): misma
          // cabecera que el resto, pero con lo poco que sí hay en vez de
          // fabricar horarios o condiciones que nadie cargó.
          const panelSinMapa = (r) => html`
            <div class="reveal mt-6 overflow-hidden rounded-owa-lg border border-owa-line" data-visible>
              <div class="grid lg:grid-cols-[1.5fr_1fr]">
                <div class="flex min-h-64 items-center justify-center bg-owa-mist p-8 lg:border-r lg:border-owa-line">
                  <div class="max-w-[30ch] text-center">
                    <img src="/brand/owa-iso-cyan.svg" alt="" width="44" height="46" class="mx-auto h-11 w-auto opacity-60" />
                    <p class="mt-4 font-display text-base font-black text-owa-navy">Mapa del recorrido</p>
                    <p class="mt-2 text-sm text-owa-slate">Pendiente del track de la organización.</p>
                  </div>
                </div>
                <div class="flex flex-col p-6.5">
                  <div class="flex flex-wrap items-center justify-between gap-3">
                    ${chipModalidad(r.torneo, { oscuro: false })}
                    <p data-nums class="rounded-full bg-owa-blue px-3.5 py-1.5 font-display text-[13px] font-black tracking-[0.04em] text-white">
                      ${fechaDelTorneo(r.torneo)}
                    </p>
                  </div>
                  <h3 class="mt-2.5 font-display text-2xl font-black text-owa-navy">${r.titulo}</h3>
                  <p class="mt-1 text-sm font-bold text-owa-slate">${r.cats}</p>
                  <p class="mt-3 text-[13px] leading-relaxed text-owa-slate">${r.nota}</p>
                </div>
              </div>
            </div>
          `;

          const dato_ = (nombreIcono, etiqueta, valor) => html`
            <div class="flex items-center gap-2.5 px-4 py-3.5">
              ${icono(nombreIcono, 'size-4.5 shrink-0 text-owa-blue')}
              <span class="min-w-0">
                <span class="block font-display text-[10px] font-bold tracking-[0.1em] text-owa-slate uppercase">${etiqueta}</span>
                <span class="block truncate text-[13px] font-bold text-owa-navy">${valor}</span>
              </span>
            </div>
          `;

          // Mapa + ficha técnica + franja de datos, para un recorrido puntual.
          // Antes vivía una sola vez arriba del render; ahora se llama dos
          // veces (una por torneo), así que queda como función.
          const panelRecorrido = (r) => {
            const dato = (k) => (r.ficha.find(([kk]) => kk === k) || [])[1];
            const puntaje = r.ficha.find(([k]) => k.startsWith('Puntaje'));

            const filaResumen = (nombreIcono, etiqueta, valor) =>
              valor
                ? html`
                    <div class="flex items-center justify-between gap-3 border-b border-owa-sand py-2.5 last:border-b-0">
                      <dt class="flex items-center gap-2 text-[13px] text-owa-slate">
                        ${icono(nombreIcono, 'size-4 text-owa-blue')} ${etiqueta}
                      </dt>
                      <dd data-nums class="font-display text-[13px] font-bold text-owa-navy">${valor}</dd>
                    </div>
                  `
                : '';

            // Requisitos y premiación son párrafos, no un dato corto: van
            // apilados en vez de en la misma fila con el rótulo.
            const filaLarga = (nombreIcono, etiqueta, valor) =>
              valor
                ? html`
                    <div class="border-b border-owa-sand py-2.5 last:border-b-0">
                      <dt class="flex items-center gap-2 text-[13px] text-owa-slate">
                        ${icono(nombreIcono, 'size-4 text-owa-blue')} ${etiqueta}
                      </dt>
                      <dd class="mt-1.5 text-[13px] leading-relaxed font-bold text-owa-navy">${valor}</dd>
                    </div>
                  `
                : '';

            return html`
              <div class="reveal mt-6 overflow-hidden rounded-owa-lg border border-owa-line" data-visible>
                <div class="grid lg:grid-cols-[1.5fr_1fr]">
                  <div class="reveal-clip flex overflow-hidden bg-owa-mist lg:border-r lg:border-owa-line" data-visible>
                    ${carrusel(r.id, r.mapas, { sizes: '(min-width: 1024px) 60vw, 100vw' })}
                  </div>
                  <div class="flex flex-col p-6.5">
                    <!-- Con las tres distancias mezcladas en un solo tabbar,
                         el torneo tiene que quedar dicho acá — es la única
                         pista de a qué competencia pertenece este mapa. -->
                    <div class="flex flex-wrap items-center justify-between gap-3">
                      ${chipModalidad(r.torneo, { oscuro: false })}
                      <p data-nums class="rounded-full bg-owa-blue px-3.5 py-1.5 font-display text-[13px] font-black tracking-[0.04em] text-white">
                        ${fechaDelTorneo(r.torneo)}
                      </p>
                    </div>
                    <h3 class="mt-2.5 font-display text-2xl font-black text-owa-navy">${r.titulo}</h3>
                    <p class="mt-1 text-sm font-bold text-owa-slate">Punto a punto</p>
                    <p class="mt-3 text-[13px] leading-relaxed text-owa-slate">
                      Recorrido punto a punto sobre el río Paraná, desde ${r.largada} hasta ${r.llegada}.
                    </p>

                    <!-- Sin repetir lo que ya está en la franja de abajo (largada,
                         llegada, distancia, tiempo estimado, corriente): acá va
                         el resto de la ficha técnica. -->
                    <dl class="mt-5 border-t border-owa-sand">
                      ${filaResumen('gota', 'Neopreno', dato('Uso de neopreno'))}
                      ${filaResumen('equipo', 'Cupo', dato('Cupos disponibles'))}
                      ${filaResumen('reloj', 'Tiempo límite', dato('Tiempo límite'))}
                      ${filaResumen('trofeo', 'Puntaje OWA', puntaje?.[1])}
                      ${filaLarga('documento', 'Requisitos', dato('Requisitos'))}
                      ${filaLarga('podio', 'Premiación', dato('Premiación'))}
                      ${filaLarga('podio', 'Premiación con neopreno', dato('Premiación con neopreno'))}
                    </dl>
                  </div>
                </div>

                <div class="grid grid-cols-2 divide-x divide-y divide-owa-sand border-t border-owa-line bg-owa-sand/40 sm:grid-cols-5 sm:divide-y-0">
                  ${dato_('pin', 'Largada', r.largada)} ${dato_('bandera', 'Llegada', r.llegada)}
                  ${dato_('ondas', 'Distancia', r.titulo)} ${dato_('reloj', 'Tiempo estimado', dato('Tiempo estimado'))}
                  ${dato_('ola', 'Corriente', corrienteDe(r))}
                </div>
              </div>
            `;
          };

          return html`
            <section class="u-shell pt-10 pb-20" aria-labelledby="h-recorridos">
              ${eyebrow('Recorridos')}
              <h2 id="h-recorridos" class="mt-3.5 text-[clamp(1.625rem,3.2vw,2.625rem)]">Elegí tu distancia</h2>

              <div class="mt-6 flex flex-wrap gap-2.5" role="tablist" aria-label="Distancia">
                ${f.recorridos.map(
                  (x) => html`
                    <button
                      type="button"
                      role="tab"
                      data-recorrido-tab="${x.id}"
                      aria-selected="${x.id === activoId ? 'true' : 'false'}"
                      class="u-press flex flex-col items-start gap-0.5 rounded-owa-md border px-4.5 py-2.5 text-left transition-colors duration-200 ${x.id ===
                      activoId
                        ? 'border-owa-blue bg-owa-blue text-white'
                        : 'border-owa-line text-owa-navy hover:border-owa-blue/50'}"
                    >
                      <span class="font-display text-sm font-black">${x.titulo}</span>
                      <span class="text-[11px] font-bold tracking-[0.04em] uppercase ${x.id === activoId ? 'text-owa-line' : 'text-owa-slate'}">
                        <span class="${x.id === activoId ? 'text-owa-cyan' : 'text-owa-blue'}">${siglaTorneo(x.torneo)}</span> ·
                        ${nombreTorneo(x.torneo)}</span
                      >
                    </button>
                  `
                )}
              </div>

              ${activo.mapas?.length ? panelRecorrido(activo) : panelSinMapa(activo)}
            </section>
          `;
        })()
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

    <!-- reglamento + kit -->
    <section class="bg-owa-navy px-0 py-19 text-white" aria-labelledby="h-reglamento">
      <div class="u-shell grid gap-4.5 lg:grid-cols-2">
        <div class="reveal rounded-owa-lg border border-white/13 bg-white/6 p-8" data-visible>
          ${eyebrow('Reglamento', 'sky')}
          <h2 id="h-reglamento" class="mt-3.5 text-[clamp(1.375rem,2.6vw,1.875rem)] text-white">
            Lo que hay que saber antes de largar
          </h2>
          <p class="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-owa-line">
            Neoprene, categorías, cortes de tiempo, causales de descalificación y protocolo de seguridad en el agua.
          </p>
          <!-- Todos los reglamentos viven en un solo lugar, no un PDF suelto por
               carrera: el general, el deportivo de cada torneo y los anexos. -->
          <div class="mt-6">${btnBlanco('Ver reglamentos', '/reglamentos')}</div>
        </div>

        <div class="reveal rounded-owa-lg border border-white/13 bg-white/6 p-8" data-visible>
          ${eyebrow('Kit del nadador', 'sky')}
          <h2 id="h-kit" class="mt-3.5 text-[clamp(1.375rem,2.6vw,1.875rem)] text-white">Qué te llevás</h2>
          ${f?.kit
            ? html`
                <ul class="mt-4.5">
                  ${f.kit.map(
                    (k) => html`
                      <li class="border-t border-white/12 py-3 text-sm text-white">
                        ${k.t}${k.nota ? html`<span class="align-super text-[11px] text-owa-line">*</span>` : ''}
                      </li>
                    `
                  )}
                </ul>
                ${f.kitNota ? html`<p class="mt-3.5 text-[12px] text-owa-line">* ${f.kitNota}</p>` : ''}
              `
            : html`
                <dl class="mt-4.5">
                  ${EVENTO_FICHA.kit.map(
                    (k) => html`
                      <div class="flex justify-between gap-3.5 border-t border-white/12 py-3">
                        <dt class="text-sm text-owa-line">${k.t}</dt>
                        <dd class="text-right font-display text-[13px] font-bold text-white">${k.d}</dd>
                      </div>
                    `
                  )}
                </dl>
              `}
        </div>
      </div>
    </section>

    <!-- cronograma -->
    <section class="bg-owa-mist px-0 py-20" aria-labelledby="h-cronograma">
      <div class="u-shell">
        ${eyebrow('Minuto a minuto')}
        <h2 id="h-cronograma" class="mt-3.5 text-[clamp(1.625rem,3.2vw,2.625rem)] text-owa-navy">Cronograma del evento</h2>
        ${f?.cronogramas
          ? (() => {
              const dias = diasDeCronograma(f.cronogramas);
              const activo = dias[cronogramaActivo] || dias[0];
              const nombreTorneoOWA = (t) => (t === 'GRAND PRIX' ? 'Grand Prix OWA' : 'Circuito OWA');
              // Si alguno de los bloques del día es "el" día de carrera de su
              // torneo, ese torneo manda el subtítulo (aunque ese mismo día
              // también reciba kits de otro torneo, como el sábado). Si no,
              // el día es puramente logístico y el subtítulo es el lugar.
              const subtitulo = (d) => {
                const principal = d.bloques.find((b) => b.lugar === 'Día del evento') || d.bloques[0];
                return principal.lugar === 'Día del evento' ? nombreTorneoOWA(principal.torneo) : principal.lugar;
              };

              return html`
                <div class="mt-6.5 flex flex-wrap gap-2.5" role="tablist" aria-label="Día del cronograma">
                  ${dias.map(
                    (d, i) => html`
                      <button
                        type="button"
                        data-cron-tab="${i}"
                        aria-pressed="${d === activo ? 'true' : 'false'}"
                        class="u-press flex items-center gap-3 rounded-owa-md border px-5 py-3.5 text-left transition-colors duration-200 ease-out ${d ===
                        activo
                          ? 'border-owa-cyan bg-owa-cyan text-owa-deep'
                          : 'border-owa-line bg-white text-owa-navy hover:bg-owa-sand'}"
                      >
                        ${icono('calendario', 'size-5.5 shrink-0')}
                        <span>
                          <span class="block font-display text-[13px] leading-tight font-black tracking-[0.03em] uppercase"
                            >${diaCorto(d.fecha)}</span
                          >
                          <span class="mt-0.5 block text-[13px] font-bold leading-tight ${d === activo ? 'text-owa-deep' : 'text-owa-slate'}"
                            >${subtitulo(d)}</span
                          >
                        </span>
                      </button>
                    `
                  )}
                </div>

                <div class="reveal mt-5 overflow-hidden rounded-owa-lg bg-white text-owa-navy shadow-[var(--shadow-card)]" data-visible>
                  ${activo.bloques.map(
                    (b, i) => html`
                      <div class="${i > 0 ? 'border-t border-owa-sand' : ''}">
                        ${activo.bloques.length > 1
                          ? html`
                              <div class="flex flex-wrap items-center gap-3 px-6.5 pt-6">
                                ${chipModalidad(b.torneo, { oscuro: false })}
                                <p class="text-[13px] text-owa-slate">${b.lugar}</p>
                              </div>
                            `
                          : b.aviso
                            ? html`<p class="px-6.5 pt-6 text-[13px] text-owa-slate">${b.aviso}</p>`
                            : ''}
                        ${(() => {
                          const filaCron = (it, idx, total) => html`
                            <li class="flex gap-4 px-6.5 ${it.destacado ? 'py-4' : 'py-3'}">
                              <!-- Línea vertical armada en dos mitades por fila (arriba/abajo del
                                   punto): así queda continua entre filas sin medir alturas a mano,
                                   y se corta sola en el primer y último ítem de su columna. -->
                              <div class="relative flex w-3 shrink-0 justify-center">
                                ${idx > 0
                                  ? html`<span class="absolute top-0 left-1/2 h-1/2 w-px -translate-x-1/2 bg-owa-line"></span>`
                                  : ''}
                                ${idx < total - 1
                                  ? html`<span class="absolute bottom-0 left-1/2 h-1/2 w-px -translate-x-1/2 bg-owa-line"></span>`
                                  : ''}
                                <span
                                  class="relative z-10 mt-1.5 shrink-0 rounded-full ${it.destacado
                                    ? 'size-3.5 bg-owa-cyan ring-4 ring-owa-cyan/20'
                                    : 'size-2.5 border-2 border-white bg-owa-slate/40'}"
                                ></span>
                              </div>
                              <span
                                data-nums
                                class="shrink-0 pt-0.5 font-display font-black ${it.destacado
                                  ? 'w-16 text-base text-owa-blue'
                                  : 'w-14 text-[13px] text-owa-slate'}"
                                >${it.hora}</span
                              >
                              <span class="min-w-0 flex-1 pb-0.5">
                                ${it.zona && !it.destacado
                                  ? html`<span class="block text-[10px] tracking-[0.12em] text-owa-slate/80 uppercase">${it.zona}</span>`
                                  : ''}
                                <span
                                  class="block font-display ${it.destacado
                                    ? 'text-base font-black text-owa-navy'
                                    : `text-sm font-bold text-owa-navy ${it.zona ? 'mt-0.5' : ''}`}"
                                  >${it.t}</span
                                >
                                ${it.d && !it.destacado
                                  ? html`<span class="mt-0.5 block text-[13px] text-owa-slate">${it.d}</span>`
                                  : ''}
                              </span>
                            </li>
                          `;

                          // Un cronograma largo (12 ítems del Circuito, por ejemplo) se vuelve
                          // interminable en desktop en una sola columna. A partir de 7 ítems se
                          // reparte en dos — en mobile los <ol> igual quedan uno debajo del otro,
                          // así que ahí se sigue leyendo como una lista corrida.
                          if (b.items.length > 6) {
                            const mitad = Math.ceil(b.items.length / 2);
                            const col1 = b.items.slice(0, mitad);
                            const col2 = b.items.slice(mitad);
                            return html`
                              <div class="${activo.bloques.length > 1 ? 'mt-3' : 'mt-2'} grid pb-3 lg:grid-cols-2">
                                <ol>${col1.map((it, idx) => filaCron(it, idx, col1.length))}</ol>
                                <ol class="lg:border-l lg:border-owa-sand">${col2.map((it, idx) => filaCron(it, idx, col2.length))}</ol>
                              </div>
                            `;
                          }
                          return html`
                            <ol class="${activo.bloques.length > 1 ? 'mt-3' : 'mt-2'} pb-3">
                              ${b.items.map((it, idx) => filaCron(it, idx, b.items.length))}
                            </ol>
                          `;
                        })()}
                      </div>
                    `
                  )}
                </div>
              `;
            })()
          : html`
              <ol class="mt-6.5 grid gap-y-9 sm:grid-cols-2 lg:grid-cols-5" data-stagger>
                ${EVENTO_FICHA.cronograma.map(
                  (c) => html`
                    <li class="reveal relative pr-4.5">
                      <div class="relative mb-5.5 h-0.5 bg-owa-line">
                        <span
                          class="absolute left-0 rounded-full ${c.destacado
                            ? '-top-2.25 size-5 border-4 border-owa-cyan bg-white'
                            : '-top-1.75 size-4 bg-owa-cyan'}"
                        ></span>
                      </div>
                      <p data-nums class="font-display text-[1.5625rem] font-black text-owa-blue">${c.hora}</p>
                      <p class="mt-2 font-display text-[15px] font-bold text-owa-navy uppercase">${c.titulo}</p>
                      <p class="mt-1.5 text-[13px] leading-normal text-owa-slate">${c.detalle}</p>
                    </li>
                  `
                )}
              </ol>
            `}
      </div>
    </section>

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

    <!-- resultados: sólo una vez que hay podio real que mostrar. Antes de
         correrse no suma nada acá — ya está el link a Resultados en el nav. -->
    ${raceState === 'finalizada'
      ? html`
          <section class="u-shell py-20" aria-labelledby="h-resultados">
            <h2 id="h-resultados" class="u-eyebrow mb-5.5 text-owa-blue">Resultados</h2>
            ${resultadosBloque(e)}
          </section>
        `
      : ''}

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

  const repintar = () => {
    const y = window.scrollY;
    const nuevo = document.createElement('div');
    nuevo.innerHTML = render(ctx);
    nuevo.querySelectorAll('.reveal, .reveal-clip').forEach((el) => el.setAttribute('data-visible', ''));
    root.replaceWith(nuevo);
    mount(nuevo, ctx);
    window.scrollTo(0, y);
  };

  root.addEventListener('click', (e) => {
    const estadoBtn = e.target.closest('[data-estado]');
    if (estadoBtn && estadoBtn.dataset.estado !== raceState) {
      raceState = estadoBtn.dataset.estado;
      return repintar();
    }

    const tabBtn = e.target.closest('[data-recorrido-tab]');
    if (tabBtn && tabBtn.dataset.recorridoTab !== recorridoActivo) {
      recorridoActivo = tabBtn.dataset.recorridoTab;
      return repintar();
    }

    const cronTabBtn = e.target.closest('[data-cron-tab]');
    if (cronTabBtn && +cronTabBtn.dataset.cronTab !== cronogramaActivo) {
      cronogramaActivo = +cronTabBtn.dataset.cronTab;
      return repintar();
    }
  });
}
