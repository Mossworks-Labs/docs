// One-off: capture every screen in the Claude design prototype as a PNG
// for the public mobile docs. Renders /docs/mobile-prototype/ via a local
// HTTP server, navigates each hash route in headless chromium, and saves
// the cropped phone-screen region.
//
// Usage:
//   cd docs
//   node mobile-screenshots.mjs
//
// Output: docs/public/screenshots/mobile/<id>.png  (one PNG per screen)
//
// The list of screens mirrors the SCREENS registry inside
// "CRAFT Mobile Prototype.html". If new screens are added there, add them
// to SCREENS below too.

import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROTOTYPE_DIR = join(__dirname, 'mobile-prototype');
const OUT_DIR = join(__dirname, 'public', 'screenshots', 'mobile');
const PORT = 8765;
const URL_BASE = `http://127.0.0.1:${PORT}/CRAFT%20Mobile%20Prototype.html`;

const SCREENS = [
  'login', 'home', 'discover', 'channel-deep', 'video-deep',
  'ideas', 'idea-detail',
  'scripts', 'script-edit', 'episodes', 'episode-detail', 'audio-create',
  'resources', 'proposals', 'jobs',
  'more', 'settings', 'endpoints',
];

mkdirSync(OUT_DIR, { recursive: true });

// Spawn a tiny static server. Python's http.server is fine for one-shot use.
const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], {
  cwd: PROTOTYPE_DIR,
  stdio: ['ignore', 'ignore', 'ignore'],
});

const cleanup = () => { try { server.kill(); } catch { /* ignore */ } };
process.on('exit', cleanup);
process.on('SIGINT', () => { cleanup(); process.exit(130); });

// Wait for the server to start serving.
await new Promise((resolve) => setTimeout(resolve, 500));

const browser = await chromium.launch({ headless: true });
try {
  // The prototype hides the desktop nav rail at viewport widths <= 900px and
  // shows it above. Use a wide viewport so the side rail renders for context;
  // we screenshot only the phone-screen element so the rail isn't included.
  const page = await browser.newPage({ viewport: { width: 1100, height: 1000 } });

  for (const id of SCREENS) {
    const url = `${URL_BASE}#${id}`;
    await page.goto(url, { waitUntil: 'networkidle' });
    // Allow Babel to compile + React to mount + the screen to render.
    await page.waitForSelector('#phoneScreen', { state: 'visible' });
    await page.waitForTimeout(700);

    const phone = await page.$('#phoneScreen');
    if (!phone) {
      console.error(`[skip] ${id} — phone screen not found`);
      continue;
    }
    const out = join(OUT_DIR, `${id}.png`);
    await phone.screenshot({ path: out });
    console.log(`[ok] ${id} → ${out.replace(__dirname + '/', '')}`);
  }
} finally {
  await browser.close();
  cleanup();
}
