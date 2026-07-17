# Implementation Plan: Advanced DevOps Portfolio

## Overview

This plan evolves the existing single-page portfolio at `portfolio/ritooraj/` from a monolithic `script.js` + `style.css` into an organized, buildless static site (native ES modules + split CSS) with a Signature Interface visual language, functional Command_Terminal, live GitHub data, interactive SVG architecture diagrams, a working Formspree contact form, and systematic SEO/accessibility/performance/reduced-motion improvements.

The work is ordered so each step builds on the last: first the CSS token/module scaffolding and the design language, then the three **pure** logic modules with their property-based tests (fast-check, ≥100 iterations), then the DOM controllers that consume them, then wiring into `main.js`, then SEO/a11y/perf polish, and finally the manual `TESTING.md` checklist.

**Hard constraint:** every file path below is under `portfolio/ritooraj/`. The site stays buildless (`<script type="module">`, multiple `<link>` tags), deploys to GitHub Pages, and uses relative asset paths. Third-party libraries (Font Awesome, Google Fonts, fast-check) load over HTTPS/`npx` and are never bundled or committed as secrets.

## Tasks

- [x] 1. Scaffold buildless module + CSS structure
  - Create the `css/` directory with empty-but-linked files: `variables.css`, `base.css`, `components.css`, `sections.css`, `motion.css`, `responsive.css`
  - Create the `js/` directory with a `main.js` entry module and a `config.js` module; add the `tests/` directory placeholder
  - Split the existing `style.css` rules verbatim into the six `css/` files by concern (tokens/reset/components/sections/motion/responsive) without changing rules, and replace the single `style.css` `<link>` in `index.html` with ordered `<link>` tags (avoid `@import` render-blocking)
  - Decompose the existing `script.js` into empty module stubs under `js/` (`boot-screen.js`, `terminal.js`, `commands.js`, `validation.js`, `github-service.js`, `github-model.js`, `architecture.js`, `contact-form.js`, `theme-controller.js`, `motion-system.js`, `navigation.js`, `background-canvas.js`, `cursor.js`) and switch `index.html` to `<script type="module" src="js/main.js">`
  - Populate `js/config.js` with the `CONFIG` object (githubUsername, githubApiBase, timeouts, cacheTtl, featuredRepos, fallbackStats, formEndpoint, formTimeoutMs, contactEmail, resumePath)
  - _Requirements: 16.1, 16.2, 16.3_

