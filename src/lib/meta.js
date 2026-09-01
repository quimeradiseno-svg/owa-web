// Metadatos por ruta: título, descripción, canonical, Open Graph, Twitter y
// datos estructurados.
//
// Cada vista puede exportar `descripcion` y `schema` además de `titulo`, con la
// misma forma: un valor o una función que recibe el ctx. El router llama a
// `aplicarMeta()` en cada navegación.
//
// Mientras el sitio se sirva como SPA esto corre en el cliente: alcanza para
// Google (que renderiza JS) pero NO para los previsualizadores de WhatsApp o
// Instagram, que leen el HTML crudo. El prerenderizado es lo que cierra ese
// hueco; esta capa es la que le da a cada ruta los datos que va a escribir.
import { ORIGEN, INDEXABLE, SITIO } from '../data/sitio.js';

/** Crea la etiqueta si no existe y le pone el valor. */
function fijar(selector, crear, valor) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = crear();
    document.head.appendChild(el);
  }
  if (el.tagName === 'LINK') el.setAttribute('href', valor);
  else el.setAttribute('content', valor);
  return el;
}

const meta = (nombre, valor) =>
  fijar(`meta[name="${nombre}"]`, () => Object.assign(document.createElement('meta'), { name: nombre }), valor);

const propiedad = (prop, valor) =>
  fijar(`meta[property="${prop}"]`, () => {
    const el = document.createElement('meta');
    el.setAttribute('property', prop);
    return el;
  }, valor);

const enlace = (rel, valor) =>
  fijar(`link[rel="${rel}"]`, () => Object.assign(document.createElement('link'), { rel }), valor);

/** Resuelve un campo de vista que puede ser valor o función del ctx. */
export const resolver = (campo, ctx) => (typeof campo === 'function' ? campo(ctx) : campo);

/**
 * Datos SEO de una ruta, en un solo objeto. Sirve tanto para aplicarlos en el
 * cliente como para escribirlos en el HTML durante el prerender.
 */
export function datosDe(vista, ctx) {
  const titulo = resolver(vista.titulo, ctx);
  const ruta = (ctx?.path || '/').split('?')[0].replace(/\/$/, '') || '/';
  return {
    titulo: titulo ? `${titulo} · ${SITIO.sigla}` : `${SITIO.nombre} · ${SITIO.lema}`,
    descripcion: resolver(vista.descripcion, ctx) || '',
    canonical: `${ORIGEN}${ruta === '/' ? '/' : ruta}`,
    // Imagen social propia de la vista si la declara; si no, la del sitio.
    imagen: `${ORIGEN}${resolver(vista.imagen, ctx) || '/img/hero-drone-1250.jpg'}`,
    tipo: resolver(vista.tipoOG, ctx) || 'website',
    schema: resolver(vista.schema, ctx) || null,
  };
}

/** Aplica al <head> los metadatos de la ruta actual. */
export function aplicarMeta(vista, ctx) {
  const d = datosDe(vista, ctx);

  document.title = d.titulo;
  if (d.descripcion) meta('description', d.descripcion);
  enlace('canonical', d.canonical);

  // El dominio provisorio no se indexa (ver src/data/sitio.js). `noindex` no
  // afecta a quien entra por el link ni a las previsualizaciones al compartir.
  meta('robots', INDEXABLE ? 'index, follow, max-image-preview:large' : 'noindex, nofollow');

  propiedad('og:type', d.tipo);
  propiedad('og:title', d.titulo);
  propiedad('og:url', d.canonical);
  propiedad('og:site_name', SITIO.nombre);
  propiedad('og:locale', 'es_AR');
  propiedad('og:image', d.imagen);
  if (d.descripcion) propiedad('og:description', d.descripcion);

  meta('twitter:card', 'summary_large_image');
  meta('twitter:title', d.titulo);
  meta('twitter:image', d.imagen);
  if (d.descripcion) meta('twitter:description', d.descripcion);

  // Un solo bloque JSON-LD por ruta, reemplazado en cada navegación: si se
  // acumularan, una carrera arrastraría el schema de la anterior.
  document.getElementById('schema-ruta')?.remove();
  if (d.schema) {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.id = 'schema-ruta';
    s.textContent = JSON.stringify(d.schema);
    document.head.appendChild(s);
  }
}
