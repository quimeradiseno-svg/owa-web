import { definir, arrancar } from './router.js';
import { navbar, montarNavbar } from './components/navbar.js';
import { footer } from './components/footer.js';
import { volverArriba, montarVolverArriba } from './components/volver-arriba.js';
import { activarReveal, observarReveals, revelarVisibles } from './lib/reveal.js';
import { montarFotos } from './lib/img.js';

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
definir('/pda', () => import('./views/pda.js'));
// El programa se llamaba PAD: la ruta vieja sigue resolviendo para no romper
// links ya compartidos.
definir('/pad', () => import('./views/pda.js'));
definir('/404', () => import('./views/no-encontrada.js'));

activarReveal(main);

// El fundido de las fotos se activa por JS (la CSP no permite onload= inline),
// asi que hay que re-barrer en cada cambio de ruta.
montarFotos();

arrancar(main, (_patron, ctx) => {
  colocarIndicador(ctx.path);
  montarFotos(main);
  revelarVisibles(main);
  observarReveals(main);
});
