# A2P 10DLC Registration Kit — AmeriClear Insurance Agency

Copy-paste values for the brand and campaign registration in GoHighLevel (LC-Phone) / Twilio / TCR. Every value below is rendered from `src/config.ts` and matches the live site.

> **Before you submit:** set the phone number in `src/config.ts` and redeploy (see `docs/LAUNCH-CHECKLIST.md` item 1). The number on the site footer must be the number you register.

## 1. Brand registration values

| Field | Value |
|---|---|
| Legal business name | AmeriClear Insurance Agency LLC |
| DBA / brand name | AmeriClear Insurance Agency |
| Business type | LLC (Private company) |
| EIN | as shown on IRS CP 575 / 147C letter |
| Address | 3200 Park Center Dr, Costa Mesa, CA 92626, US |
| Phone | `[PHONE NUMBER PENDING]` — set in `src/config.ts` first |
| Email | info@americlearinsurance.com |
| Website | https://americlearinsurance.com |
| Vertical | Insurance |
| Company status | Private |

**Reminder:** the EIN, legal name, and address must match the IRS CP 575 / 147C letter exactly (punctuation and suffix included). A mismatch is the most common brand rejection.

## 2. URLs for the campaign form

| Field | URL |
|---|---|
| Privacy Policy | https://americlearinsurance.com/privacy-policy/ |
| Terms & Conditions | https://americlearinsurance.com/terms/ |
| SMS Terms (standalone) | https://americlearinsurance.com/sms-terms/ |
| Opt-in page | https://americlearinsurance.com/quote/ |

## 3. Recommended campaign type

**Mixed** (or **Low Volume Mixed** while under roughly 2,000 messages per day). Consent is collected separately for marketing and non-marketing, so one campaign can carry both use cases.

## 4. Campaign description

```
AmeriClear Insurance Agency LLC is a licensed independent insurance agency. Consumers opt in via an unchecked checkbox on the quote form at https://americlearinsurance.com/quote/ and choose one or both of: (1) non-marketing messages about quote requests, appointment reminders, application and policy updates, and customer service; (2) marketing messages about our insurance products, promotions, and service updates. Every message identifies AmeriClear Insurance Agency and includes opt-out instructions. Privacy Policy: https://americlearinsurance.com/privacy-policy/ Terms: https://americlearinsurance.com/terms/
```

## 5. Message flow / how consumers opt in

```
Consumers opt in on the website quote form at https://americlearinsurance.com/quote/ (also embedded on the home page and /contact/). The form has two separate, unchecked, optional checkboxes: one for non-marketing texts (quote requests, appointment reminders, application and policy updates, and customer service) and one for marketing texts (our insurance products, promotions, and service updates). Each label names AmeriClear Insurance Agency LLC and states that message frequency may vary, message & data rates may apply, text HELP for assistance, reply STOP to opt out. Links to the Privacy Policy, Terms & Conditions, and SMS Terms appear directly beneath the submit button along with the statement "Consent to receive text messages is not a condition of purchase." The form can be submitted with neither box checked. On submission we store the consent selections, the exact consent text shown, an ISO-8601 timestamp, the page URL, and the user agent as proof of consent. See screenshots: docs/screenshots/optin-form-desktop.png and docs/screenshots/optin-form-mobile.png.
```

## 6. Sample messages

Non-marketing (quote follow-up):
```
Hi {{first_name}}, this is {{agent}} with AmeriClear Insurance Agency. Thanks for your quote request — I've got a few options ready. What time works for a quick call today? Reply STOP to opt out.
```

Non-marketing (appointment reminder):
```
AmeriClear Insurance Agency: Reminder of your appointment with {{agent}} on {{date}} at {{time}}. Reply C to confirm or R to reschedule. Reply STOP to opt out, HELP for help.
```

Marketing:
```
AmeriClear Insurance Agency: Open enrollment starts soon — we can review whether your current coverage still fits. Reply YES for a no-cost review. Msg&data rates may apply. Reply STOP to opt out.
```

## 7. Keywords and auto-replies

| Keyword | Auto-reply |
|---|---|
| Opt-in confirmation | `AmeriClear Insurance Agency: You're subscribed to text updates. Msg frequency varies. Msg&data rates may apply. Reply HELP for help, STOP to cancel.` |
| STOP | `AmeriClear Insurance Agency: You've been unsubscribed and will receive no further texts.` |
| HELP | `AmeriClear Insurance Agency: For help call [PHONE NUMBER PENDING] or email info@americlearinsurance.com. Reply STOP to cancel.` |

Replace `[PHONE NUMBER PENDING]` with the registered number.

## 8. Consistency table

| Where | Non-marketing phrase | Marketing phrase | Brand named |
|---|---|---|---|
| Checkbox labels (form) | quote requests, appointment reminders, application and policy updates, and customer service | our insurance products, promotions, and service updates | AmeriClear Insurance Agency LLC |
| Campaign description (above) | quote requests, appointment reminders, application and policy updates, and customer service | our insurance products, promotions, and service updates | AmeriClear Insurance Agency LLC / AmeriClear Insurance Agency |
| Privacy Policy + SMS Terms | quote requests, appointment reminders, application and policy updates, and customer service | our insurance products, promotions, and service updates | AmeriClear Insurance Agency LLC |
| Sample messages | appointment reminder, quote follow-up | enrollment review offer | AmeriClear Insurance Agency |

