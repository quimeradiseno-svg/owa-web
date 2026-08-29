import { html, raw } from '../lib/html.js';

/* Set de iconos del sitio. Trazo 1.75 y esquinas redondeadas, igual que los
   del footer, para que todo el sistema se lea con el mismo peso. Son SVG
   dibujados, no glifos unicode ni emoji. */
const TRAZOS = {
  // Rendimiento: copa de premiacion.
  trofeo: '<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 5.5H4.5A2.5 2.5 0 0 0 7 10"/><path d="M17 5.5h2.5A2.5 2.5 0 0 1 17 10"/><path d="M12 14v4"/><path d="M8.5 20h7"/>',
  // Distancia: dos ondas separadas por la linea de superficie.
  ondas: '<path d="M3 8q3-3 6 0t6 0t6 0"/><path d="M4 13h16"/><path d="M3 17q3-3 6 0t6 0t6 0"/>',
  // Descarte: grafico con una curva adentro.
  grafico: '<rect x="3.5" y="3.5" width="17" height="17" rx="3.5"/><path d="m7.5 14.5 3-3.5 2.5 2 3.5-4.5"/>',
  // Equipos: dos personas, una detras.
  equipo: '<circle cx="9.5" cy="8" r="3.2"/><path d="M4 19.5a5.5 5.5 0 0 1 11 0"/><path d="M16.5 5.2a3.2 3.2 0 0 1 0 5.6"/><path d="M18 14.8a5.5 5.5 0 0 1 2.4 4.7"/>',
  // Sin puntaje: circulo tachado.
  sinPuntaje: '<circle cx="12" cy="12" r="8.5"/><path d="m6.2 6.2 11.6 11.6"/>',
  // Reglas propias: hoja con la esquina doblada.
  documento: '<path d="M6.5 3.5h7L18 8v11a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 19V5a1.5 1.5 0 0 1 1.5-1.5z"/><path d="M13.5 3.5V8H18"/><path d="M8.5 13h6"/><path d="M8.5 16.5h4"/>',
  // Premiacion: podio de tres escalones. La medalla con cintas, a este tamano,
  // se leia como un par de cuernos.
  podio: '<path d="M3.5 20.5V12H9V8h6v6h5.5v6.5z"/><path d="M9 12v8.5"/><path d="M15 14v6.5"/>',
  // El agua manda: dos olas, sin la linea de superficie que lleva "ondas".
  ola: '<path d="M2.5 10q3-3 6 0t6 0t6 0"/><path d="M2.5 15.5q3-3 6 0t6 0t6 0"/>',
  // Postulacion: sobre de correo.
  sobre: '<rect x="2.8" y="5" width="18.4" height="14" rx="2.2"/><path d="m3.4 6.6 7.5 5.6a2 2 0 0 0 2.2 0l7.5-5.6"/>',
  // Relay: dos nadadores, uno releva al otro.
  relevo: '<circle cx="7" cy="6.2" r="2.4"/><circle cx="17" cy="6.2" r="2.4"/><path d="M2.5 20v-3a4 4 0 0 1 4-4h1a4 4 0 0 1 4 4v3"/><path d="M12.5 20v-3a4 4 0 0 1 4-4h1a4 4 0 0 1 4 4v3"/>',
  // Cupo limitado: candado.
  cupo: '<rect x="4.5" y="10.5" width="15" height="10" rx="2.2"/><path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7"/><path d="M12 14.5v2"/>',
  // Extra: estrella.
  estrella: '<path d="m12 3 2.9 5.9 6.5 1-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.9l6.5-1z"/>',
  // Avatar genérico: usado hasta que haya foto real de cada nadador o club.
  persona: '<circle cx="12" cy="8" r="3.6"/><path d="M4.8 20a7.2 7.2 0 0 1 14.4 0"/>',
  // Tiempo estimado: reloj.
  reloj: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3.2 2"/>',
  // Neopreno: gota de agua.
  gota: '<path d="M12 3.5c3 4 5.5 7.6 5.5 10.8a5.5 5.5 0 0 1-11 0C6.5 11.1 9 7.5 12 3.5z"/>',
  // Largada: pin de ubicación.
  pin: '<path d="M12 21s6.5-6.1 6.5-11A6.5 6.5 0 0 0 5.5 10c0 4.9 6.5 11 6.5 11z"/><circle cx="12" cy="10" r="2.2"/>',
  // Llegada: bandera de cuadros.
  bandera: '<path d="M5.5 21V4"/><path d="M5.5 4.5h13l-3 3.75 3 3.75h-13"/>',
  // Día del cronograma: calendario con una fecha marcada.
  calendario:
    '<rect x="3.5" y="4.5" width="17" height="16" rx="2.2"/><path d="M3.5 9.5h17"/><path d="M8 3v3"/><path d="M16 3v3"/><circle cx="12" cy="14.5" r="1.6" fill="currentColor" stroke="none"/>',
  // Naturaleza: montaña de dos picos.
  montana: '<path d="m3 18.5 6.2-10 4 6.2 2-3 5.8 6.8z"/><path d="M9.2 8.5 12.5 12"/>',
  // Explorar: brújula.
  brujula: '<circle cx="12" cy="12" r="8.5"/><path d="m14.8 9.2-1.6 4.4-4.4 1.6 1.6-4.4z"/>',
  // Vínculo, transformación: corazón.
  corazon:
    '<path d="M12 20.2S3.5 15 3.5 9.1A4.6 4.6 0 0 1 12 6.5a4.6 4.6 0 0 1 8.5 2.6c0 5.9-8.5 11.1-8.5 11.1z"/>',
  // Alojamiento: cama.
  cama: '<path d="M3 19v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6"/><path d="M3 19v2"/><path d="M21 19v2"/><path d="M3 15V7.5A1.5 1.5 0 0 1 4.5 6H10a1.5 1.5 0 0 1 1.5 1.5V11"/>',
  // Logística: valija.
  valija: '<rect x="3.5" y="8" width="17" height="12" rx="2"/><path d="M9 8V6.3a2.3 2.3 0 0 1 2.3-2.3h1.4A2.3 2.3 0 0 1 15 6.3V8"/><path d="M3.5 13h17"/>',
  // Alcance internacional: globo terráqueo.
  globo: '<circle cx="12" cy="12" r="8.5"/><ellipse cx="12" cy="12" rx="3.4" ry="8.5"/><path d="M3.5 12h17"/>',
  // Edición anterior: entrada/ticket con perforación.
  ticket: '<rect x="3.5" y="6.5" width="17" height="11" rx="2.5"/><path d="M13.5 6.5v11" stroke-dasharray="2 2.2"/>',
  // Más información: i minúscula en círculo.
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5"/><circle cx="12" cy="8" r="1" fill="currentColor" stroke="none"/>',
  // Completar la distancia: recorrido punteado que termina en un pin.
  ruta: '<circle cx="5" cy="18" r="1.9"/><path d="M7.2 17.2c3-.9 4.8-2.4 5.8-4.2" stroke-dasharray="2 2.6"/><path d="M16.5 13.5s3.5-3.3 3.5-5.9a3.5 3.5 0 1 0-7 0c0 2.6 3.5 5.9 3.5 5.9z"/><circle cx="16.5" cy="7.6" r="1.2"/>',
  // Asistencia en el agua: chaleco salvavidas.
  chaleco:
    '<path d="M9.5 3.5 6.5 5.3V19A1.5 1.5 0 0 0 8 20.5h2.5v-17z"/><path d="M14.5 3.5l3 1.8V19a1.5 1.5 0 0 1-1.5 1.5h-2.5v-17z"/><path d="M9.5 3.5 12 6l2.5-2.5"/><path d="M6.5 10.5h4"/><path d="M13.5 10.5h4"/>',
  // Seguridad: escudo con tilde.
  escudo: '<path d="M12 3 5 5.8v5.4c0 4.2 2.9 7.7 7 8.8 4.1-1.1 7-4.6 7-8.8V5.8z"/><path d="m9.1 11.8 2.2 2.2 3.7-4"/>',
};

export const icono = (nombre, clase = 'size-7') =>
  TRAZOS[nombre]
    ? html`<svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="${clase}"
        aria-hidden="true"
      >
        ${raw(TRAZOS[nombre])}
      </svg>`
    : '';
