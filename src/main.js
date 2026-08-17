import { definir, arrancar } from './router.js';
import { navbar, montarNavbar } from './components/navbar.js';
import { footer } from './components/footer.js';
import { volverArriba, montarVolverArriba } from './components/volver-arriba.js';
import { activarReveal, observarReveals, revelarVisibles } from './lib/reveal.js';

const shell = document.getElementById('shell');
const main = document.getElementById('contenido');
const pie = document.getElementById('pie');
const volver = document.getElementById('volver');

shell.innerHTML = navbar();
pie.innerHTML = footer();
volver.innerHTML = volverArriba();
const colocarIndicador = montarNavbar(shell);
montarVolverArriba(volver);

definir('/', () => import('./views/home.js'));
definir('/calendario', () => import('./views/calendario.js'));
definir('/grand-prix', () => import('./views/madre.js'));
definir('/circuito', () => import('./views/madre.js'));
definir('/especiales', () => import('./views/madre.js'));
definir('/challenge', () => import('./views/madre.js'));
definir('/carrera/:slug', () => import('./views/evento.js'));
definir('/resultados', () => import('./views/resultados.js'));
definir('/travel', () => import('./views/travel.js'));
definir('/pad', () => import('./views/pad.js'));
definir('/404', () => import('./views/no-encontrada.js'));

activarReveal(main);

arrancar(main, (_patron, ctx) => {
  colocarIndicador(ctx.path);
  revelarVisibles(main);
  observarReveals(main);
});
