import { medicionActiva } from './medicion.js';

// Google Analytics 4.
//
// Dos decisiones que explican cómo está escrito esto:
//
// 1. SIN SCRIPT INLINE. El snippet que da Google trae un <script> inline, y
//    permitirlo obligaría a poner 'unsafe-inline' en script-src, que es
//    justamente lo que hace útil a la CSP. Acá el mismo código va en este
//    módulo, que Vite empaqueta y se sirve desde el propio dominio: la CSP
//    sólo tiene que habilitar el dominio de Google, nada más.
//
// 2. LAS VISTAS SE MANDAN A MANO. El sitio es una SPA: gtag contaría una sola
//    página por sesión, la de entrada. Por eso `send_page_view` va en false y
//    el router avisa cada cambio de ruta.
const ID = 'G-GNVYJCRV1C';

// La regla de cuándo medir es compartida (ver medicion.js): sólo corre en
// el dominio definitivo, o con ?medicion=1 para probar.
const activa = medicionActiva;

export function gtag() {
  window.dataLayer = window.dataLayer || [];
  // `arguments` y no un array: gtag lee el objeto arguments tal cual.
  window.dataLayer.push(arguments);
}

export function montarAnalitica() {
  if (!activa() || document.getElementById('ga4')) return;

  const s = document.createElement('script');
  s.id = 'ga4';
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${ID}`;
  document.head.appendChild(s);

  gtag('js', new Date());
  gtag('config', ID, { send_page_view: false });
}

/** Vista de página. La llama el router en cada navegación. */
export function vista(path, titulo) {
  if (!activa()) return;
  gtag('event', 'page_view', {
    page_path: path,
    page_title: titulo || document.title,
    page_location: location.href,
  });
}

/** Evento con nombre propio. Sin datos personales: sólo qué se tocó. */
export function evento(nombre, params = {}) {
  if (!activa()) return;
  gtag('event', nombre, params);
}
