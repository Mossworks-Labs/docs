// Shared between playwright.config.ts (no, it doesn't import this — see
// note below) and screenshots.spec.ts: the path of the tmpfile that
// globalSetup writes the minted Keycloak access token into.
//
// Why a tmpfile and not process.env: globalSetup runs in the main
// Playwright process; spec module-load runs in worker subprocesses.
// process.env mutations in globalSetup don't propagate to workers.
// A tmpfile written before workers spawn does.
import { tmpdir } from 'os';
import { join } from 'path';

export const TOKEN_FILE = join(tmpdir(), 'craft-screenshot-token.txt');

// ── Two auth modes ──────────────────────────────────────────────────────────
//
// `bearer` (default) — Keycloak ROPC against the `mobile` client, minted in
// globalSetup and injected as an Authorization header on every page request.
// This is the original, CI-friendly path and it targets a *local* stack
// (`SCREENSHOT_URL`, default http://localhost:3000, normally a
// `kubectl port-forward svc/craft-frontend` — see take-screenshots.sh).
//
// `session` — a real browser OIDC sign-in against a deployed apex
// (e.g. https://preprod.mossworks.io), whose cookies are saved as a
// Playwright storageState and reused by the screenshots project. Needed
// because the `mobile` client does NOT exist on every realm — on preprod's
// `mossworks` realm the ROPC call returns `invalid_client`, and no realm
// client there has Direct Access Grants enabled, so `bearer` simply cannot
// work against it. Opt in with SCREENSHOTS_AUTH=session.
//
// NOTE: session mode is currently wired for the channel-scoped captures that
// need a real premium account (the Discover planner). The bearer-mode fixture
// seeding (dummy channel + ideas + script) is skipped in session mode — a
// deployed environment is not ours to seed or tear down, so session captures
// point at an existing channel via SCREENSHOTS_CHANNEL_ID.
export const SESSION_AUTH = process.env.SCREENSHOTS_AUTH === 'session';

/** Where globalSetup parks the signed-in browser context for session mode. */
export const STATE_FILE = join(tmpdir(), 'craft-screenshot-state.json');
