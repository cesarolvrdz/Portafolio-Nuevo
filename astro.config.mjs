import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://cesarolvrdz.github.io',
  base: '/Portafolio-Nuevo',
  integrations: [tailwind()],
  output: 'static',
  build: {
    assets: 'assets'
  }
});