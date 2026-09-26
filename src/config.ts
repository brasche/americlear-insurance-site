/**
 * Single source of truth for every business fact rendered on the site.
 * A2P 10DLC reviewers reject submissions when contact details on the website
 * differ from the brand registration, so edit values HERE ONLY.
 */

export const LEGAL_NAME = 'AmeriClear Insurance Agency LLC';
export const BRAND_NAME = 'AmeriClear Insurance Agency';
export const SHORT_NAME = 'AmeriClear';
/** Canonical host. GoDaddy DNS cannot point the bare domain at Railway, so www is canonical and the apex forwards to it. */
export const DOMAIN = 'www.americlearinsurance.com';
export const SITE_URL = `https://${DOMAIN}`;

/**
 * Business phone. Leave as an empty string until the texting number has been
 * purchased in GoHighLevel (LC-Phone). While empty, call buttons and tel:
 * links are not rendered and policy pages show an obvious placeholder.
 * Format for display, e.g. "(714) 555-0100".
 */
export const PHONE: string = '';
export const PHONE_PLACEHOLDER = '[PHONE NUMBER PENDING]';
export const PHONE_DISPLAY = PHONE || PHONE_PLACEHOLDER;
export const PHONE_TEL = PHONE ? `tel:+1${PHONE.replace(/\D/g, '')}` : '';

export const EMAIL = 'info@americlearinsurance.com';

export const ADDRESS = {
  street: '3200 Park Center Dr',
  city: 'Costa Mesa',
  state: 'CA',
  zip: '92626',
};
export const ADDRESS_LINE = `${ADDRESS.street}, ${ADDRESS.city}, ${ADDRESS.state} ${ADDRESS.zip}`;

export const LICENSE_LINE = 'CA Insurance License #4179217';
export const STATES = 'Licensed in California. Additional states available on request.';
export const HOURS = 'Mon–Fri 8:00 AM – 6:00 PM PT';
/** schema.org openingHours format */
export const HOURS_SCHEMA = 'Mo-Fr 08:00-18:00';
export const FOUNDED_LINE = '';

/** Products offered. Removing one here removes it from nav, grid, and form. */
export const PRODUCTS = [
  {
    slug: 'life-insurance',
    name: 'Life Insurance',
    short: 'Term, whole life, and indexed universal life options for protecting the people who depend on you.',
  },
  {
    slug: 'final-expense',
    name: 'Final Expense',
    short: 'Smaller, simplified-issue policies designed to cover funeral and end-of-life costs.',
  },
  {
    slug: 'medicare',
    name: 'Medicare',
    short: 'Plain-English help comparing Medicare Advantage, Supplement, and Part D options.',
  },
  {
    slug: 'annuities',
    name: 'Annuities',
    short: 'Fixed and fixed-indexed annuities for people who want predictable retirement income.',
  },
];

/** CMS TPMO status: 'not contracted yet' OR { organizations: X, products: Y } */
export type TpmoStatus = 'not contracted yet' | { organizations: number; products: number };
export const MEDICARE_TPMO: TpmoStatus = 'not contracted yet';

/** Exact phrases reused in checkboxes, SMS terms, privacy policy, and the campaign description. */
export const NONMARKETING_USE_CASE =
  'quote requests, appointment reminders, application and policy updates, and customer service';
export const MARKETING_MSG_TYPES = 'our insurance products, promotions, and service updates';

/** Exact checkbox label text (Section 2.1). Do not edit wording. */
export const CONSENT_MARKETING_TEXT = `I consent to receive marketing text messages about ${MARKETING_MSG_TYPES} from ${LEGAL_NAME} at the phone number provided. Message frequency may vary. Message & data rates may apply. Text HELP for assistance, reply STOP to opt out.`;
export const CONSENT_NONMARKETING_TEXT = `I consent to receive non-marketing text messages from ${LEGAL_NAME} about ${NONMARKETING_USE_CASE}. Message frequency may vary, message & data rates may apply. Text HELP for assistance, reply STOP to opt out.`;

/** Privacy Policy non-sharing clause (Appendix A.1) — verbatim, do not edit. */
export const NON_SHARING_CLAUSE =
  'No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. Information sharing to subcontractors in support services, such as customer service, is permitted. All other use case categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.';

/** Site-wide footer disclaimer (Appendix A.4). */
export const FOOTER_DISCLAIMER =
  'Not affiliated with the U.S. government or the federal Medicare program. Insurance products are offered through licensed insurance carriers; product availability varies by state. Coverage is subject to underwriting approval. Nothing on this site is tax or legal advice.';

/** CMS TPMO disclaimer (Appendix A.3). */
function tpmoText(status: TpmoStatus): string {
  if (status === 'not contracted yet') {
    return 'We do not offer every plan available in your area. Any information we provide is limited to those plans we do offer in your area. Please contact Medicare.gov or 1-800-MEDICARE to get information on all of your options.';
  }
  return `We do not offer every plan available in your area. Currently we represent ${status.organizations} organizations which offer ${status.products} products in your area. Please contact Medicare.gov, 1-800-MEDICARE, or your local State Health Insurance Program to get information on all of your options.`;
}
export const TPMO_DISCLAIMER = tpmoText(MEDICARE_TPMO);

export const FORM_VERSION = '2026-09-26';
export const POLICY_EFFECTIVE_DATE = 'September 26, 2026';

/** Form endpoint: injected at build time from PUBLIC_FORM_ENDPOINT (.env locally, GitHub secret in CI). */
export const FORM_ENDPOINT: string = import.meta.env.PUBLIC_FORM_ENDPOINT ?? '';

export const NAV = [
  ...PRODUCTS.map((p) => ({ href: `/${p.slug}/`, label: p.name })),
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
];
