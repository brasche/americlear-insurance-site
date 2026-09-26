# AmeriClear Insurance Agency website

Marketing website for AmeriClear Insurance Agency LLC, built to pass A2P 10DLC brand and campaign review (Twilio / TCR / GoHighLevel LC-Phone). Static site: Astro + Tailwind CSS, deployed on Railway at https://americlearinsurance.com.

## Run locally

```bash
npm install
cp .env.example .env      # optional: set PUBLIC_FORM_ENDPOINT for local form testing
npm run dev               # http://localhost:4321
```

## Quality gates

```bash
npm run build             # static build to dist/
npm run check             # Astro + TypeScript check
npm run a2p-check         # compliance assertions against dist/ (fails on any violation)
npm run a2p-check -- --url https://americlearinsurance.com --report docs/COMPLIANCE-REPORT.md
npm run preview           # then, in another terminal:
npm run smoke -- --base http://localhost:4321
npm run screenshots -- --base http://localhost:4321
```

## Edit business facts

Everything reviewers compare against the brand registration lives in one file: `src/config.ts`. Legal name, brand name, phone, email, address, license line, hours, products, the Medicare TPMO status, and the exact SMS consent phrases are all defined there and rendered everywhere from that file.

- **Phone:** set `PHONE` to the display format, e.g. `(714) 555-0100`. Until it is set, call buttons and tel: links are hidden and policy pages show `[PHONE NUMBER PENDING]`.
- **Medicare TPMO counts:** change `MEDICARE_TPMO` from `'not contracted yet'` to `{ organizations: X, products: Y }` once contracted.
- **Products:** remove an entry from `PRODUCTS` and delete its page in `src/pages/` to drop a product line.

Do not edit the consent, non-sharing, or SMS terms wording. Those strings are required verbatim by carriers.

## Change the form endpoint

Submissions POST JSON to `PUBLIC_FORM_ENDPOINT`. It is injected at build time.

- Locally: put it in `.env` (git-ignored).
- In production: set the Railway service variable and redeploy (Railway rebuilds automatically when a variable changes).

```bash
railway variable set PUBLIC_FORM_ENDPOINT="https://your-n8n-host/webhook/americlear-quote"
```

Or in the Railway dashboard: service → Variables → New Variable.

See `docs/A2P-REGISTRATION-KIT.md` for the payload fields and the GoHighLevel tagging logic.

## Add a photo

See `public/images/README.md`. Two styled slots are reserved (home hero, about page).

## How deploys work

The Railway service is connected to this GitHub repo. Every push to `main` triggers a Railway build using `railway.json`: `npm run build && npm run a2p-check` (a failing compliance check blocks the deploy). Railway's builder detects the Astro static output and serves `dist/` with Caddy using `Caddyfile.template` (branded 404 page, www → apex redirect, security headers). You can also deploy the working directory directly with `railway up`.

The custom domain is configured in Railway (service → Settings → Networking → Custom Domain) and DNS lives at Cloudflare.

## Structure

```
src/config.ts              single source of truth for business facts and compliance strings
src/layouts/Base.astro     head, SEO, skip link, header/footer, GTM slot (disabled)
src/components/            Header, Footer, Logo, Icon, QuoteForm, SmsTerms, Disclaimer, ...
src/pages/                 one file per route
scripts/a2p-check.mjs      compliance assertions (Appendix C)
scripts/smoke.mjs          Playwright smoke test
scripts/screenshots.mjs    form screenshots for the registration kit
scripts/icons.mjs          generates favicons and OG image from the SVG wordmark
railway.json               Railway build/deploy config (build + compliance gate)
Caddyfile.template         static server config used by Railway
docs/                      registration kit, launch checklist, compliance report, screenshots
```
