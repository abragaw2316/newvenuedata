// Simplified, hand-tiled Florida county geometry for the data-density choropleth.
// Paths are intentionally approximate, blocky regions positioned within a
// 0 0 600 520 viewBox: the panhandle runs across the top-left, and the
// peninsula tapers down the right side toward the Keys.
//
// Slugs MUST match @/lib/fl-counties so each county links to a real
// /coverage/<slug> page. Filings mirror those realistic monthly counts.

export interface FlCountyGeo {
  name: string
  slug: string
  /** Simplified SVG path within a 0 0 600 520 viewBox. */
  path: string
  /** Realistic monthly filings count, used to drive the density color. */
  filings: number
}

export const FL_COUNTY_GEO: FlCountyGeo[] = [
  // ---- Panhandle (top-left band) ----
  {
    name: 'Escambia',
    slug: 'escambia',
    path: 'M40 70 L78 70 L80 118 L44 120 L40 70 Z',
    filings: 92,
  },
  {
    name: 'Leon',
    slug: 'leon',
    path: 'M210 78 L256 76 L260 120 L214 122 L210 78 Z',
    filings: 98,
  },
  // ---- North Florida (upper peninsula) ----
  {
    name: 'Alachua',
    slug: 'alachua',
    path: 'M300 132 L348 130 L352 178 L304 180 L300 132 Z',
    filings: 101,
  },
  {
    name: 'Marion',
    slug: 'marion',
    path: 'M306 184 L356 182 L360 232 L310 234 L306 184 Z',
    filings: 88,
  },
  {
    name: 'Duval',
    slug: 'duval',
    path: 'M404 116 L452 114 L456 158 L408 160 L404 116 Z',
    filings: 241,
  },
  {
    name: 'St. Johns',
    slug: 'st-johns',
    path: 'M412 164 L456 162 L460 206 L416 208 L412 164 Z',
    filings: 94,
  },
  // ---- Central Florida ----
  {
    name: 'Volusia',
    slug: 'volusia',
    path: 'M398 214 L450 212 L454 258 L402 260 L398 214 Z',
    filings: 121,
  },
  {
    name: 'Orange',
    slug: 'orange',
    path: 'M364 240 L412 238 L416 284 L368 286 L364 240 Z',
    filings: 301,
  },
  {
    name: 'Brevard',
    slug: 'brevard',
    path: 'M420 264 L468 262 L478 322 L430 324 L420 264 Z',
    filings: 134,
  },
  {
    name: 'Osceola',
    slug: 'osceola',
    path: 'M366 290 L416 288 L420 336 L370 338 L366 290 Z',
    filings: 97,
  },
  {
    name: 'Polk',
    slug: 'polk',
    path: 'M312 290 L362 288 L366 338 L316 340 L312 290 Z',
    filings: 142,
  },
  // ---- Tampa Bay (west-central) ----
  {
    name: 'Pasco',
    slug: 'pasco',
    path: 'M270 274 L312 272 L314 312 L272 314 L270 274 Z',
    filings: 109,
  },
  {
    name: 'Hillsborough',
    slug: 'hillsborough',
    path: 'M274 318 L316 316 L320 362 L278 364 L274 318 Z',
    filings: 287,
  },
  {
    name: 'Pinellas',
    slug: 'pinellas',
    path: 'M242 322 L268 320 L270 364 L244 366 L242 322 Z',
    filings: 229,
  },
  // ---- Southwest Gulf coast ----
  {
    name: 'Sarasota',
    slug: 'sarasota',
    path: 'M276 370 L320 368 L323 410 L279 412 L276 370 Z',
    filings: 127,
  },
  {
    name: 'Lee',
    slug: 'lee',
    path: 'M298 416 L342 414 L346 458 L302 460 L298 416 Z',
    filings: 168,
  },
  {
    name: 'Collier',
    slug: 'collier',
    path: 'M330 442 L382 440 L388 494 L336 496 L330 442 Z',
    filings: 119,
  },
  // ---- Southeast Atlantic (Gold Coast) ----
  {
    name: 'Palm Beach',
    slug: 'palm-beach',
    path: 'M438 344 L488 342 L492 392 L442 394 L438 344 Z',
    filings: 264,
  },
  {
    name: 'Broward',
    slug: 'broward',
    path: 'M444 398 L494 396 L498 440 L448 442 L444 398 Z',
    filings: 318,
  },
  {
    name: 'Miami-Dade',
    slug: 'miami-dade',
    path: 'M442 446 L498 444 L504 502 L446 504 L442 446 Z',
    filings: 412,
  },
]
