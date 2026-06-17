# Data Sources & Compliance — New Venue Data

Every source below is an **official public-records dataset published by the State of Florida** (Chapter 119, Florida public-records law) or a U.S. federal public-domain service. All were mapped by recon on 2026-06-15 and the core feeds were **fetched and parsed live** (see the run logs / `data/out/`).

---

## 1. Alcoholic Beverages & Tobacco (liquor licenses) — DBPR

**Base directory:** `https://www2.myfloridalicense.com/sto/file_download/extracts/`
**Format:** CSV, comma-delimited, every field double-quoted (ASCII). **Refresh:** page says "every morning"; official ReadMe says "weekly" — engineer for daily polling, tolerate stale.
**Index:** https://www2.myfloridalicense.com/alcoholic-beverages-and-tobacco/public-records/

| File | Contents | Verified |
|---|---|---|
| `bd4006lic.csv` | **Retail** (bars, restaurants, package stores) — core feed | ✅ 52,061 rows, 29 cols |
| `bd400lic.csv` | ALL AB&T categories combined | — |
| `bd4005lic.csv` | Distributors / Manufacturers | — |
| `bd4002lic.csv` | Temporary permits (small, good for validation) | ✅ 2,641 rows |
| `bd400revok.csv` | Revoked licenses | — |
| `daily.csv` | **Daily Activity change feed** (intended new/changed signal) | — |

**Live 29-column header (pin the parser to this, not the published layout doc which lists 26):**
`Board | Profession | Owner Name | Series | Modifier | Mail Address 1-3 | Mail City/State/ZIP/County | DBA | Location Address 1-3 | Location City/State/ZIP/County | License Number | Primary Status | Secondary Status | Original Licensure Date | Effective Date | Expiration Date | Tax Stamp Designation | Smoking Designation | Retail Tobacco Indicator`

- **Dates:** MM/DD/YYYY. **Status (numeric):** 20=Current, 42=Suspended, 61=Revoked, 99=Deleted.
- **County codes:** reverse-engineered as `alphabetical_rank + 10` (Alachua=11 … Dade=23 … Palm Beach=60); full table in `src/lookups.mjs`. Verified against real county volumes (Miami-Dade 6,565, Broward 4,337, …).
- **Series codes:** 1APS/2APS (package beer/wine), 3PS (quota package liquor), 1COP/2COP/4COP/6COP (consumption), SRX/4COP-SFS (special restaurant), ODP (temp). Full enumeration in `license_types.pdf` (parse during a hardening pass).
- **New-filing detection:** prefer `daily.csv`; otherwise diff consecutive snapshots on `License Number` (`src/detect-new.mjs`). `Original Licensure Date` flags recent issuance within a full snapshot.

## 2. Hotels & Restaurants (food service) — DBPR

Same base directory & format; **weekly** refresh.
**Index:** https://www2.myfloridalicense.com/hotels-restaurants/public-records/

| File | Contents | Verified |
|---|---|---|
| `newfood.csv` | **NEW food-service establishment licenses, current FY** — the restaurant-opening buy signal | ✅ 6,243 rows, 38 cols |
| `chgownr_food.csv` | Restaurant owner changes (re-opening signal) | — |
| `hrfood1.csv` … `hrfood7.csv` | Active food-service universe, by district | — |
| `1fdinspi.csv` … `7fdinspi.csv` | Inspection records (confirms a real opening) | — |

**Live `newfood.csv` header (key fields):** `Application Approval Date | License Type Code | Rank Code | Licensee Name | Mailing… | Business Name | Location Street Address | Location City/State Code/Zip Code/County | License Number | Primary Status Code | License Expiry Date | Last Inspection Date | Number of Seats`.

## 3. Retail food / grocery (the other half) — FDACS

