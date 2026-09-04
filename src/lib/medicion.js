// Cuándo se mide y cuándo no. Una sola regla para Analytics y para el pixel de
// Meta, así no se les puede ir la mano a cada uno por su lado.
//
// POR QUÉ NO MEDIMOS EN EL DOMINIO PROVISORIO
// -------------------------------------------
// Mientras el sitio vive en la URL de Vercel, las únicas visitas son las de
// OWA y las nuestras revisando. Contarlas tiene dos costos concretos:
//
// - En Analytics ensucia la línea de base: después no se puede comparar
//   "desde el lanzamiento" sin arrastrar las recargas de desarrollo.
// - En el pixel es peor: su trabajo es armar audiencias para publicidad, y
//   arrancaría aprendiendo de tres personas que no son el público. Meta
//   además pide verificar el dominio, y un `vercel.app` no se puede verificar
//   porque no es nuestro.
//
// Por eso la medición se enciende sola el día que el DNS apunte a
// ORIGEN_FINAL. No hay que acordarse de nada: cambia el dominio y arranca.
//
// PARA PROBARLA ANTES
// -------------------
// Entrando con `?medicion=1` se habilita por lo que dure la pestaña. Sirve
// para verificar en Vercel que los eventos llegan, sin dejarla prendida.
import { ORIGEN_FINAL } from '../data/sitio.js';

const HOST_FINAL = new URL(ORIGEN_FINAL).hostname.replace(/^www\./, '');
const LLAVE = 'owa-medicion';

// Se lee una vez y se recuerda: el parámetro se pierde al navegar dentro de
// la SPA, pero la intención de estar probando dura toda la sesión.
try {
  if (new URLSearchParams(location.search).get('medicion') === '1') {
    sessionStorage.setItem(LLAVE, '1');
  }
} catch {
  // Modo incógnito o cookies bloqueadas: sin llave, se sigue de largo.
}

/** ¿Se mide en este dominio? */
export function medicionActiva() {
  const host = location.hostname.replace(/^www\./, '');
  if (host === HOST_FINAL) return true;
  try {
    return sessionStorage.getItem(LLAVE) === '1';
  } catch {
    return false;
  }
}
