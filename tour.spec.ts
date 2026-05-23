/**
 * Studio product-tour walkthrough — records a single Chromium session
 * driving the headline workflow at 1080p so the marketing edit can use
 * the captured `.webm` as the demo-video source.
 *
 * Sections (each one ~10-15s of screen time):
 *   1. Landing → Create channel
 *   2. Open Episodes → New Episode
 *   3. Switch to Scripts → quick edit
 *   4. Discover panel — niche search
 *   5. Deep Dive into a video card
 *   6. Audio panel — show production surface (progressive section refresh)
 *   7. Storyboard panel — beat board
 *   8. Publish panel — final hand-off surface
 *
 * Distinct from the existing `screenshots.spec.ts` in the same repo:
 *   - screenshots uses ROPC + bearer token, runs in CI, drops PNGs into
 *     `public/screenshots/` for the docs site.
 *   - this tour uses interactive sign-in (stashed storageState), runs
 *     locally, records video for the marketing site.
 *
 * The pacing is intentional: short pauses between micro-steps give the
 * reader's eye time to track each element. Tweak `BEAT` to slow down /
 * speed up uniformly without rewriting individual waits.
 */
import { test, expect, type Page } from '@playwright/test';

const BEAT = 1_200;
const SECTION_HOLD = 2_500;

// Names embed a timestamp so reruns don't collide on slug uniqueness in
// the test database.
const TS = Date.now();
const CHANNEL_NAME = `Tour Demo Channel ${TS}`;
const EPISODE_TITLE = `Why everyone is talking about Mossworks ${TS}`;

async function beat(page: Page, ms = BEAT) {
  await page.waitForTimeout(ms);
}

test.describe.configure({ mode: 'serial' });

