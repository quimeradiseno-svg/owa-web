// Importa el ranking de la temporada 2025/26 desde las planillas de OWA.
//
//   node scripts/rankings.mjs
//
// Lee Ranking/*.xlsx (fuera del repo: tienen el DNI de cada nadador) y escribe
// dos módulos generados a mano-libre en src/data/. No editar esos archivos:
// se regeneran corriendo esto de nuevo.
//
// Es contenido puente. El 31 de octubre de 2026, con la primera fecha de
// Luján, esta temporada se borra y el sitio arranca 26/27 desde cero: por eso
// la normalización llega hasta donde hace falta para que se lea bien y no más.
//
// Decisiones de OWA que están cableadas acá:
//   · El DNI no se publica ni se guarda. Se descarta al leer.
//   · Se ordena por puntaje. Dos planillas venían ordenadas por una fecha
//     anterior a la última y no se reordenaron (ver el reporte al final).
//   · Las categorías con la distancia adelante ("18KM Caballeros 40 a 44") son
//     las de siempre; se les saca el prefijo.
//   · Neopreno es una sola categoría por género y va aparte del general.
//   · "Libre" y "Sin equipo" son lo mismo: sin club.
import { writeFile } from 'node:fs/promises';
import { abrir } from './lib/xlsx.mjs';

const ORIGEN = 'Ranking';
const TEMPORADA = '2025/26';

// Una entrada por planilla. `fechas` son las columnas de puntaje, en orden;
// el ancho de esa lista es lo que ubica a las columnas Total / Nombre /
// Categoría / Equipo, que vienen siempre después.
const PLANILLAS = [
  { archivo: 'Posiciones GP hombres.xlsx', torneo: 'grand-prix', sexo: 'M', fechas: ['LBC', 'VOB', 'NHL', 'ISC'] },
  { archivo: 'Posiciones GP Mujeres.xlsx', torneo: 'grand-prix', sexo: 'F', fechas: ['LBC', 'VOB', 'NHL', 'ISC'] },
  { archivo: 'Posiciones CO hombres.xlsx', torneo: 'circuito', sexo: 'M', fechas: ['LBC', 'SPD', 'PNR', 'VHU', 'CLN', 'PAD'] },
  { archivo: 'Posiciones CO Mujeres.xlsx', torneo: 'circuito', sexo: 'F', fechas: ['LBC', 'SPD', 'PNR', 'VHU', 'CLN', 'PAD'] },
];

const EQUIPOS = { archivo: 'Campeonato por equipos 2025-2026.xlsx', hoja: 'Total' };

// Nadadoras cargadas dos veces con el nombre escrito distinto. Confirmado por
// OWA que son la misma persona. Se fusionan sumando fecha por fecha y queda el
// primer nombre del par, que es el que se publica.
//
// Los nombres van como quedan después de nombreDe(), y la comparación es
// exacta —acentos incluidos—: "MARCÓ Inés" y "MARCO Ines" se distinguen sólo
// por la tilde, así que una clave sin acentos las tomaría por la misma fila.
const MISMA_PERSONA = [
  ['MARCÓ Inés', 'MARCO Ines'],
  ['ALVAREZ Xiomara Unelen', 'MONGES ALVAREZ Xiomara Unelen'],
];

const avisos = [];

/* ------------------------------------------------------------------ texto */

// Las planillas traen el apellido en mayúsculas pero con la vocal acentuada en
// minúscula: ACUñA, MARTíNEZ, BAZáN. Se detecta que la palabra no tiene ni una
// minúscula ASCII y se pasa entera a mayúsculas.
const arreglarAcentos = (s) =>
  s.replace(/\S+/g, (p) => (/[a-z]/.test(p) || !/[A-ZÁÉÍÓÚÑÜ]/.test(p) ? p : p.toUpperCase()));

const capitalizar = (s) => s.replace(/\S+/g, (p) => p[0].toUpperCase() + p.slice(1).toLowerCase());

