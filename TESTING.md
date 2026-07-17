# Manual Verification Checklist

Dev-only checklist covering the criteria that are visual, environmental, or
one-time configuration. Run before each significant change. The automated
property + integration tests (`tests/*.test.mjs`, run via `node --test`) cover
the pure logic and DOM behaviour; this checklist covers the rest.

> Run `npm test` first. Then walk the sections below in a browser served from
> the repo root: `npx serve ritooraj` (or `python3 -m http.server`).

## Signature Interface (1.1, 1.3, 1.4)
- [ ] Every section shares the same chrome (glassmorphism cards, monospace
      section titles as shell commands, cyan/purple/pink accents).
- [ ] No visual style discontinuity while navigating between sections.

## Palette (1.2)
- [ ] `css/variables.css` retains `--primary-color:#00D9FF`,
      `--secondary-color:#7B2FF7`, accent pink `#FF006E`.

## Theme (8.1–8.4, FOUC)
- [ ] Toggle flips dark <-> light and persists across reload (localStorage).
- [ ] No flash of wrong theme on hard reload (inline `<head>` guard).
- [ ] Default is dark when no preference is stored.

## Boot Screen (3.1–3.4)
- [ ] Terminal boot sequence plays on first load, then reveals content.
- [ ] Hard refresh after 8s still reveals content (no stuck loader).
- [ ] With OS "reduce motion" on, content appears within ~1s, no animation.

## Command Terminal (2.1–2.6)
- [ ] `help` lists available commands; unknown command shows error + `help` hint.
- [ ] `about`/`projects`/`contact`/etc. scroll to the section.
- [ ] `clear` empties the output; each command is echoed with its output.
- [ ] Terminal input works at ≤768px (on-screen keyboard).

## GitHub Data (4.1–4.5)
- [ ] Projects section shows live repo count + primary language (when online).
- [ ] All five featured repos render (live metadata when available).
- [ ] With network offline, fallback stats show and no error is surfaced.
- [ ] No token/secret in any served asset (grep `Authorization` / API keys).

## Architecture Diagrams (5.1–5.4)
- [ ] A CI/CD pipeline diagram and a cloud infrastructure diagram render as SVG.
- [ ] Hovering / focusing a node highlights it.
- [ ] Flow animation runs only while the diagram is on screen.
- [ ] With "reduce motion" on, diagrams show final state, no flow animation.

## Contact Form (6.1–6.6)
- [ ] Fields for name / email / message; invalid input shows per-field errors and
      does not send.
- [ ] Valid submit shows success (Formspree).
- [ ] On failure/timeout, failure message offers `singh.ritooraj@gmail.com` +
      a `mailto:` fallback.
- [ ] Only the public Formspree endpoint appears in assets (no secret).

## Résumé (7.1–7.4)
- [ ] "Download Resume" links `RES/resume.pdf`, downloads as
      `Rituraj_Singh_Resume.pdf`.
- [ ] Download works; the file exists.
- [ ] Defensive fallback rewrites to `RES/Rituraj_devops (8).pdf` if needed.

## Responsive (9.1–9.4)
- [ ] ≤767px: single-column layout + hamburger/collapsible menu.
- [ ] ≥768px: hero in split-screen layout.
- [ ] No horizontal scroll at widths 320 / 375 / 768 / 1024 / 1440
      (`documentElement.scrollWidth <= clientWidth`).

## Cross-browser / degradation (10.1, 10.2)
- [ ] Renders and navigates in Chrome, Firefox, Safari, Edge (latest 2 versions).
- [ ] Disabling canvas / cursor leaves content visible and navigable.

## SEO (11.1–11.4)
- [ ] `<title>`, meta description, author present.
- [ ] Open Graph tags (title, description, type, image, url) present.
- [ ] `<link rel="canonical" href="https://ritooraj01.github.io">` present.
- [ ] `sitemap.xml` and `robots.txt` exist at the site root; `robots.txt`
      disallows `/tests/` and `/RES/design-refs/`.

## Accessibility (12.1–12.5)
- [ ] Informational images have descriptive `alt`; decorative have empty `alt`.
- [ ] Every interactive control has an accessible name (toggle, hamburger,
      terminal input, diagram nodes).
- [ ] Full keyboard reachability/operability (terminal, diagram nodes).
- [ ] Visible `:focus-visible` indicator on focused controls.
- [ ] `<html lang="en">` is set.

## Motion (13.1–13.4)
- [ ] Entrance animations + micro-interactions behave correctly with motion on.
- [ ] With "reduce motion" on, non-essential animations are off; content in
      final state; hover/focus still gives a non-motion cue (color/outline).

## Performance (14.1–14.3)
- [ ] Interactive within ~3s on broadband (Lighthouse / devtools).
- [ ] Below-the-fold images use `loading="lazy"` (native) where present.
- [ ] ≥30fps during desktop scroll (devtools performance capture).

## Content (15.1–15.4)
- [ ] Hero shows "Rituraj Singh" and "DevOps Engineer | Cloud Infrastructure | SRE".
- [ ] All required sections present (about, skills, projects, architecture,
      experience, certifications, contact).
- [ ] Contact links: `singh.ritooraj@gmail.com`, `github.com/ritooraj01`,
      `linkedin.com/in/rituraj-singh-0001`.
- [ ] Nav/terminal scroll-to-section works for each section.

## Deployment (16.1–16.3)
- [ ] Only static assets; no server runtime required.
- [ ] All local paths relative and resolve from the Pages root.
- [ ] All third-party URLs (Font Awesome, Google Fonts) load over HTTPS.
