// Router de historia con vistas planas. Cada vista exporta
// { titulo, render(ctx) -> raw, mount?(root, ctx) }.
import { aplicarMeta } from './lib/meta.js';


const rutas = [];
let contenedor;
let actual = null;
let alCambiar = () => {};

export function definir(patron, cargar) {
  // '/carrera/:slug' -> /^\/carrera\/([^/]+)$/
  const claves = [];
  const re = new RegExp(
    '^' +
      patron.replace(/\/:([^/]+)/g, (_, k) => {
        claves.push(k);
        return '/([^/]+)';
      }) +
      '/?$'
  );
  rutas.push({ re, claves, cargar, patron });
}

function resolver(path) {
  for (const r of rutas) {
    const m = r.re.exec(path);
    if (m) {
      const params = {};
      r.claves.forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1])));
      return { ...r, params };
    }
  }
  return null;
}

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let primerPintado = true;
// Última ruta efectivamente pintada. Sirve para distinguir un popstate real
// (cambió la ruta) de uno disparado sólo por un cambio de hash.
let rutaPintada = null;

async function pintar(path, { scroll = true } = {}) {
  const pathname = path.split('?')[0];
  rutaPintada = pathname;
  const hallada = resolver(pathname) || resolver('/404');
  if (!hallada) return;

  let vista;
  try {
    vista = await hallada.cargar();
  } catch {
    // El chunk de esa vista no está más donde el bundle ya cargado lo busca:
    // pasó un deploy nuevo mientras esta pestaña seguía abierta con el viejo.
    // Sin este catch, `pintar` rechazaba sin que nadie lo atajara (`ir()` no
    // espera esta promesa) — la URL ya había cambiado por el pushState de
    // más abajo, pero el contenido se quedaba clavado en la página anterior:
    // el link "no hacía nada" y sólo un F5 (que carga el HTML nuevo) lo
    // arreglaba. Una navegación real hace ese mismo F5 sola.
    location.href = path;
    return;
  }
  const ctx = { params: hallada.params, path, query: new URLSearchParams(location.search) };

  const aplicar = () => {
    // Cada vista vive en su propio wrapper: al reemplazarlo se van con él los
    // listeners que haya registrado, sin acumular handlers en <main>.
    const vistaEl = document.createElement('div');
    vistaEl.innerHTML = vista.render(ctx);
    contenedor.replaceChildren(vistaEl);
    // Título, descripción, canonical, Open Graph, Twitter y JSON-LD, todo
    // desde lo que declara la vista.
    aplicarMeta(vista, ctx);
    vista.mount?.(vistaEl, ctx);
    actual = hallada.patron;
    alCambiar(hallada.patron, ctx);
    if (scroll) window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // La primera pintura no cruza dos estados: no hay nada de dónde transicionar,
  // y arrancarla mientras el documento todavía carga tira InvalidStateError.
  if (!primerPintado && document.startViewTransition && !reduceMotion()) {
    // Algunos navegadores (in-app de WhatsApp/Instagram, una pestaña que
    // perdió el foco) arrancan la transición pero nunca llegan a invocar este
    // callback: la página se queda pegada en la ruta anterior, sin ningún
    // error — tocar el link "no hacía nada" y sólo un F5 lo arreglaba. Este
    // aplicarUnaVez()+timeout es la red: si la transición no pintó sola en
    // 300ms, se fuerza igual. Si la transición sí funciona, el timeout se
    // cancela y no cambia nada de la animación.
    let aplicado = false;
    const aplicarUnaVez = () => {
      if (aplicado) return;
      aplicado = true;
      aplicar();
    };
    const redDeSeguridad = setTimeout(aplicarUnaVez, 300);
    try {
      const vt = document.startViewTransition(() => {
        clearTimeout(redDeSeguridad);
        aplicarUnaVez();
      });
      // Navegar de nuevo antes de que termine aborta la transición: es esperable,
      // no un error que deba burbujear como unhandled rejection.
      // `ready` también rechaza —y es la que salta con la pestaña en segundo
      // plano, donde startViewTransition aborta con InvalidStateError.
      vt.ready.catch(() => {});
      vt.finished.catch(() => {});
      vt.updateCallbackDone.catch(() => {});
    } catch {
      clearTimeout(redDeSeguridad);
      aplicarUnaVez();
    }
  } else aplicar();
  primerPintado = false;
}

export function ir(path, { replace = false } = {}) {
  if (path === location.pathname) return;
  history[replace ? 'replaceState' : 'pushState']({}, '', path);
  pintar(path);
}

export const rutaActual = () => actual;

export function arrancar(el, onChange) {
  contenedor = el;
  alCambiar = onChange || alCambiar;

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.origin);
    if (url.origin !== location.origin) return;
    // Ancla dentro de la misma página: no es una navegación. Sin esta salida
    // el router le hacía preventDefault y después `ir()` cortaba por ser el
    // mismo pathname, así que el click no hacía absolutamente nada. Lo deja
    // pasar al scroll nativo, que ya es suave por `scroll-behavior` en el CSS.
    if (url.hash && url.pathname === location.pathname) return;
    e.preventDefault();
    ir(url.pathname + url.search);
  });

  // Chrome dispara popstate también cuando sólo cambia el hash. Sin este
  // corte, tocar un ancla de la misma página repintaba la vista entera: el
  // navegador reemplazaba el nodo destino justo antes de saltar hacia él y el
  // scroll se perdía en silencio. Se repinta sólo si cambió la ruta.
  window.addEventListener('popstate', () => {
    if (location.pathname === rutaPintada) return;
    pintar(location.pathname, { scroll: false });
  });
  pintar(location.pathname);
}
