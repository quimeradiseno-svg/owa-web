import { html, raw } from './html.js';
import { LQIP } from '../data/media-lqip.js';

const WIDTHS = [480, 960, 1250];

const setFor = (slug, ext) =>
  WIDTHS.filter((w) => w <= 1250)
    .map((w) => `/img/${slug}-${w}.${ext} ${w}w`)
    .join(', ');

/**
 * <picture> responsive con AVIF → WebP → JPEG y placeholder borroso inline.
 * Las fotos verticales sólo tienen la variante de 480px, así que se recorta
 * el srcset a lo que existe en disco.
 */
export function foto({ slug, alt, sizes = '100vw', className = '', imgClass = '', priority = false, position = 'center' }) {
  const meta = LQIP[slug];
  if (!meta) throw new Error(`Falta la foto "${slug}" — corré npm run images`);

  // Vertical (833px de ancho): sólo se generó el corte de 480.
  const disponibles = meta.r < 1 ? [480] : WIDTHS;
  const srcset = (ext) => disponibles.map((w) => `/img/${slug}-${w}.${ext} ${w}w`).join(', ');

  return html`
    <picture class="${className}">
      <source type="image/avif" srcset="${srcset('avif')}" sizes="${sizes}" />
      <source type="image/webp" srcset="${srcset('webp')}" sizes="${sizes}" />
      <img
        src="/img/${slug}.jpg"
        alt="${alt}"
        ${raw(priority ? 'fetchpriority="high" decoding="sync"' : 'loading="lazy" decoding="async"')}
        class="img-fade ${imgClass}"
        style="background-image:url('${meta.d}');background-size:cover;background-position:${position}"
        onload="this.dataset.loaded=''"
      />
    </picture>
  `;
}

/** Foto de fondo a sangre, con la clase de deriva opcional del hero. */
export function fondo({ slug, alt = '', opacity = 0.62, drift = false, priority = false, sizes = '100vw' }) {
  return html`
    <div class="absolute inset-0 overflow-hidden" aria-hidden="${alt ? 'false' : 'true'}">
      <div class="absolute inset-0 ${drift ? 'hero-drift' : ''}">
        ${foto({
          slug,
          alt,
          sizes,
          priority,
          className: 'block h-full w-full',
          imgClass: `h-full w-full object-cover`,
        })}
      </div>
      <div class="absolute inset-0 bg-owa-abyss" style="opacity:${1 - opacity}"></div>
    </div>
  `;
}

/**
 * Foto de fondo a sangre con un loop de video encima. El poster (misma
 * `foto()` de siempre, con su LQIP) queda debajo y es lo único que se ve:
 * - sin JS,
 * - mientras el video decodifica su primer frame,
 * - y con `prefers-reduced-motion: reduce`, donde `montarFondoVideo` directamente
 *   no intenta reproducirlo.
 * `mp4` alcanza para todo (Safari incluido); no vale la pena duplicar en WebM
 * un clip que ya pesa unos pocos MB.
 */
export function fondoVideo({ slug, posterSlug, mp4, alt = '', opacity = 0.62, sizes = '100vw' }) {
  return html`
    <div class="absolute inset-0 overflow-hidden" aria-hidden="${alt ? 'false' : 'true'}">
      ${foto({
        slug: posterSlug,
        alt,
        sizes,
        priority: true,
        className: 'absolute inset-0 block h-full w-full',
        imgClass: 'h-full w-full object-cover',
      })}
      <video
        data-fondo-video
        class="video-fade absolute inset-0 h-full w-full object-cover"
        muted
        loop
        playsinline
        preload="none"
        aria-hidden="true"
      >
        <source data-src="${mp4}" type="video/mp4" />
      </video>
      <div class="absolute inset-0 bg-owa-abyss" style="opacity:${1 - opacity}"></div>
    </div>
  `;
}

/** Activa el <video> de `fondoVideo` salvo que el usuario pida menos movimiento.
    `preload="none"` + fuente en `data-src` hasta acá: así una visita con
    reduced-motion nunca dispara ni la descarga del clip. */
export function montarFondoVideo(root) {
  const video = root.querySelector('[data-fondo-video]');
  if (!video) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const source = video.querySelector('source[data-src]');
  source.src = source.dataset.src;
  video.addEventListener('canplaythrough', () => video.setAttribute('data-ready', ''), { once: true });
  video.load();
  video.play().catch(() => {}); // autoplay bloqueado (ahorro de datos, etc.): se queda el poster
}

export { WIDTHS, setFor };
