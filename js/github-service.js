// ===========================
// GitHub_Data_Service: fetch + cache + timeout (Requirement 4)
//
//   4.1 request public profile stats for ritooraj01 on projects load
//   4.2 render public repo count + primary language on success
//   4.3 on failure/timeout (>5s), render FALLBACK_STATS, no error surfaced
//   4.4 always render the five featured repos (live metadata or static defs)
//   4.5 unauthenticated public requests only — no token in any asset
//
// loadGitHubData is dependency-injected (fetch / storage) so it can be tested
// in Node with mocks (see tests/github-service.test.mjs). It NEVER rejects;
// every failure resolves to the fallback view model.
// ===========================

import { CONFIG } from './config.js';
import { mapUserStats, selectFeaturedRepos, resolveStats } from './github-model.js';

export const GH_CACHE_KEY = 'gh:ritooraj01';
const USER_URL = `${CONFIG.githubApiBase}/users/${CONFIG.githubUsername}`;
const REPOS_URL = `${CONFIG.githubApiBase}/users/${CONFIG.githubUsername}/repos?per_page=100&sort=updated`;

/**
 * Fetch the user + repos with a single 5s AbortController timeout.
 * Returns { ok, user?, repos? }. Any error/timeout/rate-limit -> { ok:false }.
 *
 * @param {Function} fetchImpl
 * @param {number} timeoutMs
 * @returns {Promise<{ ok: boolean, user?: object, repos?: object[] }>}
 */
async function fetchGitHub(fetchImpl, timeoutMs) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const [userRes, reposRes] = await Promise.all([
            fetchImpl(USER_URL, { signal: controller.signal }),
            fetchImpl(REPOS_URL, { signal: controller.signal })
        ]);

        // Treat non-2xx (incl. 403 rate-limit) as failure -> fallback. (4.3)
        if (!userRes.ok || !reposRes.ok) {
            return { ok: false };
        }

        const user = await userRes.json();
        const repos = await reposRes.json();
        return { ok: true, user, repos };
    } catch (_err) {
        // Network error, abort/timeout, or JSON parse error -> fallback.
        return { ok: false };
    } finally {
        clearTimeout(timer);
    }
}

/**
 * Read the session cache (TTL ~15 min) if present and fresh. (4.1, 4.5 rate limit)
 * @param {Object} storage
 * @returns {object|null}
 */
function readCache(storage) {
    try {
        const raw = storage.getItem(GH_CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed.ts !== 'number') return null;
        if (Date.now() - parsed.ts > CONFIG.githubCacheTtlMs) return null;
        return parsed.value;
    } catch (_err) {
        return null;
    }
}

function writeCache(storage, value) {
    try {
        storage.setItem(GH_CACHE_KEY, JSON.stringify({ ts: Date.now(), value }));
    } catch (_err) {
        /* sessionStorage may be unavailable; ignore */
    }
}

/**
 * Load GitHub view-model + featured repos.
 *
 * Dependency-injected so tests pass fake `fetch` / `storage`. Honours the
 * session cache, then fetches live data, then falls back safely on any failure.
 *
 * @param {object} [deps]
 * @param {Function} [deps.fetchImpl=globalThis.fetch]
 * @param {object} [deps.storage=globalThis.sessionStorage]
 * @param {number} [deps.timeoutMs=CONFIG.githubTimeoutMs]
 * @returns {Promise<{ stats: object, repos: object[] }>}
 */
export async function loadGitHubData(deps = {}) {
    const fetchImpl = deps.fetchImpl || globalThis.fetch;
    const storage = deps.storage || globalThis.sessionStorage;
    const timeoutMs = deps.timeoutMs || CONFIG.githubTimeoutMs;

    // 1) Cache hit (fresh) -> use without a network call.
    const cached = readCache(storage);
    if (cached) {
        return {
            stats: cached.stats,
            repos: selectFeaturedRepos(cached.repos || [], CONFIG.featuredRepos)
        };
    }

    // 2) Live fetch, resolving to fallback on any failure/timeout. (4.3)
    const result = await fetchGitHub(fetchImpl, timeoutMs);
    const stats = resolveStats(result, CONFIG.fallbackStats); // never throws

    let repos = [];
    if (result.ok) {
        repos = selectFeaturedRepos(result.repos || [], CONFIG.featuredRepos);
        writeCache(storage, { stats, repos });
    } else {
        // Even on failure, show the static featured definitions (4.4).
        repos = selectFeaturedRepos([], CONFIG.featuredRepos);
    }

    return { stats, repos };
}

/**
 * Render stats + featured repos into the DOM. Called by initGitHub after load.
 * @param {{ stats: object, repos: object[] }} data
 */
export function renderGitHub(data) {
    const doc = globalThis.document;
    const { stats, repos } = data || {};

    const repoCountEl = doc.getElementById('ghRepoCount');
    const langEl = doc.getElementById('ghPrimaryLanguage');
    const sourceEl = doc.getElementById('ghSource');
    const featuredEl = doc.getElementById('featuredRepos');

    if (repoCountEl && stats && Number.isFinite(stats.publicRepoCount)) {
        repoCountEl.textContent = String(stats.publicRepoCount);
    }
    if (langEl && stats) {
        langEl.textContent = stats.primaryLanguage || '—';
    }
    if (sourceEl) {
        sourceEl.textContent = stats && stats.live
            ? 'Live data from GitHub API.'
            : 'Showing cached profile statistics.';
        sourceEl.dataset.live = stats && stats.live ? 'true' : 'false';
    }

    if (featuredEl && Array.isArray(repos)) {
        featuredEl.innerHTML = '';
        for (const repo of repos) {
            const card = doc.createElement('a');
            card.className = 'featured-repo';
            card.href = repo.url || '#';
            card.target = '_blank';
            card.rel = 'noopener noreferrer';
            card.setAttribute('aria-label', `${repo.name} repository on GitHub`);

            const meta = [
                repo.language ? `<span class="fr-lang">${repo.language}</span>` : '',
                repo.stars ? `<span class="fr-stars">★ ${repo.stars}</span>` : ''
            ].join(' ');

            card.innerHTML =
                `<div class="fr-name">${repo.name}</div>` +
                `<div class="fr-desc">${repo.description || ''}</div>` +
                `<div class="fr-meta">${meta}</div>`;
            featuredEl.appendChild(card);
        }
    }
}

export function initGitHub() {
    // Projects Section load trigger (4.1).
    loadGitHubData()
        .then(renderGitHub)
        .catch(() => {
            // Absolute last-resort guard: never let the screen error out (4.3).
            renderGitHub({ stats: CONFIG.fallbackStats, repos: selectFeaturedRepos([], CONFIG.featuredRepos) });
        });
}

export default initGitHub;
