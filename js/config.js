// ===========================
// Static site configuration
// (username, featured repos, fallbacks, form endpoint)
// No secrets are stored here — all values are public.
// ===========================
export const CONFIG = {
    githubUsername: "ritooraj01",
    githubApiBase: "https://api.github.com",
    githubTimeoutMs: 5000,
    githubCacheTtlMs: 15 * 60 * 1000,
    featuredRepos: [
        "alb-observability-automation",
        "rabbitmq-production-monitoring",
        "multi-vpc-cloudwatch-centralized-monitoring",
        "AWS-Cloud-Cost",
        "assistant-ai"
    ],
    fallbackStats: {           // GitHubViewModel used on failure (Requirement 4.3)
        publicRepoCount: 12,
        primaryLanguage: "Python",
        live: false
    },
    // Formspree endpoint — public, non-secret (no API key required).
    formEndpoint: "https://formspree.io/f/xaqreoay",
    formspreeEnabled: true,
    formTimeoutMs: 10000,
    contactEmail: "singh.ritooraj@gmail.com",
    resumePath: "RES/resume.pdf"
};

export default CONFIG;
