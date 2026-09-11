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

/** El 20% OFF de Nexalba es, por ahora, el mismo beneficio para todas las
    carreras que lo tienen — de ahí la función en vez de un objeto suelto: da
    un objeto nuevo por carrera (para no compartir referencia entre ellas) y
    el día que una fecha necesite su propio código o su propio texto, se
    corta de acá y se escribe aparte sin tocar a las demás.

    Un beneficio con `codigo` en blanco se muestra igual, pero avisando que el
    código todavía no está — nunca con un placeholder tipo "XXXXXXX", que en
    la página en vivo se lee como un error. */
const nexalba20 = () => ({
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
});

// Endorphin no es un sponsor del zócalo (por eso su logo no vive en MARCAS,
// de sponsors.js): es un servicio propio para esta tarjeta de beneficios.
// Sin número de la fecha ni destacado/unidad como Nexalba —Endorphin no es un
// descuento, es una lista de servicios— así que esta tarjeta usa `lista` en
// vez de `destacado`/`unidad`/`codigo`; ver tarjetaServicio() en
// views/beneficios.js.
const endorphinKinesio = () => ({
  id: 'endorphin-kinesio',
  etiqueta: 'Beneficio para inscriptos',
  marca: { nombre: 'Endorphin', logoClaro: '/brand/endorphin-logo.webp', alto: 'h-28 rounded-full', href: '' },
  titulo: 'Atención kinésica para nadadores',
  detalle:
    'Endorphin va a estar presente en la carrera con atención kinésica especializada para nadadores, con descuentos exclusivos para inscriptos a OWA. Se puede señar el turno antes o acercarse directamente durante el evento.',
  lista: [
    'Masajes pre y post competencia',
    'Kinesiotape',
    'Ventosas',
    'Descarga y recuperación muscular',
    'Asesoramiento y atención al nadador',
  ],
  href: 'https://api.whatsapp.com/send/?phone=5491141658893&text=Hola+Gabriel+%EF%BF%BD+Llegu%C3%A9+desde+tu+perfil+y+me+gustar%C3%ADa+sacar+un+turno.+%C2%BFPodr%C3%ADas+brindarme+informaci%C3%B3n+y+disponibilidad%3F&type=phone_number&app_absent=0',
});

export const BENEFICIOS = {
  lujan: [nexalba20(), endorphinKinesio()],
  colon: [nexalba20(), endorphinKinesio()],
  'san-pedro': [nexalba20(), endorphinKinesio()],
  // Se van sumando el resto de las carreras a medida que OWA cierre cada
  // acuerdo — algunas van a compartir el de Nexalba, otras van a traer el
  // suyo propio.
};

export const beneficiosDe = (slug) => BENEFICIOS[slug] || [];

/** Slugs con beneficios reales cargados. Lo usan el prerender y el sitemap
    para no generar ni ofrecer a Google páginas de beneficios vacías. */
export const CON_BENEFICIOS = Object.keys(BENEFICIOS).filter((slug) => BENEFICIOS[slug].length);
