# AGENTS.md

## Cursor Cloud specific instructions

This is a single static Astro site (frontend only, no backend/database). Standard
commands live in `package.json` scripts and `README.md`; use those as the source
of truth. Notes below cover only non-obvious gotchas.

### Node version (important)

- The repo targets Node 22 (`.nvmrc`). `npm test` runs `node --test` against
  files that import TypeScript (`.ts`) directly, which relies on Node's
  unflagged TypeScript type stripping (Node >= 22.18).
- A fresh non-login shell may resolve the bare `node` on `PATH` to an older
  `/exec-daemon/node` (v22.14.0) that **cannot** strip `.ts` types, so `npm test`
  fails with `ERR_UNKNOWN_FILE_EXTENSION ".ts"`. Login shells and `nvm` resolve
  to v22.22.2, which works.
- If `npm test` fails with that error, run `nvm use 22` first (gives v22.22.2),
  then re-run. `npm run build`, `npm run dev`, and `npm run preview` do not
  depend on this (Astro/esbuild handle TS), but using `nvm use 22` for everything
  is the safe default.

### Running the dev server

- `npm run dev` serves on `http://localhost:4321` (see `README.md`). It is a
  long-running process; start it in a background/tmux session, not a blocking
  foreground command.

### Data / networking note

- The "archive" section (`/work`) server-renders from the committed snapshot
  `src/data/fallback.json` and then, in the browser, tries a live pull from the
  public GitHub API (no token). If GitHub is unreachable or rate-limited the UI
  silently stays on the snapshot, so the page still works offline.
