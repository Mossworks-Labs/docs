import { defineConfig } from '@playwright/test';

// Screenshots are taken via port-forwarded frontend nginx service,
// which proxies /api/ to studio. Auth is simulated via the studio's
// Bearer-token path (post-ADR 0002 — the legacy X-Auth-Request-* headers
// no longer populate req.user). Studio decodes the JWT payload without
// crypto verification, so an `alg: none` JWT carrying admin+premium
// roles is enough for the screenshot runner.
//
// Usage:
//   kubectl port-forward svc/craft-frontend 3000:3000 &
//   npx playwright test
//
// Or against a deployed dev cluster:
//   SCREENSHOT_URL=https://dev.mossworks.io/studio/ npx playwright test

const useDirectAuth = !process.env.SCREENSHOT_URL?.includes('https://');

// alg:none JWT with payload:
//   { realm_access: { roles: ['admin', 'premium'] },
//     preferred_username: 'localdev',
//     email: 'localdev@craft.local',
//     given_name: 'Local' }
// Used as the Authorization Bearer token so studio's bearer-path
// auth middleware populates req.user. No signature verification is
// done — studio trusts the network boundary.
const SCREENSHOT_JWT = 'eyJhbGciOiJub25lIn0.eyJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiYWRtaW4iLCJwcmVtaXVtIl19LCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJsb2NhbGRldiIsImVtYWlsIjoibG9jYWxkZXZAY3JhZnQubG9jYWwiLCJnaXZlbl9uYW1lIjoiTG9jYWwifQ.';

export default defineConfig({
  testDir: '.',
  testMatch: 'screenshots.spec.ts',
  timeout: 90000,
  use: {
    baseURL: process.env.SCREENSHOT_URL || 'http://localhost:3000',
    ignoreHTTPSErrors: true,
    ...(useDirectAuth ? {
      extraHTTPHeaders: {
        Authorization: `Bearer ${SCREENSHOT_JWT}`,
      },
    } : {}),
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark',
    screenshot: 'off',
  },
});
