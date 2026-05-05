import { defineConfig } from '@playwright/test';

// Screenshots are taken via port-forwarded frontend nginx service, which
// proxies /api/ to studio. Auth uses a real Keycloak access token: the
// `globalSetup` step mints one via ROPC against the `mobile` client and
// stashes it in a tmpfile; the spec picks it up at module load and sets
// it as `Authorization: Bearer …` on the page context before each goto.
//
// Why ROPC and not the alg:none JWT this used to use: studio now does
// real JWKS signature verification, so a hand-crafted token gets 401'd
// and the SPA never bootstraps.
//
// Required env (set by the GHA workflow):
//   SCREENSHOTS_USER       Keycloak username (a dedicated screenshot user).
//   SCREENSHOTS_PASSWORD   Its password.
//   KEYCLOAK_TOKEN_URL     (optional) Override the default sso.mossworks.io
//                          token endpoint when running against a non-prod
//                          Keycloak.
//   KEYCLOAK_CLIENT_ID     (optional) Override the default `mobile` client.
//
// Usage:
//   kubectl port-forward svc/craft-frontend 3000:3000 &
//   SCREENSHOTS_USER=… SCREENSHOTS_PASSWORD=… npx playwright test
//
// Or against a deployed dev cluster:
//   SCREENSHOT_URL=https://dev.mossworks.io/studio/ \
//     SCREENSHOTS_USER=… SCREENSHOTS_PASSWORD=… npx playwright test

export default defineConfig({
  testDir: '.',
  testMatch: 'screenshots.spec.ts',
  timeout: 90000,
  globalSetup: require.resolve('./globalSetup'),
  use: {
    baseURL: process.env.SCREENSHOT_URL || 'http://localhost:3000',
    ignoreHTTPSErrors: true,
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark',
    screenshot: 'off',
  },
});
