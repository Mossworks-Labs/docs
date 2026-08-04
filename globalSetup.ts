// Mints the credential the screenshot runner needs, once per test session,
// and stashes it where the spec / config can pick it up.
//
// Two modes (see screenshot-auth.ts for the full rationale):
//
//   bearer (default)  Keycloak ROPC against the `mobile` client → an access
//                     token in TOKEN_FILE. Targets a local stack.
//   session           Real browser OIDC sign-in against a deployed apex →
//                     a Playwright storageState in STATE_FILE. Opt in with
//                     SCREENSHOTS_AUTH=session.
//
// Why bearer exists at all: studio's bearer-token middleware does real JWKS
// signature verification (apps/studio/src/lib/jwt-verify.ts), so the old
// trick of hand-crafting an `alg:none` JWT stopped working — every /api/*
// call returned 401, the SPA never bootstrapped, and every
// `waitForSelector('header')` timed out. ROPC against the `mobile` client
// (Direct Access Grants enabled) produces a token whose signature, issuer
// and audience line up with what jwt-verify.ts expects.
//
// Why session exists: the `mobile` client is not present on every realm.
// preprod's realm is `mossworks` (login-preprod.mossworks.io) and has no
// `mobile` client at all — ROPC there returns `invalid_client`, and the
// clients that do exist reject direct access grants. The only working
// credential path against a deployed apex is the ordinary browser sign-in,
// which yields a session cookie on the parent domain; the SPA's fetch()
// calls already use `credentials: 'include'`, so no header injection is
// needed once the context carries that cookie.

import { writeFileSync } from 'fs';
import { chromium } from '@playwright/test';
import { TOKEN_FILE, STATE_FILE, SESSION_AUTH } from './screenshot-auth';

const TOKEN_URL =
  process.env.KEYCLOAK_TOKEN_URL ||
  'https://sso.mossworks.io/realms/craft/protocol/openid-connect/token';
const CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID || 'mobile';

/** Sign in through the apex's OIDC flow and persist the resulting cookies. */
async function mintSession(username: string, password: string): Promise<void> {
  const base = (process.env.SCREENSHOT_URL || 'http://localhost:3000').replace(/\/+$/, '');
  const browser = await chromium.launch();
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  try {
    // The apex mounts the OIDC entrypoint at /api/auth/login (config.json
    // `authUrl`); older/standalone shapes expose it under /api/studio.
    // Try both — whichever lands us on the Keycloak form wins.
    for (const path of ['/api/auth/login?next=/studio/', '/api/studio/auth/login?next=/studio/']) {
      await page.goto(`${base}${path}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);
      if (await page.locator('#username').isVisible().catch(() => false)) break;
    }
    if (!(await page.locator('#username').isVisible().catch(() => false))) {
      throw new Error(`No Keycloak sign-in form reached from ${base} — is SCREENSHOT_URL an apex deployment?`);
    }

    await page.fill('#username', username);
    await page.fill('#password', password);
    await page.click('#kc-login, input[type=submit]');
    await page.waitForLoadState('domcontentloaded');

    // /api/account/me is the canonical apex auth probe (see tour-auth.setup.ts).
    let authenticated = false;
    const deadline = Date.now() + 60_000;
    while (Date.now() < deadline) {
      try {
        const resp = await page.request.get(`${base}/api/account/me`);
        if (resp.ok()) {
          const me = (await resp.json()) as any;
          if (me?.authenticated === true || me?.user?.userId) {
            authenticated = true;
            break;
          }
        }
      } catch {
        // network blip — keep polling
      }
      await page.waitForTimeout(2000);
    }
    if (!authenticated) throw new Error(`OIDC sign-in as ${username} did not produce a session at ${base}`);

    await context.storageState({ path: STATE_FILE });
    // The spec reads TOKEN_FILE at module load; in session mode there is no
    // bearer token, and an empty file is the signal to use cookies instead.
    writeFileSync(TOKEN_FILE, '', 'utf8');
    console.log(`[globalSetup] session storageState saved to ${STATE_FILE}`);
  } finally {
    await browser.close();
  }
}

export default async function globalSetup(): Promise<void> {
  const username = process.env.SCREENSHOTS_USER;
  const password = process.env.SCREENSHOTS_PASSWORD;
  if (!username || !password) {
    // The tour project doesn't need a screenshot credential, and this config
    // is shared with that project. Quiet no-op when the env isn't set —
    // screenshots.spec.ts itself will fail loudly if someone runs the
    // screenshots project without configuring this.
    console.log('[globalSetup] SCREENSHOTS_USER/PASSWORD unset — skipping credential mint (tour project doesn\'t need it).');
    return;
  }

  if (SESSION_AUTH) {
    await mintSession(username, password);
    return;
  }

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: 'password',
    username,
    password,
    scope: 'openid email profile',
  });

  const resp = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!resp.ok) {
    const body = await resp.text().catch(() => '');
    throw new Error(
      `Keycloak ROPC failed: ${resp.status} ${body}\n` +
        `  token endpoint: ${TOKEN_URL}\n  client_id: ${CLIENT_ID}\n` +
        '  If this realm has no ROPC-capable client (preprod does not), run with SCREENSHOTS_AUTH=session.',
    );
  }

  const data = (await resp.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error(`Keycloak ROPC returned no access_token: ${JSON.stringify(data)}`);
  }

  writeFileSync(TOKEN_FILE, data.access_token, 'utf8');
}
