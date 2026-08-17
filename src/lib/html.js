// Plantillas de string con escapado por defecto.
// `html` escapa todo lo interpolado; para insertar markup ya construido usá
// `raw()` o pasá un array de fragmentos (que se unen sin separador).

const RAW = Symbol('raw');

export const raw = (value) => {
  const s = String(value ?? '');
  // toString() para poder asignar el resultado directo a innerHTML.
  return { [RAW]: s, toString: () => s };
};
export const isRaw = (v) => v && typeof v === 'object' && RAW in v;

export function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function render(v) {
  if (v == null || v === false) return '';
  if (isRaw(v)) return v[RAW];
  if (Array.isArray(v)) return v.map(render).join('');
  return esc(v);
}

export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i++) out += render(values[i]) + strings[i + 1];
  return raw(out);
}

/** Une fragmentos ya renderizados. */
export const join = (parts, sep = '') => raw(parts.map(render).join(sep));

/** Convierte a string plano para inyectar en innerHTML. */
export const toHTML = (v) => render(v);

/** Aplica `--i` a los hijos para que el stagger sepa su orden. */
export function stagger(root, selector = ':scope > *') {
  root.querySelectorAll(selector).forEach((el, i) => el.style.setProperty('--i', i));
}
