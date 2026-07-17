// Dev-only property-based tests for the pure GitHub model module.
// Feature: advanced-devops-portfolio
//
// Run (fast-check supplied via npx, node_modules not committed):
//   npx --yes --package fast-check node --test tests/github-model.test.mjs
//
// Properties 5, 6, 7 map to Requirements 4.2, 4.3, 4.4 respectively.

import test from "node:test";
import assert from "node:assert/strict";
import fc from "fast-check";

import {
    mapUserStats,
    selectFeaturedRepos,
    resolveStats,
    STATIC_FEATURED_REPOS
} from "../js/github-model.js";

const NUM_RUNS = 200;

// Configured featured repositories, in the configured order.
const FEATURED_NAMES = [
    "alb-observability-automation",
    "rabbitmq-production-monitoring",
    "multi-vpc-cloudwatch-centralized-monitoring",
    "AWS-Cloud-Cost",
    "assistant-ai"
];

// A small pool of real language strings so generated repo lists produce
// collisions (needed to exercise the "most frequent" logic meaningfully).
const LANGUAGES = ["JavaScript", "Python", "HCL", "Go", "TypeScript", "Rust"];

// Generator for a single language value: a real language or null.
const languageArb = fc.oneof(
    fc.constantFrom(...LANGUAGES),
    fc.constant(null)
);

// Generator for a "well-formed" repo (only the fields the model reads).
const repoArb = fc.record({
    name: fc.string(),
    language: languageArb,
    stargazers_count: fc.nat(),
    html_url: fc.webUrl(),
    description: fc.string()
});

// -----------------------------------------------------------------------------
// Property 5: GitHub user-stats mapping is faithful
// -----------------------------------------------------------------------------

// Feature: advanced-devops-portfolio, Property 5: For any well-formed GitHub user payload and repository list, mapUserStats returns publicRepoCount equal to the payload's public_repos and primaryLanguage equal to the most frequently occurring non-null repository language (or null when no repository declares a language).
test("Property 5: GitHub user-stats mapping is faithful", () => {
    fc.assert(
        fc.property(
            fc.integer({ min: 0, max: 100000 }),
            fc.array(repoArb, { maxLength: 40 }),
            (publicRepos, repos) => {
                const stats = mapUserStats({ public_repos: publicRepos }, repos);

                // publicRepoCount faithfully reflects the payload's public_repos.
                assert.equal(stats.publicRepoCount, publicRepos);

                // Independently tally non-null (and non-empty) languages.
                const counts = new Map();
                for (const r of repos) {
                    const lang = r.language;
                    if (lang == null || lang === "") continue;
                    counts.set(lang, (counts.get(lang) || 0) + 1);
                }

                if (counts.size === 0) {
                    // No repository declares a language -> null.
                    assert.equal(stats.primaryLanguage, null);
                } else {
                    // primaryLanguage must be an observed language and must
                    // achieve the maximum count (ties resolve deterministically,
                    // so we only require that no other language beats it).
                    const maxCount = Math.max(...counts.values());
                    assert.ok(
                        counts.has(stats.primaryLanguage),
                        `primaryLanguage ${stats.primaryLanguage} not among observed languages`
                    );
                    assert.equal(counts.get(stats.primaryLanguage), maxCount);
                }
            }
        ),
        { numRuns: NUM_RUNS }
    );
});

// -----------------------------------------------------------------------------
// Property 6: Stats resolution is total and falls back safely
// -----------------------------------------------------------------------------

// A deliberately broad generator: well-formed successes, explicit failures,
// and arbitrary/garbage values (including null/undefined and wrong types).
const resultArb = fc.oneof(
    // Well-formed success.
    fc.record({
        ok: fc.constant(true),
        user: fc.record({ public_repos: fc.nat() }),
        repos: fc.array(repoArb, { maxLength: 20 })
    }),
    // Explicit failure.
    fc.record({ ok: fc.constant(false) }),
    // Success flag with malformed / missing payloads.
    fc.record({ ok: fc.constant(true) }),
    fc.record({ ok: fc.constant(true), user: fc.anything(), repos: fc.anything() }),
    // Arbitrary garbage, including non-objects.
    fc.anything(),
    fc.constant(null),
    fc.constant(undefined)
);

const fallbackArb = fc.record({
    publicRepoCount: fc.integer({ min: 0, max: 100000 }),
    primaryLanguage: fc.oneof(fc.constantFrom(...LANGUAGES), fc.constant(null))
});

