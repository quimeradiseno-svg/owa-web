// Los eventos de medición, todos declarados acá.
//
// Se resuelven por delegación desde <body>, en vez de agregar listeners en
// cada vista: el router reemplaza el contenido en cada navegación y habría que
// volver a engancharlos siempre. Así se registra una vez y sigue andando.
//
// Nada de esto manda datos personales: sólo qué se tocó y hacia dónde va.
import { evento, vista } from './analitica.js';
import { vistaPixel, contenidoPixel, inscripcionPixel } from './meta-pixel.js';

// Qué mira alguien cuando entra a una ruta. Los nombres son los del brief.
const VISTA_POR_RUTA = [
  [/^\/calendario/, 'view_calendar'],
  [/^\/carrera\//, 'view_race'],
  [/^\/resultados/, 'view_results'],
];

/** Vista de página + el evento propio de esa sección. */
export function medirRuta(path) {
  vistaPixel();
  vista(path);
  const hallada = VISTA_POR_RUTA.find(([re]) => re.test(path));
  if (!hallada) return;
  const params = path.startsWith('/carrera/') ? { race_slug: path.split('/')[2] } : {};
  evento(hallada[1], params);
  if (path.startsWith('/carrera/')) contenidoPixel(path.split('/')[2]);
}

/** Un solo listener para todos los clics que interesan. */
export function medirClics() {
  document.addEventListener(
    'click',
    (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href') || '';

      // Salida a la plataforma de inscripción: es la conversión que importa.
      if (href.includes('cronometrajeinstantaneo.com')) {
        const esLista = /participantes|resultados/.test(href);
        evento(esLista ? 'view_starting_list' : 'outbound_registration', {
          link_url: href,
          // De qué carrera salió, para poder medir rendimiento por evento.
          race_slug: location.pathname.startsWith('/carrera/') ? location.pathname.split('/')[2] : '',
        });
        // La inscripción es la conversión: Meta la necesita para optimizar.
        if (!esLista) inscripcionPixel(location.pathname.startsWith('/carrera/') ? location.pathname.split('/')[2] : '');
        return;
      }

      if (href.startsWith('https://wa.me') || href.includes('whatsapp')) {
        evento('contact_whatsapp', { link_url: href });
        return;
      }

      if (href.startsWith('mailto:')) {
        evento('contact_email', { link_url: href });
      }
    },
    // Fase de captura: los enlaces que abren en otra pestaña podrían llevarse
    // el foco antes de que burbujee.
    true
  );

  // Elegir distancia dentro de una ficha de carrera. El atributo es
  // `data-recorrido-tab` (verificado contra el DOM real): con el nombre a
  // medias el evento no se disparaba nunca.
  document.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-recorrido-tab]');
    if (!tab) return;
    evento('select_distance', {
      distance_id: tab.dataset.recorridoTab,
      race_slug: location.pathname.startsWith('/carrera/') ? location.pathname.split('/')[2] : '',
    });
  });
}

/** Búsqueda de nadador en Resultados, una vez que dejó de tipear. */
export function medirBusqueda(root) {
  const input = root.querySelector('input[type="search"], input[data-buscador]');
  if (!input) return;
  let t;
  input.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      const q = input.value.trim();
      // Sólo que hubo búsqueda y de qué largo: el nombre buscado es dato de
      // una persona y no tiene por qué salir del navegador.
      if (q.length >= 3) evento('search_swimmer', { search_length: q.length });
    }, 1200);
  });
}
