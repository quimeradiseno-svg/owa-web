// Todos los reglamentos en un solo lugar. Los "Ver reglamentos" de las fichas
// de carrera apuntan acá en vez de descargar un PDF suelto.
//
// Los anexos sin link todavía no los pasó OWA: se listan igual, marcados como
// pendientes, para que se vea que la carrera tiene anexo y falta el archivo.

// Estos dos anexos cubren a la vez Grand Prix y Circuito (un solo documento por
// carrera), así que las dos filas de cada torneo apuntan al mismo PDF, servido
// desde el propio sitio (public/reglamentos/).
const ANEXO_LUJAN = '/reglamentos/anexo-lujan-2026.pdf';
const ANEXO_COLON = '/reglamentos/anexo-colon-2027.pdf';

export const REGLAMENTO_GENERAL = {
  t: 'Reglamento General OWA 2026/27',
  d: 'Aplica a todas las competencias del calendario.',
  url: 'https://drive.google.com/open?id=165FsNV4G-IzPdYoRLqxsqhAgrV9OXCk-&usp=drive_fs',
};

export const REGLAMENTOS = [
  {
    torneo: 'Grand Prix',
    logo: '/brand/owa-grandprix-blanco.svg',
    deportivo: {
      t: 'Reglamento deportivo Grand Prix',
      url: 'https://drive.google.com/open?id=1EIbzGs8ObKESwSOEv-dfO1Y83-TT_3We&usp=drive_fs',
    },
    anexos: [
      { sigla: 'LJN', carrera: 'Open Water Luján', url: ANEXO_LUJAN },
      { sigla: 'VOB', carrera: 'Vuelta de Obligado · San Pedro', url: 'https://drive.google.com/open?id=1_Mkbd-19n42IO78xYprqrHbIscVpHO1L&usp=drive_fs' },
      { sigla: 'RML', carrera: 'Open Water Ramallo', url: null },
      { sigla: 'LBC', carrera: 'Open Water Colón', url: ANEXO_COLON },
    ],
  },
  {
    torneo: 'Circuito OWA',
    logo: '/brand/owa-circuito-blanco.svg',
    deportivo: {
      t: 'Reglamento deportivo Circuito OWA',
      url: 'https://drive.google.com/open?id=1V3ZYQ69vP2PzOh0dbLN5sB2HkAaZAsZ7&usp=drive_fs',
    },
    anexos: [
      { sigla: 'LJN', carrera: 'Open Water Luján', url: ANEXO_LUJAN },
      { sigla: 'SPD', carrera: 'Open Water San Pedro', url: 'https://drive.google.com/open?id=1Iduq6DljgqJoKS_kl-YOzAEkUtg1tWDR&usp=drive_fs' },
      { sigla: 'RML', carrera: 'Open Water Ramallo', url: null },
      { sigla: 'CLN', carrera: 'Open Water Colón', url: ANEXO_COLON },
    ],
  },
];
