# AmeriClear Insurance Agency website

Marketing website for AmeriClear Insurance Agency LLC, built to pass A2P 10DLC brand and campaign review (Twilio / TCR / GoHighLevel LC-Phone). Static site: Astro + Tailwind CSS, deployed on Railway at https://www.americlearinsurance.com.

## Run locally

```bash
npm install
cp .env.example .env      # optional: set PUBLIC_FORM_ENDPOINT for local form testing
npm run dev               # http://localhost:4321
```

## Quality gates

```bash
npm run build             # static build to dist/ + compliance check (fails on any violation)
npm run check             # Astro + TypeScript check
npm run a2p-check         # compliance assertions against dist/ only
npm run a2p-check -- --url https://www.americlearinsurance.com --report docs/COMPLIANCE-REPORT.md
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

## Chat widget

Set the Railway variable `PUBLIC_LC_WIDGET_ID` to the GoHighLevel chat widget ID (`data-widget-id` from Sites → Chat Widget → Get Code). The widget then loads on every page except `/quote/` and `/contact/`. Never add the quote form to a page that loads the widget, and never pass `chatWidget` as true on a page with the form: GoHighLevel's compliance review rejects pages that have both, and the build's compliance check enforces it.

## Add a photo

See `public/images/README.md`. Two styled slots are reserved (home hero, about page).

## How deploys work

The site runs on Railway (project `americlear-insurance-site`, service of the same name). `npm run build` runs `astro build` and then the compliance check, so a failing check fails the build and blocks the deploy on any host. Railway's builder (Railpack) detects the Astro static output and serves `dist/` with Caddy using `Caddyfile.template` (branded 404 page, www → apex redirect, security headers).

Deploy from this folder with `railway up` (the folder is linked to the project). If the Railway service is connected to the GitHub repo (service → Settings → Source), every push to `main` also deploys automatically.

The custom domain `www.americlearinsurance.com` is configured in Railway (service → Settings → Networking → Custom Domain). DNS is at GoDaddy: a `www` CNAME to Railway plus domain forwarding from the bare domain to `https://www.americlearinsurance.com`.

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
Caddyfile.template         static server config used by Railway (Railpack)
docs/                      registration kit, launch checklist, compliance report, screenshots
```
