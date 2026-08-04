# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`docs` is the **VitePress user guide** for CRAFT Studio and the creator marketplace, deployed to **docs.mossworks.io** (GitHub Pages). It is audience-facing **end-user** documentation, distinct from the per-repo developer docs (`CLAUDE.md` / `README.md`) elsewhere in the Mossworks workspace.

`package.json` name is `craft-docs`. Guide pages live under `guide/` (one `.md` per topic), the landing page is `index.md`, and the VitePress site title is "CRAFT Studio" (Content Refinement & Authoring Framework Toolkit).

The repo is **more than a VitePress site** — it also carries a **Playwright capture subsystem** with two distinct workloads that boot the live apps:

- **`screenshots`** — auto-captures the guide PNGs in **7 colour schemes** (amber, blue, liquidgold, otter, purple, rose, xanderu) into `public/screenshots/`. Two auth modes (see `screenshot-auth.ts`): **bearer** (default) mints a Keycloak ROPC token against the `mobile` client and injects it as a header — programmatic, CI-style, aimed at a **local** stack; **session** (`SCREENSHOTS_AUTH=session`) does a headless browser OIDC sign-in against a deployed apex and reuses the cookies as a `storageState`. Viewport 1440×900.
- **`tour`** — records a 1080p `.webm` walkthrough of the headline studio workflow (for the marketing site, not the guide). Auths via an interactive sign-in whose `storageState` is captured once with `npm run tour:auth`. Viewport 1920×1080, video on.

The README documents the VitePress side and the `<SchemeImage>` / `<FlatImage>` authoring API but deliberately punts on the capture pipeline ("operator-internal"); this file fills that gap.

## Build Commands

From `package.json` scripts:

- `npm run dev` — VitePress dev server. The script passes `--host 0.0.0.0` (binds all interfaces); the URL is `http://localhost:5173/`.
- `npm run build` — static build → `.vitepress/dist/`.
- `npm run preview` — preview the production build.
- `npm run screenshots` — Playwright `screenshots` project (`screenshots.spec.ts`); drives the live app to capture guide PNGs. Needs `SCREENSHOTS_USER` / `SCREENSHOTS_PASSWORD` (and optionally `KEYCLOAK_TOKEN_URL`, `KEYCLOAK_CLIENT_ID`); base URL defaults to `http://localhost:3000` (override with `SCREENSHOT_URL`).
  - **ROPC only works where a ROPC-capable client exists.** The default token URL (`sso.mossworks.io/realms/craft`) no longer resolves, and preprod's realm is `mossworks` (`login-preprod.mossworks.io`) with **no `mobile` client** — the token endpoint answers `invalid_client`, and the clients that do exist reject direct access grants. Against a deployed apex use session mode instead:

    ```bash
    SCREENSHOTS_AUTH=session SCREENSHOT_URL=https://preprod.mossworks.io \
    SCREENSHOTS_USER=… SCREENSHOTS_PASSWORD=… \
    SCREENSHOTS_CHANNEL_ID=<existing channel uuid> \
    npx playwright test --project=screenshots -g "discover planner"
    ```

    Session mode **does not seed or delete fixtures** (a deployed environment's data isn't ours to touch) — `beforeAll`/`afterAll` early-return and channel-scoped captures point at `SCREENSHOTS_CHANNEL_ID`. It also skips the channel-list mock and the bearer header. Only the captures explicitly written for it (currently `discover planner`) are session-aware; filter with `-g` rather than running the whole project.
  - **Store pokes no longer navigate.** studio's routing is TanStack-Router-owned, so the spec's `setView()` (which mutates `activeView` on `window.__craftStore`) does not change what renders. Session-aware tests navigate by URL (`/studio/c/<id>/discover`).
- `npm run tour:auth` — runs the `tour-auth` project (`tour-auth.setup.ts`, `--headed`): opens a real Chromium, you sign in by hand, and the context is saved to `.auth/tour-storage-state.json`.
- `npm run tour` — runs the `tour` project (`tour.spec.ts`); records the marketing `.webm`. Reuses the `tour:auth` storage state; base URL defaults to `https://qa.mossworks.io` (override with `PLAYWRIGHT_BASE_URL`).
- `npm run tour:headed` — same as `tour` but headed.