const nombreDe = (crudo) => {
  const s = crudo.replace(/\s+/g, ' ').trim();
  // Unas pocas filas vienen enteras en minúscula ("mauricio ruben arias").
  return /[A-ZÁÉÍÓÚÑÜ]/.test(s) ? arreglarAcentos(s) : capitalizar(s);
};

const sinTildes = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const clave = (s) => sinTildes(s).toLowerCase().replace(/[^a-z0-9]/g, '');

/* ------------------------------------------------------------ categorías */

const NEOPRENO = 'Neopreno';
const HASTA_19 = 'Hasta 19';
const MAYORES = '65 y más';

/** Normaliza la categoría a su tramo de edad, sin el género (ya lo sabemos
    por la planilla) ni la distancia de la prueba. */
function categoriaDe(crudo) {
  const s = sinTildes(crudo).toLowerCase();
  if (/neopren/.test(s)) return NEOPRENO;

  // "18KM Caballeros 40 a 44 Años", "2,5 km - Damas (35 a 39 anos)": la
  // distancia y el género quedan afuera, sólo interesa el tramo.
  const edades = s.replace(/[()]/g, ' ').match(/\d+/g)?.map(Number) ?? [];

  if (/hasta\s*19|menos de\s*20/.test(s)) return HASTA_19;
  if (/en adelante|mas de|\+\s*\d/.test(s)) return MAYORES;

  // El primer par de números que sea un tramo de edad plausible. Se descartan
  // los que vienen de la distancia (18KM, 2,5 km, 5km) porque un tramo real
  // siempre son dos números y el segundo es mayor que el primero.
  for (let i = 0; i < edades.length - 1; i++) {
    const [a, b] = [edades[i], edades[i + 1]];
    if (a >= 19 && b > a && b - a <= 6) return a >= 65 ? MAYORES : `${a} a ${b}`;
  }
  if (edades.includes(19)) return HASTA_19;

  avisos.push(`Categoría sin tramo reconocible: "${crudo}"`);
  return crudo;
}

// Orden del selector: por edad, con neopreno al final porque no es un tramo.
const ordenCategoria = (c) => (c === HASTA_19 ? 0 : c === NEOPRENO ? 999 : c === MAYORES ? 65 : (parseInt(c, 10) || 500));

/* ---------------------------------------------------------------- clubes */

const SIN_CLUB = /^(libre|sin equipo|s\/e|-{1,2})$/i;

/** Junta las variantes de mayúsculas y acentos de un mismo club en la forma
    más usada. OWA no tiene listado oficial de equipos, así que no se toca más
    que eso: nada de fusionar siglas con nombres largos por parecido. */
function unificadorDeClubes(todos) {
  const usos = new Map();
  for (const c of todos) {
    if (!c) continue;
    const k = clave(c);
    if (!usos.has(k)) usos.set(k, new Map());
    const m = usos.get(k);
    m.set(c, (m.get(c) ?? 0) + 1);
  }
  const canon = new Map();
  for (const [k, m] of usos) {
    const [mejor] = [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'es'));
    canon.set(k, mejor[0]);
  }
  return (c) => (!c || SIN_CLUB.test(c.trim()) ? '' : (canon.get(clave(c)) ?? c.trim()));
}

/* --------------------------------------------------------------- lectura */

