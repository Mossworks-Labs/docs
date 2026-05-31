/**
 * Studio product-tour walkthrough — records a single Chromium session
 * driving the headline workflow at 1080p so the marketing edit can use
 * the captured `.webm` as the demo-video source.
 *
 * Section order mirrors the revised demo-reel script (~2:30 cut). Each
 * section is ~10-15s of screen time and lands in the same order the
 * voiceover narrates, so the editor can cut beat-for-beat against it:
 *   0. Landing
 *   1. Create channel        (name + niche w/ RPM hint)
 *   2. Character & Settings   (the persona that steers downstream AI)
 *   3. API keys               (bring-your-own provider tokens modal)
 *   4. Proposals              (AI-scored idea generation)
 *   5. Discover → Deep Dive   (YouTube research layer)
 *   6. Episodes               (create the working episode on the board)
 *   7. Scripts                (editor surface)
 *   8. Audio                  (per-section TTS, progressive refresh)
 *   9. Storyboard             (beat board + media)
 *  10. Composition            (timeline assembler)
 *  11. Publish                (multi-platform hand-off)
 *
 * AI-gated surfaces (Character generate, Proposals generate, Audio
 * generate) are driven *defensively* — if the signed-in QA user has no
 * provider key the control simply isn't there, and the tour still records
 * the surface in order rather than failing. That keeps the capture useful
 * for the edit regardless of which keys the demo account holds.
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

// Pacing tuning — slower beats produce a more comfortable demo video.
// Raised from 1200 / 2500 so the viewer has time to read each screen
// before the next transition fires.
const BEAT = 2_000;
const SECTION_HOLD = 4_000;

// Names embed a timestamp so reruns don't collide on slug uniqueness in
// the test database.
const TS = Date.now();
const CHANNEL_NAME = `Tour Demo Channel ${TS}`;
const EPISODE_TITLE = `Why everyone is talking about Mossworks ${TS}`;

async function beat(page: Page, ms = BEAT) {
  await page.waitForTimeout(ms);
}

test.describe.configure({ mode: 'serial' });

test('studio product tour — full pipeline walkthrough', async ({ page }) => {
  // The tour now covers 12 surfaces with 4s SECTION_HOLD beats — total
  // expected runtime is ~2.5 min on a fast network, more worst-case. Bump
  // the per-test timeout above the playwright.config default so a single
  // slow XHR doesn't kill the run before the final scene.
  test.setTimeout(8 * 60 * 1000);

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

  // Pick a niche so the "$X/1k views" RPM hint in the dropdown is on
  // screen for the voiceover line. Index 0 is the placeholder; index 1 is
  // the first real niche.
  const nicheSelect = page.locator('select').first();
  if (await nicheSelect.count()) {
    await nicheSelect.selectOption({ index: 1 }).catch(() => {});
    await beat(page);
  }

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

  // ─── 2. Character & Settings ─────────────────────────────────────────
  // The persona that steers every downstream AI step. Land on the
  // Character tab so the character description / CLAUDE.md context shows.
  console.log('[tour] navigating to Settings…');
  await gotoChannelPanel(page, channelId, 'settings', /\/settings(\/|$)/);
  await beat(page, SECTION_HOLD);
  const characterTab = page.getByRole('button', { name: /^Character$/i }).first();
  if (await characterTab.count()) {
    await characterTab.click().catch(() => {});
    await beat(page, SECTION_HOLD);
  }
  // Optionally open the AI Character Creator to show the generate flow.
  const creatorToggle = page.getByRole('button', { name: /character creator|generate from character|^generate$/i }).first();
  if (await creatorToggle.count()) {
    await creatorToggle.click({ trial: false }).catch(() => {});
    await beat(page, SECTION_HOLD);
  }

  // ─── 3. API keys (service tokens) ────────────────────────────────────
  // Bring-your-own-AI: open the API Keys modal via its app-level event —
  // the same `craft:open-api-keys` dispatch the host command palette uses.
  // The listener lives in studio's ChromeModals, which mounts once the
  // user is signed in; retry the dispatch a few times to ride out the
  // remote-mount race. Best-effort (no hard assert) so a preprod build
  // that lacks the wiring still records the rest of the reel.
  console.log('[tour] opening API Keys modal…');
  const apiKeysHeading = page.getByRole('heading', { name: /api keys/i }).first();
  let apiKeysOpen = false;
  for (let i = 0; i < 5 && !apiKeysOpen; i++) {
    await page.evaluate(() => document.dispatchEvent(new CustomEvent('craft:open-api-keys')));
    apiKeysOpen = await apiKeysHeading
      .waitFor({ state: 'visible', timeout: 2_000 })
      .then(() => true)
      .catch(() => false);
  }
  if (apiKeysOpen) {
    await beat(page, SECTION_HOLD);
    // ApiKeyModal has no Escape handler — it closes on backdrop click.
    // Click a far corner (on the backdrop, clear of the centred dialog) so
    // it doesn't overlay the next surface in the recording.
    await page.mouse.click(30, 30).catch(() => {});
    await beat(page);
  } else {
    console.warn('[tour] API Keys modal did not open — skipping (check preprod build wiring)');
  }

  // ─── 4. Proposals ────────────────────────────────────────────────────
  console.log('[tour] navigating to Proposals…');
  await gotoChannelPanel(page, channelId, 'proposals', /\/proposals(\/|$)/);
  await beat(page, SECTION_HOLD);
  // Generate is Claude-gated — drive it defensively so a keyless QA user
  // still records the surface. We don't approve/convert here to avoid
  // spawning a competing episode before the explicit Episodes section.
  const generateProposalsBtn = page.getByRole('button', { name: /generate proposals/i }).first();
  if (await generateProposalsBtn.count()) {
    await generateProposalsBtn.click({ trial: false }).catch(() => {});
    await beat(page, SECTION_HOLD);
  }
  await beat(page, SECTION_HOLD);

  // ─── 5. Discover → Deep Dive ─────────────────────────────────────────
  await page.goto('/studio/discover', { waitUntil: 'domcontentloaded' });
  await page.waitForURL(/\/discover/, { timeout: 10_000 });
  await beat(page, SECTION_HOLD);

  const searchBox = page.getByPlaceholder(/search|niche|topic/i).first();
  if (await searchBox.count()) {
    await searchBox.fill('AI documentaries');
    await beat(page);
    await page.keyboard.press('Enter');
    // Give the YouTube search a real chance to render — the first results
    // take a couple of seconds, and the demo should *show* them, not
    // transition away while the grid is still empty.
    await page
      .locator('text=/views|published|watch/i')
      .first()
      .waitFor({ state: 'visible', timeout: 5_000 })
      .catch(() => {});
    await beat(page, 5_000);
    await beat(page, SECTION_HOLD);
  } else {
    await beat(page, SECTION_HOLD);
  }

  const firstVideoCard = page
    .locator('[class*="card"], [class*="grid"] button, article')
    .filter({ hasText: /views|published|watch/i })
    .first();
  if (await firstVideoCard.count()) {
    await firstVideoCard.click({ trial: false }).catch(() => {});
    await expect(page.getByText(/deep dive|channel stats|transcript/i).first()).toBeVisible({ timeout: 15_000 });
    await beat(page, SECTION_HOLD);
  }

  // ─── 6. Episodes — create the working episode ────────────────────────
  // Direct-nav (not the sidebar link): the global Discover view above
  // deselected the channel and collapsed the channel-scoped sub-nav, so
  // the Episodes link isn't in the DOM. gotoChannelPanel rehydrates the
  // channel context from the URL.
  console.log('[tour] navigating to Episodes…');
  await gotoChannelPanel(page, channelId, 'episodes', /\/episodes(\/|$)/);
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

  // ─── 7. Scripts ──────────────────────────────────────────────────────
  console.log('[tour] navigating to Scripts…');
  await gotoChannelPanel(page, channelId, 'scripts', /\/scripts(\/|$)/);
  await beat(page, SECTION_HOLD);
  const newScriptBtn = page.getByRole('button', { name: /new script|create script|\+ new/i }).first();
  if (await newScriptBtn.count()) {
    await newScriptBtn.click().catch(() => {});
    await beat(page, SECTION_HOLD);
  }

  // ─── 8. Audio ────────────────────────────────────────────────────────
  // The deployed image includes a 3s polling refresh while sections are
  // pending, so if the demo channel has any existing project mid-flight
  // the section grid animates live.
  console.log('[tour] navigating to Audio…');
  await gotoChannelPanel(page, channelId, 'audio', /\/audio(\/|$)/);
  await beat(page, SECTION_HOLD);
  const audioGenerateBtn = page.getByRole('button', { name: /generate all|create project|create audio|create voice track/i }).first();
  if (await audioGenerateBtn.count()) {
    await audioGenerateBtn.click({ trial: false }).catch(() => {});
    await beat(page, SECTION_HOLD);
  }
  await beat(page, SECTION_HOLD);

  // ─── 9. Storyboard ───────────────────────────────────────────────────
  console.log('[tour] navigating to Storyboard…');
  await gotoChannelPanel(page, channelId, 'storyboard', /\/storyboard(\/|$)/);
  await beat(page, SECTION_HOLD);
  const firstBeat = page.locator('[class*="beat"], [class*="card"]').first();
  if (await firstBeat.count()) {
    await firstBeat.click({ trial: false }).catch(() => {});
    await beat(page);
  }
  await beat(page, SECTION_HOLD);

  // ─── 10. Composition ─────────────────────────────────────────────────
  // The timeline assembler. BoardPanel renders the Composition tab when
  // the route is /composition; it may show an episode picker first, so
  // click the first tile defensively to load the timeline.
  console.log('[tour] navigating to Composition…');
  await gotoChannelPanel(page, channelId, 'composition', /\/composition(\/|$)/);
  await beat(page, SECTION_HOLD);
  const firstCompTile = page.locator('[class*="card"], [class*="grid"] button, article').first();
  if (await firstCompTile.count()) {
    await firstCompTile.click({ trial: false }).catch(() => {});
    await beat(page, SECTION_HOLD);
  }
  await beat(page, SECTION_HOLD);

  // ─── 11. Publish ─────────────────────────────────────────────────────
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
