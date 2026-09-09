// Sponsors por carrera, para el zócalo que se muestra al final de la ficha.
//
// Va aparte de fichas.js a propósito: no depende de si la carrera tiene ficha
// técnica cargada (Ramallo todavía no la tiene y ya lleva sponsors) y es un
// dato de otra naturaleza — comercial, no de contenido de la prueba.
//
// `logo` tiene una versión clara y una oscura porque el zócalo puede caer
// sobre fondo blanco o, más adelante, sobre uno oscuro; hoy sólo se usa la
// clara. Se va a ir completando carrera por carrera a medida que OWA cierre
// cada acuerdo — por eso es un mapa por slug y no una lista fija.
//
// `alto` es la clase de alto del propio <img>, no del carril que lo contiene
// (ese es fijo e igual para todos, ver bloqueSponsors en evento.js). Hace
// falta declararlo por logo porque un isotipo casi cuadrado como arena
// (1.4:1) y un wordmark chato como Nexalba (6.9:1) igualados por la misma
// altura de imagen no pesan lo mismo a la vista: Nexalba sale carísimo de
// ancho y arena queda diminuto. Ajustado a ojo para que ocupen un área
// parecida dentro del carril (arena más alto y angosto, Nexalba más bajo y
// ancho) en vez de una altura idéntica.
// Las marcas se exportan porque los beneficios (src/data/beneficios.js) las
// referencian por acá: el logo y la URL de cada una viven en un solo lugar, y
// si mañana Nexalba cambia de dominio no hay que acordarse de tocar dos
// archivos.
export const MARCAS = {
  arena: {
    nombre: 'arena',
    logoClaro: '/brand/arena-logo.webp',
    logoOscuro: '/brand/arena-logo.webp',
    alto: 'h-11',
    href: 'https://arenasport.ar/',
  },
  nexalba: {
    nombre: 'Nexalba',
    logoClaro: '/brand/nexalba-logo-negro.png',
    logoOscuro: '/brand/nexalba-logo-blanco.png',
    alto: 'h-5',
    href: 'https://nexalba.com/',
  },
};

export const SPONSORS = {
  lujan: [MARCAS.arena, MARCAS.nexalba],
  'san-pedro': [MARCAS.arena, MARCAS.nexalba],
  ramallo: [MARCAS.arena, MARCAS.nexalba],
  colon: [MARCAS.arena, MARCAS.nexalba],
};

export const sponsorsDe = (slug) => SPONSORS[slug] || [];
