// Identidad del sitio para SEO: dominio, marca y redes.
//
// UN SOLO LUGAR PARA EL CAMBIO DE DOMINIO
// ---------------------------------------
// Hoy el sitio vive en la URL de Vercel mientras el cliente lo revisa; el
// dominio definitivo es https://www.owa.com.ar y se activa cuando se muevan
// los DNS. Todo lo que depende del dominio —canonical, Open Graph, sitemap y
// datos estructurados— se arma a partir de `ORIGEN`, así que la mudanza es
// cambiar estas dos constantes y volver a publicar.
//
// `INDEXABLE` en false mantiene la URL de Vercel fuera de Google: si se
// indexara, al mudarnos tendríamos el mismo contenido en dos dominios y habría
// que sostener redirecciones. No afecta a nadie que entre por el link, ni a
// las previsualizaciones de WhatsApp: sólo le pide a los buscadores que no la
// listen. Al pasar a owa.com.ar hay que ponerlo en true.
export const ORIGEN = 'https://owa-site.vercel.app';
export const INDEXABLE = false;

/** Dominio definitivo, para tener el destino a la vista. */
export const ORIGEN_FINAL = 'https://www.owa.com.ar';

export const SITIO = {
  nombre: 'Open Water Argentina',
  sigla: 'OWA',
  lema: 'El agua nos une',
  // Fuente: el pie del sitio.
  email: 'info@owa.com.ar',
  telefono: '+54 9 11 2554 3112',
  pais: 'AR',
  idioma: 'es-AR',
  redes: [
    'https://www.instagram.com/owargentina/',
    'https://www.facebook.com/OpenWaterArgentina/',
    'https://www.youtube.com/@openwaterargentina7389',
  ],
};

/** URL absoluta a partir de una ruta interna. */
export const url = (ruta = '/') => `${ORIGEN}${ruta}`;
