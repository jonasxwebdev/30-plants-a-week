import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'http://localhost',
  output: 'static',
  build: {
    format: 'file',
  },
  vite: {
    resolve: {
      alias: {
        '@shared': '/../../packages/shared/src',
      },
    },
  },
});
