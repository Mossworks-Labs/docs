# CRAFT — Documentation

User guide built with [VitePress](https://vitepress.dev/), with automated screenshots via [Playwright](https://playwright.dev/).

## Local Development

```bash
cd docs
npm install        # first time only
npm run dev        # starts at http://localhost:5173/
```

## Build

```bash
npm run build      # outputs to .vitepress/dist/
npm run preview    # preview the built site
```

## Screenshots

Screenshots are captured automatically by Playwright against the running apps. There are two sources:

| Source | Spec | Output | Themes |
|---|---|---|---|
| Studio | `docs/screenshots.spec.ts` | `<name>-<scheme>.png` (7 schemes) | xanderu, purple, blue, amber, rose, liquidgold, otter |
| Marketplace | `marketplace/tests/screenshots/marketplace.spec.ts` | `<name>.png` (1 set) | n/a — marketplace doesn't ship the multi-scheme palette yet |

`docs/take-screenshots.sh` orchestrates both. PNGs land in `docs/public/screenshots/`.

### Take screenshots locally

Both apps run in the local k3s cluster. The orchestrator handles port-forwards for studio (`craft-frontend`) and Postgres (`craft-postgresql`); the marketplace is reached through its k3s ingress at `marketplace-dev.mossworks.io` via a chromium `--host-resolver-rules` mapping to the cluster LAN IP.

```bash
# First-time only: install Playwright chromium for both
cd docs && npx playwright install --with-deps chromium
( cd ../marketplace && npx playwright install --with-deps chromium )

# Capture
cd docs && bash take-screenshots.sh                  # both
bash take-screenshots.sh studio                      # studio only
bash take-screenshots.sh marketplace                 # marketplace only
```

Defaults: `STUDIO_URL=http://localhost:3000`, `MARKETPLACE_URL=https://marketplace-dev.mossworks.io`, `MOSSWORKS_INGRESS_IP=192.168.50.26`, `MARKETPLACE_DIR=../marketplace`. Set `SKIP_PORT_FORWARDS=1` if you've already got the kubectl forwards running.

### Test hook

The studio Playwright spec navigates via `window.__craftStore` (exposed in `craft-studio/src/store/appStore.ts`) rather than chrome selectors, so tests don't drift when the UI changes layout. Call `store.setState({ activeView: '...', openEpisodeId: '...' })` to reach any view.

### CI Pipeline

On **pull requests**, the CI pipeline automatically:
1. Builds the studio Docker image
2. Starts it with the seed data from `docs/seed/`
3. Runs Playwright to capture screenshots
4. Uploads them as a build artifact

Screenshots are **not** auto-committed — download the artifact from the PR checks and commit manually if they look good.

### Adding a new screenshot

**Studio (multi-scheme):**

1. Add a `test(...)` block in `docs/screenshots.spec.ts` that navigates via `setView(page, '<activeView>')` or by clicking the relevant TopChrome button, then calls `await shotAllSchemes(page, 'name-of-view')`.
2. Run the spec against a live deployment — it writes 7 PNGs (one per scheme).
3. Reference the image in any `docs/guide/*.md` page with `<SchemeImage name="name-of-view" alt="…" />` — VitePress picks the PNG matching the active scheme automatically.

**Marketplace (single shot, no schemes yet):**

1. Add a `test(...)` block in `marketplace/tests/screenshots/marketplace.spec.ts` that navigates via `await asPersona(...)` + `await page.goto(SPA_BASE + 'route')`, then calls `await shoot(page, 'name-of-view')`.
2. Run `bash take-screenshots.sh marketplace` — it writes one PNG to `docs/public/screenshots/`.
3. Reference the image with `<FlatImage name="name-of-view" alt="…" />` — resolves to `/screenshots/name-of-view.png` directly.

When the marketplace adopts the scheme palette, swap its spec to use `shotAllSchemes` and switch the `<FlatImage>` references to `<SchemeImage>`.

## Seed Data

The `seed/` directory contains demo channel data used for screenshots:

```
seed/channels/demo-channel/
  channel.json         # Channel config (Lorem Ipsum Tech)
  ideas/               # 3 sample ideas (manual, AI, discover)
  scripts/
    drafts/            # 1 draft Short script
    final/             # 1 final Long script
```

To add more seed data, follow the JSON/Markdown formats in `app/backend/src/lib/fileStore.ts`.

## Directory Structure

```
docs/
  .vitepress/
    config.mts         # VitePress config (sidebar, nav, theme)
  public/
    screenshots/       # Playwright-captured images
  guide/               # 18 guide pages (top-chrome / ideas / scripts / discover / audio / storyboard / marketplace / etc.)
  seed/                # Demo data for screenshots
  index.md             # Landing page with hero
  screenshots.spec.ts  # Playwright test spec
  playwright.config.ts # Playwright config
  package.json         # VitePress + Playwright deps
```

## Deployment

The docs deploy automatically on push to `main` via the CI workflow. The site is available at:

**https://docs.mossworks.io/**
