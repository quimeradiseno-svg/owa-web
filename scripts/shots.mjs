// Capturas de QA. `node scripts/shots.mjs [--full] [rutas...]`
import { mkdir, writeFile } from 'node:fs/promises';
import puppeteer from 'puppeteer-core';

const CHROME = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe';
// Vite queda escuchando sólo en [::1]; Chrome resuelve "localhost" primero a
// 127.0.0.1 y se come un ERR_CONNECTION_REFUSED, así que apuntamos al literal.
const BASE = process.env.BASE || 'http://[::1]:5180';
const OUT = '.qa';

const args = process.argv.slice(2);
const full = args.includes('--full');
const rutas = args.filter((a) => !a.startsWith('--'));
const RUTAS = rutas.length ? rutas : ['/', '/calendario', '/grand-prix', '/carrera/san-pedro', '/resultados', '/travel', '/pad'];

const VIEWPORTS = [
  ['desktop', 1440, 900, 2],
  ['mobile', 390, 844, 3],
];

await mkdir(OUT, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  userDataDir: `.qa/.chrome-${process.pid}`,
  args: ['--hide-scrollbars'],
  protocolTimeout: 120000,
});
const errores = [];

for (const [nombre, w, h, dsf] of VIEWPORTS) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: dsf });
  page.on('console', (m) => m.type() === 'error' && errores.push(`[${nombre}] ${m.text()}`));
  page.on('pageerror', (e) => errores.push(`[${nombre}] ${e.message}`));

  for (const ruta of RUTAS) {
    console.log(`→ ${BASE + ruta}`);
    await page.goto(BASE + ruta, { waitUntil: 'domcontentloaded', timeout: 60000 });
    // La vista se monta con un import() dinámico: en domcontentloaded <main>
    // todavía está vacío y marcar los reveals ahí no alcanza a nada.
    await page.waitForFunction(() => document.querySelector('#contenido section, #contenido h1'), { timeout: 20000 });
    await page.evaluate(() => {
      document.querySelectorAll('.reveal, .reveal-clip').forEach((el) => el.setAttribute('data-visible', ''));
      // Sin scroll no dispara el lazy-load; para la captura las forzamos.
      document.querySelectorAll('img[loading="lazy"]').forEach((i) => (i.loading = 'eager'));
      return document.fonts.ready;
    });
    await new Promise((r) => setTimeout(r, 3000));
    const slug = ruta === '/' ? 'home' : ruta.replaceAll('/', '-').replace(/^-/, '');
    await page.screenshot({ path: `${OUT}/${slug}.${nombre}.png`, fullPage: full });
    console.log(`${OUT}/${slug}.${nombre}.png`);
  }
  await page.close();
}

await browser.close();
if (errores.length) {
  console.log('\n--- errores de consola ---');
  errores.forEach((e) => console.log(e));
  await writeFile(`${OUT}/errores.txt`, errores.join('\n'));
} else console.log('\nsin errores de consola');
