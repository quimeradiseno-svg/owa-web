# OWA · Sitio temporada 2026/27

Implementación del prototipo `OWA Sitio.dc.html` (proyecto Claude Design
`997cedb5`) como sitio real: Vite + Tailwind CSS 4 + daisyUI 5, router propio en
JS vanilla, sin framework.

## Arrancar

```bash
npm install
npm run fonts    # Fonts/*.ttf -> public/fonts/*.woff2  (una vez)
npm run images   # Fotos/**    -> public/img/*.avif|webp (una vez, ~2 min)
npm run dev
```

`npm run build` deja el sitio estático en `dist/`. Necesita fallback a
`index.html` en el servidor: el router usa History API, no hash.

## Estructura

```
src/
  main.js            arranque: monta shell, registra rutas
  router.js          History API + View Transitions entre rutas
  styles/
    app.css          tokens del DS como @theme + tema daisyUI "owa" + base
    motion.css       reveal, stagger, press, hero, reduced-motion
  data/              calendario, rankings y copy de las páginas madre
  lib/               plantillas con escapado, <picture> responsive, reveal
  components/        navbar, footer, chips/botones, tarjetas de evento
  views/             una por ruta
scripts/
  fonts.mjs          TTF -> WOFF2 (sólo los pesos que se usan)
  images.mjs         masters -> AVIF/WebP 480/960/1250 + LQIP inline
  shots.mjs          capturas de QA desktop + mobile en .qa/
  contraste.mjs      auditoría WCAG AA sobre las rutas
```

## Rutas

`/` · `/calendario` · `/grand-prix` · `/circuito` · `/especiales` ·
`/challenge` · `/carrera/:slug` · `/resultados` (`?tab=gp|circ`) · `/travel` ·
`/pad` · 404

## Sistema de diseño

Los tokens salen de `_ds/owa-design-system/tokens/*.css` del proyecto Design y
viven en `@theme` como utilidades Tailwind (`bg-owa-navy`, `text-owa-cyan`,
`rounded-owa-lg`). Encima, el tema daisyUI `owa` mapea los semánticos
(`primary` = blue-2, `accent` = cyan, `base-*` = blanco/sand/line).

Dos desvíos deliberados respecto del prototipo, ambos por contraste:

- **Volantas y acentos chicos sobre fondo claro** usan `--owa-blue-2` (#12129b,
  13:1) en vez del cian (#00ace9, 2.6:1 sobre blanco). El cian sigue siendo el
  acento sobre navy, el fondo de los botones y los trazos.
- **Posiciones de podio** son chapitas rellenas (oro/plata/bronce) con la cifra
  en navy, en vez de la cifra coloreada: el oro sobre blanco daba 1.5:1.

`node scripts/contraste.mjs` verifica AA en todas las rutas. El texto sobre
fotos y degradados queda fuera del cálculo — ahí manda el velo del hero.

## Movimiento

Un solo gesto autoral: el contenido se destapa desde abajo al entrar en
viewport, una vez por elemento. Lo demás es feedback funcional.

| Qué | Cómo | Duración |
| --- | --- | --- |
| Reveal de sección | opacity + translateY 14px, `IntersectionObserver` once | 520 ms |
| Reveal con foto | `clip-path: inset()` de abajo hacia arriba | 700 ms |
| Stagger en grillas | `--i` × 50 ms | — |
| Press | `scale(0.97)` en `:active` | 160 ms |
| Hover de tarjeta | `translateY(-6px)` + sombra, gateado a puntero fino | 260 ms |
| Indicador de nav | un solo elemento que se desliza (`translateX` + `scaleX`) | 280 ms |
| Cambio de ruta | View Transition: salida 130 ms, entrada 240 ms | — |
| Deriva del hero | `scale` lentísimo, decorativo | 28 s |

Curvas: `--ease-out: cubic-bezier(.23,1,.32,1)` sobrescribe la de Tailwind, así
que todo `ease-out` del proyecto es la fuerte. `prefers-reduced-motion` conserva
las opacidades y elimina todo desplazamiento; los hovers están detrás de
`(hover: hover) and (pointer: fine)`.

## Datos

`src/data/eventos.js` tiene el calendario real 26/27 (8 eventos + 3 Challenge),
portado literal del prototipo. `rankings.js` es **ilustrativo** y está para
reemplazar por la carga real de OWA; la estructura de las vistas no cambia con
el esquema de puntaje que se defina.

## Pendiente de OWA

- Distancias, horarios y valores de inscripción de cada carrera.
- Sistema de puntaje oficial y fechas que suman.
- Tracks de recorrido para los mapas.
- Siglas de Pilar y Ramallo.
- Canal de contacto de Travel y del PAD, y el WhatsApp del footer.
- URL real de la plataforma de inscripción (hoy `inscripciones.owa.com.ar`).
- PDF del reglamento.

El control **Estado de carrera (demo)**, abajo a la izquierda en la ficha de
cada carrera, deja ver las tres caras de la misma página (próxima / en vivo /
finalizada). Sacarlo antes de publicar: está en `src/views/evento.js`.
