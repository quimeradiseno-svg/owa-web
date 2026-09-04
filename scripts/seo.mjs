// Genera robots.txt y sitemap.xml dentro de dist/, después del build.
//
// Se generan en vez de mantenerse a mano porque las carreras salen de
// src/data/eventos.js: una fecha nueva entra sola al sitemap.
//
// Los dos archivos dependen de ORIGEN e INDEXABLE (src/data/sitio.js). Con
// INDEXABLE en false —la URL de Vercel mientras el sitio se revisa— robots.txt
// bloquea todo y el sitemap igual se escribe, para poder revisarlo antes de
// publicarlo.
import { writeFile } from 'node:fs/promises';
import { ORIGEN, INDEXABLE } from '../src/data/sitio.js';
import { ALL, sinIngreso } from '../src/data/eventos.js';

const OUT = 'dist';

// Rutas fijas con su prioridad relativa. `/pad` no está: es un alias viejo que
// redirige a /pda (ver vercel.json), y una redirección no va en el sitemap.
// `/404` tampoco: no es contenido.
const FIJAS = [
  ['/', 1.0, 'weekly'],
  ['/calendario', 0.9, 'weekly'],
  ['/primeros-pasos', 0.8, 'monthly'],
  ['/grand-prix', 0.8, 'monthly'],
  ['/circuito', 0.8, 'monthly'],
  ['/especiales', 0.7, 'monthly'],
  ['/challenge', 0.7, 'monthly'],
  ['/travel', 0.7, 'monthly'],
  ['/resultados', 0.7, 'weekly'],
  ['/pda', 0.6, 'monthly'],
  ['/reglamentos', 0.5, 'yearly'],
];

const hoy = new Date().toISOString().slice(0, 10);

const entrada = ([ruta, prioridad, frecuencia]) =>
  `  <url>
    <loc>${ORIGEN}${ruta === '/' ? '/' : ruta}</loc>
    <lastmod>${hoy}</lastmod>
    <changefreq>${frecuencia}</changefreq>
    <priority>${prioridad.toFixed(1)}</priority>
  </url>`;

// Cada carrera con página propia. Las puntuables van más arriba que los
// especiales y las travesías porque son las que se buscan por nombre y fecha.
// Las carreras sin fecha confirmada quedan fuera: no se puede entrar desde
// ningún lado del sitio, así que ofrecerlas a Google sería mandar tráfico a
// una página huérfana.
const carreras = ALL.filter((e) => !sinIngreso(e)).map((e) => [`/carrera/${e.slug}`, e.tipo === 'core' ? 0.9 : 0.7, 'monthly']);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...FIJAS, ...carreras].map(entrada).join('\n')}
</urlset>
`;

const robots = INDEXABLE
  ? `User-agent: *
Allow: /

Sitemap: ${ORIGEN}/sitemap.xml
`
  : `# Dominio provisorio mientras el sitio se revisa: no se indexa para que el
# dominio definitivo (www.owa.com.ar) arranque sin contenido duplicado.
# Se libera poniendo INDEXABLE en true en src/data/sitio.js.
User-agent: *
Disallow: /
`;

await writeFile(`${OUT}/sitemap.xml`, sitemap, 'utf8');
await writeFile(`${OUT}/robots.txt`, robots, 'utf8');

console.log(`sitemap.xml  ${FIJAS.length + carreras.length} URLs`);
console.log(`robots.txt   ${INDEXABLE ? 'indexable' : 'bloqueado (dominio provisorio)'}`);