**ArcGIS REST (paginated, 2,000 rows/page):** `https://gis.fdacs.gov/mapping/rest/services/DFS/DFS_FOOD_SAFETY_FACILITIES_PUBLIC_VIEW/MapServer` — Layer 0 = Retail, Layer 1 = Manufacturing. `?where=1=1&outFields=*&f=geojson&resultOffset=N`. Covers grocery/markets (NOT restaurants). Includes lat/long.

## 4. Entity enrichment — Sunbiz (FL Division of Corporations)

**SFTP:** `sftp.floridados.gov` · user `Public` · pass `PubAccess1845!` (published openly).
- **Quarterly full:** `doc/quarterly/cor/cordata*.zip` (10 files, split by doc-number last digit). **Daily deltas:** `doc/cor/yyyymmddc.txt`.
- **Format:** fixed-width ASCII, **1,440 chars/record** (positional parser in `src/enrich-sunbiz.mjs`).
- **Fields:** document number, name, status, filing type, principal & mailing address, file date, FEI/EIN, registered agent, **up to 6 officers**.

## 5. Geocoding — U.S. Census Bureau (federal, public domain)

**Batch:** `https://geocoding.geo.census.gov/geocoder/locations/addressbatch` — free, no key, **10,000 addresses/batch**, output is **public-domain (resellable)**. Input CSV: `id, street, city, state, zip` (no header). ✅ Verified live: 19/20 real FL restaurant addresses matched. Fallback: self-hosted Nominatim (ODbL attribution) or paid Geocodio for misses.

---

## Compliance posture (recon summary — not legal advice; confirm with FL counsel)

