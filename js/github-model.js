// ===========================
// PURE: GitHub response mapping + fallback selection (no DOM)
//
// This module is intentionally free of DOM access and network/fetch so it can
// be unit- and property-tested directly in Node. It maps raw GitHub public API
// JSON into the view models consumed by the rendering layer and guarantees the
// five featured repositories always render (backfilling from static defs).
//
// Data models (see design.md -> Data Models -> GitHub View Model):
//   GitHubViewModel = { publicRepoCount: number, primaryLanguage: string|null, live: boolean }
//   RepoCard        = { name, description, language: string|null, stars: number, url, featured: true }
//
// Requirements: 4.2, 4.3, 4.4
// ===========================

// Static definitions used to backfill featured repos when the live API does not
// return a matching repository (or fails entirely). Keyed by the configured
// featured repo name. These keep all five cards fully rendered at all times.
export const STATIC_FEATURED_REPOS = {
    "alb-observability-automation": {
        name: "alb-observability-automation",
        description:
            "Automated observability for AWS Application Load Balancers: metrics, alarms, and dashboards provisioned as code.",
        language: "HCL",
        stars: 0,
        url: "https://github.com/ritooraj01/alb-observability-automation",
        featured: true
    },
    "rabbitmq-production-monitoring": {
        name: "rabbitmq-production-monitoring",
        description:
            "Production-grade RabbitMQ monitoring stack with Prometheus exporters, Grafana dashboards, and alerting.",
        language: "Python",
        stars: 0,
        url: "https://github.com/ritooraj01/rabbitmq-production-monitoring",
        featured: true
    },
    "multi-vpc-cloudwatch-centralized-monitoring": {
        name: "multi-vpc-cloudwatch-centralized-monitoring",
        description:
            "Centralized CloudWatch monitoring across multiple VPCs with cross-account log and metric aggregation.",
        language: "HCL",
        stars: 0,
        url: "https://github.com/ritooraj01/multi-vpc-cloudwatch-centralized-monitoring",
        featured: true
    },
    "AWS-Cloud-Cost": {
        name: "AWS-Cloud-Cost",
        description:
            "Tooling to analyze and report AWS cloud spend, surfacing cost-optimization opportunities.",
        language: "Python",
        stars: 0,
        url: "https://github.com/ritooraj01/AWS-Cloud-Cost",
        featured: true
    },
    "assistant-ai": {
        name: "assistant-ai",
        description:
            "An AI assistant experiment integrating LLM tooling into developer and ops workflows.",
        language: "JavaScript",
        stars: 0,
        url: "https://github.com/ritooraj01/assistant-ai",
        featured: true
    }
};

/**
 * Compute the most frequently occurring non-null repository language.
 * Returns null when no repository declares a language. Ties resolve to the
 * language that first reaches the maximum count (deterministic input order).
 *
 * @param {Array<object>} rawRepos
 * @returns {string|null}
 */
function mostFrequentLanguage(rawRepos) {
    const repos = Array.isArray(rawRepos) ? rawRepos : [];
    const counts = new Map();
    let best = null;
    let bestCount = 0;

    for (const repo of repos) {
        const language = repo && repo.language;
        if (language == null || language === "") continue;
        const next = (counts.get(language) || 0) + 1;
        counts.set(language, next);
        if (next > bestCount) {
            bestCount = next;
            best = language;
        }
    }

    return best;
}

/**
 * Map a raw GitHub user payload (and its repository list) to user stats.
 * publicRepoCount comes from the user payload's `public_repos`; primaryLanguage
 * is the most frequent non-null `language` across the repos (null when none).
 *
 * @param {object} rawUser  GET /users/{u} payload
 * @param {Array<object>} [rawRepos]  GET /users/{u}/repos payload
 * @returns {{ publicRepoCount: number, primaryLanguage: string|null }}
 */
export function mapUserStats(rawUser, rawRepos = []) {
    const user = rawUser || {};
    const rawCount = user.public_repos;
    const publicRepoCount = Number.isFinite(rawCount) ? rawCount : 0;
    return {
        publicRepoCount,
        primaryLanguage: mostFrequentLanguage(rawRepos)
    };
}

/**
 * Convert a raw GitHub repo object into a RepoCard, falling back to the static
 * definition for any missing field.
 *
 * @param {object} rawRepo
 * @param {object} [staticDef]
 * @returns {RepoCard}
 */
function toRepoCard(rawRepo, staticDef) {
    const fallback = staticDef || {};
    const repo = rawRepo || {};
    return {
        name: repo.name != null ? repo.name : fallback.name,
        description:
            repo.description != null && repo.description !== ""
                ? repo.description
                : fallback.description != null
                ? fallback.description
                : "",
        language:
            repo.language != null && repo.language !== ""
                ? repo.language
                : fallback.language != null
                ? fallback.language
                : null,
        stars: Number.isFinite(repo.stargazers_count)
            ? repo.stargazers_count
            : Number.isFinite(fallback.stars)
            ? fallback.stars
            : 0,
        url:
            repo.html_url != null && repo.html_url !== ""
                ? repo.html_url
                : fallback.url,
        featured: true
    };
}

/**
 * Produce exactly the configured featured repositories, in the configured
 * order, using live metadata where a matching repository exists and the static
 * definition otherwise. Guarantees all featured cards always render.
 *
 * @param {Array<object>} rawRepos  GET /users/{u}/repos payload
 * @param {string[]} featuredNames  ordered list of featured repo names
 * @returns {RepoCard[]}
 */
export function selectFeaturedRepos(rawRepos, featuredNames) {
    const repos = Array.isArray(rawRepos) ? rawRepos : [];
    const names = Array.isArray(featuredNames) ? featuredNames : [];

    // Index live repos by lowercased name for case-insensitive matching.
    const byName = new Map();
    for (const repo of repos) {
        if (repo && typeof repo.name === "string") {
            byName.set(repo.name.toLowerCase(), repo);
        }
    }

    return names.map((name) => {
        const staticDef = STATIC_FEATURED_REPOS[name];
        const live = byName.get(String(name).toLowerCase());
        if (live) {
            return toRepoCard(live, staticDef);
        }
        // No live match: backfill from static definition (or a minimal card).
        return toRepoCard(
            null,
            staticDef || {
                name,
                description: "",
                language: null,
                stars: 0,
                url: `https://github.com/ritooraj01/${name}`
            }
        );
    });
}

/**
 * Resolve service results into a GitHubViewModel. Total function: never throws.
 * Returns a live view model when `result.ok` is true, otherwise the predefined
 * fallback view model with `live` forced to false.
 *
 * @param {{ ok: boolean, user?: object, repos?: object[] }} result
 * @param {{ publicRepoCount: number, primaryLanguage: string|null, live?: boolean }} fallback
 * @returns {GitHubViewModel}
 */
export function resolveStats(result, fallback) {
    const safeFallback = fallback || {};
    try {
        if (result && result.ok) {
            const { publicRepoCount, primaryLanguage } = mapUserStats(
                result.user,
                result.repos
            );
            return { publicRepoCount, primaryLanguage, live: true };
        }
    } catch (_err) {
        // Fall through to the fallback view model on any unexpected error.
    }
    return {
        publicRepoCount: Number.isFinite(safeFallback.publicRepoCount)
            ? safeFallback.publicRepoCount
            : 0,
        primaryLanguage:
            safeFallback.primaryLanguage !== undefined
                ? safeFallback.primaryLanguage
                : null,
        live: false
    };
}