- [ ] 2. Establish the Visual Design Language token system
  - [x] 2.1 Author design tokens in `css/variables.css`
    - Add canvas/surface layers, hairline borders, retained accents (cyan #00D9FF, purple #7B2FF7, pink #FF006E, green, amber), atmospheric glow variables, text ramp, radius vocabulary, spacing rhythm, and the `--font-display`/`--font-ui`/`--font-mono` families
    - Add the `[data-theme="light"]` inverted ramp (off-white canvas, near-black ink, black-based hairlines, reduced glow opacity) tuned for ≥4.5:1 contrast
    - Define the ordered accent-cycle token list (cyan → purple → green → pink → amber) for diagrams and skill categories
    - _Requirements: 1.2, 1.3, 8.5_

  - [ ] 2.2 Apply the aesthetic across components in `css/components.css` and `css/sections.css`
    - Replace colored `box-shadow` elevations with hairline borders plus the neutral `--lift` hover token; apply the radius/elevation mapping to buttons, cards, code/terminal wells, and pills
    - Add the per-section `::before` radial-glow layer (one accent per section) and the reusable code-window chrome (traffic-light shell) for terminal/code/output surfaces
    - Apply `--font-display` to hero/section openers, `--font-mono` to code/labels (section titles as shell commands), `--font-ui` elsewhere; add the green status-dot "Operational" motif to hero/GitHub panel
    - Add Google Fonts (`Space Grotesk`, `Inter`, `JetBrains Mono`) via HTTPS `preconnect` + `display=swap` link in `index.html` `<head>`
    - _Requirements: 1.1, 1.3, 1.4, 16.3_

- [ ] 3. Implement pure command logic (`js/commands.js`)
  - [x] 3.1 Build the command registry and parser
    - Define the `Command` shape and `COMMAND_REGISTRY` (navigate commands derived from real section ids: home, about, skills, projects, architecture, experience, certifications, contact; plus help, clear, whoami, and output commands)
    - Implement `normalizeInput`, `parseCommand` (returns ok / empty / unknown with a `help` hint), and `listCommands`
    - Correct stale content (canonical contact data from Requirement 15.3)
    - _Requirements: 2.1, 2.2, 2.3_

  - [x]* 3.2 Write property test for command parsing (`tests/commands.test.mjs`)
    - **Property 1: Command parsing resolves known commands and rejects unknown ones**
    - **Validates: Requirements 2.2, 2.3**
    - fast-check, ≥100 runs, tagged `// Feature: advanced-devops-portfolio, Property 1: ...`

  - [x]* 3.3 Write property test for help coverage (`tests/commands.test.mjs`)
    - **Property 2: Help output covers exactly the registry**
    - **Validates: Requirements 2.1**
    - fast-check, ≥100 runs, tagged `// Feature: advanced-devops-portfolio, Property 2: ...`

- [ ] 4. Implement pure contact validation (`js/validation.js`)
  - [x] 4.1 Implement `isValidEmail` and `validateContactForm`
    - Syntactic RFC-pragmatic email check; validate name non-empty (trimmed), email valid, message non-empty (trimmed); return `{ valid, errors }` with a key per failing field only
    - _Requirements: 6.2, 6.3_

  - [x]* 4.2 Write property test for contact validation (`tests/validation.test.mjs`)
    - **Property 4: Contact validation is correct and complete**
    - **Validates: Requirements 6.2, 6.3**
    - fast-check, ≥100 runs, tagged `// Feature: advanced-devops-portfolio, Property 4: ...`

- [ ] 5. Implement pure GitHub model (`js/github-model.js`)
  - [x] 5.1 Implement `mapUserStats`, `selectFeaturedRepos`, and `resolveStats`
    - `mapUserStats` maps `public_repos` and most-frequent non-null `language` (null when none); `selectFeaturedRepos` returns exactly the five configured repos in order, backfilling from static definitions; `resolveStats` is total (never throws) and returns live vs fallback view model
    - _Requirements: 4.2, 4.3, 4.4_

  - [ ]* 5.2 Write property test for user-stats mapping (`tests/github-model.test.mjs`)
    - **Property 5: GitHub user-stats mapping is faithful**
    - **Validates: Requirements 4.2**
    - fast-check, ≥100 runs, tagged `// Feature: advanced-devops-portfolio, Property 5: ...`

  - [ ]* 5.3 Write property test for stats resolution totality (`tests/github-model.test.mjs`)
    - **Property 6: Stats resolution is total and falls back safely**
    - **Validates: Requirements 4.3**
    - fast-check, ≥100 runs, tagged `// Feature: advanced-devops-portfolio, Property 6: ...`

  - [ ]* 5.4 Write property test for featured-repo representation (`tests/github-model.test.mjs`)
    - **Property 7: Featured repositories are always fully represented**
    - **Validates: Requirements 4.4**
    - fast-check, ≥100 runs, tagged `// Feature: advanced-devops-portfolio, Property 7: ...`

- [~] 6. Checkpoint - Pure logic complete
  - Run the property test suite (`node --test` with fast-check via `npx`) and ensure all of Properties 1, 2, 4, 5, 6, 7 pass at ≥100 iterations. Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement Theme_Controller (`js/theme-controller.js`)
  - [~] 7.1 Wire theme toggle, persistence, and default
    - Toggle flips dark/light, persist to `localStorage["theme"]`, apply persisted on load, default to dark when unset; add the tiny inline `<head>` script that sets `data-theme` before paint to avoid FOUC
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [ ]* 7.2 Write example tests for theme behavior (`tests/theme.test.mjs`)
    - Toggle flips and persists (8.1, 8.2); persisted theme applied on load (8.3); default dark when unset (8.4) using jsdom + localStorage mock
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 8. Implement Boot_Screen (`js/boot-screen.js`)
  - [~] 8.1 Implement boot sequence with timeout and reduced-motion path
    - `initBootScreen({ maxDurationMs = 8000, reducedMotion })`: show boot log and lock scroll; retain sequential line reveal + progress fill; idempotent guarded `hideBootScreen()` reveals content and re-enables scroll; 8s hard timeout; reduced-motion reveals within 1s with no animation
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ]* 8.2 Write example/edge tests for boot screen (`tests/boot-screen.test.mjs`)
    - Completion hides + reveals (3.2); 8s hard timeout hides via fake timers (3.3); reduced-motion reveals ≤1s (3.4)
    - _Requirements: 3.2, 3.3, 3.4_

