import { html, raw, toHTML, stagger } from '../lib/html.js';
import { foto } from '../lib/img.js';
import { EVENTOS, CHALLENGES, km, sinIngreso } from '../data/eventos.js';
import { MADRES } from '../data/madres.js';
import { tarjetaFecha } from '../components/tarjeta-evento.js';
import { eyebrow, btnPrimarioChico, olaSuperior } from '../components/ui.js';
import { icono } from '../components/iconos.js';
import { bannerCTA } from '../components/banner-cta.js';
import { grafo, migas } from '../lib/schema.js';

export const titulo = (ctx) => MADRES[ctx.path.replace(/^\//, '')]?.titulo ?? 'Torneo';

// La descripción sale del propio intro de cada torneo: es el texto que ya
// resume la modalidad, así que no hay que escribir uno paralelo que después
// se desincronice.
export const descripcion = (ctx) => MADRES[ctx.path.replace(/^\//, '')]?.intro ?? '';

export const schema = (ctx) => {
  const m = MADRES[ctx.path.replace(/^\//, '')];
  return m ? grafo(migas([[m.titulo, ctx.path]])) : null;
};

// Nombre del torneo tal como figura en cada jornada. Sólo los dos puntuables
// tienen la grilla de cuatro fechas con distancias.
const TORNEO = { 'grand-prix': 'GRAND PRIX', circuito: 'CIRCUITO OWA' };

// El Grand Prix corre una sola distancia por fecha; el Circuito ofrece dos.
const DIST = {
  'grand-prix': (e) => km(e.distancias.gp),
  circuito: (e) => e.distancias.circuito.map(km).join(' · '),
};

const CTA_DESTINO = {
  'grand-prix': '/resultados?tab=gp',
  circuito: '/resultados?tab=circ',
  especiales: '/calendario',
  challenge: 'mailto:info@owa.com.ar?subject=Postulaci%C3%B3n%20OWA%20Challenge',
};

// El torneo que declara `campeones` usa el layout nuevo: resumen de tres
// datos en la columna y la distancia dentro de cada tarjeta. El que no, sigue
// con el listado "Las distancias" y tarjetas sin pastilla.
const conResumen = (key) => Boolean(MADRES[key]?.campeones);

/** Cada madre arma su lista de fechas distinto. */
function fechasDe(key) {
  if (key === 'especiales')
    return EVENTOS.filter((e) => e.tipo === 'especial').map((e, i) => ({
      e,
      orden: String(i + 1).padStart(2, '0'),
      linea: `${e.fechaCorta} ${e.anio}`,
      sublinea: e.nota || e.sede,
    }));

  if (key === 'challenge')
    return CHALLENGES.map((e) => ({
      e,
      orden: e.km,
      linea: e.sede,
      sublinea: e.ventana,
    }));

  return EVENTOS.filter((e) => e.tipo === 'core').map((e, i) => ({
    e,
    orden: `FECHA ${String(i + 1).padStart(2, '0')}`,
    // Sin ingreso a la ficha (ver `sinIngreso`), la fecha de la jornada no se
    // muestra: contradiría al chip "FECHA A CONFIRMAR" de la propia tarjeta.
    linea: sinIngreso(e) ? 'Fecha a confirmar' : e.jornadas.find((j) => j.torneo === TORNEO[key]).fecha,
    sublinea: e.sede,
    pill: conResumen(key) ? DIST[key](e) : '',
  }));
}

/** Los tres datos que resumen el torneo. Las dos primeras cifras salen del
    calendario real (si se agrega una fecha, se actualizan solas); la tercera
    la declara cada torneo, que sabe cuántos títulos reparte. */
const bloqueDatos = (key, m, fechas) => {
  const nums = EVENTOS.filter((e) => e.tipo === 'core').flatMap((e) =>
    key === 'grand-prix' ? [e.distancias.gp] : e.distancias.circuito
  );
  const rango = `${km(Math.min(...nums)).replace(' km', '')}–${km(Math.max(...nums))}`;
  const datos = [
    { i: 'calendario', n: String(fechas.length), t: 'fechas' },
    { i: 'ondas', n: rango, t: 'por fecha' },
    ...(m.campeones ? [{ i: 'trofeo', ...m.campeones }] : []),
  ];
  return html`
    <!-- Todos los ítems llevan separador y la lista se corre 28px a la
         izquierda (borde + padding), que el contenedor recorta: así el borde
         desaparece solo en el primero de CADA fila, no sólo en el primero de
         la lista. Mismo recurso que los rótulos del hero del home. -->
    <div class="mt-8 overflow-hidden">
      <ul class="ms-[-28px] flex flex-wrap items-center gap-y-5">
        ${datos.map(
          (d) => html`
            <li class="flex items-center gap-3 border-s border-owa-navy/12 px-7">
              <span class="shrink-0 text-owa-blue">${icono(d.i, 'size-6')}</span>
              <span>
                <span data-nums class="block font-display text-[1.375rem] leading-none font-black text-owa-navy">${d.n}</span>
                <span class="mt-1 block font-display text-[11px] font-bold tracking-[0.12em] text-owa-slate uppercase">${d.t}</span>
              </span>
            </li>
          `
        )}
      </ul>
    </div>
  `;
};

/** Franja de premio, sección propia entre el bloque de info y las fechas —no
    en el hero, para no competir con el título. Mismo molde que la placa
    "Cada brazada suma" del ranking en home.js: card navy angosta, ícono a la
    izquierda, texto al lado. Sin foto de fondo (ahí sí la lleva) porque acá
    el premio tiene que ser lo único que se lea.

    El titular va partido en `lead` + `destacado` + `cierre` para poder
    resaltar en cyan sólo la parte que importa: el monto en Grand Prix, el
    destino en Circuito. `href` es opcional — sólo Circuito lo usa, porque su
    premio (Swim GP Portugal) sí tiene una página adonde ir. */
/** EXPERIMENTO (Grand Prix) — arquitectura alternativa.
    Las distancias, agrupadas por sede en vez de listadas en filas. Conserva la
    relación real sede → distancia; no las agrupa en categorías genéricas.
    OJO: en Grand Prix cada sede corre UNA sola distancia (8, 18, 12 y 10 km),
    así que cada tarjeta muestra un número. Circuito sí tiene dos por fecha. */
// Para no dejar el "cuatro" del copy escrito a mano: si algún día el torneo
// suma o pierde una sede, el texto acompaña. Más allá de nueve vuelve al número.
const PALABRA = ['cero', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
const enPalabras = (n) => PALABRA[n] ?? String(n);

const bloqueDistanciasPorFecha = (key) => {
  const sedes = EVENTOS.filter((e) => e.tipo === 'core');
  const n = sedes.length;
  return html`
    <div class="rounded-owa-lg bg-owa-mist p-7.5">
      <h3 class="font-display text-[17px] font-black text-owa-navy">Las ${n} fechas del Grand Prix</h3>
      <p class="mt-1.5 text-sm text-owa-slate">
        ${`${enPalabras(n)[0].toUpperCase()}${enPalabras(n).slice(1)}`} sedes, ${enPalabras(n)} distancias. Elegí tu desafío.
      </p>
      <ul class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        ${sedes.map((e) => {
          const kms = key === 'grand-prix' ? [e.distancias.gp] : e.distancias.circuito;
          // La mini-tarjeta no manda a la ficha: baja hasta la tarjeta de esa
          // sede en el calendario de abajo, que es la que sí decide entrar.
          // Duplicar el link a /carrera competía con el CTA real.
          return html`
            <li class="contents">
              <a
                href="#fecha-${e.slug}"
                class="u-lift-sm group flex flex-col items-center rounded-owa-md bg-white px-3 py-5 text-center transition-shadow duration-250 ease-out hover:shadow-[var(--shadow-elevated)]"
              >
                <span class="text-owa-blue">${icono('ondas', 'size-6')}</span>
                <span class="mt-3 font-display text-[11px] leading-tight font-black tracking-[0.06em] text-owa-navy uppercase">
                  ${e.corto}
                </span>
                <span class="mt-3 grid gap-1">
                  ${kms.map(
                    (num) =>
                      html`<span data-nums class="block font-display text-lg leading-none font-black text-owa-blue">${km(num)}</span>`
                  )}
                </span>
                <span class="mt-3 font-display text-[11px] font-bold tracking-[0.06em] text-owa-blue">
                  Ver fecha
                  <span class="inline-block transition-transform duration-200 ease-out group-hover:translate-y-0.5" aria-hidden="true">↓</span>
                </span>
              </a>
            </li>
          `;
        })}
      </ul>
    </div>
  `;
};

/** EXPERIMENTO (Grand Prix) — el sistema de puntaje deja de ser una caja
    lateral y pasa a franja de ancho completo, con los criterios en fila.
    Usa exactamente los mismos `cajaItems` que la caja original: no se copian
    las reglas de Circuito, que tiene una quinta propia (puntos por especiales). */
const bloquePuntaje = (key, m) => html`
  <section class="u-shell pt-16">
    <div class="rounded-owa-lg bg-owa-mist px-7.5 py-10 sm:px-10">
      <!-- Los CTA van arriba, al lado del título: abajo y centrados quedaban
           sueltos, colgando de la fila de criterios. -->
      <div class="flex flex-wrap items-start justify-between gap-x-8 gap-y-5">
        <div>
          ${eyebrow(m.cajaTitulo)}
          <h2 class="mt-3 text-[clamp(1.5rem,2.8vw,2.125rem)] leading-[1]">¿Cómo sumás puntos?</h2>
          <p class="mt-2.5 text-sm text-owa-slate">Cada nadador suma puntos en cada fecha según distintos criterios.</p>
        </div>
        <div class="flex w-full flex-wrap gap-2.5 sm:w-auto">
          ${btnPrimarioChico(m.cajaCta, CTA_DESTINO[key], 'w-full justify-center sm:w-auto')}
          ${m.reglamento
            ? html`<a
                href="${m.reglamento}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn u-press u-nudge w-full justify-center sm:w-auto h-auto min-h-0 gap-2.5 border-2 border-owa-navy bg-transparent px-4.5 py-3 font-display text-[12px] font-black tracking-[0.06em] text-owa-navy hover:bg-owa-navy hover:text-white"
                >REGLAMENTO <span class="u-nudge-arrow" aria-hidden="true">↗</span></a
              >`
            : ''}
        </div>
      </div>

      <!-- Una columna por criterio: Grand Prix tiene 4, Circuito 5. El grid se
           arma con la cantidad real para no dejar un hueco al final. -->
      <ul class="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2 ${m.cajaItems.length === 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'}">
        ${m.cajaItems.map(
          (i) => html`
            <li class="text-center sm:border-l sm:border-owa-navy/12 sm:px-5 sm:first:border-l-0">
              ${i.i ? html`<span class="inline-block text-owa-blue">${icono(i.i, 'size-7')}</span>` : ''}
              <p class="mt-3 font-display text-[13px] leading-tight font-black tracking-[0.05em] text-owa-navy uppercase">${i.t}</p>
              <p class="mt-2 text-sm leading-relaxed text-owa-slate">${raw(i.d)}</p>
            </li>
          `
        )}
      </ul>
    </div>
  </section>
`;

const bloquePremio = (p) => html`
  <section class="u-shell pt-14">
    <div class="reveal flex flex-col items-start gap-5 rounded-owa-lg bg-owa-navy p-7 sm:flex-row sm:items-center sm:p-8">
      <span class="grid size-14 shrink-0 place-items-center rounded-full bg-white/10 text-owa-cyan">
        ${icono(p.icono || 'trofeo', 'size-7')}
      </span>
      <div>
        <p class="font-display text-[11px] font-bold tracking-[0.14em] text-owa-sky uppercase">${p.temporada}</p>
        <p data-nums class="mt-2 font-display text-[clamp(1.5rem,2.8vw,2rem)] leading-[1.1] font-black text-white">
          ${p.lead} <span class="text-owa-cyan">${p.destacado}</span> ${p.cierre}
        </p>
        <p class="mt-2 max-w-[54ch] text-sm leading-relaxed text-owa-line">${p.detalle}</p>
        ${p.href
          ? html`<a
              href="${p.href}"
              class="u-nudge mt-3.5 inline-flex items-center gap-2 border-b border-owa-cyan/50 pb-0.5 font-display text-[12px] font-black tracking-[0.08em] text-owa-cyan uppercase transition-colors hover:border-owa-cyan"
              >${p.hrefLabel} <span class="u-nudge-arrow" aria-hidden="true">→</span></a
            >`
          : ''}
      </div>
    </div>
  </section>
`;

/** Desglose de distancias por fecha. Cierra el dato que el intro promete
    ("entre 8 y 18 km") y nunca detallaba, y de paso empareja la altura de la
    columna izquierda con la caja de puntaje. */
const bloqueDistancias = (key) => html`
  <div class="mt-9">
    <h3 class="u-eyebrow text-owa-blue">Las distancias</h3>
    <ul class="mt-4">
      ${EVENTOS.filter((e) => e.tipo === 'core').map((e, i) => {
        // La sigla es la de la jornada que se está mirando: San Pedro es VOB
        // en Grand Prix y SNP en Circuito; Colón, LBC y CLN.
        const j = e.jornadas.find((x) => x.torneo === TORNEO[key]);
        return html`
          <li class="border-t border-owa-navy/12">
            <!-- Toda la fila es el link a la ficha: el nombre solo es un blanco
                 chico y el dato de distancia, que es lo que se viene a mirar,
                 quedaría fuera del área clickeable. -->
            <${sinIngreso(e) ? 'div' : 'a'}
              ${raw(sinIngreso(e) ? '' : `href="/carrera/${e.slug}"`)}
              class="group -mx-2 flex items-baseline justify-between gap-4 rounded-owa-md px-2 py-3 transition-colors duration-200 ease-out hover:bg-owa-mist/60"
            >
              <span class="flex min-w-0 items-center gap-2.5">
                <span data-nums class="font-display text-[13px] font-black text-owa-slate">${String(i + 1).padStart(2, '0')}</span>
                <span class="font-display text-[13px] font-black tracking-[0.1em] text-owa-blue">${j.sigla}</span>
                <!-- El separador va como borde, no como carácter "|": un glifo
                     decorativo tan tenue no llega al contraste mínimo de texto,
                     y además ensucia el árbol de accesibilidad. -->
                <span
                  class="truncate border-l border-owa-navy/20 pl-2.5 font-display text-[15px] font-bold text-owa-navy uppercase group-hover:underline"
                  >${e.corto}</span
                >
              </span>
              <span data-nums class="font-display text-[17px] font-black whitespace-nowrap text-owa-blue">
                ${DIST[key](e)}
              </span>
            </${sinIngreso(e) ? 'div' : 'a'}>
          </li>
        `;
      })}
    </ul>
  </div>
`;

/** Las tres travesías con su logo. El logo ya dice la sigla y los kilómetros
    (BVT21, RDP40, SNP70), así que al lado sólo va el recorrido — repetir el
    nombre sería decir dos veces lo mismo. */
const bloqueTravesias = () => html`
  <div class="mt-9">
    <h3 class="u-eyebrow text-owa-blue">Los desafíos</h3>
    <ul class="mt-4">
      ${CHALLENGES.map(
        (c) => html`
          <li class="flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-owa-navy/12 py-4">
            <img
              src="/brand/travesias/${c.slug.toUpperCase()}.svg"
              alt="${c.sigla} ${c.km}"
              width="120"
              height="21"
              class="h-[21px] w-auto shrink-0"
            />
            <span class="text-sm text-owa-slate">${c.sede}</span>
          </li>
        `
      )}
    </ul>
  </div>
`;

/** Los cuatro especiales con su escenario. Es el dato que el intro promete
    ("mar, lago y río") y que las tarjetas de abajo no muestran: ahí ya van la
    fecha y la sede. */
const bloqueEscenarios = () => html`
  <div class="mt-9">
    <h3 class="u-eyebrow text-owa-blue">Dónde se corren</h3>
    <ul class="mt-4">
      ${EVENTOS.filter((e) => e.tipo === 'especial').map(
        (e) => html`
          <li class="flex items-baseline justify-between gap-4 border-t border-owa-navy/12 py-3">
            <span class="flex min-w-0 items-center gap-2.5">
              <span class="font-display text-[13px] font-black tracking-[0.1em] text-owa-blue">${e.sigla}</span>
              <span
                class="truncate border-l border-owa-navy/20 pl-2.5 font-display text-[15px] font-bold text-owa-navy uppercase"
                >${e.corto}</span
              >
            </span>
            <span class="font-display text-[13px] font-black tracking-[0.12em] whitespace-nowrap text-owa-slate">
              ${e.escenario}
            </span>
          </li>
        `
      )}
    </ul>
  </div>
`;

export function render(ctx) {
  const key = ctx.path.replace(/^\//, '');
  const m = MADRES[key];
  if (!m) return '<div class="u-shell py-40"><h1>Torneo no encontrado</h1></div>';

  const fechas = fechasDe(key);

  // EXPERIMENTO (Grand Prix) — arquitectura alternativa: distancias por sede a
  // la derecha, puntaje a lo ancho, y el premio después del calendario.
  // Circuito queda con el orden actual a propósito, para poder comparar las
  // dos. Para volver atrás, dejar esto en false.
  const nuevoOrden = key === 'grand-prix';

  return toHTML(html`
    <section class="relative overflow-hidden bg-owa-navy px-0 pt-18 pb-16 text-white">
      <!-- La foto se desvanece hacia la izquierda con una máscara: sin ella el
           borde del bloque corta el navy con una línea vertical muy visible. -->
      <div
        class="absolute inset-y-0 right-0 hidden w-[56%] md:block"
        aria-hidden="true"
        style="mask-image:linear-gradient(90deg,transparent 0%,#000 52%);-webkit-mask-image:linear-gradient(90deg,transparent 0%,#000 52%)"
      >
        ${foto({
          slug: m.img,
          alt: '',
          sizes: '56vw',
          priority: true,
          className: 'block h-full w-full',
          // Espejado opcional por foto: el panel sólo se ve a partir del 52%
          // del ancho, así que el sujeto tiene que caer del lado derecho del
          // encuadre original o la máscara se lo come. imgPos idem para el
          // recorte vertical — el panel es bajo y ancho (2.5:1), así que el
          // centrado por defecto suele perderse la parte útil de la foto.
          imgClass: `h-full w-full object-cover opacity-45 ${m.imgEspejo ? 'scale-x-[-1]' : ''} ${m.imgPos === 'bottom' ? 'object-bottom' : ''}`,
        })}
      </div>

      <div class="u-shell relative">
        ${eyebrow(m.kicker, 'sky')}
        <!-- 6vw/5.375rem quedaba enorme en notebook (1280-1536px): mismo
             ajuste que el título del hero del home, curva y techo más
             chicos para que en esas resoluciones lea como titular de
             sección, no como cartel. -->
        <h1 class="mt-4 text-[clamp(2.375rem,4.5vw,4.25rem)] leading-[0.9]">${m.titulo}</h1>
        <p class="mt-6 max-w-[54ch] text-[17px] leading-relaxed text-owa-line">${m.intro}</p>
      </div>

      ${olaSuperior('#fff')}
    </section>

    <div class="u-shell grid gap-12 pt-18 ${nuevoOrden ? 'lg:grid-cols-[43fr_57fr]' : 'lg:grid-cols-2'}">
      <!-- Padding derecho sólo en desktop: mete las distancias hacia adentro
           en vez de dejarlas pegadas al borde de la columna. -->
      <div class="${nuevoOrden ? '' : 'lg:pr-20'}">
        ${eyebrow(m.bloque1Kicker)}
        <h2 class="mt-3.5 text-[clamp(1.625rem,3.2vw,2.5rem)] leading-[0.98]">${m.bloque1Titulo}</h2>
        <!-- bloque1Texto puede ser un string o varios párrafos. -->
        <div class="mt-4.5 grid max-w-[62ch] gap-3.5 text-base leading-[1.75] text-owa-slate">
          ${[].concat(m.bloque1Texto).map((t) => html`<p>${t}</p>`)}
        </div>
        <!-- Cada madre llena la columna con el dato que le falta a sus tarjetas.
             Con el orden nuevo las distancias se van a la columna derecha, así
             que acá queda sólo el texto. -->
        ${nuevoOrden ? '' : DIST[key] ? (conResumen(key) ? bloqueDatos(key, m, fechas) : bloqueDistancias(key)) : ''}
        ${key === 'challenge' ? bloqueTravesias() : ''} ${key === 'especiales' ? bloqueEscenarios() : ''}
      </div>

      ${nuevoOrden
        ? bloqueDistanciasPorFecha(key)
        : html`<div class="rounded-owa-lg bg-owa-mist p-7.5 pt-12 pl-9 pr-9 lg:pr-24">
        <h3 class="font-display text-[17px] font-black text-owa-navy">${m.cajaTitulo}</h3>
        <ul class="mt-4">
          ${m.cajaItems.map((i) =>
            // Un ítem con nombre propio no necesita bullet: el título en Vito
            // Black hace de ancla y deja la regla escaneable de un vistazo.
            typeof i === 'string'
              ? html`
                  <li class="flex gap-3 border-t border-owa-navy/10 py-2.75">
                    <span class="font-display font-black text-owa-blue" aria-hidden="true">·</span>
                    <span class="text-sm leading-relaxed text-owa-slate">${i}</span>
                  </li>
                `
              : html`
                  <li class="flex gap-4 border-t border-owa-navy/12 py-3.5">
                    ${i.i ? html`<span class="mt-0.5 shrink-0 text-owa-blue">${icono(i.i)}</span>` : ''}
                    <span class="min-w-0">
                      <span class="block font-display text-[13px] font-black tracking-[0.05em] text-owa-navy uppercase"
                        >${i.t}</span
                      >
                      <span class="mt-1.5 block text-sm leading-relaxed text-owa-slate">${raw(i.d)}</span>
                    </span>
                  </li>
                `
          )}
        </ul>
        <div class="mt-5 flex flex-wrap gap-2">
          <!-- Ancho completo en mobile: el boton de daisyUI no encoge
               (flex-shrink 0) y etiquetas largas como "ESCRIBIR A LA
               ORGANIZACIÓN" se desbordaban de la caja. -->
          ${btnPrimarioChico(m.cajaCta, CTA_DESTINO[key], 'w-full justify-center sm:w-auto')}
          ${m.reglamento
            ? html`<a
                href="${m.reglamento}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn u-press u-nudge w-full justify-center sm:w-auto h-auto min-h-0 gap-2.5 border-2 border-owa-navy bg-transparent px-4.5 py-3 font-display text-[12px] font-black tracking-[0.06em] text-owa-navy hover:bg-owa-navy hover:text-white"
                >REGLAMENTO <span class="u-nudge-arrow" aria-hidden="true">↗</span></a
              >`
            : ''}
        </div>
      </div>`}
    </div>

    <!-- Orden nuevo: puntaje a lo ancho después de la introducción, y el premio
         recién después del calendario — la recompensa se muestra cuando el
         nadador ya vio dónde y cuándo compite. -->
    ${nuevoOrden ? bloquePuntaje(key, m) : ''} ${nuevoOrden ? '' : m.premio ? bloquePremio(m.premio) : ''}

    <section class="u-shell pt-16 ${nuevoOrden ? 'pb-4' : 'pb-24'}" aria-labelledby="h-fechas">
      <h2 id="h-fechas" class="u-eyebrow text-owa-blue">${m.listaKicker}</h2>
      <!-- Challenge tiene 3 desafíos, no 4 como el resto de las madres: con
           lg:grid-cols-4 quedaba un cuarto lugar vacío como si faltara algo.
           Pinneado a esta categoría a propósito, no a "cuando hay 3 items". -->
      <div class="mt-6 grid gap-4 sm:grid-cols-2 ${key === 'challenge' ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}" data-stagger>
        ${fechas.map((f) =>
          tarjetaFecha(f.e, {
            orden: f.orden,
            linea: f.linea,
            sublinea: f.sublinea,
            estado: key !== 'challenge',
            pill: f.pill,
            // Destino de las mini-tarjetas de arriba en Grand Prix. No molesta
            // en las otras madres: es sólo un id sobre la tarjeta.
            id: `fecha-${f.e.slug}`,
          })
        )}
      </div>
    </section>

    ${nuevoOrden ? html`<div class="pb-20">${m.premio ? bloquePremio(m.premio) : ''}</div>` : ''}
    ${m.banner ? bannerCTA(m.banner) : ''}
  `);
}

export function mount(root) {
  root.querySelectorAll('[data-stagger]').forEach((g) => stagger(g));
}
