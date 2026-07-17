# Tests

Dev-only automated tests for the portfolio. These files are excluded from
deployment (not linked from `index.html`, disallowed in `robots.txt`).

- Property-based tests use **fast-check** via `npx` (not bundled) and run a
  minimum of 100 iterations.
- Example / integration tests use Node's built-in test runner.

Test files (`*.test.mjs`) are added by later tasks in the implementation plan.

## Running

```bash
npm install      # installs fast-check + jsdom (dev only)
npm test         # node --test over tests/*.test.mjs
```

- Property tests use fast-check (≥100 iterations each), matching
  `// Feature: advanced-devops-portfolio, Property N:` tags.
- DOM/integration tests use jsdom (from `jsdom-setup.mjs`) + Node's built-in
  runner; no browser required.
- `node_modules/`, `package-lock.json` are gitignored and excluded from deploy.