- [ ] 9. Implement Navigation (`js/navigation.js`)
  - [~] 9.1 Implement section scrolling, mobile menu, and scroll-spy
    - Expose `scrollToSection(id)` used by nav links and the terminal; smooth-scroll on nav activation; retain mobile bottom-nav scroll-spy; hamburger/collapsible menu at ≤767px; global `overflow-x` guards
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 15.4_

- [ ] 10. Implement Command_Terminal DOM controller (`js/terminal.js`)
  - [~] 10.1 Add terminal DOM and wire the pure command layer
    - Add missing `#terminal-input` / `#terminal-output` elements to `index.html`; on submit call `parseCommand`; render help via `listCommands`, navigate via `navigation.scrollToSection`, error on unknown, empty output on `clear`; echo each submitted command with its output in submission order; keep input operable at ≤768px
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [ ]* 10.2 Write example test for terminal history ordering (`tests/terminal.test.mjs`)
    - **Property 3: Command history preserves submission order and pairing**
    - **Validates: Requirements 2.5**
    - fast-check over a sequence of submitted commands against the jsdom-rendered output, ≥100 runs, tagged `// Feature: advanced-devops-portfolio, Property 3: ...`

  - [ ]* 10.3 Write example tests for terminal DOM behavior (`tests/terminal.test.mjs`)
    - `clear` empties output (2.4); narrow-viewport input submits (2.6)
    - _Requirements: 2.4, 2.6_

- [ ] 11. Implement GitHub_Data_Service (`js/github-service.js`)
  - [~] 11.1 Implement fetch with cache, timeout, and fallback
    - `loadGitHubData()`: read sessionStorage cache (≈15 min TTL); else GET `/users/ritooraj01` and `/users/ritooraj01/repos?per_page=100` with a 5s `AbortController`; resolve (never reject) to fallback on any failure/timeout/rate-limit; delegate mapping to `github-model.js`; unauthenticated only, no token in assets
    - Render public repo count + primary language on success; render five featured repos always; on failure render `FALLBACK_STATS` with no error surfaced
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 11.2 Write integration tests for GitHub service (`tests/github-service.test.mjs`)
    - Correct URLs requested on projects load with mocked fetch (4.1); success renders count/language (4.2); failure/timeout renders fallback with no error via fake timers (4.3)
    - _Requirements: 4.1, 4.2, 4.3_

- [ ] 12. Implement Contact_Form controller (`js/contact-form.js`)
  - [~] 12.1 Wire validation, Formspree POST, timeout, and email fallback
    - On submit run `validateContactForm`; if invalid show per-field messages and do not POST; if valid POST JSON to the Formspree endpoint with a 10s `AbortController`; show success on confirmed delivery; on error/timeout show failure with `singh.ritooraj@gmail.com` and a prefilled `mailto:` fallback; no secret embedded
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [ ]* 12.2 Write integration tests for contact form (`tests/contact-form.test.mjs`)
    - Valid submit POSTs and shows success with mocked 200 (6.4); error/timeout shows failure with fallback email via fake timers (6.5)
    - _Requirements: 6.4, 6.5_

- [ ] 13. Normalize résumé asset and reference (`RES/`, `index.html`, `js/contact-form.js`)
  - [~] 13.1 Rename the résumé file and wire the download control with fallback
    - Rename `RES/Rituraj_devops (8).pdf` to `RES/resume.pdf`; update the download control to `href="RES/resume.pdf"` with `download="Rituraj_Singh_Resume.pdf"`
    - Add the defensive JS fallback that verifies the primary path resolves and rewrites the link to the actual PDF in `RES/` if it does not
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ]* 13.2 Write example test for résumé fallback (`tests/resume.test.mjs`)
    - Mocked 404 on primary path rewrites the link to the existing PDF (7.4)
    - _Requirements: 7.4_

