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
  // Card de la jornada Grand Prix (Liebig a Colón). El nadador va a la
  // derecha y deja libre la mitad izquierda, que es donde la tarjeta apoya la
  // sigla y la frase. Se recorta el 8% de abajo: ahí vive la marca de agua
  // del fotógrafo, y horneada en el asset no depende del encuadre del CSS.
  'lbc-crawl': { foto: 'Fotos/LBC/MER_4843.jpg', recorte: { alto: 0.92 } },
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
  // Hero de Eventos Especiales: amanecer en el Nahuel Huapi con las boyas
  // de OWA. Dice "escenario" mejor que la panorámica de río que estaba antes.
  'esp-lago-amanecer': 'Fotos/VHU/02_PREVIA_LAGO_AMANECER_4278.jpg',
  // solitario, boya de seguridad, montañas nevadas: la postal de ultradistancia.
  'challenge-lago': 'Fotos/CHALLENGE/@juancruzrabaglia-2077.jpg',
  // eventos
  'ev-lujan': 'Fotos/LJN/DSC_8815.jpg',
  'ev-san-pedro': 'SPD/08_CARRERA_CAMPO_BOYAS',
  'ev-ramallo': 'SPD/09_CARRERA_BRAZADA_COLORES',
  'ev-pinamar': 'Fotos/PNR/DSC_0207.jpg',
  // Galería de la ficha de Pinamar. Se deja afuera la que ya usa 'ev-pinamar'
  // (no repetir la misma foto), las posadas bajo el arco (retrato personal,
  // no acción de carrera) y la del podio 2024 (nombra un equipo y un sponsor
  // — Golden Haus — que hoy no está en sponsors.js).
  'pnr-galeria-1': 'Fotos/PNR/DSC_7732.JPG',
  'pnr-galeria-2': 'Fotos/PNR/OWA PINAMAR-3328.jpg',
  'pnr-galeria-3': 'Fotos/PNR/OWA PINAMAR-3302.jpg',
  'pnr-galeria-4': 'Fotos/PNR/OWA PINAMAR-3212.jpg',
  'pnr-galeria-5': 'Fotos/PNR/DSC_0634.jpg',
  'pnr-galeria-6': 'Fotos/PNR/OWA PINAMAR-3343.jpg',
  'pnr-galeria-7': 'Fotos/PNR/OWA PINAMAR-45.jpg',
  'pnr-galeria-8': 'Fotos/PNR/DSC_7741.JPG',
  'pnr-galeria-9': 'Fotos/PNR/DSC_0283.jpg',
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
  // Galería de la ficha del Cruce del Río de la Plata (RDP). La aérea abre el
  // mosaico (celda grande); el resto, nadadores y embarcación de apoyo.
  'rdp-galeria-1': 'Fotos/RDP/Foto aerea Rio de la Plata.jpg',
  'rdp-galeria-2': 'Fotos/RDP/MLE-29759.jpg',
  'rdp-galeria-3': 'Fotos/RDP/MLE-30011.jpg',
  'rdp-galeria-4': 'Fotos/RDP/MLE-30014.jpg',
  'rdp-galeria-5': 'Fotos/RDP/MLE-30032.jpg',
  'rdp-galeria-6': 'Fotos/RDP/MLE-30095.jpg',
  'rdp-galeria-7': 'Fotos/RDP/0012_Anthony.jpg',
  'rdp-galeria-8': 'Fotos/RDP/0048_Anthony.jpg',
  'rdp-galeria-9': 'Fotos/RDP/MLE-28324.jpg',
  'rdp-galeria-10': 'Fotos/RDP/MLE-28106.jpg',
  'rdp-galeria-11': 'Fotos/RDP/MLE-28172.jpg',
  'rdp-galeria-12': 'Fotos/RDP/MLE-28865.jpg',
  'rdp-galeria-13': 'Fotos/RDP/MLE-29117.jpg',
  // Mapa del cruce, de Colonia (Uruguay) a Punta Lara (Argentina).
  'mapa-rdp': 'Fotos/RDP/mapa.jpg',
  // Galería de la ficha del cruce Blest a Villa Tacul (BVT), lago Nahuel Huapi.
  'bvt-galeria-1': 'Fotos/BVT/@juancruzrabaglia-1876.jpg',
  'bvt-galeria-2': 'Fotos/BVT/@juancruzrabaglia-1916.jpg',
  'bvt-galeria-3': 'Fotos/BVT/@juancruzrabaglia-1987.jpg',
  'bvt-galeria-4': 'Fotos/BVT/@juancruzrabaglia-2073.jpg',
  'bvt-galeria-5': 'Fotos/BVT/@juancruzrabaglia-2166.jpg',
  'bvt-galeria-6': 'Fotos/BVT/@juancruzrabaglia-2233.jpg',
  'bvt-galeria-7': 'Fotos/BVT/@juancruzrabaglia-2273.jpg',
  'bvt-galeria-8': 'Fotos/BVT/@juancruzrabaglia-2330.jpg',
  'bvt-galeria-9': 'Fotos/BVT/BI0A8931.JPG',
  'bvt-galeria-10': 'Fotos/BVT/BI0A9121.JPG',
  'bvt-galeria-11': 'Fotos/BVT/BI0A9170.JPG',
  'bvt-galeria-12': 'Fotos/BVT/BI0A9657.JPG',
  'bvt-galeria-13': 'Fotos/BVT/BI0A9702.JPG',
  // Mapa del cruce, del brazo Blest a Villa Tacul.
  'mapa-bvt': 'Fotos/BVT/bvt1.jpg',
  // Galería de la ficha del cruce San Nicolás a San Pedro (SNP), río Paraná.
  'snp-galeria-1': 'Fotos/SNP/MLE-57130.jpg',
  'snp-galeria-2': 'Fotos/SNP/MLE-57135.jpg',
  'snp-galeria-3': 'Fotos/SNP/MLE-57139.jpg',
  'snp-galeria-4': 'Fotos/SNP/MLE-57145.jpg',
  'snp-galeria-5': 'Fotos/SNP/MLE-57150.jpg',
  'snp-galeria-6': 'Fotos/SNP/MLE-57155.jpg',
  'snp-galeria-7': 'Fotos/SNP/MLE-57520.jpg',
  'snp-galeria-8': 'Fotos/SNP/MLE-57538.jpg',
  'snp-galeria-9': 'Fotos/SNP/MLE-57550.jpg',
  'snp-galeria-10': 'Fotos/SNP/MLE-57570.jpg',
  'snp-galeria-11': 'Fotos/SNP/MLE-57581.jpg',
  'snp-galeria-12': 'Fotos/SNP/MLE-57588.jpg',
  'snp-galeria-13': 'Fotos/SNP/MLE-57592.jpg',
  // Mapa del cruce, de San Nicolás de los Arroyos a San Pedro por el Paraná.
  'mapa-snp': 'Fotos/SNP/mapa.jpg',
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
  // Home: hover de la tarjeta "OWA Travel" en "Cinco formas de entrar al
  // agua". Drone del grupo nadando en fila frente a la lancha de apoyo.
  'tv-capri-grupo': 'Fotos/TRAVEL/Fotos Capri Napoli/2019b-20_orig.jpg',
  // Home: nadadores frente a los Faraglioni, foto distinta a la del recorrido
  // de /travel para no repetir la misma imagen en dos lugares cercanos.
  'tv-capri-faraglioni': 'Fotos/TRAVEL/capri.png',
  'tv-portugal': 'Fotos/TRAVEL/capri.jpg',
  'tv-mykonos': 'Fotos/TRAVEL/Fotos Capri Napoli/myconos.jpg',
  // --- Mapas de recorrido · San Pedro --------------------------------------
  // El Grand Prix va en dos laminas (tramo 2 y llegada); el Circuito, una por
  // distancia. Son capturas satelitales con trazado: mucho detalle fino, asi
  // que se sirven mas grandes que una foto normal.
  'mapa-ljn': 'Fotos/LJN/mapa2.jpg',
  'mapa-vob-tramo1': 'Fotos/SPD/mapas/VOB1.jpg',
  'mapa-vob-tramo2': 'Fotos/SPD/mapas/tramo_2_VOB.jpg',
  'mapa-vob-llegada': 'Fotos/SPD/mapas/Llegada_VOB.jpg',
  // Pinamar: una lámina por distancia, las dos sobre la misma playa.
  'mapa-pnr-35': 'Fotos/PNR/CIRCUITOPINAMAR35.jpg',
  'mapa-pnr-18': 'Fotos/PNR/CIRCUITOPINAMAR18.jpg',
  'mapa-spd-7k': 'Fotos/SPD/mapas/SPD7.jpg',
  'mapa-spd-4k': 'Fotos/SPD/mapas/SPD4.jpg',
  // Colón: una lámina por distancia, las tres sobre el río Uruguay.
  'mapa-cln-10k': 'Fotos/CLN/MAPA-COLON-10.jpg',
  'mapa-cln-5k': 'Fotos/CLN/MAPA-COLON-5.jpg',
  'mapa-cln-25k': 'Fotos/CLN/MAPA-COLON-25.jpg',
  // Cruce del Nahuel: única distancia, cruzando el lago de punta a punta.
  'mapa-nhl-8k': 'Fotos/NHL/nhl1.jpg',
  // La remera del cruce, frente y dorso — mismo estudio y fondo, para que el
  // hover de una a otra no salte de encuadre.
  'nhl-remera-frente': 'Fotos/NHL/ADELANTE.jpg',
  'nhl-remera-dorso': 'Fotos/NHL/ATRAS.jpg',
  // mpa3.5.jpg y mpa1.5.jpg: nombres de archivo tal como los pasó OWA — el
  // "3.5" del segundo es un resabio de una versión anterior del mapa, la
  // credencial que trae encima dice 3 KM (así lo confirmó OWA por escrito).
  'mapa-vhu-6-5k': 'Fotos/VHU/mapa6.5.jpg',
  'mapa-vhu-3k': 'Fotos/VHU/mpa3.5.jpg',
  'mapa-vhu-1-5k': 'Fotos/VHU/mpa1.5.jpg',
  'vhu-galeria-1': 'Fotos/VHU/DSC_5619.JPG',
  'vhu-galeria-2': 'Fotos/VHU/02_PREVIA_LAGO_AMANECER_4278.jpg',
  'vhu-galeria-3': 'Fotos/VHU/03_PREVIA_GRUPO_4297.jpg',
  'vhu-galeria-4': 'Fotos/VHU/05_PREVIA_MULTITUD_4320.jpg',
  'vhu-galeria-5': 'Fotos/VHU/06_AGUA_SELFIE_4396.jpg',
  'vhu-galeria-6': 'Fotos/VHU/DSC_4451.JPG',
  'vhu-galeria-7': 'Fotos/VHU/DSC_4908.JPG',
  'vhu-galeria-8': 'Fotos/VHU/DSC_5586.JPG',
  'vhu-galeria-9': 'Fotos/VHU/isla.png',
  // Galería de la ficha: seis de la selección oficial de la edición 2025,
  // todas con el logo NHL y el crédito del Museo Malvinas horneados por el
  // fotógrafo — se dejan así, es la marca de la propia sede anfitriona, no
  // la de un tercero a recortar. Se dejaron afuera las fotos con la bandera
  // de Malvinas (tema aparte, no son del agua) y los dos aéreos, que no son
  // de esta carpeta.
  'nhl-galeria-1': 'Fotos/NHL/Seleccion NHL 2025-20260824T225500Z-1-001/Seleccion NHL 2025/JCR-3227.jpg',
  'nhl-galeria-2': 'Fotos/NHL/Seleccion NHL 2025-20260824T225500Z-1-001/Seleccion NHL 2025/JCR-1531.jpg',
  'nhl-galeria-3': 'Fotos/NHL/Seleccion NHL 2025-20260824T225500Z-1-001/Seleccion NHL 2025/JCR-1583.jpg',
  'nhl-galeria-4': 'Fotos/NHL/Seleccion NHL 2025-20260824T225500Z-1-001/Seleccion NHL 2025/JCR-3206.jpg',
  'nhl-galeria-5': 'Fotos/NHL/Seleccion NHL 2025-20260824T225500Z-1-001/Seleccion NHL 2025/JCR-3208.jpg',
  'nhl-galeria-6': 'Fotos/NHL/Seleccion NHL 2025-20260824T225500Z-1-001/Seleccion NHL 2025/JCR-3147.jpg',
  'nhl-galeria-7': 'Fotos/NHL/Seleccion NHL 2025-20260824T225500Z-1-001/Seleccion NHL 2025/JCR-3220.jpg',
  'nhl-galeria-8': 'Fotos/NHL/Seleccion NHL 2025-20260824T225500Z-1-001/Seleccion NHL 2025/JCR-3211.jpg',
  'nhl-galeria-9': 'Fotos/NHL/Seleccion NHL 2025-20260824T225500Z-1-001/Seleccion NHL 2025/JCR-3158.jpg',
  // poster del video del hero — vive fuera de SPD/VOB, así que se referencia
  // con la ruta completa en vez de una clave del índice.
  'hero-drone': 'Fotos/banner-poster/hero-drone-poster.jpg',
  'tv-hero': 'Fotos/banner-poster/travel-poster.jpg',
  // --- Ranking del home: nadadores y clubes destacados de la 2025/26 ------
  // Fotos de podio que pasó OWA (Fotos/Ranking), recortadas a un cuadrado
  // apoyado arriba: en fotos de podio la cara siempre cae en el tercio
  // superior, así que `alto` (ancho/alto original) alcanza sin tocar `top`.
  // Sirven sólo para el avatar circular de /: no van a la ficha de nadador,
  // que no existe.
  'rk-arias': { foto: 'Fotos/Ranking/arias.PNG', recorte: { alto: 0.8556 } },
  'rk-arjona': { foto: 'Fotos/Ranking/arjona.PNG', recorte: { alto: 0.8447 } },
  'rk-frida': { foto: 'Fotos/Ranking/frida.PNG', recorte: { alto: 0.8809 } },
  'rk-permikin': { foto: 'Fotos/Ranking/Permikin.PNG', recorte: { alto: 0.9399 } },
  // Recorte ajustado a la cara y no al ancho completo: con `alto: 0.75` (el
  // cuadrado tomando todo el ancho) la nadadora quedaba chica en el medio del
  // círculo, con medio metro de banderas arriba. Este achica el cuadrado al
  // entorno de la cara y lo centra ahí.
  'rk-tamara-salvano': {
    foto: 'Fotos/Ranking/Tamara Salvano.JPEG',
    recorte: { left: 0.2831, top: 0.1569, ancho: 0.5333, alto: 0.4 },
  },
  'rk-mariana-diaz': { foto: 'Fotos/Ranking/mariana.PNG', recorte: { alto: 0.8746 } },
  'rk-ianicelli': { foto: 'Fotos/Ranking/Ianicelli.JPEG', recorte: { alto: 0.6664 } },
  'rk-lamon': { foto: 'Fotos/Ranking/Lamon.JPEG', recorte: { alto: 0.6664 } },
  'rk-elosegui': { foto: 'Fotos/Ranking/elosegui.JPEG', recorte: { alto: 0.7059 } },
  'rk-bongianino': { foto: 'Fotos/Ranking/Bongianino.JPEG', recorte: { alto: 0.6664 } },
  'rk-claudia-fernandez': { foto: 'Fotos/Ranking/Claudia Fernández.JPEG', recorte: { alto: 0.6278 } },
  // Logos de club: ya son prácticamente cuadrados, sin recorte.
  'rk-villaluro': 'Fotos/Ranking/villaluro.JPEG',
  'rk-blackteam': 'Fotos/Ranking/blackteam.PNG',
  'rk-bragado': { foto: 'Fotos/Ranking/bragado.PNG', recorte: { left: 0.0578, ancho: 0.8844 } },
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