| Activity | Call | Basis |
|---|---|---|
| Download the official bulk files | 🟢 **GREEN** | Ch. 119 free public download; `robots.txt` allows `/sto/file_download/extracts/`; no use/resale restriction in the DBPR ReadMe |
| Resell normalized data | 🟢 **GREEN** | FL law doesn't condition access on purpose and places no restriction on downstream resale of these business-license records |
| B2B outreach use | 🟡 **YELLOW** | Permitted (business licensees, not DMV/consumer data → DPPA's anti-solicitation rule N/A), but outreach is governed by CAN-SPAM / TCPA / state Do-Not-Call |

**Confirmed:** DPPA does **not** apply (not motor-vehicle data). FCRA generally does **not** apply to business-entity records. Sunbiz download has **no explicit redistribution grant** (technical doc only) — the one item to clear with counsel before reselling officer/personal-address fields. OSM-derived fields (if used) carry ODbL share-alike.

**Guardrails baked into the pipeline:** descriptive User-Agent (`src/config.mjs`), throttled single daily pass, respect `robots.txt`, prefer official bulk downloads over scraping the search UI. **Ship your own** "as-is accuracy / not affiliated with or endorsed by DBPR or the State of Florida" disclaimer and a ToS barring FCRA-purpose uses (no credit / employment / tenant / insurance screening of individuals).

**Two operational flags:**
1. **Refresh conflict** — "daily" (page) vs "weekly" (ReadMe). Poll daily, tolerate unchanged files; trust date columns over the page claim.
2. **Schema drift** — live CSVs differ from the published layout docs (29 vs 26 AB&T cols; food header names). The parsers read by **header name** and tolerate drift; re-audit headers periodically.

---

# Expanded sources (acquired & integrated)

Beyond the core liquor + restaurant feeds, the pipeline now ingests a multi-signal Florida **business-opening graph**. Each below was verified by a live pull.

| Signal | Source | Module | Verified pull | Access | Geo | Contact |
|---|---|---|---|---|---|---|
| **Retail food / grocery** | FDACS ArcGIS REST `DFS_FOOD_SAFETY_FACILITIES_PUBLIC_VIEW` | `fetch-fdacs.mjs` + `normalize-fdacs.mjs` | **51,885** records (46,515 retail + 5,370 mfg); **95% have phone** | open REST, no key | native WGS84 | **phone + email + hours** |
| **Real-time new filings** | AB&T `daily.csv` change feed | `fetch-daily.mjs` | live daily activity (e.g. 13 txns on 2026-06-14, 5 new retail-liquor) | direct CSV | join to snapshot | — |
| **Confirmed openings** | H&R inspections `{1-7}fdinspi.csv`, type `Food-Licensing Inspection` | (mapped) | sample verified (Harvest Grille, Punta Gorda) | direct CSV | join | — |
| **Full food universe** | H&R `hrfood{1-7}.csv` (seats, status, district) | (mapped) | sample verified | direct CSV | — | phone |
| **New business registrations** | Sunbiz `doc/cor/yyyymmddc.txt` (SFTP) | `fetch-sunbiz.mjs` + `enrich-sunbiz.mjs` | **586** new businesses on 2026-06-14 | **SFTP** (`ssh2-sftp-client`; host `sftp.floridados.gov`, user `Public`, relative path `doc/cor`) | enrich | officers, agent, FEI |
| **Earliest signal — commercial permits** | City of Orlando Socrata `ryhf-m453` | `fetch-permits-orlando.mjs` | **40** commercial NEW-construction permits, **$496M** declared value | Socrata (via `curl` — Cloudflare 403s Node's fetch) | address | owner + contractor + phone |
| **Permits (coverage)** | Miami-Dade ArcGIS `miamidade_permit_data` | (mapped) | `where=ResidentialCommercial='C' AND ApplicationTypeDescription='NEW'` | open REST | — | owner/contractor |
| **Contact enrichment** | OpenStreetMap via Overpass API | (mapped) | downtown Miami sample, ~25–40% statewide phone+website fill | open, rate-limited | proximity join | **phone + website** |

## Source-specific notes
- **FDACS** has **no date field** → detect new establishments by snapshot-diff on `FOOD_ENTITY_NUM` (reuse `detect-new.mjs`) or incremental `OBJECTID>{lastMax}`. Coordinates are native (skip geocoding). ToS: Ch. 119, as-is, **no redistribution restriction, no required attribution**.
- **`daily.csv`** is a true change feed (one day's transactions, no header, 17 fields). Field 16 transaction description classifies the event; code `9505` ("Versa Online Active License Print") = a license going active. This **retires snapshot-diffing** for real-time new filings.
- **Sunbiz** is **SFTP-only** (Cloudflare blocks HTTPS to non-browsers; the web path is a JS file-manager SPA, not a static URL). Daily files are work-day only; fixed-width 1,440-char records; `File Date` [473,8] = formation date. ToS: as-is, **no explicit redistribution grant** — clear with counsel before reselling officer/personal-address fields.
- **Building permits** fire **weeks-to-months before** any license — the earliest signal. Prefer the *application* date (`processed_date` / `ApplicationDate`) over issue date. Orlando + Miami-Dade are the clean, keyless APIs; Tampa/Jacksonville/Orange County expose no usable permits API.
- **OSM/Overpass** ⚠️ **ODbL share-alike**: OSM-derived phone/website fields must stay separable + attributed ("© OpenStreetMap contributors", ODbL link) and **cannot be fenced off** in a resold product. Treat OSM contact fields as an open, attributed layer; keep the proprietary moat in the license records + matching + any paid contact API. Get reviewed by counsel. Rate-limit: <10k req/day, descriptive UA, tile by county, or self-host from the Geofabrik FL extract.

## Compliance roll-up for the new sources
🟢 FDACS, DBPR daily/inspections/hrfood, Sunbiz, building permits — all Florida/local **public records**, no redistribution restriction stated (Sunbiz = no explicit grant either; verify). 🟡 OSM contact data — free + redistributable **but ODbL share-alike + attribution** attaches. Building permits and registrations are business-entity/property records (not consumer data) → DPPA N/A, FCRA generally N/A; keep the same ToS guardrails.

---

# Planned expansion sources (researched 2026-06-15 — verify each portal's ToS before resale)

Powers the site's `/expansion/[state]` pages and the next pipeline builds. None of these portals grant an *explicit commercial-resale* right in their metadata — clear with counsel before reselling derived data.

### Texas — state #2 (strongest; mirrors the FL DBPR model) — ✅ AGGREGATES NOW LIVE-PULLED
- **TABC License Information** — Socrata dataset `7hf9-qc9f`, **updated daily**. API: `https://data.texas.gov/resource/7hf9-qc9f.json` (also `.csv`; supports `$where`/`$limit`/`$offset`, and `$select=...&$group=...` aggregation). Rich schema: trade name, owner, status, issue/expiration dates, address, county, phone, 28 license types. Portal: https://data.texas.gov/dataset/TABC-License-Information/7hf9-qc9f/data — the existing daily-extract → diff → signal pattern ports over with minimal rework.
  - **`src/fetch-tabc.mjs` (`npm run tabc`)** already pulls real statewide aggregates (count + by county + by type) via curl → `licensesignal/lib/texas-stats.ts` (verified **124,619 licenses**, 29 types; top counties Harris/Dallas/Bexar/Tarrant/Travis). Surfaced on `/expansion/texas`. Full per-record ingestion (→ LicenseRecord, geocode, into the API) is the remaining step, and needs the `LicenseRecord.address.state` type widened beyond `'FL'`.
- **TX Comptroller "Recent Sales Tax Permits"** — **weekly**, the new-business proxy (TX SOS bulk is fee-only). Includes NAICS + first-sales date → filter to food/bev: https://comptroller.texas.gov/transparency/open-data/recent-sales-tax-permits/ ; active base = Socrata `jrea-zgmq`.

### Georgia — state #3 (✅ INGESTED 2026-06-17)
- **GA Dept. of Revenue "Active Alcohol Licenses"** — direct **XLSX**, statewide, **quarterly** (slower cadence): https://dor.georgia.gov/active-alcohol-licenses
- **Now ingested:** `npm run ga` (`data-pipeline/fetch-ga.py` — Python+openpyxl, standalone, since the zero-dep Node pipeline can't parse XLSX) scrapes the latest quarter's download link, parses it, and emits real statewide aggregates → `licensesignal/lib/georgia-stats.ts` → the **`/expansion/georgia`** preview. Latest pull: **24,895 active licenses, 15 license types, 2,363 commenced in the last 12 months** (as of April 2026). Columns: Account Type, Commence Date, ID, Name, Address, Beer/Wine/Liquor flags, License Type. **No county field** (address is one free-text string) → GA aggregates by license type + recent commencements, not county.

### North Carolina — evaluating
- **NC ABC** permit search + Permit Counts (has a download): https://abc2.nc.gov/Search/Permit , https://abc2.nc.gov/Search/PermitCounts — no confirmed statewide bulk export; likely needs scraping or a public-records request to NC ABCC.

### Tennessee — deprioritize
- TN ABC is search-only (Accela/RLPS), **no open-data file or API** found; bulk only via open-records request. Lowest feasibility of the five.

### Deepen Florida (low integration cost — Socrata/ArcGIS already in the stack)
- **Miami-Dade building permits** (Socrata/ArcGIS): https://opendata.miamidade.gov/ — leading signal, FL's biggest metro.
- **City of Tampa permits**: https://opendata.tampa.gov/ (ArcGIS GeoHub).
- **Jacksonville (JaxEPICS)** — dashboard/report-level only, no clean open-data feed (weakest FL metro).
- **DBPR + FDACS food inspections** — new-opening confirmation signal.

**Ranked next adds:** (1) TX TABC `7hf9-qc9f` + (2) TX Comptroller permits → a complete, self-contained Texas launch; (3) Miami-Dade + Tampa permits → deepen FL while TX builds. Georgia is a viable quarterly state #3; NC needs scraping; TN deprioritize.
