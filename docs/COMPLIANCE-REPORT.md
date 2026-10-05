# A2P Compliance Report

Target: `https://www.americlearinsurance.com`  
Run: 2026-10-05T22:17:40.161Z  
Result: **PASS** (120 passed, 0 failed, 27 warnings)

## Required element locations

| Element | URL |
|---|---|
| Opt-in form (two unchecked, optional consent checkboxes) | https://www.americlearinsurance.com/quote/ |
| Privacy Policy with A.1 non-sharing clause | https://www.americlearinsurance.com/privacy-policy/#sms |
| Terms & Conditions incl. SMS section | https://www.americlearinsurance.com/terms/#sms-terms |
| Standalone SMS Terms | https://www.americlearinsurance.com/sms-terms/ |
| Licensing & Disclosures | https://www.americlearinsurance.com/licensing/ |
| CMS TPMO disclaimer | https://www.americlearinsurance.com/medicare/ |
| Footer (legal name, address, email, license, disclaimer, policy links) | every page |

## Checks

| Status | Check | Detail |
|---|---|---|
| PASS | privacy: "SMS / Text Messaging" section heading |  |
| PASS | privacy: A.1 non-sharing clause verbatim |  |
| PASS | privacy: "message frequency" |  |
| PASS | privacy: "message & data rates" |  |
| PASS | privacy: STOP |  |
| PASS | privacy: HELP |  |
| PASS | privacy: both use-case phrases match checkboxes |  |
| PASS | /terms/: identity clause |  |
| PASS | /terms/: opt-out clause |  |
| PASS | /terms/: carrier clause |  |
| PASS | /terms/: frequency clause |  |
| PASS | /terms/: privacy URL |  |
| PASS | /terms/: not a condition |  |
| PASS | /terms/: HELP keyword |  |
| PASS | /terms/: LEGAL_NAME |  |
| PASS | /terms/: EMAIL |  |
| PASS | /terms/: A.2 clauses in required order |  |
| PASS | /sms-terms/: identity clause |  |
| PASS | /sms-terms/: opt-out clause |  |
| PASS | /sms-terms/: carrier clause |  |
| PASS | /sms-terms/: frequency clause |  |
| PASS | /sms-terms/: privacy URL |  |
| PASS | /sms-terms/: not a condition |  |
| PASS | /sms-terms/: HELP keyword |  |
| PASS | /sms-terms/: LEGAL_NAME |  |
| PASS | /sms-terms/: EMAIL |  |
| PASS | /sms-terms/: A.2 clauses in required order |  |
| PASS | /quote/ form: exactly two consent checkboxes |  |
| PASS | /quote/ form: no checkbox pre-checked |  |
| PASS | /quote/ form: no checkbox required |  |
| PASS | /quote/ form: LEGAL_NAME in both labels |  |
| PASS | /quote/ form: label texts match Section 2.1 exactly |  |
| PASS | /quote/ form: link to /privacy-policy/ inside form |  |
| PASS | /quote/ form: link to /terms/ inside form |  |
| PASS | /quote/ form: link to /sms-terms/ inside form |  |
| PASS | /quote/ form: tel input |  |
| PASS | /quote/ form: "not a condition of purchase" line |  |
| PASS | /quote/ form: policy links beneath submit button |  |
| PASS | /contact/ form: exactly two consent checkboxes |  |
| PASS | /contact/ form: no checkbox pre-checked |  |
| PASS | /contact/ form: no checkbox required |  |
| PASS | /contact/ form: LEGAL_NAME in both labels |  |
| PASS | /contact/ form: label texts match Section 2.1 exactly |  |
| PASS | /contact/ form: link to /privacy-policy/ inside form |  |
| PASS | /contact/ form: link to /terms/ inside form |  |
| PASS | /contact/ form: link to /sms-terms/ inside form |  |
| PASS | /contact/ form: tel input |  |
| PASS | /contact/ form: "not a condition of purchase" line |  |
| PASS | /contact/ form: policy links beneath submit button |  |
| PASS | /quote/ has the opt-in form |  |
| PASS | /: not both chat widget and phone-collecting form |  |
| PASS | /life-insurance/: not both chat widget and phone-collecting form |  |
| PASS | /final-expense/: not both chat widget and phone-collecting form |  |
| PASS | /medicare/: not both chat widget and phone-collecting form |  |
| PASS | /annuities/: not both chat widget and phone-collecting form |  |
| PASS | /about/: not both chat widget and phone-collecting form |  |
| PASS | /quote/: not both chat widget and phone-collecting form |  |
| PASS | /contact/: not both chat widget and phone-collecting form |  |
| PASS | /privacy-policy/: not both chat widget and phone-collecting form |  |
| PASS | /terms/: not both chat widget and phone-collecting form |  |
| PASS | /sms-terms/: not both chat widget and phone-collecting form |  |
| PASS | /licensing/: not both chat widget and phone-collecting form |  |
| PASS | /404.html: not both chat widget and phone-collecting form |  |
| PASS | /: home page has no phone-collecting form (widget page) |  |
| PASS | / footer: required contact/legal elements |  |
| PASS | /life-insurance/ footer: required contact/legal elements |  |
| PASS | /final-expense/ footer: required contact/legal elements |  |
| PASS | /medicare/ footer: required contact/legal elements |  |
| PASS | /annuities/ footer: required contact/legal elements |  |
| PASS | /about/ footer: required contact/legal elements |  |
| PASS | /quote/ footer: required contact/legal elements |  |
| PASS | /contact/ footer: required contact/legal elements |  |
| PASS | /privacy-policy/ footer: required contact/legal elements |  |
| PASS | /terms/ footer: required contact/legal elements |  |
| PASS | /sms-terms/ footer: required contact/legal elements |  |
| PASS | /licensing/ footer: required contact/legal elements |  |
| PASS | /404.html footer: required contact/legal elements |  |
| PASS | /: no forbidden words |  |
| PASS | /life-insurance/: no forbidden words |  |
| PASS | /final-expense/: no forbidden words |  |
| PASS | /medicare/: no forbidden words |  |
| PASS | /annuities/: no forbidden words |  |
| PASS | /about/: no forbidden words |  |
| PASS | /quote/: no forbidden words |  |
| PASS | /contact/: no forbidden words |  |
| PASS | /privacy-policy/: no forbidden words |  |
| PASS | /terms/: no forbidden words |  |
| PASS | /sms-terms/: no forbidden words |  |
| PASS | /licensing/: no forbidden words |  |
| PASS | /404.html: no forbidden words |  |
| PASS | /medicare/: CMS TPMO disclaimer (A.3) |  |
| PASS | /: no "coming soon"/"lorem" |  |
| PASS | /: no stray "placeholder" text |  |
| PASS | /life-insurance/: no "coming soon"/"lorem" |  |
| PASS | /life-insurance/: no stray "placeholder" text |  |
| PASS | /final-expense/: no "coming soon"/"lorem" |  |
| PASS | /final-expense/: no stray "placeholder" text |  |
| PASS | /medicare/: no "coming soon"/"lorem" |  |
| PASS | /medicare/: no stray "placeholder" text |  |
| PASS | /annuities/: no "coming soon"/"lorem" |  |
| PASS | /annuities/: no stray "placeholder" text |  |
| PASS | /about/: no "coming soon"/"lorem" |  |
| PASS | /about/: no stray "placeholder" text |  |
| PASS | /quote/: no "coming soon"/"lorem" |  |
| PASS | /quote/: no stray "placeholder" text |  |
| PASS | /contact/: no "coming soon"/"lorem" |  |
| PASS | /contact/: no stray "placeholder" text |  |
| PASS | /privacy-policy/: no "coming soon"/"lorem" |  |
| PASS | /privacy-policy/: no stray "placeholder" text |  |
| PASS | /terms/: no "coming soon"/"lorem" |  |
| PASS | /terms/: no stray "placeholder" text |  |
| PASS | /sms-terms/: no "coming soon"/"lorem" |  |
| PASS | /sms-terms/: no stray "placeholder" text |  |
| PASS | /licensing/: no "coming soon"/"lorem" |  |
| PASS | /licensing/: no stray "placeholder" text |  |
| PASS | /404.html: no "coming soon"/"lorem" |  |
| PASS | /404.html: no stray "placeholder" text |  |
| PASS | all internal links resolve |  |
| PASS | sitemap-index.xml exists |  |
| PASS | robots.txt exists |  |

