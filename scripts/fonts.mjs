// Converts the brand TTFs in Fonts/ to woff2 in public/fonts/.
// Only the weights the site actually uses are shipped: Vito Wide 700/900, Lato 400/700.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { compress } from 'wawoff2';

const FACES = [
  ['Vito Wide Bold.ttf', 'vito-wide-700.woff2'],
  ['Vito Wide Black.ttf', 'vito-wide-900.woff2'],
  ['Lato-Regular.ttf', 'lato-400.woff2'],
  ['Lato-Bold.ttf', 'lato-700.woff2'],
];

await mkdir('public/fonts', { recursive: true });

for (const [src, out] of FACES) {
  const ttf = await readFile(`Fonts/${src}`);
  const woff2 = await compress(ttf);
  await writeFile(`public/fonts/${out}`, woff2);
  const pct = Math.round((1 - woff2.length / ttf.length) * 100);
  console.log(`${out}  ${(woff2.length / 1024).toFixed(0)}KB  (-${pct}%)`);
}
