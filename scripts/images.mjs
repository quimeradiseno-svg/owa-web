// Turns the ~1250px master JPEGs in Fotos/ into responsive AVIF + WebP sets in
// public/img/, plus a blur-up placeholder baked into src/data/media-lqip.js.
//
// Only the photos listed in PHOTOS ship — the rest of Fotos/ stays as archive.
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const WIDTHS = [480, 960, 1250];
const OUT = 'public/img';

// slug -> source file, matched by prefix so the MLE-#### suffix can change.
const PHOTOS = {
  // home
  'travel-barco': 'VOB/06_LARGADA_RIO_BARCO',
  // Card de la jornada Grand Prix (Vuelta de Obligado) en /carrera/san-pedro:
  // foto real del propio evento, no el stock genérico de contraluz.
  'vob-rio-barco': 'VOB/06_LARGADA_RIO_BARCO',
  // Ídem, card de la jornada Circuito OWA (San Pedro). Mismo archivo que usa
  // 'ev-ramallo' para la tarjeta de Ramallo — coincidencia de contenido, no
  // se reusa ese slug para no atarlas entre sí.
  'spd-brazada-colores': 'SPD/09_CARRERA_BRAZADA_COLORES',
  // Cards de las dos jornadas de Luján: 1 es la sede (lago y club), 2 la
  // largada con nadadores.
  'ljn-sede': 'Fotos/LJN/1.jpg',
  'ljn-largada': 'Fotos/LJN/2.jpg',
  'pad-infantil': 'Fotos/PDA/DSC_9296.jpg',
  // Romeo Giménez, becado PDA de la temporada 2026/27 (nombrado en PDA_BECAS).
  'pda-romeo': 'Fotos/PDA/romeo.jpg',
  // torneos
  'gp-contraluz': 'SPD/14_CARRERA_CONTRALUZ',
  'circuito-grupo': 'VOB/07_NADO_GRUPO',
  // Primer plano sin marca de agua visible: la de VOB/07 la muestra entera al
  // ocupar toda la tarjeta en el hover de "Cinco formas de entrar al agua".
  'modalidad-circuito': 'SPD/10_CARRERA_CRAWL_PRIMER_PLANO',
  'especiales-panoramica': 'SPD/06_RIO_SUP_PANORAMICA',
  // solitario, boya de seguridad, montañas nevadas: la postal de ultradistancia.
  'challenge-lago': 'Fotos/CHALLENGE/@juancruzrabaglia-2077.jpg',
  // eventos
  'ev-lujan': 'Fotos/LJN/DSC_8815.jpg',
  'ev-san-pedro': 'SPD/08_CARRERA_CAMPO_BOYAS',
  'ev-ramallo': 'SPD/09_CARRERA_BRAZADA_COLORES',
  'ev-pinamar': 'Fotos/PNR/DSC_0207.jpg',
  // Eventos especiales de Bariloche/San Pedro: fotos reales de cada uno
  // (antes eran genéricas de SPD/VOB).
  'ev-nahuel': 'Fotos/NHL/JCR-3240.jpg',
  'ev-huemul': 'Fotos/VHU/isla.png',
  'ev-colon': 'Fotos/CLN/DSC_ (80).jpg',
  'ev-maraton': 'Fotos/SPD/10_CARRERA_CRAWL_PRIMER_PLANO_MLE-128141.jpg',
  // Challenge: fotos reales de cada travesía (antes eran genéricas de SPD/VOB).
  'ev-rdp40': 'Fotos/RDP/MLE-30012.jpg',
  'ev-snp70': 'Fotos/SNP/MLE-57584.jpg',
  'ev-bvt21': 'Fotos/BVT/@juancruzrabaglia-1991.jpg',
  // secciones
  'sede-comunidad': 'VOB/08_ESCALA_COMUNIDAD',
  'travel-playa': 'VOB/04_PREVIA_GRUPO_ABRAZADO',
  // Apaisada: la vertical sólo daba el corte de 480px y se veía blanda a 1216.
  'pad-familia': 'SPD/23_FAMILIA_ORILLA',
  'podio-trofeo': 'SPD/29_PODIO_TROFEO_ALTO',
  // --- OWA Travel · Buzios -------------------------------------------------
  // Curadas de Fotos/TRAVEL. La tortuga es la unica que documenta lo que el
  // itinerario promete ("nado con tortugas en Ilha de Ancora"): va de ancla.
  'tv-tortuga': 'Fotos/TRAVEL/GOPR4523.JPG',
  'tv-isla-drone': 'Fotos/TRAVEL/DJI_0154.JPG',
  'tv-caps': 'Fotos/TRAVEL/IMG_0286.jpg',
  'tv-turquesa': 'Fotos/TRAVEL/349519a9-3e2b-4258-a51d-ebb2ff6412d6.JPG',
  'tv-buceo': 'Fotos/TRAVEL/6b5a9a2a-d7a5-48ac-99fb-5492d5d5e1e2.JPG',
  'tv-kayak': 'Fotos/TRAVEL/IMG_0473.jpg',
  'tv-lancha': 'Fotos/TRAVEL/2446dc7a-520a-4715-8892-08c4a5493d7a.JPG',
  'tv-trilha': 'Fotos/TRAVEL/d695cdbd-3543-4150-93b4-52a168785111.JPG',
  'tv-playa-grupo': 'Fotos/TRAVEL/b6053075-10cb-4915-8df0-d1c8e45ec4af.JPG',
  'tv-costa': 'Fotos/TRAVEL/IMG_0381.jpg',
  // --- OWA Travel · Race Travel 2027 ---------------------------------------
  // Capri-Nápoli tiene fotos reales de la propia carrera. "capri.jpg" (pese
  // al nombre) es el Monumento a los Descubrimientos en Lisboa — sirve para
  // Portugal. "myconos.jpg", pese a vivir en la carpeta de Capri Nápoli, es
  // Mykonos (Pequeña Venecia): quedó mezclada ahí en el envío de OWA.
  'tv-capri-napoli': 'Fotos/TRAVEL/Fotos Capri Napoli/2021-15_orig.jpg',
  // Home: nadadores frente a los Faraglioni, foto distinta a la del recorrido
  // de /travel para no repetir la misma imagen en dos lugares cercanos.
  'tv-capri-faraglioni': 'Fotos/TRAVEL/capri.png',
  'tv-portugal': 'Fotos/TRAVEL/capri.jpg',
  'tv-mykonos': 'Fotos/TRAVEL/Fotos Capri Napoli/myconos.jpg',
  // --- Mapas de recorrido · San Pedro --------------------------------------
  // El Grand Prix va en dos laminas (tramo 2 y llegada); el Circuito, una por
  // distancia. Son capturas satelitales con trazado: mucho detalle fino, asi
  // que se sirven mas grandes que una foto normal.
  'mapa-vob-tramo1': 'Fotos/SPD/mapas/VOB1.jpg',
  'mapa-vob-tramo2': 'Fotos/SPD/mapas/tramo_2_VOB.jpg',
  'mapa-vob-llegada': 'Fotos/SPD/mapas/Llegada_VOB.jpg',
  'mapa-spd-7k': 'Fotos/SPD/mapas/SPD7.jpg',
  'mapa-spd-4k': 'Fotos/SPD/mapas/SPD4.jpg',
  // poster del video del hero — vive fuera de SPD/VOB, así que se referencia
  // con la ruta completa en vez de una clave del índice.
  'hero-drone': 'Fotos/banner-poster/hero-drone-poster.jpg',
  'tv-hero': 'Fotos/banner-poster/travel-poster.jpg',
};

