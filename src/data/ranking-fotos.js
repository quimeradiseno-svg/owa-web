// Fotos reales de podio para el módulo de ranking del home. A mano y no
// generado: DESTACADOS/CLUBES salen de las planillas de OWA (ver
// scripts/rankings.mjs) y no tienen ningún campo de foto, así que esta tabla
// vive aparte y no se pisa cada vez que se vuelve a importar el ranking.
//
// Cubre justo los primeros 3 de cada columna que muestra el home —Grand Prix
// y Circuito, hombres y mujeres, más el campeonato por equipos—, que es todo
// lo que OWA mandó (carpeta Fotos/Ranking). El resto del ranking (en
// /resultados) sigue con el ícono placeholder.
//
// Es contenido puente de la 2025/26: cuando arranque la temporada 26/27 el
// 31 de octubre estos nombres ya no van a estar entre los primeros y esta
// tabla se vacía y se vuelve a armar con las fotos que mande OWA.
export const FOTOS_NADADOR = {
  'ARIAS Mauricio Ruben': 'rk-arias',
  'PERMIKIN Konstantin': 'rk-permikin',
  'ARJONA Lautaro': 'rk-arjona',
  'TORIANO Frida': 'rk-frida',
  'SALVANO Tamara': 'rk-tamara-salvano',
  'DIAZ Mariana': 'rk-mariana-diaz',
  'IANNICELLI Leonardo': 'rk-ianicelli',
  'LAMON Iñaki': 'rk-lamon',
  'ELOSEGUI Inés': 'rk-elosegui',
  'BONGIANINO Lucia': 'rk-bongianino',
  'FERNANDEZ Claudia': 'rk-claudia-fernandez',
};

export const FOTOS_CLUB = {
  'Club Amigos de Villa Luro': 'rk-villaluro',
  'Black Team': 'rk-blackteam',
  'Bragado Club': 'rk-bragado',
};
