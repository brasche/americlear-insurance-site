# Launch checklist

Items are ordered shortest-first. Everything else on the site is complete and verified.

## 1. Phone number (required before A2P submission)

`src/config.ts` has `PHONE = ''`. The site currently shows `[PHONE NUMBER PENDING]` in the footer, contact page, privacy policy, terms, and SMS terms, and hides call buttons.

1. In GoHighLevel, buy the LC-Phone number you will register for texting.
2. Edit `src/config.ts`: `export const PHONE: string = '(714) 555-0100';` (use the real number in this display format).
3. Commit and push. The site redeploys in about two minutes.
4. Confirm the footer on https://www.americlearinsurance.com shows the number, then submit the A2P brand and campaign. The number on the site must match the number you register.

## 2. Form endpoint (required for the form to deliver)

`PUBLIC_FORM_ENDPOINT` is not set yet, so the form shows a friendly error with the agency email instead of sending. Follow the N8N or GoHighLevel setup in `docs/A2P-REGISTRATION-KIT.md` section 9, then set the Railway variable (this triggers a rebuild automatically):

```bash
railway variable set PUBLIC_FORM_ENDPOINT="<production webhook URL>"
```

Then run the two end-to-end test submissions (both boxes checked, then no boxes checked) and confirm the contacts and tags in GoHighLevel.

## 3. Medicare TPMO counts (when contracted)

`/medicare/` and `/licensing/` currently use the CMS "not contracted yet" wording. Once you are contracted, set `MEDICARE_TPMO = { organizations: X, products: Y }` in `src/config.ts` so the page reads: "We do not offer every plan available in your area. Currently we represent [X] organizations which offer [Y] products in your area. Please contact Medicare.gov, 1-800-MEDICARE, or your local State Health Insurance Program to get information on all of your options."

## 4. Counsel review

Have an attorney review `/privacy-policy/` and `/terms/`. The SMS clauses and the non-sharing clause must stay verbatim; everything else is editable in `src/pages/privacy-policy.astro` and `src/pages/terms.astro`.

## 5. License number

`CA Insurance License #4179217` is shown in the footer and on `/licensing/`. Confirm it matches the CDI record for AmeriClear Insurance Agency LLC (agency license, not an individual producer license).

## 6. Photos (optional)

Two styled slots are reserved. See `public/images/README.md`.

## 7. Analytics (optional)

No third-party scripts load. A commented, env-gated Google Tag Manager slot is in `src/layouts/Base.astro`. If you enable it, update the cookies section of the privacy policy.

## 8. DNS notes (GoDaddy)

`www.americlearinsurance.com` is the canonical address: a `www` CNAME at GoDaddy points to Railway, and GoDaddy's domain forwarding sends the bare `americlearinsurance.com` to `https://www.americlearinsurance.com` with a 301. Do not delete the `@` A record GoDaddy manages for forwarding. If you ever move DNS to a provider with CNAME flattening (for example Cloudflare), you can make the bare domain canonical instead; update `DOMAIN` in `src/config.ts`, `site` in `astro.config.mjs`, `public/robots.txt`, and the redirect in `Caddyfile.template`.
