import { html, toHTML, stagger } from '../lib/html.js';
import { foto } from '../lib/img.js';
import { EVENTOS, CHALLENGES } from '../data/eventos.js';
import { MADRES } from '../data/madres.js';
import { tarjetaFecha } from '../components/tarjeta-evento.js';
import { eyebrow, btnPrimario, olaSuperior } from '../components/ui.js';

export const titulo = (ctx) => MADRES[ctx.path.replace(/^\//, '')]?.titulo ?? 'Torneo';

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
      sublinea: 'Fecha por edición · a confirmar',
    }));

  const torneo = key === 'grand-prix' ? 'GRAND PRIX' : 'CIRCUITO OWA';
  return EVENTOS.filter((e) => e.tipo === 'core').map((e, i) => ({
    e,
    orden: `FECHA ${String(i + 1).padStart(2, '0')}`,
    linea: e.jornadas.find((j) => j.torneo === torneo).fecha,
    sublinea: e.sede,
  }));
}

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
        <h1 class="mt-4 text-[clamp(2.375rem,6vw,5.375rem)] leading-[0.9]">${m.titulo}</h1>
        <p class="mt-6 max-w-[54ch] text-[17px] leading-relaxed text-owa-line">${m.intro}</p>
      </div>

      ${olaSuperior('#fff')}
    </section>

    <div class="u-shell grid gap-12 pt-18 lg:grid-cols-2">
      <div>
        ${eyebrow(m.bloque1Kicker)}
        <h2 class="mt-3.5 text-[clamp(1.625rem,3.2vw,2.5rem)] leading-[0.98]">${m.bloque1Titulo}</h2>
        <p class="mt-4.5 max-w-[62ch] text-base leading-[1.75] text-owa-slate">${m.bloque1Texto}</p>
      </div>

      <div class="rounded-owa-lg bg-owa-mist p-7.5">
        <h3 class="font-display text-[17px] font-black text-owa-navy">${m.cajaTitulo}</h3>
        <ul class="mt-4">
          ${m.cajaItems.map(
            (i) => html`
              <li class="flex gap-3 border-t border-owa-navy/10 py-2.75">
                <span class="font-display font-black text-owa-blue" aria-hidden="true">·</span>
                <span class="text-sm leading-relaxed text-owa-slate">${i}</span>
              </li>
            `
          )}
        </ul>
        <div class="mt-5">${btnPrimario(m.cajaCta, CTA_DESTINO[key])}</div>
      </div>
    </div>

    <section class="u-shell pt-16 pb-24" aria-labelledby="h-fechas">
      <h2 id="h-fechas" class="u-eyebrow text-owa-blue">${m.listaKicker}</h2>
      <!-- Challenge tiene 3 desafíos, no 4 como el resto de las madres: con
           lg:grid-cols-4 quedaba un cuarto lugar vacío como si faltara algo.
           Pinneado a esta categoría a propósito, no a "cuando hay 3 items". -->
      <div class="mt-6 grid gap-4 sm:grid-cols-2 ${key === 'challenge' ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}" data-stagger>
        ${fechas.map((f) => tarjetaFecha(f.e, { orden: f.orden, linea: f.linea, sublinea: f.sublinea }))}
      </div>
    </section>
  `);
}

export function mount(root) {
  root.querySelectorAll('[data-stagger]').forEach((g) => stagger(g));
}
