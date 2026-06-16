# Phase 6 — Final Rankings (Top 20 → 10 → 5 → 3 → 1)

> **Date:** 2026-06-14 · Built from Phase 2 (opportunity), Phase 3 (winnability), Phase 5 (weighted model). Timelines are estimates for **1 founder + AI, ~35 hrs/wk, <$5k**, marked as such.

---

## Top 20 (by Phase-2 opportunity, competition-screened)
1. FMCSA carrier safety + freight signals · 2. Freight brokerage signals · 3. Solar/EV install permits · 4. GovCon recompetes · 5. Liquor + food-service license triggers · 6. Contractor licenses → intel · 7. STR registrations · 8. Building permits (general) · 9. Aviation (FAA) · 10. Healthcare provider (NPI) · 11. GovCon teaming graph · 12. New business formation · 13. Bankruptcy (business-distress) · 14. Civil judgments/liens (UCC) · 15. Grid interconnection queues · 16. Economic-dev incentives · 17. Mechanics liens · 18. Healthcare facilities · 19. Municipal CIP · 20. Insurance SERFF filings.

*(Below the line, still scored in Phase 2: pre-foreclosure, tax liens, state/local procurement, professional licenses, zoning applications, oil & gas, manufacturing capex, importer compliance, cooperative purchasing, etc. Hard-avoided: evictions [FCRA], vehicle/fleet [DPPA].)*

## Top 10 (survived Phase-3 competitive screening — the shortlist)
FMCSA · Solar/EV permits · Liquor/food-service triggers · GovCon recompetes · Economic-dev incentives · Contractor licenses · STR registrations · Mechanics liens · Grid interconnection · New business formation.

## Top 5 (by Phase-5 weighted score)
| # | Niche | Score | One-line |
|---|---|---|---|
| 1 | **Liquor + food-service license triggers** | 4.02 | Fastest path, lowest competition, mandatory-purchase buyer |
| 2 | **STR registrations** | 3.98 | Incumbent-conflicted gap; best defensibility + scalability |
| 3 | **New business formation triggers** | 3.96 | Biggest buyer pool + recurring; more competition |
| 4 | **Mechanics liens (FL-first)** | 3.93 | Proven WTP, real moat, higher single-vertical ceiling |
| 5 | **Contractor licenses (vertical)** | 3.85 | Strong, but needs trade-vertical focus to defend |

## Top 3
**Liquor/food-service license triggers · STR registrations · New business formation triggers** — but note #4 mechanics liens is within 0.09 and has the best moat/ceiling combination.

## 🏆 Top 1 — by the model: **Liquor + food-service license triggers**
…with **mechanics liens (FL-first)** as the deliberately-flagged alternative lead for a founder who prioritizes a bigger single-vertical ceiling + stronger day-1 moat over fastest-first-dollar.

---

## Detail on the Top 5 (why ranked, risks, advantages, revenue, timelines)

### #1 — Liquor + food-service license triggers
- **Why #1:** Fastest MVP (CA daily new-applications report + TX/NY Socrata APIs), the **lowest competition of any niche analyzed** (the only thing aimed at this wedge is a hobbyist Apify actor covering 3 states), and a **mandatory-purchase buyer** — liquor-liability insurance is legally required and time-boxed, so a "new license filed → callable lead" feed sells itself.
- **Advantages:** Near-zero competition; mandatory/urgent buyer; clean public data; FCRA-safe (business-entity); first vertical of the platform engine.
- **Risks:** Modest single-vertical TAM (~2,400 restaurant openings/mo); per-state scraping maintenance; SMB buyers (insurance agents, distributors) are fragmented → needs efficient SEO/outbound; defensibility is moderate (data is replicable) → must win on coverage + contact-append + being first.
- **Revenue potential:** Solid path to $50k/mo *as the wedge into the platform*; harder to exceed ~$50–100k/mo on this vertical alone.
- **Time to first customer:** ~4–8 weeks.
- **Milestone timeline (solo + AI):** $1k/mo ≈ **1–3 mo** · $10k/mo ≈ **6–10 mo** · $50k/mo ≈ **18–28 mo** · $100k/mo ≈ **30–42 mo** · $1M/yr ≈ **3–4 yr** *(the later milestones assume expansion into channels 2–3 of the platform engine).*