## Warnings

- / footer: PHONE not set (shows placeholder)
- /life-insurance/ footer: PHONE not set (shows placeholder)
- /final-expense/ footer: PHONE not set (shows placeholder)
- /medicare/ footer: PHONE not set (shows placeholder)
- /annuities/ footer: PHONE not set (shows placeholder)
- /about/ footer: PHONE not set (shows placeholder)
- /quote/ footer: PHONE not set (shows placeholder)
- /contact/ footer: PHONE not set (shows placeholder)
- /privacy-policy/ footer: PHONE not set (shows placeholder)
- /terms/ footer: PHONE not set (shows placeholder)
- /sms-terms/ footer: PHONE not set (shows placeholder)
- /licensing/ footer: PHONE not set (shows placeholder)
- /404.html footer: PHONE not set (shows placeholder)
- /medicare/: TPMO uses "not contracted yet" wording; switch to counts once contracted
- /: intentional marker [PHONE NUMBER PENDING]
- /life-insurance/: intentional marker [PHONE NUMBER PENDING]
- /final-expense/: intentional marker [PHONE NUMBER PENDING]
- /medicare/: intentional marker [PHONE NUMBER PENDING]
- /annuities/: intentional marker [PHONE NUMBER PENDING]
- /about/: intentional marker [PHONE NUMBER PENDING]
- /quote/: intentional marker [PHONE NUMBER PENDING]
- /contact/: intentional marker [PHONE NUMBER PENDING]
- /privacy-policy/: intentional marker [PHONE NUMBER PENDING]
- /terms/: intentional marker [PHONE NUMBER PENDING]
- /sms-terms/: intentional marker [PHONE NUMBER PENDING]
- /licensing/: intentional marker [PHONE NUMBER PENDING]
- /404.html: intentional marker [PHONE NUMBER PENDING]
