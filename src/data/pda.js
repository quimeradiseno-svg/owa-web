// PDA — Programa Desarrollo Aguas Abiertas.
// Antes se llamaba PAD; el nombre cambió a PDA junto con este contenido.

// La intro va en dos piezas de distinto peso: la primera es la declaración
// del programa, la segunda aclara cómo está estructurado. El <strong> marca
// las partes que sostienen el mensaje.
const PDA = '<span class="u-sigla">PDA</span>';
const OWA = '<span class="u-sigla">OWA</span>';

export const PDA_INTRO = {
  lead: `${PDA} es el programa de ${OWA} destinado a <strong>acompañar a quienes necesitan apoyo</strong> para seguir desarrollándose en este deporte.`,
  ejes: 'El programa trabaja sobre <strong>dos ejes</strong>: <strong>becas para nadadores</strong> e <strong>incentivos y herramientas</strong> para entrenadores, clubes y escuelas.',
};

export const PDA_BECAS = {
  kicker: 'Becas para nadadores',
  titulo: 'Acompañamos el desarrollo',
  parrafos: [
    `Durante la temporada 2025/2026, ${PDA} acompañó a <strong>Mauricio Arias</strong>, de Natalu, con una beca para participar en los eventos ${OWA}.`,
    `En la temporada 2026/2027, el programa acompañará a <strong>Romeo Giménez</strong> en su desarrollo dentro de las aguas abiertas.`,
  ],
};

// Los dos llamados abiertos. `cta.href` es un mailto provisorio: los
// formularios quedaron pendientes de definir con OWA.
export const PDA_CONVOCATORIAS = [
  {
    kicker: 'Temporada 2027/2028',
    titulo: 'Postulá a un nadador',
    parrafos: [
      `<strong>Ya están abiertas las postulaciones</strong> para proponer nadadores que puedan recibir una beca ${PDA} durante la temporada 2027/2028.`,
      `Entrenadores, clubes, escuelas y referentes pueden presentar candidatos. ${OWA} evaluará cada postulación para seleccionar a los próximos nadadores que serán acompañados por el programa.`,
    ],
    cta: {
      label: 'Postular a un nadador',
      href: 'mailto:info@owa.com.ar?subject=PDA%20%E2%80%94%20Postulaci%C3%B3n%20de%20nadador%20(temporada%202027%2F2028)',
    },
    destacado: true,
  },
  {
    kicker: 'Para entrenadores, clubes y escuelas',
    titulo: 'Desarrollemos las aguas abiertas juntos',
    parrafos: [
      `${PDA} también acompaña a quienes <strong>entrenan, forman y acercan nuevos nadadores</strong> al deporte.`,
      `${OWA} ofrecerá un programa de incentivos y herramientas para entrenadores, clubes y escuelas que quieran desarrollar o ampliar su participación en aguas abiertas.`,
    ],
    cta: {
      label: 'Quiero conocer el programa',
      href: 'mailto:info@owa.com.ar?subject=PDA%20%E2%80%94%20Entrenadores%2C%20clubes%20y%20escuelas',
    },
    destacado: false,
  },
];
