# Phase 2 — Niche Universe & Scoring Matrix

> **Goal:** Evaluate every major category of legally-collectable U.S. public data against the 7 working filters, producing a comparable scorecard per niche to feed Phase 5.
> **Date:** 2026-06-14 · **Method:** 8 parallel sector analysts (~55 niches), web-sourced with citations. [DOC]/[INF] convention as in Phase 1.
> **Scoring:** each niche graded 1–5 (5 = best/most-favorable) on 12 dimensions. **Provisional Total /60 is UNWEIGHTED** — Phase 5 applies the real weights. Use it as a sorting aid, not the verdict.

Dimensions: **Rev**=revenue potential · **WTP**=willingness-to-pay · **Rec**=recurring/subscription fit · **Comp**=low-competition (5=weak competition) · **Coll**=collection ease (5=easy) · **Avail**=data availability · **AI**=AI-automation potential · **SEO**=programmatic-SEO potential · **API**=API/MCP fit · **Exp**=expansion potential · **MVP**=speed-to-MVP · **1st**=speed-to-first-customer.

---

## 🔑 The single most important Phase-2 finding: niches split into TWO archetypes

The top of the table is not homogeneous. The best niches fall into two structurally different shapes, and the right choice depends on whether you weight **speed** or **defensibility**:

| | **Archetype N — National single-source** | **Archetype L — Fragmented-local** |
|---|---|---|
| **Examples** | FMCSA trucking, GovCon recompetes, SEC/EDGAR, NPI providers, FAA, bankruptcy | Building/solar permits, STR registrations, liquor/food licenses, contractor licenses, business formation, mechanics liens |
| **Collection** | One free federal source → **instant national coverage** | Hundreds–thousands of county/state portals → **grind = moat** |
| **Speed to MVP** | Days–weeks | Weeks–months (per-jurisdiction) |
| **Moat** | Weak from data (anyone can pull the same file); moat must come from **normalization + real-time API/MCP + signal logic + brand** | Strong from **assembly labor** (the 80% long tail no one wants to scrape) |
| **Geography (Phase 4)** | **N/A — you launch nationally at once.** "Best city" is irrelevant. | **Geography = entry wedge.** Start in the metro with the most permit/license volume + best data access, expand outward. |
| **Risk** | A free incumbent (USAspending, ImportYeti, NPPES, EDGAR) caps pricing | Coverage gaps; slower to "national"; ongoing scraper maintenance |

**Implication for Phase 4:** geographic analysis only matters for Archetype-L niches. If the founder picks an Archetype-N niche, Phase 4 becomes "go national day 1" and we reallocate that effort to GTM/SEO strategy.

---

## Master Ranked Scoring Matrix (deduped, ~50 niches)

> Where multiple analysts independently scored the same niche (building permits, new-business formation, contractor licenses), scores were triangulated — noted in **▲**. Higher agreement = higher confidence.

