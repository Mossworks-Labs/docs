/**
 * One-shot auth bootstrap for the studio tour (`tour.spec.ts`). Opens a
 * real Chromium and waits up to 5 minutes for the user to sign in. When
 * /api/account/me reports an authenticated session we capture the
 * resulting cookies + localStorage and persist them to
 * `.auth/tour-storage-state.json` for the tour spec to reuse.
 *
 * Different from `screenshot-auth.ts` in this repo:
 *   - screenshot-auth.ts mints a Keycloak ROPC token for the
 *     screenshots.spec — programmatic, CI-friendly, no human in the loop.
 *   - this file does interactive sign-in so the tour can record video as
 *     whichever testuser identity you want shown in the demo. Runs once
 *     per session expiry; the resulting state lives in .auth/ (gitignored).
 *
 * Run: `npm run tour:auth`
 *
 * Polls /api/account/me (the canonical apex auth endpoint) until it
 * reports authenticated. The previous version waited on
 * `page.waitForURL(/\/studio/)` — but that pattern matches the
 * anonymous landing the user lands on before signing in, so the test
 * ended immediately and saved a storageState that only had the
 * Cloudflare clearance cookie.
 */
import { test, expect } from '@playwright/test';
import path from 'node:path';
import { mkdirSync } from 'node:fs';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'https://qa.mossworks.io';
const AUTH_FILE = path.resolve(__dirname, '.auth/tour-storage-state.json');

test('capture testuser session for tour', async ({ page, context }) => {
  test.setTimeout(5 * 60 * 1000);

  mkdirSync(path.dirname(AUTH_FILE), { recursive: true });

  // Start at /studio/ — anonymous, so the shell will surface a Sign-in
  // CTA that redirects through Keycloak.
  await page.goto(`${BASE_URL}/studio/`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('body')).toBeVisible();

  // The /me path on the apex is mounted under /api/account (see
  // site/src/auth/fetchMe.ts). Try both the apex path and the standalone
  // account-service path so this works in either deploy shape.
  const ME_PATHS = ['/api/account/me', '/me'];
  const TIMEOUT_MS = 5 * 60 * 1000;
  const POLL_MS = 2_000;
  const deadline = Date.now() + TIMEOUT_MS;
  let authenticated = false;
  while (Date.now() < deadline) {
    for (const meUrl of ME_PATHS) {
      try {
        const resp = await page.request.get(`${BASE_URL}${meUrl}`);
        if (resp.ok()) {
          const me = await resp.json();
          if (me?.authenticated === true || me?.user?.userId) {
            authenticated = true;
            break;
          }
        }
      } catch {
        // network blip — keep polling
      }
    }
    if (authenticated) break;
    await page.waitForTimeout(POLL_MS);
  }
  expect(authenticated, 'sign-in did not complete within 5 minutes').toBe(true);

  await context.storageState({ path: AUTH_FILE });
  console.log(`✔ Tour auth state saved to ${AUTH_FILE}`);
});