function leerPlanilla({ archivo, torneo, sexo, fechas }) {
  const libro = abrir(`${ORIGEN}/${archivo}`);
  const filas = libro.filas('Grales').filter((f) => f.some((c) => c));

  const nF = fechas.length;
  const [iTotal, iNombre, iCategoria, iEquipo] = [2 + nF, 3 + nF, 4 + nF, 5 + nF];

  // La primera fila es cabecera en unas planillas y datos en otras.
  const esCabecera = /dni/i.test(filas[0]?.[0] ?? '');
  if (!esCabecera) avisos.push(`${archivo}: la hoja Grales no tiene fila de cabecera`);

  let rescatadas = 0;
  let discrepancias = 0;
  const nadadores = filas.slice(esCabecera ? 1 : 0).map((f) => {
    const puntos = fechas.map((_, i) => Number(f[2 + i]) || 0);
    // La planilla calcula SUMA - PEOR (descarte del peor puntaje). Se recalcula
    // en vez de leer la columna: en Circuito la fórmula no llegó hasta abajo de
    // todo y a los que sólo corrieron la última fecha les quedó el total en 0.
    const total = puntos.reduce((a, n) => a + n, 0) - Math.min(...puntos);
    const guardado = f[iTotal] === '' ? null : Number(f[iTotal]);
    if (guardado != null && guardado !== total) (guardado === 0 && total > 0 ? rescatadas++ : discrepancias++);

    return {
      nombre: nombreDe(f[iNombre] ?? ''),
      cat: categoriaDe(f[iCategoria] ?? ''),
      clubCrudo: (f[iEquipo] ?? '').trim(),
      puntos: total,
      fechas: puntos,
    };
  });

  if (rescatadas) avisos.push(`${archivo}: ${rescatadas} filas que la planilla dejó en 0 (la fórmula no llegó hasta abajo) y se recalcularon`);
  if (discrepancias) avisos.push(`REVISAR — ${archivo}: ${discrepancias} filas donde el total recalculado no coincide con el de la planilla`);

  // Fusiona las cargadas dos veces: se suma fecha por fecha y se vuelve a
  // aplicar el descarte sobre el total ya unido. Queda la primera del par.
  for (const [canon, otra] of MISMA_PERSONA) {
    const iA = nadadores.findIndex((n) => n.nombre === canon);
    const iB = nadadores.findIndex((n) => n.nombre === otra);
    if (iA < 0 || iB < 0 || iA === iB) {
      if (nadadores.some((n) => n.nombre === canon || n.nombre === otra))
        avisos.push(`REVISAR — no se pudo fusionar "${canon}" con "${otra}" en ${archivo}: no aparecen como dos filas distintas`);
      continue;
    }
    const [uno, dos] = [nadadores[iA], nadadores[iB]];
    uno.fechas = uno.fechas.map((v, i) => v + dos.fechas[i]);
    uno.puntos = uno.fechas.reduce((x, n) => x + n, 0) - Math.min(...uno.fechas);
    // Las dos filas no siempre traen el mismo club, ni las dos traen alguno.
    uno.clubCrudo = uno.clubCrudo || dos.clubCrudo;
    nadadores.splice(iB, 1);
    avisos.push(`Fusionados "${canon}" y "${otra}" en ${archivo}: ${uno.puntos} puntos, club "${uno.clubCrudo || 'sin club'}"`);
  }

  return { torneo, sexo, fechas, nadadores };
}

/* ---------------------------------------------------------------- puestos */

/** Ordena por puntaje y numera con empates compartidos (1, 2, 2, 4). */
function numerar(lista) {
  const ordenada = [...lista].sort((a, b) => b.puntos - a.puntos || a.nombre.localeCompare(b.nombre, 'es'));
  let pos = 0;
  let anterior = null;
  return ordenada.map((n, i) => {
    if (n.puntos !== anterior) {
      pos = i + 1;
      anterior = n.puntos;
    }
    return { ...n, pos };
  });
}

/* ----------------------------------------------------------------- salida */

const js = (v, sangria) => JSON.stringify(v, null, sangria);

