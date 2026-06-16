# Outreach Sequence — copy-paste, ready to send

Goal: land the first paying customers fast. Work the [`prospect-list.csv`](prospect-list.csv)
top-down. Math: ~20 contacts → ~5 conversations → ≥2 yes. Attach the polished
[`south-fl-new-liquor-leads.xlsx`](south-fl-new-liquor-leads.xlsx) to every first email.
Log every touch in `prospect-list.csv` (Contacted / Response columns).

**Before you send:** regenerate a fresh list so it's literally "this week's"
(`cd data-pipeline && npm run leads && python ../validation/make-xlsx.py`). Freshness is
the whole pitch.

---

## SEGMENT A — independent / small agencies (Priority 1–2; fastest yes)

### Email 1 (Day 0)
> **Subject:** 25 brand-new {County} bars that need liquor liability (this month)
>
> Hi {First name} —
>
> I track Florida's public liquor-license filings and turn them into a weekly list of
> venues that *just* got licensed to serve alcohol in {Broward/Miami-Dade/Palm Beach} —
> i.e. businesses that need dram-shop coverage right now, before another agent calls them.
>
> I pulled a free 25-venue sample for you (attached) — all filed in the last two weeks,
> with address and license type. Worth a quick look?
>
> If it's useful, I send a fresh batch every Monday. Could I get 15 minutes this week to
> show you how it works?
>
> {Your name}
> {phone} · newvenuedata.com

### Email 2 — follow-up (Day 3, reply to Email 1)
> Subject: re: 25 brand-new {County} bars…
>
> Hi {First name} — did the sample come through? Three of those venues (e.g.
> {paste a real name from the sheet}) opened in the last 10 days. Happy to set you up with
> {County} on a weekly feed — 2 minutes to start. Want me to send this week's list?

### Email 3 — break-up (Day 7)
> Subject: Should I close this out?
>
> Hi {First name} — I'll stop here so I'm not cluttering your inbox. If chasing
> brand-new venues before they're insured is ever useful, the door's open — just reply
> "leads" and I'll send the current week's South-FL filings. Thanks!

---

## SEGMENT B — wholesale / MGA / program (Priority 3; bigger checks, longer cycle)

### Email 1 (Day 0)
> **Subject:** New-venue trigger data for your FL hospitality book
>
> Hi {First name} —
>
> {RMS/Amwins/etc.} writes a lot of Florida bar & restaurant liquor liability. I supply
> the upstream signal: a daily/weekly feed of every newly-filed FL liquor + food-service
> license — the venues entering your market before they've bought coverage.
>
> Your agents get a prospecting edge; your underwriting gets early-warning on new risks
> in-territory. I've attached a 25-row South-FL sample. Could we find 20 minutes to talk
> about a feed/API for your network (by county or statewide)?
>
> {Your name} · newvenuedata.com

### Follow-up (Day 4)
> Subject: re: New-venue trigger data…
> Hi {First name} — quick nudge. We can scope this as a flat data feed (CSV/weekly) or an
> API your systems pull. Statewide FL is ~580 new businesses/workday + thousands of new
> liquor/food filings. Worth a short call?

---

## Cold-call opener (15 seconds — for the prospects with a phone)
> "Hi, this is {name} — I'm not selling insurance, I send insurance agents a weekly list
> of brand-new bars and restaurants in {county} that just got their liquor license, so you
> can reach them before they're covered. I emailed you a free 25-venue sample — did you get
> a chance to see it? … Great — would a fresh list every Monday be worth $149 a month to you?"

## LinkedIn DM (if no email)
> Hi {First name} — I turn FL's public liquor-license filings into a weekly "new venues
> that need liquor liability" list for agents in {county}. Mind if I send you a free
> 25-venue sample to check out?

---

## Objection handling
- **"Where does this come from / is it legal?"** → "Florida public records (Ch. 119) — the
  DBPR liquor & food-service license filings. It's business data, not consumer credit, so
  it's outside FCRA. You use it for prospecting."
- **"No phone numbers?"** → "Right now it's the trigger — who/where/when, fresh. Most agents
  pair it with a 30-second lookup. Phone/email enrichment is on the roadmap — is that a
  dealbreaker or a nice-to-have?" (If it keeps coming up, that's your next build —
  `data-pipeline/CONTACT-ENRICHMENT.md`.)
- **"How fresh / how often?"** → "Filings hit weekly; I send you the new ones every Monday.
  You're seeing venues days after they're licensed."
- **"How much?"** → "$149/month for your county, cancel anytime. One liquor-liability policy
  you write off it pays for the year."
- **"Can I see more?"** → Send the full week's list + offer a 2-week free trial to close.

## The close
Yes → send the **Stripe Payment Link** (see `first-dollar-playbook.md`) + start the Monday
sends. Maybe → 2-week free trial (send 2 weekly lists), then ask for the card. Track it all
in `prospect-list.csv`.
