// Datos estructurados (JSON-LD), armados sólo con datos que el sitio ya
// muestra. Nada de precios, cupos ni horarios inventados: si el dato no está
// en eventos.js o fichas.js, la propiedad no se emite.
import { ORIGEN, SITIO, url } from '../data/sitio.js';
import { fichaDe } from '../data/fichas.js';
import { sinIngreso } from '../data/eventos.js';

export const organizacion = () => ({
  '@type': 'SportsOrganization',
  '@id': `${ORIGEN}/#organizacion`,
  name: SITIO.nombre,
  alternateName: SITIO.sigla,
  url: ORIGEN,
  email: SITIO.email,
  telephone: SITIO.telefono,
  sameAs: SITIO.redes,
  sport: 'Open water swimming',
  areaServed: { '@type': 'Country', name: 'Argentina' },
});

export const sitioWeb = () => ({
  '@type': 'WebSite',
  '@id': `${ORIGEN}/#sitio`,
  url: ORIGEN,
  name: SITIO.nombre,
  inLanguage: SITIO.idioma,
  publisher: { '@id': `${ORIGEN}/#organizacion` },
});

/** Migas de pan. `partes` es [[nombre, ruta], ...] sin incluir el Inicio. */
export const migas = (partes) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [['Inicio', '/'], ...partes].map(([name, ruta], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: url(ruta),
  })),
});

/** Envuelve uno o varios nodos en un @graph con el contexto. */
export const grafo = (...nodos) => ({ '@context': 'https://schema.org', '@graph': nodos.filter(Boolean) });

// "DD/MM/YYYY" -> "YYYY-MM-DD". Sin hora: el dato horario vive en el
// cronograma de cada ficha y no todas lo tienen, así que no se infiere.
const fechaISO = (f) => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(f || '');
  return m ? `${m[3]}-${m[2]}-${m[1]}` : null;
};

// Provincia por sede, para poder emitir una dirección con algo más que la
// ciudad. Sale del propio campo `sede` de eventos.js, que ya la nombra.
const PROVINCIA = {
  'Buenos Aires': 'Buenos Aires',
  'Entre Ríos': 'Entre Ríos',
  'Río Negro': 'Río Negro',
};

const direccionDe = (e) => {
  const partes = String(e.sede || '').split('·').map((s) => s.trim());
  const ciudad = partes[0] || '';
  const provincia = Object.keys(PROVINCIA).find((p) => (e.sede || '').includes(p));
  if (!ciudad) return null;
  return {
    '@type': 'PostalAddress',
    addressLocality: ciudad,
    ...(provincia ? { addressRegion: provincia } : {}),
    addressCountry: 'AR',
  };
};

const ESTADO = {
  abierta: 'https://schema.org/EventScheduled',
  proximamente: 'https://schema.org/EventScheduled',
  cerrada: 'https://schema.org/EventScheduled',
};

/**
 * SportsEvent de una carrera. Cada propiedad sale de un dato existente:
 * - fecha: la jornada más temprana, o la fecha del evento si no tiene jornadas
 * - lugar: sede (y el predio de la ficha, cuando está cargado)
 * - inscripción: sólo si hay link real
 */
export function eventoDeportivo(e) {
  const f = fichaDe(e.slug);
  const fechas = (e.jornadas || []).map((j) => fechaISO(j.fecha)).filter(Boolean).sort();
  const inicio = fechas[0] || null;
  const fin = fechas.length > 1 ? fechas.at(-1) : null;

  // Sin fecha no hay Event válido: Google pide `startDate`, así que emitirlo
  // daría un error de validación a cambio de nada. Las travesías del
  // Challenge corren en una ventana ("verano 2027"), no en un día cerrado:
  // se quedan con las migas y sin SportsEvent hasta que tengan fecha.
  if (!inicio) return null;

  // Ramallo tiene jornadas con fecha (12/12, 13/12) pero esa fecha todavía no
  // la confirmó la sede: la propia página lo dice ("fecha a confirmar") y no
  // se puede entrar a ella desde ningún lado. Emitir un startDate acá
  // contradiría el cartel — la ficha ya es noindex (ver evento.js), así que
  // no perdemos nada dejándola también sin SportsEvent hasta que se confirme.
  if (sinIngreso(e)) return null;

  const direccion = direccionDe(e);
  const lugar = direccion
    ? { '@type': 'Place', name: f?.sedeBarra || e.sede, address: direccion }
    : null;

  return {
    '@type': 'SportsEvent',
    '@id': `${url(`/carrera/${e.slug}`)}#evento`,
    name: e.nombre,
    url: url(`/carrera/${e.slug}`),
    sport: 'Open water swimming',
    startDate: inicio,
    ...(fin ? { endDate: fin } : {}),
    ...(lugar ? { location: lugar } : {}),
    image: `${ORIGEN}/img/${e.img}-1250.jpg`,
    eventStatus: ESTADO[e.estado] || ESTADO.proximamente,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    organizer: { '@id': `${ORIGEN}/#organizacion` },
    // Sin `offers` por decisión de OWA: el precio no se publica acá, vive en
    // Cronometraje Instantáneo, que es donde se inscribe. Google pide `price`
    // y `priceCurrency` dentro de offers, así que emitirlo sólo con la URL
    // daría una advertencia de validación a cambio de poco: el link a la
    // inscripción ya está en la página, y `url` de este mismo evento lleva
    // hasta ella.
  };
}