There is **no Vitest or unit-test setup** here — Playwright is the only test tooling, and it is for capture, not assertions. `take-screenshots.sh` is the operator wrapper that orchestrates the full screenshot run.

## Architecture

- `.vitepress/config.mts` — title, nav, sidebar, theme. `appearance: 'dark'`, local search, `ignoreDeadLinks: [/localhost/]` (so dev/localhost links don't fail the build).
- `.vitepress/theme/` — custom theme with a screenshot authoring API beyond stock VitePress:
  - `SchemeImage.vue` — `<SchemeImage name="x" />` resolves to `/screenshots/x-<scheme>.png`, rotating with the active colour scheme.
  - `FlatImage.vue` — `<FlatImage name="x" />` resolves to `/screenshots/x.png` (single-image surfaces).
  - Plus `HeroCarousel.vue`, `SchemePickerRaw.vue`, `index.ts` (registers the components), and `custom.css`.
- `guide/*.md` — one page per topic (episodes, proposals, scripts, storyboard, audio, channels, settings, marketplace, agents, jobs, etc.).
- `public/screenshots/` — the PNGs, named `<name>-<scheme>.png` (7 per scheme-rotated image) or `<name>.png` (flat). `public/CNAME` pins the custom domain.
- **Capture subsystem (repo root):** `playwright.config.ts` (defines the three projects: `screenshots`, `tour`, `tour-auth`), `screenshots.spec.ts`, `tour.spec.ts`, `tour-auth.setup.ts`, `screenshot-auth.ts`, `globalSetup.ts` (mints the Keycloak ROPC token for `screenshots`; no-op when `SCREENSHOTS_USER` is unset so `tour` can run without those creds), `take-screenshots.sh`, and `seed/` (demo-channel fixture data: ideas + scripts).

## Key Conventions

- **Deploy is push-to-`main`** via `.github/workflows/docs.yml` (workflow name "Docs"): `npm ci && npm run build`, then `peaceiris/actions-gh-pages@v4` publishes `.vitepress/dist`. The deploy step is gated `if: github.event_name == 'push'`, so **PRs build but do not deploy**.
- **Node 22** in CI (`actions/setup-node` with `node-version: 22`).
- **Use `<SchemeImage>` / `<FlatImage>`** for screenshots in guide pages, not raw Markdown image syntax — that is what makes theme/scheme rotation work. New screenshots go into `public/screenshots/` referenced by `name`.
- `package.json` pins `overrides.esbuild: ^0.25.0` (transitive pin); keep it when bumping VitePress/Playwright.
- The two capture workloads share one `playwright.config.ts` but pin their own `use` blocks — don't let `devices['Desktop Chrome']` defaults (it ships a 1280×720 viewport) clobber the per-project viewport; re-pin viewport **after** the device spread.

## Testing

There are no unit tests. Verify changes by:

- `npm run build` (what CI runs; catches dead links not matching the `/localhost/` allowlist and config errors).
- `npm run dev` + visual check of affected `guide/*.md` pages.
- Regenerating screenshots via `npm run screenshots` / `take-screenshots.sh` only when a documented UI surface changed (requires the full app stack + Keycloak creds).

## Related Repos

- `craft-studio/`, `marketplace/` — the frontends this guide documents (and which `screenshots` / `tour` drive live).
- `smoketests/` — the workspace's full-stack E2E harness. This repo's Playwright subsystem is **doc-specific capture**, separate from the smoketests suite.
- `helm-charts/` (`docs` chart) and `platform-deploy` — deploy plumbing for the wider stack; this repo deploys to GitHub Pages on its own.

> Workspace note: this repo lives in the Mossworks multi-repo workspace described in the root `CLAUDE.md`. Stay inside this repo per commit; cross-repo changes need a PR per affected repo.
