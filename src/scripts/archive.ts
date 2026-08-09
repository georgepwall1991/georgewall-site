/**
 * Live archive controller.
 *
 * The section is server-rendered from a committed snapshot (works with JS off).
 * On load we hydrate from the embedded data, wire up filter/sort/forks, then try
 * a fresh pull from the public GitHub API on the visitor's own IP, so the
 * 60 req/hr unauthenticated limit is per-visitor and never a bottleneck.
 * Results are cached in localStorage for 6h to be a polite API citizen.
 */
import type { Repo } from '../data/types';
import { repoDescription } from '../data/repoCopy';
import { categoryOf } from '../lib/categorize';
import { languageColor, formatCount, relativeTime } from '../lib/format';

const GITHUB_USER = 'georgepwall1991';
const CACHE_KEY = 'atlas-archive-v1';
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6h
const META = new Set(['georgepwall1991', 'georgepwall1991.github.io', 'homebrew-cpmigrate']);

type SortMode = 'stars' | 'recent';

const section = document.querySelector<HTMLElement>('#archive');
const listEl = section?.querySelector<HTMLElement>('[data-list]');
const dataEl = section?.querySelector<HTMLScriptElement>('[data-archive-data]');
const statusEl = section?.querySelector<HTMLElement>('[data-status]');
const emptyEl = section?.querySelector<HTMLElement>('[data-empty]');

if (section && listEl && dataEl) {
  let repos: Repo[] = safeParse(dataEl.textContent);
  let filter = 'All';
  let sort: SortMode = 'stars';
  let showForks = false;

  const esc = (s: string) =>
    s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

  function visible(): Repo[] {
    const now = Date.now();
    return repos
      .filter((r) => !META.has(r.name))
      .filter((r) => (showForks ? true : !r.fork && !r.archived))
      .filter((r) => filter === 'All' || categoryOf(r) === filter)
      .sort((a, b) => {
        if (sort === 'recent') return ts(b.pushed_at) - ts(a.pushed_at);
        if (b.stars !== a.stars) return b.stars - a.stars;
        return ts(b.pushed_at) - ts(a.pushed_at);
      });
    function ts(iso: string) {
      return new Date(iso).getTime() || now;
    }
  }

  function row(r: Repo): string {
    const now = new Date();
    const dot = r.language
      ? `<span class="lang-dot" style="--dot:${languageColor(r.language)}"></span>`
      : '';
    const stars = r.stars > 0 ? `★ ${formatCount(r.stars)}` : '';
    const forkTag = r.fork ? ' <span class="arc-forktag">fork</span>' : '';
    return `<a class="arc-row" href="${r.html_url}" target="_blank" rel="noopener"
      data-cat="${categoryOf(r)}" data-fork="${r.fork}">
      <span class="arc-name">${esc(r.name)}${forkTag}</span>
      <span class="arc-desc">${esc(repoDescription(r))}</span>
      <span class="arc-lang">${dot}${esc(r.language ?? '')}</span>
      <span class="arc-stars">${stars}</span>
      <span class="arc-updated">${relativeTime(r.pushed_at, now)}</span>
      <span class="arc-go" aria-hidden="true">↗</span>
    </a>`;
  }

  function render() {
    const rows = visible();
    listEl!.innerHTML = rows.map(row).join('');
    if (emptyEl) emptyEl.hidden = rows.length > 0;
  }

  // ---- controls ----
  section.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      filter = btn.dataset.filter!;
      section.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((button) => {
        const active = button === btn;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      render();
    });
  });
  section.querySelectorAll<HTMLButtonElement>('[data-sort]').forEach((btn) => {
    btn.addEventListener('click', () => {
      sort = btn.dataset.sort as SortMode;
      section.querySelectorAll<HTMLButtonElement>('[data-sort]').forEach((button) => {
        const active = button === btn;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      render();
    });
  });
  section.querySelector<HTMLInputElement>('[data-forks]')?.addEventListener('change', (e) => {
    showForks = (e.target as HTMLInputElement).checked;
    render();
  });

  // ---- live refresh ----
  function setStatus(text: string, live = false) {
    if (!statusEl) return;
    statusEl.textContent = text;
    if (live) statusEl.setAttribute('data-live', '');
  }

  function readCache(): { at: number; repos: Repo[] } | null {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.repos)) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  async function fetchLive(): Promise<Repo[]> {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed&direction=desc`,
      { headers: { Accept: 'application/vnd.github+json' } },
    );
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    const json = await res.json();
    if (!Array.isArray(json)) throw new Error('bad payload');
    return json.map(
      (r: any): Repo => ({
        name: r.name,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
        forks: r.forks_count,
        topics: r.topics ?? [],
        fork: r.fork,
        archived: r.archived,
        homepage: r.homepage || null,
        html_url: r.html_url,
        pushed_at: r.pushed_at,
      }),
    );
  }

  async function refresh() {
    const cached = readCache();
    if (cached && Date.now() - cached.at < CACHE_TTL) {
      repos = cached.repos;
      render();
      setStatus(`Live · updated ${relativeTime(new Date(cached.at).toISOString())}`, true);
      return;
    }
    // On any failure we simply stay on the snapshot already on screen.
    const fresh = await fetchLive().catch(() => null);
    if (!fresh || fresh.length < 3) return;
    repos = fresh;
    writeCache(CACHE_KEY, { at: Date.now(), repos: fresh });
    render();
    setStatus('Live · updated just now', true);
  }

  // Render once from embedded data (so JS-driven filtering is live immediately),
  // then attempt the network refresh.
  render();
  refresh();
}

function safeParse(text: string | null): Repo[] {
  try {
    const parsed = JSON.parse(text ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCache(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Storage full or private mode. Caching is best-effort. */
  }
}
