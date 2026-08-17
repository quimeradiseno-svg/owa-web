// Datos ilustrativos de ranking y resultados. Reemplazar por la carga real de
// OWA — la estructura de las vistas no cambia con el esquema de puntaje.

export const GP = [
  { nombre: 'Martina Deluca', cat: '25-29', sexo: 'F', club: 'AA Pilar', carreras: 3, podios: 3, puntos: 285 },
  { nombre: 'Tomás Bahía', cat: '30-34', sexo: 'M', club: 'CN San Pedro', carreras: 3, podios: 2, puntos: 271 },
  { nombre: 'Lucas Ferreyra', cat: '25-29', sexo: 'M', club: 'Regatas Ramallo', carreras: 3, podios: 2, puntos: 254 },
  { nombre: 'Sofía Barrantes', cat: '30-34', sexo: 'F', club: 'CN San Pedro', carreras: 3, podios: 1, puntos: 240 },
  { nombre: 'Ignacio Peralta', cat: '35-39', sexo: 'M', club: 'AA Pilar', carreras: 2, podios: 1, puntos: 198 },
  { nombre: 'Camila Ferrer', cat: '20-24', sexo: 'F', club: 'Delta Tigre', carreras: 3, podios: 0, puntos: 186 },
  { nombre: 'Federico Ansaldi', cat: '40-44', sexo: 'M', club: 'Regatas Ramallo', carreras: 2, podios: 1, puntos: 172 },
  { nombre: 'Valentina Ruiz', cat: '35-39', sexo: 'F', club: 'AA Pilar', carreras: 2, podios: 0, puntos: 155 },
];

export const CIRC = [
  { nombre: 'Julián Ortega', cat: '30-34', sexo: 'M', club: 'Delta Tigre', carreras: 4, podios: 3, puntos: 312 },
  { nombre: 'Agustina Sosa', cat: '25-29', sexo: 'F', club: 'CN San Pedro', carreras: 4, podios: 3, puntos: 298 },
  { nombre: 'Pedro Iriarte', cat: '45-49', sexo: 'M', club: 'Nadadores Colón', carreras: 4, podios: 2, puntos: 264 },
  { nombre: 'Rocío Medina', cat: '40-44', sexo: 'F', club: 'Delta Tigre', carreras: 3, podios: 1, puntos: 231 },
  { nombre: 'Matías Grondona', cat: '20-24', sexo: 'M', club: 'AA Pilar', carreras: 3, podios: 1, puntos: 209 },
  { nombre: 'Delfina Casals', cat: '30-34', sexo: 'F', club: 'CN San Pedro', carreras: 3, podios: 0, puntos: 190 },
  { nombre: 'Bruno Lastra', cat: '35-39', sexo: 'M', club: 'Regatas Ramallo', carreras: 2, podios: 0, puntos: 164 },
  { nombre: 'Paula Vignola', cat: '45-49', sexo: 'F', club: 'Nadadores Colón', carreras: 2, podios: 1, puntos: 148 },
];

export const CLUBES_GP = [
  { nombre: 'Club Náutico San Pedro', nadadores: 14, puntos: 1840 },
  { nombre: 'Aguas Abiertas Pilar', nadadores: 11, puntos: 1615 },
  { nombre: 'Regatas Ramallo', nadadores: 9, puntos: 1370 },
];

export const CLUBES_CIRC = [
  { nombre: 'Escuela Delta Tigre', nadadores: 18, puntos: 2105 },
  { nombre: 'Club Náutico San Pedro', nadadores: 16, puntos: 1930 },
  { nombre: 'Nadadores del Uruguay · Colón', nadadores: 12, puntos: 1488 },
];

export const RESULTADOS = [
  { nombre: 'Tomás Bahía', sexo: 'M', cat: '30-34', club: 'CN San Pedro', tiempo: '00:58:12', puntos: 100 },
  { nombre: 'Lucas Ferreyra', sexo: 'M', cat: '25-29', club: 'Regatas Ramallo', tiempo: '00:59:04', puntos: 90 },
  { nombre: 'Ignacio Peralta', sexo: 'M', cat: '35-39', club: 'AA Pilar', tiempo: '01:00:41', puntos: 82 },
  { nombre: 'Martina Deluca', sexo: 'F', cat: '25-29', club: 'AA Pilar', tiempo: '01:01:16', puntos: 100 },
  { nombre: 'Julián Ortega', sexo: 'M', cat: '30-34', club: 'Delta Tigre', tiempo: '01:02:33', puntos: 76 },
  { nombre: 'Sofía Barrantes', sexo: 'F', cat: '30-34', club: 'CN San Pedro', tiempo: '01:03:09', puntos: 90 },
  { nombre: 'Camila Ferrer', sexo: 'F', cat: '20-24', club: 'Delta Tigre', tiempo: '01:04:47', puntos: 82 },
  { nombre: 'Federico Ansaldi', sexo: 'M', cat: '40-44', club: 'Regatas Ramallo', tiempo: '01:05:58', puntos: 72 },
];

export const CATS = ['TODAS', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49'];

export const REGLAS = [
  { t: 'Puntaje por posición', d: 'Propuesta: 100 / 90 / 82 / 76 / 72 y descendente. Se puntúa dentro de cada categoría.' },
  { t: 'Fechas que suman', d: 'Propuesta: suman las 3 mejores de las 4 fechas. A confirmar por OWA.' },
  { t: 'Desempate', d: 'Propuesta: cantidad de victorias, después mejor posición en la última fecha.' },
  { t: 'Campeonato por equipos', d: 'Suma de los puntos de los nadadores de cada club, por torneo.' },
];
