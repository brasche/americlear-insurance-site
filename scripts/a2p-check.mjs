/**
 * A2P 10DLC compliance check (Appendix C).
 *   node scripts/a2p-check.mjs                 -> checks dist/
 *   node scripts/a2p-check.mjs --url https://x  -> fetches live pages
 *   --report docs/COMPLIANCE-REPORT.md          -> also writes a markdown report
 * Exits non-zero on any FAIL.
 */
import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';

// ---- config (read from src/config.ts without executing Astro) ----
const cfgSrc = await readFile(path.resolve('src/config.ts'), 'utf8');
const str = (name) => {
  const m = cfgSrc.match(new RegExp(`export const ${name}(?:\\s*:\\s*[A-Za-z]+)?\\s*=\\s*\\n?\\s*'((?:[^'\\\\]|\\\\.)*)'`));
  if (!m) throw new Error(`config value ${name} not found`);
  return m[1].replace(/\\'/g, "'");
};
const LEGAL_NAME = str('LEGAL_NAME');
const DOMAIN = str('DOMAIN');
const PHONE = str('PHONE');
const EMAIL = str('EMAIL');
const LICENSE_LINE = str('LICENSE_LINE');
const NON_SHARING = str('NON_SHARING_CLAUSE');
const NONMARKETING = str('NONMARKETING_USE_CASE');
const MARKETING = str('MARKETING_MSG_TYPES');
const addr = Object.fromEntries([...cfgSrc.matchAll(/(street|city|state|zip):\s*'([^']*)'/g)].map((m) => [m[1], m[2]]));
const ADDRESS_PARTS = [addr.street, addr.city, addr.zip];
const TPMO_NOT_CONTRACTED = 'We do not offer every plan available in your area. Any information we provide is limited to those plans we do offer in your area. Please contact Medicare.gov or 1-800-MEDICARE to get information on all of your options.';
const TPMO_COUNTS_START = 'We do not offer every plan available in your area. Currently we represent';
const tpmoIsCounts = !/MEDICARE_TPMO\s*:\s*TpmoStatus\s*=\s*\n?\s*'not contracted yet'/.test(cfgSrc);

const CONSENT_MARKETING = `I consent to receive marketing text messages about ${MARKETING} from ${LEGAL_NAME} at the phone number provided. Message frequency may vary. Message & data rates may apply. Text HELP for assistance, reply STOP to opt out.`;
const CONSENT_NONMARKETING = `I consent to receive non-marketing text messages from ${LEGAL_NAME} about ${NONMARKETING}. Message frequency may vary, message & data rates may apply. Text HELP for assistance, reply STOP to opt out.`;
const FOOTER_DISCLAIMER_FIRST = 'Not affiliated with the U.S. government or the federal Medicare program.';
const FORBIDDEN = ['lead', 'leads', 'lead generation', 'buy leads', 'sell leads', 'affiliated companies', 'marketing partners', 'third-party marketers', 'partner offers', 'affiliates'];

// ---- args ----
const args = process.argv.slice(2);
const urlIdx = args.indexOf('--url');
const BASE = urlIdx >= 0 ? args[urlIdx + 1].replace(/\/$/, '') : null;
const repIdx = args.indexOf('--report');
const REPORT = repIdx >= 0 ? args[repIdx + 1] : null;
const DIST = path.resolve('dist');

const norm = (s) => s.replace(/\s+/g, ' ').trim();
const results = [];
const warnings = [];
const ok = (name, where) => results.push({ name, status: 'PASS', where });
const fail = (name, where) => results.push({ name, status: 'FAIL', where });
const warn = (name, where) => warnings.push({ name, where });

// ---- page loading ----
async function listDistPages() {
  const pages = [];
  async function walk(dir, rel) {
    for (const e of await readdir(dir)) {
      const p = path.join(dir, e);
      const r = rel + '/' + e;
      if ((await stat(p)).isDirectory()) await walk(p, r);
      else if (e === 'index.html') pages.push(rel === '' ? '/' : rel + '/');
      else if (e === '404.html') pages.push('/404.html');
    }
  }
  await walk(DIST, '');
  return pages.sort();
}

async function load(route) {
  if (BASE) {
    const res = await fetch(BASE + route, { redirect: 'follow' });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${route}`);
    return await res.text();
  }
  const file = route === '/404.html' ? path.join(DIST, '404.html') : path.join(DIST, route, 'index.html');
  return await readFile(file, 'utf8');
}

async function loadText(route) {
  if (BASE) {
    const res = await fetch(BASE + route);
    return res.ok ? await res.text() : null;
  }
  try {
    return await readFile(path.join(DIST, route), 'utf8');
  } catch {
    return null;
  }
}

const routes = BASE
  ? ['/', '/life-insurance/', '/final-expense/', '/medicare/', '/annuities/', '/about/', '/quote/', '/contact/', '/privacy-policy/', '/terms/', '/sms-terms/', '/licensing/', '/404.html']
  : await listDistPages();

const docs = new Map();
for (const r of routes) {
  try {
    const html = await load(r);
    docs.set(r, { html, $: cheerio.load(html), text: norm(cheerio.load(html)('body').text()) });
  } catch (e) {
    fail(`load ${r}`, e.message);
  }
}
const has = (r) => docs.has(r);
const T = (r) => docs.get(r).text;

// ---- 1. Privacy policy ----
if (has('/privacy-policy/')) {
  const t = T('/privacy-policy/');
  const $ = docs.get('/privacy-policy/').$;
  const smsSection = $('h2').filter((_, el) => /SMS\s*\/\s*Text Messaging/i.test($(el).text())).length > 0;
  (smsSection ? ok : fail)('privacy: "SMS / Text Messaging" section heading', '/privacy-policy/ h2');
  (t.includes(norm(NON_SHARING)) ? ok : fail)('privacy: A.1 non-sharing clause verbatim', '/privacy-policy/');
  (/message frequency/i.test(t) ? ok : fail)('privacy: "message frequency"', '/privacy-policy/');
  (/message (&|and) data rates/i.test(t) ? ok : fail)('privacy: "message & data rates"', '/privacy-policy/');
  (/\bSTOP\b/.test(t) ? ok : fail)('privacy: STOP', '/privacy-policy/');
  (/\bHELP\b/.test(t) ? ok : fail)('privacy: HELP', '/privacy-policy/');
  (t.includes(NONMARKETING) && t.includes(MARKETING) ? ok : fail)('privacy: both use-case phrases match checkboxes', '/privacy-policy/');
} else fail('privacy: page exists', '/privacy-policy/');

// ---- 2. Terms and SMS terms ----
for (const r of ['/terms/', '/sms-terms/']) {
  if (!has(r)) {
    fail(`${r} exists`, r);
    continue;
  }
  const t = T(r);
  const checks = {
    'identity clause': `${LEGAL_NAME} ("we", "us") offers a text messaging program`,
    'opt-out clause': 'Just text "STOP" to',
    'carrier clause': 'Carriers are not liable for delayed or undelivered messages',
    'frequency clause': 'you will receive no more than',
    'privacy URL': `https://${DOMAIN}/privacy-policy/`,
    'not a condition': 'not a condition of purchasing',
    'HELP keyword': 'reply with the keyword HELP',
    LEGAL_NAME: LEGAL_NAME,
    EMAIL: EMAIL,
  };
  for (const [name, needle] of Object.entries(checks)) (t.includes(needle) ? ok : fail)(`${r}: ${name}`, r);
  // order check
  const order = ['offers a text messaging program', 'Just text "STOP"', 'Carriers are not liable', 'you will receive no more than', `https://${DOMAIN}/privacy-policy/`, 'not a condition of purchasing'];
  let last = -1, inOrder = true;
  for (const o of order) {
    const i = t.indexOf(o);
    if (i < last) inOrder = false;
    last = i;
  }
  (inOrder ? ok : fail)(`${r}: A.2 clauses in required order`, r);
}

// ---- 3. Forms ----
for (const [r, { $ }] of docs) {
  const forms = $('form');
  if (!forms.length) continue;
  forms.each((_, f) => {
    const $f = $(f);
    const cbs = $f.find('input[type=checkbox]');
    const consentCbs = cbs.filter((_, cb) => {
      const id = $(cb).attr('id');
      return /^I consent to receive/.test(norm($f.find(`label[for="${id}"]`).text()));
    });
    (consentCbs.length === 2 && cbs.length === 2 ? ok : fail)(`${r} form: exactly two consent checkboxes`, `found ${consentCbs.length} consent / ${cbs.length} total`);
    let anyChecked = false, anyRequired = false, labelsOk = true, legalInBoth = true;
    const labels = [];
    consentCbs.each((_, cb) => {
      if ($(cb).attr('checked') !== undefined) anyChecked = true;
      if ($(cb).attr('required') !== undefined) anyRequired = true;
      const lbl = norm($f.find(`label[for="${$(cb).attr('id')}"]`).text());
      labels.push(lbl);
      if (!lbl.includes(LEGAL_NAME)) legalInBoth = false;
    });
    if (!(labels.includes(norm(CONSENT_MARKETING)) && labels.includes(norm(CONSENT_NONMARKETING)))) labelsOk = false;
    (!anyChecked ? ok : fail)(`${r} form: no checkbox pre-checked`, r);
    (!anyRequired ? ok : fail)(`${r} form: no checkbox required`, r);
    (legalInBoth ? ok : fail)(`${r} form: LEGAL_NAME in both labels`, r);
    (labelsOk ? ok : fail)(`${r} form: label texts match Section 2.1 exactly`, labels.join(' || '));
    const hrefs = new Set($f.find('a[href]').map((_, a) => $(a).attr('href')).get().map((h) => h.replace(/^https?:\/\/[^/]+/, '')));
    for (const p of ['/privacy-policy/', '/terms/', '/sms-terms/']) (hrefs.has(p) ? ok : fail)(`${r} form: link to ${p} inside form`, r);
    ($f.find('input[type=tel]').length ? ok : fail)(`${r} form: tel input`, r);
    (norm($f.text()).includes('Consent to receive text messages is not a condition of purchase') ? ok : fail)(`${r} form: "not a condition of purchase" line`, r);
    // links must come after the submit button
    const html = $f.html();
    const btnIdx = html.indexOf('type="submit"');
    const linkIdx = html.indexOf('/privacy-policy/');
    (btnIdx >= 0 && linkIdx > btnIdx ? ok : fail)(`${r} form: policy links beneath submit button`, r);
  });
}
(has('/quote/') && docs.get('/quote/').$('form').length ? ok : fail)('/quote/ has the opt-in form', '/quote/');

// ---- 4. Footer on every page ----
for (const [r, { $ }] of docs) {
  const footer = $('footer');
  const ft = norm(footer.text());
  const fh = footer.html() || '';
  const missing = [];
  if (!ft.includes(LEGAL_NAME)) missing.push('LEGAL_NAME');
  if (!ft.includes(EMAIL)) missing.push('EMAIL');
  for (const p of ADDRESS_PARTS) if (!ft.includes(p)) missing.push(`ADDRESS(${p})`);
  if (!ft.includes(LICENSE_LINE)) missing.push('LICENSE_LINE');
  if (!ft.includes(FOOTER_DISCLAIMER_FIRST)) missing.push('A.4 disclaimer');
  for (const p of ['/privacy-policy/', '/terms/', '/sms-terms/', '/licensing/']) if (!fh.includes(`href="${p}"`)) missing.push(`link ${p}`);
  if (!fh.includes(`mailto:${EMAIL}`)) missing.push('mailto link');
  if (PHONE) {
    if (!ft.includes(PHONE)) missing.push('PHONE');
    if (!fh.includes('href="tel:')) missing.push('tel link');
  }
  (missing.length === 0 ? ok : fail)(`${r} footer: required contact/legal elements`, missing.join(', ') || r);
  if (!PHONE) warn(`${r} footer: PHONE not set (shows placeholder)`, r);
}

// ---- 5. Forbidden words ----
const nonSharingNorm = norm(NON_SHARING);
for (const [r, d] of docs) {
  const t = d.text.split(nonSharingNorm).join(' ');
  const hits = FORBIDDEN.filter((w) => new RegExp(`\\b${w.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i').test(t));
  (hits.length === 0 ? ok : fail)(`${r}: no forbidden words`, hits.join(', ') || r);
}

// ---- 6. Medicare TPMO ----
if (has('/medicare/')) {
  const t = T('/medicare/');
  const present = tpmoIsCounts ? t.includes(TPMO_COUNTS_START) : t.includes(TPMO_NOT_CONTRACTED);
  (present ? ok : fail)('/medicare/: CMS TPMO disclaimer (A.3)', '/medicare/');
  if (!tpmoIsCounts) warn('/medicare/: TPMO uses "not contracted yet" wording; switch to counts once contracted', '/medicare/');
}

// ---- 7. Placeholder text ----
for (const [r, d] of docs) {
  const t = d.text;
  const bad = ['coming soon', 'lorem'].filter((w) => t.toLowerCase().includes(w));
  (bad.length === 0 ? ok : fail)(`${r}: no "coming soon"/"lorem"`, bad.join(', ') || r);
  const markers = t.match(/\[[A-Z][A-Z ]+(PLACEHOLDER|PENDING)[A-Z ]*\]/g) || [];
  const plain = /placeholder/i.test(t.replace(/\[[^\]]*\]/g, ''));
  (!plain ? ok : fail)(`${r}: no stray "placeholder" text`, r);
  for (const m of new Set(markers)) warn(`${r}: intentional marker ${m}`, r);
}

// ---- 8. Links, sitemap, robots, CNAME ----
const known = new Set(routes.filter((r) => r !== '/404.html'));
const broken = [];
for (const [r, { $ }] of docs) {
  $('a[href]').each((_, a) => {
    let h = $(a).attr('href');
    if (!h || h.startsWith('#') || h.startsWith('mailto:') || h.startsWith('tel:')) return;
    if (/^https?:\/\//.test(h)) {
      if (!h.startsWith(`https://${DOMAIN}`)) return;
      h = h.replace(`https://${DOMAIN}`, '');
    }
    h = h.split('#')[0];
    if (h === '') return;
    if (!h.endsWith('/')) h += '/';
    if (!known.has(h)) broken.push(`${r} -> ${h}`);
  });
}
(broken.length === 0 ? ok : fail)('all internal links resolve', broken.join('; ') || 'ok');
((await loadText('/sitemap-index.xml')) ? ok : fail)('sitemap-index.xml exists', '/sitemap-index.xml');
((await loadText('/robots.txt')) ? ok : fail)('robots.txt exists', '/robots.txt');
const cname = BASE ? null : await loadText('/CNAME');
if (!BASE) ((cname || '').trim() === DOMAIN ? ok : fail)('CNAME equals DOMAIN', cname);

// ---- output ----
const pad = (s, n) => String(s).padEnd(n);
const failures = results.filter((r) => r.status === 'FAIL');
console.log(`\nA2P compliance check — ${BASE ? BASE : 'dist/'}\n`);
console.log(pad('STATUS', 7) + pad('CHECK', 70) + 'WHERE');
for (const r of results) console.log(pad(r.status, 7) + pad(r.name, 70) + (r.status === 'FAIL' ? r.where : ''));
if (warnings.length) {
  console.log('\nWARNINGS (not failures):');
  for (const w of warnings) console.log('  ' + w.name);
}
console.log(`\n${results.length - failures.length} passed, ${failures.length} failed, ${warnings.length} warnings`);

if (REPORT) {
  const lines = [
    `# A2P Compliance Report`,
    ``,
    `Target: \`${BASE ? BASE : 'dist/'}\`  `,
    `Run: ${new Date().toISOString()}  `,
    `Result: **${failures.length === 0 ? 'PASS' : 'FAIL'}** (${results.length - failures.length} passed, ${failures.length} failed, ${warnings.length} warnings)`,
    ``,
    `## Required element locations`,
    ``,
    `| Element | URL |`,
    `|---|---|`,
    `| Opt-in form (two unchecked, optional consent checkboxes) | ${BASE || 'https://' + DOMAIN}/quote/ |`,
    `| Privacy Policy with A.1 non-sharing clause | ${BASE || 'https://' + DOMAIN}/privacy-policy/#sms |`,
    `| Terms & Conditions incl. SMS section | ${BASE || 'https://' + DOMAIN}/terms/#sms-terms |`,
    `| Standalone SMS Terms | ${BASE || 'https://' + DOMAIN}/sms-terms/ |`,
    `| Licensing & Disclosures | ${BASE || 'https://' + DOMAIN}/licensing/ |`,
    `| CMS TPMO disclaimer | ${BASE || 'https://' + DOMAIN}/medicare/ |`,
    `| Footer (legal name, address, email, license, disclaimer, policy links) | every page |`,
    ``,
    `## Checks`,
    ``,
    `| Status | Check | Detail |`,
    `|---|---|---|`,
    ...results.map((r) => `| ${r.status} | ${r.name.replace(/\|/g, '\\|')} | ${r.status === 'FAIL' ? String(r.where).replace(/\|/g, '\\|') : ''} |`),
    ``,
    `## Warnings`,
    ``,
    ...(warnings.length ? warnings.map((w) => `- ${w.name}`) : ['- none']),
    ``,
  ];
  await writeFile(path.resolve(REPORT), lines.join('\n'));
  console.log(`report written to ${REPORT}`);
}

process.exit(failures.length ? 1 : 0);