| # | Niche | Arch | Rev | WTP | Rec | Comp | Coll | Avail | AI | SEO | API | Exp | MVP | 1st | **/60** | Key flag |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **FMCSA carrier safety & authority** | N | 4 | 5 | 5 | 2 | 5 | 5 | 5 | 4 | 5 | 5 | 5 | 4 | **54** | Free daily data; $35B fraud pain |
| 2 | **Freight brokerage signals** (new authority / insurance lapse) | N | 4 | 5 | 5 | 4 | 4 | 5 | 5 | 3 | 5 | 5 | 4 | 5 | **54** | Same FMCSA pipe, less competition |
| 3 | **Solar/EV/renewable install permits** | L | 4 | 5 | 4 | 3 | 4 | 4 | 5 | 5 | 5 | 5 | 4 | 5 | **53** | High-LTV buyers; narrow→fast MVP |
| 4 | **GovCon recompetes** (expiring contracts) | N | 3 | 5 | 4 | 3 | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 4 | **53** | Buildable in days on free data; thin moat |
| 5 | **Liquor + food-service new-license triggers** | L | 3 | 4 | 4 | 5 | 4 | 4 | 5 | 4 | 5 | 4 | 5 | 4 | **51** | Near-zero competition; "venue opening" signal |
| 6 | **Contractor licenses → contractor intel** ▲ | L | 4 | 4 | 4 | 3 | 3 | 4 | 5 | 5 | 5 | 5 | 4 | 4 | **50** | CSLB-anchored; Shovels validated WTP |
| 7 | **STR registrations & permits** | L | 3 | 4 | 4 | 4 | 4 | 4 | 5 | 4 | 5 | 5 | 4 | 4 | **50** | No clean B2B permit API exists yet |
| 8 | **Building permits (general)** ▲ | L | 4 | 4 | 4 | 3 | 3 | 4 | 5 | 4 | 5 | 5 | 4 | 4 | **49** | Proven, but Shovels/BuildZoom present |
| 9 | **Aviation (FAA registry)** | N | 3 | 4 | 3 | 4 | 5 | 5 | 5 | 3 | 5 | 4 | 5 | 3 | **49** | Easy MVP; small TAM |
| 10 | **Healthcare provider data (NPI + directory accuracy)** | N+L | 4 | 4 | 5 | 2 | 3 | 5 | 4 | 4 | 5 | 5 | 4 | 3 | **48** | Free NPPES; moat only in accuracy layer |
| 11 | **GovCon subcontractor/teaming graph** | N | 3 | 4 | 4 | 4 | 4 | 4 | 5 | 3 | 5 | 5 | 3 | 3 | **47** | AI-graph on free data; M&A upside |
| 12 | **SEC / EDGAR filings** | N | 3 | 3 | 4 | 1 | 5 | 5 | 5 | 4 | 5 | 3 | 5 | 4 | **47** | Red ocean; incumbents at $49/mo |
| 13 | **Federal procurement (SAM/USAspending)** | N | 3 | 3 | 4 | 1 | 5 | 5 | 5 | 4 | 5 | 4 | 5 | 3 | **47** | Free USAspending caps pricing |
| 14 | **New business formation / SoS registrations** ▲ | L | 4 | 4 | 5 | 2 | 2 | 4 | 5 | 4 | 5 | 5 | 3 | 4 | **47** | KYB expansion; Middesk/Cobalt present |
| 15 | **Bankruptcy filings (business-distress)** | N | 4 | 4 | 5 | 3 | 4 | 4 | 4 | 3 | 4 | 4 | 4 | 3 | **46** | Uniform PACER schema; FCRA-safe if entity-level |
| 16 | **Civil judgments & liens (UCC-first)** | L | 4 | 4 | 4 | 3 | 3 | 4 | 4 | 3 | 5 | 5 | 3 | 4 | **46** | Cleanest FCRA profile; lender WTP |
| 17 | **Grid interconnection queues** | L | 4 | 5 | 4 | 3 | 2 | 4 | 4 | 4 | 5 | 5 | 2 | 4 | **46** | High WTP; 50+ queue formats = moat |
| 18 | **Economic-dev incentives & subsidies** | L | 4 | 5 | 4 | 4 | 2 | 3 | 5 | 4 | 4 | 5 | 2 | 4 | **46** | High WTP × low self-serve competition; AI-extraction unlock |
| 19 | **Pre-foreclosure / foreclosure** | L | 4 | 5 | 4 | 2 | 3 | 4 | 4 | 4 | 4 | 5 | 3 | 4 | **46** | High WTP but ATTOM/PropStream own it |
| 20 | **Mechanics liens** | L | 4 | 4 | 4 | 4 | 3 | 3 | 4 | 4 | 4 | 4 | 3 | 4 | **45** | FCRA-clean; incumbents fixated on filing-workflow |
| 21 | Code/safety violations | L | 3 | 3 | 3 | 4 | 4 | 4 | 5 | 4 | 4 | 3 | 4 | 4 | **45** | ⚠️ FCRA if used for tenant screening |
| 22 | Municipal CIP (capital projects) | L | 4 | 4 | 4 | 4 | 2 | 3 | 4 | 4 | 4 | 5 | 3 | 3 | **44** | Only Citylitics direct; PDF-extraction moat |
| 23 | State & local procurement / bids / RFPs | L | 4 | 4 | 5 | 3 | 2 | 3 | 4 | 5 | 4 | 5 | 2 | 3 | **44** | Fragmentation = moat; hard MVP |
| 24 | Healthcare facilities & licensing | L | 4 | 4 | 4 | 3 | 2 | 4 | 4 | 4 | 4 | 5 | 3 | 3 | **44** | 50-state DOH moat; Definitive looms |
| 25 | Employment / WARN / job postings | N+L | 3 | 3 | 4 | 2 | 4 | 4 | 5 | 5 | 4 | 3 | 4 | 3 | **44** | ⚠️ FCRA at person-level; WARN saturated |
| 26 | Zoning & land-use applications | L | 4 | 4 | 4 | 3 | 2 | 3 | 3 | 5 | 5 | 5 | 2 | 3 | **43** | Code-normalization is multi-year; track applications instead |
| 27 | UCC filings | L | 4 | 5 | 4 | 3 | 2 | 3 | 4 | 3 | 5 | 5 | 2 | 3 | **43** | Highest lender WTP; collection friction |
| 28 | Professional & occupational licenses | L | 4 | 4 | 5 | 2 | 2 | 4 | 4 | 4 | 5 | 4 | 2 | 3 | **43** | Sticky verification revenue; healthcare lane crowded |
| 29 | Tax liens & delinquent property taxes | L | 3 | 4 | 3 | 4 | 3 | 4 | 5 | 3 | 4 | 4 | 3 | 3 | **43** | No dominant API; seasonal/niche buyers |
| 30 | Cooperative purchasing (OMNIA/Sourcewell) | L | 3 | 4 | 4 | 4 | 3 | 3 | 4 | 4 | 4 | 4 | 3 | 3 | **43** | "Sell once, reach 90k buyers" wedge |
| 31 | Clean-energy pipeline (FERC+ISO+permits) | L | 4 | 4 | 4 | 3 | 2 | 3 | 4 | 4 | 5 | 5 | 2 | 3 | **43** | Expansion of #17 |
| 32 | Importer compliance registry (FDA/USDA/CBP) | L | 3 | 4 | 4 | 4 | 3 | 3 | 4 | 4 | 4 | 4 | 3 | 3 | **43** | Low API competition; multi-agency join |
| 33 | Manufacturing/industrial facilities (capex signals) | L | 4 | 4 | 4 | 3 | 2 | 3 | 4 | 4 | 4 | 5 | 2 | 3 | **42** | Reframe air permits as capex intent vs IIR |
| 34 | Insurance licensing (NIPR) & SERFF filings | L | 4 | 4 | 5 | 4 | 2 | 3 | 4 | 3 | 4 | 4 | 2 | 3 | **42** | SERFF rate-filing intel underserved; NIPR gated |
| 35 | Government grants | N | 3 | 3 | 4 | 2 | 4 | 4 | 4 | 4 | 4 | 3 | 4 | 3 | **42** | Off-thesis nonprofit buyers |
| 36 | Mining (MSHA) | N | 2 | 2 | 3 | 4 | 5 | 5 | 5 | 3 | 4 | 2 | 5 | 2 | **42** | Tiny TAM; no moat |
| 37 | Registered-agent / local business-license issuances | L | 3 | 3 | 4 | 5 | 1 | 3 | 5 | 4 | 4 | 4 | 2 | 3 | **41** | Whitespace; "licensed-to-operate" > bare registration |
| 38 | Oil & gas drilling permits | L | 4 | 5 | 5 | 1 | 2 | 4 | 4 | 3 | 4 | 4 | 2 | 3 | **41** | Enverus owns it |
| 39 | Environmental permits | L | 3 | 2 | 4 | 2 | 3 | 4 | 4 | 4 | 4 | 4 | 4 | 2 | **40** | Free ECHO caps federal-layer WTP |
| 40 | Agriculture / USDA | N | 2 | 2 | 3 | 2 | 5 | 5 | 4 | 3 | 4 | 3 | 5 | 2 | **40** | Free/clean/aggregate = no moat |
| 41 | New-business "moving" meta-signals | L | 5 | 4 | 5 | 2 | 1 | 3 | 4 | 4 | 4 | 5 | 1 | 2 | **40** | High-margin destination, not a start (dependency-heavy) |
| 42 | Shipping / bills of lading | N | 4 | 4 | 4 | 1 | 2 | 4 | 3 | 5 | 4 | 4 | 2 | 3 | **40** | ImportYeti (free) + Panjiva (S&P) |
| 43 | Education / schools (procurement layer) | N+L | 3 | 3 | 3 | 3 | 3 | 4 | 4 | 4 | 4 | 3 | 3 | 3 | **40** | NCES base low-frequency; RFP layer better |
| 44 | Commercial development projects | L | 5 | 5 | 5 | 1 | 2 | 3 | 3 | 3 | 3 | 4 | 2 | 3 | **39** | Highest WTP, deep incumbents (Dodge/ConstructConnect) |
| 45 | Property ownership / assessor | L | 4 | 4 | 5 | 1 | 1 | 4 | 3 | 3 | 5 | 5 | 1 | 2 | **38** | Saturated, coverage-war |
| 46 | Property transfers / deeds | L | 5 | 4 | 5 | 1 | 1 | 3 | 3 | 3 | 5 | 5 | 1 | 2 | **38** | Highest-value record, most contested |
| 47 | Court records (general dockets) | N+L | 4 | 4 | 5 | 1 | 1 | 3 | 3 | 3 | 5 | 5 | 2 | 2 | **38** | Hard + crowded; attack a thin slice |
| 48 | EV charging / storage permits | L | 3 | 4 | 4 | 4 | 1 | 2 | 4 | 4 | 4 | 4 | 1 | 3 | **38** | Whitespace but brutal collection |
| 49 | Litigation intelligence | N | 4 | 5 | 5 | 1 | 1 | 2 | 3 | 3 | 4 | 5 | 1 | 2 | **36** | Lex Machina/Bloomberg; capital-heavy |
| 50 | Municipal spending / checkbook | L | 2 | 2 | 3 | 3 | 2 | 2 | 3 | 3 | 3 | 4 | 2 | 2 | **31** | Weak standalone; enrichment only |
| 51 | Maritime / vessel | N | 3 | 4 | 4 | 2 | 1 | 2 | 2 | 2 | 4 | 3 | 1 | 2 | **30** | Kpler roll-up; capital-heavy |
| 52 | Public safety / crime | L | 2 | 2 | 3 | 3 | 1 | 3 | 3 | 4 | 3 | 2 | 2 | 2 | **30** | Consumer drift; low WTP |

