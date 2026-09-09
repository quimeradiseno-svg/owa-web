// Beneficios por carrera: lo que gana quien se inscribe a esa fecha puntual.
//
// Van por slug de carrera y no en una lista general porque son propios de cada
// evento — el acuerdo con la marca se cierra carrera por carrera. Una carrera
// sin beneficios cargados no muestra el botón "Ver beneficios" en su ficha
// (ver beneficiosHref en src/views/evento.js), así que agregar acá una entrada
// nueva es lo único que hace falta para que aparezca.
//
// La marca sale de MARCAS (sponsors.js): mismo logo y misma URL que el zócalo
// de sponsors de la ficha, sin duplicar.
import { MARCAS } from './sponsors.js';

/** Un beneficio con `codigo` en blanco se muestra igual, pero avisando que el
    código todavía no está — nunca con un placeholder tipo "XXXXXXX", que en
    la página en vivo se lee como un error. */
export const BENEFICIOS = {
  colon: [
    {
      id: 'nexalba-20-off',
      etiqueta: 'Beneficio para inscriptos',
      marca: MARCAS.nexalba,
      // El número manda: es lo primero que se lee de la tarjeta.
      destacado: '20%',
      unidad: 'OFF',
      titulo: 'En toda la web de Nexalba',
      detalle: 'Para cualquier persona inscripta a la carrera.',
      // Pendiente: OWA todavía no pasó el código. Con el valor real acá, la
      // tarjeta lo muestra en el recuadro con el botón de copiar.
      codigo: '',
      href: MARCAS.nexalba.href,
    },
  ],
};

export const beneficiosDe = (slug) => BENEFICIOS[slug] || [];

/** Slugs con beneficios reales cargados. Lo usan el prerender y el sitemap
    para no generar ni ofrecer a Google páginas de beneficios vacías. */
export const CON_BENEFICIOS = Object.keys(BENEFICIOS).filter((slug) => BENEFICIOS[slug].length);