const moduloCompleto = (datos) => `// GENERADO por scripts/rankings.mjs — no editar a mano.
// Ranking final de la temporada ${TEMPORADA}, tal como lo cerró OWA.
//
// Contenido puente: se borra cuando arranca 26/27 (Luján, 31/10/2026).
// Las siglas ISC y PAD son fechas de ${TEMPORADA} que no se corren en 26/27.
//
// No incluye el DNI: las planillas de origen lo traen y se descarta al importar.
export const TEMPORADA = ${js(TEMPORADA)};
export const FECHAS = ${js(datos.fechas)};
export const CATEGORIAS = ${js(datos.categorias)};

export const RANKING = {
${Object.entries(datos.ranking)
  .map(
    ([torneo, porSexo]) => `  ${js(torneo)}: {
${Object.entries(porSexo)
  .map(
    ([sexo, filas]) => `    ${sexo}: [
${filas.map((n) => `      ${js(n)},`).join('\n')}
    ],`
  )
  .join('\n')}
  },`
  )
  .join('\n')}
};

export const EQUIPOS = [
${datos.equipos.map((e) => `  ${js(e)},`).join('\n')}
];
`;

const moduloDestacados = (d) => `// GENERADO por scripts/rankings.mjs — no editar a mano.
// Los primeros de cada tabla de ${TEMPORADA}, para el módulo del home. Va
// aparte del ranking completo para que el home no cargue las ${d.total} filas.
export const TEMPORADA = ${js(TEMPORADA)};
export const DESTACADOS = ${js(d.destacados, 2)};
export const CLUBES = ${js(d.clubes, 2)};
`;

/* ------------------------------------------------------------------ main */

const planillas = PLANILLAS.map(leerPlanilla);

// El unificador de clubes se arma con todos los nombres juntos: la misma
// variante puede aparecer en una planilla y la forma buena en otra.
const unificarClub = unificadorDeClubes(planillas.flatMap((p) => p.nadadores.map((n) => n.clubCrudo)));

const ranking = {};
const categorias = new Set();

for (const { torneo, sexo, nadadores } of planillas) {
  const limpios = nadadores.map(({ clubCrudo, ...n }) => ({ ...n, club: unificarClub(clubCrudo) }));
  const generales = numerar(limpios);

  // Puesto dentro de la categoría, calculado acá para que la vista no tenga
  // que rehacerlo en cada filtro.
  const porCat = new Map();
  for (const n of generales) {
    if (!porCat.has(n.cat)) porCat.set(n.cat, []);
    porCat.get(n.cat).push(n);
  }
  for (const [, lista] of porCat) numerar(lista).forEach((n, i) => (lista[i].posCat = n.pos));

  generales.forEach((n) => categorias.add(n.cat));
  ranking[torneo] ??= {};
  ranking[torneo][sexo] = generales.map((n) => ({
    pos: n.pos,
    posCat: n.posCat,
    nombre: n.nombre,
    cat: n.cat,
    club: n.club,
    puntos: n.puntos,
    fechas: n.fechas,
  }));
}

// Cuántos nadadores puntuaron para cada club. No sale de ninguna planilla: se
// cuenta sobre el ranking ya unificado. Es "los que sumaron puntos", no la
// cantidad de socios del club.
const nadadoresPorClub = new Map();
for (const porSexo of Object.values(ranking))
  for (const lista of Object.values(porSexo))
    for (const n of lista) {
      if (!n.club) continue;
      if (!nadadoresPorClub.has(n.club)) nadadoresPorClub.set(n.club, new Set());
      nadadoresPorClub.get(n.club).add(n.nombre);
    }

// Equipos: la planilla trae la columna Posicion desactualizada, se renumera.
const libroEquipos = abrir(`${ORIGEN}/${EQUIPOS.archivo}`);
const filasEq = libroEquipos.filas(EQUIPOS.hoja).filter((f) => f.some((c) => c));
const cabEq = filasEq[0];
const iTotalEq = cabEq.findIndex((c) => /^total/i.test(c));
const fechasEq = cabEq.slice(2, iTotalEq).map((c) => c.trim());
const equipos = numerar(
  filasEq
    .slice(1)
    .filter((f) => f[1])
    .map((f) => ({
      nombre: unificarClub(f[1]) || f[1].trim(),
      puntos: Number(f[iTotalEq]) || 0,
      fechas: fechasEq.map((_, i) => Number(f[2 + i]) || 0),
    }))
).map(({ pos, nombre, puntos, fechas }) => ({
  pos,
  nombre,
  nadadores: nadadoresPorClub.get(nombre)?.size ?? 0,
  puntos,
  fechas,
}));

