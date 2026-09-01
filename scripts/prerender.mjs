// Prerenderiza cada ruta a un HTML estático dentro de dist/.
//
// POR QUÉ
// -------
// El sitio es una SPA: el HTML que sirve el servidor trae el <main> vacío y
// todo lo pinta el JS. Google renderiza JavaScript y llega a ver el contenido,
// pero los previsualizadores de WhatsApp, Instagram y Facebook NO: leen el
// HTML crudo. Sin esto, una carrera compartida por WhatsApp se ve con el
// título y la foto del home, que es justo el canal por donde OWA difunde.
//
// CÓMO
// ----
// Las vistas ya son funciones puras que devuelven un string de HTML —no tocan
// el DOM al renderizar, sólo en `mount()`—, así que se las puede ejecutar en
// Node y volcar el resultado dentro del index.html que emitió Vite. Cuando el
// JS arranca en el navegador, el router reemplaza ese contenido por el suyo:
// no hay hidratación que pueda desincronizarse.
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { navbar } from '../src/components/navbar.js';
import { footer } from '../src/components/footer.js';
import { volverArriba } from '../src/components/volver-arriba.js';
import { datosDe } from '../src/lib/meta.js';
import { INDEXABLE, SITIO } from '../src/data/sitio.js';
import { ALL } from '../src/data/eventos.js';

const OUT = 'dist';

const VISTAS = {
  home: () => import('../src/views/home.js'),
  calendario: () => import('../src/views/calendario.js'),
  madre: () => import('../src/views/madre.js'),
  evento: () => import('../src/views/evento.js'),
  resultados: () => import('../src/views/resultados.js'),
  travel: () => import('../src/views/travel.js'),
  primerosPasos: () => import('../src/views/primeros-pasos.js'),
  pda: () => import('../src/views/pda.js'),
  reglamentos: () => import('../src/views/reglamentos.js'),
  noEncontrada: () => import('../src/views/no-encontrada.js'),
};

// Mismas rutas que declara src/main.js. `/pad` no está: lo redirige vercel.json.
const RUTAS = [
  ['/', 'home'],
  ['/calendario', 'calendario'],
  ['/grand-prix', 'madre'],
  ['/circuito', 'madre'],
  ['/especiales', 'madre'],
  ['/challenge', 'madre'],
  ['/resultados', 'resultados'],
  ['/travel', 'travel'],
  ['/primeros-pasos', 'primerosPasos'],
  ['/pda', 'pda'],
  ['/reglamentos', 'reglamentos'],
  ['/404', 'noEncontrada'],
  ...ALL.map((e) => [`/carrera/${e.slug}`, 'evento', { slug: e.slug }]),
];

const esc = (s) =>
  String(s ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

/** Las etiquetas del <head> que dependen de la ruta. */
function cabeza(d) {
  const t = [
    `<title>${esc(d.titulo)}</title>`,
    d.descripcion ? `<meta name="description" content="${esc(d.descripcion)}" />` : '',
    `<link rel="canonical" href="${esc(d.canonical)}" />`,
    `<meta name="robots" content="${INDEXABLE ? 'index, follow, max-image-preview:large' : 'noindex, nofollow'}" />`,
    `<meta property="og:type" content="${esc(d.tipo)}" />`,
    `<meta property="og:title" content="${esc(d.titulo)}" />`,
    `<meta property="og:url" content="${esc(d.canonical)}" />`,
    `<meta property="og:site_name" content="${esc(SITIO.nombre)}" />`,
    `<meta property="og:locale" content="es_AR" />`,
    `<meta property="og:image" content="${esc(d.imagen)}" />`,
    d.descripcion ? `<meta property="og:description" content="${esc(d.descripcion)}" />` : '',
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(d.titulo)}" />`,
    `<meta name="twitter:image" content="${esc(d.imagen)}" />`,
    d.descripcion ? `<meta name="twitter:description" content="${esc(d.descripcion)}" />` : '',
    d.schema ? `<script type="application/ld+json" id="schema-ruta">${JSON.stringify(d.schema)}</script>` : '',
  ];
  return t.filter(Boolean).join('\n    ');
}

const plantilla = await readFile(`${OUT}/index.html`, 'utf8');

// El navbar y el pie son iguales en todas las rutas: se arman una sola vez.
const NAV = String(navbar());
const PIE = String(footer());
const VOLVER = String(volverArriba());

let n = 0;
for (const [ruta, vistaKey, params = {}] of RUTAS) {
  const vista = await (VISTAS[vistaKey]());
  const ctx = { path: ruta, params, query: new URLSearchParams() };
  const d = datosDe(vista, ctx);
  const cuerpo = String(vista.render(ctx));

  let html = plantilla
    // El <title> y la description del index.html base se reemplazan por los de
    // la ruta; el resto de las etiquetas se suman antes de cerrar el <head>.
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<meta\s+name="description"[\s\S]*?\/>/, '')
    .replace(/<meta property="og:[\s\S]*?\/>/g, '')
    .replace('</head>', `  ${cabeza(d)}\n  </head>`)
    .replace('<div id="shell"></div>', `<div id="shell">${NAV}</div>`)
    .replace(
      '<main id="contenido" class="bg-white text-owa-navy"></main>',
      `<main id="contenido" class="bg-white text-owa-navy"><div>${cuerpo}</div></main>`
    )
    .replace('<div id="pie"></div>', `<div id="pie">${PIE}</div>`)
    .replace('<div id="volver"></div>', `<div id="volver">${VOLVER}</div>`);

  const dir = ruta === '/' ? OUT : `${OUT}${ruta}`;
  await mkdir(dir, { recursive: true });
  await writeFile(`${dir}/index.html`, html, 'utf8');
  n++;
}

// Vercel sirve 404.html —con status 404 real— para cualquier URL que no
// exista. Es el mismo HTML que /404, copiado a la raíz de dist.
await writeFile(`${OUT}/404.html`, await readFile(`${OUT}/404/index.html`, 'utf8'), 'utf8');

console.log(`prerender    ${n} rutas`);
