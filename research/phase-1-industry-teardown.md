# Phase 1 — Industry Teardown: How Public-Data / DaaS Businesses Actually Work

> **Engagement:** Identify the highest-ROI U.S. Public Data API business for a solo, AI-assisted founder.
> **Phase 1 goal:** Learn the industry top-to-bottom before recommending any niche.
> **Date:** 2026-06-14 · **Method:** 5 parallel research analysts (industry structure, monetization, GTM, legal/moats, trends), web-sourced with citations.
> **Confidence convention:** [DOC] = grounded in a cited source · [INF] = analyst inference. Pricing is point-in-time (2026-06-14) and often "contact sales" — verify before quoting.

---

## 0. The One-Paragraph Model of This Industry

A public-data business **assembles a messy, fragmented dataset once, then licenses access to it many times at near-zero marginal cost.** The raw facts are usually free and legally copyable; the value — and the moat — is everything *around* the facts: painful acquisition from fragmented sources, cleaning, entity resolution (linking records to a persistent ID), freshness, and **compliant, developer-friendly distribution.** Margins are SaaS-like (70–85% gross) once the dataset is built, because acquisition cost is largely fixed but sits in COGS, so early margins look bad and improve sharply with scale. The killers are *staleness*, *commoditization* (anyone can scrape the same facts), and *regulatory traps* (FCRA above all).

---

## 1. The Data Value Chain (Acquire → Structure → Serve)

### Acquire — five channels, blended
| Channel | What it is | Examples |
|---|---|---|
| **Gov open-data portals & APIs** | Socrata/SODA powers thousands of state/local open-data sites; easy bulk/API pulls *where they exist* | Tyler Technologies (acquired Socrata), data.gov |
| **County/municipal records (the hard 80%)** | Most counties have **no API** — requires portal scraping, GIS dept calls/emails, even DVDs by mail | Regrid researched all ~3,234 U.S. counties to assemble 160M+ parcels; ATTOM aggregates assessor/recorder/permit offices into 158M+ properties |
| **FOIA / official registries** | Freely available public registries, unified across jurisdictions | OpenCorporates unified all 50 U.S. state company registries; GovWin/GovSpend sit atop FPDS federal procurement (35M+ txns) |
| **Web scraping & document processing** | Crawl public pages/store-locators; process billions of documents | SafeGraph (POI), Clearbit (250+ sources, ~30-day refresh), People Data Labs (3.1B profiles), HG Insights |
| **Contributory co-ops / licensing / partnerships** | The most defensible — data others can't get | CoreLogic blends "public, contributory and proprietary" into 4.5B+ records; ZoomInfo's contributory network; Enigma fuses registries + card-transaction signals |

**Key insight [INF]:** The "last-mile" jurisdictional coverage — not the tech stack — is the real moat. Competitors don't replicate a dataset because the *assembly labor* (calling 3,000 counties) is brutal.

### Structure — where the value is created
This is where most labor goes; data scientists reportedly spend ~90% of time "munging." Steps: dedupe → standardize → **entity resolution** to a persistent ID (ATTOM ID, PDLID). The clean, linked entity graph is the durable layer above commodity facts. Modern players (Shovels.ai) use AI to normalize 130M+ permits from 1,800+ jurisdictions and *derive* new metrics (e.g., contractor inspection pass-rates) — a template for AI-assisted value-add.

### Serve — how customers consume it
REST/GraphQL **APIs** (developer buyers), **bulk file** delivery (S3/SFTP), **cloud-warehouse shares** (Snowflake/Databricks/AWS), **dashboards/web apps** (business buyers), and **embeds/feeds**. Increasingly: **MCP servers** for AI-agent consumption (see §7).

---

## 2. Technical Architecture & Automation

Typical pipeline: `scrapers/connectors → ingestion/staging (object storage) → ETL/normalization → entity-resolution & enrichment → master dataset (warehouse/lakehouse) → API + bulk + app serving`.

- Automation is **high** on ingestion/serving, **partial** on acquisition (non-standard county sources still force manual outreach).
- **Solo-founder relevance [INF]:** AI now collapses much of the historically expensive parts — scraping, parsing PDFs to JSON, normalization, entity-matching, and generating SEO pages. This is precisely why a 1-person + AI team is newly viable in a space that used to need a data-ops team.

