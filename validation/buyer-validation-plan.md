# Buyer Validation Plan — New Venue Data (TODO-C)

> **The one de-risking step we skipped.** We built the product before proving anyone
> will pay. This is the test. Run it before spending another hour on features.

## The bet we're testing
South-Florida liquor-liability **insurance agents** will pay, on a recurring basis,
for a weekly feed of **brand-new venues that just got a liquor license** (= venues
that legally must carry liquor-liability / dram-shop coverage *now*).

## Success bar (decide in advance, don't move it)
Put the sample lead list in front of **5** FL liquor-liability insurance agents.
- **≥ 2 say "I'd pay weekly for this" (with a real price) → GREEN LIGHT.** Build the
  outreach + onboarding flow and turn the pipeline into a paid weekly deliverable.
- **1 yes → YELLOW.** Re-test the pitch/price/segment with 5 more.
- **0 yes → RED.** The trigger isn't valuable enough to *this* buyer — revisit the
  buyer (distributors? POS resellers?) or the niche before building more.

## The artifact
- **`south-fl-new-liquor-leads.xlsx`** — the polished, agent-facing version (branded
  banner, frozen header, autofilter, a Summary tab). **Email/show this one.**
- **`south-fl-new-liquor-leads.csv`** (+ `.json`) — same 25 rows for import into a CRM
  or spreadsheet. 25 real, fresh South-FL new liquor filings (Broward / Miami-Dade /
  Palm Beach), all **on-premises** venues (the dram-shop targets), filed in the last ~2 weeks.
- Regenerate any time (e.g. right before a meeting, so it's "this week's"):
  `cd data-pipeline && npm run leads` (or `node src/build-lead-list.mjs 40` for more),
  then `python validation/make-xlsx.py` to refresh the .xlsx (needs `pip install openpyxl`).
- **Compliance line to say out loud:** "This is Florida public-records data (Ch. 119)
  about *businesses*, not consumers — it's lead/marketing data, not a credit or
  underwriting eligibility decision, so it's outside FCRA. Source: FL DBPR. We're not
  affiliated with the state." (Keep the as-is / not-affiliated disclaimer on every copy.)

## Find the 5 agents (South FL)
Aim for independent agents/brokers who actually write liquor-liability for bars &
restaurants. Sources:
- Google: `liquor liability insurance agent Broward` / `bar restaurant insurance Miami` /
  `dram shop insurance Florida agent`.
- LinkedIn: title "insurance agent/producer" + "liquor liability" / "hospitality" / "restaurant".
- FL Association of Insurance Agents (FAIA) member directory; local independent agencies.
- Referral ask after each call: "Who else writes a lot of bar/restaurant liquor liability?"

## Outreach

**Cold email (copy-paste, tweak the name/county):**
> Subject: 25 brand-new Broward bars that need liquor liability (this month)
>
> Hi [Name] — I pull Florida's public liquor-license filings and turn them into a
> weekly list of venues that *just* got licensed to serve alcohol in your counties —
> i.e. businesses that need dram-shop coverage right now, before your competitors call.
>
> I put together a free 25-venue sample for South FL (attached). Could I get 15 minutes
> to show you how it works and ask whether a weekly version would be useful to you?

**On the call (15 min) — the questions that actually matter:**
1. *Walk them through the sheet.* "These 25 all filed a new liquor license in the last
   two weeks. Are these the kind of accounts you'd want to reach?"
2. **Current pain:** "How do you find newly-opening venues today?" (Listen for: they
   *don't* / referrals only / they buy generic lists / they drive around.)
3. **Value:** "If you got this every week — fresh new-venue filings in your counties,
   with the license type — what would that be worth to you?"
4. **The money question (get an explicit answer):** "Would you pay for a weekly feed
   like this? Monthly subscription — what feels right: $99, $199, $299?"
5. **Gap check:** "What's missing to make this a yes?" (Phone numbers? Email? Sooner?
   More counties? CRM import?)

## Price to probe
Site plans: Starter **$299/mo** (1 county), Pro **$999/mo** (all 67). For a solo agent,
test **$99–$299/mo**. Anchor: *one* new liquor-liability policy's commission dwarfs the
subscription — they only need to close a single lead/month to win.

## Known gap to be honest about
The sample has **no phone/email** (DBPR liquor records don't include contact info).
For validation that's fine — we're testing whether the *trigger* (who/where/when) is
valuable. If "I'd pay, but I need phone numbers" is the recurring blocker, contact
enrichment becomes the #1 build — and the approach is already designed in
**`data-pipeline/CONTACT-ENRICHMENT.md`** (restaurant phones come from DBPR H&R
food-service files + OSM, *not* FDACS — FDACS is grocery/markets). That blocker
recurring is itself a useful, build-ready finding.

## Tracking (fill in as you go)

| # | Agent / Agency | County focus | Contacted | Response | "Pay weekly"? | Price reaction | Notes |
|---|---|---|---|---|---|---|---|
| 1 |  |  |  |  |  |  |  |
| 2 |  |  |  |  |  |  |  |
| 3 |  |  |  |  |  |  |  |
| 4 |  |  |  |  |  |  |  |
| 5 |  |  |  |  |  |  |  |

**Result:** ___ / 5 said "I'd pay weekly."  → **GREEN / YELLOW / RED**  (date: ______)
