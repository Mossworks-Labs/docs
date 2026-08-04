import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';
import { SESSION_AUTH, STATE_FILE } from './screenshot-auth';

// Two distinct playwright workloads live in this repo:
//
//   - `screenshots` — auto-captures docs PNGs in 7 color schemes for the
//     vitepress site. Auth via Keycloak ROPC against the `mobile` client
//     (programmatic, runs in CI). Viewport 1440×900, no video.
//
//   - `tour` — records a 1080p .webm walkthrough of the headline studio
//     workflow for the marketing site. Auth via interactive sign-in
//     (storageState captured once with `npm run tour:auth`). Viewport
//     1920×1080, video on.
//
// Both projects share this single config but pin their own `use` blocks
// so they don't bleed defaults into each other.
//
// Required env per project:
//   screenshots:
//     SCREENSHOTS_USER       Keycloak username (a dedicated screenshot user).
//     SCREENSHOTS_PASSWORD   Its password.
//     SCREENSHOT_URL         (optional) Base URL. Default http://localhost:3000.
//     SCREENSHOTS_AUTH       (optional) `session` to sign in through the
//                            browser OIDC flow instead of Keycloak ROPC —
//                            required against a deployed apex like
//                            https://preprod.mossworks.io, whose realm has no
//                            ROPC-capable client. See screenshot-auth.ts.
//     SCREENSHOTS_CHANNEL_ID (optional, session mode) Existing channel to point
//                            channel-scoped captures at; session mode does not
//                            seed or delete fixtures in a deployed environment.
//     KEYCLOAK_TOKEN_URL     (optional) Override the default sso.mossworks.io.
//     KEYCLOAK_CLIENT_ID     (optional) Override the default `mobile` client.
//   tour:
//     PLAYWRIGHT_BASE_URL    (optional) Override the default https://qa.mossworks.io.
//
// Usage:
//   npm run screenshots        # screenshots project (needs SCREENSHOTS_*)
//   npm run tour:auth          # interactive sign-in, writes .auth/tour-storage-state.json
//   npm run tour               # records tests/__videos__/tour/video.webm

const SCREENSHOT_BASE_URL = process.env.SCREENSHOT_URL || 'http://localhost:3000';
const TOUR_BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'https://qa.mossworks.io';
const TOUR_AUTH_FILE = path.resolve(__dirname, '.auth/tour-storage-state.json');

export default defineConfig({
  testDir: '.',
  // Don't run a `*.spec.ts` blanket — each project sets its own testMatch.
  testIgnore: '**/node_modules/**',
  timeout: 180_000,
  // globalSetup mints the Keycloak ROPC token for the screenshots project.
  // It's a no-op when SCREENSHOTS_USER is unset, so the tour project can
  // run without needing those creds (see globalSetup.ts).
  globalSetup: require.resolve('./globalSetup'),
  outputDir: 'test-results',
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  forbidOnly: !!process.env.CI,
  workers: 1,

  projects: [
    {
      name: 'screenshots',
      testMatch: /screenshots\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: SCREENSHOT_BASE_URL,
        ignoreHTTPSErrors: true,
        viewport: { width: 1440, height: 900 },
        colorScheme: 'dark',
        screenshot: 'off',
        // Session mode: reuse the cookies globalSetup captured. The path is
        // resolved when the context is created (in the worker, after
        // globalSetup has run), so the file not existing at config-load is
        // fine. Bearer mode leaves this undefined and injects a header instead.
        ...(SESSION_AUTH ? { storageState: STATE_FILE } : {}),
      },
    },
    {
      name: 'tour',
      testMatch: /tour\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: TOUR_BASE_URL,
        // `devices['Desktop Chrome']` ships a 1280×720 viewport that
        // silently clobbers anything set above; re-pin AFTER the spread.
        viewport: { width: 1920, height: 1080 },
        video: { mode: 'on', size: { width: 1920, height: 1080 } },
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        // Reuse the signed-in browser context captured by tour-auth.setup.ts.
        storageState: TOUR_AUTH_FILE,
      },
    },
    {
      // Separate project that opens a real Chromium and lets the user
      // sign in by hand; the resulting context is saved to TOUR_AUTH_FILE
      // for the tour project to reuse. Invoked via `npm run tour:auth`.
      // No storageState — that's the file we're CREATING.
      name: 'tour-auth',
      testMatch: /tour-auth\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
});