## 9. Form payload and GoHighLevel workflow notes

The form POSTs flat JSON to `PUBLIC_FORM_ENDPOINT`:

```json
{
  "first_name": "Jane", "last_name": "Doe", "email": "jane@example.com",
  "phone": "+17145550100", "zip": "92626",
  "product_interest": "Medicare", "best_time": "Morning (8–11 AM PT)", "message": "",
  "consent_marketing": true, "consent_nonmarketing": false,
  "consent_text_marketing": "I consent to receive marketing text messages about ...",
  "consent_text_nonmarketing": "I consent to receive non-marketing text messages from ...",
  "consent_timestamp": "2026-09-26T20:00:00.000Z",
  "page_url": "https://americlearinsurance.com/quote/",
  "user_agent": "Mozilla/5.0 ...",
  "form_version": "2026-09-26"
}
```

### Option B (recommended): N8N webhook → GoHighLevel

1. New workflow → add a **Webhook** node: HTTP Method `POST`, Path `americlear-quote`, Respond `Immediately`, Response Code `200`. Under Options, set **Allowed Origins (CORS)** to `https://americlearinsurance.com`.
2. Add a **GoHighLevel** node (or HTTP Request to the LeadConnector API): action Create/Update Contact. Map `first_name`, `last_name`, `email`, `phone`, and put `zip`, `product_interest`, `best_time`, `message`, `consent_timestamp`, `page_url`, `form_version` into custom fields.
3. Add an **IF** node: if `consent_marketing` is true → add tag `sms-marketing-consent`. Add a second IF: if `consent_nonmarketing` is true → add tag `sms-nonmarketing-consent`.
4. If neither flag is true, leave the contact's SMS DND on (do not text them).
5. Activate the workflow and copy the **Production** webhook URL (not the Test URL).
6. Set the secret and redeploy: `gh secret set PUBLIC_FORM_ENDPOINT --repo brasche/americlear-insurance-site --body "<production URL>"` then `gh workflow run deploy.yml --repo brasche/americlear-insurance-site`.

### Option A: GoHighLevel inbound webhook

1. Automation → Workflows → Create Workflow → trigger **Inbound Webhook** → copy the webhook URL.
2. Submit a test lead once so GHL learns the field names, then map them to contact fields.
3. Add **If/Else** steps on `consent_marketing` and `consent_nonmarketing` to add the tags above; leave DND on when neither is true.
4. Publish the workflow and set the secret as in step 6 above.

## 10. Common rejection reasons and how this site addresses each

| Rejection reason | How this site addresses it |
|---|---|
| No privacy policy link on the opt-in form | Privacy Policy, Terms & Conditions, and SMS Terms links are inside the form, directly beneath the submit button |
| Pre-checked consent box | Both checkboxes render unchecked; `scripts/a2p-check.mjs` fails the build if `checked` ever appears |
| Single combined consent | Two separate checkboxes with distinct labels for marketing and non-marketing |
| Consent required to submit | Neither checkbox is `required`; the form submits with zero boxes checked (verified by smoke test) |
| Brand name mismatch | Legal name AmeriClear Insurance Agency LLC appears in both labels, the footer, and all policies; brand name in the logo and messages |
| Missing "message frequency" sentence | Present in both labels, the privacy SMS section, and the SMS terms ("no more than 4 messages per week") |
| Missing carrier liability clause | "Carriers are not liable for delayed or undelivered messages." in /terms/ and /sms-terms/ |
| Contact info mismatch | Phone, email, and address come from one config file and render identically on every page |
| Single-page or "coming soon" site | 12 real content pages plus 404; automated check rejects "coming soon" and "lorem" |
| Mention of selling data or sharing with affiliates | Verbatim non-sharing clause in the privacy policy; forbidden-word check runs on every build |
| Privacy policy missing the mobile non-sharing clause | Appendix A.1 clause verbatim under "SMS / Text Messaging" at /privacy-policy/#sms |
| Missing STOP / HELP instructions | In both labels, the thank-you state, the privacy policy, and the SMS terms |

## 11. Using this kit in GoHighLevel

1. **Settings → Phone Numbers → Trust Center → Business Profile (Brand)**: paste section 1. Upload nothing that contradicts the CP 575.
2. **Register Campaign**: choose Mixed / Low Volume Mixed; paste section 4 as the description, section 5 as the message flow, section 6 as sample messages, section 2 URLs where asked; upload the two screenshots as opt-in proof; answer "yes" to embedded links (policy links), "no" to embedded phone numbers unless your samples include one, "yes" to age-gate = no, "no" to direct lending.
3. **Link the number**: after campaign approval, attach the LC-Phone number to the campaign.