---

## 3. Unit Economics

- **Gross margins:** Comparable SaaS runs 70–85% (top >80%). Mature DaaS lands similarly — ZoomInfo's S-1 showed ~76% gross profit. [DOC]
- **COGS drivers:** data acquisition/licensing, cloud infra, and data-ops/QA labor. Acquisition cost is **fixed but sits in COGS**, so margins improve sharply as one dataset serves many buyers. [DOC]
- **Margin lifters:** public/contributory sourcing (cheap inputs), high reuse across buyers, automation.
- **Margin killers:** human-in-the-loop research (PitchBook model), expensive third-party licenses, per-jurisdiction acquisition labor, sales-heavy enterprise GTM.

---

## 4. Monetization & Pricing

**The toolkit (layered, not exclusive):** usage/credit metering · per-record/per-lookup · tiered subscriptions w/ caps + overage · per-seat · bulk data licensing · enterprise annual contracts ("contact sales") · freemium funnels.

**Rule of thumb:** the more the product is *a record you meter*, the more **self-serve/PLG**; the more it's *an answer/workflow for a revenue team*, the more **sales-led**.

### Reference price points [DOC unless noted]
| Provider | Category | Headline price | Model |
|---|---|---|---|
| Estated | Property | $449/mo (5k calls) → $2,999/mo (1M); $0.25 overage | Tiered + overage |
| Regrid | Parcels | $0.10/parcel; $200/county; nationwide = quote | Per-record + bulk |
| People Data Labs | People/B2B | $98/mo Pro (350 credits); ~$0.28/credit | Credit-based |
| OpenCorporates | Company registry | £2,250 / £6,600 / £12,000/yr; ~£0.20/call | Tiered annual |
| Construction Monitor | Permits | $96/mo (one metro) → $960/yr per jurisdiction | Geo subscription |
| Shovels.ai | Permits | Free 250 pings; **$599/mo** entry; enterprise custom | Freemium → subscription |
| ZoomInfo | Sales intel | Seats $3k–$8k/yr; median contract ~$31,875/yr [aggregator] | Seat + credits |
| GovWin (Deltek) | Gov BD | ~$29k/yr avg ($13k–$119k) [aggregator] | Seat + analyst |
| SafeGraph | POI/geo | From $0.05/record → ~$30k/yr subscriptions | Per-record + sub |
| BuildZoom | Contractor leads | **2.5% of won job value** (pay-on-success) | Success fee |

### ACV ladders [mostly INF from list prices]
- **SMB / self-serve dev:** ~$200–$7,000/yr
- **Mid-market:** ~$10,000–$50,000/yr
- **Enterprise:** ~$50,000–$250,000+/yr (seven figures for bulk redistribution licenses)

### Marketplace economics (distribution rev-share) [DOC]
- **AWS Data Exchange:** 3% of revenue (public listings <$1M TCV)
- **Databricks Marketplace:** 0% cut, no listing fee (monetizes compute pull-through)
- **RapidAPI:** ~20–25% commission + 2.9% + $0.30 processing — a real "tax," good for launch/discovery, bad as a forever-home
- **Snowflake:** a fee exists but the exact % is not public

---

## 5. Customer Acquisition & Growth (ranked by solo-founder fit)

| Channel | Solo + AI fit | Notes |
|---|---|---|
| **Programmatic / data-driven SEO** | ★★★ Top pick | Turn the dataset itself into thousands of long-tail-ranking pages that funnel to the API/subscription. AI-native. |
| **Self-serve PLG (free API key → paid)** | ★★★ Core motion | No sales org. Free tier = a sales rep: 70%+ of devs evaluate the free tier before recommending purchase; PQLs convert 15–30%. |
| **API marketplace listing (RapidAPI)** | ★★ Launch only | Instant distribution to 4M+ devs; mind the ~25% cut. |
| **Show HN / dev community / "data reports"** | ★★ High effort/reward | A strong technical launch can yield 5k–50k visitors in 48h; recycle the dataset as press-worthy analyses for backlinks. |
| **AWS Data Exchange** | ★ Maybe | Requires becoming a qualified seller — overhead for one person. |
| **Enterprise outbound / resellers** | ✗ Needs reps | Defer until revenue funds it. |

