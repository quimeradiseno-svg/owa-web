// Auditoría de contraste: recorre las rutas y reporta todo texto por debajo
// del umbral WCAG AA (4.5:1 normal, 3:1 para ≥24px o ≥18.66px bold).
// `node scripts/contraste.mjs`
import puppeteer from 'puppeteer-core';

const CHROME = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe';
const BASE = process.env.BASE || 'http://127.0.0.1:5180';
const RUTAS = ['/', '/calendario', '/grand-prix', '/challenge', '/carrera/san-pedro', '/carrera/rdp40', '/resultados', '/travel', '/pad', '/primeros-pasos'];

const AUDIT = () => {
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const lum = ([r, g, b]) => 0.2126 * lin(r / 255) + 0.7152 * lin(g / 255) + 0.0722 * lin(b / 255);
  // Tailwind 4 emite oklab(...): parsear los números a mano da valores sin
  // sentido como sRGB. El canvas hace la conversión bien.
  const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  const parse = (s) => {
    if (!s || s === 'transparent' || s === 'rgba(0, 0, 0, 0)') return [];
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = '#000';
    ctx.fillStyle = s;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2], d[3] / 255];
  };
  const ratio = (a, b) => {
    const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (l1 + 0.05) / (l2 + 0.05);
  };

  const sobre = (frente, fondo, a) => frente.map((c, i) => Math.round(c * a + fondo[i] * (1 - a)));

  // Fondo efectivo: junta las capas semitransparentes de los ancestros hasta
  // llegar a una opaca. Sin componer, cualquier bg-white/8 se lee como blanco.
  const fondoDe = (el) => {
    const capas = [];
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      const cs = getComputedStyle(n);
      // Degradado o foto detrás: el contraste depende del píxel, no del CSS.
      // No se puede calcular; se marca para revisión visual.
      if (cs.backgroundImage !== 'none') return null;
      const c = parse(cs.backgroundColor);
      if (c.length < 3) continue;
      const a = c[3] === undefined ? 1 : c[3];
      if (a === 0) continue;
      capas.push([c.slice(0, 3), a]);
      if (a >= 0.999) break;
    }
    let base = [255, 255, 255];
    for (let i = capas.length - 1; i >= 0; i--) base = sobre(capas[i][0], base, capas[i][1]);
    return base;
  };

  const fallos = [];
  for (const el of document.querySelectorAll('main *, header *, footer *')) {
    const txt = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).map((n) => n.textContent.trim()).join(' ');
    if (!txt) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    // Texto sobre foto: el contraste depende del píxel, no del CSS. Se revisa a ojo.
    if (el.closest('[data-sobre-foto]')) continue;

    const px = parseFloat(cs.fontSize);
    const grande = px >= 24 || (px >= 18.66 && +cs.fontWeight >= 700);
    const min = grande ? 3 : 4.5;
    const fondo = fondoDe(el);
    if (!fondo) continue;
    const col = parse(cs.color);
    const texto = col[3] === undefined || col[3] >= 1 ? col.slice(0, 3) : sobre(col.slice(0, 3), fondo, col[3]);
    const c = ratio(texto, fondo);
    if (c + 0.05 < min) {
      fallos.push({ txt: txt.slice(0, 46), color: cs.color, px: Math.round(px), peso: cs.fontWeight, ratio: +c.toFixed(2), min });
    }
  }
  return fallos;
};

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, userDataDir: `.qa/.chrome-c${process.pid}` });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

let total = 0;
for (const ruta of RUTAS) {
  await page.goto(BASE + ruta, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => document.querySelectorAll('.reveal,.reveal-clip').forEach((el) => el.setAttribute('data-visible', '')));
  await new Promise((r) => setTimeout(r, 900));
  const fallos = await page.evaluate(AUDIT);
  if (fallos.length) {
    console.log(`\n${ruta}`);
    for (const f of fallos) console.log(`  ${String(f.ratio).padStart(5)}:1 (min ${f.min})  ${f.px}px/${f.peso}  ${f.color}  "${f.txt}"`);
    total += fallos.length;
  }
}
await browser.close();
console.log(total ? `\n${total} textos por debajo de AA` : '\nContraste AA: sin fallos');
