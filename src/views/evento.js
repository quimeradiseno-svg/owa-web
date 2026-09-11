import { html, raw, toHTML, stagger } from '../lib/html.js';
import { foto, fondo } from '../lib/img.js';
import { porSlug, ESTADOS, linkInscripcion, sinIngreso } from '../data/eventos.js';
import { fichaDe } from '../data/fichas.js';
import { sponsorsDe } from '../data/sponsors.js';
import { beneficiosDe } from '../data/beneficios.js';
import { carrusel, montarCarruseles } from '../components/carrusel.js';
import { EVENTO_FICHA } from '../data/madres.js';
import {
  eyebrow,
  chipEstado,
  chipVivo,
  chipModalidad,
  posicion,
  btnAccent,
  btnBorde,
  btnPrimario,
  pastillaChica,
  olaCentrada,
} from '../components/ui.js';
import { icono } from '../components/iconos.js';
import { grafo, migas, eventoDeportivo } from '../lib/schema.js';

// Sin fecha confirmada la ficha existe (el link directo sigue andando) pero
// no se indexa: no está enlazada desde ningún lado y su contenido puede
// cambiar entero cuando la sede confirme.
export const noindex = (ctx) => sinIngreso(porSlug(ctx.params.slug));

export const titulo = (ctx) => porSlug(ctx.params.slug)?.nombre ?? 'Carrera no encontrada';

// Descripción armada con los datos que la propia ficha muestra: sede, fecha
// y distancias. Sin plantilla genérica ni relleno.
export const descripcion = (ctx) => {
  const e = porSlug(ctx.params.slug);
  if (!e) return '';
  const f = fichaDe(e.slug);
  const kms = (f?.distancias || []).map((d) => d.km).join(', ');
  const cuando = e.fechaLarga || `${e.fechaCorta} ${e.anio}`.trim();
  return [
    `${e.nombre}: ${cuando} en ${e.sede}.`,
    kms ? `Distancias de ${kms}.` : '',
    'Recorrido, cronograma, requisitos e inscripción.',
  ]
    .filter(Boolean)
    .join(' ');
};

// Foto propia al compartir: hoy cada carrera se previsualizaba con la del home.
export const imagen = (ctx) => {
  const e = porSlug(ctx.params.slug);
  return e ? `/img/${e.img}-1250.jpg` : '';
};

export const tipoOG = 'article';

// SportsEvent + migas. `eventoDeportivo` sólo emite propiedades con dato real.
export const schema = (ctx) => {
  const e = porSlug(ctx.params.slug);
  if (!e) return null;
  const [volverHref] = VUELVE_A[e.tipo];
  // Nombre legible para el buscador: VUELVE_A trae la etiqueta del botón,
  // que va en mayúsculas y así se vería en el resultado de búsqueda.
  const seccion = e.tipo === 'challenge' ? 'OWA Challenge' : e.tipo === 'especial' ? 'Eventos especiales' : 'Calendario';
  return grafo(eventoDeportivo(e), migas([[seccion, volverHref], [e.nombre, `/carrera/${e.slug}`]]));
};

// Destino del CTA de cierre. Los beneficios son por carrera —el acuerdo con
// cada marca se cierra fecha por fecha—, así que cada una tiene su propia
// página y sólo la abre si tiene algo cargado en src/data/beneficios.js.
// Sin beneficios el CTA se muestra pero NO navega: es un span inerte, no un
// link, así la ficha no manda a una página vacía.
const beneficiosHref = (e) => (beneficiosDe(e.slug).length ? `/carrera/${e.slug}/beneficios` : '');

// Gemelo visual de btnAccent mientras no hay destino. Comparte las clases para
// que lo que se revisa sea el botón final, pero sin href no es un link y los
// lectores de pantalla no lo anuncian como tal.
const ctaSinDestino = (label) => html`
  <span
    aria-disabled="true"
    class="btn u-press h-auto min-h-0 shrink-0 cursor-default gap-2.5 border-0 bg-owa-cyan px-7 py-4 font-display text-[13px] font-black tracking-[0.06em] text-owa-deep uppercase"
    >${label}</span
  >
`;

// Estado de demo: deja ver las tres caras de la misma página.
// Estado de la carrera. La ficha ya sabe mostrarse en las tres caras —previa,
// en vivo y finalizada—; hoy queda fija en "proxima" porque todavía no hay de
// dónde leerla. El panel para cambiarla a mano se sacó del sitio público: se
// rehace cuando se defina el operativo del día de la carrera.
let raceState = 'proxima';

// Tab de "Elegí tu distancia": qué recorrido está activo. No se resetea por
// carrera — el render cae al primer recorrido si el id no existe acá.
let recorridoActivo = null;

// Cronograma: primero se elige el torneo (Grand Prix / Circuito), y recién
// dentro de ese torneo, el día — no al revés. Mezclar los dos torneos en una
// sola pestaña "por día" (como estaba antes) confundía, porque el sábado le
// pertenece a los dos por motivos distintos (carrera de GP, entrega de kits
// de Circuito). `dia` se resetea a 0 cada vez que cambia `torneo`.
let cronogramaSel = { torneo: 0, dia: 0 };

// "Entre 23 y 26 °C, sin visibilidad, corriente a favor" -> "A favor". Es el
// único dato de corriente que hay: no vale la pena duplicarlo como campo
// aparte en fichas.js cuando ya vive adentro de "Condiciones del agua".
const corrienteDe = (r) => {
  const agua = (r.ficha.find(([k]) => k === 'Condiciones del agua') || [])[1] || '';
  if (/en contra/i.test(agua)) return 'En contra';
  if (/a favor/i.test(agua)) return 'A favor';
  // Sin dato no se afirma nada: antes caía en "Variable", que era una
  // condición del agua que OWA nunca dijo. El casillero se omite.
  return '';
};

// "core" corre Grand Prix y Circuito el mismo fin de semana: volver a
// "/grand-prix" (como si esta ficha fuera sólo de ese torneo) no tiene
// sentido cuando la propia página ya separa "elegí tu carrera" en dos.
const VUELVE_A = {
  core: ['/calendario', 'CALENDARIO'],
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
    largada: (rs.map(hora).filter(Boolean).join(' · ') || ds.map((d) => d.hora).filter(Boolean).join(' · ')) || 'A confirmar',
  };
};

// Pruebas patrocinadas y prueba de menores. Antes se comparaba contra el
// literal 'arena Super Sprint' —la única que existía— y contra 'Kid'; con
// Colón entran "arena Knock Out Swim" y "Kids", así que se reconocen por
// forma y no por nombre exacto.
const esArena = (d) => /^arena /.test(d.rotulo || '');
const esKids = (d) => /^kids?$/i.test(d.rotulo || '');

/** Un valor todavía sin confirmar por OWA, para no mostrarlo pegado a otro. */
const sinDato = (v) => !v || /^a confirmar$/i.test(String(v).trim());

/** El nombre de la prueba, sin el prefijo que la marca como patrocinada.
    Antes cerraba con "by arena" y el rótulo quedaba larguísimo: en la tarjeta
    de Colón "Knock Out Swim by arena 2 × 350 m" empujaba las pastillas a tres
    líneas. El sponsor sigue nombrado en el reglamento de cada fecha. */
const nombreArena = (d) => d.rotulo.replace(/^arena /, '');

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

/** "7 km" → "7K", "1,5 km" → "1.5K", "500 m" → "500M": formato compacto para
    la pastilla de fecha del banner, que a veces lista varias distancias
    (Circuito) y no entra si van escritas como en el resto del sitio. */
const distCorta = (km) => km.replace(',', '.').toUpperCase().replace(/\s*KM$/, 'K').replace(/\s*M$/, 'M');

/** "Viernes 13 de noviembre" → "VIERNES 13 NOV". Para la pestaña del día. */
const diaCorto = (f) => {
  const m = /^(\p{L}+) (\d{1,2}) de (\p{L}+)/iu.exec(String(f));
  if (!m) return f;
  const mes = MESES_LARGO.indexOf(m[3].toLowerCase());
  return mes === -1 ? f : `${m[1]} ${m[2]} ${MES_CORTO[mes]}`;
};

/** Cada torneo abre su propio formulario cuando la ficha lo define. */
const inscripcionDe = (e, f, torneo) => f?.inscripcion?.[torneo] || linkInscripcion(e);
// Sin fallback genérico: si la ficha no trae starting list todavía, el botón
// no se muestra (no hay una URL "de cualquier torneo" que tenga sentido acá).
const startingListDe = (e, f, torneo) => f?.startingList?.[torneo] || '';

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

