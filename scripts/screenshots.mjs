/**
 * Full-page screenshots of the opt-in form for the A2P registration kit.
 *   node scripts/screenshots.mjs [--base http://localhost:4321]
 * Writes docs/screenshots/optin-form-desktop.png (1440) and optin-form-mobile.png (390).
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const args = process.argv.slice(2);
const bi = args.indexOf('--base');
const BASE = (bi >= 0 ? args[bi + 1] : 'http://localhost:4321').replace(/\/$/, '');
await mkdir('docs/screenshots', { recursive: true });

const browser = await chromium.launch();
for (const [name, width, height] of [
  ['optin-form-desktop', 1440, 900],
  ['optin-form-mobile', 390, 844],
]) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(BASE + '/quote/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: `docs/screenshots/${name}.png`, fullPage: true });
  console.log(`wrote docs/screenshots/${name}.png (${width}px)`);
  await ctx.close();
}
await browser.close();
