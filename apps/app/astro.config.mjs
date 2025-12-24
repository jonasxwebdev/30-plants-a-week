import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  site: 'https://app.domain.com',
  output: 'static',
  adapter: vercel({
    edgeMiddleware: false,
  }),
  build: {
    format: 'file',
  },
});
