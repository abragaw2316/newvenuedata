// Central configuration for the New Venue Data data pipeline.
// Every source here is an OFFICIAL public-records bulk download published by the
// State of Florida under Chapter 119 (public records law). See ../SOURCES.md for
// the full catalog, field layouts, update cadence, and compliance posture.

export const USER_AGENT =
  'NewVenueDataBot/0.1 (+https://newvenuedata.com; data@newvenuedata.com) public-records ingestion'

// Be a good citizen: the extracts refresh ~daily/weekly, so a single throttled
// pass is all that's needed. Never hammer the source.
export const REQUEST_DELAY_MS = 1500
export const MAX_RETRIES = 3

const ABT_BASE = 'https://www2.myfloridalicense.com/sto/file_download/extracts'

/**
 * @typedef {Object} Source
 * @property {string} key            stable id
 * @property {string} url            direct download URL
 * @property {'abt'|'food_new'|'food_active'} kind  which parser/normalizer to use
 * @property {string} description
 */

/** @type {Source[]} */
export const SOURCES = [
  // ── Alcoholic Beverages & Tobacco (liquor licenses) ─────────────────────────
  {
    key: 'abt_retail',
    url: `${ABT_BASE}/bd4006lic.csv`,
    kind: 'abt',
    description: 'AB&T Retail licenses — bars, restaurants, package stores (CORE liquor feed)',
  },
  {
    key: 'abt_all',
    url: `${ABT_BASE}/bd400lic.csv`,
    kind: 'abt',
    description: 'AB&T — ALL licensee categories in one file',
  },
  {
    key: 'abt_distributors',
    url: `${ABT_BASE}/bd4005lic.csv`,
    kind: 'abt',
    description: 'AB&T Distributors / Manufacturers',
  },
  {
    key: 'abt_temp_permits',
    url: `${ABT_BASE}/bd4002lic.csv`,
    kind: 'abt',
    description: 'AB&T Temporary permits (1–3 day) — small file, good for validation',
  },

  // ── Hotels & Restaurants (food-service licenses) ────────────────────────────
  {
    key: 'food_new',
    url: `${ABT_BASE}/newfood.csv`,
    kind: 'food_new',
    description: 'H&R NEW food-service establishment licenses, current FY (CORE restaurant-opening signal)',
  },
  {
    key: 'food_owner_changes',
    url: `${ABT_BASE}/chgownr_food.csv`,
    kind: 'food_new',
    description: 'H&R restaurant owner changes (re-opening / new-operator signal)',
  },
  // Active food-service universe is split across 7 districts: hrfood1.csv … hrfood7.csv
  ...Array.from({ length: 7 }, (_, i) => ({
    key: `food_active_d${i + 1}`,
    url: `${ABT_BASE}/hrfood${i + 1}.csv`,
    kind: 'food_active',
    description: `H&R active food-service licenses — district ${i + 1}`,
  })),
]

// US Census batch geocoder (free, no key, public-domain output, 10k addresses/batch).
export const CENSUS_GEOCODER = {
  batchUrl: 'https://geocoding.geo.census.gov/geocoder/locations/addressbatch',
  benchmark: 'Public_AR_Current',
  maxBatch: 10000,
}

// Sunbiz (FL Division of Corporations) bulk entity data for enrichment. SFTP.
export const SUNBIZ = {
  host: 'sftp.floridados.gov',
  user: 'Public',
  // Published openly on the Sunbiz Data Downloads page. Treated as a public credential.
  pass: 'PubAccess1845!',
  quarterlyPath: 'doc/quarterly/cor',
  dailyPath: 'doc/cor',
  recordLength: 1440,
}

export const PATHS = {
  raw: new URL('../data/raw/', import.meta.url),
  out: new URL('../data/out/', import.meta.url),
  snapshots: new URL('../data/snapshots/', import.meta.url),
}
