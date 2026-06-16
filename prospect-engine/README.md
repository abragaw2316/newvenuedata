# Prospect Engine — AI-assisted outbound for New Venue Data

Finds the **buyers** of the New Venue Data feed (Florida liquor-liability insurance agents),
scores fit 0–100, researches each, and drafts a personalized 3-step outreach sequence **for
your review + manual send**. Zero-dependency Node ESM (built-in `node:sqlite` + `fetch`), free
data sources, local AI. **Recurring cost: $0.**

> Sending is **manual and 1:1** by design — it protects newvenuedata.com's reputation. The
> engine never sends email. See `DELIVERABILITY.md` + `COMPLIANCE.md`.

## Quick start
```bash
# 1) Build the pipeline (discover → enrich → score → research → draft)
cd prospect-engine
node src/pipeline.mjs            # or: npm run pipeline   (drafts top 50)

# 2) Review + send from the internal dashboard (runs locally, never public)
cd ../licensesignal
npm run dev                      # open http://localhost:3000/prospects
```
In the dashboard: prospects are ranked by fit score; open one to read the research brief, edit
the draft, **Copy** it, send it by hand from austin@newvenuedata.com, then **Mark sent** and log
the outcome (reply / trial / etc.).

## Commands
| Command | What it does |
|---|---|
| `npm run pipeline [N]` | Full run; draft top N (default 50) |
| `npm run seed` | Import the 26 curated prospects (`validation/prospect-list.csv`) |
| `npm run discover` | Seed + OSM Overpass + directory imports |
| `npm run enrich` | Fetch agency sites → email/phone/contact + liquor-liability signal |
| `npm run score` | Recompute 0–100 buyer-fit scores |
| `npm run agents [N]` | Research + draft the top N scored prospects |
| `npm run export` | Write `data/prospects.json` snapshot |
| `npm run review` | Weekly outcome review (replies/trials/wins; tune signals) |

## Before you send (2 things)
1. **CAN-SPAM postal address** — set a real business address so it's inserted into drafts:
   `export NVD_POSTAL_ADDRESS="123 Main St, Fort Lauderdale, FL 33301"` (or edit the draft).
2. **(Optional) Better drafts via local AI** — install [Ollama](https://ollama.com), then
   `ollama pull qwen2.5:7b` (or `llama3.2:3b` on lighter hardware). The engine auto-detects it;
   without it, drafts use the high-quality template fallback.

## Add more prospects (compliant)
Drop any CSV you gather (FAIA members, chamber rosters, your exports) into
`prospect-engine/data/imports/*.csv` — headers like `company, website, email, phone, city,
county` are auto-mapped. Re-run `npm run discover`. (Don't scrape behind logins; see COMPLIANCE.md.)

## Data sources (all free / public)
Seed list · OpenStreetMap Overpass (`office=insurance`, ODbL — attributed) · your directory
imports · agency public websites. No paid APIs. No purchased lists.
