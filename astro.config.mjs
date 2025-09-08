import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  // Configuración optimizada para Vercel
  site: 'https://portafolio-nuevo.vercel.app', // Se actualizará con tu URL real
  integrations: [tailwind()],
  output: 'static',
  build: {
    assets: '_astro'
  }
});