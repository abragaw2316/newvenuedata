# Deliverability — Prospect Engine

Your sending domain `newvenuedata.com` started sending **recently**. The single biggest risk
is torching its reputation with cold volume. This whole engine is built to avoid that:
**it drafts; you send 1:1, by hand, at low volume.** Follow these rules.

## Authentication (one-time — mostly done)
- ✅ SPF, DKIM, DMARC are live on newvenuedata.com (set up via Cloudflare DNS + Zoho).
- Verify before a real send: paste a draft into [mail-tester.com](https://www.mail-tester.com)
  → aim for **9–10/10** (confirms SPF/DKIM/DMARC pass). Re-check monthly.
- Watch [Google Postmaster Tools](https://postmaster.google.com) for domain reputation + spam rate.

## Warm-up + volume (the rules that protect the domain)
- Start at **~10–20 emails/day**, ramp slowly over weeks. Never blast.
- Send **1:1, personalized** (that's what the drafts are). Each should look hand-written
  because it nearly is.
- Mix sending with normal email activity (replies, etc.) — don't only send cold.
- Keep **bounce rate < 3%** and **spam complaints < 0.1%**. If either climbs, stop and fix targeting.

## Hygiene
- Enforce the **suppression list** before every run (the engine does this automatically).
- Remove role/invalid addresses; if an address bounces, log `bounced` → it's suppressed.
- One clear opt-out path; honor opt-outs immediately (log `unsubscribed`).

## Things we deliberately DON'T do (because they hurt deliverability)
- ❌ No open-tracking pixels — they're a spam signal and a privacy issue. Measure **replies /
  trials / wins** instead (see `npm run review`).
- ❌ No link shorteners / redirect domains.
- ❌ No image-heavy or multi-link emails. Plain text, at most one link.
- ❌ No auto-send. No buying lists. No spoofing.

## If you later want to scale to automated volume
Don't automate from newvenuedata.com. Buy a **separate** domain (e.g. a `.com` redirect),
warm it for 3–4 weeks, send through an ESP (Resend/SES) with its own SPF/DKIM, and keep the
primary domain clean for product + 1:1 mail. (Deferred until you have paying customers.)
