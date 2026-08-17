import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  server: { port: 5180 },
  build: {
    target: 'es2022',
    assetsInlineLimit: 2048,
  },
});
