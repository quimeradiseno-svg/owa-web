import { medicionActiva } from './medicion.js';

// Meta Pixel (Facebook/Instagram).
//
// El snippet que da Meta es un <script> inline y un <noscript> con un pixel.
// Acá va el mismo cargador pero como módulo propio, para no tener que
// habilitar 'unsafe-inline' en la CSP —que es lo que la vuelve útil—; la CSP
// sólo abre los dominios de Meta.
//
// El <noscript> no se incluye: sirve para contar visitas sin JavaScript, y en
// ese caso tampoco correría el resto de la medición. Si algún día interesa
// medirlas, va en el HTML que emite scripts/prerender.mjs, que es el único
// que ve un visitante sin JS.
//
// Igual que en Analytics, las vistas se mandan a mano: el sitio es una SPA y
// el pixel contaría una sola por sesión.
const ID = '1645784060544875';

// La regla de cuándo medir es compartida (ver medicion.js): sólo corre en
// el dominio definitivo, o con ?medicion=1 para probar.
const activa = medicionActiva;

export function fbq(...args) {
  // Misma cola que arma el snippet oficial: si el script todavía no cargó, se
  // encola y se despacha solo cuando llega.
  if (window.fbq) window.fbq(...args);
}

export function montarPixel() {
  if (!activa() || window.fbq) return;

  const n = (window.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  });
  if (!window._fbq) window._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = '2.0';
  n.queue = [];

  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(s);

  // El PageView de la carga inicial lo manda el router junto con el resto.
  window.fbq('init', ID);
}

/** Vista de página en cada cambio de ruta. */
export function vistaPixel() {
  if (!activa()) return;
  fbq('track', 'PageView');
}

/** Ficha de carrera vista: es lo que Meta usa para armar audiencias. */
export function contenidoPixel(slug) {
  if (!activa()) return;
  fbq('track', 'ViewContent', { content_type: 'race', content_ids: [slug] });
}

/** Salida hacia la plataforma de inscripción: la conversión que importa. */
export function inscripcionPixel(slug) {
  if (!activa()) return;
  fbq('track', 'Lead', { content_category: 'inscripcion', content_ids: slug ? [slug] : [] });
}
