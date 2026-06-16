# New Venue Data Data Pipeline

Ingests **live Florida public-records license data** — the real product behind the New Venue Data site (which currently ships with mock data). Zero npm dependencies; runs on plain Node ≥18.

> **Status:** the fetch → parse → normalize → geocode chain is **proven against live data** (52,061 retail liquor licensees + 6,243 new food-service establishments pulled and normalized; 19/20 sample addresses geocoded via the US Census API). Sunbiz enrichment and continuous scheduling are built and documented but run on your infrastructure.

## What it does

```
DBPR bulk CSV (liquor + food)  ─┐
                                ├─►  parse ─► normalize (LicenseRecord) ─► detect new filings ─► geocode ─► enrich (Sunbiz) ─► your DB / API / exports
US Census batch geocoder       ─┤
Sunbiz SFTP (entities)         ─┘
```

See **[SOURCES.md](./SOURCES.md)** for every source, exact URLs, field layouts, update cadence, and the GREEN/YELLOW/RED compliance posture.

## Quick start

```bash
cd data-pipeline
node src/run.mjs                     # default: newfood.csv + a small liquor file → data/out/*.json
node src/run.mjs --source=abt_retail # full 52k retail liquor file
node src/run.mjs --all               # every configured source (heavy)
node src/run.mjs --fetch-only        # download + row counts only
node src/geocode.mjs data/out/normalized-food_new.json 50   # geocode a normalized file
```

Output lands in `data/out/normalized-*.json` (the app's `LicenseRecord` shape, plus `_`-prefixed traceability fields).

## Layout

| File | Role |
|---|---|
| `src/config.mjs` | Source URLs, User-Agent, throttle, Census/Sunbiz config |
| `src/fetch.mjs` | Polite downloader (UA, retry/backoff, robots-respecting) |
| `src/csv.mjs` | Dependency-free RFC-4180 CSV parser |
| `src/lookups.mjs` | County codes (all 67, reverse-engineered), series/status/profession maps, date helpers |
| `src/normalize-abt.mjs` | AB&T row → `LicenseRecord` |
| `src/normalize-food.mjs` | H&R food row → `LicenseRecord` |
| `src/detect-new.mjs` | Snapshot diff → new_filing / renewal / status_change / cancellation events |
| `src/geocode.mjs` | US Census batch geocoder client |
| `src/enrich-sunbiz.mjs` | Sunbiz fixed-width parser + entity matcher |
| `src/run.mjs` | Orchestrator |

## Going to production (needs your infrastructure)

The pipeline is the ingestion brain; a live product also needs:
1. **A database** (Postgres) to hold snapshots, run the daily diff, and serve the API — schema already drafted in the app at `licensesignal/lib/db-schema.ts`.
2. **A scheduler** (cron / a worker) to run `run.mjs` daily, diff against yesterday, and emit events to webhooks/exports.
3. **Sunbiz SFTP pull + unzip** (large quarterly files) before `enrich-sunbiz.mjs` can join entities at scale.
4. **Wiring into the website** — point the app's API routes at `data/out` (or the DB) instead of `lib/mock-data.ts` to show real records.

## Compliance (summary — see SOURCES.md)

🟢 Downloading the official bulk files · 🟢 Reselling normalized data · 🟡 B2B outreach (CAN-SPAM/TCPA/DNC apply). DPPA N/A; FCRA generally N/A to business-entity data. Clear the **Sunbiz redistribution** question with counsel before reselling officer/personal-address fields, and ship an "as-is / not affiliated with DBPR" disclaimer. This pipeline already uses a descriptive User-Agent, throttles, respects `robots.txt`, and prefers official bulk downloads over scraping.
