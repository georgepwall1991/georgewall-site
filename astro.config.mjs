// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static, frontend-only build. No SSR adapter, no server functions.
// Deploys to Vercel as plain static files out of `dist/`.
export default defineConfig({
  site: 'https://georgewall.uk',
  trailingSlash: 'never',
  integrations: [sitemap()],
  build: {
    // Inline small stylesheets to cut render-blocking requests.
    inlineStylesheets: 'auto',
  },
  devToolbar: { enabled: false },
});
