# Phase 4 — Geographic Entry (for the LOCKED niche: liquor + food-service license triggers)

> **Date:** 2026-06-14 · **Method:** 2 targeted analysts — (A) state ABC data-supply accessibility + volume; (B) metro opening-volume + buyer density + competition. Web-sourced, cited.
> **Reframing:** For a *license-trigger* product the unit is **state** (ABC boards are state-run, so data is collected state-by-state) crossed with **metro** (where openings + buyers cluster). "Best city" = best *(data accessibility × opening volume × buyer density × low competition)*.

---

## ⚠️ Key competitive discovery (updates Phase 3)
- **Firstpour (firstpour.us)** sells the *exact* wedge — "new liquor-license signals → distributors / POS / insurers / payroll, hourly checks" — but is **New York-anchored**. [DOC]
- The **Apify liquor aggregator** covers **CA / TX / NY** raw data. [DOC]
- **Nobody covers Florida** as a packaged liquor-signal product. [DOC/INF]
➡️ This flips the obvious choice: California has the *best data* (daily new-applications feed) and highest volume, **but it's contested** (Apify). The **uncontested, high-volume, high-WTP whitespace is Florida + the Sun Belt.**

---

## Supply side — state ABC data accessibility (the feasibility filter)

| Tier | States | Why |
|---|---|---|
| **Easy (API / daily feed)** | **CA** (daily *new-applications* report + daily issued + bulk CSV — gold standard), **NY** (Socrata *pending-applications* dataset — earliest trigger), **TX** (Socrata issued-license API, ~66k licensees), **CO** (Socrata "Recently Approved (last 3 mo)" — ready-made trigger), **WA** (Socrata + curated on-premise lists) | True open-data/APIs; lowest build cost |
| **Medium (daily/quarterly files)** | **FL** (daily downloadable license-status files; legacy flat-file), **NJ** (quarterly XLSX), **VA** (licensee XLS; control state), **GA** (quarterly DOR file), **AZ** (recently-issued web feed), **MA** (state list + Accela) | Accessible with parsing; FL's *daily* cadence is the standout |
| **Hard (search-only / FOIA / county)** | IL (FOIA for bulk), **PA/OH/MI/NC** (control states, search-only, no open data), MD & **NV** (county-administered) | Avoid early; control states mostly *hinder* access |

**Control-state finding:** of the 17 alcohol "control states," only Virginia publishes a bulk licensee file — control over *spirits sales* did **not** produce open *license data*. PA/OH/MI/NC are search-only. So control states are mostly a *disadvantage* for data supply.

## Demand side — metro opening volume × buyer density × competition

Anchored to RestaurantData.com 2024/2025 New Restaurant Openings Reports + D&B F&B-retailer counts.

| Rank | Metro | New-opening volume | Buyer density | Competition | Verdict |
|---|---|---|---|---|---|
| 1 | **South Florida** (Broward/Miami-Dade/Palm Beach) | **#1 metro** both 2024 (~1,490) & 2025 (~974) | High (FL #2 F&B retailers 28,442; Cheney Bros $3B HQ; dram-shop liability agencies) | **Thinnest** (no FL coverage by Firstpour/Apify) | ⭐ **Best launch** |
| 2 | Tampa / Gulf Coast FL | #3 metro both years | High | Low | Same FL pipeline |
| 3 | Orlando FL | #4 metro 2024 | High | Low | Same FL pipeline |
| 4 | Dallas–Fort Worth | TX #4 state; fast-growing | **Very high** (McLane $51B + Core-Mark HQ; toughest liquor-liability mkt = highest WTP) | Medium (TX on Apify) | Best **2nd state** |
| 5 | Houston / Austin / San Antonio | TX boom | Very high | Medium | TX pipeline |
| 6 | Atlanta, Charlotte | Sun Belt risers | Med-high | Low | Strong expansion |
| — | Los Angeles | #2 metro, huge | Very high (CA #1, 45,647) | **Higher** (Apify CSV; Rainbow MGA) | Great data, contested → expand later |
| — | NYC | High | Very high | **Highest — Firstpour is NY-native** | ❌ Avoid as launch |

---

## The geographic answer

**Top 8 launch states (volume × accessibility × competition):** 1) **Florida**, 2) **Texas**, 3) California, 4) Colorado, 5) Georgia, 6) Washington, 7) New York*, 8) New Jersey. *(NY has the best *pending-application* data but the toughest competition — Firstpour — so it's a later channel, not a start.)*

**Top 3 launch markets:** 1) **South Florida**, 2) **Tampa + Orlando** (same FL pipeline), 3) **Dallas–Fort Worth (Texas)**.

### 🏁 Single best launch market: **South Florida, on a Florida statewide data pipeline**
**Why FL over the "better-data" states:**
1. **Highest new-opening signal volume in the country** (FL is the #1 and #3 opening metros) → the feed is obviously valuable on day one.
2. **Uncontested.** The only direct competitor (Firstpour) is NY-only; Apify covers CA/TX/NY — **neither touches Florida.** You launch where volume is highest and competition is lowest.
3. **High buyer WTP.** Florida is a **dram-shop liability state** → liquor-liability insurers urgently want new-license alerts; FL is #2 in F&B retailers and hosts a major distributor HQ (Cheney Bros).
4. **One pipeline, three metros.** FL data is centralized at MyFloridaLicense (daily files), so a single ingestion unlocks South FL + Tampa + Orlando — the #1/#3/#4 opening metros — immediately.
5. **Texas is the natural 2nd state** (Socrata API = cheap build, *highest* buyer WTP as the toughest liquor-liability market) — but it has some Apify presence, so it follows FL.

**Sequence:** **FL (South FL → Tampa → Orlando) → TX (DFW → Houston → Austin) → GA/NC (Atlanta/Charlotte) → then the better-data-but-contested CA/NY as the platform matures.**

> Note the elegant inversion: the *easiest data* (CA daily new-apps) is **not** the best start, because easy data attracts competitors. FL's slightly-harder daily flat-files are a *feature* — they're exactly the parsing friction that's kept competitors out of the highest-volume market. This mirrors the whole engagement's core lesson.

## Sources
State accessibility: abc.ca.gov/licensing/licensing-reports (CA daily new-apps), data.ny.gov SLA Pending Licenses, data.texas.gov TABC, myfloridalicense.com daily files, data.colorado.gov recently-approved, data.lcb.wa.gov. Demand/competition: restaurantdata.com 2024 & 2025 openings reports, firstpour.us (NY competitor), apify.com jungle_synthesizer liquor aggregator (CA/TX/NY), dnb.com F&B retailer counts, gourmetpro.co distributor HQs, insurancejournal.com (dram-shop/liquor-liability difficulty). Full URLs in the 2 Phase-4 agent transcripts.
