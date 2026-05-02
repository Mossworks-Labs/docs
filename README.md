# CRAFT — Documentation

User guide for [CRAFT Studio](https://docs.mossworks.io). Built with
[VitePress](https://vitepress.dev).

## Local development

```bash
npm install            # first time only
npm run dev            # dev server at http://localhost:5173/
npm run build          # static site → .vitepress/dist/
npm run preview        # preview the built site
```

## Layout

```
.vitepress/
  config.mts           # VitePress config (sidebar, nav, theme)
  theme/               # SchemeImage / FlatImage components, custom CSS
public/
  screenshots/         # PNGs referenced by guide pages
guide/                 # Each .md is a page in the user guide
index.md               # Landing page
```

## Adding a screenshot

Two image components are registered:

- `<SchemeImage name="x" />` — resolves to `/screenshots/x-<scheme>.png`,
  rotating with the user's active colour scheme.
- `<FlatImage name="x" />` — resolves to `/screenshots/x.png`. Used for
  surfaces that don't ship the multi-scheme palette.

Drop the PNG(s) into `public/screenshots/` and reference by name in any
`guide/*.md` page.

The capture pipeline (which apps to run, which spec to invoke, how
screenshots actually get produced) is operator-internal — see the
operator docs for that.

## Deployment

The site auto-deploys on push to `main` via the docs CI workflow and is
served at [docs.mossworks.io](https://docs.mossworks.io).