test('studio product tour — 90s walkthrough', async ({ page }) => {
  // The tour now covers 8 surfaces with 2.5s SECTION_HOLD beats — total
  // expected runtime is ~90s on a fast network, ~2 min worst-case. Bump
  // the per-test timeout above the playwright.config default so a
  // single slow XHR doesn't kill the run before the final scene.
  test.setTimeout(5 * 60 * 1000);

  // Native alert() / confirm() / prompt() dialogs (e.g. createChannel's
  // "Failed to create channel" fallback) freeze the page if not handled;
  // dismiss + log so the test fails fast on the next assertion with a
  // visible reason in the console instead of timing out silently.
  page.on('dialog', async (d) => {
    console.error(`[tour] dismissed ${d.type()} dialog: ${d.message()}`);
    await d.dismiss().catch(() => {});
  });
  page.on('pageerror', (err) => console.error(`[tour] pageerror: ${err.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.error(`[tour] page console.error: ${msg.text()}`);
  });
  // Mirror every network failure so we know if the create POST is the
  // thing that's hanging vs the page itself.
  page.on('requestfailed', (req) => {
    console.error(`[tour] requestfailed: ${req.method()} ${req.url()} :: ${req.failure()?.errorText}`);
  });
  page.on('response', (resp) => {
    if (resp.status() >= 400) {
      console.error(`[tour] response ${resp.status()} ${resp.url()}`);
    }
  });

  // ─── 0. Landing ──────────────────────────────────────────────────────
  await page.goto('/studio/', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/studio(\/|$)/);
  // Wait for either the LandingPage CTA or an existing-channels rail to
  // appear — both are valid signed-in starting states.
  await page.waitForSelector(
    'button:has-text("Create new channel"), button:has-text("Create Your First Channel"), [class*="channel"]',
    { timeout: 30_000 },
  );
  await beat(page, SECTION_HOLD);

  // ─── 1. Create channel ───────────────────────────────────────────────
  // Both the empty-state ("Create Your First Channel") and the populated
  // state ("Create new channel") use a button with a Plus icon; match
  // either label.
  const createChannelBtn = page.getByRole('button', { name: /create.*channel/i }).first();
  await createChannelBtn.click();
  await beat(page);

  console.log('[tour] filling channel name…');
  await page.getByPlaceholder('Channel name').fill(CHANNEL_NAME);
  await beat(page);

  console.log('[tour] clicking Get started…');
  await page.getByRole('button', { name: /get started|create/i }).first().click();
  // Channel-create kicks the SPA into the channel-scoped route, so wait
  // for the URL to settle before driving the next surface.
  console.log('[tour] waiting for channel URL…');
  await page.waitForURL(/\/studio\/c\/[a-f0-9-]+/, { timeout: 60_000 });
  // Capture the channel ID so we can navigate back to it directly even
  // after global views (Discover, Deep Dive) deselect the channel.
  const channelMatch = page.url().match(/\/studio\/c\/([a-f0-9-]+)/);
  const channelId = channelMatch?.[1] ?? '';
  console.log(`[tour] channel created (id=${channelId}), holding…`);
  await beat(page, SECTION_HOLD);

  // ─── 2. Episodes — create one ────────────────────────────────────────
  const episodesLink = page.getByRole('link', { name: /^Episodes$/ }).first();
  if (await episodesLink.count()) {
    await episodesLink.click();
  } else {
    await page.evaluate(() => {
      const url = window.location.pathname.replace(/\/c\/([^/]+).*/, '/c/$1/episodes');
      window.history.pushState({}, '', url);
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
  }
  await page.waitForURL(/\/episodes$/, { timeout: 10_000 });
  await beat(page, SECTION_HOLD);

  await page.getByRole('button', { name: /new episode/i }).click();
  await beat(page);
  await page.getByPlaceholder(/episode title/i).fill(EPISODE_TITLE);
  await beat(page);
  await page.getByPlaceholder(/hook/i).fill('What if your studio rendered itself?');
  await beat(page);
  await page.locator('button:has-text("Create")').first().click();
  await expect(page.getByText(EPISODE_TITLE, { exact: false })).toBeVisible({ timeout: 15_000 });
  await beat(page, SECTION_HOLD);

  // ─── 3. Scripts — quick edit ─────────────────────────────────────────
  const scriptsLink = page.getByRole('link', { name: /^Scripts$/ }).first();
  if (await scriptsLink.count()) {
    await scriptsLink.click();
  } else {
    await page.evaluate(() => {
      const url = window.location.pathname.replace(/\/episodes$/, '/scripts');
      window.history.pushState({}, '', url);
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
  }
  await page.waitForURL(/\/scripts(\/|$)/, { timeout: 10_000 });
  await beat(page, SECTION_HOLD);

  const newScriptBtn = page.getByRole('button', { name: /new script|create script|\+ new/i }).first();
  if (await newScriptBtn.count()) {
    await newScriptBtn.click().catch(() => {});
    await beat(page);
  }

  // ─── 4. Discover ─────────────────────────────────────────────────────
  const discoverLink = page.getByRole('link', { name: /^Discover$/ }).first();
  if (await discoverLink.count()) {
    await discoverLink.click();
  } else {
    await page.goto('/studio/discover');
  }
  await page.waitForURL(/\/discover/, { timeout: 10_000 });
  await beat(page, SECTION_HOLD);

  const searchBox = page.getByPlaceholder(/search|niche|topic/i).first();
  if (await searchBox.count()) {
    await searchBox.fill('AI documentaries');
    await beat(page);
    await page.keyboard.press('Enter');
    await beat(page, SECTION_HOLD);
  } else {
    await beat(page, SECTION_HOLD);
  }

  // ─── 5. Deep Dive ────────────────────────────────────────────────────
  const firstVideoCard = page
    .locator('[class*="card"], [class*="grid"] button, article')
    .filter({ hasText: /views|published|watch/i })
    .first();
  if (await firstVideoCard.count()) {
    await firstVideoCard.click({ trial: false }).catch(() => {});
    await expect(page.getByText(/deep dive|channel stats/i).first()).toBeVisible({ timeout: 15_000 });
    await beat(page, SECTION_HOLD);
  }

  // ─── 6. Audio panel ──────────────────────────────────────────────────
  // The deployed image includes a 3s polling refresh while sections are
  // pending, so if the demo channel has any existing project mid-flight
  // the section grid animates live.
  console.log('[tour] navigating to Audio…');
  await gotoChannelPanel(page, channelId, 'audio', /\/audio(\/|$)/);
  await beat(page, SECTION_HOLD);
  const audioGenerateBtn = page.getByRole('button', { name: /generate all|create project|create audio/i }).first();
  if (await audioGenerateBtn.count()) {
    await audioGenerateBtn.click({ trial: false }).catch(() => {});
    await beat(page, SECTION_HOLD);
  }
  await beat(page, SECTION_HOLD);

  // ─── 7. Storyboard panel ─────────────────────────────────────────────
  console.log('[tour] navigating to Storyboard…');
  await gotoChannelPanel(page, channelId, 'storyboard', /\/storyboard(\/|$)/);
  await beat(page, SECTION_HOLD);
  const firstBeat = page.locator('[class*="beat"], [class*="card"]').first();
  if (await firstBeat.count()) {
    await firstBeat.click({ trial: false }).catch(() => {});
    await beat(page);
  }
  await beat(page, SECTION_HOLD);

  // ─── 8. Publish panel ────────────────────────────────────────────────
  console.log('[tour] navigating to Publish…');
  await gotoChannelPanel(page, channelId, 'publish', /\/publish(\/|$)/);
  await beat(page, SECTION_HOLD);

  // Final hold so the closing frame settles cleanly.
  await beat(page, SECTION_HOLD);
});

/**
 * Navigate to a channel-scoped panel by direct URL. We can't rely on the
 * sidebar link because global views (Discover, Deep Dive) deselect the
 * channel and collapse the channel-scoped sub-nav — the link literally
 * isn't in the DOM at that point. Direct goto with the captured channel
 * id rehydrates the channel context via `parsePathname` in the store.
 */
async function gotoChannelPanel(
  page: Page,
  channelId: string,
  slug: string,
  urlPattern: RegExp,
): Promise<void> {
  await page.goto(`/studio/c/${channelId}/${slug}`, { waitUntil: 'domcontentloaded' });
  await page.waitForURL(urlPattern, { timeout: 15_000 });
}