- [~] 14. Checkpoint - Core controllers wired
  - Run the automated test suite (property + example/integration) and confirm passing. Ensure all tests pass, ask the user if questions arise.

- [ ] 15. Rebuild Architecture_Diagrams as interactive SVG (`js/architecture.js`, `index.html`, `css/components.css`, `css/motion.css`)
  - [~] 15.1 Convert diagrams to SVG with hover/focus highlight and gated flow
    - Replace `div`+icon diagrams with inline SVG: at least one CI/CD and one cloud infrastructure diagram (preserve the three existing ones); each node a focusable `<g>` (`tabindex="0"`, `role="img"`, accessible label) highlighted on hover and keyboard focus; apply the accent-cycle colors per stage/layer
    - Animate edge `stroke-dashoffset` only while in viewport via `IntersectionObserver`; render final state with no flow under reduced motion (enforced in `motion.css`)
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ]* 15.2 Write example tests for diagram interaction (`tests/architecture.test.mjs`)
    - Hover/focus applies highlight (5.2); intersection toggles the flow class (5.3)
    - _Requirements: 5.2, 5.3_

- [~] 16. Implement Motion_System and reduced-motion handling (`js/motion-system.js`, `css/motion.css`)
  - Section entrance animations via `IntersectionObserver` (13.1, 13.4); hover/focus micro-interactions always give feedback, using non-motion cues (color/opacity/outline) under reduced motion (13.2); global reduced-motion block disables non-essential entrance/background animations and shows final state (13.3); JS reads `matchMedia('(prefers-reduced-motion: reduce)')` to skip animation loops
  - _Requirements: 13.1, 13.2, 13.3, 13.4_

- [~] 17. Implement graceful-degradation effects (`js/background-canvas.js`, `js/cursor.js`)
  - Feature-detect and desktop-gate the particle canvas and custom cursor; guard init in try/catch so a failing enhancement never blocks content or navigation; never replace the native cursor on touch/unsupported devices; loops use `requestAnimationFrame`, pause off-screen, and disable under reduced motion
  - _Requirements: 10.2, 14.3_

- [ ] 18. Wire all modules in `main.js` and finalize content sections
  - [~] 18.1 Compose the app entry and init order
    - In `js/main.js`, import and initialize all modules on `DOMContentLoaded` in a safe order (theme → boot → navigation → terminal → github → contact → architecture → motion → canvas → cursor); pass reduced-motion state to consumers
    - _Requirements: 1.1, 1.4, 16.1_

  - [~] 18.2 Verify and correct content sections in `index.html`
    - Hero shows "Rituraj Singh" and "DevOps Engineer | Cloud Infrastructure | SRE" (15.1); ensure all sections present: about, skills, projects, architecture, experience, certifications, contact (15.2); canonical contact links `singh.ritooraj@gmail.com`, `github.com/ritooraj01`, `linkedin.com/in/rituraj-singh-0001` (15.3)
    - _Requirements: 15.1, 15.2, 15.3, 15.4_

- [~] 19. Add SEO and social sharing metadata (`index.html`, `sitemap.xml`, `robots.txt`)
  - Add `<title>`, `<meta name="description">`, `<meta name="author">` (11.1); Open Graph `og:title`/`og:description`/`og:type`/`og:image` (absolute HTTPS)/`og:url` (11.2); `<link rel="canonical" href="https://ritooraj01.github.io">` (11.3)
  - Create `sitemap.xml` and `robots.txt` at the site root; exclude `tests/` and `RES/design-refs/` from indexing (11.4)
  - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [ ] 20. Apply accessibility, responsive, and performance polish (`index.html`, `css/base.css`, `css/responsive.css`)
  - [~] 20.1 Accessibility pass
    - Descriptive `alt` for informational images, empty `alt` for decorative (12.1); accessible names on every control incl. theme toggle, hamburger, terminal input, SVG nodes (12.2); keyboard reachability/operability for terminal and diagram nodes (12.3); global visible `:focus-visible` indicator (12.4); confirm `<html lang="en">` (12.5)
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [~] 20.2 Responsive and performance pass
    - Single-column + hamburger at ≤767px, split hero at ≥768px, `overflow-x` guards for no horizontal scroll at any width (9.1–9.4); native `loading="lazy"` on below-the-fold images (profile stays eager) (14.2); ensure module scripts defer and heavy work runs after first paint for <3s TTI (14.1); confirm all third-party URLs load over HTTPS (16.3)
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 14.1, 14.2, 16.3_

