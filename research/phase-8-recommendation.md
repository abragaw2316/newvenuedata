# Phase 8 — The Founder Recommendation (Executive Decision)

> The capstone: the single niche, the single city, and the concrete 90-day / 1-year plan to a $50k/mo+ recurring data business. **Date:** 2026-06-14. Constraints assumed: 1 founder + Claude Code/AI, ~35 hrs/wk, <$5,000. **No code is built until the founder gives the build order.**

---

## THE FOUNDER RECOMMENDATION

> **Build a daily "new venue opening" trigger-data feed, sourced from new Florida on-premise liquor + food-service license filings, sold first to liquor-liability insurance agents — starting in South Florida (Broward / Miami-Dade / Palm Beach) on a single statewide MyFloridaLicense pipeline.**

**If I were personally responsible for maximizing profit over 5 years, this is what I would start today** — because it is the rare idea that is simultaneously *fast to first dollar*, *nearly uncontested*, *FCRA-safe*, *AI-automatable by one person*, and *the first channel of a much larger platform.*

### Why this, against your 5 priorities
| Your priority | How this wins |
|---|---|
| **Highest probability of success** | Lowest competition of all 52 niches; the only direct competitor (Firstpour) is NY-only and **doesn't touch Florida**. You compete against a hobbyist Apify actor (CA/TX/NY), not an enterprise. |
| **Highest probability of recurring revenue** | Buyers (insurers, distributors, POS) need *this week's* openings *every* week → inherently subscription. |
| **Fastest path to paying customers** | Buyer #1 (liquor-liability insurers) has a **mandatory, deadline-driven** purchase; FL is a dram-shop state. You can hand-deliver a sample lead list in week 1 and pre-sell before writing code. |
| **Long-term scalability** | One pipeline → Tampa+Orlando free; then TX/GA/NC; then the value ladder (API→app→AI→predictive) and the platform channels (formations, permits, liens) — Phase 7. |
| **Sustainable competitive advantage** | The moat compounds: (a) FL's daily flat-files have just enough parsing friction to deter competitors, (b) accumulated opening/closure *history* can't be backfilled, (c) cross-linking permit + license + formation on one address is something no single-vertical rival has. |

