// Central configuration for the New Venue Data prospecting engine.
//
// This engine finds the BUYERS of the New Venue Data feed (Florida liquor-liability
// insurance agents, the validated ICP) and drafts personalized outreach for HUMAN
// review + MANUAL send. It mirrors the conventions of ../data-pipeline (polite UA,
// throttle, public-data-only) and reuses the buyer-fit philosophy of
// research/phase-5-scoring.md. See COMPLIANCE.md + DELIVERABILITY.md.

// ── Politeness (be a good citizen on every external request) ──────────────────
export const USER_AGENT =
  'NewVenueDataProspectBot/0.1 (+https://newvenuedata.com; austin@newvenuedata.com) B2B research'
export const REQUEST_DELAY_MS = 1500
export const MAX_RETRIES = 3
export const FETCH_TIMEOUT_MS = 15000

// ── Beachhead geography (Phase-8 recommendation: South Florida first) ─────────
// bbox = [south, west, north, east] for OSM Overpass queries.
export const COUNTIES = [
  {
    name: 'Broward',
    bbox: [25.95, -80.36, 26.32, -80.06],
    cities: ['fort lauderdale', 'hollywood', 'pompano beach', 'coral springs', 'davie', 'plantation', 'sunrise', 'pembroke pines', 'miramar', 'deerfield beach', 'boca raton'],
    aliases: ['broward', 'ft lauderdale', 'fort lauderdale', 'ft laud'],
  },
  {
    name: 'Miami-Dade',
    bbox: [25.34, -80.52, 25.98, -80.07],
    cities: ['miami', 'miami beach', 'hialeah', 'coral gables', 'doral', 'homestead', 'kendall', 'aventura', 'north miami'],
    aliases: ['miami-dade', 'miami dade', 'dade', 'miami'],
  },
  {
    name: 'Palm Beach',
    bbox: [26.32, -80.32, 26.97, -80.03],
    cities: ['west palm beach', 'boca raton', 'delray beach', 'boynton beach', 'jupiter', 'palm beach gardens', 'wellington'],
    aliases: ['palm beach', 'wpb', 'west palm', 'boca', 'delray'],
  },
]

// ── ICP fit signals (drive enrichment + scoring) ──────────────────────────────
// Keywords that indicate an agency writes the liquor-liability / hospitality lines
// our feed serves. Matched (case-insensitive) against fetched website text.
export const LIQUOR_LIABILITY_SIGNALS = [
  'liquor liability', 'liquor-liability', 'dram shop', 'dram-shop',
  'bar insurance', 'tavern', 'nightclub', 'night club', 'restaurant insurance',
  'hospitality insurance', 'bar & restaurant', 'bars and restaurants',
  'liquor license', 'alcohol', 'pub', 'lounge', 'brewery', 'distillery', 'winery',
]
export const HOSPITALITY_SIGNALS = [
  'restaurant', 'hospitality', 'food service', 'foodservice', 'catering', 'caterer',
  'venue', 'event space', 'hotel', 'bar', 'club',
]
export const SPECIALIZATION_SIGNALS = [
  'commercial lines', 'commercial insurance', 'excess & surplus', 'excess and surplus',
  'surplus lines', 'e&s', 'general liability', 'business insurance', 'BOP',
  'program', 'mga', 'wholesale', 'binding authority',
]
// National captive brands → NOT our ideal independent-agency buyer.
export const CAPTIVE_BRANDS = [
  'state farm', 'allstate', 'geico', 'farmers', 'nationwide', 'progressive',
  'liberty mutual', 'american family', 'usaa',
]

// ── 0–100 buyer-fit scoring weights (adapted from research/phase-5-scoring.md) ──
export const SCORE_WEIGHTS = {
  writesLiquorLiability: 30, // strongest fit signal
  beachheadGeography: 20, // Broward / Miami-Dade / Palm Beach
  independentAgency: 15, // independent (not a national captive)
  reachable: 15, // public email or contact form + phone
  webPresence: 10, // live, credible site
  specialization: 10, // commercial / E&S / nightlife focus
}

// ── Local AI (Ollama). Free + private. Falls back to template mode if unreachable ──
export const OLLAMA = {
  url: process.env.OLLAMA_URL || 'http://localhost:11434',
  model: process.env.OLLAMA_MODEL || 'qwen2.5:7b', // fallback suggestion: 'llama3.2:3b'
  timeoutMs: 120000,
  temperature: 0.4,
}

// ── Our product facts (the ONLY facts the copywriter agent may assert) ─────────
// CAN-SPAM requires a real physical postal address in every commercial email.
// >>> Set NVD_POSTAL_ADDRESS before sending, or fill it into the drafts by hand. <<<
export const COMPANY = {
  name: 'New Venue Data',
  site: 'https://newvenuedata.com',
  fromName: 'Austin Bragaw',
  fromEmail: 'austin@newvenuedata.com',
  postalAddress: process.env.NVD_POSTAL_ADDRESS || '{YOUR BUSINESS POSTAL ADDRESS}',
  pricing: {
    founding: '$99/mo for life (first 10 agents)',
    county: '$149/mo (one county)',
    southFl: '$299/mo (Broward + Miami-Dade + Palm Beach)',
  },
  paymentLinks: {
    founding: 'https://buy.stripe.com/14A8wP7VgbTE2gogTtbfO00',
    county: 'https://buy.stripe.com/5kQ8wPb7sbTE5sA0UvbfO01',
    southFl: 'https://buy.stripe.com/14AfZh8Zk2j47AI46HbfO02',
  },
  oneLiner:
    'A weekly list of every brand-new bar/restaurant that just got licensed to serve alcohol in your counties — the venues that need liquor-liability coverage right now, sourced from Florida public records (DBPR).',
}

import { fileURLToPath } from 'node:url'
export const PATHS = {
  dbFile: fileURLToPath(new URL('../data/prospects.db', import.meta.url)),
  dataDir: fileURLToPath(new URL('../data/', import.meta.url)),
  seedCsv: fileURLToPath(new URL('../../validation/prospect-list.csv', import.meta.url)),
  exportJson: fileURLToPath(new URL('../data/prospects.json', import.meta.url)),
}