const jornadas = (e, f) => {
  // Luján corre los dos torneos el mismo día; San Pedro, Ramallo y Colón los
  // reparten en sábado y domingo. El encabezado lo dice según la fecha real
  // en vez de dar por sentado el fin de semana.
  const unSoloDia = new Set((e.jornadas || []).map((j) => j.fecha)).size === 1;

  return html`
  <!-- EXPERIMENTO — fondo blanco en vez de navy: las tarjetas son fotos con
       su propio velo, así que se leen igual sobre cualquier fondo; el
       cambio es puramente del color de la sección. Ver Distancias y
       categorías, que hace el cambio inverso a modo de contraste. -->
  <section class="bg-white px-0 pt-10 pb-20" aria-labelledby="h-jornadas">
    <div class="u-shell">
      ${eyebrow(unSoloDia ? 'Dos campeonatos, una misma jornada' : 'Dos jornadas, un fin de semana')}
      <h2 id="h-jornadas" class="mt-3.5 u-h2 text-owa-navy">${unSoloDia ? 'Día del evento' : 'Días del evento'}</h2>

      <!-- EXPERIMENTO — estilo "afiche de Instagram": cinta de fecha, sigla
           gigante, bajada y pastillas de dato, en vez de la jerarquía
           torneo→distancia de antes. Sin subir. -->
      <div class="mt-9 grid gap-5 lg:grid-cols-2" data-stagger>
        ${e.jornadas.map((j) => {
          const gp = j.torneo === 'GRAND PRIX';
          // Kid no lleva `torneo: 'CIRCUITO OWA'` en los datos (es la única
          // sin puntaje, aparte de las competitivas) pero corre el domingo
          // de Circuito igual, así que se suma a mano acá.
          const distanciasTorneo = (f?.distancias || []).filter((d) => d.torneo === j.torneo || (!gp && esKids(d)));

          const linkInsc = inscripcionDe(e, f, j.torneo);
          const linkStarting = startingListDe(e, f, j.torneo);

          return html`
            <div class="reveal u-lift group block rounded-owa-lg bg-linear-to-br from-owa-sky via-white/85 to-owa-blue p-px">
              <div class="relative flex min-h-[34rem] flex-col overflow-hidden rounded-[27px]">
                <div class="absolute inset-0" aria-hidden="true">
                  ${foto({
                    slug: j.img || e.img,
                    alt: '',
                    sizes: '(min-width: 1024px) 50vw, 100vw',
                    className: 'block h-full w-full',
                    // Recorte propio por jornada: la de VOB es panorámica y
                    // los nadadores quedan en el tercio inferior, centrada los
                    // recortaba de más.
                    imgClass: `h-full w-full object-cover ${j.imgPos || ''}`,
                  })}
                  <!-- Dos degradés combinados en vez de un solo velo parejo:
                       el vertical sostiene texto/CTA abajo sin tapar la foto
                       arriba (recién oscurece de verdad después del 45%), y
                       el horizontal deja "respirar" la esquina superior
                       derecha. Mismo velo para VOB y SPD — la diferencia de
                       color va en pills/CTA, no en toda la foto. -->
                  <div
                    class="absolute inset-0 [background-image:linear-gradient(to_bottom,rgb(7_12_40/0.04)_0%,rgb(7_12_40/0.15)_45%,rgb(7_12_40/0.6)_72%,rgb(7_12_40/0.96)_100%),linear-gradient(to_right,rgb(7_12_40/0.45)_0%,rgb(7_12_40/0.15)_55%,rgb(7_12_40/0.05)_100%)]"
                  ></div>
                </div>

                <div class="relative z-10 flex flex-1 flex-col p-8 sm:p-10">
                <!-- class="contents": no genera caja propia, así el resto de
                     la card sigue en su lugar mientras esto pasa a ser un
                     link real — necesario para poder sacar el botón de
                     Starting List afuera sin anidar <a> dentro de <a>. -->
                <a href="${linkInsc}" target="_blank" rel="noopener noreferrer" class="contents">
                <div class="flex items-start justify-between gap-4">
                  <p
                    class="inline-flex items-center gap-2 rounded-full px-4 py-2 font-display text-[13px] font-black tracking-[0.06em] uppercase ${gp
                      ? 'bg-owa-electric text-white'
                      : 'bg-owa-cyan text-owa-deep'}"
                  >
                    <span class="sm:hidden">${fechaCorta(j.fecha).replace(/ \d{2}$/, '')}</span>
                    <span class="hidden sm:inline">${fechaRibbon(j.fecha)}</span>
                  </p>
                  <img
                    src="/brand/owa-${gp ? 'grandprix' : 'circuito'}-s.svg"
                    alt="${j.torneo}"
                    class="mt-1 h-8 w-auto shrink-0 opacity-90 sm:h-9"
                  />
                </div>

                <p
                  data-nums
                  class="mt-6 font-display text-[clamp(4rem,9vw,6rem)] leading-[0.82] font-black uppercase ${gp ? 'text-owa-electric' : 'text-owa-cyan'}"
                >
                  ${j.sigla}
                </p>
                <p class="-mt-2 font-display text-sm font-black tracking-[0.16em] text-white uppercase">${j.nombreLargo}</p>

                <p class="mt-6 max-w-[26ch] font-display text-[clamp(1.375rem,2.4vw,1.75rem)] leading-tight font-black text-white uppercase">
                  ${raw(j.tagline)}
                </p>

                <div class="mt-5 h-0.75 w-10 rounded-full bg-white/60" aria-hidden="true"></div>

                <div class="mt-5 flex flex-wrap items-center gap-2.5">
                  ${distanciasTorneo.map((d, i) => {
                    // Las pruebas con nombre propio lo llevan delante de la
                    // distancia; si la distancia todavía no está, va el
                    // nombre solo — "Knock Out Swim by arena A confirmar" no
                    // se entiende.
                    const nombrePrueba = esArena(d) ? nombreArena(d) : esKids(d) ? d.rotulo : '';
                    const kmConcreto = sinDato(d.km) ? '' : d.km;
                    const etiqueta = [nombrePrueba, kmConcreto].filter(Boolean).join(' ') || d.km;
                    return html`
                      <span
                        class="rounded-full px-3.5 py-1.5 font-display text-[12px] font-black tracking-[0.04em] uppercase ${i < (gp ? 1 : 2)
                          ? gp
                            ? 'bg-owa-electric text-white'
                            : 'bg-owa-cyan text-owa-deep'
                          : 'border border-white/30 text-white'}"
                        >${etiqueta}</span
                      >
                    `;
                  })}
                </div>
                </a>

                <div class="mt-auto pt-8">
                  <!-- Sede y descripción son dos datos distintos: antes la
                       sede pisaba a la descripción de la jornada, así que una
                       carrera con ficha cargada perdía cosas como "última
                       fecha puntuable" o el requisito de estar presente. -->
                  <a href="${linkInsc}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-[13px] text-owa-line">
                    ${icono('pin', 'size-4 shrink-0 text-owa-sky')}
                    ${f?.sedeBarra || j.desc}
                  </a>
                  ${f?.sedeBarra && j.desc ? html`<p class="mt-2 text-[13px] leading-relaxed text-owa-line/80">${j.desc}</p>` : ''}
                  <!-- El aviso es la condición que hay que leer sí o sí (por
                       ejemplo, tener que estar presente para consagrarse
                       campeón): va en recuadro para que no se pierda entre la
                       sede y el botón. La descripción común sigue como texto
                       suelto arriba. -->
                  ${j.aviso
                    ? (() => {
                        // La primera oración es el titular del aviso ("Última
                        // fecha puntuable…") y va en negrita; lo que sigue es
                        // la condición, en peso normal.
                        const corte = j.aviso.indexOf('. ');
                        const titular = corte < 0 ? j.aviso : j.aviso.slice(0, corte + 1);
                        const resto = corte < 0 ? '' : j.aviso.slice(corte + 2);
                        // Cada oración en su renglón: seguidas, la condición
                        // se leía como continuación del titular en negrita y
                        // se perdía justamente lo que hay que hacer.
                        // Interlineado ajustado (snug) y no relaxed: son dos
                        // frases cortas dentro de un recuadro, con el aire de
                        // lectura corrida el bloque se estiraba de más.
                        return html`<p
                          class="mt-3 rounded-owa-md border border-white/20 bg-white/10 px-3.5 py-3 text-[13px] leading-snug text-white backdrop-blur-sm"
                        >
                          <span class="block font-bold">${titular}</span>${resto
                            ? html`<span class="mt-0.5 block">${resto}</span>`
                            : ''}
                        </p>`;
                      })()
                    : ''}
                  <!-- Apilados en mobile: lado a lado, "INSCRIBITE A GRAND
                       PRIX" queda en 96px y se parte en cuatro líneas. -->
                  <div class="mt-4 flex flex-col gap-2.5 sm:flex-row">
                    <a
                      href="${linkInsc}"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="u-press flex-1 rounded-full py-4 text-center font-display text-[11px] tracking-[0.04em] font-black sm:text-[13px] sm:tracking-[0.06em] transition-colors duration-200 ease-out group-hover:bg-white ${gp
                        ? 'bg-owa-electric text-white group-hover:text-owa-electric'
                        : 'bg-owa-cyan text-owa-deep'}"
                      >INSCRIBITE A ${j.torneo} →</a
                    >
                    ${linkStarting
                      ? html`
                          <a
                            href="${linkStarting}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="u-press rounded-full border-2 border-white/60 px-6 py-4 text-center font-display text-[11px] tracking-[0.04em] font-black sm:text-[13px] sm:tracking-[0.06em] text-white transition-colors duration-200 ease-out hover:border-white hover:bg-white hover:text-owa-deep sm:shrink-0"
                            >STARTING LIST</a
                          >
                        `
                      : ''}
                  </div>
                </div>
              </div>
              </div>
            </div>
          `;
        })}
      </div>
    </div>
  </section>
`;
};

// Postulación a un Challenge por WhatsApp, con el mensaje ya redactado. Mismo
// número que el pie del sitio (ver footer.js).
const waPostulacion = (e) =>
  'https://wa.me/5491125543112?text=' +
  encodeURIComponent(`Hola OWA, quiero postularme al ${e.nombre}.`);

// Sección "No se inscribe: se postula" de los Challenge. Va sobre blanco: en
// esas fichas la banda anterior (Distancias) es navy, así que ésta invierte.
const requisitos = (e) => html`
  <section class="bg-white px-0 py-19 text-owa-navy" aria-labelledby="h-admision">
    <div class="u-shell grid gap-12 lg:grid-cols-2">
      <div>
        ${eyebrow('Admisión')}
        <h2 id="h-admision" class="mt-3.5 text-[clamp(1.625rem,3.4vw,2.625rem)] leading-[0.96] text-owa-navy">
          No se inscribe:<br />se postula
        </h2>
        <p class="mt-4 max-w-[58ch] text-base leading-[1.75] text-owa-slate">
          Los Challenge son de ultradistancia y tienen cupo limitado. La postulación se hace por WhatsApp y la organización
          evalúa antecedentes en aguas abiertas antes de confirmar.
        </p>
        <div class="mt-6.5">
          ${btnPrimario('Postularme', waPostulacion(e), '', 'target="_blank" rel="noopener noreferrer"')}
        </div>
      </div>
      <div class="rounded-owa-lg border border-owa-sky/40 bg-owa-sky/15 p-7.5 sm:p-8">
        <h3 class="font-display text-[15px] font-black tracking-[0.04em] text-owa-navy uppercase">Requisitos para postular</h3>
        <ul class="mt-6 space-y-5">
          ${(e?.requisitos || EVENTO_FICHA.requisitos)
            .map((r) => (typeof r === 'string' ? { icono: 'info', t: r, d: '' } : r))
            .map(
              (r) => html`
                <li class="flex items-start gap-4">
                  <span class="grid size-12 shrink-0 place-items-center rounded-full bg-owa-blue/10 text-owa-blue">
                    ${icono(r.icono || 'info', 'size-6')}
                  </span>
                  <div class="min-w-0 pt-0.5">
                    <p class="font-sans text-[15px] font-bold text-owa-navy">${r.t}</p>
                    ${r.d ? html`<p class="mt-0.5 text-[13px] leading-relaxed text-owa-slate">${r.d}</p>` : ''}
                  </div>
                </li>
              `
            )}
        </ul>
      </div>
    </div>
  </section>
`;

