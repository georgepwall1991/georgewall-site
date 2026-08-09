// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Honest content dates: deployments no longer make every page look freshly edited.
const LAST_MODIFIED = new Map([
  ['https://www.georgewall.uk', '2026-08-09'],
  ['https://www.georgewall.uk/work', '2026-08-09'],
  ['https://www.georgewall.uk/writing', '2026-07-22'],
  ['https://www.georgewall.uk/writing/catching-n-plus-1-at-compile-time', '2026-06-01'],
  ['https://www.georgewall.uk/writing/when-http-retries-make-failures-worse', '2026-07-22'],
  ['https://www.georgewall.uk/writing/catching-broken-appsettings-before-deployment', '2026-07-22'],
]);

// Static, frontend-only build. No SSR adapter, no server functions.
// Deploys to Vercel as plain static files out of `dist/`.
export default defineConfig({
  // Canonical host. Vercel serves the site on www (apex 308-redirects here),
  // so the canonical/OG/sitemap URLs must use www to match the 200 response.
  site: 'https://www.georgewall.uk',
  trailingSlash: 'never',
  // Preserve the established inline-spacing behaviour during the Astro 7 upgrade.
  compressHTML: true,
  integrations: [
    sitemap({
      serialize(item) {
        item.lastmod = LAST_MODIFIED.get(item.url);
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
