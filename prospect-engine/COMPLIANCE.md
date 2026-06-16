# Compliance — Prospect Engine

This engine targets **businesses** (Florida insurance agencies), uses **public** business
data, and produces **drafts for human review + manual 1:1 send**. That posture keeps it on
the right side of the relevant rules. Specifics:

## What we do / don't collect
- ✅ Public business-entity data only: agency name, website, public office email, phone,
  business address, lines of business. No consumer data, no eligibility decisions → **outside FCRA**
  (consistent with the New Venue Data product itself).
- ✅ Only the prospect's **own public website** is fetched, and only when robots.txt allows it
  (see `src/enrich/fetch-website.mjs` → `rootBlocked`). One throttled pass, polite User-Agent.
- ❌ Never scrape behind logins. **No automated LinkedIn scraping** (their ToS forbids it) —
  use LinkedIn for manual reference only.
- ❌ No purchased lists.

## Source obligations
- **OpenStreetMap (Overpass)** — data is **ODbL**. Attribute "© OpenStreetMap contributors"
  wherever OSM-derived records are shown/shared, and keep them separable (records are stamped
  `source = 'osm:overpass'`; the JSON export includes the attribution line).
- **FL DFS (insurance licensee data)** — public; if you want a bulk export, file a free
  public-records request rather than scraping the search UI.
- **Directory imports** (`data/imports/*.csv`) — only import lists you're permitted to use
  (your own exports, association rosters you belong to, or manually collected public info).
- Respect each directory's robots.txt + ToS. Prefer official exports over scraping.

## Email (CAN-SPAM — US B2B cold email is legal with these)
- Accurate "From" / reply-to (you send from austin@newvenuedata.com). ✅
- Truthful subject lines (no deception). ✅ (drafts reviewed by a human)
- A valid **physical postal address** in every email. ⚠️ Set `NVD_POSTAL_ADDRESS` (or fill the
  `{YOUR BUSINESS POSTAL ADDRESS}` placeholder) before sending — the copywriter inserts it.
- A working **opt-out** + honor it promptly. The drafts include a reply-to-opt-out line; when
  someone opts out, log `unsubscribed` in the dashboard → they're added to the suppression list
  and excluded from all future drafting (`isSuppressed` in `src/db.mjs`).
- **TCPA / Do-Not-Call** apply to *phone/SMS*, not this email flow. If you call prospects,
  scrub against the National DNC and respect state rules. (Out of scope for the email MVP.)

## Data handling
- The SQLite DB holds business-contact data → it is **gitignored** (`data/`). Don't commit it.
- Suppression is permanent and checked before every drafting run.
