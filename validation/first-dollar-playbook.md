# First-Dollar Playbook — sell before you build (the #3 concierge path)

> The point of TODO-C is to get a paying customer **before** building the self-serve
> SaaS (accounts, billing, dashboard). This is how you charge the first 1–2 agents
> **this week with zero new product code** — by delivering the lead list by hand.
> Once you have recurring revenue, automating it is a funded decision, not a bet.

## The offer (what you're selling)
A **weekly email** of every brand-new venue licensed to serve alcohol in the agent's
counties — i.e. fresh dram-shop prospects before competitors reach them.

- **Deliverable:** the `south-fl-new-liquor-leads.xlsx` (+ CSV), regenerated weekly.
- **Cadence:** every Monday morning.
- **Price to start:** **$149/month** per agent (one county; $299 for all of South FL).
  Anchors: one exclusive commercial lead elsewhere runs **$75–$175** (this is a whole month
  for ~the price of one), and one liquor-liability policy's commission pays for ~a year.
  **Don't discount the list price** — the market research says you're already cheap vs. what
  agents pay per lead; cutting further signals low value and caps the business.
- **Founding-member lever (use this to close fast, not a price cut):** offer the **first 10
  agents $99/mo locked for life** in exchange for a short testimonial. It's scarce, rewards
  early believers, and earns the testimonials/logos that close everyone after them at full
  price. Lead with the **2-week free trial** to kill risk; use the founding rate on fence-sitters.
- **Term:** month-to-month, cancel anytime. Removes risk; you want the *recurring yes*.

## Take payment — Stripe Payment Links (✅ LIVE, created 2026-06-16)
The product, three recurring prices, and three Payment Links are already set up in Stripe
(live mode), **each with a 14-day free trial built in** (card captured, first charge in 2
weeks). Just send the matching link to anyone who says yes — Stripe emails receipts and runs
the monthly charge automatically:

| Tier | Price | Payment Link |
|---|---|---|
| **Founding member** (first 10, locked for life) | $99/mo | https://buy.stripe.com/14A8wP7VgbTE2gogTtbfO00 |
| **County** (one county) | $149/mo | https://buy.stripe.com/5kQ8wPb7sbTE5sA0UvbfO01 |
| **South Florida** (tri-county) | $299/mo | https://buy.stripe.com/14AfZh8Zk2j47AI46HbfO02 |

Stripe product `prod_UiFvFNRJXAe8fB`. (Later, when the SaaS billing is built, migrate these
to in-app subscriptions.)

## When someone says yes → onboard them (2 minutes)
1. Send the matching **Stripe Payment Link** above (each has the 14-day free trial built in).
2. When Stripe confirms the trial started (you get a Stripe email), send the **welcome email**
   below so they know exactly what to expect — then add them to your Monday list.

### Welcome email (copy-paste — send right after they subscribe)
> **Subject:** You're in — your first New Venue Data list is on the way
>
> Hi {First name} —
>
> Thanks for subscribing — you're all set. Here's what happens next:
>
> • I'll email your first list of brand-new {County} venues (just licensed to serve alcohol —
>   i.e. fresh liquor-liability prospects) within one business day.
> • After that, a fresh batch lands in your inbox every Monday morning.
> • Your 14-day free trial is running now — no charge until it ends, and you can cancel
>   anytime, no contract.
>
> Want me to add a county, focus on bars vs. restaurants, or look into phone numbers? Just
> reply to this email — a real person (me) reads every one.
>
> Austin Bragaw
> New Venue Data · austin@newvenuedata.com · newvenuedata.com

## Weekly delivery SOP (~5 min/week, per agent)
1. **Refresh the live data** so the list is genuinely "this week's":
   `cd data-pipeline && node src/run.mjs --source=abt_retail` (re-pulls the live DBPR liquor
   file). *(`npm run refresh` does this plus every other source — heavier but fine.)*
2. **Build the agent's list** — pass their county if they bought just one:
   `node src/build-lead-list.mjs 25 "Palm Beach"`  *(omit the county for all of South FL).*
3. **Make the polished sheet:** `python ../validation/make-xlsx.py` — the banner now adapts to
   whatever county(ies) are in the list.
4. **Email the `.xlsx`** with a one-liner: *"This week's new {County} liquor venues — {N} fresh
   prospects. Reply if you want another county or phone numbers."*
5. **Log** the send + any reply in `buyer-validation-plan.md` so you track retention.

## Why concierge first (don't skip to building)
- **Proves the recurring yes** — paying once is interest; paying month 2 is a business.
- **Surfaces the real product spec** — what they actually open, forward, complain about
  (e.g. "I need phone numbers" → build `data-pipeline/CONTACT-ENRICHMENT.md`; "split by
  city" → a filter) tells you exactly what the v1 SaaS must do.
- **Zero burn** — no auth/billing/dashboard build until revenue justifies it. The site's
  marketing/docs surface + the live API already do the credibility job.

## Graduation trigger → build the SaaS
When you have **~3+ paying agents** and delivering by hand is the bottleneck, build the
self-serve layer in this order (see `handoff.md` TODO-D / the website roadmap):
real signup/login → Stripe subscriptions in-app → authenticated dashboard wired to the
live API → automated weekly email/CSV delivery → move data to a real DB. The **API-key
auth layer is already built** (`lib/api-auth.ts`), so programmatic/API customers can be
onboarded immediately with `npm run mint-key`.
