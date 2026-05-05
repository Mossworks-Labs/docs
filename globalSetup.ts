// Mints a Keycloak access token for the screenshot runner once per test
// session and stashes it where the spec can pick it up.
//
// Why this exists: studio's bearer-token middleware now does real JWKS
// signature verification (apps/studio/src/lib/jwt-verify.ts), so the
// previous trick of hand-crafting an `alg:none` JWT no longer works —
// every /api/* call returned 401, the SPA never bootstrapped, and every
// `waitForSelector('header')` timed out.
//
// The new model: ROPC against the `mobile` Keycloak client (which has
// Direct Access Grants enabled) using a dedicated screenshot user. The
// token's signature, issuer, and audience all line up with what
// jwt-verify.ts expects, so studio accepts it the same way it accepts a
// real mobile-app token.

import { writeFileSync } from 'fs';
import { TOKEN_FILE } from './screenshot-auth';

const TOKEN_URL =
  process.env.KEYCLOAK_TOKEN_URL ||
  'https://sso.mossworks.io/realms/craft/protocol/openid-connect/token';
const CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID || 'mobile';

export default async function globalSetup(): Promise<void> {
  const username = process.env.SCREENSHOTS_USER;
  const password = process.env.SCREENSHOTS_PASSWORD;
  if (!username || !password) {
    throw new Error(
      'SCREENSHOTS_USER and SCREENSHOTS_PASSWORD must be set so the screenshot runner can mint a Keycloak token.',
    );
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
    throw new Error(`Keycloak ROPC failed: ${resp.status} ${body}`);
  }

  const data = (await resp.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error(`Keycloak ROPC returned no access_token: ${JSON.stringify(data)}`);
  }

  writeFileSync(TOKEN_FILE, data.access_token, 'utf8');
}