const sinNadadores = equipos.filter((e) => !e.nadadores);
if (sinNadadores.length)
  avisos.push(`${sinNadadores.length} clubes del campeonato no cruzan con ningún nadador del ranking (${sinNadadores.slice(0, 5).map((e) => e.nombre).join(', ')})`);

const datos = {
  fechas: { 'grand-prix': PLANILLAS[0].fechas, circuito: PLANILLAS[2].fechas, equipos: fechasEq },
  categorias: [...categorias].sort((a, b) => ordenCategoria(a) - ordenCategoria(b)),
  ranking,
  equipos,
};

// Busca filas que parezcan la misma persona cargada dos veces: mismo apellido
// y mismo primer nombre de pila. No fusiona nada —la coincidencia puede ser
// casualidad, y de hecho alguna lo es— sólo las lista para que OWA confirme.
// Las que ya confirmaron viven en MISMA_PERSONA y a esta altura ya se unieron.
for (const [torneo, porSexo] of Object.entries(ranking))
  for (const [sexo, lista] of Object.entries(porSexo)) {
    const porClave = new Map();
    for (const n of lista) {
      const partes = clave(n.nombre.split(' ').filter((p) => p === p.toUpperCase() && p.length > 1).join(' '));
      const pila = sinTildes(n.nombre).toLowerCase().split(/\s+/).find((p) => p && !partes.includes(clave(p))) ?? '';
      const k = `${partes}|${clave(pila)}`;
      if (!porClave.has(k)) porClave.set(k, []);
      porClave.get(k).push(n);
    }
    for (const iguales of porClave.values())
      if (iguales.length > 1)
        avisos.push(
          `CONFIRMAR con OWA — ¿misma persona? ${torneo} ${sexo}: ` +
            iguales.map((n) => `"${n.nombre}" (${n.cat}, ${n.club || 'sin club'}, ${n.puntos} pts)`).join(' vs ')
        );
  }

const total = Object.values(ranking).reduce((a, t) => a + Object.values(t).reduce((b, l) => b + l.length, 0), 0);
const destacados = Object.fromEntries(
  Object.entries(ranking).map(([torneo, porSexo]) => [
    torneo,
    Object.fromEntries(
      Object.entries(porSexo).map(([sexo, filas]) => [
        sexo,
        filas.slice(0, 5).map(({ pos, nombre, cat, club, puntos }) => ({ pos, nombre, cat, club, puntos })),
      ])
    ),
  ])
);

await writeFile('src/data/ranking-2526.js', moduloCompleto(datos));
await writeFile(
  'src/data/ranking-destacados.js',
  moduloDestacados({ total, destacados, clubes: equipos.slice(0, 5).map(({ pos, nombre, nadadores, puntos }) => ({ pos, nombre, nadadores, puntos })) })
);

/* ---------------------------------------------------------------- reporte */

console.log(`Temporada ${TEMPORADA}`);
for (const [torneo, porSexo] of Object.entries(ranking))
  for (const [sexo, filas] of Object.entries(porSexo))
    console.log(`  ${torneo.padEnd(11)} ${sexo}  ${String(filas.length).padStart(4)} nadadores  ·  puntero ${filas[0].nombre} (${filas[0].puntos})`);
console.log(`  equipos         ${String(equipos.length).padStart(4)} clubes      ·  puntero ${equipos[0].nombre} (${equipos[0].puntos})`);
console.log(`  categorías      ${datos.categorias.join(' · ')}`);
console.log(`  total           ${total} nadadores, sin un solo DNI`);
if (avisos.length) {
  console.log('\nAvisos:');
  for (const a of avisos) console.log('  · ' + a);
}