/** Banderita del país (ISO-3) como SVG chico: se lee igual en todos los
    sistemas, a diferencia de los emoji de bandera (Windows los muestra como
    dos letras). Se van sumando países a medida que aparecen. */
const BANDERAS = {
  ARG: '<rect width="18" height="12" fill="#fff"/><rect width="18" height="4" fill="#75aadb"/><rect y="8" width="18" height="4" fill="#75aadb"/><circle cx="9" cy="6" r="1.5" fill="#f6b40e"/>',
  BRA: '<rect width="18" height="12" fill="#009c3b"/><path d="M9 1.4 16.4 6 9 10.6 1.6 6Z" fill="#ffdf00"/><circle cx="9" cy="6" r="2.3" fill="#002776"/>',
  URY: '<rect width="18" height="12" fill="#fff"/><g fill="#0038a8"><rect y="2.67" width="18" height="1.33"/><rect y="5.33" width="18" height="1.33"/><rect y="8" width="18" height="1.33"/><rect y="10.67" width="18" height="1.33"/></g><rect width="6.67" height="6.67" fill="#fff"/><circle cx="3.33" cy="3.33" r="1.4" fill="#fcd116"/>',
  CHL: '<rect width="18" height="12" fill="#fff"/><rect y="6" width="18" height="6" fill="#d52b1e"/><rect width="6" height="6" fill="#0039a6"/><circle cx="3" cy="3" r="1.4" fill="#fff"/>',
  ESP: '<rect width="18" height="12" fill="#c60b1e"/><rect y="3" width="18" height="6" fill="#ffc400"/>',
};
const bandera = (iso) =>
  BANDERAS[iso]
    ? html`<svg viewBox="0 0 18 12" class="h-3 w-[18px] shrink-0 rounded-[2px] ring-1 ring-owa-navy/15" aria-hidden="true">${raw(
        BANDERAS[iso]
      )}</svg>`
    : '';

/** Reseña histórica de un Challenge: cruces registrados agrupados por fecha,
    con nadador, banderita, uso de neopreno y tiempo. Si el evento define
    `triple`, va a la derecha; si no, la lista de fechas se reparte en dos. */
const resenaHistorica = (e) => {
  const r = e.resena;
  const unidad = r.unidad || 'nadadores';
  const bloque = (b) => html`
    <div class="rounded-owa-lg border border-owa-line bg-white p-6 shadow-[var(--shadow-card)] sm:p-7">
      <div class="flex items-center justify-between gap-3">
        <h3 class="font-display text-[13px] font-black tracking-[0.04em] text-owa-navy uppercase">${b.fecha}</h3>
        <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-owa-sky/20 px-2.5 py-1 text-[11px] font-bold tracking-[0.02em] text-owa-blue">
          ${icono('equipo', 'size-3.5')} ${b.cruces.length} ${unidad}
        </span>
      </div>
      <ul class="mt-4 divide-y divide-owa-sand">
        ${b.cruces.map(
          (c) => html`
            <li class="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
              <span class="flex min-w-0 items-center gap-2.5">
                ${bandera(c.pais)}
                <span class="font-sans text-[15px] font-bold text-owa-navy">${c.nadador}</span>
                <span class="text-[13px] text-owa-slate">${c.neopreno ? 'con neopreno' : 'sin neopreno'}</span>
              </span>
              <span data-nums class="font-display text-[15px] font-black text-owa-blue">${c.tiempo}</span>
            </li>
          `
        )}
      </ul>
    </div>
  `;

  return html`
  <section class="bg-white px-0 py-19 text-owa-navy" aria-labelledby="h-resena">
    <div class="u-shell grid gap-12 ${e.triple ? 'lg:grid-cols-[1.5fr_1fr]' : ''}">
      <div>
        ${eyebrow('Antecedentes')}
        <h2 id="h-resena" class="mt-3.5 text-[clamp(1.625rem,3.4vw,2.625rem)] leading-[0.96] text-owa-navy">
          ${r.titulo}
        </h2>
        ${r.bajada ? html`<p class="mt-4 max-w-[52ch] text-base leading-[1.75] text-owa-slate">${r.bajada}</p>` : ''}

        <div class="mt-7 grid items-start gap-5 ${e.triple ? '' : 'sm:grid-cols-2'}">
          ${r.bloques.map(bloque)}
        </div>
      </div>

      ${e.triple
        ? html`
            <div class="lg:pt-2">
              ${eyebrow('Forma parte de')}
              <div class="mt-4 rounded-owa-lg border border-owa-line bg-owa-sand p-7.5">
                ${e.triple.logo
                  ? html`<img
                      src="${e.triple.logo}"
                      alt="${e.triple.nombre}"
                      loading="lazy"
                      decoding="async"
                      class="h-20 w-auto sm:h-24"
                    />`
                  : html`<p class="font-display text-[clamp(1.375rem,2.4vw,1.75rem)] font-black text-owa-navy uppercase">
                      ${e.triple.nombre}
                    </p>`}
                <p class="mt-3 text-[13px] leading-relaxed text-owa-slate">
                  Este cruce integra la Triple Corona de aguas abiertas de OWA.
                </p>
                ${e.triple.href
                  ? html`<a
                      href="${e.triple.href}"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="u-nudge mt-4 inline-flex items-center gap-2 font-display text-[13px] font-black tracking-[0.06em] text-owa-blue uppercase"
                    >
                      Ver la Triple Corona
                      <span class="u-nudge-arrow inline-block" aria-hidden="true">→</span>
                    </a>`
                  : ''}
              </div>
            </div>
          `
        : ''}
    </div>
  </section>
`;
};

/** Zócalo de sponsors de la carrera: una tira de logos que se desplaza sola
    (u-marquee-track, en motion.css) y no compite por atención con nada — va
    justo antes del banner de "Beneficios Comunidad OWA", que es el cierre
    real de la página. Cada logo linkea al sitio del sponsor en una pestaña
    nueva.
    El track dibuja los logos dos veces seguidas: la segunda copia (marcada
    aria-hidden) es la que permite el loop continuo sin salto visible, y en
    prefers-reduced-motion se oculta sola (ver motion.css) dejando una fila
    fija con los logos reales. Se pinta sólo cuando la carrera tiene sponsors
    cargados — hoy las 4 sedes puntuables, se va completando por carrera. */
function bloqueSponsors(e) {
  const sponsors = sponsorsDe(e.slug);
  if (!sponsors.length) return '';

  // El carril (h-11 fijo) es el mismo para todos los logos, así quedan
  // alineados sobre la misma línea de base; el alto real del logo adentro es
  // el que declara cada uno en sponsors.js (ver el comentario ahí sobre por
  // qué arena y Nexalba no pueden compartir la misma altura de imagen).
  const logo = (s) => html`
    <a
      href="${s.href}"
      target="_blank"
      rel="noopener noreferrer sponsored"
      class="u-press flex h-11 shrink-0 items-center justify-center opacity-70 grayscale transition-[opacity,filter] duration-200 hover:opacity-100 hover:grayscale-0"
      aria-label="${s.nombre} (se abre en una pestaña nueva)"
    >
      <img src="${s.logoClaro}" alt="${s.nombre}" loading="lazy" decoding="async" class="${s.alto} w-auto object-contain" />
    </a>
  `;

  // Casilleros vacíos, sin logo: van después de los reales para dar la idea
  // de que el carrusel tiene lugar para más marcas y no que estas dos son
  // todo lo que va a haber. Van fijos en cada copia del track —no rotan ni
  // cambian— así que sólo hace falta borrarlos cuando OWA cierre el próximo
  // sponsor y haya un logo real para poner en su lugar.
  // border-owa-line ya es un gris muy pálido (#e4e6e3): con opacidad
  // reducida encima, un trazo punteado de 1px prácticamente desaparecía
  // contra el blanco. Va a color completo, y con un fondo apenas teñido
  // (owa-sand) para que se lea como un casillero y no como un cuadrado
  // recortado del layout por error.
  const casillero = () => html`
    <div class="size-24 shrink-0 rounded-owa-md border-2 border-dashed border-owa-line bg-owa-sand/60" aria-hidden="true"></div>
  `;
  const CASILLEROS_VACIOS = 3;

  const tira = () => html`
    ${sponsors.map(logo)}${Array.from({ length: CASILLEROS_VACIOS }, casillero)}
  `;

  return html`
    <section class="u-shell py-14" aria-labelledby="h-sponsors">
      <p id="h-sponsors" class="text-center text-[11px] font-bold tracking-[0.16em] text-owa-slate uppercase">Con el apoyo de</p>
      <div class="u-marquee-pausa mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div class="u-marquee-track flex w-max items-center gap-9" style="--marquee-s:${Math.max(14, (sponsors.length + CASILLEROS_VACIOS) * 5)}s">
          <div class="flex shrink-0 items-center gap-9">${tira()}</div>
          <div class="flex shrink-0 items-center gap-9" aria-hidden="true">${tira()}</div>
        </div>
      </div>
    </section>
  `;
}

/** Galería de fotos de la sede/edición anterior, sobre fondo blanco — hoy
    sólo Cruce del Nahuel la tiene cargada (`e.galeria`, ver eventos.js), pero
    cualquier carrera con fotos propias puede sumarla con el mismo campo.

    Mosaico irregular: la marcada `grande` ocupa 2×2 y el resto entra pareja
    de a una celda, cuatro por fila desde sm. La altura de fila es fija
    (`grid-auto-rows`) en vez de un aspect-ratio por foto: es lo que permite
    que la grande mida exactamente el doble sin depender de qué proporción
    traiga cada archivo. */
/** Las siglas que corren en esta fecha. Un evento con dos jornadas tiene una
    por jornada (San Pedro es VOB el sábado y SPD el domingo); el campo
    `e.sigla` de esos trae las dos juntas ("VOB · SPD") y no sirve para buscar. */