**Proof points:** GetLatka turned 3,000 interviews into a 30k-company database → 1.17M free Google clicks; Nomad List (solo) built ~1,000 data-rich city pages; ZenBusiness ran 50,000 `[Service]+[Location]` pages. **The solo playbook = programmatic SEO + self-serve free-key PLG, seeded by a Show HN launch + marketplace listing.**

**Caveat [INF, well-supported]:** thin/duplicate programmatic pages get hit by Google helpful-content updates — each page needs genuine per-entity value (fresh data, charts, scores), not just swapped variables. Time-to-traction is months, not weeks.

---

## 6. Legal & Compliance — The Make-or-Break Layer

**Collecting public data is mostly legal post-*hiQ* / *Van Buren*, but the use is landmined.**

1. **CFAA is not your enemy for *public* data.** *hiQ v. LinkedIn* (9th Cir., 2022): scraping publicly accessible data isn't "access without authorization." *Van Buren* (SCOTUS, 2021) narrowed CFAA further. [DOC]
2. **But contract/tort law still bite.** The hiQ saga *settled* (Dec 2022) with a $500k judgment + admission of breach of contract, trespass to chattels, misappropriation, and forced data deletion. **Logging in (accepting a ToS) or scraping behind auth converts "hacking" into "breach of contract," which plaintiffs win.** [DOC]
3. **Facts aren't copyrightable** (*Feist*, 1991) — you can copy facts freely, *but so can competitors*. No EU-style database right in the U.S. → commoditization risk. [DOC]
4. **⚠️ THE FCRA TRAP (most important).** The Fair Credit Reporting Act regulates **purpose, not source.** The moment your public-data product is used/marketed for **credit, employment, insurance, or tenant/housing** eligibility decisions, you may become a regulated **Consumer Reporting Agency** — even if every field is free public record. FTC enforcement is real: Spokeo ($800k), InfoTrack/Instant Checkmate ($1M+). **Avoid screening use-cases unless you intend to build FCRA compliance.** [DOC]
5. **Other regulated silos override "public":** GLBA (financial), DPPA (DMV/driver records — *not* public, permissible-purpose only), HIPAA (health), and an active FTC location-data front (Kochava, Mobilewalla, Gravy Analytics).
6. **State data-broker laws (overhead):** California Delete Act/DROP (register by Jan 31, 2026, ~$6,600/yr; honor deletions from Aug 1, 2026, $200/request/day penalties), plus Texas, Oregon, Vermont registries. **Selling data about *businesses* largely sidesteps consumer data-broker regimes [INF] — a strong argument for B2B-entity data over consumer/people data.**

---

## 7. Failure Modes, Moats & Where Incumbents Are Weak

**Why DaaS startups fail:** staleness/freshness decay (the quiet killer); commoditization → race to the bottom (Feist); coverage gaps / single-source dependency; high churn (feeds seen as swappable); legal shutdowns. Forrester flatly predicts many raw-data sellers will fail.

**What creates a durable moat (never the facts themselves):**
- Hard-to-replicate **acquisition** (fragmented county/court/permit ingestion — the assembly cost *is* the moat)
- **Coverage depth × update frequency** (compounding, expensive to match)
- **Entity resolution / linking** (proprietary graph above commodity facts)
- **Feedback loops** (customer corrections improve the graph)
- **Distribution & switching costs** (embedded in workflows)
- **Compliance infrastructure as a wall** (a cost rivals must also pay)

**Where incumbents are weak (disruption openings):** LexisNexis/Westlaw/Bloomberg/PACER are premium-priced, slow, and API-poor (LexisNexis only shipped a unified API in Dec 2024). **Pattern: anywhere data is public-but-painful, priced enterprise-only, or lacks a clean REST/MCP endpoint, there is an opening.**

---

## 8. Trends & Emerging Opportunities (2024–2026)

