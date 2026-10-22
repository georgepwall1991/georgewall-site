# georgewall.uk

George Wall's portfolio. A static Astro site for my work, writing and shipped
apps. Repository data comes from the public GitHub API, with a committed
snapshot for builds and visitors without JavaScript.

- **Framework:** [Astro](https://astro.build) (static output)
- **Type:** Fraunces · Archivo · JetBrains Mono (self-hosted via Fontsource)
- **Data:** GitHub REST API (no token) + `src/data/fallback.json` snapshot
- **Hosting:** Vercel (free tier)

---

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server with HMR |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Unit tests for the data-shaping logic (`node --test`) |
| `npm run snapshot` | Refresh `src/data/fallback.json` from live GitHub |
| `npm run nuget` | Refresh `src/data/nuget-snapshot.json` from live NuGet |
| `npm run og` | Re-rasterise `public/og.svg` → `public/og.png` |

## How the data works

1. **Build time** (`getSnapshot()` in `src/data/github.ts`): tries the GitHub API;
   if it's rate-limited or offline, falls back to `src/data/fallback.json`. The
   build never fails on a GitHub hiccup.
2. **Runtime** (`src/scripts/archive.ts`): the archive re-fetches live on the
   visitor's own IP (so the 60 req/hr unauthenticated limit is per-visitor), and
   caches the result in `localStorage` for 6 hours.

3. **NuGet downloads** (`getNuGetPackages()` in `src/data/nuget.ts`): every
   download figure on the site (hero, tools section, project entries, meta
   description and structured data) comes from the public NuGet search API at
   build time, falling back per package to `src/data/nuget-snapshot.json` if a request fails.
4. **Daily refresh** (`.github/workflows/refresh-live-data.yml`): a scheduled
   GitHub Action runs `npm run nuget`, which rewrites
   `src/data/nuget-snapshot.json` (the committed fallback) from the live API.
   If any count changed it commits to `main`, and that push triggers Vercel's
   normal production deploy. No secrets needed. Run it by hand from the
   Actions tab to refresh immediately.

Curated copy and ordering for the featured projects lives in
`src/data/featured.ts`. Identity/contact details live in `src/data/site.ts`.

---

## Deploy to Vercel (free)

### Option A: Git + Vercel dashboard (recommended)

1. Push this folder to a GitHub repo.
2. On [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
3. Vercel auto-detects Astro. Framework **Astro**, build `npm run build`, output
   `dist`. Click **Deploy**. You get a `*.vercel.app` URL.

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel          # preview deploy
vercel --prod   # production deploy
```

---

## Custom domain: georgewall.uk (registered on Cloudflare)

In **Vercel → Project → Settings → Domains**, add both:

- `georgewall.uk`
- `www.georgewall.uk`

Vercel will show the DNS records it expects. Then in **Cloudflare → your domain →
DNS → Records**, add them:

| Type | Name | Value | Proxy status |
| --- | --- | --- | --- |
| `A` | `@` | `76.76.21.21` | **DNS only (grey cloud)** |
| `CNAME` | `www` | `cname.vercel-dns.com` | **DNS only (grey cloud)** |

> ⚠️ **Set the proxy to "DNS only" (grey cloud), not "Proxied" (orange).**
> Letting Cloudflare proxy in front of Vercel causes redirect loops and SSL
> conflicts because both try to terminate TLS. Grey-cloud lets Vercel issue and
> serve its own certificate.

Use the exact values Vercel displays. The apex `A` record IP occasionally
changes. After the records propagate (usually minutes), Vercel auto-provisions a
free SSL certificate and the site is live on `https://georgewall.uk`.

### Cloudflare SSL/TLS mode

If you keep any records proxied elsewhere on the zone, set **SSL/TLS → Overview →
Full (strict)**. For the grey-clouded Vercel records this setting is bypassed, so
either way is fine.
