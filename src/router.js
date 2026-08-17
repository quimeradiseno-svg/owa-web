// Router de historia con vistas planas. Cada vista exporta
// { titulo, render(ctx) -> raw, mount?(root, ctx) }.

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

async function pintar(path, { scroll = true } = {}) {
  const pathname = path.split('?')[0];
  const hallada = resolver(pathname) || resolver('/404');
  if (!hallada) return;

  const vista = await hallada.cargar();
  const ctx = { params: hallada.params, path, query: new URLSearchParams(location.search) };

  const aplicar = () => {
    // Cada vista vive en su propio wrapper: al reemplazarlo se van con él los
    // listeners que haya registrado, sin acumular handlers en <main>.
    const vistaEl = document.createElement('div');
    vistaEl.innerHTML = vista.render(ctx);
    contenedor.replaceChildren(vistaEl);
    const t = typeof vista.titulo === 'function' ? vista.titulo(ctx) : vista.titulo;
    document.title = t ? `${t} · OWA` : 'Open Water Argentina';
    vista.mount?.(vistaEl, ctx);
    actual = hallada.patron;
    alCambiar(hallada.patron, ctx);
    if (scroll) window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // La primera pintura no cruza dos estados: no hay nada de dónde transicionar,
  // y arrancarla mientras el documento todavía carga tira InvalidStateError.
  if (!primerPintado && document.startViewTransition && !reduceMotion()) {
    const vt = document.startViewTransition(aplicar);
    // Navegar de nuevo antes de que termine aborta la transición: es esperable,
    // no un error que deba burbujear como unhandled rejection.
    vt.finished.catch(() => {});
    vt.updateCallbackDone.catch(() => {});
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
    e.preventDefault();
    ir(url.pathname + url.search);
  });

  window.addEventListener('popstate', () => pintar(location.pathname, { scroll: false }));
  pintar(location.pathname);
}