// Feature: advanced-devops-portfolio, Property 6: For any service result, resolveStats never throws and returns the live view model when the result is flagged successful, and returns the predefined fallback view model (with live === false) otherwise.
test("Property 6: Stats resolution is total and falls back safely", () => {
    fc.assert(
        fc.property(resultArb, fallbackArb, (result, fallback) => {
            let vm;
            // Totality: never throws for any input.
            assert.doesNotThrow(() => {
                vm = resolveStats(result, fallback);
            });

            assert.equal(typeof vm.live, "boolean");

            const succeeded = !!(result && result.ok);
            if (succeeded) {
                // Live view model on success.
                assert.equal(vm.live, true);
                const expected = mapUserStats(result.user, result.repos);
                assert.equal(vm.publicRepoCount, expected.publicRepoCount);
                assert.deepEqual(vm.primaryLanguage, expected.primaryLanguage);
            } else {
                // Predefined fallback view model otherwise.
                assert.equal(vm.live, false);
                assert.equal(vm.publicRepoCount, fallback.publicRepoCount);
                assert.deepEqual(vm.primaryLanguage, fallback.primaryLanguage);
            }
        }),
        { numRuns: NUM_RUNS }
    );
});

// -----------------------------------------------------------------------------
// Property 7: Featured repositories are always fully represented
// -----------------------------------------------------------------------------

// Names guaranteed NOT to collide with the featured set (noise repos).
const noiseNameArb = fc
    .string({ minLength: 1, maxLength: 12 })
    .filter(
        (n) =>
            !FEATURED_NAMES.some(
                (f) => f.toLowerCase() === n.toLowerCase()
            )
    );

// A live repo carrying full, non-empty metadata (so a matched card reflects
// live values exactly, distinguishing it from the static definition).
function liveRepoArb(name) {
    return fc.record({
        name: fc.constant(name),
        description: fc.string({ minLength: 1, maxLength: 40 }),
        language: fc.constantFrom(...LANGUAGES),
        stargazers_count: fc.integer({ min: 1, max: 5000 }),
        html_url: fc.webUrl()
    });
}

// Feature: advanced-devops-portfolio, Property 7: For any repository list returned by the API, selectFeaturedRepos produces exactly the five configured featured repositories, in the configured order, using live metadata where a matching repository exists and the static definition otherwise.
test("Property 7: Featured repositories are always fully represented", () => {
    fc.assert(
        fc.property(
            // Which featured repos appear "live" in the API response.
            fc.subarray(FEATURED_NAMES),
            // Noise repos that must never leak into the featured output.
            fc.array(
                noiseNameArb.chain((n) => liveRepoArb(n)),
                { maxLength: 10 }
            ),
            // A seed to shuffle the combined list ordering.
            fc.array(fc.nat(), { maxLength: 20 }),
            (presentNames, noiseRepos, shuffleSeed) => {
                // Build live repos for the present featured names.
                const presentSet = new Set(presentNames);
                const featuredLive = {};
                const featuredRepos = presentNames.map((name) => {
                    // Deterministically synthesize a live repo per present name.
                    const idx = FEATURED_NAMES.indexOf(name);
                    const seed = shuffleSeed[idx % Math.max(1, shuffleSeed.length)] || 0;
                    const repo = {
                        name,
                        description: `live-desc-${seed}`,
                        language: LANGUAGES[seed % LANGUAGES.length],
                        stargazers_count: (seed % 5000) + 1,
                        html_url: `https://github.com/ritooraj01/${name}?live=${seed}`
                    };
                    featuredLive[name] = repo;
                    return repo;
                });

                // Combine featured-live + noise, then rotate by seed for order variety.
                const combined = [...featuredRepos, ...noiseRepos];
                const rotate = shuffleSeed.length
                    ? shuffleSeed[0] % (combined.length || 1)
                    : 0;
                const rawRepos = combined
                    .slice(rotate)
                    .concat(combined.slice(0, rotate));

                const cards = selectFeaturedRepos(rawRepos, FEATURED_NAMES);

                // Exactly five cards, in the configured order.
                assert.equal(cards.length, 5);

                for (let i = 0; i < FEATURED_NAMES.length; i++) {
                    const name = FEATURED_NAMES[i];
                    const card = cards[i];
                    assert.equal(card.featured, true);

                    if (presentSet.has(name)) {
                        // Live metadata is used for a matching repository.
                        const live = featuredLive[name];
                        assert.equal(card.name, live.name);
                        assert.equal(card.description, live.description);
                        assert.equal(card.language, live.language);
                        assert.equal(card.stars, live.stargazers_count);
                        assert.equal(card.url, live.html_url);
                    } else {
                        // Static definition backfills a missing repository.
                        assert.deepEqual(card, STATIC_FEATURED_REPOS[name]);
                    }
                }
            }
        ),
        { numRuns: NUM_RUNS }
    );
});
