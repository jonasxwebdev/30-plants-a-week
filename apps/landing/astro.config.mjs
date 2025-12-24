import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://domain.com',
  output: 'static',
  build: {
    format: 'file',
  },
});