- **The LLM inversion:** models are commoditizing; value moves down-stack into **clean, verified, real-time, API-accessible data** that AI agents can consume deterministically. Gartner saw a 1,445% surge in multi-agent inquiries.
- **MCP is the new distribution channel:** 10,000+ public MCP servers by early 2026; OpenAI adopted MCP; per-call billing rails now exist (Coinbase x402: 165M txns / 69k active agents by Apr 2026). **A clean dataset wrapped in an MCP server with per-call billing is a viable product in weeks — the single most exploitable shift for a solo founder.**
- **Alt-data buyer base widening:** beyond hedge funds to **lenders, insurers, and GTM/revenue teams** (fastest-growing — intent/firmographic signals feeding AI SDR tools).
- **Government data whiplash = a wedge:** 2025 saw 8,000+ federal pages and ~3,000 datasets removed, Congress.gov API went dark; states scrambling to backfill. "Rescued/reliable" data access is a real need.
- **Vertical beats horizontal:** over 12 months horizontal SaaS fell ~35% while vertical SaaS was ~flat; vertical players show 30–50% higher retention.
- **Funding concentrates in AI-adjacent data:** Bright Data ~$300M ARR powering 100M+ daily agent interactions; Firecrawl ($15M A), Browserbase ($40M B). But *pure-play* DaaS funding dropped ~47% YoY — capital favors **agent-consumable, vertical** data, not generic "we have data."

### 12 emerging opportunity themes (solo, AI-assisted, <$5k) — *carried into Phase 2*
1. MCP-native data servers (per-call billing to agent builders)
2. **Public-records liberation** (normalize a fragmented county/court/permit domain into REST+MCP)
3. "Rescued" federal datasets (reliable, versioned access)
4. Verified-signal feeds for AI SDRs (narrow high-precision GTM triggers)
5. Niche alt-data for lenders/insurers (one underwriting-grade signal)
6. LLM ground-truth/eval datasets in a vertical
7. Real-time price/inventory/availability feeds (freshness moat)
8. API-shim over a legacy provider (modern wrapper on an ugly authoritative source)
9. Vertical "data + judgment" agent for one trade
10. Structured extraction-as-a-service for one document type
11. Compliance/regulatory change feeds (normalized diffs)
12. Agent-ready geospatial/property micro-data (zoning, flood, STR rules)

---

## 9. Phase 1 → Phase 2 Implications (the filters we'll score against)

From the industry teardown, the **highest-probability solo profile** is a niche that is:
1. **B2B-entity data, not consumer/people data** → sidesteps FCRA + state data-broker regimes.
2. **Public-but-painful source** (fragmented county/municipal/agency records) → built-in moat via assembly labor.
3. **Records that signal a near-term commercial transaction** (so buyers have high WTP and recurring need).
4. **Self-serve-friendly** (developer or SMB buyer; metered API + SEO funnel) → no sales org.
5. **High update frequency** (freshness as moat; recurring-revenue justification).
6. **AI-automatable acquisition** (scrape + PDF→JSON + entity-resolve).
7. **Expandable** into intelligence/lead-gen/predictive layers later.

These become the **weighted scoring criteria** in Phase 5. Phase 2 will evaluate 40+ niches against them.

---

## Consolidated Sources (selected)
- DaaS operations & value chain: safegraph.com/blog/data-as-a-service-bible..., regrid.com (parcel coverage), attomdata.com, sec.gov (ZoomInfo S-1 financials), blog.opencorporates.com (50-state unification), shovels.ai/api, deltek.com (GovWin), govtech.com (Tyler/Socrata)
- Pricing: estated/regrid/peopledatalabs/opencorporates/constructionmonitor/shovels pricing pages; vendr.com buyer guides (ZoomInfo, GovWin); docs.aws.amazon.com/data-exchange (3%); databricks.com/product/marketplace; docs.rapidapi.com
- GTM: founderpath.com/blog/programmatic-seo, seo.ai/blog/programmatic-seo-examples, withdaydream.com/library/zillow, techcrunch.com (RapidAPI), getmonetizely.com (free-tier conversion)
- Legal/moats: morganlewis.com & privacyworld.blog (hiQ), supremecourt.gov (Van Buren), supreme.justia.com/cases/federal/us/499/340 (Feist), ftc.gov (Spokeo, InfoTrack), datagrail.io (Delete Act/DROP), forrester.com (data commercialization failure), v7labs.com & acceldata.io (data moats)
- Trends: stanford AI Index, dualmedia.fr & medium MCP monetization, eco.com/x402, en.wikipedia.org/wiki/2025_United_States_government_online_resource_removals, scalevp.com (vertical AI), calcalistech.com (Bright Data), tracxn.com (DaaS funding)

*(Full per-claim URL lists preserved in the Phase 1 agent transcripts.)*
