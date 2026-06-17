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

## Auto-send (FREE: Resend free tier + a sending subdomain)
`src/send/scheduler.mjs` (`npm run send`) can send for you. It is **safe by default**:
it only sends drafts you **Approved** in the dashboard, warms up, caps daily volume, sends
only in ET business hours, verifies addresses, honors suppression, and **stays in DRY-RUN
until you explicitly enable it.** Follow-ups auto-send only if no reply/outcome is logged.

**One-time setup (free):**
1. **Create a free [Resend](https://resend.com) account** (free tier = 3,000 emails/mo, 100/day).
2. **Add a sending _subdomain_** in Resend — e.g. `send.newvenuedata.com` (NOT the root, so the
   root's reputation stays clean). Resend gives you SPF/DKIM/DMARC records → add them in
   **Cloudflare** (same as the Zoho setup). Wait for Resend to show "Verified".
3. **Create a Resend API key.**
4. Set env vars (PowerShell): `$env:RESEND_API_KEY="re_..."; $env:SEND_FROM_EMAIL="austin@send.newvenuedata.com"`.

**Going live (deliberately two-step so you can't blast by accident):**
- Dry-run first (safe, shows what it *would* send): `npm run send`
- In `/prospects`, **Approve** the step-0 drafts you want sent.
- Then: `$env:SEND_LIVE="1"; npm run send` → it actually sends, throttled + capped.
- Run `npm run send` daily (or schedule it). Warm-up grows the daily cap automatically.

**Env flags:** `RESEND_API_KEY`, `SEND_LIVE=1` (required to actually send), `SEND_FROM_EMAIL`,
`SEND_SKIP_VERIFY=1` (skip MX check if your DNS is restricted), `SEND_IGNORE_WINDOW=1` (ignore
business-hours gate). Tunables (cap, warm-up, delays, window) live in `src/config.mjs` → `SEND`.

> ⚠️ ESP terms (Resend included) discourage pure cold blasting. This stays compliant by being
> low-volume, personalized 1:1, approval-gated, and opt-out-honoring. Keep it that way. For a
> fully isolated setup later, use a separate registered domain (~$10/yr) instead of a subdomain.

> Reply detection is manual (Zoho free has no IMAP): when someone replies, click the outcome in
> `/prospects` → follow-ups stop automatically. (Zoho Mail Lite at $1/mo adds IMAP if you want
> auto reply-detection later.)
