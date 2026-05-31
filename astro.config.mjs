// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static, frontend-only build. No SSR adapter, no server functions.
// Deploys to Vercel as plain static files out of `dist/`.
export default defineConfig({
  // Canonical host. Vercel serves the site on www (apex 308-redirects here),
  // so the canonical/OG/sitemap URLs must use www to match the 200 response.
  site: 'https://www.georgewall.uk',
  trailingSlash: 'never',
  integrations: [
    sitemap({
      // Stamp every entry with a build-time lastmod so crawlers see freshness.
      serialize(item) {
        item.lastmod = new Date().toISOString();
        return item;
      },
    }),
  ],
  build: {
    // Inline small stylesheets to cut render-blocking requests.
    inlineStylesheets: 'auto',
  },
  devToolbar: { enabled: false },
});
