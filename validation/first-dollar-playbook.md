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
- **Price to start:** **$149/month** per agent (one county or all of South FL). Anchor:
  one new liquor-liability policy's commission pays for ~a year. Adjust from what you
  heard in the validation calls (`buyer-validation-plan.md`).
- **Term:** month-to-month, cancel anytime. Removes risk; you want the *recurring yes*.

## Take payment with a Stripe Payment Link (no code, ~10 min)
You do **not** need the website's billing built. In the Stripe Dashboard:
1. **Product catalog → Add product** → name "New Venue Data — Weekly South FL Liquor
   Leads", price **$149**, **recurring / monthly**.
2. **Payment Links → New** → select that product → **Create link**. (Optionally turn on
   "collect customer address" and a promo field.)
3. Copy the URL (e.g. `https://buy.stripe.com/xxxx`). Send it to any agent who says yes.
   Stripe emails them receipts and runs the monthly charge automatically.
4. (Later, when the SaaS billing is built, you migrate these to real subscriptions.)

No Stripe account yet? A first invoice via PayPal/Wise/Stripe Invoicing works the same
way for the first customer — the goal is a **real charge**, not perfect billing.

## Weekly delivery SOP (~5 min/week, per agent)
1. `cd data-pipeline && npm run refresh` (or just `npm run leads` if data is current) —
   pulls the latest filings and regenerates the lead JSON/CSV.
2. `python validation/make-xlsx.py` — rebuilds the polished `.xlsx`.
   *(Filter to the agent's county first if they bought one county:*
   `node src/build-lead-list.mjs 50` *then trim, or add a county arg later.)*
3. Email the `.xlsx` to the agent with a one-line note: *"This week's new South-FL
   liquor venues — 25 fresh prospects. Reply if you want me to add a county."*
4. Log the send + any reply in `buyer-validation-plan.md` so you track retention.

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
