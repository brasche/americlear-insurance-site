/**
 * Playwright smoke test against a running server (default http://localhost:4321).
 *   node scripts/smoke.mjs [--base http://localhost:4321]
 * Checks: every route 200, no console errors, consent checkboxes unchecked and
 * not required, form submits with zero boxes checked (endpoint mocked), nav toggle works.
 */
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const bi = args.indexOf('--base');
const BASE = (bi >= 0 ? args[bi + 1] : 'http://localhost:4321').replace(/\/$/, '');
const ROUTES = ['/', '/life-insurance/', '/final-expense/', '/medicare/', '/annuities/', '/about/', '/quote/', '/contact/', '/privacy-policy/', '/terms/', '/sms-terms/', '/licensing/'];

const results = [];
const check = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const consoleErrors = [];
page.on('console', (m) => {
  // The deliberate 404 probe below logs a resource error by design; ignore it.
  if (m.type() === 'error' && !page.url().includes('this-page-does-not-exist')) consoleErrors.push(`${page.url()}: ${m.text()}`);
});
page.on('pageerror', (e) => consoleErrors.push(`${page.url()}: ${e.message}`));

for (const r of ROUTES) {
  const res = await page.goto(BASE + r, { waitUntil: 'load' });
  check(`GET ${r} -> 200`, res?.status() === 200, String(res?.status()));
}
const res404 = await page.goto(BASE + '/this-page-does-not-exist/', { waitUntil: 'load' });
check('unknown route -> 404 status', res404?.status() === 404, String(res404?.status()));
if (!(await page.textContent('body'))?.includes("couldn't find")) console.log('NOTE  branded 404 page not served for unknown routes (host serves a plain 404)');

// Form behaviour on /quote/
await page.goto(BASE + '/quote/', { waitUntil: 'load' });
const cbs = page.locator('form[data-quote-form] input[type=checkbox]');
check('two consent checkboxes', (await cbs.count()) === 2, String(await cbs.count()));
for (let i = 0; i < (await cbs.count()); i++) {
  const cb = cbs.nth(i);
  check(`checkbox ${i + 1} unchecked by default`, !(await cb.isChecked()));
  check(`checkbox ${i + 1} not required`, (await cb.getAttribute('required')) === null);
}

// Mock the endpoint and submit with no boxes checked
let captured = null;
await page.route('**/__mock-endpoint__', async (route) => {
  captured = JSON.parse(route.request().postData() || '{}');
  await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
});
await page.evaluate(() => {
  const f = document.querySelector('form[data-quote-form]');
  f.dataset.endpoint = window.location.origin + '/__mock-endpoint__';
});
await page.fill('#quote-form-first', 'Test');
await page.fill('#quote-form-last', 'Person');
await page.fill('#quote-form-email', 'test@example.com');
await page.fill('#quote-form-phone', '714-555-0123');
await page.click('form[data-quote-form] [data-submit]');
await page.waitForTimeout(800);
const successVisible = await page.locator('[data-success]').isVisible();
check('form submits with zero boxes checked and shows thank-you', successVisible && captured !== null, captured ? 'payload captured' : 'no payload');
if (captured) {
  check('payload phone normalized to E.164', captured.phone === '+17145550123', captured.phone);
  check('payload consent flags false', captured.consent_marketing === false && captured.consent_nonmarketing === false);
  check('payload has proof-of-consent fields', ['consent_text_marketing', 'consent_text_nonmarketing', 'consent_timestamp', 'page_url', 'user_agent', 'form_version'].every((k) => typeof captured[k] === 'string' && captured[k].length > 0));
}

// Mobile nav toggle
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const mpage = await mctx.newPage();
await mpage.goto(BASE + '/', { waitUntil: 'load' });
const toggle = mpage.locator('#nav-toggle');
check('mobile nav toggle visible at 390px', await toggle.isVisible());
await toggle.click();
check('mobile nav opens with aria-expanded=true', (await toggle.getAttribute('aria-expanded')) === 'true' && (await mpage.locator('#mobile-nav').isVisible()));
const hasHScroll = await mpage.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
check('no horizontal scroll at 390px', !hasHScroll);
await mpage.goto(BASE + '/quote/', { waitUntil: 'load' });
const hasHScrollQuote = await mpage.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
check('quote form: no horizontal scroll at 390px', !hasHScrollQuote);
await mctx.close();

// Chat widget must never share a page with a phone-collecting form.
for (const r of ROUTES) {
  await page.goto(BASE + r, { waitUntil: 'load' });
  const both = await page.evaluate(() => !!document.querySelector('script[data-lc-chat-widget]') && !!document.querySelector('form input[type=tel]'));
  if (both) check(`${r}: chat widget and phone form on same page`, false);
}
check('no page has both chat widget and phone form', results.every((r) => !r.name.includes('chat widget and phone form') || r.pass));

check('no console errors across routes', consoleErrors.length === 0, consoleErrors.slice(0, 5).join(' | '));

await browser.close();
const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length} passed, ${failed.length} failed`);
process.exit(failed.length ? 1 : 0);