**City answer:** **South Florida**, on a **Florida** data pipeline (highest U.S. opening volume + densest high-WTP buyers + zero direct competition + one pipeline serves the #1/#3/#4 opening metros). **Texas is state #2.**

---

## THE FIRST 90 DAYS

**Guiding principle: sell before you build. Deliver value by hand (concierge MVP) before automating anything.**

### Days 1–21 — Validate & pre-sell (almost no code)
- **Manually** download the MyFloridaLicense daily license files; by hand, filter the last 30 days of new South-FL on-premise applications/issuances into a clean spreadsheet (~a few hours with AI help).
- Identify **15–20 target buyers**: FL liquor-liability insurance agencies (e.g., hospitality specialists), regional beverage distributors, and restaurant POS resellers (Toast/Square channel).
- **Outreach + interviews:** show each a free sample list ("here are 25 venues that filed for a liquor license in Broward last month — would a fresh weekly version be worth $X?"). Goal: **3–5 verbal pre-commitments / paid pilots** at $199–499/mo.
- Deliverable: validated buyer + price point, and a hand-built sample proving the signal.
- **Spend:** ~$50 (domain) + outreach time.

### Days 22–55 — Build the FL pipeline + deliver (the build order starts here)
- Automate: ingest MyFloridaLicense daily files → parse/normalize (LLM-assisted) → dedup → **contact-append** (owner name, phone, email, address) → store.
- Delivery v1 (deliberately simple): **daily/weekly email + CSV + optional Slack webhook.** No fancy app yet.
- Stand up a **landing page** + Stripe checkout; convert the pilots to paid.
- Add **Tampa + Orlando** (free — same FL pipeline).
- **Tech note (matches your stack preference — JS/TS, no extra toolchain):** Node/TS + a cheap VPS or serverless, SQLite/Postgres, a scheduled scraper, Claude for parsing/enrichment, Next.js landing page, Stripe. All buildable with Claude Code.
- **Target:** first **$1–3k/mo** recurring.

### Days 56–90 — First revenue, harden, seed inbound
- Convert remaining pilots; aim for **8–15 paying customers**.
- Add a **basic web list/dashboard** (filter by county/date/license type).
- Launch **programmatic SEO** pages ("New restaurants & bars opening in [FL city] — [month] 2026") for inbound — recycle the dataset as marketing (Phase 1 GTM).
- Publish a **free weekly "South FL openings" email** as a top-of-funnel lead magnet.
- **Target:** **$3–6k/mo** recurring; pipeline reliable; one repeatable sales script.

**90-day budget (well under $5k):** domain/email ~$50 · hosting ~$150 · LLM/parsing ~$150–400 · contact-append API ~$200–500 · cold-email/CRM ~$150 · Stripe/legal (ToS + privacy) ~$250. **Total ≈ $1,000–1,600.** Your 35 hrs/wk + Claude Code is the real input.

---

## THE FIRST YEAR (quarter by quarter)

| Quarter | Focus | Target MRR | Milestones |
|---|---|---|---|
| **Q1** | FL launch (South FL→Tampa→Orlando); concierge→automated; insurers as beachhead buyer | **$3–6k** | 8–15 customers; repeatable script; SEO live |
| **Q2** | **Texas** (DFW→Houston→Austin); ship **API + MCP** tier; add distributors/POS buyers | **$8–15k** | 25–40 customers; first API/MCP customers; 2 states |
| **Q3** | **Intelligence web app** + **AI "ask the data" assistant** upsell; add GA/NC | **$15–28k** | 50–70 customers; value-ladder upsell live; 4 states |
| **Q4** | **Channel 2: new-business-formation triggers** on the same engine; first **enterprise data license** (an insurer or distributor) | **$28–45k** | approaching $50k run-rate; 2 revenue streams; 1 enterprise deal |

---

## THE CLEAREST PATH TO $50,000/MONTH RECURRING

$50k/mo ≈ $600k ARR. It does **not** come from maxing one feed — it comes from **2–3 channels × the value-ladder upsell**:

```
Liquor/food triggers:  ~90 customers × ~$300/mo avg         ≈ $27k/mo
+ API/MCP + AI-assistant upsells on the base                ≈  $6k/mo
+ New-business-formation channel (same engine)              ≈ $12k/mo
+ 1–2 enterprise data licenses (insurer / distributor)      ≈  $7k/mo
                                                            ──────────
                                                            ≈ $52k/mo   (realistic in ~18–30 months)
```

**The compounding levers:** (1) every new state widens supply at ~zero new CAC; (2) every value-ladder rung (API→app→AI→predictive) upsells existing customers; (3) every new channel (formations→permits→liens) sells to *overlapping* buyers; (4) accumulated history becomes a predictive-analytics product and a moat. Margins trend toward the 80–85% DaaS benchmark as fixed pipeline cost spreads.

---

## TOP RISKS & MITIGATIONS
| Risk | Mitigation |
|---|---|
| **Firstpour or Apify expands into FL** | Move fast; lock buyers with annual deals; build the cross-linked permit+license+formation moat they can't match; own the SEO. |
| **Per-state scraper fragility** | Start with ONE state; AI-assisted monitoring/repair; add states only after the first is stable. |
| **Contact-append accuracy / outreach compliance** | Lead the product on *public filing facts*; verify appended contacts; advise customers on CAN-SPAM/TCPA for their own outreach. Keep data strictly **B2B-entity** (FCRA-safe). |
| **Buyer reachability (fragmented SMBs)** | Beachhead the *mandatory-purchase* buyer (liquor-liability insurers) first; use free weekly email + programmatic SEO for inbound. |
| **Single-vertical ceiling** | Expansion is designed in (Phase 7) — formations/permits as channels 2–3. |
| **Legal** | ABC license data is public; product is B2B-entity (not consumer eligibility) → outside FCRA. Add a clean ToS/privacy page; avoid reselling consumer/people data. |

---

## THE ONE FIRST ACTION (when you're ready)
**Manually pull last month's new South-Florida on-premise liquor-license filings, build a 25-row sample lead list, and get it in front of 5 FL liquor-liability insurance agents this week.** If ≥2 say "yes, I'd pay for this weekly" — give the build order. That single test de-risks the entire business before a line of code.

---

*This concludes the 8-phase engagement. The niche, geography, and plan are set. Next session can either (a) begin execution on the founder's build order, or (b) drill deeper into any phase. See `00-engagement-overview.md` for the full map.*
