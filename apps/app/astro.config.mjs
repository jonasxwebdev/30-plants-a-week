import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  site: 'https://app.domain.com',
  output: 'server',
  adapter: vercel({
    edgeMiddleware: false,
  }),
  integrations: [tailwind(), vue()],
  build: {
    format: 'file',
  },
});