const index = {};
for (const dir of ['SPD', 'VOB']) {
  for (const f of await readdir(`Fotos/${dir}`)) index[`${dir}/${f.replace(/_MLE-\d+\.jpg$/i, '')}`] = `Fotos/${dir}/${f}`;
}

await mkdir(OUT, { recursive: true });

// Sin argumentos procesa todo. Con slugs (`node scripts/images.mjs ev-nahuel`)
// rehace sólo esos y conserva el LQIP del resto, que si no se perdería.
const filtro = process.argv.slice(2);
const entradas = Object.entries(PHOTOS).filter(([slug]) => !filtro.length || filtro.includes(slug));
if (filtro.length && entradas.length !== filtro.length) {
  const faltan = filtro.filter((s) => !PHOTOS[s]);
  throw new Error(`No están en PHOTOS: ${faltan.join(', ')}`);
}

const lqip = {};
if (filtro.length) Object.assign(lqip, (await import('../src/data/media-lqip.js')).LQIP);

for (const [slug, valor] of entradas) {
  // El valor puede ser la ruta sola o `{ foto, recorte }`. `recorte` va en
  // fracciones del original (0-1) y se aplica ANTES de todo lo demás, así que
  // el recorte queda horneado en el asset servido: no depende de que cada
  // maquetado acierte con object-position.
  const { foto: key, recorte } = typeof valor === 'string' ? { foto: valor } : valor;
  const src = index[key] || (key.startsWith('Fotos/') ? key : null);
  if (!src) throw new Error(`No encontré la foto ${key}`);

  const { width: ow, height: oh } = await sharp(src).metadata();
  // Las medidas del recorte se calculan acá y no con un segundo `.metadata()`:
  // sharp informa siempre las del archivo de entrada, así que tras un extract
  // seguiría devolviendo el tamaño original y el ratio del LQIP saldría mal.
  const { left = 0, top = 0, ancho = 1, alto = 1 } = recorte || {};
  const area = recorte && {
    left: Math.round(ow * left),
    top: Math.round(oh * top),
    width: Math.round(ow * ancho),
    height: Math.round(oh * alto),
  };
  const base = () => (area ? sharp(src).extract(area) : sharp(src));
  const sw = area ? area.width : ow;
  const sh = area ? area.height : oh;

  for (const w of WIDTHS) {
    if (w > sw) continue;
    await base().resize({ width: w }).avif({ quality: 58, effort: 6 }).toFile(`${OUT}/${slug}-${w}.avif`);
    await base().resize({ width: w }).webp({ quality: 76 }).toFile(`${OUT}/${slug}-${w}.webp`);
  }
  // widest webp doubles as the <img src> fallback
  await base().resize({ width: Math.min(1250, sw) }).jpeg({ quality: 78, mozjpeg: true }).toFile(`${OUT}/${slug}.jpg`);

  const blur = await base().resize({ width: 20 }).blur(1).webp({ quality: 30 }).toBuffer();
  lqip[slug] = { d: `data:image/webp;base64,${blur.toString('base64')}`, r: +(sw / sh).toFixed(4) };

  console.log(`${slug.padEnd(22)} ${sw}x${sh}${recorte ? ' (recortada)' : ''}  ${WIDTHS.filter((w) => w <= sw).join('/')}`);
}

await writeFile(
  'src/data/media-lqip.js',
  `// Generado por scripts/images.mjs — no editar a mano.\nexport const LQIP = ${JSON.stringify(lqip, null, 0)};\n`
);
console.log(`\n${entradas.length} fotos → ${OUT}`);
