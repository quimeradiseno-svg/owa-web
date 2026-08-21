import { html, raw } from '../lib/html.js';
import { foto } from '../lib/img.js';

/** Carrusel de láminas (mapas de recorrido, hoy). Scroll-snap nativo: el
    swipe/arrastre es del navegador, no hay que reimplementarlo. Las flechas y
    los puntos sólo llaman a scrollIntoView; la posición real se lee con un
    IntersectionObserver, así queda sincronizado pase lo que pase (flecha,
    punto, arrastre a mano o teclado). */
export function carrusel(id, slides, { sizes = '(min-width: 1280px) 1216px, 100vw' } = {}) {
  if (slides.length === 1) {
    return foto({
      slug: slides[0].slug,
      alt: slides[0].alt,
      sizes,
      className: 'block w-full',
      imgClass: 'w-full',
    });
  }

  return html`
    <div class="relative" data-carrusel="${id}">
      <div
        class="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        data-track
      >
        ${slides.map(
          (s, i) => html`
            <div
              class="w-full shrink-0 snap-start snap-always"
              data-slide
              role="group"
              aria-roledescription="lámina"
              aria-label="${i + 1} de ${slides.length}"
            >
              ${foto({ slug: s.slug, alt: s.alt, sizes, className: 'block w-full', imgClass: 'w-full' })}
            </div>
          `
        )}
      </div>

      <button
        type="button"
        data-prev
        aria-label="Lámina anterior"
        class="u-press absolute top-1/2 left-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-owa-navy shadow-[var(--shadow-card)] backdrop-blur transition-opacity duration-200 ease-out disabled:pointer-events-none disabled:opacity-0"
      >
        ${raw(
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-5" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>'
        )}
      </button>
      <button
        type="button"
        data-next
        aria-label="Lámina siguiente"
        class="u-press absolute top-1/2 right-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-owa-navy shadow-[var(--shadow-card)] backdrop-blur transition-opacity duration-200 ease-out disabled:pointer-events-none disabled:opacity-0"
      >
        ${raw(
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-5" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>'
        )}
      </button>

      <div class="absolute right-0 bottom-3 left-0 flex items-center justify-center gap-2" data-dots>
        ${slides.map(
          (_, i) => html`
            <button
              type="button"
              data-dot="${i}"
              aria-label="Ir a la lámina ${i + 1}"
              class="u-press size-2 rounded-full bg-white/60 transition-[background-color,width] duration-200 ease-out aria-[current=true]:w-5 aria-[current=true]:bg-white"
            ></button>
          `
        )}
      </div>
    </div>
  `;
}

export function montarCarruseles(root) {
  root.querySelectorAll('[data-carrusel]').forEach((car) => {
    const track = car.querySelector('[data-track]');
    const slides = [...car.querySelectorAll('[data-slide]')];
    const dots = [...car.querySelectorAll('[data-dot]')];
    const prev = car.querySelector('[data-prev]');
    const next = car.querySelector('[data-next]');
    if (!track || slides.length < 2) return;

    let actual = 0;

    const irA = (i) => {
      const destino = Math.max(0, Math.min(slides.length - 1, i));
      slides[destino].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    };

    prev.addEventListener('click', () => irA(actual - 1));
    next.addEventListener('click', () => irA(actual + 1));
    dots.forEach((d, i) => d.addEventListener('click', () => irA(i)));

    // Refleja la posición real del scroll (swipe, teclado, arrastre), no sólo
    // los clics propios — así nunca se desincroniza.
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((en) => en.isIntersecting);
        if (!visible) return;
        actual = slides.indexOf(visible.target);
        dots.forEach((d, i) => d.setAttribute('aria-current', i === actual ? 'true' : 'false'));
        prev.disabled = actual === 0;
        next.disabled = actual === slides.length - 1;
      },
      { root: track, threshold: 0.6 }
    );
    slides.forEach((s) => obs.observe(s));
  });
}
