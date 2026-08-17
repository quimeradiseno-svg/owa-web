import { html, toHTML } from '../lib/html.js';
import { fondo } from '../lib/img.js';
import { TRAVEL_INCLUYE } from '../data/madres.js';
import { eyebrow, btnPrimario, btnBorde, olaSuperior, pendiente } from '../components/ui.js';

export const titulo = 'OWA Travel';

export function render() {
  return toHTML(html`
    <section class="relative flex min-h-[60svh] items-end overflow-hidden bg-owa-abyss">
      ${fondo({
        slug: 'travel-playa',
        alt: 'Grupo de nadadores abrazados antes de una largada',
        opacity: 0.68,
        priority: true,
      })}
      <div class="u-hero-scrim-sm absolute inset-0"></div>
      ${olaSuperior('#fff')}
      <div class="u-shell relative pt-28 pb-19 text-white">
        ${eyebrow('OWA Travel', 'sky')}
        <h1 class="mt-4 text-[clamp(2.375rem,6.4vw,6rem)] leading-[0.9]">Viajar<br />para nadar</h1>
      </div>
    </section>

    <div class="u-shell grid items-start gap-13 pt-18 pb-24 lg:grid-cols-2">
      <div>
        <h2 class="text-[clamp(1.625rem,3.2vw,2.5rem)] leading-[0.98]">Todo resuelto<br />menos nadar</h2>
        <p class="mt-4 max-w-[60ch] text-[17px] leading-[1.75] text-owa-slate">
          Viajes grupales a competencias fuera del calendario local: traslados, hospedaje y acompañamiento de la
          organización durante toda la estadía. Vas con el grupo, competís y volvés sin ocuparte de la logística.
        </p>
      </div>

      <div class="rounded-owa-lg bg-owa-mist p-8">
        <h3 class="u-eyebrow text-owa-blue">Próximo destino</h3>
        <p class="mt-3 font-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[0.96] font-black text-owa-navy uppercase">
          Búzios<br />mayo 2027
        </p>
        <ul class="mt-4.5">
          ${TRAVEL_INCLUYE.map(
            (i) => html`
              <li class="flex gap-3 border-t border-owa-navy/10 py-2.75">
                <span class="font-display font-black text-owa-blue" aria-hidden="true">·</span>
                <span class="text-sm leading-relaxed text-owa-slate">${i}</span>
              </li>
            `
          )}
        </ul>
        <div class="mt-6 flex flex-wrap gap-2.5">
          ${btnPrimario('Consultar por WhatsApp', 'https://wa.me/')} ${btnBorde('Pedir el detalle', 'mailto:info@owa.com.ar?subject=OWA%20Travel')}
        </div>
        ${pendiente('Canal de contacto a definir con OWA (formulario o WhatsApp).')}
      </div>
    </div>
  `);
}
