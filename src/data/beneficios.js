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

/** El 20% OFF de Nexalba es el mismo beneficio para todas las carreras que lo
    tienen, pero cada una tiene su propio código de cupón — de ahí la función
    en vez de un objeto suelto: da un objeto nuevo por carrera (para no
    compartir referencia entre ellas) con el código que corresponda.

    Un beneficio con `codigo` en blanco se muestra igual, pero avisando que el
    código todavía no está — nunca con un placeholder tipo "XXXXXXX", que en
    la página en vivo se lee como un error. */
const nexalba20 = (codigo = '') => ({
  id: 'nexalba-20-off',
  etiqueta: 'Beneficio para inscriptos',
  marca: MARCAS.nexalba,
  // El número manda: es lo primero que se lee de la tarjeta.
  destacado: '20%',
  unidad: 'OFF',
  titulo: 'En toda la web de Nexalba',
  detalle: 'Para cualquier persona inscripta a la carrera.',
  codigo,
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

/** 2x1 en entrenamientos de mar de Cariló Swimmers. Mismo código en todas las
    carreras; cambia el nombre de la fecha en el título y, sólo en Pinamar, la
    mención a la propia largada ("en Pinamar"), que en las otras no aplica.
    Tarjeta "pack": además del código trae los pasos, el contacto y las apps
    (ver tarjetaPack en views/beneficios.js). */
const carilo2x1 = (fecha, enLaLargada = false) => ({
  id: 'carilo-2x1',
  etiqueta: 'Beneficio para inscriptos',
  marca: MARCAS.carilo,
  destacado: '2x1',
  unidad: 'en Cariló Swimmers',
  resumen: '2x1 en entrenamientos de mar con Cariló Swimmers',
  titulo: `Entrená en el mar antes de tu carrera en OWA ${fecha}`,
  detalle: `Pagás 1 sesión y entrenás 2. Pasar la rompiente, orientarte sin andarivel y nadar con olas y corriente: en Cariló Swimmers te preparan para llegar a la largada${enLaLargada ? ' en Pinamar' : ''} sabiendo lo que es el mar abierto.`,
  nota: 'Todas las sesiones cuentan con guardavidas y tablas de rescate.',
  codigo: 'OWASWIMMERS',
  pasos: [
    'Descargá la app Cariló Swimmers.',
    'Elegí el Pack de 1 sesión.',
    'Enviá el código OWASWIMMERS por WhatsApp a Cariló Swimmers y te asignan un segundo entrenamiento.',
  ],
  // El código no se ingresa en la app: se manda por WhatsApp (mismo número que
  // el teléfono de contacto) y ellos suman la segunda sesión.
  whatsapp: {
    etiqueta: 'Enviar código por WhatsApp',
    href: `https://wa.me/5491144220879?text=${encodeURIComponent('Hola! Vengo de OWA. Mi código es OWASWIMMERS, quiero mi segundo entrenamiento 2x1.')}`,
  },
  apps: [
    { etiqueta: 'App iOS', href: 'https://apps.apple.com/ar/app/caril%C3%B3-swimmers/id6738741458' },
    {
      etiqueta: 'App Android',
      href: 'https://play.google.com/store/apps/details?id=com.midasconsultores.cariloswimmers&pcampaignid=web_share',
    },
  ],
  contacto: {
    direccion: 'Arce y Playa, Cariló',
    telefono: '+54 9 11 4422-0879',
    telefonoHref: 'tel:+5491144220879',
    instagram: '@carilo.swimmers',
  },
  href: MARCAS.carilo.href,
});

export const BENEFICIOS = {
  lujan: [nexalba20('OWALUJAN20'), endorphinKinesio(), carilo2x1('Luján')],
  colon: [nexalba20(), endorphinKinesio()],
  'san-pedro': [nexalba20('OWASANPEDRO20'), endorphinKinesio(), carilo2x1('San Pedro')],
  pinamar: [carilo2x1('Pinamar', true)],
  // Se van sumando el resto de las carreras a medida que OWA cierre cada
  // acuerdo — algunas van a compartir el de Nexalba, otras van a traer el
  // suyo propio.
};

export const beneficiosDe = (slug) => BENEFICIOS[slug] || [];

/** Slugs con beneficios reales cargados. Lo usan el prerender y el sitemap
    para no generar ni ofrecer a Google páginas de beneficios vacías. */
export const CON_BENEFICIOS = Object.keys(BENEFICIOS).filter((slug) => BENEFICIOS[slug].length);
