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
  'pad-infantil': 'SPD/19_INFANTIL_NENE_BOYA',
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
  'ev-nahuel': 'Fotos/NHL/DJI_20260221110433_0039_D.JPG',
  'ev-huemul': 'Fotos/VHU/DSC_5614.JPG',
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
const lqip = {};

for (const [slug, key] of Object.entries(PHOTOS)) {
  const src = index[key] || (key.startsWith('Fotos/') ? key : null);
  if (!src) throw new Error(`No encontré la foto ${key}`);

  const img = sharp(src);
  const { width: sw, height: sh } = await img.metadata();

  for (const w of WIDTHS) {
    if (w > sw) continue;
    await sharp(src).resize({ width: w }).avif({ quality: 58, effort: 6 }).toFile(`${OUT}/${slug}-${w}.avif`);
    await sharp(src).resize({ width: w }).webp({ quality: 76 }).toFile(`${OUT}/${slug}-${w}.webp`);
  }
  // widest webp doubles as the <img src> fallback
  await sharp(src).resize({ width: Math.min(1250, sw) }).jpeg({ quality: 78, mozjpeg: true }).toFile(`${OUT}/${slug}.jpg`);

  const blur = await sharp(src).resize({ width: 20 }).blur(1).webp({ quality: 30 }).toBuffer();
  lqip[slug] = { d: `data:image/webp;base64,${blur.toString('base64')}`, r: +(sw / sh).toFixed(4) };

  console.log(`${slug.padEnd(22)} ${sw}x${sh}  ${WIDTHS.filter((w) => w <= sw).join('/')}`);
}

await writeFile(
  'src/data/media-lqip.js',
  `// Generado por scripts/images.mjs — no editar a mano.\nexport const LQIP = ${JSON.stringify(lqip, null, 0)};\n`
);
console.log(`\n${Object.keys(PHOTOS).length} fotos → ${OUT}`);