### ⛔ HARD-AVOID (legal disqualifiers — do not build for a solo founder)
| Niche | /60 | Why |
|---|---|---|
| **Evictions** | 21 | **FCRA SEVERE.** Only buyers want it for tenant-screening eligibility = regulated consumer reporting. FTC/CFPB hit TransUnion's tenant-screening unit $15M (2023). No FCRA-safe B2B use that monetizes. |
| **Vehicle / fleet registrations** | 21 | **DPPA CRITICAL.** Resale gated to enumerated permissible purposes; min $2,500/violation; self-serve dev/SMB API model is effectively illegal without permissible-use vetting you can't run solo. |

---

## Recommended Phase-3 Shortlist (advance these to competitor deep-dive)

Selected by provisional score **adjusted for strategy** (dropped high-score-but-strategically-weak: SEC/EDGAR & Federal Procurement — free-incumbent red oceans; Pre-foreclosure — ATTOM/PropStream lock-in). Balanced across both archetypes:

**Tier 1 — front-runners**
1. **FMCSA carrier safety + freight brokerage signals** (#1/#2) — combine; one free pipe, $35B pain, fastest national MVP.
2. **Solar/EV install permits** (#3) — high-LTV buyers, fast vertical MVP, real moat.
3. **Liquor + food-service new-license triggers** (#5) — lowest competition, unambiguous intent signal.
4. **GovCon recompetes** (#4) — fastest possible MVP on free data; thin moat (test in Phase 3).
5. **Economic-development incentives & subsidies** (#18) — highest WTP × thinnest self-serve competition; AI-extraction moat.

**Tier 2 — strong contenders**
6. **Contractor licenses → contractor intelligence** (#6)
7. **STR registrations** (#7)
8. **Mechanics liens** (#20) — FCRA-clean construction sleeper
9. **Grid interconnection queues** (#17) — high WTP, fragmentation moat
10. **New business formation / SoS** (#14) — KYB expansion path

**Watchlist (revisit if a Tier drops):** building permits (general), bankruptcy (business-distress), insurance SERFF filings, healthcare facilities, GovCon teaming graph, municipal CIP.

---

## Cross-analyst patterns worth noting
- **Triangulation ▲:** building permits (4 independent reads, 43–50) and new-business formation (4 reads, 43–50) and contractor licenses both scored consistently high → high confidence they're real opportunities, but the *general* versions are the most contested. The edge is in a **vertical or trigger slice** (solar permits, liquor-license triggers, contractor-intel), not the generic dataset.
- **The recurring theme across all 8 clusters:** the winning shape is a **transaction-signaling, FCRA-safe, B2B-entity event feed** sold as a sales-trigger/risk API — not a static reference dataset.
- **Free incumbents are the #1 competition killer** (USAspending, ImportYeti, NPPES, EDGAR, ECHO, NCES, MSHA): they cap pricing on Archetype-N niches and push the moat entirely onto normalization/signal/UX.

## Sources
Per-niche URLs are preserved in the 8 Phase-2 agent transcripts. High-signal anchors: census.gov/econ/bfs (523,971 business apps/mo), fmcsa.dot.gov/registration/fmcsa-data-dissemination-program, shovels.ai + commercialobserver.com/2025/06/shovels-proptech-permits, govspend.com + fed-spend.com, goodjobsfirst.org (subsidy tracker), emp.lbl.gov/queues (interconnection), epiqglobal.com (bankruptcy), middesk.com/ucc-api, ttb.gov/public-information/foia/list-of-permittees, ftc.gov (Spokeo/InfoTrack/TransUnion eviction enforcement), venable.com (DPPA litigation 2026).
