import { html, raw, toHTML, stagger } from '../lib/html.js';
import { foto } from '../lib/img.js';
import { EVENTOS, CHALLENGES, km } from '../data/eventos.js';
import { MADRES } from '../data/madres.js';
import { tarjetaFecha } from '../components/tarjeta-evento.js';
import { eyebrow, btnPrimario, olaSuperior } from '../components/ui.js';
import { icono } from '../components/iconos.js';
import { bannerCTA } from '../components/banner-cta.js';

export const titulo = (ctx) => MADRES[ctx.path.replace(/^\//, '')]?.titulo ?? 'Torneo';

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
    linea: e.jornadas.find((j) => j.torneo === TORNEO[key]).fecha,
    sublinea: e.sede,
  }));
}

/** Desglose de distancias por fecha. Cierra el dato que el intro promete
    ("entre 8 y 18 km") y nunca detallaba, y de paso empareja la altura de la
    columna izquierda con la caja de puntaje. */
const bloqueDistancias = (key) => html`
  <div class="mt-9">
    <h3 class="u-eyebrow text-owa-blue">Las distancias</h3>
    <ul class="mt-4">
      ${EVENTOS.filter((e) => e.tipo === 'core').map((e) => {
        // La sigla es la de la jornada que se está mirando: San Pedro es VOB
        // en Grand Prix y SNP en Circuito; Colón, LBC y CLN.
        const j = e.jornadas.find((x) => x.torneo === TORNEO[key]);
        return html`
          <li class="border-t border-owa-navy/12">
            <!-- Toda la fila es el link a la ficha: el nombre solo es un blanco
                 chico y el dato de distancia, que es lo que se viene a mirar,
                 quedaría fuera del área clickeable. -->
            <a
              href="/carrera/${e.slug}"
              class="group -mx-2 flex items-baseline justify-between gap-4 rounded-owa-md px-2 py-3 transition-colors duration-200 ease-out hover:bg-owa-mist/60"
            >
              <span class="flex min-w-0 items-center gap-2.5">
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
            </a>
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

    <div class="u-shell grid gap-12 pt-18 lg:grid-cols-2">
      <div>
        ${eyebrow(m.bloque1Kicker)}
        <h2 class="mt-3.5 text-[clamp(1.625rem,3.2vw,2.5rem)] leading-[0.98]">${m.bloque1Titulo}</h2>
        <!-- bloque1Texto puede ser un string o varios párrafos. -->
        <div class="mt-4.5 grid max-w-[62ch] gap-3.5 text-base leading-[1.75] text-owa-slate">
          ${[].concat(m.bloque1Texto).map((t) => html`<p>${t}</p>`)}
        </div>
        <!-- Cada madre llena la columna con el dato que le falta a sus tarjetas. -->
        ${DIST[key] ? bloqueDistancias(key) : ''} ${key === 'challenge' ? bloqueTravesias() : ''}
        ${key === 'especiales' ? bloqueEscenarios() : ''}
      </div>

      <div class="rounded-owa-lg bg-owa-mist p-7.5 px-9 pt-12">
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
        <div class="mt-5 flex flex-wrap gap-2.5">
          ${btnPrimario(m.cajaCta, CTA_DESTINO[key])}
          ${m.reglamento
            ? html`<a
                href="${m.reglamento}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn u-press u-nudge h-auto min-h-0 gap-2.5 border-2 border-owa-navy bg-transparent px-7 py-3.5 font-display text-[13px] font-black tracking-[0.06em] text-owa-navy hover:bg-owa-navy hover:text-white"
                >REGLAMENTO <span class="u-nudge-arrow" aria-hidden="true">↗</span></a
              >`
            : ''}
        </div>
      </div>
    </div>

    <section class="u-shell pt-16 pb-24" aria-labelledby="h-fechas">
      <h2 id="h-fechas" class="u-eyebrow text-owa-blue">${m.listaKicker}</h2>
      <!-- Challenge tiene 3 desafíos, no 4 como el resto de las madres: con
           lg:grid-cols-4 quedaba un cuarto lugar vacío como si faltara algo.
           Pinneado a esta categoría a propósito, no a "cuando hay 3 items". -->
      <div class="mt-6 grid gap-4 sm:grid-cols-2 ${key === 'challenge' ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}" data-stagger>
        ${fechas.map((f) =>
          tarjetaFecha(f.e, { orden: f.orden, linea: f.linea, sublinea: f.sublinea, estado: key !== 'challenge' })
        )}
      </div>
    </section>

    ${m.banner ? bannerCTA(m.banner) : ''}
  `);
}

export function mount(root) {
  root.querySelectorAll('[data-stagger]').forEach((g) => stagger(g));
}
