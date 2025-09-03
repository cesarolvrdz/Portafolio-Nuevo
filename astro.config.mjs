import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://onlyCR7.github.io',
  base: '/Portafolio-Nuevo',
  integrations: [tailwind()],
  output: 'static'
});
});