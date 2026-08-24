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
