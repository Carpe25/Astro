import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
// Static by default; pages/API routes with `prerender = false` run as Vercel functions
export default defineConfig({
  adapter: vercel(),
});
