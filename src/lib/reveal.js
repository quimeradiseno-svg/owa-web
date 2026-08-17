// Scroll reveal: se dispara una sola vez por elemento. Volver a animar cada
// vez que algo cruza el viewport es una interfaz peleándose con quien lee.
//
// El HTML se sirve visible; recién cuando este módulo corre se marca
// [data-reveal-ready] en <main>, así sin JS (o si algo falla) no queda nada
// escondido.

let observer;

function ensureObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute('data-visible', '');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
  );
  return observer;
}

export function observarReveals(root = document) {
  if (!('IntersectionObserver' in window)) return;
  const obs = ensureObserver();
  root.querySelectorAll('.reveal:not([data-visible]), .reveal-clip:not([data-visible])').forEach((el) => obs.observe(el));
}

export function activarReveal(main) {
  if (!('IntersectionObserver' in window)) return;
  main.setAttribute('data-reveal-ready', '');
}

/** Lo que ya está en pantalla al cargar no debe esperar a un scroll. */
export function revelarVisibles(root = document) {
  const alto = window.innerHeight;
  root.querySelectorAll('.reveal, .reveal-clip').forEach((el) => {
    if (el.getBoundingClientRect().top < alto * 0.85) el.setAttribute('data-visible', '');
  });
}
