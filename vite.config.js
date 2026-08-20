import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// Sin puerto fijo: el harness asigna uno con PORT y Vite lo respeta. Fijarlo
// hacía que un server viejo colgado bloqueara el arranque del preview.
const port = process.env.PORT ? Number(process.env.PORT) : undefined;

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    port,
    // Por defecto Vite ataba "localhost" sólo a IPv6 (::1) y el navegador, que
    // en Windows resuelve localhost a 127.0.0.1, no encontraba nada. Atado a
    // la loopback IPv4 entra igual por localhost y no queda expuesto en la red.
    host: '127.0.0.1',
  },
  build: {
    target: 'es2022',
    assetsInlineLimit: 2048,
  },
});
