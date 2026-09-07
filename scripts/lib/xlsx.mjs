// Lector mínimo de .xlsx, sin dependencias.
//
// Un xlsx es un zip con XML adentro. Node trae inflate (zlib) pero no un
// lector de zip, así que acá va uno chico: alcanza con recorrer el directorio
// central y descomprimir las entradas que interesan.
//
// Sólo lee lo que necesita el importador de rankings: nombres de hojas y
// celdas con su valor ya resuelto. No interpreta formatos, fechas ni fórmulas
// (de las fórmulas usa el valor cacheado, que es lo que Excel dejó escrito).
import { readFileSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';

/* ------------------------------------------------------------------- zip */

function entradas(buf) {
  // El fin del directorio central (EOCD) está al final del archivo, después
  // de un comentario de largo variable: hay que buscar la firma hacia atrás.
  let eocd = -1;
  for (let i = buf.length - 22; i >= 0 && i > buf.length - 65558; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error('No parece un zip: falta el directorio central');

  const total = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const salida = new Map();

  for (let i = 0; i < total; i++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) break;
    const metodo = buf.readUInt16LE(p + 10);
    const comprimido = buf.readUInt32LE(p + 20);
    const nLargo = buf.readUInt16LE(p + 28);
    const eLargo = buf.readUInt16LE(p + 30);
    const cLargo = buf.readUInt16LE(p + 32);
    const desplazamiento = buf.readUInt32LE(p + 42);
    const nombre = buf.toString('utf8', p + 46, p + 46 + nLargo);

    // La cabecera local repite los largos de nombre y extra, y no siempre
    // coinciden con los del directorio: hay que leerlos de ahí.
    const nLocal = buf.readUInt16LE(desplazamiento + 26);
    const eLocal = buf.readUInt16LE(desplazamiento + 28);
    const desde = desplazamiento + 30 + nLocal + eLocal;
    const crudo = buf.subarray(desde, desde + comprimido);

    salida.set(nombre, metodo === 0 ? crudo : inflateRawSync(crudo));
    p += 46 + nLargo + eLargo + cLargo;
  }
  return salida;
}

/* ------------------------------------------------------------------- xml */

const desescapar = (s) =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&amp;/g, '&');

const texto = (xml) => [...xml.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((m) => desescapar(m[1])).join('');

// 'BC' -> 55. Las columnas del xlsx se numeran en base 26 con letras.
const numeroDeColumna = (letras) => [...letras].reduce((a, c) => a * 26 + (c.charCodeAt(0) - 64), 0);

/* ---------------------------------------------------------------- lectura */

export function abrir(ruta) {
  const zip = entradas(readFileSync(ruta));
  const leer = (n) => (zip.has(n) ? zip.get(n).toString('utf8') : null);

  // Tabla de strings compartida: las celdas de texto guardan un índice acá.
  const compartidas = leer('xl/sharedStrings.xml');
  const strings = compartidas ? [...compartidas.matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) => texto(m[1])) : [];

  // El workbook nombra las hojas y las referencia por rId; el archivo real de
  // cada una sale de los rels. El orden de <sheet> no garantiza sheetN.xml.
  const rels = leer('xl/_rels/workbook.xml.rels') ?? '';
  const destino = {};
  for (const m of rels.matchAll(/<Relationship[^>]*>/g)) {
    const id = /Id="([^"]+)"/.exec(m[0])?.[1];
    const target = /Target="([^"]+)"/.exec(m[0])?.[1];
    if (id && target) destino[id] = 'xl/' + target.replace(/^\/?xl\//, '');
  }

  const hojas = [...(leer('xl/workbook.xml') ?? '').matchAll(/<sheet[^>]*\/>/g)].map((m) => ({
    nombre: desescapar(/name="([^"]*)"/.exec(m[0])?.[1] ?? '').trim(),
    archivo: destino[/r:id="([^"]*)"/.exec(m[0])?.[1]],
  }));

  /** Devuelve la hoja como matriz de strings. Las celdas vacías quedan ''. */
  const filas = (nombreHoja) => {
    const hoja = hojas.find((h) => h.nombre === nombreHoja.trim());
    if (!hoja) throw new Error(`No existe la hoja "${nombreHoja}" en ${ruta}`);
    const xml = leer(hoja.archivo) ?? '';
    const salida = [];

    for (const f of xml.matchAll(/<row[^>]*r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g)) {
      const celdas = [];
      // Las celdas vacías vienen auto-cerradas (<c r="H67" s="10"/>). Si el
      // patrón no las contempla se come la celda siguiente y corre la fila
      // entera un lugar, que es exactamente el tipo de error que después
      // aparece como "el ranking está desordenado".
      for (const c of f[2].matchAll(/<c([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        const ref = /r="([A-Z]+)\d+"/.exec(c[1])?.[1];
        if (!ref) continue;
        const tipo = /t="([^"]+)"/.exec(c[1])?.[1];
        const cuerpo = c[2] ?? '';
        let valor;
        if (tipo === 'inlineStr') valor = texto(cuerpo);
        else {
          const v = /<v>([\s\S]*?)<\/v>/.exec(cuerpo)?.[1];
          valor = v == null ? '' : tipo === 's' ? (strings[+v] ?? '') : desescapar(v);
        }
        celdas[numeroDeColumna(ref) - 1] = valor;
      }
      salida[+f[1] - 1] = celdas;
    }
    // Rellena los huecos: una hoja puede saltear filas enteras.
    return Array.from({ length: salida.length }, (_, i) =>
      Array.from(salida[i] ?? [], (c) => (c ?? '').toString().trim())
    );
  };

  return { hojas: hojas.map((h) => h.nombre), filas };
}