### #2 — STR registrations
- **Why #2:** Best **defensibility (4)** and **scalability (5)** in the set — incumbents (Granicus/Deckard/GovOS) are *structurally conflicted out* of selling a B2B API (gov-contract resale limits + cannibalization), and nobody offers a normalized "is-a-permit-required + permit-lookup" API.
- **Advantages:** Durable structural gap; higher-ACV buyers (compliance vendors, STR lenders/insurers — $1k+/mo integrators); growing regulation tailwind; cacheable "rules layer" to start.
- **Risks:** Slower, education-heavy B2B/integrator sales; per-city scraper maintenance; messy/restricted source data.
- **Revenue potential:** Strong — fewer, higher-value API customers; $50k/mo with ~30–50 integrators feasible.
- **Time to first customer:** ~2–4 months.
- **Milestone timeline:** $1k/mo ≈ **2–4 mo** · $10k/mo ≈ **8–14 mo** · $50k/mo ≈ **20–32 mo** · $100k/mo ≈ **3–4 yr** · $1M/yr ≈ **4–5 yr**.

### #3 — New business formation triggers
- **Why #3:** Highest **recurring (5)** and **scalability (5)** — every new LLC is an immediate buyer for insurance, payroll, banking, software; ~5M+ filings/yr. The $99–499/mo self-serve trigger lane (between $0.002 scrapers and $8k KYB suites) is empty.
- **Advantages:** Huge, well-funded buyer pool; biggest ceiling; core of the platform engine.
- **Risks:** Most competitive of the top 4 (Apify scrapers, 1990s list brokers, KYB-adjacent); defensibility (3) is the weakest of the leaders — coverage/freshness is the only moat; per-state scraping legality/ToS care needed.
- **Revenue potential:** Highest ceiling of the five; but commoditization pressure is real.
- **Time to first customer:** ~1–3 months.
- **Milestone timeline:** $1k/mo ≈ **1–3 mo** · $10k/mo ≈ **6–12 mo** · $50k/mo ≈ **18–30 mo** · $100k/mo ≈ **30–48 mo** · $1M/yr ≈ **3–5 yr**.

### #4 — Mechanics liens (FL-first)
- **Why #4 (but the moat leader):** Best **defensibility (4) + WTP + ceiling** combination. Incumbents (Levelset/NCS) monetize *filing* and give the data away; the only company selling lien/NOC data as leads (Builders Notice) is FL-only, 1975-era, no API — **demand is de-risked, the data-API angle is wide open.**
- **Advantages:** Proven WTP (suppliers pay now); real county-record fragmentation moat; a recorded NOC names owner+GC+lender *before* the permit; expands to credit-monitoring for lenders/sureties.
- **Risks:** Slower MVP (county-recorder parsing); construction is cyclical; watch Procore/Levelset flipping its dormant dataset into a feed.
- **Revenue potential:** Higher single-vertical ceiling than liquor (large supplier budgets, $300–1,000+/mo).
- **Time to first customer:** ~2–4 months.
- **Milestone timeline:** $1k/mo ≈ **2–4 mo** · $10k/mo ≈ **7–12 mo** · $50k/mo ≈ **18–30 mo** · $100k/mo ≈ **30–48 mo** · $1M/yr ≈ **3–5 yr**.

### #5 — Contractor licenses (vertical)
- **Why #5:** Strong scalability/automation, but the **verification layer is a race to zero** and the intelligence layer is contested by funded Shovels/BuildZoom — winnable only via a single high-ticket trade (roofing/solar) in 1–3 states.
- **Advantages:** Clear WTP (Shovels validated it); CRM/Clay-native delivery angle; pairs with permits.
- **Risks:** Free data + cheap scrapers + funded incumbents; demands ruthless vertical focus.
- **Time to first customer:** ~6–10 weeks. **Milestone timeline:** $1k/mo ≈ **1–3 mo** · $10k/mo ≈ **8–14 mo** · $50k/mo ≈ **24–36 mo** · $1M/yr ≈ **4–5 yr**.

---

## The honest synthesis

The model's #1 is **liquor + food-service license triggers**, but the top 4 are a virtual tie, and they are **channels of one platform** (fragmented public records → AI-enriched trigger feed → SMB buyer who must transact with the new entity). So the real decision is *which vertical to lead with*, and it reduces to one trade-off:

- **Lead with liquor triggers** → fastest first dollar, lowest competition, smaller starting ceiling. Best if the priority is *momentum + de-risked first revenue*.
- **Lead with mechanics liens (FL-first)** → slightly slower, but bigger ceiling, stronger moat, demand already proven. Best if the priority is *defensibility + revenue ceiling from day 1*.

Either way, the **$50k/mo+ target is reached by the platform** (adding channels 2–3), not by one vertical alone. Phase 7 (expansion) and Phase 8 (the founder recommendation + 90-day/1-year plan) build on whichever lead vertical is confirmed.