function galeriaBloque(e) {
  const fotos = e.galeria;
  if (!fotos?.length) return '';

  return html`
    <section class="u-shell py-16" aria-labelledby="h-galeria">
      ${eyebrow('La sede')}
      <h2 id="h-galeria" class="mt-3.5 u-h2 text-owa-navy">Galería</h2>
      <div
        class="mt-7 grid grid-cols-2 gap-3.5 [grid-auto-rows:140px] sm:grid-cols-4 sm:gap-4 sm:[grid-auto-rows:170px] lg:[grid-auto-rows:200px]"
        data-stagger
      >
        ${fotos.map(
          (g) => html`
            <div
              class="reveal-clip overflow-hidden rounded-owa-lg bg-owa-mist ${g.grande ? 'col-span-2 row-span-2' : ''}"
            >
              ${foto({
                slug: g.slug,
                alt: g.alt,
                sizes: g.grande ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, 50vw',
                className: 'block h-full w-full',
                imgClass: 'h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-105',
              })}
            </div>
          `
        )}
      </div>
    </section>
  `;
}

// Sólo se llama con raceState === 'finalizada' (ver render): antes de
// correrse la carrera esta sección no se muestra.
const resultadosBloque = (e) => {
  return html`
    <div>
      <h3 class="mb-6.5 text-[clamp(1.625rem,3.2vw,2.625rem)] text-owa-navy">Podios de esta edición</h3>
      <p class="max-w-[70ch] text-[15px] leading-relaxed text-owa-slate">
        Los podios de la fecha se cargan al cierre de la carrera. Mientras tanto, los resultados completos están en la
        plataforma de cronometraje.
      </p>
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
  const beneficios = beneficiosHref(e);

  // EXPERIMENTO (Pinamar) — Distancias en blanco en vez de navy. Sin jornadas
  // el hero cae directo sobre esa sección, y dos azules seguidos no dejaban
  // respirar: el hero cierra en navy y la sección era del mismo navy.
  // Se aplica a las carreras sin jornadas; para volver atrás, dejarlo en false.
  const invertido = !e.jornadas?.length && !esChallenge;

  return toHTML(html`
    <!-- Hero más bajo: con min-h en 66svh y pt-28 arriba del contenido, el
         cielo de la foto ocupaba media pantalla antes de llegar a nada
         legible. El contenido sigue anclado abajo (items-end); lo que baja
         es cuánto aire hay por encima suyo. -->
    <section class="relative flex ${esChallenge ? 'min-h-[42svh]' : 'min-h-[50svh]'} items-end overflow-hidden bg-owa-abyss">
      ${fondo({
        slug: e.img,
        alt: '',
        opacity: esChallenge ? 1 : 0.88,
        priority: true,
        imgPos: esChallenge ? e.heroPos || '' : '',
      })}
      <!-- Los Challenge usan un velo más liviano: la foto de la travesía es
           el argumento del hero, así que sólo se oscurece la columna del
           texto y el pie (donde apoya la ola), no la foto entera. -->
      <div class="${esChallenge ? 'u-hero-scrim-foto' : 'u-hero-scrim-sm'} absolute inset-0"></div>

      <!-- Mismo sello que ya lleva la mini-tarjeta del calendario (10 años de
           la Vuelta a la Huemul, ver tarjeta-evento.js) — acá en la ficha
           propia de la carrera. Va arriba, en la franja de foto libre por
           encima del título (el título ocupa casi todo el ancho, así que
           centrarlo en toda la sección lo hacía pisar el texto); adentro de
           esa franja se corrió hacia el centro y no pegado a la esquina,
           donde el borde se lo comía y quedaba casi invisible. La sombra se
           hace más marcada porque el fondo que le toca detrás no es siempre
           claro (cielo en unas fotos, monte en otras). -->
      ${e.sello
        ? html`<img
            src="${e.sello.src}"
            alt="${e.sello.alt}"
            loading="eager"
            decoding="async"
            class="absolute top-5 left-[63%] z-10 size-20 -translate-x-1/2 [filter:drop-shadow(0_2px_10px_rgb(7_12_40/0.55))] sm:top-7 sm:size-28"
          />`
        : ''}

      <div
        class="u-shell relative text-white ${esChallenge
          ? 'pt-8 pb-16 [&_h1]:[text-shadow:0_2px_16px_rgb(7_12_40/0.55)] [&_p]:[text-shadow:0_1px_10px_rgb(7_12_40/0.6)] [&>a]:[text-shadow:0_1px_10px_rgb(7_12_40/0.6)]'
          : 'pt-14 pb-20'}"
      >
        <a
          href="${volverHref}"
          class="u-nudge inline-flex items-center gap-2 font-display text-xs font-bold tracking-[0.12em] text-owa-sky transition-colors hover:text-owa-cyan"
        >
          <span class="u-nudge-arrow inline-block rotate-180" aria-hidden="true">→</span> ${volverLabel}
        </a>

        <!-- Logo institucional invitado (hoy sólo el Museo Malvinas, en Cruce
             del Nahuel — mismo dato que ya usa la mini-tarjeta del calendario,
             ver tarjeta-evento.js). Va en blanco con drop-shadow porque cae
             sobre una foto y no siempre hay un velo oscuro debajo; el nombre
             de la institución es texto real y no el alt de la imagen, que
             queda decorativo para no anunciarse dos veces. -->
        ${e.logo
          ? html`
              <div class="mt-6 flex items-center gap-3">
                <img
                  src="${e.logo.src}"
                  alt=""
                  loading="eager"
                  decoding="async"
                  class="h-10 w-auto sm:h-12 [filter:drop-shadow(0_1px_3px_rgb(7_12_40/0.55))]"
                />
                <p class="text-[11px] leading-tight font-bold tracking-[0.1em] text-owa-line/80 uppercase">
                  Sede anfitriona<br />
                  <span class="text-[13px] tracking-[0.04em] text-white">${e.logo.alt}</span>
                </p>
              </div>
            `
          : ''}

        <p class="mt-6.5 flex flex-wrap items-center gap-2.5">
          ${e.sigla
            ? html`<span
                class="rounded-md border border-white/30 px-2.25 py-1 font-display text-[11px] font-black tracking-[0.14em] text-owa-line"
                >${e.sigla.replace(/\s*·\s*/g, ' / ')}</span
              >`
            : ''}
          ${raceState === 'vivo'
            ? chipVivo()
            : esChallenge
              ? ''
              : chipEstado(raceState === 'finalizada' ? 'cerrada' : e.estado, { oscuro: true })}
        </p>

        <h1
          class="mt-5 leading-[0.9] ${esChallenge
            ? 'text-[clamp(2.25rem,5.6vw,5rem)]'
            : 'text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.88]'}"
        >
          ${e.tipo === 'challenge' ? e.nombre.split('·').pop().trim() : e.nombre}${e.sponsor === 'arena'
            ? html`<span class="ml-4 inline-flex items-center gap-2.5 align-middle normal-case">
                <span class="font-display text-[clamp(0.8125rem,1.5vw,1.0625rem)] font-bold tracking-[0.04em] text-owa-line/80">by</span>
                <!-- El logo de arena sólo existe en negro; se invierte a blanco
                     por CSS para que se lea sobre el hero oscuro. -->
                <img
                  src="/brand/arena-logo.webp"
                  alt="arena"
                  class="h-[clamp(1.5rem,3.2vw,2.375rem)] w-auto opacity-90 brightness-0 invert"
                />
              </span>`
            : ''}
        </h1>
        <!-- Un vistazo a las dos jornadas sin bajar hasta "Elegí tu carrera":
             misma fecha/torneo/distancia que las tarjetas, en formato
             pastilla. La fecha suelta de antes quedaba repetida con esto,
             así que en eventos con jornadas esto LA REEMPLAZA en vez de
             sumarse — eventos sin jornadas (challenge, especiales) siguen
             mostrando la fecha simple, que es todo lo que tienen. -->
        ${(() => {
              // Acá sólo van las distancias que puntúan (Media/Corta):
              // Las pruebas de arena y las de menores quedan afuera de la
              // pastilla del banner — siguen completas en la tarjeta de
              // "Elegí tu carrera".
              const distTxtDe = (torneo) => {
                const ds = (f?.distancias || []).filter((d) => d.torneo === torneo && !esArena(d) && !esKids(d));
                return ds.length > 1 ? ds.map((d) => distCorta(d.km)).join(' · ') : (ds[0]?.km || '').toUpperCase();
              };
              const sep = html`<span class="text-white/70" aria-hidden="true">·</span>`;
              const fecha = (dia) => html`<span data-nums class="text-[15px] text-owa-cyan"
                ><span class="sm:hidden">${fechaCorta(dia).replace(/ \d{2}$/, '')}</span
                ><span class="hidden sm:inline">${fechaCorta(dia)}</span></span
              >`;
              const PILL =
                'inline-flex flex-wrap items-center gap-2.5 rounded-full border border-owa-cyan/60 px-4.5 py-2.5 font-display text-[13px] font-black tracking-[0.02em]';

              // Sin jornadas pero con fecha propia (los especiales, como
              // Pinamar): misma pastilla que el resto, con la fecha y las
              // distancias. Antes caía a un renglón de texto suelto y el
              // banner no se parecía al de las demás carreras.
              // Los Challenge quedan afuera a propósito: no tienen una fecha
              // sino una ventana ("DIC 2026 – MAR 2027"), que no entra en
              // este formato.
              if (!e.jornadas?.length) {
                if (!e.anio) {
                  // Challenge (y cualquier especial sin año): la ventana o
                  // condición de largada va en la misma pastilla de borde
                  // redondeado que la fecha del resto de las carreras. Texto en
                  // Lato blanco; la palabra "Challenge", en Vito Black.
                  return html`<div class="mt-5 flex flex-wrap gap-3">
                    <span
                      class="inline-block rounded-full border border-owa-cyan/60 px-5 py-2.5 font-sans text-[15px] font-bold tracking-[0.01em] text-white sm:text-[17px]"
                      >${e.fechaLarga
                        .split(/(Challenge)/)
                        .map((p) =>
                          p === 'Challenge'
                            ? html`<span class="font-display font-black tracking-[0.04em]">${p}</span>`
                            : p
                        )}</span
                    >
                  </div>`;
                }
                const ds = (f?.distancias || []).filter((d) => !esArena(d) && !esKids(d) && d.torneo);
                return html`
                  <div class="mt-5 flex flex-wrap gap-3">
                    <span class="${PILL}">
                      <span data-nums class="text-[15px] text-owa-cyan">${e.fechaCorta} ${e.anio.slice(-2)}</span>
                      ${ds.length
                        ? html`${sep}<span data-nums class="text-white"
                              >${ds.map((d) => distCorta(d.km)).join(' · ')}</span
                            >`
                        : ''}
                    </span>
                  </div>
                `;
              }
              // Luján corre las dos jornadas el mismo día: dos pastillas
              // repetían la fecha idéntica. Va una sola, con la fecha adelante
              // y los dos torneos con sus distancias detrás.
              const mismoDia = new Set(e.jornadas.map((j) => j.fecha)).size === 1;
              return html`
                <div class="mt-5 flex flex-wrap gap-3">
                  ${mismoDia
                    ? html`
                        <span class="${PILL}">
                          ${fecha(e.jornadas[0].fecha)}
                          ${e.jornadas.map(
                            (j) => html`${sep}<span class="text-white">${j.torneo}</span>${sep}<span
                                data-nums
                                class="text-white"
                                >${distTxtDe(j.torneo)}</span
                              >`
                          )}
                        </span>
                      `
                    : e.jornadas.map(
                        (j) => html`
                          <span class="${PILL}">
                            ${fecha(j.fecha)} ${sep}
                            <span class="text-white">${j.torneo}</span>
                            ${sep}
                            <span data-nums class="text-white">${distTxtDe(j.torneo)}</span>
                          </span>
                        `
                      )}
                </div>
              `;
            })()}

        <!-- La sede completa (predio + ciudad) reemplaza a la ciudad sola:
             sedeBarra ya trae el predio ("Camping Club América, San Pedro");
             se le pega el resto de sedeCiudad (provincia, país) sin repetir
             la ciudad. Sin sedeBarra (eventos sin ficha propia), se cae a
             sedeCiudad o a e.sede, como antes. -->
        <p class="mt-4 flex flex-wrap items-center gap-2 text-[13px] font-bold tracking-[0.02em] text-owa-sky">
          ${icono('pin', 'size-4 shrink-0')}
          ${f?.sedeBarra ? `${f.sedeBarra}, ${f.sedeCiudad.split(', ').slice(1).join(', ')}` : f?.sedeCiudad || e.sede}
        </p>
      </div>
    </section>

    <!-- Misma ola que separa el hero de home, pero apuntando para abajo (girada
         180°, la forma es simétrica así que da lo mismo que un flip vertical):
         acá el blanco entra desde arriba, no sube desde abajo. -->
    <!-- La ola separa el hero de la primera sección en todas las carreras,
         Challenge incluidos. El relleno toma el color de la sección que sigue:
         blanco en el calendario/especiales (Días del evento, Distancias) y
         navy en los Challenge, donde la primera banda es azul. -->
    ${(() => {
          const olaFill = esChallenge ? 'var(--color-owa-navy)' : '#fff';
          const olaGuard = esChallenge ? 'bg-owa-navy' : 'bg-white';
          // Exactamente la misma ola del hero del home, sin diferencias.
          //
          // Antes iba girada 180° y en navy, y las dos cosas estaban mal:
          // girada, el pico quedaba angosto y con dos alas a los costados que
          // no tienen foto que mostrar (la foto termina 52px más arriba), así
          // que había que rellenarlas de algún color y siempre se leía como
          // una mancha ajena. Y en navy no se veía: es un bulto ancho y poco
          // profundo, pintado del mismo tono que la foto ya oscurecida por el
          // scrim — a pantalla completa se aplanaba hasta parecer una línea
          // recta.
          // En blanco sí contrasta contra la foto, que es lo que hace legible
          // a la del home. Y el blanco es además el color correcto: abajo
          // siempre sigue una sección blanca (Días del evento con jornadas,
          // Distancias sin ellas), así que el relleno empalma con lo que
          // viene y el borde inferior del trazo —una recta a lo ancho de todo
          // el viewBox, siempre en y=52— no deja ningún hueco que tapar.
          return html`<div class="relative z-2 -mt-13">
            ${olaCentrada(olaFill)}
            <!-- Guarda de subpíxel: con el zoom de Windows al 125%/150% el
                 borde antialiaseado del SVG puede dejar asomar un hilo de la
                 sección de después, aunque en CSS las dos midan exactamente lo
                 mismo (mismo caso que la ola del home). -->
            <div class="absolute inset-x-0 bottom-0 h-1 translate-y-px ${olaGuard}" aria-hidden="true"></div>
          </div>`;
        })()}

    ${raceState === 'vivo' ? bandaVivo() : ''}
    ${e.tipo === 'core' ? jornadas(e, f) : ''}

    <!-- distancias -->
    <!-- EXPERIMENTO — fondo navy en vez de blanco: a probar junto con el
         cambio inverso en "jornadas" (esa pasa a blanco). Si no convence,
         alcanza con volver este bloque y el de arriba a como estaban. -->
    <section class="${invertido ? 'bg-white' : 'bg-owa-navy'} px-0 ${esChallenge ? 'pt-10' : 'pt-20'} pb-16" aria-labelledby="h-distancias">
      <div class="u-shell">
      <div class="flex items-center gap-3">
        <h2
          id="h-distancias"
          class="font-display text-[clamp(1.125rem,2vw,1.5rem)] font-black tracking-[0.04em] uppercase ${invertido
            ? 'text-owa-blue'
            : 'text-owa-sky'}"
        >
          ${f?.distancias?.length === 1 ? 'Distancia y categoría' : 'Distancias y categorías'}
        </h2>
      </div>
      ${f?.distancias?.length === 1
        ? (() => {
            // Única distancia (hoy sólo Cruce del Nahuel): la grilla de
            // tarjetas está pensada para 3-5 pruebas y con una sola queda un
            // cuadrado solo, flotando. Acá va como franja horizontal — el
            // número manda a la izquierda y los datos de la ficha técnica
            // (mismo recorrido, por torneo) se leen en una sola línea a la
            // derecha, sin repetir la tarjeta de "Recorridos" de más abajo.
            const d = f.distancias[0];
            const r = f.recorridos?.find((x) => x.torneo === d.torneo) || f.recorridos?.[0];
            const dato = (k) => (r?.ficha?.find(([kk]) => kk === k) || [])[1];
            const tono = invertido ? 'text-owa-navy' : 'text-white';
            const tonoSuave = invertido ? 'text-owa-slate' : 'text-owa-line/80';
            const tonoIcono = invertido ? 'text-owa-blue' : 'text-owa-cyan';

            const item = (nombreIcono, etiqueta, valor) =>
              !valor
                ? ''
                : html`
                    <div class="flex items-start gap-2.5 sm:pl-5 sm:first:pl-0">
                      ${icono(nombreIcono, `mt-0.5 size-4.5 shrink-0 ${tonoIcono}`)}
                      <span class="min-w-0">
                        <span class="block font-display text-[10px] font-bold tracking-[0.1em] uppercase ${tonoSuave}">${etiqueta}</span>
                        <span class="block text-[13px] leading-snug font-bold ${tono}">${valor}</span>
                      </span>
                    </div>
                  `;

            return html`
              <div
                class="reveal mt-6 flex flex-col gap-6 rounded-owa-lg p-6 sm:p-7 lg:flex-row lg:items-center lg:gap-10 ${invertido
                  ? 'border border-owa-line bg-white'
                  : 'border border-white/12 bg-white/6'}"
              >
                <div class="shrink-0">
                  <div>${chipModalidad(d.torneo, { oscuro: !invertido })}</div>
                  <p data-nums class="mt-3 font-display text-[clamp(2.5rem,5vw,3.5rem)] leading-[0.85] font-black ${tono}">
                    ${d.km}
                  </p>
                  ${d.nota ? html`<p class="mt-2 max-w-[24ch] text-[12px] leading-snug ${tonoSuave}">${d.nota}</p>` : ''}
                </div>

                <div class="hidden w-px self-stretch ${invertido ? 'bg-owa-line' : 'bg-white/15'} lg:block" aria-hidden="true"></div>

                <!-- La línea divisoria entre bloques sólo entra desde sm:, que
                     es donde la grilla pasa a una sola fila (grid-cols-4): en
                     mobile (2×2) un divide-x de Tailwind pondría también un
                     borde a la izquierda del tercer ítem, que abre la
                     segunda fila y no tiene nada de qué separarse ahí. -->
                <div
                  class="grid flex-1 grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-6 sm:divide-x ${invertido
                    ? 'sm:divide-owa-line'
                    : 'sm:divide-white/15'}"
                >
                  ${item('persona', 'Categoría', d.cats)}
                  ${item('cupo', 'Cupo', dato('Cupos disponibles'))}
                  ${item('reloj', 'Tiempo estimado', dato('Tiempo estimado'))}
                  ${item('documento', 'Requisitos', dato('Requisitos'))}
                </div>
              </div>
            `;
          })()
        : f?.distancias
        ? html`
            <!-- Cinco distancias, una sola fila desde xl. Antes las tres que
                 puntúan (Larga/Media/Corta) achicaban número y tarjeta para
                 las otras dos — quedaba desprolijo. Ahora las cinco tarjetas
                 son iguales en tamaño y número; la diferencia entre "carrera"
                 y "actividad complementaria" se lee en el pie de cada una
                 (Puntaje + Categorías vs. una descripción con ícono) y en un
                 tinte de fondo apenas distinto, no en jerarquía tipográfica. -->
            <ul
              class="mt-6 grid grid-cols-2 gap-3.5 sm:grid-cols-3 ${f.distancias.length === 5
                ? 'xl:grid-cols-[1.08fr_1.08fr_1.08fr_0.92fr_0.92fr]'
                : f.distancias.length === 4
                  ? 'xl:grid-cols-4'
                  : 'xl:grid-cols-3'}"
              data-stagger
            >
              ${f.distancias.map((d) => {
                const principal = ['Larga', 'Media', 'Corta'].includes(d.rotulo);
                const conArena = esArena(d);
                // La sigla de la carrera dice más que el rótulo interno
                // (Larga/Media/Corta): VOB es el Grand Prix, SPD el Circuito.
                const siglaCard = principal
                  ? e.jornadas?.find((j) => j.torneo === d.torneo)?.sigla || e.sigla || d.torneo
                  : conArena
                    ? nombreArena(d)
                    : d.rotulo;
                return html`
                  <li
                    class="reveal u-lift-sm flex flex-col rounded-owa-lg p-6 transition-shadow duration-250 ease-out hover:shadow-[var(--shadow-elevated)] ${principal
                      ? // Sobre fondo blanco una tarjeta blanca desaparece: ahí
                        // lleva borde. Sobre navy se recorta sola.
                        invertido
                        ? 'border border-owa-line bg-white'
                        : 'bg-white'
                      : 'bg-owa-mist'}"
                  >
                    <div class="flex items-center gap-2.5">
                      <span class="grid size-8 shrink-0 place-items-center">
                        ${conArena
                          ? html`<img src="/brand/arena-logo.webp" alt="" class="h-5 w-auto" />`
                          : esKids(d)
                            ? html`<span class="text-owa-blue">${icono('persona', 'size-5')}</span>`
                            : html`<img src="/brand/owa-iso-cyan.svg" alt="" class="size-5" />`}
                      </span>
                      <p class="font-display text-[11px] font-bold tracking-[0.1em] text-owa-slate uppercase">${siglaCard}</p>
                    </div>

                    <p
                      data-nums
                      class="mt-4 font-display leading-[0.85] font-black text-owa-navy ${principal
                        ? 'text-[clamp(2.25rem,4vw,3rem)]'
                        : 'text-[clamp(1.5rem,2.6vw,1.875rem)] whitespace-nowrap'}"
                    >
                      ${d.km}
                    </p>
                    <!-- Sin torneo no se inventa uno: Kids y OWA Relay no
                         puntúan para ningún campeonato. -->
                    ${d.torneo
                      ? html`<p class="mt-2 font-display text-xs font-black tracking-[0.06em] text-owa-blue">${d.torneo}</p>`
                      : ''}
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
                            ${d.cats
                              ? html`<p class="flex flex-wrap items-baseline justify-between gap-x-4 border-t border-owa-sand pt-2.5">
                                  <span class="text-[11px] text-owa-slate/80">Categorías</span>
                                  <span class="font-display text-sm font-black text-owa-navy">${d.cats}</span>
                                </p>`
                              : ''}
                          </div>
                        `
                      : html`
                          <div class="mt-auto flex items-start gap-2 pt-5">
                            <span class="mt-0.5 shrink-0 text-owa-blue">${icono('persona', 'size-4')}</span>
                            <p class="text-[13px] leading-relaxed font-bold text-owa-navy">${d.nota || d.cats}</p>
                          </div>
                        `}
                  </li>
                `;
              })}
            </ul>
          `
        : esChallenge && e.distancia
        ? (() => {
            const d = e.distancia;
            return html`
              <div
                class="reveal mt-6 flex flex-col gap-6 rounded-owa-lg border border-white/12 bg-white/6 p-6 sm:p-7 lg:flex-row lg:items-center lg:gap-10"
              >
                <div class="shrink-0">
                  <div>${chipModalidad(d.torneo, { oscuro: true })}</div>
                  <p data-nums class="mt-3 font-display text-[clamp(2.5rem,5vw,3.5rem)] leading-[0.85] font-black text-white">
                    ${d.km}
                  </p>
                </div>
                <div class="hidden w-px self-stretch bg-white/15 lg:block" aria-hidden="true"></div>
                <div class="flex-1 space-y-4">
                  <p class="flex items-start gap-2.5">
                    ${icono('pin', 'mt-0.5 size-4.5 shrink-0 text-owa-cyan')}
                    <span class="min-w-0">
                      <span class="block font-display text-[10px] font-bold tracking-[0.1em] text-owa-line/80 uppercase">Recorrido</span>
                      <span class="block text-[14px] leading-snug text-owa-line/95">${d.desc}</span>
                    </span>
                  </p>
                  <p class="flex items-start gap-2.5">
                    ${icono('persona', 'mt-0.5 size-4.5 shrink-0 text-owa-cyan')}
                    <span class="min-w-0">
                      <span class="block font-display text-[10px] font-bold tracking-[0.1em] text-owa-line/80 uppercase">Categorías</span>
                      <span class="block text-[14px] leading-snug font-bold text-white">${d.cats}</span>
                    </span>
                  </p>
                </div>
                <img
                  src="/brand/challenge-dorado.svg"
                  alt="OWA Challenge"
                  loading="lazy"
                  decoding="async"
                  class="h-20 w-auto shrink-0 self-center sm:h-24 lg:h-28"
                />
              </div>
            `;
          })()
        : html`
            <div class="mt-5.5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-stagger>
              ${distanciasDe(e).map(
                (d) => html`
                  <article
                    class="reveal u-lift-sm rounded-owa-lg border border-owa-line bg-white p-6.5 transition-shadow duration-250 ease-out hover:shadow-[var(--shadow-elevated)]"
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
            <p class="mt-4 text-xs text-owa-line/80">Distancias, horarios y valores de inscripción: pendientes de confirmación por OWA.</p>
          `}
      </div>
    </section>

    <!-- Admisión / postulación: en los Challenge va después de las distancias -->
    ${esChallenge ? requisitos(e) : ''}

    <!-- recorridos: una sola sección, todas las distancias como tabs. Cada
         tab lleva el torneo como subtítulo (Grand Prix / Circuito OWA) para
         que nunca haga falta adivinar a qué competencia pertenece un mapa.
         Los Challenge no tienen distancias ni tabs: sólo el mapa del cruce,
         cuando está cargado. -->
    ${esChallenge
      ? (e.recorridoMapa
          ? html`
              <section class="bg-owa-navy px-0 pt-14 pb-20 text-white" aria-labelledby="h-recorrido">
                <div class="u-shell">
                ${eyebrow('Recorrido', 'sky')}
                <h2 id="h-recorrido" class="mt-3.5 text-[clamp(1.625rem,3.2vw,2.625rem)] text-white">
                  ${e.nombre.split('·').pop().trim()}
                </h2>
                <div class="reveal-clip mt-5.5 overflow-hidden rounded-owa-lg bg-owa-abyss">
                  ${foto({
                    slug: e.recorridoMapa.slug,
                    alt: e.recorridoMapa.alt,
                    sizes: '(min-width: 1280px) 1216px, 100vw',
                    className: 'block w-full',
                    imgClass: 'w-full',
                  })}
                </div>
                </div>
              </section>
            `
          : '')
      : f?.recorridos
      ? (() => {
          const activoId = f.recorridos.find((x) => x.id === recorridoActivo)?.id || f.recorridos[0].id;
          const activo = f.recorridos.find((x) => x.id === activoId);
          // Los especiales no corren ningún torneo: su "torneo" es ESPECIAL y
          // hay que decirlo así. Antes cualquier cosa que no fuera Grand Prix
          // se etiquetaba "Circuito OWA", y Pinamar aparecía como si puntuara.
          const NOMBRE_TORNEO = { 'GRAND PRIX': 'Grand Prix', 'CIRCUITO OWA': 'Circuito OWA', ESPECIAL: 'Especial' };
          const nombreTorneo = (t) => NOMBRE_TORNEO[t] || t;
          // En mobile los tres tabs no entran en una fila con el nombre largo
          // del torneo (155px cada uno sobre 335 disponibles). La abreviatura
          // es la misma que ya usan los filtros del calendario y del home.
          const abrevTorneo = (t) => (t === 'GRAND PRIX' ? 'GP' : t === 'CIRCUITO OWA' ? 'Circ' : nombreTorneo(t));
          const siglaTorneo = (t) => e.jornadas?.find((j) => j.torneo === t)?.sigla || '';

          // La ficha técnica al costado del mapa lleva fondo blanco propio en
          // vez de heredar el de la sección. Antes era transparente y, con el
          // esquema invertido, quedaba navy sobre navy: el título literalmente
          // desaparecía. Con fondo propio la tarjeta se sostiene sola sobre
          // cualquier sección y no hay que duplicar cada color de texto.

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
            <div class="reveal mt-3.5 overflow-hidden rounded-owa-lg border border-owa-line bg-white" data-visible>
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

          const dato_ = (nombreIcono, etiqueta, valor) =>
            !valor
              ? ''
              : html`
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
              <div class="reveal mt-3.5 overflow-hidden rounded-owa-lg border border-owa-line bg-white" data-visible>
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
                    <p class="mt-1 text-sm font-bold text-owa-slate">${r.subtitulo || 'Punto a punto'}</p>
                    <!-- El río sale de la ficha: estaba fijo en "Paraná", que
                         vale para San Pedro y Ramallo pero no para Colón, que
                         corre sobre el Uruguay. Y un recorrido puede traer su
                         propia descripción: Pinamar corre en el mar, donde la
                         frase de "río, desde X hasta Y" no aplica. -->
                    <p class="mt-3 text-[13px] leading-relaxed text-owa-slate">
                      ${r.desc || `Recorrido punto a punto sobre el río ${f?.rio || 'Paraná'}, desde ${r.largada} hasta ${r.llegada}.`}
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
                      <!-- Sólo en el mar: si la deriva va al sur, la largada se
                           corre de playa. Es un dato que cambia a dónde hay que
                           presentarse, así que no puede quedar afuera. -->
                      ${filaLarga('pin', 'Cambio de largada por deriva sur', dato('Cambio de largada por deriva sur'))}
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

          // Una sola distancia (Cruce del Nahuel): no hay entre qué elegir,
          // así que la pestaña de selección desaparece — quedaba un tab
          // único que no hacía nada al tocarlo. Mismo título que usa el
          // camino sin ficha de abajo ("Recorrido X"), para no inventar otro.
          const unSoloRecorrido = f.recorridos.length === 1;

          return html`
            <section class="px-0 pt-10 pb-20" aria-labelledby="h-recorridos">
              <div class="u-shell">
              ${eyebrow(unSoloRecorrido ? 'Recorrido' : 'Recorridos')}
              <h2 id="h-recorridos" class="mt-3.5 text-[clamp(1.625rem,3.2vw,2.625rem)]">
                ${unSoloRecorrido ? e.corto : 'Elegí tu distancia'}
              </h2>

              ${unSoloRecorrido
                ? ''
                : html`
                    <div class="mt-6 flex flex-wrap gap-2.5" role="tablist" aria-label="Distancia">
                      ${f.recorridos.map(
                        (x) => html`
                          <button
                            type="button"
                            role="tab"
                            data-recorrido-tab="${x.id}"
                            aria-selected="${x.id === activoId ? 'true' : 'false'}"
                            class="u-press flex flex-col items-start gap-0.5 rounded-owa-md border px-3 py-2 text-left transition-colors duration-200 sm:px-4.5 sm:py-2.5 ${x.id ===
                            activoId
                              ? 'border-owa-blue bg-owa-blue text-white'
                              : 'border-owa-line text-owa-navy hover:border-owa-blue/50'}"
                          >
                            <span class="font-display text-sm font-black">${x.titulo}</span>
                            <span class="text-[11px] font-bold tracking-[0.04em] whitespace-nowrap uppercase ${x.id === activoId ? 'text-owa-line' : 'text-owa-slate'}">
                              <span class="${x.id === activoId ? 'text-owa-cyan' : 'text-owa-blue'}">${siglaTorneo(x.torneo)}</span> ·
                              <span class="sm:hidden">${abrevTorneo(x.torneo)}</span>
                              <span class="hidden sm:inline">${nombreTorneo(x.torneo)}</span></span
                            >
                          </button>
                        `
                      )}
                    </div>
                  `}

              <div class="${unSoloRecorrido ? 'mt-6' : ''}">
                ${activo.mapas?.length ? panelRecorrido(activo) : panelSinMapa(activo)}
              </div>
              </div>
            </section>
          `;
        })()
      : html`
          <section class="u-shell pt-10 pb-20" aria-labelledby="h-recorrido">
            ${eyebrow('Recorrido')}
            <h2 id="h-recorrido" class="mt-3.5 text-[clamp(1.625rem,3.2vw,2.625rem)]">${e.corto}</h2>
            <!-- Con mapa cargado se muestra; si no, el aviso de que falta -->
            ${f?.mapa
              ? html`<div class="reveal-clip mt-5.5 overflow-hidden rounded-owa-lg bg-owa-mist">
                  ${foto({
                    slug: f.mapa.slug,
                    alt: f.mapa.alt,
                    sizes: '(min-width: 1280px) 1216px, 100vw',
                    className: 'block w-full',
                    imgClass: 'w-full',
                  })}
                </div>`
              : html`<div class="mt-5.5 grid h-105 place-items-center rounded-owa-lg bg-owa-mist">
                  <div class="max-w-[34ch] px-6 text-center">
                    <img src="/brand/owa-iso-cyan.svg" alt="" width="44" height="46" class="mx-auto h-11 w-auto opacity-60" />
                    <p class="mt-4 font-display text-base font-black text-owa-navy">Mapa del recorrido</p>
                    <p class="mt-2 text-sm text-owa-slate">
                      Pendiente del export del track de ${e.sedeCorta.toLowerCase()} por parte de la organización.
                    </p>
                  </div>
                </div>`}
          </section>
        `}

    <!-- cronograma — los Challenge no tienen operativo de día de carrera -->
    ${esChallenge ? '' : html`
    <section class="bg-owa-mist px-0 py-20" aria-labelledby="h-cronograma">
      <div class="u-shell">
        ${eyebrow('Minuto a minuto')}
        <h2 id="h-cronograma" class="mt-3.5 text-[clamp(1.625rem,3.2vw,2.625rem)] text-owa-navy">Cronograma del evento</h2>
        ${f?.cronogramas
          ? (() => {
              const cronogramas = f.cronogramas;

              // Cronograma corto (Luján: tres largadas en un solo día) se lee
              // mejor como línea de tiempo horizontal: las pestañas de torneo
              // y día son demasiado aparato para eso. San Pedro, con dos días
              // y una docena de ítems, sigue con el selector.
              const dias = cronogramas.flatMap((c) => c.dias);
              const unDia = new Set(dias.map((d) => d.fecha)).size === 1;
              const items = cronogramas.flatMap((c) =>
                c.dias.flatMap((d) => d.items.map((it) => ({ ...it, torneo: c.torneo })))
              );
              // Clases literales: Tailwind escanea el fuente, un
              // `grid-cols-${n}` armado en runtime no se generaría.
              const COLS = { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5" };
              // Hasta 5 ítems, una columna por ítem; de 6 a 8 se reparten en
              // filas de 4 para que no queden celdas demasiado angostas.
              const cols = COLS[items.length] || COLS[4];
              if (unDia && items.length <= 8) {
                const orden = [...items].sort((a, b) => a.hora.localeCompare(b.hora));
                return html`
                  <p class="mt-3 font-display text-sm font-bold tracking-[0.08em] text-owa-slate uppercase">
                    ${dias[0].fecha} · ${dias[0].lugar}
                  </p>
                  <ol class="mt-6.5 grid gap-y-9 sm:grid-cols-2 ${cols}" data-stagger>
                    ${orden.map(
                      (it) => html`
                        <li class="reveal relative pr-4.5">
                          <div class="relative mb-5.5 h-0.5 bg-owa-line">
                            <span
                              class="absolute left-0 rounded-full ${it.destacado
                                ? '-top-2.25 size-5 border-4 border-owa-cyan bg-white'
                                : '-top-1.75 size-4 bg-owa-cyan'}"
                            ></span>
                          </div>
                          <p data-nums class="font-display text-[1.5625rem] font-black text-owa-blue">${it.hora}</p>
                          <p class="mt-2 font-display text-[15px] font-bold text-owa-navy uppercase">${it.t}</p>
                          <p class="mt-1.5 text-[13px] leading-normal text-owa-slate">
                            ${it.d || (cronogramas.length > 1 ? it.torneo : '')}
                          </p>
                        </li>
                      `
                    )}
                  </ol>
                `;
              }

              const torneoActivo = cronogramas[cronogramaSel.torneo] || cronogramas[0];
              const diaActivo = torneoActivo.dias[cronogramaSel.dia] || torneoActivo.dias[0];
              const nombreTorneoOWA = (t) =>
                t === 'GRAND PRIX' ? 'Grand Prix OWA' : t === 'CIRCUITO OWA' ? 'Circuito OWA' : 'Cronograma';
              // Mismo resumen de distancias que la pastilla del banner, más
              // "· Kid" en Circuito (no lleva `torneo` propio en los datos
              // porque no puntúa, pero corre ese mismo fin de semana).
              const resumenTab = (c) => {
                // La prueba de menores se agrega aparte, abajo, y las que
                // todavía no tienen distancia quedan fuera: si no, el resumen
                // salía "5 km · 2,5 km · A confirmar · A confirmar · Kids".
                const ds = (f?.distancias || []).filter(
                  (d) => d.torneo === c.torneo && !esKids(d) && !sinDato(d.km)
                );
                const base = ds.map((d) => d.km).join(' · ');
                // Sólo si la fecha realmente la corre: no todas tienen prueba
                // de menores, y el rótulo va "Kid" o "Kids" según la carrera.
                const kid = c.torneo !== 'GRAND PRIX' && (f?.distancias || []).find(esKids);
                return kid ? `${base} · ${kid.rotulo}` : base;
              };

              const filaCron = (it, idx, total) => html`
                <li class="flex gap-4 px-6.5 ${it.destacado ? 'py-4' : 'py-3'}">
                  <!-- Línea vertical armada en dos mitades por fila (arriba/abajo del
                       punto): así queda continua entre filas sin medir alturas a mano,
                       y se corta sola en el primer y último ítem de su columna. -->
                  <div class="relative flex w-3 shrink-0 justify-center">
                    ${idx > 0 ? html`<span class="absolute top-0 left-1/2 h-1/2 w-px -translate-x-1/2 bg-owa-line"></span>` : ''}
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
                    class="shrink-0 pt-0.5 font-display font-black ${it.destacado ? 'w-16 text-base text-owa-blue' : 'w-14 text-[13px] text-owa-slate'}"
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
                    ${it.d && !it.destacado ? html`<span class="mt-0.5 block text-[13px] text-owa-slate">${it.d}</span>` : ''}
                  </span>
                </li>
              `;

              return html`
                <!-- Nivel 1: torneo, afuera de la tarjeta — son botones, la
                     decisión de "cuál" antes que "qué día". Grand Prix y
                     Circuito son competencias distintas; mezclarlas en
                     pestañas por fecha (como estaba antes) confundía porque
                     el sábado le pertenece a los dos a la vez, por motivos
                     distintos. -->
                <!-- Con un solo cronograma el selector de torneo es un botón
                     que no elige nada: Pinamar es un especial y no reparte la
                     jornada entre Grand Prix y Circuito. Se muestra sólo
                     cuando hay más de uno. -->
                <div
                  class="mt-6.5 flex-wrap gap-2.5 ${cronogramas.length > 1 ? 'flex' : 'hidden'}"
                  role="tablist"
                  aria-label="Torneo"
                >
                  ${cronogramas.map(
                    (c, i) => html`
                      <button
                        type="button"
                        data-cron-torneo="${i}"
                        aria-pressed="${c === torneoActivo ? 'true' : 'false'}"
                        class="u-press rounded-owa-md border px-4 py-2.5 text-left sm:px-5 sm:py-3.5 transition-colors duration-200 ease-out ${c === torneoActivo
                          ? 'border-owa-cyan bg-owa-cyan text-owa-deep'
                          : 'border-owa-line bg-white text-owa-navy hover:bg-owa-sand'}"
                      >
                        <span class="block font-display text-[12px] leading-tight sm:text-[13px] font-black tracking-[0.03em] uppercase"
                          >${nombreTorneoOWA(c.torneo)}</span
                        >
                        <!-- El detalle de distancias se esconde en mobile: ya
                             vive en "Distancias y categorías" y acá hacía que
                             cada pestaña ocupara dos líneas y media. -->
                        <span data-nums class="mt-0.5 hidden text-[13px] sm:block font-bold leading-tight ${c === torneoActivo ? 'text-owa-deep' : 'text-owa-slate'}"
                          >${resumenTab(c)}</span
                        >
                      </button>
                    `
                  )}
                </div>

                <div class="reveal mt-5 overflow-hidden rounded-owa-lg bg-white text-owa-navy shadow-[var(--shadow-card)]" data-visible>
                  <!-- Nivel 2: día, como tabs de línea pegadas al borde de la
                       tarjeta — mismo padding horizontal que el resto del
                       contenido, para que se lea como una sola pieza y no
                       como un control flotando arriba. -->
                  <div class="flex gap-6 border-b border-owa-sand px-6.5" role="tablist" aria-label="Día">
                    ${torneoActivo.dias.map(
                      (d, i) => html`
                        <button
                          type="button"
                          data-cron-dia="${i}"
                          aria-pressed="${d === diaActivo ? 'true' : 'false'}"
                          class="u-press border-b-2 pt-5 pb-3 font-display text-[13px] font-black tracking-[0.03em] uppercase transition-colors duration-200 ease-out ${d ===
                          diaActivo
                            ? 'border-owa-blue text-owa-navy'
                            : 'border-transparent text-owa-slate hover:text-owa-navy'}"
                        >
                          ${diaCorto(d.fecha)}
                        </button>
                      `
                    )}
                  </div>

                  <div class="flex flex-wrap items-center gap-3 px-6.5 pt-5">
                    <p class="font-display text-[13px] font-black text-owa-navy">${diaActivo.lugar}</p>
                    ${torneoActivo.aviso ? html`<p class="text-[13px] text-owa-slate">${torneoActivo.aviso}</p>` : ''}
                  </div>
                  ${(() => {
                    const items = diaActivo.items;
                    // Un cronograma largo (12 ítems del Circuito, por ejemplo) se vuelve
                    // interminable en desktop en una sola columna. A partir de 7 ítems se
                    // reparte en dos — en mobile los <ol> igual quedan uno debajo del otro,
                    // así que ahí se sigue leyendo como una lista corrida.
                    if (items.length > 6) {
                      const mitad = Math.ceil(items.length / 2);
                      const col1 = items.slice(0, mitad);
                      const col2 = items.slice(mitad);
                      return html`
                        <div class="mt-3 grid pb-3 lg:grid-cols-2">
                          <ol>${col1.map((it, idx) => filaCron(it, idx, col1.length))}</ol>
                          <ol class="lg:border-l lg:border-owa-sand">${col2.map((it, idx) => filaCron(it, idx, col2.length))}</ol>
                        </div>
                      `;
                    }
                    return html` <ol class="mt-3 pb-3">
                      ${items.map((it, idx) => filaCron(it, idx, items.length))}
                    </ol>`;
                  })()}
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
    `}

    <!-- Fiscalización + video de contexto (hoy sólo el Cruce del Río de la
         Plata). Va después de las distancias del Challenge, en lugar del
         cronograma que esas travesías no tienen. -->
    ${esChallenge && (e.fiscalizacion || e.video)
      ? html`
          <section class="bg-white px-0 py-19 text-owa-navy" aria-labelledby="h-contexto">
            <div class="u-shell grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                ${eyebrow('Fiscalización')}
                ${e.fiscalizacion
                  ? html`
                      ${e.fiscalizacion.logo
                        ? html`<img
                            src="${e.fiscalizacion.logo}"
                            alt="${e.fiscalizacion.nombre}"
                            loading="lazy"
                            decoding="async"
                            class="mt-4 h-16 w-auto sm:h-20"
                          />`
                        : ''}
                      <h2 id="h-contexto" class="mt-3.5 text-[clamp(1.625rem,3.4vw,2.625rem)] leading-[0.96] text-owa-navy">
                        Fiscalización a cargo de ${e.fiscalizacion.nombre}
                      </h2>
                      <p class="mt-4 max-w-[52ch] text-base leading-[1.75] text-owa-slate">
                        La ${e.fiscalizacion.nombre} controla la seguridad y la validez del cruce.
                      </p>
                      <a
                        href="${e.fiscalizacion.href}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="u-nudge mt-6 inline-flex items-center gap-2 font-display text-[13px] font-black tracking-[0.06em] text-owa-blue uppercase"
                      >
                        ${e.fiscalizacion.href.replace(/^https?:\/\//, '')}
                        <span class="u-nudge-arrow inline-block" aria-hidden="true">→</span>
                      </a>
                    `
                  : ''}
              </div>
              ${e.video
                ? html`
                    <div>
                      <p class="font-display text-[15px] font-bold text-owa-navy">${e.video.titulo}</p>
                      <div class="mt-3.5 aspect-video overflow-hidden rounded-owa-lg border border-owa-line bg-black">
                        <iframe
                          class="h-full w-full"
                          src="https://www.youtube-nocookie.com/embed/${e.video.id}"
                          title="${e.video.titulo}"
                          loading="lazy"
                          referrerpolicy="strict-origin-when-cross-origin"
                          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowfullscreen
                        ></iframe>
                      </div>
                    </div>
                  `
                : ''}
            </div>
          </section>
        `
      : ''}

    <!-- Reseña histórica + Triple Corona (hoy sólo Blest a Villa Tacul). Ocupa
         el lugar de la sección de fiscalización/video. -->
    ${esChallenge && e.resena ? resenaHistorica(e) : ''}

    <!-- reglamento + kit — fuera de los Challenge, que no tienen kit -->
    ${esChallenge ? '' : html`
    <section class="u-shell pt-12 pb-20" aria-labelledby="h-reglamento">
      <div class="grid gap-4.5 lg:grid-cols-2">
        <div class="reveal rounded-owa-lg bg-owa-mist p-8" data-visible>
          ${eyebrow('Reglamento')}
          <h2 id="h-reglamento" class="mt-3.5 text-[clamp(1.375rem,2.6vw,1.875rem)] text-owa-navy">
            Lo que hay que saber antes de largar
          </h2>
          <p class="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-owa-slate">
            Neoprene, categorías, cortes de tiempo, causales de descalificación y protocolo de seguridad en el agua.
          </p>
          <!-- Todos los reglamentos viven en un solo lugar, no un PDF suelto por
               carrera: el general, el deportivo de cada torneo y los anexos. -->
          <div class="mt-6">${btnPrimario('Ver reglamentos', '/reglamentos')}</div>
        </div>

        <div class="reveal rounded-owa-lg border border-owa-line p-8" data-visible>
          ${eyebrow('Kit del nadador')}
          <h2 id="h-kit" class="mt-3.5 text-[clamp(1.375rem,2.6vw,1.875rem)] text-owa-navy">Qué te llevás</h2>
          ${f?.kit
            ? html`
                <ul class="mt-4.5">
                  ${f.kit.map((k) =>
                    // Con `d` (San Pedro, Ramallo y Colón no lo cargan) se
                    // muestra el estado de cada ítem —Incluido, A confirmar—
                    // igual que el placeholder genérico de abajo; sin `d`
                    // sigue como lista simple de nombres.
                    k.d
                      ? html`
                          <li class="flex items-baseline justify-between gap-3.5 border-t border-owa-sand py-3 text-sm">
                            <span class="text-owa-slate">${k.t}</span>
                            <span class="text-right font-display text-[13px] font-bold text-owa-navy">${k.d}</span>
                          </li>
                        `
                      : html`
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
        </div>
      </div>
    </section>
    `}

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

    ${bloqueSponsors(e)}
    <!-- En los Challenge la galería va después del CTA de postulación -->
    ${esChallenge ? '' : galeriaBloque(e)}

    <!-- cta final -->
    <!-- Las carreras cierran promocionando los beneficios de la comunidad. Los
         Challenge conservan su CTA de postulación: ese mail es el único camino
         para anotarse a esas travesías, no hay inscripción online. -->
    <section class="bg-owa-blue px-0 py-18 text-white">
      <!-- Apilado en mobile: con flex-1 el texto se encoge en vez de bajar, y
           la bajada terminaba en una columna de cinco líneas al lado del botón. -->
      <div class="u-shell flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div class="min-w-0 sm:flex-1">
          <!-- Con beneficios cargados el título nombra la fecha, que es lo que
               realmente hay del otro lado del botón; sin ellos queda el mensaje
               genérico de comunidad, que no promete nada que no exista. -->
          <p class="font-display text-[clamp(1.625rem,3.4vw,2.75rem)] leading-none font-black uppercase">
            ${esChallenge ? 'Postulate a este desafío' : beneficios ? 'Beneficios de esta fecha' : 'Beneficios Comunidad OWA'}
          </p>
          <p class="mt-2.5 text-[15px] text-white/80">
            ${esChallenge
              ? 'La organización responde cada postulación por WhatsApp.'
              : beneficios
                ? 'Inscribirte a esta carrera tiene sus ventajas.'
                : 'Ser parte de la comunidad OWA tiene sus ventajas.'}
          </p>
        </div>
        ${esChallenge
          ? btnAccent('Postularme', waPostulacion(e), '', 'target="_blank" rel="noopener noreferrer"')
          : beneficios
            ? btnAccent('Ver beneficios', beneficios, 'shrink-0')
            : ctaSinDestino('Ver beneficios')}
      </div>
    </section>

    ${esChallenge ? galeriaBloque(e) : ''}
  `);
}

export function mount(root, ctx) {
  root.querySelectorAll('[data-stagger]').forEach((g) => stagger(g));
  montarCarruseles(root);


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

    const tabBtn = e.target.closest('[data-recorrido-tab]');
    if (tabBtn && tabBtn.dataset.recorridoTab !== recorridoActivo) {
      recorridoActivo = tabBtn.dataset.recorridoTab;
      return repintar();
    }

    const cronTorneoBtn = e.target.closest('[data-cron-torneo]');
    if (cronTorneoBtn && +cronTorneoBtn.dataset.cronTorneo !== cronogramaSel.torneo) {
      cronogramaSel = { torneo: +cronTorneoBtn.dataset.cronTorneo, dia: 0 };
      return repintar();
    }

    const cronDiaBtn = e.target.closest('[data-cron-dia]');
    if (cronDiaBtn && +cronDiaBtn.dataset.cronDia !== cronogramaSel.dia) {
      cronogramaSel = { ...cronogramaSel, dia: +cronDiaBtn.dataset.cronDia };
      return repintar();
    }
  });
}