- [~] 21. Author manual verification checklist (`TESTING.md`)
  - Create `portfolio/ritooraj/TESTING.md` (dev-only, not linked from `index.html`) covering the manual/visual/environmental criteria: Signature Interface continuity (1.1, 1.3, 1.4), palette (1.2), diagrams present + reduced-motion (5.1, 5.4), contact fields + secret scan (6.1, 4.5, 6.6), résumé link/download (7.1–7.3), contrast ≥4.5:1 both themes (8.5), responsive widths 320/375/768/1024/1440 (9.1–9.4), degradation with canvas/cursor disabled (10.2), cross-browser rendering in each Supported_Browser (10.1), SEO artifacts (11.1–11.4), a11y screen-reader/keyboard spot-check (12.1–12.5), motion on/off states (13.1–13.4), Lighthouse TTI/lazy/fps (14.1–14.3), content/links (15.1–15.4), and deployment static/relative/HTTPS verification via `npx serve` and the Pages URL (16.1–16.3)
  - _Requirements: 1.1, 1.2, 1.4, 4.5, 5.1, 5.4, 6.1, 6.6, 7.1, 7.2, 7.3, 8.5, 9.1, 9.2, 9.3, 9.4, 10.1, 10.2, 11.1, 11.2, 11.3, 11.4, 12.1, 12.2, 12.3, 12.4, 12.5, 13.1, 13.2, 13.3, 13.4, 14.1, 14.2, 14.3, 15.1, 15.2, 15.3, 15.4, 16.1, 16.2, 16.3_

- [~] 22. Final checkpoint - Full verification
  - Run the complete automated suite (Properties 1–7 at ≥100 iterations plus example/integration tests) and walk the `TESTING.md` checklist. Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional test sub-tasks and can be skipped for a faster MVP; core implementation tasks are never optional.
- All file paths are confined to `portfolio/ritooraj/`. The site remains buildless: ES modules, split CSS via `<link>` tags, relative asset paths, HTTPS third-party dependencies.
- Property tests use **fast-check** (via `npx`, not bundled), run a minimum of **100 iterations**, and are tagged `// Feature: advanced-devops-portfolio, Property {n}: {text}`. Properties 1–7 map to the three pure modules `commands.js`, `validation.js`, and `github-model.js` (Property 3 is verified through the terminal DOM controller against the pure command layer).
- Test files live under `portfolio/ritooraj/tests/`, are dev-only, and are excluded from deployment (not linked from `index.html`, disallowed in `robots.txt`).
- Checkpoints (tasks 6, 14, 22) provide incremental validation gates.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1", "3.1", "4.1", "5.1"] },
    { "id": 2, "tasks": ["2.2", "3.2", "4.2", "5.2"] },
    { "id": 3, "tasks": ["3.3", "5.3", "7.1", "9"] },
    { "id": 4, "tasks": ["5.4", "8.1", "10.1"] },
    { "id": 5, "tasks": ["7.2", "8.2", "10.2", "11.1"] },
    { "id": 6, "tasks": ["10.3", "11.2", "12.1"] },
    { "id": 7, "tasks": ["12.2", "13.1"] },
    { "id": 8, "tasks": ["13.2", "15.1"] },
    { "id": 9, "tasks": ["15.2", "16", "17"] },
    { "id": 10, "tasks": ["18.1"] },
    { "id": 11, "tasks": ["18.2"] },
    { "id": 12, "tasks": ["19"] },
    { "id": 13, "tasks": ["20.1"] },
    { "id": 14, "tasks": ["20.2"] },
    { "id": 15, "tasks": ["21"] }
  ]
}
```
