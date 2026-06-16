# Contact Enrichment — design (ready to build if validation calls for it)

**Status:** designed, not built. This is the plan to attach a reachable **phone /
email / website** to each lead. Build it **only if** TODO-C buyer validation surfaces
*"I'd pay, but I need contact info"* as the recurring blocker (see
`validation/buyer-validation-plan.md`). Until then, the trigger (who/where/when) is
what we're testing.

## Why
DBPR AB&T liquor records (the lead source) carry the venue's **address but no phone or
email**. An insurance agent can work an address (mail, drive-by, manual lookup), but a
phone/email turns each lead from "a name on a list" into a same-day call. Contact data
is also the wedge for the paid **Pro** tier — the pricing page already lists "Contact
enrichment" as a Pro feature.

## The key nuance (don't get this wrong)
A new **liquor** licensee is usually a **bar or restaurant**. Restaurant phone numbers
live in **DBPR Hotels & Restaurants** (`hrfood{1-7}.csv`), **not** FDACS. FDACS
(95% phone coverage) is **grocery/markets — explicitly not restaurants** (per
`SOURCES.md` §3). So:
- **Bar / restaurant liquor leads → enrich from H&R food-service + OSM.**
- **Grocery / package-store (retail-food) signals → enrich from FDACS** (already done
  for the `retail_food` signal; 95% have phone, native coords).

## Sources & expected coverage

| Source | Gives | Covers | Access | Compliance |
|---|---|---|---|---|
| **H&R `hrfood{1-7}.csv`** | **phone** (+ seats, status) | restaurants / food-service (the bulk of liquor venues) | direct CSV (already in `config.mjs` as `food_active_d{1-7}`) | 🟢 Ch. 119 public, no restriction |
| **FDACS** retail food | **phone + email + hours** | grocery / markets / package | open ArcGIS REST | 🟢 as-is, no attribution required |
| **OSM / Overpass** | **phone + website** | any venue by name+location; ~25–40% fill | open, rate-limited | 🟡 **ODbL share-alike** — must attribute + keep separable; cannot be fenced into the paid product |
| **Sunbiz** | officers, registered agent, **mailing address** | the owning entity (owner-level contact) | SFTP | 🟡 no explicit redistribution grant — **counsel review** before reselling officer/personal fields |
| **Building permits** (Orlando / Miami-Dade) | owner + **contractor phone** | venues mid-buildout (earliest signal) | open REST / Socrata | 🟢 public |
| **Paid API** (Geocodio/People-Data/Clearbit-style) | phone/email fallback | the misses | $ per record | commercial ToS; cost gate |

Realistic target after H&R + OSM: **~60–75% of restaurant/bar leads with a phone**;
higher for grocery via FDACS.

## How — entity resolution (the actual work)
The hard part isn't fetching, it's **matching** a liquor record to the same real venue
in another source. Plan:

1. **Build a match index** keyed on a normalized signature:
   `normalize(businessName/dbaName) + zip` and, as a second key, `street-number + zip`.
   Normalize = uppercase, strip punctuation/`LLC|INC|THE`, collapse whitespace.
2. **Match liquor → H&R food-service** on that signature (same address + similar name).
   Same-address is a strong key — a restaurant's liquor + food licenses share a location.
3. **Geo-proximity fallback:** geocode the liquor address (Census, already wired) and
   match OSM nodes within ~75 m whose name fuzzy-matches. OSM fills phone/website.
4. **Confidence tiers** on each enriched field: `exact` (name+address), `address_only`,
   `fuzzy_geo`. Expose only `exact`/`address_only` as "verified contact"; keep `fuzzy_geo`
   as a hint.
5. **Provenance:** stamp every contact field with `_contactSource` ('hr_food' | 'fdacs'
   | 'osm' | 'sunbiz' | 'permit' | 'paid') so OSM-derived fields stay **separable and
   attributed** (ODbL) and Sunbiz officer fields can be gated until counsel clears them.

## Implementation sketch
- New module `src/enrich-contacts.mjs`:
  - inputs: `normalized-abt_retail.json` + freshly-fetched `hrfood{1-7}.csv`
    (normalize via the existing food normalizer) + `normalized-fdacs.json` + an OSM pull.
  - builds the match index, attaches `enrichment.{phone,email,website}` +
    `enrichment._contactSource` + `enrichment._matchConfidence` to each record.
  - emits an enriched dataset the existing `build-app-data` / `build-full-data` /
    `build-lead-list` scripts read (they already pass `enrichment` through).
- Add `food_active_d{1-7}` to the fetch step (URLs already in `config.mjs`) and an
  `enrich-contacts` step to `orchestrate.mjs` (optional/tolerant, after fetch, before the
  build-* steps).
- `LicenseEnrichment` in `lib/types.ts` already has `phone`/`website` — add `email?` if
  we surface FDACS email.
- The lead-list generator gains `Phone` / `Email` columns automatically once
  `enrichment` is populated.

## Compliance guardrails (carry over from SOURCES.md)
- The **data** is FCRA-safe (business-entity, not consumer eligibility) and DPPA-N/A
  (not DMV data). Enrichment doesn't change that.
- **Outreach** is what's regulated: phone/SMS → **TCPA** + state Do-Not-Call; email →
  **CAN-SPAM**. We sell the *data*; the ToS must make the customer responsible for
  compliant outreach (and bar FCRA-purpose use).
- **OSM fields = ODbL**: attribute "© OpenStreetMap contributors", keep them a separable
  layer, never fence them inside the paid tier. Moat stays in the license records +
  matching + any paid-API contact field.
- **Sunbiz officer/personal fields**: hold until counsel confirms redistribution.

## Build order (cheapest, highest-value first)
1. **H&R food-service match** → restaurant/bar phones (free, public, biggest lift).
2. **OSM/Overpass** phone+website (free, attributed layer).
3. **Sunbiz** owner/agent + mailing address (counsel review).
4. **Paid API** only for the remaining misses (cost-gated).

See `validation/buyer-validation-plan.md` (the trigger) and `SOURCES.md` (source detail
+ compliance).
